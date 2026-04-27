// 'use server'

// import { prisma } from "@/lib/prisma"
// import { getErrorMessage } from "@/lib/error-handler"
// import { AssessmentType, Role, ActivityType } from "@prisma/client"
// import { logActivity } from "@/lib/activitylogger";

// /**
//  * SUBMIT PRACTICE QUIZ (Tier 3 - User Layer)
//  * Rule 6: Independent learners track progress via Practice Quizzes.
//  * This does NOT require a schoolId or classId.
//  */
// export async function submitPracticeQuizAction(params: {
//   userId: string;
//   topicId: string;
//   gradeSubjectId: string;
//   score: number;
//   maxScore: number;
//   schoolId?: string | null; // Null for independent learners
// }) {
//   const { userId, topicId, gradeSubjectId, score, maxScore, schoolId } = params;

//   try {
//     // 1. Create a personal Assessment record (Tier 3)
//     const assessment = await prisma.assessment.create({
//       data: {
//         type: AssessmentType.TOPIC_BASED,
//         studentId: userId,
//         topicId,
//         gradeSubjectId,
//         score,
//         maxScore,
//         schoolId: schoolId ?? null, // Correctly tags as Global if null
//         comments: "Self-paced Practice Quiz"
//       }
//     });

//     // 2. Rule 11: Log the learning activity
//     await logActivity({
//         schoolId: schoolId ?? null,
//         actorId: userId,
//         actorRole: schoolId ? Role.STUDENT : Role.INDIVIDUAL_LEARNER,
//         type: "ASSESSMENT_GRADED",
//         title: "Practice Quiz Completed",
//         description: `Scored ${score}/${maxScore} on a self-paced module quiz.`
//     });

//     return { success: true, data: assessment };

//   } catch (err: unknown) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }


"use server";

import { prisma } from "@/lib/prisma";
import { Question, AssessmentType } from "@prisma/client";
import { logActivity } from "@/lib/activitylogger";
import { Role } from "@prisma/client";
import {getErrorMessage} from "@/lib/error-handler"

/**
 * FETCH GLOBAL CORE QUESTIONS
 * Rule 4: Universally accessible, read-only.
 * Rule 7: Pulls randomized questions across multiple selected topics.
 */
export async function getGlobalPracticeQuestions(params: {
  topicIds: string[];
  limit?: number;
}): Promise<Question[]> {
  const { topicIds, limit = 10 } = params;

  try {
    // We only fetch where isGlobal: true to ensure they are high-quality base content
    const questions = await prisma.question.findMany({
      where: {
        topicId: { in: topicIds },
        isGlobal: true,
        type: "MCQ", // Ensuring interactive compatibility
      },
    });

    // Randomize and return subset
    return questions.sort(() => 0.5 - Math.random()).slice(0, limit);
  } catch (error) {
    console.error("Practice fetch error:", error);
    return [];
  }
}


export async function submitPracticeQuizAction(params: {
    userId: string;
    topicId: string;
    gradeSubjectId: string;
    score: number;
    maxScore: number;
    schoolId?: string | null; // Null for independent learners
  }) {
    const { userId, topicId, gradeSubjectId, score, maxScore, schoolId } = params;
  
    try {
      // 1. Create a personal Assessment record (Tier 3)
      const assessment = await prisma.assessment.create({
        data: {
          type: AssessmentType.TOPIC_BASED,
          studentId: userId,
          topicId,
          gradeSubjectId,
          score,
          maxScore,
          schoolId: schoolId ?? null, // Correctly tags as Global if null
          comments: "Self-paced Practice Quiz"
        }
      });
  
      // 2. Rule 11: Log the learning activity
      await logActivity({
          schoolId: schoolId ?? null,
          actorId: userId,
          actorRole: schoolId ? Role.STUDENT : Role.INDIVIDUAL_LEARNER,
          type: "ASSESSMENT_GRADED",
          title: "Practice Quiz Completed",
          description: `Scored ${score}/${maxScore} on a self-paced module quiz.`
      });
  
      return { success: true, data: assessment };
  
    } catch (err: unknown) {
      return { success: false, error: getErrorMessage(err) };
    }
  }
  