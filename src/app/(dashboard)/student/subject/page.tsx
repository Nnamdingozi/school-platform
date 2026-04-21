// 'use client';

// import { useEffect, useState } from "react";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { Loader2 } from "lucide-react";


// export default function SubjectsPage() {
//   const { profile, isLoading } = useProfileStore();

//   const [data, setData] = useState<any>(null);
//   const [loadingSubjects, setLoadingSubjects] = useState(true);

//   useEffect(() => {
//     if (!profile?.id) return;

//     async function load() {
//       try {
//         const res = await getStudentDashboardData(profile!.id);
//         setData(res);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoadingSubjects(false);
//       }
//     }

//     load();
//   }, [profile?.id, profile]);

//   // 🔄 Profile loading
//   if (isLoading || !profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   // 🔄 Subjects loading
//   if (loadingSubjects || !data) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-white" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
      
//       <div className="max-w-7xl mx-auto">
//         <SubjectsGrid
//           subjects={data.subjects}
//           classTeacherName={data.classroom?.teacher?.name || "N/A"}
//           gradeLevel={data.classroom?.grade?.level || 10}
//         />
//       </div>
//     </div>
//   );
// }

// 'use client';

// import { useEffect, useState, useCallback } from "react";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { Loader2, BookOpen } from "lucide-react";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SubjectTopic {
//   id: string;
//   title: string;
//   weekNumber?: number | null;
// }

// interface GradeSubject {
//   id: string;
//   subject: { name: string };
//   topics: SubjectTopic[];
//   assessments: any[];
// }

// interface StudentSubjectWrapper {
//   id: string;
//   gradeSubject: GradeSubject;
// }

// interface ClassroomData {
//   id: string;
//   name: string;
//   teacher: { name: string | null } | null;
//   grade: { level: number };
// }

// interface StudentDashboardResult {
//   subjects: StudentSubjectWrapper[];
//   classroom: ClassroomData;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function SubjectsPage() {
//   const { profile, isLoading } = useProfileStore();

//   // FIX: Replaced 'any' with explicit interface
//   const [data, setData] = useState<StudentDashboardResult | null>(null);
//   const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);

//   const loadSyllabus = useCallback(async () => {
//     if (!profile?.id) return;
    
//     try {
//       setLoadingSubjects(true);
//       const res = await getStudentDashboardData(profile.id);
//       if (res) {
//         setData(res as StudentDashboardResult);
//       }
//     } catch (err) {
//       console.error("Failed to load subject registry:", err);
//     } finally {
//       setLoadingSubjects(false);
//     }
//   }, [profile?.id]);

//   useEffect(() => {
//     loadSyllabus();
//   }, [loadSyllabus]); // FIX: Satisfies exhaustive-deps by using memoized callback

//   // 1. Initial State Loader
//   if (isLoading || !profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//       </div>
//     );
//   }

//   // 2. Content Transition Loader
//   if (loadingSubjects || !data) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
//         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">
//             Accessing Subject Registry...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
//       <div className="max-w-7xl mx-auto space-y-10">
        
//         {/* Page Header */}
//         <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//             <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                 <BookOpen className="text-school-primary h-6 w-6" />
//             </div>
//             <div>
//                 <h1 className="text-3xl font-black uppercase italic tracking-tighter">My Syllabus</h1>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
//                     Authorized academic modules for {data.classroom.name}
//                 </p>
//             </div>
//         </header>

//         {/* Dynamic Data Grid */}
//         <SubjectsGrid
//           subjects={data.subjects}
//           classTeacherName={data.classroom.teacher?.name || "Registry Lead"}
//           gradeLevel={data.classroom.grade.level}
//         />
        
//       </div>
//     </div>
//   );
// }


// 'use client';

// import { useEffect, useState, useCallback } from "react";
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
// import { useProfileStore } from "@/store/profileStore";
// import { getStudentDashboardData } from "@/app/actions/student-dashboard";
// import { Loader2, BookOpen } from "lucide-react";
// // Import Prisma types
// import { Assessment, Topic, Subject, Profile, Grade, Class } from "@prisma/client";

// // ── Utility ──────────────────────────────────────────────────────────────────

// function getErrorMessage(error: unknown): string {
//   if (error instanceof Error) return error.message;
//   if (error && typeof error === 'object' && 'message' in error) {
//     return String(error.message);
//   }
//   return typeof error === 'string' ? error : "An unknown error occurred";
// }

// // ── Types ───────────────────────────────────────────────────────────────────

// interface SubjectTopic extends Pick<Topic, "id" | "title" | "weekNumber"> {}

// interface GradeSubjectDetail {
//   id: string;
//   subject: Pick<Subject, "name">;
//   topics: SubjectTopic[];
//   assessments: Assessment[]; // FIXED: Replaced any[] with Prisma Assessment type
// }

// interface StudentSubjectWrapper {
//   id: string;
//   gradeSubject: GradeSubjectDetail;
// }

// interface ClassroomData {
//   id: string;
//   name: string;
//   teacher: Pick<Profile, "name"> | null;
//   grade: Pick<Grade, "level">;
// }

// interface StudentDashboardResult {
//   subjects: StudentSubjectWrapper[];
//   classroom: ClassroomData;
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export default function SubjectsPage() {
//   const { profile, isLoading } = useProfileStore();

//   const [data, setData] = useState<StudentDashboardResult | null>(null);
//   const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);

//   const loadSyllabus = useCallback(async () => {
//     if (!profile?.id) return;
    
//     try {
//       setLoadingSubjects(true);
//       setError(null);
//       const res = await getStudentDashboardData(profile.id);
//       if (res) {
//         // We cast the response from the action to our strict interface
//         setData(res as unknown as StudentDashboardResult);
//       }
//     } catch (err) {
//       const message = getErrorMessage(err);
//       setError(message);
//       console.error("Failed to load subject registry:", message);
//     } finally {
//       setLoadingSubjects(false);
//     }
//   }, [profile?.id]);

//   useEffect(() => {
//     loadSyllabus();
//   }, [loadSyllabus]);

//   // 1. Initial State Loader
//   if (isLoading || !profile) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//       </div>
//     );
//   }

//   // 2. Error State
//   if (error) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4">
//         <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Connection Error</p>
//         <p className="text-slate-400 text-center text-sm max-w-xs mb-6">{error}</p>
//         <button 
//           onClick={() => loadSyllabus()}
//           className="px-6 py-2 bg-school-primary text-slate-950 font-black uppercase text-[10px] rounded-lg"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // 3. Content Transition Loader
//   if (loadingSubjects || !data) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
//         <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">
//             Accessing Subject Registry...
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
//       <div className="max-w-7xl mx-auto space-y-10">
        
//         {/* Page Header */}
//         <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//             <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                 <BookOpen className="text-school-primary h-6 w-6" />
//             </div>
//             <div>
//                 <h1 className="text-3xl font-black uppercase italic tracking-tighter">My Syllabus</h1>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
//                     Authorized academic modules for {data.classroom.name}
//                 </p>
//             </div>
//         </header>

//         {/* Dynamic Data Grid */}
//         <SubjectsGrid
//           subjects={data.subjects}
//           classTeacherName={data.classroom.teacher?.name || "Registry Lead"}
//           gradeLevel={data.classroom.grade.level}
//         />
        
//       </div>
//     </div>
//   );
// }

'use client';

import { useEffect, useState, useCallback } from "react";
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid";
import { useProfileStore } from "@/store/profileStore";
import { getStudentDashboardData } from "@/app/actions/student-dashboard";
import { Loader2, BookOpen } from "lucide-react";
// Import Prisma types - REMOVED 'Class' as it was unused
import { Assessment, Topic, Subject, Profile, Grade } from "@prisma/client";

// ── Utility ──────────────────────────────────────────────────────────────────

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message?: string }).message);
  }
  return typeof error === 'string' ? error : "An unknown error occurred";
}

// ── Types ───────────────────────────────────────────────────────────────────

/**
 * FIXED: Changed from 'interface' to 'type' to resolve 
 * @typescript-eslint/no-empty-object-type error.
 */
type SubjectTopic = Pick<Topic, "id" | "title" | "weekNumber">;

interface GradeSubjectDetail {
  id: string;
  subject: Pick<Subject, "name">;
  topics: SubjectTopic[];
  assessments: Assessment[]; 
}

interface StudentSubjectWrapper {
  id: string;
  gradeSubject: GradeSubjectDetail;
}

interface ClassroomData {
  id: string;
  name: string;
  teacher: Pick<Profile, "name"> | null;
  grade: Pick<Grade, "level">;
}

interface StudentDashboardResult {
  subjects: StudentSubjectWrapper[];
  classroom: ClassroomData;
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function SubjectsPage() {
  const { profile, isLoading } = useProfileStore();

  const [data, setData] = useState<StudentDashboardResult | null>(null);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadSyllabus = useCallback(async () => {
    if (!profile?.id) return;
    
    try {
      setLoadingSubjects(true);
      setError(null);
      const res = await getStudentDashboardData(profile.id);
      if (res) {
        // Casting the action response to our strict interface
        setData(res as unknown as StudentDashboardResult);
      }
    } catch (err) {
      const message = getErrorMessage(err);
      setError(message);
      console.error("Failed to load subject registry:", message);
    } finally {
      setLoadingSubjects(false);
    }
  }, [profile?.id]);

  useEffect(() => {
    loadSyllabus();
  }, [loadSyllabus]);

  // 1. Initial State Loader
  if (isLoading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
      </div>
    );
  }

  // 2. Error State
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4">
        <p className="text-red-500 font-bold uppercase tracking-widest text-xs mb-2">Connection Error</p>
        <p className="text-slate-400 text-center text-sm max-w-xs mb-6">{error}</p>
        <button 
          onClick={() => loadSyllabus()}
          className="px-6 py-2 bg-school-primary text-slate-950 font-black uppercase text-[10px] rounded-lg"
        >
          Retry
        </button>
      </div>
    );
  }

  // 3. Content Transition Loader
  if (loadingSubjects || !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-8 w-8 animate-spin text-school-primary mb-4" />
        <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">
            Accessing Subject Registry...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Page Header */}
        <header className="flex items-center gap-4 border-b border-white/5 pb-8">
            <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
                <BookOpen className="text-school-primary h-6 w-6" />
            </div>
            <div>
                <h1 className="text-3xl font-black uppercase italic tracking-tighter">My Syllabus</h1>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                    Authorized academic modules for {data.classroom.name}
                </p>
            </div>
        </header>

        {/* Dynamic Data Grid */}
        <SubjectsGrid
          /**
           * FIXED: Mapping StudentSubjectWrapper[] to GradeSubjectDetail[]
           * to match the SubjectsGridProps expectations.
           */
          subjects={data.subjects.map(s => s.gradeSubject)}
          classTeacherName={data.classroom.teacher?.name || "Registry Lead"}
          gradeLevel={data.classroom.grade.level}
        />
        
      </div>
    </div>
  );
}

