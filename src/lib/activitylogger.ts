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
    schoolId:    string
    actorId:     string
    actorName?:  string | null
    actorRole?:  string | null
    type:        ActivityType
    title:       string
    description: string
    metadata?:   Record<string, unknown>
}

export async function logActivity(input: LogActivityInput): Promise<void> {
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
                // ✅ Cast to Prisma.InputJsonValue — compatible with Json field
                metadata:    input.metadata !== undefined
                    ? input.metadata as unknown as Prisma.InputJsonValue
                    : undefined,
            },
        })
    } catch (err: unknown) {
        console.error('logActivity error:', getErrorMessage(err))
    }
}