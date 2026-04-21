import { create } from 'zustand';
import { GradeSubject, Subject, Grade, Topic, Class } from '@prisma/client';

// ── Shared Types ──────────────────────────────────────────────────────────

/**
 * Interface representing a Subject assigned to a Teacher with its metadata.
 */
export interface AssignmentWithDetails extends GradeSubject {
  subject: Subject;
  grade: Grade;
}

/**
 * Interface for grouping topics under a specific academic term.
 */
export interface TermGroup {
  id: string;
  displayName: string;
  index: number;
  topics: Topic[];
}

/**
 * The configuration object required by the Exam Engine and AI Architect.
 * startTime is a string to match HTML datetime-local input requirements.
 */
export interface ExamConfig {
  title: string;
  totalQuestions: number;
  duration: number;
  startTime: string; 
  endTime?: string;
  reusePercentage: number;
}

// ── Store Definition ──────────────────────────────────────────────────────

interface ExamState {
  // Static Registry Data
  assignments: AssignmentWithDetails[];
  termGroups: TermGroup[];
  availableClasses: Class[];

  // Form Selections
  selectedAssignment: AssignmentWithDetails | null;
  selectedTopicIds: string[];
  selectedClassIds: string[];
  config: ExamConfig;
  isSubmitting: boolean;

  // Actions
  setInitialData: (data: { 
    assignments: AssignmentWithDetails[]; 
    termGroups: TermGroup[]; 
    availableClasses: Class[]; 
  }) => void;
  
  setSelectedAssignment: (assignment: AssignmentWithDetails | null) => void;
  setSelectedTopicIds: (ids: string[]) => void;
  
  toggleClass: (classId: string) => void;
  
  setConfig: (update: Partial<ExamConfig> | ((prev: ExamConfig) => ExamConfig)) => void;
  
  setSubmitting: (val: boolean) => void;
  
  reset: () => void;
}

export const useExamStore = create<ExamState>((set) => ({
  // Defaults
  assignments: [],
  termGroups: [],
  availableClasses: [],
  selectedAssignment: null,
  selectedTopicIds: [],
  selectedClassIds: [],
  isSubmitting: false,
  config: {
    title: "",
    totalQuestions: 20,
    duration: 40,
    startTime: "",
    reusePercentage: 20
  },

  // State Updates
  setInitialData: (data) => set(data),
  
  setSelectedAssignment: (assignment) => set({ selectedAssignment: assignment }),
  
  setSelectedTopicIds: (ids) => set({ selectedTopicIds: ids }),
  
  toggleClass: (classId) => set((state) => ({
    selectedClassIds: state.selectedClassIds.includes(classId)
      ? state.selectedClassIds.filter(id => id !== classId)
      : [...state.selectedClassIds, classId]
  })),

  setConfig: (update) => set((state) => ({
    config: typeof update === 'function' 
      ? update(state.config) 
      : { ...state.config, ...update }
  })),

  setSubmitting: (val) => set({ isSubmitting: val }),

  reset: () => set({ 
    selectedAssignment: null, 
    selectedTopicIds: [], 
    selectedClassIds: [], 
    isSubmitting: false,
    config: {
        title: "",
        totalQuestions: 20,
        duration: 40,
        startTime: "",
        reusePercentage: 20
    }
  })
}));

// ── Utility ──────────────────────────────────────────────────────────────────

/**
 * Standard error extractor for use in components calling store actions.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: string }).message);
  }
  return typeof error === 'string' ? error : "An unknown error occurred";
}