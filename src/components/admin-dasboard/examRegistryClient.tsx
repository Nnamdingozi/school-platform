// 'use client'

// import { useState, useMemo } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import { 
//     type AdminExamStats, 
//     type ExamRegistryItem 
// } from '@/app/actions/exam-engine.actions'
// import { ExamStatCard } from '@/components/shared/examComponent'
// import { 
//     ClipboardList, Search, Activity, CheckCircle2, 
//     Database, Users 
// } from 'lucide-react'
// import { cn } from '@/lib/utils'

// interface ExamRegistryClientProps {
//     initialStats: AdminExamStats | null;
//     initialExams: ExamRegistryItem[];
// }

// /**
//  * Rule 1: Institutional Layer Console
//  * Rule 17: Uses Zustand for branding without prop-drilling.
//  */
// export function ExamRegistryClient({ initialStats, initialExams }: ExamRegistryClientProps) {
//     const { profile } = useProfileStore();
//     const [searchQuery, setSearchQuery] = useState("");

//     const filteredExams = useMemo(() => {
//         return initialExams.filter((e: ExamRegistryItem) => 
//             e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             e.className.toLowerCase().includes(searchQuery.toLowerCase())
//         )
//     }, [initialExams, searchQuery])

//     return (
//         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 space-y-10 animate-in fade-in duration-500">
//             <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                 <div className="flex items-center gap-5">
//                     <div 
//                         className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                         style={{ 
//                             backgroundColor: `${profile?.primaryColor || '#f59e0b'}15`,
//                             borderColor: `${profile?.primaryColor || '#f59e0b'}30`
//                         }}
//                     >
//                         <ClipboardList className="h-7 w-7" style={{ color: profile?.primaryColor || '#f59e0b' }} />
//                     </div>
//                     <div>
//                         <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Registry Control</h1>
//                         <p className="text-slate-500 text-sm mt-2 font-medium italic">
//                             Oversight for {profile?.school?.name || "Institution"} CBT activities.
//                         </p>
//                     </div>
//                 </div>
//             </header>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                 <ExamStatCard 
//                     label="Total Assessments" 
//                     value={initialStats?.totalExams ?? 0} 
//                     sub="Items in vault" 
//                     icon={Database} 
//                 />
//                 <ExamStatCard 
//                     label="Active Sessions" 
//                     value={initialStats?.activeNow ?? 0} 
//                     sub="System active" 
//                     icon={Activity} 
//                     colorClass="text-school-primary" 
//                 />
//                 <ExamStatCard 
//                     label="Completion Rate" 
//                     value={`${initialStats?.completionRate ?? 0}%`} 
//                     sub="Global submission rate" 
//                     icon={CheckCircle2} 
//                     colorClass="text-emerald-500" 
//                 />
//             </div>

//             <div className="bg-slate-900 rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden">
//                 <div className="p-8 border-b border-white/5 bg-slate-950/40 flex flex-col md:flex-row justify-between items-center gap-6">
//                     <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">Audit Index</h3>
//                     <div className="relative w-full md:w-96">
//                         <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600" />
//                         <input 
//                             placeholder="Filter by classroom or exam title..." 
//                             value={searchQuery}
//                             onChange={(e) => setSearchQuery(e.target.value)}
//                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-xs text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800" 
//                         />
//                     </div>
//                 </div>

//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm">
//                         <thead>
//                             <tr className="text-left text-slate-500 text-[10px] uppercase tracking-widest bg-slate-950/20 border-b border-white/5 font-black">
//                                 <th className="px-10 py-6">Exam Identity</th>
//                                 <th className="px-10 py-6">Target Cohort</th>
//                                 <th className="px-10 py-6">Status</th>
//                                 <th className="px-10 py-6 text-right">Registry Progress</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-white/5">
//                             {filteredExams.map((exam) => {
//                                 const progress = exam.studentCount > 0 ? Math.round((exam.completedCount / exam.studentCount) * 100) : 0
//                                 return (
//                                     <tr key={exam.id} className="hover:bg-white/[0.02] transition-all group">
//                                         <td className="px-10 py-8 text-white font-black uppercase italic leading-tight">{exam.title}</td>
//                                         <td className="px-10 py-8">
//                                             <div className="flex items-center gap-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest">
//                                                 <Users className="h-3.5 w-3.5 text-school-primary" /> {exam.className}
//                                             </div>
//                                         </td>
//                                         <td className="px-10 py-8">
//                                             <span className={cn(
//                                                 "inline-flex px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
//                                                 exam.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
//                                                 exam.status === 'PUBLISHED' ? 'bg-school-primary/10 text-school-primary border-school-primary/20 animate-pulse' :
//                                                 'bg-slate-800 text-slate-400 border-white/5'
//                                             )}>
//                                                 {exam.status}
//                                             </span>
//                                         </td>
//                                         <td className="px-10 py-8 text-right">
//                                             <div className="flex flex-col items-end gap-2">
//                                                 <span className="text-[10px] font-black text-white uppercase tracking-tighter">
//                                                     {exam.completedCount} / {exam.studentCount} SYNCED
//                                                 </span>
//                                                 <div className="h-1.5 w-40 bg-slate-950 rounded-full overflow-hidden border border-white/5">
//                                                     <div 
//                                                         className="h-full transition-all duration-1000 bg-school-primary"
//                                                         style={{ 
//                                                             width: `${progress}%`,
//                                                             backgroundColor: progress === 100 ? '#10b981' : profile?.primaryColor 
//                                                         }} 
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 )
//                             })}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     )
// }





'use client'

import React, { useState, useMemo } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { 
    type AdminExamStats, 
    type ExamRegistryItem 
} from '@/app/actions/exam-engine.actions'
import { ExamStatCard } from '@/components/shared/examComponent'
import { 
    ClipboardList, Search, Activity, CheckCircle2, 
    Database, Users, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ExamRegistryClientProps {
    initialStats: AdminExamStats | null;
    initialExams: ExamRegistryItem[];
}

/**
 * INSTITUTIONAL EXAM REGISTRY (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 20: Compulsory Responsiveness with fluid padding and max-w-7xl.
 * Rule 21: Scale Protocol for mathematical brand tints.
 */
export function ExamRegistryClient({ initialStats, initialExams }: ExamRegistryClientProps) {
    const { profile } = useProfileStore();
    const [searchQuery, setSearchQuery] = useState("");

    const filteredExams = useMemo(() => {
        return initialExams.filter((e: ExamRegistryItem) => 
            e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            e.className.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }, [initialExams, searchQuery])

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Standardized Container & Fluid Spacing */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11) ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* Rule 21: Scale Protocol for Icon Container */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                            <ClipboardList className="h-8 w-8 text-school-primary" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-4xl font-extrabold tracking-tighter uppercase italic leading-none text-foreground">
                                Registry Control
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                Institutional CBT Infrastructure: {profile?.school?.name || "Global Core"}
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── TELEMETRY GRID (Rule 20) ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    <ExamStatCard 
                        label="Total Assessments" 
                        value={initialStats?.totalExams ?? 0} 
                        sub="Items in vault" 
                        icon={Database} 
                    />
                    <ExamStatCard 
                        label="Active Sessions" 
                        value={initialStats?.activeNow ?? 0} 
                        sub="System live" 
                        icon={Activity} 
                        colorClass="text-school-primary" 
                    />
                    <ExamStatCard 
                        label="Completion Rate" 
                        value={`${initialStats?.completionRate ?? 0}%`} 
                        sub="Global registry rate" 
                        icon={CheckCircle2} 
                        colorClass="text-emerald-500" 
                    />
                </div>

                {/* ── REGISTRY AUDIT SECTION (Rule 18/19) ── */}
                <div className="bg-card rounded-[2rem] border border-border shadow-2xl overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-border bg-surface/50 flex flex-col md:flex-row justify-between items-center gap-6">
                        <h3 className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-foreground italic">
                            Audit Index
                        </h3>
                        <div className="relative w-full md:w-96 group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-school-primary transition-colors" />
                            <input 
                                placeholder="Filter by node or exam identity..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-surface border border-border rounded-2xl pl-11 pr-10 py-4 text-xs font-bold uppercase tracking-widest text-foreground outline-none focus:ring-2 focus:ring-school-primary-200 transition-all placeholder:text-muted-foreground/30" 
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto custom-scrollbar">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-muted-foreground text-[10px] uppercase tracking-widest bg-surface/30 border-b border-border font-bold">
                                    <th className="px-10 py-6 italic">Exam Identity</th>
                                    <th className="px-10 py-6 italic">Target Cohort</th>
                                    <th className="px-10 py-6 italic">Registry Status</th>
                                    <th className="px-10 py-6 text-right italic">Node Progress</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredExams.map((exam) => {
                                    const progress = exam.studentCount > 0 ? Math.round((exam.completedCount / exam.studentCount) * 100) : 0
                                    return (
                                        <tr key={exam.id} className="hover:bg-muted/30 transition-all group">
                                            <td className="px-10 py-8 text-foreground font-extrabold uppercase italic leading-tight tracking-tight">
                                                {exam.title}
                                            </td>
                                            <td className="px-10 py-8">
                                                <div className="flex items-center gap-2 text-muted-foreground font-bold uppercase text-[10px] tracking-widest">
                                                    <Users className="h-4 w-4 text-school-primary" /> {exam.className}
                                                </div>
                                            </td>
                                            <td className="px-10 py-8">
                                                <span className={cn(
                                                    "inline-flex px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border",
                                                    exam.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                                                    exam.status === 'PUBLISHED' ? 'bg-school-primary-50 text-school-primary border-school-primary-200 animate-pulse' :
                                                    'bg-surface text-muted-foreground border-border'
                                                )}>
                                                    {exam.status}
                                                </span>
                                            </td>
                                            <td className="px-10 py-8 text-right">
                                                <div className="flex flex-col items-end gap-2.5">
                                                    <span className="text-[10px] font-extrabold text-foreground uppercase tracking-widest italic tabular-nums">
                                                        {exam.completedCount} <span className="text-muted-foreground/40 font-normal not-italic">/</span> {exam.studentCount} SYNCED
                                                    </span>
                                                    {/* Rule 21: Track Scale */}
                                                    <div className="h-1.5 w-44 bg-surface rounded-full overflow-hidden border border-border shadow-inner">
                                                        <div 
                                                            className={cn(
                                                                "h-full transition-all duration-1000",
                                                                progress === 100 ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-school-primary shadow-[0_0_10px_rgba(var(--school-primary-raw),0.2)]"
                                                            )}
                                                            style={{ width: `${progress}%` }} 
                                                        />
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}