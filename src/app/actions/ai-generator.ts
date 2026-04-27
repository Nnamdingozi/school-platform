
// "use server";
// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma } from "@prisma/client"; 

// const LessonAiSchema = z.object({
//   title: z.string(),
//   learningObjectives: z.array(z.string()),
//   explanation: z.string(), 
//   examples: z.array(
//     z.object({
//       task: z.string(),
//       solution: z.string(),
//     })
//   ),
//   visualAids: z.array(z.object({
//     title: z.string(),
//     description: z.string(),
//     imagePrompt: z.string(),
//     url: z.string().optional(), 
//   })),
//   summary: z.string(),
//   quiz: z.array(
//     z.object({
//       question: z.string(),
//       options: z.array(z.string()),
//       answer: z.string(),
//       explanation: z.string(),
//     })
//   ),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// export async function generateLessonForTopic(topicId: string) {
//   const topic = await prisma.topic.findUnique({
//     where: { id: topicId },
//     include: {
//       gradeSubject: {
//         include: {
//           grade: { include: { curriculum: true } },
//           subject: true,
//         },
//       },
//       school: true,
//     },
//   });

//   if (!topic) throw new Error("Topic not found");

//   const { curriculum } = topic.gradeSubject.grade;
//   const subjectName = topic.gradeSubject.subject.name;

//   // ✅ FIX: The variable is now used in the string template
//   const dynamicPrompt = `
//     You are an expert ${curriculum.name} instructional designer.
//     Generate a comprehensive lesson for the subject: ${subjectName}.
   
    // STRICT SCOPE:
    // - Topic: ${topic.title}
    // - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
    // - Level: ${topic.gradeSubject.grade.displayName}
//   `;

//   const { object: ai } = await generateObject({
//     model: google("gemini-1.5-flash"), 
//     schema: LessonAiSchema,
//     prompt: dynamicPrompt,
//   });

//   const lesson = await prisma.$transaction(async (tx) => {
//     const existingLesson = await tx.lesson.findUnique({
//       where: { topicId: topic.id },
//       select: { id: true }
//     });

//     if (existingLesson) {
//       await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//     }

//     const savedLesson = await tx.lesson.upsert({
//       where: { topicId: topic.id },
//       update: {
//         title: ai.title,
//         content: ai.explanation,
//         aiContent: ai as unknown as Prisma.InputJsonValue, 
//       },
//       create: {
//         topicId: topic.id,
//         title: ai.title,
//         content: ai.explanation,
//         schoolId: topic.schoolId,
//         aiContent: ai as unknown as Prisma.InputJsonValue,
//       },
//     });

//     const quiz = await tx.quiz.create({
//       data: { lessonId: savedLesson.id }
//     });

//     await tx.question.createMany({
//       data: ai.quiz.map((q) => ({
//         quizId: quiz.id,
//         text: q.question,
//         options: q.options,
//         correctAnswer: q.answer,
//         explanation: q.explanation,
//       })),
//     });

//     return savedLesson;
//   });

//   revalidatePath(`/dashboard/lessons/${topic.id}`);
//   return lesson;
// }



// "use server";
// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma } from "@prisma/client"; 
// import { getErrorMessage } from "@/lib/error-handler";

// // ── 1. The Professional Nested Schema ─────────────────────────────────────────
// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   // Pedagogical instructions (Teacher only)
//   teacherLogic: z.object({
//     teachingMethod: z.string(), // e.g., Inquiry-based, Direct instruction
//     timeAllocation: z.string(), // e.g., "40 Minutes"
//     pedagogicalTips: z.string(), // "Hidden" tips for the teacher
//     introductionHook: z.string(), // How to start the class
//   }),
//   // Study material (Student & Teacher)
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(), 
//     examples: z.array(
//       z.object({
//         task: z.string(),
//         solution: z.string(),
//       })
//     ),
//    // In ai-generator.ts
// visualAids: z.array(z.object({
//   title: z.string(),
//   description: z.string(),
//   imagePrompt: z.string(),
//   url: z.string().optional(), // 👈 Add this line to the Zod schema
// })),
//     summary: z.string(),
//     vocabulary: z.array(z.string()), // Key terms for students
//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// export async function generateLessonForTopic(topicId: string) {
//   const topic = await prisma.topic.findUnique({
//     where: { id: topicId },
//     include: {
//       gradeSubject: {
//         include: {
//           grade: { include: { curriculum: true } },
//           subject: true,
//         },
//       },
//       school: true,
//     },
//   });

//   if (!topic) throw new Error("Topic not found");

//   const { curriculum } = topic.gradeSubject.grade;
//   const subjectName = topic.gradeSubject.subject.name;

//   // ── 2. The Updated Instructional Prompt ──────────────────────────────────────
//   const dynamicPrompt = `
//     You are an expert instructional designer specializing in the ${curriculum.name} curriculum.
//     Generate a full academic package for: ${subjectName}.
   
//     STRICT SCOPE:
//     - Topic: ${topic.title}
//     - Content Context: ${topic.description ?? "Follow standard syllabus principles."}
//     - Student Level: ${topic.gradeSubject.grade.displayName}

//     REQUIRED STRUCTURE:
//     1. TEACHER LOGIC: Provide a lesson plan including teaching methods, 40-minute time distribution, and classroom management tips.
//     2. STUDENT CONTENT: Provide high-quality lesson notes, worked examples, and a summary.
//     3. QUIZ: Provide 5 multiple-choice questions with detailed explanations for answers.
//   `;

//   const { object: ai } = await generateObject({
//     model: google("gemini-1.5-flash"), 
//     schema: LessonAiSchema,
//     prompt: dynamicPrompt,
//   });

//   // ── 3. Atomic Database Sync ──────────────────────────────────────────────────
//   const lesson = await prisma.$transaction(async (tx) => {
//   // Inside the transaction block (tx)
// const existingLesson = await tx.lesson.findUnique({
//   where: {
//     topicId_schoolId: {
//       topicId: topic.id,
//       schoolId: topic.schoolId as string,  // Handle null for global curriculum
//     }
//   },
//   select: { id: true }
// });

// // Inside generateLessonForTopic...
//  const savedLesson = await tx.lesson.upsert({
//   where: {
//     topicId_schoolId: {
//       topicId: topic.id,
//       // ✅ FIX: Cast 'as string' to satisfy the unique input requirement
//       // Prisma will still correctly send 'null' to the DB if the value is null
//       schoolId: topic.schoolId as string 
//     }
//   },
//   update: {
//     title: ai.studentContent.title,
//     content: ai.studentContent.explanation,
//     aiContent: ai as unknown as Prisma.InputJsonValue,
//   },
//   create: {
//     topicId: topic.id,
//     schoolId: topic.schoolId, // This line is usually fine as it's not the unique input
//     title: ai.studentContent.title,
//     content: ai.studentContent.explanation,
//     aiContent: ai as unknown as Prisma.InputJsonValue,
//   },
// });

//     const quiz = await tx.quiz.create({
//       data: { lessonId: savedLesson.id }
//     });

//     // Extract questions from the nested studentContent.quiz array
//     await tx.question.createMany({
//       data: ai.studentContent.quiz.map((q) => ({
//         quizId: quiz.id,
//         text: q.question,
//         options: q.options,
//         correctAnswer: q.answer,
//         explanation: q.explanation,
//       })),
//     });

//     return savedLesson;
//   });

//   revalidatePath(`/teacher/lessons/${topic.id}`);
//   revalidatePath(`/admin/lessons`);
//   return lesson;
// }


// export async function saveLessonAction(data: {
//   topicId: string;
//   schoolId: string | null;
//   title: string;
//   content: string;
//   aiContent: any;
// }) {
//   try {
//     const lesson = await prisma.lesson.upsert({
//       where: {
//         topicId_schoolId: {
//           topicId: data.topicId,
//           schoolId: data.schoolId as string, // Cast for Prisma unique input
//         },
//       },
//       update: {
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//       create: {
//         topicId: data.topicId,
//         schoolId: data.schoolId,
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//     });

//     // Refresh relevant paths
//     revalidatePath(`/teacher/lessons/${data.topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: lesson };
//   } catch (err) {
//     console.error("saveLessonAction error:", getErrorMessage(err));
//     return { success: false, error: getErrorMessage(err) };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma } from "@prisma/client"; 
// import { getErrorMessage } from "@/lib/error-handler";

// // ── 1. The Schema ─────────────────────────────────────────────────────────────

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(), 
//     examples: z.array(z.object({ task: z.string(), solution: z.string() })),
//     visualAids: z.array(z.object({
//       title: z.string(),
//       description: z.string(),
//       imagePrompt: z.string(),
//       url: z.string().optional() // ✅ Included as requested
//     })),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(z.object({
//       question: z.string(),
//       options: z.array(z.string()),
//       answer: z.string(),
//       explanation: z.string(),
//     })),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// // ── 2. The Persistence Action (Used by Manual Editor) ─────────────────────────

// export async function saveLessonAction(data: {
//   topicId: string;
//   schoolId: string | null;
//   title: string;
//   content: string;
//   aiContent: any;
// }) {
//   try {
//     const lesson = await prisma.lesson.upsert({
//       where: {
//         topicId_schoolId: {
//           topicId: data.topicId,
//           schoolId: data.schoolId as string, 
//         },
//       },
//       update: {
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//       create: {
//         topicId: data.topicId,
//         schoolId: data.schoolId,
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//     });

//     revalidatePath(`/teacher/lessons/${data.topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: lesson };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// // ── 3. The Generator Action ───────────────────────────────────────────────────

// export async function generateLessonForTopic(topicId: string) {
//   try {
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//         school: true,
//       },
//     });

//     if (!topic) throw new Error("Topic not found");

//     const { curriculum } = topic.gradeSubject.grade;
//     const subjectName = topic.gradeSubject.subject.name;

//     const dynamicPrompt = `
//       You are an expert instructional designer for the ${curriculum.name} curriculum.
//       Generate a full academic package for the topic: ${topic.title}.
//       Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.
//     `;

//     const { object: ai } = await generateObject({
//       model: google("gemini-1.5-flash"), 
//       schema: LessonAiSchema,
//       prompt: dynamicPrompt,
//     });

//     const finalLesson = await prisma.$transaction(async (tx) => {
//       // 1. Identify if a version already exists for this school/topic combo
//       const existingLesson = await tx.lesson.findUnique({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string,
//           }
//         },
//         select: { id: true }
//       });

//       // 2. Wipe existing quiz data if we are overwriting
//       if (existingLesson) {
//         await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//       }

//       // 3. Upsert the Lesson record
//       const savedLesson = await tx.lesson.upsert({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string 
//           }
//         },
//         update: {
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId: topic.id,
//           schoolId: topic.schoolId,
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//       });

//       // 4. Rebuild the Quiz
//       const quiz = await tx.quiz.create({
//         data: { lessonId: savedLesson.id }
//       });

//       await tx.question.createMany({
//         data: ai.studentContent.quiz.map((q) => ({
//           quizId: quiz.id,
//           text: q.question,
//           options: q.options,
//           correctAnswer: q.answer,
//           explanation: q.explanation,
//         })),
//       });

//       return savedLesson;
//     });

//     revalidatePath(`/teacher/lessons/${topic.id}`);
//     revalidatePath(`/admin/lessons`);

//     // ✅ FIXED RETURN VALUE: Returns success, database data, AND the AI payload
//     return { 
//       success: true, 
//       data: finalLesson, 
//       aiContent: ai 
//     };

//   } catch (err) {
//     console.error("generateLessonForTopic failure:", getErrorMessage(err));
//     return { 
//       success: false, 
//       error: getErrorMessage(err) 
//     };
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client"; 
// import { getErrorMessage } from "@/lib/error-handler";

// // ── 1. The Schema ─────────────────────────────────────────────────────────────

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(), 
//     examples: z.array(z.object({ task: z.string(), solution: z.string() })),
//     visualAids: z.array(z.object({
//       title: z.string(),
//       description: z.string(),
//       imagePrompt: z.string(),
//       url: z.string().optional() 
//     })),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(z.object({
//       question: z.string(),
//       options: z.array(z.string()),
//       answer: z.string(),
//       explanation: z.string(),
//     })),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// // ── 2. The Persistence Action (Used by Manual Editor) ─────────────────────────

// export async function saveLessonAction(data: {
//   topicId: string;
//   schoolId: string | null;
//   title: string;
//   content: string;
//   aiContent: any;
// }) {
//   try {
//     const lesson = await prisma.lesson.upsert({
//       where: {
//         topicId_schoolId: {
//           topicId: data.topicId,
//           schoolId: data.schoolId as string, 
//         },
//       },
//       update: {
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//       create: {
//         topicId: data.topicId,
//         schoolId: data.schoolId,
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//     });

//     revalidatePath(`/teacher/lessons/${data.topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: lesson };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// // ── 3. The Generator Action ───────────────────────────────────────────────────

// export async function generateLessonForTopic(topicId: string) {
//   try {
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//         school: true,
//       },
//     });

//     if (!topic) throw new Error("Topic not found");

//     const { curriculum } = topic.gradeSubject.grade;
//     const subjectName = topic.gradeSubject.subject.name;

//     const dynamicPrompt = `
//       You are an expert instructional designer for the ${curriculum.name} curriculum.
//       Generate a full academic package for the topic: ${topic.title}.
//       Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.
//     `;

    // const { object: ai } = await generateObject({
    //   model: google("gemini-1.5-flash"), 
    //   schema: LessonAiSchema,
    //   prompt: dynamicPrompt,
    // });

//     const finalLesson = await prisma.$transaction(async (tx) => {
//       // 1. Identify if a version already exists for this school/topic combo
//       const existingLesson = await tx.lesson.findUnique({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string,
//           }
//         },
//         select: { id: true }
//       });

//       // 2. Wipe existing quiz data if we are overwriting
//       if (existingLesson) {
//         await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//       }

//       // 3. Upsert the Lesson record
//       const savedLesson = await tx.lesson.upsert({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string 
//           }
//         },
//         update: {
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId: topic.id,
//           schoolId: topic.schoolId,
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//       });

//       // 4. Create new Quiz shell
//       const quiz = await tx.quiz.create({
//         data: { lessonId: savedLesson.id }
//       });

//       // 5. Create Questions in the Bank & Link them to the Quiz
//       for (const [index, q] of ai.studentContent.quiz.entries()) {
//         const question = await tx.question.create({
//             data: {
//                 text: q.question,
//                 options: q.options as unknown as Prisma.InputJsonValue,
//                 correctAnswer: q.answer,
//                 explanation: q.explanation,
//                 topicId: topic.id,
//                 schoolId: topic.schoolId, // Null for global, UUID for school-specific
//                 category: QuestionCategory.PRACTICE // Distinguishes from High-Stakes Exams
//             }
//         });

//         // Create the junction record
//         await tx.quizQuestion.create({
//             data: {
//                 quizId: quiz.id,
//                 questionId: question.id,
//                 order: index + 1 // Preserve the AI's intended order
//             }
//         });
//       }

//       return savedLesson;
//     });

//     revalidatePath(`/teacher/lessons/${topic.id}`);
//     revalidatePath(`/admin/lessons`);

//     return { 
//       success: true, 
//       data: finalLesson, 
//       aiContent: ai 
//     };

//   } catch (err) {
//     console.error("generateLessonForTopic failure:", getErrorMessage(err));
//     return { 
//       success: false, 
//       error: getErrorMessage(err) 
//     };
//   }
// }




// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client"; 
// import { getErrorMessage } from "@/lib/error-handler";

// // ── 1. The Schema ─────────────────────────────────────────────────────────────

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(), 
//     examples: z.array(z.object({ task: z.string(), solution: z.string() })),
//     visualAids: z.array(z.object({
//       title: z.string(),
//       description: z.string(),
//       imagePrompt: z.string(),
//       url: z.string().optional() 
//     })),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(z.object({
//       question: z.string(),
//       options: z.array(z.string()),
//       answer: z.string(),
//       explanation: z.string(),
//     })),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// // ── 2. The Persistence Action (Used by Manual Editor) ─────────────────────────

// export async function saveLessonAction(data: {
//   topicId: string;
//   schoolId: string | null;
//   title: string;
//   content: string;
//   aiContent: LessonAiContent; // ✅ FIX: Replaced 'any' with LessonAiContent
// }) {
//   try {
//     const lesson = await prisma.lesson.upsert({
//       where: {
//         topicId_schoolId: {
//           topicId: data.topicId,
//           schoolId: data.schoolId as string, 
//         },
//       },
//       update: {
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//       create: {
//         topicId: data.topicId,
//         schoolId: data.schoolId,
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//     });

//     revalidatePath(`/teacher/lessons/${data.topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: lesson };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// // ── 3. The Generator Action ───────────────────────────────────────────────────

// export async function generateLessonForTopic(topicId: string) {
//   try {
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//         school: true,
//       },
//     });

//     if (!topic) throw new Error("Topic not found");

//     const { curriculum } = topic.gradeSubject.grade;
//     const subjectName = topic.gradeSubject.subject.name;

//     const dynamicPrompt = `
//       You are an expert instructional designer for the ${curriculum.name} curriculum.
//       Generate a full academic package for the topic: ${topic.title}.
//       Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.
//     `;

//     const { object: ai } = await generateObject({
//       model: google("gemini-1.5-pro"),
//       schema: LessonAiSchema,
//       prompt: dynamicPrompt,
//     });

//     const finalLesson = await prisma.$transaction(async (tx) => {
//       // 1. Identify if a version already exists for this school/topic combo
//       const existingLesson = await tx.lesson.findUnique({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string,
//           }
//         },
//         select: { id: true }
//       });

//       // 2. Wipe existing quiz data if we are overwriting
//       if (existingLesson) {
//         await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//       }

//       // 3. Upsert the Lesson record
//       const savedLesson = await tx.lesson.upsert({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string 
//           }
//         },
//         update: {
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId: topic.id,
//           schoolId: topic.schoolId,
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//       });

//       // 4. Create new Quiz shell
//       const quiz = await tx.quiz.create({
//         data: { lessonId: savedLesson.id }
//       });

//       // 5. Create Questions in the Bank & Link them to the Quiz
//       for (const [index, q] of ai.studentContent.quiz.entries()) {
//         const question = await tx.question.create({
//             data: {
//                 text: q.question,
//                 options: q.options as unknown as Prisma.InputJsonValue,
//                 correctAnswer: q.answer,
//                 explanation: q.explanation,
//                 topicId: topic.id,
//                 schoolId: topic.schoolId, 
//                 category: QuestionCategory.PRACTICE 
//             }
//         });

//         // Create the junction record
//         await tx.quizQuestion.create({
//             data: {
//                 quizId: quiz.id,
//                 questionId: question.id,
//                 order: index + 1 
//             }
//         });
//       }

//       return savedLesson;
//     });

//     revalidatePath(`/teacher/lessons/${topic.id}`);
//     revalidatePath(`/student/lessons/${topic.id}`);
//     revalidatePath(`/admin/lessons`);

//     return { 
//       success: true, 
//       data: finalLesson, 
//       aiContent: ai 
//     };

//   } catch (err) {
//     console.error("generateLessonForTopic failure:", getErrorMessage(err));
//     return { 
//       success: false, 
//       error: getErrorMessage(err) 
//     };
//   }
// }

// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client"; 
// import { getErrorMessage } from "@/lib/error-handler";

// // ── 1. The Schema ─────────────────────────────────────────────────────────────

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(), 
//     examples: z.array(z.object({ task: z.string(), solution: z.string() })),
//     visualAids: z.array(z.object({
//       title: z.string(),
//       description: z.string(),
//       imagePrompt: z.string(),
//       url: z.string().optional() 
//     })),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(z.object({
//       question: z.string(),
//       options: z.array(z.string()),
//       answer: z.string(),
//       explanation: z.string(),
//     })),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// // ── 2. The Persistence Action (Used by Manual Editor) ─────────────────────────

// export async function saveLessonAction(data: {
//   topicId: string;
//   schoolId: string | null;
//   title: string;
//   content: string;
//   aiContent: LessonAiContent;
// }) {
//   try {
//     const lesson = await prisma.lesson.upsert({
//       where: {
//         topicId_schoolId: {
//           topicId: data.topicId,
//           schoolId: data.schoolId as string, 
//         },
//       },
//       update: {
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//       create: {
//         topicId: data.topicId,
//         schoolId: data.schoolId,
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//     });

//     revalidatePath(`/teacher/lessons/${data.topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: lesson };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// // ── 3. The Generator Action ───────────────────────────────────────────────────

// export async function generateLessonForTopic(topicId: string) {
//   try {
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//         school: true,
//       },
//     });

//     if (!topic) throw new Error("Topic not found");

//     const { curriculum } = topic.gradeSubject.grade;
//     const subjectName = topic.gradeSubject.subject.name;

//     const dynamicPrompt = `
//       You are an expert instructional designer for the ${curriculum.name} curriculum.
//       Generate a full academic package for the topic: ${topic.title}.
//       Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.
      
//       Requirements:
//       1. Provide teacher logic including a hook and pedagogical tips.
//       2. Provide detailed student content with learning objectives, explanations, and examples.
//       3. Include visual aid prompts for diagrams.
//       4. Create a 5-question multiple choice quiz with explanations.
//     `;

//     // CHANGED: Using "gemini-1.5-flash-latest" which is the most compatible string 
//     // for the v1beta endpoint used by generateObject.
//     const { object: ai } = await generateObject({
//       model: google("gemini-1.5-flash-latest"),
//       schema: LessonAiSchema,
//       prompt: dynamicPrompt,
//     });

//     const finalLesson = await prisma.$transaction(async (tx) => {
//       const existingLesson = await tx.lesson.findUnique({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string,
//           }
//         },
//         select: { id: true }
//       });

//       if (existingLesson) {
//         await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//       }

//       const savedLesson = await tx.lesson.upsert({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId: topic.schoolId as string 
//           }
//         },
//         update: {
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId: topic.id,
//           schoolId: topic.schoolId,
//           title: ai.studentContent.title,
//           content: ai.studentContent.explanation,
//           aiContent: ai as unknown as Prisma.InputJsonValue,
//         },
//       });

//       const quiz = await tx.quiz.create({
//         data: { lessonId: savedLesson.id }
//       });

//       for (const [index, q] of ai.studentContent.quiz.entries()) {
//         const question = await tx.question.create({
//             data: {
//                 text: q.question,
//                 options: q.options as unknown as Prisma.InputJsonValue,
//                 correctAnswer: q.answer,
//                 explanation: q.explanation,
//                 topicId: topic.id,
//                 schoolId: topic.schoolId, 
//                 category: QuestionCategory.PRACTICE 
//             }
//         });

//         await tx.quizQuestion.create({
//             data: {
//                 quizId: quiz.id,
//                 questionId: question.id,
//                 order: index + 1 
//             }
//         });
//       }

//       return savedLesson;
//     });

//     revalidatePath(`/teacher/lessons/${topic.id}`);
//     revalidatePath(`/student/lessons/${topic.id}`);
//     revalidatePath(`/admin/lessons`);

//     return { 
//       success: true, 
//       data: finalLesson, 
//       aiContent: ai 
//     };

//   } catch (err) {
//     console.error("generateLessonForTopic failure:", getErrorMessage(err));
//     return { 
//       success: false, 
//       error: getErrorMessage(err) 
//     };
//   }
// }

// "use server";

// import { prisma } from "@/lib/prisma";
// import { groq } from "@ai-sdk/groq";
// import { generateText, Output } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client"; 
// import { getErrorMessage } from "@/lib/error-handler";

// // ── 1. Schema ────────────────────────────────────────────────────────────────
// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(),
//     examples: z.array(z.object({ task: z.string(), solution: z.string() })),
//     visualAids: z.array(
//       z.object({
//         title: z.string(),
//         description: z.string(),
//         imagePrompt: z.string(),
//         url: z.string().optional(),
//       })
//     ),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// // ── 2. Persistence Action ────────────────────────────────────────────────────
// export async function saveLessonAction(data: {
//   topicId: string;
//   schoolId: string | null;
//   title: string;
//   content: string;
//   aiContent: LessonAiContent;
// }) {
//   try {
//     const lesson = await prisma.lesson.upsert({
//       where: {
//         topicId_schoolId: {
//           topicId: data.topicId,
//           schoolId: data.schoolId as string,
//         },
//       },
//       update: {
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//       create: {
//         topicId: data.topicId,
//         schoolId: data.schoolId,
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//     });

//     revalidatePath(`/teacher/lessons/${data.topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: lesson };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// // ── 3. Generator Action ─────────────────────────────────────────────────────
// export async function generateLessonForTopic(topicId: string, schoolId: string) {
//   try {
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });
//     if (!topic) throw new Error("Topic not found");

//     const { curriculum } = topic.gradeSubject.grade;
//     const subjectName = topic.gradeSubject.subject.name;

//     // We provide a "dummy" version of the JSON so the AI sees exactly what keys to use.
//     const dynamicPrompt = `
//       You are an expert instructional designer for the ${curriculum.name} curriculum.
//       Generate a full academic package for the topic: ${topic.title}.
//       Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.

//       CRITICAL: Your output must be a SINGLE JSON object. 
//       You MUST use these EXACT keys (case-sensitive):

//       {
//         "metadata": { "topicContext": "", "difficultyLevel": "" },
//         "teacherLogic": { "teachingMethod": "", "timeAllocation": "", "pedagogicalTips": "", "introductionHook": "" },
//         "studentContent": {
//           "title": "",
//           "learningObjectives": [],
//           "explanation": "",
//           "examples": [{ "task": "", "solution": "" }],
//           "visualAids": [{ "title": "", "description": "", "imagePrompt": "" }],
//           "summary": "",
//           "vocabulary": [],
//           "quiz": [{ "question": "", "options": [], "answer": "", "explanation": "" }]
//         }
//       }
//     `;

//     const { text, output: jsonOutput } = await generateText({
//       model: groq("llama-3.3-70b-versatile"),
//       prompt: dynamicPrompt,
//       output: Output.json(),
//       maxOutputTokens: 4000,
//       temperature: 0.3, // Lower temperature makes the AI follow the schema more strictly
//     });

//     let aiContent: LessonAiContent;
//     try {
//       // We log the parsed object to your terminal so you can see if keys are missing
//       if (jsonOutput && typeof jsonOutput === "object" && !Array.isArray(jsonOutput)) {
//         console.log("AI Parsed Output Keys:", Object.keys(jsonOutput));
//       }

//       aiContent = LessonAiSchema.parse(jsonOutput);
//     } catch (err) {
//       console.error("RAW AI TEXT:", text);
//       throw new Error(`AI generated invalid data structure. Please try again.`);
//     }

//     const finalLesson = await prisma.$transaction(async (tx) => {
//       const existingLesson = await tx.lesson.findUnique({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId,
//           },
//         },
//         select: { id: true },
//       });

//       if (existingLesson) {
//         await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//       }

//       const savedLesson = await tx.lesson.upsert({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId,
//           },
//         },
//         update: {
//           title: aiContent.studentContent.title,
//           content: aiContent.studentContent.explanation,
//           aiContent: aiContent as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId: topic.id,
//           schoolId,
//           title: aiContent.studentContent.title,
//           content: aiContent.studentContent.explanation,
//           aiContent: aiContent as unknown as Prisma.InputJsonValue,
//         },
//       });

//       const quiz = await tx.quiz.create({
//         data: { lessonId: savedLesson.id },
//       });

//       for (const [index, q] of aiContent.studentContent.quiz.entries()) {
//         const question = await tx.question.create({
//           data: {
//             text: q.question,
//             options: q.options as unknown as Prisma.InputJsonValue,
//             correctAnswer: q.answer,
//             explanation: q.explanation,
//             topicId: topic.id,
//             schoolId,
//             category: QuestionCategory.PRACTICE,
//           },
//         });

//         await tx.quizQuestion.create({
//           data: { quizId: quiz.id, questionId: question.id, order: index + 1 },
//         });
//       }

//       return savedLesson;
//     });

//     revalidatePath(`/teacher/lessons/${topic.id}`);
//     revalidatePath(`/student/lessons/${topic.id}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: finalLesson, aiContent };
//   } catch (err) {
//     console.error("generateLessonForTopic failure:", err);
//     return { success: false, error: getErrorMessage(err) };
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google"
// import { generateObject } from "ai"
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client"; 
// import { getErrorMessage } from "@/lib/error-handler";
// import { transformLesson } from "@/lib/lessons/transformLessons";

// // ── 1. Schema ────────────────────────────────────────────────────────────────
// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(),
//     examples: z.array(z.object({ task: z.string(), solution: z.string() })),
//     visualAids: z.array(
//       z.object({
//         title: z.string(),
//         description: z.string(),
//         imagePrompt: z.string(),
//         url: z.string().optional(),
//       })
//     ),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// // ── 2. Persistence Action ────────────────────────────────────────────────────
// export async function saveLessonAction(data: {
//   topicId: string;
//   schoolId: string | null;
//   title: string;
//   content: string;
//   aiContent: LessonAiContent;
// }) {
//   try {
//     const lesson = await prisma.lesson.upsert({
//       where: {
//         topicId_schoolId: {
//           topicId: data.topicId,
//           schoolId: data.schoolId as string,
//         },
//       },
//       update: {
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//       create: {
//         topicId: data.topicId,
//         schoolId: data.schoolId,
//         title: data.title,
//         content: data.content,
//         aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//       },
//     });

//     revalidatePath(`/teacher/lessons/${data.topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: lesson };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// // ── 3. Generator Action ─────────────────────────────────────────────────────
// export async function generateLessonForTopic(topicId: string, schoolId: string) {
//   try {
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });
//     if (!topic) throw new Error("Topic not found");

//     const { curriculum } = topic.gradeSubject.grade;
//     const subjectName = topic.gradeSubject.subject.name;

    // const dynamicPrompt = `
    //   You are an expert instructional designer for the ${curriculum.name} curriculum.
    //   Generate a COMPREHENSIVE academic package for: ${topic.title}.
    //   Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.

    //   STRICT CONTENT REQUIREMENTS:
    //   1. EXPLANATION: Write a massive, detailed lesson note (minimum 1000 words). Use rich Markdown: ### for headers, bold text for emphasis, and bullet points.
    //   2. VISUAL AIDS: You MUST generate EXACTLY 3 distinct visual aid prompts.
    //   3. QUIZ: You MUST generate EXACTLY 10 multiple-choice questions.

    //   STRICT SCOPE:
    //    - Topic: ${topic.title}
    //    - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
    //    - Level: ${topic.gradeSubject.grade.displayName}

    //   JSON STRUCTURE:
    //   {
    //     "metadata": { "topicContext": "", "difficultyLevel": "" },
    //     "teacherLogic": { "teachingMethod": "", "timeAllocation": "", "pedagogicalTips": "", "introductionHook": "" },
    //     "studentContent": {
    //       "title": "${topic.title}",
    //       "learningObjectives": ["Obj 1", "Obj 2", "Obj 3"],
    //       "explanation": "Extensive markdown text here...",
    //       "examples": [{"task": "", "solution": ""}],
    //       "visualAids": [
    //          {"title": "Visual 1", "description": "", "imagePrompt": ""},
    //          {"title": "Visual 2", "description": "", "imagePrompt": ""},
    //          {"title": "Visual 3", "description": "", "imagePrompt": ""}
    //       ],
    //       "summary": "",
    //       "vocabulary": [],
    //       "quiz": [
    //          {"question": "Q1", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": ""},
    //          ... repeat for exactly 10 questions
    //       ]
    //     }
    //   }
    // `;

//     const { object: aiContent } = await generateObject({
//       model: google("gemini-2.5-flash"),
//       schema: LessonAiSchema,
//       prompt: dynamicPrompt,
//     });
//     const lessonDTO = transformLesson(topic.id, aiContent);

//     // FIX: Added timeout configuration to transaction (60 seconds)
//     const finalLesson = await prisma.$transaction(async (tx) => {
//       const existingLesson = await tx.lesson.findUnique({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId,
//           },
//         },
//         select: { id: true },
//       });

//       if (existingLesson) {
//         // Clear old quiz relations first
//         await tx.quizQuestion.deleteMany({
//             where: { quiz: { lessonId: existingLesson.id } }
//         });
//         await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//       }

//       const savedLesson = await tx.lesson.upsert({
//         where: {
//           topicId_schoolId: {
//             topicId: topic.id,
//             schoolId,
//           },
//         },
//         update: {
//           title: aiContent.studentContent.title,
//           content: aiContent.studentContent.explanation,
//           aiContent: aiContent as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId: topic.id,
//           schoolId,
//           title: aiContent.studentContent.title,
//           content: aiContent.studentContent.explanation,
//           aiContent: aiContent as unknown as Prisma.InputJsonValue,
//         },
//       });

//       const quiz = await tx.quiz.create({
//         data: { lessonId: savedLesson.id },
//       });

//       // Optimizing loop: Prisma is faster when processing sequentially inside tx
//       for (const [index, q] of aiContent.studentContent.quiz.entries()) {
//         const question = await tx.question.create({
//           data: {
//             text: q.question,
//             options: q.options as unknown as Prisma.InputJsonValue,
//             correctAnswer: q.answer,
//             explanation: q.explanation,
//             topicId: topic.id,
//             schoolId,
//             category: QuestionCategory.PRACTICE,
//           },
//         });

//         await tx.quizQuestion.create({
//           data: { quizId: quiz.id, questionId: question.id, order: index + 1 },
//         });
//       }

//       return savedLesson;
//     }, {
//         timeout: 60000, // 60 seconds
//         maxWait: 5000,
//     });

//     revalidatePath(`/teacher/lessons/${topic.id}`);
//     revalidatePath(`/student/lessons/${topic.id}`);
//     revalidatePath(`/admin/lessons`);

//     return { success: true, data: finalLesson, aiContent };
//   } catch (err) {
//     console.error("generateLessonForTopic failure:", err);
//     return { success: false, error: getErrorMessage(err) };
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { transformLesson } from "@/lib/lessons/transformLessons";

// /* ─────────────────────────────────────────────
//    1. AI SCHEMA
// ───────────────────────────────────────────── */

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),

//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),

//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(),
//     examples: z.array(
//       z.object({
//         task: z.string(),
//         solution: z.string(),
//       })
//     ),
//     visualAids: z.array(
//       z.object({
//         title: z.string(),
//         description: z.string(),
//         imagePrompt: z.string(),
//         url: z.string().optional(),
//       })
//     ),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// /* ─────────────────────────────────────────────
//    2. GENERATOR ACTION
// ───────────────────────────────────────────── */

// export async function generateLessonForTopic(
//   topicId: string,
//   schoolId: string
// ) {
//   try {
//     /* ── FETCH TOPIC ── */
//     const topic = await prisma.topic.findFirst({
//       where: {
//         id: topicId,
//         gradeSubject: {
//           subject: {
//             OR: [
//               { schoolId: null },        // global subject
//               { schoolId }               // school subject
//             ]
//           }
//         }
//       },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });

//     if (!topic) throw new Error("Topic not found");

//     const curriculum = topic.gradeSubject.grade.curriculum;
//     const subjectName = topic.gradeSubject.subject.name;

//     /* ── AI PROMPT ── */
//     const prompt = `
// You are an expert instructional designer for the ${curriculum.name} curriculum.

// Generate a full lesson for:
// - Topic: ${topic.title}
// - Subject: ${subjectName}
// - Level: ${topic.gradeSubject.grade.displayName}

// Requirements:
// - 1000+ word explanation
// - 3 visual aids
// - 10 quiz questions
// `;

//     /* ── AI GENERATION ── */
//     const { object: aiContent } = await generateObject({
//       model: google("gemini-2.5-flash"),
//       schema: LessonAiSchema,
//       prompt,
//     });

//     /* ── SAVE LESSON (TEACHER / ADMIN DATA) ── */
//     const savedLesson = await prisma.$transaction(
//       async (tx) => {
//         const existingLesson = await tx.globalLesson.findUnique({
//           where: {
//             topicId_schoolId: {
//               topicId,
//               schoolId,
//             },
//           },
//           select: { id: true },
//         });

//         if (existingLesson) {
//           await tx.quizQuestion.deleteMany({
//             where: { quiz: { lessonId: existingLesson.id } },
//           });

//           await tx.quiz.deleteMany({
//             where: { lessonId: existingLesson.id },
//           });
//         }

//         const lesson = await tx.globalLesson.upsert({
//           where: {
//             topicId_schoolId: {
//               topicId,
//               schoolId,
//             },
//           },
//           update: {
//             title: aiContent.studentContent.title,
//             aicontent: aiContent.studentContent.explanation,
//             aiContent: aiContent as unknown as Prisma.InputJsonValue,
//           },
//           create: {
//             topicId,
//             schoolId,
//             title: aiContent.studentContent.title,
//             content: aiContent.studentContent.explanation,
//             aiContent: aiContent as unknown as Prisma.InputJsonValue,
//           },
//         });

//         const quiz = await tx.quiz.create({
//           data: { lessonId: lesson.id },
//         });

//         for (const [index, q] of aiContent.studentContent.quiz.entries()) {
//           const question = await tx.question.create({
//             data: {
//               text: q.question,
//               options: q.options as unknown as Prisma.InputJsonValue,
//               correctAnswer: q.answer,
//               explanation: q.explanation,
//               topicId,
//               schoolId,
//               category: QuestionCategory.PRACTICE,
//             },
//           });

//           await tx.quizQuestion.create({
//             data: {
//               quizId: quiz.id,
//               questionId: question.id,
//               order: index + 1,
//             },
//           });
//         }

//         return lesson;
//       },
//       {
//         timeout: 60000,
//         maxWait: 5000,
//       }
//     );

//     /* ─────────────────────────────────────────────
//        IMPORTANT: TRANSFORM LAYER (STUDENT VIEW)
//     ───────────────────────────────────────────── */

//     const lessonDTO = transformLesson(topicId, aiContent);

//     /* ── CACHE INVALIDATION ── */
//     revalidatePath(`/teacher/lessons/${topicId}`);
//     revalidatePath(`/student/lessons/${topicId}`);
//     revalidatePath(`/admin/lessons`);

//     /* ── RETURN BOTH VIEWS ── */
//     return {
//       success: true,
//       lesson: savedLesson,     // teacher/admin/raw DB
//       lessonDTO,               // student-ready view
//       aiContent,               // optional debug
//     };
//   } catch (err) {
//     console.error("generateLessonForTopic failure:", err);

//     return {
//       success: false,
//       error: getErrorMessage(err),
//     };
//   }
// }






// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { transformLesson } from "@/lib/lessons/transformLessons";

// /* ─────────────────────────────────────────────────────────────────────────────
//    1. AI SCHEMA (LessonAiSchema)
// ───────────────────────────────────────────────────────────────────────────── */

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),

//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),

//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(),
//     examples: z.array(
//       z.object({
//         task: z.string(),
//         solution: z.string(),
//       })
//     ),
//     visualAids: z.array(
//       z.object({
//         title: z.string(),
//         description: z.string(),
//         imagePrompt: z.string(),
//         url: z.string().optional(),
//       })
//     ),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),
//   }),
// });

// /**
//  * Type inferred from the Zod Schema to be used across the application.
//  */
// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// /* ─────────────────────────────────────────────────────────────────────────────
//    2. GENERATOR ACTION
// ───────────────────────────────────────────────────────────────────────────── */

// /**
//  * Generates a comprehensive lesson using Google's AI and saves it to the
//  * academic registry (GlobalLesson).
//  */
// export async function generateLessonForTopic(
//   topicId: string,
//   schoolId: string
// ) {
//   try {
//     /* ── FETCH TOPIC METADATA ── */
//     const topic = await prisma.topic.findFirst({
//       where: {
//         id: topicId,
//       },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });

//     if (!topic) {
//         throw new Error("Target topic not found in academic registry.");
//     }

//     const curriculum = topic.gradeSubject.grade.curriculum;
//     const subjectName = topic.gradeSubject.subject.name;

//     /* ── AI PROMPT ── */
//     const prompt = `
// You are an expert instructional designer for the ${curriculum.name} curriculum.

// Generate a full lesson for:
// - Topic: ${topic.title}
// - Subject: ${subjectName}
// - Level: ${topic.gradeSubject.grade.displayName}

// Requirements:
// - 1000+ word explanation
// - 3 visual aids
// - 10 quiz questions
// `;

//     /* ── AI GENERATION ── */
//     // aiContent here is automatically typed as LessonAiContent because of the schema
//     const { object: aiContent } = await generateObject({
//       model: google("gemini-1.5-flash"), 
//       schema: LessonAiSchema,
//       prompt,
//     });

//     /* ── DATABASE TRANSACTION ── */
//     const savedGlobalLesson = await prisma.$transaction(
//       async (tx) => {
//         // 1. Identify existing content
//         const existingGlobal = await tx.globalLesson.findUnique({
//           where: {
//             topicId_schoolId: {
//               topicId,
//               schoolId,
//             },
//           },
//           select: { id: true, quiz: { select: { id: true } } },
//         });

//         // 2. Clean up previous quiz links if regenerating
//         if (existingGlobal?.quiz) {
//           await tx.quizQuestion.deleteMany({
//             where: { quizId: existingGlobal.quiz.id },
//           });
//           await tx.quiz.deleteMany({
//             where: { id: existingGlobal.quiz.id },
//           });
//         }

//         // 3. Upsert GlobalLesson
//         const lesson = await tx.globalLesson.upsert({
//           where: {
//             topicId_schoolId: {
//               topicId,
//               schoolId,
//             },
//           },
//           update: {
//             title: aiContent.studentContent.title,
//             aiContent: aiContent as unknown as Prisma.InputJsonValue,
//           },
//           create: {
//             topicId,
//             schoolId,
//             title: aiContent.studentContent.title,
//             aiContent: aiContent as unknown as Prisma.InputJsonValue,
//           },
//         });

//         // 4. Create the Quiz shell
//         const quiz = await tx.quiz.create({
//           data: { lessonId: lesson.id },
//         });

//         // 5. Generate Independent Questions and Link to Quiz
//         for (const [index, q] of aiContent.studentContent.quiz.entries()) {
//           const question = await tx.question.create({
//             data: {
//               text: q.question,
//               options: q.options as unknown as Prisma.InputJsonValue,
//               correctAnswer: q.answer,
//               explanation: q.explanation,
//               topicId,
//               schoolId,
//               category: QuestionCategory.PRACTICE,
//             },
//           });

//           await tx.quizQuestion.create({
//             data: {
//               quizId: quiz.id,
//               questionId: question.id,
//               order: index + 1,
//             },
//           });
//         }

//         return lesson;
//       },
//       {
//         timeout: 60000, 
//         maxWait: 10000,
//       }
//     );

//     /* ── TRANSFORM FOR STUDENT VIEW ── */
//     /**
//      * FIXED: Pass aiContent (the object) directly.
//      * transformLesson is typed to accept the LessonAiContent object shape.
//      */
//     const lessonDTO = transformLesson(aiContent, "student");

//     /* ── CACHE INVALIDATION ── */
//     revalidatePath(`/teacher/lessons/${topicId}`);
//     revalidatePath(`/student/lessons/${topicId}`);
//     revalidatePath(`/admin/lessons`);

//     return {
//       success: true,
//       lesson: savedGlobalLesson,
//       lessonDTO,
//       aiContent,
//     };

//   } catch (err) {
//     console.error("[AI_GENERATOR_ERROR]:", getErrorMessage(err));

//     return {
//       success: false,
//       error: getErrorMessage(err),
//     };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { transformLesson } from "@/lib/lessons/transformLessons";

// /* ─────────────────────────────────────────────────────────────────────────────
//    1. AI SCHEMA
// ───────────────────────────────────────────────────────────────────────────── */

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),

//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),

//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(),
//     examples: z.array(
//       z.object({
//         task: z.string(),
//         solution: z.string(),
//       })
//     ),
//     visualAids: z.array(
//       z.object({
//         title: z.string(),
//         description: z.string(),
//         imagePrompt: z.string(),
//         url: z.string().optional(),
//       })
//     ),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// /* ─────────────────────────────────────────────────────────────────────────────
//    2. GENERATOR ACTION
// ───────────────────────────────────────────────────────────────────────────── */

// export async function generateLessonForTopic(
//   topicId: string,
//   schoolId: string
// ) {
//   try {
//     const topic = await prisma.topic.findFirst({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });

    // if (!topic) throw new Error("Target topic not found.");

    // const curriculum = topic.gradeSubject.grade.curriculum;
    // const subjectName = topic.gradeSubject.subject.name;
    // const dynamicPrompt = `You are an expert instructional designer for the ${curriculum.name} curriculum.
    //   Generate a COMPREHENSIVE academic package for: ${topic.title}.
    //   Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.

    //   STRICT CONTENT REQUIREMENTS:
    //   1. EXPLANATION: Write a massive, detailed lesson note (minimum 1000 words). Use rich Markdown: ### for headers, bold text for emphasis, and bullet points.
    //   2. VISUAL AIDS: You MUST generate EXACTLY 3 distinct visual aid prompts.
    //   3. QUIZ: You MUST generate EXACTLY 10 multiple-choice questions.

    //   STRICT SCOPE:
    //    - Topic: ${topic.title}
    //    - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
    //    - Level: ${topic.gradeSubject.grade.displayName}

    //   JSON STRUCTURE:
    //   {
    //     "metadata": { "topicContext": "", "difficultyLevel": "" },
    //     "teacherLogic": { "teachingMethod": "", "timeAllocation": "", "pedagogicalTips": "", "introductionHook": "" },
    //     "studentContent": {
    //       "title": "${topic.title}",
    //       "learningObjectives": ["Obj 1", "Obj 2", "Obj 3"],
    //       "explanation": "Extensive markdown text here...",
    //       "examples": [{"task": "", "solution": ""}],
    //       "visualAids": [
    //          {"title": "Visual 1", "description": "", "imagePrompt": ""},
    //          {"title": "Visual 2", "description": "", "imagePrompt": ""},
    //          {"title": "Visual 3", "description": "", "imagePrompt": ""}
    //       ],
    //       "summary": "",
    //       "vocabulary": [],
    //       "quiz": [
    //          {"question": "Q1", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": ""},
    //          ... repeat for exactly 10 questions
    //       ]
    //     }
    //   }`

//     const { object: aiContent } = await generateObject({
//       model: google("gemini-1.5-flash"), 
//       schema: LessonAiSchema,
//       prompt: dynamicPrompt
//     });

//     const savedGlobalLesson = await prisma.$transaction(async (tx) => {
//       const existingGlobal = await tx.globalLesson.findUnique({
//         where: { topicId_schoolId: { topicId, schoolId } },
//         select: { id: true, quiz: { select: { id: true } } },
//       });

//       if (existingGlobal?.quiz) {
//         await tx.quizQuestion.deleteMany({ where: { quizId: existingGlobal.quiz.id } });
//         await tx.quiz.deleteMany({ where: { id: existingGlobal.quiz.id } });
//       }

//       const lesson = await tx.globalLesson.upsert({
//         where: { topicId_schoolId: { topicId, schoolId } },
//         update: {
//           title: aiContent.studentContent.title,
//           aiContent: aiContent as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId,
//           schoolId,
//           title: aiContent.studentContent.title,
//           aiContent: aiContent as unknown as Prisma.InputJsonValue,
//         },
//       });

//       const quiz = await tx.quiz.create({ data: { lessonId: lesson.id } });

//       for (const [index, q] of aiContent.studentContent.quiz.entries()) {
//         const question = await tx.question.create({
//           data: {
//             text: q.question,
//             options: q.options as unknown as Prisma.InputJsonValue,
//             correctAnswer: q.answer,
//             explanation: q.explanation,
//             topicId,
//             schoolId,
//             category: QuestionCategory.PRACTICE,
//           },
//         });

//         await tx.quizQuestion.create({
//           data: {
//             quizId: quiz.id,
//             questionId: question.id,
//             order: index + 1,
//           },
//         });
//       }
//       return lesson;
//     });

//     /**
//      * FIXED: The action signature for transformLesson expects:
//      * (topicId: string, content: LessonAiContent)
//      */
//     const lessonDTO = transformLesson(topicId, aiContent);

//     revalidatePath(`/student/lessons/${topicId}`);

//     return {
//       success: true,
//       lesson: savedGlobalLesson,
//       lessonDTO,
//       aiContent,
//     };

//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";
// import { Prisma, QuestionCategory } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { transformLesson } from "@/lib/lessons/transformLessons";
// import { contentScope } from "@/lib/content-scope";

// /* ─────────────────────────────────────────────────────────────
//    AI SCHEMA (unchanged)
// ───────────────────────────────────────────────────────────── */

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(),
//     examples: z.array(
//       z.object({
//         task: z.string(),
//         solution: z.string(),
//       })
//     ),
//     visualAids: z.array(
//       z.object({
//         title: z.string(),
//         description: z.string(),
//         imagePrompt: z.string(),
//         url: z.string().optional(),
//       })
//     ),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),
//   }),
// });

// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// /* ─────────────────────────────────────────────────────────────
//    GENERATOR ACTION
// ───────────────────────────────────────────────────────────── */

// export async function generateLessonForTopic(
//   topicId: string,
//   schoolId: string
// ) {
//   try {

//     // ✅ 1. SAFE TOPIC FETCH (with resolver)
//     const topic = await prisma.topic.findFirst({
//       where: {
//         id: topicId,
//         ...contentScope({ schoolId }),
//       },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });

//     if (!topic) throw new Error("Topic not found or not accessible.");

//     const curriculum = topic.gradeSubject.grade.curriculum;
//     const subjectName = topic.gradeSubject.subject.name;

//     // ✅ 2. AI GENERATION
//     const prompt = `
//     You are an expert instructional designer for the ${curriculum.name} curriculum.
    
//     Generate a full lesson for:
//     - Topic: ${topic.title}
//     - Subject: ${subjectName}
//     - Level: ${topic.gradeSubject.grade.displayName}
    
//     Requirements:
//     - 1000+ word explanation
//     - 3 visual aids
//     - 10 quiz questions
//     `;

//     const { object: aiContent } = await generateObject({
//       model: google("gemini-1.5-flash"),
//       schema: LessonAiSchema,
//       prompt,
//     });

//     // ✅ 3. SAVE AS SCHOOL LESSON (NOT GLOBAL)
//     const savedLesson = await prisma.$transaction(async (tx) => {

//       // Ensure a base global lesson exists (optional but good)
//       let globalLesson = await tx.globalLesson.findFirst({
//         where: {
//           topicId,
//           isGlobal: true,
//         },
//       });

//       if (!globalLesson) {
//         globalLesson = await tx.globalLesson.create({
//           data: {
//             topicId,
//             title: aiContent.studentContent.title,
//             aiContent: aiContent as unknown as Prisma.InputJsonValue,
//             isGlobal: true,
//           },
//         });
//       }

//       // Upsert SCHOOL LESSON
//       const schoolLesson = await tx.schoolLesson.upsert({
//         where: {
//           topicId_schoolId: { topicId, schoolId },
//         },
//         update: {
//           customContent: aiContent as unknown as Prisma.InputJsonValue,
//           isCustomized: true,
//         },
//         create: {
//           topicId,
//           schoolId,
//           globalLessonId: globalLesson.id,
//           customContent: aiContent as unknown as Prisma.InputJsonValue,
//           isCustomized: true,
//         },
//       });

//       // Create quiz tied to GLOBAL lesson (your current structure)
//       const quiz = await tx.quiz.upsert({
//         where: { lessonId: globalLesson.id },
//         update: {},
//         create: { lessonId: globalLesson.id },
//       });

//       // Clean old questions (optional safety)
//       await tx.quizQuestion.deleteMany({ where: { quizId: quiz.id } });

//       for (const [index, q] of aiContent.studentContent.quiz.entries()) {
//         const question = await tx.question.create({
//           data: {
//             text: q.question,
//             options: q.options as unknown as Prisma.InputJsonValue,
//             correctAnswer: q.answer,
//             explanation: q.explanation,
//             topicId,
//             schoolId,
//             isGlobal: false,
//             category: QuestionCategory.PRACTICE,
//           },
//         });

//         await tx.quizQuestion.create({
//           data: {
//             quizId: quiz.id,
//             questionId: question.id,
//             order: index + 1,
//           },
//         });
//       }

//       return schoolLesson;
//     });

//     const lessonDTO = transformLesson(topicId, aiContent);

//     revalidatePath(`/student/lessons/${topicId}`);

//     return {
//       success: true,
//       lesson: savedLesson,
//       lessonDTO,
//       aiContent,
//     };

//   } catch (err) {
//     return {
//       success: false,
//       error: getErrorMessage(err),
//     };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { Prisma, QuestionType, QuestionCategory } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { contentScope } from "@/lib/content-scope";

// /* ─────────────────────────────────────────────
//    AI OUTPUT SCHEMA (SINGLE SOURCE OF TRUTH)
// ───────────────────────────────────────────── */

// const TopicAiSchema = z.object({
//   lesson: z.object({
//     title: z.string(),
//     explanation: z.string(),
//     objectives: z.array(z.string()),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),
//   }),

//   mcqQuestions: z.array(
//     z.object({
//       question: z.string(),
//       options: z.array(z.string()),
//       answer: z.string(),
//       explanation: z.string(),
//     })
//   ),

//   essayQuestions: z.array(
//     z.object({
//       question: z.string(),
//       markingGuide: z.string(),
//     })
//   ),
// });

// export type TopicAiContent = z.infer<typeof TopicAiSchema>;

// /* ─────────────────────────────────────────────
//    MAIN GENERATOR
// ───────────────────────────────────────────── */

// export async function generateTopicContent(
//   topicId: string,
//   schoolId: string
// ) {
//   try {
//     // 1. SAFE TOPIC FETCH (GLOBAL ONLY)
//     const topic = await prisma.topic.findFirst({
//       where: {
//         id: topicId,
//         ...contentScope({ schoolId }),
//       },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });

//     if (!topic) throw new Error("Topic not found or not accessible");

//     const curriculum = topic.gradeSubject.grade.curriculum;
//     const subjectName = topic.gradeSubject.subject.name;

//     // 2. AI GENERATION (PURE CONTENT ONLY)
//     const prompt = `
// You are an expert curriculum designer for ${curriculum.name}.

// Generate structured educational content:

// Topic: ${topic.title}
// Subject: ${subjectName}
// Level: ${topic.gradeSubject.grade.displayName}

// REQUIREMENTS:
// - Clear teaching explanation (WAEC standard)
// - 10 MCQs (4 options each)
// - 3 Essay questions with marking guide
// - Nigerian academic context where relevant
// `;

//     const { object: ai } = await generateObject({
//       model: google("gemini-1.5-flash"),
//       schema: TopicAiSchema,
//       prompt,
//     });

//     // 3. SAVE EVERYTHING IN CLEAN STRUCTURE
//     const result = await prisma.$transaction(async (tx) => {
//       /* ───────────── LESSON (GLOBAL BASE) ───────────── */
//       const lesson = await tx.lesson.upsert({
//         where: { topicId },
//         update: {
//           title: ai.lesson.title,
//           content: ai.lesson as unknown as Prisma.InputJsonValue,
//         },
//         create: {
//           topicId,
//           title: ai.lesson.title,
//           content: ai.lesson as unknown as Prisma.InputJsonValue,
//         },
//       });

      // /* ───────────── QUESTION BANK (MCQ) ───────────── */
      // const mcqQuestions = await tx.question.createMany({
      //   data: ai.mcqQuestions.map((q) => ({
      //     text: q.question,
      //     options: q.options as Prisma.InputJsonValue,
      //     correctAnswer: q.answer,
      //     explanation: q.explanation,

      //     type: QuestionType.MCQ,
      //     category: QuestionCategory.PRACTICE,

      //     topicId,
      //     scope: "GLOBAL",
      //     schoolId: null,
      //   })),
      // });

//       /* ───────────── QUESTION BANK (ESSAY) ───────────── */
//       const essayQuestions = await tx.question.createMany({
//         data: ai.essayQuestions.map((q) => ({
//           text: q.question,
//           options: [],
//           correctAnswer: q.markingGuide,
//           explanation: q.markingGuide,

//           type: QuestionType.ESSAY,
//           category: QuestionCategory.EXAM,

//           topicId,
//           scope: "GLOBAL",
//           schoolId: null,
//         })),
//       });

//       return {
//         lesson,
//         mcqQuestionsCount: mcqQuestions.count,
//         essayQuestionsCount: essayQuestions.count,
//       };
//     });

//     return {
//       success: true,
//       data: result,
//     };
//   } catch (err) {
//     return {
//       success: false,
//       error: getErrorMessage(err),
//     };
//   }
// }




// "use server";

// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { Prisma, QuestionCategory, QuestionType } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";

// /* ───────── AI SCHEMA ───────── */

// const LessonAiSchema = z.object({
//   metadata: z.object({
//     topicContext: z.string(),
//     difficultyLevel: z.string(),
//   }),
//   teacherLogic: z.object({
//     teachingMethod: z.string(),
//     timeAllocation: z.string(),
//     pedagogicalTips: z.string(),
//     introductionHook: z.string(),
//   }),
//   studentContent: z.object({
//     title: z.string(),
//     learningObjectives: z.array(z.string()),
//     explanation: z.string(),
//     summary: z.string(),
//     vocabulary: z.array(z.string()),

//     quiz: z.array(
//       z.object({
//         question: z.string(),
//         options: z.array(z.string()),
//         answer: z.string(),
//         explanation: z.string(),
//       })
//     ),

//     essay: z.array(
//       z.object({
//         question: z.string(),
//         markingGuide: z.string(),
//       })
//     ).optional()
//   }),
// });

// /* ───────── MAIN ACTION ───────── */

// export async function generateTopicContent(topicId: string) {
//   try {
//     const topic = await prisma.topic.findUnique({
//       where: { id: topicId },
//       include: {
//         gradeSubject: {
//           include: {
//             grade: { include: { curriculum: true } },
//             subject: true,
//           },
//         },
//       },
//     });

//     if (!topic) throw new Error("Topic not found");

//     /* ───────── PREVENT DUPLICATION ───────── */
//     const existing = await prisma.question.count({
//       where: { topicId },
//     });

//     if (existing > 0) {
//       return {
//         success: true,
//         message: "Content already exists",
//       };
//     }

//     const curriculum = topic.gradeSubject.grade.curriculum;
//     const subjectName = topic.gradeSubject.subject.name;

//     const schoolId = topic.gradeSubject.subject.schoolId ?? null; 
//     // ✅ CRITICAL: THIS DEFINES GLOBAL vs SCHOOL CONTENT
//     const dynamicPrompt = `You are an expert instructional designer for the ${curriculum.name} curriculum.
//     Generate a COMPREHENSIVE academic package for: ${topic.title}.
//     Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.

//     STRICT CONTENT REQUIREMENTS:
//     1. EXPLANATION: Write a massive, detailed lesson note (minimum 1000 words). Use rich Markdown: ### for headers, bold text for emphasis, and bullet points.
//     2. VISUAL AIDS: You MUST generate EXACTLY 3 distinct visual aid prompts.
//     3. QUIZ: You MUST generate EXACTLY 10 multiple-choice questions.

//     STRICT SCOPE:
//      - Topic: ${topic.title}
//      - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
//      - Level: ${topic.gradeSubject.grade.displayName}

//     JSON STRUCTURE:
//     {
//       "metadata": { "topicContext": "", "difficultyLevel": "" },
//       "teacherLogic": { "teachingMethod": "", "timeAllocation": "", "pedagogicalTips": "", "introductionHook": "" },
//       "studentContent": {
//         "title": "${topic.title}",
//         "learningObjectives": ["Obj 1", "Obj 2", "Obj 3"],
//         "explanation": "Extensive markdown text here...",
//         "examples": [{"task": "", "solution": ""}],
//         "visualAids": [
//            {"title": "Visual 1", "description": "", "imagePrompt": ""},
//            {"title": "Visual 2", "description": "", "imagePrompt": ""},
//            {"title": "Visual 3", "description": "", "imagePrompt": ""}
//         ],
//         "summary": "",
//         "vocabulary": [],
//         "quiz": [
//            {"question": "Q1", "options": ["A", "B", "C", "D"], "answer": "A", "explanation": ""},
//            ... repeat for exactly 10 questions
//         ]
//       }
//     }`


//     const { object: ai } = await generateObject({
//       model: google("gemini-1.5-flash"),
//       schema: LessonAiSchema,
//       prompt: dynamicPrompt,
//     });
    
//     const resolvedSchoolId = schoolId ?? null;
    
//     await prisma.$transaction(async (tx) => {
//       const existing = await tx.globalLesson.findFirst({
//         where: {
//           topicId,
//           schoolId: resolvedSchoolId,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       });
    
//       if (existing) {
//         await tx.globalLesson.update({
//           where: {
//             id: existing.id,
//           },
//           data: {
//             title: ai.studentContent.title,
//             aiContent: ai as unknown as Prisma.InputJsonValue,
//           },
//         });
//       } else {
//         await tx.globalLesson.create({
//           data: {
//             topicId,
//             schoolId: resolvedSchoolId,
//             title: ai.studentContent.title,
//             aiContent: ai as unknown as Prisma.InputJsonValue,
//           },
//         });
//       }
//     });
    
//     return { success: true };

//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }



"use server";

import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { Prisma, QuestionCategory, QuestionType, OwnershipType, Role } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";
import { contentScope } from "@/lib/content-scope";
import { logActivity } from "@/lib/activitylogger";

/* ───────── AI SCHEMA ───────── */

const LessonAiSchema = z.object({
  metadata: z.object({
    topicContext: z.string(),
    difficultyLevel: z.string(),
  }),
  teacherLogic: z.object({
    teachingMethod: z.string(),
    timeAllocation: z.string(),
    pedagogicalTips: z.string(),
    introductionHook: z.string(),
  }),
  studentContent: z.object({
    title: z.string(),
    learningObjectives: z.array(z.string()),
    explanation: z.string(),
    summary: z.string(),
    vocabulary: z.array(z.string()),
    visualAids: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
        imagePrompt: z.string(),
      })
    ),
    quiz: z.array(
      z.object({
        question: z.string(),
        options: z.array(z.string()),
        answer: z.string(),
        explanation: z.string(),
      })
    ),
  }),
});

/* ───────── MAIN ACTION ───────── */

interface GenerateTopicParams {
  topicId: string;
  userId: string;
  schoolId?: string | null;
  userRole: Role;
}

export async function generateTopicContent({ 
  topicId, 
  userId, 
  schoolId, 
  userRole 
}: GenerateTopicParams) {
  try {
    // 1. Fetch Topic with STRICT Security Filter (Rule 7 & 10)
    const topic = await prisma.topic.findFirst({
      where: { 
        id: topicId,
        ...contentScope({ schoolId }) 
      },
      include: {
        gradeSubject: {
          include: {
            grade: { include: { curriculum: true } },
            subject: true,
          },
        },
      },
    });

    if (!topic) throw new Error("Topic not found or access denied");

    // 2. Prevent Duplication based on Scope (Rule 4)
    const existingLesson = await prisma.globalLesson.findFirst({
      where: { 
        topicId,
        schoolId: topic.schoolId // Only check within the same scope
      },
    });

    if (existingLesson) {
      return { success: true, message: "Content already exists for this scope" };
    }

    const curriculum = topic.gradeSubject.grade.curriculum;
    const subjectName = topic.gradeSubject.subject.name;

    // 3. Determine Ownership for the new content (Rule 8)
    // If the topic is global, the AI output is Global.
    // If the topic is school-specific, the AI output is School-specific.
    const isGlobalContent = topic.isGlobal;
    const contentSchoolId = isGlobalContent ? null : topic.schoolId;

    const dynamicPrompt = `You are an expert instructional designer for the ${curriculum.name} curriculum.
    Generate a COMPREHENSIVE academic package for: ${topic.title}.
    Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.

    STRICT CONTENT REQUIREMENTS:
    1. EXPLANATION: Write a massive, detailed lesson note (minimum 1000 words). Use rich Markdown.
    2. VISUAL AIDS: Generate exactly 3 distinct visual aid prompts.
    3. QUIZ: Generate exactly 10 multiple-choice questions.

    STRICT SCOPE:
     - Topic: ${topic.title}
     - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
    `;

    const { object: ai } = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: LessonAiSchema,
      prompt: dynamicPrompt,
    });
    
    // 4. Transactional Write (Rule 11)
    await prisma.$transaction(async (tx) => {
      // Save Lesson
      const lesson = await tx.globalLesson.create({
        data: {
          topicId,
          schoolId: contentSchoolId,
          isGlobal: isGlobalContent,
          title: ai.studentContent.title,
          aiContent: ai as unknown as Prisma.InputJsonValue,
          ownershipType: isGlobalContent ? OwnershipType.GLOBAL : OwnershipType.SCHOOL,
        },
      });

      // Rule 8: Save Questions to the Global or School Question Bank
      const questionData = ai.studentContent.quiz.map((q) => ({
        topicId,
        text: q.question,
        options: q.options as unknown as Prisma.InputJsonValue,
        correctAnswer: q.answer,
        explanation: q.explanation,
        type: QuestionType.MCQ,
        category: QuestionCategory.PRACTICE,
        points: 1,
      }));

      await tx.question.createMany({
        data: questionData,
      });

      // 5. Log Activity (Adhering to requested logger rule)
      await logActivity({
        schoolId: schoolId,
        actorId: userId,
        actorRole: userRole,
        type: "ASSESSMENT_CREATED", // Reusing logic for content creation
        title: `AI Content Generated: ${topic.title}`,
        description: `Generated a full lesson and 10 questions for ${topic.title}. Scope: ${isGlobalContent ? 'Global' : 'School'}`
      });
    });
    
    return { success: true };

  } catch (err: unknown) {
    console.error("Content Gen Error:", err);
    return { success: false, error: getErrorMessage(err) };
  }
} 