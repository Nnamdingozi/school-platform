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


'use server'

import { prisma } from "@/lib/prisma"

type StudentAnswer = {
  questionId: string
  selected: string
}

export async function submitExamAction(params: {
  examId: string
  studentId: string
  classId: string
  answers: StudentAnswer[]
}) {
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
      return { success: false, error: "Exam not found" }
    }

    // 1. Create submission
    const submission = await prisma.examSubmission.create({
      data: {
        examId: params.examId,
        studentId: params.studentId,
        classId: params.classId,
        answers: params.answers
      }
    })

    let totalScore = 0

    // 2. Grade answers
    for (const ans of params.answers) {
      const questionLink = exam.questions.find(
        (q) => q.questionId === ans.questionId
      )

      if (!questionLink) continue

      const question = questionLink.question

      const isCorrect = question.correctAnswer === ans.selected

      const score = isCorrect ? question.points : 0

      totalScore += score

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

    // 3. Update final score
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

  } catch (err: any) {
    return {
      success: false,
      error: err.message
    }
  }
}

export async function getExamForStudent(examId: string) {
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
    throw new Error("Exam not found")
  }

  return {
    id: exam.id,
    title: exam.title,
    duration: exam.duration,
    questions: exam.questions.map((q) => ({
      id: q.question.id,
      text: q.question.text,
      options: q.question.options,
      points: q.question.points
    }))
  }
}