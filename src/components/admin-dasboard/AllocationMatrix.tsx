// 'use client'

// import { useState, useEffect, useTransition } from 'react'
// import { Check, UserCircle, Save, Loader2, Info, Zap, Target } from 'lucide-react'
// import { getClassSubjectAllocation, syncStudentSubjects } from '@/app/actions/subject-allocation'
// import type { NigerianStream, SubjectAllocationData } from '@/app/actions/subject-allocation'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// export function AllocationMatrix({ classId, schoolId }: { classId: string, schoolId: string }) {
//     const [data, setData] = useState<any>(null)
//     const [matrix, setMatrix] = useState<Record<string, string[]>>({})
//     const [isPending, startTransition] = useTransition()

//     useEffect(() => {
//         getClassSubjectAllocation(classId, schoolId).then(res => {
//             if (res) {
//                 setData(res)
//                 const initialMap: Record<string, string[]> = {}
//                 res.students.forEach((s: any) => initialMap[s.id] = s.subjects)
//                 setMatrix(initialMap)
//             }
//         })
//     }, [classId, schoolId])

//     const toggle = (studentId: string, gsId: string) => {
//         const current = matrix[studentId] || []
//         const updated = current.includes(gsId) ? current.filter(id => id !== gsId) : [...current, gsId]
//         setMatrix({ ...matrix, [studentId]: updated })
//     }

//     const applyStream = (stream: NigerianStream | 'compulsory') => {
//         const newMatrix = { ...matrix }
//         data.students.forEach((s: any) => {
//             const filtered = data.availableSubjects
//                 .filter((sub: any) => stream === 'compulsory' ? sub.isCompulsory : (sub.isCompulsory || sub.stream === stream))
//                 .map((sub: any) => sub.id)
//             newMatrix[s.id] = Array.from(new Set([...(newMatrix[s.id] || []), ...filtered]))
//         })
//         setMatrix(newMatrix)
//         toast.success(`Applied ${stream} template to class`)
//     }

//     const handleSave = () => {
//         startTransition(async () => {
//             const promises = Object.entries(matrix).map(([sId, subjects]) => 
//                 syncStudentSubjects(schoolId, sId, subjects, data.grade.level, data.isNigerianCurriculum)
//             )
//             const results = await Promise.all(promises)
//             if (results.every(r => r.success)) toast.success("Registry synchronized")
//             else toast.error("Some records failed (check WAEC 9-subject rule)")
//         })
//     }

//     if (!data) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-school-primary" /></div>

//     return (
//         <div className="space-y-6">
//             {/* ── Action Toolbar ── */}
//             <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
//                 <div className="flex gap-2">
//                     <button onClick={() => applyStream('compulsory')} className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all">Assign Core Only</button>
//                     {data.grade.isSSS && (
//                         <>
//                             <button onClick={() => applyStream('science')} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-500/20 transition-all">Apply Science</button>
//                             <button onClick={() => applyStream('arts')} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-purple-500/20 transition-all">Apply Arts</button>
//                         </>
//                     )}
//                 </div>
//                 <button onClick={handleSave} disabled={isPending} className="bg-school-primary text-school-secondary-950 font-black px-10 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl shadow-school-primary/20">
//                     {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//                     SYNC ALLOCATIONS
//                 </button>
//             </div>

//             {/* ── Matrix Table ── */}
//             <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl">
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-slate-950/80 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
//                                 <th className="p-8 sticky left-0 bg-slate-950 z-20 min-w-[300px] border-b border-white/5">Student Registry</th>
//                                 {data.availableSubjects.map((sub: any) => (
//                                     <th key={sub.id} className="p-8 text-center border-l border-white/5 border-b whitespace-nowrap min-w-[140px] italic">
//                                         {sub.subjectName}
//                                         {sub.isCompulsory && <span className="block text-[8px] text-school-primary mt-1">Compulsory</span>}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {data.students.map((student: any) => (
//                                 <tr key={student.id} className="hover:bg-school-primary/5 transition-all group">
//                                     <td className="p-8 sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800 transition-colors shadow-2xl border-r border-white/5">
//                                         <div className="flex items-center gap-4">
//                                             <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5"><UserCircle className="h-6 w-6" /></div>
//                                             <div className="flex flex-col min-w-0">
//                                                 <span className="text-sm text-white font-black uppercase truncate">{student.name || "UNNAMED"}</span>
//                                                 <span className="text-[10px] text-slate-500 font-mono lowercase">{student.email}</span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     {data.availableSubjects.map((sub: any) => {
//                                         const isAllocated = matrix[student.id]?.includes(sub.id)
//                                         return (
//                                             <td key={sub.id} className="p-8 text-center border-l border-white/5">
//                                                 <button 
//                                                     onClick={() => toggle(student.id, sub.id)}
//                                                     className={cn(
//                                                         "h-8 w-8 rounded-xl border transition-all flex items-center justify-center mx-auto",
//                                                         isAllocated ? 'bg-school-primary border-school-primary text-school-secondary-950 scale-110 shadow-lg' : 'border-white/10 hover:border-school-primary/40'
//                                                     )}
//                                                 >
//                                                     {isAllocated && <Check className="h-5 w-5 stroke-[5]" />}
//                                                 </button>
//                                             </td>
//                                         )
//                                     })}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect, useTransition } from 'react'
// import { Check, UserCircle, Save, Loader2, Target } from 'lucide-react'
// // ✅ Separated Type-only import to resolve Build Error
// import { getClassSubjectAllocation, syncStudentSubjects } from '@/app/actions/subject-allocation'
// import type { NigerianStream, SubjectAllocationData } from '@/app/actions/subject-allocation'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface AllocationMatrixProps {
//     classId: string
//     schoolId: string
// }

// export function AllocationMatrix({ classId, schoolId }: AllocationMatrixProps) {
//     const [data, setData] = useState<SubjectAllocationData | null>(null)
//     const [matrix, setMatrix] = useState<Record<string, string[]>>({})
//     const [isPending, startTransition] = useTransition()

//     // 1. Fetch data on mount
//     useEffect(() => {
//         getClassSubjectAllocation(classId, schoolId).then(res => {
//             if (res) {
//                 setData(res)
//                 const initialMap: Record<string, string[]> = {}
//                 res.students.forEach((s) => {
//                     initialMap[s.id] = s.subjects
//                 })
//                 setMatrix(initialMap)
//             }
//         })
//     }, [classId, schoolId])

//     // 2. Toggle subject for a specific student
//     const toggle = (studentId: string, gsId: string) => {
//         const current = matrix[studentId] || []
//         const updated = current.includes(gsId) 
//             ? current.filter(id => id !== gsId) 
//             : [...current, gsId]
//         setMatrix({ ...matrix, [studentId]: updated })
//     }

//     // 3. Apply templates (Core, Science, Arts)
//     const applyTemplate = (stream: NigerianStream | 'compulsory') => {
//         if (!data) return
//         const newMatrix = { ...matrix }
//         data.students.forEach((student) => {
//             const templateIds = data.availableSubjects
//                 .filter((sub) => 
//                     stream === 'compulsory' 
//                         ? sub.isCompulsory 
//                         : (sub.isCompulsory || sub.stream === stream)
//                 )
//                 .map((sub) => sub.id)
            
//             newMatrix[student.id] = Array.from(new Set([...(newMatrix[student.id] || []), ...templateIds]))
//         })
//         setMatrix(newMatrix)
//         toast.success(`Applied ${stream} template to class registry`)
//     }

//     // 4. Batch Save Logic
//     const handleSave = () => {
//         if (!data) return
//         startTransition(async () => {
//             try {
//                 const promises = Object.entries(matrix).map(([sId, subjects]) => 
//                     syncStudentSubjects(
//                         schoolId, 
//                         sId, 
//                         subjects, 
//                         data.grade.level, 
//                         data.isNigerianCurriculum
//                     )
//                 )
//                 const results = await Promise.all(promises)
                
//                 if (results.every(r => r.success)) {
//                     toast.success("Academic registry synchronized successfully")
//                 } else {
//                     toast.error("Partial sync: Some students failed the 9-subject WAEC rule")
//                 }
//             } catch (err) {
//                 toast.error("A system error occurred during synchronization")
//             }
//         })
//     }

//     if (!data) return (
//         <div className="p-20 flex flex-col items-center justify-center gap-4">
//             <Loader2 className="animate-spin text-school-primary h-10 w-10" />
//             <p className="text-slate-500 font-mono text-xs uppercase tracking-widest">Building_Allocation_Matrix...</p>
//         </div>
//     )

//     return (
//         <div className="space-y-6 animate-in fade-in duration-500">
//             {/* ── Toolbar ── */}
//             <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 p-6 rounded-[2rem] border border-white/5 shadow-2xl">
//                 <div className="flex flex-wrap gap-2">
//                     <button 
//                         onClick={() => applyTemplate('compulsory')} 
//                         className="px-4 py-2 bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-700 transition-all"
//                     >
//                         Assign Core Only
//                     </button>
//                     {data.grade.isSSS && (
//                         <>
//                             <button onClick={() => applyTemplate('science')} className="px-4 py-2 bg-blue-500/10 text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all border border-blue-500/20">Apply Science</button>
//                             <button onClick={() => applyTemplate('arts')} className="px-4 py-2 bg-purple-500/10 text-purple-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-purple-500/20 transition-all border border-purple-500/20">Apply Arts</button>
//                         </>
//                     )}
//                 </div>
                
//                 <button 
//                     onClick={handleSave} 
//                     disabled={isPending}
//                     className="bg-school-primary text-school-secondary-950 font-black px-10 py-3 rounded-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 shadow-xl shadow-school-primary/20 disabled:opacity-30"
//                 >
//                     {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
//                     SYNC REGISTRY
//                 </button>
//             </div>

//             {/* ── Matrix Registry Table ── */}
//             <div className="rounded-[2.5rem] border border-white/5 bg-slate-900 overflow-hidden shadow-2xl relative">
//                 {isPending && <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm z-50 flex items-center justify-center font-black text-school-primary uppercase tracking-[0.3em]">Processing_Updates...</div>}
                
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-left border-collapse">
//                         <thead>
//                             <tr className="bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
//                                 <th className="p-8 sticky left-0 bg-slate-950 z-20 min-w-[300px] border-b border-white/5 shadow-xl">Student Identity</th>
//                                 {data.availableSubjects.map((sub) => (
//                                     <th key={sub.id} className="p-8 text-center border-l border-white/5 border-b whitespace-nowrap min-w-[140px] italic">
//                                         {sub.subjectName}
//                                         {sub.isCompulsory && <span className="block text-[8px] text-school-primary mt-1 font-black">CORE</span>}
//                                     </th>
//                                 ))}
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {data.students.map((student) => (
//                                 <tr key={student.id} className="hover:bg-school-primary/5 transition-all group">
//                                     <td className="p-8 sticky left-0 bg-slate-900 z-10 group-hover:bg-slate-800 transition-colors shadow-2xl border-r border-white/5">
//                                         <div className="flex items-center gap-4">
//                                             <div className="h-10 w-10 rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500 border border-white/5 group-hover:text-school-primary transition-colors shadow-inner">
//                                                 <UserCircle className="h-6 w-6" />
//                                             </div>
//                                             <div className="flex flex-col min-w-0">
//                                                 <span className="text-sm text-white font-black uppercase truncate tracking-tight">{student.name || "UNNAMED_IDENT"}</span>
//                                                 <span className="text-[10px] text-slate-500 font-mono lowercase truncate">{student.email}</span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     {data.availableSubjects.map((sub) => {
//                                         const isAllocated = matrix[student.id]?.includes(sub.id)
//                                         return (
//                                             <td key={sub.id} className="p-8 text-center border-l border-white/5">
//                                                 <button 
//                                                     onClick={() => toggle(student.id, sub.id)}
//                                                     className={cn(
//                                                         "h-8 w-8 rounded-xl border transition-all flex items-center justify-center mx-auto",
//                                                         isAllocated 
//                                                             ? 'bg-school-primary border-school-primary text-school-secondary-950 scale-110 shadow-[0_0_20px_rgba(var(--school-primary-rgb),0.3)]' 
//                                                             : 'border-white/10 hover:border-school-primary/40 bg-slate-950/50 hover:bg-slate-900'
//                                                     )}
//                                                 >
//                                                     {isAllocated && <Check className="h-5 w-5 stroke-[5]" />}
//                                                 </button>
//                                             </td>
//                                         )
//                                     })}
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* ── Empty State ── */}
//             {data.students.length === 0 && (
//                 <div className="py-40 text-center bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5">
//                     <Target className="h-16 w-16 text-slate-800 mx-auto mb-6 opacity-20" />
//                     <h3 className="text-xl font-black text-slate-700 uppercase tracking-[0.3em]">No Students Registered in Classroom</h3>
//                 </div>
//             )}
//         </div>
//     )
// }