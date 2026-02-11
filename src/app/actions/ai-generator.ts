"use server";
import { PrismaClient } from "@prisma/client";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const prisma = new PrismaClient();

// Zod schema for the AI-generated lesson
export const LessonAiSchema = z.object({
  title: z.string(),
  learningObjectives: z.array(z.string()),
  explanation: z.string(), // main lesson body in Markdown
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
 * Generate an AI lesson for a given Topic and persist it on the Lesson model.
 * - Strictly scoped to the Topic's title and description.
 * - Returns the saved Lesson record.
 */
export async function generateLessonForTopic(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      gradeSubject: {
        include: {
          grade: true,
          subject: true,
        },
      },
      school: true,
    },
  });

  if (!topic) {
    throw new Error(`Topic with id '${topicId}' not found`);
  }

  const model = google("gemini-1.5-flash");

  const scopeTitle = topic.title;
  const scopeDescription =
    topic.description ??
    "No description was provided. Focus strictly on the topic title.";

  const gradeName = topic.gradeSubject?.grade.displayName;
  const subjectName = topic.gradeSubject?.subject.name;

  const strictScopePrompt = [
    "You are an expert Nigerian secondary school teacher and lesson designer.",
    "You must strictly stay within the following topic scope.",
    "",
    "STRICT SCOPE (do not go beyond this topic):",
    `- Topic title: ${scopeTitle}`,
    `- Topic description: ${scopeDescription}`,
    gradeName ? `- Grade: ${gradeName}` : "",
    subjectName ? `- Subject: ${subjectName}` : "",
    "",
    "Generate a complete lesson that is perfect for:",
    "- A TEACHER to present in class (including clear teaching flow, explanations, and examples).",
    "- A STUDENT to read independently (clear structure, definitions, step-by-step reasoning).",
    "",
    "Requirements:",
    "- Use clear, student-friendly language appropriate for Nigerian secondary schools.",
    "- Keep all content aligned only with the STRICT SCOPE above.",
    "- The main explanation must be in structured Markdown (headings, bullet points, etc.).",
    "- Include worked examples that match the topic.",
    "- Include a quiz that a teacher can give at the end.",
  ]
    .filter(Boolean)
    .join("\n");

  const result = await generateObject({
    model,
    schema: LessonAiSchema,
    mode: "json",
    prompt: strictScopePrompt,
  });

  const lessonContent = result.object;

  // Ensure there is exactly one Lesson per Topic: update if exists, otherwise create.
  const existingLesson = await prisma.lesson.findFirst({
    where: { topicId: topic.id },
  });

  const data = {
    title: lessonContent.title,
    content: lessonContent.explanation,
    topicId: topic.id,
    schoolId: topic.schoolId ?? undefined,
    aiContent: lessonContent as unknown as object,
  };

  const lesson = existingLesson
    ? await prisma.lesson.update({
        where: { id: existingLesson.id },
        data,
      })
    : await prisma.lesson.create({
        data,
      });

  return lesson;
}

