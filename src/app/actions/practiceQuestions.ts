"use server";

import { prisma } from "@/lib/prisma";
import { getErrorMessage } from "@/lib/error-handler";

interface FetchMultiTopicPracticeParams {
  userId: string;
  topicIds?: string[];
  gradeSubjectId?: string;
  limit?: number;
}

/**
 * FETCH MULTI-TOPIC PRACTICE SESSION QUESTIONS
 * Pulls randomized practice questions filtered across multiple selected topics,
 * excluding questions the student has already been formally assessed on.
 */
export async function fetchMultiTopicPracticeQuestions({
  userId,
  topicIds = [],
  gradeSubjectId,
  limit = 10,
}: FetchMultiTopicPracticeParams) {
  try {
    // 1. Get IDs of questions the student was already formally assessed on
    const pastAssessments = await prisma.assessment.findMany({
      where: { studentId: userId },
      select: { questionId: true },
    });
    
    const excludedQuestionIds = pastAssessments
      .map((a) => a.questionId)
      .filter(Boolean) as string[];

    // 2. Build the dynamic query filter
    const whereClause: any = {
      id: { notIn: excludedQuestionIds },
    };

    // If specific topics are selected, filter by them
    if (topicIds.length > 0) {
      whereClause.topicId = { in: topicIds };
    } else if (gradeSubjectId) {
      // Fallback to subject level if no specific topics are checked
      whereClause.gradeSubjectId = gradeSubjectId;
    } else {
      // Otherwise, pull from all subjects synchronized in the student's library
      const studentSubjects = await prisma.studentSubject.findMany({
        where: { studentId: userId },
        select: { gradeSubjectId: true },
      });
      const targetSubjectIds = studentSubjects.map((s) => s.gradeSubjectId);
      if (targetSubjectIds.length > 0) {
        whereClause.gradeSubjectId = { in: targetSubjectIds };
      }
    }

    // 3. Fetch questions matching the criteria
    const questions = await prisma.individualPracticeQuestion.findMany({
      where: whereClause,
      take: 100, // Fetch a larger batch across the selected topics to shuffle from
    });

    // 4. Randomly shuffle and slice to the requested limit
    const randomized = questions
      .sort(() => 0.5 - Math.random())
      .slice(0, limit);

    return { success: true, questions: randomized };
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(`[MULTI_TOPIC_PRACTICE_FETCH_FAULT]: ${message}`);
    return { success: false, error: message, questions: [] };
  }
}