// 'use server';

// import { prisma } from '@/lib/prisma';
// import type {
//     AssessmentRecord,
//     ChildProfile,
//     FeedbackRecord,
//     SubjectProgress,
//     TopicStatus,
// } from '@/types/parent-dashboard';
// import type { Notification } from '@prisma/client';

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function safePercentage(score: number | null, maxScore: number | null): number | null {
//     if (score == null || maxScore == null || maxScore === 0) return null;
//     return (score / maxScore) * 100;
// }


// // ── Get parent's children ──────────────────────────────────────────────────────

// export async function getParentChildren(
//     parentId: string,
//     schoolId: string,
// ): Promise<ChildProfile[]> {
//     const links = await prisma.parentStudent.findMany({
//         where: { parentId, schoolId },
//         include: {
//             student: {                    // ✅ matches field name in merged schema
//                 include: {
//                     curriculum:       true,
//                     classEnrollments: {
//                         where: { schoolId },
//                         include: {
//                             gradeSubject: {
//                                 include: {
//                                     grade: true,
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     })

//     return links
//         .map((link) => link.student)     // ✅ matches field name
//         .filter((student): student is NonNullable<typeof student> => Boolean(student))
//         .map((student) => {
//             const firstEnrollment  = student.classEnrollments[0]
//             const gradeDisplayName = firstEnrollment?.gradeSubject.grade.displayName ?? 'Unassigned'

//             return {
//                 id:         student.id,
//                 name:       student.name ?? null,
//                 email:      student.email,
//                 grade:      gradeDisplayName,
//                 curriculum: student.curriculum.name,
//                 termLabel:  student.curriculum.termLabel,
//             }
//         })
// }
// // ── Get child subjects and progress ───────────────────────────────────────────

// export async function getChildSubjectsAndProgress(
//     studentId: string,
//     schoolId:  string,
// ): Promise<SubjectProgress[]> {
//     const enrollments = await prisma.classEnrollment.findMany({
//         where: { studentId, schoolId },
//         include: {
//             gradeSubject: {
//                 include: {
//                     subject:  true,
//                     grade:    true,
//                     teachers: true,
//                     topics: {
//                         where: { schoolId },
//                         include: {
//                             term:    true,
//                             lessons: true, // Lesson | null (one-to-one)
//                             assessments: {
//                                 where: { studentId, schoolId },
//                             },
//                         },
//                     },
//                     assessments: {
//                         where: { studentId, schoolId },
//                         include: {
//                             feedbacks: true,
//                             topic:     true,
//                         },
//                     },
//                 },
//             },
//         },
//     })

//     const progressByGradeSubject = new Map<string, SubjectProgress>()

//     for (const enrollment of enrollments) {
//         const gs = enrollment.gradeSubject
//         if (!gs) continue

//         if (progressByGradeSubject.has(gs.id)) continue

//         // ── Assessments ──
//         const assessments: AssessmentRecord[] = (gs.assessments ?? []).map((assessment) => {
//             const pct = safePercentage(assessment.score, assessment.maxScore)
//             const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
//                 message:    f.message,
//                 sentAt:     f.sentAt,
//                 whatsappSid: f.whatsappSid,
//             }))

//             return {
//                 id:          assessment.id,
//                 type:        assessment.type,
//                 score:       assessment.score,
//                 maxScore:    assessment.maxScore,
//                 pct,
//                 comments:    assessment.comments ?? null,
//                 topicTitle:  assessment.topic?.title ?? '',
//                 subjectName: gs.subject.name,
//                 createdAt:   assessment.createdAt,
//                 feedbacks,
//             }
//         })

//         // ── Topics ──
//         const topicStatuses: TopicStatus[] = gs.topics.map((topic) => {
//             const topicAssessments = topic.assessments ?? []
//             const latestAssessment = topicAssessments
//                 .filter((a) => a.studentId === studentId)
//                 .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
//                 .at(-1)

//             const pct = latestAssessment
//                 ? safePercentage(latestAssessment.score, latestAssessment.maxScore)
//                 : null

//             return {
//                 id:         topic.id,
//                 title:      topic.title,
//                 weekNumber: topic.weekNumber,
//                 termName:   topic.term.displayName,
//                 hasLesson:  topic.lessons !== null, // ✅ Lesson | null, not array
//                 assessment:
//                     latestAssessment && pct != null && latestAssessment.maxScore != null
//                         ? {
//                             score:    latestAssessment.score ?? 0,
//                             maxScore: latestAssessment.maxScore,
//                             pct,
//                         }
//                         : null,
//             }
//         })

//         // ── Average score ──
//         const avgScore = (() => {
//             if (!assessments.length) return null
//             const valid = assessments
//                 .map((a) => a.pct)
//                 .filter((p): p is number => p != null)
//             if (!valid.length) return null
//             return valid.reduce((sum, v) => sum + v, 0) / valid.length
//         })()

//         progressByGradeSubject.set(gs.id, {
//             gradeSubjectId: gs.id,
//             subjectName:    gs.subject.name,
//             teacherName:    gs.teachers[0]?.name ?? null,
//             topics:         topicStatuses,
//             assessments,
//             avgScore,
//         })
//     }

//     return Array.from(progressByGradeSubject.values())
// }

// // ── Get child assessment history ───────────────────────────────────────────────

// export async function getChildAssessmentHistory(
//     studentId: string,
//     schoolId:  string,
// ): Promise<AssessmentRecord[]> {
//     const assessments = await prisma.assessment.findMany({
//         where:   { studentId, schoolId },
//         orderBy: { createdAt: 'desc' },
//         include: {
//             topic: true,
//             gradeSubject: {
//                 include: {
//                     subject: true,
//                 },
//             },
//             feedbacks: true,
//         },
//     })

//     return assessments.map((assessment) => {
//         const pct = safePercentage(assessment.score, assessment.maxScore)
//         const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
//             message:     f.message,
//             sentAt:      f.sentAt,
//             whatsappSid: f.whatsappSid,
//         }))

//         return {
//             id:          assessment.id,
//             type:        assessment.type,
//             score:       assessment.score,
//             maxScore:    assessment.maxScore,
//             pct,
//             comments:    assessment.comments ?? null,
//             topicTitle:  assessment.topic?.title ?? '',
//             subjectName: assessment.gradeSubject.subject.name,
//             createdAt:   assessment.createdAt,
//             feedbacks,
//         }
//     })
// }

// // ── Get child notifications ────────────────────────────────────────────────────

// export async function getChildNotifications(
//     studentId: string,
//     schoolId:  string,
// ): Promise<Notification[]> {
//     return prisma.notification.findMany({
//         where: {
//             userId: studentId,
//             read:   false,
//             user: {
//                 schoolId,
//             },
//         },
//         orderBy: { createdAt: 'desc' },
//     })
// }



// 'use server';

// import { prisma } from '@/lib/prisma';
// import { EnrollmentStatus } from '@prisma/client';
// import type {
//     AssessmentRecord,
//     ChildProfile,
//     FeedbackRecord,
//     SubjectProgress,
//     TopicStatus,
// } from '@/types/parent-dashboard';
// import type { Notification } from '@prisma/client';

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function safePercentage(score: number | null, maxScore: number | null): number | null {
//     if (score == null || maxScore == null || maxScore === 0) return null;
//     return (score / maxScore) * 100;
// }

// // ── Get parent's children ──────────────────────────────────────────────────────

// export async function getParentChildren(
//     parentId: string,
//     schoolId: string,
// ): Promise<ChildProfile[]> {
//     const links = await prisma.parentStudent.findMany({
//         where: { parentId, schoolId },
//         include: {
//             student: {
//                 include: {
//                     curriculum: true,
//                     classEnrollments: {
//                         where: { schoolId },
//                         include: {
//                             class: {
//                                 include: {
//                                     grade: true,
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     return links
//         .map((link) => link.student)
//         .filter((student): student is NonNullable<typeof student> => Boolean(student))
//         .map((student) => {
//             // Updated: Access grade through Class -> Grade (Placement logic)
//             const firstEnrollment = student.classEnrollments[0];
//             const gradeDisplayName = firstEnrollment?.class?.grade.displayName ?? 'Unassigned';

//             return {
//                 id: student.id,
//                 name: student.name ?? null,
//                 email: student.email,
//                 grade: gradeDisplayName,
//                 curriculum: student.curriculum.name,
//                 termLabel: student.curriculum.termLabel,
//             };
//         });
// }

// // ── Get child subjects and progress ───────────────────────────────────────────

// export async function getChildSubjectsAndProgress(
//     studentId: string,
//     schoolId: string,
// ): Promise<SubjectProgress[]> {
//     // UPDATED: Now queries StudentSubject instead of ClassEnrollment
//     const subjectAllocations = await prisma.studentSubject.findMany({
//         where: { 
//             studentId, 
//             schoolId,
//             status: EnrollmentStatus.APPROVED // Only show confirmed subjects
//         },
//         include: {
//             gradeSubject: {
//                 include: {
//                     subject: true,
//                     grade: true,
//                     teachers: true,
//                     topics: {
//                         where: { schoolId },
//                         include: {
//                             term: true,
//                             lessons: true,
//                             assessments: {
//                                 where: { studentId, schoolId },
//                             },
//                         },
//                     },
//                     assessments: {
//                         where: { studentId, schoolId },
//                         include: {
//                             feedbacks: true,
//                             topic: true,
//                         },
//                     },
//                 },
//             },
//         },
//     });

//     const progressList: SubjectProgress[] = [];

//     for (const allocation of subjectAllocations) {
//         const gs = allocation.gradeSubject;
//         if (!gs) continue;

//         // ── Assessments ──
//         const assessments: AssessmentRecord[] = (gs.assessments ?? []).map((assessment) => {
//             const pct = safePercentage(assessment.score, assessment.maxScore);
//             const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
//                 message: f.message,
//                 sentAt: f.sentAt,
//                 whatsappSid: f.whatsappSid,
//             }));

//             return {
//                 id: assessment.id,
//                 type: assessment.type,
//                 score: assessment.score,
//                 maxScore: assessment.maxScore,
//                 pct,
//                 comments: assessment.comments ?? null,
//                 topicTitle: assessment.topic?.title ?? '',
//                 subjectName: gs.subject.name,
//                 createdAt: assessment.createdAt,
//                 feedbacks,
//             };
//         });

//         // ── Topics ──
//         const topicStatuses: TopicStatus[] = gs.topics.map((topic) => {
//             const topicAssessments = topic.assessments ?? [];
//             const latestAssessment = topicAssessments
//                 .filter((a) => a.studentId === studentId)
//                 .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//                 .at(0);

//             const pct = latestAssessment
//                 ? safePercentage(latestAssessment.score, latestAssessment.maxScore)
//                 : null;

//             return {
//                 id: topic.id,
//                 title: topic.title,
//                 weekNumber: topic.weekNumber,
//                 termName: topic.term.displayName,
//                 hasLesson: topic.lessons !== null,
//                 assessment:
//                     latestAssessment && pct != null && latestAssessment.maxScore != null
//                         ? {
//                               score: latestAssessment.score ?? 0,
//                               maxScore: latestAssessment.maxScore,
//                               pct,
//                           }
//                         : null,
//             };
//         });

//         // ── Average score ──
//         const avgScore = (() => {
//             const scoresWithPct = assessments
//                 .map((a) => a.pct)
//                 .filter((p): p is number => p != null);
//             if (!scoresWithPct.length) return null;
//             return scoresWithPct.reduce((sum, v) => sum + v, 0) / scoresWithPct.length;
//         })();

//         progressList.push({
//             gradeSubjectId: gs.id,
//             subjectName: gs.subject.name,
//             teacherName: gs.teachers[0]?.name ?? null,
//             topics: topicStatuses,
//             assessments,
//             avgScore,
//         });
//     }

//     return progressList;
// }

// // ── Get child assessment history ───────────────────────────────────────────────

// export async function getChildAssessmentHistory(
//     studentId: string,
//     schoolId: string,
// ): Promise<AssessmentRecord[]> {
//     const assessments = await prisma.assessment.findMany({
//         where: { studentId, schoolId },
//         orderBy: { createdAt: 'desc' },
//         include: {
//             topic: true,
//             gradeSubject: {
//                 include: {
//                     subject: true,
//                 },
//             },
//             feedbacks: true,
//         },
//     });

//     return assessments.map((assessment) => {
//         const pct = safePercentage(assessment.score, assessment.maxScore);
//         const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
//             message: f.message,
//             sentAt: f.sentAt,
//             whatsappSid: f.whatsappSid,
//         }));

//         return {
//             id: assessment.id,
//             type: assessment.type,
//             score: assessment.score,
//             maxScore: assessment.maxScore,
//             pct,
//             comments: assessment.comments ?? null,
//             topicTitle: assessment.topic?.title ?? '',
//             subjectName: assessment.gradeSubject.subject.name,
//             createdAt: assessment.createdAt,
//             feedbacks,
//         };
//     });
// }

// // ── Get child notifications ────────────────────────────────────────────────────

// export async function getChildNotifications(
//     studentId: string,
//     schoolId: string,
// ): Promise<Notification[]> {
//     return prisma.notification.findMany({
//         where: {
//             userId: studentId,
//             read: false,
//             user: {
//                 schoolId,
//             },
//         },
//         orderBy: { createdAt: 'desc' },
//     });
// }



// 'use server';

// import { prisma } from '@/lib/prisma';
// import { EnrollmentStatus, Notification } from '@prisma/client';
// import type {
//     AssessmentRecord,
//     ChildProfile,
//     FeedbackRecord,
//     SubjectProgress,
//     TopicStatus,
// } from '@/types/parent-dashboard';
// import { getErrorMessage } from '@/lib/error-handler';

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function safePercentage(score: number | null, maxScore: number | null): number | null {
//     if (score == null || maxScore == null || maxScore === 0) return null;
//     return (score / maxScore) * 100;
// }

// // ── Get parent's children ──────────────────────────────────────────────────────

// export async function getParentChildren(
//     parentId: string,
//     schoolId: string,
// ): Promise<ChildProfile[]> {
//     try {
//         const links = await prisma.parentStudent.findMany({
//             where: { parentId, schoolId },
//             include: {
//                 student: {
//                     include: {
//                         curriculum: true,
//                         classEnrollments: {
//                             where: { schoolId },
//                             include: {
//                                 class: {
//                                     include: {
//                                         grade: true,
//                                     },
//                                 },
//                             },
//                         },
//                     },
//                 },
//             },
//         });

//         return links
//             .map((link) => link.student)
//             .filter((student): student is NonNullable<typeof student> => Boolean(student))
//             .map((student) => {
//                 const firstEnrollment = student.classEnrollments[0];
//                 const gradeDisplayName = firstEnrollment?.class?.grade.displayName ?? 'Unassigned';

//                 return {
//                     id: student.id,
//                     name: student.name ?? null,
//                     email: student.email,
//                     grade: gradeDisplayName,
//                     curriculum: student.curriculum.name,
//                     termLabel: student.curriculum.termLabel,
//                 };
//             });
//     } catch (error) {
//         console.error("[GET_PARENT_CHILDREN_ERROR]:", getErrorMessage(error));
//         return [];
//     }
// }

// // ── Get child subjects and progress ───────────────────────────────────────────

// export async function getChildSubjectsAndProgress(
//     studentId: string,
//     schoolId: string,
// ): Promise<SubjectProgress[]> {
//     try {
//         const subjectAllocations = await prisma.studentSubject.findMany({
//             where: { 
//                 studentId, 
//                 schoolId,
//                 status: EnrollmentStatus.APPROVED 
//             },
//             include: {
//                 gradeSubject: {
//                     include: {
//                         subject: true,
//                         grade: true,
//                         teachers: true,
//                         topics: {
//                             where: { 
//                                 OR: [
//                                     { schoolId },
//                                     { schoolId: null }
//                                 ]
//                             },
//                             include: {
//                                 term: true,
//                                 // FIXED: Using correct relation names from schema
//                                 GlobalLesson: { select: { id: true } },
//                                 SchoolLesson: { 
//                                     where: { schoolId },
//                                     select: { id: true } 
//                                 },
//                                 assessments: {
//                                     where: { studentId, schoolId },
//                                 },
//                             },
//                         },
//                         assessments: {
//                             where: { studentId, schoolId },
//                             include: {
//                                 feedbacks: true,
//                                 topic: true,
//                             },
//                         },
//                     },
//                 },
//             },
//         });

//         const progressList: SubjectProgress[] = [];

//         for (const allocation of subjectAllocations) {
//             const gs = allocation.gradeSubject;
//             if (!gs) continue;

//             const assessments: AssessmentRecord[] = (gs.assessments ?? []).map((assessment) => {
//                 const pct = safePercentage(assessment.score, assessment.maxScore);
//                 const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
//                     message: f.message,
//                     sentAt: f.sentAt,
//                     whatsappSid: f.whatsappSid,
//                 }));

//                 return {
//                     id: assessment.id,
//                     type: assessment.type,
//                     score: assessment.score,
//                     maxScore: assessment.maxScore,
//                     pct,
//                     comments: assessment.comments ?? null,
//                     topicTitle: assessment.topic?.title ?? '',
//                     subjectName: gs.subject.name,
//                     createdAt: assessment.createdAt,
//                     feedbacks,
//                 };
//             });

//             const topicStatuses: TopicStatus[] = gs.topics.map((topic) => {
//                 const topicAssessments = topic.assessments ?? [];
//                 const latestAssessment = [...topicAssessments]
//                     .filter((a) => a.studentId === studentId)
//                     .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
//                     .at(0);

//                 const pct = latestAssessment
//                     ? safePercentage(latestAssessment.score, latestAssessment.maxScore)
//                     : null;

//                 return {
//                     id: topic.id,
//                     title: topic.title,
//                     weekNumber: topic.weekNumber,
//                     termName: topic.term.displayName,
//                     /**
//                      * FIXED: Check for existence of either a Global blueprint 
//                      * or a school-specific customized lesson.
//                      */
//                     hasLesson: topic.GlobalLesson.length > 0 || topic.SchoolLesson.length > 0,
//                     assessment:
//                         latestAssessment && pct != null && latestAssessment.maxScore != null
//                             ? {
//                                   score: latestAssessment.score ?? 0,
//                                   maxScore: latestAssessment.maxScore,
//                                   pct,
//                               }
//                             : null,
//                 };
//             });

//             const avgScore = (() => {
//                 const scoresWithPct = assessments
//                     .map((a) => a.pct)
//                     .filter((p): p is number => p != null);
//                 if (!scoresWithPct.length) return null;
//                 return scoresWithPct.reduce((sum, v) => sum + v, 0) / scoresWithPct.length;
//             })();

//             progressList.push({
//                 gradeSubjectId: gs.id,
//                 subjectName: gs.subject.name,
//                 teacherName: gs.teachers[0]?.name ?? null,
//                 topics: topicStatuses,
//                 assessments,
//                 avgScore,
//             });
//         }

//         return progressList;
//     } catch (error) {
//         console.error("[GET_CHILD_PROGRESS_ERROR]:", getErrorMessage(error));
//         return [];
//     }
// }

// // ── Get child assessment history ───────────────────────────────────────────────

// export async function getChildAssessmentHistory(
//     studentId: string,
//     schoolId: string,
// ): Promise<AssessmentRecord[]> {
//     try {
//         const assessments = await prisma.assessment.findMany({
//             where: { studentId, schoolId },
//             orderBy: { createdAt: 'desc' },
//             include: {
//                 topic: true,
//                 gradeSubject: {
//                     include: {
//                         subject: true,
//                     },
//                 },
//                 feedbacks: true,
//             },
//         });

//         return assessments.map((assessment) => {
//             const pct = safePercentage(assessment.score, assessment.maxScore);
//             const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
//                 message: f.message,
//                 sentAt: f.sentAt,
//                 whatsappSid: f.whatsappSid,
//             }));

//             return {
//                 id: assessment.id,
//                 type: assessment.type,
//                 score: assessment.score,
//                 maxScore: assessment.maxScore,
//                 pct,
//                 comments: assessment.comments ?? null,
//                 topicTitle: assessment.topic?.title ?? '',
//                 subjectName: assessment.gradeSubject.subject.name,
//                 createdAt: assessment.createdAt,
//                 feedbacks,
//             };
//         });
//     } catch (error) {
//         console.error("[GET_CHILD_HISTORY_ERROR]:", getErrorMessage(error));
//         return [];
//     }
// }

// // ── Get child notifications ────────────────────────────────────────────────────

// export async function getChildNotifications(
//     studentId: string,
//     schoolId: string,
// ): Promise<Notification[]> {
//     try {
//         return await prisma.notification.findMany({
//             where: {
//                 userId: studentId,
//                 read: false,
//                 user: {
//                     schoolId,
//                 },
//             },
//             orderBy: { createdAt: 'desc' },
//         });
//     } catch (error) {
//         console.error("[GET_CHILD_NOTIFS_ERROR]:", getErrorMessage(error));
//         return [];
//     }
// }

'use server';

import { prisma } from '@/lib/prisma';
import { EnrollmentStatus, Notification, Prisma, Role } from '@prisma/client';
import type {
    AssessmentRecord,
    ChildProfile,
    FeedbackRecord,
    SubjectProgress,
    TopicStatus,
} from '@/types/parent-dashboard';
import { getErrorMessage } from '@/lib/error-handler';
import { academicCoreScope, contentScope } from '@/lib/content-scope';

// ── Helpers ────────────────────────────────────────────────────────────────────

function safePercentage(score: number | null, maxScore: number | null): number | null {
    if (score == null || maxScore == null || maxScore === 0) return null;
    return (score / maxScore) * 100;
}

/**
 * Rule 10: Security Guard
 * Ensures the parent has a legitimate link to the student.
 */
async function verifyParentStudentLink(parentId: string, studentId: string) {
    const link = await prisma.parentStudent.findFirst({
        where: { parentId, studentId }
    });
    if (!link) throw new Error("Unauthorized: Relationship not verified.");
    return link;
}

// ── Get parent's children (Tier 3 View) ────────────────────────────────────────

export async function getParentChildren(
    parentId: string,
    schoolId: string,
): Promise<ChildProfile[]> {
    try {
        const links = await prisma.parentStudent.findMany({
            where: { parentId, schoolId },
            include: {
                student: {
                    include: {
                        curriculum: true,
                        classEnrollments: {
                            where: { schoolId },
                            include: {
                                class: {
                                    include: {
                                        grade: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        return links
            .map((link) => link.student)
            .filter((student): student is NonNullable<typeof student> => Boolean(student))
            .map((student) => {
                const firstEnrollment = student.classEnrollments[0];
                const gradeDisplayName = firstEnrollment?.class?.grade.displayName ?? 'Unassigned';

                return {
                    id: student.id,
                    name: student.name ?? null,
                    email: student.email,
                    grade: gradeDisplayName,
                    curriculum: student.curriculum.name,
                    termLabel: student.curriculum.termLabel,
                };
            });
    } catch (error: unknown) {
        console.error("[GET_PARENT_CHILDREN_ERROR]:", getErrorMessage(error));
        return [];
    }
}

// ── Get child subjects and progress (Rule 3 & 5) ───────────────────────────────

export async function getChildSubjectsAndProgress(
    parentId: string,
    studentId: string,
    schoolId: string,
): Promise<SubjectProgress[]> {
    try {
        // Security Check
        await verifyParentStudentLink(parentId, studentId);

        const subjectAllocations = await prisma.studentSubject.findMany({
            where: { 
                studentId, 
                schoolId,
                status: EnrollmentStatus.APPROVED 
            },
            include: {
                gradeSubject: {
                    include: {
                        subject: true,
                        grade: true,
                        teachers: true,
                        topics: {
                            // Rule 7: Use standardized content scope
                            where: contentScope({ schoolId }),
                            include: {
                                term: true,
                                GlobalLesson: { select: { id: true } },
                                SchoolLesson: { 
                                    where: { schoolId },
                                    select: { id: true } 
                                },
                                assessments: {
                                    where: { studentId, schoolId },
                                },
                            },
                        },
                        assessments: {
                            where: { studentId, schoolId },
                            include: {
                                feedbacks: true,
                                topic: true,
                            },
                        },
                    },
                },
            },
        });

        const progressList: SubjectProgress[] = [];

        for (const allocation of subjectAllocations) {
            const gs = allocation.gradeSubject;
            if (!gs) continue;

            const assessments: AssessmentRecord[] = (gs.assessments ?? []).map((assessment) => {
                const pct = safePercentage(assessment.score, assessment.maxScore);
                const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
                    message: f.message,
                    sentAt: f.sentAt,
                    whatsappSid: f.whatsappSid,
                }));

                return {
                    id: assessment.id,
                    type: assessment.type,
                    score: assessment.score,
                    maxScore: assessment.maxScore,
                    pct,
                    comments: assessment.comments ?? null,
                    topicTitle: assessment.topic?.title ?? '',
                    subjectName: gs.subject.name,
                    createdAt: assessment.createdAt,
                    feedbacks,
                };
            });

            const topicStatuses: TopicStatus[] = gs.topics.map((topic) => {
                const topicAssessments = topic.assessments ?? [];
                const latestAssessment = [...topicAssessments]
                    .filter((a) => a.studentId === studentId)
                    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                    .at(0);

                const pct = latestAssessment
                    ? safePercentage(latestAssessment.score, latestAssessment.maxScore)
                    : null;

                return {
                    id: topic.id,
                    title: topic.title,
                    weekNumber: topic.weekNumber,
                    termName: topic.term.displayName,
                    // Rule 4/5: Parent sees if either platform-global or school-customized lesson exists
                    hasLesson: topic.GlobalLesson.length > 0 || topic.SchoolLesson.length > 0,
                    assessment:
                        latestAssessment && pct != null && latestAssessment.maxScore != null
                            ? {
                                  score: latestAssessment.score ?? 0,
                                  maxScore: latestAssessment.maxScore,
                                  pct,
                              }
                            : null,
                };
            });

            const avgScore = (() => {
                const scoresWithPct = assessments
                    .map((a) => a.pct)
                    .filter((p): p is number => p != null);
                if (!scoresWithPct.length) return null;
                return scoresWithPct.reduce((sum, v) => sum + v, 0) / scoresWithPct.length;
            })();

            progressList.push({
                gradeSubjectId: gs.id,
                subjectName: gs.subject.name,
                teacherName: gs.teachers[0]?.name ?? "Academic Staff",
                topics: topicStatuses,
                assessments,
                avgScore,
            });
        }

        return progressList;
    } catch (error: unknown) {
        console.error("[GET_CHILD_PROGRESS_ERROR]:", getErrorMessage(error));
        return [];
    }
}

// ── Get child assessment history (Tier 3 Privacy) ──────────────────────────────

export async function getChildAssessmentHistory(
    parentId: string,
    studentId: string,
    schoolId: string,
): Promise<AssessmentRecord[]> {
    try {
        await verifyParentStudentLink(parentId, studentId);

        const assessments = await prisma.assessment.findMany({
            where: { studentId, schoolId },
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
        });

        return assessments.map((assessment) => {
            const pct = safePercentage(assessment.score, assessment.maxScore);
            const feedbacks: FeedbackRecord[] = assessment.feedbacks.map((f) => ({
                message: f.message,
                sentAt: f.sentAt,
                whatsappSid: f.whatsappSid,
            }));

            return {
                id: assessment.id,
                type: assessment.type,
                score: assessment.score,
                maxScore: assessment.maxScore,
                pct,
                comments: assessment.comments ?? null,
                topicTitle: assessment.topic?.title ?? '',
                subjectName: assessment.gradeSubject.subject.name,
                createdAt: assessment.createdAt,
                feedbacks,
            };
        });
    } catch (error: unknown) {
        console.error("[GET_CHILD_HISTORY_ERROR]:", getErrorMessage(error));
        return [];
    }
}

// ── Get child notifications (Tier 3 Context) ──────────────────────────────────

export async function getChildNotifications(
    parentId: string,
    studentId: string,
    schoolId: string,
): Promise<Notification[]> {
    try {
        await verifyParentStudentLink(parentId, studentId);

        return await prisma.notification.findMany({
            where: {
                userId: studentId,
                read: false,
                user: {
                    schoolId,
                },
            },
            orderBy: { createdAt: 'desc' },
        });
    } catch (error: unknown) {
        console.error("[GET_CHILD_NOTIFS_ERROR]:", getErrorMessage(error));
        return [];
    }
}