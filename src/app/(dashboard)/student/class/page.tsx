// "use client";

// import { useEffect, useState } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentClassRegistry } from "@/app/actions/student-class";
// import { StudentClassView } from "@/components/student-dashboard/studentClassView";
// import { Loader2, Users } from "lucide-react";

// export default function ClassRegistryPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
//   const [data, setData] = useState<any>(null);
//   const [isFetching, setIsFetching] = useState(true);

//   useEffect(() => {
//     async function load() {
//       if (profile?.id && profile.role === "STUDENT") {
//         const res = await getStudentClassRegistry(profile.id);
//         setData(res);
//         setIsFetching(false);
//       }
//     }
//     load();
//   }, [profile]);

//   if (isProfileLoading || isFetching) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
//             Accessing Peer Registry...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <main className="p-4 md:p-8 bg-slate-950 min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-8">
//         <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//             <div className="h-12 w-12 rounded-2xl bg-school-primary/10 flex items-center justify-center border border-school-primary/20">
//                 <Users className="text-school-primary h-6 w-6" />
//             </div>
//             <div>
//                 <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter">Class Registry</h1>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Institutional Peer & Classroom Data</p>
//             </div>
//         </header>

//         <StudentClassView data={data} />
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect, useState, useCallback } from "react";
import { useProfileStore } from "@/store/profileStore";
import { getStudentClassRegistry } from "@/app/actions/student-class";
import { StudentClassView } from "@/components/student-dashboard/studentClassView";
import { Loader2, Users } from "lucide-react";

// ── Types ───────────────────────────────────────────────────────────────────

interface Classmate {
  id: string;
  name: string;
}

interface ClassTeacher {
  name: string | null;
}

interface StudentClassRegistryData {
  name: string;
  teacher: ClassTeacher | null;
  classmates: Classmate[];
  mySubjects: string[];
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function ClassRegistryPage() {
  const { profile, isLoading: isProfileLoading } = useProfileStore();
  
  // FIX: Replaced 'any' with the specific interface defined above
  const [data, setData] = useState<StudentClassRegistryData | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const loadRegistry = useCallback(async () => {
    if (profile?.id && profile.role === "STUDENT") {
      try {
        setIsFetching(true);
        const res = await getStudentClassRegistry(profile.id);
        
        // Ensure the response matches our expected type
        setData(res as StudentClassRegistryData | null);
      } catch (error) {
        console.error("Failed to fetch class registry:", error);
      } finally {
        setIsFetching(false);
      }
    }
  }, [profile]);

  useEffect(() => {
    loadRegistry();
  }, [loadRegistry]);

  // ── Loading States ──

  if (isProfileLoading || isFetching) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">
            Accessing Peer Registry...
        </p>
      </div>
    );
  }

  // ── Render ──

  return (
    <main className="p-4 md:p-8 bg-slate-950 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex items-center gap-4 border-b border-white/5 pb-8">
            <div className="h-12 w-12 rounded-2xl bg-school-primary/10 flex items-center justify-center border border-school-primary/20 shadow-lg shadow-school-primary/5">
                <Users className="text-school-primary h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
                    Class Registry
                </h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
                    Institutional Peer & Classroom Data
                </p>
            </div>
        </header>

        {/* Component expects StudentClassRegistryData | null */}
        <StudentClassView data={data} />
        
      </div>
    </main>
  );
}