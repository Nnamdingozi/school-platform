import { Prisma } from "@prisma/client";

/**
 * Interface for scoping parameters.
 * schoolId is null for Independent Users (Rule 6).
 */
export type ScopeParams = {
  schoolId?: string | null;
  curriculumId?: string;
};

/**
 * 🟢 ACADEMIC CORE SCOPE (Tier 1 & 2)
 * Used for: Subject, Grade, Term, Curriculum
 * Logic: Returns content where schoolId is NULL (Global) or matches user.schoolId.
 */
export function academicCoreScope({ schoolId, curriculumId }: ScopeParams) {
  // Scenario: Independent User (Rule 6)
  if (!schoolId) {
    return {
      schoolId: null,
      ...(curriculumId ? { curriculumId } : {}),
    };
  }

  // Scenario: School User (Rule 5 & 7)
  return {
    AND: [
      curriculumId ? { curriculumId } : {},
      {
        OR: [
          { schoolId: null },
          { schoolId: schoolId }
        ]
      }
    ]
  };
}

/**
 * 🟢 CONTENT VISIBILITY SCOPE (Tier 1 & 2)
 * Used for: Topic, GlobalLesson, Question
 * Logic: Checks 'isGlobal' boolean OR schoolId match.
 */
export function contentScope({ schoolId }: ScopeParams) {
  // Scenario: Independent User (Rule 6)
  if (!schoolId) {
    return {
      OR: [
        { isGlobal: true },
        { schoolId: null }
      ]
    };
  }

  // Scenario: School User (Rule 5 & 7)
  return {
    OR: [
      { isGlobal: true },
      { schoolId: null },
      { schoolId: schoolId }
    ]
  };
}

/**
 * 🟡 STRICT SCHOOL ISOLATION (Tier 2 Only)
 * Used for: Exams, ExamQuestion, SchoolLesson, QuestionOverride
 * Rule 5: Strictly isolated. Rule 6: Forbidden for Independent Users.
 */
export function schoolOnlyScope(schoolId: string | null | undefined) {
  if (!schoolId) {
    // Returns a filter that will never match to prevent data leakage
    return { schoolId: "FORBIDDEN_ACCESS_NO_SCHOOL_ID" };
  }
  return { schoolId };
}

/**
 * 🔵 GLOBAL ONLY SCOPE (Tier 1 Only)
 * Used for: Public templates and base curriculum definitions.
 */
export function globalOnlyScope() {
  return {
    OR: [
      { isGlobal: true },
      { schoolId: null }
    ]
  };
}

/**
 * CONTENT SCOPE WITH CURRICULUM
 * Combines Topic/Lesson visibility with a specific Curriculum ID.
 */
export function contentScopeWithCurriculum({
  schoolId,
  curriculumId
}: ScopeParams) {
  const baseScope = contentScope({ schoolId });

  if (!curriculumId) return baseScope;

  return {
    AND: [
      { curriculumId: curriculumId },
      baseScope
    ]
  };
}