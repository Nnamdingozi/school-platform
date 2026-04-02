// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory } from '@prisma/client'
// import { google } from "@ai-sdk/google"
// import { generateObject } from "ai"
// import { z } from "zod"
// import { revalidatePath } from 'next/cache'

// const ExamQuestionsSchema = z.object({
//   questions: z.array(z.object({
//     text: z.string(),
//     options: z.array(z.string()),
//     correctAnswer: z.string(),
//     explanation: z.string(),
//   }))
// })

// export interface ExamGenerationConfig {
//     title: string
//     type: AssessmentType
//     schoolId: string
//     classId: string
//     termId: string
//     topicIds: string[]
//     totalQuestions: number
//     reusePercentage: number // 0 to 100
//     duration: number
// }



// /**
//  * TEACHER: Generates a composite exam
//  */
// export async function generateCompositeExam(config: ExamGenerationConfig) {
//     try {
//         const reuseCount = Math.floor(config.totalQuestions * (config.reusePercentage / 100))
//         const newCount = config.totalQuestions - reuseCount

//         let finalQuestionIds: string[] = []

//         // 1. Pull Existing Questions (The "Revision" Strategy)
//         if (reuseCount > 0) {
//             const existing = await prisma.question.findMany({
//                 where: {
//                     topicId: { in: config.topicIds },
//                     OR: [{ schoolId: config.schoolId }, { schoolId: null }]
//                 }
//             })
//             // Shuffle and pick
//             const shuffled = existing.sort(() => 0.5 - Math.random())
//             finalQuestionIds.push(...shuffled.slice(0, reuseCount).map(q => q.id))
//         }

//         // 2. Generate NEW Questions via AI (The "Unseen" Strategy)
//         if (newCount > 0) {
//             const topics = await prisma.topic.findMany({
//                 where: { id: { in: config.topicIds } },
//                 select: { title: true, description: true }
//             })

//             const topicContext = topics.map(t => t.title).join(", ")
            
//             const { object: ai } = await generateObject({
//                 model: google("gemini-1.5-flash"),
//                 schema: ExamQuestionsSchema,
//                 prompt: `Generate ${newCount} high-difficulty, advanced examination multiple-choice questions covering these topics: ${topicContext}. Do not repeat basic introductory concepts. Ensure plausible distractors.`
//             })

//             // Save new questions to the Bank as 'EXAM' category
//             const newRecords = await prisma.$transaction(
//                 ai.questions.map(q => prisma.question.create({
//                     data: {
//                         text: q.text,
//                         options: q.options,
//                         correctAnswer: q.correctAnswer,
//                         explanation: q.explanation,
//                         category: QuestionCategory.EXAM,
//                         topicId: config.topicIds[0], // Fallback to first topic for bank storage
//                         schoolId: config.schoolId
//                     }
//                 }))
//             )
//             finalQuestionIds.push(...newRecords.map(q => q.id))
//         }

//         // 3. Create the Final Exam Shell
//         const exam = await prisma.exam.create({
//             data: {
//                 title: config.title,
//                 type: config.type,
//                 duration: config.duration,
//                 status: ExamStatus.PUBLISHED,
//                 schoolId: config.schoolId,
//                 classId: config.classId,
//                 termId: config.termId,
//                 questions: {
//                     create: finalQuestionIds.map((qId, idx) => ({
//                         questionId: qId,
//                         order: idx + 1
//                     }))
//                 }
//             }
//         })

//         revalidatePath('/teacher/assessments')
//         return { success: true, examId: exam.id }
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// /**
//  * STUDENT: Automated Grading System
//  */
// export async function submitExam(examId: string, studentId: string, schoolId: string, answers: Record<string, string>) {
//     try {
//         const exam = await prisma.exam.findUnique({
//             where: { id: examId },
//             include: { questions: { include: { question: true } } }
//         })

//         if (!exam) throw new Error("Exam offline.")

//         let score = 0
//         const maxScore = exam.questions.length

//         // Deterministic Auto-Grading
//         exam.questions.forEach((eq) => {
//             if (answers[eq.questionId] === eq.question.correctAnswer) {
//                 score += eq.question.points
//             }
//         })

//         // Save Assessment Record
//         await prisma.assessment.create({
//             data: {
//                 type: exam.type,
//                 score,
//                 maxScore,
//                 studentId,
//                 schoolId,
//                 gradeSubjectId: "fetch-from-logic", // Logic to find GS ID
//                 comments: "Auto-graded via CBT Engine"
//             }
//         })

//         revalidatePath('/student/grades')
//         return { success: true, score, maxScore }
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }




'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { AssessmentType, ExamStatus, QuestionCategory, Prisma } from '@prisma/client'
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { revalidatePath } from 'next/cache'

// ── Types ──────────────────────────────────────────────────────────────────────


export interface AdminExamStats {
    totalExams: number
    activeNow: number
    completionRate: number
}

export interface ExamGenerationConfig {
    title: string
    type: AssessmentType
    schoolId: string
    classId: string
    termId: string
    topicIds: string[]
    totalQuestions: number
    reusePercentage: number 
    duration: number
}
 
export interface ExamRegistryItem {
    id: string
    title: string
    className: string
    status: string
    studentCount: number
    completedCount: number
}


const ExamQuestionsSchema = z.object({
  questions: z.array(z.object({
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
    explanation: z.string(),
  }))
})

// ── NEW: Fetch Topics Helper (The missing function) ──────────────────────────

/**
 * Fetches all syllabus topics linked to a specific class via its Grade level.
 */
export async function getTopicsForClass(classId: string) {
    try {
        const klass = await prisma.class.findUnique({
            where: { id: classId },
            include: {
                grade: {
                    include: {
                        gradeSubjects: {
                            include: {
                                topics: {
                                    select: {
                                        id: true,
                                        title: true,
                                        termId: true,
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        // Flatten all topics from all subjects belonging to this grade
        const allTopics = klass?.grade.gradeSubjects.flatMap(gs => gs.topics) || [];
        
        return allTopics;
    } catch (err) {
        console.error("getTopicsForClass error:", getErrorMessage(err));
        return [];
    }
}



// ── Teacher: Create Exam ───────────────────────────────────────────────────────

export async function generateCompositeExam(config: ExamGenerationConfig) {
    try {
        const reuseCount = Math.floor(config.totalQuestions * (config.reusePercentage / 100))
        const newCount = config.totalQuestions - reuseCount

        const finalQuestionIds: string[] = []

        // 1. Pull existing questions
        if (reuseCount > 0) {
            const existing = await prisma.question.findMany({
                where: {
                    topicId: { in: config.topicIds },
                    category: QuestionCategory.PRACTICE,
                    OR: [{ schoolId: config.schoolId }, { schoolId: null }]
                }
            })
            const shuffled = existing.sort(() => 0.5 - Math.random())
            finalQuestionIds.push(...shuffled.slice(0, reuseCount).map(q => q.id))
        }

        // 2. Generate new questions via AI
        if (newCount > 0) {
            const topics = await prisma.topic.findMany({
                where: { id: { in: config.topicIds } },
                select: { title: true }
            })
            const context = topics.map(t => t.title).join(", ")
            
            const { object: ai } = await generateObject({
                model: google("gemini-1.5-flash"),
                schema: ExamQuestionsSchema,
                prompt: `Generate ${newCount} advanced exam MCQs for: ${context}.`
            })

            const newRecords = await prisma.$transaction(
                ai.questions.map(q => prisma.question.create({
                    data: {
                        text: q.text,
                        options: q.options as unknown as Prisma.InputJsonValue,
                        correctAnswer: q.correctAnswer,
                        explanation: q.explanation,
                        category: QuestionCategory.EXAM,
                        topicId: config.topicIds[0],
                        schoolId: config.schoolId
                    }
                }))
            )
            finalQuestionIds.push(...newRecords.map(q => q.id))
        }

        // 3. Save Exam
        const exam = await prisma.exam.create({
            data: {
                title: config.title,
                type: config.type,
                duration: config.duration,
                status: ExamStatus.PUBLISHED,
                schoolId: config.schoolId,
                classId: config.classId,
                termId: config.termId,
                questions: {
                    create: finalQuestionIds.map((qId, idx) => ({
                        questionId: qId,
                        order: idx + 1
                    }))
                }
            }
        })

        revalidatePath('/admin/assessments')
        return { success: true, examId: exam.id }
    } catch (err) {
        return { success: false, error: getErrorMessage(err) }
    }
}


/**
 * STUDENT: Automated Grading System
 */
export async function submitExam(examId: string, studentId: string, schoolId: string, answers: Record<string, string>) {
    try {
        const exam = await prisma.exam.findUnique({
            where: { id: examId },
            include: { questions: { include: { question: true } } }
        })

        if (!exam) throw new Error("Exam offline.")

        let score = 0
        const maxScore = exam.questions.length

        // Deterministic Auto-Grading
        exam.questions.forEach((eq) => {
            if (answers[eq.questionId] === eq.question.correctAnswer) {
                score += eq.question.points
            }
        })

        // Save Assessment Record
        await prisma.assessment.create({
            data: {
                type: exam.type,
                score,
                maxScore,
                studentId,
                schoolId,
                gradeSubjectId: "fetch-from-logic", // Logic to find GS ID
                comments: "Auto-graded via CBT Engine"
            }
        })

        revalidatePath('/student/grades')
        return { success: true, score, maxScore }
    } catch (err) {
        return { success: false, error: getErrorMessage(err) }
    }
}



export interface AdminExamRegistryData {
    stats: {
        totalExams: number
        activeNow: number
        completionRate: number
    }
    exams: {
        id: string
        title: string
        className: string
        status: string
        studentCount: number
        completedCount: number
    }[]
}

// ── Admin: Get Registry ────────────────────────────────────────────────────────
export async function getAdminExamRegistry(schoolId: string) {
    try {
        const examsData = await prisma.exam.findMany({
            where: { schoolId },
            include: {
                class: {
                    include: {
                        _count: { select: { enrollments: true } }
                    }
                },
                _count: {
                    select: { assessments: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const exams: ExamRegistryItem[] = examsData.map((e) => ({
            id: e.id,
            title: e.title,
            className: e.class.name,
            status: e.status,
            studentCount: e.class._count.enrollments,
            completedCount: e._count.assessments
        }));

        const totalExams = exams.length;
        const activeNow = exams.filter(e => e.status === 'PUBLISHED' || e.status === 'ONGOING').length;
        const totalExpected = exams.reduce((acc, curr) => acc + curr.studentCount, 0);
        const totalActual = exams.reduce((acc, curr) => acc + curr.completedCount, 0);
        const completionRate = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

        // ✅ 2. Return the data directly (no .data wrapper)
        return {
            success: true,
            stats: { totalExams, activeNow, completionRate },
            exams
        };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}