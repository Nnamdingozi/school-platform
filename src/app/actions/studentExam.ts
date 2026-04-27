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


// "use server";

// import { prisma } from "@/lib/prisma";
// import { ExamStatus } from "@prisma/client";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface StudentExamResponse {
//   id: string;
//   title: string;
//   duration: number;
//   startTime: Date | null;
//   endTime: Date | null;
//   status: ExamStatus;
//   classId: string;
//   questions: Array<{
//     id: string;
//     text: string;
//     options: string[]; // Options are cast from JsonValue to string array
//   }>;
// }

// // ── Main Action ─────────────────────────────────────────────────────────────

// /**
//  * Fetches an exam for a student, validating that it belongs to their class.
//  */
// export async function getStudentExam(
//   examId: string, 
//   classId: string
// ): Promise<StudentExamResponse> {
//   // FIX: Utilize classId in the 'where' clause for security/validation.
//   // We use findFirst because findUnique only accepts unique identifiers.
//   const exam = await prisma.exam.findFirst({
//     where: { 
//       id: examId,
//       classId: classId // ✅ Validation: Exam must belong to the requester's class
//     },
//     include: {
//       questions: {
//         include: {
//           question: true,
//         },
//         orderBy: {
//           order: 'asc'
//         }
//       },
//       class: true,
//     },
//   });

//   if (!exam) {
//     throw new Error("Exam registry entry not found or access denied for this classroom.");
//   }

//   // Return strictly typed object
//   const response: StudentExamResponse = {
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
//       // Logic fix: cast Prisma JsonValue to string[] safely
//       options: q.question.options as string[],
//     })),
//   };

//   return response;
// }


"use server";

import { prisma } from "@/lib/prisma";
import { ExamStatus, Prisma } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";
import { schoolOnlyScope } from "@/lib/content-scope";

// ── Types ───────────────────────────────────────────────────────────────────

export interface StudentExamQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface StudentExamResponse {
  id: string;
  title: string;
  duration: number;
  startTime: Date | null;
  endTime: Date | null;
  status: ExamStatus;
  classId: string;
  questions: StudentExamQuestion[];
}

// ── Main Action ─────────────────────────────────────────────────────────────

/**
 * FETCH EXAM FOR RUNNER (Tier 2 - Institutional Only)
 * Rule 5: Strictly isolated by schoolId.
 * Rule 6: Independent users cannot access institutional exams.
 * Rule 10: Security check ensures student is enrolled in the target class.
 */
export async function getStudentExam(params: {
  examId: string;
  userId: string;
  schoolId: string | null;
}): Promise<{ success: boolean; data?: StudentExamResponse; error?: string }> {
  const { examId, userId, schoolId } = params;

  try {
    // 1. Rule 6: Block Independent Learners from Institutional Exams
    if (!schoolId) {
      throw new Error("Access Denied: Exams are only available to registered school students.");
    }

    // 2. Fetch Exam with strict school isolation (Rule 5)
    const exam = await prisma.exam.findUnique({
      where: { 
        id: examId,
        ...schoolOnlyScope(schoolId) 
      },
      include: {
        questions: {
          include: {
            question: true, // Pulls the base question text/options
          },
          orderBy: {
            order: 'asc'
          }
        },
        class: {
          include: {
            enrollments: {
              where: { studentId: userId } // Check if this specific student is in the class
            }
          }
        }
      },
    });

    // 3. Security Validation (Rule 10)
    if (!exam) {
      throw new Error("Exam not found or you do not have permission to access it.");
    }

    if (exam.class.enrollments.length === 0) {
      throw new Error("Unauthorized: You are not enrolled in the class assigned to this exam.");
    }

    if (exam.status === ExamStatus.DRAFT) {
      throw new Error("Offline: This exam has not been published by the instructor.");
    }

    // 4. Rule 11: Mapping to safe Student-Facing View
    // We explicitly exclude 'correctAnswer' and 'explanation' to prevent cheating.
    const response: StudentExamResponse = {
      id: exam.id,
      title: exam.title,
      duration: exam.duration,
      startTime: exam.startTime,
      endTime: exam.endTime,
      status: exam.status,
      classId: exam.classId,
      questions: exam.questions.map((eq) => ({
        id: eq.question.id,
        text: eq.question.text,
        // Safe cast from Prisma JsonValue to string array
        options: Array.isArray(eq.question.options) 
          ? (eq.question.options as string[]) 
          : [],
      })),
    };

    return { success: true, data: response };

  } catch (error: unknown) {
    console.error("[FETCH_STUDENT_EXAM_ERROR]:", getErrorMessage(error));
    return { success: false, error: getErrorMessage(error) };
  }
}