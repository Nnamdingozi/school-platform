'use server'

import { prisma } from '@/lib/prisma'
import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
import { createClient } from '@/lib/supabase/client'
import { Role } from '@prisma/client'
import { randomBytes } from 'crypto'

interface SendInviteParams {
    email: string
    role: Role
    schoolId?: string
}

// ── Send Invite ───────────────────────────────────────────────────────────────c
export async function sendInviteAction({ email, role, schoolId }: SendInviteParams) {
    // 1. Auth check — only admins can invite
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 2. Get curriculumId from the admin's school
    //    (so it's automatic — admin doesn't need to provide it)
    const school = await prisma.school.findUnique({
        where: { id: schoolId },
        select: { curriculumId: true }
    })
    if (!school) throw new Error('School not found.')
    const curriculumId = school.curriculumId

    // 3. Check if user already has an active account
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const existingAuthUser = users.find(u => u.email === email)
    if (existingAuthUser?.last_sign_in_at) {
        throw new Error('A user with this email already has an active account.')
    }

    // 4. Delete any previous pending invite for this email (enables resend)
    await prisma.invitation.deleteMany({
        where: { email, acceptedAt: null }
    })

    // 5. Create our own token in DB
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48) // 48 hours

    await prisma.invitation.create({
        data: {
            email,
            role,
            schoolId,
            curriculumId,
            token,
            expiresAt,
            invitedBy: user.id,
        }
    })

    // 6. Supabase sends the email with our custom token embedded
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
        data: {
            custom_token: token,
            role,
            schoolId,
        }
    })

    if (error) {
        // Rollback invitation row if email sending failed
        await prisma.invitation.deleteMany({ where: { token } })
        throw new Error(error.message)
    }

    return { success: true }
}

// ── Resend Invite ──────────────────────────────────────────────────────────────
export async function resendInviteAction(email: string) {
    // 1. Auth check
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // 2. Find existing pending invite to preserve role/schoolId/curriculumId
    const existing = await prisma.invitation.findFirst({
        where: { email, acceptedAt: null },
        orderBy: { createdAt: 'desc' }
    })
    if (!existing) throw new Error('No pending invite found for this email.')

    // 3. Delete old unconfirmed Supabase auth user so inviteUserByEmail works again
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const existingAuthUser = users.find(u => u.email === email)

    if (existingAuthUser) {
        if (existingAuthUser.last_sign_in_at) {
            throw new Error('This user has already accepted their invite.')
        }
        await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
    }

    // 4. Refresh token and expiry on the existing invitation row
    const token = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

    await prisma.invitation.update({
        where: { id: existing.id },
        data: { token, expiresAt }
    })

    // 5. Resend via Supabase
    const { error } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
        data: {
            custom_token: token,
            role: existing.role,
            schoolId: existing.schoolId,
        }
    })

    if (error) throw new Error(error.message)
    return { success: true }
}

// ── Cancel Invite ──────────────────────────────────────────────────────────────
export async function cancelInviteAction(email: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    // Delete pending invite from DB
    await prisma.invitation.deleteMany({
        where: { email, acceptedAt: null }
    })

    // Delete unconfirmed Supabase auth user if exists
    const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
    const existingAuthUser = users.find(u => u.email === email)
    if (existingAuthUser && !existingAuthUser.last_sign_in_at) {
        await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
    }

    return { success: true }
}