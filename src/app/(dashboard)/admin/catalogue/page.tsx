// 'use client'

// import { useState, useEffect } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { getCourseCatalogue } from "@/app/actions/course-catalogue"
// import { 
//     BookOpen, Search, Filter, Plus, 
//     FileText, Loader2, Bookmark, ChevronRight 
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent } from "@/components/ui/card"

// export default function CourseCataloguePage() {
//     const { profile } = useProfileStore()
//     const [courses, setCourses] = useState<any[]>([])
//     const [search, setSearch] = useState("")
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (profile?.schoolId) {
//             getCourseCatalogue(profile.schoolId).then(res => {
//                 if (res.success) setCourses(res?.data)
//                 setLoading(false)
//             })
//         }
//     }, [profile?.schoolId])

//     const filtered = courses.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

//     return (
//         <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
//             {/* Header */}
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                         <BookOpen className="h-7 w-7 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic text-white">Course Catalogue</h1>
//                         <p className="text-slate-500 text-sm">Institutional library of all academic subjects and syllabi.</p>
//                     </div>
//                 </div>
//                 <Button className="bg-school-primary text-school-secondary-950 font-black px-8 py-6 rounded-2xl hover:scale-105 transition-all">
//                     <Plus className="w-4 h-4 mr-2" /> ADD CUSTOM SUBJECT
//                 </Button>
//             </header>

//             {/* Toolbar */}
//             <div className="flex flex-col md:flex-row gap-4">
//                 <div className="relative flex-1">
//                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
//                     <Input 
//                         placeholder="Search subjects by name..." 
//                         className="pl-12 bg-slate-900 border-white/5 h-14 rounded-2xl text-white focus:border-school-primary"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>
//                 <Button variant="outline" className="h-14 px-6 border-white/5 bg-slate-900 text-slate-400 rounded-2xl">
//                     <Filter className="w-4 h-4 mr-2" /> Departments
//                 </Button>
//             </div>

//             {/* Grid */}
//             {loading ? (
//                 <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-school-primary h-10 w-10" /></div>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {filtered.map((course) => (
//                         <Card key={course.id} className="bg-slate-900 border-white/5 rounded-[2rem] hover:border-school-primary/30 transition-all group overflow-hidden shadow-2xl">
//                             <CardContent className="p-8 space-y-6">
//                                 <div className="flex justify-between items-start">
//                                     <div className="p-3 bg-slate-950 rounded-2xl border border-white/5 text-school-primary group-hover:scale-110 transition-transform">
//                                         <Bookmark className="h-5 w-5" />
//                                     </div>
//                                     <div className="text-right">
//                                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Syllabus</p>
//                                         <p className="text-sm font-bold text-white">{course.totalTopics} Topics</p>
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-school-primary transition-colors">
//                                         {course.name}
//                                     </h3>
//                                     <div className="flex flex-wrap gap-2 mt-4">
//                                         {course.grades.map((g: string) => (
//                                             <span key={g} className="text-[9px] font-black uppercase tracking-tighter bg-slate-950 text-slate-400 px-2 py-1 rounded-md border border-white/5">
//                                                 {g}
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div className="pt-6 border-t border-white/5 flex items-center justify-between">
//                                     <button className="text-[10px] font-black text-school-primary uppercase tracking-[0.2em] hover:underline flex items-center gap-2">
//                                         View Syllabus <ChevronRight className="h-3 w-3" />
//                                     </button>
//                                     <FileText className="h-4 w-4 text-slate-700" />
//                                 </div>
//                             </CardContent>
//                         </Card>
//                     ))}
//                 </div>
//             )}
//         </div>
//     )
// }


//  "use client";

// import { useState, useEffect, useTransition, useMemo } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { useProfileStore } from "@/store/profileStore";
// import { getCourseCatalogue } from "@/app/actions/course-catalogue";
// import { createSubjectWithSyllabus, type TopicInput } from "@/app/actions/course-catalogue";
// import { getManagementHelpers, type ManagementHelpers } from "@/app/actions/class-management";
// import { 
//   Plus, FileSpreadsheet, Save, Loader2, 
//   X, GraduationCap, Search, BookOpen, Filter,
//   ArrowRight, Download, Info, Check, CheckCircle2
// } from "lucide-react";
// import { toast } from "sonner";
// import { Card, CardContent } from "@/components/ui/card";
// import { CSVImporter } from "@/components/shared/CSVImporter";
// import { getErrorMessage } from "@/lib/error-handler";
// import { cn } from "@/lib/utils";

// // --- Strict Interfaces ---
// interface CatalogueCourse {
//   id: string;
//   name: string;
//   grades: string[];
//   totalTopics: number;
// }

// export default function SubjectRegistryPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const { profile } = useProfileStore();
//   const schoolId = profile?.schoolId;

//   // --- State Management ---
//   const [courses, setCourses] = useState<CatalogueCourse[]>([]);
//   const [helpers, setHelpers] = useState<ManagementHelpers | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isAdding, setIsAdding] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [isPending, startTransition] = useTransition();

//   // Form State
//   const [form, setForm] = useState({ name: '', gradeIds: [] as string[] });
//   const [manualTopics, setManualTopics] = useState<TopicInput[]>([]);

//   // 1. Initial Data Load
//   useEffect(() => {
//     async function loadData() {
//       if (!schoolId) return;
//       setIsLoading(true);
//       try {
//         const [catRes, helperRes] = await Promise.all([
//           getCourseCatalogue(schoolId),
//           getManagementHelpers(schoolId)
//         ]);

//         if (catRes.success && catRes.data) {
//             setCourses(catRes.data as CatalogueCourse[]);
//         }
//         setHelpers(helperRes);
//       } catch (err) {
//         toast.error(getErrorMessage(err));
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     loadData();
//   }, [schoolId]);

//   // 2. CSV Template Logic
//   const downloadSyllabusTemplate = () => {
//     const headers = "title,termIndex,weekNumber";
//     const exampleRows = [
//       "Introduction to Course,1,1",
//       "Core Concepts Phase I,1,2",
//       "Mid-Term Review,1,6",
//       "Advanced Module A,2,1",
//       "Final Project Prep,3,10"
//     ];
//     const csvContent = [headers, ...exampleRows].join("\n");
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", "syllabus_template.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     toast.info("Template downloaded.");
//   };

//   // 3. Search Filter
//   const filteredCourses = useMemo(() => {
//     return courses.filter(c => 
//       c.name.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   }, [courses, searchQuery]);

//   // 4. Creation Handler
//   const handleCreate = () => {
//     if (!form.name || form.gradeIds.length === 0) {
//       toast.error("Name and Grades are required.");
//       return;
//     }
//     if (!schoolId) return;

//     startTransition(async () => {
//       try {
//         const res = await createSubjectWithSyllabus({
//           ...form,
//           schoolId,
//           topics: manualTopics
//         });
        
//         if (res.success) {
//           toast.success("Subject integrated successfully.");
//           setIsAdding(false);
//           setForm({ name: '', gradeIds: [] });
//           setManualTopics([]);
          
//           // Refresh list safely
//           const refresh = await getCourseCatalogue(schoolId);
//           if (refresh.success && refresh.data) {
//              setCourses(refresh.data as CatalogueCourse[]);
//           }
//         } else {
//           // ✅ FIX: Type-safe error property access
//           const errorMessage = ('error' in res) ? res.error : "Deployment failed";
//           toast.error(errorMessage);
//         }
//       } catch (err) {
//         toast.error(getErrorMessage(err));
//       }
//     });
//   };

//   if (!profile) return null;

//   return (
//     <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
//       {/* ── Header ── */}
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Registry Control</h1>
//           <p className="text-slate-500 text-sm mt-2">Manage curriculum library and syllabus distribution.</p>
//         </div>
//         <div className="flex gap-3">
//             <button 
//                 onClick={downloadSyllabusTemplate}
//                 className="bg-slate-900 border border-white/10 text-slate-400 hover:text-white px-6 py-4 rounded-2xl transition-all text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
//             >
//                 <Download className="w-4 h-4" /> Topic Template
//             </button>
//             <button 
//                 onClick={() => setIsAdding(true)}
//                 className="bg-school-primary text-school-secondary-950 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-school-primary/10 text-[10px] tracking-widest uppercase flex items-center gap-2"
//             >
//                 <Plus className="w-4 h-4" /> Add Subject
//             </button>
//         </div>
//       </header>

//       {/* ── Toolbar ── */}
//       <div className="flex flex-col lg:flex-row gap-4">
//           <div className="relative flex-1">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//               <input 
//                   placeholder="Filter institutional registry..." 
//                   className="w-full pl-12 pr-4 bg-slate-900 border border-white/5 h-14 rounded-2xl text-white focus:border-school-primary outline-none transition-all text-xs font-bold uppercase tracking-widest"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//               />
//           </div>
       
//       </div>

//       {/* ── Main Catalog Grid ── */}
//       {isLoading ? (
//         <div className="py-40 flex flex-col items-center justify-center gap-4">
//            <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-700 animate-pulse text-center">Synchronizing_Catalog...</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {filteredCourses.map(course => (
//             <Card key={course.id} className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/30 transition-all group shadow-2xl">
//               <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-school-primary transition-colors">{course.name}</h3>
//               <div className="flex flex-wrap gap-2 mt-4">
//                 {course.grades.map((g) => (
//                   <span key={g} className="text-[9px] font-black bg-slate-950 text-slate-500 px-2 py-1 rounded border border-white/5 uppercase">{g}</span>
//                 ))}
//               </div>
//               <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
//                     <CheckCircle2 className="w-3 h-3 text-emerald-500" />
//                     {course.totalTopics} Topics
//                 </span>
//                 <button className="text-[10px] font-black text-school-primary uppercase hover:underline flex items-center gap-1">
//                     Manage <ArrowRight className="h-3 w-3" />
//                 </button>
//               </div>
//             </Card>
//           ))}
//         </div>
//       )}

//       {/* ── CREATE WIZARD ── */}
//       {isAdding && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 overflow-y-auto">
//           <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-4xl shadow-2xl p-8 md:p-12 space-y-10 my-8">
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">New Course Setup</h2>
//                 <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Configure parameters and inject syllabus</p>
//               </div>
//               <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><X className="h-5 w-5"/></button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//               <div className="space-y-8">
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Official Title</label>
//                   <input 
//                     className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800"
//                     placeholder="e.g. Physics for Engineers"
//                     value={form.name}
//                     onChange={(e) => setForm({...form, name: e.target.value})}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Academic Levels</label>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
//                     {helpers?.grades.map((g) => (
//                       <button 
//                         key={g.id}
//                         type="button"
//                         onClick={() => setForm(prev => ({
//                           ...prev, 
//                           gradeIds: prev.gradeIds.includes(g.id) ? prev.gradeIds.filter(id => id !== g.id) : [...prev.gradeIds, g.id]
//                         }))}
//                         className={cn(
//                           "px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-tighter transition-all border",
//                           form.gradeIds.includes(g.id) ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : "bg-slate-950 border-white/5 text-slate-600 hover:text-slate-400"
//                         )}
//                       >
//                         {g.displayName}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="space-y-6">
//                  <div className="p-6 bg-slate-950 rounded-[2rem] border border-white/5 shadow-inner">
//                     <div className="flex items-center justify-between mb-6">
//                         <h4 className="text-[10px] font-black uppercase text-school-primary flex items-center gap-2 tracking-[0.2em]">
//                             <FileSpreadsheet className="w-4 h-4"/> Syllabus Integration
//                         </h4>
//                         <button 
//                             type="button"
//                             onClick={downloadSyllabusTemplate}
//                             className="text-[9px] font-bold text-slate-500 hover:text-school-primary transition-colors flex items-center gap-1.5 uppercase"
//                         >
//                             <Download className="w-3 h-3" /> Sample CSV
//                         </button>
//                     </div>
                    
//                     <CSVImporter 
//                       title="Upload Syllabus"
//                       description="Format: title, termIndex, weekNumber"
//                       expectedHeaders={["title", "termIndex", "weekNumber"]}
//                       onDataUpload={async (rows) => {
//                         const formatted: TopicInput[] = rows.map((r) => ({
//                           title: String(r.title),
//                           termIndex: parseInt(String(r.termIndex)),
//                           weekNumber: r.weekNumber ? parseInt(String(r.weekNumber)) : undefined
//                         }));
//                         setManualTopics(formatted);
//                         toast.success(`${rows.length} topics parsed.`);
//                       }}
//                     />

//                     <div className="mt-4 p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
//                         <div className="flex items-center gap-2">
//                             <Info className="h-3 w-3 text-slate-500" />
//                             <span className="text-[9px] font-black text-slate-500 uppercase">Logic rules</span>
//                         </div>
//                         <p className="text-[9px] text-slate-600 leading-relaxed italic">
//                             TermIndex: 1 = First Term, 2 = Second, 3 = Third. Ensure weekNumber is between 1 and 12.
//                         </p>
//                     </div>
                    
//                     {manualTopics.length > 0 && (
//                       <div className="mt-6 flex items-center gap-2 text-emerald-500 bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10">
//                         <Check className="h-4 w-4" />
//                         <span className="text-[10px] font-black uppercase tracking-widest">{manualTopics.length} Topics Staged</span>
//                       </div>
//                     )}
//                  </div>
//               </div>
//             </div>

//             <button 
//               disabled={isPending || !form.name || form.gradeIds.length === 0}
//               onClick={handleCreate}
//               className="w-full bg-school-primary text-school-secondary-950 font-black py-6 rounded-[2rem] shadow-2xl hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-20 uppercase tracking-[0.2em] text-xs"
//             >
//               {isPending ? <Loader2 className="animate-spin h-5 w-5"/> : <Save className="w-5 h-5"/>}
//               Finalize and Deploy Course
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect, useTransition, useMemo } from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { getCourseCatalogue } from "@/app/actions/course-catalogue";
// import { createSubjectWithSyllabus, type TopicInput, type GradeConfig } from "@/app/actions/course-catalogue";
// import { getManagementHelpers, type ManagementHelpers } from "@/app/actions/class-management";
// import { SyllabusDrawer } from "@/components/admin-dasboard/topicDisplayDrawer";
// import { 
//   Plus, Save, Loader2, 
//   X, GraduationCap, Search,
//   ArrowRight, Download, Info
// } from "lucide-react";
// import { toast } from "sonner";
// import { Card } from "@/components/ui/card";
// import { CSVImporter } from "@/components/shared/CSVImporter";
// import { getErrorMessage } from "@/lib/error-handler";
// import { cn } from "@/lib/utils";

// interface CatalogueCourse {
//   id: string;
//   name: string;
//   grades: string[];
//   totalTopics: number;
// }

// export default function SubjectRegistryPage() {
//   const { profile } = useProfileStore();
//   const [courses, setCourses] = useState<CatalogueCourse[]>([]);
//   const [helpers, setHelpers] = useState<ManagementHelpers | null>(null);
//   const [isAdding, setIsAdding] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isPending, startTransition] = useTransition();

//   // --- Wizard State ---
//   const [subjectName, setSubjectName] = useState("");
//   const [configs, setConfigs] = useState<GradeConfig[]>([]);
//   const [activeGradeId, setActiveGradeId] = useState<string>("");
//   const [currentTopics, setCurrentTopics] = useState<TopicInput[]>([]);
  
//   // Manual Topic Fields
//   const [manualTitle, setManualTitle] = useState("");
//   const [manualDesc, setManualDesc] = useState("");
//   const [manualWeek, setManualWeek] = useState<string>("");
//   const [manualTerm, setManualTerm] = useState(1);

//   // Topic display drawer
//   const [viewingSyllabus, setViewingSyllabus] = useState<any>(null);

//   const [searchQuery, setSearchQuery] = useState("");

//   useEffect(() => {
//     async function loadData() {
//         if (!profile?.schoolId) return;
//         setIsLoading(true);
//         try {
//             const [catRes, helperRes] = await Promise.all([
//                 getCourseCatalogue(profile.schoolId),
//                 getManagementHelpers(profile.schoolId)
//             ]);
//             if (catRes.success) setCourses((catRes.data as CatalogueCourse[]) ?? []);
//             setHelpers(helperRes);
//         } finally {
//             setIsLoading(false);
//         }
//     }
//     loadData();
//   }, [profile?.schoolId]);

//   const downloadTemplate = () => {
//     const headers = "title,termIndex,weekNumber,description";
//     const row = "Photosynthesis,1,4,Detailed study of light and dark reactions in plants";
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
//     // Reset fields
//     setManualTitle(""); setManualDesc(""); setManualWeek("");
//   };

//   const stageGradeConfig = () => {
//     if (!activeGradeId) return toast.error("Select a grade level first.");
//     if (currentTopics.length === 0) return toast.error("Provide at least one topic.");
//     setConfigs([...configs, { gradeId: activeGradeId, topics: currentTopics }]);
//     setActiveGradeId("");
//     setCurrentTopics([]);
//     toast.success("Syllabus staged for deployment.");
//   };

//   const handleFinalDeploy = () => {
//     if (!subjectName || configs.length === 0) return toast.error("Registry parameters incomplete.");
//     startTransition(async () => {
//       try {
//         const res = await createSubjectWithSyllabus({
//             name: subjectName,
//             schoolId: profile!.schoolId!,
//             configs: configs
//         });
//         if (res.success) {
//           toast.success("Institutional Registry Updated");
//           setIsAdding(false);
//           setConfigs([]);
//           setSubjectName("");
//           // Full list reload
//           const refresh = await getCourseCatalogue(profile!.schoolId!);
//           if (refresh.success) setCourses((refresh.data as CatalogueCourse[]) ?? []);
//         } else {
//           toast.error(('error' in res) ? res.error : "Deployment failed");
//         }
//       } catch (err) {
//         toast.error(getErrorMessage(err));
//       }
//     });
//   };

//   const filtered = useMemo(() => courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), [courses, searchQuery]);

//   if (!profile) return null;

//   return (
//     <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
      
//       {/* ── Page Header ── */}
//       <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//         <div>
//           <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Subject Registry</h1>
//           <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Manage course infrastructure and academic syllabus distribution.</p>
//         </div>
//         <button onClick={() => setIsAdding(true)} className="bg-school-primary text-school-secondary-950 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-school-primary/10 text-[10px] tracking-widest uppercase flex items-center gap-2">
//           <Plus className="w-4 h-4" /> Initialize Subject
//         </button>
//       </header>

//       {/* ── Search ── */}
//       <div className="relative max-w-xl">
//           <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//           <input 
//             placeholder="Search catalog index..." 
//             className="w-full bg-slate-900 border border-white/5 h-12 rounded-2xl pl-12 text-white outline-none focus:border-school-primary transition-all text-xs font-bold uppercase tracking-widest"
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//           />
//       </div>

//       {/* ── Main Catalog Grid ── */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {isLoading ? (
//             <div className="col-span-full py-40 flex justify-center"><Loader2 className="animate-spin text-school-primary h-10 w-10" /></div>
//         ) : filtered.map(course => (
//           <Card key={course.id} className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/30 transition-all group shadow-2xl">
//             <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-school-primary transition-colors">{course.name}</h3>
//             <div className="flex flex-wrap gap-2 mt-4">
//               {course.grades.map((g) => (
//                 <span key={g} className="text-[9px] font-black bg-slate-950 text-slate-500 px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">{g}</span>
//               ))}
//             </div>
//             <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
//               <span>{course.totalTopics} Syllabus Nodes</span>
//               <ArrowRight className="h-3 w-3" />
//             </div>
//           </Card>
//         ))}
//       </div>

//          {/* ── SYLLABUS DRAWER ── */}
//          {viewingSyllabus && (
//             <SyllabusDrawer 
//                 subject={viewingSyllabus} 
//                 schoolId={profile!.schoolId!} 
//                 onClose={() => setViewingSyllabus(null)} 
//             />
//         )}

//       {/* ── CREATE WIZARD MODAL ── */}
//       {isAdding && (
//         <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/98 backdrop-blur-xl p-4 overflow-y-auto py-10">
//           <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-6xl shadow-2xl p-8 md:p-12 space-y-10 animate-in zoom-in-95 duration-300">
            
//             <div className="flex justify-between items-start">
//               <div>
//                 <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Course Architect</h2>
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Sequential Academic Node Integration</p>
//               </div>
//               <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><X className="h-5 w-5"/></button>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
              
//               {/* SECTION 1: Subject Title & Grade Picker */}
//               <div className="space-y-8">
//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Master Course Title</label>
//                   <input 
//                     className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-school-primary outline-none transition-all font-bold uppercase italic shadow-inner"
//                     placeholder="e.g. CHEMISTRY"
//                     value={subjectName}
//                     onChange={(e) => setSubjectName(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-3">
//                   <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2"><GraduationCap className="h-3 w-3"/> Select Target Level</label>
//                   <div className="grid grid-cols-2 gap-2">
//                     {helpers?.grades.map((g) => {
//                         const isStaged = configs.some(c => c.gradeId === g.id);
//                         return (
//                             <button 
//                                 key={g.id}
//                                 disabled={isStaged}
//                                 onClick={() => setActiveGradeId(g.id)}
//                                 className={cn(
//                                 "px-3 py-4 rounded-xl text-[9px] font-black uppercase transition-all border",
//                                 activeGradeId === g.id ? "bg-school-primary border-school-primary text-slate-950 shadow-lg scale-105" : 
//                                 isStaged ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 cursor-default opacity-50" :
//                                 "bg-slate-950 border-white/5 text-slate-600 hover:text-slate-400"
//                                 )}
//                             >
//                                 {isStaged ? "STAGED" : g.displayName}
//                             </button>
//                         )
//                     })}
//                   </div>
//                 </div>

//                 {/* STAGED SUMMARY */}
//                 <div className="pt-6 space-y-3 border-t border-white/5">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Configuration Stack</p>
//                     <div className="space-y-2">
//                         {configs.map((c, i) => (
//                             <div key={i} className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-white/5">
//                                 <span className="text-xs font-bold text-white uppercase italic">{helpers?.grades.find(g => g.id === c.gradeId)?.displayName}</span>
//                                 <span className="text-[9px] text-school-primary font-black uppercase">{c.topics.length} Nodes</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//               </div>

//               {/* SECTION 2: Syllabus Builder */}
//               <div className="bg-slate-950 rounded-[2.5rem] border border-white/5 p-8 space-y-8 shadow-inner">
//                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
//                     <h4 className="text-xs font-black uppercase text-white tracking-widest italic flex items-center gap-2">
//                         <ListPlus className="h-4 w-4 text-school-primary" /> 
//                         Syllabus Builder: <span className="text-school-primary">{helpers?.grades.find(g => g.id === activeGradeId)?.displayName || "Registry Standby"}</span>
//                     </h4>
//                     <div className="flex gap-2">
//                          <button onClick={downloadTemplate} className="text-[9px] font-black text-slate-500 hover:text-school-primary flex items-center gap-1.5 uppercase transition-all px-3 py-2 bg-slate-900 rounded-lg border border-white/5">
//                             <Download className="h-3 w-3"/> Template
//                          </button>
//                          <CSVImporter 
//                             title="Import CSV"
//                             expectedHeaders={["title", "termIndex", "weekNumber", "description"]}
//                             onDataUpload={async (rows) => {
//                                 const formatted = rows.map(r => ({ 
//                                     title: String(r.title), 
//                                     termIndex: parseInt(String(r.termIndex)),
//                                     weekNumber: r.weekNumber ? parseInt(String(r.weekNumber)) : null,
//                                     description: r.description ? String(r.description) : null
//                                 }));
//                                 setCurrentTopics([...currentTopics, ...formatted]);
//                                 toast.success("Syllabus data appended.");
//                             }}
//                          />
//                     </div>
//                 </div>

//                 {/* ── Manual Entry Form (Improved Flow) ── */}
//                 <div className="space-y-4">
//                     {/* Row 1: Main Topic Data */}
//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//                         <div className="md:col-span-6 space-y-2">
//                             <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Topic Title</label>
//                             <input value={manualTitle} onChange={e => setManualTitle(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:border-school-primary outline-none" placeholder="e.g. Chemical Bonding" />
//                         </div>
//                         <div className="md:col-span-3 space-y-2">
//                             <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Term Index</label>
//                             <select value={manualTerm} onChange={e => setManualTerm(Number(e.target.value))} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-2 text-sm text-white outline-none">
//                                 <option value={1}>Term 1</option>
//                                 <option value={2}>Term 2</option>
//                                 <option value={3}>Term 3</option>
//                             </select>
//                         </div>
//                         <div className="md:col-span-3 space-y-2">
//                             <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Week No.</label>
//                             <input type="number" value={manualWeek} onChange={e => setManualWeek(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:border-school-primary outline-none" placeholder="1-12" />
//                         </div>
//                     </div>

//                     {/* Row 2: Description */}
//                     <div className="space-y-2">
//                         <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Extended Description (Optional)</label>
//                         <textarea value={manualDesc} onChange={e => setManualDesc(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-24 rounded-xl px-4 py-3 text-xs text-slate-300 focus:border-school-primary outline-none resize-none" placeholder="Enter lesson objectives..." />
//                     </div>

//                     {/* Row 3: Action Buttons (Now Below Description) */}
//                     <div className="flex gap-3 pt-2">
//                         <button 
//                             onClick={addManualTopic} 
//                             className="flex-1 bg-school-primary text-school-secondary-950 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-school-primary/10"
//                         >
//                             <Plus className="h-4 w-4" /> Add to Syllabus
//                         </button>
//                         <button 
//                             onClick={() => { setManualTitle(""); setManualDesc(""); setManualWeek(""); setCurrentTopics([]); }} 
//                             className="px-6 bg-slate-900 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
//                         >
//                             Clear All
//                         </button>
//                     </div>
//                 </div>

//                 {/* Staging Table */}
//                 <div className="bg-slate-950/50 rounded-2xl border border-white/5 max-h-48 overflow-y-auto scrollbar-hide shadow-inner">
//                     <table className="w-full text-left">
//                         <thead className="bg-slate-950 text-[9px] font-black uppercase text-slate-600 sticky top-0">
//                             <tr>
//                                 <th className="p-4 w-16 text-center">Week</th>
//                                 <th className="p-4">Topic Registry</th>
//                                 <th className="p-4 text-right">Term</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {currentTopics.length === 0 ? (
//                                 <tr>
//                                     <td colSpan={3} className="p-8 text-center text-slate-700 text-[10px] uppercase font-bold tracking-widest">No topics added to current level</td>
//                                 </tr>
//                             ) : currentTopics.map((t, i) => (
//                                 <tr key={i} className="text-xs text-slate-400 hover:bg-white/[0.02]">
//                                     <td className="p-4 text-center font-mono">W{t.weekNumber || "?"}</td>
//                                     <td className="p-4 font-bold text-white uppercase italic">{t.title}</td>
//                                     <td className="p-4 text-right font-black text-school-primary">T{t.termIndex}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 <div className="flex justify-between items-center pt-4">
//                     <div className="flex items-center gap-2 text-slate-600">
//                         <Info className="h-3.5 w-3.5" />
//                         <span className="text-[9px] font-bold uppercase tracking-widest">Stage configuration before switching grades</span>
//                     </div>
//                     <button 
//                         onClick={stageGradeConfig}
//                         disabled={!activeGradeId || currentTopics.length === 0}
//                         className="bg-slate-800 border border-white/10 text-white font-black px-10 py-4 rounded-2xl hover:bg-school-primary hover:text-slate-950 active:scale-95 transition-all text-[10px] tracking-widest uppercase shadow-xl disabled:opacity-20"
//                     >
//                         Stage {helpers?.grades.find(g => g.id === activeGradeId)?.displayName} syllabus <ArrowRight className="h-4 w-4 ml-2 inline" />
//                     </button>
//                 </div>
//               </div>
//             </div>

//             <button 
//               disabled={isPending || !subjectName || configs.length === 0}
//               onClick={handleFinalDeploy}
//               className="w-full bg-slate-800 border border-school-primary/30 text-white font-black py-8 rounded-[2.5rem] shadow-2xl hover:bg-school-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 disabled:opacity-20 uppercase tracking-[0.4em] text-sm"
//             >
//               {isPending ? <Loader2 className="animate-spin h-6 w-6"/> : <Save className="w-6 h-6"/>}
//               Finalize Institutional Registry Deployment
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Generic helper icon component ──
// function ListPlus({ className }: { className?: string }) {
//     return <ListPlusIcon className={className} />
// }
// import { ListPlus as ListPlusIcon } from "lucide-react";



"use client";

import { useState, useEffect, useTransition, useMemo } from "react";
import { useProfileStore } from "@/store/profileStore";
import { getCourseCatalogue } from "@/app/actions/course-catalogue";
import { createSubjectWithSyllabus, type TopicInput, type GradeConfig } from "@/app/actions/course-catalogue";
import { getManagementHelpers, type ManagementHelpers } from "@/app/actions/class-management";
import { SyllabusDrawer } from "@/components/admin-dasboard/topicDisplayDrawer";
import { 
  Plus, Save, Loader2, 
  X, GraduationCap, Search,
  ArrowRight, Download, Info, ListPlus
} from "lucide-react";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { CSVImporter } from "@/components/shared/CSVImporter";
import { getErrorMessage } from "@/lib/error-handler";
import { cn } from "@/lib/utils";

// ── Types ──────────────────────────────────────────────────────────────────────

interface CatalogueCourse {
  id: string;
  name: string;
  grades: string[];
  totalTopics: number;
}

type ParsedCSVRow = Record<string, string>;

export default function SubjectRegistryPage() {
  const { profile } = useProfileStore();
  const [courses, setCourses] = useState<CatalogueCourse[]>([]);
  const [helpers, setHelpers] = useState<ManagementHelpers | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  // --- Wizard State ---
  const [subjectName, setSubjectName] = useState("");
  const [configs, setConfigs] = useState<GradeConfig[]>([]);
  const [activeGradeId, setActiveGradeId] = useState<string>("");
  const [currentTopics, setCurrentTopics] = useState<TopicInput[]>([]);
  
  // Manual Topic Fields
  const [manualTitle, setManualTitle] = useState("");
  const [manualDesc, setManualDesc] = useState("");
  const [manualWeek, setManualWeek] = useState<string>("");
  const [manualTerm, setManualTerm] = useState(1);

  // Topic display drawer
  const [viewingSyllabus, setViewingSyllabus] = useState<CatalogueCourse | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  // 1. Initial Load
  useEffect(() => {
    async function loadData() {
        if (!profile?.schoolId) return;
        setIsLoading(true);
        try {
            const [catRes, helperRes] = await Promise.all([
                getCourseCatalogue(profile.schoolId),
                getManagementHelpers(profile.schoolId)
            ]);
            if (catRes.success) setCourses((catRes.data as CatalogueCourse[]) ?? []);
            setHelpers(helperRes);
        } finally {
            setIsLoading(false);
        }
    }
    loadData();
  }, [profile?.schoolId]);

  // 2. CSV Template logic
  const downloadTemplate = () => {
    const headers = "title,termIndex,weekNumber,description";
    const row = "Photosynthesis,1,4,Detailed study of light and dark reactions in plants";
    const blob = new Blob([`${headers}\n${row}`], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "syllabus_template.csv";
    link.click();
  };

  // 3. Handlers
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
    toast.success("Syllabus staged for deployment.");
  };

  const handleFinalDeploy = () => {
    if (!subjectName || configs.length === 0) return toast.error("Registry parameters incomplete.");
    startTransition(async () => {
      try {
        const res = await createSubjectWithSyllabus({
            name: subjectName,
            schoolId: profile!.schoolId!,
            configs: configs
        });
        if (res.success) {
          toast.success("Institutional Registry Updated");
          setIsAdding(false);
          setConfigs([]);
          setSubjectName("");
          const refresh = await getCourseCatalogue(profile!.schoolId!);
          if (refresh.success) setCourses((refresh.data as CatalogueCourse[]) ?? []);
        } else {
          toast.error(('error' in res) ? res.error : "Deployment failed");
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    });
  };

  const filtered = useMemo(() => courses.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())), [courses, searchQuery]);

  if (!profile) return null;

  return (
    <div className="p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50 font-sans">
      
      {/* ── Page Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Subject Registry</h1>
          <p className="text-slate-500 text-sm mt-2 font-medium tracking-wide">Manage course infrastructure and syllabus distribution.</p>
        </div>
        <button onClick={() => setIsAdding(true)} className="bg-school-primary text-school-secondary-950 font-black px-8 py-4 rounded-2xl hover:scale-105 transition-all shadow-xl shadow-school-primary/10 text-[10px] tracking-widest uppercase flex items-center gap-2">
          <Plus className="w-4 h-4" /> Initialize Subject
        </button>
      </header>

      {/* ── Search ── */}
      <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
          <input 
            placeholder="Search catalog index..." 
            className="w-full bg-slate-900 border border-white/5 h-12 rounded-2xl pl-12 text-white outline-none focus:border-school-primary transition-all text-xs font-bold uppercase tracking-widest"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
      </div>

      {/* ── Main Catalog Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
            <div className="col-span-full py-40 flex justify-center"><Loader2 className="animate-spin text-school-primary h-10 w-10" /></div>
        ) : filtered.map(course => (
          <Card key={course.id} onClick={() => setViewingSyllabus(course)} className="bg-slate-900 border-white/5 rounded-[2rem] p-8 hover:border-school-primary/30 transition-all group shadow-2xl cursor-pointer">
            <h3 className="text-xl font-black text-white uppercase italic leading-tight group-hover:text-school-primary transition-colors">{course.name}</h3>
            <div className="flex flex-wrap gap-2 mt-4">
              {course.grades.map((g) => (
                <span key={g} className="text-[9px] font-black bg-slate-950 text-slate-500 px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">{g}</span>
              ))}
            </div>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400">
              <span>{course.totalTopics} Syllabus Nodes</span>
              <ArrowRight className="h-3 w-3" />
            </div>
          </Card>
        ))}
      </div>

      {/* ── SYLLABUS DRAWER ── */}
      {viewingSyllabus && (
          <SyllabusDrawer 
              subject={viewingSyllabus} 
              schoolId={profile!.schoolId!} 
              onClose={() => setViewingSyllabus(null)} 
          />
      )}

      {/* ── CREATE WIZARD MODAL ── */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/98 backdrop-blur-xl p-4 overflow-y-auto py-20">
          <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-6xl shadow-2xl p-8 md:p-12 space-y-10 animate-in zoom-in-95 duration-300">
            
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Course Architect</h2>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2 italic">Sequential Academic Node Integration</p>
              </div>
              <button onClick={() => setIsAdding(false)} className="p-3 bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all"><X className="h-5 w-5"/></button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-10">
              {/* SECTION 1: Subject & Grade Selection */}
              <div className="space-y-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Master Title</label>
                  <input 
                    className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-5 text-white focus:border-school-primary outline-none transition-all font-bold uppercase italic"
                    placeholder="e.g. FURTHER MATHEMATICS"
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2"><GraduationCap className="h-3 w-3"/> Select Level</label>
                  <div className="grid grid-cols-2 gap-2">
                    {helpers?.grades.map((g) => {
                        const isStaged = configs.some(c => c.gradeId === g.id);
                        return (
                            <button 
                                key={g.id}
                                disabled={isStaged}
                                onClick={() => setActiveGradeId(g.id)}
                                className={cn(
                                "px-3 py-4 rounded-xl text-[9px] font-black uppercase transition-all border",
                                activeGradeId === g.id ? "bg-school-primary border-school-primary text-slate-950 shadow-lg scale-105" : 
                                isStaged ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 cursor-default opacity-50" :
                                "bg-slate-950 border-white/5 text-slate-600 hover:text-slate-400"
                                )}
                            >
                                {isStaged ? "STAGED" : g.displayName}
                            </button>
                        )
                    })}
                  </div>
                </div>

                <div className="pt-6 space-y-3 border-t border-white/5">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Configuration Stack</p>
                    <div className="space-y-2">
                        {configs.map((c, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-800/40 p-3 rounded-xl border border-white/5">
                                <span className="text-xs font-bold text-white uppercase italic">{helpers?.grades.find(g => g.id === c.gradeId)?.displayName}</span>
                                <span className="text-[9px] text-school-primary font-black uppercase">{c.topics.length} Nodes</span>
                            </div>
                        ))}
                    </div>
                </div>
              </div>

              {/* SECTION 2: Syllabus Builder */}
              <div className="bg-slate-950 rounded-[2.5rem] border border-white/5 p-8 space-y-8 shadow-inner">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
                    <h4 className="text-xs font-black uppercase text-white tracking-widest italic flex items-center gap-2">
                        <ListPlus className="h-4 w-4 text-school-primary" /> 
                        Syllabus Builder: <span className="text-school-primary">{helpers?.grades.find(g => g.id === activeGradeId)?.displayName || "Select Grade"}</span>
                    </h4>
                    <div className="flex gap-2">
                         <button onClick={downloadTemplate} className="text-[9px] font-black text-slate-500 hover:text-school-primary flex items-center gap-1.5 uppercase transition-all px-3 py-2 bg-slate-900 rounded-lg border border-white/5">
                            <Download className="h-3 w-3"/> Template
                         </button>
                         <CSVImporter 
                            title="CSV Link"
                            expectedHeaders={["title", "termIndex", "weekNumber", "description"]}
                            // ✅ FIXED: Strictly typed rows to Record<string, string>[] to resolve Type Error
                            onDataUpload={async (rows: ParsedCSVRow[]) => {
                                const formatted = rows.map(r => ({ 
                                    title: String(r.title), 
                                    termIndex: parseInt(String(r.termIndex)),
                                    weekNumber: r.weekNumber ? parseInt(String(r.weekNumber)) : null,
                                    description: r.description ? String(r.description) : null
                                }));
                                setCurrentTopics([...currentTopics, ...formatted]);
                                toast.success("CSV Syllabus Appended");
                            }}
                         />
                    </div>
                </div>

                {/* Manual Entry Form */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-6 space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Topic Title</label>
                            <input value={manualTitle} onChange={e => setManualTitle(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:border-school-primary outline-none" placeholder="e.g. Chemical Bonding" />
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Term</label>
                            <select value={manualTerm} onChange={e => setManualTerm(Number(e.target.value))} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-2 text-sm text-white outline-none">
                                <option value={1}>1st Term</option>
                                <option value={2}>2nd Term</option>
                                <option value={3}>3rd Term</option>
                            </select>
                        </div>
                        <div className="md:col-span-3 space-y-2">
                            <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Week No.</label>
                            <input type="number" value={manualWeek} onChange={e => setManualWeek(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-11 rounded-xl px-4 text-sm text-white focus:border-school-primary outline-none" placeholder="1-12" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">Description (Optional)</label>
                        <textarea value={manualDesc} onChange={e => setManualDesc(e.target.value)} className="w-full bg-slate-900 border border-white/10 h-24 rounded-xl px-4 py-3 text-xs text-slate-300 focus:border-school-primary outline-none resize-none" placeholder="Enter lesson objectives..." />
                    </div>

                    {/* ✅ FIXED: Buttons now below Description */}
                    <div className="flex gap-3 pt-2">
                        <button 
                            onClick={addManualTopic} 
                            className="flex-1 bg-school-primary text-school-secondary-950 rounded-xl h-12 font-black text-[10px] uppercase tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg"
                        >
                            <Plus className="h-4 w-4" /> Add Topic
                        </button>
                        <button 
                            onClick={() => { setManualTitle(""); setManualDesc(""); setManualWeek(""); setCurrentTopics([]); }} 
                            className="px-6 bg-slate-900 text-red-500 rounded-xl border border-red-500/20 hover:bg-red-500 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                            Clear
                        </button>
                    </div>
                </div>

                <div className="bg-slate-950/50 rounded-2xl border border-white/5 max-h-48 overflow-y-auto scrollbar-hide shadow-inner">
                    <table className="w-full text-left">
                        <thead className="bg-slate-950 text-[9px] font-black uppercase text-slate-600 sticky top-0">
                            <tr>
                                <th className="p-4 w-16 text-center">Week</th>
                                <th className="p-4">Topic Registry</th>
                                <th className="p-4 text-right">Term</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {currentTopics.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="p-8 text-center text-slate-700 text-[10px] uppercase font-bold tracking-widest">No topics added to current level</td>
                                </tr>
                            ) : currentTopics.map((t, i) => (
                                <tr key={i} className="text-xs text-slate-400 hover:bg-white/[0.02]">
                                    <td className="p-4 text-center font-mono">W{t.weekNumber || "?"}</td>
                                    <td className="p-4 font-bold text-white uppercase italic">{t.title}</td>
                                    <td className="p-4 text-right font-black text-school-primary">T{t.termIndex}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center pt-4">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Info className="h-3.5 w-3.5" />
                        <span className="text-[10px] font-bold uppercase tracking-widest italic">Stage config before switching grades</span>
                    </div>
                    <button 
                        onClick={stageGradeConfig}
                        disabled={!activeGradeId || currentTopics.length === 0}
                        className="bg-slate-800 border border-white/10 text-white font-black px-10 py-4 rounded-2xl hover:bg-school-primary hover:text-slate-950 active:scale-95 transition-all text-[10px] tracking-widest uppercase shadow-xl disabled:opacity-20"
                    >
                        Stage {helpers?.grades.find(g => g.id === activeGradeId)?.displayName} syllabus <ArrowRight className="h-4 w-4 ml-2 inline" />
                    </button>
                </div>
              </div>
            </div>

            <button 
              disabled={isPending || !subjectName || configs.length === 0}
              onClick={handleFinalDeploy}
              className="w-full bg-slate-800 border border-school-primary/30 text-white font-black py-8 rounded-[2.5rem] shadow-2xl hover:bg-school-primary hover:text-slate-950 transition-all flex items-center justify-center gap-4 disabled:opacity-20 uppercase tracking-[0.4em] text-sm"
            >
              {isPending ? <Loader2 className="animate-spin h-6 w-6"/> : <Save className="w-6 h-6"/>}
              Finalize Institutional Registry Deployment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}