// // src/app/actions/parentProfile.ts
// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'

// export async function getParentProfile(email: string) {
//     try {
//         return await prisma.profile.findUnique({
//             where:   { email },
//             include: {
//                 school:      true,
//                 curriculum:  true,
//                 notifications: {
//                     orderBy: { createdAt: 'desc' },
//                     take:    20,
//                 },
//             },
//         })
//     } catch (err) {
//         console.error('getParentProfile error:', getErrorMessage(err))
//         return null
//     }
// }



'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { Role, Prisma } from '@prisma/client'

/**
 * Fetches the Profile for a Parent.
 * 
 * FIX: Changed findUnique to findFirst because email is not a standalone 
 * unique field in the Profile model (it is a composite unique key with schoolId).
 */
export async function getParentProfile(email: string) {
    if (!email) return null;

    try {
        return await prisma.profile.findFirst({
            where: { 
                email: email.toLowerCase(),
                role: Role.PARENT // Rule 10: Ensure we are only fetching a parent profile
            },
            include: {
                school: true,
                curriculum: true,
                notifications: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
            },
        })
    } catch (err: unknown) {
        console.error('getParentProfile error:', getErrorMessage(err))
        return null;
    }
}