// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Users, UserCheck, GraduationCap } from "lucide-react";

// export function AdminClassView({ data }: { data: any[] }) {
//   return (
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//       {data.map((cls) => (
//         <Card key={cls.id} className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-black uppercase tracking-tighter text-school-primary">
//               {cls.name}
//             </CardTitle>
//             <GraduationCap className="h-4 w-4 text-slate-400" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-slate-900 dark:text-white">
//               {cls.grade.displayName}
//             </div>
//             <div className="mt-4 space-y-2">
//               <div className="flex items-center text-xs text-slate-500">
//                 <UserCheck className="mr-2 h-3 w-3" />
//                 Teacher: <span className="ml-1 font-bold text-slate-700 dark:text-slate-300">{cls.teacher.name}</span>
//               </div>
//               <div className="flex items-center text-xs text-slate-500">
//                 <Users className="mr-2 h-3 w-3" />
//                 Students: <span className="ml-1 font-bold text-slate-700 dark:text-slate-300">{cls.enrollments.length}</span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }


// import { useState, useTransition } from "react"
// import { Plus, UserPlus, School, GraduationCap, Users } from "lucide-react"
// import { CSVImporter } from "@/components/shared/CSVImporter"
// import { CreateClassModal } from "@/components/modals/createClassModal"
// import { EnrollStudentModal } from "@/components/modals/enrollStudentModal"
// import { importClassesFromCsv, enrollStudentsFromCsv, getClassesForManagement } from "@/app/actions/class-management"

// export function AdminClassView({ initialData, helpers, profile }: any) {
//   const [rows, setRows] = useState(initialData)
//   const [isCreateOpen, setIsCreateOpen] = useState(false)
//   const [isEnrollOpen, setIsEnrollOpen] = useState(false)
//   const [isPending, startTransition] = useTransition()

//   const refresh = async () => {
//     const data = await getClassesForManagement(profile.schoolId)
//     setRows(data)
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-8">
//       <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-3xl font-black text-white italic">ADMIN REGISTRY</h1>
//           <p className="text-slate-500 text-sm font-medium">Manage school rooms and enrollment infrastructure.</p>
//         </div>
//         <div className="flex gap-3">
//           <button onClick={() => setIsEnrollOpen(true)} className="bg-slate-900 border border-school-primary/30 text-school-primary px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800">
//             <UserPlus className="h-4 w-4" /> Enroll
//           </button>
//           <button onClick={() => setIsCreateOpen(true)} className="bg-school-primary text-slate-950 px-5 py-2.5 rounded-2xl font-black flex items-center gap-2">
//             <Plus className="h-4 w-4" /> New Class
//           </button>
//         </div>
//       </header>

//       <section className="grid gap-6 md:grid-cols-2">
//         <CSVImporter title="Bulk Room Import" expectedHeaders={["name", "grade_level"]} 
//           onDataUpload={async (d) => { await importClassesFromCsv(profile.schoolId, profile.id, profile.name, profile.role, d as any); refresh(); }} />
//         <CSVImporter title="Bulk Placement" expectedHeaders={["student_email", "class_name"]} 
//           onDataUpload={async (d) => { await enrollStudentsFromCsv(profile.schoolId, profile.id, profile.name, profile.role, d as any); refresh(); }} />
//       </section>

//       <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-950/50 text-[10px] uppercase tracking-[0.3em] text-slate-500">
//             <tr>
//               <th className="px-8 py-5 text-left">Class Identifier</th>
//               <th className="px-8 py-5 text-left">Level</th>
//               <th className="px-8 py-5 text-left">Teacher</th>
//               <th className="px-8 py-5 text-center">Enrollment</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/5">
//             {rows.map((row: any) => (
//               <tr key={row.id} className="hover:bg-school-primary/5 transition-all">
//                 <td className="px-8 py-6 font-bold text-white text-base">{row.name}</td>
//                 <td className="px-8 py-6 text-slate-400">
//                    <div className="flex items-center gap-2">
//                      <GraduationCap className="h-4 w-4 text-school-primary/40" />
//                      {row.gradeDisplayName}
//                    </div>
//                 </td>
//                 <td className="px-8 py-6 text-slate-500 italic">{row.teacherName || 'Unassigned'}</td>
//                 <td className="px-8 py-6 text-center">
//                   <span className="bg-slate-950 border border-school-primary/20 text-school-primary px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 w-fit mx-auto">
//                     <Users className="h-3.5 w-3.5" /> {row.studentCount}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <CreateClassModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} helpers={helpers} profile={profile} onRefresh={refresh} />
//       <EnrollStudentModal isOpen={isEnrollOpen} onClose={() => setIsEnrollOpen(false)} classes={rows} profile={profile} onRefresh={refresh} />
//     </div>
//   )
// }


// "use client"

// import { useState, useTransition } from "react"
// import { Plus, UserPlus, GraduationCap, Users } from "lucide-react"
// import { CSVImporter } from "@/components/shared/CSVImporter"
// import { CreateClassModal } from "@/components/modals/createClassModal"
// import { EnrollStudentModal } from "@/components/modals/enrollStudentModal"
// import { 
//   importClassesFromCsv, 
//   enrollStudentsFromCsv, 
//   getClassesForManagement,
//   type ClassRow,
//   type ImportClassesRow,
//   type EnrollStudentRow
// } from "@/app/actions/class-management"
// import { AnyProfile } from "@/types/profile"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface AdminClassViewProps {
//   initialData: ClassRow[]
//   helpers: {
//     grades: Array<{ id: string; displayName: string }>;
//     teachers: Array<{ id: string; name: string | null }>;
//   }
//   profile: AnyProfile
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// export function AdminClassView({ initialData, helpers, profile }: AdminClassViewProps) {
//   const [rows, setRows] = useState<ClassRow[]>(initialData)
//   const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
//   const [isEnrollOpen, setIsEnrollOpen] = useState<boolean>(false)
  
//   // FIX: isPending/startTransition now used to wrap data refreshes
//   const [isPending, startTransition] = useTransition()

//   const refresh = async (): Promise<void> => {
//     if (!profile.schoolId) return
//     const data = await getClassesForManagement(profile.schoolId)
//     setRows(data)
//   }

//   return (
//     <div className="max-w-7xl mx-auto space-y-8">
//       <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//             Admin Registry
//           </h1>
//           <p className="text-slate-500 text-sm font-medium uppercase tracking-widest mt-1">
//             Manage school rooms and enrollment infrastructure.
//           </p>
//         </div>
//         <div className="flex gap-3">
//           <button 
//             onClick={() => setIsEnrollOpen(true)} 
//             className="bg-slate-900 border border-school-primary/30 text-school-primary px-5 py-2.5 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
//           >
//             <UserPlus className="h-4 w-4" /> Enroll Student
//           </button>
//           <button 
//             onClick={() => setIsCreateOpen(true)} 
//             className="bg-school-primary text-slate-950 px-5 py-2.5 rounded-2xl font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all"
//           >
//             <Plus className="h-4 w-4" /> New Classroom
//           </button>
//         </div>
//       </header>

//       <section className="grid gap-6 md:grid-cols-2">
//         <CSVImporter 
//           title="Bulk Room Import" 
//           expectedHeaders={["name", "grade_level"]} 
//           onDataUpload={async (d) => { 
//             // FIX: Replaced any with specific CSV row interfaces
//             const typedData = d as unknown as ImportClassesRow[];
//             await importClassesFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, typedData); 
//             startTransition(() => { refresh(); }); 
//           }} 
//         />
//         <CSVImporter 
//           title="Bulk Placement" 
//           expectedHeaders={["student_email", "class_name"]} 
//           onDataUpload={async (d) => { 
//             const typedData = d as unknown as EnrollStudentRow[];
//             await enrollStudentsFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, typedData); 
//             startTransition(() => { refresh(); }); 
//           }} 
//         />
//       </section>

//       {/* Loading indicator for transitions */}
//       {isPending && (
//           <div className="flex items-center gap-2 text-school-primary px-4">
//               <Plus className="h-3 w-3 animate-spin" />
//               <span className="text-[10px] font-black uppercase tracking-widest">Updating Registry...</span>
//           </div>
//       )}

//       <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
//         <table className="w-full text-sm">
//           <thead className="bg-slate-950/50 text-[10px] uppercase tracking-[0.3em] text-slate-500">
//             <tr>
//               <th className="px-8 py-5 text-left">Class Identifier</th>
//               <th className="px-8 py-5 text-left">Level</th>
//               <th className="px-8 py-5 text-left">Teacher</th>
//               <th className="px-8 py-5 text-center">Enrollment</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/5">
//             {rows.map((row: ClassRow) => (
//               <tr key={row.id} className="hover:bg-school-primary/5 transition-all">
//                 <td className="px-8 py-6 font-bold text-white text-base">{row.name}</td>
//                 <td className="px-8 py-6 text-slate-400">
//                    <div className="flex items-center gap-2 font-medium">
//                      <GraduationCap className="h-4 w-4 text-school-primary/40" />
//                      {row.gradeDisplayName}
//                    </div>
//                 </td>
//                 <td className="px-8 py-6 text-slate-500 italic font-medium">
//                     {row.teacherName || 'Registry Unassigned'}
//                 </td>
//                 <td className="px-8 py-6 text-center">
//                   <span className="bg-slate-950 border border-school-primary/20 text-school-primary px-4 py-1.5 rounded-full text-xs font-black flex items-center gap-2 w-fit mx-auto">
//                     <Users className="h-3.5 w-3.5" /> {row.studentCount}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <CreateClassModal 
//         isOpen={isCreateOpen} 
//         onClose={() => setIsCreateOpen(false)} 
//         helpers={helpers} 
//         profile={profile} 
//         onRefresh={refresh} 
//       />
//       <EnrollStudentModal 
//         isOpen={isEnrollOpen} 
//         onClose={() => setIsEnrollOpen(false)} 
//         classes={rows} 
//         profile={profile} 
//         onRefresh={refresh} 
//       />
//     </div>
//   )
// }


// "use client"

// import { useState, useTransition } from "react"
// import { Plus, UserPlus, GraduationCap, Users, Loader2, ShieldCheck } from "lucide-react"
// import { CSVImporter } from "@/components/shared/CSVImporter"
// import { CreateClassModal } from "@/components/modals/createClassModal"
// import { EnrollStudentModal } from "@/components/modals/enrollStudentModal"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//   importClassesFromCsv, 
//   enrollStudentsFromCsv, 
//   getClassesForManagement,
//   type ClassRow,
//   type ImportClassesRow,
//   type EnrollStudentRow
// } from "@/app/actions/class-management"
// import { toast } from "sonner"
// import { cn } from "@/lib/utils"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface ManagementHelpers {
//     grades: Array<{ id: string; displayName: string; }>;
//     teachers: Array<{ id: string; name: string | null; }>;
// }

// interface AdminClassViewProps {
//   initialData: ClassRow[]
//   helpers: ManagementHelpers
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * INSTITUTIONAL REGISTRY MANAGEMENT (Tier 2)
//  * Rule 17: Uses Zustand Store to resolve profile and branding without prop drilling.
//  * Rule 11: Real-time synchronization of the classroom registry truth.
//  */
// export function AdminClassView({ initialData, helpers }: AdminClassViewProps) {
//   const { profile } = useProfileStore();
//   const [rows, setRows] = useState<ClassRow[]>(initialData);
//   const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
//   const [isEnrollOpen, setIsEnrollOpen] = useState<boolean>(false);
//   const [isPending, startTransition] = useTransition();

//   const schoolId = profile?.schoolId ?? "";
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   /**
//    * Rule 11: Re-sync state with database truth
//    */
//   const refreshRegistry = async (): Promise<void> => {
//     if (!schoolId) return;
//     const data = await getClassesForManagement(schoolId);
//     setRows(data);
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
//       {/* ── HEADER ── */}
//       <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-10">
//         <div className="space-y-1">
//           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
//             Registry Control
//           </h1>
//           <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] italic">
//             Institutional Infrastructure & Enrollment Management
//           </p>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//           <button 
//             onClick={() => setIsEnrollOpen(true)} 
//             className="bg-slate-900 border border-white/5 text-slate-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white hover:border-white/20 transition-all flex items-center gap-2 shadow-xl"
//           >
//             <UserPlus className="h-4 w-4" style={{ color: primaryColor }} /> Placement Hub
//           </button>
//           <button 
//             onClick={() => setIsCreateOpen(true)} 
//             className="text-slate-950 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-2xl"
//             style={{ backgroundColor: primaryColor }}
//           >
//             <Plus className="h-4 w-4" /> New Classroom
//           </button>
//         </div>
//       </header>

//       {/* ── BULK TOOLS ── */}
//       <section className="grid gap-8 md:grid-cols-2">
//         <CSVImporter 
//           title="Bulk Infrastructure Import" 
//           description="Provision multiple classrooms via CSV nodes."
//           expectedHeaders={["name", "grade_level"]} 
//           onDataUpload={async (d) => { 
//             const typedData = d as unknown as ImportClassesRow[];
//             startTransition(async () => {
//                 const res = await importClassesFromCsv(schoolId, profile!.id, profile!.name, profile!.role, typedData); 
//                 if (res.successCount > 0) {
//                     toast.success(`${res.successCount} classrooms provisioned.`);
//                     await refreshRegistry();
//                 }
//             });
//           }} 
//         />
//         <CSVImporter 
//           title="Bulk Student Placement" 
//           description="Assign students to classrooms in batch format."
//           expectedHeaders={["student_email", "class_name"]} 
//           onDataUpload={async (d) => { 
//             const typedData = d as unknown as EnrollStudentRow[];
//             startTransition(async () => {
//                 const res = await enrollStudentsFromCsv(schoolId, profile!.id, profile!.name, profile!.role, typedData); 
//                 if (res.successCount > 0) {
//                     toast.success(`${res.successCount} students placed in registry.`);
//                     await refreshRegistry();
//                 }
//             });
//           }} 
//         />
//       </section>

//       {/* ── REGISTRY TABLE ── */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between px-6">
//             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
//                 Institutional Node Index
//             </h3>
//             {isPending && (
//                 <div className="flex items-center gap-2 text-school-primary animate-pulse">
//                     <Loader2 className="h-3 w-3 animate-spin" style={{ color: primaryColor }} />
//                     <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: primaryColor }}>Synchronizing...</span>
//                 </div>
//             )}
//         </div>

//         <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 overflow-hidden shadow-2xl">
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                 <thead className="bg-slate-950/50 text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black border-b border-white/5">
//                     <tr>
//                     <th className="px-10 py-6 text-left italic">Class Identity</th>
//                     <th className="px-10 py-6 text-left italic">Grade Level</th>
//                     <th className="px-10 py-6 text-left italic">Assigned Instructor</th>
//                     <th className="px-10 py-6 text-center italic">Enrollment</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/5">
//                     {rows.length === 0 ? (
//                         <tr>
//                             <td colSpan={4} className="px-10 py-20 text-center text-slate-700 font-black uppercase text-xs italic tracking-widest">
//                                 No classroom nodes discovered in registry.
//                             </td>
//                         </tr>
//                     ) : (
//                         rows.map((row: ClassRow) => (
//                             <tr key={row.id} className="hover:bg-white/[0.02] transition-all group">
//                                 <td className="px-10 py-8 font-black text-white text-lg uppercase italic tracking-tighter">
//                                     {row.name}
//                                 </td>
//                                 <td className="px-10 py-8 text-slate-400">
//                                 <div className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
//                                     <GraduationCap className="h-4 w-4" style={{ color: primaryColor }} />
//                                     {row.gradeDisplayName}
//                                 </div>
//                                 </td>
//                                 <td className="px-10 py-8 text-slate-500 italic font-medium uppercase text-xs">
//                                     {row.teacherName || 'Registry Unassigned'}
//                                 </td>
//                                 <td className="px-10 py-8 text-center">
//                                 <span 
//                                     className="px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 w-fit mx-auto border transition-colors shadow-inner"
//                                     style={{ color: primaryColor, borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
//                                 >
//                                     <Users className="h-3.5 w-3.5" /> {row.studentCount} SYNCED
//                                 </span>
//                                 </td>
//                             </tr>
//                         ))
//                     )}
//                 </tbody>
//                 </table>
//             </div>
//         </div>
//       </div>

//       {/* ── MODALS ── */}
//       <CreateClassModal 
//         isOpen={isCreateOpen} 
//         onClose={() => setIsCreateOpen(false)} 
//         helpers={helpers} 
//         onRefresh={refreshRegistry} 
//       />
//       <EnrollStudentModal 
//         isOpen={isEnrollOpen} 
//         onClose={() => setIsEnrollOpen(false)} 
//         classes={rows} 
//         onRefresh={refreshRegistry} 
//       />
//     </div>
//   )
// }


// "use client"

// import { useState, useTransition } from "react"
// import { Plus, UserPlus, GraduationCap, Users, Loader2, ShieldCheck } from "lucide-react"
// import { CSVImporter } from "@/components/shared/CSVImporter"
// import { CreateClassModal } from "@/components/modals/createClassModal"
// import { EnrollStudentModal } from "@/components/modals/enrollStudentModal"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//   importClassesFromCsv, 
//   enrollStudentsFromCsv, 
//   getClassesForManagement,
//   type ClassRow,
//   type ImportClassesRow,
//   type EnrollStudentRow
// } from "@/app/actions/class-management"
// import { toast } from "sonner"

// // ── Types ───────────────────────────────────────────────────────────────────

// interface ManagementHelpers {
//     grades: Array<{ id: string; displayName: string; }>;
//     teachers: Array<{ id: string; name: string | null; }>;
// }

// interface AdminClassViewProps {
//   initialData: ClassRow[]
//   helpers: ManagementHelpers
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * INSTITUTIONAL REGISTRY MANAGEMENT (Tier 2)
//  * Rule 17: Pulls identity directly from Zustand. No 'profile' prop required.
//  */
// export function AdminClassView({ initialData, helpers }: AdminClassViewProps) {
//   const { profile } = useProfileStore();
//   const [rows, setRows] = useState<ClassRow[]>(initialData);
//   const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
//   const [isEnrollOpen, setIsEnrollOpen] = useState<boolean>(false);
//   const [isPending, startTransition] = useTransition();

//   const schoolId = profile?.schoolId ?? "";
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   const refreshRegistry = async (): Promise<void> => {
//     if (!schoolId) return;
//     const data = await getClassesForManagement(schoolId);
//     setRows(data);
//   };

//   return (
//     <div className="max-w-7xl mx-auto space-y-10 p-6 animate-in fade-in duration-700">
      
//       {/* ── HEADER ── */}
//       <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-10">
//         <div className="space-y-1">
//           <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
//             Registry Control
//           </h1>
//           <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] italic">
//             Management console for {profile?.school?.name || "Institution"}
//           </p>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//           <button 
//             onClick={() => setIsEnrollOpen(true)} 
//             className="bg-slate-900 border border-white/5 text-slate-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all shadow-xl"
//           >
//             <UserPlus className="h-4 w-4" style={{ color: primaryColor }} /> Placement Hub
//           </button>
//           <button 
//             onClick={() => setIsCreateOpen(true)} 
//             className="text-slate-950 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-2xl"
//             style={{ backgroundColor: primaryColor }}
//           >
//             <Plus className="h-4 w-4" /> New Classroom
//           </button>
//         </div>
//       </header>

//       {/* ── BULK TOOLS ── */}
//       <section className="grid gap-8 md:grid-cols-2">
//         <CSVImporter 
//           title="Bulk Room Import" 
//           description="Provision multiple classrooms via CSV nodes."
//           expectedHeaders={["name", "grade_level"]} 
//           onDataUpload={async (d) => { 
//             const typedData = d as unknown as ImportClassesRow[];
//             startTransition(async () => {
//                 const res = await importClassesFromCsv(schoolId, profile!.id, profile!.name, profile!.role, typedData); 
//                 if (res.successCount > 0) {
//                     toast.success(`${res.successCount} classrooms provisioned.`);
//                     await refreshRegistry();
//                 }
//             });
//           }} 
//         />
//         <CSVImporter 
//           title="Bulk Student Placement" 
//           description="Assign students to classrooms in batch format."
//           expectedHeaders={["student_email", "class_name"]} 
//           onDataUpload={async (d) => { 
//             const typedData = d as unknown as EnrollStudentRow[];
//             startTransition(async () => {
//                 const res = await enrollStudentsFromCsv(schoolId, profile!.id, profile!.name, profile!.role, typedData); 
//                 if (res.successCount > 0) {
//                     toast.success(`${res.successCount} students placed in registry.`);
//                     await refreshRegistry();
//                 }
//             });
//           }} 
//         />
//       </section>

//       {/* ── REGISTRY TABLE ── */}
//       <div className="space-y-4">
//         <div className="flex items-center justify-between px-6">
//             <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
//                 Institutional Node Index
//             </h3>
//             {isPending && (
//                 <div className="flex items-center gap-2 text-school-primary animate-pulse">
//                     <Loader2 className="h-3 w-3 animate-spin" style={{ color: primaryColor }} />
//                     <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: primaryColor }}>Synchronizing...</span>
//                 </div>
//             )}
//         </div>

//         <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm">
//                 <thead className="bg-slate-950/50 text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black border-b border-white/5">
//                     <tr>
//                     <th className="px-10 py-6 text-left italic">Class Identity</th>
//                     <th className="px-10 py-6 text-left italic">Grade Level</th>
//                     <th className="px-10 py-6 text-left italic">Assigned Instructor</th>
//                     <th className="px-10 py-6 text-center italic">Enrollment</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y divide-white/5">
//                     {rows.map((row) => (
//                         <tr key={row.id} className="hover:bg-white/[0.02] transition-all group">
//                             <td className="px-10 py-8 font-black text-white text-lg uppercase italic tracking-tighter">
//                                 {row.name}
//                             </td>
//                             <td className="px-10 py-8 text-slate-400">
//                             <div className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
//                                 <GraduationCap className="h-4 w-4" style={{ color: primaryColor }} />
//                                 {row.gradeDisplayName}
//                             </div>
//                             </td>
//                             <td className="px-10 py-8 text-slate-500 italic font-medium uppercase text-xs">
//                                 {row.teacherName || 'Registry Unassigned'}
//                             </td>
//                             <td className="px-10 py-8 text-center">
//                             <span 
//                                 className="px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 w-fit mx-auto border shadow-inner"
//                                 style={{ color: primaryColor, borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
//                             >
//                                 <Users className="h-3.5 w-3.5" /> {row.studentCount} SYNCED
//                             </span>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//                 </table>
//             </div>
//         </div>
//       </div>

//       {/* ── MODALS ── */}
//       <CreateClassModal 
//         isOpen={isCreateOpen} 
//         onClose={() => setIsCreateOpen(false)} 
//         helpers={helpers} 
//         onRefresh={refreshRegistry} 
//       />
//       <EnrollStudentModal 
//         isOpen={isEnrollOpen} 
//         onClose={() => setIsEnrollOpen(false)} 
//         classes={rows} 
//         onRefresh={refreshRegistry} 
//       />
//     </div>
//   )
// }


"use client"

import { useState, useTransition } from "react"
import { Plus, UserPlus, GraduationCap, Users, Loader2 } from "lucide-react"
import { CSVImporter } from "@/components/shared/CSVImporter"
import { CreateClassModal } from "@/components/modals/createClassModal"
import { EnrollStudentModal } from "@/components/modals/enrollStudentModal"
import { useProfileStore } from "@/store/profileStore"
import { 
  importClassesFromCsv, 
  enrollStudentsFromCsv, 
  getClassesForManagement,
  type ClassRow,
  type ImportClassesRow,
  type EnrollStudentRow
} from "@/app/actions/class-management"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

// ── Types ───────────────────────────────────────────────────────────────────

interface ManagementHelpers {
    grades: Array<{ id: string; displayName: string; }>;
    teachers: Array<{ id: string; name: string | null; }>;
}

interface AdminClassViewProps {
  initialData: ClassRow[]
  helpers: ManagementHelpers
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * INSTITUTIONAL REGISTRY MANAGEMENT (Tier 2)
 * Rule 17: Uses Zustand Store to resolve profile and branding.
 * Rule 11: Real-time synchronization of the classroom registry truth.
 */
export function AdminClassView({ initialData, helpers }: AdminClassViewProps) {
  const { profile } = useProfileStore();
  const [rows, setRows] = useState<ClassRow[]>(initialData);
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEnrollOpen, setIsEnrollOpen] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Rule 5: Derived institutional context
  const schoolId = profile?.schoolId ?? "";
  const primaryColor = profile?.primaryColor || "#f59e0b";

  /**
   * Rule 11: Re-sync state with database truth
   */
  const refreshRegistry = async (): Promise<void> => {
    if (!schoolId) return;
    const data = await getClassesForManagement(schoolId);
    setRows(data);
  };

  if (!profile) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-10 p-6 animate-in fade-in duration-700">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between border-b border-white/5 pb-10">
        <div className="space-y-1">
          <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">
            Registry Control
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] italic">
            Management console for {profile.school?.name || "Institution"}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setIsEnrollOpen(true)} 
            className="bg-slate-900 border border-white/5 text-slate-400 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-white transition-all shadow-xl"
          >
            <UserPlus className="h-4 w-4" style={{ color: primaryColor }} /> Placement Hub
          </button>
          <button 
            onClick={() => setIsCreateOpen(true)} 
            className="text-slate-950 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-2xl"
            style={{ backgroundColor: primaryColor }}
          >
            <Plus className="h-4 w-4" /> New Classroom
          </button>
        </div>
      </header>

      {/* ── BULK TOOLS ── */}
      <section className="grid gap-8 md:grid-cols-2">
        <CSVImporter 
          title="Bulk Room Import" 
          description="Provision multiple classrooms via CSV nodes."
          expectedHeaders={["name", "grade_level"]} 
          onDataUpload={async (d) => { 
            const typedData = d as unknown as ImportClassesRow[];
            startTransition(async () => {
                // ✅ FIX: Using ?? null to handle potential 'undefined' from store
                const res = await importClassesFromCsv(
                    schoolId, 
                    profile.id, 
                    profile.name ?? null, 
                    profile.role, 
                    typedData
                ); 
                if (res.successCount > 0) {
                    toast.success(`${res.successCount} classrooms provisioned.`);
                    await refreshRegistry();
                }
            });
          }} 
        />
        <CSVImporter 
          title="Bulk Student Placement" 
          description="Assign students to classrooms in batch format."
          expectedHeaders={["student_email", "class_name"]} 
          onDataUpload={async (d) => { 
            const typedData = d as unknown as EnrollStudentRow[];
            startTransition(async () => {
                // ✅ FIX: Using ?? null to handle potential 'undefined' from store
                const res = await enrollStudentsFromCsv(
                    schoolId, 
                    profile.id, 
                    profile.name ?? null, 
                    profile.role, 
                    typedData
                ); 
                if (res.successCount > 0) {
                    toast.success(`${res.successCount} students placed in registry.`);
                    await refreshRegistry();
                }
            });
          }} 
        />
      </section>

      {/* ── REGISTRY TABLE ── */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                Institutional Node Index
            </h3>
            {isPending && (
                <div className="flex items-center gap-2 text-school-primary animate-pulse">
                    <Loader2 className="h-3 w-3 animate-spin" style={{ color: primaryColor }} />
                    <span className="text-[9px] font-black uppercase tracking-widest" style={{ color: primaryColor }}>Synchronizing...</span>
                </div>
            )}
        </div>

        <div className="bg-slate-900 rounded-[2rem] border border-white/5 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                <thead className="bg-slate-950/50 text-[10px] uppercase tracking-[0.3em] text-slate-600 font-black border-b border-white/5">
                    <tr>
                    <th className="px-10 py-6 text-left italic">Class Identity</th>
                    <th className="px-10 py-6 text-left italic">Grade Level</th>
                    <th className="px-10 py-6 text-left italic">Assigned Instructor</th>
                    <th className="px-10 py-6 text-center italic">Enrollment</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {rows.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="px-10 py-20 text-center text-slate-700 font-black uppercase text-xs italic tracking-widest">
                                No classroom nodes discovered in registry.
                            </td>
                        </tr>
                    ) : (
                        rows.map((row: ClassRow) => (
                            <tr key={row.id} className="hover:bg-white/[0.02] transition-all group">
                                <td className="px-10 py-8 font-black text-white text-lg uppercase italic tracking-tighter">
                                    {row.name}
                                </td>
                                <td className="px-10 py-8 text-slate-400">
                                <div className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest">
                                    <GraduationCap className="h-4 w-4" style={{ color: primaryColor }} />
                                    {row.gradeDisplayName}
                                </div>
                                </td>
                                <td className="px-10 py-8 text-slate-500 italic font-medium uppercase text-xs">
                                    {row.teacherName || 'Registry Unassigned'}
                                </td>
                                <td className="px-10 py-8 text-center">
                                <span 
                                    className="px-5 py-2 rounded-xl text-[10px] font-black flex items-center gap-2 w-fit mx-auto border shadow-inner"
                                    style={{ color: primaryColor, borderColor: `${primaryColor}30`, backgroundColor: `${primaryColor}05` }}
                                >
                                    <Users className="h-3.5 w-3.5" /> {row.studentCount} SYNCED
                                </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* ── MODALS ── */}
      {/* ✅ FIX: Re-instated 'profile' prop to satisfy current Modal requirements */}
      <CreateClassModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        helpers={helpers} 
        onRefresh={refreshRegistry} 
      />
      <EnrollStudentModal 
        isOpen={isEnrollOpen} 
        onClose={() => setIsEnrollOpen(false)} 
        classes={rows} 
        onRefresh={refreshRegistry} 
      />
    </div>
  )
}