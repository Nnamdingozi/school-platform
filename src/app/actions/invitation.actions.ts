'use server'

import { prisma } from '@/lib/prisma'
import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
import { createClient } from '@/lib/supabase/server' // ← was 'client', must be 'server'
import { Role } from '@prisma/client'
import { randomBytes } from 'crypto'
import { getErrorMessage } from '@/lib/error-handler'

interface SendInviteParams {
    email: string
    role: Role
    schoolId?: string
}

interface ActionResult {
    success: boolean
    error?: string
}

// ── Send Invite ────────────────────────────────────────────────────────────────
export async function sendInviteAction({
    email, role, schoolId
}: SendInviteParams): Promise<ActionResult> {
    try {
        // 1. Auth check
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return { success: false, error: 'Unauthorized.' }

        // 2. Validate inputs
        if (!email || !role || !schoolId) {
            return { success: false, error: 'Email, role and schoolId are required.' }
        }

        // 3. Get curriculumId from school
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: { curriculumId: true }
        })
        if (!school) return { success: false, error: 'School not found.' }

        // 4. Check if already has active account
        const { data: { users }, error: listError } =
            await supabaseAdmin.auth.admin.listUsers()
        if (listError) return { success: false, error: 'Failed to check existing users.' }

        const existingAuthUser = users.find(u => u.email === email)
        if (existingAuthUser?.last_sign_in_at) {
            return { success: false, error: 'A user with this email already has an active account.' }
        }

        // 5. Delete any previous pending invite
        await prisma.invitation.deleteMany({
            where: { email, acceptedAt: null }
        })

        // 6. Create invitation row with our own token
        const token = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

        await prisma.invitation.create({
            data: {
                email,
                role,
                schoolId,
                curriculumId: school.curriculumId,
                token,
                expiresAt,
                invitedBy: user.id,
            }
        })

        // 7. Supabase sends email with our token embedded
        const { error: inviteError } =
            await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
                data: { custom_token: token, role, schoolId },
            })

        if (inviteError) {
            // Rollback invitation row
            await prisma.invitation.deleteMany({ where: { token } })
            return { success: false, error: inviteError.message }
        }

        return { success: true }

    } catch (err: unknown) {
        console.error('sendInviteAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Resend Invite ──────────────────────────────────────────────────────────────
export async function resendInviteAction(email: string): Promise<ActionResult> {
    try {
        // 1. Auth check
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return { success: false, error: 'Unauthorized.' }

        // 2. Find existing pending invite
        const existing = await prisma.invitation.findFirst({
            where: { email, acceptedAt: null },
            orderBy: { createdAt: 'desc' }
        })
        if (!existing) return { success: false, error: 'No pending invite found for this email.' }

        // 3. Delete old unconfirmed Supabase auth user
        const { data: { users }, error: listError } =
            await supabaseAdmin.auth.admin.listUsers()
        if (listError) return { success: false, error: 'Failed to check existing users.' }

        const existingAuthUser = users.find(u => u.email === email)
        if (existingAuthUser) {
            if (existingAuthUser.last_sign_in_at) {
                return { success: false, error: 'This user has already accepted their invite.' }
            }
            await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
        }

        // 4. Refresh token and expiry
        const token = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

        await prisma.invitation.update({
            where: { id: existing.id },
            data: { token, expiresAt }
        })

        // 5. Resend via Supabase
        const { error: inviteError } =
            await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
                redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
                data: {
                    custom_token: token,
                    role: existing.role,
                    schoolId: existing.schoolId,
                },
            })

        if (inviteError) return { success: false, error: inviteError.message }
        return { success: true }

    } catch (err: unknown) {
        console.error('resendInviteAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Cancel Invite ──────────────────────────────────────────────────────────────
export async function cancelInviteAction(email: string): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return { success: false, error: 'Unauthorized.' }

        await prisma.invitation.deleteMany({
            where: { email, acceptedAt: null }
        })

        const { data: { users } } = await supabaseAdmin.auth.admin.listUsers()
        const existingAuthUser = users.find(u => u.email === email)
        if (existingAuthUser && !existingAuthUser.last_sign_in_at) {
            await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
        }

        return { success: true }

    } catch (err: unknown) {
        console.error('cancelInviteAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}