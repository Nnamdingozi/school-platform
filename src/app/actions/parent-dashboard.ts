'use server';

import { prisma } from '@/lib/prisma';
import type {
    AssessmentRecord,
    ChildProfile,
    FeedbackRecord,
    SubjectProgress,
    TopicStatus,
} from '@/types/parent-dashboard';
import type { Notification } from '@prisma/client';

// ── Helpers ────────────────────────────────────────────────────────────────────

function safePercentage(score: number | null, maxScore: number | null): number | null {
    if (score == null || maxScore == null || maxScore === 0) return null;
    return (score / maxScore) * 100;
}

export function letterFromPercentage(pct: number | null): string {
    if (pct == null) return '-';
    if (pct >= 85)   return 'A';
    if (pct >= 70)   return 'B';
    if (pct >= 55)   return 'C';
    if (pct >= 40)   return 'D';
    return 'E';
}

// ── Get parent's children ──────────────────────────────────────────────────────

export async function getParentChildren(
    parentId: string,
    schoolId: string,
): Promise<ChildProfile[]> {
    const links = await prisma.parentStudent.findMany({
        where: { parentId, schoolId },
        include: {
            profiles_ParentStudent_studentIdToprofiles: {
                include: {
                    curriculum:       true,
                    classEnrollments: {
                        where: { schoolId },
                        include: {
                            gradeSubject: {
                                include: {
                                    grade: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    })

    return links
        .map((link) => link.profiles_ParentStudent_studentIdToprofiles)
        .filter((student): student is NonNullable<typeof student> => Boolean(student))
        .map((student) => {
            const firstEnrollment  = student.classEnrollments[0]
            const gradeDisplayName = firstEnrollment?.gradeSubject.grade.displayName ?? 'Unassigned'

            return {
                id:        student.id,
                name:      student.name ?? null,
                email:     student.email,
                grade:     gradeDisplayName,
                curriculum: student.curriculum.name,
                termLabel:  student.curriculum.termLabel,
            }
        })
}

// ── Get child subjects and progress ───────────────────────────────────────────

export async function getChildSubjectsAndProgress(
    studentId: string,
    schoolId:  string,
): Promise<SubjectProgress[]> {
    const enrollments = await prisma.classEnrollment.findMany({
        where: { studentId, schoolId },
        include: {
            gradeSubject: {
                include: {
                    subject:  true,
                    grade:    true,
                    teachers: true,
                    topics: {
                        where: { schoolId },
                        include: {
                            term:    true,
                            lessons: true, // Lesson | null (one-to-one)
                            assessments: {
                                where: { studentId, schoolId },
                            },
                        },
                    },
                    assessments: {
                        where: { studentId, schoolId },
                        include: {
                            feedbacks: true,
                            topic:     true,
                        },
                    },
                },
            },
        },
    })

    const progressByGradeSubject = new Map<string, SubjectProgress>()

    for (const enrollment of enrollments) {
        const gs = enrollment.gradeSubject
        if (!gs) continue

        if (progressByGradeSubject.has(gs.id)) continue

        // ── Assessments ──
        const assessments: AssessmentRecord[] = (gs.assessments ?? []).map((assessment) => {
            const pct = safePercentage(assessment.score, assessment.maxScore)
            const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
                message:    f.message,
                sentAt:     f.sentAt,
                whatsappSid: f.whatsappSid,
            }))

            return {
                id:          assessment.id,
                type:        assessment.type,
                score:       assessment.score,
                maxScore:    assessment.maxScore,
                pct,
                comments:    assessment.comments ?? null,
                topicTitle:  assessment.topic?.title ?? '',
                subjectName: gs.subject.name,
                createdAt:   assessment.createdAt,
                feedbacks,
            }
        })

        // ── Topics ──
        const topicStatuses: TopicStatus[] = gs.topics.map((topic) => {
            const topicAssessments = topic.assessments ?? []
            const latestAssessment = topicAssessments
                .filter((a) => a.studentId === studentId)
                .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
                .at(-1)

            const pct = latestAssessment
                ? safePercentage(latestAssessment.score, latestAssessment.maxScore)
                : null

            return {
                id:         topic.id,
                title:      topic.title,
                weekNumber: topic.weekNumber,
                termName:   topic.term.displayName,
                hasLesson:  topic.lessons !== null, // ✅ Lesson | null, not array
                assessment:
                    latestAssessment && pct != null && latestAssessment.maxScore != null
                        ? {
                            score:    latestAssessment.score ?? 0,
                            maxScore: latestAssessment.maxScore,
                            pct,
                        }
                        : null,
            }
        })

        // ── Average score ──
        const avgScore = (() => {
            if (!assessments.length) return null
            const valid = assessments
                .map((a) => a.pct)
                .filter((p): p is number => p != null)
            if (!valid.length) return null
            return valid.reduce((sum, v) => sum + v, 0) / valid.length
        })()

        progressByGradeSubject.set(gs.id, {
            gradeSubjectId: gs.id,
            subjectName:    gs.subject.name,
            teacherName:    gs.teachers[0]?.name ?? null,
            topics:         topicStatuses,
            assessments,
            avgScore,
        })
    }

    return Array.from(progressByGradeSubject.values())
}

// ── Get child assessment history ───────────────────────────────────────────────

export async function getChildAssessmentHistory(
    studentId: string,
    schoolId:  string,
): Promise<AssessmentRecord[]> {
    const assessments = await prisma.assessment.findMany({
        where:   { studentId, schoolId },
        orderBy: { createdAt: 'desc' },
        include: {
            topic: true,
            gradeSubject: {
                include: {
                    subject: true,
                },
            },
            feedbacks: true,
        },
    })

    return assessments.map((assessment) => {
        const pct = safePercentage(assessment.score, assessment.maxScore)
        const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
            message:     f.message,
            sentAt:      f.sentAt,
            whatsappSid: f.whatsappSid,
        }))

        return {
            id:          assessment.id,
            type:        assessment.type,
            score:       assessment.score,
            maxScore:    assessment.maxScore,
            pct,
            comments:    assessment.comments ?? null,
            topicTitle:  assessment.topic?.title ?? '',
            subjectName: assessment.gradeSubject.subject.name,
            createdAt:   assessment.createdAt,
            feedbacks,
        }
    })
}

// ── Get child notifications ────────────────────────────────────────────────────

export async function getChildNotifications(
    studentId: string,
    schoolId:  string,
): Promise<Notification[]> {
    return prisma.notification.findMany({
        where: {
            userId: studentId,
            read:   false,
            user: {
                schoolId,
            },
        },
        orderBy: { createdAt: 'desc' },
    })
}
