export type ChildProfile = {
  id: string;
  name: string | null;
  email: string;
  grade: string; // grade.displayName
  curriculum: string; // curriculum.name
  termLabel: string; // curriculum.termLabel
};

export type FeedbackRecord = {
  message: string | null;
  sentAt: Date | null;
  whatsappSid: string | null;
};

export type AssessmentRecord = {
  id: string;
  type: string;
  score: number | null;
  maxScore: number | null;
  pct: number | null;
  comments: string | null;
  topicTitle: string;
  subjectName: string;
  createdAt: Date;
  feedbacks: FeedbackRecord[];
};

export type TopicStatus = {
  id: string;
  title: string;
  weekNumber: number | null;
  termName: string;
  hasLesson: boolean;
  assessment: { score: number; maxScore: number; pct: number } | null;
};

export type SubjectProgress = {
  gradeSubjectId: string;
  subjectName: string;
  teacherName: string | null;
  topics: TopicStatus[];
  assessments: AssessmentRecord[];
  avgScore: number | null;
};

