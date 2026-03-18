import { prisma } from '@/lib/prisma'
import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'
import { toTitleCase, formatPhone } from '@/lib/utils/formatters'

const roleRedirects: Record<Role, string> = {
    SUPER_ADMIN: '/admin',
    SCHOOL_ADMIN: '/admin',
    TEACHER: '/teacher',
    STUDENT: '/student',
    PARENT: '/parent',
    INDIVIDUAL_LEARNER: '/individual-student',
}

export async function POST(req: Request) {
    const { token, password, fullName, phone } = await req.json()

    // 1. Validate token
    const invite = await prisma.invitation.findUnique({ where: { token } })

    if (!invite) {
        return NextResponse.json(
            { error: 'Invalid invite link.' },
            { status: 400 }
        )
    }
    if (invite.acceptedAt) {
        return NextResponse.json(
            { error: 'This invite has already been accepted.' },
            { status: 400 }
        )
    }
    if (invite.expiresAt < new Date()) {
        return NextResponse.json(
            { error: 'This invite link has expired. Please request a new one.' },
            { status: 400 }
        )
    }

    // 2. Find the placeholder user created by inviteUserByEmail
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 1000,
    })

    if (listError) {
        console.error('Failed to list users:', listError.message)
        return NextResponse.json(
            { error: 'Failed to verify invite. Please try again.' },
            { status: 500 }
        )
    }

    const placeholder = users.find(u => u.email === invite.email)

    if (!placeholder) {
        return NextResponse.json(
            { error: 'Invite session not found. Please request a new invite.' },
            { status: 400 }
        )
    }

    // 3. Update placeholder user in place — avoids delete/recreate race condition
    //    Sets password, confirms email, and updates metadata in one operation
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        placeholder.id,
        {
            password,
            email_confirm: true,
            user_metadata: {
                role: invite.role,
                schoolId: invite.schoolId,
                name: toTitleCase(fullName),
            },
        }
    )

    if (authError) {
        console.error('Supabase updateUser error:', authError)
        return NextResponse.json(
            { error: `Failed to activate account: ${authError.message}` },
            { status: 400 }
        )
    }

    // 4. Create or update profile in DB — roll back auth update if this fails
    let profileId: string
    try {
        const existingProfile = await prisma.profile.findUnique({
            where: { email: invite.email },
        })

        const baseData = {
            email: invite.email,
            name: fullName ? toTitleCase(fullName) : null,
            phone: phone ? formatPhone(phone) : null,
            role: invite.role,
            schoolId: invite.schoolId,
            curriculumId: invite.curriculumId,
        }

        if (existingProfile) {
            const updated = await prisma.profile.update({
                where: { email: invite.email },
                data: baseData,
            })
            profileId = updated.id
        } else {
            const created = await prisma.profile.create({
                data: {
                    id: authData.user.id,
                    ...baseData,
                },
            })
            profileId = created.id
        }
    } catch (profileError) {
        console.error('Profile creation failed:', profileError)

        // Roll back — remove password and unconfirm the auth user
        await supabaseAdmin.auth.admin.updateUserById(placeholder.id, {
            email_confirm: false,
            user_metadata: {},
        }).catch(e => console.error('Rollback failed:', e))

        return NextResponse.json(
            { error: 'Failed to create user profile. Please try again.' },
            { status: 500 }
        )
    }

    // 5. Mark invite as accepted
    try {
        await prisma.invitation.update({
            where: { token },
            data: { acceptedAt: new Date() },
        })
    } catch (err) {
        // Non-critical — user is fully created, just log
        console.error('Failed to mark invite as accepted:', err)
    }

    // 6. Fire-and-forget notifications
    try {
        const redirectTo = roleRedirects[invite.role] ?? '/login'

        // 6a. Welcome notification for the new user
        await prisma.notification.create({
            data: {
                userId: profileId,
                message: `Welcome to EduAI! Your ${invite.role.toLowerCase().replace(/_/g, ' ')} account has been activated.`,
                link: redirectTo,
            },
        })

        // 6b. Notify school admins about the new user
        if (invite.schoolId) {
            const adminProfiles = await prisma.profile.findMany({
                where: {
                    schoolId: invite.schoolId,
                    role: { in: [Role.SUPER_ADMIN, Role.SCHOOL_ADMIN] },
                },
                select: { id: true },
            })

            if (adminProfiles.length > 0) {
                await prisma.notification.createMany({
                    data: adminProfiles.map((admin) => ({
                        userId: admin.id,
                        message: `New ${invite.role.toLowerCase().replace(/_/g, ' ')} joined: ${invite.email}.`,
                        link: '/admin/users',
                    })),
                })
            }
        }
    } catch (notifyErr) {
        console.error('Failed to create invite-accept notifications:', notifyErr)
    }

    return NextResponse.json({
        success: true,
        email: invite.email,
        redirectTo: roleRedirects[invite.role] ?? '/login',
    })
}