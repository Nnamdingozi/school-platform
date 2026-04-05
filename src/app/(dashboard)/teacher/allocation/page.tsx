


// "use client"

// import { useState, useEffect, useTransition, Suspense } from "react"
// import { toast } from "sonner"
// import { Check, UserCircle, Save, Loader2, Info, ArrowLeft, Users } from "lucide-react"
// import { useSearchParams, useRouter } from "next/navigation"
// import { allocateStudentSubjects } from "@/app/actions/subject-allocation"
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

// type AllocationMatrix = Record<string, string[]>

// // 1. Next.js 15/App Router pages must not have custom props in the signature
// // We use hooks to get the data instead.
// function AllocationMatrixContent() {
//   const searchParams = useSearchParams()
//   const router = useRouter()

//   // Extract params from URL
//   // const classId = searchParams.get("classId") || ""
//   const gradeId = searchParams.get("gradeId") || ""
//   const schoolId = searchParams.get("schoolId") || ""
//   const className = searchParams.get("className") || "Class"
  
//   // --- State ---
//   const [students, setStudents] = useState<Student[]>([])
//   const [subjects, setSubjects] = useState<DisplaySubject[]>([])
//   const [matrix, setMatrix] = useState<AllocationMatrix>({})
//   const [isLoading, setIsLoading] = useState(true)
//   const [isPending, startTransition] = useTransition()

//   // 1. Load Data
//   useEffect(() => {
//     async function loadData() {
//       if (!schoolId || !gradeId) return
//       setIsLoading(true)
//       try {
//         const helpers: ManagementHelpers = await getManagementHelpers(schoolId)
        
//         const currentGrade = helpers.grades.find(g => g.id === gradeId)
//         if (currentGrade) {
//           const formattedSubjects: DisplaySubject[] = currentGrade.gradeSubjects.map((gs) => ({
//             id: gs.id,
//             name: gs.subject.name,
//             isCompulsory: true
//           }))
//           setSubjects(formattedSubjects)
//         }

//         setStudents(helpers.students)
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       } finally {
//         setIsLoading(false)
//       }
//     }
//     loadData()
//   }, [gradeId, schoolId])

//   // 2. Bulk Logic
//   const applyCoreToAll = () => {
//     const allSubjectIds = subjects.map(s => s.id)
//     const newMatrix: AllocationMatrix = {}
//     students.forEach(student => {
//       newMatrix[student.id] = allSubjectIds
//     })
//     setMatrix(newMatrix)
//     toast.success(`Broad-mapped ${allSubjectIds.length} subjects.`)
//   }

//   // 3. Individual Toggle
//   const toggleSubject = (studentId: string, subId: string) => {
//     const currentSelection = matrix[studentId] || []
//     const updatedSelection = currentSelection.includes(subId)
//       ? currentSelection.filter(id => id !== subId) 
//       : [...currentSelection, subId]
    
//     setMatrix(prev => ({ ...prev, [studentId]: updatedSelection }))
//   }

//   // 4. Persistence
//  // Find the handleSave function and update the .map call:
// // Inside AllocationMatrixContent component...

// const handleSave = () => {
//     if (Object.keys(matrix).length === 0) {
//       toast.error("The allocation matrix is empty.")
//       return
//     }

//     startTransition(async () => {
//       try {
//         // ✅ FIXED: Now using 'studentId' as the key to call the student-specific action
//         const savePromises = Object.entries(matrix).map(([studentId, subjectIds]) => 
//           allocateStudentSubjects(schoolId, studentId, subjectIds)
//         )

//         const results = await Promise.all(savePromises)
//         const failed = results.filter(r => !r.success)

//         if (failed.length > 0) {
//           toast.error(`Sync completed with ${failed.length} errors.`)
//         } else {
//           toast.success("Allocation Registry synchronized successfully.")
//           router.refresh()
//         }
//       } catch (err) {
//         toast.error(getErrorMessage(err))
//       }
//     })
// }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-slate-400 font-mono text-xs uppercase">Loading_Matrix...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white">
//       <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
//         <div className="space-y-2">
//           <Link href="/admin/classes" className="text-school-primary text-[10px] font-black uppercase flex items-center gap-2 mb-4">
//             <ArrowLeft className="h-3 w-3" /> Exit to Class Placement
//           </Link>
//           <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Allocation Matrix</h1>
//           <p className="text-slate-500 text-sm font-medium">Registry: <span className="text-slate-300">{className}</span></p>
//         </div>
        
//         <div className="flex flex-wrap gap-3">
//            <button onClick={applyCoreToAll} className="bg-slate-900 border border-school-primary/30 text-school-primary px-6 py-3 rounded-2xl text-[10px] font-black uppercase hover:bg-slate-800 transition-all">
//              Map Core to Class
//            </button>
//            <button onClick={handleSave} disabled={isPending} className="bg-school-primary text-school-secondary px-8 py-3 rounded-2xl font-black uppercase text-[10px] flex items-center gap-3 hover:brightness-110 disabled:opacity-50">
//              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//              Commit Changes
//            </button>
//         </div>
//       </header>

//       <div className="mb-8 p-5 rounded-[2rem] bg-school-primary/5 border border-school-primary/10 flex items-start gap-4 text-xs">
//         <Info className="h-6 w-6 text-school-primary shrink-0" />
//         <p className="text-slate-400 leading-relaxed">
//             Ensure students are mapped to either <span className="text-white">CRS</span> or <span className="text-white">IRS</span>. Core subjects should remain uniform.
//         </p>
//       </div>

//       <div className="rounded-[2.5rem] border border-school-secondary/20 bg-slate-900 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left border-collapse">
//             <thead>
//               <tr className="bg-slate-950/80 text-[10px] uppercase tracking-[0.3em] text-slate-500">
//                 <th className="p-8 sticky left-0 bg-slate-950 z-20 min-w-[300px]">Student Registry</th>
//                 {subjects.map(sub => (
//                   <th key={sub.id} className="p-8 text-center border-l border-white/5 whitespace-nowrap">{sub.name}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-white/5">
//               {students.map(student => (
//                 <tr key={student.id} className="hover:bg-school-primary/5 transition-all group">
//                   <td className="p-8 font-bold sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800 transition-colors flex items-center gap-4">
//                     <UserCircle className="h-6 w-6 text-slate-400" />
//                     <div className="flex flex-col">
//                       <span className="text-sm text-white uppercase">{student.name || "UNNAMED"}</span>
//                       <span className="text-[10px] text-slate-500 font-mono">{student.email}</span>
//                     </div>
//                   </td>
//                   {subjects.map(sub => {
//                     const isAllocated = matrix[student.id]?.includes(sub.id)
//                     return (
//                       <td key={sub.id} className="p-8 text-center border-l border-white/5">
//                         <button 
//                           onClick={() => toggleSubject(student.id, sub.id)}
//                           className={`h-8 w-8 rounded-xl border transition-all flex items-center justify-center mx-auto ${
//                             isAllocated ? 'bg-school-primary border-school-primary text-school-secondary' : 'border-white/10'
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
      
//       {students.length === 0 && (
//         <div className="py-40 text-center text-slate-600 font-bold uppercase text-xs">
//             <Users className="h-12 w-12 mx-auto mb-4 opacity-20" />
//             No active students found in this classroom.
//         </div>
//       )}
//     </div>
//   )
// }

// // 2. The default export MUST be a simple Page component to satisfy Next.js types
// export default function SubjectAllocationPage() {
//   return (
//     <Suspense fallback={<div className="bg-slate-950 min-h-screen" />}>
//       <AllocationMatrixContent />
//     </Suspense>
//   )
// }



'use client'

import { useProfileStore } from "@/store/profileStore";
import { AllocationMatrix } from "@/components/admin-dasboard/allocation-matrix";
import { Loader2, TableProperties } from "lucide-react";
import { isTeacherProfile } from "@/types/profile";

export default function TeacherAllocationPage() {
    // Inside your TeacherAllocationPage component:

const { profile, isLoading } = useProfileStore();

if (isLoading) return <Loader2 className="animate-spin" />;

// ✅ FIX: Use the Type Guard to narrow the type from AnyProfile to ProfileInStore
if (!profile || !isTeacherProfile(profile)) {
    return <div className="p-20 text-center text-slate-500">Access Denied: Teachers only.</div>;
}

// Now TypeScript knows 'taughtClasses' exists 100%
const myClass = profile.taughtClasses[0]; 

if (!myClass) {
    return <div className="p-20 text-center text-slate-500 italic">No assigned classes found.</div>;
}

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen">
             <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
                        <TableProperties className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">My Class Allocation</h1>
                        <p className="text-slate-500 text-sm font-medium">{myClass.name} • Academic Year Registry</p>
                    </div>
                </header>

                {/* We reuse the exact same matrix component we built for the Admin! */}
                <AllocationMatrix classId={myClass.id} schoolId={profile!.schoolId!} />
            </div>
        </div>
    );
}