'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { AssessmentType, Role, Prisma } from '@prisma/client'
import { type EnhancedLessonContent } from '@/app/actions/ai-generator'
import { getErrorMessage } from '@/lib/error-handler'

// ── Types ────────────────────────────────────────────────────────────────────

interface SubmitQuizParams {
    topicId: string
    gradeSubjectId: string
    schoolId: string | null
    studentId: string
    userRole: Role
    /** quiz question index → the option text the student selected */
    answers: Record<number, string>
}

export interface QuizQuestionResult {
    question: string
    selected: string
    correctAnswer: string
    isCorrect: boolean
    explanation: string
}

interface SubmitQuizResult {
    success: boolean
    error?: string
    alreadySubmitted?: boolean
    score?: number
    maxScore?: number
    results?: QuizQuestionResult[]
}

export interface ExistingQuizAttempt {
    score: number
    maxScore: number
    results: QuizQuestionResult[]
}

/**
 * SUBMIT QUIZ ASSESSMENT
 * Re-fetches the authoritative quiz content server-side and grades against
 * it — the client never sends correctness/score, only selected answers.
 *
 * ATTEMPT POLICY:
 * - School-attached STUDENT: single attempt. If an Assessment already
 *   exists for this topic, the existing result is returned unchanged
 *   rather than creating a duplicate — enforces "counts once" grading.
 * - INDIVIDUAL_LEARNER: unlimited attempts. Each submission creates a
 *   new Assessment row — this is practice, not a graded, single-shot exam.
 *
 * Per-question review data is stored in the dedicated `responses` Json
 * field on Assessment — `comments` remains free for actual freeform notes.
 */
export async function submitQuizAssessment({
    topicId,
    gradeSubjectId,
    schoolId,
    studentId,
    userRole,
    answers,
}: SubmitQuizParams): Promise<SubmitQuizResult> {
    try {
        const isSingleAttemptRole = userRole === Role.STUDENT && schoolId !== null;

        // School students: if they've already attempted this topic's quiz,
        // return the existing result instead of grading again.
        if (isSingleAttemptRole) {
            const existing = await prisma.assessment.findFirst({
                where: { studentId, topicId, type: AssessmentType.TOPIC_BASED },
                orderBy: { createdAt: 'desc' },
            });

            if (existing && existing.score !== null && existing.maxScore !== null) {
                return {
                    success: true,
                    alreadySubmitted: true,
                    score: existing.score,
                    maxScore: existing.maxScore,
                    results: (existing.responses as unknown as QuizQuestionResult[] | null) ?? [],
                };
            }
        }

        // Resolve the same content source getStudentLesson would have used
        let quiz: EnhancedLessonContent['studentContent']['quiz'] | null = null;

        if (schoolId) {
            const schoolLesson = await prisma.schoolLesson.findUnique({
                where: { topicId_schoolId: { topicId, schoolId } },
                include: { globalLesson: true },
            });
            if (schoolLesson) {
                const rawContent = (schoolLesson.customContent ?? schoolLesson.globalLesson.aiContent) as unknown as EnhancedLessonContent;
                quiz = rawContent.studentContent.quiz;
            }
        }

        if (!quiz) {
            const globalLesson = await prisma.globalLesson.findFirst({
                where: { topicId },
                orderBy: { isGlobal: 'desc' },
            });
            if (globalLesson) {
                const rawContent = (globalLesson.aiContent as unknown) as EnhancedLessonContent;
                quiz = rawContent.studentContent.quiz;
            }
        }

        if (!quiz || quiz.length === 0) {
            return { success: false, error: 'No quiz found for this module.' };
        }

        let score = 0;
        const results: QuizQuestionResult[] = quiz.map((q, idx) => {
            const selected = answers[idx] ?? '';
            const isCorrect = selected === q.answer;
            if (isCorrect) score += 1;
            return {
                question: q.question,
                selected,
                correctAnswer: q.answer,
                isCorrect,
                explanation: q.explanation,
            };
        });

        const maxScore = quiz.length;

        await prisma.assessment.create({
            data: {
                // TOPIC_BASED — this quiz is scoped to a single Topic, not a
                // weekly/termly/yearly rollup assessment.
                type: AssessmentType.TOPIC_BASED,
                studentId,
                gradeSubjectId,
                topicId,
                schoolId,
                score,
                maxScore,
                responses: results as unknown as Prisma.InputJsonValue,
            },
        });

        revalidatePath(`/student/lessons/${topicId}`);

        return { success: true, alreadySubmitted: false, score, maxScore, results };
    } catch (err: unknown) {
        console.error('[QUIZ_SUBMIT_FAULT]:', getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * GET EXISTING QUIZ ATTEMPT
 * Used at page-load time so a school student who already completed this
 * topic's quiz sees their locked, graded result immediately — instead of
 * a fresh interactive form they could no-op resubmit against.
 * Not used for individual learners — they always start fresh (practice).
 */
export async function getExistingQuizAttempt(
    topicId: string,
    studentId: string
): Promise<ExistingQuizAttempt | null> {
    try {
        const existing = await prisma.assessment.findFirst({
            where: { studentId, topicId, type: AssessmentType.TOPIC_BASED },
            orderBy: { createdAt: 'desc' },
        });

        if (!existing || existing.score === null || existing.maxScore === null) {
            return null;
        }

        return {
            score: existing.score,
            maxScore: existing.maxScore,
            results: (existing.responses as unknown as QuizQuestionResult[] | null) ?? [],
        };
    } catch (err: unknown) {
        console.error('[QUIZ_ATTEMPT_FETCH_FAULT]:', getErrorMessage(err));
        return null;
    }
}