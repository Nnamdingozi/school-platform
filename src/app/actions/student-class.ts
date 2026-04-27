// "use server";

// import { prisma } from "@/lib/prisma";

// export async function getStudentClassRegistry(studentId: string) {
//   try {
//     // 1. Get the student's class enrollment
//     const enrollment = await prisma.classEnrollment.findFirst({
//       where: { studentId: studentId },
//       include: {
//         class: {
//           include: {
//             teacher: { select: { name: true } },
//             // Get classmates
//             enrollments: {
//               where: { NOT: { studentId: studentId } }, // Exclude self
//               include: { student: { select: { id: true, name: true } } }
//             }
//           }
//         }
//       }
//     });

//     if (!enrollment || !enrollment.class) return null;

//     // 2. Get student's registered subjects
//     const subjects = await prisma.studentSubject.findMany({
//       where: { studentId: studentId, status: 'APPROVED' },
//       include: { gradeSubject: { include: { subject: { select: { name: true } } } } }
//     });

//     return {
//       name: enrollment.class.name,
//       teacher: enrollment.class.teacher,
//       classmates: enrollment.class.enrollments.map(e => ({
//         id: e.student.id,
//         name: e.student.name || "Unknown Student"
//       })),
//       mySubjects: subjects.map(s => s.gradeSubject.subject.name)
//     };
//   } catch (error) {
//     console.error("Registry Error:", error);
//     return null;
//   }
// }


"use server";

import { prisma } from "@/lib/prisma";
import { getErrorMessage } from "@/lib/error-handler";
import { EnrollmentStatus } from "@prisma/client";
import { StudentClassRegistryData } from "@/components/student-dashboard/studentClassView";

/**
 * FETCH CLASS PEER REGISTRY
 * Rule 5: Strictly isolated by schoolId to prevent data leakage.
 * Rule 6: Returns null for Independent Learners (User Layer only).
 */
export async function getStudentClassRegistry(
  studentId: string,
  schoolId: string | null
): Promise<StudentClassRegistryData | null> {
  // Rule 6: Independent learners do not belong to classes or peer registries.
  if (!schoolId) return null;

  try {
    // 1. Resolve active enrollment within the specific school (Rule 5)
    const enrollment = await prisma.classEnrollment.findFirst({
      where: { 
        studentId: studentId,
        schoolId: schoolId 
      },
      include: {
        class: {
          include: {
            teacher: { select: { name: true } },
            // Rule 5: Fetch only classmates in the same institutional room
            enrollments: {
              where: { 
                schoolId: schoolId,
                NOT: { studentId: studentId } // Exclude self from peer list
              },
              include: { 
                student: { 
                    select: { id: true, name: true } 
                } 
              }
            }
          }
        }
      }
    });

    if (!enrollment || !enrollment.class) return null;

    // 2. Fetch student's authorized subject map for this school
    const subjects = await prisma.studentSubject.findMany({
      where: { 
        studentId: studentId, 
        schoolId: schoolId,
        status: EnrollmentStatus.APPROVED 
      },
      include: { 
        gradeSubject: { 
            include: { 
                subject: { select: { name: true } } 
            } 
        } 
      }
    });

    // 3. Rule 11: Return the System Truth for the UI
    return {
      name: enrollment.class.name,
      teacher: enrollment.class.teacher,
      classmates: enrollment.class.enrollments.map(e => ({
        id: e.student.id,
        name: e.student.name ?? "Anonymous Peer"
      })),
      mySubjects: subjects.map(s => s.gradeSubject.subject.name)
    };

  } catch (error: unknown) {
    console.error("[CLASS_REGISTRY_ACTION_ERROR]:", getErrorMessage(error));
    return null;
  }
}