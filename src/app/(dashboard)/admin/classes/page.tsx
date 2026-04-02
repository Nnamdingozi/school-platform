// // "use client"

// // import { useEffect, useState, useTransition } from "react"
// // import { useProfileStore } from "@/store/profileStore"
// // import { Loader2 } from "lucide-react"
// // import {
// //   ClassRow,
// //   getClassesForManagement,
// //   importClassesFromCsv,
// //   enrollStudentsFromCsv,
// // } from "@/app/actions/class-management"
// // import { CSVImporter } from "@/components/shared/CSVImporter"

// // interface ClassesState {
// //   rows: ClassRow[]
// //   isLoading: boolean
// //   error: string | null
// // }

// // export default function AdminClassesPage() {
// //   const { profile, isLoading: isProfileLoading } = useProfileStore()

// //   const [classesState, setClassesState] = useState<ClassesState>({
// //     rows: [],
// //     isLoading: true,
// //     error: null,
// //   })

// //   const [importSummary, setImportSummary] = useState<string | null>(null)
// //   const [enrollSummary, setEnrollSummary] = useState<string | null>(null)

// //   const [isImportPending, startImportTransition] = useTransition()
// //   const [isEnrollPending, startEnrollTransition] = useTransition()

// //   useEffect(() => {
// //     async function load() {
// //       if (!profile?.schoolId) return
// //       setClassesState((prev) => ({ ...prev, isLoading: true, error: null }))
// //       const data = await getClassesForManagement(profile.schoolId)
// //       setClassesState({ rows: data, isLoading: false, error: null })
// //     }
// //     if (profile?.schoolId) {
// //       load()
// //     }
// //   }, [profile?.schoolId])

// //   const isBootstrapping = isProfileLoading || !profile

// //   if (isBootstrapping) {
// //     return (
// //       <div className="min-h-screen flex flex-col items-center justify-center bg-background">
// //         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
// //         <p className="text-muted-foreground animate-pulse">
// //           Loading workspace...
// //         </p>
// //       </div>
// //     )
// //   }

// //   const { schoolId, id: actorId, name: actorName, role: actorRole } = profile

// //   async function handleClassesCsvUpload(rows: Record<string, string>[]) {
// //     if (!schoolId) return
// //     startImportTransition(async () => {
// //       const result = await importClassesFromCsv(
// //         schoolId,
// //         actorId,
// //         actorName ?? null,
// //         actorRole,
// //         rows as any
// //       )

// //       setImportSummary(
// //         `Created ${result.successCount} classes, ${result.errorCount} rows failed.`
// //       )

// //       const refreshed = await getClassesForManagement(schoolId)
// //       setClassesState({ rows: refreshed, isLoading: false, error: null })
// //     })
// //   }

// //   async function handleEnrollCsvUpload(rows: Record<string, string>[]) {
// //     if (!schoolId) return
// //     startEnrollTransition(async () => {
// //       const result = await enrollStudentsFromCsv(
// //         schoolId,
// //         actorId,
// //         actorName ?? null,
// //         actorRole,
// //         rows as any
// //       )

// //       const missing =
// //         result.missingStudents.length > 0
// //           ? ` Missing students: ${Array.from(
// //               new Set(result.missingStudents)
// //             ).join(", ")}.`
// //           : ""

// //       setEnrollSummary(
// //         `Enrolled ${result.successCount} students, ${result.errorCount} rows failed.${missing}`
// //       )

// //       const refreshed = await getClassesForManagement(schoolId)
// //       setClassesState({ rows: refreshed, isLoading: false, error: null })
// //     })
// //   }

// //   return (
// //     <div className="min-h-screen bg-background">
// //       <main className="p-4 md:p-6 lg:p-8">
// //         <div className="mx-auto max-w-7xl space-y-6">
// //           <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
// //             <div>
// //               <h1 className="text-xl font-semibold text-foreground">
// //                 Classes
// //               </h1>
// //               <p className="text-sm text-muted-foreground">
// //                 Manage classes, bulk import, and enroll students.
// //               </p>
// //             </div>
// //           </header>

// //           <section className="grid gap-4 md:grid-cols-2">
// //             <CSVImporter
// //               title="Import Classes"
// //               description="Upload classes with their grade level. Headers: name, grade_level."
// //               expectedHeaders={["name", "grade_level"]}
// //               onDataUpload={handleClassesCsvUpload}
// //             />

// //             <CSVImporter
// //               title="Enroll Students"
// //               description="Enroll students into classes by email. Headers: student_email, class_name."
// //               expectedHeaders={["student_email", "class_name"]}
// //               onDataUpload={handleEnrollCsvUpload}
// //             />
// //           </section>

// //           <section className="space-y-3">
// //             {(isImportPending || isEnrollPending || classesState.isLoading) && (
// //               <div className="flex items-center gap-2 text-xs text-muted-foreground">
// //                 <Loader2 className="h-3 w-3 animate-spin text-school-primary" />
// //                 <span>Processing changes...</span>
// //               </div>
// //             )}

// //             {importSummary && (
// //               <p className="text-xs text-school-secondary">{importSummary}</p>
// //             )}
// //             {enrollSummary && (
// //               <p className="text-xs text-school-secondary">{enrollSummary}</p>
// //             )}
// //           </section>

// //           <section className="rounded-lg border border-school-secondary/20 bg-card text-foreground">
// //             <div className="border-b border-school-secondary/20 px-4 py-3">
// //               <h2 className="text-sm font-semibold">Class overview</h2>
// //             </div>
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full text-sm">
// //                 <thead>
// //                   <tr className="bg-school-primary/5 text-xs text-muted-foreground">
// //                     <th className="px-4 py-2 text-left font-medium">Name</th>
// //                     <th className="px-4 py-2 text-left font-medium">Grade</th>
// //                     <th className="px-4 py-2 text-left font-medium">Teacher</th>
// //                     <th className="px-4 py-2 text-left font-medium">
// //                       Students
// //                     </th>
// //                   </tr>
// //                 </thead>
// //                 <tbody>
// //                   {classesState.rows.length === 0 && !classesState.isLoading ? (
// //                     <tr>
// //                       <td
// //                         colSpan={4}
// //                         className="px-4 py-6 text-center text-xs text-muted-foreground"
// //                       >
// //                         No classes found for this school.
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     classesState.rows.map((row) => (
// //                       <tr
// //                         key={row.id}
// //                         className="border-t border-school-secondary/10 hover:bg-school-primary/5 transition-colors"
// //                       >
// //                         <td className="px-4 py-2">{row.name}</td>
// //                         <td className="px-4 py-2">
// //                           {row.gradeDisplayName}
// //                         </td>
// //                         <td className="px-4 py-2">
// //                           {row.teacherName ?? "—"}
// //                         </td>
// //                         <td className="px-4 py-2">{row.studentCount}</td>
// //                       </tr>
// //                     ))
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section>
// //         </div>
// //       </main>
// //     </div>
// //   )
// // }



// // "use client"

// // import { useEffect, useState, useTransition } from "react"
// // import { useProfileStore } from "@/store/profileStore"
// // import { Loader2, Plus, Users, School, GraduationCap } from "lucide-react"
// // import {
// //   ClassRow,
// //   getClassesForManagement,
// //   importClassesFromCsv,
// //   enrollStudentsFromCsv,
// //   createSingleClass, // Assumed existing or to be added to actions
// //   getManagementHelpers, // New helper to get grades/teachers
// // } from "@/app/actions/class-management"
// // import { CSVImporter } from "@/components/shared/CSVImporter"
// // import { toast } from "sonner"

// // interface ClassesState {
// //   rows: ClassRow[]
// //   isLoading: boolean
// //   error: string | null
// // }

// // export default function AdminClassesPage() {
// //   const { profile, isLoading: isProfileLoading } = useProfileStore()

// //   // --- State ---
// //   const [classesState, setClassesState] = useState<ClassesState>({
// //     rows: [],
// //     isLoading: true,
// //     error: null,
// //   })
// //   const [helpers, setHelpers] = useState<{ grades: any[], teachers: any[] }>({
// //     grades: [],
// //     teachers: []
// //   })
  
// //   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
// //   const [newClassData, setNewClassData] = useState({ name: "", gradeId: "", teacherId: "" })

// //   const [importSummary, setImportSummary] = useState<string | null>(null)
// //   const [enrollSummary, setEnrollSummary] = useState<string | null>(null)

// //   const [isPending, startTransition] = useTransition()

// //   // --- Load Data ---
// //   useEffect(() => {
// //     async function load() {
// //       if (!profile?.schoolId) return
// //       setClassesState((prev) => ({ ...prev, isLoading: true, error: null }))
      
// //       const [classData, helperData] = await Promise.all([
// //         getClassesForManagement(profile.schoolId),
// //         getManagementHelpers(profile.schoolId)
// //       ])
      
// //       setClassesState({ rows: classData, isLoading: false, error: null })
// //       setHelpers(helperData)
// //     }
// //     if (profile?.schoolId) load()
// //   }, [profile?.schoolId])

// //   if (isProfileLoading || !profile) {
// //     return (
// //       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
// //         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
// //         <p className="text-slate-400 animate-pulse">Loading workspace...</p>
// //       </div>
// //     )
// //   }

// //   const { schoolId, id: actorId, name: actorName, role: actorRole } = profile

// //   // --- Handlers ---
// //   const handleManualCreate = async (e: React.FormEvent) => {
// //     e.preventDefault()
// //     if (!schoolId) return

// //     startTransition(async () => {
// //       const result = await createSingleClass(
// //         schoolId,
// //         actorId,
// //         actorName ?? "Admin",
// //         actorRole,
// //         newClassData
// //       )

// //       if (result.success) {
// //         toast.success("Class created successfully")
// //         setIsCreateModalOpen(false)
// //         setNewClassData({ name: "", gradeId: "", teacherId: "" })
// //         const refreshed = await getClassesForManagement(schoolId)
// //         setClassesState(prev => ({ ...prev, rows: refreshed }))
// //       } else {
// //         toast.error(result.error || "Failed to create class")
// //       }
// //     })
// //   }

// //   async function handleClassesCsvUpload(rows: Record<string, string>[]) {
// //     if (!schoolId) return
// //     startTransition(async () => {
// //       const result = await importClassesFromCsv(schoolId, actorId, actorName ?? null, actorRole, rows as any)
// //       setImportSummary(`Created ${result.successCount} classes, ${result.errorCount} failed.`)
// //       const refreshed = await getClassesForManagement(schoolId)
// //       setClassesState({ rows: refreshed, isLoading: false, error: null })
// //     })
// //   }

// //   async function handleEnrollCsvUpload(rows: Record<string, string>[]) {
// //     if (!schoolId) return
// //     startTransition(async () => {
// //       const result = await enrollStudentsFromCsv(schoolId, actorId, actorName ?? null, actorRole, rows as any)
// //       const missing = result.missingStudents.length > 0 ? ` Missing: ${Array.from(new Set(result.missingStudents)).join(", ")}` : ""
// //       setEnrollSummary(`Enrolled ${result.successCount} students.${missing}`)
// //       const refreshed = await getClassesForManagement(schoolId)
// //       setClassesState({ rows: refreshed, isLoading: false, error: null })
// //     })
// //   }

// //   return (
// //     <div className="min-h-screen bg-slate-950 text-slate-50">
// //       <main className="p-4 md:p-6 lg:p-8">
// //         <div className="mx-auto max-w-7xl space-y-6">
          
// //           {/* Header */}
// //           <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-school-secondary/20 pb-6">
// //             <div>
// //               <h1 className="text-2xl font-black tracking-tight text-white">Class Management</h1>
// //               <p className="text-sm text-slate-400">Organize your school structure and student enrollment.</p>
// //             </div>
// //             <button 
// //               onClick={() => setIsCreateModalOpen(true)}
// //               className="inline-flex items-center justify-center gap-2 bg-school-primary text-school-secondary px-4 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-95"
// //             >
// //               <Plus className="h-4 w-4" />
// //               New Class
// //             </button>
// //           </header>

// //           {/* CSV Importers Section */}
// //           <section className="grid gap-6 md:grid-cols-2">
// //             <CSVImporter
// //               title="Bulk Import Classes"
// //               description="Headers: name, grade_level"
// //               expectedHeaders={["name", "grade_level"]}
// //               onDataUpload={handleClassesCsvUpload}
// //             />
// //             <CSVImporter
// //               title="Bulk Enroll Students"
// //               description="Headers: student_email, class_name"
// //               expectedHeaders={["student_email", "class_name"]}
// //               onDataUpload={handleEnrollCsvUpload}
// //             />
// //           </section>

// //           {/* Feedback Section */}
// //           {(isPending || classesState.isLoading) && (
// //             <div className="flex items-center gap-2 text-xs text-school-primary italic">
// //               <Loader2 className="h-3 w-3 animate-spin" />
// //               Processing workspace updates...
// //             </div>
// //           )}
// //           {(importSummary || enrollSummary) && (
// //             <div className="p-3 rounded-lg bg-school-primary/10 border border-school-primary/20 text-xs text-school-primary">
// //               {importSummary && <p>{importSummary}</p>}
// //               {enrollSummary && <p>{enrollSummary}</p>}
// //             </div>
// //           )}

// //           {/* Table Section */}
// //           <section className="rounded-2xl border border-school-secondary/20 bg-slate-900 overflow-hidden">
// //             <div className="bg-slate-800/50 px-6 py-4 border-b border-school-secondary/20 flex items-center justify-between">
// //               <h2 className="text-sm font-bold flex items-center gap-2">
// //                 <School className="h-4 w-4 text-school-primary" />
// //                 Active Classes
// //               </h2>
// //               <span className="text-[10px] bg-school-secondary text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-widest">
// //                 {classesState.rows.length} Total
// //               </span>
// //             </div>
// //             <div className="overflow-x-auto">
// //               <table className="min-w-full text-sm">
// //                 <thead>
// //                   <tr className="bg-slate-950/50 text-[10px] uppercase tracking-wider text-slate-500">
// //                     <th className="px-6 py-4 text-left font-bold">Class Name</th>
// //                     <th className="px-6 py-4 text-left font-bold">Grade Level</th>
// //                     <th className="px-6 py-4 text-left font-bold">Assigned Teacher</th>
// //                     <th className="px-6 py-4 text-center font-bold">Students</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-school-secondary/10">
// //                   {classesState.rows.length === 0 && !classesState.isLoading ? (
// //                     <tr>
// //                       <td colSpan={4} className="px-6 py-12 text-center text-slate-500 italic">
// //                         No classes found. Create one to get started.
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     classesState.rows.map((row) => (
// //                       <tr key={row.id} className="hover:bg-school-primary/5 transition-colors group">
// //                         <td className="px-6 py-4 font-semibold text-white">{row.name}</td>
// //                         <td className="px-6 py-4">
// //                            <span className="flex items-center gap-1.5 text-slate-300">
// //                              <GraduationCap className="h-3.5 w-3.5 text-school-primary/60" />
// //                              {row.gradeDisplayName}
// //                            </span>
// //                         </td>
// //                         <td className="px-6 py-4 text-slate-400 italic">
// //                           {row.teacherName ?? "Unassigned"}
// //                         </td>
// //                         <td className="px-6 py-4 text-center">
// //                           <div className="inline-flex items-center gap-1 bg-slate-800 px-2.5 py-1 rounded-full text-xs font-mono text-school-primary">
// //                             <Users className="h-3 w-3" />
// //                             {row.studentCount}
// //                           </div>
// //                         </td>
// //                       </tr>
// //                     ))
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>
// //           </section>
// //         </div>
// //       </main>

// //       {/* Manual Creation Modal */}
// //       {isCreateModalOpen && (
// //         <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
// //           <div className="w-full max-w-md bg-slate-900 border border-school-secondary/30 rounded-2xl p-6 shadow-2xl animate-in zoom-in-95 duration-200">
// //             <h2 className="text-xl font-black mb-1">Create Class</h2>
// //             <p className="text-xs text-slate-500 mb-6">Add a single class manually to the system.</p>
            
// //             <form onSubmit={handleManualCreate} className="space-y-4">
// //               <div className="space-y-1.5">
// //                 <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Class Name</label>
// //                 <input 
// //                   required
// //                   placeholder="e.g. Grade 10 Alpha"
// //                   value={newClassData.name}
// //                   onChange={e => setNewClassData({...newClassData, name: e.target.value})}
// //                   className="w-full bg-slate-950 border border-school-secondary/20 rounded-lg px-4 py-2.5 text-sm focus:border-school-primary outline-none transition-all"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-1.5">
// //                   <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Grade Level</label>
// //                   <select 
// //                     required
// //                     value={newClassData.gradeId}
// //                     onChange={e => setNewClassData({...newClassData, gradeId: e.target.value})}
// //                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-lg px-3 py-2.5 text-sm focus:border-school-primary outline-none"
// //                   >
// //                     <option value="">Select Grade</option>
// //                     {helpers.grades.map(g => <option key={g.id} value={g.id}>{g.displayName}</option>)}
// //                   </select>
// //                 </div>
// //                 <div className="space-y-1.5">
// //                   <label className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Teacher (Optional)</label>
// //                   <select 
// //                     value={newClassData.teacherId}
// //                     onChange={e => setNewClassData({...newClassData, teacherId: e.target.value})}
// //                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-lg px-3 py-2.5 text-sm focus:border-school-primary outline-none"
// //                   >
// //                     <option value="">Assign Later</option>
// //                     {helpers.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="flex gap-3 pt-4">
// //                 <button 
// //                   type="button"
// //                   onClick={() => setIsCreateModalOpen(false)}
// //                   className="flex-1 px-4 py-2.5 rounded-lg text-sm font-bold text-slate-400 hover:bg-slate-800 transition-colors"
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button 
// //                   type="submit"
// //                   disabled={isPending}
// //                   className="flex-1 bg-school-primary text-school-secondary px-4 py-2.5 rounded-lg text-sm font-bold hover:opacity-90 disabled:opacity-50"
// //                 >
// //                   {isPending ? "Creating..." : "Confirm"}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   )
// // }



// "use client"

// import { useEffect, useState, useTransition } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//   Loader2, Plus, Users, School, 
//   GraduationCap, X, UserPlus, Search 
// } from "lucide-react"
// import {
//   ClassRow,
//   getClassesForManagement,
//   importClassesFromCsv,
//   enrollStudentsFromCsv,
//   createSingleClass,
//   enrollSingleStudent,
//   getManagementHelpers,
//   searchStudents,
// } from "@/app/actions/class-management"
// import { CSVImporter } from "@/components/shared/CSVImporter"
// import { toast } from "sonner"

// export default function AdminClassesPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore()

//   const [classesState, setClassesState] = useState({ rows: [] as ClassRow[], isLoading: true })
//   const [helpers, setHelpers] = useState({ grades: [] as any[], teachers: [] as any[] })
  
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  
//   const [newClassData, setNewClassData] = useState({ name: "", gradeId: "", teacherId: "" })
//   const [newEnrollData, setNewEnrollData] = useState({ studentId: "", classId: "" })
  
//   // FIX 1: Updated type to allow 'string | null' for name
//   const [studentQuery, setStudentQuery] = useState("")
//   const [searchResults, setSearchResults] = useState<{id: string, name: string | null, email: string}[]>([])
//   const [isSearching, setIsSearching] = useState(false)

//   const [isPending, startTransition] = useTransition()

//   useEffect(() => {
//     async function load() {
//       if (!profile?.schoolId) return
//       setClassesState(prev => ({ ...prev, isLoading: true }))
//       const [classData, helperData] = await Promise.all([
//         getClassesForManagement(profile.schoolId),
//         getManagementHelpers(profile.schoolId)
//       ])
//       setClassesState({ rows: classData, isLoading: false })
//       setHelpers({ grades: helperData.grades, teachers: helperData.teachers })
//     }
//     load()
//   }, [profile?.schoolId])

//   useEffect(() => {
//     if (studentQuery.length < 2) {
//       setSearchResults([])
//       return
//     }

//     const delayDebounceFn = setTimeout(async () => {
//       setIsSearching(true)
//       try {
//         const results = await searchStudents(profile!.schoolId!, studentQuery)
//         setSearchResults(results)
//       } catch (err) {
//         console.error("Search error")
//       } finally {
//         setIsSearching(false)
//       }
//     }, 400)

//     return () => clearTimeout(delayDebounceFn)
//   }, [studentQuery, profile?.schoolId])

//   const handleManualCreate = (e: React.FormEvent) => {
//     e.preventDefault()
//     startTransition(async () => {
//       const res = await createSingleClass(profile!.schoolId!, profile!.id, profile!.name ?? "Admin", profile!.role, newClassData)
//       if (res.success) {
//         toast.success("Class created")
//         setIsCreateModalOpen(false)
//         setNewClassData({ name: "", gradeId: "", teacherId: "" })
//         const refreshed = await getClassesForManagement(profile!.schoolId!)
//         setClassesState({ rows: refreshed, isLoading: false })
//       } else toast.error(res.error || "Failed to create")
//     })
//   }

//   const handleManualEnroll = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!newEnrollData.studentId) return toast.error("Please select a student")

//     startTransition(async () => {
//       const res = await enrollSingleStudent(profile!.schoolId!, profile!.id, profile!.name ?? "Admin", profile!.role, newEnrollData)
//       if (res.success) {
//         toast.success("Student enrolled")
//         setIsEnrollModalOpen(false)
//         setNewEnrollData({ studentId: "", classId: "" })
//         setStudentQuery("")
//         const refreshed = await getClassesForManagement(profile!.schoolId!)
//         setClassesState({ rows: refreshed, isLoading: false })
//       } else toast.error(res.error || "Failed to enroll")
//     })
//   }

//   if (isProfileLoading || !profile) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-400 animate-pulse">Initializing Management Studio...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-50">
//       <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
//         <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-white tracking-tight">Class Management</h1>
//             <p className="text-slate-400 text-sm">Create classes and manage student distribution.</p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button 
//               onClick={() => setIsEnrollModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-slate-900 border border-school-primary/30 text-school-primary px-5 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95"
//             >
//               <UserPlus className="h-5 w-5" />
//               Enroll Student
//             </button>
//             <button 
//               onClick={() => setIsCreateModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-school-primary text-school-secondary px-5 py-2.5 rounded-xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-school-primary/10"
//             >
//               <Plus className="h-5 w-5" />
//               New Class
//             </button>
//           </div>
//         </header>

//         <section className="grid gap-6 md:grid-cols-2">
//           {/* FIX 2: Wrapped in async blocks to return 'Promise<void>' instead of 'Promise<BulkResult>' */}
//           <CSVImporter
//             title="Bulk Class Setup"
//             description="Create multiple classes. Headers: name, grade_level"
//             expectedHeaders={["name", "grade_level"]}
//             onDataUpload={async (rows) => {
//                await importClassesFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, rows as any)
//             }}
//           />
//           <CSVImporter
//             title="Bulk Enrollment"
//             description="Assign students via CSV. Headers: student_email, class_name"
//             expectedHeaders={["student_email", "class_name"]}
//             onDataUpload={async (rows) => {
//                await enrollStudentsFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, rows as any)
//             }}
//           />
//         </section>

//         <section className="bg-slate-900 rounded-3xl border border-school-secondary/20 overflow-hidden shadow-2xl">
//           <div className="px-6 py-5 border-b border-school-secondary/10 flex justify-between items-center bg-slate-900/50 backdrop-blur-md">
//             <h3 className="font-bold flex items-center gap-3 text-school-primary">
//               <School className="h-5 w-5" />
//               Active Workspace Classes
//             </h3>
//             {isPending && <Loader2 className="h-4 w-4 animate-spin text-school-primary" />}
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.2em] bg-slate-950/40">
//                   <th className="px-8 py-5">Identifer</th>
//                   <th className="px-8 py-5">Academic Grade</th>
//                   <th className="px-8 py-5">Lead Teacher</th>
//                   <th className="px-8 py-5 text-center">Enrollment</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-school-secondary/5">
//                 {classesState.rows.map((row) => (
//                   <tr key={row.id} className="hover:bg-school-primary/5 transition-all">
//                     <td className="px-8 py-5 font-bold text-white text-base">{row.name}</td>
//                     <td className="px-8 py-5">
//                       <span className="flex items-center gap-2 text-slate-300">
//                         <GraduationCap className="h-4 w-4 text-school-primary/40" />
//                         {row.gradeDisplayName}
//                       </span>
//                     </td>
//                     <td className="px-8 py-5 text-slate-400 font-medium italic">{row.teacherName || 'Not Assigned'}</td>
//                     <td className="px-8 py-5 text-center">
//                       <span className="inline-flex items-center gap-2 bg-slate-950 border border-school-primary/20 text-school-primary px-4 py-1.5 rounded-full text-xs font-black">
//                         <Users className="h-3.5 w-3.5" />
//                         {row.studentCount}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>

//       {/* --- MODAL: Manual Class Creation --- */}
//       {isCreateModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
//           <div className="bg-slate-900 border border-school-secondary/30 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <h2 className="text-2xl font-black text-white">New Class</h2>
//                 <p className="text-slate-500 text-sm">Manually define a single class</p>
//               </div>
//               <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
//             </div>

//             <form onSubmit={handleManualCreate} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique Identifier</label>
//                 <input 
//                   required
//                   className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-700"
//                   placeholder="e.g. Grade 10 Alpha"
//                   value={newClassData.name}
//                   onChange={e => setNewClassData({...newClassData, name: e.target.value})}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade Level</label>
//                   <select 
//                     required
//                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                     value={newClassData.gradeId}
//                     onChange={e => setNewClassData({...newClassData, gradeId: e.target.value})}
//                   >
//                     <option value="">Choose...</option>
//                     {helpers.grades.map(g => (
//                       <option key={g.id} value={g.id}>{g.displayName}</option>
//                     ))}
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Assign Teacher</label>
//                   <select 
//                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                     value={newClassData.teacherId}
//                     onChange={e => setNewClassData({...newClassData, teacherId: e.target.value})}
//                   >
//                     <option value="">None</option>
//                     {helpers.teachers.map(t => (
//                       <option key={t.id} value={t.id}>{t.name}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <button 
//                 type="submit"
//                 disabled={isPending}
//                 className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50"
//               >
//                 {isPending ? "CONFIGURING..." : "CREATE CLASS"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* --- MODAL: Professional Searchable Enrollment --- */}
//       {isEnrollModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
//           <div className="bg-slate-900 border border-school-secondary/30 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <h2 className="text-2xl font-black text-white leading-tight">Enroll Student</h2>
//                 <p className="text-slate-500 text-sm">Search and assign to class</p>
//               </div>
//               <button onClick={() => setIsEnrollModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
//             </div>

//             <form onSubmit={handleManualEnroll} className="space-y-6">
//               <div className="space-y-2 relative">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Search Student Registry</label>
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                   <input 
//                     type="text"
//                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-700"
//                     placeholder="Type name or email..."
//                     value={studentQuery}
//                     onChange={(e) => {
//                       setStudentQuery(e.target.value)
//                       if (newEnrollData.studentId) setNewEnrollData({...newEnrollData, studentId: ""})
//                     }}
//                   />
//                 </div>

//                 {(searchResults.length > 0 || isSearching) && (
//                   <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-school-secondary/30 rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-60 overflow-y-auto">
//                     {isSearching ? (
//                       <div className="p-5 text-xs text-slate-500 flex items-center gap-3">
//                         <Loader2 className="h-3 w-3 animate-spin text-school-primary" /> Searching...
//                       </div>
//                     ) : (
//                       searchResults.map(s => (
//                         <button
//                           key={s.id}
//                           type="button"
//                           onClick={() => {
//                             setNewEnrollData({ ...newEnrollData, studentId: s.id })
//                             setStudentQuery(`${s.name ?? 'Unknown'} (${s.email})`)
//                             setSearchResults([])
//                           }}
//                           className="w-full text-left px-5 py-4 text-sm hover:bg-school-primary hover:text-school-secondary transition-colors border-b border-white/5 last:border-0"
//                         >
//                           <p className="font-black">{s.name ?? 'Unknown'}</p>
//                           <p className="text-[10px] opacity-60 uppercase tracking-tighter">{s.email}</p>
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 )}
//                 {newEnrollData.studentId && (
//                   <p className="text-[10px] text-school-primary font-bold mt-2 flex items-center gap-1">
//                     ✓ Identity Verified & Selected
//                   </p>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination Class</label>
//                 <select 
//                   required
//                   className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                   value={newEnrollData.classId}
//                   onChange={e => setNewEnrollData({...newEnrollData, classId: e.target.value})}
//                 >
//                   <option value="">Select a class...</option>
//                   {classesState.rows.map(c => (
//                     <option key={c.id} value={c.id}>{c.name} ({c.gradeDisplayName})</option>
//                   ))}
//                 </select>
//               </div>

//               <button 
//                 type="submit"
//                 disabled={isPending || !newEnrollData.studentId}
//                 className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 shadow-xl shadow-school-primary/10"
//               >
//                 {isPending ? "PROCESSING ENROLLMENT..." : "CONFIRM ASSIGNMENT"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }


// "use client"

// import { useEffect, useState, useTransition } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { 
//   Loader2, Plus, Users, School, 
//   GraduationCap, X, UserPlus, Search, 
// } from "lucide-react"
// import {
//   ClassRow,
//   getClassesForManagement,
//   importClassesFromCsv,
//   enrollStudentsFromCsv,
//   createSingleClass,
//   enrollSingleStudent, // This now only creates ClassEnrollment
//   getManagementHelpers,
//   searchStudents,
// } from "@/app/actions/class-management"
// import { CSVImporter } from "@/components/shared/CSVImporter"
// import { toast } from "sonner"

// export default function AdminClassesPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore()

//   // --- Main Data State ---
//   const [classesState, setClassesState] = useState({ rows: [] as ClassRow[], isLoading: true })
//   const [helpers, setHelpers] = useState({ grades: [] as any[], teachers: [] as any[] })
  
//   // --- Modal States ---
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  
//   // --- Form States ---
//   const [newClassData, setNewClassData] = useState({ name: "", gradeId: "", teacherId: "" })
//   const [newEnrollData, setNewEnrollData] = useState({ studentId: "", classId: "" })
  
//   // --- Searchable Autocomplete State ---
//   const [studentQuery, setStudentQuery] = useState("")
//   const [searchResults, setSearchResults] = useState<{id: string, name: string | null, email: string}[]>([])
//   const [isSearching, setIsSearching] = useState(false)

//   const [isPending, startTransition] = useTransition()

//   // 1. Initial Data Load
//   useEffect(() => {
//     async function load() {
//       if (!profile?.schoolId) return
//       setClassesState(prev => ({ ...prev, isLoading: true }))
//       const [classData, helperData] = await Promise.all([
//         getClassesForManagement(profile.schoolId),
//         getManagementHelpers(profile.schoolId)
//       ])
//       setClassesState({ rows: classData, isLoading: false })
//       setHelpers({ grades: helperData.grades, teachers: helperData.teachers })
//     }
//     load()
//   }, [profile?.schoolId])

//   // 2. Debounced Student Search
//   useEffect(() => {
//     if (studentQuery.length < 2) {
//       setSearchResults([])
//       return
//     }
//     const delayDebounceFn = setTimeout(async () => {
//       setIsSearching(true)
//       try {
//         const results = await searchStudents(profile!.schoolId!, studentQuery)
//         setSearchResults(results)
//       } catch (err) {
//         console.error("Search failed")
//       } finally {
//         setIsSearching(false)
//       }
//     }, 400)
//     return () => clearTimeout(delayDebounceFn)
//   }, [studentQuery, profile?.schoolId])

//   // --- Handlers ---

//   const handleManualCreate = (e: React.FormEvent) => {
//     e.preventDefault()
//     startTransition(async () => {
//       const res = await createSingleClass(profile!.schoolId!, profile!.id, profile!.name ?? "Admin", profile!.role, newClassData)
//       if (res.success) {
//         toast.success("Class created")
//         setIsCreateModalOpen(false)
//         setNewClassData({ name: "", gradeId: "", teacherId: "" })
//         const refreshed = await getClassesForManagement(profile!.schoolId!)
//         setClassesState({ rows: refreshed, isLoading: false })
//       } else toast.error(res.error || "Failed to create")
//     })
//   }

//   const handleManualEnroll = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!newEnrollData.studentId || !newEnrollData.classId) return toast.error("Selection incomplete")

//     startTransition(async () => {
//       // NOTE: Based on updated schema, this now only handles PLACEMENT (ClassEnrollment)
//       const res = await enrollSingleStudent(profile!.schoolId!, profile!.id, profile!.name ?? "Admin", profile!.role, newEnrollData)
//       if (res.success) {
//         toast.success("Student placed in class")
//         setIsEnrollModalOpen(false)
//         setNewEnrollData({ studentId: "", classId: "" })
//         setStudentQuery("")
//         const refreshed = await getClassesForManagement(profile!.schoolId!)
//         setClassesState({ rows: refreshed, isLoading: false })
//       } else toast.error(res.error || "Placement failed")
//     })
//   }

//   if (isProfileLoading || !profile) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-400 animate-pulse">Synchronizing Workspace...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-50">
//       <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
//         {/* Header */}
//         <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-white tracking-tight italic">CLASS PLACEMENT</h1>
//             <p className="text-slate-500 text-sm">Assign students to physical classrooms and manage levels.</p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button 
//               onClick={() => setIsEnrollModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-slate-900 border border-school-primary/30 text-school-primary px-5 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
//             >
//               <UserPlus className="h-4 w-4" />
//               Place Student
//             </button>
//             <button 
//               onClick={() => setIsCreateModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-school-primary text-school-secondary px-5 py-2.5 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-school-primary/10"
//             >
//               <Plus className="h-5 w-5" />
//               New Class
//             </button>
//           </div>
//         </header>

//         {/* CSV Tools */}
//         <section className="grid gap-6 md:grid-cols-2">
//           <CSVImporter
//             title="Bulk Class Import"
//             description="Create class rooms. Headers: name, grade_level"
//             expectedHeaders={["name", "grade_level"]}
//             onDataUpload={async (rows) => {
//                await importClassesFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, rows as any)
//             }}
//           />
//           <CSVImporter
//             title="Bulk Placement"
//             description="Assign students to rooms. Headers: student_email, class_name"
//             expectedHeaders={["student_email", "class_name"]}
//             onDataUpload={async (rows) => {
//                await enrollStudentsFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, rows as any)
//             }}
//           />
//         </section>

//         {/* Table */}
//         <section className="bg-slate-900 rounded-[2rem] border border-school-secondary/10 overflow-hidden shadow-2xl">
//           <div className="px-8 py-6 border-b border-school-secondary/5 flex justify-between items-center bg-slate-900/50">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-school-primary/10 rounded-lg">
//                 <School className="h-5 w-5 text-school-primary" />
//               </div>
//               <h3 className="font-bold text-lg">Class Inventory</h3>
//             </div>
//             {isPending && <Loader2 className="h-4 w-4 animate-spin text-school-primary" />}
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.3em] bg-slate-950/40">
//                   <th className="px-8 py-5">Class Name</th>
//                   <th className="px-8 py-5">Grade Level</th>
//                   <th className="px-8 py-5">Class Teacher</th>
//                   <th className="px-8 py-5 text-center">Student Count</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-school-secondary/5">
//                 {classesState.rows.map((row) => (
//                   <tr key={row.id} className="hover:bg-school-primary/5 transition-all group">
//                     <td className="px-8 py-6 font-bold text-white text-base">{row.name}</td>
//                     <td className="px-8 py-6">
//                       <span className="flex items-center gap-2 text-slate-400">
//                         <GraduationCap className="h-4 w-4 text-school-primary/30" />
//                         {row.gradeDisplayName}
//                       </span>
//                     </td>
//                     <td className="px-8 py-6 text-slate-500 italic font-medium">
//                       {row.teacherName || 'Not Assigned'}
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <span className="inline-flex items-center gap-2 bg-slate-950 border border-school-secondary/20 text-school-primary px-4 py-1.5 rounded-full text-xs font-black">
//                         <Users className="h-3.5 w-3.5" />
//                         {row.studentCount}
//                       </span>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>

//       {/* MODAL: CREATE CLASS */}
//       {isCreateModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//           <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <h2 className="text-2xl font-black text-white italic">NEW CLASSROOM</h2>
//                 <p className="text-slate-500 text-sm">Define a new physical class group</p>
//               </div>
//               <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
//             </div>

//             <form onSubmit={handleManualCreate} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Name</label>
//                 <input 
//                   required
//                   className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all"
//                   placeholder="e.g. JS 1 Gold"
//                   value={newClassData.name}
//                   onChange={e => setNewClassData({...newClassData, name: e.target.value})}
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade</label>
//                   <select 
//                     required
//                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                     value={newClassData.gradeId}
//                     onChange={e => setNewClassData({...newClassData, gradeId: e.target.value})}
//                   >
//                     <option value="">Choose...</option>
//                     {helpers.grades.map(g => <option key={g.id} value={g.id}>{g.displayName}</option>)}
//                   </select>
//                 </div>
//                 <div className="space-y-2">
//                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teacher</label>
//                   <select 
//                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                     value={newClassData.teacherId}
//                     onChange={e => setNewClassData({...newClassData, teacherId: e.target.value})}
//                   >
//                     <option value="">Unassigned</option>
//                     {helpers.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
//                   </select>
//                 </div>
//               </div>

//               <button 
//                 type="submit"
//                 disabled={isPending}
//                 className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-school-primary/10"
//               >
//                 {isPending ? "REGISTERING..." : "CREATE CLASSROOM"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* MODAL: STUDENT PLACEMENT (Searchable) */}
//       {isEnrollModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//           <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <h2 className="text-2xl font-black text-white italic">STUDENT PLACEMENT</h2>
//                 <p className="text-slate-500 text-sm">Search and assign a student to a room</p>
//               </div>
//               <button onClick={() => setIsEnrollModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
//             </div>

//             <form onSubmit={handleManualEnroll} className="space-y-6">
//               <div className="space-y-2 relative">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Find Student</label>
//                 <div className="relative">
//                   <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                   <input 
//                     type="text"
//                     className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800"
//                     placeholder="Search name or email..."
//                     value={studentQuery}
//                     onChange={(e) => {
//                       setStudentQuery(e.target.value)
//                       if (newEnrollData.studentId) setNewEnrollData({...newEnrollData, studentId: ""})
//                     }}
//                   />
//                 </div>

//                 {/* Autocomplete Results */}
//                 {(searchResults.length > 0 || isSearching) && (
//                   <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-school-secondary/30 rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-60 overflow-y-auto">
//                     {isSearching ? (
//                       <div className="p-5 text-xs text-slate-600 flex items-center gap-3">
//                         <Loader2 className="h-3 w-3 animate-spin text-school-primary" /> Validating registry...
//                       </div>
//                     ) : (
//                       searchResults.map(s => (
//                         <button
//                           key={s.id}
//                           type="button"
//                           onClick={() => {
//                             setNewEnrollData({ ...newEnrollData, studentId: s.id })
//                             setStudentQuery(`${s.name ?? 'Unknown Student'} (${s.email})`)
//                             setSearchResults([])
//                           }}
//                           className="w-full text-left px-5 py-4 text-sm hover:bg-school-primary hover:text-school-secondary transition-colors border-b border-white/5 last:border-0"
//                         >
//                           <p className="font-black">{s.name ?? 'Unknown Student'}</p>
//                           <p className="text-[10px] opacity-60 uppercase tracking-tighter">{s.email}</p>
//                         </button>
//                       ))
//                     )}
//                   </div>
//                 )}
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Classroom</label>
//                 <select 
//                   required
//                   className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                   value={newEnrollData.classId}
//                   onChange={e => setNewEnrollData({...newEnrollData, classId: e.target.value})}
//                 >
//                   <option value="">Select a room...</option>
//                   {classesState.rows.map(c => (
//                     <option key={c.id} value={c.id}>{c.name} ({c.gradeDisplayName})</option>
//                   ))}
//                 </select>
//               </div>

//               <button 
//                 type="submit"
//                 disabled={isPending || !newEnrollData.studentId}
//                 className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 shadow-xl shadow-school-primary/10"
//               >
//                 {isPending ? "PLACING STUDENT..." : "CONFIRM PLACEMENT"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }



"use client"

import { useEffect, useState, useTransition, useCallback } from "react"
import { useProfileStore } from "@/store/profileStore"
import Link from "next/link"
import { 
  Loader2, Plus, Users, School, 
  GraduationCap, X, UserPlus, Search 
} from "lucide-react"
import {
  ClassRow,
  getClassesForManagement,
  importClassesFromCsv,
  enrollStudentsFromCsv,
  createSingleClass,
  enrollSingleStudent,
  getManagementHelpers,
  searchStudents,
  ImportClassesRow, // Imported from actions
  EnrollStudentRow, // Imported from actions
} from "@/app/actions/class-management"
import { CSVImporter } from "@/components/shared/CSVImporter"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/error-handler"

// --- Specific Types for State ---
interface GradeHelper {
  id: string
  displayName: string
}

interface TeacherHelper {
  id: string
  name: string | null
}

interface StudentSearchResult {
  id: string
  name: string | null
  email: string
}

interface ComponentState {
  rows: ClassRow[]
  isLoading: boolean
}

interface HelperState {
  grades: GradeHelper[]
  teachers: TeacherHelper[]
}

export default function AdminClassesPage() {
  const { profile, isLoading: isProfileLoading } = useProfileStore()

  // --- Main Data State ---
  const [classesState, setClassesState] = useState<ComponentState>({ 
    rows: [], 
    isLoading: true 
  })
  
  const [helpers, setHelpers] = useState<HelperState>({ 
    grades: [], 
    teachers: [] 
  })
  
  // --- Modal States ---
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  
  // --- Form States ---
  const [newClassData, setNewClassData] = useState({ name: "", gradeId: "", teacherId: "" })
  const [newEnrollData, setNewEnrollData] = useState({ studentId: "", classId: "" })
  
  // --- Searchable Autocomplete State ---
  const [studentQuery, setStudentQuery] = useState("")
  const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const [isPending, startTransition] = useTransition()

  // 1. Initial Data Load
  const loadData = useCallback(async () => {
    if (!profile?.schoolId) return
    setClassesState(prev => ({ ...prev, isLoading: true }))
    try {
      const [classData, helperData] = await Promise.all([
        getClassesForManagement(profile.schoolId),
        getManagementHelpers(profile.schoolId)
      ])
      setClassesState({ rows: classData, isLoading: false })
      setHelpers({ 
        grades: helperData.grades as GradeHelper[], 
        teachers: helperData.teachers as TeacherHelper[] 
      })
    } catch (err) {
      toast.error("Failed to synchronize with server")
      getErrorMessage(err)
      setClassesState(prev => ({ ...prev, isLoading: false }))
    }
  }, [profile?.schoolId])

  useEffect(() => {
    loadData()
  }, [loadData])

  // 2. Debounced Student Search
  useEffect(() => {
    if (studentQuery.length < 2) {
      setSearchResults([])
      return
    }
    const delayDebounceFn = setTimeout(async () => {
      if (!profile?.schoolId) return
      setIsSearching(true)
      try {
        const results = await searchStudents(profile.schoolId, studentQuery)
        setSearchResults(results as StudentSearchResult[])
      } catch (err) {
        console.error("Search failed")
        getErrorMessage(err)
      } finally {
        setIsSearching(false)
      }
    }, 400)
    return () => clearTimeout(delayDebounceFn)
  }, [studentQuery, profile?.schoolId])

  // --- Handlers ---

  const handleManualCreate = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.schoolId) return
    
    startTransition(async () => {
      const res = await createSingleClass(
        profile.schoolId!, 
        profile.id, 
        profile.name ?? "Admin", 
        profile.role, 
        newClassData
      )
      if (res.success) {
        toast.success("Class room created")
        setIsCreateModalOpen(false)
        setNewClassData({ name: "", gradeId: "", teacherId: "" })
        await loadData()
      } else {
        toast.error(res.error || "Failed to create")
      }
    })
  }

  const handleManualEnroll = (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile?.schoolId) return
    if (!newEnrollData.studentId || !newEnrollData.classId) {
      return toast.error("Please complete the selection")
    }

    startTransition(async () => {
      const res = await enrollSingleStudent(
        profile.schoolId!, 
        profile.id, 
        profile.name ?? "Admin", 
        profile.role, 
        newEnrollData
      )
      if (res.success) {
        toast.success("Student placement confirmed")
        setIsEnrollModalOpen(false)
        setNewEnrollData({ studentId: "", classId: "" })
        setStudentQuery("")
        await loadData()
      } else {
        toast.error(res.error || "Placement failed")
      }
    })
  }

  if (isProfileLoading || !profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
        <p className="text-slate-400 animate-pulse font-mono tracking-tighter">INITIALIZING_STUDIO...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Class Placement</h1>
            <p className="text-slate-500 text-sm">Physical classroom distribution and workspace levels.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => setIsEnrollModalOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-900 border border-school-primary/30 text-school-primary px-5 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
            >
              <UserPlus className="h-5 w-5" />
              Place Student
            </button>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-school-primary text-school-secondary px-5 py-2.5 rounded-2xl font-bold hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-school-primary/10"
            >
              <Plus className="h-5 w-5" />
              New Class
            </button>
          </div>
        </header>

        {/* CSV Tools */}
        <section className="grid gap-6 md:grid-cols-2">
  <CSVImporter
    title="Bulk Class Import"
    description="Headers: name, grade_level"
    expectedHeaders={["name", "grade_level"]}
    onDataUpload={async (rows) => {
       // Using 'unknown' then the interface is the safe TS pattern for third-party libs
       const typedRows = rows as unknown as ImportClassesRow[]
       await importClassesFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, typedRows)
       await loadData()
    }}
  />
  <CSVImporter
    title="Bulk Placement"
    description="Headers: student_email, class_name"
    expectedHeaders={["student_email", "class_name"]}
    onDataUpload={async (rows) => {
       const typedRows = rows as unknown as EnrollStudentRow[]
       await enrollStudentsFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, typedRows)
       await loadData()
    }}
  />
</section>

        {/* Table Section */}
        <section className="bg-slate-900 rounded-[2rem] border border-school-secondary/10 overflow-hidden shadow-2xl">
          <div className="px-8 py-6 border-b border-school-secondary/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-school-primary/10 rounded-lg">
                <School className="h-5 w-5 text-school-primary" />
              </div>
              <h3 className="font-bold text-lg">Class Inventory</h3>
            </div>
            {(isPending || classesState.isLoading) && <Loader2 className="h-5 w-5 animate-spin text-school-primary" />}
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.3em] bg-slate-950/40">
                  <th className="px-8 py-5">Class Identifier</th>
                  <th className="px-8 py-5">Grade Level</th>
                  <th className="px-8 py-5">Class Teacher</th>
                  <th className="px-8 py-5 text-center">Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-school-secondary/5">
                {classesState.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-school-primary/5 transition-all group">
                    <td className="px-8 py-6 font-bold text-white text-base">{row.name}</td>
                    <td className="px-8 py-6">
                      <span className="flex items-center gap-2 text-slate-400">
                        <GraduationCap className="h-4 w-4 text-school-primary/30" />
                        {row.gradeDisplayName}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-slate-500 italic font-medium">
                      {row.teacherName || 'Unassigned'}
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="inline-flex items-center gap-2 bg-slate-950 border border-school-primary/20 text-school-primary px-4 py-1.5 rounded-full text-xs font-black">
                        <Users className="h-3.5 w-3.5" />
                        {row.studentCount}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
      <Link 
        // This generates: /admin/classes/uuid-123/allocation
        href={'/admin/subject'}
        className="bg-slate-800 text-school-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-school-primary hover:text-slate-950 transition-all"
      >
        Allocate Subjects
      </Link>
    </td>
                  </tr>
                ))}
                {classesState.rows.length === 0 && !classesState.isLoading && (
                   <tr>
                     <td colSpan={4} className="px-8 py-20 text-center text-slate-600 italic">
                        No classrooms defined in database.
                     </td>
                   </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* --- MODAL: Manual Create --- */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
          <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-white italic">NEW CLASSROOM</h2>
                <p className="text-slate-500 text-sm">Add a specific room to the registry</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
            </div>

            <form onSubmit={handleManualCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Title</label>
                <input 
                  required
                  className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all"
                  placeholder="e.g. Science 101"
                  value={newClassData.name}
                  onChange={e => setNewClassData({...newClassData, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Grade</label>
                  <select 
                    required
                    className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
                    value={newClassData.gradeId}
                    onChange={e => setNewClassData({...newClassData, gradeId: e.target.value})}
                  >
                    <option value="">Select...</option>
                    {helpers.grades.map(g => <option key={g.id} value={g.id}>{g.displayName}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Teacher</label>
                  <select 
                    className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-4 py-4 text-white focus:border-school-primary outline-none appearance-none"
                    value={newClassData.teacherId}
                    onChange={e => setNewClassData({...newClassData, teacherId: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {helpers.teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isPending}
                className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-school-primary/10"
              >
                {isPending ? "REGISTERING..." : "CREATE CLASSROOM"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: Student Placement --- */}
      {isEnrollModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
          <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase">Place Student</h2>
                <p className="text-slate-500 text-sm">Assign student identity to room</p>
              </div>
              <button onClick={() => setIsEnrollModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
            </div>

            <form onSubmit={handleManualEnroll} className="space-y-6">
              <div className="space-y-2 relative">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Lookup</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <input 
                    type="text"
                    className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl pl-12 pr-5 py-4 text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800"
                    placeholder="Search name or email..."
                    value={studentQuery}
                    onChange={(e) => {
                      setStudentQuery(e.target.value)
                      if (newEnrollData.studentId) setNewEnrollData({...newEnrollData, studentId: ""})
                    }}
                  />
                </div>

                {/* Autocomplete Results */}
                {(searchResults.length > 0 || isSearching) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-slate-950 border border-school-secondary/30 rounded-2xl overflow-hidden z-[110] shadow-2xl max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-5 text-xs text-slate-600 flex items-center gap-3">
                        <Loader2 className="h-3 w-3 animate-spin text-school-primary" /> Validating registry...
                      </div>
                    ) : (
                      searchResults.map(s => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => {
                            setNewEnrollData({ ...newEnrollData, studentId: s.id })
                            setStudentQuery(`${s.name ?? 'Unknown'} (${s.email})`)
                            setSearchResults([])
                          }}
                          className="w-full text-left px-5 py-4 text-sm hover:bg-school-primary hover:text-school-secondary transition-colors border-b border-white/5 last:border-0"
                        >
                          <p className="font-black">{s.name ?? 'Unknown'}</p>
                          <p className="text-[10px] opacity-60 uppercase tracking-tighter">{s.email}</p>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
                <select 
                  required
                  className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none"
                  value={newEnrollData.classId}
                  onChange={e => setNewEnrollData({...newEnrollData, classId: e.target.value})}
                >
                  <option value="">Select room...</option>
                  {classesState.rows.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.gradeDisplayName})</option>
                  ))}
                </select>
              </div>

              <button 
                type="submit"
                disabled={isPending || !newEnrollData.studentId}
                className="w-full bg-school-primary text-school-secondary font-black py-5 rounded-2xl mt-2 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-30 shadow-xl shadow-school-primary/10"
              >
                {isPending ? "SYNCHRONIZING..." : "CONFIRM PLACEMENT"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}