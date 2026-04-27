"use server";

import { prisma } from "@/lib/prisma";
import { academicCoreScope } from "@/lib/content-scope";

/**
 * Fetches questions from a specific exam year and subject.
 * Example: "Maths questions from WAEC 2000"
 */
export async function getQuestionsByYear(params: {
  subjectId: string;
  year: number;
  schoolId: string | null;
}) {
  const { subjectId, year, schoolId } = params;

  try {
    return await prisma.question.findMany({
      where: {
        subjectId,
        year,
        // Rule 7: Must belong to user's school, be personal, or be global
        OR: [
          { schoolId: schoolId },
          { isGlobal: true },
          { AND: [{ schoolId: null }, { isGlobal: false }] } // Personal scans
        ]
      },
      include: {
        topic: { select: { title: true } } // Show which topic each question covers
      },
      orderBy: { topicId: 'asc' }
    });
  } catch (error) {
    return [];
  }
}