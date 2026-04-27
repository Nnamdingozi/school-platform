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




// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory, Prisma } from '@prisma/client'
// import { google } from "@ai-sdk/google"
// import { generateObject } from "ai"
// import { z } from "zod"
// import { revalidatePath } from 'next/cache'

// // ── Types ──────────────────────────────────────────────────────────────────────


// export interface AdminExamStats {
//     totalExams: number
//     activeNow: number
//     completionRate: number
// }

// export interface ExamGenerationConfig {
//     title: string
//     type: AssessmentType
//     schoolId: string
//     classId: string
//     termId: string
//     topicIds: string[]
//     totalQuestions: number
//     reusePercentage: number 
//     duration: number
// }
 
// export interface ExamRegistryItem {
//     id: string
//     title: string
//     className: string
//     status: string
//     studentCount: number
//     completedCount: number
// }


// const ExamQuestionsSchema = z.object({
//   questions: z.array(z.object({
//     text: z.string(),
//     options: z.array(z.string()),
//     correctAnswer: z.string(),
//     explanation: z.string(),
//   }))
// })

// // ── NEW: Fetch Topics Helper (The missing function) ──────────────────────────

// /**
//  * Fetches all syllabus topics linked to a specific class via its Grade level.
//  */
// export async function getTopicsForClass(classId: string) {
//     try {
//         const klass = await prisma.class.findUnique({
//             where: { id: classId },
//             include: {
//                 grade: {
//                     include: {
//                         gradeSubjects: {
//                             include: {
//                                 topics: {
//                                     select: {
//                                         id: true,
//                                         title: true,
//                                         termId: true,
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//             }
//         });

//         // Flatten all topics from all subjects belonging to this grade
//         const allTopics = klass?.grade.gradeSubjects.flatMap(gs => gs.topics) || [];
        
//         return allTopics;
//     } catch (err) {
//         console.error("getTopicsForClass error:", getErrorMessage(err));
//         return [];
//     }
// }



// // ── Teacher: Create Exam ───────────────────────────────────────────────────────

// export async function generateCompositeExam(config: ExamGenerationConfig) {
//     try {
//         const reuseCount = Math.floor(config.totalQuestions * (config.reusePercentage / 100))
//         const newCount = config.totalQuestions - reuseCount

//         const finalQuestionIds: string[] = []

//         // 1. Pull existing questions
//         if (reuseCount > 0) {
//             const existing = await prisma.question.findMany({
//                 where: {
//                     topicId: { in: config.topicIds },
//                     category: QuestionCategory.PRACTICE,
//                     OR: [{ schoolId: config.schoolId }, { schoolId: null }]
//                 }
//             })
//             const shuffled = existing.sort(() => 0.5 - Math.random())
//             finalQuestionIds.push(...shuffled.slice(0, reuseCount).map(q => q.id))
//         }

//         // 2. Generate new questions via AI
//         if (newCount > 0) {
//             const topics = await prisma.topic.findMany({
//                 where: { id: { in: config.topicIds } },
//                 select: { title: true }
//             })
//             const context = topics.map(t => t.title).join(", ")
            
//             const { object: ai } = await generateObject({
//                 model: google("gemini-1.5-flash"),
//                 schema: ExamQuestionsSchema,
//                 prompt: `Generate ${newCount} advanced exam MCQs for: ${context}.`
//             })

//             const newRecords = await prisma.$transaction(
//                 ai.questions.map(q => prisma.question.create({
//                     data: {
//                         text: q.text,
//                         options: q.options as unknown as Prisma.InputJsonValue,
//                         correctAnswer: q.correctAnswer,
//                         explanation: q.explanation,
//                         category: QuestionCategory.EXAM,
//                         topicId: config.topicIds[0],
//                         schoolId: config.schoolId
//                     }
//                 }))
//             )
//             finalQuestionIds.push(...newRecords.map(q => q.id))
//         }

//         // 3. Save Exam
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

//         revalidatePath('/admin/assessments')
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



// export interface AdminExamRegistryData {
//     stats: {
//         totalExams: number
//         activeNow: number
//         completionRate: number
//     }
//     exams: {
//         id: string
//         title: string
//         className: string
//         status: string
//         studentCount: number
//         completedCount: number
//     }[]
// }



// // ── Admin: Get Registry ────────────────────────────────────────────────────────
// export async function getAdminExamRegistry(schoolId: string) {
//     try {
//         const examsData = await prisma.exam.findMany({
//             where: { schoolId },
//             include: {
//                 class: {
//                     include: {
//                         _count: { select: { enrollments: true } }
//                     }
//                 },
//                 _count: {
//                     select: { assessments: true }
//                 }
//             },
//             orderBy: { createdAt: 'desc' }
//         });

//         const exams: ExamRegistryItem[] = examsData.map((e) => ({
//             id: e.id,
//             title: e.title,
//             className: e.class.name,
//             status: e.status,
//             studentCount: e.class._count.enrollments,
//             completedCount: e._count.assessments
//         }));

//         const totalExams = exams.length;
//         const activeNow = exams.filter(e => e.status === 'PUBLISHED' || e.status === 'ONGOING').length;
//         const totalExpected = exams.reduce((acc, curr) => acc + curr.studentCount, 0);
//         const totalActual = exams.reduce((acc, curr) => acc + curr.completedCount, 0);
//         const completionRate = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

//         // ✅ 2. Return the data directly (no .data wrapper)
//         return {
//             success: true,
//             stats: { totalExams, activeNow, completionRate },
//             exams
//         };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * Fetches all GradeSubjects the teacher is linked to, 
//  * plus the physical classes they teach.
//  */
// export async function getTeacherExamContext(teacherId: string, schoolId: string) {
//     try {
//         const [assignments, classes] = await Promise.all([
//             prisma.gradeSubject.findMany({
//                 where: {
//                     // FIX: Use AND array to combine two different OR conditions
//                     AND: [
//                         {
//                             // Condition 1: User must be linked to the subject
//                             OR: [
//                                 { profileId: teacherId }, 
//                                 { teachers: { some: { id: teacherId } } }
//                             ],
//                         },
//                         {
//                             // Condition 2: Subject must be Global OR specific to this school
//                             OR: [
//                                 { schoolId: null }, 
//                                 { schoolId: schoolId }
//                             ],
//                         }
//                     ]
//                 },
//                 include: {
//                     subject: { select: { name: true } },
//                     grade: { select: { id: true, displayName: true } }
//                 }
//             }),
//             prisma.class.findMany({
//                 where: { 
//                     teacherId: teacherId, 
//                     schoolId: schoolId 
//                 },
//                 select: { id: true, name: true }
//             })
//         ]);
        
//         return { assignments, classes };
//     } catch (err) {
//         console.error("getTeacherExamContext error:", err);
//         return { assignments: [], classes: [] };
//     }
// }
// /**
//  * Fetches topics grouped by Terms for a specific GradeSubject
//  */
// export async function getGroupedTopics(gradeSubjectId: string) {
//     try {
//         const terms = await prisma.term.findMany({
//             where: { grade: { gradeSubjects: { some: { id: gradeSubjectId } } } },
//             include: {
//                 topics: {
//                     where: { gradeSubjectId },
//                     select: { id: true, title: true }
//                 }
//             },
//             orderBy: { index: 'asc' }
//         });
//         return terms;
//     } catch (err) {
//         return [];
//     }
// }

// /**
//  * Step 1: Fetches all GradeSubjects the teacher is authorized to teach.
//  */
// export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.gradeSubject.findMany({
//             where: {
//                 AND: [
//                     {
//                         OR: [
//                             { profileId: teacherId }, 
//                             { teachers: { some: { id: teacherId } } }
//                         ],
//                     },
//                     {
//                         OR: [{ schoolId: null }, { schoolId: schoolId }],
//                     }
//                 ]
//             },
//             include: {
//                 subject: { select: { name: true } },
//                 grade: { select: { id: true, displayName: true } }
//             },
//             orderBy: { grade: { level: 'asc' } }
//         });
//     } catch (err) {
//         return [];
//     }
// }

// /**
//  * Step 2: Fetches all physical classes belonging to a specific Grade.
//  * This ensures an SS1 teacher can see all SS1 rooms (Gold, Silver, etc.)
//  */
// export async function getClassesByGradeLevel(gradeId: string, schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where: { 
//                 gradeId: gradeId,
//                 schoolId: schoolId 
//             },
//             select: { id: true, name: true }
//         });
//     } catch (err) {
//         return [];
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory, Prisma } from '@prisma/client'
// import { groq } from "@ai-sdk/groq"
// import { generateText, Output } from "ai"
// import { z } from "zod"
// import { revalidatePath } from 'next/cache'

// // ── 1. Schemas ────────────────────────────────────────────────────────────────

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
//     reusePercentage: number 
//     duration: number
// }

// // ── 2. AI Question Pool Generation (Groq Implementation) ──────────────────────

// /**
//  * Step 1: Synthesize Question Pool via Groq Llama 3.3
//  * This generates the questions for teacher audit without saving to the DB yet.
//  */
// export async function buildExamPool(config: { topicIds: string[], totalQuestions: number }) {
//     try {
//         const topics = await prisma.topic.findMany({
//             where: { id: { in: config.topicIds } },
//             select: { title: true }
//         });
        
//         const context = topics.map(t => t.title).join(", ");
        
//         const dynamicPrompt = `
//             You are an expert academic evaluator.
//             Generate EXACTLY ${config.totalQuestions} high-level multiple-choice questions.
            
//             Syllabus Context: ${context}
//             Requirements:
//             - Each question must have 4 options.
//             - Provide a clear pedagogical explanation for the correct answer.
//             - Ensure strict academic rigor.
//         `;

//         const { text } = await generateText({
//             model: groq("llama-3.3-70b-versatile"),
//             prompt: dynamicPrompt,
//             output: Output.json(),
//             maxOutputTokens: 8000,
//             temperature: 0.4,
//         });

//         // Safe Parsing (Handles Groq markdown wrapping)
//         const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
//         const ai = JSON.parse(cleanJson);
//         const validated = ExamQuestionsSchema.parse(ai);

//         return { success: true, questions: validated.questions };
//     } catch (err) {
//         console.error("buildExamPool failure:", err);
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ── 3. Registry Finalization ──────────────────────────────────────────────────

// /**
//  * Step 2: Save verified questions and create the formal Exam record.
//  */
// export async function finalizeAndDeployExam(config: ExamGenerationConfig, verifiedQuestions: any[]) {
//     try {
//         const exam = await prisma.$transaction(async (tx) => {
//             // 1. Bulk Create Question Records
//             const questionRecords = await Promise.all(
//                 verifiedQuestions.map(q => tx.question.create({
//                     data: {
//                         text: q.text,
//                         options: q.options as unknown as Prisma.InputJsonValue,
//                         correctAnswer: q.correctAnswer,
//                         explanation: q.explanation,
//                         category: QuestionCategory.EXAM,
//                         topicId: config.topicIds[0], // Linked to the first topic selected
//                         schoolId: config.schoolId
//                     }
//                 }))
//             );

//             // 2. Create the Exam and Link the Junctions
//             return await tx.exam.create({
//                 data: {
//                     title: config.title,
//                     type: config.type,
//                     duration: config.duration,
//                     status: ExamStatus.PUBLISHED,
//                     schoolId: config.schoolId,
//                     classId: config.classId,
//                     termId: config.termId,
//                     questions: {
//                         create: questionRecords.map((q, idx) => ({
//                             questionId: q.id,
//                             order: idx + 1
//                         }))
//                     }
//                 }
//             });
//         }, { timeout: 30000 });

//         revalidatePath('/teacher/assessment');
//         return { success: true, examId: exam.id };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ── 4. Discovery Helpers (The "Context" Logic) ───────────────────────────────

// /**
//  * Fetches authorized assignments for the teacher and physical classes for deployment.
//  */
// export async function getTeacherExamContext(teacherId: string, schoolId: string) {
//     try {
//         const [assignments, classes] = await Promise.all([
//             prisma.gradeSubject.findMany({
//                 where: {
//                     AND: [
//                         {
//                             OR: [
//                                 { profileId: teacherId }, 
//                                 { teachers: { some: { id: teacherId } } }
//                             ],
//                         },
//                         {
//                             OR: [{ schoolId: null }, { schoolId: schoolId }],
//                         }
//                     ]
//                 },
//                 include: {
//                     subject: { select: { name: true } },
//                     grade: { select: { id: true, displayName: true } }
//                 },
//                 orderBy: { grade: { level: 'asc' } }
//             }),
//             prisma.class.findMany({
//                 where: { schoolId },
//                 select: { id: true, name: true, gradeId: true }
//             })
//         ]);
        
//         return { assignments, classes };
//     } catch (err) {
//         console.error("getTeacherExamContext error:", err);
//         return { assignments: [], classes: [] };
//     }
// }

// /**
//  * Fetches all physical classes belonging to a specific Grade level.
//  */
// export async function getClassesByGradeLevel(gradeId: string, schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where: { gradeId, schoolId },
//             select: { id: true, name: true }
//         });
//     } catch (err) {
//         return [];
//     }
// }

// /**
//  * Fetches topics grouped by Terms for a specific GradeSubject.
//  */
// export async function getGroupedTopics(gradeSubjectId: string) {
//     try {
//         const terms = await prisma.term.findMany({
//             where: { grade: { gradeSubjects: { some: { id: gradeSubjectId } } } },
//             include: {
//                 topics: {
//                     where: { gradeSubjectId },
//                     select: { id: true, title: true }
//                 }
//             },
//             orderBy: { index: 'asc' }
//         });
//         return terms;
//     } catch (err) {
//         return [];
//     }
// }

// // ── 5. Analytics & Grading ───────────────────────────────────────────────────

// export async function getAdminExamRegistry(schoolId: string) {
//     try {
//         const examsData = await prisma.exam.findMany({
//             where: { schoolId },
//             include: {
//                 class: { include: { _count: { select: { enrollments: true } } } },
//                 _count: { select: { assessments: true } }
//             },
//             orderBy: { createdAt: 'desc' }
//         });

//         const exams = examsData.map((e) => ({
//             id: e.id,
//             title: e.title,
//             className: e.class.name,
//             status: e.status,
//             studentCount: e.class._count.enrollments,
//             completedCount: e._count.assessments
//         }));

//         const totalExams = exams.length;
//         const activeNow = exams.filter(e => e.status === 'PUBLISHED').length;
//         const totalExpected = exams.reduce((acc, curr) => acc + curr.studentCount, 0);
//         const totalActual = exams.reduce((acc, curr) => acc + curr.completedCount, 0);
//         const completionRate = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

//         return { success: true, stats: { totalExams, activeNow, completionRate }, exams };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }


// /**
//  * Step 1: Fetches all GradeSubjects the teacher is authorized to teach.
//  */
// export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.gradeSubject.findMany({
//             where: {
//                 AND: [
//                     {
//                         OR: [
//                             { profileId: teacherId }, 
//                             { teachers: { some: { id: teacherId } } }
//                         ],
//                     },
//                     {
//                         OR: [{ schoolId: null }, { schoolId: schoolId }],
//                     }
//                 ]
//             },
//             include: {
//                 subject: { select: { name: true } },
//                 grade: { select: { id: true, displayName: true } }
//             },
//             orderBy: { grade: { level: 'asc' } }
//         });
//     } catch (err) {
//         return [];
//     }
// }


// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory, Prisma } from '@prisma/client'
// import { createGoogleGenerativeAI } from "@ai-sdk/google" 
// import { GoogleGenerativeAI } from "@google/generative-ai"; 



// import { z } from "zod"
// import { revalidatePath } from 'next/cache'

// const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || "");

 
// // export const runtime = 'edge'
// // ── 1. Schemas ────────────────────────────────────────────────────────────────

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
//     classIds: string[]
//     teacherId: string
//     termId: string
//     topicIds: string[]
//     totalQuestions: number
//     reusePercentage: number 
//     duration: number
// }

// export interface ExamRegistryItem {
//     id: string
//     title: string
//     className: string
//     status: string
//     studentCount: number
//     completedCount: number
// }

// // ── 2. AI Question Pool Generation (Groq Implementation) ──────────────────────






// export async function buildExamPool(config: {
//     topicIds: string[];
//     totalQuestions: number;
//     reusePercentage: number;
//     schoolId: string;
//   }) {
//     console.log("🚀 [SERVER] Initializing Native Google AI Engine...");
  
//     try {
//       const reuseCount = Math.floor(
//         config.totalQuestions * (config.reusePercentage / 100)
//       );
//       const newCount = config.totalQuestions - reuseCount;
//       let pool: any[] = [];
  
//       // 1️⃣ SOURCE REVISION QUESTIONS FROM DATABASE
//       if (reuseCount > 0) {
//         const existing = await prisma.question.findMany({
//           where: {
//             topicId: { in: config.topicIds },
//             category: "PRACTICE",
//             OR: [{ schoolId: config.schoolId }, { schoolId: null }],
//           },
//           take: reuseCount,
//         });
  
//         pool.push(...existing.map((q) => ({ ...q, category: "REVISION" })));
//       }
  
//       // 2️⃣ GENERATE NEW QUESTIONS (NATIVE GOOGLE SDK)
//       if (newCount > 0) {
//         const topics = await prisma.topic.findMany({
//           where: { id: { in: config.topicIds } },
//           select: { title: true },
//         });
  
//         const context = topics.map((t) => t.title).join(", ");
  
//         // Configure the model directly
//         const model = genAI.getGenerativeModel({ 
//           model: "gemini-2.1-flash",
//           // Forces Google to return JSON natively
//           generationConfig: {
//             responseMimeType: "application/json",
//           }
//         });
  
//         const prompt = `
//           Act as a Senior WAEC/JAMB Examiner.
//           Generate exactly ${newCount} high-quality multiple choice questions
//           based on the Nigerian Secondary School curriculum for these topics: ${context}.
  
//           REQUIREMENTS:
//           - Use Nigerian academic terminology (e.g., 'Full stop' not 'Period').
//           - Exactly 4 options per question.
//           - Provide a pedagogical explanation for the correct key.
  
//           OUTPUT FORMAT (JSON):
//           {
//             "questions": [
//               {
//                 "text": "The question string",
//                 "options": ["Option A", "Option B", "Option C", "Option D"],
//                 "correctAnswer": "The exact string from options",
//                 "explanation": "Rationale"
//               }
//             ]
//           }
//         `;
  
//         // Speak directly to Google's API
//         const result = await model.generateContent(prompt);
//         const response = await result.response;
//         const text = response.text();
  
//         // Parse and Validate the AI output
//         let validated;
//         try {
//           const parsedData = JSON.parse(text);
//           validated = ExamQuestionsSchema.parse(parsedData);
//         } catch (parseErr) {
//           console.error("JSON Parsing/Validation Error:", text);
//           throw new Error("AI returned data in an incompatible format.");
//         }
  
//         if (validated.questions) {
//           const aiQuestions = validated.questions.map((q: any) => ({
//             ...q,
//             category: "NEW_AI",
//           }));
//           pool.push(...aiQuestions);
//         }
//       }
  
//       console.log(`✨ [SERVER] Pool synthesized with ${pool.length} total items.`);
  
//       // 3️⃣ PERSIST NEW AI QUESTIONS TO DATABASE
//       if (pool.length > 0) {
//         const newAiQuestionsOnly = pool.filter((q) => q.category === "NEW_AI");
  
//         if (newAiQuestionsOnly.length > 0) {
//           await prisma.question.createMany({
//             data: newAiQuestionsOnly.map((q) => ({
//               text: q.text,
//               options: q.options,
//               correctAnswer: q.correctAnswer,
//               explanation: q.explanation ?? null,
//               points: 1,
//               topicId: config.topicIds[0], // Linked to primary syllabus topic
//               schoolId: config.schoolId,
//               category: QuestionCategory.EXAM,
//             })),
//           });
//         }
//       }
  
//       return { success: true, questions: pool };
  
//     } catch (err: any) {
//       console.error("❌ [SERVER] Native Google Failure:", err.message);
  
//       // Handle Quota Errors Specifically
//       if (err.message.includes("429") || err.message.includes("quota")) {
//           return {
//             success: false,
//             error: "API Limit reached. Please reduce question count or enable billing in Google AI Studio.",
//           };
//       }
  
//       return {
//         success: false,
//         error: getErrorMessage(err),
//       };
//     }
//   }
// /**
//  * Fetches authorized assignments for the teacher.
//  */
// export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.gradeSubject.findMany({
//             where: {
//                 AND: [
//                     {
//                         OR: [
//                             { profileId: teacherId }, 
//                             { teachers: { some: { id: teacherId } } }
//                         ],
//                     },
//                     {
//                         OR: [{ schoolId: null }, { schoolId: schoolId }],
//                     }
//                 ]
//             },
//             include: {
//                 subject: { select: { name: true } },
//                 grade: { select: { id: true, displayName: true } }
//             },
//             orderBy: { grade: { level: 'asc' } }
//         });
//     } catch (err) {
//         return [];
//     }
// }

// /**
//  * Admin: Get Registry Stats
//  */
// export async function getAdminExamRegistry(schoolId: string) {
//     try {
//         const examsData = await prisma.exam.findMany({
//             where: { schoolId },
//             include: {
//                 class: { include: { _count: { select: { enrollments: true } } } },
//                 _count: { select: { assessments: true } }
//             },
//             orderBy: { createdAt: 'desc' }
//         });

//         const exams = examsData.map((e) => ({
//             id: e.id,
//             title: e.title,
//             className: e.class.name,
//             status: e.status,
//             studentCount: e.class._count.enrollments,
//             completedCount: e._count.assessments
//         }));

//         const totalExams = exams.length;
//         const activeNow = exams.filter(e => e.status === 'PUBLISHED').length;
//         const totalExpected = exams.reduce((acc, curr) => acc + curr.studentCount, 0);
//         const totalActual = exams.reduce((acc, curr) => acc + curr.completedCount, 0);
//         const completionRate = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

//         return { success: true, stats: { totalExams, activeNow, completionRate }, exams };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * STUDENT: submit exam logic
//  */
// export async function submitExam(examId: string, studentId: string, schoolId: string, answers: Record<string, string>) {
//     try {
//         const exam = await prisma.exam.findUnique({
//             where: { id: examId },
//             include: { questions: { include: { question: true } } }
//         })

//         if (!exam) throw new Error("Exam offline.")

//         let score = 0
//         exam.questions.forEach((eq) => {
//             if (answers[eq.questionId] === eq.question.correctAnswer) {
//                 score += eq.question.points
//             }
//         })

//         await prisma.assessment.create({
//             data: {
//                 type: exam.type,
//                 score,
//                 maxScore: exam.questions.length,
//                 studentId,
//                 schoolId,
//                 gradeSubjectId: "GS_ID_PLACEHOLDER", 
//                 comments: "Auto-graded"
//             }
//         })

//         revalidatePath('/student/grades')
//         return { success: true, score, maxScore: exam.questions.length }
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// export async function getClassesByGradeLevel(gradeId: string, schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where: { 
//                 gradeId: gradeId,
//                 schoolId: schoolId 
//             },
//             select: { id: true, name: true }
//         });
//     } catch (err) {
//         return [];
//     }
// }



// export async function getGroupedTopics(gradeSubjectId: string) {
//     try {
//         const terms = await prisma.term.findMany({
//             where: { grade: { gradeSubjects: { some: { id: gradeSubjectId } } } },
//             include: {
//                 topics: {
//                     where: { gradeSubjectId },
//                     select: { id: true, title: true }
//                 }
//             },
//             orderBy: { index: 'asc' }
//         });
//         return terms;
//     } catch (err) {
//         return [];
//     }
// }

// export async function finalizeAndDeployExam(
//     config: ExamGenerationConfig,
//     verifiedQuestions: any[]
//   ) {
//     try {
  
//       const exams = await prisma.$transaction(async (tx) => {
  
//         // 1️⃣ Create Question Records
//         const questionRecords = await Promise.all(
//           verifiedQuestions.map((q) =>
//             tx.question.create({
//               data: {
//                 text: q.text,
//                 options: q.options as unknown as Prisma.InputJsonValue,
//                 correctAnswer: q.correctAnswer,
//                 explanation: q.explanation,
//                 category: QuestionCategory.EXAM,
//                 topicId: config.topicIds[0],
//                 schoolId: config.schoolId
//               }
//             })
//           )
//         )
  
//         // 2️⃣ Create Exams for Each Class
//         const createdExams = []
  
//         for (const classId of config.classIds) {
  
//           const exam = await tx.exam.create({
//             data: {
//               title: config.title,
//               type: config.type,
//               duration: config.duration,
//               status: ExamStatus.PUBLISHED,
//               schoolId: config.schoolId,
//               classId: classId,
//               creatorId: config.teacherId,
//               termId: config.termId,
//               questions: {
//                 create: questionRecords.map((q, idx) => ({
//                   questionId: q.id,
//                   order: idx + 1
//                 }))
//               }
//             }
//           })
  
//           createdExams.push(exam)
  
//         }
  
//         return createdExams
  
//       }, { timeout: 30000 })
  
  
//       revalidatePath('/teacher/assessment')
  
//       return {
//         success: true,
//         examIds: exams.map(e => e.id)
//       }
  
//     } catch (err) {
  
//       return {
//         success: false,
//         error: getErrorMessage(err)
//       }
  
//     }
//   }


// /**
//  * Fetches all exams created for the teacher's assigned subjects.
//  */
// export async function getTeacherExamHistory(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.exam.findMany({
//             where: { 
//                 schoolId,
//                 creatorId: teacherId 
//             },
//             include: {
//                 class: { select: { name: true } },
//                 _count: { select: { questions: true } }
//             },
//             orderBy: { createdAt: 'desc' }
//         });
//     } catch (err) {
//         return [];
//     }
// }

// /**
//  * Fetches the actual questions for a previously deployed exam.
//  */
// export async function getExamQuestions(examId: string) {
//     try {
//         const exam = await prisma.exam.findUnique({
//             where: { id: examId },
//             include: {
//                 questions: {
//                     include: { question: true },
//                     orderBy: { order: 'asc' }
//                 }
//             }
//         });
//         // Map to the same format as our 'generatedPool' state
//         return exam?.questions.map(q => q.question) || [];
//     } catch (err) {
//         return [];
//     }
// }


// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory, Prisma } from '@prisma/client'
// import { createGoogleGenerativeAI } from '@ai-sdk/google'
// import { generateObject } from 'ai'
// import { z } from 'zod'
// import { revalidatePath } from 'next/cache'

// // ── Google AI client ───────────────────────────────────────────────────────────
// // ✅ Use @ai-sdk/google wrapper — proper types, no manual JSON parsing needed
// // ✅ Reads GOOGLE_GENERATIVE_AI_API_KEY from env automatically

// const google = createGoogleGenerativeAI({
//     apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
// })

// // ── Schemas ────────────────────────────────────────────────────────────────────

// const ExamQuestionsSchema = z.object({
//     questions: z.array(z.object({
//         text:          z.string(),
//         options:       z.array(z.string()).length(4),
//         correctAnswer: z.string(),
//         explanation:   z.string(),
//     })),
// })

// export interface ExamGenerationConfig {
//     title:          string
//     type:           AssessmentType
//     schoolId:       string
//     classIds:       string[]
//     teacherId:      string
//     termId:         string
//     topicIds:       string[]
//     totalQuestions: number
//     reusePercentage: number
//     duration:       number
// }

// // ── Build exam question pool ───────────────────────────────────────────────────

// export async function buildExamPool(config: {
//     topicIds:        string[]
//     totalQuestions:  number
//     reusePercentage: number
//     schoolId:        string
// }) {
//     try {
//         const reuseCount = Math.floor(
//             config.totalQuestions * (config.reusePercentage / 100)
//         )
//         const newCount = config.totalQuestions - reuseCount
//         let pool: any[] = []

//         // ── 1. Source revision questions from DB ───────────────────────────
//         if (reuseCount > 0) {
//             const existing = await prisma.question.findMany({
//                 where: {
//                     topicId:  { in: config.topicIds },
//                     category: 'PRACTICE',
//                     OR: [
//                         { schoolId: config.schoolId },
//                         { schoolId: null },
//                     ],
//                 },
//                 take: reuseCount,
//             })

//             pool.push(...existing.map(q => ({ ...q, category: 'REVISION' })))
//         }

//         // ── 2. Generate new questions via Gemini ───────────────────────────
//         if (newCount > 0) {
//             const topics = await prisma.topic.findMany({
//                 where:  { id: { in: config.topicIds } },
//                 select: { title: true },
//             })

//             const context = topics.map(t => t.title).join(', ')

//             const prompt = `
// Act as a Senior WAEC/JAMB Examiner for Nigerian Secondary Schools.
// Generate exactly ${newCount} high-quality multiple choice questions
// based on these topics: ${context}.

// Requirements:
// - Use Nigerian academic terminology (e.g., 'Full stop' not 'Period').
// - Exactly 4 options per question labeled as plain strings (not A/B/C/D prefixed).
// - The correctAnswer must be the exact string from the options array.
// - Provide a clear pedagogical explanation for each correct answer.
// - Questions should be appropriately challenging for secondary school level.
//             `.trim()

//             // ✅ generateObject handles JSON mode, schema validation and retries
//             // ✅ gemini-2.5-flash is the correct current model (not gemini-2.1-flash)
//             const { object } = await generateObject({
//                 model:       google('gemini-2.5-flash'),
//                 schema:      ExamQuestionsSchema,
//                 prompt,
//                 temperature: 0.7,
//             })

//             const aiQuestions = object.questions.map(q => ({
//                 ...q,
//                 category: 'NEW_AI',
//             }))

//             pool.push(...aiQuestions)
//         }

//         // ── 3. Persist new AI questions to DB ──────────────────────────────
//         const newAiOnly = pool.filter(q => q.category === 'NEW_AI')

//         if (newAiOnly.length > 0) {
//             await prisma.question.createMany({
//                 data: newAiOnly.map(q => ({
//                     text:          q.text,
//                     options:       q.options as unknown as Prisma.InputJsonValue,
//                     correctAnswer: q.correctAnswer,
//                     explanation:   q.explanation ?? null,
//                     topicId:       config.topicIds[0],
//                     schoolId:      config.schoolId,
//                     category:      QuestionCategory.EXAM,
//                 })),
//                 skipDuplicates: true,
//             })
//         }

//         return { success: true, questions: pool }

//     } catch (err) {
//         const message = getErrorMessage(err)
//         console.error('buildExamPool error:', message)

//         // Handle quota errors
//         if (message.includes('429') || message.toLowerCase().includes('quota')) {
//             return {
//                 success: false,
//                 error: 'API quota reached. Please reduce question count or check your Google AI billing.',
//             }
//         }

//         // Handle model not found (clear message for the developer)
//         if (message.includes('404') || message.toLowerCase().includes('not found')) {
//             return {
//                 success: false,
//                 error: 'AI model not found. Check model name in the action file.',
//             }
//         }

//         return { success: false, error: message }
//     }
// }

// // ── Finalize and deploy exam ───────────────────────────────────────────────────

// export async function finalizeAndDeployExam(
//     config: ExamGenerationConfig,
//     verifiedQuestions: any[]
// ) {
//     try {
//         const exams = await prisma.$transaction(async tx => {

//             // Create question records
//             const questionRecords = await Promise.all(
//                 verifiedQuestions.map(q =>
//                     tx.question.create({
//                         data: {
//                             text:          q.text,
//                             options:       q.options as unknown as Prisma.InputJsonValue,
//                             correctAnswer: q.correctAnswer,
//                             explanation:   q.explanation ?? null,
//                             category:      QuestionCategory.EXAM,
//                             topicId:       config.topicIds[0],
//                             schoolId:      config.schoolId,
//                         },
//                     })
//                 )
//             )

//             // Create one exam per class
//             const createdExams = []

//             for (const classId of config.classIds) {
//                 const exam = await tx.exam.create({
//                     data: {
//                         title:    config.title,
//                         type:     config.type,
//                         duration: config.duration,
//                         status:   ExamStatus.PUBLISHED,
//                         schoolId: config.schoolId,
//                         classId,
//                         creatorId: config.teacherId,
//                         termId:    config.termId,
//                         questions: {
//                             create: questionRecords.map((q, idx) => ({
//                                 questionId: q.id,
//                                 order:      idx + 1,
//                             })),
//                         },
//                     },
//                 })
//                 createdExams.push(exam)
//             }

//             return createdExams

//         }, { timeout: 30000 })

//         revalidatePath('/teacher/assessment')

//         return { success: true, examIds: exams.map(e => e.id) }

//     } catch (err) {
//         console.error('finalizeAndDeployExam error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Submit exam ────────────────────────────────────────────────────────────────

// export async function submitExam(
//     examId:    string,
//     studentId: string,
//     schoolId:  string,
//     answers:   Record<string, string>
// ) {
//     try {
//         const exam = await prisma.exam.findUnique({
//             where:   { id: examId },
//             include: { questions: { include: { question: true } } },
//         })

//         if (!exam) return { success: false, error: 'Exam not found.' }

//         let score = 0
//         exam.questions.forEach(eq => {
//             if (answers[eq.questionId] === eq.question.correctAnswer) {
//                 score += eq.question.points
//             }
//         })

//         // ⚠️ gradeSubjectId placeholder — wire this to the actual value
//         // when calling submitExam, pass the gradeSubjectId from the exam context
//         await prisma.assessment.create({
//             data: {
//                 type:           exam.type,
//                 score,
//                 maxScore:       exam.questions.length,
//                 studentId,
//                 schoolId,
//                 gradeSubjectId: exam.gradeSubjectId ?? 'PLACEHOLDER',
//                 comments:       'Auto-graded',
//             },
//         })

//         revalidatePath('/student/grades')
//         return { success: true, score, maxScore: exam.questions.length }

//     } catch (err) {
//         console.error('submitExam error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Query helpers ──────────────────────────────────────────────────────────────

// export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.gradeSubject.findMany({
//             where: {
//                 AND: [
//                     {
//                         OR: [
//                             { profileId: teacherId },
//                             { teachers: { some: { id: teacherId } } },
//                         ],
//                     },
//                     {
//                         OR: [{ schoolId: null }, { schoolId }],
//                     },
//                 ],
//             },
//             include: {
//                 subject: { select: { name: true } },
//                 grade:   { select: { id: true, displayName: true } },
//             },
//             orderBy: { grade: { level: 'asc' } },
//         })
//     } catch (err) {
//         console.error('getTeacherAuthorizedAssignments error:', getErrorMessage(err))
//         return []
//     }
// }

// export async function getAdminExamRegistry(schoolId: string) {
//     try {
//         const examsData = await prisma.exam.findMany({
//             where:   { schoolId },
//             include: {
//                 class: { include: { _count: { select: { enrollments: true } } } },
//                 _count: { select: { assessments: true } },
//             },
//             orderBy: { createdAt: 'desc' },
//         })

//         const exams = examsData.map(e => ({
//             id:             e.id,
//             title:          e.title,
//             className:      e.class.name,
//             status:         e.status,
//             studentCount:   e.class._count.enrollments,
//             completedCount: e._count.assessments,
//         }))

//         const totalExams     = exams.length
//         const activeNow      = exams.filter(e => e.status === 'PUBLISHED').length
//         const totalExpected  = exams.reduce((acc, curr) => acc + curr.studentCount, 0)
//         const totalActual    = exams.reduce((acc, curr) => acc + curr.completedCount, 0)
//         const completionRate = totalExpected > 0
//             ? Math.round((totalActual / totalExpected) * 100)
//             : 0

//         return { success: true, stats: { totalExams, activeNow, completionRate }, exams }
//     } catch (err) {
//         console.error('getAdminExamRegistry error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// export async function getClassesByGradeLevel(gradeId: string, schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where:  { gradeId, schoolId },
//             select: { id: true, name: true },
//         })
//     } catch (err) {
//         return []
//     }
// }

// export async function getGroupedTopics(gradeSubjectId: string) {
//     try {
//         return await prisma.term.findMany({
//             where: {
//                 grade: { gradeSubjects: { some: { id: gradeSubjectId } } },
//             },
//             include: {
//                 topics: {
//                     where:  { gradeSubjectId },
//                     select: { id: true, title: true },
//                 },
//             },
//             orderBy: { index: 'asc' },
//         })
//     } catch (err) {
//         return []
//     }
// }

// export async function getTeacherExamHistory(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.exam.findMany({
//             where:   { schoolId, creatorId: teacherId },
//             include: {
//                 class: { select: { name: true } },
//                 _count: { select: { questions: true } },
//             },
//             orderBy: { createdAt: 'desc' },
//         })
//     } catch (err) {
//         return []
//     }
// }

// export async function getExamQuestions(examId: string) {
//     try {
//         const exam = await prisma.exam.findUnique({
//             where:   { id: examId },
//             include: {
//                 questions: {
//                     include: { question: true },
//                     orderBy: { order: 'asc' },
//                 },
//             },
//         })
//         return exam?.questions.map(q => q.question) ?? []
//     } catch (err) {
//         return []
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory, Prisma } from '@prisma/client'
// import { google } from "@ai-sdk/google"
// import { generateObject } from "ai"
// import { z } from "zod"
// import { revalidatePath } from 'next/cache'


 
// // export const runtime = 'edge'
// // ── 1. Schemas ────────────────────────────────────────────────────────────────

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
//     classIds: string[]
//     teacherId: string
//     termId: string
//     topicIds: string[]
//     totalQuestions: number
//     reusePercentage: number 
//     duration: number
//     startTime: Date
// endTime: Date
// status: "SCHEDULED"
// }

// export interface ExamRegistryItem {
//     id: string
//     title: string
//     className: string
//     status: string
//     studentCount: number
//     completedCount: number
// }

// // ── 2. AI Question Pool Generation (Groq Implementation) ──────────────────────






// export async function buildExamPool(config: {
//     topicIds: string[];
//     totalQuestions: number;
//     reusePercentage: number;
//     schoolId: string;
//   }) {
//     console.log("🚀 [SERVER] Initializing Google AI model...");
  
//     try {
//       const reuseCount = Math.floor(
//         config.totalQuestions * (config.reusePercentage / 100)
//       );
//       const newCount = config.totalQuestions - reuseCount;
//       let pool: any[] = [];
  
//       // 1️⃣ SOURCE REVISION QUESTIONS FROM DATABASE
//       if (reuseCount > 0) {
//         const existing = await prisma.question.findMany({
//           where: {
//             topicId: { in: config.topicIds },
//             category: "PRACTICE",
//             OR: [{ schoolId: config.schoolId }, { schoolId: null }],
//           },
//           take: reuseCount,
//         });
  
//         pool.push(...existing.map((q) => ({ ...q, category: "REVISION" })));
//       }
  
//       // 2️⃣ GENERATE NEW QUESTIONS (AI SDK + Google provider)
//       if (newCount > 0) {
//         const topics = await prisma.topic.findMany({
//           where: { id: { in: config.topicIds } },
//           select: { title: true },
//         });
  
//         const context = topics.map((t) => t.title).join(", ");
  
//         const prompt = `
//           Act as a Senior WAEC/JAMB Examiner.
//           Generate exactly ${newCount} high-quality multiple choice questions
//           based on the Nigerian Secondary School curriculum for these topics: ${context}.
  
//           REQUIREMENTS:
//           - Use Nigerian academic terminology (e.g., 'Full stop' not 'Period').
//           - Exactly 4 options per question.
//           - Provide a pedagogical explanation for the correct key.
  
//           OUTPUT FORMAT (JSON):
//           {
//             "questions": [
//               {
//                 "text": "The question string",
//                 "options": ["Option A", "Option B", "Option C", "Option D"],
//                 "correctAnswer": "The exact string from options",
//                 "explanation": "Rationale"
//               }
//             ]
//           }
//         `;

//         const { object: validated } = await generateObject({
//           model: google("gemini-2.5-flash"),
//           schema: ExamQuestionsSchema,
//           prompt,
//         });
  
//         if (validated.questions) {
//           const aiQuestions = validated.questions.map((q: any) => ({
//             ...q,
//             category: "NEW_AI",
//           }));
//           pool.push(...aiQuestions);
//         }
//       }
  
//       console.log(`✨ [SERVER] Pool synthesized with ${pool.length} total items.`);
  
//       // 3️⃣ PERSIST NEW AI QUESTIONS TO DATABASE
//       if (pool.length > 0) {
//         const newAiQuestionsOnly = pool.filter((q) => q.category === "NEW_AI");
  
//         if (newAiQuestionsOnly.length > 0) {
//           await prisma.question.createMany({
//             data: newAiQuestionsOnly.map((q) => ({
//               text: q.text,
//               options: q.options as unknown as Prisma.InputJsonValue,
//               correctAnswer: q.correctAnswer,
//               explanation: q.explanation ?? null,
//               points: 1,
//               topicId: config.topicIds[0], // Linked to primary syllabus topic
//               schoolId: config.schoolId,
//               category: QuestionCategory.EXAM,
//             })),
//           });
//         }
//       }
  
//       return { success: true, questions: pool };
  
//     } catch (err) {
//       const message = getErrorMessage(err);
//       console.error("❌ [SERVER] Google AI generation failure:", message);
  
//       // Handle Quota Errors Specifically
//       if (message.includes("429") || message.toLowerCase().includes("quota")) {
//           return {
//             success: false,
//             error: "API Limit reached. Please reduce question count or enable billing in Google AI Studio.",
//           };
//       }
  
//       return {
//         success: false,
//         error: message,
//       };
//     }
//   }
// /**
//  * Fetches authorized assignments for the teacher.
//  */
// export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.gradeSubject.findMany({
//             where: {
//                 AND: [
//                     {
//                         OR: [
//                             { profileId: teacherId }, 
//                             { teachers: { some: { id: teacherId } } }
//                         ],
//                     },
//                     {
//                         OR: [{ schoolId: null }, { schoolId: schoolId }],
//                     }
//                 ]
//             },
//             include: {
//                 subject: { select: { name: true } },
//                 grade: { select: { id: true, displayName: true } }
//             },
//             orderBy: { grade: { level: 'asc' } }
//         });
//     } catch (err) {
//       getErrorMessage(err)
//         return [];
//     }
// }

// /**
//  * Admin: Get Registry Stats
//  */
// export async function getAdminExamRegistry(schoolId: string) {
//     try {
//         const examsData = await prisma.exam.findMany({
//             where: { schoolId },
//             include: {
//                 class: { include: { _count: { select: { enrollments: true } } } },
//                 _count: { select: { assessments: true } }
//             },
//             orderBy: { createdAt: 'desc' }
//         });

//         const exams = examsData.map((e) => ({
//             id: e.id,
//             title: e.title,
//             className: e.class.name,
//             status: e.status,
//             studentCount: e.class._count.enrollments,
//             completedCount: e._count.assessments
//         }));

//         const totalExams = exams.length;
//         const activeNow = exams.filter(e => e.status === 'PUBLISHED').length;
//         const totalExpected = exams.reduce((acc, curr) => acc + curr.studentCount, 0);
//         const totalActual = exams.reduce((acc, curr) => acc + curr.completedCount, 0);
//         const completionRate = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

//         return { success: true, stats: { totalExams, activeNow, completionRate }, exams };
//     } catch (err) {
//       getErrorMessage(err)
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * STUDENT: submit exam logic
//  */
// export async function submitExam(examId: string, studentId: string, schoolId: string, answers: Record<string, string>) {
//     try {
//         const exam = await prisma.exam.findUnique({
//             where: { id: examId },
//             include: { questions: { include: { question: true } } }
//         })

//         if (!exam) throw new Error("Exam offline.")

//         let score = 0
//         exam.questions.forEach((eq) => {
//             if (answers[eq.questionId] === eq.question.correctAnswer) {
//                 score += eq.question.points
//             }
//         })

//         await prisma.assessment.create({
//             data: {
//                 type: exam.type,
//                 score,
//                 maxScore: exam.questions.length,
//                 studentId,
//                 schoolId,
//                 gradeSubjectId: "GS_ID_PLACEHOLDER", 
//                 comments: "Auto-graded"
//             }
//         })

//         revalidatePath('/student/grades')
//         return { success: true, score, maxScore: exam.questions.length }
//     } catch (err) {
//       getErrorMessage(err)
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// export async function getClassesByGradeLevel(gradeId: string, schoolId: string) {
//     try {
//         return await prisma.class.findMany({
//             where: { 
//                 gradeId: gradeId,
//                 schoolId: schoolId 
//             },
//             select: { id: true, name: true }
//         });
//         getErrorMessage(err)
//         return [];
//     }
// }



// export async function getGroupedTopics(gradeSubjectId: string) {
//     try {
//         const terms = await prisma.term.findMany({
//             where: { grade: { gradeSubjects: { some: { id: gradeSubjectId } } } },
//             include: {
//                 topics: {
//                     where: { gradeSubjectId },
//                     select: { id: true, title: true }
//                 }
//             },
//             orderBy: { index: 'asc' }
//         });
//         return terms;
//     } catch (err) {
//       getErrorMessage(err)
//         return [];
//     }
// }

// export async function finalizeAndDeployExam(
//     config: ExamGenerationConfig,
//     verifiedQuestions: any[]
//   ) {
//     try {
  
//       const exams = await prisma.$transaction(async (tx) => {
  
//         // 1️⃣ Create Question Records
//         const questionRecords = await Promise.all(
//           verifiedQuestions.map((q) =>
//             tx.question.create({
//               data: {
//                 text: q.text,
//                 options: q.options as unknown as Prisma.InputJsonValue,
//                 correctAnswer: q.correctAnswer,
//                 explanation: q.explanation,
//                 category: QuestionCategory.EXAM,
//                 topicId: config.topicIds[0],
//                 schoolId: config.schoolId
//               }
//             })
//           )
//         )
  
//         // 2️⃣ Create Exams for Each Class
//         const createdExams = []
  
//         for (const classId of config.classIds) {
  
//           const exam = await tx.exam.create({
//             data: {
//               title: config.title,
//               type: config.type,
//               duration: config.duration,
            
//               startTime: config.startTime,   // ✅ ADD THIS
//               endTime: config.endTime,       // ✅ ADD THIS
            
//               status: ExamStatus.SCHEDULED,  // 🔥 IMPORTANT CHANGE (NOT PUBLISHED)
            
//               schoolId: config.schoolId,
//               classId: classId,
//               creatorId: config.teacherId,
//               termId: config.termId,
//               questions: {
//                 create: questionRecords.map((q, idx) => ({
//                   questionId: q.id,
//                   order: idx + 1
//                 }))
//               }
//             }
//           })
  
//           createdExams.push(exam)
  
//         }
  
//         return createdExams
  
//       }, { timeout: 30000 })
  
  
//       revalidatePath('/teacher/assessment')
  
//       return {
//         success: true,
//         examIds: exams.map(e => e.id)
//       }
  
//     } catch (err) {
//       getErrorMessage(err)
  
//       return {
//         success: false,
//         error: getErrorMessage(err)
//       }
  
//     }
//   }


// /**
//  * Fetches all exams created for the teacher's assigned subjects.
//  */
// export async function getTeacherExamHistory(teacherId: string, schoolId: string) {
//     try {
//         return await prisma.exam.findMany({
//             where: { 
//                 schoolId,
//                 creatorId: teacherId 
//             },
//             include: {
//                 class: { select: { name: true } },
//                 _count: { select: { questions: true } }
//             },
//             orderBy: { createdAt: 'desc' }
//         });
//     } catch (err) {
//       getErrorMessage(err)
//         return [];
//     }
// }

// /**
//  * Fetches the actual questions for a previously deployed exam.
//  */
// export async function getExamQuestions(examId: string) {
//     try {
//         const exam = await prisma.exam.findUnique({
//             where: { id: examId },
//             include: {
//                 questions: {
//                     include: { question: true },
//                     orderBy: { order: 'asc' }
//                 }
//             }
//         });
//         // Map to the same format as our 'generatedPool' state
//         return exam?.questions.map(q => q.question) || [];
//     } catch (err) {
//       getErrorMessage(err)
//         return [];
//     }
// }


// export async function getTopicsForClass(classId: string) {
//   try {
//       const klass = await prisma.class.findUnique({
//           where: { id: classId },
//           include: {
//               grade: {
//                   include: {
//                       gradeSubjects: {
//                           include: {
//                               topics: {
//                                   select: {
//                                       id: true,
//                                       title: true,
//                                       termId: true,
//                                   }
//                               }
//                           }
//                       }
//                   }
//               }
//           }
//       });

//       // Flatten all topics from all subjects belonging to this grade
//       const allTopics = klass?.grade.gradeSubjects.flatMap(gs => gs.topics) || [];
      
//       return allTopics;
//   } catch (err) {
//       console.error("getTopicsForClass error:", getErrorMessage(err));
//       return [];
//   }
// }



// export async function deleteExam(examId: string, teacherId: string) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: {
//         _count: {
//           select: { assessments: true }
//         }
//       }
//     })

//     if (!exam) throw new Error("Exam not found")

//     // 🔒 SECURITY: Only creator can delete
//     if (exam.creatorId !== teacherId) {
//       throw new Error("Unauthorized")
//     }

//     // 🚫 PREVENT DELETE IF STUDENTS HAVE TAKEN IT
//     if (exam._count.assessments > 0) {
//       throw new Error("Cannot delete exam. Students have already taken it.")
//     }

//     await prisma.$transaction(async (tx) => {
//       // delete linking table first
//       await tx.examQuestion.deleteMany({
//         where: { examId }
//       })

//       // delete submissions (if any drafts exist)
//       await tx.examSubmission.deleteMany({
//         where: { examId }
//       })

//       // delete exam
//       await tx.exam.delete({
//         where: { id: examId }
//       })
//     })

//     revalidatePath("/teacher/assessment")

//     return { success: true }
//   } catch (err) {
//     getErrorMessage(err)
//     return { success: false, error: getErrorMessage(err) }
//   }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory, Prisma } from '@prisma/client'
// import { google } from "@ai-sdk/google"
// import { generateObject } from "ai"
// import { z } from "zod"
// import { revalidatePath } from 'next/cache'

// // ── 1. Types & Schemas ────────────────────────────────────────────────────────

// const ExamQuestionsSchema = z.object({
//   questions: z.array(z.object({
//     text: z.string(),
//     options: z.array(z.string()),
//     correctAnswer: z.string(),
//     explanation: z.string(),
//   }))
// })

// export interface ExamGenerationConfig {
//   title: string
//   type: AssessmentType
//   schoolId: string
//   classIds: string[]
//   teacherId: string
//   termId: string
//   topicIds: string[]
//   totalQuestions: number
//   reusePercentage: number
//   duration: number
//   startTime: Date
//   endTime: Date
//   status: "SCHEDULED"
// }

// export interface ExamRegistryItem {
//   id: string
//   title: string
//   className: string
//   status: string
//   studentCount: number
//   completedCount: number
// }

// export interface AdminExamStats {
//     totalExams: number
//     activeNow: number
//     completionRate: number
// }

// interface GeneratedQuestion {
//   text: string
//   options: string[]
//   correctAnswer: string
//   explanation: string
// }

// interface ExamPoolItem extends GeneratedQuestion {
//   id?: string
//   category: "REVISION" | "NEW_AI"
//   points?: number
//   topicId?: string
// }

// // ── 2. AI Question Pool Generation ──────────────────────────────────────────

// export async function buildExamPool(config: {
//   topicIds: string[];
//   totalQuestions: number;
//   reusePercentage: number;
//   schoolId: string;
// }) {
//   console.log("🚀 [SERVER] Initializing Google AI model...");

//   try {
//     const reuseCount = Math.floor(
//       config.totalQuestions * (config.reusePercentage / 100)
//     );
//     const newCount = config.totalQuestions - reuseCount;
//     // FIX: pool is now const as it is not reassigned, and typed properly
//     const pool: ExamPoolItem[] = [];

//     // 1️⃣ SOURCE REVISION QUESTIONS FROM DATABASE
//     if (reuseCount > 0) {
//       const existing = await prisma.question.findMany({
//         where: {
//           topicId: { in: config.topicIds },
//           category: "PRACTICE",
//           OR: [{ schoolId: config.schoolId }, { schoolId: null }],
//         },
//         take: reuseCount,
//       });

//       pool.push(...existing.map((q) => ({
//         text: q.text,
//         options: q.options as string[],
//         correctAnswer: q.correctAnswer,
//         explanation: q.explanation ?? "",
//         id: q.id,
//         category: "REVISION" as const
//       })));
//     }

//     // 2️⃣ GENERATE NEW QUESTIONS
//     if (newCount > 0) {
//       const topics = await prisma.topic.findMany({
//         where: { id: { in: config.topicIds } },
//         select: { title: true },
//       });

//       const context = topics.map((t) => t.title).join(", ");

//       const prompt = `
//           Act as a Senior WAEC/JAMB Examiner.
//           Generate exactly ${newCount} high-quality multiple choice questions
//           based on the Nigerian Secondary School curriculum for these topics: ${context}.
  
//           REQUIREMENTS:
//           - Use Nigerian academic terminology (e.g., 'Full stop' not 'Period').
//           - Exactly 4 options per question.
//           - Provide a pedagogical explanation for the correct key.
  
//           OUTPUT FORMAT (JSON):
//           {
//             "questions": [
//               {
//                 "text": "The question string",
//                 "options": ["Option A", "Option B", "Option C", "Option D"],
//                 "correctAnswer": "The exact string from options",
//                 "explanation": "Rationale"
//               }
//             ]
//           }
//         `;

//       const { object: validated } = await generateObject({
//         model: google("gemini-1.5-flash"), // 2.5 does not exist, using 1.5 stable
//         schema: ExamQuestionsSchema,
//         prompt,
//       });

//       if (validated.questions) {
//         const aiQuestions = validated.questions.map((q) => ({
//           ...q,
//           category: "NEW_AI" as const,
//         }));
//         pool.push(...aiQuestions);
//       }
//     }

//     console.log(`✨ [SERVER] Pool synthesized with ${pool.length} total items.`);

//     // 3️⃣ PERSIST NEW AI QUESTIONS TO DATABASE
//     if (pool.length > 0) {
//       const newAiQuestionsOnly = pool.filter((q) => q.category === "NEW_AI");

//       if (newAiQuestionsOnly.length > 0) {
//         await prisma.question.createMany({
//           data: newAiQuestionsOnly.map((q) => ({
//             text: q.text,
//             options: q.options as unknown as Prisma.InputJsonValue,
//             correctAnswer: q.correctAnswer,
//             explanation: q.explanation ?? null,
//             points: 1,
//             topicId: config.topicIds[0],
//             schoolId: config.schoolId,
//             category: QuestionCategory.EXAM,
//           })),
//         });
//       }
//     }

//     return { success: true, questions: pool };

//   } catch (err) {
//     const message = getErrorMessage(err);
//     console.error("❌ [SERVER] Google AI generation failure:", message);

//     if (message.includes("429") || message.toLowerCase().includes("quota")) {
//       return {
//         success: false,
//         error: "API Limit reached. Please reduce question count or enable billing in Google AI Studio.",
//       };
//     }

//     return { success: false, error: message };
//   }
// }

// /**
//  * Fetches authorized assignments for the teacher.
//  */
// export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string) {
//   try {
//     return await prisma.gradeSubject.findMany({
//       where: {
//         AND: [
//           {
//             OR: [
//               { profileId: teacherId },
//               { teachers: { some: { id: teacherId } } }
//             ],
//           },
//           {
//             OR: [{ schoolId: null }, { schoolId: schoolId }],
//           }
//         ]
//       },
//       include: {
//         subject: { select: { name: true } },
//         grade: { select: { id: true, displayName: true } }
//       },
//       orderBy: { grade: { level: 'asc' } }
//     });
//   } catch (err) {
//     console.error(getErrorMessage(err));
//     return [];
//   }
// }




// /**
//  * Admin: Get Registry Stats
//  */
// export async function getAdminExamRegistry(schoolId: string) {
//   try {
//     const examsData = await prisma.exam.findMany({
//       where: { schoolId },
//       include: {
//         class: { include: { _count: { select: { enrollments: true } } } },
//         _count: { select: { assessments: true } }
//       },
//       orderBy: { createdAt: 'desc' }
//     });

//     const exams: ExamRegistryItem[] = examsData.map((e) => ({
//       id: e.id,
//       title: e.title,
//       className: e.class.name,
//       status: e.status,
//       studentCount: e.class._count.enrollments,
//       completedCount: e._count.assessments
//     }));

//     const totalExams = exams.length;
//     const activeNow = exams.filter(e => e.status === 'PUBLISHED').length;
//     const totalExpected = exams.reduce((acc, curr) => acc + curr.studentCount, 0);
//     const totalActual = exams.reduce((acc, curr) => acc + curr.completedCount, 0);
//     const completionRate = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

//     return { success: true, stats: { totalExams, activeNow, completionRate }, exams };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// /**
//  * STUDENT: submit exam logic
//  */
// export async function submitExam(examId: string, studentId: string, schoolId: string, answers: Record<string, string>) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: { questions: { include: { question: true } } }
//     })

//     if (!exam) throw new Error("Exam offline.")

//     let score = 0
//     exam.questions.forEach((eq) => {
//       if (answers[eq.questionId] === eq.question.correctAnswer) {
//         score += eq.question.points
//       }
//     })

//     await prisma.assessment.create({
//       data: {
//         type: exam.type,
//         score,
//         maxScore: exam.questions.length,
//         studentId,
//         schoolId,
//         gradeSubjectId: "GS_ID_PLACEHOLDER",
//         comments: "Auto-graded"
//       }
//     })

//     revalidatePath('/student/grades')
//     return { success: true, score, maxScore: exam.questions.length }
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) }
//   }
// }

// export async function getClassesByGradeLevel(gradeId: string, schoolId: string) {
//   try {
//     return await prisma.class.findMany({
//       where: {
//         gradeId: gradeId,
//         schoolId: schoolId
//       },
//       select: { id: true, name: true }
//     });
//   } catch (err) {
//     console.error(getErrorMessage(err));
//     return [];
//   }
// }

// export async function buildExamFromBank(config: {
//   topicIds: string[];
//   totalQuestions: number;
// }) {
//   try {
//     const questions = await prisma.question.findMany({
//       where: {
//         topicId: { in: config.topicIds },
//         type: "MCQ", // exams objective part
//       },
//     });

//     if (questions.length < config.totalQuestions) {
//       throw new Error("Not enough questions in bank");
//     }

//     // 🎯 RANDOMIZE
//     const shuffled = questions.sort(() => 0.5 - Math.random());

//     const selected = shuffled.slice(0, config.totalQuestions);

//     return {
//       success: true,
//       questions: selected,
//     };

//   } catch (err) {
//     return {
//       success: false,
//       error: getErrorMessage(err),
//     };
//   }
// }



// export async function getGroupedTopics(gradeSubjectId: string) {
//   try {
//     return await prisma.term.findMany({
//       where: { grade: { gradeSubjects: { some: { id: gradeSubjectId } } } },
//       include: {
//         topics: {
//           where: { gradeSubjectId },
//           select: { id: true, title: true }
//         }
//       },
//       orderBy: { index: 'asc' }
//     });
//   } catch (err) {
//     console.error(getErrorMessage(err));
//     return [];
//   }
// }


// export async function finalizeAndDeployExam(
//   config: ExamGenerationConfig,
//   selectedQuestions: { id: string }[]
// ) {
//   try {
//     return await prisma.$transaction(async (tx) => {

//       /* ─────────────────────────────────────────────
//          1. ANTI-DUPLICATE EXAM PROTECTION
//       ───────────────────────────────────────────── */
//       const duplicateExam = await tx.exam.findFirst({
//         where: {
//           title: config.title,
//           classId: { in: config.classIds },
//           termId: config.termId,
//           schoolId: config.schoolId,
//         },
//         select: { id: true },
//       });

//       if (duplicateExam) {
//         throw new Error("Exam already exists for this class/term");
//       }

//       /* ─────────────────────────────────────────────
//          2. VALIDATE QUESTIONS EXIST IN BANK
//       ───────────────────────────────────────────── */
//       const dbQuestions = await tx.question.findMany({
//         where: {
//           id: { in: selectedQuestions.map(q => q.id) },
//         },
//         select: { id: true },
//       });

//       const validIds = new Set(dbQuestions.map(q => q.id));

//       const cleanedQuestions = selectedQuestions.filter(q =>
//         validIds.has(q.id)
//       );

//       if (cleanedQuestions.length === 0) {
//         throw new Error("No valid questions found in question bank");
//       }

//       /* ─────────────────────────────────────────────
//          3. CREATE EXAMS PER CLASS
//       ───────────────────────────────────────────── */
//       const created: any[] = [];

//       for (const classId of config.classIds) {

//         const exam = await tx.exam.create({
//           data: {
//             title: config.title,
//             type: config.type,
//             duration: config.duration,
//             startTime: config.startTime,
//             endTime: config.endTime,
//             status: "SCHEDULED",

//             schoolId: config.schoolId,
//             classId,
//             creatorId: config.teacherId,
//             termId: config.termId,

//             questions: {
//               create: cleanedQuestions.map((q, i) => ({
//                 question: {
//                   connect: { id: q.id },
//                 },
//                 order: i + 1,
//               })),
//             },
//           },
//         });

//         created.push(exam);
//       }

//       return created;
//     });

//   } catch (err) {
//     return {
//       success: false,
//       error: getErrorMessage(err),
//     };
//   }
// }


// export async function getTeacherExamHistory(teacherId: string, schoolId: string) {
//   try {
//     return await prisma.exam.findMany({
//       where: { schoolId, creatorId: teacherId },
//       include: {
//         class: { select: { name: true } },
//         _count: { select: { questions: true } }
//       },
//       orderBy: { createdAt: 'desc' }
//     });
//   } catch (err) {
//     console.error(getErrorMessage(err));
//     return [];
//   }
// }

// export async function getExamQuestions(examId: string) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: {
//         questions: {
//           include: { question: true },
//           orderBy: { order: 'asc' }
//         }
//       }
//     });
//     return exam?.questions.map(q => q.question) || [];
//   } catch (err) {
//     console.error(getErrorMessage(err));
//     return [];
//   }
// }

// export async function getTopicsForClass(classId: string) {
//   try {
//     const klass = await prisma.class.findUnique({
//       where: { id: classId },
//       include: {
//         grade: {
//           include: {
//             gradeSubjects: {
//               include: {
//                 topics: {
//                   select: { id: true, title: true, termId: true }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });
//     return klass?.grade.gradeSubjects.flatMap(gs => gs.topics) || [];
//   } catch (err) {
//     console.error("getTopicsForClass error:", getErrorMessage(err));
//     return [];
//   }
// }

// export async function deleteExam(examId: string, teacherId: string) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: { _count: { select: { assessments: true } } }
//     })

//     if (!exam) throw new Error("Exam not found")
//     if (exam.creatorId !== teacherId) throw new Error("Unauthorized")
//     if (exam._count.assessments > 0) throw new Error("Cannot delete exam. Students have already taken it.")

//     await prisma.$transaction(async (tx) => {
//       await tx.examQuestion.deleteMany({ where: { examId } })
//       await tx.examSubmission.deleteMany({ where: { examId } })
//       await tx.exam.delete({ where: { id: examId } })
//     })

//     revalidatePath("/teacher/assessment")
//     return { success: true }
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) }
//   }
// }




// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { AssessmentType, ExamStatus, QuestionCategory, Prisma, Role, Question } from '@prisma/client'
// import { google } from "@ai-sdk/google"
// import { generateObject } from "ai"
// import { z } from "zod"
// import { revalidatePath } from 'next/cache'
// import { contentScope, academicCoreScope } from '@/lib/content-scope'
// import { logActivity } from '@/lib/activitylogger'

// // ── 1. Types & Schemas ─────────────────────────────────────────
// const ExamQuestionsSchema = z.object({
//   questions: z.array(z.object({
//     text: z.string(),
//     options: z.array(z.string()),
//     correctAnswer: z.string(),
//     explanation: z.string(),
//   }))
// })

// export interface ExamGenerationConfig {
//   title: string
//   type: AssessmentType
//   schoolId: string
//   classIds: string[]
//   teacherId: string
//   termId: string
//   topicIds: string[]
//   totalQuestions: number
//   reusePercentage: number
//   duration: number
//   startTime: Date
//   endTime: Date
//   status: "SCHEDULED"
// }

// export interface ExamRegistryItem {
//   id: string
//   title: string
//   className: string
//   status: string
//   studentCount: number
//   completedCount: number
// }

// interface ExamPoolItem {
//   id?: string
//   text: string
//   options: string[]
//   correctAnswer: string
//   explanation: string
//   category: "REVISION" | "NEW_AI"
// }

// // ── 2. AI Question Pool Generation ──────────────────────────────────────────

// export async function buildExamPool(config: {
//   topicIds: string[];
//   totalQuestions: number;
//   reusePercentage: number;
//   schoolId: string;
// }) {
//   try {
//     const reuseCount = Math.floor(config.totalQuestions * (config.reusePercentage / 100));
//     const newCount = config.totalQuestions - reuseCount;
//     const pool: ExamPoolItem[] = [];

//     // 1️⃣ SOURCE REVISION QUESTIONS (Rule 7: Global + School Scope)
//     if (reuseCount > 0) {
//       const existing = await prisma.question.findMany({
//         where: {
//           topicId: { in: config.topicIds },
//           ...contentScope({ schoolId: config.schoolId }),
//         },
//         take: reuseCount,
//       });

//       pool.push(...existing.map((q) => ({
//         text: q.text,
//         options: q.options as string[],
//         correctAnswer: q.correctAnswer,
//         explanation: q.explanation ?? "",
//         id: q.id,
//         category: "REVISION" as const
//       })));
//     }

//     // 2️⃣ GENERATE NEW QUESTIONS
//     if (newCount > 0) {
//       const topics = await prisma.topic.findMany({
//         where: { 
//             id: { in: config.topicIds },
//             ...contentScope({ schoolId: config.schoolId })
//         },
//         select: { title: true },
//       });

//       const context = topics.map((t) => t.title).join(", ");
//       const prompt = `Act as a Senior Examiner. Generate ${newCount} MCQ questions for: ${context}. Use Nigerian terminology. 4 options. JSON format.`;

//       const { object: validated } = await generateObject({
//         model: google("gemini-1.5-flash"),
//         schema: ExamQuestionsSchema,
//         prompt,
//       });

//       if (validated.questions) {
//         pool.push(...validated.questions.map(q => ({ ...q, category: "NEW_AI" as const })));
//       }
//     }

//     // 3️⃣ PERSIST NEW AI QUESTIONS TO SCHOOL BANK (Rule 5 & 8)
//     const newAiQuestions = pool.filter(q => q.category === "NEW_AI");
//     if (newAiQuestions.length > 0) {
//       await prisma.question.createMany({
//         data: newAiQuestions.map((q) => ({
//           text: q.text,
//           options: q.options as unknown as Prisma.InputJsonValue,
//           correctAnswer: q.correctAnswer,
//           explanation: q.explanation,
//           topicId: config.topicIds[0],
//           schoolId: config.schoolId, // Tagged to school
//           category: QuestionCategory.EXAM,
//         })),
//       });
//     }

//     return { success: true, questions: pool };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// /**
//  * Fetches authorized assignments (Rule 5 & 6)
//  */
// export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string | null) {
//   try {
//     return await prisma.gradeSubject.findMany({
//       where: {
//         AND: [
//           { teachers: { some: { id: teacherId } } },
//           academicCoreScope({ schoolId })
//         ]
//       },
//       include: {
//         subject: { select: { name: true } },
//         grade: { select: { id: true, displayName: true } }
//       }
//     });
//   } catch (err) {
//     console.error(getErrorMessage(err));
//     return [];
//   }
// }



// export async function getGroupedTopics(gradeSubjectId: string) {
//   try {
//     return await prisma.term.findMany({
//       where: { grade: { gradeSubjects: { some: { id: gradeSubjectId } } } },
//       include: {
//         topics: {
//           where: { gradeSubjectId },
//           select: { id: true, title: true }
//         }
//       },
//       orderBy: { index: 'asc' }
//     });
//   } catch (err) {
//     console.error(getErrorMessage(err));
//     return [];
//   }
// }


// /**
//  * FINAL DEPLOYMENT (Rule 5: School Isolation)
//  */
// export async function finalizeAndDeployExam(
//   config: ExamGenerationConfig,
//   selectedQuestions: { id: string }[],
//   userId: string,
//   userRole: Role
// ) {
//   if (!config.schoolId) throw new Error("Independent users cannot deploy exams.");

//   try {
//     const results = await prisma.$transaction(async (tx) => {
//       const exams: Prisma.ExamGetPayload<{}>[] = [];

//       for (const classId of config.classIds) {
//         const exam = await tx.exam.create({
//           data: {
//             title: config.title,
//             type: config.type,
//             duration: config.duration,
//             startTime: config.startTime,
//             endTime: config.endTime,
//             schoolId: config.schoolId,
//             classId,
//             creatorId: config.teacherId,
//             termId: config.termId,
//             questions: {
//               create: selectedQuestions.map((q, i) => ({
//                 questionId: q.id,
//                 order: i + 1,
//               })),
//             },
//           },
//         });
//         exams.push(exam);
//       }

//       await logActivity({
//         schoolId: config.schoolId,
//         actorId: userId,
//         actorRole: userRole,
//         type: "ASSESSMENT_CREATED",
//         title: `Exam Deployed: ${config.title}`,
//         description: `Created ${config.classIds.length} exam instances for school.`
//       });

//       return exams;
//     });

//     revalidatePath('/teacher/assessment');
//     return { success: true, data: results };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// export async function submitExam(examId: string, studentId: string, schoolId: string, answers: Record<string, string>) {
//     try {
//       const exam = await prisma.exam.findUnique({
//         where: { id: examId, schoolId }, // Rule 5: Ensure student is in correct school
//         include: { questions: { include: { question: true } } }
//       })
  
//       if (!exam) throw new Error("Exam not found or access denied.")
  
//       let score = 0
//       exam.questions.forEach((eq) => {
//         if (answers[eq.questionId] === eq.question.correctAnswer) {
//           score += eq.question.points
//         }
//       })
  
//       await prisma.assessment.create({
//         data: {
//           type: exam.type,
//           score,
//           maxScore: exam.questions.length,
//           studentId,
//           schoolId,
//           gradeSubjectId: "DYNAMIC_GS_ID",
//           comments: "AI Auto-graded",
//           examId: exam.id
//         }
//       })
  
//       await logActivity({
//         schoolId,
//         actorId: studentId,
//         type: "ASSESSMENT_GRADED",
//         title: "Exam Submitted",
//         description: `Completed ${exam.title} with score ${score}/${exam.questions.length}`
//       });
  
//       revalidatePath('/student/grades')
//       return { success: true, score, maxScore: exam.questions.length }
//     } catch (err) {
//       return { success: false, error: getErrorMessage(err) }
//     }
//   }


'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { 
    AssessmentType, 
    ExamStatus, 
    QuestionCategory, 
    QuestionType, 
    Prisma, 
    Role, 
    ActivityType,
    Question 
} from '@prisma/client'
import { google } from "@ai-sdk/google"
import { generateObject } from "ai"
import { z } from "zod"
import { revalidatePath } from 'next/cache'
import { contentScope, academicCoreScope } from '@/lib/content-scope'
import { logActivity } from "@/lib/activitylogger";

// ── 1. Types & Schemas ────────────────────────────────────────────────────────

const ExamQuestionsSchema = z.object({
  questions: z.array(z.object({
    text: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
    explanation: z.string(),
  }))
})

export interface ExamGenerationConfig {
  title: string
  type: AssessmentType
  schoolId: string
  classIds: string[]
  teacherId: string
  termId: string
  topicIds: string[]
  totalQuestions: number
  reusePercentage: number
  duration: number
  startTime: Date
  endTime: Date
  status: "SCHEDULED"
}

export interface ExamPoolItem {
  id?: string
  text: string
  options: string[]
  correctAnswer: string
  explanation: string
  category: "REVISION" | "NEW_AI"
}

export interface AdminExamStats {
  totalExams: number
  activeNow: number
  completionRate: number
}

 
export interface ExamRegistryItem {
  id: string
  title: string
  className: string
  status: string
  studentCount: number
  completedCount: number
}

// ── 2. AI Question Pool Generation ──────────────────────────────────────────

/**
 * Synthesizes a pool of questions for a specific exam.
 * Tier 2 Rule: New AI questions are stored in the School's bank.
 */
export async function buildExamPool(config: {
  topicIds: string[];
  totalQuestions: number;
  reusePercentage: number;
  schoolId: string;
  userId: string;
}) {
  try {
    const reuseCount = Math.floor(config.totalQuestions * (config.reusePercentage / 100));
    const newCount = config.totalQuestions - reuseCount;
    const pool: ExamPoolItem[] = [];

    // 1️⃣ SOURCE REVISION QUESTIONS (Rule 7)
    if (reuseCount > 0) {
      const existing = await prisma.question.findMany({
        where: {
          topicId: { in: config.topicIds },
          ...contentScope({ schoolId: config.schoolId }),
        },
        take: reuseCount,
      });

      pool.push(...existing.map((q) => ({
        text: q.text,
        options: q.options as string[],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation ?? "",
        id: q.id,
        category: "REVISION" as const
      })));
    }

    // 2️⃣ GENERATE NEW QUESTIONS (Rule 8)
    if (newCount > 0) {
      const topics = await prisma.topic.findMany({
        where: { id: { in: config.topicIds }, ...contentScope({ schoolId: config.schoolId }) },
        select: { title: true },
      });

      const context = topics.map((t) => t.title).join(", ");
      const prompt = `Act as a Senior WAEC/JAMB Examiner. Generate ${newCount} high-quality MCQ questions for these topics: ${context}. Use Nigerian terminology. Provide explanation. JSON format.`;

      const { object: validated } = await generateObject({
        model: google("gemini-1.5-flash"),
        schema: ExamQuestionsSchema,
        prompt,
      });

      if (validated.questions) {
        pool.push(...validated.questions.map(q => ({ ...q, category: "NEW_AI" as const })));
      }
    }

    // 3️⃣ PERSIST NEW AI QUESTIONS (Rule 5, 8, 11)
    // ✅ FIXED: Added missing 'type' and 'isGlobal' fields to resolve TS error
    const newAiQuestions = pool.filter(q => q.category === "NEW_AI");
    if (newAiQuestions.length > 0) {
      await prisma.question.createMany({
        data: newAiQuestions.map((q) => ({
          text: q.text,
          options: q.options as unknown as Prisma.InputJsonValue,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          topicId: config.topicIds[0],
          schoolId: config.schoolId,
          creatorId: config.userId,
          isGlobal: false, // Rule 5: School specific
          type: QuestionType.MCQ,
          category: QuestionCategory.EXAM,
        })),
      });
    }

    return { success: true, questions: pool };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// ── 3. Queries ───────────────────────────────────────────────────────────────

/**
 * Fetches authorized assignments for the teacher.
 */
export async function getTeacherAuthorizedAssignments(teacherId: string, schoolId: string | null) {
  try {
    return await prisma.gradeSubject.findMany({
      where: {
        AND: [
          { teachers: { some: { id: teacherId } } },
          academicCoreScope({ schoolId })
        ]
      },
      include: {
        subject: { select: { name: true } },
        grade: { select: { id: true, displayName: true } }
      },
      orderBy: { grade: { level: 'asc' } }
    });
  } catch (err: unknown) {
    console.error(getErrorMessage(err));
    return [];
  }
}

/**
 * Retrieves topics grouped by term for selection.
 */
export async function getGroupedTopics(gradeSubjectId: string) {
  try {
    return await prisma.term.findMany({
      where: { grade: { gradeSubjects: { some: { id: gradeSubjectId } } } },
      include: {
        topics: {
          where: { gradeSubjectId },
          select: { id: true, title: true }
        }
      },
      orderBy: { index: 'asc' }
    });
  } catch (err: unknown) {
    console.error(getErrorMessage(err));
    return [];
  }
}

// ── 4. Mutations ──────────────────────────────────────────────────────────────

/**
 * Rule 5 & 11: Deploys exam instances to classes within a school.
 */
export async function finalizeAndDeployExam(
  config: ExamGenerationConfig,
  selectedQuestions: { id: string }[],
  userId: string,
  userRole: Role
) {
  if (!config.schoolId) throw new Error("Independent users cannot deploy institutional exams.");

  try {
    const results = await prisma.$transaction(async (tx) => {
      const exams: Prisma.ExamGetPayload<{}>[] = [];

      for (const classId of config.classIds) {
        const exam = await tx.exam.create({
          data: {
            title: config.title,
            type: config.type,
            duration: config.duration,
            startTime: config.startTime,
            endTime: config.endTime,
            status: ExamStatus.SCHEDULED,
            schoolId: config.schoolId,
            classId,
            creatorId: config.teacherId,
            termId: config.termId,
            questions: {
              create: selectedQuestions.map((q, i) => ({
                questionId: q.id,
                order: i + 1,
              })),
            },
          },
        });
        exams.push(exam);
      }

      await logActivity({
        schoolId: config.schoolId,
        actorId: userId,
        actorRole: userRole,
        type: ActivityType.ASSESSMENT_CREATED,
        title: `Exam Deployed: ${config.title}`,
        description: `Deployed to ${config.classIds.length} classes.`
      });

      return exams;
    });

    revalidatePath('/teacher/assessment');
    return { success: true, data: results };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * Handles official school exam submission.
 * Rule 11: Transactional grading + Assessment record creation.
 */
export async function submitExam(
    examId: string, 
    studentId: string, 
    schoolId: string, 
    answers: Record<string, string>
) {
    try {
      const exam = await prisma.exam.findUnique({
        where: { id: examId, schoolId },
        include: { 
            questions: { 
                include: { 
                    question: { include: { topic: true } } 
                } 
            } 
        }
      })
  
      if (!exam) throw new Error("Exam record inaccessible.");
  
      let score = 0
      exam.questions.forEach((eq) => {
        if (answers[eq.questionId] === eq.question.correctAnswer) {
          score += eq.question.points
        }
      })

      // ✅ FIXED: Dynamically resolve the gradeSubjectId from the context
      const gradeSubjectId = exam.questions[0]?.question.topic.gradeSubjectId;
      if (!gradeSubjectId) throw new Error("Internal Reference Error: Subject mapping failed.");
  
      await prisma.assessment.create({
        data: {
          type: exam.type,
          score,
          maxScore: exam.questions.length,
          studentId,
          schoolId,
          gradeSubjectId,
          comments: "CBT Automated Grading",
          examId: exam.id
        }
      })
  
      await logActivity({
        schoolId,
        actorId: studentId,
        type: ActivityType.ASSESSMENT_GRADED,
        title: "Exam Finalized",
        description: `Submitted ${exam.title}. Score: ${score}/${exam.questions.length}`
      });
  
      revalidatePath('/student/grades')
      return { success: true, score, maxScore: exam.questions.length }
    } catch (err: unknown) {
      return { success: false, error: getErrorMessage(err) }
    }
  }

  export async function getAdminExamRegistry(schoolId: string) {
    try {
        const examsData = await prisma.exam.findMany({
            where: { schoolId },
            include: {
                class: { include: { _count: { select: { enrollments: true } } } },
                _count: { select: { assessments: true } }
            },
            orderBy: { createdAt: 'desc' }
        });

        const exams = examsData.map((e) => ({
            id: e.id,
            title: e.title,
            className: e.class.name,
            status: e.status,
            studentCount: e.class._count.enrollments,
            completedCount: e._count.assessments
        }));

        const totalExams = exams.length;
        const activeNow = exams.filter(e => e.status === 'PUBLISHED').length;
        const totalExpected = exams.reduce((acc, curr) => acc + curr.studentCount, 0);
        const totalActual = exams.reduce((acc, curr) => acc + curr.completedCount, 0);
        const completionRate = totalExpected > 0 ? Math.round((totalActual / totalExpected) * 100) : 0;

        return { success: true, stats: { totalExams, activeNow, completionRate }, exams };
    } catch (err) {
      getErrorMessage(err)
        return { success: false, error: getErrorMessage(err) };
    }
}

