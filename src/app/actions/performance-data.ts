// app/actions/performance-data.ts

import { prisma } from "@/lib/prisma"; // Adjust path if needed
import { z } from "zod";

// --- Zod Schemas for data validation and clear types ---
const TopicScoreSchema = z.object({
  topic: z.string(),
  score: z.number().nullable(), // Score can be null if no assessments yet
});

const CompletionDataSchema = z.object({
  name: z.string(),
  value: z.number(),
  color: z.string(),
});

const StudentAttentionSchema = z.object({
  name: z.string(),
  score: z.number(),
  trend: z.enum(["up", "down", "stable"]), // Trend is harder to calculate, will mock or simplify
});

export const PerformanceDashboardDataSchema = z.object({
  topicScores: z.array(TopicScoreSchema),
  curriculumCompletion: z.object({
    percentage: z.number(),
    completedTopics: z.number(),
    totalTopics: z.number(),
    completionData: z.array(CompletionDataSchema),
  }),
  studentsNeedingAttention: z.array(StudentAttentionSchema),
});

export type PerformanceDashboardData = z.infer<typeof PerformanceDashboardDataSchema>;

/**
 * Fetches performance data for charts based on a specific gradeSubject and school.
 * @param gradeSubjectId The ID of the GradeSubject (e.g., JSS1 Mathematics).
 * @param schoolId The ID of the school.
 * @returns Formatted performance data for the dashboard.
 */
export async function getPerformanceDashboardData(
  gradeSubjectId: string,
  schoolId: string
): Promise<{ success: boolean; data?: PerformanceDashboardData; error?: string }> {
  try {
    // --- 1. Fetch Average Score per Topic (for Bar Chart) ---
    const topicScoresAggregation = await prisma.assessment.groupBy({
      by: ['topicId'],
      where: {
        gradeSubjectId: gradeSubjectId,
        schoolId: schoolId,
        score: { not: null }, // Only include assessments with a score
      },
      _avg: {
        score: true,
      },
      _count: {
        topicId: true, // Count assessments per topic
      },
      orderBy: {
        _avg: {
          score: 'asc', // Order by lowest score first for "attention" if needed, or by topic name
        },
      },
    });

    const topicIds = topicScoresAggregation.map(a => a.topicId).filter(Boolean) as string[];
    const topics = await prisma.topic.findMany({
      where: { id: { in: topicIds } },
      select: { id: true, title: true },
    });

    const topicScores: z.infer<typeof TopicScoreSchema>[] = topicScoresAggregation.map(agg => {
      const topic = topics.find(t => t.id === agg.topicId);
      return {
        topic: topic?.title || 'Unknown Topic',
        score: agg._avg.score ? parseFloat(agg._avg.score.toFixed(1)) : null,
      };
    });

    // --- 2. Fetch Curriculum Completion (for Pie Chart) ---
    const totalTopicsInGradeSubject = await prisma.topic.count({
      where: {
        gradeSubjectId: gradeSubjectId,
        schoolId: schoolId,
      },
    });

    // We'll count completed topics by checking how many have a corresponding Lesson entry
    // (assuming a lesson existing means the topic content is "complete" for the curriculum)
    const completedLessonsCount = await prisma.lesson.count({
      where: {
        topic: {
          gradeSubjectId: gradeSubjectId,
          schoolId: schoolId,
        },
        // We might need to further define "completed" - e.g., if content is generated
        // For simplicity, a lesson existing means the content is available.
      },
    });
    
    // Alternative: Count topics with at least one assessment with a score
    // const topicsWithCompletedAssessments = await prisma.assessment.groupBy({
    //   by: ['topicId'],
    //   where: {
    //     gradeSubjectId: gradeSubjectId,
    //     schoolId: schoolId,
    //     score: { not: null },
    //   },
    //   _count: { topicId: true }
    // });
    // const completedTopics = topicsWithCompletedAssessments.length;

    const completedTopics = completedLessonsCount; // Using lessons as proxy for completion

    const percentage = totalTopicsInGradeSubject > 0
      ? parseFloat(((completedTopics / totalTopicsInGradeSubject) * 100).toFixed(1))
      : 0;

    const curriculumCompletion = {
      percentage: percentage,
      completedTopics: completedTopics,
      totalTopics: totalTopicsInGradeSubject,
      completionData: [
        { name: "Completed", value: percentage, color: "#10b981" },
        { name: "Remaining", value: 100 - percentage, color: "#e5e7eb" },
      ],
    };

    // --- 3. Fetch Students Needing Attention (for List) ---
    // Fetch students with the lowest average scores in this gradeSubject.
    const studentAssessments = await prisma.assessment.groupBy({
      by: ['studentId'],
      where: {
        gradeSubjectId: gradeSubjectId,
        schoolId: schoolId,
        score: { not: null },
      },
      _avg: {
        score: true,
      },
      orderBy: {
        _avg: {
          score: 'asc',
        },
      },
      take: 5, // Get the top 5 lowest scores
    });

    const studentIds = studentAssessments.map(s => s.studentId);
    const students = await prisma.profile.findMany({
      where: { id: { in: studentIds } },
      select: { id: true, name: true },
    });

    const studentsNeedingAttention: z.infer<typeof StudentAttentionSchema>[] = studentAssessments.map(sa => {
      const student = students.find(s => s.id === sa.studentId);
      // Trend calculation is complex without historical data, so we'll mock it based on score
      let trend: z.infer<typeof StudentAttentionSchema>['trend'] = "stable";
      if (sa._avg.score && sa._avg.score < 50) {
          trend = "down"; // Very low score implies downward trend or poor performance
      } else if (sa._avg.score && sa._avg.score < 60) {
          trend = "stable"; // Consistently low but not critical
      } else {
          trend = "up"; // Above threshold, maybe not "needing attention" in this context
      }

      return {
        name: student?.name || 'Unknown Student',
        score: sa._avg.score ? parseFloat(sa._avg.score.toFixed(0)) : 0,
        trend: trend, // Mocked for now
      };
    }).filter(student => student.score < 60); // Only show students below a certain threshold

    // --- Combine and Return Data ---
    const dashboardData: PerformanceDashboardData = {
      topicScores,
      curriculumCompletion,
      studentsNeedingAttention,
    };

    // Optional: Validate with Zod schema before returning
    const validationResult = PerformanceDashboardDataSchema.safeParse(dashboardData);
    if (!validationResult.success) {
      console.error("Dashboard data validation failed:", validationResult.error);
      // Return partial data or throw a more specific error
      return { success: false, error: "Data validation error after fetching." };
    }

    return { success: true, data: dashboardData };

  } catch (error) {
    console.error("Error fetching performance dashboard data:", error);
    return { success: false, error: "Failed to fetch dashboard data." };
  }
}