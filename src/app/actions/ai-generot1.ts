"use server";

import { prisma } from "@/lib/prisma"; // Ensure this points to your global prisma client
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { revalidatePath } from "next/cache";

// 1. THE BLUEPRINT (Zod Schema)
// This ensures the AI always returns the same perfect JSON structure
export const LessonAiSchema = z.object({
  title: z.string(),
  learningObjectives: z.array(z.string()),
  explanation: z.string(), // Main lesson body in Markdown
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

export type LessonAiContent = z.infer<typeof LessonAiSchema>;

/**
 * DYNAMIC AI GENERATOR
 * Automatically adapts to any curriculum (Nigerian, British, American, etc.)
 */
export async function generateLessonForTopic(topicId: string) {
  // 2. FETCH DEEP CONTEXT
  // We travel up the database tree: Topic -> GradeSubject -> Grade -> Curriculum
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      gradeSubject: {
        include: {
          grade: {
            include: {
              curriculum: true,
            },
          },
          subject: true,
        },
      },
      school: true,
    },
  });

  if (!topic) throw new Error(`Topic with id '${topicId}' not found`);

  // 3. EXTRACT DYNAMIC LABELS
  const curriculum = topic.gradeSubject.grade.curriculum;
  const curriculumName = curriculum.name;
  const yearLabel = curriculum.yearLabel; // e.g., "Grade" or "Year"
  const subjectName = topic.gradeSubject.subject.name;
  const gradeDisplayName = topic.gradeSubject.grade.displayName;
  
  const scopeDescription = topic.description ?? "Focus strictly on the topic title and general subject principles.";

  // 4. THE DYNAMIC PROMPT (The Chameleon Logic)
  const dynamicPrompt = [
    `You are an expert teacher and instructional designer specializing in the "${curriculumName}".`,
    `Your goal is to create a high-quality lesson for the subject: ${subjectName}.`,
    "",
    "STRICT ACADEMIC SCOPE:",
    `- Curriculum Standard: ${curriculumName}`,
    `- ${yearLabel}: ${gradeDisplayName}`,
    `- Topic Title: ${topic.title}`,
    `- Content Breakdown: ${scopeDescription}`,
    "",
    "INSTRUCTIONS:",
    `- Use language and examples appropriate for a student in ${gradeDisplayName}.`,
    `- Ensure the tone reflects the pedagogical standards of the ${curriculumName}.`,
    `- The explanation must be in structured Markdown (using ## headings, bullet points, and bold text).`,
    `- Include real-world examples relevant to the student's context.`,
    `- Generate a 10-question multiple choice quiz with detailed explanations for the correct answers.`,
  ].join("\n");

  // 5. CALL THE AI
  const result = await generateObject({
    model: google("gemini-1.5-flash"),
    schema: LessonAiSchema,
    prompt: dynamicPrompt,
  });

  const lessonContent = result.object;

  // 6. PERSIST TO DATABASE (Idempotent: Update if exists, Create if not)
  const lesson = await prisma.lesson.upsert({
    where: { 
      topicId: topic.id 
    },
    update: {
      title: lessonContent.title,
      content: lessonContent.explanation,
      aiContent: lessonContent as any,
    },
    create: {
      title: lessonContent.title,
      content: lessonContent.explanation,
      topicId: topic.id,
      schoolId: topic.schoolId,
      aiContent: lessonContent as any,
    },
  });

  // 7. REFRESH THE CACHE
  revalidatePath(`/dashboard/lessons/${topic.id}`);

  return lesson;
}