// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { ActivityType } from '@prisma/client'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface ActivityItem {
//     id:          string
//     type:        ActivityType
//     title:       string
//     description: string
//     actorName:   string | null
//     actorRole:   string | null
//     actorId:     string
//     createdAt:   Date
// }

// export interface ActivityFeedData {
//     myActivity:     ActivityItem[]
//     schoolActivity: ActivityItem[]
// }

// // ── Get Activity Feed ──────────────────────────────────────────────────────────

// export async function getActivityFeed(
//     schoolId: string,
//     actorId:  string,
// ): Promise<ActivityFeedData | null> {
//     try {
//         const [myActivity, schoolActivity] = await Promise.all([

//             // My Activity — current user's actions
//             prisma.activityLog.findMany({
//                 where:   { schoolId, actorId },
//                 orderBy: { createdAt: 'desc' },
//                 take:    20,
//                 select: {
//                     id:          true,
//                     type:        true,
//                     title:       true,
//                     description: true,
//                     actorName:   true,
//                     actorRole:   true,
//                     actorId:     true,
//                     createdAt:   true,
//                 },
//             }),

//             // School Feed — all activity in this school
//             prisma.activityLog.findMany({
//                 where:   { schoolId },
//                 orderBy: { createdAt: 'desc' },
//                 take:    30,
//                 select: {
//                     id:          true,
//                     type:        true,
//                     title:       true,
//                     description: true,
//                     actorName:   true,
//                     actorRole:   true,
//                     actorId:     true,
//                     createdAt:   true,
//                 },
//             }),
//         ])

//         return { myActivity, schoolActivity }
//     } catch (err) {
//         console.error('getActivityFeed error:', getErrorMessage(err))
//         return null
//     }
// }

import { prisma } from '@/lib/prisma'
import { ActivityType, Prisma, Role, ActivityLog } from '@prisma/client'
import { getErrorMessage } from '@/lib/error-handler'

/**
 * Input parameters for logging an activity.
 * schoolId is optional to support Rule 6 (Independent Users).
 */
export interface LogActivityInput {
    schoolId?:   string | null
    actorId:     string
    actorName?:  string | null
    actorRole?:  string | null
    type:        ActivityType
    title:       string
    description: string
    metadata?:   Record<string, unknown>
}

/**
 * GLOBAL ACTIVITY LOGGER
 * Adheres to Rule 11: System truth - tracks actions across all 3 tiers.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
    try {
        await prisma.activityLog.create({
            data: {
                schoolId:    input.schoolId ?? null,
                actorId:     input.actorId,
                actorName:   input.actorName ?? null,
                actorRole:   input.actorRole ?? null,
                type:        input.type,
                title:       input.title,
                description: input.description,
                metadata:    input.metadata 
                    ? (input.metadata as unknown as Prisma.InputJsonValue) 
                    : Prisma.JsonNull,
            },
        })
    } catch (err: unknown) {
        console.error('logActivity error:', getErrorMessage(err))
    }
}

/**
 * FETCH ACTIVITY LOGS
 * Tier 2 Rule: School Admins see all school activity.
 * Tier 3 Rule: Individual users see only their own activity.
 */
export async function getActivityLogs(params: {
    userId: string;
    schoolId?: string | null;
    role: Role;
}): Promise<ActivityLog[]> {
    try {
        const { userId, schoolId, role } = params;

        // Condition 1: School Admin sees everything in their school (Rule 5)
        if (role === Role.SCHOOL_ADMIN && schoolId) {
            return await prisma.activityLog.findMany({
                where: {
                    schoolId: schoolId
                },
                orderBy: {
                    createdAt: 'desc'
                },
                take: 50 // Limitation for performance
            });
        }

        // Condition 2: Regular users or Independent users see only their personal logs (Rule 6)
        // This applies even if they belong to a school but aren't admins
        return await prisma.activityLog.findMany({
            where: {
                actorId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        });

    } catch (err: unknown) {
        console.error('getActivityLogs error:', getErrorMessage(err));
        return [];
    }
}

/**
 * FETCH PERSONAL ACTIVITY (Explicitly for "My Activity" tabs)
 */
export async function getPersonalActivityLogs(userId: string): Promise<ActivityLog[]> {
    try {
        return await prisma.activityLog.findMany({
            where: {
                actorId: userId
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 30
        });
    } catch (err: unknown) {
        console.error('getPersonalActivityLogs error:', getErrorMessage(err));
        return [];
    }
}