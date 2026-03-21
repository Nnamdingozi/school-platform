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


// src/app/actions/school-settings.action.ts — add this

export async function updateGlobalTermDates(
    schoolId:  string,
    termIndex: number,
    startDate: Date,
    endDate:   Date,
): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) return { success: false, error: 'Unauthorized.' }

        // ── Find all grades belonging to this school ───────────────────────
        // Terms are linked to grades, not directly to school
        // so we find grades via the school's curriculum
        const school = await prisma.school.findUnique({
            where:  { id: schoolId },
            select: { curriculumId: true },
        })

        if (!school) return { success: false, error: 'School not found.' }

        // Get all grades for this curriculum
        const grades = await prisma.grade.findMany({
            where:  { curriculumId: school.curriculumId },
            select: { id: true },
        })

        if (!grades.length) return { success: false, error: 'No grades found.' }

        const gradeIds = grades.map(g => g.id)

        // ── Update all terms with matching index across all grades ─────────
        await prisma.term.updateMany({
            where: {
                index:   termIndex,
                gradeId: { in: gradeIds },
            },
            data: { startDate, endDate },
        })

        return { success: true }
    } catch (err) {
        console.error('updateGlobalTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}