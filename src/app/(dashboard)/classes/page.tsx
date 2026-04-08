


// "use client"

// import { useEffect, useState, useTransition, useCallback } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import Link from "next/link"
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
//   ImportClassesRow, // Imported from actions
//   EnrollStudentRow, // Imported from actions
// } from "@/app/actions/class-management"
// import { CSVImporter } from "@/components/shared/CSVImporter"
// import { toast } from "sonner"
// import { getErrorMessage } from "@/lib/error-handler"

// // --- Specific Types for State ---
// interface GradeHelper {
//   id: string
//   displayName: string
// }

// interface TeacherHelper {
//   id: string
//   name: string | null
// }

// interface StudentSearchResult {
//   id: string
//   name: string | null
//   email: string
// }

// interface ComponentState {
//   rows: ClassRow[]
//   isLoading: boolean
// }

// interface HelperState {
//   grades: GradeHelper[]
//   teachers: TeacherHelper[]
// }

// export default function AdminClassesPage() {
//   const { profile, isLoading: isProfileLoading } = useProfileStore()

//   // --- Main Data State ---
//   const [classesState, setClassesState] = useState<ComponentState>({ 
//     rows: [], 
//     isLoading: true 
//   })
  
//   const [helpers, setHelpers] = useState<HelperState>({ 
//     grades: [], 
//     teachers: [] 
//   })
  
//   // --- Modal States ---
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
//   const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false)
  
//   // --- Form States ---
//   const [newClassData, setNewClassData] = useState({ name: "", gradeId: "", teacherId: "" })
//   const [newEnrollData, setNewEnrollData] = useState({ studentId: "", classId: "" })
  
//   // --- Searchable Autocomplete State ---
//   const [studentQuery, setStudentQuery] = useState("")
//   const [searchResults, setSearchResults] = useState<StudentSearchResult[]>([])
//   const [isSearching, setIsSearching] = useState(false)

//   const [isPending, startTransition] = useTransition()

//   // 1. Initial Data Load
//   const loadData = useCallback(async () => {
//     if (!profile?.schoolId) return
//     setClassesState(prev => ({ ...prev, isLoading: true }))
//     try {
//       const [classData, helperData] = await Promise.all([
//         getClassesForManagement(profile.schoolId),
//         getManagementHelpers(profile.schoolId)
//       ])
//       setClassesState({ rows: classData, isLoading: false })
//       setHelpers({ 
//         grades: helperData.grades as GradeHelper[], 
//         teachers: helperData.teachers as TeacherHelper[] 
//       })
//     } catch (err) {
//       toast.error("Failed to synchronize with server")
//       getErrorMessage(err)
//       setClassesState(prev => ({ ...prev, isLoading: false }))
//     }
//   }, [profile?.schoolId])

//   useEffect(() => {
//     loadData()
//   }, [loadData])

//   // 2. Debounced Student Search
//   useEffect(() => {
//     if (studentQuery.length < 2) {
//       setSearchResults([])
//       return
//     }
//     const delayDebounceFn = setTimeout(async () => {
//       if (!profile?.schoolId) return
//       setIsSearching(true)
//       try {
//         const results = await searchStudents(profile.schoolId, studentQuery)
//         setSearchResults(results as StudentSearchResult[])
//       } catch (err) {
//         console.error("Search failed")
//         getErrorMessage(err)
//       } finally {
//         setIsSearching(false)
//       }
//     }, 400)
//     return () => clearTimeout(delayDebounceFn)
//   }, [studentQuery, profile?.schoolId])

//   // --- Handlers ---

//   const handleManualCreate = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!profile?.schoolId) return
    
//     startTransition(async () => {
//       const res = await createSingleClass(
//         profile.schoolId!, 
//         profile.id, 
//         profile.name ?? "Admin", 
//         profile.role, 
//         newClassData
//       )
//       if (res.success) {
//         toast.success("Class room created")
//         setIsCreateModalOpen(false)
//         setNewClassData({ name: "", gradeId: "", teacherId: "" })
//         await loadData()
//       } else {
//         toast.error(res.error || "Failed to create")
//       }
//     })
//   }

//   const handleManualEnroll = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!profile?.schoolId) return
//     if (!newEnrollData.studentId || !newEnrollData.classId) {
//       return toast.error("Please complete the selection")
//     }

//     startTransition(async () => {
//       const res = await enrollSingleStudent(
//         profile.schoolId!, 
//         profile.id, 
//         profile.name ?? "Admin", 
//         profile.role, 
//         newEnrollData
//       )
//       if (res.success) {
//         toast.success("Student placement confirmed")
//         setIsEnrollModalOpen(false)
//         setNewEnrollData({ studentId: "", classId: "" })
//         setStudentQuery("")
//         await loadData()
//       } else {
//         toast.error(res.error || "Placement failed")
//       }
//     })
//   }

//   if (isProfileLoading || !profile) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-400 animate-pulse font-mono tracking-tighter">INITIALIZING_STUDIO...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 text-slate-50">
//       <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
        
//         {/* Header */}
//         <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <h1 className="text-3xl font-black text-white tracking-tight italic uppercase">Class Placement</h1>
//             <p className="text-slate-500 text-sm">Physical classroom distribution and workspace levels.</p>
//           </div>
//           <div className="flex flex-wrap gap-3">
//             <button 
//               onClick={() => setIsEnrollModalOpen(true)}
//               className="inline-flex items-center gap-2 bg-slate-900 border border-school-primary/30 text-school-primary px-5 py-2.5 rounded-2xl font-bold hover:bg-slate-800 transition-all active:scale-95"
//             >
//               <UserPlus className="h-5 w-5" />
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
//   <CSVImporter
//     title="Bulk Class Import"
//     description="Headers: name, grade_level"
//     expectedHeaders={["name", "grade_level"]}
//     onDataUpload={async (rows) => {
//        // Using 'unknown' then the interface is the safe TS pattern for third-party libs
//        const typedRows = rows as unknown as ImportClassesRow[]
//        await importClassesFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, typedRows)
//        await loadData()
//     }}
//   />
//   <CSVImporter
//     title="Bulk Placement"
//     description="Headers: student_email, class_name"
//     expectedHeaders={["student_email", "class_name"]}
//     onDataUpload={async (rows) => {
//        const typedRows = rows as unknown as EnrollStudentRow[]
//        await enrollStudentsFromCsv(profile.schoolId!, profile.id, profile.name ?? null, profile.role, typedRows)
//        await loadData()
//     }}
//   />
// </section>

//         {/* Table Section */}
//         <section className="bg-slate-900 rounded-[2rem] border border-school-secondary/10 overflow-hidden shadow-2xl">
//           <div className="px-8 py-6 border-b border-school-secondary/5 flex justify-between items-center bg-slate-900/50 backdrop-blur-sm">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-school-primary/10 rounded-lg">
//                 <School className="h-5 w-5 text-school-primary" />
//               </div>
//               <h3 className="font-bold text-lg">Class Inventory</h3>
//             </div>
//             {(isPending || classesState.isLoading) && <Loader2 className="h-5 w-5 animate-spin text-school-primary" />}
//           </div>
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="text-left text-slate-500 text-[10px] uppercase tracking-[0.3em] bg-slate-950/40">
//                   <th className="px-8 py-5">Class Identifier</th>
//                   <th className="px-8 py-5">Grade Level</th>
//                   <th className="px-8 py-5">Class Teacher</th>
//                   <th className="px-8 py-5 text-center">Size</th>
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
//                       {row.teacherName || 'Unassigned'}
//                     </td>
//                     <td className="px-8 py-6 text-center">
//                       <span className="inline-flex items-center gap-2 bg-slate-950 border border-school-primary/20 text-school-primary px-4 py-1.5 rounded-full text-xs font-black">
//                         <Users className="h-3.5 w-3.5" />
//                         {row.studentCount}
//                       </span>
//                     </td>
//                     <td className="px-8 py-6 text-right">
//       <Link 
//         // This generates: /admin/classes/uuid-123/allocation
//         href={'/admin/subject'}
//         className="bg-slate-800 text-school-primary px-4 py-2 rounded-lg text-[10px] font-black uppercase hover:bg-school-primary hover:text-slate-950 transition-all"
//       >
//         Allocate Subjects
//       </Link>
//     </td>
//                   </tr>
//                 ))}
//                 {classesState.rows.length === 0 && !classesState.isLoading && (
//                    <tr>
//                      <td colSpan={4} className="px-8 py-20 text-center text-slate-600 italic">
//                         No classrooms defined in database.
//                      </td>
//                    </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </section>
//       </main>

//       {/* --- MODAL: Manual Create --- */}
//       {isCreateModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//           <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <h2 className="text-2xl font-black text-white italic">NEW CLASSROOM</h2>
//                 <p className="text-slate-500 text-sm">Add a specific room to the registry</p>
//               </div>
//               <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
//             </div>

//             <form onSubmit={handleManualCreate} className="space-y-6">
//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Room Title</label>
//                 <input 
//                   required
//                   className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none transition-all"
//                   placeholder="e.g. Science 101"
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
//                     <option value="">Select...</option>
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

//       {/* --- MODAL: Student Placement --- */}
//       {isEnrollModalOpen && (
//         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-md">
//           <div className="bg-slate-900 border border-school-secondary/20 rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl scale-in-center">
//             <div className="flex justify-between items-start mb-8">
//               <div>
//                 <h2 className="text-2xl font-black text-white italic uppercase">Place Student</h2>
//                 <p className="text-slate-500 text-sm">Assign student identity to room</p>
//               </div>
//               <button onClick={() => setIsEnrollModalOpen(false)} className="p-2 hover:bg-slate-800 rounded-full transition-colors"><X className="text-slate-500" /></button>
//             </div>

//             <form onSubmit={handleManualEnroll} className="space-y-6">
//               <div className="space-y-2 relative">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Lookup</label>
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
//               </div>

//               <div className="space-y-2">
//                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination</label>
//                 <select 
//                   required
//                   className="w-full bg-slate-950 border border-school-secondary/20 rounded-2xl px-5 py-4 text-white focus:border-school-primary outline-none appearance-none"
//                   value={newEnrollData.classId}
//                   onChange={e => setNewEnrollData({...newEnrollData, classId: e.target.value})}
//                 >
//                   <option value="">Select room...</option>
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
//                 {isPending ? "SYNCHRONIZING..." : "CONFIRM PLACEMENT"}
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// src/app/dashboard/classes/page.tsx
"use client"

import { useProfileStore } from "@/store/profileStore"
import { getClassDashboardData, getManagementHelpers } from "@/app/actions/class-management" // The unified action from previous turn
import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
import { StudentClassView } from "@/components/student-dashboard/studentClassView"

export default function ClassesPage() {
  const { profile, isLoading: isProfileLoading } = useProfileStore()
  const [data, setData] = useState<any>(null)
  const [helpers, setHelpers] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function load() {
      if (!profile?.id || !profile?.schoolId) return
      const [dashboardData, helperData] = await Promise.all([
        getClassDashboardData(profile.id),
        profile.role === "SCHOOL_ADMIN" ? getManagementHelpers(profile.schoolId) : null
      ])
      setData(dashboardData)
      setHelpers(helperData)
      setIsLoading(false)
    }
    load()
  }, [profile])

  if (isProfileLoading || isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
        <p className="text-slate-400 animate-pulse uppercase text-[10px] tracking-widest font-black">Syncing Registry...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      {profile?.role === "SCHOOL_ADMIN" && <AdminClassView initialData={data} helpers={helpers} profile={profile} />}
      {profile?.role === "TEACHER" && <TeacherClassView data={data} />}
      {profile?.role === "STUDENT" && <StudentClassView data={data} />}
    </div>
  )
}