"use server";

import { prisma } from "@/lib/prisma";

export async function getStudentClassRegistry(studentId: string) {
  try {
    // 1. Get the student's class enrollment
    const enrollment = await prisma.classEnrollment.findFirst({
      where: { studentId: studentId },
      include: {
        class: {
          include: {
            teacher: { select: { name: true } },
            // Get classmates
            enrollments: {
              where: { NOT: { studentId: studentId } }, // Exclude self
              include: { student: { select: { id: true, name: true } } }
            }
          }
        }
      }
    });

    if (!enrollment || !enrollment.class) return null;

    // 2. Get student's registered subjects
    const subjects = await prisma.studentSubject.findMany({
      where: { studentId: studentId, status: 'APPROVED' },
      include: { gradeSubject: { include: { subject: { select: { name: true } } } } }
    });

    return {
      name: enrollment.class.name,
      teacher: enrollment.class.teacher,
      classmates: enrollment.class.enrollments.map(e => ({
        id: e.student.id,
        name: e.student.name || "Unknown Student"
      })),
      mySubjects: subjects.map(s => s.gradeSubject.subject.name)
    };
  } catch (error) {
    console.error("Registry Error:", error);
    return null;
  }
}