
// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getAllSubjectsWithOwnership } from "@/app/actions/subject-claim";
// import { SubjectSelectionClient } from "@/components/subjects/subject-selection-client";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface describing the raw data shape from the server action.
//  */
// interface RawSubjectData {
//   id: string;
//   name: string;
//   code: string | null;
//   isGlobal: boolean;
//   isOwned: boolean;
//   profileId: string | null;
//   subject: {
//     id: string;
//     name: string;
//     isGlobal: boolean;
//   };
//   grade: {
//     id: string;
//     displayName: string;
//   } | null;
//   profile: {
//     id: string;
//     name: string | null;
//   } | null;
// }

// /**
//  * Authoritative interface for the Subject Registry Hub.
//  * ✅ RESOLVED TS2322: 'grade' is now non-nullable to match 'SubjectWithOwnership'.
//  */
// export interface SubjectRegistryNode {
//   id: string;
//   name: string;
//   code: string | null;
//   isGlobal: boolean;
//   isOwned: boolean;
//   profileId: string | null;
//   subject: {
//     id: string;
//     name: string;
//     isGlobal: boolean;
//   };
//   grade: {
//     displayName: string;
//   };
//   profile: {
//     id: string;
//     name: string | null;
//   } | null;
// }

// /**
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return { title: "Manage Subjects | SchoolPaaS" };

//   const profile = await prisma.profile.findUnique({
//     where: { id: user.id },
//     include: { school: { select: { name: true } } }
//   });

//   const context = profile?.school?.name || "Personal Registry";

//   return {
//     title: `Manage Subjects | ${context} | SchoolPaaS`,
//     description: "Manage your academic library and claim institutional modules."
//   };
// }

// /**
//  * Rule 12: Server-First Execution
//  */
// export default async function Page() {
//   // 1. Establish Identity & Context (Rule 10)
//   const supabase = await createClient();
//   const { data: { user: authUser } } = await supabase.auth.getUser();
//   if (!authUser) redirect("/login");

//   const profile = await prisma.profile.findUnique({
//     where: { id: authUser.id },
//     select: { id: true, schoolId: true, role: true }
//   });

//   if (!profile) redirect("/login");

//   // 2. Fetch Initial Registry State (Rule 7 Query Resolution)
//   const initialSubjectsData = await getAllSubjectsWithOwnership(profile.schoolId);

//   // 3. Registry Synthesis (Rule 15: Strict Type Handoff)
//   // ✅ FIX: Map null 'grade' to a default object to satisfy the non-nullable contract
//   const subjects: SubjectRegistryNode[] = (initialSubjectsData as unknown as RawSubjectData[]).map(node => ({
//     id: node.id,
//     name: node.name,
//     code: node.code,
//     isGlobal: node.isGlobal,
//     isOwned: node.isOwned,
//     profileId: node.profileId,
//     subject: node.subject,
//     profile: node.profile,
//     // If grade is null (Global Subject), provide a mandatory fallback string
//     grade: node.grade ? { displayName: node.grade.displayName } : { displayName: "General Hub" }
//   }));

//   return (
//     <main className="min-h-screen bg-background">
//         <SubjectSelectionClient 
//             initialSubjects={subjects} 
//         />
//     </main>
//   );
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getAllSubjectsWithOwnership } from "@/app/actions/subject-claim";
// import { getIndividualLearnerSubjects } from "@/app/actions/subject-claim";
// import { SubjectSelectionClient } from "@/components/subjects/subject-selection-client";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface describing the raw data shape from the server action.
//  */
// interface RawSubjectData {
//   id: string;
//   name: string;
//   code: string | null;
//   isGlobal: boolean;
//   isOwned: boolean;
//   profileId: string | null;
//   subject: {
//     id: string;
//     name: string;
//     isGlobal: boolean;
//   };
//   grade: {
//     id: string;
//     displayName: string;
//   } | null;
//   profile: {
//     id: string;
//     name: string | null;
//   } | null;
// }

// /**
//  * Authoritative interface for the Subject Registry Hub.
//  * ✅ RESOLVED TS2322: 'grade' is now non-nullable to match 'SubjectWithOwnership'.
//  */
// export interface SubjectRegistryNode {
//   id: string;
//   name: string;
//   code: string | null;
//   isGlobal: boolean;
//   isOwned: boolean;
//   profileId: string | null;
//   subject: {
//     id: string;
//     name: string;
//     isGlobal: boolean;
//   };
//   grade: {
//     displayName: string;
//   };
//   profile: {
//     id: string;
//     name: string | null;
//   } | null;
// }

// /**
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();
//   if (!user) return { title: "Manage Subjects | SchoolPaaS" };

//   const profile = await prisma.profile.findUnique({
//     where: { id: user.id },
//     include: { school: { select: { name: true } } }
//   });

//   const context = profile?.school?.name || "Personal Registry";

//   return {
//     title: `Manage Subjects | ${context} | SchoolPaaS`,
//     description: "Manage your academic library and claim institutional modules."
//   };
// }

// /**
//  * Rule 12: Server-First Execution
//  */
// export default async function Page() {
//   const supabase = await createClient();
//   const { data: { user: authUser } } = await supabase.auth.getUser();
//   if (!authUser) redirect("/login");

//   const profile = await prisma.profile.findUnique({
//     where: { id: authUser.id },
//     select: { id: true, schoolId: true, role: true }
//   });

//   if (!profile) redirect("/login");

//   // Branch based on whether the user is an independent learner or institutional member
//   let initialSubjectsData;
//   if (!profile.schoolId) {
//     initialSubjectsData = await getIndividualLearnerSubjects(authUser.id);
//   } else {
//     initialSubjectsData = await getAllSubjectsWithOwnership(profile.schoolId);
//   }

//   // Registry Synthesis
//   const subjects: SubjectRegistryNode[] = (initialSubjectsData as unknown as RawSubjectData[]).map(node => ({
//     id: node.id,
//     name: node.name,
//     code: node.code,
//     isGlobal: node.isGlobal,
//     isOwned: node.isOwned,
//     profileId: node.profileId,
//     subject: node.subject,
//     profile: node.profile,
//     grade: node.grade ? { displayName: node.grade.displayName } : { displayName: "General Hub" }
//   }));

//   return (
//     <main className="min-h-screen bg-background">
//         <SubjectSelectionClient 
//             initialSubjects={subjects} 
//         />
//     </main>
//   );
// }





import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getAllSubjectsWithOwnership } from "@/app/actions/subject-claim";
import { getIndividualLearnerSubjects, getAllGlobalSubjects } from "@/app/actions/subject-claim";
import { SubjectSelectionClient } from "@/components/subjects/subject-selection-client";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

/**
 * Interface describing the raw data shape from the server action.
 */
interface RawSubjectData {
  id: string;
  name: string;
  code: string | null;
  isGlobal: boolean;
  isOwned: boolean;
  profileId: string | null;
  subject: {
    id: string;
    name: string;
    isGlobal: boolean;
  };
  grade: {
    id: string;
    displayName: string;
  } | null;
  profile: {
    id: string;
    name: string | null;
  } | null;
}

/**
 * Authoritative interface for the Subject Registry Hub.
 * ✅ RESOLVED TS2322: 'grade' is now non-nullable to match 'SubjectWithOwnership'.
 */
export interface SubjectRegistryNode {
  id: string;
  name: string;
  code: string | null;
  isGlobal: boolean;
  isOwned: boolean;
  profileId: string | null;
  subject: {
    id: string;
    name: string;
    isGlobal: boolean;
  };
  grade: {
    displayName: string;
  };
  profile: {
    id: string;
    name: string | null;
  } | null;
}

/**
 * Rule 16: Dynamic Contextual SEO
 */
export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { title: "Manage Subjects | SchoolPaaS" };

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: { school: { select: { name: true } } }
  });

  const context = profile?.school?.name || "Personal Registry";

  return {
    title: `Manage Subjects | ${context} | SchoolPaaS`,
    description: "Manage your academic library and claim institutional modules."
  };
}

/**
 * Rule 12: Server-First Execution
 */
export default async function Page() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) redirect("/login");

  const profile = await prisma.profile.findUnique({
    where: { id: authUser.id },
    select: { id: true, schoolId: true, role: true }
  });

  if (!profile) redirect("/login");

  let initialSubjectsData = [];

  if (!profile.schoolId) {
    // 1. Get all grade-appropriate global subjects using your existing logic
    initialSubjectsData = await getIndividualLearnerSubjects(authUser.id);

    // 2. Fetch the student's explicit personal library entries from StudentSubject
    const studentLibraryEntries = await prisma.studentSubject.findMany({
      where: { userId: authUser.id },
      select: { gradeSubjectId: true }
    });
    const claimedIds = new Set(studentLibraryEntries.map(e => e.gradeSubjectId));

    // 3. Map with the individual per-item `isAdded` flag
    initialSubjectsData = initialSubjectsData.map((sub: any) => ({
      ...sub,
      isAdded: claimedIds.has(sub.id),
    }));

  } else {
    const schoolSubjects = await getAllSubjectsWithOwnership(profile.schoolId);
    initialSubjectsData = (schoolSubjects as any[]).map(sub => ({
      ...sub,
      isAdded: sub.profileId === authUser.id,
    }));
  }

  // Registry Synthesis
  const subjects = initialSubjectsData.map((node: any) => ({
    id: node.id,
    name: node.name,
    code: node.code,
    isGlobal: node.isGlobal,
    isOwned: node.isOwned,
    profileId: node.profileId ?? null,
    subject: node.subject,
    grade: node.grade ? { displayName: node.grade.displayName } : { displayName: "General Hub" },
    profile: node.profile ?? null,
    isAdded: node.isAdded ?? false, // 👈 Passed down independently per row
  }));

  return (
    <main className="min-h-screen bg-background">
        <SubjectSelectionClient 
            initialSubjects={subjects} 
        />
    </main>
  );
}