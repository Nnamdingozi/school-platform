// "use client";

// import { useState, useTransition, useMemo } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { createSubjectWithSyllabus, getCourseCatalogue } from "@/app/actions/course-catalogue";
// import { type ManagementHelpers } from "@/app/actions/class-management";
// import { SyllabusDrawer } from "@/components/admin-dasboard/syllabusDrawer";
// import { 
//   Plus, Save, Loader2, X, GraduationCap, Search,
//   ArrowRight, Download, Info, ListPlus
// } from "lucide-react";
// import { toast } from "sonner";
// import { Card } from "@/components/ui/card";
// import { CSVImporter } from "@/components/shared/CSVImporter";
// import { getErrorMessage } from "@/lib/error-handler";
// import { cn } from "@/lib/utils";
// import { Role } from "@prisma/client";

// // ── Types ──────────────────────────────────────────────────────────────────────

// interface CatalogueCourse {
//   id: string;
//   name: string;
//   grades: { id: string; displayName: string }[];
//   totalTopics: number;
// }

// interface SubjectRegistryClientProps {
//     initialCourses: CatalogueCourse[];
//     helpers: ManagementHelpers;
// }

// export function SubjectRegistryClient({ initialCourses, helpers }: SubjectRegistryClientProps) {
//   const { profile } = useProfileStore();
//   const [courses, setCourses] = useState<CatalogueCourse[]>(initialCourses);
//   const [isAdding, setIsAdding] = useState(false);
//   const [isPending, startTransition] = useTransition();

//   // --- Wizard State ---
//   const [subjectName, setSubjectName] = useState("");
//   const [configs, setConfigs] = useState<any[]>([]);
//   const [activeGradeId, setActiveGradeId] = useState<string>("");
//   const [currentTopics, setCurrentTopics] = useState<any[]>([]);
  
//   const [manualTitle, setManualTitle] = useState("");
//   const [manualDesc, setManualDesc] = useState("");
//   const [manualWeek, setManualWeek] = useState<string>("");
//   const [manualTerm, setManualTerm] = useState(1);

//   const [viewingSyllabus, setViewingSyllabus] = useState<CatalogueCourse | null>(null);
//   const [searchQuery, setSearchQuery] = useState("");

//   const downloadTemplate = () => {
//     const headers = "title,termIndex,weekNumber,description";
//     const row = "Photosynthesis,1,4,Detailed study of light and dark reactions";
//     const blob = new Blob([`${headers}\n${row}`], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.href = url;
//     link.download = "syllabus_template.csv";
//     link.click();
//   };

//   const addManualTopic = () => {
//     if (!manualTitle) return toast.error("Topic title is required.");
//     setCurrentTopics([...currentTopics, { 
//         title: manualTitle, 
//         termIndex: manualTerm,
//         weekNumber: manualWeek ? parseInt(manualWeek) : null,
//         description: manualDesc || null
//     }]);
//     setManualTitle(""); setManualDesc(""); setManualWeek("");
//   };

//   const stageGradeConfig = () => {
//     if (!activeGradeId) return toast.error("Select a grade level first.");
//     if (currentTopics.length === 0) return toast.error("Provide at least one topic.");
//     setConfigs([...configs, { gradeId: activeGradeId, topics: currentTopics }]);
//     setActiveGradeId("");
//     setCurrentTopics([]);
//     toast.success("Syllabus configuration staged.");
//   };

//   const handleFinalDeploy = () => {
//     if (!profile?.schoolId) return;
//     if (!subjectName || configs.length === 0) return toast.error("Registry parameters incomplete.");
    
//     startTransition(async () => {
//       try {
//         const res = await createSubjectWithSyllabus({
//             name: subjectName,
//             schoolId: profile.schoolId!,
//             configs: configs,
//             actorId: profile.id,
//             actorRole: profile.role as Role
//         });

//         if (res.success) {
//           toast.success("Institutional Registry Updated");
//           setIsAdding(false);
//           setConfigs([]);
//           setSubjectName("");
//           // Rule 11: Refresh logic
//           const refresh = await getCourseCatalogue(profile.schoolId!);
//           if (refresh.success) setCourses(refresh.data as any);
//         } else {
//           toast.error(res.error || "Deployment failed");
//         }
//       } catch (err) {
//         toast.error(getErrorMessage(err));
//       }
//     });
//   };

//   const filtered = useMemo(() => courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), [courses, searchQuery]);

//   return (
//     <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
      
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Subject Registry</h1>
//           <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Course infrastructure for {profile?.school?.name}.</p>
//         </div>
//         <button onClick={() => setIsAdding(true)} className="bg-school-primary text-slate-950 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl text-[10px] tracking-widest uppercase flex items-center gap-2">
//           <Plus className="w-4 h-4" /> Initialize Subject
//         </button>
//       </header>

//       <div className="relative max-w-xl">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//           <input 
//             placeholder="Search catalog index..." 
//             className="w-full bg-slate-900 border border-white/5 h-12 rounded-2xl pl-12 text-white outline-none focus:border-school-primary transition-all text-xs font-bold uppercase tracking-widest"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {filtered.map(course => (
//           <Card key={course.id} onClick={() => setViewingSyllabus(course)} className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/30 transition-all group shadow-2xl cursor-pointer">
//             <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-school-primary transition-colors">{course.name}</h3>
//             <div className="flex flex-wrap gap-2 mt-4">
//               {course.grades.map((g) => (
//                 <span key={g.id} className="text-[9px] font-black bg-slate-950 text-slate-500 px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">{g.displayName}</span>
//               ))}
//             </div>
//             <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
//               <span>Registry Nodes Loaded</span>
//               <ArrowRight className="h-3 w-3" />
//             </div>
//           </Card>
//         ))}
//       </div>

//       {viewingSyllabus && (
//           <SyllabusDrawer 
//               subject={viewingSyllabus} 
//               schoolId={profile?.schoolId || ""} 
//               onClose={() => setViewingSyllabus(null)} 
//           />
//       )}

//       {/* CREATE WIZARD */}
//       {isAdding && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/98 backdrop-blur-xl p-4 overflow-y-auto py-20 no-scrollbar">
//           <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-6xl shadow-2xl p-8 md:p-12 space-y-10 animate-in zoom-in-95 duration-300">
            
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Course Architect</h2>
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Institutional Node Integration</p>
//               </div>
//               <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><X className="h-5 w-5"/></button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
//               <div className="space-y-8">
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Master Title</label>
//                   <input 
//                     className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-school-primary outline-none transition-all font-bold uppercase italic"
//                     placeholder="e.g. ROBOTICS & AI"
//                     value={subjectName}
//                     onChange={(e) => setSubjectName(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2"><GraduationCap className="h-3 w-3"/> Target Cohort</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {helpers.grades.map((g) => {
//                         const isStaged = configs.some(c => c.gradeId === g.id);
//                         return (
//                             <button 
//                                 key={g.id}
//                                 disabled={isStaged}
//                                 onClick={() => setActiveGradeId(g.id)}
//                                 className={cn(
//                                 "px-3 py-4 rounded-xl text-[9px] font-black uppercase transition-all border",
//                                 activeGradeId === g.id ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : 
//                                 isStaged ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 opacity-50" :
//                                 "bg-slate-950 border-white/5 text-slate-600 hover:text-slate-400"
//                                 )}
//                             >
//                                 {isStaged ? "STAGED" : g.displayName}
//                             </button>
//                         )
//                     })}
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-slate-950 rounded-[2.5rem] border border-white/5 p-8 space-y-8 shadow-inner">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
//                     <h4 className="text-xs font-black uppercase text-white tracking-widest italic">
//                         Node Builder: <span className="text-school-primary">{helpers.grades.find(g => g.id === activeGradeId)?.displayName || "Select Level"}</span>
//                     </h4>
//                     <div className="flex gap-2">
//                          <button onClick={downloadTemplate} className="text-[9px] font-black text-slate-500 hover:text-school-primary flex items-center gap-1.5 uppercase transition-all px-3 py-2 bg-slate-900 rounded-lg border border-white/5">
//                             <Download className="h-3 w-3"/> Template
//                          </button>
//                          <CSVImporter 
//                             title="Import Nodes"
//                             expectedHeaders={["title", "termIndex", "weekNumber", "description"]}
//                             onDataUpload={async (rows: Record<string, string>[]) => {
//                                 const formatted = rows.map(r => ({ 
//                                     title: String(r.title), 
//                                     termIndex: parseInt(String(r.termIndex)),
//                                     weekNumber: r.weekNumber ? parseInt(String(r.weekNumber)) : null,
//                                     description: r.description ? String(r.description) : null
//                                 }));
//                                 setCurrentTopics([...currentTopics, ...formatted]);
//                                 toast.success("Syllabus buffer updated.");
//                             }}
//                          />
//                     </div>
//                 </div>

//                 <div className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//                         <div className="md:col-span-6 space-y-2">
//                             <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Title</label>
//                             <input value={manualTitle} onChange={e => setManualTitle(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:border-school-primary outline-none" />
//                         </div>
//                         <div className="md:col-span-3 space-y-2">
//                             <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Term</label>
//                             <select value={manualTerm} onChange={e => setManualTerm(Number(e.target.value))} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-2 text-sm text-white">
//                                 <option value={1}>Term 1</option>
//                                 <option value={2}>Term 2</option>
//                                 <option value={3}>Term 3</option>
//                             </select>
//                         </div>
//                         <div className="md:col-span-3 space-y-2">
//                             <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Week</label>
//                             <input type="number" value={manualWeek} onChange={e => setManualWeek(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white" />
//                         </div>
//                     </div>

//                     <textarea value={manualDesc} onChange={e => setManualDesc(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-24 rounded-xl px-4 py-3 text-xs text-slate-300 focus:border-school-primary outline-none resize-none" placeholder="Lesson Objectives..." />

//                     <div className="flex gap-3">
//                         <button onClick={addManualTopic} className="flex-1 bg-school-primary text-slate-950 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
//                             <Plus className="h-4 w-4" /> Add Node
//                         </button>
//                     </div>
//                 </div>

//                 <div className="bg-slate-950/50 rounded-2xl border border-white/5 max-h-48 overflow-y-auto shadow-inner">
//                     <table className="w-full text-left">
//                         <thead className="bg-slate-950 text-[9px] font-black uppercase text-slate-600 sticky top-0">
//                             <tr>
//                                 <th className="p-4 w-16 text-center">Week</th>
//                                 <th className="p-4">Topic Registry</th>
//                                 <th className="p-4 text-right">Term</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {currentTopics.map((t, i) => (
//                                 <tr key={i} className="text-xs text-slate-400">
//                                     <td className="p-4 text-center font-mono">W{t.weekNumber || "?"}</td>
//                                     <td className="p-4 font-bold text-white uppercase italic">{t.title}</td>
//                                     <td className="p-4 text-right font-black text-school-primary">T{t.termIndex}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="flex justify-between items-center pt-4">
//                     <button 
//                         onClick={stageGradeConfig}
//                         disabled={!activeGradeId || currentTopics.length === 0}
//                         className="bg-slate-800 border border-white/10 text-white font-black px-10 py-4 rounded-2xl hover:bg-school-primary hover:text-slate-950 transition-all text-[10px] tracking-widest uppercase disabled:opacity-20"
//                     >
//                         Stage Syllabus <ArrowRight className="h-4 w-4 ml-2 inline" />
//                     </button>
//                 </div>
//               </div>
//             </div>

//             <button 
//               disabled={isPending || !subjectName || configs.length === 0}
//               onClick={handleFinalDeploy}
//               className="w-full bg-slate-800 border border-school-primary/30 text-white font-black py-8 rounded-[2.5rem] hover:bg-school-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 disabled:opacity-20 uppercase tracking-[0.4em] text-sm"
//             >
//               {isPending ? <Loader2 className="animate-spin h-6 w-6"/> : <Save className="w-6 h-6"/>}
//               Deploy Institutional Infrastructure
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useTransition, useMemo } from "react";
import { useProfileStore } from "@/store/profileStore";
import { createSubjectWithSyllabus, getCourseCatalogue,   type TopicInput, type GradeConfig } from "@/app/actions/course-catalogue";
import { type ManagementHelpers } from "@/app/actions/class-management";
import { SyllabusDrawer } from "@/components/admin-dasboard/syllabusDrawer";
import { 
  Plus, Save, Loader2, X, GraduationCap, Search,
  ArrowRight, Download, Info, ListPlus
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { CSVImporter } from "@/components/shared/CSVImporter";
import { getErrorMessage } from "@/lib/error-handler";
import { cn } from "@/lib/utils";
import { Role } from "@prisma/client";
// ── Types ──────────────────────────────────────────────────────────────────────

interface CatalogueCourse {
  id: string;
  name: string;
  grades: { id: string; displayName: string }[];
  totalTopics: number;
}

interface SubjectRegistryClientProps {
    initialCourses: CatalogueCourse[];
    helpers: ManagementHelpers;
}

/**
 * INSTITUTIONAL REGISTRY CONSOLE (Tier 2)
 * Rule 15: Props strictly synced with Server Action returns.
 * Rule 17: Uses Zustand to avoid drilling schoolId and branding.
 */
export function SubjectRegistryClient({ initialCourses, helpers }: SubjectRegistryClientProps) {
  const { profile } = useProfileStore();
  
  const [courses, setCourses] = useState<CatalogueCourse[]>(initialCourses);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Wizard State
  const [subjectName, setSubjectName] = useState("");
  const [configs, setConfigs] = useState<GradeConfig[]>([]); // ✅ FIXED: Uses imported Type
  const [activeGradeId, setActiveGradeId] = useState<string>("");
  const [currentTopics, setCurrentTopics] = useState<TopicInput[]>([]); // ✅ FIXED: Uses imported Type
  
  const [manualTitle, setManualTitle] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [manualWeek, setManualWeek] = useState<string>("");
  const [manualTerm, setManualTerm] = useState(1);

  const [viewingSyllabus, setViewingSyllabus] = useState<CatalogueCourse | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const downloadTemplate = () => {
    const headers = "title,termIndex,weekNumber,description";
    const row = "Photosynthesis,1,4,Detailed study of light and dark reactions";
    const blob = new Blob([`${headers}\n${row}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "syllabus_template.csv";
    link.click();
  };

  const addManualTopic = () => {
    if (!manualTitle) return toast.error("Topic title is required.");
    setCurrentTopics([...currentTopics, { 
        title: manualTitle, 
        termIndex: manualTerm,
        weekNumber: manualWeek ? parseInt(manualWeek) : null,
        description: manualDesc || null
    }]);
    setManualTitle(""); setManualDesc(""); setManualWeek("");
  };

  const stageGradeConfig = () => {
    if (!activeGradeId) return toast.error("Select a grade level first.");
    if (currentTopics.length === 0) return toast.error("Provide at least one topic.");
    setConfigs([...configs, { gradeId: activeGradeId, topics: currentTopics }]);
    setActiveGradeId("");
    setCurrentTopics([]);
    toast.success("Grade configuration staged successfully.");
  };

  const handleFinalDeploy = () => {
    if (!profile?.schoolId) return;
    if (!subjectName || configs.length === 0) return toast.error("Registry parameters incomplete.");
    
    startTransition(async () => {
      try {
        const res = await createSubjectWithSyllabus({
            name: subjectName,
            schoolId: profile.schoolId!,
            configs: configs,
            actorId: profile.id,
            actorRole: profile.role as Role
        });

        if (res.success) {
          toast.success("Institutional Registry Updated");
          setIsAdding(false);
          setConfigs([]);
          setSubjectName("");
          
          const refresh = await getCourseCatalogue(profile.schoolId!);
          if (refresh.success) setCourses(refresh.data as unknown as CatalogueCourse[]);
        } else {
          const errorMessage = 'error' in res ? res.error : "Deployment failed";
          toast.error(errorMessage);
        }
      } catch (err: unknown) {
        toast.error(getErrorMessage(err));
      }
    });
  };

  const filtered = useMemo(() => 
    courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), 
    [courses, searchQuery]
  );

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Subject Registry</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Course infrastructure for {profile?.school?.name}.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-school-primary text-slate-950 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl text-[10px] tracking-widest uppercase flex items-center gap-2">
          <Plus className="w-4 h-4" /> Initialize Subject
        </button>
      </header>

      {/* ── SEARCH ── */}
      <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input 
            placeholder="Search catalog index..." 
            className="w-full bg-slate-900 border border-white/5 h-12 rounded-2xl pl-12 text-white outline-none focus:border-school-primary transition-all text-xs font-bold uppercase tracking-widest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      {/* ── GRID ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(course => (
          <Card key={course.id} onClick={() => setViewingSyllabus(course)} className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/30 transition-all group shadow-2xl cursor-pointer">
            <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-school-primary transition-colors">{course.name}</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {course.grades.map((g) => (
                <span key={g.id} className="text-[9px] font-black bg-slate-950 text-slate-500 px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">
                    {g.displayName}
                </span>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>Registry Nodes Loaded</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Card>
        ))}
      </div>

      {viewingSyllabus && (
          <SyllabusDrawer 
              subject={viewingSyllabus} 
              schoolId={profile?.schoolId || ""} 
              onClose={() => setViewingSyllabus(null)} 
          />
      )}

      {/* ── ARCHITECT WIZARD ── */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/98 backdrop-blur-xl p-4 overflow-y-auto py-20 no-scrollbar">
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-6xl shadow-2xl p-8 md:p-12 space-y-10 animate-in zoom-in-95 duration-300">
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Course Architect</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Institutional Node Integration</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><X className="h-5 w-5"/></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Master Title</label>
                  <input 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-school-primary outline-none transition-all font-bold uppercase italic"
                    placeholder="e.g. ROBOTICS"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
                    <GraduationCap className="h-3 w-3"/> Target Cohort
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {helpers.grades.map((g) => {
                        const isStaged = configs.some(c => c.gradeId === g.id);
                        return (
                            <button 
                                key={g.id}
                                disabled={isStaged}
                                onClick={() => setActiveGradeId(g.id)}
                                className={cn(
                                "px-3 py-4 rounded-xl text-[9px] font-black uppercase transition-all border",
                                activeGradeId === g.id ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : 
                                isStaged ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 opacity-50" :
                                "bg-slate-950 border-white/5 text-slate-600 hover:text-slate-400"
                                )}
                            >
                                {isStaged ? "STAGED" : g.displayName}
                            </button>
                        )
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 rounded-[2.5rem] border border-white/5 p-8 space-y-8 shadow-inner">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                    <h4 className="text-xs font-black uppercase text-white tracking-widest italic">
                        Node Builder: <span className="text-school-primary">
                            {helpers.grades.find(g => g.id === activeGradeId)?.displayName || "Select Level"}
                        </span>
                    </h4>
                    <div className="flex gap-2">
                         <button onClick={downloadTemplate} className="text-[9px] font-black text-slate-500 hover:text-school-primary flex items-center gap-1.5 uppercase transition-all px-3 py-2 bg-slate-900 rounded-lg border border-white/5">
                            <Download className="h-3 w-3"/> Template
                         </button>
                         <CSVImporter 
                            title="Import Nodes"
                            expectedHeaders={["title", "termIndex", "weekNumber", "description"]}
                            onDataUpload={async (rows: Record<string, string>[]) => {
                                const formatted: TopicInput[] = rows.map(r => ({ 
                                    title: String(r.title), 
                                    termIndex: parseInt(String(r.termIndex)),
                                    weekNumber: r.weekNumber ? parseInt(String(r.weekNumber)) : null,
                                    description: r.description ? String(r.description) : null
                                }));
                                setCurrentTopics([...currentTopics, ...formatted]);
                                toast.success("Syllabus buffer updated.");
                            }}
                         />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Title</label>
                            <input value={manualTitle} onChange={e => setManualTitle(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:border-school-primary outline-none" />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Term</label>
                            <select value={manualTerm} onChange={e => setManualTerm(Number(e.target.value))} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-2 text-sm text-white">
                                <option value={1}>Term 1</option>
                                <option value={2}>Term 2</option>
                                <option value={3}>Term 3</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Week</label>
                            <input type="number" value={manualWeek} onChange={e => setManualWeek(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white" />
                        </div>
                    </div>

                    <textarea value={manualDesc} onChange={e => setManualDesc(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-24 rounded-xl px-4 py-3 text-xs text-slate-300 focus:border-school-primary outline-none resize-none" placeholder="Lesson Objectives..." />

                    <div className="flex gap-3">
                        <button onClick={addManualTopic} className="flex-1 bg-school-primary text-slate-950 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2">
                            <Plus className="h-4 w-4" /> Add Node
                        </button>
                    </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl border border-white/5 max-h-48 overflow-y-auto no-scrollbar shadow-inner">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-[9px] font-black uppercase text-slate-600 sticky top-0">
                            <tr>
                                <th className="p-4 w-16 text-center">Week</th>
                                <th className="p-4">Topic Registry</th>
                                <th className="p-4 text-right">Term</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentTopics.map((t, i) => (
                                <tr key={i} className="text-xs text-slate-400">
                                    <td className="p-4 text-center font-mono">W{t.weekNumber || "?"}</td>
                                    <td className="p-4 font-bold text-white uppercase italic">{t.title}</td>
                                    <td className="p-4 text-right font-black text-school-primary">T{t.termIndex}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <button 
                        onClick={stageGradeConfig}
                        disabled={!activeGradeId || currentTopics.length === 0}
                        className="bg-slate-800 border border-white/10 text-white font-black px-10 py-4 rounded-2xl hover:bg-school-primary hover:text-slate-950 transition-all text-[10px] tracking-widest uppercase disabled:opacity-20"
                    >
                        Stage Syllabus <ArrowRight className="h-4 w-4 ml-2 inline" />
                    </button>
                </div>
              </div>
            </div>

            <button 
              disabled={isPending || !subjectName || configs.length === 0}
              onClick={handleFinalDeploy}
              className="w-full bg-slate-800 border border-school-primary/30 text-white font-black py-8 rounded-[2.5rem] hover:bg-school-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 disabled:opacity-20 uppercase tracking-[0.4em] text-sm shadow-2xl"
            >
              {isPending ? <Loader2 className="animate-spin h-6 w-6"/> : <Save className="w-6 h-6"/>}
              Deploy Institutional Infrastructure
            </button>
          </div>
        </div>
      )}
    </div>
  );
}