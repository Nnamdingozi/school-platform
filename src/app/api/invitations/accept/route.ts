/// app/api/invitations/accept/route.ts
import { prisma } from '@/lib/prisma'
import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
import { NextResponse } from 'next/server'
import { Role } from '@prisma/client'

const roleRedirects: Record<Role, string> = {
    SUPER_ADMIN: '/admin',
    SCHOOL_ADMIN: '/admin',
    TEACHER: '/teacher',
    STUDENT: '/students',
    PARENT: '/parents',
    INDIVIDUAL_LEARNER: '/individual-student',
}

export async function POST(req: Request) {
    const { token, password, fullName, phone } = await req.json()

    // 1. Validate token
    const invite = await prisma.invitation.findUnique({ where: { token } })

    if (!invite) {
        return NextResponse.json({ error: 'Invalid invite link.' }, { status: 400 })
    }
    if (invite.acceptedAt) {
        return NextResponse.json({ error: 'Invite already accepted.' }, { status: 400 })
    }
    if (invite.expiresAt < new Date()) {
        return NextResponse.json({ error: 'Invite link has expired.' }, { status: 400 })
    }


    // 2. Delete the placeholder Supabase auth user created by inviteUserByEmail
    //    so we can create a fresh one with the password
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const placeholder = users.find(u => u.email === invite.email)
    if (placeholder) {
        await supabaseAdmin.auth.admin.deleteUser(placeholder.id)
    }

    // 3. Create real Supabase auth user with password
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: invite.email,
        password,
        email_confirm: true,
        user_metadata: {
            role: invite.role,
            schoolId: invite.schoolId,
            name: fullName,
        }
    })

    if (authError) {
        return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // 4. Create profile in DB
    await prisma.profile.create({
        data: {
            id: authData.user.id,
            email: invite.email,
            name: fullName,
            phone,
            role: invite.role,
            schoolId: invite.schoolId,
            curriculumId: invite.curriculumId, // ← required field
        }
    })

    // 5. Mark invite as accepted
    await prisma.invitation.update({
        where: { token },
        data: { acceptedAt: new Date() }
    })

    return NextResponse.json({
        success: true,
        email: invite.email,
        redirectTo: roleRedirects[invite.role] ?? '/login',
    })
}