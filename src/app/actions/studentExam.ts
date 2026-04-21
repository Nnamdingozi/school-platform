// "use server";

// import { prisma } from "@/lib/prisma";

// export async function getStudentExam(examId: string, classId: string) {
//   const exam = await prisma.exam.findUnique({
//     where: { id: examId },
//     include: {
//       questions: {
//         include: {
//           question: true,
//         },
//       },
//       class: true,
//     },
//   });

//   if (!exam) throw new Error("Exam not found");

//   return {
//     id: exam.id,
//     title: exam.title,
//     duration: exam.duration,
//     startTime: exam.startTime,
//     endTime: exam.endTime,
//     status: exam.status,
//     classId: exam.classId,
//     questions: exam.questions.map((q) => ({
//       id: q.question.id,
//       text: q.question.text,
//       options: q.question.options,
//     })),
//   };
// }


"use server";

import { prisma } from "@/lib/prisma";
import { ExamStatus } from "@prisma/client";

// ── Types ───────────────────────────────────────────────────────────────────

interface StudentExamResponse {
  id: string;
  title: string;
  duration: number;
  startTime: Date | null;
  endTime: Date | null;
  status: ExamStatus;
  classId: string;
  questions: Array<{
    id: string;
    text: string;
    options: string[]; // Options are cast from JsonValue to string array
  }>;
}

// ── Main Action ─────────────────────────────────────────────────────────────

/**
 * Fetches an exam for a student, validating that it belongs to their class.
 */
export async function getStudentExam(
  examId: string, 
  classId: string
): Promise<StudentExamResponse> {
  // FIX: Utilize classId in the 'where' clause for security/validation.
  // We use findFirst because findUnique only accepts unique identifiers.
  const exam = await prisma.exam.findFirst({
    where: { 
      id: examId,
      classId: classId // ✅ Validation: Exam must belong to the requester's class
    },
    include: {
      questions: {
        include: {
          question: true,
        },
        orderBy: {
          order: 'asc'
        }
      },
      class: true,
    },
  });

  if (!exam) {
    throw new Error("Exam registry entry not found or access denied for this classroom.");
  }

  // Return strictly typed object
  const response: StudentExamResponse = {
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
      // Logic fix: cast Prisma JsonValue to string[] safely
      options: q.question.options as string[],
    })),
  };

  return response;
}