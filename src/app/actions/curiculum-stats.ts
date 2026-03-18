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

'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'

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

// ── Auth helper ────────────────────────────────────────────────────────────────

async function getAuthUser() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) return null
        return data.user
    } catch {
        return null
    }
}

// ── Get Curriculum Stats ───────────────────────────────────────────────────────

export async function getCurriculumStats(
    schoolId: string
): Promise<CurriculumStats | null> {
    try {
        // Step 1 — get the school's curriculumId
        const school = await prisma.school.findUnique({
            where:  { id: schoolId },
            select: { curriculumId: true },
        })

        if (!school) return null

        const curriculumId = school.curriculumId

        const [
            curriculum,
            totalSubjects,
            totalGrades,
            totalTopics,
            terms,
        ] = await Promise.all([

            // Curriculum metadata
            prisma.curriculum.findUnique({
                where:  { id: curriculumId },
                select: {
                    id:           true,
                    name:         true,
                    subjectLabel: true,
                    termLabel:    true,
                    yearLabel:    true,
                },
            }),

            // ✅ Subjects — seeded data has NULL schoolId but always
            // has curriculumId set — count by curriculumId
            prisma.subject.count({
                where: { curriculumId },
            }),

            // ✅ Grades — same as subjects, count by curriculumId
            prisma.grade.count({
                where: { curriculumId },
            }),

            // ✅ Topics — no direct curriculumId on Topic model
            // traverse: Topic → GradeSubject → Grade → curriculumId
            prisma.topic.count({
                where: {
                    gradeSubject: {
                        grade: {
                            curriculumId,
                        },
                    },
                },
            }),

            // ✅ Terms — school-specific terms first, fall back to
            // curriculum-level terms if school has none configured yet
            (async (): Promise<TermStat[]> => {
                const schoolTerms = await prisma.term.findMany({
                    where:   { schoolId },
                    orderBy: { index: 'asc' },
                    select: {
                        id:          true,
                        displayName: true,
                        index:       true,
                        startDate:   true,
                        endDate:     true,
                    },
                })

                if (schoolTerms.length > 0) return schoolTerms

                // Fall back — get unique terms from curriculum
                // (no schoolId, grouped by index to avoid duplicates
                //  across different grades)
                const fallbackTerms = await prisma.term.findMany({
                    where: {
                        schoolId: null,
                        grade: { curriculumId },
                    },
                    orderBy:  { index: 'asc' },
                    distinct: ['index'],
                    select: {
                        id:          true,
                        displayName: true,
                        index:       true,
                        startDate:   true,
                        endDate:     true,
                    },
                })

                return fallbackTerms
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
    } catch (err) {
        console.error('getCurriculumStats error:', getErrorMessage(err))
        return null
    }
}

// ── Update Single Term Dates ───────────────────────────────────────────────────

export async function updateTermDates(
    input: UpdateTermDatesInput
): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        const { termId, startDate, endDate } = input

        if (startDate >= endDate) {
            return { success: false, error: 'Start date must be before end date.' }
        }

        const term = await prisma.term.findUnique({
            where:  { id: termId },
            select: { id: true },
        })

        if (!term) return { success: false, error: 'Term not found.' }

        await prisma.term.update({
            where: { id: termId },
            data:  { startDate, endDate },
        })

        return { success: true }
    } catch (err) {
        console.error('updateTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Bulk Update Term Dates ─────────────────────────────────────────────────────

export async function bulkUpdateTermDates(
    updates: UpdateTermDatesInput[]
): Promise<{ success: boolean; error?: string; failedTermIds?: string[] }> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (updates.length === 0) {
            return { success: false, error: 'No updates provided.' }
        }

        // Validate all date ranges before touching the DB
        const invalid = updates.filter(u => u.startDate >= u.endDate)
        if (invalid.length > 0) {
            return {
                success:       false,
                error:         `${invalid.length} term(s) have invalid date ranges — start date must be before end date.`,
                failedTermIds: invalid.map(u => u.termId),
            }
        }

        // Run all updates in parallel
        const results = await Promise.allSettled(
            updates.map(u =>
                prisma.term.update({
                    where: { id: u.termId },
                    data:  { startDate: u.startDate, endDate: u.endDate },
                })
            )
        )

        const failed = results
            .map((r, i) => ({ r, termId: updates[i].termId }))
            .filter(({ r }) => r.status === 'rejected')
            .map(({ termId }) => termId)

        if (failed.length > 0) {
            console.error('bulkUpdateTermDates partial failure:', failed)
            return {
                success:       false,
                error:         `${failed.length} of ${updates.length} term(s) failed to update.`,
                failedTermIds: failed,
            }
        }

        return { success: true }
    } catch (err) {
        console.error('bulkUpdateTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Clear Term Dates ───────────────────────────────────────────────────────────

export async function clearTermDates(
    termId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        await prisma.term.update({
            where: { id: termId },
            data:  { startDate: null, endDate: null },
        })

        return { success: true }
    } catch (err) {
        console.error('clearTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}