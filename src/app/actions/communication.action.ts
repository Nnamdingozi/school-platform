// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'

// export interface CreditLogItem {
//     id:         string
//     actorName:  string | null
//     actorRole:  string | null
//     credits:    number
//     recipient:  string | null
//     createdAt:  Date
// }

// export interface CommunicationStats {
//     totalPurchased:  number
//     totalRemaining:  number
//     totalUsed:       number
//     usagePercent:    number
//     recentLogs:      CreditLogItem[]
//     topUsers:        { name: string | null; role: string | null; total: number }[]
// }

// export interface CommunicationStatsResult {
//     success: boolean
//     stats?:  CommunicationStats
//     error?:  string
// }

// export async function getCommunicationStats(
//     schoolId: string
// ): Promise<CommunicationStatsResult> {
//     try {
//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { whatsappCredits: true },
//         })

//         if (!school) return { success: false, error: 'School not found.' }

//         // Get all WhatsApp activity logs for this school
//         const logs = await prisma.activityLog.findMany({
//             where: {
//                 schoolId,
//                 type: 'WHATSAPP_SENT',
//             },
//             orderBy: { createdAt: 'desc' },
//             take:    50,
//             select: {
//                 id:          true,
//                 actorName:   true,
//                 actorRole:   true,
//                 description: true,
//                 createdAt:   true,
//                 metadata:    true,
//             },
//         })

//         // Derive credit usage per log entry
//         const recentLogs: CreditLogItem[] = logs.map(log => ({
//             id:        log.id,
//             actorName: log.actorName,
//             actorRole: log.actorRole,
//             credits:   (log.metadata as { credits?: number })?.credits ?? 1,
//             recipient: (log.metadata as { recipient?: string })?.recipient ?? null,
//             createdAt: log.createdAt,
//         }))

//         // Total used = sum of credits across all logs
//         const totalUsed = recentLogs.reduce((sum, l) => sum + l.credits, 0)

//         // Total purchased = remaining + used
//         const totalPurchased = school.whatsappCredits + totalUsed
//         const totalRemaining = school.whatsappCredits

//         const usagePercent = totalPurchased > 0
//             ? Math.round((totalUsed / totalPurchased) * 100)
//             : 0

//         // Top users by credit consumption
//         const userMap = new Map<string, { name: string | null; role: string | null; total: number }>()
//         for (const log of recentLogs) {
//             const key = log.actorName ?? 'Unknown'
//             const existing = userMap.get(key)
//             if (existing) {
//                 existing.total += log.credits
//             } else {
//                 userMap.set(key, {
//                     name:  log.actorName,
//                     role:  log.actorRole,
//                     total: log.credits,
//                 })
//             }
//         }

//         const topUsers = Array.from(userMap.values())
//             .sort((a, b) => b.total - a.total)
//             .slice(0, 5)

//         return {
//             success: true,
//             stats: {
//                 totalPurchased,
//                 totalRemaining,
//                 totalUsed,
//                 usagePercent,
//                 recentLogs,
//                 topUsers,
//             },
//         }
//     } catch (err) {
//         console.error('getCommunicationStats error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { Role, Prisma, TxStatus } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface CreditLogItem {
    id:         string
    actorName:  string | null
    actorRole:  string | null
    credits:    number
    recipient:  string | null
    createdAt:  Date
}

export interface CommunicationStats {
    totalPurchased:  number
    totalRemaining:  number
    totalUsed:       number
    usagePercent:    number
    recentLogs:      CreditLogItem[]
    topUsers:        { name: string | null; role: string | null; total: number }[]
}

export interface CommunicationStatsResult {
    success: boolean
    stats?:  CommunicationStats
    error?:  string
}

// ── Logic ──────────────────────────────────────────────────────────────────────

/**
 * FETCH COMMUNICATION ANALYTICS
 * Tier 2 Rule: Strictly institutional data.
 * Rule 6: Independent users do not have access to this feature.
 */
export async function getCommunicationStats(
    schoolId: string | null | undefined
): Promise<CommunicationStatsResult> {
    if (!schoolId) {
        return { success: false, error: "Access Denied: Feature limited to schools." };
    }

    try {
        const [school, transactions, logs] = await Promise.all([
            // Get current balance
            prisma.school.findUnique({
                where:  { id: schoolId },
                select: { whatsappCredits: true },
            }),

            // Sum all successful credit purchases (Rule 11 System Truth)
            prisma.creditTransaction.aggregate({
                where: { schoolId, status: TxStatus.SUCCESS },
                _sum: { credits: true }
            }),

            // Get recent logs for the UI table
            prisma.activityLog.findMany({
                where: {
                    schoolId,
                    type: 'WHATSAPP_SENT',
                },
                orderBy: { createdAt: 'desc' },
                take:    50,
                select: {
                    id:          true,
                    actorName:   true,
                    actorRole:   true,
                    description: true,
                    createdAt:   true,
                    metadata:    true,
                },
            })
        ])

        if (!school) return { success: false, error: 'School not found.' }

        const totalPurchased = transactions._sum.credits ?? 0;
        const totalRemaining = school.whatsappCredits;
        const totalUsed = Math.max(0, totalPurchased - totalRemaining);

        // Process logs into typed items
        const recentLogs: CreditLogItem[] = logs.map(log => {
            const metadata = log.metadata as Prisma.JsonObject;
            return {
                id:        log.id,
                actorName: log.actorName,
                actorRole: log.actorRole,
                credits:   typeof metadata?.credits === 'number' ? metadata.credits : 1,
                recipient: typeof metadata?.recipient === 'string' ? metadata.recipient : null,
                createdAt: log.createdAt,
            };
        });

        const usagePercent = totalPurchased > 0
            ? Math.round((totalUsed / totalPurchased) * 100)
            : 0

        // Aggregate top users from the retrieved log subset
        const userMap = new Map<string, { name: string | null; role: string | null; total: number }>()
        for (const log of recentLogs) {
            const key = log.actorName ?? 'System'
            const existing = userMap.get(key)
            if (existing) {
                existing.total += log.credits
            } else {
                userMap.set(key, {
                    name:  log.actorName,
                    role:  log.actorRole,
                    total: log.credits,
                })
            }
        }

        const topUsers = Array.from(userMap.values())
            .sort((a, b) => b.total - a.total)
            .slice(0, 5)

        return {
            success: true,
            stats: {
                totalPurchased,
                totalRemaining,
                totalUsed,
                usagePercent,
                recentLogs,
                topUsers,
            },
        }
    } catch (err: unknown) {
        console.error('getCommunicationStats error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}