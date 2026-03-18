'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { ActivityType } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ActivityItem {
    id:          string
    type:        ActivityType
    title:       string
    description: string
    actorName:   string | null
    actorRole:   string | null
    actorId:     string
    createdAt:   Date
}

export interface ActivityFeedData {
    myActivity:     ActivityItem[]
    schoolActivity: ActivityItem[]
}

// ── Get Activity Feed ──────────────────────────────────────────────────────────

export async function getActivityFeed(
    schoolId: string,
    actorId:  string,
): Promise<ActivityFeedData | null> {
    try {
        const [myActivity, schoolActivity] = await Promise.all([

            // My Activity — current user's actions
            prisma.activityLog.findMany({
                where:   { schoolId, actorId },
                orderBy: { createdAt: 'desc' },
                take:    20,
                select: {
                    id:          true,
                    type:        true,
                    title:       true,
                    description: true,
                    actorName:   true,
                    actorRole:   true,
                    actorId:     true,
                    createdAt:   true,
                },
            }),

            // School Feed — all activity in this school
            prisma.activityLog.findMany({
                where:   { schoolId },
                orderBy: { createdAt: 'desc' },
                take:    30,
                select: {
                    id:          true,
                    type:        true,
                    title:       true,
                    description: true,
                    actorName:   true,
                    actorRole:   true,
                    actorId:     true,
                    createdAt:   true,
                },
            }),
        ])

        return { myActivity, schoolActivity }
    } catch (err) {
        console.error('getActivityFeed error:', getErrorMessage(err))
        return null
    }
}