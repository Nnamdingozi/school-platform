// "use server";
// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";

// // 1. THE BLUEPRINT: Exact shape of the AI response
// const LessonAiSchema = z.object({
//   title: z.string(),
//   learningObjectives: z.array(z.string()),
//   explanation: z.string(), // Markdown body
//   examples: z.array(
//     z.object({
//       task: z.string(),
//       solution: z.string(),
//     })
//   ),
//   videoScript: z.string(),
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

// /**
//  * SENIOR REFACTOR: DYNAMIC MULTI-TENANT GENERATOR
//  * Handles Lessons, Quizzes, and Questions in a single Atomic Transaction.
//  */
// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// export async function generateLessonForTopic(topicId: string) {
//   // 2. FETCH HIERARCHICAL CONTEXT
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

//   // 3. DYNAMIC CHAMELEON PROMPT
//   const dynamicPrompt = `
//     You are an expert ${curriculum.name} instructional designer.
//     Generate a comprehensive lesson for the subject: ${subjectName}.
   
//     STRICT SCOPE:
//     - Topic: ${topic.title}
//     - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
//     - Level: ${topic.gradeSubject.grade.displayName} (${curriculum.yearLabel})
   
//     INSTRUCTIONS:
//     - Tone: Pedagogically aligned with ${curriculum.name} standards.
//     - Format: Use structured Markdown for the main explanation.
//     - Localization: Use terminology and units relevant to a student in this curriculum.
//   `;

//   // 4. CALL THE AI
//   const { object: ai } = await generateObject({
//     model: google("models/gemini-1.5-flash"),
//     schema: LessonAiSchema,
//     prompt: dynamicPrompt,
//   });

//   // 5. THE ATOMIC TRANSACTION: Save everything or nothing
//   const lesson = await prisma.$transaction(async (tx) => {
   
//     // A. CLEANUP: If a lesson already exists, remove its old quiz/questions
//     const existingLesson = await tx.lesson.findUnique({
//       where: { topicId: topic.id },
//       select: { id: true }
//     });

//     if (existingLesson) {
//       // Deleting the Quiz will automatically delete Questions due to 'onDelete: Cascade' in Schema
//       await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//     }

//     // B. UPSERT LESSON: Create or Update the main lesson content
//     const savedLesson = await tx.lesson.upsert({
//       where: { topicId: topic.id },
//       update: {
//         title: ai.title,
//         content: ai.explanation,
//         videoScript: ai.videoScript,
//         aiContent: ai as any, // Backup of raw AI data
//       },
//       create: {
//         topicId: topic.id,
//         title: ai.title,
//         content: ai.explanation,
//         videoScript: ai.videoScript,
//         schoolId: topic.schoolId,
//         aiContent: ai as any,
//       },
//     });

//     // C. CREATE QUIZ: The container for our questions
//     const quiz = await tx.quiz.create({
//       data: { lessonId: savedLesson.id }
//     });

//     // D. BATCH CREATE QUESTIONS: Efficiently insert all questions at once
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

//   // 6. UI REFRESH
//   revalidatePath(`/dashboard/lessons/${topic.id}`);
 
//   return lesson;
// }



// "use server";
// import { prisma } from "@/lib/prisma";
// import { google } from "@ai-sdk/google";
// import { generateObject } from "ai";
// import { z } from "zod";
// import { revalidatePath } from "next/cache";

// // 1. THE BLUEPRINT: Exact shape of the AI response
// const LessonAiSchema = z.object({
//   title: z.string(),
//   learningObjectives: z.array(z.string()),
//   explanation: z.string(), // Markdown body
//   examples: z.array(
//     z.object({
//       task: z.string(),
//       solution: z.string(),
//     })
//   ),
//   videoScript: z.string(),
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

// /**
//  * SENIOR REFACTOR: DYNAMIC MULTI-TENANT GENERATOR
//  * Handles Lessons, Quizzes, and Questions in a single Atomic Transaction.
//  */
// export type LessonAiContent = z.infer<typeof LessonAiSchema>;

// export async function generateLessonForTopic(topicId: string) {
//   // 2. FETCH HIERARCHICAL CONTEXT
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

//   // 3. DYNAMIC CHAMELEON PROMPT
//   const dynamicPrompt = `
//     You are an expert ${curriculum.name} instructional designer.
//     Generate a comprehensive lesson for the subject: ${subjectName}.
   
//     STRICT SCOPE:
//     - Topic: ${topic.title}
//     - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
//     - Level: ${topic.gradeSubject.grade.displayName} (${curriculum.yearLabel})
   
//     INSTRUCTIONS:
//     - Tone: Pedagogically aligned with ${curriculum.name} standards.
//     - Format: Use structured Markdown for the main explanation.
//     - Localization: Use terminology and units relevant to a student in this curriculum.
//   `;

//   // 4. CALL THE AI
//   const { object: ai } = await generateObject({
//     // model: google("models/gemini-2.5-flash"),
//   model: google("models/gemini-3.0-pro"),
//     schema: LessonAiSchema,
//     prompt: dynamicPrompt,
//   });

//   // 5. THE ATOMIC TRANSACTION: Save everything or nothing
//   const lesson = await prisma.$transaction(async (tx) => {
   
//     // A. CLEANUP: If a lesson already exists, remove its old quiz/questions
//     const existingLesson = await tx.lesson.findUnique({
//       where: { topicId: topic.id },
//       select: { id: true }
//     });

//     if (existingLesson) {
//       // Deleting the Quiz will automatically delete Questions due to 'onDelete: Cascade' in Schema
//       await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
//     }

//     // B. UPSERT LESSON: Create or Update the main lesson content
//     const savedLesson = await tx.lesson.upsert({
//       where: { topicId: topic.id },
//       update: {
//         title: ai.title,
//         content: ai.explanation,
//         videoScript: ai.videoScript,
//         aiContent: ai as any, // Backup of raw AI data
//       },
//       create: {
//         topicId: topic.id,
//         title: ai.title,
//         content: ai.explanation,
//         videoScript: ai.videoScript,
//         schoolId: topic.schoolId,
//         aiContent: ai as any,
//       },
//     });

//     // C. CREATE QUIZ: The container for our questions
//     const quiz = await tx.quiz.create({
//       data: { lessonId: savedLesson.id }
//     });

//     // D. BATCH CREATE QUESTIONS: Efficiently insert all questions at once
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

//   // 6. UI REFRESH
//   revalidatePath(`/dashboard/lessons/${topic.id}`);
 
//   return lesson;
// }


"use server";
import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// 1. THE BLUEPRINT: Updated to include 'visualAids' instead of 'videoScript'
const LessonAiSchema = z.object({
  title: z.string(),
  learningObjectives: z.array(z.string()),
  explanation: z.string(), // Markdown body
  examples: z.array(
    z.object({
      task: z.string(),
      solution: z.string(),
    })
  ),
  // NEW: AI decides which diagrams/graphs are needed
  visualAids: z.array(z.object({
    title: z.string().describe("Short title, e.g., 'Plant Cell Structure' or 'Velocity-Time Graph'"),
    description: z.string().describe("Rationale: Why is this visual needed for this specific lesson?"),
    imagePrompt: z.string().describe("A highly detailed, descriptive prompt for an AI image generator (DALL-E). Include details about style (textbook, flat vector, white background), labels, and specific elements to draw."),
    url: z.string().optional().describe("URL of the generated image, if available."), 
  })).describe("Identify 1 to 3 key concepts in this lesson that require visual representation."),
  
  summary: z.string(),
  quiz: z.array(
    z.object({
      question: z.string(),
      options: z.array(z.string()),
      answer: z.string(),
      explanation: z.string(),
    })
  ),
});

export type LessonAiContent = z.infer<typeof LessonAiSchema>;

export async function generateLessonForTopic(topicId: string) {
  // 2. FETCH HIERARCHICAL CONTEXT
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

  // 3. DYNAMIC CHAMELEON PROMPT (Updated for Visuals)
  const dynamicPrompt = `
    You are an expert ${curriculum.name} instructional designer and educational illustrator.
    Generate a comprehensive lesson for the subject: ${subjectName}.
   
    STRICT SCOPE:
    - Topic: ${topic.title}
    - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
    - Level: ${topic.gradeSubject.grade.displayName} (${curriculum.yearLabel})
   
    INSTRUCTIONS:
    1. **Explanation:** Write a clear, engaging lesson content in structured Markdown.
    2. **Visual Analysis:** Analyze the explanation. Does this topic require visual aids to be understood? 
       - If YES (e.g., Biology cells, Physics forces, Math graphs, Geography maps, Agric tools), define 1-3 specific diagrams or charts.
       - Create a precise 'imagePrompt' for each that I can send to DALL-E. 
       - Style Guide for Prompts: "Educational textbook illustration, white background, clear line work, accurate scientific details."
    3. **Quiz:** Generate 10 distinct questions that test understanding of the concepts.
    4. **Localization:** Use terminology, currency, and examples relevant to the ${curriculum.name} region.
  `;

  // 4. CALL THE AI
  const { object: ai } = await generateObject({
    model: google("models/gemini-2.5-flash"), // Flash is fast/cheap, Pro is better for complex logic
    schema: LessonAiSchema,
    prompt: dynamicPrompt,
  });

  // 5. THE ATOMIC TRANSACTION
  const lesson = await prisma.$transaction(async (tx) => {
   
    // A. CLEANUP
    const existingLesson = await tx.lesson.findUnique({
      where: { topicId: topic.id },
      select: { id: true }
    });

    if (existingLesson) {
      await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
    }

    // B. UPSERT LESSON
    // Note: We are no longer saving 'videoScript' to a specific column.
    // The visualAids are stored inside the 'aiContent' JSON field.
    const savedLesson = await tx.lesson.upsert({
      where: { topicId: topic.id },
      update: {
        title: ai.title,
        content: ai.explanation,
        // videoScript: "", // Clear this or remove line if column allows null
        aiContent: ai as any, // This now contains the visualAids array
      },
      create: {
        topicId: topic.id,
        title: ai.title,
        content: ai.explanation,
        // videoScript: "", 
        schoolId: topic.schoolId,
        aiContent: ai as any,
      },
    });

    // C. CREATE QUIZ
    const quiz = await tx.quiz.create({
      data: { lessonId: savedLesson.id }
    });

    // D. BATCH CREATE QUESTIONS
    await tx.question.createMany({
      data: ai.quiz.map((q) => ({
        quizId: quiz.id,
        text: q.question,
        options: q.options,
        correctAnswer: q.answer,
        explanation: q.explanation,
      })),
    });

    return savedLesson;
  });

  // 6. UI REFRESH
  revalidatePath(`/dashboard/lessons/${topic.id}`);
 
  return lesson;
}