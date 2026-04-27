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


// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentClassRegistry } from "@/app/actions/student-class";
// import { StudentClassView } from "@/components/student-dashboard/studentClassView";
// import { Loader2, Users } from "lucide-react";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface Classmate {
//   id: string;
//   name: string;
// }

// interface ClassTeacher {
//   name: string | null;
// }

// interface StudentClassRegistryData {
//   name: string;
//   teacher: ClassTeacher | null;
//   classmates: Classmate[];
//   mySubjects: string[];
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function ClassRegistryPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
  
//   // FIX: Replaced 'any' with the specific interface defined above
//   const [data, setData] = useState<StudentClassRegistryData | null>(null);
//   const [isFetching, setIsFetching] = useState<boolean>(true);

//   const loadRegistry = useCallback(async () => {
//     if (profile?.id && profile.role === "STUDENT") {
//       try {
//         setIsFetching(true);
//         const res = await getStudentClassRegistry(profile.id);
        
//         // Ensure the response matches our expected type
//         setData(res as StudentClassRegistryData | null);
//       } catch (error) {
//         console.error("Failed to fetch class registry:", error);
//       } finally {
//         setIsFetching(false);
//       }
//     }
//   }, [profile]);

//   useEffect(() => {
//     loadRegistry();
//   }, [loadRegistry]);

//   // ── Loading States ──

//   if (isProfileLoading || isFetching) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">
//             Accessing Peer Registry...
//         </p>
//       </div>
//     );
//   }

//   // ── Render ──

//   return (
//     <main className="p-4 md:p-8 bg-slate-950 min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* Header Section */}
//         <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//             <div className="h-12 w-12 rounded-2xl bg-school-primary/10 flex items-center justify-center border border-school-primary/20 shadow-lg shadow-school-primary/5">
//                 <Users className="text-school-primary h-6 w-6" />
//             </div>
//             <div>
//                 <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
//                     Class Registry
//                 </h1>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
//                     Institutional Peer & Classroom Data
//                 </p>
//             </div>
//         </header>

//         {/* Component expects StudentClassRegistryData | null */}
//         <StudentClassView data={data} />
        
//       </div>
//     </main>
//   );
// }


// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentClassRegistry } from "@/app/actions/student-class";
// import { StudentClassView } from "@/components/student-dashboard/studentClassView";
// import { Loader2, Users, ShieldAlert, Globe } from "lucide-react";
// import { Role } from "@prisma/client";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface Classmate {
//   id: string;
//   name: string | null;
// }

// interface ClassTeacher {
//   name: string | null;
// }

// export interface StudentClassRegistryData {
//   name: string;
//   teacher: ClassTeacher | null;
//   classmates: Classmate[];
//   mySubjects: string[];
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function ClassRegistryPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore();
  
//   const [data, setData] = useState<StudentClassRegistryData | null>(null);
//   const [isFetching, setIsFetching] = useState<boolean>(true);

//   // Rule 6: Determine if user is Independent
//   const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;

//   const loadRegistry = useCallback(async () => {
//     // Rule 5 & 10: Only fetch if user belongs to a school
//     if (profile?.id && !isIndependent) {
//       try {
//         setIsFetching(true);
//         const res = await getStudentClassRegistry(profile.id);
//         setData(res as StudentClassRegistryData | null);
//       } catch (error) {
//         console.error("Failed to fetch institutional class registry:", error);
//       } finally {
//         setIsFetching(false);
//       }
//     } else {
//         setIsFetching(false);
//     }
//   }, [profile?.id, isIndependent]);

//   useEffect(() => {
//     loadRegistry();
//   }, [loadRegistry]);

//   // ── Loading States ──

//   if (isProfileLoading || isFetching) {
//     return (
//       <div className="h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
//         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest animate-pulse">
//             Accessing Peer Registry...
//         </p>
//       </div>
//     );
//   }

//   // ── Rule 6: Independent Learner State ──
//   if (isIndependent) {
//       return (
//           <main className="p-8 md:p-12 bg-slate-950 min-h-screen flex items-center justify-center">
//               <div className="max-w-md w-full text-center space-y-6 bg-slate-900/50 p-12 rounded-[3rem] border border-white/5 shadow-2xl">
//                   <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
//                       <Globe className="h-10 w-10" />
//                   </div>
//                   <div className="space-y-2">
//                       <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Private Context</h2>
//                       <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
//                           Class registries are limited to institutional users. As an independent learner, you operate in a self-paced global environment.
//                       </p>
//                   </div>
//                   <Link href="/student" className="block">
//                       <Button className="w-full bg-slate-950 text-school-primary border border-white/10 hover:bg-school-primary hover:text-slate-950 font-black rounded-2xl py-6 transition-all">
//                           RETURN TO HUB
//                       </Button>
//                   </Link>
//               </div>
//           </main>
//       )
//   }

//   // ── Render ──

//   return (
//     <main className="p-4 md:p-8 bg-slate-950 min-h-screen">
//       <div className="max-w-7xl mx-auto space-y-8">
        
//         {/* Header Section */}
//         <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//             <div className="h-12 w-12 rounded-2xl bg-school-primary/10 flex items-center justify-center border border-school-primary/20 shadow-lg shadow-school-primary/5">
//                 <Users className="text-school-primary h-6 w-6" />
//             </div>
//             <div>
//                 <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
//                     Class Registry
//                 </h1>
//                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
//                     Institutional Peer & Classroom Data • {profile?.school?.name || "Registry"}
//                 </p>
//             </div>
//         </header>

//         {/* Component expects StudentClassRegistryData | null */}
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
//             <StudentClassView data={data} />
//         </div>
        
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect, useState, useCallback } from "react";
import { useProfileStore } from "@/store/profileStore";
import { getStudentClassRegistry } from "@/app/actions/student-class";
// ✅ Import types from the component to ensure 100% type compatibility
import { 
    StudentClassView, 
    type StudentClassRegistryData 
} from "@/components/student-dashboard/studentClassView";
import { Loader2, Users, Globe } from "lucide-react";
import { Role } from "@prisma/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// ── Main Component ──────────────────────────────────────────────────────────

export default function ClassRegistryPage() {
  const { profile, isLoading: isProfileLoading } = useProfileStore();
  
  const [data, setData] = useState<StudentClassRegistryData | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  // Rule 6: Determine if user is Independent
  const isIndependent = profile?.role === Role.INDIVIDUAL_LEARNER && !profile?.schoolId;

  const loadRegistry = useCallback(async () => {
    // Rule 5 & 10: Only fetch if user belongs to a school
    if (profile?.id && !isIndependent) {
      try {
        setIsFetching(true);
        const res = await getStudentClassRegistry(profile.id);
        
        if (res) {
            /**
             * ✅ FIX: Map the data to satisfy the component's strict non-nullable name requirement.
             * This resolves the error where 'string | null' was being passed to 'string'.
             */
            const mappedData: StudentClassRegistryData = {
                name: res.name,
                teacher: res.teacher ? { name: res.teacher.name ?? "Registry Instructor" } : null,
                mySubjects: res.mySubjects,
                classmates: res.classmates.map(c => ({
                    id: c.id,
                    name: c.name ?? "Unknown Peer" // Provide fallback for null names
                }))
            };
            setData(mappedData);
        }
      } catch (error) {
        console.error("Failed to fetch institutional class registry:", error);
      } finally {
        setIsFetching(false);
      }
    } else {
        setIsFetching(false);
    }
  }, [profile?.id, isIndependent]);

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

  // ── Rule 6: Independent Learner State ──
  if (isIndependent) {
      return (
          <main className="p-8 md:p-12 bg-slate-950 min-h-screen flex items-center justify-center">
              <div className="max-w-md w-full text-center space-y-6 bg-slate-900/50 p-12 rounded-[3rem] border border-white/5 shadow-2xl">
                  <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
                      <Globe className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                      <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Private Context</h2>
                      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest leading-relaxed">
                          Class registries are limited to institutional users. As an independent learner, you operate in a self-paced global environment.
                      </p>
                  </div>
                  <Link href="/student" className="block">
                      <Button className="w-full bg-slate-950 text-school-primary border border-white/10 hover:bg-school-primary hover:text-slate-950 font-black rounded-2xl py-6 transition-all">
                          RETURN TO HUB
                      </Button>
                  </Link>
              </div>
          </main>
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
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                    Institutional Peer & Classroom Data • {profile?.school?.name || "Registry"}
                </p>
            </div>
        </header>

        {/* Component expects StudentClassRegistryData | null */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <StudentClassView data={data} />
        </div>
        
      </div>
    </main>
  );
}