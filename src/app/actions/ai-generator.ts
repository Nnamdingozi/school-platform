
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
   
//     STRICT SCOPE:
//     - Topic: ${topic.title}
//     - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
//     - Level: ${topic.gradeSubject.grade.displayName}
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




"use server";

import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { Prisma, QuestionCategory } from "@prisma/client"; 
import { getErrorMessage } from "@/lib/error-handler";

// ── 1. The Schema ─────────────────────────────────────────────────────────────

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
    examples: z.array(z.object({ task: z.string(), solution: z.string() })),
    visualAids: z.array(z.object({
      title: z.string(),
      description: z.string(),
      imagePrompt: z.string(),
      url: z.string().optional() 
    })),
    summary: z.string(),
    vocabulary: z.array(z.string()),
    quiz: z.array(z.object({
      question: z.string(),
      options: z.array(z.string()),
      answer: z.string(),
      explanation: z.string(),
    })),
  }),
});

export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// ── 2. The Persistence Action (Used by Manual Editor) ─────────────────────────

export async function saveLessonAction(data: {
  topicId: string;
  schoolId: string | null;
  title: string;
  content: string;
  aiContent: LessonAiContent; // ✅ FIX: Replaced 'any' with LessonAiContent
}) {
  try {
    const lesson = await prisma.lesson.upsert({
      where: {
        topicId_schoolId: {
          topicId: data.topicId,
          schoolId: data.schoolId as string, 
        },
      },
      update: {
        title: data.title,
        content: data.content,
        aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
      },
      create: {
        topicId: data.topicId,
        schoolId: data.schoolId,
        title: data.title,
        content: data.content,
        aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
      },
    });

    revalidatePath(`/teacher/lessons/${data.topicId}`);
    revalidatePath(`/admin/lessons`);

    return { success: true, data: lesson };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

// ── 3. The Generator Action ───────────────────────────────────────────────────

export async function generateLessonForTopic(topicId: string) {
  try {
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      include: {
        gradeSubject: {
          include: {
            grade: { include: { curriculum: true } },
            subject: true,
          },
        },
        school: true,
      },
    });

    if (!topic) throw new Error("Topic not found");

    const { curriculum } = topic.gradeSubject.grade;
    const subjectName = topic.gradeSubject.subject.name;

    const dynamicPrompt = `
      You are an expert instructional designer for the ${curriculum.name} curriculum.
      Generate a full academic package for the topic: ${topic.title}.
      Subject: ${subjectName}. Level: ${topic.gradeSubject.grade.displayName}.
    `;

    const { object: ai } = await generateObject({
      model: google("gemini-1.5-flash"), 
      schema: LessonAiSchema,
      prompt: dynamicPrompt,
    });

    const finalLesson = await prisma.$transaction(async (tx) => {
      // 1. Identify if a version already exists for this school/topic combo
      const existingLesson = await tx.lesson.findUnique({
        where: {
          topicId_schoolId: {
            topicId: topic.id,
            schoolId: topic.schoolId as string,
          }
        },
        select: { id: true }
      });

      // 2. Wipe existing quiz data if we are overwriting
      if (existingLesson) {
        await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
      }

      // 3. Upsert the Lesson record
      const savedLesson = await tx.lesson.upsert({
        where: {
          topicId_schoolId: {
            topicId: topic.id,
            schoolId: topic.schoolId as string 
          }
        },
        update: {
          title: ai.studentContent.title,
          content: ai.studentContent.explanation,
          aiContent: ai as unknown as Prisma.InputJsonValue,
        },
        create: {
          topicId: topic.id,
          schoolId: topic.schoolId,
          title: ai.studentContent.title,
          content: ai.studentContent.explanation,
          aiContent: ai as unknown as Prisma.InputJsonValue,
        },
      });

      // 4. Create new Quiz shell
      const quiz = await tx.quiz.create({
        data: { lessonId: savedLesson.id }
      });

      // 5. Create Questions in the Bank & Link them to the Quiz
      for (const [index, q] of ai.studentContent.quiz.entries()) {
        const question = await tx.question.create({
            data: {
                text: q.question,
                options: q.options as unknown as Prisma.InputJsonValue,
                correctAnswer: q.answer,
                explanation: q.explanation,
                topicId: topic.id,
                schoolId: topic.schoolId, 
                category: QuestionCategory.PRACTICE 
            }
        });

        // Create the junction record
        await tx.quizQuestion.create({
            data: {
                quizId: quiz.id,
                questionId: question.id,
                order: index + 1 
            }
        });
      }

      return savedLesson;
    });

    revalidatePath(`/teacher/lessons/${topic.id}`);
    revalidatePath(`/student/lessons/${topic.id}`);
    revalidatePath(`/admin/lessons`);

    return { 
      success: true, 
      data: finalLesson, 
      aiContent: ai 
    };

  } catch (err) {
    console.error("generateLessonForTopic failure:", getErrorMessage(err));
    return { 
      success: false, 
      error: getErrorMessage(err) 
    };
  }
}