// "use server";


// import { Role } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import {prisma} from "@/lib/prisma"

// // const prisma = new PrismaClient();


// /**
//  * Toggle enrollment of a GradeSubject for a given user.
//  * - If the user is already enrolled in the GradeSubject, it will be disconnected.
//  * - If not enrolled, it will be connected.
//  *
//  * This is intentionally generic so it can be used by both teachers and students.
//  */
// export async function toggleSubjectEnrollment(params: {
//   gradeSubjectId: string;
//   userId: string;
// }) {
//   const { gradeSubjectId, userId } = params;

//   const user = await prisma.profile.findUnique({
//     where: { id: userId },
//     select: {
//       id: true,
//       role: true,
//       selectedSubjects: {
//         where: { id: gradeSubjectId },
//         select: { id: true },
//       },
//     },
//   });

//   if (!user) {
//     throw new Error("User not found");
//   }

//   const isEnrolled = user.selectedSubjects.length > 0;

//   await prisma.profile.update({
//     where: { id: user.id },
//     data: {
//       selectedSubjects: isEnrolled
//         ? {
//             disconnect: { id: gradeSubjectId },
//           }
//         : {
//             connect: { id: gradeSubjectId },
//           },
//     },
//   });

//   // Revalidate relevant dashboards and the manage page.
//   // Note: route group names like (dashboard) are not part of the URL.
//   revalidatePath("/teacher");
//   revalidatePath("/student");
//   revalidatePath("/subjects/manage");

//   return { enrolled: !isEnrolled, role: user.role as Role };
// }

"use server";

import { prisma } from "@/lib/prisma";
import { Role, ActivityType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { academicCoreScope } from "@/lib/content-scope";
import { logActivity } from "@/lib/activitylogger";
import { getErrorMessage } from "@/lib/error-handler";

/**
 * Toggle enrollment of a GradeSubject for a given user.
 * Rule 3: Content is accessible if GLOBAL or schoolId matches user.schoolId.
 */
export async function toggleSubjectEnrollment(params: {
  gradeSubjectId: string;
  userId: string;
}) {
  const { gradeSubjectId, userId } = params;

  try {
    // 1. Fetch User and the Target Subject with Scope Validation (Rule 7)
    const user = await prisma.profile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        schoolId: true,
        role: true,
        selectedSubjects: {
          where: { id: gradeSubjectId },
          select: { id: true },
        },
      },
    });

    if (!user) throw new Error("User profile not found.");

    // 2. Validate that the Subject is accessible to this specific user (Rule 3 & 5)
    const subjectToEnroll = await prisma.gradeSubject.findFirst({
      where: {
        id: gradeSubjectId,
        ...academicCoreScope({ schoolId: user.schoolId })
      },
      include: { subject: { select: { name: true } } }
    });

    if (!subjectToEnroll) {
      throw new Error("Access Denied: This subject is private to another institution or does not exist.");
    }

    const isEnrolled = user.selectedSubjects.length > 0;

    // 3. Perform Mutation
    const updatedUser = await prisma.profile.update({
      where: { id: user.id },
      data: {
        selectedSubjects: isEnrolled
          ? { disconnect: { id: gradeSubjectId } }
          : { connect: { id: gradeSubjectId } },
      },
    });

    // 4. Rule 11: Log the activity
    await logActivity({
      schoolId: user.schoolId,
      actorId: user.id,
      actorName: user.name,
      actorRole: user.role,
      type: ActivityType.SETTINGS_UPDATED,
      title: isEnrolled ? "Subject Dropped" : "Subject Enrolled",
      description: `${isEnrolled ? "Disconnected from" : "Enrolled in"} ${subjectToEnroll.subject.name}.`,
    });

    // 5. Revalidate dashboards based on role context
    if (user.role === Role.TEACHER) revalidatePath("/teacher");
    if (user.role === Role.STUDENT) revalidatePath("/student");
    revalidatePath("/subjects/manage");

    return { 
      success: true, 
      enrolled: !isEnrolled, 
      role: user.role 
    };

  } catch (err: unknown) {
    console.error("toggleSubjectEnrollment error:", getErrorMessage(err));
    return { 
      success: false, 
      error: getErrorMessage(err) 
    };
  }
}