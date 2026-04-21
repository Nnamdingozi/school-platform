// export function computeSubjectPerformance(assessments: any[]) {
//     let caTotal = 0;
//     let examTotal = 0;
  
//     for (const a of assessments) {
//       if (a.type === 'CA') {
//         caTotal += a.score || 0;
//       } else if (a.type === 'EXAM') {
//         examTotal += a.score || 0;
//       }
//     }
  
//     const total = caTotal + examTotal;
  
//     // Nigerian grading system
//     let grade = 'F';
//     if (total >= 70) grade = 'A';
//     else if (total >= 60) grade = 'B';
//     else if (total >= 50) grade = 'C';
//     else if (total >= 45) grade = 'D';
//     else if (total >= 40) grade = 'E';
  
//     return {
//       ca: caTotal,
//       exam: examTotal,
//       total,
//       grade
//     };
//   }


// ── Types ───────────────────────────────────────────────────────────────────

export interface AssessmentRecord {
  type: string; // e.g., 'CA' or 'EXAM'
  score: number | null;
}

export interface PerformanceResult {
  ca: number;
  exam: number;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
}

// ── Main Function ────────────────────────────────────────────────────────────

/**
 * Computes the total academic performance for a subject based on 
 * Continuous Assessment (CA) and Exam scores.
 */
export function computeSubjectPerformance(
  assessments: AssessmentRecord[]
): PerformanceResult {
  let caTotal = 0;
  let examTotal = 0;

  for (const a of assessments) {
    if (a.type === 'CA') {
      caTotal += a.score || 0;
    } else if (a.type === 'EXAM') {
      examTotal += a.score || 0;
    }
  }

  const total = caTotal + examTotal;

  // Nigerian standard grading system
  let grade: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'F';

  if (total >= 70) grade = 'A';
  else if (total >= 60) grade = 'B';
  else if (total >= 50) grade = 'C';
  else if (total >= 45) grade = 'D';
  else if (total >= 40) grade = 'E';

  return {
    ca: caTotal,
    exam: examTotal,
    total,
    grade
  };
}