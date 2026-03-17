// src/app/actions/term.actions.ts
'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'

export async function updateTermDates(
    termId:    string,
    startDate: Date,
    endDate:   Date,
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) return { success: false, error: 'Unauthorized.' }

        await prisma.term.update({
            where: { id: termId },
            data:  { startDate, endDate },
        })

        return { success: true }
    } catch (err) {
        console.error('updateTermDates error:', err)
        return { success: false, error: getErrorMessage(err) }
    }
}