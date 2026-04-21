// "use client";

// import { useEffect, useState } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getTermlySchedule } from "@/app/actions/termly-schedule";
// import { TermTimelineView } from "@/components/TeacherDashboard/termTimelineView";
// import { Loader2, Lock, SearchX } from "lucide-react";

// export default function SchedulePage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
//   const [data, setData] = useState<any>(null);
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     // Wait for store and check role
//     if (isProfileLoading || !profile || profile.role !== "TEACHER") return;

//     async function fetchData() {
//       // Re-verify profile exists for TypeScript
//       if (!profile?.id) return;

//       setIsFetching(true);
//       try {
//         const result = await getTermlySchedule(profile.id);
//         setData(result);
//       } catch (err) {
//         console.error("Fetch failed");
//       } finally {
//         setIsFetching(false);
//       }
//     }

//     fetchData();
//   }, [profile, isProfileLoading]);

//   // 1. Loading State
//   if (isProfileLoading || (isFetching && !data)) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
//         <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
//           Accessing Academic Registry
//         </p>
//       </div>
//     );
//   }

//   // 2. Security Guard
//   if (profile && profile.role !== "TEACHER") {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950 text-center">
//         <Lock className="h-12 w-12 text-red-500 mb-4 opacity-20" />
//         <h2 className="text-xl font-black text-white uppercase italic">Access Restricted</h2>
//         <p className="text-slate-500 text-xs mt-2">Timeline tools are reserved for Lead Teachers.</p>
//       </div>
//     );
//   }

//   // 3. Final View (Check for data.term to ensure dates show up)
//   return (
//     <main className="p-4 md:p-8 bg-slate-950 min-h-screen">
//       {data && data.term ? (
//         <TermTimelineView data={data} />
//       ) : (
//         <div className="h-[60vh] flex flex-col items-center justify-center text-center">
//           <SearchX className="h-16 w-16 text-slate-800 mb-6" />
//           <h2 className="text-2xl font-black text-white uppercase italic">Registry Standby</h2>
//           <p className="text-slate-500 max-w-sm mt-2 text-sm">
//             No active term or grade assignment found. Please contact your administrator to link your profile to a grade.
//           </p>
//         </div>
//       )}
//     </main>
//   );
// }



// "use client";

// import { useEffect, useState } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getGlobalTermSchedule } from "@/app/actions/termly-schedule";
// import { TermTimelineView } from "@/components/TeacherDashboard/termTimelineView";
// import { isTeacherProfile, ProfileInStore } from "@/types/profile"; // Use your type guard
// import { Loader2, CalendarX } from "lucide-react";

// export default function SchedulePage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
//   const [data, setData] = useState<any>(null);
//   const [isFetching, setIsFetching] = useState(false);

//   useEffect(() => {
//     // Wait for store hydration and check if the user is a teacher/admin
//     if (isProfileLoading || !profile || !isTeacherProfile(profile)) return;

//     async function load() {
//         if (!profile?.id) return;

//       setIsFetching(true);
//       // Accessing 'selectedSubjects' instead of 'gradeSubjectsTaught' 
//       // to match your ProfileInStore interface
//       const teacherProfile = profile as ProfileInStore;
//       const firstSubjectId = teacherProfile.selectedSubjects?.[0]?.id;

//       const res = await getGlobalTermSchedule(profile.schoolId!, 1, firstSubjectId);
//       setData(res);
//       setIsFetching(false);
//     }
//     load();
//   }, [profile, isProfileLoading]);

//   if (isProfileLoading || isFetching) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//             Syncing Academic Timeline...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <main className="p-8 bg-slate-950 min-h-screen">
//       {data && data.term ? (
//         <TermTimelineView data={data} />
//       ) : (
//         <div className="h-[60vh] flex flex-col items-center justify-center text-center">
//           <CalendarX className="h-16 w-16 text-slate-900 mb-6" />
//           <h2 className="text-2xl font-black text-white uppercase italic">Registry Standby</h2>
//           <p className="text-slate-500 text-xs mt-2 max-w-xs leading-relaxed">
//             Academic dates for the First Term have not been configured by the school administrator yet.
//           </p>
//         </div>
//       )}
//     </main>
//   );
// }



"use client";

import { useEffect, useState, useCallback } from "react";
import { useProfileStore } from "@/store/profileStore";
import { getGlobalTermSchedule } from "@/app/actions/termly-schedule";
import { TermTimelineView } from "@/components/TeacherDashboard/termTimelineView";
import { isTeacherProfile, ProfileInStore } from "@/types/profile";
import { Loader2, CalendarX, ShieldCheck } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

interface TimelineTopic {
  id: string;
  title: string;
  weekNumber: number;
  status: "completed" | "current" | "pending";
  hasLesson: boolean;
}

interface AcademicTerm {
  displayName: string;
  startDate: string;
  endDate: string;
}

interface ScheduleData {
  term: AcademicTerm;
  isConcluded: boolean;
  schedule: TimelineTopic[];
  progressPercent: number;
  subjectName: string;
  gradeName: string;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function SchedulePage() {
  const { profile, isLoading: isProfileLoading } = useProfileStore();
  
  // FIX: Replaced 'any' with the specific ScheduleData interface
  const [data, setData] = useState<ScheduleData | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const loadTimeline = useCallback(async () => {
    if (isProfileLoading || !profile || !isTeacherProfile(profile)) return;
    if (!profile?.id || !profile?.schoolId) return;

    try {
      setIsFetching(true);
      
      const teacherProfile = profile as ProfileInStore;
      const firstSubjectId = teacherProfile.selectedSubjects?.[0]?.id;

      // The action returns the structure defined in our interface
      const res = await getGlobalTermSchedule(profile.schoolId, 1, firstSubjectId);
      
      if (res) {
        setData(res as ScheduleData);
      }
    } catch (error) {
      console.error("Registry Sync Error:", error);
    } finally {
      setIsFetching(false);
    }
  }, [profile, isProfileLoading]);

  useEffect(() => {
    loadTimeline();
  }, [loadTimeline]);

  // 1. Store Hydration / Fetching State
  if (isProfileLoading || (isFetching && !data)) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse">
            Syncing Academic Timeline...
        </p>
      </div>
    );
  }

  return (
    <main className="p-4 md:p-8 bg-slate-950 min-h-screen text-slate-50">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Header Logic */}
        <header className="flex items-center gap-4 border-b border-white/5 pb-8">
            <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-lg shadow-school-primary/5">
                <ShieldCheck className="text-school-primary h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
                    Term Roadmap
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                    Institutional Schedule & Syllabus Progress
                </p>
            </div>
        </header>

        {data && data.term ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <TermTimelineView data={data} />
            </div>
        ) : (
            /* Registry Standby View */
            <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5 animate-in zoom-in-95">
                <CalendarX className="h-16 w-16 text-slate-800 mb-6" />
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Registry Standby
                </h2>
                <p className="text-slate-500 text-xs mt-3 max-w-xs leading-relaxed uppercase tracking-wider font-medium">
                    Academic dates for the current term have not been configured by the institutional administrator yet.
                </p>
            </div>
        )}
      </div>
    </main>
  );
}