// src/app/actions/parentProfile.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'

export async function getParentProfile(email: string) {
    try {
        return await prisma.profile.findUnique({
            where:   { email },
            include: {
                school:      true,
                curriculum:  true,
                notifications: {
                    orderBy: { createdAt: 'desc' },
                    take:    20,
                },
            },
        })
    } catch (err) {
        console.error('getParentProfile error:', getErrorMessage(err))
        return null
    }
}