


// 'use client'

// import { useState, useEffect, useCallback } from 'react'
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
//     Zap, ChevronDown, Info,
//     GraduationCap 
// } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// // ── Utility ──────────────────────────────────────────────────────────────────

// function getErrorMessage(error: unknown): string {
//     if (error instanceof Error) return error.message;
//     if (error && typeof error === 'object' && 'message' in error) {
//         return String((error as { message?: string }).message);
//     }
//     return typeof error === 'string' ? error : "An unknown error occurred";
// }

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

// // ── Stream Badge Logic ─────────────────────────────────────────────────────────

// /**
//  * FIXED: Added 'trade' and 'general' to match the NigerianStream type 
//  * and satisfy the Record constraint.
//  */
// const STREAM_CONFIG: Record<NigerianStream | 'general', { label: string; color: string; bg: string; border: string }> = {
//     science:    { label: 'Science',    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
//     arts:       { label: 'Arts',       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
//     commercial: { label: 'Commercial', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
//     trade:      { label: 'Trade',      color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20'    },
//     general:    { label: 'General',    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
// }

// function StreamBadge({ stream }: { stream: NigerianStream | 'general' | null }) {
//     if (!stream) return null
//     const config = STREAM_CONFIG[stream]
//     return (
//         <span className={cn(
//             'inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ml-2',
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

//         try {
//             const promises: Promise<ActionResponse>[] = []

//             if (pendingAdd.size > 0) {
//                 promises.push(
//                     allocateSubjectsToStudent({
//                         studentId:       student.id,
//                         gradeSubjectIds: Array.from(pendingAdd),
//                         schoolId,
//                         isCompulsory:    false,
//                     })
//                 )
//             }

//             if (pendingRemove.size > 0) {
//                 promises.push(
//                     ...Array.from(pendingRemove).map(async (gsId) => 
//                         removeStudentSubject(student.id, gsId, schoolId)
//                     )
//                 )
//             }

//             const results = await Promise.all(promises)
//             const anyFailed = results.some(r => !r.success)

//             if (anyFailed) {
//                 toast.error('Sync failed for some records.')
//             } else {
//                 toast.success('Registry updated.')
//                 setPendingAdd(new Set())
//                 setPendingRemove(new Set())
//                 onUpdate()
//             }
//         } catch (err) {
//             toast.error(getErrorMessage(err))
//         } finally {
//             setSavingSubjects(false)
//         }
//     }

//     async function handleSetStream(stream: NigerianStream) {
//         setSavingStream(stream)
//         try {
//             const result = await allocateStreamSubjects(student.id, stream, classId, schoolId)
//             if (result.success) {
//                 toast.success(`${stream.toUpperCase()} mapping applied.`)
//                 onUpdate()
//             }
//         } catch (err) {
//             toast.error(getErrorMessage(err))
//         } finally {
//             setSavingStream(null)
//         }
//     }

//     return (
//         <div className={cn(
//             "rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 overflow-hidden transition-all",
//             (savingSubjects || !!savingStream) && "opacity-50 pointer-events-none"
//         )}>
//             {/* Header */}
//             <button onClick={() => setExpanded(p => !p)} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/50 transition-colors text-left">
//                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 text-xs font-black text-school-primary uppercase">
//                     {student.name?.charAt(0) || 'S'}
//                 </div>
//                 <div className="flex-1 min-w-0">
//                     <div className="flex items-center">
//                         <p className="text-xs font-bold text-white truncate uppercase italic">{student.name}</p>
//                         <StreamBadge stream={student.stream} />
//                         {hasPending && <span className="ml-2 bg-amber-500/10 text-amber-500 text-[8px] font-black px-1.5 py-0.5 rounded border border-amber-500/20 uppercase tracking-widest">Unsaved</span>}
//                     </div>
//                     <p className="text-[10px] text-school-secondary-500">{subjectCount}/{totalSubjects} subjects allocated</p>
//                 </div>
//                 <ChevronDown className={cn('h-3.5 w-3.5 text-school-secondary-400 transition-transform', expanded && 'rotate-180')} />
//             </button>

//             {expanded && (
//                 <div className="p-4 space-y-4 bg-slate-950/20 border-t border-slate-800 animate-in slide-in-from-top-2">
//                     {isNigerian && isSSS && (
//                         <div className="space-y-2">
//                             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
//                                 <Zap className="h-3 w-3 text-school-primary" /> Quick Stream Mapping
//                             </p>
//                             <div className="flex gap-2">
//                                 {(['science', 'arts', 'commercial', 'trade'] as NigerianStream[]).map(s => (
//                                     <button key={s} onClick={() => handleSetStream(s)} className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/5 text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">{s}</button>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     <div className="space-y-2">
//                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Current Registry</p>
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
//                                             sub?.isCompulsory ? "bg-school-primary-100 border-school-primary/20 text-school-primary" :
//                                             isMarked ? "bg-red-500/10 border-red-500/20 text-red-500 line-through" : "bg-slate-800 border-white/5 text-slate-400 hover:border-red-500/40"
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
//                                             isMarked ? "bg-school-primary/20 border-school-primary text-school-primary" : "border-slate-800 text-slate-600 hover:border-school-primary/40"
//                                         )}
//                                     >
//                                         {sub.subjectName} {isMarked ? '✓' : '+'}
//                                     </button>
//                                 )
//                             })}
//                         </div>
//                     </div>

//                     {hasPending && (
//                         <div className="flex justify-end gap-3 pt-2 border-t border-white/5">
//                             <button onClick={() => { setPendingAdd(new Set()); setPendingRemove(new Set()) }} className="text-[10px] text-slate-500 hover:text-white uppercase font-bold px-2">Discard</button>
//                             <button onClick={handleCommitChanges} className="bg-school-primary text-slate-950 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all">Save Changes</button>
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
//             .then((data) => setClasses(data as unknown as ClassSummary[]))
//             .catch((err) => toast.error(getErrorMessage(err)))
//             .finally(() => setClassLoading(false))
//     }, [schoolId])

//     const handleRefresh = useCallback(() => {
//         if (selectedClass && schoolId) {
//             setDataLoading(true)
//             getClassSubjectAllocation(selectedClass, schoolId)
//                 .then(setAllocation)
//                 .catch((err) => toast.error(getErrorMessage(err)))
//                 .finally(() => setDataLoading(false))
//         }
//     }, [selectedClass, schoolId]);

//     useEffect(() => {
//         handleRefresh()
//     }, [handleRefresh])

//     async function handleAutoAllocate() {
//         if (!selectedClass || !schoolId) return
//         setAutoAllocating(true)
//         try {
//             const result = await autoAllocateCompulsorySubjects(selectedClass, schoolId)
//             if (result.success) {
//                 toast.success(`${result.allocated} core subjects mapped.`);
//                 handleRefresh()
//             }
//         } catch (err) {
//             toast.error(getErrorMessage(err))
//         } finally {
//             setAutoAllocating(false)
//         }
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
//                 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20 shadow-2xl shadow-school-primary/10">
//                     <BookOpen className="h-5 w-5 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-xl font-black text-white uppercase italic tracking-tight leading-none">Subject Allocation</h1>
//                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Academic Registry Hub</p>
//                 </div>
//             </header>

//             {allocation?.isNigerianCurriculum && (
//                 <div className="bg-school-primary/5 border border-school-primary/15 p-4 rounded-xl flex gap-3 shadow-xl animate-in fade-in duration-500">
//                     <Info className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
//                     <div>
//                         <p className="text-[11px] text-slate-300 font-bold uppercase tracking-widest">Curriculum protocol active</p>
//                         <p className="text-[11px] text-slate-500 leading-relaxed italic mt-0.5">
//                             {allocation.grade.isJSS ? "Junior Secondary: Full subject enrollment required." : "Senior Secondary: Specialized stream allocation enabled."}
//                         </p>
//                     </div>
//                 </div>
//             )}

//             <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
//                 <CardHeader className="pb-3 border-b border-white/5 bg-slate-950/40">
//                     <div className="flex items-center gap-2">
//                         <GraduationCap className="h-4 w-4 text-school-primary" />
//                         <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Select Classroom</CardTitle>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-6">
//                     {classLoading ? <Loader2 className="h-5 w-5 animate-spin text-school-primary" /> : (
//                         <div className="space-y-4">
//                             {Object.entries(classesByGrade).map(([grade, gradeClasses]) => (
//                                 <div key={grade} className="space-y-2">
//                                     <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">{grade}</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {gradeClasses.map(cls => (
//                                             <button 
//                                                 key={cls.id} 
//                                                 onClick={() => setSelectedClass(cls.id)}
//                                                 className={cn(
//                                                     "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border",
//                                                     selectedClass === cls.id ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : "bg-slate-950 border-white/5 text-slate-500 hover:text-white hover:bg-slate-900"
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
//                 <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
//                     <CardHeader className="p-6 flex flex-row items-center justify-between border-b border-white/5">
//                         <div className="flex items-center gap-3">
//                             <div className="p-2 bg-slate-950 rounded-lg shadow-inner"><Users className="h-4 w-4 text-school-primary" /></div>
//                             <CardTitle className="text-sm font-bold text-white uppercase tracking-tight italic">Registry Index</CardTitle>
//                         </div>
//                         {allocation && !autoAllocating && (
//                             <button onClick={handleAutoAllocate} className="bg-school-primary text-slate-950 px-5 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-school-primary/20">
//                                 <Zap className="h-3 w-3" /> Auto-Map Core
//                             </button>
//                         )}
//                         {autoAllocating && <Loader2 className="h-4 w-4 animate-spin text-school-primary" />}
//                     </CardHeader>
//                     <CardContent className="p-6">
//                         {dataLoading ? <div className="py-20 flex justify-center"><Loader2 className="animate-spin text-school-primary h-8 w-8" /></div> : (
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
//                                     <div className="py-24 text-center">
//                                         <Users className="h-10 w-10 text-slate-800 mx-auto mb-4 opacity-20" />
//                                         <p className="text-slate-700 font-black uppercase text-[10px] tracking-[0.3em]">No Placements Discovered</p>
//                                     </div>
//                                 )}
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     )
// }


// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getSchoolClassesWithGrades } from '@/app/actions/subject-allocation'
// import { SubjectAllocationClient } from "@/components/admin-dasboard/subjectAllocationClient";
// import { Role } from "@prisma/client";

// /**
//  * Rule 16: Dynamic Contextual SEO
//  */
// export async function generateMetadata(): Promise<Metadata> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) return { title: "Allocation Hub | SchoolPaaS" };

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         include: { school: { select: { name: true } } }
//     });

//     return {
//         title: `Subject Allocation | ${profile?.school?.name || "Institution"} | SchoolPaaS`,
//         description: "Institutional management of student-subject mappings and stream alignments."
//     };
// }

// /**
//  * Rule 12: Server-First Fetching
//  */
// export default async function AllocationPage() {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user) redirect("/login");

//     const profile = await prisma.profile.findUnique({
//         where: { id: user.id },
//         select: { id: true, schoolId: true, role: true }
//     });

//     // Rule 6 & 13: Institutional Guard
//     if (!profile?.schoolId || (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN)) {
//         redirect("/teacher?error=access_denied");
//     }

//     // Fetch Base Registry Data on Server
//     const initialClasses = await getSchoolClassesWithGrades(profile.schoolId);

//     return (
//         <SubjectAllocationClient 
//             initialClasses={initialClasses as any} 
//         />
//     );
// }


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getSchoolClassesWithGrades } from '@/app/actions/subject-allocation'
import { SubjectAllocationClient } from "@/components/admin-dasboard/subjectAllocationClient";
import { Role } from "@prisma/client";

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

/**
 * Interface representing a primary Classroom Hub for allocation.
 */
interface ClassroomNode {
    id: string;
    name: string;
}

/**
 * ALLOCATION HUB | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (!authUser) return { title: "Allocation Hub | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        include: { school: { select: { name: true } } }
    });

    const hubName = profile?.school?.name || "Institution";

    return {
        title: `Subject Allocation | ${hubName} | SchoolPaaS`,
        description: "Institutional management of student-subject hub mappings and stream alignments."
    };
}

/**
 * ALLOCATION MANAGEMENT PAGE (Tier 2)
 * Rule 12: Server-First Fetching. Handles identity verification and data hydration.
 * Rule 5/6: Multi-tenant isolation - strictly limited to Institutional Admins.
 * Rule 15: Pure TypeScript - Zero 'any' types in the allocation pipeline.
 */
export default async function AllocationPage() {
    // 1. Resolve Identity & Verification (Rule 10)
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) redirect("/login");

    const profile = await prisma.profile.findUnique({
        where: { id: authUser.id },
        select: { id: true, schoolId: true, role: true }
    });

    // 2. Authorization Security Gate (Rule 6)
    // Access strictly limited to Tier-2 Hub Administrators.
    if (
        !profile?.schoolId || 
        (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN)
    ) {
        redirect("/admin?error=unauthorized_allocation_access");
    }

    // 3. Authoritative Data Hydration (Rule 11)
    // Fetching the base classroom hub registry for this specific institution.
    const initialClasses = await getSchoolClassesWithGrades(profile.schoolId);

    // 4. Client-Side Protocol Handoff (Rule 15)
    // Safe casting of the server response to our strict Hub Interface.
    const typedClasses = (initialClasses as unknown as ClassroomNode[]) || [];

    return (
        <main className="min-h-screen bg-background">
            <SubjectAllocationClient 
                initialClasses={typedClasses} 
            />
        </main>
    );
}