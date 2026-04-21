
// // src/app/(dashboard)/teacher/page.tsx
// import { Suspense } from 'react';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { getTeacherData } from "@/app/actions/teacherData";

// export const dynamic = "force-dynamic";

// export default async function TeacherDashboardPage() {
//     const email = "teacher@lagosacademy.test";
//     const teacher = await getTeacherData(email);

//     if (!teacher) {
//         return <div className="p-20 text-center">Teacher not found.</div>;
//     }

//     return (
//         <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
//             <Suspense fallback={
//                 <div className="flex items-center justify-center min-h-screen">
//                     <p className="text-muted-foreground">Loading...</p>
//                 </div>
//             }>
//                 <TeacherDashboardContent teacher={teacher} />
//             </Suspense>
//         </div>
//     );
// }


// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import { createClient } from '@/lib/supabase/server';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { getTeacherData } from "@/app/actions/teacherData";
// import { type ProfileInStore } from '@/types/profile'; // Ensure this path is correct

// export const dynamic = "force-dynamic";

// export default async function TeacherDashboardPage() {
//     const supabase = await createClient();
//     const { data: { user }, error } = await supabase.auth.getUser();

//     if (error || !user) {
//         redirect('/login');
//     }

//     const teacherData = await getTeacherData(user.email!);

//     if (!teacherData || teacherData.role !== 'TEACHER') {
//         return (
//             <div className="p-20 text-center">
//                 <p className="text-slate-400 italic font-medium">
//                     Institutional record not found or access restricted.
//                 </p>
//             </div>
//         );
//     }

//     // ✅ FIX: Cast the data to ProfileInStore
//     // We can safely cast because the 'include' in the action now matches the interface
//     const teacher = teacherData as unknown as ProfileInStore;

//     return (
//         <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
//             <Suspense fallback={
//                 <div className="flex items-center justify-center min-h-screen">
//                     <div className="flex items-center gap-3">
//                          <span className="h-5 w-5 rounded-full border-2 border-t-transparent border-school-primary animate-spin" />
//                          <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Loading_Session...</p>
//                     </div>
//                 </div>
//             }>
//                 <TeacherDashboardContent teacher={teacher} />
//             </Suspense>
//         </div>
//     );
// }



// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import { createClient } from '@/lib/supabase/server';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { getTeacherData } from "@/app/actions/teacherData";
// import { type ProfileInStore } from '@/types/profile';
// import { GradeSubject, Subject, Grade } from '@prisma/client';

// // ── Utility ──────────────────────────────────────────────────────────────────

// /**
//  * Safely extracts a message from an unknown error type
//  */
// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface DashboardSubject extends GradeSubject {
//   subject: Subject;
//   grade: Grade;
// }

// export const dynamic = "force-dynamic";

// // ── Main Page Component ──────────────────────────────────────────────────────

// export default async function TeacherDashboardPage() {
//     const supabase = await createClient();
    
//     try {
//         const { data: { user }, error: authError } = await supabase.auth.getUser();

//         if (authError || !user) {
//             redirect('/login');
//         }

//         const teacherData = await getTeacherData(user.email!);

//         if (!teacherData || teacherData.role !== 'TEACHER') {
//             return (
//                 <div className="p-20 text-center bg-slate-950 min-h-screen flex items-center justify-center">
//                     <div className="space-y-4">
//                         <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">
//                             Access_Denied
//                         </p>
//                         <p className="text-slate-600 italic text-sm">
//                             Institutional record not found or access restricted to authorized faculty.
//                         </p>
//                     </div>
//                 </div>
//             );
//         }

//         /**
//          * RESOLUTION: Explicitly map the Prisma result to ProfileInStore.
//          * This ensures 'name' and other nullable fields are 'string | null' 
//          * instead of 'string | null | undefined', which resolves the build error.
//          */
//         const teacher: ProfileInStore = {
//             id: teacherData.id,
//             email: teacherData.email,
//             name: teacherData.name ?? null,
//             role: teacherData.role,
//             phone: teacherData.phone ?? null,
//             schoolId: teacherData.schoolId ?? null,
//             curriculumId: teacherData.curriculumId,
//             primaryColor: teacherData.primaryColor,
//             secondaryColor: teacherData.secondaryColor,
//             createdAt: teacherData.createdAt,
//             updatedAt: teacherData.updatedAt,
//             // Cast relations through unknown to satisfy the hydrated ProfileInStore interface
//             selectedSubjects: (teacherData as unknown as ProfileInStore).selectedSubjects || [],
//             taughtClasses: (teacherData as unknown as ProfileInStore).taughtClasses || [],
//             notifications: (teacherData as unknown as ProfileInStore).notifications || [],
//             classEnrollments: (teacherData as unknown as ProfileInStore).classEnrollments || [],
//             curriculum: (teacherData as unknown as ProfileInStore).curriculum,
//         } as ProfileInStore;

//         return (
//             <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-slate-950">
//                 <Suspense fallback={<DashboardLoadingSkeleton />}>
//                     <TeacherDashboardContent teacher={teacher} />
//                 </Suspense>
//             </div>
//         );

//     } catch (err) {
//         const message = getErrorMessage(err);
//         console.error("[TEACHER_DASHBOARD_FATAL]:", message);
        
//         return (
//             <div className="p-20 text-center bg-slate-950 min-h-screen flex items-center justify-center">
//                 <div className="space-y-4 border border-red-500/20 p-10 rounded-[2rem] bg-red-500/5">
//                     <p className="text-red-500 font-black uppercase tracking-[0.4em] text-xs">
//                         Registry_Sync_Failure
//                     </p>
//                     <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
//                         {message}
//                     </p>
//                     <button 
//                         onClick={() => {}} 
//                         className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase transition-all"
//                     >
//                         Retry Connection
//                     </button>
//                 </div>
//             </div>
//         );
//     }
// }

// // ── Sub-Components ──────────────────────────────────────────────────────────

// function DashboardLoadingSkeleton() {
//     return (
//         <div className="flex items-center justify-center min-h-screen bg-slate-950">
//             <div className="flex flex-col items-center gap-6">
//                  <div className="relative">
//                     <div className="h-16 w-16 rounded-full border-2 border-slate-800 border-t-school-primary animate-spin" />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                         <div className="h-2 w-2 bg-school-primary rounded-full animate-pulse" />
//                     </div>
//                  </div>
//                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse">
//                     Syncing_Faculty_Vault
//                  </p>
//             </div>
//         </div>
//     );
// }


// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import { createClient } from '@/lib/supabase/server';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { getTeacherData } from "@/app/actions/teacherData";
// import { type ProfileInStore } from '@/types/profile';

// export const dynamic = "force-dynamic";

// /**
//  * Safely extracts a message from an unknown error type
//  */
// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// export default async function TeacherDashboardPage() {
//   const supabase = await createClient();

//   try {
//     const { data: { user }, error: authError } = await supabase.auth.getUser();

//     if (authError || !user) {
//       redirect('/login');
//     }

//     const teacherData = await getTeacherData(user.email!);

//     if (!teacherData || teacherData.role !== 'TEACHER') {
//       return (
//         <div className="p-20 text-center bg-slate-950 min-h-screen flex items-center justify-center">
//           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
//             Institutional record not found or access restricted.
//           </p>
//         </div>
//       );
//     }

//     /**
//      * RESOLUTION: We map the Prisma result into a strictly defined object.
//      * This converts any 'undefined' properties to 'null' or empty arrays, 
//      * satisfying the component's strict Prop interface.
//      */
//     const hydratedData = teacherData as unknown as ProfileInStore;

//     const teacherPayload = {
//       name: hydratedData.name ?? null,
//       selectedSubjects: hydratedData.selectedSubjects || [],
//     };

//     return (
//       <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-slate-950">
//         <Suspense fallback={<DashboardLoadingSkeleton />}>
//           <TeacherDashboardContent teacher={teacherPayload} />
//         </Suspense>
//       </div>
//     );
//   } catch (err) {
//     console.error("[TEACHER_PAGE_FATAL]:", getErrorMessage(err));
//     return (
//       <div className="p-20 text-center bg-slate-950 min-h-screen flex items-center justify-center">
//         <p className="text-red-500 font-black uppercase text-xs">Registry Synchronization Failure</p>
//       </div>
//     );
//   }
// }

// function DashboardLoadingSkeleton() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-slate-950">
//       <div className="flex items-center gap-3">
//         <div className="h-4 w-4 rounded-full border-2 border-t-transparent border-school-primary animate-spin" />
//         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Loading_Session...</p>
//       </div>
//     </div>
//   );
// }



// import { Suspense } from 'react';
// import { redirect } from 'next/navigation';
// import { createClient } from '@/lib/supabase/server';
// import { getTeacherData } from "@/app/actions/teacherData";
// import { type ProfileInStore } from '@/types/profile';
// import TeacherDashboardContent, { 
//     type DashboardSubject 
// } from "@/components/TeacherDashboard/teacherDashBoardContent";

// export const dynamic = "force-dynamic";

// /**
//  * Safely extracts a message from an unknown error type
//  */
// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String((error as { message?: string }).message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// export default async function TeacherDashboardPage() {
//   const supabase = await createClient();

//   try {
//     const { data: { user }, error: authError } = await supabase.auth.getUser();

//     if (authError || !user) {
//       redirect('/login');
//     }

//     const teacherData = await getTeacherData(user.email!);

//     if (!teacherData || teacherData.role !== 'TEACHER') {
//       return (
//         <div className="p-20 text-center bg-slate-950 min-h-screen flex items-center justify-center">
//           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">
//             Institutional record not found or access restricted.
//           </p>
//         </div>
//       );
//     }

//     /**
//      * RESOLUTION:
//      * 1. We cast the hydrated result to 'unknown' then to 'ProfileInStore'.
//      * 2. We use the 'DashboardSubject' type IMPORTED from the component 
//      *    to ensure the name collision is resolved and types overlap 100%.
//      */
//     const hydratedData = teacherData as unknown as ProfileInStore;

//     const teacherPayload = {
//       name: hydratedData.name ?? null,
//       selectedSubjects: (hydratedData.selectedSubjects as unknown as DashboardSubject[]) || [],
//     };

//     return (
//       <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-slate-950">
//         <Suspense fallback={<DashboardLoadingSkeleton />}>
//           <TeacherDashboardContent teacher={teacherPayload} />
//         </Suspense>
//       </div>
//     );
//   } catch (err) {
//     console.error("[TEACHER_PAGE_FATAL]:", getErrorMessage(err));
//     return (
//       <div className="p-20 text-center bg-slate-950 min-h-screen flex items-center justify-center">
//         <div className="space-y-4">
//           <p className="text-red-500 font-black uppercase text-xs tracking-widest">
//             Registry Synchronization Failure
//           </p>
//           <p className="text-slate-600 text-[10px] uppercase font-bold">
//             {getErrorMessage(err)}
//           </p>
//         </div>
//       </div>
//     );
//   }
// }

// function DashboardLoadingSkeleton() {
//   return (
//     <div className="flex items-center justify-center min-h-screen bg-slate-950">
//       <div className="flex flex-col items-center gap-4">
//         <div className="h-12 w-12 rounded-full border-2 border-slate-800 border-t-school-primary animate-spin" />
//         <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
//           Syncing_Faculty_Vault
//         </p>
//       </div>
//     </div>
//   );
// }


// import { redirect } from 'next/navigation';
// import { createClient } from '@/lib/supabase/server';
// import { getTeacherData } from "@/app/actions/teacherData";
// import { type ProfileInStore } from '@/types/profile';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";

// export default async function TeacherDashboardPage() {
//   const supabase = await createClient();
//   const { data: { user } } = await supabase.auth.getUser();

//   if (!user) redirect('/login');

//   const teacherData = await getTeacherData(user.email!);
//   if (!teacherData || teacherData.role !== 'TEACHER') redirect('/login');

//   // Convert Prisma data to a clean object
//   const teacher = teacherData as unknown as ProfileInStore;

//   return (
//     <main className="min-h-screen bg-slate-950">
//       <TeacherDashboardContent 
//         initialSubjects={teacher.selectedSubjects as any} 
//         teacherName={teacher.name ?? 'Instructor'} 
//       />
//     </main>
//   );
// }



import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getTeacherData } from "@/app/actions/teacherData";
import { type ProfileInStore } from '@/types/profile';
import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
import { type DashboardSubject } from '@/store/teacherDataStore';
import { getErrorMessage } from '@/lib/error-handler';

export default async function TeacherDashboardPage() {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      redirect('/login');
    }

    const teacherData = await getTeacherData(user.email!);

    if (!teacherData || teacherData.role !== 'TEACHER') {
        // Log the denial if necessary and redirect
        redirect('/login?error=unauthorized');
    }

    /**
     * RESOLUTION:
     * 1. Cast the Prisma result to 'unknown' then to 'ProfileInStore' to access the hydrated properties.
     * 2. Replaced 'as any' with 'as unknown as DashboardSubject[]' using the type defined in our Store.
     *    This ensures the server-fetched subjects match the client-side expectations perfectly.
     */
    const teacher = teacherData as unknown as ProfileInStore;

    return (
      <main className="min-h-screen bg-slate-950">
        <TeacherDashboardContent 
          initialSubjects={(teacher.selectedSubjects as unknown as DashboardSubject[]) || []} 
          teacherName={teacher.name ?? 'Instructor'} 
        />
      </main>
    );

  } catch (error) {
    // Strictly typed error handling using the project's error utility
    console.error("[TEACHER_PAGE_FATAL]:", getErrorMessage(error));
    
    // Fallback to login on critical failure
    redirect('/login?error=sync_failed');
  }
}