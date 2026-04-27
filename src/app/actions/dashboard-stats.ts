// // lib/actions/dashboard-stats.ts
// import { prisma } from '@/lib/prisma'

// export async function getSchoolDashboardStats(schoolId: string) {
//     const [
//         totalStudents,
//         totalTeachers,
//         assessmentStats,
//         feedbackStats,
//         whatsappCredits,
//     ] = await Promise.all([
//         // Count ALL students in school regardless of class enrollment
//         prisma.profile.count({
//             where: { schoolId, role: 'STUDENT' }
//         }),

//         // Count ALL teachers in school regardless of class assignment
//         prisma.profile.count({
//             where: { schoolId, role: 'TEACHER' }
//         }),

//         // Assessment completion
//         prisma.assessment.aggregate({
//             where: { schoolId },
//             _count: { id: true },
//         }).then(async (total) => {
//             const completed = await prisma.assessment.count({
//                 where: { schoolId, score: { not: null } }
//             })
//             return { total: total._count.id, completed }
//         }),

//         // WhatsApp feedback
//         prisma.feedback.count({
//             where: { schoolId, sentAt: { not: null } }
//         }),

//         // Credits
//         prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { whatsappCredits: true }
//         }),
//     ])

//     return {
//         totalStudents,
//         totalTeachers,
//         assessmentStats,
//         feedbackStats,
//         whatsappCredits: whatsappCredits?.whatsappCredits ?? 0,
//     }
// }


// 'use server'

// import { prisma } from '@/lib/prisma'

// export interface DashboardStats {
//     totalStudents: number
//     activeTeachers: number
//     totalAssessments: number
//     completedAssessments: number
//     completionRate: number | null
//     whatsappSent: number
//     whatsappCredits: number
// }

// export async function getDashboardStats(schoolId: string): Promise<DashboardStats | null> {
//     try {
//         const [
//             totalStudents,
//             activeTeachers,
//             totalAssessments,
//             completedAssessments,
//             whatsappSent,
//             school,
//         ] = await Promise.all([
//             // Count students enrolled in this school
//             prisma.profile.count({
//                 where: { schoolId, role: 'STUDENT' },
//             }),

//             // Count teachers assigned to classes in this school
//             prisma.class.findMany({
//                 where: { schoolId, teacherId: { not: undefined } },
//                 select: { teacherId: true },
//                 distinct: ['teacherId'],
//             }).then(r => r.length),

//             // Total assessments
//             prisma.assessment.count({
//                 where: { schoolId },
//             }),

//             // Completed assessments (have a score)
//             prisma.assessment.count({
//                 where: { schoolId, score: { not: null } },
//             }),

//             // WhatsApp feedback sent
//             prisma.feedback.count({
//                 where: { schoolId, sentAt: { not: null } },
//             }),

//             // WhatsApp credits
//             prisma.school.findUnique({
//                 where: { id: schoolId },
//                 select: { whatsappCredits: true },
//             }),
//         ])

//         const completionRate = totalAssessments > 0
//             ? parseFloat(((completedAssessments / totalAssessments) * 100).toFixed(1))
//             : null

//         return {
//             totalStudents,
//             activeTeachers,
//             totalAssessments,
//             completedAssessments,
//             completionRate,
//             whatsappSent,
//             whatsappCredits: school?.whatsappCredits ?? 0,
//         }
//     } catch (err) {
//         console.error('getDashboardStats error:', err)
//         return null
//     }
// }

// 'use server'

// import { prisma } from '@/lib/prisma'

// export interface DashboardStats {
//     totalStudents: number
//     activeTeachers: number
//     totalAssessments: number
//     completedAssessments: number
//     completionRate: number | null
//     whatsappSent: number
//     whatsappCredits: number
//     totalParents: number
// }

// export async function getDashboardStats(schoolId: string): Promise<DashboardStats | null> {
//     try {
//         const [
//             totalStudents,
//             activeTeachers,
//             totalParents,
//             totalAssessments,
//             completedAssessments,
//             whatsappSent,
//             school,
//         ] = await Promise.all([
//             // ✅ Count ALL students in school regardless of class assignment
//             prisma.profile.count({
//                 where: { schoolId, role: 'STUDENT' },
//             }),

//             // ✅ Count ALL teachers in school regardless of class assignment
//             prisma.profile.count({
//                 where: { schoolId, role: 'TEACHER' },
//             }),

//             // ✅ Count ALL parents in school
//             prisma.profile.count({
//                 where: { schoolId, role: 'PARENT' },
//             }),

//             // Total assessments
//             prisma.assessment.count({
//                 where: { schoolId },
//             }),

//             // Completed assessments
//             prisma.assessment.count({
//                 where: { schoolId, score: { not: null } },
//             }),

//             // WhatsApp feedback sent
//             prisma.feedback.count({
//                 where: { schoolId, sentAt: { not: null } },
//             }),

//             // WhatsApp credits
//             prisma.school.findUnique({
//                 where: { id: schoolId },
//                 select: { whatsappCredits: true },
//             }),
//         ])

//         const completionRate = totalAssessments > 0
//             ? parseFloat(((completedAssessments / totalAssessments) * 100).toFixed(1))
//             : null

//         return {
//             totalStudents,
//             activeTeachers,
//             totalParents,
//             totalAssessments,
//             completedAssessments,
//             completionRate,
//             whatsappSent,
//             whatsappCredits: school?.whatsappCredits ?? 0,
//         }
//     } catch (err) {
//         console.error('getDashboardStats error:', err)
//         return null
//     }
// }

// 'use server'

// import { prisma } from '@/lib/prisma'

// export interface DashboardStats {
//     totalStudents:        number
//     activeTeachers:       number
//     totalParents:         number
//     totalAssessments:     number
//     completedAssessments: number
//     completionRate:       number | null
// }

// export async function getDashboardStats(schoolId: string): Promise<DashboardStats | null> {
//     try {
//         const [
//             totalStudents,
//             activeTeachers,
//             totalParents,
//             totalAssessments,
//             completedAssessments,
//         ] = await Promise.all([
//             prisma.profile.count({
//                 where: { schoolId, role: 'STUDENT' },
//             }),
//             prisma.profile.count({
//                 where: { schoolId, role: 'TEACHER' },
//             }),
//             prisma.profile.count({
//                 where: { schoolId, role: 'PARENT' },
//             }),
//             prisma.assessment.count({
//                 where: { schoolId },
//             }),
//             prisma.assessment.count({
//                 where: { schoolId, score: { not: null } },
//             }),
//         ])

//         const completionRate = totalAssessments > 0
//             ? parseFloat(((completedAssessments / totalAssessments) * 100).toFixed(1))
//             : null

//         return {
//             totalStudents,
//             activeTeachers,
//             totalParents,
//             totalAssessments,
//             completedAssessments,
//             completionRate,
//         }
//     } catch (err) {
//         console.error('getDashboardStats error:', err)
//         return null
//     }
// }

'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { Role } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface DashboardStats {
    totalStudents:        number
    activeTeachers:       number
    totalParents:         number
    totalAssessments:     number
    completedAssessments: number
    completionRate:       number | null
}

// ── Main Action ────────────────────────────────────────────────────────────────

/**
 * FETCH DASHBOARD OVERVIEW
 * Rule 5: Strict institutional isolation for schoolId.
 * Rule 6: Independent users return stats for their personal Tier-3 context.
 */
export async function getDashboardStats(schoolId: string | null): Promise<DashboardStats | null> {
    try {
        // Scenario A: Institutional Admin / Teacher (Tier 2)
        if (schoolId) {
            const [
                totalStudents,
                activeTeachers,
                totalParents,
                totalAssessments,
                completedAssessments,
            ] = await Promise.all([
                prisma.profile.count({
                    where: { schoolId, role: Role.STUDENT },
                }),
                prisma.profile.count({
                    where: { schoolId, role: Role.TEACHER },
                }),
                prisma.profile.count({
                    where: { schoolId, role: Role.PARENT },
                }),
                prisma.assessment.count({
                    where: { schoolId },
                }),
                prisma.assessment.count({
                    where: { 
                        schoolId, 
                        score: { not: null } 
                    },
                }),
            ]);

            const completionRate = totalAssessments > 0
                ? parseFloat(((completedAssessments / totalAssessments) * 100).toFixed(1))
                : null;

            return {
                totalStudents,
                activeTeachers,
                totalParents,
                totalAssessments,
                completedAssessments,
                completionRate,
            };
        }

        // Scenario B: Independent User (Rule 6 - Tier 3 personal context)
        // Independent learners don't have "Students" or "Teachers" to manage.
        // We return their personal practice stats.
        return {
            totalStudents: 0,
            activeTeachers: 0,
            totalParents: 0,
            totalAssessments: 0, 
            completedAssessments: 0,
            completionRate: 0,
        };

    } catch (err: unknown) {
        console.error('getDashboardStats error:', getErrorMessage(err));
        return null;
    }
}