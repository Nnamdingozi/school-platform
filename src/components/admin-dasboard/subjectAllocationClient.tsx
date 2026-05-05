// 'use client'

// import { useState, useEffect, useCallback, useTransition } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import {
//     getClassSubjectAllocation,
//     autoAllocateCompulsorySubjects,
//     allocateStudentSubjects,
//     allocateStreamSubjects,
//     removeStudentSubject,
//     type SubjectAllocationData,
//     type NigerianStream,
// } from '@/app/actions/subject-allocation'
// import {
//     BookOpen, Users, Loader2, 
//     Zap, ChevronDown, Info,
//     GraduationCap, CheckCircle2,
//     ShieldCheck
// } from 'lucide-react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { getErrorMessage } from '@/lib/error-handler'

// // ── Types ──────────────────────────────────────────────────────────────────────

// type ClassSummary = {
//     id:      string
//     name:    string
//     grade:   { id: string; displayName: string; level: number }
//     _count:  { enrollments: number }
// }

// const STREAM_CONFIG: Record<NigerianStream, { label: string; color: string; bg: string; border: string }> = {
//     science:    { label: 'Science',    color: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/20'   },
//     arts:       { label: 'Arts',       color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
//     commercial: { label: 'Commercial', color: 'text-amber-400',  bg: 'bg-amber-500/10',  border: 'border-amber-500/20'  },
//     trade:      { label: 'Trade',      color: 'text-rose-400',   bg: 'bg-rose-500/10',   border: 'border-rose-500/20'    },
//     general:    { label: 'General',    color: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/20'  },
// }

// // ── Main Client Hub ─────────────────────────────────────────────────────────────

// export function SubjectAllocationClient({ initialClasses }: { initialClasses: ClassSummary[] }) {
//     const { profile } = useProfileStore();
//     const [selectedClass, setSelectedClass] = useState<string | null>(null);
//     const [allocation, setAllocation] = useState<SubjectAllocationData | null>(null);
//     const [dataLoading, setDataLoading] = useState(false);
//     const [isPending, startTransition] = useTransition();

//     const schoolId = profile?.schoolId ?? '';
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     const handleRefresh = useCallback(async () => {
//         if (!selectedClass || !schoolId) return;
//         setDataLoading(true);
//         try {
//             const data = await getClassSubjectAllocation(selectedClass, schoolId);
//             setAllocation(data);
//         } catch (err: unknown) {
//             toast.error(getErrorMessage(err));
//         } finally {
//             setDataLoading(false);
//         }
//     }, [selectedClass, schoolId]);

//     useEffect(() => { handleRefresh(); }, [handleRefresh]);

//     const handleAutoAllocate = () => {
//         if (!selectedClass) return;
//         startTransition(async () => {
//             const result = await autoAllocateCompulsorySubjects(selectedClass, schoolId);
//             if (result.success) {
//                 toast.success(`${result.allocated} core nodes synchronized.`);
//                 handleRefresh();
//             }
//         });
//     };

//     const classesByGrade = initialClasses.reduce<Record<string, ClassSummary[]>>((acc, cls) => {
//         const key = cls.grade.displayName;
//         if (!acc[key]) acc[key] = [];
//         acc[key].push(cls);
//         return acc;
//     }, {});

//     return (
//         <div className="p-4 md:p-8 lg:p-12 space-y-8 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-500">
            
//             {/* ── HEADER ── */}
//             <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//                 <div 
//                     className="h-12 w-12 rounded-2xl border flex items-center justify-center shadow-2xl"
//                     style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                 >
//                     <BookOpen className="h-6 w-6" style={{ color: primaryColor }} />
//                 </div>
//                 <div>
//                     <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Subject Allocation</h1>
//                     <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-2">Institutional Syllabus Mapping • {profile?.school?.name}</p>
//                 </div>
//             </header>

//             {/* ── SELECTION ── */}
//             <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
//                 <CardHeader className="p-8 bg-slate-950/40 border-b border-white/5">
//                     <div className="flex items-center gap-2">
//                         <GraduationCap className="h-4 w-4 text-slate-500" />
//                         <h3 className="text-[10px] font-black uppercase text-white tracking-[0.3em]">Select Academic Registry</h3>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-8">
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                         {Object.entries(classesByGrade).map(([grade, gradeClasses]) => (
//                             <div key={grade} className="space-y-3">
//                                 <p className="text-[9px] font-black uppercase text-slate-600 tracking-widest ml-1">{grade}</p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {gradeClasses.map(cls => (
//                                         <button 
//                                             key={cls.id} 
//                                             onClick={() => setSelectedClass(cls.id)}
//                                             className={cn(
//                                                 "px-4 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all border",
//                                                 selectedClass === cls.id 
//                                                     ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" 
//                                                     : "bg-slate-950 border-white/5 text-slate-500 hover:text-white"
//                                             )}
//                                             style={selectedClass === cls.id ? { backgroundColor: primaryColor } : {}}
//                                         >
//                                             {cls.name}
//                                         </button>
//                                     ))}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </CardContent>
//             </Card>

//             {/* ── ALLOCATION MATRIX ── */}
//             {selectedClass && (
//                 <Card className="bg-slate-900 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
//                     <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-white/5 bg-slate-950/40">
//                         <div className="flex items-center gap-3">
//                             <div className="p-3 bg-slate-900 rounded-xl shadow-inner border border-white/5">
//                                 <Users className="h-4 w-4 text-school-primary" style={{ color: primaryColor }} />
//                             </div>
//                             <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Enrollment Registry</h4>
//                         </div>
//                         {allocation && (
//                             <button 
//                                 onClick={handleAutoAllocate} 
//                                 disabled={isPending}
//                                 className="bg-school-primary text-slate-950 px-6 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-school-primary/10"
//                                 style={{ backgroundColor: primaryColor }}
//                             >
//                                 {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
//                                 Initialize Auto-Mapping
//                             </button>
//                         )}
//                     </CardHeader>
//                     <CardContent className="p-8">
//                         {dataLoading ? (
//                             <div className="py-20 flex flex-col items-center justify-center gap-4">
//                                 <Loader2 className="animate-spin h-8 w-8 text-school-primary" style={{ color: primaryColor }} />
//                                 <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Indexing_Registry_State...</p>
//                             </div>
//                         ) : (
//                             <div className="grid grid-cols-1 gap-4">
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
//                                         primaryColor={primaryColor}
//                                     />
//                                 ))}
//                             </div>
//                         )}
//                     </CardContent>
//                 </Card>
//             )}
//         </div>
//     )
// }

// // ── Student Row Component ──────────────────────────────────────────────────────

// function StudentSubjectRow({ student, availableSubjects, isNigerian, isSSS, schoolId, classId, onUpdate, primaryColor }: any) {
//     const [expanded, setExpanded] = useState(false);
//     const [isCommitting, setIsCommitting] = useState(false);
//     const [pendingAdd, setPendingAdd] = useState<Set<string>>(new Set());
//     const [pendingRemove, setPendingRemove] = useState<Set<string>>(new Set());

//     const hasPending = pendingAdd.size > 0 || pendingRemove.size > 0;

//     const handleCommitChanges = async () => {
//         setIsCommitting(true);
//         try {
//             if (pendingAdd.size > 0) {
//                 await allocateStudentSubjects({ schoolId, studentId: student.id, gradeSubjectIds: [...student.subjects, ...Array.from(pendingAdd)] });
//             }
//             if (pendingRemove.size > 0) {
//                 // Rule 11 implementation...
//             }
//             toast.success("Identity Registry Updated");
//             setPendingAdd(new Set()); setPendingRemove(new Set());
//             onUpdate();
//         } finally {
//             setIsCommitting(false);
//         }
//     };

//     return (
//         <div className={cn(
//             "rounded-[2rem] border border-white/5 transition-all overflow-hidden",
//             expanded ? "bg-slate-950/50" : "bg-slate-900"
//         )}>
//             <button 
//                 onClick={() => setExpanded(!expanded)}
//                 className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors"
//             >
//                 <div className="flex items-center gap-4">
//                     <div 
//                         className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs italic border"
//                         style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30`, color: primaryColor }}
//                     >
//                         {student.name?.charAt(0) || 'S'}
//                     </div>
//                     <div className="text-left">
//                         <p className="text-sm font-black text-white uppercase italic truncate">{student.name}</p>
//                         <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{student.subjects.length} Subjects Registered</p>
//                     </div>
//                 </div>
//                 <ChevronDown className={cn("h-4 w-4 text-slate-700 transition-transform", expanded && "rotate-180")} />
//             </button>

//             {expanded && (
//                 <div className="p-8 pt-0 space-y-8 animate-in slide-in-from-top-4">
//                     <div className="space-y-4">
//                         <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">Active Syllabus</p>
//                         <div className="flex flex-wrap gap-2">
//                             {availableSubjects.map((sub: any) => {
//                                 const isAllocated = student.subjects.includes(sub.id);
//                                 const isPending = pendingAdd.has(sub.id);
//                                 return (
//                                     <button 
//                                         key={sub.id}
//                                         onClick={() => setPendingAdd(prev => {
//                                             const next = new Set(prev);
//                                             if (next.has(sub.id)) next.delete(sub.id); else next.add(sub.id);
//                                             return next;
//                                         })}
//                                         className={cn(
//                                             "px-4 py-2 rounded-xl text-[9px] font-black uppercase transition-all border",
//                                             isAllocated ? "bg-slate-950 border-white/10 text-slate-400" :
//                                             isPending ? "bg-school-primary border-school-primary text-slate-950" :
//                                             "bg-slate-900 border-white/5 text-slate-600 hover:border-white/10"
//                                         )}
//                                         style={isPending ? { backgroundColor: primaryColor } : {}}
//                                     >
//                                         {sub.subjectName}
//                                     </button>
//                                 )
//                             })}
//                         </div>
//                     </div>

//                     {hasPending && (
//                         <div className="flex justify-end pt-6 border-t border-white/5">
//                             <button 
//                                 onClick={handleCommitChanges}
//                                 disabled={isCommitting}
//                                 className="bg-white text-slate-950 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
//                             >
//                                 {isCommitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
//                                 Sync Changes
//                             </button>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }


'use client'

import { useState, useEffect, useCallback, useTransition } from 'react'
import { useProfileStore } from '@/store/profileStore'
import {
    getClassSubjectAllocation,
    autoAllocateCompulsorySubjects,
    allocateStudentSubjects,
    allocateStreamSubjects,
    removeStudentSubject,
} from '@/app/actions/subject-allocation'
import {
    BookOpen, Users, Loader2, 
    Zap, ChevronDown, Info,
    GraduationCap, CheckCircle2,
    ShieldCheck, Trash2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { getErrorMessage } from '@/lib/error-handler'

// ── Types ──────────────────────────────────────────────────────────────────────

type NigerianStream = 'science' | 'arts' | 'commercial' | 'general' | 'trade'

interface SubjectAllocationClientProps {
    initialClasses: any[];
}

export function SubjectAllocationClient({ initialClasses }: SubjectAllocationClientProps) {
    const { profile } = useProfileStore();
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [allocation, setAllocation] = useState<any>(null);
    const [dataLoading, setDataLoading] = useState(false);
    const [isPending, startTransition] = useTransition();

    const schoolId = profile?.schoolId ?? '';
    const primaryColor = profile?.primaryColor || "#f59e0b";

    const handleRefresh = useCallback(async () => {
        if (!selectedClass || !schoolId) return;
        setDataLoading(true);
        try {
            const data = await getClassSubjectAllocation(selectedClass, schoolId);
            setAllocation(data);
        } finally {
            setDataLoading(false);
        }
    }, [selectedClass, schoolId]);

    useEffect(() => { handleRefresh(); }, [handleRefresh]);

    const handleAutoAllocate = () => {
        if (!selectedClass) return;
        startTransition(async () => {
            const result = await autoAllocateCompulsorySubjects(selectedClass, schoolId);
            if (result.success) {
                toast.success(`${result.allocated} core nodes mapped.`);
                handleRefresh();
            }
        });
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-8 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-500">
            <header className="flex items-center gap-4 border-b border-white/5 pb-8">
                <div className="h-12 w-12 rounded-2xl border flex items-center justify-center shadow-2xl" style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}>
                    <BookOpen className="h-6 w-6" style={{ color: primaryColor }} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Subject Allocation</h1>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-2">Institutional Mapping Hub</p>
                </div>
            </header>

            <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden">
                <CardContent className="p-8">
                    <div className="flex flex-wrap gap-3">
                        {initialClasses.map(cls => (
                            <button 
                                key={cls.id} 
                                onClick={() => setSelectedClass(cls.id)}
                                className={cn(
                                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase transition-all border",
                                    selectedClass === cls.id ? "bg-school-primary border-school-primary text-slate-950 shadow-lg" : "bg-slate-950 border-white/5 text-slate-500 hover:text-white"
                                )}
                                style={selectedClass === cls.id ? { backgroundColor: primaryColor } : {}}
                            >
                                {cls.name}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {selectedClass && (
                <Card className="bg-slate-900 border-white/5 rounded-[3rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4">
                    <CardHeader className="p-8 flex flex-row items-center justify-between border-b border-white/5 bg-slate-950/40">
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5 text-school-primary" style={{ color: primaryColor }} />
                            <h4 className="text-sm font-black text-white uppercase italic tracking-widest">Student Enrollment Registry</h4>
                        </div>
                        <button onClick={handleAutoAllocate} disabled={isPending} className="bg-school-primary text-slate-950 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-school-primary/10" style={{ backgroundColor: primaryColor }}>
                            {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Zap className="h-3 w-3" />}
                            Sync Core Subjects
                        </button>
                    </CardHeader>
                    <CardContent className="p-8 space-y-4">
                        {dataLoading ? (
                            <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8" style={{ color: primaryColor }} /></div>
                        ) : (
                            allocation?.students.map((student: any) => (
                                <StudentSubjectRow 
                                    key={student.id}
                                    student={student}
                                    availableSubjects={allocation.availableSubjects}
                                    isNigerian={allocation.isNigerianCurriculum}
                                    isSSS={allocation.grade.isSSS}
                                    schoolId={schoolId}
                                    classId={selectedClass}
                                    onUpdate={handleRefresh}
                                    primaryColor={primaryColor}
                                />
                            ))
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

// ── Student Row Component ──────────────────────────────────────────────────────

function StudentSubjectRow({ student, availableSubjects, isNigerian, isSSS, schoolId, classId, onUpdate, primaryColor }: any) {
    const [expanded, setExpanded] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [pendingAdd, setPendingAdd] = useState<Set<string>>(new Set());
    const [pendingRemove, setPendingRemove] = useState<Set<string>>(new Set());

    const hasPending = pendingAdd.size > 0 || pendingRemove.size > 0;

    const handleCommitChanges = async () => {
        setIsSaving(true);
        try {
            const finalIds = [
                ...student.subjects.filter((id: string) => !pendingRemove.has(id)),
                ...Array.from(pendingAdd)
            ];
            const res = await allocateStudentSubjects({ schoolId, studentId: student.id, gradeSubjectIds: finalIds });
            if (res.success) {
                toast.success("Registry synchronization successful.");
                setPendingAdd(new Set()); setPendingRemove(new Set());
                onUpdate();
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleStreamMap = async (stream: NigerianStream) => {
        setIsSaving(true);
        const res = await allocateStreamSubjects(student.id, stream, classId, schoolId);
        if (res.success) {
            toast.success(`${stream.toUpperCase()} mapping applied.`);
            onUpdate();
        }
        setIsSaving(false);
    };

    return (
        <div className={cn("rounded-2xl border border-white/5 transition-all overflow-hidden", expanded ? "bg-slate-950/50" : "bg-slate-900")}>
            <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between p-6 hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center font-black text-xs italic border" style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30`, color: primaryColor }}>
                        {student.name?.charAt(0) || 'S'}
                    </div>
                    <p className="text-sm font-black text-white uppercase italic truncate">{student.name}</p>
                </div>
                <div className="flex items-center gap-4">
                    {hasPending && <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded">Unsaved Changes</span>}
                    <ChevronDown className={cn("h-4 w-4 text-slate-700 transition-transform", expanded && "rotate-180")} />
                </div>
            </button>

            {expanded && (
                <div className="p-8 pt-0 space-y-8 animate-in slide-in-from-top-4">
                    {isNigerian && isSSS && (
                        <div className="space-y-4">
                            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Stream Assignment Protocol</p>
                            <div className="flex gap-2">
                                {['science', 'arts', 'commercial', 'trade'].map((s) => (
                                    <button key={s} onClick={() => handleStreamMap(s as NigerianStream)} className="px-4 py-2 rounded-xl bg-slate-900 border border-white/5 text-[9px] font-black uppercase text-slate-400 hover:text-white transition-all">{s}</button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Subject Matrix</p>
                        <div className="flex flex-wrap gap-2">
                            {availableSubjects.map((sub: any) => {
                                const isOriginal = student.subjects.includes(sub.id);
                                const isToAdded = pendingAdd.has(sub.id);
                                const isToRemove = pendingRemove.has(sub.id);

                                return (
                                    <button 
                                        key={sub.id}
                                        onClick={() => {
                                            if (isOriginal) setPendingRemove(prev => { const n = new Set(prev); if (n.has(sub.id)) n.delete(sub.id); else n.add(sub.id); return n; });
                                            else setPendingAdd(prev => { const n = new Set(prev); if (n.has(sub.id)) n.delete(sub.id); else n.add(sub.id); return n; });
                                        }}
                                        className={cn(
                                            "px-3 py-2 rounded-xl text-[9px] font-black uppercase transition-all border",
                                            (isOriginal && !isToRemove) ? "bg-slate-950 border-white/10 text-slate-400" :
                                            isToAdded ? "bg-school-primary border-school-primary text-slate-950" :
                                            isToRemove ? "bg-red-500/10 border-red-500/20 text-red-500 line-through" :
                                            "bg-slate-900 border-white/5 text-slate-600"
                                        )}
                                        style={isToAdded ? { backgroundColor: primaryColor } : {}}
                                    >
                                        {sub.subjectName}
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    {hasPending && (
                        <div className="flex justify-end gap-3 pt-6 border-t border-white/5">
                            <button onClick={handleCommitChanges} disabled={isSaving} className="bg-white text-slate-950 px-10 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                                Sync Registry
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}