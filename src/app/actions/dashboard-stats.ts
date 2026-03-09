// lib/actions/dashboard-stats.ts
import { prisma } from '@/lib/prisma'

export async function getSchoolDashboardStats(schoolId: string) {
    const [
        totalStudents,
        totalTeachers,
        assessmentStats,
        feedbackStats,
        whatsappCredits,
    ] = await Promise.all([
        // Count ALL students in school regardless of class enrollment
        prisma.profile.count({
            where: { schoolId, role: 'STUDENT' }
        }),

        // Count ALL teachers in school regardless of class assignment
        prisma.profile.count({
            where: { schoolId, role: 'TEACHER' }
        }),

        // Assessment completion
        prisma.assessment.aggregate({
            where: { schoolId },
            _count: { id: true },
        }).then(async (total) => {
            const completed = await prisma.assessment.count({
                where: { schoolId, score: { not: null } }
            })
            return { total: total._count.id, completed }
        }),

        // WhatsApp feedback
        prisma.feedback.count({
            where: { schoolId, sentAt: { not: null } }
        }),

        // Credits
        prisma.school.findUnique({
            where: { id: schoolId },
            select: { whatsappCredits: true }
        }),
    ])

    return {
        totalStudents,
        totalTeachers,
        assessmentStats,
        feedbackStats,
        whatsappCredits: whatsappCredits?.whatsappCredits ?? 0,
    }
}