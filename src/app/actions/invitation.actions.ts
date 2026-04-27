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

// // ── Auth helper — safe for public/sessionless contexts ─────────────────────────
// async function getAuthUser() {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return null
//         return data.user
//     } catch (err) {
//         console.error('getAuthUser failed:', err)
//         return null
//     }
// }

// // ── Send Invite ────────────────────────────────────────────────────────────────
// export async function sendInviteAction({
//     email, role, schoolId
// }: SendInviteParams): Promise<ActionResult> {
//     try {
//         // 1. Auth check
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         // 2. Validate inputs
//         if (!email?.trim()) return { success: false, error: 'Email is required.' }
//         if (!role)          return { success: false, error: 'Role is required.' }
//         if (!schoolId)      return { success: false, error: 'School not loaded yet. Please try again.' }

//         // 3. Get curriculumId from school
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true },
//         })
//         if (!school)              return { success: false, error: `School not found for id: ${schoolId}` }
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
//         const token     = randomBytes(32).toString('hex')
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
//         const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
//         if (!siteUrl) {
//             await prisma.invitation.delete({ where: { id: invitation.id } })
//                 .catch(e => console.error('Rollback failed:', e))
//             return { success: false, error: 'NEXT_PUBLIC_SITE_URL is not configured.' }
//         }

//         const inviteUrl = `${siteUrl}/accept-invite?token=${token}`

//         const { error: inviteError } =
//             await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
//                 redirectTo: inviteUrl,
//                 data: { custom_token: token, role, schoolId },
//             })

//         if (inviteError) {
//             console.error('inviteUserByEmail error:', inviteError)
//             await prisma.invitation.delete({ where: { id: invitation.id } })
//                 .catch(e => console.error('Rollback failed:', e))
//             return { success: false, error: inviteError.message }
//         }

//         // 8. Fire-and-forget notification for inviter
//         try {
//             const inviterProfile = await prisma.profile.findUnique({
//                 where: { email: user.email! },
//                 select: { id: true, school: { select: { name: true } } },
//             })

//             if (inviterProfile) {
//                 const roleLabel = role.toString().toLowerCase().replace(/_/g, ' ')
//                 const schoolLabel = inviterProfile.school?.name
//                     ? ` at ${inviterProfile.school.name}`
//                     : ''

//                 await prisma.notification.create({
//                     data: {
//                         userId: inviterProfile.id,
//                         message: `Invitation sent to ${email.trim()} as ${roleLabel}${schoolLabel}.`,
//                         link: '/admin/invite-users',
//                     },
//                 })
//             }
//         } catch (notifyErr) {
//             console.error('Failed to create inviter notification:', notifyErr)
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
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

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
//         const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
//         if (!siteUrl) return { success: false, error: 'NEXT_PUBLIC_SITE_URL is not configured.' }

//         const inviteUrl = `${siteUrl}/accept-invite?token=${token}`

//         const { error: inviteError } =
//             await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
//                 redirectTo: inviteUrl,
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

//         // 6. Fire-and-forget notification for inviter on resend
//         try {
//             const user = await getAuthUser()
//             if (user?.email) {
//                 const inviterProfile = await prisma.profile.findUnique({
//                     where: { email: user.email },
//                     select: { id: true, school: { select: { name: true } } },
//                 })

//                 if (inviterProfile) {
//                     const roleLabel = existing.role.toString().toLowerCase().replace(/_/g, ' ')
//                     const schoolLabel = inviterProfile.school?.name
//                         ? ` at ${inviterProfile.school.name}`
//                         : ''

//                     await prisma.notification.create({
//                         data: {
//                             userId: inviterProfile.id,
//                             message: `Invite link resent to ${email.trim()} as ${roleLabel}${schoolLabel}.`,
//                             link: '/admin/invite-users',
//                         },
//                     })
//                 }
//             }
//         } catch (notifyErr) {
//             console.error('Failed to create inviter notification (resend):', notifyErr)
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
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

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

// // ── Auth helper — safe for public/sessionless contexts ─────────────────────────
// async function getAuthUser() {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return null
//         return data.user
//     } catch (err) {
//         console.error('getAuthUser failed:', err)
//         return null
//     }
// }

// // ── Helper: delete stale unconfirmed placeholder user ─────────────────────────
// async function deleteStaleAuthUser(email: string): Promise<void> {
//     try {
//         const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
//             page: 1,
//             perPage: 1000,
//         })
//         if (error) {
//             console.error('listUsers error in deleteStaleAuthUser:', error)
//             return
//         }
//         const existing = users.find(u => u.email === email)
//         if (existing && !existing.last_sign_in_at) {
//             const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existing.id)
//             if (deleteError) {
//                 console.error('Failed to delete stale auth user:', deleteError)
//             } else {
//                 console.log('Deleted stale placeholder user for:', email)
//             }
//         }
//     } catch (err) {
//         console.error('deleteStaleAuthUser error:', err)
//     }
// }

// // ── Send Invite ────────────────────────────────────────────────────────────────
// export async function sendInviteAction({
//     email, role, schoolId
// }: SendInviteParams): Promise<ActionResult> {
//     try {
//         // 1. Auth check
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         // 2. Validate inputs
//         if (!email?.trim()) return { success: false, error: 'Email is required.' }
//         if (!role)          return { success: false, error: 'Role is required.' }
//         if (!schoolId)      return { success: false, error: 'School not loaded yet. Please try again.' }

//         const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
//         if (!siteUrl)       return { success: false, error: 'NEXT_PUBLIC_SITE_URL is not configured.' }

//         // 3. Get curriculumId from school
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true },
//         })
//         if (!school)              return { success: false, error: `School not found for id: ${schoolId}` }
//         if (!school.curriculumId) return { success: false, error: 'School has no curriculum assigned.' }

//         // 4. Check if already has active account
//         const { data: { users: authUsers }, error: listError } =
//             await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
//         if (listError) {
//             console.error('listUsers error:', listError)
//             return { success: false, error: 'Failed to check existing users.' }
//         }

//         const existingAuthUser = authUsers.find(u => u.email === email.trim())
//         if (existingAuthUser?.last_sign_in_at) {
//             return { success: false, error: 'A user with this email already has an active account.' }
//         }

//         // 5. Delete stale unconfirmed placeholder BEFORE creating invite row
//         //    Prevents Supabase rejecting inviteUserByEmail with "already registered"
//         if (existingAuthUser && !existingAuthUser.last_sign_in_at) {
//             console.log('Deleting stale placeholder for:', email.trim())
//             const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(
//                 existingAuthUser.id
//             )
//             if (deleteError) {
//                 console.error('Failed to delete stale placeholder:', deleteError)
//                 return { success: false, error: 'Failed to prepare invite. Please try again.' }
//             }
//         }

//         // 6. Delete any previous pending DB invites for this email
//         const deleted = await prisma.invitation.deleteMany({
//             where: { email: email.trim(), acceptedAt: null },
//         })
//         console.log(`Deleted ${deleted.count} previous pending invite(s) for ${email.trim()}`)

//         // 7. Create invitation row BEFORE calling Supabase
//         //    so the token exists in DB before the email is sent
//         const token     = randomBytes(32).toString('hex')
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

//         // 8. Send invite email via Supabase
//         //    redirectTo must be base path only — NO token in the URL here
//         //    The token is passed via data and embedded by the email template
//         //    using {{ .Data.custom_token }}
//         const { error: inviteError } =
//             await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
//                 redirectTo: `${siteUrl}/accept-invite`,
//                 data: {
//                     custom_token: token,
//                     role,
//                     schoolId,
//                 },
//             })

//         if (inviteError) {
//             console.error('inviteUserByEmail error:', inviteError.message, inviteError)

//             // Rollback invitation row
//             await prisma.invitation.delete({ where: { id: invitation.id } })
//                 .catch(e => console.error('DB rollback failed:', e))

//             // Clean up any placeholder Supabase may have partially created
//             await deleteStaleAuthUser(email.trim())

//             return { success: false, error: `Failed to send invite email: ${inviteError.message}` }
//         }

//         // 9. Fire-and-forget: notify inviter
//         try {
//             const inviterProfile = await prisma.profile.findUnique({
//                 where: { email: user.email! },
//                 select: { id: true, school: { select: { name: true } } },
//             })

//             if (inviterProfile) {
//                 const roleLabel  = role.toString().toLowerCase().replace(/_/g, ' ')
//                 const schoolLabel = inviterProfile.school?.name
//                     ? ` at ${inviterProfile.school.name}`
//                     : ''

//                 await prisma.notification.create({
//                     data: {
//                         userId:  inviterProfile.id,
//                         message: `Invitation sent to ${email.trim()} as ${roleLabel}${schoolLabel}.`,
//                         link:    '/admin/invite-users',
//                     },
//                 })
//             }
//         } catch (notifyErr) {
//             console.error('Failed to create inviter notification:', notifyErr)
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
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (!email?.trim()) return { success: false, error: 'Email is required.' }

//         const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
//         if (!siteUrl) return { success: false, error: 'NEXT_PUBLIC_SITE_URL is not configured.' }

//         // 2. Find existing pending invite
//         const existing = await prisma.invitation.findFirst({
//             where: { email: email.trim(), acceptedAt: null },
//             orderBy: { createdAt: 'desc' },
//         })
//         if (!existing) {
//             return { success: false, error: 'No pending invite found for this email.' }
//         }

//         // 3. Delete old unconfirmed Supabase placeholder so we can re-invite
//         await deleteStaleAuthUser(email.trim())

//         // 4. Refresh token and expiry in DB
//         const token     = randomBytes(32).toString('hex')
//         const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

//         await prisma.invitation.update({
//             where: { id: existing.id },
//             data: { token, expiresAt },
//         })
//         console.log('Invitation token refreshed for:', email.trim())

//         // 5. Resend via Supabase — base path only, token in data
//         const { error: inviteError } =
//             await supabaseAdmin.auth.admin.inviteUserByEmail(email.trim(), {
//                 redirectTo: `${siteUrl}/accept-invite`,
//                 data: {
//                     custom_token: token,
//                     role:         existing.role,
//                     schoolId:     existing.schoolId,
//                 },
//             })

//         if (inviteError) {
//             console.error('resend inviteUserByEmail error:', inviteError.message, inviteError)
//             return { success: false, error: `Failed to resend invite: ${inviteError.message}` }
//         }

//         // 6. Fire-and-forget: notify inviter on resend
//         try {
//             const inviterProfile = await prisma.profile.findUnique({
//                 where: { email: user.email! },
//                 select: { id: true, school: { select: { name: true } } },
//             })

//             if (inviterProfile) {
//                 const roleLabel  = existing.role.toString().toLowerCase().replace(/_/g, ' ')
//                 const schoolLabel = inviterProfile.school?.name
//                     ? ` at ${inviterProfile.school.name}`
//                     : ''

//                 await prisma.notification.create({
//                     data: {
//                         userId:  inviterProfile.id,
//                         message: `Invite link resent to ${email.trim()} as ${roleLabel}${schoolLabel}.`,
//                         link:    '/admin/invite-users',
//                     },
//                 })
//             }
//         } catch (notifyErr) {
//             console.error('Failed to create inviter notification (resend):', notifyErr)
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
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (!email?.trim()) return { success: false, error: 'Email is required.' }

//         // 2. Delete invitation rows
//         const deleted = await prisma.invitation.deleteMany({
//             where: { email: email.trim(), acceptedAt: null },
//         })
//         console.log(`Cancelled ${deleted.count} invite(s) for ${email.trim()}`)

//         // 3. Delete unconfirmed Supabase auth user
//         await deleteStaleAuthUser(email.trim())

//         return { success: true }

//     } catch (err: unknown) {
//         console.error('cancelInviteAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


// 'use server'

// import { prisma } from '@/lib/prisma'
// import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
// import { createClient } from '@/lib/supabase/server'
// import { Role, ActivityType, Prisma } from '@prisma/client'
// import { randomBytes } from 'crypto'
// import { getErrorMessage } from '@/lib/error-handler'
// import { logActivity } from '@/lib/activitylogger'

// // ── Interfaces ──────────────────────────────────────────────────────────────

// interface SendInviteParams {
//     email: string
//     role: Role
//     schoolId: string
// }

// interface ActionResult {
//     success: boolean
//     error?: string
// }

// // ── Auth helper ─────────────────────────────────────────────────────────────

// async function getAuthenticatedActor() {
//     try {
//         const supabase = await createClient()
//         const { data: { user } } = await supabase.auth.getUser()
//         if (!user) return null

//         return await prisma.profile.findUnique({
//             where: { id: user.id },
//             include: { school: { select: { name: true } } }
//         });
//     } catch {
//         return null
//     }
// }

// // ── Helper: delete stale unconfirmed placeholder user ─────────────────────────

// async function deleteStaleAuthUser(email: string): Promise<void> {
//     try {
//         const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
//             page: 1,
//             perPage: 1000,
//         })
//         if (error) return;

//         const existing = users.find(u => u.email === email)
//         if (existing && !existing.last_sign_in_at) {
//             await supabaseAdmin.auth.admin.deleteUser(existing.id)
//         }
//     } catch (err) {
//         console.error('deleteStaleAuthUser error:', err)
//     }
// }

// // ── Send Invite ────────────────────────────────────────────────────────────────

// export async function sendInviteAction({
//     email, role, schoolId
// }: SendInviteParams): Promise<ActionResult> {
//     try {
//         const actor = await getAuthenticatedActor()
//         // Rule 10: Security check - actor must belong to the school they are inviting to
//         if (!actor || (actor.role !== Role.SCHOOL_ADMIN && actor.role !== Role.SUPER_ADMIN)) {
//             return { success: false, error: 'Unauthorized.' }
//         }
//         if (actor.role !== Role.SUPER_ADMIN && actor.schoolId !== schoolId) {
//             return { success: false, error: 'Unauthorized: You cannot invite users to another school.' }
//         }

//         const trimmedEmail = email.trim().toLowerCase();

//         // 1. Get curriculumId from school (Rule 1 & 2)
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true, name: true },
//         })
//         if (!school?.curriculumId) return { success: false, error: 'School curriculum configuration missing.' }

//         // 2. Prevent duplicate active accounts
//         const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
//         const existingAuthUser = authUsers.find(u => u.email === trimmedEmail)
        
//         if (existingAuthUser?.last_sign_in_at) {
//             return { success: false, error: 'This user already has an active account.' }
//         }

//         // 3. Clean up stale data
//         if (existingAuthUser) await deleteStaleAuthUser(trimmedEmail);
//         await prisma.invitation.deleteMany({ where: { email: trimmedEmail, acceptedAt: null } });

//         // 4. Create Invitation (Tier 2)
//         const token = randomBytes(32).toString('hex')
//         const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48) // 48 hours

//         const invitation = await prisma.invitation.create({
//             data: {
//                 email: trimmedEmail,
//                 role,
//                 schoolId,
//                 curriculumId: school.curriculumId,
//                 token,
//                 expiresAt,
//                 invitedBy: actor.id,
//             },
//         })

//         // 5. Supabase Invite
//         const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
//         const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(trimmedEmail, {
//             redirectTo: `${siteUrl}/accept-invite`,
//             data: { custom_token: token, role, schoolId },
//         })

//         if (inviteError) {
//             await prisma.invitation.delete({ where: { id: invitation.id } });
//             return { success: false, error: inviteError.message };
//         }

//         // 6. Log Activity (Rule 11)
//         await logActivity({
//             schoolId,
//             actorId: actor.id,
//             actorName: actor.name,
//             actorRole: actor.role,
//             type: ActivityType.USER_INVITED,
//             title: 'Invitation Sent',
//             description: `Invited ${trimmedEmail} as ${role.toLowerCase().replace('_', ' ')} to ${school.name}.`
//         });

//         return { success: true }

//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Resend Invite ──────────────────────────────────────────────────────────────

// export async function resendInviteAction(email: string): Promise<ActionResult> {
//     try {
//         const actor = await getAuthenticatedActor()
//         if (!actor) return { success: false, error: 'Unauthorized.' }

//         const trimmedEmail = email.trim().toLowerCase();

//         const existing = await prisma.invitation.findFirst({
//             where: { email: trimmedEmail, acceptedAt: null },
//             include: { school: { select: { name: true } } }
//         })

//         if (!existing || (actor.role !== Role.SUPER_ADMIN && actor.schoolId !== existing.schoolId)) {
//             return { success: false, error: 'Invitation not found or access denied.' }
//         }

//         await deleteStaleAuthUser(trimmedEmail)

//         const token = randomBytes(32).toString('hex')
//         const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

//         await prisma.invitation.update({
//             where: { id: existing.id },
//             data: { token, expiresAt },
//         })

//         const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
//         await supabaseAdmin.auth.admin.inviteUserByEmail(trimmedEmail, {
//             redirectTo: `${siteUrl}/accept-invite`,
//             data: { custom_token: token, role: existing.role, schoolId: existing.schoolId },
//         });

//         return { success: true }
//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Cancel Invite ──────────────────────────────────────────────────────────────

// export async function cancelInviteAction(email: string): Promise<ActionResult> {
//     try {
//         const actor = await getAuthenticatedActor()
//         if (!actor) return { success: false, error: 'Unauthorized.' }

//         const trimmedEmail = email.trim().toLowerCase();

//         const existing = await prisma.invitation.findFirst({
//             where: { email: trimmedEmail, acceptedAt: null }
//         });

//         if (!existing || (actor.role !== Role.SUPER_ADMIN && actor.schoolId !== existing.schoolId)) {
//             return { success: false, error: 'Invitation not found.' }
//         }

//         await prisma.invitation.delete({ where: { id: existing.id } });
//         await deleteStaleAuthUser(trimmedEmail);

//         await logActivity({
//             schoolId: existing.schoolId,
//             actorId: actor.id,
//             actorName: actor.name,
//             actorRole: actor.role,
//             type: ActivityType.USER_DELETED,
//             title: 'Invitation Revoked',
//             description: `Cancelled pending invitation for ${trimmedEmail}.`
//         });

//         return { success: true }
//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { supabase as supabaseAdmin } from '@/lib/supabase/supabaseClient'
import { createClient } from '@/lib/supabase/server'
import { Role, ActivityType } from '@prisma/client'
import { randomBytes } from 'crypto'
import { getErrorMessage } from '@/lib/error-handler'
import { logActivity } from '@/lib/activitylogger'

// ── Interfaces ──────────────────────────────────────────────────────────────

interface SendInviteParams {
    email: string
    role: Role
    schoolId: string
}

interface ActionResult {
    success: boolean
    error?: string
}

// ── Auth helper ─────────────────────────────────────────────────────────────

/**
 * Validates the currently logged-in user and returns their profile with school info.
 */
async function getAuthenticatedActor() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        // Using findFirst to avoid 'never' type errors often seen in findUnique includes
        return await prisma.profile.findFirst({
            where: { id: user.id },
            include: { 
                school: { 
                    select: { name: true } 
                } 
            }
        });
    } catch {
        return null
    }
}

// ── Helper: delete stale unconfirmed placeholder user ─────────────────────────

async function deleteStaleAuthUser(email: string): Promise<void> {
    try {
        const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers({
            page: 1,
            perPage: 1000,
        })
        if (error) return;

        const existing = users.find(u => u.email === email)
        if (existing && !existing.last_sign_in_at) {
            await supabaseAdmin.auth.admin.deleteUser(existing.id)
        }
    } catch (err) {
        console.error('deleteStaleAuthUser error:', err)
    }
}

// ── Send Invite ────────────────────────────────────────────────────────────────

export async function sendInviteAction({
    email, role, schoolId
}: SendInviteParams): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        
        // Rule 10: Security check - Only Admins/SuperAdmins can invite
        if (!actor || (actor.role !== Role.SCHOOL_ADMIN && actor.role !== Role.SUPER_ADMIN)) {
            return { success: false, error: 'Unauthorized: Insufficient permissions.' }
        }

        // Rule 5: Admins can only invite to their own school
        if (actor.role !== Role.SUPER_ADMIN && actor.schoolId !== schoolId) {
            return { success: false, error: 'Unauthorized: You cannot invite users to another institution.' }
        }

        const trimmedEmail = email.trim().toLowerCase();

        // 1. Resolve Institutional Context
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: { curriculumId: true, name: true },
        })
        if (!school?.curriculumId) return { success: false, error: 'Target institution configuration incomplete.' }

        // 2. Prevent Duplicate Active Accounts
        const { data: { users: authUsers } } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 })
        const existingAuthUser = authUsers.find(u => u.email === trimmedEmail)
        
        if (existingAuthUser?.last_sign_in_at) {
            return { success: false, error: 'This user already has an active account.' }
        }

        // 3. Cleanup pending invites/placeholders
        if (existingAuthUser) await deleteStaleAuthUser(trimmedEmail);
        await prisma.invitation.deleteMany({ where: { email: trimmedEmail, acceptedAt: null } });

        // 4. Create Invitation (Tier 2 Context)
        const token = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48) // 48 hours

        const invitation = await prisma.invitation.create({
            data: {
                email: trimmedEmail,
                role,
                schoolId,
                curriculumId: school.curriculumId,
                token,
                expiresAt,
                invitedBy: actor.id,
            },
        })

        // 5. Trigger Supabase Invite
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        const { error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(trimmedEmail, {
            redirectTo: `${siteUrl}/accept-invite`,
            data: { custom_token: token, role, schoolId },
        })

        if (inviteError) {
            await prisma.invitation.delete({ where: { id: invitation.id } });
            return { success: false, error: inviteError.message };
        }

        // 6. Log Institutional Activity (Rule 11)
        await logActivity({
            schoolId,
            actorId: actor.id,
            actorName: actor.name,
            actorRole: actor.role,
            type: ActivityType.USER_INVITED,
            title: 'Invitation Sent',
            description: `Invited ${trimmedEmail} as ${role.toLowerCase().replace('_', ' ')} to ${school.name}.`
        });

        return { success: true }

    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Resend Invite ──────────────────────────────────────────────────────────────

export async function resendInviteAction(email: string): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor) return { success: false, error: 'Unauthorized.' }

        const trimmedEmail = email.trim().toLowerCase();

        const existing = await prisma.invitation.findFirst({
            where: { email: trimmedEmail, acceptedAt: null }
        })

        if (!existing || (actor.role !== Role.SUPER_ADMIN && actor.schoolId !== existing.schoolId)) {
            return { success: false, error: 'Invitation not found or access denied.' }
        }

        await deleteStaleAuthUser(trimmedEmail)

        const token = randomBytes(32).toString('hex')
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48)

        await prisma.invitation.update({
            where: { id: existing.id },
            data: { token, expiresAt },
        })

        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
        await supabaseAdmin.auth.admin.inviteUserByEmail(trimmedEmail, {
            redirectTo: `${siteUrl}/accept-invite`,
            data: { custom_token: token, role: existing.role, schoolId: existing.schoolId },
        });

        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Cancel Invite ──────────────────────────────────────────────────────────────

export async function cancelInviteAction(email: string): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor) return { success: false, error: 'Unauthorized.' }

        const trimmedEmail = email.trim().toLowerCase();

        const existing = await prisma.invitation.findFirst({
            where: { email: trimmedEmail, acceptedAt: null }
        });

        if (!existing || (actor.role !== Role.SUPER_ADMIN && actor.schoolId !== existing.schoolId)) {
            return { success: false, error: 'Invitation not found.' }
        }

        await prisma.invitation.delete({ where: { id: existing.id } });
        await deleteStaleAuthUser(trimmedEmail);

        // Rule 11 Logging
        await logActivity({
            schoolId: existing.schoolId,
            actorId: actor.id,
            actorName: actor.name,
            actorRole: actor.role,
            type: ActivityType.USER_DELETED,
            title: 'Invitation Revoked',
            description: `Cancelled pending invitation for ${trimmedEmail}.`
        });

        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}