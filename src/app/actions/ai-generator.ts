"use server";

import { prisma } from "@/lib/prisma";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// 1. THE BLUEPRINT: Exact shape of the AI response
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
  videoScript: z.string(),
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

/**
 * SENIOR REFACTOR: DYNAMIC MULTI-TENANT GENERATOR
 * Handles Lessons, Quizzes, and Questions in a single Atomic Transaction.
 */
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

  // 3. DYNAMIC CHAMELEON PROMPT
  const dynamicPrompt = `
    You are an expert ${curriculum.name} instructional designer.
    Generate a comprehensive lesson for the subject: ${subjectName}.
   
    STRICT SCOPE:
    - Topic: ${topic.title}
    - Content Breakdown: ${topic.description ?? "Focus on core syllabus principles."}
    - Level: ${topic.gradeSubject.grade.displayName} (${curriculum.yearLabel})
   
    INSTRUCTIONS:
    - Tone: Pedagogically aligned with ${curriculum.name} standards.
    - Format: Use structured Markdown for the main explanation.
    - Localization: Use terminology and units relevant to a student in this curriculum.
  `;

  // 4. CALL THE AI
  const { object: ai } = await generateObject({
    model: google("gemini-1.5-flash"),
    schema: LessonAiSchema,
    prompt: dynamicPrompt,
  });

  // 5. THE ATOMIC TRANSACTION: Save everything or nothing
  const lesson = await prisma.$transaction(async (tx) => {
   
    // A. CLEANUP: If a lesson already exists, remove its old quiz/questions
    const existingLesson = await tx.lesson.findUnique({
      where: { topicId: topic.id },
      select: { id: true }
    });

    if (existingLesson) {
      // Deleting the Quiz will automatically delete Questions due to 'onDelete: Cascade' in Schema
      await tx.quiz.deleteMany({ where: { lessonId: existingLesson.id } });
    }

    // B. UPSERT LESSON: Create or Update the main lesson content
    const savedLesson = await tx.lesson.upsert({
      where: { topicId: topic.id },
      update: {
        title: ai.title,
        content: ai.explanation,
        videoScript: ai.videoScript,
        aiContent: ai as any, // Backup of raw AI data
      },
      create: {
        topicId: topic.id,
        title: ai.title,
        content: ai.explanation,
        videoScript: ai.videoScript,
        schoolId: topic.schoolId,
        aiContent: ai as any,
      },
    });

    // C. CREATE QUIZ: The container for our questions
    const quiz = await tx.quiz.create({
      data: { lessonId: savedLesson.id }
    });

    // D. BATCH CREATE QUESTIONS: Efficiently insert all questions at once
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