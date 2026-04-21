// "use server";

// import { prisma } from "@/lib/prisma";
// import { transformParentLesson } from "@/lib/lessons/transformParentsView";

// export async function getParentLesson(topicId: string, studentId: string) {
//   const lesson = await prisma.lesson.findFirst({
//     where: { topicId },
//   });

//   const performance = await prisma.assessment.findMany({
//     where: { studentId, topicId },
//   });

//   return transformParentLesson(
//     lesson?.aiContent as any,
//     performance
//   );
// }

// "use server";
// import { transformParentLesson } from "@/lib/lessons/transformParentsView";
// import { prisma } from "@/lib/prisma";

// // ── Types ───────────────────────────────────────────────────────────────────

// /**
//  * Interface representing the structured JSON stored in aiContent.
//  * This matches the schema used during AI generation.
//  */
// interface LessonAiContent {
//   metadata: {
//     topicContext: string;
//     difficultyLevel: string;
//   };
//   teacherLogic: {
//     teachingMethod: string;
//     timeAllocation: string;
//     pedagogicalTips: string;
//     introductionHook: string;
//   };
//   studentContent: {
//     title: string;
//     learningObjectives: string[];
//     explanation: string;
//     summary: string;
//     vocabulary: string[];
//     quiz: Array<{
//       question: string;
//       options: string[];
//       answer: string;
//       explanation: string;
//     }>;
//   };
// }

// // ── Main Action ─────────────────────────────────────────────────────────────

// export async function getParentLesson(topicId: string, studentId: string) {
//   // Fetch the lesson note
//   const lesson = await prisma.lesson.findFirst({
//     where: { topicId },
//   });

//   // Fetch the specific student's performance records for this topic
//   const performance = await prisma.assessment.findMany({
//     where: { 
//       studentId, 
//       topicId 
//     },
//     include: {
//       gradeSubject: {
//         include: { subject: true }
//       }
//     }
//   });

//   /**
//    * FIX: Replaced 'as any' with a type assertion to our interface.
//    * Prisma.JsonValue must be cast to the expected shape before transformation.
//    */
//   const aiContent = lesson?.aiContent as unknown as LessonAiContent | null;

//   // If no lesson or content exists, handle it gracefully
//   if (!aiContent) {
//     return null;
//   }

//   return transformParentLesson(
//     aiContent,
//     performance
//   );
// }


"use server";

import { prisma } from "@/lib/prisma";
import { getErrorMessage } from "@/lib/error-handler";
import { transformParentLesson } from "@/lib/lessons/transformParentsView";
import { Assessment, Subject, GradeSubject, Prisma } from "@prisma/client";
import { type LessonAiContent } from "./ai-generator";

// ── Types ───────────────────────────────────────────────────────────────────

/**
 * Strictly defines the Prisma include tree for Parent Assessment View.
 */
export type ParentViewPerformance = (Assessment & {
  gradeSubject: GradeSubject & {
    subject: Subject;
  };
})[];

// ── Main Action ─────────────────────────────────────────────────────────────

export async function getParentLesson(topicId: string, studentId: string) {
  try {
    // 1. Resolve student's institutional context
    const student = await prisma.profile.findUnique({
      where: { id: studentId },
      select: { schoolId: true }
    });

    if (!student || !student.schoolId) {
      throw new Error("Student institutional context missing.");
    }

    const currentSchoolId: string = student.schoolId;

    // 2. Fetch Lesson content (Tiered Lookup)
    
    // Priority 1: Check for an instantiated SchoolLesson (Teacher's customized version)
    const schoolLesson = await prisma.schoolLesson.findUnique({
      where: { 
        topicId_schoolId: { 
          topicId, 
          schoolId: currentSchoolId 
        } 
      },
    });

    let rawJson: Prisma.JsonValue | null = schoolLesson?.customContent ?? null;

    // Priority 2: Check for a School-Specific GlobalLesson blueprint
    if (!rawJson) {
      const schoolBlueprint = await prisma.globalLesson.findUnique({
        where: { 
          topicId_schoolId: { 
            topicId, 
            schoolId: currentSchoolId 
          } 
        }
      });
      rawJson = schoolBlueprint?.aiContent ?? null;
    }

    // Priority 3: Fallback to the platform-wide Global version (schoolId is null)
    if (!rawJson) {
      /**
       * RESOLUTION: We use findFirst here instead of findUnique.
       * findUnique compound keys often reject 'null' in TypeScript, 
       * even if the schema allows it. findFirst satisfies the compiler.
       */
      const systemGlobal = await prisma.globalLesson.findFirst({
        where: { 
          topicId: topicId,
          schoolId: null 
        }
      });
      rawJson = systemGlobal?.aiContent ?? null;
    }

    if (!rawJson) return null;

    // 3. Fetch specific student performance history
    const assessments = await prisma.assessment.findMany({
      where: { 
        studentId, 
        topicId 
      },
      include: {
        gradeSubject: {
          include: { subject: true }
        }
      }
    }) as ParentViewPerformance;

    // 4. Safe cast and Transform
    const aiContent = rawJson as unknown as LessonAiContent;

    return transformParentLesson(
      aiContent,
      assessments
    );

  } catch (error) {
    const message = getErrorMessage(error);
    console.error("[GET_PARENT_LESSON_ERROR]:", message);
    return null;
  }
}