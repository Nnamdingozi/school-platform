// "use server";

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { getErrorMessage } from "@/lib/error-handler";

// /**
//  * Fetches ALL subjects for the school's curriculum
//  */
// export async function getAllSubjectsWithOwnership(schoolId: string) {
//   try {
//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { curriculumId: true }
//     });

//     return await prisma.gradeSubject.findMany({
//       where: {
//         OR: [
//           { schoolId: schoolId },
//           { grade: { curriculumId: school?.curriculumId } }
//         ]
//       },
//       include: {
//         subject: { select: { name: true } },
//         grade: { select: { displayName: true } },
//         profile: { select: { id: true, name: true } } // Include the owner's info
//       },
//       orderBy: [
//         { grade: { level: 'asc' } },
//         { subject: { name: 'asc' } }
//       ]
//     });
//   } catch (err) {
//     console.error(err);
//     return [];
//   }
// }

// export async function claimSubjectAction(gradeSubjectId: string, teacherId: string) {
//   try {
//     await prisma.gradeSubject.update({
//       where: { id: gradeSubjectId },
//       data: { profileId: teacherId }
//     });
//     revalidatePath("/teacher/dashboard");
//     revalidatePath("/teacher/subjects/manage");
//     return { success: true };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }

// export async function releaseSubjectAction(gradeSubjectId: string) {
//   try {
//     await prisma.gradeSubject.update({
//       where: { id: gradeSubjectId },
//       data: { profileId: null } // Back to the pool
//     });
//     revalidatePath("/teacher/dashboard");
//     revalidatePath("/teacher/subjects/manage");
//     return { success: true };
//   } catch (err) {
//     return { success: false, error: getErrorMessage(err) };
//   }
// }




"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getErrorMessage } from "@/lib/error-handler";
import { Role, ActivityType } from "@prisma/client";
import { academicCoreScope } from "@/lib/content-scope";
import { logActivity } from "@/lib/activitylogger";

/**
 * FETCH SUBJECT REGISTRY
 * Rule 7: Mandatory Query Resolution (Global + School)
 */
export async function getAllSubjectsWithOwnership(schoolId: string | null) {
  try {
    const school = schoolId 
      ? await prisma.school.findUnique({
          where: { id: schoolId },
          select: { curriculumId: true }
        })
      : null;

    return await prisma.gradeSubject.findMany({
      where: academicCoreScope({ 
        schoolId, 
        curriculumId: school?.curriculumId ?? undefined 
      }),
      include: {
        subject: { select: { name: true } },
        grade: { select: { displayName: true, level: true } },
        profile: { select: { id: true, name: true } } // The Lead Teacher
      },
      orderBy: [
        { grade: { level: 'asc' } },
        { subject: { name: 'asc' } }
      ]
    });
  } catch (err: unknown) {
    console.error("Fetch Registry Error:", getErrorMessage(err));
    return [];
  }
}

/**
 * CLAIM LEAD TEACHER STATUS
 * Rule 5: Strict school isolation.
 * Rule 11: Transactional activity logging.
 */
export async function claimSubjectAction(params: {
    gradeSubjectId: string;
    userId: string;
    userName: string | null;
    userRole: Role;
    schoolId: string | null;
}) {
  const { gradeSubjectId, userId, userName, userRole, schoolId } = params;

  try {
    // 1. Security Check (Rule 10)
    const targetSubject = await prisma.gradeSubject.findFirst({
        where: {
            id: gradeSubjectId,
            ...academicCoreScope({ schoolId })
        },
        include: { subject: { select: { name: true } } }
    });

    if (!targetSubject) {
        throw new Error("Access Denied: Subject not found in your institutional scope.");
    }

    if (targetSubject.profileId && targetSubject.profileId !== userId && userRole !== Role.SCHOOL_ADMIN) {
        throw new Error("Conflict: This subject is already claimed by another instructor.");
    }

    // 2. Perform Update
    await prisma.gradeSubject.update({
      where: { id: gradeSubjectId },
      data: { profileId: userId }
    });

    // 3. Rule 11: Log System Truth
    await logActivity({
        schoolId,
        actorId: userId,
        actorName: userName,
        actorRole: userRole,
        type: ActivityType.TEACHER_ASSIGNED,
        title: "Subject Claimed",
        description: `Registered as Lead Teacher for ${targetSubject.subject.name}.`
    });

    revalidatePath("/teacher/dashboard");
    revalidatePath("/teacher/subjects/manage");
    
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}

/**
 * RELEASE SUBJECT LEADERSHIP
 * Rule 10: Ensures only the owner or an admin can release.
 */
export async function releaseSubjectAction(params: {
    gradeSubjectId: string;
    userId: string;
    userRole: Role;
    schoolId: string | null;
}) {
  const { gradeSubjectId, userId, userRole, schoolId } = params;

  try {
    const subject = await prisma.gradeSubject.findUnique({
        where: { id: gradeSubjectId },
        select: { profileId: true, subject: { select: { name: true } } }
    });

    if (!subject) throw new Error("Subject record not found.");

    // Authorization: Must be the owner or a school admin
    if (subject.profileId !== userId && userRole !== Role.SCHOOL_ADMIN) {
        throw new Error("Unauthorized: You do not have permission to release this subject.");
    }

    await prisma.gradeSubject.update({
      where: { id: gradeSubjectId },
      data: { profileId: null } 
    });

    await logActivity({
        schoolId,
        actorId: userId,
        actorRole: userRole,
        type: ActivityType.TEACHER_ASSIGNED,
        title: "Subject Released",
        description: `Resigned leadership from ${subject.subject.name}.`
    });

    revalidatePath("/teacher/dashboard");
    revalidatePath("/teacher/subjects/manage");
    
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: getErrorMessage(err) };
  }
}