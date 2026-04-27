// import { LessonAiContent } from "@/app/actions/ai-generator";

// export function transformParentLesson(ai: LessonAiContent, performance?: any) {
//   return {
//     topic: ai.studentContent.title,

//     simpleSummary: generateSimpleSummary(ai.studentContent.summary),

//     whatWasTaught: ai.studentContent.learningObjectives,

//     keyPoints: ai.studentContent.summary,

//     performance: {
//       score: performance?.total ?? 0,
//       grade: performance?.grade ?? "N/A",
//     },

//     advice: generateParentAdvice(performance),
//   };
// }

// function generateSimpleSummary(summary: string) {
//   return `Your child learned: ${summary}`;
// }

// function generateParentAdvice(performance?: any) {
//   if (!performance) return "No performance data yet";

//   if (performance.total < 50) {
//     return "Your child needs extra support in this topic.";
//   }

//   if (performance.total < 70) {
//     return "Good progress, but revision is recommended.";
//   }

//   return "Excellent understanding of this topic.";
// }


// import { LessonAiContent } from "@/app/actions/ai-generator";

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface PerformanceData {
//   total: number;
//   grade: string;
// }

// interface ParentLessonView {
//   topic: string;
//   simpleSummary: string;
//   whatWasTaught: string[];
//   keyPoints: string;
//   performance: {
//     score: number;
//     grade: string;
//   };
//   advice: string;
// }

// // ── Main Transformation ──────────────────────────────────────────────────────

// export function transformParentLesson(
//   ai: LessonAiContent, 
//   performance?: PerformanceData
// ): ParentLessonView {
//   return {
//     topic: ai.studentContent.title,

//     simpleSummary: generateSimpleSummary(ai.studentContent.summary),

//     whatWasTaught: ai.studentContent.learningObjectives,

//     keyPoints: ai.studentContent.summary,

//     performance: {
//       // FIX: Safe access using typed interface instead of any
//       score: performance?.total ?? 0,
//       grade: performance?.grade ?? "N/A",
//     },

//     advice: generateParentAdvice(performance),
//   };
// }

// // ── Helpers ──────────────────────────────────────────────────────────────────

// function generateSimpleSummary(summary: string): string {
//   return `Your child learned: ${summary}`;
// }

// /**
//  * Generates pedagogical advice for parents based on computed performance.
//  */
// function generateParentAdvice(performance?: PerformanceData): string {
//   // FIX: Replaced any with PerformanceData interface
//   if (!performance) return "Academic data pending: No performance records found for this module.";

//   if (performance.total < 50) {
//     return "Targeted intervention recommended: Your child requires extra support in this specific topic.";
//   }

//   if (performance.total < 70) {
//     return "Steady progress identified, though additional revision is recommended to master these concepts.";
//   }

//   return "Academic Excellence: Your child demonstrated a mastery of this topic.";
// }



// import { LessonAiContent } from "@/app/actions/ai-generator";
// import { type ParentViewPerformance } from "@/app/actions/getParetnsLesson";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface ParentLessonView {
//   topic: string;
//   simpleSummary: string;
//   whatWasTaught: string[];
//   keyPoints: string;
//   performance: {
//     score: number;
//     grade: string;
//     totalTests: number;
//   };
//   advice: string;
// }

// // ── Main Transformation ──────────────────────────────────────────────────────

// /**
//  * Transforms raw AI lesson content and student assessment history into 
//  * a parent-friendly progress report.
//  */
// export function transformParentLesson(
//   ai: LessonAiContent, 
//   assessments: ParentViewPerformance
// ): ParentLessonView {
  
//   // Compute aggregate performance from the assessment history
//   const performanceStats = calculateAggregatePerformance(assessments);

//   return {
//     topic: ai.studentContent.title,

//     simpleSummary: `Your child is currently studying ${ai.studentContent.title}. ${generateSimpleSummary(ai.studentContent.summary)}`,

//     whatWasTaught: ai.studentContent.learningObjectives,

//     keyPoints: ai.studentContent.summary,

//     performance: {
//       score: performanceStats.percentage,
//       grade: performanceStats.letterGrade,
//       totalTests: assessments.length
//     },

//     advice: generateParentAdvice(performanceStats.percentage, assessments.length),
//   };
// }

// // ── Helpers ──────────────────────────────────────────────────────────────────

// /**
//  * Calculates the overall percentage and letter grade from multiple assessments.
//  */
// function calculateAggregatePerformance(assessments: ParentViewPerformance) {
//   if (assessments.length === 0) {
//     return { percentage: 0, letterGrade: "N/A" };
//   }

//   let totalScore = 0;
//   let totalMax = 0;

//   assessments.forEach((a) => {
//     if (a.score !== null && a.maxScore !== null) {
//       totalScore += a.score;
//       totalMax += a.maxScore;
//     }
//   });

//   const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  
//   let letterGrade = "F";
//   if (percentage >= 75) letterGrade = "A";
//   else if (percentage >= 60) letterGrade = "B";
//   else if (percentage >= 50) letterGrade = "C";
//   else if (percentage >= 45) letterGrade = "D";

//   return { percentage, letterGrade };
// }

// function generateSimpleSummary(summary: string): string {
//   return `The core focus of this module is: ${summary}`;
// }

// /**
//  * Generates pedagogical advice for parents based on computed performance.
//  */
// function generateParentAdvice(score: number, testCount: number): string {
//   if (testCount === 0) {
//     return "Academic data pending: We are currently gathering performance records for this module.";
//   }

//   if (score < 50) {
//     return "Targeted intervention recommended: Your child is finding these specific concepts challenging and would benefit from extra revision at home.";
//   }

//   if (score < 75) {
//     return "Steady progress identified. While your child understands the basics, additional practice will help them reach mastery.";
//   }

//   return "Academic Excellence: Your child has demonstrated a strong mastery of this topic and is performing above the class average.";
// }



// import { LessonAiContent } from "@/app/actions/ai-generator";
// import { type ParentViewPerformance } from "@/app/actions/getParetnsLesson";

// interface ParentLessonView {
//   topic: string;
//   simpleSummary: string;
//   whatWasTaught: string[];
//   keyPoints: string;
//   performance: {
//     score: number;
//     grade: string;
//     totalTests: number;
//   };
//   advice: string;
// }

// export function transformParentLesson(
//   ai: LessonAiContent, 
//   assessments: ParentViewPerformance
// ): ParentLessonView {
  
//   const stats = calculateStats(assessments);

//   return {
//     topic: ai.studentContent.title,
//     simpleSummary: `Your child is currently learning ${ai.studentContent.title}.`,
//     whatWasTaught: ai.studentContent.learningObjectives,
//     keyPoints: ai.studentContent.summary,
//     performance: {
//       score: stats.percentage,
//       grade: stats.grade,
//       totalTests: assessments.length
//     },
//     advice: generateAdvice(stats.percentage, assessments.length),
//   };
// }

// function calculateStats(assessments: ParentViewPerformance) {
//   if (assessments.length === 0) return { percentage: 0, grade: "N/A" };

//   let totalScore = 0;
//   let totalMax = 0;

//   assessments.forEach(a => {
//     if (a.score !== null && a.maxScore !== null) {
//       totalScore += a.score;
//       totalMax += a.maxScore;
//     }
//   });

//   const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
//   let grade = "F";
//   if (percentage >= 75) grade = "A";
//   else if (percentage >= 60) grade = "B";
//   else if (percentage >= 50) grade = "C";

//   return { percentage, grade };
// }

// function generateAdvice(score: number, count: number): string {
//     if (count === 0) return "Gathering academic data for this module.";
//     if (score < 50) return "Your child needs additional support in this area.";
//     if (score < 75) return "Steady progress. Encourage more practice.";
//     return "Excellent performance in this module.";
// }



// import { LessonAiContent } from "@/app/actions/ai-generator";
// import { type ParentViewPerformance } from "@/app/actions/getParetnsLesson";

// interface ParentLessonView {
//   topic: string;
//   simpleSummary: string;
//   whatWasTaught: string[];
//   keyPoints: string;
//   performance: {
//     score: number;
//     grade: string;
//     totalTests: number;
//   };
//   advice: string;
// }

// export function transformParentLesson(
//   ai: LessonAiContent, 
//   assessments: ParentViewPerformance
// ): ParentLessonView {
  
//   const stats = calculateAggregateStats(assessments);

//   return {
//     topic: ai.studentContent.title,
//     simpleSummary: `Your child is currently exploring ${ai.studentContent.title}.`,
//     whatWasTaught: ai.studentContent.learningObjectives,
//     keyPoints: ai.studentContent.summary,
//     performance: {
//       score: stats.percentage,
//       grade: stats.grade,
//       totalTests: assessments.length
//     },
//     advice: generateParentAdvice(stats.percentage, assessments.length),
//   };
// }

// function calculateAggregateStats(assessments: ParentViewPerformance) {
//   if (assessments.length === 0) return { percentage: 0, grade: "N/A" };

//   let totalScore = 0;
//   let totalMax = 0;

//   assessments.forEach(a => {
//     if (a.score !== null && a.maxScore !== null) {
//       totalScore += a.score;
//       totalMax += a.maxScore;
//     }
//   });

//   const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  
//   let grade = "F";
//   if (percentage >= 75) grade = "A";
//   else if (percentage >= 60) grade = "B";
//   else if (percentage >= 50) grade = "C";
//   else if (percentage >= 45) grade = "D";

//   return { percentage, grade };
// }

// function generateParentAdvice(score: number, testCount: number): string {
//   if (testCount === 0) return "No performance data discovered for this module yet.";
//   if (score < 50) return "Intervention suggested: Your child would benefit from extra practice with these concepts.";
//   if (score < 75) return "Steady progress: Your child has a good foundation; encourage them to continue revising.";
//   return "Academic Excellence: Your child has demonstrated high proficiency in this topic.";
// }


import { type EnhancedLessonContent } from "@/components/TeacherDashboard/ai-learning-planner";
import { type ParentViewPerformance } from "@/app/actions/getParetnsLesson";

/**
 * Interface representing the simplified parent-friendly view.
 */
export interface ParentLessonView {
  topic: string;
  simpleSummary: string;
  whatWasTaught: string[];
  keyPoints: string;
  performance: {
    score: number;
    grade: string;
    totalTests: number;
  };
  advice: string;
}

/**
 * Transforms complex AI content and student scores into a parent-friendly format.
 */
export function transformParentLesson(
  ai: EnhancedLessonContent, 
  assessments: ParentViewPerformance
): ParentLessonView {
  
  const stats = calculateAggregateStats(assessments);

  return {
    topic: ai.studentContent.title,
    simpleSummary: `Your child is currently exploring ${ai.studentContent.title}.`,
    whatWasTaught: ai.studentContent.learningObjectives,
    keyPoints: ai.studentContent.summary,
    performance: {
      score: stats.percentage,
      grade: stats.grade,
      totalTests: assessments.length
    },
    advice: generateParentAdvice(stats.percentage, assessments.length),
  };
}

function calculateAggregateStats(assessments: ParentViewPerformance) {
  if (assessments.length === 0) return { percentage: 0, grade: "N/A" };

  let totalScore = 0;
  let totalMax = 0;

  assessments.forEach(a => {
    if (a.score !== null && a.maxScore !== null) {
      totalScore += a.score;
      totalMax += a.maxScore;
    }
  });

  const percentage = totalMax > 0 ? Math.round((totalScore / totalMax) * 100) : 0;
  
  let grade = "F";
  if (percentage >= 75) grade = "A";
  else if (percentage >= 60) grade = "B";
  else if (percentage >= 50) grade = "C";
  else if (percentage >= 45) grade = "D";

  return { percentage, grade };
}

function generateParentAdvice(score: number, testCount: number): string {
  if (testCount === 0) return "No performance data discovered for this module yet.";
  if (score < 50) return "Intervention suggested: Your child would benefit from extra practice with these concepts.";
  if (score < 75) return "Steady progress: Your child has a good foundation; encourage them to continue revising.";
  return "Academic Excellence: Your child has demonstrated high proficiency in this topic.";
}