export interface PerformanceDashboardData {
    topicScores: {
        topic: string;
        score: number;
    }[];
    studentsNeedingAttention: {
        name: string;
        score: number;
    }[];
    curriculumCompletion: {
        percentage: number;
        completedTopics: number;
        totalTopics: number;
        completionData: {
            name: string;
            value: number;
        }[];
    };
}