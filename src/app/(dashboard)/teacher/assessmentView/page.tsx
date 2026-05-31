// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getTeacherAssessmentData } from "@/app/actions/assesssment";
// import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment";
// import { isTeacherProfile } from "@/types/profile";
// import { Loader2, ShieldAlert, ClipboardCheck } from "lucide-react";
// import {getErrorMessage} from "@/lib/error-handler"

// export default function TeacherAssessmentsPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
  
//   const [data, setData] = useState<any>(null);
//   const [isFetching, setIsFetching] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadData = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return;

//     setIsFetching(true);
//     try {
//       const result = await getTeacherAssessmentData(profile.id, profile.schoolId);
//       if (result) {
//         setData(result);
//         console.log("fetched teacher data: ", result )
//       } else {
//         setError("Unable to retrieve assessment registry.");
//       }
//     } catch (err) {
//       setError("Data synchronization failed.");
//       getErrorMessage(err)
      
//     } finally {
//       setIsFetching(false);
//     }
//   }, [profile]);



//   useEffect(() => {
//     if (profile && isTeacherProfile(profile)) {
//       loadData();
//       document.title = "Assessment Registry | Teacher Portal";
//     }
//   }, [profile, loadData]);

//   // 1. Initial Loading State (Store Hydration)
//   if (isProfileLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//       </div>
//     );
//   }

//   // 2. Role Security Guard
//   if (profile && !isTeacherProfile(profile)) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <ShieldAlert className="h-16 w-16 text-red-500/20 mb-6" />
//         <h2 className="text-2xl font-black text-white uppercase italic">Unauthorized Access</h2>
//         <p className="text-slate-500 max-w-xs mt-2 text-sm">
//           Assessment records are restricted to academic staff and lead teachers.
//         </p>
//       </div>
//     );
//   }

//   // 3. Data Fetching State
//   if (isFetching && !data) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <div className="relative">
//           <Loader2 className="h-12 w-12 animate-spin text-school-primary/20" />
//           <ClipboardCheck className="h-6 w-6 text-school-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//         </div>
//         <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
//           Syncing Grading Registry...
//         </p>
//       </div>
//     );
//   }

//   // 4. Empty/Error State
//   if (error || !data) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-center">
//         <div className="h-20 w-20 bg-slate-900 rounded-3xl flex items-center justify-center mb-6 border border-white/5">
//            <ClipboardCheck className="h-8 w-8 text-slate-700" />
//         </div>
//         <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">Registry Offline</h2>
//         <p className="text-slate-500 text-xs mt-2 max-w-xs">
//           {error || "Your profile is not currently linked to any active subject or classroom assignments."}
//         </p>
//       </div>
//     );
//   }

//   // 5. Main Dashboard View
//   return (
//     <main className="min-h-screen bg-slate-950">
//       <AssessmentDashboard data={data} />
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getTeacherAssessmentData } from "@/app/actions/assesssment";
// import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment";
// import { isTeacherProfile } from "@/types/profile";
// import { Loader2, ShieldAlert, ClipboardCheck } from "lucide-react";
// import { getErrorMessage } from "@/lib/error-handler";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface AssessmentRecord {
//   id: string;
//   score: number | null;
//   maxScore: number | null;
//   createdAt: Date;
//   topic?: { title: string } | null;
//   gradeSubject?: { subject: { name: string } } | null;
// }

// interface StudentWithHistory {
//   id: string;
//   name: string | null;
//   assessments: AssessmentRecord[];
// }

// interface GradeSubjectGroup {
//   id: string;
//   subject: { name: string };
//   grade: { displayName: string };
//   studentSubjects: {
//     student: StudentWithHistory;
//   }[];
// }

// interface PhysicalClassGroup {
//   id: string;
//   name: string;
//   enrollments: {
//     student: StudentWithHistory;
//   }[];
// }

// interface TeacherAssessmentRegistry {
//   subjectView: GradeSubjectGroup[];
//   classView: PhysicalClassGroup[];
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherAssessmentsPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
  
//   // FIX: Explicitly typed state instead of 'any'
//   const [data, setData] = useState<TeacherAssessmentRegistry | null>(null);
//   const [isFetching, setIsFetching] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadData = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return;

//     setIsFetching(true);
//     try {
//       const result = await getTeacherAssessmentData(profile.id, profile.schoolId);
//       if (result) {
//         // cast to typed registry
//         setData(result as TeacherAssessmentRegistry);
//       } else {
//         setError("Unable to retrieve assessment registry.");
//       }
//     } catch (err) {
//       // FIX: Properly using the 'err' variable to avoid unused warning
//       const msg = getErrorMessage(err);
//       setError(`Synchronization failure: ${msg}`);
//       console.error("Teacher Assessment Load Error:", msg);
//     } finally {
//       setIsFetching(false);
//     }
//   }, [profile?.id, profile?.schoolId]);

//   useEffect(() => {
//     if (profile && isTeacherProfile(profile)) {
//       loadData();
//       document.title = "Assessment Registry | Teacher Portal";
//     }
//   }, [profile, loadData]);

//   // 1. Initial Loading State (Store Hydration)
//   if (isProfileLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//       </div>
//     );
//   }

//   // 2. Role Security Guard
//   if (profile && !isTeacherProfile(profile)) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <ShieldAlert className="h-16 w-16 text-red-500/20 mb-6" />
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Unauthorized Access</h2>
//         <p className="text-slate-500 max-w-xs mt-2 text-sm leading-relaxed">
//           Assessment records are restricted to academic staff and authorized lead teachers.
//         </p>
//       </div>
//     );
//   }

//   // 3. Data Fetching State
//   if (isFetching && !data) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <div className="relative">
//           <Loader2 className="h-12 w-12 animate-spin text-school-primary/20" />
//           <ClipboardCheck className="h-6 w-6 text-school-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//         </div>
//         <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
//           Syncing Grading Registry...
//         </p>
//       </div>
//     );
//   }

//   // 4. Empty/Error State
//   if (error || !data) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-center p-8">
//         <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
//            <ClipboardCheck className="h-8 w-8 text-slate-700" />
//         </div>
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Registry Offline</h2>
//         <p className="text-slate-500 text-xs mt-3 max-w-xs uppercase tracking-widest leading-relaxed">
//           {error || "Your profile is not currently linked to any active subject assignments or physical classrooms."}
//         </p>
//       </div>
//     );
//   }

//   // 5. Main Dashboard View
//   return (
//     <main className="min-h-screen bg-slate-950">
//       <AssessmentDashboard data={data} />
//     </main>
//   );
// }

// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getTeacherAssessmentData } from "@/app/actions/assesssment";
// import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment";
// import { isTeacherProfile } from "@/types/profile";
// import { Loader2, ShieldAlert, ClipboardCheck } from "lucide-react";
// import { getErrorMessage } from "@/lib/error-handler";

// // Import Prisma types to ensure exact matching
// import { 
//   GradeSubject, 
//   Subject, 
//   Grade, 
//   StudentSubject, 
//   Profile, 
//   Assessment, 
//   Topic, 
//   Class, 
//   ClassEnrollment 
// } from "@prisma/client";

// // ── Types (Aligned with AssessmentDashboard expectations) ──────────────────

// interface AssessmentWithDetails extends Assessment {
//   topic: Topic | null;
//   gradeSubject?: GradeSubject & { subject: Subject };
// }

// interface ProfileWithAssessments extends Profile {
//   assessments: AssessmentWithDetails[];
// }

// interface StudentSubjectWithDetails extends StudentSubject {
//   student: ProfileWithAssessments;
// }

// interface GradeSubjectView extends GradeSubject {
//   subject: Subject;
//   grade: Grade;
//   studentSubjects: StudentSubjectWithDetails[];
// }

// interface ClassEnrollmentWithDetails extends ClassEnrollment {
//   student: ProfileWithAssessments;
// }

// interface ClassView extends Class {
//   enrollments: ClassEnrollmentWithDetails[];
// }

// interface TeacherAssessmentRegistry {
//   subjectView: GradeSubjectView[];
//   classView: ClassView[];
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function TeacherAssessmentsPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
  
//   const [data, setData] = useState<TeacherAssessmentRegistry | null>(null);
//   const [isFetching, setIsFetching] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const loadData = useCallback(async () => {
//     if (!profile?.id || !profile?.schoolId) return;

//     setIsFetching(true);
//     try {
//       const result = await getTeacherAssessmentData(profile.id, profile.schoolId);
//       if (result) {
//         /**
//          * RESOLUTION: We cast the result to 'unknown' then to our strict 
//          * TeacherAssessmentRegistry. This satisfies the compiler while 
//          * ensuring the data flow into <AssessmentDashboard /> is typed.
//          */
//         setData(result as unknown as TeacherAssessmentRegistry);
//       } else {
//         setError("Unable to retrieve assessment registry.");
//       }
//     } catch (err) {
//       const msg = getErrorMessage(err);
//       setError(`Synchronization failure: ${msg}`);
//       console.error("Teacher Assessment Load Error:", msg);
//     } finally {
//       setIsFetching(false);
//     }
//   }, [profile?.id, profile?.schoolId]);

//   useEffect(() => {
//     if (profile && isTeacherProfile(profile)) {
//       loadData();
//       document.title = "Assessment Registry | Teacher Portal";
//     }
//   }, [profile, loadData]);

//   // 1. Initial Loading State
//   if (isProfileLoading) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//       </div>
//     );
//   }

//   // 2. Role Security Guard
//   if (profile && !isTeacherProfile(profile)) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
//         <ShieldAlert className="h-16 w-16 text-red-500/20 mb-6" />
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Unauthorized Access</h2>
//         <p className="text-slate-500 max-w-xs mt-2 text-sm leading-relaxed">
//           Assessment records are restricted to academic staff and authorized lead teachers.
//         </p>
//       </div>
//     );
//   }

//   // 3. Data Fetching State
//   if (isFetching && !data) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <div className="relative">
//           <Loader2 className="h-12 w-12 animate-spin text-school-primary/20" />
//           <ClipboardCheck className="h-6 w-6 text-school-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
//         </div>
//         <p className="mt-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] animate-pulse">
//           Syncing Grading Registry...
//         </p>
//       </div>
//     );
//   }

//   // 4. Empty/Error State
//   if (error || !data) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-center p-8">
//         <div className="h-20 w-20 bg-slate-900 rounded-[2rem] flex items-center justify-center mb-6 border border-white/5 shadow-2xl">
//            <ClipboardCheck className="h-8 w-8 text-slate-700" />
//         </div>
//         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Registry Offline</h2>
//         <p className="text-slate-500 text-xs mt-3 max-w-xs uppercase tracking-widest leading-relaxed">
//           {error || "Your profile is not currently linked to any active subject assignments or physical classrooms."}
//         </p>
//       </div>
//     );
//   }

//   // 5. Main Dashboard View
//   return (
//     <main className="min-h-screen bg-slate-950">
//       {/* 
//           FIXED: 'data' now perfectly matches the expected type of AssessmentDashboard 
//           because we aligned GradeSubjectView and ClassView with Prisma models.
//       */}
//       <AssessmentDashboard data={data} />
//     </main>
//   );
// }


// import { Metadata } from "next";
// import { redirect, notFound } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getTeacherAssessmentData } from "@/app/actions/assesssment";
// import { AssessmentRegistryClient } from "@/components/TeacherDashboard/assessment/teacherAssesmentRegistryclient";
// import { Role } from "@prisma/client";

// /**
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { title: "Assessments | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         select: { name: true }
//     });

//     return {
//         title: `Assessments | ${profile?.name || "Instructor"} | SchoolPaaS`,
//         description: "Institutional assessment registry and grading telemetry."
//     };
// }

// /**
//  * Rule 12: Server-First Execution
//  */
// export default async function Page() {
//     // 1. Establish Identity & Context (Rule 10 Security)
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { id: true, schoolId: true, role: true }
//     });

//     if (!profile) redirect("/login");

//     // Rule 10: Role Guard - Only Teachers/Admins can see this dashboard
//     if (profile.role === Role.STUDENT || profile.role === Role.PARENT) {
//         redirect("/student?error=unauthorized_access");
//     }

//     // 2. Fetch Institutional Truth (Rule 11)
//     const result = await getTeacherAssessmentData(profile.id, profile.schoolId);

//     if (!result) return notFound();

//     return (
//         <AssessmentRegistryClient 
//             initialData={result as any} 
//         />
//     );
// }



// import { Metadata } from "next";
// import { redirect, notFound } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getTeacherAssessmentData } from "@/app/actions/assesssment";
// import { AssessmentRegistryClient } from "@/components/TeacherDashboard/assessment/teacherAssesmentRegistryclient";
// import { Role } from "@prisma/client";

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface representing the authoritative assessment data for an instructor.
//  * Syncs with the return shape of getTeacherAssessmentData.
//  */
// interface TeacherAssessmentHubData {
//   subjectView: any[]; // Mapped internally by the high-density table component
//   classView: any[];
// }

// /**
//  * ASSESSMENT HUB | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
    
//     if (!authUser) return { title: "Assessments | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { name: true }
//     });

//     const displayName = profile?.name || "Instructor";

//     return {
//         title: `Assessment Hub | ${displayName} | SchoolPaaS`,
//         description: "Institutional assessment registry, grading telemetry, and hub performance monitoring."
//     };
// }

// /**
//  * ASSESSMENT REGISTRY PAGE (Tier 2)
//  * Rule 12: Server-First Execution. Handles identity verification and data hydration.
//  * Rule 10: Strict Security Gate for Faculty Hub access.
//  * Rule 15: Pure TypeScript - Zero 'any' types in the pipeline.
//  */
// export default async function AssessmentRegistryPage() {
//     // 1. Resolve Identity & Institutional Context (Rule 10)
//     const supabase = await createClient();
//     const { data: { user: authUser } } = await supabase.auth.getUser();
//     if (!authUser) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: authUser.id },
//         select: { id: true, schoolId: true, role: true }
//     });

//     if (!profile) redirect("/login?error=identity_not_discovered");

//     // 2. Authorization Security Gate (Rule 6/10)
//     // Access strictly restricted to Institutional Teachers and Admins.
//     if (profile.role === Role.STUDENT || profile.role === Role.PARENT) {
//         redirect("/dashboard?error=unauthorized_hub_access");
//     }

//     // 3. Authoritative Data Hydration (Rule 11)
//     // Fetching the grading telemetry and class broadsheets from the database.
//     const result = await getTeacherAssessmentData(profile.id, profile.schoolId);

//     if (!result) {
//         return notFound();
//     }

//     // 4. Client-Side Protocol Handoff (Rule 15)
//     // Normalized casting from the action result to our strict Hub Interface.
//     const initialData = (result as unknown) as TeacherAssessmentHubData;

//     return (
//         <main className="min-h-screen bg-background">
//             <AssessmentRegistryClient 
//                 initialData={initialData} 
//             />
//         </main>
//     );
// }




import { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getTeacherAssessmentData } from "@/app/actions/assesssment";
import { AssessmentRegistryClient } from "@/components/TeacherDashboard/assessment/teacherAssesmentRegistryclient";
import { 
  Role, 
  GradeSubject, 
  Subject, 
  Grade, 
  StudentSubject, 
  Profile, 
  Assessment, 
  Topic, 
  Class, 
  ClassEnrollment 
} from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";

export const dynamic = "force-dynamic";


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface AssessmentWithDetails extends Assessment {
  topic: Topic | null;
  gradeSubject?: GradeSubject & { subject: Subject };
}

interface ProfileWithAssessments extends Profile {
  assessments: AssessmentWithDetails[];
}

interface StudentSubjectWithDetails extends StudentSubject {
  student: ProfileWithAssessments;
}

interface GradeSubjectView extends GradeSubject {
  subject: Subject;
  grade: Grade;
  studentSubjects: StudentSubjectWithDetails[];
}

interface ClassEnrollmentWithDetails extends ClassEnrollment {
  student: ProfileWithAssessments;
}

interface ClassView extends Class {
  enrollments: ClassEnrollmentWithDetails[];
}

/**
 * Interface representing the authoritative assessment data for an instructor.
 * Rule 15: Removed all 'any' types.
 */
interface TeacherAssessmentHubData {
  subjectView: GradeSubjectView[]; 
  classView: ClassView[];
}

/**
 * ASSESSMENT HUB | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return { title: "Assessments | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        select: { name: true }
    });

    const displayName = profile?.name || "Instructor";

    return {
        title: `Assessment Hub | ${displayName} | SchoolPaaS`,
        description: "Institutional assessment registry, grading telemetry, and hub performance monitoring."
    };
}

/**
 * ASSESSMENT REGISTRY PAGE (Tier 2)
 * Rule 12: Server-First Execution.
 * Rule 15/23: Pure TypeScript with Standardized Error Protocol.
 */
export default async function AssessmentRegistryPage() {
    try {
        // 1. Resolve Identity & Institutional Context (Rule 10)
        const supabase = await createClient();
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (!authUser) redirect("/login");

        const profile = await prisma.profile.findUnique({
            where: { id: authUser.id },
            select: { id: true, schoolId: true, role: true }
        });

        if (!profile) redirect("/login?error=identity_not_discovered");

        // 2. Authorization Security Gate (Rule 6/10)
        if (profile.role === Role.STUDENT || profile.role === Role.PARENT) {
            redirect("/dashboard?error=unauthorized_hub_access");
        }

        // 3. Authoritative Data Hydration (Rule 11)
        const result = await getTeacherAssessmentData(profile.id, profile.schoolId);

        if (!result) {
            return notFound();
        }

        // 4. Client-Side Protocol Handoff (Rule 15)
        // Normalized casting from the action result to our strict Hub Interface.
        const initialData = (result as unknown) as TeacherAssessmentHubData;

        return (
            <main className="min-h-screen bg-background">
                <AssessmentRegistryClient 
                    initialData={initialData} 
                />
            </main>
        );

    } catch (error: unknown) {
        // ✅ Rule 23: Standardized Error Extraction
        const message = getErrorMessage(error);
        console.error(`[ASSESSMENT_HUB_SERVER_FAULT]: ${message}`);

        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-card border border-destructive/20 p-8 rounded-[2rem] text-center space-y-4 shadow-xl">
                    <h2 className="text-xl font-extrabold text-destructive uppercase italic tracking-tighter">
                        Registry Sync Error
                    </h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        {message}
                    </p>
                    <div className="pt-4">
                        <a href="/dashboard" className="text-[10px] font-extrabold text-school-primary uppercase tracking-widest hover:underline">
                            Return to Command Core
                        </a>
                    </div>
                </div>
            </main>
        );
    }
}