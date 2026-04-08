// src/app/actions/assessment-actions.ts
"use server"

import { prisma } from "@/lib/prisma";

export async function getTeacherAssessmentData(teacherId: string, schoolId: string) {
  try {
    // 1. Fetch Subject-Centric Data (All students offering subjects I teach)
    const subjectView = await prisma.gradeSubject.findMany({
      where: { teachers: { some: { id: teacherId } } },
      include: {
        subject: true,
        grade: true,
        studentSubjects: {
          include: {
            student: {
              include: {
                assessments: {
                  where: { schoolId }, // Only scores for this school
                  orderBy: { createdAt: 'desc' },
                  include: { topic: { select: { title: true } } }
                }
              }
            }
          }
        }
      }
    });

    // 2. Fetch Class-Centric Data (All students in my assigned classroom)
    const classView = await prisma.class.findMany({
      where: { teacherId: teacherId },
      include: {
        grade: true,
        enrollments: {
          include: {
            student: {
              include: {
                assessments: {
                  include: { gradeSubject: { include: { subject: true } } }
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