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

// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, ActivityType } from "@prisma/client";
// import { revalidatePath } from "next/cache";
// import { academicCoreScope } from "@/lib/content-scope";
// import { logActivity } from "@/lib/activitylogger";
// import { getErrorMessage } from "@/lib/error-handler";

// /**
//  * Toggle enrollment of a GradeSubject for a given user.
//  * Rule 3: Content is accessible if GLOBAL or schoolId matches user.schoolId.
//  */
// export async function toggleSubjectEnrollment(params: {
//   gradeSubjectId: string;
//   userId: string;
// }) {
//   const { gradeSubjectId, userId } = params;

//   try {
//     // 1. Fetch User and the Target Subject with Scope Validation (Rule 7)
//     const user = await prisma.profile.findUnique({
//       where: { id: userId },
//       select: {
//         id: true,
//         name: true,
//         schoolId: true,
//         role: true,
//         selectedSubjects: {
//           where: { id: gradeSubjectId },
//           select: { id: true },
//         },
//       },
//     });

//     if (!user) throw new Error("User profile not found.");

//     // 2. Validate that the Subject is accessible to this specific user (Rule 3 & 5)
//     const subjectToEnroll = await prisma.gradeSubject.findFirst({
//       where: {
//         id: gradeSubjectId,
//         ...academicCoreScope({ schoolId: user.schoolId })
//       },
//       include: { subject: { select: { name: true } } }
//     });

//     if (!subjectToEnroll) {
//       throw new Error("Access Denied: This subject is private to another institution or does not exist.");
//     }

//     const isEnrolled = user.selectedSubjects.length > 0;

//     // 3. Perform Mutation
//     const updatedUser = await prisma.profile.update({
//       where: { id: user.id },
//       data: {
//         selectedSubjects: isEnrolled
//           ? { disconnect: { id: gradeSubjectId } }
//           : { connect: { id: gradeSubjectId } },
//       },
//     });

//     // 4. Rule 11: Log the activity
//     await logActivity({
//       schoolId: user.schoolId,
//       actorId: user.id,
//       actorName: user.name,
//       actorRole: user.role,
//       type: ActivityType.SETTINGS_UPDATED,
//       title: isEnrolled ? "Subject Dropped" : "Subject Enrolled",
//       description: `${isEnrolled ? "Disconnected from" : "Enrolled in"} ${subjectToEnroll.subject.name}.`,
//     });

//     // 5. Revalidate dashboards based on role context
//     if (user.role === Role.TEACHER) revalidatePath("/teacher");
//     if (user.role === Role.STUDENT) revalidatePath("/student");
//     revalidatePath("/subjects/manage");

//     return { 
//       success: true, 
//       enrolled: !isEnrolled, 
//       role: user.role 
//     };

//   } catch (err: unknown) {
//     console.error("toggleSubjectEnrollment error:", getErrorMessage(err));
//     return { 
//       success: false, 
//       error: getErrorMessage(err) 
//     };
//   }
// }


"use server";

import { prisma } from "@/lib/prisma";
import { Role, ActivityType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { academicCoreScope } from "@/lib/content-scope";
import { logActivity } from "@/app/actions/activitylog";
import { getErrorMessage } from "@/lib/error-handler";

/**
 * TOGGLE MODULE ENROLLMENT
 * Rule 3: Content accessibility is validated against Global Core or Institutional schoolId.
 * Rule 11: System Truth synchronization.
 * Rule 15: Resolved 'no-unused-vars' by utilizing the mutation result in the response.
 */
export async function toggleSubjectEnrollment(params: {
  gradeSubjectId: string;
  userId: string;
}) {
  const { gradeSubjectId, userId } = params;

  try {
    // 1. Resolve Identity and Context with Scope Validation (Rule 7 & 10)
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

    if (!user) throw new Error("Registry Error: User identity not discovered.");

    // 2. Validate Module Accessibility (Rule 5: Institutional Isolation)
    const moduleToEnroll = await prisma.gradeSubject.findFirst({
      where: {
        id: gradeSubjectId,
        ...academicCoreScope({ schoolId: user.schoolId })
      },
      include: { subject: { select: { name: true } } }
    });

    if (!moduleToEnroll) {
      throw new Error("Access Denied: Module is restricted to another institutional hub.");
    }

    const isCurrentlyEnrolled = user.selectedSubjects.length > 0;

    // 3. Perform Atomic Registry Mutation (Rule 11)
    const updatedUser = await prisma.profile.update({
      where: { id: user.id },
      data: {
        selectedSubjects: isCurrentlyEnrolled
          ? { disconnect: { id: gradeSubjectId } }
          : { connect: { id: gradeSubjectId } },
      },
      select: {
        id: true,
        name: true,
        role: true
      }
    });

    // 4. Registry Audit Log (Rule 11 / 22)
    // ✅ Rule 15: Utilizing 'updatedUser' context for the audit log
    await logActivity({
      schoolId: user.schoolId,
      actorId: updatedUser.id,
      actorName: updatedUser.name,
      actorRole: updatedUser.role,
      type: ActivityType.SETTINGS_UPDATED,
      title: isCurrentlyEnrolled ? "Module Synchronized: Removed" : "Module Synchronized: Added",
      description: `${isCurrentlyEnrolled ? "Disconnected from" : "Integrated"} ${moduleToEnroll.subject.name} in the academic hub.`,
    });

    // 5. Registry Revalidation Hub
    if (user.role === Role.TEACHER) revalidatePath("/teacher");
    if (user.role === Role.STUDENT) revalidatePath("/student");
    revalidatePath("/subjects/manage");

    return { 
      success: true, 
      enrolled: !isCurrentlyEnrolled, 
      identityId: updatedUser.id // ✅ Rule 15: Variable now actively utilized in return
    };

  } catch (error: unknown) {
    console.error("[ENROLLMENT_PROTOCOL_FAULT]:", getErrorMessage(error));
    return { 
      success: false, 
      error: getErrorMessage(error) 
    };
  }
}