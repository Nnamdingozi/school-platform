"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentExam(examId: string, classId: string) {
  const exam = await prisma.exam.findUnique({
    where: { id: examId },
    include: {
      questions: {
        include: {
          question: true,
        },
      },
      class: true,
    },
  });

  if (!exam) throw new Error("Exam not found");

  return {
    id: exam.id,
    title: exam.title,
    duration: exam.duration,
    startTime: exam.startTime,
    endTime: exam.endTime,
    status: exam.status,
    classId: exam.classId,
    questions: exam.questions.map((q) => ({
      id: q.question.id,
      text: q.question.text,
      options: q.question.options,
    })),
  };
}