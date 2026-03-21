// "use client"

// import { useState, useEffect } from "react"
// import { toast } from "sonner"
// import { Check, ShieldCheck, UserCircle, Save } from "lucide-react"

// export default function SubjectAllocationPage({ classId, gradeId, schoolId }) {
//   const [students, setStudents] = useState([])
//   const [subjects, setSubjects] = useState([]) // All subjects for this grade
//   const [matrix, setMatrix] = useState<Record<string, string[]>>({}) // { studentId: [subjectIds] }

//   // 1. "Apply to All" - THE JUNIOR SECONDARY MIRACLE BUTTON
//   const applyCoreToAll = (coreSubjectIds: string[]) => {
//     const newMatrix = { ...matrix };
//     students.forEach(student => {
//       newMatrix[student.id] = Array.from(new Set([...(newMatrix[student.id] || []), ...coreSubjectIds]));
//     });
//     setMatrix(newMatrix);
//     toast.success("Core subjects mapped to entire class list");
//   }

//   // 2. Individual Toggle (For CRS/IRS split)
//   const toggleSubject = (studentId: string, subId: string) => {
//     const current = matrix[studentId] || [];
//     const updated = current.includes(subId) 
//       ? current.filter(id => id !== subId) 
//       : [...current, subId];
//     setMatrix({ ...matrix, [studentId]: updated });
//   }

//   return (
//     <div className="p-8 bg-slate-950 min-h-screen text-white">
//       <header className="mb-8 flex justify-between items-end">
//         <div>
//           <h1 className="text-3xl font-black italic">Subject Allocation Matrix</h1>
//           <p className="text-slate-500">JS1 Gold • 2024/2025 Session</p>
//         </div>
//         <div className="flex gap-4">
//            <button 
//              onClick={() => applyCoreToAll(subjects.filter(s => s.isCompulsory).map(s => s.id))}
//              className="bg-slate-800 border border-school-primary/50 text-school-primary px-4 py-2 rounded-xl text-xs font-bold"
//            >
//              Assign Core to All
//            </button>
//            <button className="bg-school-primary text-school-secondary px-6 py-2 rounded-xl font-bold flex items-center gap-2">
//              <Save className="h-4 w-4" /> Save Allocation
//            </button>
//         </div>
//       </header>

//       <div className="rounded-2xl border border-white/5 bg-slate-900 overflow-hidden">
//         <table className="w-full text-left border-collapse">
//           <thead>
//             <tr className="bg-slate-950 text-[10px] uppercase tracking-widest text-slate-500">
//               <th className="p-4 sticky left-0 bg-slate-950 z-10">Student Name</th>
//               {subjects.map(sub => (
//                 <th key={sub.id} className="p-4 text-center border-l border-white/5 whitespace-nowrap">
//                   {sub.name}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {students.map(student => (
//               <tr key={student.id} className="border-t border-white/5 hover:bg-white/5 transition-colors">
//                 <td className="p-4 font-bold sticky left-0 bg-slate-900 shadow-xl flex items-center gap-2">
//                   <UserCircle className="h-4 w-4 text-slate-500" />
//                   {student.name}
//                 </td>
//                 {subjects.map(sub => (
//                   <td key={sub.id} className="p-4 text-center border-l border-white/5">
//                     <button 
//                       onClick={() => toggleSubject(student.id, sub.id)}
//                       className={`h-6 w-6 rounded-md border transition-all flex items-center justify-center mx-auto ${
//                         matrix[student.id]?.includes(sub.id)
//                         ? 'bg-school-primary border-school-primary text-school-secondary scale-110 shadow-lg shadow-school-primary/20'
//                         : 'border-white/10 hover:border-school-primary/40'
//                       }`}
//                     >
//                       {matrix[student.id]?.includes(sub.id) && <Check className="h-4 w-4 stroke-[4]" />}
//                     </button>
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect, useTransition } from "react"
// import { toast } from "sonner"
// import { Check, UserCircle, Save, Loader2, Info, ArrowLeft } from "lucide-react"
// import { 
//   bulkAllocateJuniorSubjects 
// } from "@/app/actions/subject-allocation"
// import { 
//   getManagementHelpers, 
// } from "@/app/actions/class-management"
// import Link from "next/link"

// // --- Types ---
// interface Student {
//   id: string
//   name: string | null
//   email: string
// }

// interface GradeSubject {
//   id: string
//   name: string
//   isCompulsory?: boolean
// }

// interface AllocationPageProps {
//   classId: string
//   gradeId: string
//   schoolId: string
//   className: string
// }


// interface GradeFromServer {
//     id: string;
//     displayName: string;
//     gradeSubjects: {
//       id: string;
//       subject: {
//         name: string;
//       }
//     }[];
//   }
  

// export default function SubjectAllocationPage({ 
//   classId, 
//   gradeId, 
//   schoolId,
//   className 
// }: AllocationPageProps) {
//   // --- State ---
//   const [students, setStudents] = useState<Student[]>([])
//   const [subjects, setSubjects] = useState<GradeSubject[]>([])
//   const [matrix, setMatrix] = useState<Record<string, string[]>>({})
//   const [isLoading, setIsLoading] = useState(true)
//   const [isPending, startTransition] = useTransition()

//   // 1. Initial Data Load
//   // 1. Update the local interface to handle the nested data
// // interface GradeFromServer {
// //     id: string;
// //     displayName: string;
// //     gradeSubjects: {
// //       id: string;
// //       subject: {
// //         name: string;
// //       }
// //     }[];
// //   }
  
//   // 2. Inside your component, update the useEffect:
//   useEffect(() => {
//     async function loadData() {
//       setIsLoading(true)
//       try {
//         // We cast the response here to help TypeScript understand the complex nested object
//         const helpers = await getManagementHelpers(schoolId) as unknown as {
//           grades: GradeFromServer[],
//           students: Student[]
//         };
        
//         const currentGrade = helpers.grades.find(g => g.id === gradeId);
        
//         if (currentGrade) {
//           setSubjects(currentGrade.gradeSubjects.map((gs) => ({
//             id: gs.id,
//             name: gs.subject.name,
//             isCompulsory: true
//           })));
//         }
  
//         // Filter students who are actually in THIS class (using classId)
//         // Since helpers.students returns ALL school students, we filter locally for now
//         // ideally, you'd create a specific 'getStudentsByClass' action
//         setStudents(helpers.students); 
        
//       } catch (error) {
//         toast.error("Failed to load allocation data")
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadData()
//   }, [classId, gradeId, schoolId])
//   // 2. "Assign Core to All" Logic
//   const applyCoreToAll = () => {
//     const coreIds = subjects.map(s => s.id)
//     const newMatrix = { ...matrix }
//     students.forEach(student => {
//       newMatrix[student.id] = coreIds
//     })
//     setMatrix(newMatrix)
//     toast.success(`Allocated ${coreIds.length} subjects to all students`)
//   }

//   // 3. Individual Toggle
//   const toggleSubject = (studentId: string, subId: string) => {
//     const current = matrix[studentId] || []
//     const updated = current.includes(subId) 
//       ? current.filter(id => id !== subId) 
//       : [...current, subId]
    
//     setMatrix(prev => ({ ...prev, [studentId]: updated }))
//   }

//   // 4. Save to Database
//   const handleSave = () => {
//     startTransition(async () => {
//       // Flatten matrix into the format needed by server action
//       // Here we loop through each student and update their specific list
//       let successCount = 0
//       for (const studentId in matrix) {
//         const res = await bulkAllocateJuniorSubjects(
//           schoolId,
//           classId,
//           matrix[studentId]
//         )
//         if (res.success) successCount++
//       }
      
//       toast.success(`Successfully saved allocation for ${successCount} students`)
//     })
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-400 font-medium">Loading Allocation Matrix...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
//       {/* Header */}
//       <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
//         <div>
//           <Link href="/admin/classes" className="text-school-primary text-xs flex items-center gap-1 mb-2 hover:underline">
//             <ArrowLeft className="h-3 w-3" /> Back to Classes
//           </Link>
//           <h1 className="text-3xl font-black italic tracking-tight uppercase">Subject Allocation</h1>
//           <p className="text-slate-500 font-medium">{className} • Academic Workspace</p>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//            <button 
//              onClick={applyCoreToAll}
//              className="bg-slate-900 border border-school-primary/30 text-school-primary px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
//            >
//              Assign All Subjects to Everyone
//            </button>
//            <button 
//              onClick={handleSave}
//              disabled={isPending}
//              className="bg-school-primary text-school-secondary px-6 py-2.5 rounded-xl font-black flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
//            >
//              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//              Save Changes
//            </button>
//         </div>
//       </header>

//       {/* Info Bar */}
//       <div className="mb-6 p-4 rounded-2xl bg-school-primary/5 border border-school-primary/10 flex items-start gap-3">
//         <Info className="h-5 w-5 text-school-primary shrink-0 mt-0.5" />
//         <p className="text-xs text-slate-400 leading-relaxed">
//           <span className="text-school-primary font-bold">Instruction:</span> Use this matrix to manage individual subject lists. This is critical for Junior Secondary where students split between <span className="text-white">Islamic Studies (IRS)</span> and <span className="text-white">Christian Religious Studies (CRS)</span>.
//         </p>
//       </div>

//       {/* Matrix Table */}
//       <div className="rounded-[2rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-950/80 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-slate-500">
//                 <th className="p-6 sticky left-0 bg-slate-950 z-20 min-w-[250px]">Student Registry</th>
//                 {subjects.map(sub => (
//                   <th key={sub.id} className="p-6 text-center border-l border-white/5 whitespace-nowrap min-w-[120px]">
//                     {sub.name}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {students.map(student => (
//                 <tr key={student.id} className="hover:bg-school-primary/5 transition-colors group">
//                   {/* Sticky Student Name Column */}
//                   <td className="p-6 font-bold sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800 transition-colors shadow-2xl flex items-center gap-3">
//                     <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
//                       <UserCircle className="h-5 w-5" />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm text-white">{student.name || "Unnamed Student"}</span>
//                       <span className="text-[10px] text-slate-500 font-medium lowercase">{student.email}</span>
//                     </div>
//                   </td>

//                   {/* Subject Toggle Cells */}
//                   {subjects.map(sub => {
//                     const isSelected = matrix[student.id]?.includes(sub.id);
//                     return (
//                       <td key={sub.id} className="p-6 text-center border-l border-white/5">
//                         <button 
//                           onClick={() => toggleSubject(student.id, sub.id)}
//                           className={`h-7 w-7 rounded-lg border transition-all flex items-center justify-center mx-auto ${
//                             isSelected
//                             ? 'bg-school-primary border-school-primary text-school-secondary scale-110 shadow-lg shadow-school-primary/20'
//                             : 'border-white/10 hover:border-school-primary/40'
//                           }`}
//                         >
//                           {isSelected && <Check className="h-5 w-5 stroke-[4]" />}
//                         </button>
//                       </td>
//                     )
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }



// "use client"

// import { useState, useEffect, useTransition } from "react"
// import { toast } from "sonner"
// import { Check, UserCircle, Save, Loader2, Info, ArrowLeft, Users } from "lucide-react"
// import { bulkAllocateJuniorSubjects } from "@/app/actions/subject-allocation"
// import { getManagementHelpers, ManagementHelpers } from "@/app/actions/class-management"
// import { getErrorMessage } from "@/lib/error-handler"
// import Link from "next/link"

// // --- Specific Interfaces ---
// interface Student {
//   id: string
//   name: string | null
//   email: string
// }

// interface DisplaySubject {
//   id: string
//   name: string
//   isCompulsory: boolean
// }

// interface AllocationPageProps {
//   classId: string
//   gradeId: string
//   schoolId: string
//   className: string
// }

// /**
//  * Type to represent the internal state of the matrix
//  * Record<studentId, string[]>
//  */
// type AllocationMatrix = Record<string, string[]>

// export default function SubjectAllocationPage({ 
//   classId, 
//   gradeId, 
//   schoolId,
//   className 
// }: AllocationPageProps) {
  
//   // --- State ---
//   const [students, setStudents] = useState<Student[]>([])
//   const [subjects, setSubjects] = useState<DisplaySubject[]>([])
//   const [matrix, setMatrix] = useState<AllocationMatrix>({})
//   const [isLoading, setIsLoading] = useState(true)
//   const [isPending, startTransition] = useTransition()

//   // 1. Load Data with strict typing and custom error handling
//   useEffect(() => {
//     async function loadData() {
//       setIsLoading(true)
//       try {
//         const helpers: ManagementHelpers = await getManagementHelpers(schoolId)
        
//         // Find the specific grade and its linked subjects
//         const currentGrade = helpers.grades.find(g => g.id === gradeId)
        
//         if (currentGrade) {
//           const formattedSubjects: DisplaySubject[] = currentGrade.gradeSubjects.map((gs) => ({
//             id: gs.id,
//             name: gs.subject.name,
//             isCompulsory: true // Default for JS1-3 context
//           }))
//           setSubjects(formattedSubjects)
//         }

//         // Students logic: Ideally we filter for students in the classId
//         // For now using the Registry provided by the management helper
//         setStudents(helpers.students)
        
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadData()
//   }, [classId, gradeId, schoolId])

//   // 2. "Assign Core to All" - The Bulk Toggle Logic
//   const applyCoreToAll = () => {
//     const allSubjectIds = subjects.map(s => s.id)
//     const newMatrix: AllocationMatrix = {}
    
//     students.forEach(student => {
//       newMatrix[student.id] = allSubjectIds
//     })
    
//     setMatrix(newMatrix)
//     toast.success(`Broad-mapped ${allSubjectIds.length} subjects to all students.`)
//   }

//   // 3. Individual Matrix Toggle
//   const toggleSubject = (studentId: string, subId: string) => {
//     const currentSelection = matrix[studentId] || []
//     const isAlreadySelected = currentSelection.includes(subId)
    
//     const updatedSelection = isAlreadySelected
//       ? currentSelection.filter(id => id !== subId) 
//       : [...currentSelection, subId]
    
//     setMatrix(prev => ({ 
//       ...prev, 
//       [studentId]: updatedSelection 
//     }))
//   }

//   // 4. Persistence Handler using Server Actions
//   const handleSave = () => {
//     if (Object.keys(matrix).length === 0) {
//       toast.error("The allocation matrix is empty.")
//       return
//     }

//     startTransition(async () => {
//       try {
//         // We iterate through the matrix and save allocations per student
//         const savePromises = Object.entries(matrix).map(([studentId, subjectIds]) => 
//           bulkAllocateJuniorSubjects(schoolId, classId, subjectIds)
//         )

//         const results = await Promise.all(savePromises)
//         const failed = results.filter(r => !r.success)

//         if (failed.length > 0) {
//           toast.error(`Partial success: ${failed.length} allocations failed.`)
//         } else {
//           toast.success("Matrix successfully synchronized with database.")
//         }
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-400 font-mono text-xs animate-pulse uppercase tracking-widest">
//           Loading_Matrix_Registry...
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
//       {/* Navigation & Header */}
//       <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div className="space-y-2">
//           <Link 
//             href="/admin/classes" 
//             className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 hover:opacity-70 transition-all mb-4"
//           >
//             <ArrowLeft className="h-3 w-3" /> Exit to Class Placement
//           </Link>
//           <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
//             Allocation Matrix
//           </h1>
//           <p className="text-slate-500 text-sm font-medium">
//             Registry: <span className="text-slate-300">{className}</span> • Level Management
//           </p>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//            <button 
//              onClick={applyCoreToAll}
//              className="bg-slate-900 border border-school-primary/30 text-school-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all active:scale-95"
//            >
//              Map Core to Entire Class
//            </button>
//            <button 
//              onClick={handleSave}
//              disabled={isPending}
//              className="bg-school-primary text-school-secondary px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center gap-3 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50 shadow-2xl shadow-school-primary/20"
//            >
//              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//              Commit Changes
//            </button>
//         </div>
//       </header>

//       {/* Logic Instruction */}
//       <div className="mb-8 p-5 rounded-[2rem] bg-school-primary/5 border border-school-primary/10 flex items-start gap-4">
//         <Info className="h-6 w-6 text-school-primary shrink-0" />
//         <div className="space-y-1">
//             <p className="text-xs text-white font-black uppercase tracking-widest">System Instruction</p>
//             <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
//                 This matrix allows for surgical subject allocation. For <span className="text-white">Junior Secondary</span>, ensure students are mapped to either <span className="text-school-primary font-bold underline">CRS</span> or <span className="text-school-primary font-bold underline">IRS</span> based on their identity. Core subjects should remain uniform for the group.
//             </p>
//         </div>
//       </div>

//       {/* Allocation Table */}
//       <div className="rounded-[2.5rem] border border-school-secondary/20 bg-slate-900 overflow-hidden shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-950/80 backdrop-blur-xl text-[10px] uppercase tracking-[0.3em] text-slate-500">
//                 <th className="p-8 sticky left-0 bg-slate-950 z-20 min-w-[300px] border-b border-white/5">
//                   Student Registry
//                 </th>
//                 {subjects.map(sub => (
//                   <th key={sub.id} className="p-8 text-center border-l border-white/5 border-b whitespace-nowrap min-w-[140px]">
//                     {sub.name}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {students.map(student => (
//                 <tr key={student.id} className="hover:bg-school-primary/5 transition-all group">
                  
//                   {/* Sticky Identification Column */}
//                   <td className="p-8 font-bold sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800 transition-colors shadow-2xl border-r border-white/5 flex items-center gap-4">
//                     <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/5">
//                       <UserCircle className="h-6 w-6" />
//                     </div>
//                     <div className="flex flex-col">
//                       <span className="text-sm text-white font-black uppercase tracking-tight">
//                         {student.name || "UNNAMED_IDENT"}
//                       </span>
//                       <span className="text-[10px] text-slate-500 font-mono lowercase">
//                         {student.email}
//                       </span>
//                     </div>
//                   </td>

//                   {/* Allocation Toggles */}
//                   {subjects.map(sub => {
//                     const isAllocated = matrix[student.id]?.includes(sub.id)
//                     return (
//                       <td key={sub.id} className="p-8 text-center border-l border-white/5">
//                         <button 
//                           onClick={() => toggleSubject(student.id, sub.id)}
//                           className={`h-8 w-8 rounded-xl border transition-all flex items-center justify-center mx-auto ${
//                             isAllocated
//                             ? 'bg-school-primary border-school-primary text-school-secondary scale-110 shadow-lg shadow-school-primary/20'
//                             : 'border-white/10 hover:border-school-primary/40 bg-slate-950/50'
//                           }`}
//                         >
//                           {isAllocated && <Check className="h-5 w-5 stroke-[5]" />}
//                         </button>
//                       </td>
//                     )
//                   })}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
      
//       {/* Empty State Guard */}
//       {students.length === 0 && (
//         <div className="py-40 text-center">
//             <Users className="h-12 w-12 text-slate-800 mx-auto mb-4" />
//             <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">No active students found in this classroom.</p>
//         </div>
//       )}
//     </div>
//   )
// }



"use client"

import { useState, useEffect, useTransition, Suspense } from "react"
import { toast } from "sonner"
import { Check, UserCircle, Save, Loader2, Info, ArrowLeft, Users } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { allocateStudentSubjects } from "@/app/actions/subject-allocation"
import { getManagementHelpers, ManagementHelpers } from "@/app/actions/class-management"
import { getErrorMessage } from "@/lib/error-handler"
import Link from "next/link"

// --- Specific Interfaces ---
interface Student {
  id: string
  name: string | null
  email: string
}

interface DisplaySubject {
  id: string
  name: string
  isCompulsory: boolean
}

type AllocationMatrix = Record<string, string[]>

// 1. Next.js 15/App Router pages must not have custom props in the signature
// We use hooks to get the data instead.
function AllocationMatrixContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Extract params from URL
  // const classId = searchParams.get("classId") || ""
  const gradeId = searchParams.get("gradeId") || ""
  const schoolId = searchParams.get("schoolId") || ""
  const className = searchParams.get("className") || "Class"
  
  // --- State ---
  const [students, setStudents] = useState<Student[]>([])
  const [subjects, setSubjects] = useState<DisplaySubject[]>([])
  const [matrix, setMatrix] = useState<AllocationMatrix>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // 1. Load Data
  useEffect(() => {
    async function loadData() {
      if (!schoolId || !gradeId) return
      setIsLoading(true)
      try {
        const helpers: ManagementHelpers = await getManagementHelpers(schoolId)
        
        const currentGrade = helpers.grades.find(g => g.id === gradeId)
        if (currentGrade) {
          const formattedSubjects: DisplaySubject[] = currentGrade.gradeSubjects.map((gs) => ({
            id: gs.id,
            name: gs.subject.name,
            isCompulsory: true
          }))
          setSubjects(formattedSubjects)
        }

        setStudents(helpers.students)
      } catch (err) {
        toast.error(getErrorMessage(err))
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [gradeId, schoolId])

  // 2. Bulk Logic
  const applyCoreToAll = () => {
    const allSubjectIds = subjects.map(s => s.id)
    const newMatrix: AllocationMatrix = {}
    students.forEach(student => {
      newMatrix[student.id] = allSubjectIds
    })
    setMatrix(newMatrix)
    toast.success(`Broad-mapped ${allSubjectIds.length} subjects.`)
  }

  // 3. Individual Toggle
  const toggleSubject = (studentId: string, subId: string) => {
    const currentSelection = matrix[studentId] || []
    const updatedSelection = currentSelection.includes(subId)
      ? currentSelection.filter(id => id !== subId) 
      : [...currentSelection, subId]
    
    setMatrix(prev => ({ ...prev, [studentId]: updatedSelection }))
  }

  // 4. Persistence
 // Find the handleSave function and update the .map call:
// Inside AllocationMatrixContent component...

const handleSave = () => {
    if (Object.keys(matrix).length === 0) {
      toast.error("The allocation matrix is empty.")
      return
    }

    startTransition(async () => {
      try {
        // ✅ FIXED: Now using 'studentId' as the key to call the student-specific action
        const savePromises = Object.entries(matrix).map(([studentId, subjectIds]) => 
          allocateStudentSubjects(schoolId, studentId, subjectIds)
        )

        const results = await Promise.all(savePromises)
        const failed = results.filter(r => !r.success)

        if (failed.length > 0) {
          toast.error(`Sync completed with ${failed.length} errors.`)
        } else {
          toast.success("Allocation Registry synchronized successfully.")
          router.refresh()
        }
      } catch (err) {
        toast.error(getErrorMessage(err))
      }
    })
}

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
        <p className="text-slate-400 font-mono text-xs uppercase">Loading_Matrix...</p>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Link href="/admin/classes" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 mb-4">
            <ArrowLeft className="h-3 w-3" /> Exit to Class Placement
          </Link>
          <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Allocation Matrix</h1>
          <p className="text-slate-500 text-sm font-medium">Registry: <span className="text-slate-300">{className}</span></p>
        </div>
        
        <div className="flex flex-wrap gap-3">
           <button onClick={applyCoreToAll} className="bg-slate-900 border border-school-primary/30 text-school-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all">
             Map Core to Class
           </button>
           <button onClick={handleSave} disabled={isPending} className="bg-school-primary text-school-secondary px-8 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 hover:brightness-110 disabled:opacity-50">
             {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
             Commit Changes
           </button>
        </div>
      </header>

      <div className="mb-8 p-5 rounded-[2rem] bg-school-primary/5 border border-school-primary/10 flex items-start gap-4 text-xs">
        <Info className="h-6 w-6 text-school-primary shrink-0" />
        <p className="text-slate-400 leading-relaxed">
            Ensure students are mapped to either <span className="text-white">CRS</span> or <span className="text-white">IRS</span>. Core subjects should remain uniform.
        </p>
      </div>

      <div className="rounded-[2.5rem] border border-school-secondary/20 bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/80 text-[10px] uppercase tracking-[0.3em] text-slate-500">
                <th className="p-8 sticky left-0 bg-slate-950 z-20 min-w-[300px]">Student Registry</th>
                {subjects.map(sub => (
                  <th key={sub.id} className="p-8 text-center border-l border-white/5 whitespace-nowrap">{sub.name}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map(student => (
                <tr key={student.id} className="hover:bg-school-primary/5 transition-all group">
                  <td className="p-8 font-bold sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800 transition-colors flex items-center gap-4">
                    <UserCircle className="h-6 w-6 text-slate-400" />
                    <div className="flex flex-col">
                      <span className="text-sm text-white uppercase">{student.name || "UNNAMED"}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{student.email}</span>
                    </div>
                  </td>
                  {subjects.map(sub => {
                    const isAllocated = matrix[student.id]?.includes(sub.id)
                    return (
                      <td key={sub.id} className="p-8 text-center border-l border-white/5">
                        <button 
                          onClick={() => toggleSubject(student.id, sub.id)}
                          className={`h-8 w-8 rounded-xl border transition-all flex items-center justify-center mx-auto ${
                            isAllocated ? 'bg-school-primary border-school-primary text-school-secondary' : 'border-white/10'
                          }`}
                        >
                          {isAllocated && <Check className="h-5 w-5 stroke-[5]" />}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {students.length === 0 && (
        <div className="py-40 text-center text-slate-600 font-bold uppercase text-xs">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
            No active students found in this classroom.
        </div>
      )}
    </div>
  )
}

// 2. The default export MUST be a simple Page component to satisfy Next.js types
export default function SubjectAllocationPage() {
  return (
    <Suspense fallback={<div className="bg-slate-950 min-h-screen" />}>
      <AllocationMatrixContent />
    </Suspense>
  )
}