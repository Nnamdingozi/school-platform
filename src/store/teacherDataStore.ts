import { create } from 'zustand';
import { 
  GradeSubject, 
  Subject, 
  Grade, 
  Topic, 
  GlobalLesson, 
  Assessment, 
  Prisma 
} from '@prisma/client';

// ── Types ───────────────────────────────────────────────────────────────────

export interface DashboardLesson extends Partial<GlobalLesson> {
  id: string;
  aiContent: Prisma.JsonValue; 
}

export interface DashboardTopic extends Topic {
  lessons: DashboardLesson[];
}

/**
 * Enhanced Subject interface that includes Syllabus (Topics) 
 * AND Performance Data (Assessments).
 */
export interface DashboardSubject extends GradeSubject {
  subject: Subject;
  grade: Grade;
  topics: DashboardTopic[];
  assessments: Assessment[]; // Now active for the Assessment Page
  studentSubjects?: { id: string }[];
}

interface TeacherDashboardState {
  // Data
  selectedSubjects: DashboardSubject[];
  teacherName: string | null;
  
  // Selection State
  activeSubjectId: string | null;
  activeTopicId: string | null;
  
  // Setters
  setDashboardData: (subjects: DashboardSubject[], name: string | null) => void;
  setActiveSubject: (id: string) => void;
  setActiveTopic: (id: string) => void;
  
  // Assessment specific action
  updateAssessments: (subjectId: string, assessments: Assessment[]) => void;
}

export const useTeacherStore = create<TeacherDashboardState>((set) => ({
  selectedSubjects: [],
  teacherName: null,
  activeSubjectId: null,
  activeTopicId: null,

  setDashboardData: (subjects, name) => set({ 
    selectedSubjects: subjects, 
    teacherName: name,
    activeSubjectId: subjects[0]?.id || null,
    activeTopicId: subjects[0]?.topics[0]?.id || null
  }),

  setActiveSubject: (id) => set((state) => {
    const subject = state.selectedSubjects.find(s => s.id === id);
    return {
      activeSubjectId: id,
      activeTopicId: subject?.topics[0]?.id || null
    };
  }),

  setActiveTopic: (id) => set({ activeTopicId: id }),

  /**
   * Allows the Assessment Page to push new grading data 
   * into the store without re-fetching everything.
   */
  updateAssessments: (subjectId, assessments) => set((state) => ({
    selectedSubjects: state.selectedSubjects.map((s) => 
      s.id === subjectId ? { ...s, assessments } : s
    )
  })),
}));