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

/**
 * FETCH INDIVIDUAL LEARNER SUBJECT LIBRARY
 * Pulls global subjects and grade mappings for a student without a school.
 */



export async function getIndividualLearnerSubjects(userId: string) {
  try {
      // 1. Fetch the user's profile to get their curriculum and grade context
      const profile = await prisma.profile.findUnique({
          where: { id: userId },
          select: { curriculumId: true, gradeId: true }
      });

      if (!profile || !profile.gradeId) {
          return [];
      }

      // 2. Query grade subjects filtered strictly by the user's gradeId with no constraints limiting count
      const gradeSubjects = await prisma.gradeSubject.findMany({
          where: {
              schoolId: null, // Global templates only
              gradeId: profile.gradeId,
          },
          include: {
              subject: { select: { id: true, name: true } },
              grade: { select: { id: true, displayName: true, level: true } }
          },
          orderBy: [
              { grade: { level: 'asc' } },
              { subject: { name: 'asc' } }
          ]
      });

      // 3. Map to match the expected page shape (`SubjectRegistryNode`)
      return gradeSubjects.map(gs => ({
          id: gs.id,
          name: gs.subject.name,
          code: null,
          isGlobal: true,
          isOwned: false,
          profileId: null,
          subject: {
              id: gs.subject.id,
              name: gs.subject.name,
              isGlobal: true
          },
          grade: {
              id: gs.grade.id,
              displayName: gs.grade.displayName
          },
          profile: null
      }));

  } catch (err: unknown) {
      console.error("Fetch Individual Registry Error:", getErrorMessage(err));
      return [];
  }
}


// export async function toggleLearnerSubjectLibrary({ gradeSubjectId, userId, action }: { gradeSubjectId: string; userId: string; action: 'claim' | 'release' }) {
//   try {
//     if (action === 'claim') {
//       // Upsert or create entry in StudentSubject for the individual learner (schoolId is null)
//       await prisma.studentSubject.upsert({
//         where: {
//           schoolId_studentId_gradeSubjectId: {
//             schoolId: null as any, // Prisma handles null unique fields conditionally depending on setup, or use create/delete directly
//             studentId: userId,
//             gradeSubjectId: gradeSubjectId,
//           }
//         },
//         update: { status: 'APPROVED' },
//         create: {
//           studentId: userId,
//           gradeSubjectId: gradeSubjectId,
//           schoolId: null,
//           status: 'APPROVED',
//           isCompulsory: false
//         }
//       });
//     } else {
//       // Remove from StudentSubject library
//       await prisma.studentSubject.deleteMany({
//         where: {
//           studentId: userId,
//           gradeSubjectId: gradeSubjectId,
//           schoolId: null
//         }
//       });
//     }

//     revalidatePath("/subjects/manage");
//     revalidatePath("/student/subjects");
//     return { success: true };
//   } catch (error: any) {
//     return { success: false, error: error.message };
//   }
// }



export async function toggleLearnerSubjectLibrary({ gradeSubjectId, userId, action }: { gradeSubjectId: string; userId: string; action: 'claim' | 'release' }) {
  try {
    if (action === 'claim') {
      // Check if it already exists for this individual learner
      const existing = await prisma.studentSubject.findFirst({
        where: {
          studentId: userId,
          gradeSubjectId: gradeSubjectId,
          schoolId: null,
        }
      });

      if (!existing) {
        await prisma.studentSubject.create({
          data: {
            studentId: userId,
            gradeSubjectId: gradeSubjectId,
            schoolId: null,
            status: 'APPROVED',
            isCompulsory: false
          }
        });
      }
    } else {
      // Remove from library
      await prisma.studentSubject.deleteMany({
        where: {
          studentId: userId,
          gradeSubjectId: gradeSubjectId,
          schoolId: null
        }
      });
    }

    revalidatePath("/subjects/manage");
    revalidatePath("/student/subject");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
  
export async function getAllGlobalSubjects(gradeId?: string | null) {
  try {
    const subjects = await prisma.gradeSubject.findMany({
      where: {
        schoolId: null, // Always fetch global modules
        // Only apply grade filtering if a valid gradeId is present on the learner profile
        ...(gradeId ? { gradeId } : {}),
      },
      include: {
        subject: { select: { name: true } },
        grade: { select: { displayName: true, id: true } },
      },
      orderBy: {
        grade: { displayOrder: 'asc' }
      }
    });

    return subjects;
  } catch (error) {
    console.error("Failed to fetch global subjects:", error);
    return [];
  }
}