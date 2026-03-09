// 'use server'

// import { prisma } from '@/lib/prisma'
// import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
// import { createClient } from '@/lib/supabase/server'
// import { Role } from '@prisma/client'
// import { randomBytes } from 'crypto'
// import { getErrorMessage } from '@/lib/error-handler'

// interface SendInviteParams {
//     email: string
//     role: Role
//     schoolId?: string
// }

// interface ActionResult {
//     success: boolean
//     error?: string
// }

// // ── Send Invite ────────────────────────────────────────────────────────────────
// export async function sendInviteAction({
//     email, role, schoolId
// }: SendInviteParams): Promise<ActionResult> {
//     try {
//         // 1. Auth check
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         // 2. Validate inputs
//         if (!email?.trim()) return { success: false, error: 'Email is required.' }
//         if (!role)          return { success: false, error: 'Role is required.' }
//         if (!schoolId)      return { success: false, error: 'School not loaded yet. Please try again.' }

//         // 3. Get curriculumId from school
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true },
//         })
//         if (!school) return { success: false, error: `School not found for id: ${schoolId}` }
//         if (!school.curriculumId) return { success: false, error: 'School has no curriculum assigned.' }

//         // 4. Check if already has active account
//         const { data: { users }, error: listError } =
//             await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
//         if (listError) {
//             console.error('listUsers error:', listError)
//             return { success: false, error: 'Failed to check existing users.' }
//         }

//         const existingAuthUser = users.find(u => u.email === email.trim())
//         if (existingAuthUser?.last_sign_in_at) {
//             return { success: false, error: 'A user with this email already has an active account.' }
//         }

//         // 5. Delete any previous pending invites for this email
//         const deleted = await prisma.invitation.deleteMany({
//             where: { email: email.trim(), acceptedAt: null },
//         })
//         console.log(`Deleted ${deleted.count} previous pending invite(s) for ${email}`)

//         // 6. Create invitation row
//         const token    = randomBytes(32).toString('hex')
//         const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48) // 48 hours

//         const invitation = await prisma.invitation.create({
//             data: {
//                 email:        email.trim(),
//                 role,
//                 schoolId,
//                 curriculumId: school.curriculumId,
//                 token,
//                 expiresAt,
//                 invitedBy:    user.id,
//             },
//         })
//         console.log('Invitation created:', invitation.id)

//         // 7. Send invite email via Supabase
//         const { error: inviteError } =
//             await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
//                 redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
//                 data: { custom_token: token, role, schoolId },
//             })

//         if (inviteError) {
//             console.error('inviteUserByEmail error:', inviteError)
//             // Rollback invitation row
//             await prisma.invitation.delete({ where: { id: invitation.id } })
//                 .catch(e => console.error('Rollback failed:', e))
//             return { success: false, error: inviteError.message }
//         }

//         return { success: true }

//     } catch (err: unknown) {
//         console.error('sendInviteAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Resend Invite ──────────────────────────────────────────────────────────────
// export async function resendInviteAction(email: string): Promise<ActionResult> {
//     try {
//         // 1. Auth check
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         if (!email?.trim()) return { success: false, error: 'Email is required.' }

//         // 2. Find existing pending invite
//         const existing = await prisma.invitation.findFirst({
//             where: { email: email.trim(), acceptedAt: null },
//             orderBy: { createdAt: 'desc' },
//         })
//         if (!existing) {
//             return { success: false, error: 'No pending invite found for this email.' }
//         }

//         // 3. Delete old unconfirmed Supabase auth user
//         const { data: { users }, error: listError } =
//             await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
//         if (listError) {
//             console.error('listUsers error:', listError)
//             return { success: false, error: 'Failed to check existing users.' }
//         }

//         const existingAuthUser = users.find(u => u.email === email.trim())
//         if (existingAuthUser) {
//             if (existingAuthUser.last_sign_in_at) {
//                 return { success: false, error: 'This user has already accepted their invite.' }
//             }
//             const { error: deleteError } =
//                 await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
//             if (deleteError) {
//                 console.error('Failed to delete old auth user:', deleteError)
//                 return { success: false, error: 'Failed to reset invite. Please try again.' }
//             }
//         }

//         // 4. Refresh token and expiry
//         const token     = randomBytes(32).toString('hex')
//         const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

//         await prisma.invitation.update({
//             where: { id: existing.id },
//             data: { token, expiresAt },
//         })
//         console.log('Invitation refreshed:', existing.id)

//         // 5. Resend via Supabase
//         const { error: inviteError } =
//             await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
//                 redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite`,
//                 data: {
//                     custom_token: token,
//                     role:         existing.role,
//                     schoolId:     existing.schoolId,
//                 },
//             })

//         if (inviteError) {
//             console.error('inviteUserByEmail error:', inviteError)
//             return { success: false, error: inviteError.message }
//         }

//         return { success: true }

//     } catch (err: unknown) {
//         console.error('resendInviteAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Cancel Invite ──────────────────────────────────────────────────────────────
// export async function cancelInviteAction(email: string): Promise<ActionResult> {
//     try {
//         // 1. Auth check
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         if (!email?.trim()) return { success: false, error: 'Email is required.' }

//         // 2. Delete invitation rows
//         const deleted = await prisma.invitation.deleteMany({
//             where: { email: email.trim(), acceptedAt: null },
//         })
//         console.log(`Cancelled ${deleted.count} invite(s) for ${email}`)

//         // 3. Delete unconfirmed Supabase auth user
//         const { data: { users }, error: listError } =
//             await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })

//         if (!listError) {
//             const existingAuthUser = users.find(u => u.email === email.trim())
//             if (existingAuthUser && !existingAuthUser.last_sign_in_at) {
//                 const { error: deleteError } =
//                     await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
//                 if (deleteError) {
//                     console.error('Failed to delete auth user on cancel:', deleteError)
//                 }
//             }
//         }

//         return { success: true }

//     } catch (err: unknown) {
//         console.error('cancelInviteAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
import { createClient } from '@/lib/supabase/server'
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

// ── Auth helper — safe for public/sessionless contexts ─────────────────────────
async function getAuthUser() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) return null
        return data.user
    } catch (err) {
        console.error('getAuthUser failed:', err)
        return null
    }
}

// ── Send Invite ────────────────────────────────────────────────────────────────
export async function sendInviteAction({
    email, role, schoolId
}: SendInviteParams): Promise<ActionResult> {
    try {
        // 1. Auth check
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        // 2. Validate inputs
        if (!email?.trim()) return { success: false, error: 'Email is required.' }
        if (!role)          return { success: false, error: 'Role is required.' }
        if (!schoolId)      return { success: false, error: 'School not loaded yet. Please try again.' }

        // 3. Get curriculumId from school
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: { curriculumId: true },
        })
        if (!school)              return { success: false, error: `School not found for id: ${schoolId}` }
        if (!school.curriculumId) return { success: false, error: 'School has no curriculum assigned.' }

        // 4. Check if already has active account
        const { data: { users }, error: listError } =
            await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
        if (listError) {
            console.error('listUsers error:', listError)
            return { success: false, error: 'Failed to check existing users.' }
        }

        const existingAuthUser = users.find(u => u.email === email.trim())
        if (existingAuthUser?.last_sign_in_at) {
            return { success: false, error: 'A user with this email already has an active account.' }
        }

        // 5. Delete any previous pending invites for this email
        const deleted = await prisma.invitation.deleteMany({
            where: { email: email.trim(), acceptedAt: null },
        })
        console.log(`Deleted ${deleted.count} previous pending invite(s) for ${email}`)

        // 6. Create invitation row
        const token     = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48) // 48 hours

        const invitation = await prisma.invitation.create({
            data: {
                email:        email.trim(),
                role,
                schoolId,
                curriculumId: school.curriculumId,
                token,
                expiresAt,
                invitedBy:    user.id,
            },
        })
        console.log('Invitation created:', invitation.id)

        // 7. Send invite email via Supabase
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!siteUrl) {
            await prisma.invitation.delete({ where: { id: invitation.id } })
                .catch(e => console.error('Rollback failed:', e))
            return { success: false, error: 'NEXT_PUBLIC_SITE_URL is not configured.' }
        }

        const inviteUrl = `${siteUrl}/accept-invite?token=${token}`

        const { error: inviteError } =
            await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
                redirectTo: inviteUrl,
                data: { custom_token: token, role, schoolId },
            })

        if (inviteError) {
            console.error('inviteUserByEmail error:', inviteError)
            await prisma.invitation.delete({ where: { id: invitation.id } })
                .catch(e => console.error('Rollback failed:', e))
            return { success: false, error: inviteError.message }
        }

        // 8. Fire-and-forget notification for inviter
        try {
            const inviterProfile = await prisma.profile.findUnique({
                where: { id: user.id },
                select: { id: true, school: { select: { name: true } } },
            })

            if (inviterProfile) {
                const roleLabel = role.toString().toLowerCase().replace(/_/g, ' ')
                const schoolLabel = inviterProfile.school?.name
                    ? ` at ${inviterProfile.school.name}`
                    : ''

                await prisma.notification.create({
                    data: {
                        userId: inviterProfile.id,
                        message: `Invitation sent to ${email.trim()} as ${roleLabel}${schoolLabel}.`,
                        link: '/admin/invite-users',
                    },
                })
            }
        } catch (notifyErr) {
            console.error('Failed to create inviter notification:', notifyErr)
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
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (!email?.trim()) return { success: false, error: 'Email is required.' }

        // 2. Find existing pending invite
        const existing = await prisma.invitation.findFirst({
            where: { email: email.trim(), acceptedAt: null },
            orderBy: { createdAt: 'desc' },
        })
        if (!existing) {
            return { success: false, error: 'No pending invite found for this email.' }
        }

        // 3. Delete old unconfirmed Supabase auth user
        const { data: { users }, error: listError } =
            await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
        if (listError) {
            console.error('listUsers error:', listError)
            return { success: false, error: 'Failed to check existing users.' }
        }

        const existingAuthUser = users.find(u => u.email === email.trim())
        if (existingAuthUser) {
            if (existingAuthUser.last_sign_in_at) {
                return { success: false, error: 'This user has already accepted their invite.' }
            }
            const { error: deleteError } =
                await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
            if (deleteError) {
                console.error('Failed to delete old auth user:', deleteError)
                return { success: false, error: 'Failed to reset invite. Please try again.' }
            }
        }

        // 4. Refresh token and expiry
        const token     = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

        await prisma.invitation.update({
            where: { id: existing.id },
            data: { token, expiresAt },
        })
        console.log('Invitation refreshed:', existing.id)

        // 5. Resend via Supabase
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        if (!siteUrl) return { success: false, error: 'NEXT_PUBLIC_SITE_URL is not configured.' }

        const inviteUrl = `${siteUrl}/accept-invite?token=${token}`

        const { error: inviteError } =
            await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
                redirectTo: inviteUrl,
                data: {
                    custom_token: token,
                    role:         existing.role,
                    schoolId:     existing.schoolId,
                },
            })

        if (inviteError) {
            console.error('inviteUserByEmail error:', inviteError)
            return { success: false, error: inviteError.message }
        }

        // 6. Fire-and-forget notification for inviter on resend
        try {
            const user = await getAuthUser()
            if (user) {
                const inviterProfile = await prisma.profile.findUnique({
                    where: { id: user.id },
                    select: { id: true, school: { select: { name: true } } },
                })

                if (inviterProfile) {
                    const roleLabel = existing.role.toString().toLowerCase().replace(/_/g, ' ')
                    const schoolLabel = inviterProfile.school?.name
                        ? ` at ${inviterProfile.school.name}`
                        : ''

                    await prisma.notification.create({
                        data: {
                            userId: inviterProfile.id,
                            message: `Invite link resent to ${email.trim()} as ${roleLabel}${schoolLabel}.`,
                            link: '/admin/invite-users',
                        },
                    })
                }
            }
        } catch (notifyErr) {
            console.error('Failed to create inviter notification (resend):', notifyErr)
        }

        return { success: true }

    } catch (err: unknown) {
        console.error('resendInviteAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Cancel Invite ──────────────────────────────────────────────────────────────
export async function cancelInviteAction(email: string): Promise<ActionResult> {
    try {
        // 1. Auth check
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (!email?.trim()) return { success: false, error: 'Email is required.' }

        // 2. Delete invitation rows
        const deleted = await prisma.invitation.deleteMany({
            where: { email: email.trim(), acceptedAt: null },
        })
        console.log(`Cancelled ${deleted.count} invite(s) for ${email}`)

        // 3. Delete unconfirmed Supabase auth user
        const { data: { users }, error: listError } =
            await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })

        if (!listError) {
            const existingAuthUser = users.find(u => u.email === email.trim())
            if (existingAuthUser && !existingAuthUser.last_sign_in_at) {
                const { error: deleteError } =
                    await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id)
                if (deleteError) {
                    console.error('Failed to delete auth user on cancel:', deleteError)
                }
            }
        }

        return { success: true }

    } catch (err: unknown) {
        console.error('cancelInviteAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}