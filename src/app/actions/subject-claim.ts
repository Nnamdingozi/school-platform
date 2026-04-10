"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/error-handler";

/**
 * Fetches ALL subjects for the school's curriculum
 */
export async function getAllSubjectsWithOwnership(schoolId: string) {
  try {
    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { curriculumId: true }
    });

    return await prisma.gradeSubject.findMany({
      where: {
        OR: [
          { schoolId: schoolId },
          { grade: { curriculumId: school?.curriculumId } }
        ]
      },
      include: {
        subject: { select: { name: true } },
        grade: { select: { displayName: true } },
        profile: { select: { id: true, name: true } } // Include the owner's info
      },
      orderBy: [
        { grade: { level: 'asc' } },
        { subject: { name: 'asc' } }
      ]
    });
  } catch (err) {
    console.error(err);
    return [];
  }
}

export async function claimSubjectAction(gradeSubjectId: string, teacherId: string) {
  try {
    await prisma.gradeSubject.update({
      where: { id: gradeSubjectId },
      data: { profileId: teacherId }
    });
    revalidatePath("/teacher/dashboard");
    revalidatePath("/teacher/subjects/manage");
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}

export async function releaseSubjectAction(gradeSubjectId: string) {
  try {
    await prisma.gradeSubject.update({
      where: { id: gradeSubjectId },
      data: { profileId: null } // Back to the pool
    });
    revalidatePath("/teacher/dashboard");
    revalidatePath("/teacher/subjects/manage");
    return { success: true };
  } catch (err) {
    return { success: false, error: getErrorMessage(err) };
  }
}