// // src/app/actions/assessment-actions.ts
// "use server"

// import { prisma } from "@/lib/prisma";

// export async function getTeacherAssessmentData(teacherId: string, schoolId: string) {
//   try {
//     // 1. Fetch Subject-Centric Data (All students offering subjects I teach)
//     const subjectView = await prisma.gradeSubject.findMany({
//       where: { teachers: { some: { id: teacherId } } },
//       include: {
//         subject: true,
//         grade: true,
//         studentSubjects: {
//           include: {
//             student: {
//               include: {
//                 assessments: {
//                   where: { schoolId }, // Only scores for this school
//                   orderBy: { createdAt: 'desc' },
//                   include: { topic: { select: { title: true } } }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     // 2. Fetch Class-Centric Data (All students in my assigned classroom)
//     const classView = await prisma.class.findMany({
//       where: { teacherId: teacherId },
//       include: {
//         grade: true,
//         enrollments: {
//           include: {
//             student: {
//               include: {
//                 assessments: {
//                   include: { gradeSubject: { include: { subject: true } } }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     return { subjectView, classView };
//   } catch (error) {
//     console.error("Assessment Data Error:", error);
//     return null;
//   }
// }


// src/app/actions/assessment-actions.ts
// src/app/actions/assessment-actions.ts
// "use server"

// import { prisma } from "@/lib/prisma";

// export async function getTeacherAssessmentData(teacherId: string, schoolId: string) {
//   try {
//     // 1. Fetch Subject-Centric Data 
//     // FIX: Changed from 'teachers' many-to-many to the 'profileId' (Lead Teacher)
//     const subjectView = await prisma.gradeSubject.findMany({
//       where: { 
//         profileId: teacherId, // Matches the teacher who "claimed" the subject
//         schoolId: schoolId 
//       },
//       include: {
//         subject: true,
//         grade: true,
//         studentSubjects: {
//           include: {
//             student: {
//               include: {
//                 assessments: {
//                   where: { 
//                     schoolId: schoolId,
//                     // OPTIONAL: Filter assessments to only show scores for THIS subject
//                     // gradeSubjectId: ... (if you want to restrict the list)
//                   },
//                   orderBy: { createdAt: 'desc' },
//                   include: { 
//                     topic: { select: { title: true } },
//                     gradeSubject: { include: { subject: true } } 
//                   }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     // 2. Fetch Class-Centric Data (Students in your physical classroom)
//     // This remains focused on the Class.teacherId
//     const classView = await prisma.class.findMany({
//       where: { teacherId: teacherId, schoolId: schoolId },
//       include: {
//         grade: true,
//         enrollments: {
//           include: {
//             student: {
//               include: {
//                 assessments: {
//                   where: { schoolId: schoolId },
//                   include: { 
//                     gradeSubject: { include: { subject: true } } 
//                   },
//                   orderBy: { createdAt: 'desc' }
//                 }
//               }
//             }
//           }
//         }
//       }
//     });

//     return { subjectView, classView };
//   } catch (error) {
//     console.error("Assessment Data Error:", error);
//     return null;
//   }
// }




"use server"

import { prisma } from "@/lib/prisma";

export async function getTeacherAssessmentData(teacherId: string, schoolId: string) {
  try {
    // 1. Fetch Subject-Centric Data with School Isolation Logic
    const subjectView = await prisma.gradeSubject.findMany({
      where: { 
        AND: [
          // A: User must be linked to the subject
          {
            OR: [
              { profileId: teacherId },           // Case: Lead Teacher
              { teachers: { some: { id: teacherId } } } // Case: Subject Instructor
            ]
          },
          // B: Subject must be either GLOBAL or specific to THIS school
          {
            OR: [
              { schoolId: null },      // Global subjects (like Biology)
              { schoolId: schoolId }   // Custom subjects (like Coding)
            ]
          }
        ]
      },
      include: {
        subject: { select: { name: true } },
        grade: { select: { displayName: true } },
        studentSubjects: {
          // We only want students who offer this subject WITHIN this specific school
          where: { schoolId: schoolId },
          include: {
            student: {
              include: {
                assessments: {
                  where: { schoolId: schoolId }, // Only scores from this institution
                  orderBy: { createdAt: 'desc' },
                  include: { 
                    topic: { select: { title: true } },
                    gradeSubject: { include: { subject: true } } 
                  }
                }
              }
            }
          }
        }
      }
    });

    // 2. Fetch Class-Centric Data
    // Classrooms are ALWAYS school-specific, so we keep the schoolId check here
    const classView = await prisma.class.findMany({
      where: { 
        teacherId: teacherId,
        schoolId: schoolId 
      },
      include: {
        grade: true,
        enrollments: {
          include: {
            student: {
              include: {
                assessments: {
                  where: { schoolId: schoolId },
                  include: { 
                    gradeSubject: { include: { subject: true } } 
                  },
                  orderBy: { createdAt: 'desc' }
                }
              }
            }
          }
        }
      }
    });

    return { subjectView, classView };
  } catch (error) {
    console.error("Assessment Data Error:", error);
    return null;
  }
}