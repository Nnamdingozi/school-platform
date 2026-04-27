// // src/app/actions/term.actions.ts
// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'

// export async function updateTermDates(
//     termId:    string,
//     startDate: Date,
//     endDate:   Date,
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return { success: false, error: 'Unauthorized.' }

//         await prisma.term.update({
//             where: { id: termId },
//             data:  { startDate, endDate },
//         })

//         return { success: true }
//     } catch (err) {
//         console.error('updateTermDates error:', err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


// // src/app/actions/school-settings.action.ts — add this

// export async function updateGlobalTermDates(
//     schoolId:  string,
//     termIndex: number,
//     startDate: Date,
//     endDate:   Date,
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return { success: false, error: 'Unauthorized.' }

//         // ── Find all grades belonging to this school ───────────────────────
//         // Terms are linked to grades, not directly to school
//         // so we find grades via the school's curriculum
//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { curriculumId: true },
//         })

//         if (!school) return { success: false, error: 'School not found.' }

//         // Get all grades for this curriculum
//         const grades = await prisma.grade.findMany({
//             where:  { curriculumId: school.curriculumId },
//             select: { id: true },
//         })

//         if (!grades.length) return { success: false, error: 'No grades found.' }

//         const gradeIds = grades.map(g => g.id)

//         // ── Update all terms with matching index across all grades ─────────
//         await prisma.term.updateMany({
//             where: {
//                 index:   termIndex,
//                 gradeId: { in: gradeIds },
//             },
//             data: { startDate, endDate },
//         })

//         return { success: true }
//     } catch (err) {
//         console.error('updateGlobalTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { Role, ActivityType } from '@prisma/client'
import { logActivity } from "@/lib/activitylogger";
import { revalidatePath } from 'next/cache'

// ── Internal Auth Helper ──────────────────────────────────────────────────────

async function getAuthenticatedActor() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return await prisma.profile.findUnique({
        where: { id: user.id },
        select: { id: true, schoolId: true, role: true, name: true }
    })
}

// ── Actions ───────────────────────────────────────────────────────────────────

/**
 * UPDATES A SPECIFIC TERM
 * Rule 4: Prevents modification of Global Terms (schoolId: null).
 * Rule 5: Strict school isolation.
 */
export async function updateTermDates(
    termId:    string,
    startDate: Date,
    endDate:   Date,
): Promise<{ success: boolean; error?: string }> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || actor.role !== Role.SCHOOL_ADMIN) {
            return { success: false, error: 'Unauthorized: Admin permissions required.' }
        }

        // 1. Ownership & Tier Validation (Rule 4 & 5)
        const term = await prisma.term.findUnique({
            where: { id: termId },
            select: { schoolId: true, displayName: true }
        })

        if (!term || term.schoolId !== actor.schoolId) {
            return { success: false, error: 'Access Denied: Cannot modify Global or foreign terms.' }
        }

        // 2. Execution
        await prisma.term.update({
            where: { id: termId },
            data:  { startDate, endDate },
        })

        // 3. Rule 11: System Truth Logging
        await logActivity({
            schoolId: actor.schoolId,
            actorId: actor.id,
            actorRole: actor.role,
            type: ActivityType.TERM_DATES_UPDATED,
            title: 'Term Schedule Modified',
            description: `Updated dates for ${term.displayName}.`
        })

        revalidatePath('/admin/curriculum')
        return { success: true }

    } catch (err: unknown) {
        console.error('updateTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

/**
 * SYNC INSTITUTIONAL TERM DATES
 * Updates all grades for a specific term index within the school.
 * Rule 11: Ensures consistency across the School Layer (Tier 2).
 */
export async function syncInstitutionalTermDates(
    termIndex: number,
    startDate: Date,
    endDate:   Date,
): Promise<{ success: boolean; error?: string }> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || !actor.schoolId || actor.role !== Role.SCHOOL_ADMIN) {
            return { success: false, error: 'Unauthorized.' }
        }

        const schoolId = actor.schoolId;

        // 1. Transactional Update (Rule 11)
        // We only target terms explicitly owned by this school
        const result = await prisma.term.updateMany({
            where: {
                schoolId: schoolId, // Rule 5 Isolation
                index: termIndex,
            },
            data: { startDate, endDate },
        })

        if (result.count === 0) {
            return { success: false, error: "No institutional term records found to update." }
        }

        // 2. Log Batch Activity
        await logActivity({
            schoolId: schoolId,
            actorId: actor.id,
            actorRole: actor.role,
            type: ActivityType.TERM_DATES_UPDATED,
            title: 'Global Term Sync',
            description: `Synchronized dates for Term ${termIndex} across ${result.count} grades.`
        })

        revalidatePath('/admin/curriculum')
        return { success: true }

    } catch (err: unknown) {
        console.error('syncInstitutionalTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}