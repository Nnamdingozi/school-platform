// 'use client'

// import { useState, useEffect } from 'react'
// import { X, BookOpen, Calendar, ChevronRight, Layers, Loader2 } from "lucide-react"
// import { cn } from "@/lib/utils"
// import { getSubjectSyllabus } from "@/app/actions/course-catalogue"

// // ── Interfaces ──────────────────────────────────────────────────────────────

// interface Topic {
//     id: string
//     title: string
//     weekNumber: number | null
//     description: string | null
//     term: {
//         index: number
//     }
// }

// interface GradeSyllabus {
//     id: string
//     grade: {
//         displayName: string
//     }
//     topics: Topic[]
// }

// interface SyllabusDrawerProps {
//     subject: {
//         id: string
//         name: string
//     }
//     schoolId: string
//     onClose: () => void
// }

// export function SyllabusDrawer({ subject, schoolId, onClose }: SyllabusDrawerProps) {
//     // ✅ FIX: Initialize with proper type and ensure fallback in setter
//     const [data, setData] = useState<GradeSyllabus[]>([])
//     const [loading, setLoading] = useState(true)
//     const [activeGradeTab, setActiveGradeTab] = useState(0)

//     useEffect(() => {
//         let isMounted = true
        
//         async function fetchSyllabus() {
//             setLoading(true)
//             const res = await getSubjectSyllabus(subject.id, schoolId)
            
//             if (isMounted) {
//                 if (res.success && res.data) {
//                     // ✅ FIX: Cast and provided fallback to resolve Error 2345
//                     setData(res.data as GradeSyllabus[])
//                 } else {
//                     setData([])
//                 }
//                 setLoading(false)
//             }
//         }

//         fetchSyllabus()
//         return () => { isMounted = false }
//     }, [subject.id, schoolId])

//     const currentGrade = data[activeGradeTab]

//     return (
//         <div className="fixed inset-0 z-[100] flex justify-end">
//             {/* Backdrop */}
//             <div 
//                 className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-300" 
//                 onClick={onClose} 
//             />
            
//             {/* Drawer Panel */}
//             <div className="relative w-full max-w-xl bg-slate-900 border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
                
//                 {/* Header */}
//                 <header className="p-8 border-b border-white/5 bg-slate-950/50">
//                     <div className="flex justify-between items-start mb-6">
//                         <div className="p-3 bg-school-primary/10 rounded-2xl border border-school-primary/20">
//                             <BookOpen className="h-6 w-6 text-school-primary" />
//                         </div>
//                         <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white">
//                             <X className="h-6 w-6" />
//                         </button>
//                     </div>
//                     <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                         {subject.name}
//                     </h2>
//                     <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Syllabus Master Registry</p>
//                 </header>

//                 {/* Grade Tabs */}
//                 <div className="px-8 pt-6 flex gap-2 overflow-x-auto scrollbar-hide border-b border-white/5 pb-4">
//                     {data.map((gs, idx) => (
//                         <button 
//                             key={gs.id}
//                             onClick={() => setActiveGradeTab(idx)}
//                             className={cn(
//                                 "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
//                                 activeGradeTab === idx 
//                                     ? "bg-school-primary border-school-primary text-school-secondary-950 shadow-lg" 
//                                     : "bg-slate-950 border-white/5 text-slate-500 hover:text-white"
//                             )}
//                         >
//                             {gs.grade.displayName}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Content Area */}
//                 <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
//                     {loading ? (
//                         <div className="h-40 flex flex-col items-center justify-center gap-3">
//                             <Loader2 className="h-6 w-6 animate-spin text-school-primary" />
//                             <p className="text-slate-600 font-mono text-[10px] uppercase tracking-widest text-center">Decrypting_Nodes...</p>
//                         </div>
//                     ) : currentGrade?.topics.length > 0 ? (
//                         [1, 2, 3].map((termIndex) => {
//                             const termTopics = currentGrade.topics.filter((t) => t.term.index === termIndex);
//                             if (termTopics.length === 0) return null;

//                             return (
//                                 <div key={termIndex} className="space-y-4">
//                                     <div className="flex items-center gap-3">
//                                         <Calendar className="h-4 w-4 text-school-primary" />
//                                         <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Term {termIndex}</h3>
//                                         <div className="h-px flex-1 bg-white/5" />
//                                     </div>
                                    
//                                     <div className="space-y-2">
//                                         {termTopics.map((topic) => (
//                                             <div key={topic.id} className="group flex items-start gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 hover:border-school-primary/20 transition-all shadow-inner">
//                                                 <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500 group-hover:text-school-primary transition-colors">
//                                                     W{topic.weekNumber || '?'}
//                                                 </div>
//                                                 <div className="flex-1 min-w-0">
//                                                     <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">
//                                                         {topic.title}
//                                                     </p>
//                                                     {topic.description && (
//                                                         <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
//                                                             {topic.description}
//                                                         </p>
//                                                     )}
//                                                 </div>
//                                                 <ChevronRight className="h-4 w-4 text-slate-800 self-center opacity-0 group-hover:opacity-100 transition-all" />
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             );
//                         })
//                     ) : (
//                         <div className="py-20 text-center space-y-4">
//                             <Layers className="h-12 w-12 text-slate-800 mx-auto opacity-10" />
//                             <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
//                                 No curriculum data staged for this level
//                             </p>
//                         </div>
//                     )}
//                 </div>

//                 {/* Footer Metrics */}
//                 <footer className="p-6 bg-slate-950/80 border-t border-white/5 flex justify-center">
//                     <div className="px-4 py-1 rounded-full bg-slate-900 border border-white/5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
//                         Total Topics: {currentGrade?.topics.length || 0}
//                     </div>
//                 </footer>
//             </div>
//         </div>
//     )
// }



'use client'

import { useState, useEffect } from 'react'
import { X, BookOpen, Calendar, ChevronRight, Layers, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { getSubjectSyllabus } from "@/app/actions/course-catalogue"

interface Topic {
    id: string
    title: string
    weekNumber: number | null
    description: string | null
    term: { index: number }
}

interface GradeSyllabus {
    id: string
    grade: { displayName: string }
    topics: Topic[]
}

interface SyllabusDrawerProps {
    subject: { id: string; name: string }
    schoolId: string
    onClose: () => void
}

export function SyllabusDrawer({ subject, schoolId, onClose }: SyllabusDrawerProps) {
    const [data, setData] = useState<GradeSyllabus[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeGradeTab, setActiveGradeTab] = useState(0);

    useEffect(() => {
        async function fetchSyllabus() {
            setLoading(true);
            const res = await getSubjectSyllabus(subject.id, schoolId);
            if (res.success && res.data) {
                // Safe Casting to align with the refactored return shape
                setData(res.data as unknown as GradeSyllabus[]);
            }
            setLoading(false);
        }
        fetchSyllabus();
    }, [subject.id, schoolId]);

    const currentGrade = data[activeGradeTab];

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm animate-in fade-in" onClick={onClose} />
            
            <div className="relative w-full max-w-xl bg-slate-900 border-l border-white/10 h-full shadow-2xl flex flex-col animate-in slide-in-from-right">
                
                <header className="p-8 border-b border-white/5 bg-slate-950/50">
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-3 bg-school-primary/10 rounded-2xl border border-school-primary/20">
                            <BookOpen className="h-6 w-6 text-school-primary" />
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500 hover:text-white">
                            <X className="h-6 w-6" />
                        </button>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                        {subject.name}
                    </h2>
                    <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Infrastructure Audit</p>
                </header>

                <div className="px-8 pt-6 flex gap-2 overflow-x-auto scrollbar-hide border-b border-white/5 pb-4">
                    {data.map((gs, idx) => (
                        <button 
                            key={gs.id}
                            onClick={() => setActiveGradeTab(idx)}
                            className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border",
                                activeGradeTab === idx 
                                    ? "bg-school-primary border-school-primary text-slate-950" 
                                    : "bg-slate-950 border-white/5 text-slate-500 hover:text-white"
                            )}
                        >
                            {gs.grade.displayName}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
                    {loading ? (
                        <div className="h-40 flex flex-col items-center justify-center gap-3">
                            <Loader2 className="h-6 w-6 animate-spin text-school-primary" />
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">Hydrating Registry...</p>
                        </div>
                    ) : currentGrade?.topics.length > 0 ? (
                        [1, 2, 3].map((termIndex) => {
                            const termTopics = currentGrade.topics.filter((t) => t.term.index === termIndex);
                            if (termTopics.length === 0) return null;

                            return (
                                <div key={termIndex} className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-school-primary" />
                                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Term {termIndex}</h3>
                                        <div className="h-px flex-1 bg-white/5" />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        {termTopics.map((topic) => (
                                            <div key={topic.id} className="group flex items-start gap-4 p-5 rounded-2xl bg-slate-950 border border-white/5 hover:border-school-primary/20 transition-all">
                                                <div className="h-9 w-9 shrink-0 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">
                                                    W{topic.weekNumber || '?'}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">
                                                        {topic.title}
                                                    </p>
                                                    {topic.description && (
                                                        <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                            {topic.description}
                                                        </p>
                                                    )}
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-slate-800 self-center opacity-0 group-hover:opacity-100" />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-20 text-center space-y-4">
                            <Layers className="h-12 w-12 text-slate-800 mx-auto opacity-10" />
                            <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest italic">
                                Registry nodes empty for this level
                            </p>
                        </div>
                    )}
                </div>

                <footer className="p-6 bg-slate-950/80 border-t border-white/5 flex justify-center">
                    <div className="px-4 py-1 rounded-full bg-slate-900 border border-white/5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                        Total Registry Entries: {currentGrade?.topics.length || 0}
                    </div>
                </footer>
            </div>
        </div>
    )
}