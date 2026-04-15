import { LessonAiContent } from "@/app/actions/ai-generator";

export function transformParentLesson(ai: LessonAiContent, performance?: any) {
  return {
    topic: ai.studentContent.title,

    simpleSummary: generateSimpleSummary(ai.studentContent.summary),

    whatWasTaught: ai.studentContent.learningObjectives,

    keyPoints: ai.studentContent.summary,

    performance: {
      score: performance?.total ?? 0,
      grade: performance?.grade ?? "N/A",
    },

    advice: generateParentAdvice(performance),
  };
}

function generateSimpleSummary(summary: string) {
  return `Your child learned: ${summary}`;
}

function generateParentAdvice(performance?: any) {
  if (!performance) return "No performance data yet";

  if (performance.total < 50) {
    return "Your child needs extra support in this topic.";
  }

  if (performance.total < 70) {
    return "Good progress, but revision is recommended.";
  }

  return "Excellent understanding of this topic.";
}