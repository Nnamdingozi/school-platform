// import { type LessonAiContent } from "@/app/actions/ai-generator";

// export type UserRole = "teacher" | "student" | "parent";

// export type LessonDTO = {
//     id?: string;
//     topicId: string;
//     title: string;
//     explanation: string;
//     summary: string;
//     learningObjectives: string[];
//     examples: { task: string; solution: string }[];
//     visualAids: {
//       title: string;
//       description: string;
//       imagePrompt: string;
//       url?: string;
//     }[];
//     vocabulary: string[];
//     quiz: {
//       question: string;
//       options: string[];
//       answer: string;
//       explanation: string;
//     }[];
//     metadata: {
//       topicContext: string;
//       difficultyLevel: string;
//     };
//     teacherLogic: {
//       teachingMethod: string;
//       timeAllocation: string;
//       pedagogicalTips: string;
//       introductionHook: string;
//     };
//   };

// export function transformLessonByRole(
//   aiContent: LessonAiContent,
//   role: UserRole
// ) {
//   if (!aiContent) return null;

//   switch (role) {
//     case "teacher":
//       return {
//         title: aiContent.title,
//         notes: aiContent.teacherVersion?.notes || "",
//         summary: aiContent.teacherVersion?.summary || "",
//         visualAids: aiContent.teacherVersion?.visualAids || [],
//         examples: aiContent.teacherVersion?.examples || [],
//       };

//     case "student":
//       return {
//         title: aiContent.title,
//         summary: aiContent.studentVersion?.summary || "",
//         guidedNotes: aiContent.studentVersion?.guidedNotes || "",
//         visualAids: aiContent.studentVersion?.visualAids || [],
//         keyPoints: aiContent.studentVersion?.keyPoints || [],
//         examples: aiContent.studentVersion?.examples || [],
//       };

//     case "parent":
//       return {
//         title: aiContent.title,
//         summary: aiContent.parentVersion?.summary || "",
//         status: aiContent.parentVersion?.status || "Not available",
//       };

//     default:
//       return null;
//   }
// }



import { LessonAiContent } from "@/app/actions/ai-generator";

export type LessonDTO = {
  topicId: string;
  title: string;
  explanation: string;
  summary: string;
  learningObjectives: string[];
  examples: { task: string; solution: string }[];
  visualAids: {
    title: string;
    description: string;
    imagePrompt: string;
    url?: string;
  }[];
  vocabulary: string[];
  quiz: {
    question: string;
    options: string[];
    answer: string;
    explanation: string;
  }[];
  metadata: {
    topicContext: string;
    difficultyLevel: string;
  };
  teacherLogic: {
    teachingMethod: string;
    timeAllocation: string;
    pedagogicalTips: string;
    introductionHook: string;
  };
};

export function transformLesson(
  topicId: string,
  ai: LessonAiContent
): LessonDTO {
  return {
    topicId,

    title: ai.studentContent.title,
    explanation: ai.studentContent.explanation,
    summary: ai.studentContent.summary,

    learningObjectives: ai.studentContent.learningObjectives,

    examples: ai.studentContent.examples,

    visualAids: ai.studentContent.visualAids,

    vocabulary: ai.studentContent.vocabulary,

    quiz: ai.studentContent.quiz,

    metadata: ai.metadata,

    teacherLogic: ai.teacherLogic,
  };
}