// "use server";

// import { prisma } from "@/lib/prisma";
// import {classifyNigerianSubject} from "@/lib/curriculum/nigeria"

// export async function getStudentDashboardData(studentId: string) {
//   const profile = await prisma.profile.findUnique({
//     where: { id: studentId },
//     include: {
//       classEnrollments: { 
//         include: { 
//           class: { 
//             include: { 
//               grade: true,
//               teacher: { select: { name: true, email: true } } 
//             } 
//           } 
//         } 
//       },
//       school: true,
//       studentSubjects: true,
//       // ── FIX: Added assessments to the include block ──
//       assessments: {
//         take: 10,
//         orderBy: { createdAt: 'desc' },
//         include: {
//           gradeSubject: { 
//             include: { subject: true } 
//           },
//           feedbacks: {
//             take: 1,
//             orderBy: { createdAt: 'desc' }
//           }
//         }
//       }
//     }
//   });

//   // ── Type Guard ──
//   const enrollment = profile?.classEnrollments[0];
//   if (!profile || !enrollment || !enrollment.class || !enrollment.class.grade) {
//     return null;
//   }

//   const schoolId = profile.schoolId;
//   const classroom = enrollment.class;
//   const gradeLevel = classroom.grade.level;
//   const isJSS = gradeLevel <= 9;

//   // 1. Fetch ALL subjects available for this Grade
//   const allGradeSubjects = await prisma.gradeSubject.findMany({
//     where: { 
//       gradeId: classroom.gradeId, 
//       OR: [{ schoolId }, { schoolId: null }] 
//     },
//     include: { 
//         subject: true,
//         topics: { include: { term: true }, orderBy: { weekNumber: 'asc' } },
//         // Fetch specific student scores for the Subject Grid progress bars
//         assessments: { where: { studentId } }
//     }
//   });

//   // 2. Filter logic based on JSS/SSS rules
//   const effectiveSubjects = allGradeSubjects.filter(gs => {
//     if (isJSS) return true;
    
    
//     const { isCompulsory } = classifyNigerianSubject(gs.subject.name, false);
//     const isRegistered = profile.studentSubjects.some(ss => ss.gradeSubjectId === gs.id);
    
//     return isCompulsory || isRegistered;
//   });

//   // 3. Fetch upcoming exams
//   const upcomingExams = await prisma.exam.findMany({
//     where: { 
//       classId: classroom.id,
//       status: 'PUBLISHED'
//     },
//     take: 3,
//     orderBy: { createdAt: 'desc' }
//   });

//   return {
//     student: profile,
//     school: profile.school,
//     classroom: classroom,
//     subjects: effectiveSubjects,
//     upcomingExams,
//     // TypeScript now recognizes this because it's in the 'include' block above
//     recentAssessments: profile.assessments || [] 
//   };
// }


"use server";

import { prisma } from "@/lib/prisma";
import { Role, Prisma } from "@prisma/client";
import { classifyNigerianSubject } from "@/lib/curriculum/nigeria";
import { contentScope, academicCoreScope } from "@/lib/content-scope";

/**
 * FETCH STUDENT DASHBOARD DATA
 * Rule 5: Scopes institutional data for school students.
 * Rule 6: Provides global core progress for independent learners.
 */
export async function getStudentDashboardData(studentId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: studentId },
    include: {
      school: true,
      curriculum: true,
      classEnrollments: { 
        include: { 
          class: { 
            include: { 
              grade: true,
              teacher: { select: { name: true, email: true } } 
            } 
          } 
        } 
      },
      studentSubjects: {
        include: {
          gradeSubject: {
            include: {
              subject: true,
              topics: { include: { term: true }, orderBy: { weekNumber: 'asc' } },
              assessments: { where: { studentId } }
            }
          }
        }
      },
      assessments: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          gradeSubject: { include: { subject: true } },
          feedbacks: { take: 1, orderBy: { createdAt: 'desc' } }
        }
      }
    }
  });

  if (!profile) return null;

  const schoolId = profile.schoolId;
  const enrollment = profile.classEnrollments[0];
  const isIndependent = !schoolId || profile.role === Role.INDIVIDUAL_LEARNER;

  // ── Scenario A: School Registered Student (Tier 2) ──
  if (!isIndependent && enrollment?.class) {
    const classroom = enrollment.class;
    const gradeLevel = classroom.grade.level;
    const isJSS = gradeLevel <= 9;

    // 1. Fetch Grade-specific subjects (Tier 1 + Tier 2)
    const allGradeSubjects = await prisma.gradeSubject.findMany({
      where: { 
        gradeId: classroom.gradeId, 
        ...academicCoreScope({ schoolId })
      },
      include: { 
          subject: true,
          topics: { 
              where: contentScope({ schoolId }),
              include: { term: true }, 
              orderBy: { weekNumber: 'asc' } 
          },
          assessments: { where: { studentId } }
      }
    });

    // 2. Apply Nigerian filtering logic for institutional curriculum
    const effectiveSubjects = allGradeSubjects.filter(gs => {
      if (isJSS) return true;
      const { isCompulsory } = classifyNigerianSubject(gs.subject.name, false);
      const isRegistered = profile.studentSubjects.some(ss => ss.gradeSubjectId === gs.id);
      return isCompulsory || isRegistered;
    });

    // 3. Fetch institutional exams
    const upcomingExams = await prisma.exam.findMany({
      where: { 
        classId: classroom.id,
        schoolId: schoolId!,
        status: 'PUBLISHED'
      },
      take: 3,
      orderBy: { createdAt: 'desc' }
    });

    return {
      student: profile,
      school: profile.school,
      classroom: classroom,
      subjects: effectiveSubjects,
      upcomingExams,
      recentAssessments: profile.assessments,
      isIndependent: false
    };
  }

  // ── Scenario B: Independent Learner (Tier 3) ──
  // Rule 6: Learner manages their own syllabus from Global Core
  
  // 1. Map subjects directly from the student's personal selections
  const personalSubjects = profile.studentSubjects.map(ss => ({
      ...ss.gradeSubject,
      // Ensure topics are filtered to Tier-1 only
      topics: ss.gradeSubject.topics.filter(t => t.schoolId === null || t.isGlobal)
  }));

  return {
    student: profile,
    school: null,
    classroom: null,
    subjects: personalSubjects,
    upcomingExams: [], // Independent learners take self-paced practice instead
    recentAssessments: profile.assessments,
    isIndependent: true
  };
}