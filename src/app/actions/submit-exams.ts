// import prisma from "@/lib/prisma";

// export async function submitExam({
//   examId,
//   studentId,
//   classId,
//   answers // [{questionId, selected}]
// }: any) {
//   try {
//     // 1. Get exam questions with correct answers
//     const exam = await prisma.exam.findUnique({
//       where: { id: examId },
//       include: {
//         questions: {
//           include: {
//             question: true
//           }
//         }
//       }
//     });

//     if (!exam) throw new Error("Exam not found");

//     const questionMap = new Map(
//       exam.questions.map(q => [q.questionId, q.question])
//     );

//     let total = exam.questions.length;
//     let score = 0;

//     // 2. Create submission first
//     const submission = await prisma.examSubmission.create({
//       data: {
//         examId,
//         studentId,
//         classId,
//         total,
//         score: 0,
//         status: "SUBMITTED"
//       }
//     });

//     // 3. Grade answers
//     const gradedAnswers = answers.map((a: any) => {
//       const question = questionMap.get(a.questionId);

//       const isCorrect = question?.correctAnswer === a.selected;

//       if (isCorrect) score++;

//       return {
//         submissionId: submission.id,
//         questionId: a.questionId,
//         selected: a.selected,
//         correct: isCorrect,
//         score: isCorrect ? 1 : 0
//       };
//     });

//     // 4. Save answers
//     await prisma.submissionAnswer.createMany({
//       data: gradedAnswers
//     });

//     // 5. Update final score
//     await prisma.examSubmission.update({
//       where: { id: submission.id },
//       data: {
//         score,
//         status: "GRADED"
//       }
//     });

//     return {
//       success: true,
//       score,
//       total
//     };

//   } catch (err: any) {
//     return {
//       success: false,
//       error: err.message
//     };
//   }
// }

// 'use server'

// import { prisma } from "@/lib/prisma"

// type StudentAnswer = {
//   questionId: string
//   selected: string
// }

// export async function submitExamAction(params: {
//   examId: string
//   studentId: string
//   classId: string
//   answers: StudentAnswer[]
// }) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: params.examId },
//       include: {
//         questions: {
//           include: {
//             question: true
//           }
//         }
//       }
//     })

//     if (!exam) {
//       return { success: false, error: "Exam not found" }
//     }

//     // 1. Create submission
//     const submission = await prisma.examSubmission.create({
//       data: {
//         examId: params.examId,
//         studentId: params.studentId,
//         classId: params.classId,
//         answers: params.answers
//       }
//     })

//     let totalScore = 0

//     // 2. Grade answers
//     for (const ans of params.answers) {
//       const questionLink = exam.questions.find(
//         (q) => q.questionId === ans.questionId
//       )

//       if (!questionLink) continue

//       const question = questionLink.question

//       const isCorrect = question.correctAnswer === ans.selected

//       const score = isCorrect ? question.points : 0

//       totalScore += score

//       await prisma.submissionAnswer.create({
//         data: {
//           submissionId: submission.id,
//           questionId: ans.questionId,
//           selected: ans.selected,
//           correct: isCorrect,
//           score
//         }
//       })
//     }

//     // 3. Update final score
//     await prisma.examSubmission.update({
//       where: { id: submission.id },
//       data: {
//         score: totalScore,
//         total: exam.questions.length,
//         status: "GRADED",
//         gradedAt: new Date()
//       }
//     })

//     return {
//       success: true,
//       submissionId: submission.id,
//       score: totalScore
//     }

//   } catch (err: any) {
//     return {
//       success: false,
//       error: err.message
//     }
//   }
// }

// 'use server'

// import { prisma } from "@/lib/prisma"

// type StudentAnswer = {
//   questionId: string
//   selected: string
// }

// export async function submitExamAction(params: {
//   examId: string
//   studentId: string
//   classId: string
//   answers: StudentAnswer[]
// }) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: params.examId },
//       include: {
//         questions: {
//           include: {
//             question: true
//           }
//         }
//       }
//     })

//     if (!exam) {
//       return { success: false, error: "Exam not found" }
//     }

//     // 1. Create submission
//     const submission = await prisma.examSubmission.create({
//       data: {
//         examId: params.examId,
//         studentId: params.studentId,
//         classId: params.classId,
//         answers: params.answers
//       }
//     })

//     let totalScore = 0

//     // 2. Grade answers
//     for (const ans of params.answers) {
//       const questionLink = exam.questions.find(
//         (q) => q.questionId === ans.questionId
//       )

//       if (!questionLink) continue

//       const question = questionLink.question

//       const isCorrect = question.correctAnswer === ans.selected

//       const score = isCorrect ? question.points : 0

//       totalScore += score

//       await prisma.submissionAnswer.create({
//         data: {
//           submissionId: submission.id,
//           questionId: ans.questionId,
//           selected: ans.selected,
//           correct: isCorrect,
//           score
//         }
//       })
//     }

//     // 3. Update final score
//     await prisma.examSubmission.update({
//       where: { id: submission.id },
//       data: {
//         score: totalScore,
//         total: exam.questions.length,
//         status: "GRADED",
//         gradedAt: new Date()
//       }
//     })

//     return {
//       success: true,
//       submissionId: submission.id,
//       score: totalScore
//     }

//   } catch (err: any) {
//     return {
//       success: false,
//       error: err.message
//     }
//   }
// }

// 'use server'

// import { prisma } from "@/lib/prisma"

// type StudentAnswer = {
//   questionId: string
//   selected: string
// }

// export async function submitExamAction(params: {
//   examId: string
//   studentId: string
//   classId: string
//   answers: StudentAnswer[]
// }) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: params.examId },
//       include: {
//         questions: {
//           include: {
//             question: true
//           }
//         }
//       }
//     })

//     if (!exam) {
//       return { success: false, error: "Exam not found" }
//     }

//     // 1. Create submission
//     const submission = await prisma.examSubmission.create({
//       data: {
//         examId: params.examId,
//         studentId: params.studentId,
//         classId: params.classId,
//         answers: params.answers
//       }
//     })

//     let totalScore = 0

//     // 2. Grade answers
//     for (const ans of params.answers) {
//       const questionLink = exam.questions.find(
//         (q) => q.questionId === ans.questionId
//       )

//       if (!questionLink) continue

//       const question = questionLink.question

//       const isCorrect = question.correctAnswer === ans.selected

//       const score = isCorrect ? question.points : 0

//       totalScore += score

//       await prisma.submissionAnswer.create({
//         data: {
//           submissionId: submission.id,
//           questionId: ans.questionId,
//           selected: ans.selected,
//           correct: isCorrect,
//           score
//         }
//       })
//     }

//     // 3. Update final score
//     await prisma.examSubmission.update({
//       where: { id: submission.id },
//       data: {
//         score: totalScore,
//         total: exam.questions.length,
//         status: "GRADED",
//         gradedAt: new Date()
//       }
//     })

//     return {
//       success: true,
//       submissionId: submission.id,
//       score: totalScore
//     }

//   } catch (err: any) {
//     return {
//       success: false,
//       error: err.message
//     }
//   }
// }


// 'use server'

// import { prisma } from "@/lib/prisma"

// type StudentAnswer = {
//   questionId: string
//   selected: string
// }

// export async function submitExamAction(params: {
//   examId: string
//   studentId: string
//   classId: string
//   answers: StudentAnswer[]
// }) {
//   try {
//     const exam = await prisma.exam.findUnique({
//       where: { id: params.examId },
//       include: {
//         questions: {
//           include: {
//             question: true
//           }
//         }
//       }
//     })

//     if (!exam) {
//       return { success: false, error: "Exam not found" }
//     }

//     // 1. Create submission
//     const submission = await prisma.examSubmission.create({
//       data: {
//         examId: params.examId,
//         studentId: params.studentId,
//         classId: params.classId,
//         answers: params.answers
//       }
//     })

//     let totalScore = 0

//     // 2. Grade answers
//     for (const ans of params.answers) {
//       const questionLink = exam.questions.find(
//         (q) => q.questionId === ans.questionId
//       )

//       if (!questionLink) continue

//       const question = questionLink.question

//       const isCorrect = question.correctAnswer === ans.selected

//       const score = isCorrect ? question.points : 0

//       totalScore += score

//       await prisma.submissionAnswer.create({
//         data: {
//           submissionId: submission.id,
//           questionId: ans.questionId,
//           selected: ans.selected,
//           correct: isCorrect,
//           score
//         }
//       })
//     }

//     // 3. Update final score
//     await prisma.examSubmission.update({
//       where: { id: submission.id },
//       data: {
//         score: totalScore,
//         total: exam.questions.length,
//         status: "GRADED",
//         gradedAt: new Date()
//       }
//     })

//     return {
//       success: true,
//       submissionId: submission.id,
//       score: totalScore,
//       total: exam.questions.length
//     }

//   } catch (err: any) {
//     return {
//       success: false,
//       error: err.message
//     }
//   }
// }

// export async function getExamForStudent(examId: string) {
//   const exam = await prisma.exam.findUnique({
//     where: {
//       id: examId
//     },
//     include: {
//       questions: {
//         include: {
//           question: true
//         },
//         orderBy: {
//           order: "asc"
//         }
//       },
//       class: true,
//       term: true
//     }
//   })

//   if (!exam) {
//     throw new Error("Exam not found")
//   }

//   return {
//     id: exam.id,
//     title: exam.title,
//     duration: exam.duration,
//     questions: exam.questions.map((q) => ({
//       id: q.question.id,
//       text: q.question.text,
//       options: q.question.options,
//       points: q.question.points
//     }))
//   }
// }

'use server'

import { prisma } from "@/lib/prisma"
import { getErrorMessage } from "@/lib/error-handler"
import { Prisma } from "@prisma/client"

// ── Types ───────────────────────────────────────────────────────────────────

export interface StudentAnswer {
  questionId: string
  selected: string
}

interface SubmissionResult {
  success: boolean
  submissionId?: string
  score?: number
  total?: number
  error?: string
}

interface ExamStudentView {
  id: string
  title: string
  duration: number
  questions: Array<{
    id: string
    text: string
    options: string[]
    points: number
  }>
}

// ── Main Actions ─────────────────────────────────────────────────────────────

/**
 * Handles the logic for a student submitting a completed exam.
 * Performs automatic grading and persists the result.
 */
export async function submitExamAction(params: {
  examId: string
  studentId: string
  classId: string
  answers: StudentAnswer[]
}): Promise<SubmissionResult> {
  try {
    const exam = await prisma.exam.findUnique({
      where: { id: params.examId },
      include: {
        questions: {
          include: {
            question: true
          }
        }
      }
    })

    if (!exam) {
      return { success: false, error: "Academic record for this exam was not found." }
    }

    // 1. Create the base submission record
    const submission = await prisma.examSubmission.create({
      data: {
        examId: params.examId,
        studentId: params.studentId,
        classId: params.classId,
        // Cast the array to Prisma JsonValue safely
        answers: params.answers as unknown as Prisma.InputJsonValue
      }
    })

    let totalScore = 0

    // 2. Grade each answer against the correct key in the database
    for (const ans of params.answers) {
      const questionLink = exam.questions.find(
        (q) => q.questionId === ans.questionId
      )

      if (!questionLink) continue

      const question = questionLink.question
      const isCorrect = question.correctAnswer === ans.selected
      const score = isCorrect ? question.points : 0

      totalScore += score

      // Persist the detailed answer log
      await prisma.submissionAnswer.create({
        data: {
          submissionId: submission.id,
          questionId: ans.questionId,
          selected: ans.selected,
          correct: isCorrect,
          score
        }
      })
    }

    // 3. Finalize the submission record with the computed score
    await prisma.examSubmission.update({
      where: { id: submission.id },
      data: {
        score: totalScore,
        total: exam.questions.length,
        status: "GRADED",
        gradedAt: new Date()
      }
    })

    return {
      success: true,
      submissionId: submission.id,
      score: totalScore,
      total: exam.questions.length
    }

  } catch (err) {
    // FIX: Replaced 'any' with robust error handling
    const message = getErrorMessage(err)
    console.error("CBT_SUBMISSION_ERROR:", message)
    return {
      success: false,
      error: message
    }
  }
}

/**
 * Retrieves the exam structure for a student to take the test.
 */
export async function getExamForStudent(examId: string): Promise<ExamStudentView> {
  const exam = await prisma.exam.findUnique({
    where: {
      id: examId
    },
    include: {
      questions: {
        include: {
          question: true
        },
        orderBy: {
          order: "asc"
        }
      },
      class: true,
      term: true
    }
  })

  if (!exam) {
    throw new Error("Specified exam is offline or invalid.")
  }

  // Return strictly typed data for the exam runner component
  return {
    id: exam.id,
    title: exam.title,
    duration: exam.duration,
    questions: exam.questions.map((q) => ({
      id: q.question.id,
      text: q.question.text,
      options: q.question.options as string[], // Cast from JsonValue to string array
      points: q.question.points
    }))
  }
}