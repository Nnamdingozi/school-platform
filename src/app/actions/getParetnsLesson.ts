"use server";

import { prisma } from "@/lib/prisma";
import { transformParentLesson } from "@/lib/lessons/transformParentsView";

export async function getParentLesson(topicId: string, studentId: string) {
  const lesson = await prisma.lesson.findFirst({
    where: { topicId },
  });

  const performance = await prisma.assessment.findMany({
    where: { studentId, topicId },
  });

  return transformParentLesson(
    lesson?.aiContent as any,
    performance
  );
}