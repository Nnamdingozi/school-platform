"use server";

import { prisma } from "@/lib/prisma";
import {classifyNigerianSubject} from "@/lib/curriculum/nigeria"

export async function getStudentDashboardData(studentId: string) {
  const profile = await prisma.profile.findUnique({
    where: { id: studentId },
    include: {
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
      school: true,
      studentSubjects: true,
      // ── FIX: Added assessments to the include block ──
      assessments: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: {
          gradeSubject: { 
            include: { subject: true } 
          },
          feedbacks: {
            take: 1,
            orderBy: { createdAt: 'desc' }
          }
        }
      }
    }
  });

  // ── Type Guard ──
  const enrollment = profile?.classEnrollments[0];
  if (!profile || !enrollment || !enrollment.class || !enrollment.class.grade) {
    return null;
  }

  const schoolId = profile.schoolId;
  const classroom = enrollment.class;
  const gradeLevel = classroom.grade.level;
  const isJSS = gradeLevel <= 9;

  // 1. Fetch ALL subjects available for this Grade
  const allGradeSubjects = await prisma.gradeSubject.findMany({
    where: { 
      gradeId: classroom.gradeId, 
      OR: [{ schoolId }, { schoolId: null }] 
    },
    include: { 
        subject: true,
        topics: { include: { term: true }, orderBy: { weekNumber: 'asc' } },
        // Fetch specific student scores for the Subject Grid progress bars
        assessments: { where: { studentId } }
    }
  });

  // 2. Filter logic based on JSS/SSS rules
  const effectiveSubjects = allGradeSubjects.filter(gs => {
    if (isJSS) return true;
    
    
    const { isCompulsory } = classifyNigerianSubject(gs.subject.name, false);
    const isRegistered = profile.studentSubjects.some(ss => ss.gradeSubjectId === gs.id);
    
    return isCompulsory || isRegistered;
  });

  // 3. Fetch upcoming exams
  const upcomingExams = await prisma.exam.findMany({
    where: { 
      classId: classroom.id,
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
    // TypeScript now recognizes this because it's in the 'include' block above
    recentAssessments: profile.assessments || [] 
  };
}