// 'use server'

// import { prisma } from '@/lib/prisma'
// import { createClient } from '@/lib/supabase/server'
// import { getErrorMessage } from '@/lib/error-handler'
// import type { Notification } from '@prisma/client'

// interface ActionResult<T = unknown> {
//     success: boolean
//     data?: T
//     error?: string
// }

// // ── Auth helper ────────────────────────────────────────────────────────────────
// async function getAuthUser() {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return null
//         return data.user
//     } catch (err) {
//         console.error('getAuthUser (notifications) failed:', err)
//         return null
//     }
// }

// // ── Core creation helpers ─────────────────────────────────────────────────────

// export async function createNotificationForUserAction(params: {
//     userId: string
//     message: string
//     link?: string
// }): Promise<ActionResult<Notification>> {
//     try {
//         if (!params.userId || !params.message.trim()) {
//             return { success: false, error: 'userId and message are required.' }
//         }

//         const notification = await prisma.notification.create({
//             data: {
//                 userId: params.userId,
//                 message: params.message.trim(),
//                 link: params.link,
//             },
//         })

//         return { success: true, data: notification }
//     } catch (err: unknown) {
//         console.error('createNotificationForUserAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// export async function createNotificationsForUsersAction(params: {
//     userIds: string[]
//     message: string
//     link?: string
// }): Promise<ActionResult<number>> {
//     try {
//         const { userIds, message, link } = params
//         const trimmed = message.trim()

//         if (!Array.isArray(userIds) || userIds.length === 0) {
//             return { success: false, error: 'At least one userId is required.' }
//         }
//         if (!trimmed) {
//             return { success: false, error: 'Message is required.' }
//         }

//         const created = await prisma.notification.createMany({
//             data: userIds.map((id) => ({
//                 userId: id,
//                 message: trimmed,
//                 link,
//             })),
//         })

//         return { success: true, data: created.count }
//     } catch (err: unknown) {
//         console.error('createNotificationsForUsersAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // Convenience helper for the currently authenticated user
// export async function createNotificationForCurrentUserAction(params: {
//     message: string
//     link?: string
// }): Promise<ActionResult<Notification>> {
//     try {
//         const user = await getAuthUser()
//         if (!user?.email) return { success: false, error: 'Unauthorized.' }

//         const profile = await prisma.profile.findUnique({
//             where: { email: user.email },
//             select: { id: true },
//         })

//         if (!profile) {
//             return { success: false, error: 'Profile not found for current user.' }
//         }

//         return createNotificationForUserAction({
//             userId: profile.id,
//             message: params.message,
//             link: params.link,
//         })
//     } catch (err: unknown) {
//         console.error('createNotificationForCurrentUserAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Fetch for current user ────────────────────────────────────────────────────

// export async function getMyNotificationsAction(params?: {
//     take?: number
//     skip?: number
// }): Promise<
//     ActionResult<{
//         notifications: Notification[]
//         unreadCount: number
//     }>
// > {
//     try {
//         const user = await getAuthUser()
//         if (!user?.email) return { success: false, error: 'Unauthorized.' }

//         const profile = await prisma.profile.findUnique({
//             where: { email: user.email },
//             select: { id: true },
//         })

//         if (!profile) {
//             return { success: false, error: 'Profile not found for current user.' }
//         }

//         const take = params?.take ?? 50
//         const skip = params?.skip ?? 0

//         const [notifications, unreadCount] = await Promise.all([
//             prisma.notification.findMany({
//                 where: { userId: profile.id },
//                 orderBy: { createdAt: 'desc' },
//                 take,
//                 skip,
//             }),
//             prisma.notification.count({
//                 where: { userId: profile.id, read: false },
//             }),
//         ])

//         return {
//             success: true,
//             data: {
//                 notifications,
//                 unreadCount,
//             },
//         }
//     } catch (err: unknown) {
//         console.error('getMyNotificationsAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Mark as read helpers ──────────────────────────────────────────────────────

// export async function markNotificationReadAction(id: string): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user?.email) return { success: false, error: 'Unauthorized.' }

//         const profile = await prisma.profile.findUnique({
//             where: { email: user.email },
//             select: { id: true },
//         })

//         if (!profile) {
//             return { success: false, error: 'Profile not found for current user.' }
//         }

//         await prisma.notification.updateMany({
//             where: {
//                 id,
//                 userId: profile.id,
//             },
//             data: { read: true },
//         })

//         return { success: true }
//     } catch (err: unknown) {
//         console.error('markNotificationReadAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// export async function markAllNotificationsReadAction(): Promise<ActionResult<number>> {
//     try {
//         const user = await getAuthUser()
//         if (!user?.email) return { success: false, error: 'Unauthorized.' }

//         const profile = await prisma.profile.findUnique({
//             where: { email: user.email },
//             select: { id: true },
//         })

//         if (!profile) {
//             return { success: false, error: 'Profile not found for current user.' }
//         }

//         const result = await prisma.notification.updateMany({
//             where: { userId: profile.id, read: false },
//             data: { read: true },
//         })

//         return { success: true, data: result.count }
//     } catch (err: unknown) {
//         console.error('markAllNotificationsReadAction error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/error-handler'
import { revalidatePath } from 'next/cache'
import type { Notification } from '@prisma/client'

interface ActionResult<T = unknown> {
    success: boolean
    data?: T
    error?: string
}

// ── Auth helper ────────────────────────────────────────────────────────────────
async function getAuthUser() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) return null
        return data.user
    } catch (err) {
        console.error('getAuthUser (notifications) failed:', err)
        return null
    }
}

/**
 * Internal helper to get the profile ID for the current authenticated user.
 */
async function getCurrentProfileId(): Promise<string | null> {
    const user = await getAuthUser()
    if (!user?.email) return null

    const profile = await prisma.profile.findUnique({
        where: { email: user.email },
        select: { id: true },
    })
    
    return profile?.id ?? null
}

// ── Notification Creation ─────────────────────────────────────────────────────

export async function createNotificationForUserAction(params: {
    userId: string
    message: string
    link?: string
}): Promise<ActionResult<Notification>> {
    try {
        if (!params.userId || !params.message.trim()) {
            return { success: false, error: 'userId and message are required.' }
        }

        const notification = await prisma.notification.create({
            data: {
                userId: params.userId,
                message: params.message.trim(),
                link: params.link,
            },
        })

        revalidatePath('/notifications')
        return { success: true, data: notification }
    } catch (err: unknown) {
        console.error('createNotificationForUserAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

export async function createNotificationsForUsersAction(params: {
    userIds: string[]
    message: string
    link?: string
}): Promise<ActionResult<number>> {
    try {
        const { userIds, message, link } = params
        const trimmed = message.trim()

        if (!Array.isArray(userIds) || userIds.length === 0) {
            return { success: false, error: 'At least one userId is required.' }
        }
        if (!trimmed) {
            return { success: false, error: 'Message is required.' }
        }

        const created = await prisma.notification.createMany({
            data: userIds.map((id) => ({
                userId: id,
                message: trimmed,
                link,
            })),
        })

        revalidatePath('/notifications')
        return { success: true, data: created.count }
    } catch (err: unknown) {
        console.error('createNotificationsForUsersAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

export async function createNotificationForCurrentUserAction(params: {
    message: string
    link?: string
}): Promise<ActionResult<Notification>> {
    try {
        const profileId = await getCurrentProfileId()
        if (!profileId) return { success: false, error: 'Unauthorized or Profile not found.' }

        return createNotificationForUserAction({
            userId: profileId,
            message: params.message,
            link: params.link,
        })
    } catch (err: unknown) {
        console.error('createNotificationForCurrentUserAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Fetching Notifications ────────────────────────────────────────────────────

export async function getMyNotificationsAction(params?: {
    take?: number
    skip?: number
}): Promise<
    ActionResult<{
        notifications: Notification[]
        unreadCount: number
    }>
> {
    try {
        const profileId = await getCurrentProfileId()
        if (!profileId) return { success: false, error: 'Unauthorized.' }

        const take = params?.take ?? 50
        const skip = params?.skip ?? 0

        const [notifications, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId: profileId },
                orderBy: { createdAt: 'desc' },
                take,
                skip,
            }),
            prisma.notification.count({
                where: { userId: profileId, read: false },
            }),
        ])

        return {
            success: true,
            data: {
                notifications,
                unreadCount,
            },
        }
    } catch (err: unknown) {
        console.error('getMyNotificationsAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Mark as Read Logic ────────────────────────────────────────────────────────

export async function markNotificationReadAction(id: string): Promise<ActionResult> {
    try {
        const profileId = await getCurrentProfileId()
        if (!profileId) return { success: false, error: 'Unauthorized.' }

        await prisma.notification.updateMany({
            where: {
                id,
                userId: profileId, // Security: Ensure user owns this notification
            },
            data: { read: true },
        })

        revalidatePath('/notifications')
        return { success: true }
    } catch (err: unknown) {
        console.error('markNotificationReadAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult<number>> {
    try {
        const profileId = await getCurrentProfileId()
        if (!profileId) return { success: false, error: 'Unauthorized.' }

        const result = await prisma.notification.updateMany({
            where: { userId: profileId, read: false },
            data: { read: true },
        })

        revalidatePath('/notifications')
        return { success: true, data: result.count }
    } catch (err: unknown) {
        console.error('markAllNotificationsReadAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Deletion Logic ────────────────────────────────────────────────────────────

/**
 * Deletes a specific notification.
 * Uses updateMany to ensure only the owner can delete it.
 */
export async function deleteNotificationAction(id: string): Promise<ActionResult> {
    try {
        const profileId = await getCurrentProfileId()
        if (!profileId) return { success: false, error: 'Unauthorized.' }

        await prisma.notification.deleteMany({
            where: {
                id,
                userId: profileId, // Security: Ensure user owns this notification
            },
        })

        revalidatePath('/notifications')
        return { success: true }
    } catch (err: unknown) {
        console.error('deleteNotificationAction error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}


export async function deleteAllNotificationsAction(): Promise<ActionResult> {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()
        if (error || !user) return { success: false, error: 'Unauthorized.' }

        await prisma.notification.deleteMany({
            where: { userId: user.id },
        })

        return { success: true }
    } catch (err) {
        console.error('deleteAllNotificationsAction error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}