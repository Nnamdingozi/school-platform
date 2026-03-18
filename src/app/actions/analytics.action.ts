// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface GradeDistributionItem {
//     name:  string
//     value: number
// }

// export interface AssessmentScoreItem {
//     subject: string
//     average: number
//     highest: number
// }

// export interface StatusDistributionItem {
//     name:  string
//     value: number
// }

// export interface AnalyticsData {
//     gradeDistribution:  GradeDistributionItem[]
//     assessmentScores:   AssessmentScoreItem[]
//     statusDistribution: StatusDistributionItem[]
// }

// // ── Get Analytics Data ─────────────────────────────────────────────────────────

// export async function getAnalyticsData(
//     schoolId: string
// ): Promise<AnalyticsData | null> {
//     try {
//         const [
//             gradeGroups,
//             assessments,
//             activeCount,
//             // We don't have an isActive flag on Profile so we derive
//             // status from whether the user is banned in Supabase —
//             // approximate here by counting all vs unassigned
//             totalStudents,
//         ] = await Promise.all([

//             // ── Grade distribution ─────────────────────────────────────
//             // Count students per grade via their class enrollments
//             prisma.classEnrollment.groupBy({
//                 by:    ['classId'],
//                 where: {
//                     schoolId,
//                     student: { role: 'STUDENT' },
//                 },
//                 _count: { studentId: true },
//             }),

//             // ── Assessment scores per subject ──────────────────────────
//             prisma.assessment.findMany({
//                 where: {
//                     schoolId,
//                     score:    { not: null },
//                     maxScore: { not: null },
//                 },
//                 select: {
//                     score:    true,
//                     maxScore: true,
//                     gradeSubject: {
//                         select: {
//                             subject: { select: { name: true } },
//                         },
//                     },
//                 },
//             }),

//             // ── Students with at least one class enrollment (active) ───
//             prisma.profile.count({
//                 where: {
//                     schoolId,
//                     role:            'STUDENT',
//                     classEnrollments: { some: {} },
//                 },
//             }),

//             // ── Total students ─────────────────────────────────────────
//             prisma.profile.count({
//                 where: { schoolId, role: 'STUDENT' },
//             }),
//         ])

//         // ── Resolve grade names for each classId ───────────────────────
//         const classIds = [...new Set(gradeGroups.map(g => g.classId).filter(Boolean))] as string[]

//         const classes = await prisma.class.findMany({
//             where:  { id: { in: classIds } },
//             select: {
//                 id:    true,
//                 grade: { select: { displayName: true } },
//             },
//         })

//         const classGradeMap = new Map(
//             classes.map(c => [c.id, c.grade.displayName])
//         )

//         // Aggregate student counts per grade displayName
//         const gradeCountMap = new Map<string, number>()
//         for (const group of gradeGroups) {
//             if (!group.classId) continue
//             const gradeName = classGradeMap.get(group.classId) ?? 'Unknown'
//             gradeCountMap.set(
//                 gradeName,
//                 (gradeCountMap.get(gradeName) ?? 0) + group._count.studentId
//             )
//         }

//         const gradeDistribution: GradeDistributionItem[] = Array.from(
//             gradeCountMap.entries()
//         )
//             .map(([name, value]) => ({ name, value }))
//             .sort((a, b) => a.name.localeCompare(b.name))

//         // ── Aggregate assessment scores per subject ────────────────────
//         const subjectScoreMap = new Map<string, { scores: number[]; highest: number }>()

//         for (const a of assessments) {
//             const subjectName = a.gradeSubject?.subject?.name
//             if (!subjectName || a.score === null || a.maxScore === null || a.maxScore === 0) continue

//             const pct = (a.score / a.maxScore) * 100
//             const existing = subjectScoreMap.get(subjectName)

//             if (existing) {
//                 existing.scores.push(pct)
//                 existing.highest = Math.max(existing.highest, pct)
//             } else {
//                 subjectScoreMap.set(subjectName, { scores: [pct], highest: pct })
//             }
//         }

//         const assessmentScores: AssessmentScoreItem[] = Array.from(
//             subjectScoreMap.entries()
//         )
//             .map(([subject, { scores, highest }]) => ({
//                 subject: subject.length > 10 ? subject.slice(0, 10) + '.' : subject,
//                 average: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
//                 highest: Math.round(highest),
//             }))
//             .sort((a, b) => b.average - a.average)
//             .slice(0, 6) // top 6 subjects for readability

//         // ── Status distribution ────────────────────────────────────────
//         const unassigned = totalStudents - activeCount
//         const statusDistribution: StatusDistributionItem[] = [
//             { name: 'Enrolled',   value: activeCount  },
//             { name: 'Unassigned', value: unassigned   },
//         ].filter(s => s.value > 0)

//         return {
//             gradeDistribution,
//             assessmentScores,
//             statusDistribution,
//         }
//     } catch (err) {
//         console.error('getAnalyticsData error:', getErrorMessage(err))
//         return null
//     }
// }

'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface GradeDistributionItem {
    name:  string
    value: number
}

export interface AssessmentScoreItem {
    subject: string
    average: number
    highest: number
}

export interface StatusDistributionItem {
    name:  string
    value: number
}

export interface AnalyticsData {
    gradeDistribution:  GradeDistributionItem[]
    assessmentScores:   AssessmentScoreItem[]
    statusDistribution: StatusDistributionItem[]
}

export interface UnassignedStudent {
    id:        string
    name:      string | null
    email:     string
    phone:     string | null
    createdAt: Date
}

export interface UnassignedStudentsData {
    students:      UnassignedStudent[]
    total:         number
    totalStudents: number
}

// ── Get Analytics Data ─────────────────────────────────────────────────────────

export async function getAnalyticsData(
    schoolId: string
): Promise<AnalyticsData | null> {
    try {
        const [
            gradeGroups,
            assessments,
            activeCount,
            totalStudents,
        ] = await Promise.all([

            prisma.classEnrollment.groupBy({
                by:    ['classId'],
                where: {
                    schoolId,
                    student: { role: 'STUDENT' },
                },
                _count: { studentId: true },
            }),

            prisma.assessment.findMany({
                where: {
                    schoolId,
                    score:    { not: null },
                    maxScore: { not: null },
                },
                select: {
                    score:    true,
                    maxScore: true,
                    gradeSubject: {
                        select: {
                            subject: { select: { name: true } },
                        },
                    },
                },
            }),

            prisma.profile.count({
                where: {
                    schoolId,
                    role:            'STUDENT',
                    classEnrollments: { some: {} },
                },
            }),

            prisma.profile.count({
                where: { schoolId, role: 'STUDENT' },
            }),
        ])

        // ── Resolve grade names ────────────────────────────────────────
        const classIds = [
            ...new Set(gradeGroups.map(g => g.classId).filter(Boolean))
        ] as string[]

        const classes = await prisma.class.findMany({
            where:  { id: { in: classIds } },
            select: {
                id:    true,
                grade: { select: { displayName: true } },
            },
        })

        const classGradeMap = new Map(
            classes.map(c => [c.id, c.grade.displayName])
        )

        const gradeCountMap = new Map<string, number>()
        for (const group of gradeGroups) {
            if (!group.classId) continue
            const gradeName = classGradeMap.get(group.classId) ?? 'Unknown'
            gradeCountMap.set(
                gradeName,
                (gradeCountMap.get(gradeName) ?? 0) + group._count.studentId
            )
        }

        const gradeDistribution: GradeDistributionItem[] = Array.from(
            gradeCountMap.entries()
        )
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => a.name.localeCompare(b.name))

        // ── Assessment scores ──────────────────────────────────────────
        const subjectScoreMap = new Map<string, { scores: number[]; highest: number }>()

        for (const a of assessments) {
            const subjectName = a.gradeSubject?.subject?.name
            if (!subjectName || a.score === null || a.maxScore === null || a.maxScore === 0) continue
            const pct      = (a.score / a.maxScore) * 100
            const existing = subjectScoreMap.get(subjectName)
            if (existing) {
                existing.scores.push(pct)
                existing.highest = Math.max(existing.highest, pct)
            } else {
                subjectScoreMap.set(subjectName, { scores: [pct], highest: pct })
            }
        }

        const assessmentScores: AssessmentScoreItem[] = Array.from(
            subjectScoreMap.entries()
        )
            .map(([subject, { scores, highest }]) => ({
                subject: subject.length > 10 ? subject.slice(0, 10) + '.' : subject,
                average: Math.round(scores.reduce((s, v) => s + v, 0) / scores.length),
                highest: Math.round(highest),
            }))
            .sort((a, b) => b.average - a.average)
            .slice(0, 6)

        // ── Status distribution ────────────────────────────────────────
        const unassigned = totalStudents - activeCount
        const statusDistribution: StatusDistributionItem[] = [
            { name: 'Enrolled',   value: activeCount },
            { name: 'Unassigned', value: unassigned  },
        ].filter(s => s.value > 0)

        return {
            gradeDistribution,
            assessmentScores,
            statusDistribution,
        }
    } catch (err) {
        console.error('getAnalyticsData error:', getErrorMessage(err))
        return null
    }
}

// ── Get Unassigned Students ────────────────────────────────────────────────────

export async function getUnassignedStudents(
    schoolId: string
): Promise<UnassignedStudentsData | null> {
    try {
        const [unassigned, totalStudents] = await Promise.all([
            prisma.profile.findMany({
                where: {
                    schoolId,
                    role:            'STUDENT',
                    classEnrollments: { none: {} },
                },
                orderBy: { createdAt: 'desc' },
                select: {
                    id:        true,
                    name:      true,
                    email:     true,
                    phone:     true,
                    createdAt: true,
                },
            }),
            prisma.profile.count({
                where: { schoolId, role: 'STUDENT' },
            }),
        ])

        return {
            students:      unassigned,
            total:         unassigned.length,
            totalStudents,
        }
    } catch (err) {
        console.error('getUnassignedStudents error:', getErrorMessage(err))
        return null
    }
}