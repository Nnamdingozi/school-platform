
// // src/app/parent/page.tsx
// import { redirect } from 'next/navigation';
// import { prisma } from '@/lib/prisma';
// import { createClient } from '@/lib/supabase/server';
// import { ParentDashboardOrchestrator } from '@/components/parent/ParentDashboardOrchestrator';
// import { getParentChildren } from '@/app/actions/parent-dashboard';
// import { parentProfileInclude, BaseProfile } from '@/types/profile';


// export default async function ParentDashboardPage() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) {
//     redirect('/login');
//   }

//   // Use your defined include for parents
//   const profile = await prisma.profile.findUnique({
//     where: { email: user.email ?? '' },
//     include: parentProfileInclude,
//   });

//   // Strict check: if no profile, no school, or no curriculum (required by BaseProfile)
//   if (!profile || !profile.school || !profile.curriculum) {
//     redirect('/login');
//   }

//   const childrenOfParent = await getParentChildren(profile.id, profile.schoolId!);

//   return (
//     <ParentDashboardOrchestrator
//       // Explicitly spreading ensures TS sees the narrowed non-null properties
//       profile={profile as unknown as BaseProfile}
//       childrenOfParent={childrenOfParent}
//     />
//   );
// }


// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { 
//     getParentChildren, 
//     getChildSubjectsAndProgress, 
//     getChildAssessmentHistory, 
//     getChildNotifications 
// } from '@/app/actions/parent-dashboard';
// import { ParentDashboardClient } from "@/components/parent/ParentDashboardClient";
// import { Role } from "@prisma/client";

// /**
//  * Rule 16: Dynamic SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { title: "Parent Hub | SchoolPaaS" };

//     const profile = await prisma.profile.findFirst({
//         where: { id: user.id },
//         include: { school: { select: { name: true } } }
//     });

//     return {
//         title: `Parent Hub | ${profile?.school?.name || "Institution"} | SchoolPaaS`,
//         description: "Oversee your dependents' academic progress and institutional updates."
//     };
// }

// /**
//  * Rule 12: Server-First Parallel Fetching
//  */
// export default async function ParentDashboardPage() {
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     // Resolve Parent Profile
//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         include: { school: true, curriculum: true }
//     });

//     if (!profile || profile.role !== Role.PARENT || !profile.schoolId) {
//         redirect("/login?error=access_denied");
//     }

//     // 1. Fetch children linked to this parent (Rule 5 & 10)
//     const childrenOfParent = await getParentChildren(profile.id, profile.schoolId);

//     // 2. Rule 12: Parallel fetch detailed telemetry for every child
//     const subjectsMap: Record<string, any> = {};
//     const assessmentsMap: Record<string, any> = {};
//     const notificationsMap: Record<string, any> = {};

//     await Promise.all(childrenOfParent.map(async (child) => {
//         const [subjects, assessments, notifications] = await Promise.all([
//             getChildSubjectsAndProgress(profile.id, child.id, profile.schoolId!),
//             getChildAssessmentHistory(profile.id, child.id, profile.schoolId!),
//             getChildNotifications(profile.id, child.id, profile.schoolId!)
//         ]);
//         subjectsMap[child.id] = subjects;
//         assessmentsMap[child.id] = assessments;
//         notificationsMap[child.id] = notifications;
//     }));

//     return (
//         <ParentDashboardClient
//             initialProfile={profile as any}
//             childrenOfParent={childrenOfParent}
//             subjectsByChild={subjectsMap}
//             assessmentsByChild={assessmentsMap}
//             notificationsByChild={notificationsMap}
//         />
//     );
// }



import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { 
    getParentChildren, 
    getChildSubjectsAndProgress, 
    getChildAssessmentHistory, 
    getChildNotifications 
} from '@/app/actions/parent-dashboard';
import { ParentDashboardClient } from "@/components/parent/ParentDashboardClient";
import { Role, Notification } from "@prisma/client";
import { 
    AssessmentRecord, 
    ChildProfile, 
    SubjectProgress 
} from '@/types/parent-dashboard';
import { type AnyProfile } from "@/types/profile";

/**
 * GUARDIAN TERMINAL | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO - Hub-specific indexing for parents.
 */
export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return { title: "Parent Hub | SchoolPaaS" };

    const profile = await prisma.profile.findFirst({
        where: { id: authUser.id },
        include: { school: { select: { name: true } } }
    });

    const hubName = profile?.school?.name || "Institution";

    return {
        title: `Guardian Terminal | ${hubName} | SchoolPaaS`,
        description: "Oversee your dependents' academic progress, module hubs, and institutional transmissions."
    };
}

/**
 * PARENT DASHBOARD PAGE (Tier 3)
 * Rule 12: Server-First Execution. Handles parallel hydration of the child matrix.
 * Rule 15: Strict Registry Types - Removed all 'any' from telemetry maps.
 * Rule 10: Role-based security gate.
 */
export default async function ParentDashboardPage() {
    // 1. Resolve Identity Hub (Rule 10)
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect("/login");

    // 2. Fetch Authoritative Parent Profile
    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        include: { school: true, curriculum: true }
    });

    // Security protocol: Strictly gate access to authorized guardians linked to a school.
    if (!profile || profile.role !== Role.PARENT || !profile.schoolId) {
        redirect("/login?error=registry_access_denied");
    }

    // 3. Child Matrix Initialization (Rule 5/11)
    // Fetch students cryptographically linked to this parent ID.
    const childrenOfParent: ChildProfile[] = await getParentChildren(profile.id, profile.schoolId);

    // 4. Parallel Telemetry Hydration (Rule 12)
    // We initialize strictly typed maps for each category of child data.
    const subjectsMap: Record<string, SubjectProgress[]> = {};
    const assessmentsMap: Record<string, AssessmentRecord[]> = {};
    const notificationsMap: Record<string, Notification[]> = {};

    // Rule 12: High-concurrency fetch to minimize latency for multi-child families.
    await Promise.all(childrenOfParent.map(async (child) => {
        const [subjects, assessments, notifications] = await Promise.all([
            getChildSubjectsAndProgress(profile.id, child.id, profile.schoolId!),
            getChildAssessmentHistory(profile.id, child.id, profile.schoolId!),
            getChildNotifications(profile.id, child.id, profile.schoolId!)
        ]);
        
        subjectsMap[child.id] = subjects as SubjectProgress[];
        assessmentsMap[child.id] = assessments as AssessmentRecord[];
        notificationsMap[child.id] = notifications as Notification[];
    }));

    // 5. Client-Side Protocol Handoff (Rule 15/17)
    return (
        <main className="min-h-screen bg-background">
            <ParentDashboardClient
                initialProfile={profile as unknown as AnyProfile}
                childrenOfParent={childrenOfParent}
                subjectsByChild={subjectsMap}
                assessmentsByChild={assessmentsMap}
                notificationsByChild={notificationsMap}
            />
        </main>
    );
}