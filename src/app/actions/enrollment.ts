"use server";

import { PrismaClient } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { Role } from "@/generated/prisma/enums";
import {prisma} from "@/lib/prisma"

// const prisma = new PrismaClient();


/**
 * Toggle enrollment of a GradeSubject for a given user.
 * - If the user is already enrolled in the GradeSubject, it will be disconnected.
 * - If not enrolled, it will be connected.
 *
 * This is intentionally generic so it can be used by both teachers and students.
 */
export async function toggleSubjectEnrollment(params: {
  gradeSubjectId: string;
  userId: string;
}) {
  const { gradeSubjectId, userId } = params;

  const user = await prisma.profile.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      selectedSubjects: {
        where: { id: gradeSubjectId },
        select: { id: true },
      },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isEnrolled = user.selectedSubjects.length > 0;

  await prisma.profile.update({
    where: { id: user.id },
    data: {
      selectedSubjects: isEnrolled
        ? {
            disconnect: { id: gradeSubjectId },
          }
        : {
            connect: { id: gradeSubjectId },
          },
    },
  });

  // Revalidate relevant dashboards and the manage page.
  // Note: route group names like (dashboard) are not part of the URL.
  revalidatePath("/teacher");
  revalidatePath("/student");
  revalidatePath("/subjects/manage");

  return { enrolled: !isEnrolled, role: user.role as Role };
}

