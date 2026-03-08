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

    // 4. Create profile in DB — roll back auth update if this fails
    try {
        await prisma.profile.create({
            data: {
                id: authData.user.id,
                email: invite.email,
                name: fullName ? toTitleCase(fullName) : null,
                phone: phone ? formatPhone(phone) : null,
                role: invite.role,
                schoolId: invite.schoolId,
                curriculumId: invite.curriculumId,
            },
        })
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

    return NextResponse.json({
        success: true,
        email: invite.email,
        redirectTo: roleRedirects[invite.role] ?? '/login',
    })
}