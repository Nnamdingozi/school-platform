// import { prisma } from '@/lib/prisma'
// import { ActivityType } from '@prisma/client'

// export interface LogActivityInput {
//     schoolId:    string
//     actorId:     string
//     actorName?:  string | null
//     actorRole?:  string | null
//     type:        ActivityType
//     title:       string
//     description: string
//     metadata?:   Record<string, unknown>
// }

// export async function logActivity(input: LogActivityInput): Promise<void> {
//     try {
//         await prisma.activityLog.create({
//             data: {
//                 schoolId:    input.schoolId,
//                 actorId:     input.actorId,
//                 actorName:   input.actorName  ?? null,
//                 actorRole:   input.actorRole  ?? null,
//                 type:        input.type,
//                 title:       input.title,
//                 description: input.description,
//                 metadata:    input.metadata   ?? undefined,
//             },
//         })
//     } catch (err) {
//         // Fire and forget — never block the main action
//         console.error('logActivity error:', err)
//     }
// }


import { prisma } from '@/lib/prisma'
import { ActivityType, Prisma } from '@prisma/client'
import { getErrorMessage } from '@/lib/error-handler'

export interface LogActivityInput {
    schoolId:    string | null | undefined // Allow null for independent users
    actorId:     string
    actorName?:  string | null
    actorRole?:  string | null
    type:        ActivityType
    title:       string
    description: string
    metadata?:   Record<string, unknown>
}

/**
 * Global Activity Logger
 * Rule: Only logs to the DB if a schoolId is present (Institutional Tier).
 * Independent user activity (Global Tier) is currently ignored by this specific logger 
 * as the Schema requires a School relation.
 */
export async function logActivity(input: LogActivityInput): Promise<void> {
    // Rule 6: Independent users don't have a school record to attach logs to.
    if (!input.schoolId) {
        console.log(`[Activity-Skip]: Independent User ${input.actorId} performed ${input.type} - No school context.`);
        return;
    }

    try {
        await prisma.activityLog.create({
            data: {
                schoolId:    input.schoolId,
                actorId:     input.actorId,
                actorName:   input.actorName ?? null,
                actorRole:   input.actorRole ?? null,
                type:        input.type,
                title:       input.title,
                description: input.description,
                // ✅ Strictly typed Prisma JSON handling
                metadata:    input.metadata ? (input.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
            },
        })
    } catch (err: unknown) {
        // Log error but don't crash the main execution flow of the calling action
        console.error('logActivity error:', getErrorMessage(err))
    }
}