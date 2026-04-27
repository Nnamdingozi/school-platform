"use server";

import { prisma } from "@/lib/prisma";
import { Question, Prisma } from "@prisma/client";

export interface ScannedBankFilter {
  subjectId?: string;
  year?: number;
  examBody?: string;
  schoolId: string | null;
  userId: string;
}

export interface ScannedBankFilter {
  subjectId?: string;
  topicId?: string;   // ✅ Added this to resolve your error
  year?: number;
  examBody?: string;
  schoolId: string | null;
  userId: string;
}

// In the getScannedQuestions action, ensure the where clause uses it:
// where: { topicId: topicId || undefined, ... }

/**
 * Retrieves scanned questions based on user ownership.
 * Rule 5: School users see school scans.
 * Rule 6: Individuals see personal scans.
 */
export async function getScannedQuestions(params: ScannedBankFilter): Promise<Question[]> {
  const { subjectId, year, examBody, schoolId, userId } = params;

  try {
    return await prisma.question.findMany({
      where: {
        category: "SCANNED",
        subjectId: subjectId || undefined,
        year: year || undefined,
        examBody: examBody || undefined,
        OR: [
          // Tier 2: School Scans
          schoolId ? { schoolId: schoolId } : { id: 'NEVER' },
          // Tier 3: Personal Scans
          {
            AND: [
              { creatorId: userId },
              { schoolId: null }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error("Error fetching scanned questions:", error);
    return [];
  }
}