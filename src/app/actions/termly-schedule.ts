// "use server";

// import { prisma } from "@/lib/prisma";
// import { differenceInWeeks, startOfToday } from "date-fns";

// export async function getTermlySchedule(teacherId: string, requestedTermId?: string) {
//   try {
//     // 1. Find what the teacher is actually assigned to
//     const assignment = await prisma.gradeSubject.findFirst({
//       where: { teachers: { some: { id: teacherId } } },
//       include: { 
//         subject: true,
//         grade: { 
//           include: { 
//             terms: { orderBy: { index: 'asc' } } 
//           } 
//         } 
//       }
//     });

//     if (!assignment || assignment.grade.terms.length === 0) return null;

//     // 2. Resolve which Term to show (Requested OR the first one in the grade)
//     const targetTermId = requestedTermId && requestedTermId !== "active-term-id" 
//       ? requestedTermId 
//       : assignment.grade.terms[0].id;

//     // 3. Fetch the Term details and all associated Topics
//     const [term, topics] = await Promise.all([
//       prisma.term.findUnique({ where: { id: targetTermId } }),
//       prisma.topic.findMany({
//         where: { 
//             gradeSubjectId: assignment.id, 
//             termId: targetTermId 
//         },
//         orderBy: { weekNumber: "asc" },
//         include: {
//           lessons: { select: { id: true } },
//           assessments: { select: { score: true, maxScore: true } },
//         },
//       }),
//     ]);

//     if (!term) return null;

//     // 4. Calculate Current Week based on Term Start Date
//     const today = startOfToday();
//     const termStart = term.startDate ? new Date(term.startDate) : today;
//     const currentWeek = Math.max(1, differenceInWeeks(today, termStart) + 1);

//     // 5. Process Topics (Status & Gap Analysis)
//     const processedSchedule = topics.map((topic) => {
//       const totalScore = topic.assessments.reduce((acc, a) => acc + (a.score || 0), 0);
//       const totalMax = topic.assessments.reduce((acc, a) => acc + (a.maxScore || 100), 0);
//       const averagePercent = topic.assessments.length > 0 ? (totalScore / totalMax) * 100 : null;

//       let status: "completed" | "current" | "pending" = "pending";
//       if (topic.weekNumber! < currentWeek) status = "completed";
//       else if (topic.weekNumber === currentWeek) status = "current";

//       return {
//         id: topic.id,
//         title: topic.title,
//         weekNumber: topic.weekNumber,
//         status,
//         hasLesson: topic.lessons.length > 0,
//         needsReview: averagePercent !== null && averagePercent < 50,
//         averagePercent: averagePercent?.toFixed(0),
//       };
//     });

//     // 6. Final Data Return
//     return {
//       term,
//       currentWeek,
//       schedule: processedSchedule, // Might be empty []
//       progressPercent: topics.length > 0 
//         ? Math.round((processedSchedule.filter(t => t.status === "completed").length / topics.length) * 100) 
//         : 0,
//       subjectName: assignment.subject.name,
//       gradeName: assignment.grade.displayName
//     };
//   } catch (error) {
//     console.error("Schedule Fetch Error:", error);
//     return null;
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { differenceInWeeks, startOfToday, isAfter } from "date-fns";

// export async function getTermlySchedule(teacherId: string, requestedTermId?: string) {
//   try {
//     const assignment = await prisma.gradeSubject.findFirst({
//       where: { teachers: { some: { id: teacherId } } },
//       include: { 
//         subject: true,
//         grade: { include: { terms: { orderBy: { index: 'asc' } } } } 
//       }
//     });

//     if (!assignment || assignment.grade.terms.length === 0) return null;

//     const targetTermId = requestedTermId && requestedTermId !== "active-term-id" 
//       ? requestedTermId 
//       : assignment.grade.terms[0].id;

//     const [term, topics] = await Promise.all([
//       prisma.term.findUnique({ where: { id: targetTermId } }),
//       prisma.topic.findMany({
//         where: { gradeSubjectId: assignment.id, termId: targetTermId },
//         orderBy: { weekNumber: "asc" },
//         include: {
//           lessons: { select: { id: true } },
//           assessments: { select: { score: true, maxScore: true } },
//         },
//       }),
//     ]);

//     if (!term) return null;

//     const today = startOfToday();
//     const termEnd = term.endDate ? new Date(term.endDate) : null;
    
//     // ── LOGIC: Check if Term is Concluded ──
//     const isConcluded = termEnd ? isAfter(today, termEnd) : false;

//     // Calculate current week (If concluded, we set it to a number higher than any week)
//     const termStart = term.startDate ? new Date(term.startDate) : today;
//     const currentWeek = isConcluded ? 99 : Math.max(1, differenceInWeeks(today, termStart) + 1);

//     const processedSchedule = topics.map((topic) => {
//       const totalScore = topic.assessments.reduce((acc, a) => acc + (a.score || 0), 0);
//       const totalMax = topic.assessments.reduce((acc, a) => acc + (a.maxScore || 100), 0);
//       const averagePercent = topic.assessments.length > 0 ? (totalScore / totalMax) * 100 : null;

//       // If concluded, every topic status is "completed"
//       let status: "completed" | "current" | "pending" = isConcluded ? "completed" : "pending";
      
//       if (!isConcluded) {
//         if (topic.weekNumber! < currentWeek) status = "completed";
//         else if (topic.weekNumber === currentWeek) status = "current";
//       }

//       return {
//         id: topic.id,
//         title: topic.title,
//         weekNumber: topic.weekNumber,
//         status,
//         hasLesson: topic.lessons.length > 0,
//         needsReview: averagePercent !== null && averagePercent < 50,
//         averagePercent: averagePercent?.toFixed(0),
//       };
//     });

//     return {
//       term,
//       isConcluded, // Pass this to UI
//       currentWeek: isConcluded ? "Term Ended" : currentWeek,
//       schedule: processedSchedule,
//       progressPercent: isConcluded ? 100 : (topics.length > 0 
//         ? Math.round((processedSchedule.filter(t => t.status === "completed").length / topics.length) * 100) 
//         : 0),
//       subjectName: assignment.subject.name,
//       gradeName: assignment.grade.displayName
//     };
//   } catch (error) {
//     console.error("Schedule Fetch Error:", error);
//     return null;
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { differenceInWeeks, startOfToday, isAfter } from "date-fns";

// export async function getGlobalTermSchedule(
//   schoolId: string, 
//   termIndex: number = 1, 
//   gradeSubjectId?: string // Optional: if provided, we show topics
// ) {
//   try {
//     // 1. Get the School's Curriculum
//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { curriculumId: true }
//     });

//     if (!school) return null;

//     // 2. Find the GLOBAL dates for this term index
//     // We look for any term with this index within the school's curriculum
//     const term = await prisma.term.findFirst({
//       where: { 
//         index: termIndex,
//         grade: { curriculumId: school.curriculumId }
//       },
//       include: {
//         grade: { select: { displayName: true } }
//       }
//     });

//     if (!term) return null;

//     // 3. Process Dates & Conclusion Status
//     const today = startOfToday();
//     const startDate = term.startDate ? new Date(term.startDate) : today;
//     const endDate = term.endDate ? new Date(term.endDate) : today;
//     const isConcluded = isAfter(today, endDate);

//     // 4. Calculate Current Week
//     const currentWeekNum = isConcluded 
//       ? "Concluded" 
//       : Math.max(1, differenceInWeeks(today, startDate) + 1);

//     // 5. Fetch Topics ONLY if a specific GradeSubject is provided
//     let processedSchedule: any[] = [];
//     let subjectName = "General Roadmap";

//     if (gradeSubjectId) {
//       const topics = await prisma.topic.findMany({
//         where: { gradeSubjectId, termId: term.id },
//         orderBy: { weekNumber: "asc" },
//         include: {
//           lessons: { select: { id: true } },
//           assessments: { select: { score: true, maxScore: true } }
//         }
//       });

//       const gs = await prisma.gradeSubject.findUnique({
//         where: { id: gradeSubjectId },
//         include: { subject: true }
//       });
//       subjectName = gs?.subject.name || "Subject";

//       processedSchedule = topics.map((t) => {
//         const total = t.assessments.reduce((acc, a) => acc + (a.score || 0), 0);
//         const max = t.assessments.reduce((acc, a) => acc + (a.maxScore || 100), 0);
//         const avg = t.assessments.length > 0 ? (total / max) * 100 : null;

//         return {
//           id: t.id,
//           title: t.title,
//           weekNumber: t.weekNumber,
//           status: isConcluded ? "completed" : (t.weekNumber! < (currentWeekNum as number) ? "completed" : t.weekNumber === currentWeekNum ? "current" : "pending"),
//           hasLesson: t.lessons.length > 0,
//           averagePercent: avg?.toFixed(0) || null,
//         };
//       });
//     }

//     return {
//       term: {
//         displayName: term.displayName,
//         startDate: startDate.toISOString(),
//         endDate: endDate.toISOString(),
//       },
//       isConcluded,
//       currentWeek: currentWeekNum,
//       schedule: processedSchedule,
//       progressPercent: isConcluded ? 100 : 0, // Simplified progress
//       subjectName,
//       gradeName: term.grade.displayName
//     };
//   } catch (error) {
//     console.error("Global Term Error:", error);
//     return null;
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { differenceInWeeks, startOfToday, isAfter } from "date-fns";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface ProcessedTopic {
//   id: string;
//   title: string;
//   weekNumber: number | null;
//   status: "completed" | "current" | "pending";
//   hasLesson: boolean;
//   averagePercent: string | null;
// }

// interface TermScheduleResponse {
//   term: {
//     displayName: string;
//     startDate: string;
//     endDate: string;
//   };
//   isConcluded: boolean;
//   currentWeek: number | string;
//   schedule: ProcessedTopic[];
//   progressPercent: number;
//   subjectName: string;
//   gradeName: string;
// }

// // ── Main Action ─────────────────────────────────────────────────────────────

// /**
//  * Retrieves the global academic roadmap for a specific term and school,
//  * optionally including topics for a specific subject assignment.
//  */
// export async function getGlobalTermSchedule(
//   schoolId: string, 
//   termIndex: number = 1, 
//   gradeSubjectId?: string 
// ): Promise<TermScheduleResponse | null> {
//   try {
//     // 1. Resolve school curriculum context
//     const school = await prisma.school.findUnique({
//       where: { id: schoolId },
//       select: { curriculumId: true }
//     });

//     if (!school) return null;

//     // 2. Fetch global dates for this term index across the curriculum
//     const term = await prisma.term.findFirst({
//       where: { 
//         index: termIndex,
//         grade: { curriculumId: school.curriculumId }
//       },
//       include: {
//         grade: { select: { displayName: true } }
//       }
//     });

//     if (!term) return null;

//     // 3. Status computation
//     const today = startOfToday();
//     const startDate = term.startDate ? new Date(term.startDate) : today;
//     const endDate = term.endDate ? new Date(term.endDate) : today;
//     const isConcluded = isAfter(today, endDate);

//     // 4. Calculate current week progress
//     const currentWeekNum: number | "Concluded" = isConcluded 
//       ? "Concluded" 
//       : Math.max(1, differenceInWeeks(today, startDate) + 1);

//     // 5. Fetch and map topics (Authorized syllabus logic)
//     // FIX: Replaced 'any[]' with the ProcessedTopic interface
//     let processedSchedule: ProcessedTopic[] = [];
//     let subjectName = "General Roadmap";

//     if (gradeSubjectId) {
//       const topics = await prisma.topic.findMany({
//         where: { gradeSubjectId, termId: term.id },
//         orderBy: { weekNumber: "asc" },
//         include: {
//           GlobalLesson: { select: { id: true } }, // Using GlobalLesson relation from schema
//           assessments: { select: { score: true, maxScore: true } }
//         }
//       });

//       const gs = await prisma.gradeSubject.findUnique({
//         where: { id: gradeSubjectId },
//         include: { subject: true }
//       });
//       subjectName = gs?.subject.name || "Subject";

//       processedSchedule = topics.map((t) => {
//         const total = t.assessments.reduce((acc, a) => acc + (a.score || 0), 0);
//         const max = t.assessments.reduce((acc, a) => acc + (a.maxScore || 100), 0);
//         const avg = t.assessments.length > 0 ? (total / max) * 100 : null;

//         // Status determination logic
//         let topicStatus: "completed" | "current" | "pending" = "pending";
//         if (isConcluded) {
//             topicStatus = "completed";
//         } else if (typeof currentWeekNum === 'number') {
//             if ((t.weekNumber || 0) < currentWeekNum) topicStatus = "completed";
//             else if (t.weekNumber === currentWeekNum) topicStatus = "current";
//         }

//         return {
//           id: t.id,
//           title: t.title,
//           weekNumber: t.weekNumber,
//           status: topicStatus,
//           hasLesson: t.GlobalLesson.length > 0,
//           averagePercent: avg?.toFixed(0) || null,
//         };
//       });
//     }

//     return {
//       term: {
//         displayName: term.displayName,
//         startDate: startDate.toISOString(),
//         endDate: endDate.toISOString(),
//       },
//       isConcluded,
//       currentWeek: currentWeekNum,
//       schedule: processedSchedule,
//       progressPercent: isConcluded ? 100 : 0, 
//       subjectName,
//       gradeName: term.grade.displayName
//     };
//   } catch (error) {
//     console.error("Registry_Term_Fetch_Error:", error);
//     return null;
//   }
// }


"use server";

import { prisma } from "@/lib/prisma";
import { differenceInWeeks, startOfToday, isAfter, differenceInDays } from "date-fns";
import { academicCoreScope, contentScope } from "@/lib/content-scope";
import { Prisma } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";

// ── Types ───────────────────────────────────────────────────────────────────

export interface ProcessedTopic {
  id: string;
  title: string;
  weekNumber: number | null;
  status: "completed" | "current" | "pending";
  hasLesson: boolean;
  averagePercent: string | null;
}

export interface TermScheduleResponse {
  term: {
    displayName: string;
    startDate: string;
    endDate: string;
  };
  isConcluded: boolean;
  currentWeek: number | string;
  schedule: ProcessedTopic[];
  progressPercent: number;
  subjectName: string;
  gradeName: string;
}

// ── Main Action ─────────────────────────────────────────────────────────────

/**
 * FETCH ACADEMIC ROADMAP
 * Rule 7: WHERE (schoolId = user.schoolId OR schoolId IS NULL)
 * Rule 6: Supports Independent Learners (null schoolId)
 */
export async function getGlobalTermSchedule(
  schoolId: string | null, 
  termIndex: number = 1, 
  gradeSubjectId?: string 
): Promise<TermScheduleResponse | null> {
  try {
    // 1. Resolve Curriculum Context (Tier 1 vs Tier 2)
    let curriculumId: string | undefined;

    if (schoolId) {
        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: { curriculumId: true }
        });
        curriculumId = school?.curriculumId;
    } else {
        // Rule 6: For Independent learners, we default to the first available Global Curriculum
        const globalCurriculum = await prisma.curriculum.findFirst({
            where: { schoolId: null }
        });
        curriculumId = globalCurriculum?.id;
    }

    if (!curriculumId) return null;

    // 2. Fetch Term with Scoping (Rule 7)
    // We prioritize the school's specific term record if it exists
    const term = await prisma.term.findFirst({
      where: { 
        index: termIndex,
        grade: { curriculumId: curriculumId },
        ...academicCoreScope({ schoolId })
      },
      include: {
        grade: { select: { displayName: true } }
      },
      orderBy: { schoolId: 'desc' } // Prioritize institutional records over global defaults
    });

    if (!term) return null;

    // 3. Roadmap Timing Logic
    const today = startOfToday();
    const startDate = term.startDate ? new Date(term.startDate) : today;
    const endDate = term.endDate ? new Date(term.endDate) : today;
    const isConcluded = isAfter(today, endDate);

    // Calculate current week progress
    const currentWeekNum: number | "Concluded" = isConcluded 
      ? "Concluded" 
      : Math.max(1, differenceInWeeks(today, startDate) + 1);

    // 4. Fetch Topics with Scope (Rule 7)
    let processedSchedule: ProcessedTopic[] = [];
    let subjectName = "Institutional Roadmap";

    if (gradeSubjectId) {
      // Security Check: Verify gradeSubject accessibility (Rule 10)
      const gs = await prisma.gradeSubject.findFirst({
        where: { 
            id: gradeSubjectId,
            ...academicCoreScope({ schoolId })
        },
        include: { subject: true }
      });

      if (!gs) throw new Error("Access Denied: Subject not found in this context.");
      subjectName = gs.subject.name;

      const topics = await prisma.topic.findMany({
        where: { 
            gradeSubjectId, 
            termId: term.id,
            ...contentScope({ schoolId }) 
        },
        orderBy: { weekNumber: "asc" },
        include: {
          GlobalLesson: { select: { id: true } },
          SchoolLesson: { 
            where: { schoolId: schoolId ?? "NO_SCHOOL" },
            select: { id: true, status: true } 
          },
          assessments: { 
            where: { 
                schoolId: schoolId,
                // If student, we'd add studentId filter here. 
                // For a roadmap, we typically show global stats or placeholders.
            },
            select: { score: true, maxScore: true } 
          }
        }
      });

      processedSchedule = topics.map((t) => {
        const total = t.assessments.reduce((acc, a) => acc + (a.score ?? 0), 0);
        const max = t.assessments.reduce((acc, a) => acc + (a.maxScore ?? 1), 0);
        const avg = t.assessments.length > 0 ? (total / max) * 100 : null;

        // Status determination logic (Rule 11)
        let topicStatus: "completed" | "current" | "pending" = "pending";
        if (isConcluded) {
            topicStatus = "completed";
        } else if (typeof currentWeekNum === 'number') {
            if ((t.weekNumber || 0) < currentWeekNum) topicStatus = "completed";
            else if (t.weekNumber === currentWeekNum) topicStatus = "current";
        }

        return {
          id: t.id,
          title: t.title,
          weekNumber: t.weekNumber,
          status: topicStatus,
          // Rule 4/5: Content exists if there is a Global Blueprint OR an Institutional customization
          hasLesson: t.GlobalLesson.length > 0 || t.SchoolLesson.length > 0,
          averagePercent: avg !== null ? avg.toFixed(0) : null,
        };
      });
    }

    // Progress Percentage Calculation
    const totalDays = Math.max(1, differenceInDays(endDate, startDate));
    const daysPassed = Math.max(0, differenceInDays(today, startDate));
    const progressPercent = isConcluded ? 100 : Math.min(100, Math.round((daysPassed / totalDays) * 100));

    return {
      term: {
        displayName: term.displayName,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
      isConcluded,
      currentWeek: currentWeekNum,
      schedule: processedSchedule,
      progressPercent, 
      subjectName,
      gradeName: term.grade.displayName
    };
  } catch (error: unknown) {
    console.error("Roadmap_Fetch_Error:", getErrorMessage(error));
    return null;
  }
}