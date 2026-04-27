// 'use server'

// import { prisma } from '@/lib/prisma'

// export interface CurriculumStats {
//     id:           string
//     name:         string
//     subjectLabel: string
//     termLabel:    string
//     yearLabel:    string
//     totalSubjects: number
//     totalGrades:   number
//     totalTopics:   number
//     terms: {
//         id:          string
//         displayName: string
//         index:       number
//     }[]
// }

// export async function getCurriculumStats(
//     schoolId: string
// ): Promise<CurriculumStats | null> {
//     try {
//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { curriculumId: true },
//         })

//         if (!school) return null

//         const [curriculum, totalSubjects, totalGrades, totalTopics, terms] =
//             await Promise.all([
//                 prisma.curriculum.findUnique({
//                     where:  { id: school.curriculumId },
//                     select: {
//                         id:           true,
//                         name:         true,
//                         subjectLabel: true,
//                         termLabel:    true,
//                         yearLabel:    true,
//                     },
//                 }),
//                 prisma.subject.count({
//                     where: { schoolId },
//                 }),
//                 prisma.grade.count({
//                     where: { schoolId },
//                 }),
//                 prisma.topic.count({
//                     where: { schoolId },
//                 }),
//                 prisma.term.findMany({
//                     where:   { schoolId },
//                     orderBy: { index: 'asc' },
//                     select: {
//                         id:          true,
//                         displayName: true,
//                         index:       true,
//                     },
//                 }),
//             ])

//         if (!curriculum) return null

//         return {
//             ...curriculum,
//             totalSubjects,
//             totalGrades,
//             totalTopics,
//             terms,
//         }
//     } catch (err) {
//         console.error('getCurriculumStats error:', err)
//         return null
//     }
// }

// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface TermStat {
//     id:          string
//     displayName: string
//     index:       number
//     startDate:   Date | null
//     endDate:     Date | null
// }

// export interface CurriculumStats {
//     id:            string
//     name:          string
//     subjectLabel:  string
//     termLabel:     string
//     yearLabel:     string
//     totalSubjects: number
//     totalGrades:   number
//     totalTopics:   number
//     terms:         TermStat[]
// }

// export interface UpdateTermDatesInput {
//     termId:    string
//     startDate: Date
//     endDate:   Date
// }

// // ── Auth helper ────────────────────────────────────────────────────────────────

// async function getAuthUser() {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return null
//         return data.user
//     } catch {
//         return null
//     }
// }

// // ── Get Curriculum Stats ───────────────────────────────────────────────────────

// export async function getCurriculumStats(
//     schoolId: string
// ): Promise<CurriculumStats | null> {
//     try {
//         // Step 1 — get the school's curriculumId
//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { curriculumId: true },
//         })

//         if (!school) return null

//         const curriculumId = school.curriculumId

//         const [
//             curriculum,
//             totalSubjects,
//             totalGrades,
//             totalTopics,
//             terms,
//         ] = await Promise.all([

//             // Curriculum metadata
//             prisma.curriculum.findUnique({
//                 where:  { id: curriculumId },
//                 select: {
//                     id:           true,
//                     name:         true,
//                     subjectLabel: true,
//                     termLabel:    true,
//                     yearLabel:    true,
//                 },
//             }),

//             // ✅ Subjects — seeded data has NULL schoolId but always
//             // has curriculumId set — count by curriculumId
//             prisma.subject.count({
//                 where: { curriculumId },
//             }),

//             // ✅ Grades — same as subjects, count by curriculumId
//             prisma.grade.count({
//                 where: { curriculumId },
//             }),

//             // ✅ Topics — no direct curriculumId on Topic model
//             // traverse: Topic → GradeSubject → Grade → curriculumId
//             prisma.topic.count({
//                 where: {
//                     gradeSubject: {
//                         grade: {
//                             curriculumId,
//                         },
//                     },
//                 },
//             }),

//             // ✅ Terms — school-specific terms first, fall back to
//             // curriculum-level terms if school has none configured yet
//             (async (): Promise<TermStat[]> => {
//                 const schoolTerms = await prisma.term.findMany({
//                     where:   { schoolId },
//                     orderBy: { index: 'asc' },
//                     select: {
//                         id:          true,
//                         displayName: true,
//                         index:       true,
//                         startDate:   true,
//                         endDate:     true,
//                     },
//                 })

//                 if (schoolTerms.length > 0) return schoolTerms

//                 // Fall back — get unique terms from curriculum
//                 // (no schoolId, grouped by index to avoid duplicates
//                 //  across different grades)
//                 const fallbackTerms = await prisma.term.findMany({
//                     where: {
//                         schoolId: null,
//                         grade: { curriculumId },
//                     },
//                     orderBy:  { index: 'asc' },
//                     distinct: ['index'],
//                     select: {
//                         id:          true,
//                         displayName: true,
//                         index:       true,
//                         startDate:   true,
//                         endDate:     true,
//                     },
//                 })

//                 return fallbackTerms
//             })(),
//         ])

//         if (!curriculum) return null

//         return {
//             ...curriculum,
//             totalSubjects,
//             totalGrades,
//             totalTopics,
//             terms,
//         }
//     } catch (err) {
//         console.error('getCurriculumStats error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Update Single Term Dates ───────────────────────────────────────────────────

// export async function updateTermDates(
//     input: UpdateTermDatesInput
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         const { termId, startDate, endDate } = input

//         if (startDate >= endDate) {
//             return { success: false, error: 'Start date must be before end date.' }
//         }

//         const term = await prisma.term.findUnique({
//             where:  { id: termId },
//             select: { id: true },
//         })

//         if (!term) return { success: false, error: 'Term not found.' }

//         await prisma.term.update({
//             where: { id: termId },
//             data:  { startDate, endDate },
//         })

//         return { success: true }
//     } catch (err) {
//         console.error('updateTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Bulk Update Term Dates ─────────────────────────────────────────────────────

// export async function bulkUpdateTermDates(
//     updates: UpdateTermDatesInput[]
// ): Promise<{ success: boolean; error?: string; failedTermIds?: string[] }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (updates.length === 0) {
//             return { success: false, error: 'No updates provided.' }
//         }

//         // Validate all date ranges before touching the DB
//         const invalid = updates.filter(u => u.startDate >= u.endDate)
//         if (invalid.length > 0) {
//             return {
//                 success:       false,
//                 error:         `${invalid.length} term(s) have invalid date ranges — start date must be before end date.`,
//                 failedTermIds: invalid.map(u => u.termId),
//             }
//         }

//         // Run all updates in parallel
//         const results = await Promise.allSettled(
//             updates.map(u =>
//                 prisma.term.update({
//                     where: { id: u.termId },
//                     data:  { startDate: u.startDate, endDate: u.endDate },
//                 })
//             )
//         )

//         const failed = results
//             .map((r, i) => ({ r, termId: updates[i].termId }))
//             .filter(({ r }) => r.status === 'rejected')
//             .map(({ termId }) => termId)

//         if (failed.length > 0) {
//             console.error('bulkUpdateTermDates partial failure:', failed)
//             return {
//                 success:       false,
//                 error:         `${failed.length} of ${updates.length} term(s) failed to update.`,
//                 failedTermIds: failed,
//             }
//         }

//         return { success: true }
//     } catch (err) {
//         console.error('bulkUpdateTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Clear Term Dates ───────────────────────────────────────────────────────────

// export async function clearTermDates(
//     termId: string
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         await prisma.term.update({
//             where: { id: termId },
//             data:  { startDate: null, endDate: null },
//         })

//         return { success: true }
//     } catch (err) {
//         console.error('clearTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }




'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Role, ActivityType, Prisma } from '@prisma/client'
import { logActivity } from '@/lib/activitylogger'
import { academicCoreScope, contentScope } from '@/lib/content-scope'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TermStat {
    id:          string
    displayName: string
    index:       number
    startDate:   Date | null
    endDate:     Date | null
}

export interface CurriculumStats {
    id:            string
    name:          string
    subjectLabel:  string
    termLabel:     string
    yearLabel:     string
    totalSubjects: number
    totalGrades:   number
    totalTopics:   number
    terms:         TermStat[]
}

export interface UpdateTermDatesInput {
    termId:    string
    startDate: Date
    endDate:   Date
}

// ── Internal Helpers ──────────────────────────────────────────────────────────

/**
 * Rule 10: Server-side identity and role validation
 */
async function getAuthenticatedProfile() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    return await prisma.profile.findUnique({
        where: { id: user.id },
        select: { id: true, schoolId: true, role: true, name: true }
    })
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * FETCH CURRICULUM ANALYTICS
 * Rule 7: Counts must include Global + School-specific extensions.
 */
export async function getCurriculumStats(
    schoolId: string | null
): Promise<CurriculumStats | null> {
    try {
        const curriculumId = schoolId 
            ? (await prisma.school.findUnique({ where: { id: schoolId }, select: { curriculumId: true } }))?.curriculumId
            : (await prisma.curriculum.findFirst({ where: { schoolId: null }, select: { id: true } }))?.id;

        if (!curriculumId) return null;

        const [
            curriculum,
            totalSubjects,
            totalGrades,
            totalTopics,
            terms,
        ] = await Promise.all([
            // Meta
            prisma.curriculum.findUnique({
                where:  { id: curriculumId },
                select: { id: true, name: true, subjectLabel: true, termLabel: true, yearLabel: true },
            }),

            // Rule 7: Count subjects visible in this context
            prisma.subject.count({
                where: { curriculumId, ...academicCoreScope({ schoolId }) },
            }),

            // Rule 7: Count grades visible in this context
            prisma.grade.count({
                where: { curriculumId, ...academicCoreScope({ schoolId }) },
            }),

            // Rule 7: Count topics visible in this context
            prisma.topic.count({
                where: {
                    ...contentScope({ schoolId }),
                    gradeSubject: { grade: { curriculumId } }
                },
            }),

            // Rule 5: Fetch Institutional Terms (or fall back to Global)
            (async (): Promise<TermStat[]> => {
                const results = await prisma.term.findMany({
                    where: {
                        OR: [
                            { schoolId: schoolId },
                            { schoolId: null, grade: { curriculumId } }
                        ]
                    },
                    orderBy: { index: 'asc' },
                    distinct: ['index'],
                    select: { id: true, displayName: true, index: true, startDate: true, endDate: true },
                });
                return results;
            })(),
        ])

        if (!curriculum) return null

        return {
            ...curriculum,
            totalSubjects,
            totalGrades,
            totalTopics,
            terms,
        }
    } catch (err: unknown) {
        console.error('getCurriculumStats error:', getErrorMessage(err))
        return null
    }
}

// ── Mutations (Rule 4 & 5 Enforcement) ─────────────────────────────────────────

/**
 * UPDATE TERM DATES
 * Rule 4: Users CANNOT modify Global Terms (schoolId: null).
 * Rule 5: Users can only modify Terms belonging to their school.
 */
export async function updateTermDates(
    input: UpdateTermDatesInput
): Promise<{ success: boolean; error?: string }> {
    try {
        const profile = await getAuthenticatedProfile();
        if (!profile || !profile.schoolId) return { success: false, error: 'Unauthorized.' };

        const { termId, startDate, endDate } = input;

        // Security Check: Ensure term belongs to user's school and isn't Global
        const term = await prisma.term.findUnique({
            where: { id: termId },
            select: { schoolId: true, displayName: true }
        });

        if (!term || term.schoolId !== profile.schoolId) {
            return { success: false, error: 'Access Denied: Cannot modify Global or foreign Term dates.' };
        }

        if (startDate >= endDate) {
            return { success: false, error: 'Start date must be before end date.' };
        }

        await prisma.term.update({
            where: { id: termId },
            data:  { startDate, endDate },
        });

        await logActivity({
            schoolId: profile.schoolId,
            actorId: profile.id,
            actorName: profile.name,
            actorRole: profile.role,
            type: ActivityType.TERM_DATES_UPDATED,
            title: 'Term Schedule Updated',
            description: `Updated dates for ${term.displayName}.`
        });

        revalidatePath('/admin/curriculum');
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * BULK UPDATE
 * Rule 5: Strict transactional isolation.
 */
export async function bulkUpdateTermDates(
    updates: UpdateTermDatesInput[]
): Promise<{ success: boolean; error?: string }> {
    try {
        const profile = await getAuthenticatedProfile();
        if (!profile || !profile.schoolId) return { success: false, error: 'Unauthorized.' };

        await prisma.$transaction(async (tx) => {
            for (const update of updates) {
                // Verify ownership for every single record in the batch
                const term = await tx.term.findFirst({
                    where: { id: update.termId, schoolId: profile.schoolId }
                });

                if (!term) throw new Error(`Term ${update.termId} is not modifiable.`);

                await tx.term.update({
                    where: { id: update.termId },
                    data: { startDate: update.startDate, endDate: update.endDate }
                });
            }

            await logActivity({
                schoolId: profile.schoolId,
                actorId: profile.id,
                actorRole: profile.role,
                type: ActivityType.TERM_DATES_UPDATED,
                title: 'Bulk Calendar Sync',
                description: `Synchronized dates for ${updates.length} terms.`
            });
        });

        revalidatePath('/admin/curriculum');
        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * CLEAR DATES
 */
export async function clearTermDates(
    termId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const profile = await getAuthenticatedProfile();
        if (!profile || !profile.schoolId) return { success: false, error: 'Unauthorized.' };

        const term = await prisma.term.findFirst({
            where: { id: termId, schoolId: profile.schoolId }
        });

        if (!term) return { success: false, error: 'Record not found or read-only.' };

        await prisma.term.update({
            where: { id: termId },
            data:  { startDate: null, endDate: null },
        });

        return { success: true };
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}