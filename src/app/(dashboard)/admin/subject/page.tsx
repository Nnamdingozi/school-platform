// 'use client'

// import { useState, useEffect } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import {
//     getSchoolClassesWithGrades,
//     getClassSubjectAllocation,
//     autoAllocateCompulsorySubjects,
//     allocateSubjectsToStudent,
//     allocateStreamSubjects,
//     removeStudentSubject,
//     SubjectAllocationData,
//     NigerianStream,
// } from '@/app/actions/subject-allocation.actions'
// import {
//     BookOpen, Users, Loader2, CheckCircle2,
//     AlertCircle, Zap, ChevronDown, Info,
//     GraduationCap, X, Plus, 
// } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// // ── Types ──────────────────────────────────────────────────────────────────────

// type ClassSummary = {
//     id:      string
//     name:    string
//     grade:   { id: string; displayName: string; level: number }
//     teacher: { name: string | null }
//     _count:  { enrollments: number }
// }

// // ── Stream badge ───────────────────────────────────────────────────────────────

// const STREAM_CONFIG: Record<NigerianStream, { label: string; color: string; bg: string; border: string }> = {
//     science:    { label: 'Science',    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
//     arts:       { label: 'Arts',       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
//     commercial: { label: 'Commercial', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
//     general:    { label: 'General',    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
// }

// function StreamBadge({ stream }: { stream: NigerianStream | null }) {
//     if (!stream) return null
//     const config = STREAM_CONFIG[stream]
//     return (
//         <span className={cn(
//             'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border',
//             config.color, config.bg, config.border
//         )}>
//             {config.label}
//         </span>
//     )
// }

// // ── Student row ────────────────────────────────────────────────────────────────

// function StudentSubjectRow({
//     student,
//     availableSubjects,
//     isNigerian,
//     isSSS,
//     schoolId,
//     classId,
//     onUpdate,
// }: {
//     student:           SubjectAllocationData['students'][0]
//     availableSubjects: SubjectAllocationData['availableSubjects']
//     isNigerian:        boolean
//     isSSS:             boolean
//     schoolId:          string
//     classId:           string
//     onUpdate:          () => void
// }) {
//     const [expanded,      setExpanded]      = useState(false)
//     const [allocating,    setAllocating]    = useState(false)
//     const [removing,      setRemoving]      = useState<string | null>(null)
//     const [streamLoading, setStreamLoading] = useState(false)

//     const allocatedIds  = new Set(student.subjects.map(s => s.gradeSubjectId))
//     const unallocated   = availableSubjects.filter(s => !allocatedIds.has(s.id))
//     const allAllocated  = unallocated.length === 0
//     const subjectCount  = student.subjects.length
//     const totalSubjects = availableSubjects.length

//     async function handleAddSubject(gradeSubjectId: string) {
//         setAllocating(true)
//         const result = await allocateSubjectsToStudent({
//             studentId:       student.id,
//             gradeSubjectIds: [gradeSubjectId],
//             schoolId,
//             isCompulsory:    false,
//         })
//         if (result.success) {
//             toast.success('Subject added.')
//             onUpdate()
//         } else {
//             toast.error(result.error ?? 'Failed to add subject.')
//         }
//         setAllocating(false)
//     }

//     async function handleRemoveSubject(gradeSubjectId: string) {
//         setRemoving(gradeSubjectId)
//         const result = await removeStudentSubject(student.id, gradeSubjectId, schoolId)
//         if (result.success) {
//             toast.success('Subject removed.')
//             onUpdate()
//         } else {
//             toast.error(result.error ?? 'Failed to remove.')
//         }
//         setRemoving(null)
//     }

//     async function handleSetStream(stream: NigerianStream) {
//         setStreamLoading(true)
//         const result = await allocateStreamSubjects(student.id, stream, classId, schoolId)
//         if (result.success) {
//             toast.success(`${STREAM_CONFIG[stream].label} stream subjects allocated.`)
//             onUpdate()
//         } else {
//             toast.error(result.error ?? 'Failed to allocate stream.')
//         }
//         setStreamLoading(false)
//     }

//     return (
//         <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 overflow-hidden">
//             {/* Student header */}
//             <button
//                 onClick={() => setExpanded(p => !p)}
//                 className="w-full flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/50 transition-colors text-left"
//             >
//                 {/* Avatar */}
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20 text-xs font-black text-school-primary">
//                     {(student.name ?? 'S').charAt(0).toUpperCase()}
//                 </div>

//                 {/* Name + stream */}
//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2 flex-wrap">
//                         <p className="text-xs font-bold text-white truncate">
//                             {student.name ?? 'Unnamed Student'}
//                         </p>
//                         {isNigerian && student.stream && (
//                             <StreamBadge stream={student.stream} />
//                         )}
//                     </div>
//                     <p className="text-[10px] text-school-secondary-500 mt-0.5">
//                         {subjectCount}/{totalSubjects} subjects allocated
//                     </p>
//                 </div>

//                 {/* Progress + expand */}
//                 <div className="flex items-center gap-2 shrink-0">
//                     {/* Progress bar */}
//                     <div className="hidden sm:block w-20">
//                         <div className="h-1.5 w-full rounded-full bg-school-secondary-700">
//                             <div
//                                 className={cn(
//                                     'h-1.5 rounded-full transition-all',
//                                     allAllocated ? 'bg-green-500' : 'bg-school-primary'
//                                 )}
//                                 style={{
//                                     width: totalSubjects > 0
//                                         ? `${(subjectCount / totalSubjects) * 100}%`
//                                         : '0%'
//                                 }}
//                             />
//                         </div>
//                     </div>

//                     {allAllocated
//                         ? <CheckCircle2 className="h-4 w-4 text-green-400" />
//                         : <AlertCircle  className="h-4 w-4 text-amber-400" />
//                     }

//                     <ChevronDown className={cn(
//                         'h-3.5 w-3.5 text-school-secondary-400 transition-transform',
//                         expanded && 'rotate-180'
//                     )} />
//                 </div>
//             </button>

//             {/* Expanded content */}
//             {expanded && (
//                 <div className="border-t border-school-secondary-700 p-4 space-y-4">

//                     {/* SSS stream selector */}
//                     {isNigerian && isSSS && (
//                         <div className="space-y-2">
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Allocate by Stream
//                             </p>
//                             <div className="flex flex-wrap gap-2">
//                                 {(Object.keys(STREAM_CONFIG) as NigerianStream[])
//                                     .filter(s => s !== 'general')
//                                     .map(stream => {
//                                         const config = STREAM_CONFIG[stream]
//                                         return (
//                                             <button
//                                                 key={stream}
//                                                 onClick={() => handleSetStream(stream)}
//                                                 disabled={streamLoading}
//                                                 className={cn(
//                                                     'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[11px] font-bold transition-all disabled:opacity-50',
//                                                     config.color, config.bg, config.border,
//                                                     'hover:opacity-80'
//                                                 )}
//                                             >
//                                                 {streamLoading
//                                                     ? <Loader2 className="h-3 w-3 animate-spin" />
//                                                     : <Zap className="h-3 w-3" />
//                                                 }
//                                                 {config.label}
//                                             </button>
//                                         )
//                                     })
//                                 }
//                             </div>
//                             <p className="text-[10px] text-school-secondary-500">
//                                 Selecting a stream allocates core + stream-specific subjects
//                             </p>
//                         </div>
//                     )}

//                     {/* Currently allocated */}
//                     {student.subjects.length > 0 && (
//                         <div className="space-y-1.5">
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Allocated Subjects ({student.subjects.length})
//                             </p>
//                             <div className="flex flex-wrap gap-1.5">
//                                 {student.subjects.map(s => (
//                                     <span
//                                         key={s.gradeSubjectId}
//                                         className={cn(
//                                             'inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-medium transition-all group',
//                                             s.isCompulsory
//                                                 ? 'bg-school-primary/10 border-school-primary/20 text-school-primary'
//                                                 : 'bg-school-secondary-800 border-school-secondary-600 text-school-secondary-300'
//                                         )}
//                                     >
//                                         {s.subjectName}
//                                         {!s.isCompulsory && (
//                                             <button
//                                                 onClick={() => handleRemoveSubject(s.gradeSubjectId)}
//                                                 disabled={removing === s.gradeSubjectId}
//                                                 className="ml-0.5 opacity-50 hover:opacity-100 transition-opacity"
//                                             >
//                                                 {removing === s.gradeSubjectId
//                                                     ? <Loader2 className="h-2.5 w-2.5 animate-spin" />
//                                                     : <X className="h-2.5 w-2.5" />
//                                                 }
//                                             </button>
//                                         )}
//                                     </span>
//                                 ))}
//                             </div>
//                             <p className="text-[10px] text-school-secondary-500">
//                                 Gold = compulsory · Grey = elective (click × to remove)
//                             </p>
//                         </div>
//                     )}

//                     {/* Add unallocated subjects */}
//                     {unallocated.length > 0 && (
//                         <div className="space-y-1.5">
//                             <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                 Add Subject
//                             </p>
//                             <div className="flex flex-wrap gap-1.5">
//                                 {unallocated.map(s => (
//                                     <button
//                                         key={s.id}
//                                         onClick={() => handleAddSubject(s.id)}
//                                         disabled={allocating}
//                                         className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-dashed border-school-secondary-600 text-school-secondary-400 hover:border-school-primary hover:text-school-primary text-[11px] font-medium transition-all disabled:opacity-50"
//                                     >
//                                         <Plus className="h-2.5 w-2.5" />
//                                         {s.subjectName}
//                                         {s.stream && (
//                                             <span className={cn(
//                                                 'text-[9px] font-bold',
//                                                 STREAM_CONFIG[s.stream].color
//                                             )}>
//                                                 {s.stream.toUpperCase().slice(0, 3)}
//                                             </span>
//                                         )}
//                                     </button>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {allAllocated && (
//                         <p className="flex items-center gap-1.5 text-[11px] text-green-400">
//                             <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
//                             All available subjects have been allocated
//                         </p>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }

// // ── Main Page ──────────────────────────────────────────────────────────────────

// export default function SubjectAllocationPage() {
//     const { profile } = useProfileStore()
//     const schoolId    = profile?.schoolId ?? ''

//     const [classes,       setClasses]       = useState<ClassSummary[]>([])
//     const [selectedClass, setSelectedClass] = useState<string | null>(null)
//     const [allocation,    setAllocation]    = useState<SubjectAllocationData | null>(null)
//     const [classLoading,  setClassLoading]  = useState(true)
//     const [dataLoading,   setDataLoading]   = useState(false)
//     const [autoAllocating, setAutoAllocating] = useState(false)

//     // ── Load classes ───────────────────────────────────────────────────────
//     useEffect(() => {
//         if (!schoolId) return
//         setClassLoading(true)
//         getSchoolClassesWithGrades(schoolId)
//             .then(setClasses)
//             .finally(() => setClassLoading(false))
//     }, [schoolId])

//     // ── Load allocation data when class selected ───────────────────────────
//     useEffect(() => {
//         if (!selectedClass || !schoolId) return
//         setDataLoading(true)
//         getClassSubjectAllocation(selectedClass, schoolId)
//             .then(setAllocation)
//             .finally(() => setDataLoading(false))
//     }, [selectedClass, schoolId])

//     function handleRefresh() {
//         if (!selectedClass || !schoolId) return
//         setDataLoading(true)
//         getClassSubjectAllocation(selectedClass, schoolId)
//             .then(setAllocation)
//             .finally(() => setDataLoading(false))
//     }

//     async function handleAutoAllocate() {
//         if (!selectedClass || !schoolId) return
//         setAutoAllocating(true)
//         const result = await autoAllocateCompulsorySubjects(selectedClass, schoolId)
//         if (result.success) {
//             toast.success(`${result.allocated} subject allocations applied.`)
//             handleRefresh()
//         } else {
//             toast.error(result.error ?? 'Auto-allocation failed.')
//         }
//         setAutoAllocating(false)
//     }

//     // ── Derived ────────────────────────────────────────────────────────────
//     const selectedClassData = classes.find(c => c.id === selectedClass)
//     const fullyAllocated    = allocation?.students.every(
//         s => s.subjects.length === allocation.availableSubjects.length
//     ) ?? false

//     // Group classes by grade for the selector
//     const classesByGrade = classes.reduce<Record<string, ClassSummary[]>>((acc, cls) => {
//         const key = cls.grade.displayName
//         if (!acc[key]) acc[key] = []
//         acc[key].push(cls)
//         return acc
//     }, {})

//     return (
//         <div className="min-h-screen bg-school-secondary-950">
//             <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">

//                 {/* ── Header ── */}
//                 <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                         <BookOpen className="h-5 w-5 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
//                             Subject Allocation
//                         </h1>
//                         <p className="text-xs text-school-secondary-400">
//                             Assign subjects to students by class
//                         </p>
//                     </div>
//                 </div>

//                 {/* ── Nigerian curriculum info ── */}
//                 {allocation?.isNigerianCurriculum && (
//                     <div className="flex items-start gap-3 rounded-xl border border-school-primary/15 bg-school-primary/5 px-4 py-3">
//                         <Info className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
//                         <div className="space-y-1">
//                             <p className="text-xs font-semibold text-white">
//                                 Nigerian Curriculum Rules Applied
//                             </p>
//                             <p className="text-[11px] text-school-secondary-400 leading-relaxed">
//                                 {allocation.grade.isJSS
//                                     ? `${allocation.grade.displayName} (JSS) — All subjects are compulsory. Use Auto-Allocate to assign all subjects at once.`
//                                     : `${allocation.grade.displayName} (SSS) — Core subjects are compulsory for all students. Use stream buttons to allocate Science, Arts or Commercial electives per student.`
//                                 }
//                             </p>
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Class selector ── */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                 <GraduationCap className="h-4 w-4 text-school-primary" />
//                             </div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 Select Class
//                             </CardTitle>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-4 sm:p-6">
//                         {classLoading ? (
//                             <div className="flex items-center gap-2">
//                                 <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
//                                 <span className="text-xs text-school-secondary-400">
//                                     Loading classes...
//                                 </span>
//                             </div>
//                         ) : classes.length === 0 ? (
//                             <p className="text-xs text-school-secondary-400">
//                                 No classes found. Create classes first.
//                             </p>
//                         ) : (
//                             <div className="space-y-4">
//                                 {Object.entries(classesByGrade).map(([grade, gradeClasses]) => (
//                                     <div key={grade} className="space-y-2">
//                                         <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                                             {grade}
//                                         </p>
//                                         <div className="flex flex-wrap gap-2">
//                                             {gradeClasses.map(cls => (
//                                                 <button
//                                                     key={cls.id}
//                                                     onClick={() => setSelectedClass(cls.id)}
//                                                     className={cn(
//                                                         'flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold transition-all',
//                                                         selectedClass === cls.id
//                                                             ? 'bg-school-primary border-school-primary text-school-secondary-950'
//                                                             : 'bg-school-secondary-800 border-school-secondary-600 text-white hover:border-school-secondary-400'
//                                                     )}
//                                                 >
//                                                     <Users className="h-3 w-3" />
//                                                     {cls.name}
//                                                     <span className={cn(
//                                                         'text-[10px] font-black rounded-full px-1.5 py-0.5',
//                                                         selectedClass === cls.id
//                                                             ? 'bg-school-secondary-950/20'
//                                                             : 'bg-school-secondary-700 text-school-secondary-400'
//                                                     )}>
//                                                         {cls._count.enrollments}
//                                                     </span>
//                                                 </button>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>

//                 {/* ── Allocation panel ── */}
//                 {selectedClass && (
//                     <Card className="bg-school-secondary-900 border-school-secondary-700">
//                         <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                             <div className="flex items-center justify-between gap-4 flex-wrap">
//                                 <div className="flex items-center gap-3">
//                                     <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                         <Users className="h-4 w-4 text-school-primary" />
//                                     </div>
//                                     <div>
//                                         <CardTitle className="text-sm font-bold text-white">
//                                             {selectedClassData?.name} — Student Allocation
//                                         </CardTitle>
//                                         <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                             {allocation
//                                                 ? `${allocation.students.length} students · ${allocation.availableSubjects.length} subjects available`
//                                                 : 'Loading...'
//                                             }
//                                         </p>
//                                     </div>
//                                 </div>

//                                 {/* Auto-allocate button */}
//                                 {allocation && !fullyAllocated && (
//                                     <button
//                                         onClick={handleAutoAllocate}
//                                         disabled={autoAllocating}
//                                         className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all disabled:opacity-50 shrink-0"
//                                     >
//                                         {autoAllocating
//                                             ? <><Loader2 className="h-3.5 w-3.5 animate-spin" />Allocating...</>
//                                             : <><Zap className="h-3.5 w-3.5" />Auto-Allocate Compulsory</>
//                                         }
//                                     </button>
//                                 )}
//                             </div>
//                         </CardHeader>

//                         <CardContent className="p-4 sm:p-6">
//                             {dataLoading ? (
//                                 <div className="flex items-center justify-center py-12 gap-2">
//                                     <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                                     <span className="text-sm text-school-secondary-400">
//                                         Loading allocation data...
//                                     </span>
//                                 </div>
//                             ) : !allocation ? (
//                                 <p className="text-xs text-school-secondary-400 text-center py-8">
//                                     Failed to load allocation data.
//                                 </p>
//                             ) : allocation.students.length === 0 ? (
//                                 <div className="flex flex-col items-center justify-center py-12 gap-2 text-center">
//                                     <Users className="h-8 w-8 text-school-secondary-600" />
//                                     <p className="text-sm font-bold text-white">No students enrolled</p>
//                                     <p className="text-xs text-school-secondary-400">
//                                         Enroll students in this class first.
//                                     </p>
//                                 </div>
//                             ) : (
//                                 <div className="space-y-3">

//                                     {/* All done banner */}
//                                     {fullyAllocated && (
//                                         <div className="flex items-center gap-2 rounded-xl border border-green-500/20 bg-green-500/5 px-4 py-3 mb-4">
//                                             <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
//                                             <p className="text-xs font-semibold text-green-400">
//                                                 All students have been fully allocated.
//                                             </p>
//                                         </div>
//                                     )}

//                                     {/* Student rows */}
//                                     {allocation.students.map(student => (
//                                         <StudentSubjectRow
//                                             key={student.id}
//                                             student={student}
//                                             availableSubjects={allocation.availableSubjects}
//                                             isNigerian={allocation.isNigerianCurriculum}
//                                             isSSS={allocation.grade.isSSS}
//                                             schoolId={schoolId}
//                                             classId={selectedClass}
//                                             onUpdate={handleRefresh}
//                                         />
//                                     ))}
//                                 </div>
//                             )}
//                         </CardContent>
//                     </Card>
//                 )}

//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import {
//     getSchoolClassesWithGrades,
//     getClassSubjectAllocation,
//     autoAllocateCompulsorySubjects,
//     allocateSubjectsToStudent,
//     allocateStreamSubjects,
//     removeStudentSubject,
//     type SubjectAllocationData,
//     type NigerianStream,
// } from '@/app/actions/subject-allocation'
// import {
//     BookOpen, Users, Loader2, 
//      Zap, ChevronDown, Info,
//     GraduationCap 
// } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// // ── Types ──────────────────────────────────────────────────────────────────────

// type ClassSummary = {
//     id:      string
//     name:    string
//     grade:   { id: string; displayName: string; level: number }
//     teacher: { name: string | null } | null
//     _count:  { enrollments: number }
// }

// interface ActionResponse {
//     success: boolean;
//     error?: string;
// }

// // ── Stream badge ───────────────────────────────────────────────────────────────

// const STREAM_CONFIG: Record<NigerianStream, { label: string; color: string; bg: string; border: string }> = {
//     science:    { label: 'Science',    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
//     arts:       { label: 'Arts',       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
//     commercial: { label: 'Commercial', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
//     general:    { label: 'General',    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
// }

// function StreamBadge({ stream }: { stream: NigerianStream | null }) {
//     if (!stream) return null
//     const config = STREAM_CONFIG[stream]
//     return (
//         <span className={cn(
//             'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border',
//             config.color, config.bg, config.border
//         )}>
//             {config.label}
//         </span>
//     )
// }

// // ── Student row ────────────────────────────────────────────────────────────────

// function StudentSubjectRow({
//     student,
//     availableSubjects,
//     isNigerian,
//     isSSS,
//     schoolId,
//     classId,
//     onUpdate,
// }: {
//     student:           SubjectAllocationData['students'][0]
//     availableSubjects: SubjectAllocationData['availableSubjects']
//     isNigerian:        boolean
//     isSSS:             boolean
//     schoolId:          string
//     classId:           string
//     onUpdate:          () => void
// }) {
//     const [expanded,       setExpanded]       = useState(false)
//     const [savingStream,   setSavingStream]   = useState<NigerianStream | null>(null)
//     const [savingSubjects, setSavingSubjects] = useState(false)

//     const [pendingAdd,    setPendingAdd]    = useState<Set<string>>(new Set())
//     const [pendingRemove, setPendingRemove] = useState<Set<string>>(new Set())

//     const allocatedIds  = new Set(student.subjects)
//     const unallocated   = availableSubjects.filter(s => !allocatedIds.has(s.id))
//     const subjectCount  = student.subjects.length
//     const totalSubjects = availableSubjects.length
//     const hasPending = pendingAdd.size > 0 || pendingRemove.size > 0

//     function togglePendingAdd(gradeSubjectId: string) {
//         setPendingAdd(prev => {
//             const next = new Set(prev);
//             if (next.has(gradeSubjectId)) next.delete(gradeSubjectId);
//             else next.add(gradeSubjectId);
//             return new Set(next);
//         })
//     }

//     function togglePendingRemove(gradeSubjectId: string) {
//         setPendingRemove(prev => {
//             const next = new Set(prev);
//             if (next.has(gradeSubjectId)) next.delete(gradeSubjectId);
//             else next.add(gradeSubjectId);
//             return new Set(next);
//         })
//     }

//     async function handleCommitChanges() {
//         if (!hasPending) return
//         setSavingSubjects(true)

//         const promises: Promise<ActionResponse>[] = []

//         if (pendingAdd.size > 0) {
//             promises.push(
//                 allocateSubjectsToStudent({
//                     studentId:       student.id,
//                     gradeSubjectIds: Array.from(pendingAdd),
//                     schoolId,
//                     isCompulsory:    false,
//                 })
//             )
//         }

//         if (pendingRemove.size > 0) {
//             promises.push(
//                 ...Array.from(pendingRemove).map(async (gsId) => 
//                     removeStudentSubject(student.id, gsId, schoolId)
//                 )
//             )
//         }

//         const results = await Promise.all(promises)
//         const anyFailed = results.some(r => !r.success)

//         if (anyFailed) {
//             toast.error('Some changes failed to save.')
//         } else {
//             toast.success('Registry synchronized.')
//             setPendingAdd(new Set())
//             setPendingRemove(new Set())
//             onUpdate()
//         }
//         setSavingSubjects(false)
//     }

//     async function handleSetStream(stream: NigerianStream) {
//         setSavingStream(stream)
//         const result = await allocateStreamSubjects(student.id, stream, classId, schoolId)
//         if (result.success) {
//             toast.success(`${stream.toUpperCase()} mapping applied.`)
//             onUpdate()
//         }
//         setSavingStream(null)
//     }

//     return (
//         <div className={cn(
//             "rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 overflow-hidden transition-all",
//             (savingSubjects || !!savingStream) && "opacity-50 pointer-events-none"
//         )}>
//             <button onClick={() => setExpanded(p => !p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/50 transition-colors text-left">
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 text-xs font-black text-school-primary">
//                     {student.name?.charAt(0) || 'S'}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-center gap-2">
//                         <p className="text-xs font-bold text-white truncate uppercase italic">{student.name}</p>
//                         {hasPending && <span className="bg-amber-500/10 text-amber-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">Modified</span>}
//                     </div>
//                     <p className="text-[10px] text-school-secondary-500">{subjectCount}/{totalSubjects} subjects allocated</p>
//                 </div>
//                 <ChevronDown className={cn('h-3.5 w-3.5 text-school-secondary-400 transition-transform', expanded && 'rotate-180')} />
//             </button>

//             {expanded && (
//                 <div className="p-4 space-y-4 bg-slate-950/20 border-t border-slate-800">
//                     {isNigerian && isSSS && (
//                         <div className="space-y-2">
//                             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
//                                 <Zap className="h-3 w-3 text-school-primary" /> Apply Stream
//                             </p>
//                             <div className="flex gap-2">
//                                 {(['science', 'arts', 'commercial'] as NigerianStream[]).map(s => (
//                                     <button key={s} onClick={() => handleSetStream(s)} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">{s}</button>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     <div className="space-y-2">
//                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Registry</p>
//                         <div className="flex flex-wrap gap-1.5">
//                             {student.subjects.map(gsId => {
//                                 const sub = availableSubjects.find(s => s.id === gsId);
//                                 const isMarked = pendingRemove.has(gsId);
//                                 return (
//                                     <button 
//                                         key={gsId} 
//                                         disabled={sub?.isCompulsory}
//                                         onClick={() => togglePendingRemove(gsId)}
//                                         className={cn(
//                                             "px-2 py-1 rounded-md text-[9px] font-bold border transition-all",
//                                             sub?.isCompulsory ? "bg-school-primary/10 border-school-primary/20 text-school-primary" :
//                                             isMarked ? "bg-red-500/10 border-red-500/20 text-red-500 line-through" : "bg-slate-800 border-white/5 text-slate-400"
//                                         )}
//                                     >
//                                         {sub?.subjectName} {isMarked ? '+' : '×'}
//                                     </button>
//                                 )
//                             })}
//                             {unallocated.map(sub => {
//                                 const isMarked = pendingAdd.has(sub.id);
//                                 return (
//                                     <button 
//                                         key={sub.id} 
//                                         onClick={() => togglePendingAdd(sub.id)}
//                                         className={cn(
//                                             "px-2 py-1 rounded-md text-[9px] font-bold border border-dashed transition-all",
//                                             isMarked ? "bg-school-primary/20 border-school-primary text-school-primary" : "border-slate-800 text-slate-600"
//                                         )}
//                                     >
//                                         {sub.subjectName} {isMarked ? '✓' : '+'}
//                                     </button>
//                                 )
//                             })}
//                         </div>
//                     </div>

//                     {hasPending && (
//                         <div className="flex justify-end gap-2 pt-2">
//                             <button onClick={handleCommitChanges} className="bg-school-primary text-slate-950 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg">Save Edits</button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     )
// }

// // ── Main Page Component ────────────────────────────────────────────────────────

// export default function SubjectAllocationPage() {
//     const { profile } = useProfileStore()
//     const schoolId    = profile?.schoolId ?? ''

//     const [classes,       setClasses]       = useState<ClassSummary[]>([])
//     const [selectedClass, setSelectedClass] = useState<string | null>(null)
//     const [allocation,    setAllocation]    = useState<SubjectAllocationData | null>(null)
//     const [classLoading,  setClassLoading]  = useState(true)
//     const [dataLoading,   setDataLoading]   = useState(false)
//     const [autoAllocating, setAutoAllocating] = useState(false)

//     useEffect(() => {
//         if (!schoolId) return
//         setClassLoading(true)
//         getSchoolClassesWithGrades(schoolId)
//         .then((data) => setClasses(data as unknown as ClassSummary[]))
//             .finally(() => setClassLoading(false))
//     }, [schoolId])

//     useEffect(() => {
//         if (!selectedClass || !schoolId) return
//         setDataLoading(true)
//         getClassSubjectAllocation(selectedClass, schoolId)
//             .then(setAllocation)
//             .finally(() => setDataLoading(false))
//     }, [selectedClass, schoolId])

//     function handleRefresh() {
//         if (!selectedClass || !schoolId) return
//         setDataLoading(true)
//         getClassSubjectAllocation(selectedClass, schoolId)
//             .then(setAllocation)
//             .finally(() => setDataLoading(false))
//     }

//     async function handleAutoAllocate() {
//         if (!selectedClass || !schoolId) return
//         setAutoAllocating(true)
//         const result = await autoAllocateCompulsorySubjects(selectedClass, schoolId)
//         if (result.success) {
//             toast.success(`${result.allocated} subjects mapped.`)
//             handleRefresh()
//         }
//         setAutoAllocating(false)
//     }

//     const classesByGrade = classes.reduce<Record<string, ClassSummary[]>>((acc, cls) => {
//         const key = cls.grade.displayName
//         if (!acc[key]) acc[key] = []
//         acc[key].push(cls)
//         return acc
//     }, {})

//     return (
//         <div className="min-h-screen bg-slate-950 p-4 md:p-8 space-y-6">
//             <header className="flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                     <BookOpen className="h-5 w-5 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-xl font-black text-white uppercase italic tracking-tight">Subject Allocation</h1>
//                     <p className="text-xs text-slate-400">Institutional Registry Control</p>
//                 </div>
//             </header>

//             {allocation?.isNigerianCurriculum && (
//                 <div className="bg-school-primary/5 border border-school-primary/15 p-4 rounded-xl flex gap-3 shadow-2xl">
//                     <Info className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
//                     <p className="text-[11px] text-slate-400 leading-relaxed italic">
//                         {allocation.grade.isJSS ? "Junior Secondary protocol: All subjects are compulsory." : "Senior Secondary protocol: Stream selection applies."}
//                     </p>
//                 </div>
//             )}

//             <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
//                 <CardHeader className="pb-3 border-b border-white/5 bg-slate-950/40">
//                     <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
//                         <GraduationCap className="h-4 w-4 text-school-primary" /> Select Classroom
//                     </CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                     {classLoading ? <Loader2 className="h-5 w-5 animate-spin text-school-primary" /> : (
//                         <div className="space-y-4">
//                             {Object.entries(classesByGrade).map(([grade, gradeClasses]) => (
//                                 <div key={grade} className="space-y-2">
//                                     <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">{grade}</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {gradeClasses.map(cls => (
//                                             <button 
//                                                 key={cls.id} 
//                                                 onClick={() => setSelectedClass(cls.id)}
//                                                 className={cn(
//                                                     "px-4 py-2 rounded-xl text-[11px] font-bold transition-all border",
//                                                     selectedClass === cls.id ? "bg-school-primary border-school-primary text-slate-950" : "bg-slate-950 border-white/5 text-slate-500 hover:text-white"
//                                                 )}
//                                             >
//                                                 {cls.name}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             {selectedClass && (
//                 <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4">
//                     <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-white/5">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-slate-950 rounded-lg"><Users className="h-4 w-4 text-school-primary" /></div>
//                             <CardTitle className="text-sm font-bold text-white">Student Mapping Registry</CardTitle>
//                         </div>
//                         {allocation && !autoAllocating && (
//                             <button onClick={handleAutoAllocate} className="bg-school-primary text-slate-950 px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
//                                 <Zap className="h-3 w-3" /> Auto-Allocate Core
//                             </button>
//                         )}
//                         {autoAllocating && <Loader2 className="h-4 w-4 animate-spin text-school-primary" />}
//                     </CardHeader>
//                     <CardContent className="p-6">
//                         {dataLoading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-school-primary" /></div> : (
//                             <div className="space-y-3">
//                                 {allocation?.students.map(student => (
//                                     <StudentSubjectRow 
//                                         key={student.id}
//                                         student={student}
//                                         availableSubjects={allocation.availableSubjects}
//                                         isNigerian={allocation.isNigerianCurriculum}
//                                         isSSS={allocation.grade.isSSS}
//                                         schoolId={schoolId}
//                                         classId={selectedClass}
//                                         onUpdate={handleRefresh}
//                                     />
//                                 ))}
//                                 {allocation?.students.length === 0 && (
//                                     <div className="py-20 text-center text-slate-600 font-bold uppercase text-[10px] italic">No placements found in this room.</div>
//                                 )}
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     )
// }

'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import {
    getSchoolClassesWithGrades,
    getClassSubjectAllocation,
    autoAllocateCompulsorySubjects,
    allocateSubjectsToStudent,
    allocateStreamSubjects,
    removeStudentSubject,
    type SubjectAllocationData,
    type NigerianStream,
} from '@/app/actions/subject-allocation'
import {
    BookOpen, Users, Loader2, 
    Zap, ChevronDown, Info,
    GraduationCap 
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────────────────────

type ClassSummary = {
    id:      string
    name:    string
    grade:   { id: string; displayName: string; level: number }
    teacher: { name: string | null } | null
    _count:  { enrollments: number }
}

interface ActionResponse {
    success: boolean;
    error?: string;
}

// ── Stream Badge Logic ─────────────────────────────────────────────────────────

const STREAM_CONFIG: Record<NigerianStream, { label: string; color: string; bg: string; border: string }> = {
    science:    { label: 'Science',    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
    arts:       { label: 'Arts',       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
    commercial: { label: 'Commercial', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
    general:    { label: 'General',    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
}

function StreamBadge({ stream }: { stream: NigerianStream | null }) {
    if (!stream) return null
    const config = STREAM_CONFIG[stream]
    return (
        <span className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ml-2',
            config.color, config.bg, config.border
        )}>
            {config.label}
        </span>
    )
}

// ── Student row ────────────────────────────────────────────────────────────────

function StudentSubjectRow({
    student,
    availableSubjects,
    isNigerian,
    isSSS,
    schoolId,
    classId,
    onUpdate,
}: {
    student:           SubjectAllocationData['students'][0]
    availableSubjects: SubjectAllocationData['availableSubjects']
    isNigerian:        boolean
    isSSS:             boolean
    schoolId:          string
    classId:           string
    onUpdate:          () => void
}) {
    const [expanded,       setExpanded]       = useState(false)
    const [savingStream,   setSavingStream]   = useState<NigerianStream | null>(null)
    const [savingSubjects, setSavingSubjects] = useState(false)

    const [pendingAdd,    setPendingAdd]    = useState<Set<string>>(new Set())
    const [pendingRemove, setPendingRemove] = useState<Set<string>>(new Set())

    const allocatedIds  = new Set(student.subjects)
    const unallocated   = availableSubjects.filter(s => !allocatedIds.has(s.id))
    const subjectCount  = student.subjects.length
    const totalSubjects = availableSubjects.length
    const hasPending = pendingAdd.size > 0 || pendingRemove.size > 0

    function togglePendingAdd(gradeSubjectId: string) {
        setPendingAdd(prev => {
            const next = new Set(prev);
            if (next.has(gradeSubjectId)) next.delete(gradeSubjectId);
            else next.add(gradeSubjectId);
            return new Set(next);
        })
    }

    function togglePendingRemove(gradeSubjectId: string) {
        setPendingRemove(prev => {
            const next = new Set(prev);
            if (next.has(gradeSubjectId)) next.delete(gradeSubjectId);
            else next.add(gradeSubjectId);
            return new Set(next);
        })
    }

    async function handleCommitChanges() {
        if (!hasPending) return
        setSavingSubjects(true)

        const promises: Promise<ActionResponse>[] = []

        if (pendingAdd.size > 0) {
            promises.push(
                allocateSubjectsToStudent({
                    studentId:       student.id,
                    gradeSubjectIds: Array.from(pendingAdd),
                    schoolId,
                    isCompulsory:    false,
                })
            )
        }

        if (pendingRemove.size > 0) {
            promises.push(
                ...Array.from(pendingRemove).map(async (gsId) => 
                    removeStudentSubject(student.id, gsId, schoolId)
                )
            )
        }

        const results = await Promise.all(promises)
        const anyFailed = results.some(r => !r.success)

        if (anyFailed) {
            toast.error('Sync failed for some records.')
        } else {
            toast.success('Registry updated.')
            setPendingAdd(new Set())
            setPendingRemove(new Set())
            onUpdate()
        }
        setSavingSubjects(false)
    }

    async function handleSetStream(stream: NigerianStream) {
        setSavingStream(stream)
        const result = await allocateStreamSubjects(student.id, stream, classId, schoolId)
        if (result.success) {
            toast.success(`${stream.toUpperCase()} mapping applied.`)
            onUpdate()
        }
        setSavingStream(null)
    }

    return (
        <div className={cn(
            "rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 overflow-hidden transition-all",
            (savingSubjects || !!savingStream) && "opacity-50 pointer-events-none"
        )}>
            {/* Header */}
            <button onClick={() => setExpanded(p => !p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/50 transition-colors text-left">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 text-xs font-black text-school-primary uppercase">
                    {student.name?.charAt(0) || 'S'}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center">
                        <p className="text-xs font-bold text-white truncate uppercase italic">{student.name}</p>
                        {/* ✅ FIXED: StreamBadge is now used here */}
                        <StreamBadge stream={student.stream} />
                        {hasPending && <span className="ml-2 bg-amber-500/10 text-amber-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">Unsaved</span>}
                    </div>
                    <p className="text-[10px] text-school-secondary-500">{subjectCount}/{totalSubjects} subjects allocated</p>
                </div>
                <ChevronDown className={cn('h-3.5 w-3.5 text-school-secondary-400 transition-transform', expanded && 'rotate-180')} />
            </button>

            {expanded && (
                <div className="p-4 space-y-4 bg-slate-950/20 border-t border-slate-800 animate-in slide-in-from-top-2">
                    {isNigerian && isSSS && (
                        <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
                                <Zap className="h-3 w-3 text-school-primary" /> Quick Stream Mapping
                            </p>
                            <div className="flex gap-2">
                                {(['science', 'arts', 'commercial'] as NigerianStream[]).map(s => (
                                    <button key={s} onClick={() => handleSetStream(s)} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Current Registry</p>
                        <div className="flex flex-wrap gap-1.5">
                            {student.subjects.map(gsId => {
                                const sub = availableSubjects.find(s => s.id === gsId);
                                const isMarked = pendingRemove.has(gsId);
                                return (
                                    <button 
                                        key={gsId} 
                                        disabled={sub?.isCompulsory}
                                        onClick={() => togglePendingRemove(gsId)}
                                        className={cn(
                                            "px-2 py-1 rounded-md text-[9px] font-bold border transition-all",
                                            sub?.isCompulsory ? "bg-school-primary/10 border-school-primary/20 text-school-primary" :
                                            isMarked ? "bg-red-500/10 border-red-500/20 text-red-500 line-through" : "bg-slate-800 border-white/5 text-slate-400 hover:border-red-500/40"
                                        )}
                                    >
                                        {sub?.subjectName} {isMarked ? '+' : '×'}
                                    </button>
                                )
                            })}
                            {unallocated.map(sub => {
                                const isMarked = pendingAdd.has(sub.id);
                                return (
                                    <button 
                                        key={sub.id} 
                                        onClick={() => togglePendingAdd(sub.id)}
                                        className={cn(
                                            "px-2 py-1 rounded-md text-[9px] font-bold border border-dashed transition-all",
                                            isMarked ? "bg-school-primary/20 border-school-primary text-school-primary" : "border-slate-800 text-slate-600 hover:border-school-primary/40"
                                        )}
                                    >
                                        {sub.subjectName} {isMarked ? '✓' : '+'}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {hasPending && (
                        <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
                            <button onClick={() => { setPendingAdd(new Set()); setPendingRemove(new Set()) }} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold px-2">Discard</button>
                            <button onClick={handleCommitChanges} className="bg-school-primary text-slate-950 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Save Changes</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ── Main Page Component ────────────────────────────────────────────────────────

export default function SubjectAllocationPage() {
    const { profile } = useProfileStore()
    const schoolId    = profile?.schoolId ?? ''

    const [classes,       setClasses]       = useState<ClassSummary[]>([])
    const [selectedClass, setSelectedClass] = useState<string | null>(null)
    const [allocation,    setAllocation]    = useState<SubjectAllocationData | null>(null)
    const [classLoading,  setClassLoading]  = useState(true)
    const [dataLoading,   setDataLoading]   = useState(false)
    const [autoAllocating, setAutoAllocating] = useState(false)

    useEffect(() => {
        if (!schoolId) return
        setClassLoading(true)
        getSchoolClassesWithGrades(schoolId)
            .then((data) => setClasses(data as unknown as ClassSummary[]))
            .finally(() => setClassLoading(false))
    }, [schoolId])

    useEffect(() => {
        if (!selectedClass || !schoolId) return
        setDataLoading(true)
        getClassSubjectAllocation(selectedClass, schoolId)
            .then(setAllocation)
            .finally(() => setDataLoading(false))
    }, [selectedClass, schoolId])

    function handleRefresh() {
        if (selectedClass && schoolId) {
            setDataLoading(true)
            getClassSubjectAllocation(selectedClass, schoolId)
                .then(setAllocation)
                .finally(() => setDataLoading(false))
        }
    }

    async function handleAutoAllocate() {
        if (!selectedClass || !schoolId) return
        setAutoAllocating(true)
        const result = await autoAllocateCompulsorySubjects(selectedClass, schoolId)
        if (result.success) {
            toast.success(`${result.allocated} core subjects mapped.`);
            handleRefresh()
        }
        setAutoAllocating(false)
    }

    const classesByGrade = classes.reduce<Record<string, ClassSummary[]>>((acc, cls) => {
        const key = cls.grade.displayName
        if (!acc[key]) acc[key] = []
        acc[key].push(cls)
        return acc
    }, {})

    return (
        <div className="min-h-screen bg-slate-950 p-4 md:p-8 space-y-6">
            <header className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20 shadow-2xl shadow-school-primary/10">
                    <BookOpen className="h-5 w-5 text-school-primary" />
                </div>
                <div>
                    <h1 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">Subject Allocation</h1>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Academic Registry Hub</p>
                </div>
            </header>

            {allocation?.isNigerianCurriculum && (
                <div className="bg-school-primary/5 border border-school-primary/15 p-4 rounded-xl flex gap-3 shadow-xl animate-in fade-in duration-500">
                    <Info className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
                    <div>
                        <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">Curriculum protocol active</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed italic mt-0.5">
                            {allocation.grade.isJSS ? "Junior Secondary: Full subject enrollment required." : "Senior Secondary: Specialized stream allocation enabled."}
                        </p>
                    </div>
                </div>
            )}

            <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                <CardHeader className="pb-3 border-b border-white/5 bg-slate-950/40">
                    <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-school-primary" />
                        <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Classroom</CardTitle>
                    </div>
                </CardHeader>
                <CardContent className="p-6">
                    {classLoading ? <Loader2 className="h-5 w-5 animate-spin text-school-primary" /> : (
                        <div className="space-y-4">
                            {Object.entries(classesByGrade).map(([grade, gradeClasses]) => (
                                <div key={grade} className="space-y-2">
                                    <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">{grade}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {gradeClasses.map(cls => (
                                            <button 
                                                key={cls.id} 
                                                onClick={() => setSelectedClass(cls.id)}
                                                className={cn(
                                                    "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border",
                                                    selectedClass === cls.id ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : "bg-slate-950 border-white/5 text-slate-500 hover:text-white hover:bg-slate-900"
                                                )}
                                            >
                                                {cls.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {selectedClass && (
                <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
                    <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-950 rounded-lg shadow-inner"><Users className="h-4 w-4 text-school-primary" /></div>
                            <CardTitle className="text-sm font-bold text-white uppercase tracking-tight italic">Registry Index</CardTitle>
                        </div>
                        {allocation && !autoAllocating && (
                            <button onClick={handleAutoAllocate} className="bg-school-primary text-slate-950 px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-school-primary/20">
                                <Zap className="h-3 w-3" /> Auto-Map Core
                            </button>
                        )}
                        {autoAllocating && <Loader2 className="h-4 w-4 animate-spin text-school-primary" />}
                    </CardHeader>
                    <CardContent className="p-6">
                        {dataLoading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-school-primary h-8 w-8" /></div> : (
                            <div className="space-y-3">
                                {allocation?.students.map(student => (
                                    <StudentSubjectRow 
                                        key={student.id}
                                        student={student}
                                        availableSubjects={allocation.availableSubjects}
                                        isNigerian={allocation.isNigerianCurriculum}
                                        isSSS={allocation.grade.isSSS}
                                        schoolId={schoolId}
                                        classId={selectedClass}
                                        onUpdate={handleRefresh}
                                    />
                                ))}
                                {allocation?.students.length === 0 && (
                                    <div className="py-24 text-center">
                                        <Users className="h-10 w-10 text-slate-800 mx-auto mb-4 opacity-20" />
                                        <p className="text-slate-700 font-black uppercase text-[10px] tracking-[0.3em]">No Placements Discovered</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}