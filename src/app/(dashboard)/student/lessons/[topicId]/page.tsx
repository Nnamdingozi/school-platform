


// import { Metadata } from "next";
// import { notFound, redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getStudentLesson } from "@/app/actions/lesson.actions";
// import { getScannedPapers, type ExtractedQuestion } from "@/app/actions/scanned-question-bank";
// import { LessonContentClient } from "@/components/student-dashboard/lesson/lessonContentClient";
// import { Question, QuestionType, QuestionCategory, Prisma } from "@prisma/client";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface PageProps {
//   params: Promise<{ topicId: string }>;
// }

// /**
//  * ACADEMIC MODULE HUB | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//   const { topicId } = await params;
//   const topic = await prisma.topic.findUnique({
//     where: { id: topicId },
//     select: { title: true }
//   });

//   return {
//     title: `${topic?.title || "Academic Module"} | Syllabus Hub | SchoolPaaS`,
//     description: "Personalized academic module synchronization and archive ledger practice hub."
//   };
// }

// /**
//  * ACADEMIC MODULE PAGE (Tier 3)
//  * Rule 12: Server-First Execution. 
//  * Rule 11: Final System Truth - Integrates Lesson content with Archive Ledgers.
//  * Rule 15: Pure TypeScript - Zero 'any' types. Handled JSON via Prisma namespace.
//  */
// export default async function Page({ params }: PageProps) {
//   const { topicId } = await params;

//   // 1. Resolve Identity Hub & Context (Rule 10)
//   const supabase = await createClient();
//   const { data: { user: authUser } } = await supabase.auth.getUser();
//   if (!authUser) redirect("/login");

//   const profile = await prisma.profile.findUnique({
//     where: { id: authUser.id },
//     select: { id: true, schoolId: true, role: true }
//   });

//   if (!profile) redirect("/login?error=identity_not_discovered");

//   // 2. Parallel Hub Hydration (Rule 11)
//   const [lessonRes, scannedPapers] = await Promise.all([
//     getStudentLesson(topicId, profile.schoolId),
//     getScannedPapers(profile.schoolId, profile.id) 
//   ]);

//   if (!lessonRes.success || !lessonRes.data) {
//     return notFound();
//   }

//   // 3. Registry Synthesis (Rule 15: Strict Type Alignment)
//   // Mapping archive ledger JSON into strict Prisma Question modules.
//   const initialQuestions: Question[] = scannedPapers.flatMap((paper) => {
//       // ✅ Rule 15: Safe cast from Prisma.JsonValue to known internal shape
//       const rawQuestions = (paper.questions as unknown) as ExtractedQuestion[];
      
//       return rawQuestions.map((q, idx) => ({
//           id: `${paper.id}-${idx}`,
//           text: q.text,
//           correctAnswer: q.answer,
//           explanation: q.explanation || null, 
//           points: 1,
//           year: paper.year || null,
//           examBody: paper.type || null,
//           subjectId: null,
//           topicId: topicId,
//           schoolId: paper.schoolId,
//           creatorId: paper.creatorId,
//           isGlobal: paper.schoolId === null, 
//           type: QuestionType.ESSAY, 
//           category: QuestionCategory.SCANNED,
//           difficulty: null,
//           // ✅ FIXED Rule 15: Appropriate Prisma Json type for options field
//           options: [] as Prisma.JsonValue, 
//           createdAt: paper.createdAt,
//           updatedAt: paper.createdAt
//       }));
//   });

//   return (
//     <main className="min-h-screen bg-background">
//         <LessonContentClient 
//           initialLesson={lessonRes.data}
//           initialScannedQuestions={initialQuestions}
//           userId={profile.id}
//           schoolId={profile.schoolId}
//           userRole={profile.role}
//         />
//     </main>
//   );
// }







import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getStudentLesson } from "@/app/actions/lesson.actions";
import { getScannedPapers, type ExtractedQuestion } from "@/app/actions/scanned-question-bank";
import { LessonContentClient } from "@/components/student-dashboard/lesson/lessonContentClient";
import { Question, QuestionType, QuestionCategory, Prisma } from "@prisma/client";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface PageProps {
  params: Promise<{ topicId: string }>;
}

/**
 * ACADEMIC MODULE HUB | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { topicId } = await params;
  const topic = await prisma.topic.findUnique({
    where: { id: topicId },
    select: { title: true }
  });

  return {
    title: `${topic?.title || "Academic Module"} | Syllabus Hub | SchoolPaaS`,
    description: "Personalized academic module synchronization and archive ledger practice hub."
  };
}

/**
 * ACADEMIC MODULE PAGE (Tier 3)
 * Rule 12: Server-First Execution. 
 * Rule 11: Final System Truth - Handles Role-based content and Auto-synthesis logic.
 */
export default async function Page({ params }: PageProps) {
  const { topicId } = await params;

  // 1. Resolve Identity Hub & Context (Rule 10)
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: authUser.id },
    select: { id: true, schoolId: true, role: true }
  });

  if (!profile) redirect("/login?error=identity_not_discovered");

  // 2. Parallel Hub Hydration (Rule 11)
  const [lessonRes, scannedPapers] = await Promise.all([
    // ✅ Logic Update: Passing Role to handle Individual vs Student content masking
    getStudentLesson(topicId, profile.schoolId, profile.role),
    // Fetches digitized archive ledgers for this hub
    getScannedPapers(profile.schoolId, profile.id) 
  ]);

  // ✅ Logic Update: Only 404 if the Topic itself does not exist (success: false)
  // If data is null but success is true, it means we need to trigger AI Synthesis.
  if (!lessonRes.success) {
    return notFound();
  }

  // 3. Registry Synthesis (Rule 15: Strict Type Alignment)
  const initialQuestions: Question[] = scannedPapers.flatMap((paper) => {
      const rawQuestions = (paper.questions as unknown) as ExtractedQuestion[];
      
      return rawQuestions.map((q, idx): Question => ({
          id: `${paper.id}-${idx}`,
          text: q.text,
          correctAnswer: q.answer,
          explanation: q.explanation || null, 
          points: 1,
          year: paper.year || null,
          examBody: paper.type || null,
          subjectId: null,
          topicId: topicId,
          schoolId: paper.schoolId,
          creatorId: paper.creatorId,
          isGlobal: paper.schoolId === null, 
          type: QuestionType.ESSAY, 
          category: QuestionCategory.SCANNED,
          difficulty: null,
          options: [] as Prisma.JsonValue, 
          createdAt: paper.createdAt,
          updatedAt: paper.createdAt
      }));
  });

  return (
    <main className="min-h-screen bg-background">
        <LessonContentClient 
          // Academic Content Logic
          initialLesson={lessonRes.data}
          isGenerated={lessonRes.isGenerated} // Tells client if AI content exists
          topicMetadata={lessonRes.topicMetadata} // Info for the "Generating..." UI
          
          // Practice Hub Logic
          initialScannedQuestions={initialQuestions}
          
          // Identity Logic
          userId={profile.id}
          schoolId={profile.schoolId}
          userRole={profile.role}
          topicId={topicId}
        />
    </main>
  );
}