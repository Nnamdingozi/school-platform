"use server";

import { PrismaClient } from "@prisma/client";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const prisma = new PrismaClient();

const lessonSchema = z.object({
  title: z.string(),
  learningObjectives: z.array(z.string()),
  explanation: z.string(), // markdown
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
      options: z.array(z.string()).min(2),
      answer: z.string(),
      explanation: z.string(),
    })
  ),
});

type LessonPayload = z.infer<typeof lessonSchema>;

export async function generateAiLessonForTopic(topicId: string) {
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    include: {
      gradeSubject: {
        include: {
          grade: true,
          subject: true,
        },
      },
    },
  });

  if (!topic) {
    throw new Error(`Topic with id ${topicId} not found`);
  }

  const scopeTitle = topic.title;
  const scopeDescription =
    (topic as any).description ??
    "Use only the given title and general Nigerian secondary school curriculum context.";

  const { object } = await generateObject({
    model: google("gemini-1.5-flash"),
    schema: lessonSchema,
    system:
      "You are an expert Nigerian secondary-school teacher and curriculum designer. " +
      "You create clear, age-appropriate, and engaging lessons that teachers can present directly " +
      "and students can also read independently. Always respond strictly as JSON that matches the provided schema.",
    prompt:
      [
        "STRICT SCOPE (do not go outside this topic):",
        `Topic title: ${scopeTitle}`,
        `Topic description: ${scopeDescription}`,
        "",
        "Task:",
        "- Create a complete lesson for this topic.",
        "- The lesson should be structured so that:",
        "  - A teacher can use it as a teaching script and lesson plan.",
        "  - A student can read it independently and learn the concept.",
        "- Use clear Nigerian English, simple explanations, and localised/relatable examples where helpful.",
        "",
        "Requirements for each field:",
        "- title: A clear, student-friendly lesson title.",
        "- learningObjectives: 3–6 specific, measurable ‘By the end of this lesson, students should be able to…’ items.",
        "- explanation: Main lesson body in Markdown with headings, bullet points, and short paragraphs.",
        "- examples: 3–5 worked examples with 'task' and 'solution'.",
        "- videoScript: A narrative script a teacher or video agent could read out loud, including pauses and questions.",
        "- summary: A concise recap of the key ideas in 3–6 bullet points.",
        "- quiz: 5–10 multiple-choice questions with options, the correct answer, and a short explanation.",
      ].join("\n"),
  });

  const lessonContent: LessonPayload = object;

  // Either update existing lesson for this topic or create a new one
  const existingLesson = await prisma.lesson.findFirst({
    where: { topicId },
  });

  let lesson;

  if (existingLesson) {
    lesson = await prisma.lesson.update({
      where: { id: existingLesson.id },
      data: {
        title: lessonContent.title,
        content: lessonContent.explanation,
        aiContent: lessonContent,
      },
    });
  } else {
    lesson = await prisma.lesson.create({
      data: {
        title: lessonContent.title,
        content: lessonContent.explanation,
        topicId,
        aiContent: lessonContent,
        schoolId: (topic as any).schoolId ?? null,
      },
    });
  }

  return lesson;
}

