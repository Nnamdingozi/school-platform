"use client"

import { useState, useEffect } from "react"
import {
    BookOpen, Calendar, CheckCircle2,
    Loader2, GraduationCap, Layers,
    CalendarDays, ChevronRight,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProfileStore } from "@/store/profileStore"
import { getCurriculumStats, CurriculumStats } from "@/app/actions/curiculum-stats"

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(date: Date | null): string {
    if (!date) return 'Not set'
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

function getTermProgress(
    startDate: Date | null,
    endDate:   Date | null
): number | null {
    if (!startDate || !endDate) return null
    const now   = new Date().getTime()
    const start = new Date(startDate).getTime()
    const end   = new Date(endDate).getTime()
    if (now < start) return 0
    if (now > end)   return 100
    return Math.round(((now - start) / (end - start)) * 100)
}

// ── Component ──────────────────────────────────────────────────────────────────

export function CurriculumCard() {
    const { profile }  = useProfileStore()
    const schoolId     = profile?.schoolId ?? ''

    const [stats,   setStats]   = useState<CurriculumStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getCurriculumStats(schoolId)
            .then(data => { setStats(data); setLoading(false) })
            .catch(() => setLoading(false))
    }, [schoolId])

    // ── Loading ────────────────────────────────────────────────────────────
    if (loading) return (
        <Card className="h-full bg-gray-50 border-gray-200">
            <CardContent className="flex items-center justify-center h-48">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
                    <span className="text-xs text-gray-500">Loading curriculum...</span>
                </div>
            </CardContent>
        </Card>
    )

    // ── Empty ──────────────────────────────────────────────────────────────
    if (!stats) return (
        <Card className="h-full bg-gray-50 border-gray-200">
            <CardContent className="flex flex-col items-center justify-center h-48 gap-2 text-center p-6">
                <BookOpen className="h-8 w-8 text-gray-300" />
                <p className="text-sm font-semibold text-gray-700">No curriculum found</p>
                <p className="text-xs text-gray-400">
                    Assign a curriculum to your school to see stats here.
                </p>
            </CardContent>
        </Card>
    )

    // ── Current term ───────────────────────────────────────────────────────
    const today            = new Date()
    const currentTermIndex = (() => {
        const byDate = stats.terms.findIndex(t =>
            t.startDate && t.endDate &&
            today >= new Date(t.startDate) &&
            today <= new Date(t.endDate)
        )
        return byDate !== -1 ? byDate : Math.floor((stats.terms.length - 1) / 2)
    })()

    const currentTerm = stats.terms[currentTermIndex]
    const progress    = currentTerm
        ? getTermProgress(currentTerm.startDate, currentTerm.endDate)
        : null

    return (
        <Card className="h-fit bg-gray-50 border-gray-200">

            {/* ── Header ── */}
            <CardHeader className="pb-3 border-b border-gray-200 px-4 sm:px-5">
                <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-sm sm:text-base font-bold text-gray-800">
                        Curriculum Status
                    </CardTitle>
                    <Badge className="bg-school-primary/20 text-school-primary border border-school-primary/30 text-[10px] font-semibold shrink-0">
                        Active
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">

                {/* ── Active Curriculum ── */}
                <div className="rounded-xl border border-gray-200 bg-white p-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
                            <BookOpen className="h-4 w-4 text-school-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-gray-800 truncate">
                                {stats.name}
                            </h4>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                                {stats.subjectLabel}s · {stats.termLabel}s · {stats.yearLabel}s
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Quick Stats ── */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: stats.subjectLabel + 's', value: stats.totalSubjects, icon: BookOpen       },
                        { label: stats.yearLabel + 's',    value: stats.totalGrades,   icon: GraduationCap  },
                        { label: 'Topics',                 value: stats.totalTopics,   icon: Layers         },
                    ].map((card, i) => (
                        <div
                            key={card.label}
                            className={`rounded-lg border border-gray-200 p-2 sm:p-2.5 text-center ${
                                i % 2 === 0 ? 'bg-white' : 'bg-gray-100'
                            }`}
                        >
                            <card.icon className="h-3.5 w-3.5 text-school-primary mx-auto mb-1" />
                            <p className="text-base sm:text-lg font-black text-gray-800 leading-none">
                                {card.value}
                            </p>
                            <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">
                                {card.label}
                            </p>
                        </div>
                    ))}
                </div>

                {/* ── Current Term ── */}
                {currentTerm && (
                    <div className="space-y-2">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                                Current {stats.termLabel}
                            </span>
                        </div>
                        <div className="rounded-xl border border-school-primary/30 bg-school-primary/10 p-3 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-bold text-gray-800">
                                    {currentTerm.displayName}
                                </p>
                                <span className="text-[10px] font-semibold text-school-primary shrink-0">
                                    {stats.termLabel} {currentTerm.index + 1}/{stats.terms.length}
                                </span>
                            </div>

                            {/* Dates */}
                            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
                                <CalendarDays className="h-3 w-3 text-school-primary shrink-0" />
                                <span>
                                    {formatDate(currentTerm.startDate)}
                                    {' → '}
                                    {formatDate(currentTerm.endDate)}
                                </span>
                            </div>

                            {/* Progress bar */}
                            {progress !== null && (
                                <div className="space-y-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] text-gray-500">Progress</span>
                                        <span className="text-[10px] font-semibold text-school-primary">
                                            {progress}%
                                        </span>
                                    </div>
                                    <div className="h-1.5 w-full rounded-full bg-gray-200">
                                        <div
                                            className="h-1.5 rounded-full bg-school-primary transition-all duration-500"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* No dates warning */}
                            {!currentTerm.startDate && (
                                <p className="text-[10px] text-amber-500">
                                    ⚠ Term dates not set — configure in school settings
                                </p>
                            )}
                        </div>
                    </div>
                )}

                {/* ── All Terms ── */}
                {stats.terms.length > 0 && (
                    <div className="space-y-1.5">
                        <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
                            All {stats.termLabel}s
                        </p>
                        <div className="space-y-1">
                            {stats.terms.map((term, i) => {
                                const isCurrent = i === currentTermIndex
                                const isPast    = i < currentTermIndex
                                return (
                                    <div
                                        key={term.id}
                                        className={`flex items-center justify-between rounded-lg px-3 py-2 border transition-colors ${
                                            isCurrent
                                                ? 'border-school-primary/30 bg-school-primary/10'
                                                : i % 2 === 0
                                                ? 'border-gray-200 bg-white'
                                                : 'border-gray-200 bg-gray-100'
                                        } ${isPast && !isCurrent ? 'opacity-60' : ''}`}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                                isCurrent ? 'bg-school-primary'
                                                : isPast   ? 'bg-gray-300'
                                                :            'bg-gray-400'
                                            }`} />
                                            <span className={`text-xs font-medium truncate ${
                                                isCurrent ? 'text-school-primary' : 'text-gray-600'
                                            }`}>
                                                {term.displayName}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            {term.startDate && (
                                                <span className="hidden sm:block text-[10px] text-gray-400">
                                                    {new Date(term.startDate).toLocaleDateString('en-GB', {
                                                        day: 'numeric', month: 'short',
                                                    })}
                                                    {' — '}
                                                    {term.endDate
                                                        ? new Date(term.endDate).toLocaleDateString('en-GB', {
                                                            day: 'numeric', month: 'short',
                                                        })
                                                        : '?'
                                                    }
                                                </span>
                                            )}
                                            {isCurrent ? (
                                                <span className="text-[9px] sm:text-[10px] font-semibold text-school-primary">
                                                    Current
                                                </span>
                                            ) : (
                                                <ChevronRight className="h-3 w-3 text-gray-300" />
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* ── Compliance ── */}
                <div className="flex items-center gap-2.5 rounded-xl bg-school-primary/10 border border-school-primary/20 p-3">
                    <CheckCircle2 className="h-4 w-4 text-school-primary shrink-0" />
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-gray-800">
                            Compliance Status
                        </p>
                        <p className="text-[11px] text-gray-500 mt-0.5">
                            All curriculum requirements are being met
                        </p>
                    </div>
                </div>

            </CardContent>
        </Card>
    )
}


// "use client"

// import { useState, useEffect } from "react"
// import {
//     BookOpen, Calendar, CheckCircle2,
//     Loader2, GraduationCap, Layers,
//     CalendarDays,
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useProfileStore } from "@/store/profileStore"
// import { getCurriculumStats, CurriculumStats } from "@/app/actions/curiculum-stats"
// import { cn } from "@/lib/utils"

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function formatDate(date: Date | null): string {
//     if (!date) return '---'
//     return new Date(date).toLocaleDateString('en-GB', {
//         day: 'numeric', month: 'short'
//     })
// }

// function getTermProgress(startDate: Date | null, endDate: Date | null): number | null {
//     if (!startDate || !endDate) return null
//     const now = new Date().getTime()
//     const start = new Date(startDate).getTime()
//     const end = new Date(endDate).getTime()
//     if (now < start) return 0
//     if (now > end) return 100
//     return Math.round(((now - start) / (end - start)) * 100)
// }

// export function CurriculumCard() {
//     const { profile } = useProfileStore()
//     const schoolId = profile?.schoolId ?? ''
//     const [stats, setStats] = useState<CurriculumStats | null>(null)
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (!schoolId) return
//         setLoading(true)
//         getCurriculumStats(schoolId)
//             .then(data => { setStats(data); setLoading(false) })
//             .catch(() => setLoading(false))
//     }, [schoolId])

//     if (loading) return (
//         <Card className="h-48 bg-slate-900 border-white/5 flex items-center justify-center">
//             <Loader2 className="h-6 w-6 animate-spin text-school-primary" />
//         </Card>
//     )

//     if (!stats) return null

//     // Logic: Identify current term
//     const today = new Date()
//     const currentTermIndex = stats.terms.findIndex(t =>
//         t.startDate && t.endDate && today >= new Date(t.startDate) && today <= new Date(t.endDate)
//     )
//     const currentTerm = stats.terms[currentTermIndex !== -1 ? currentTermIndex : 0]
//     const progress = currentTerm ? getTermProgress(currentTerm.startDate, currentTerm.endDate) : null

//     return (
//         <Card className="h-fit bg-slate-900 border-white/5 shadow-2xl overflow-hidden rounded-[2rem]">
//             <CardHeader className="pb-2 border-b border-white/5 bg-slate-950/40 px-6 py-4">
//                 <div className="flex items-center justify-between">
//                     <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">
//                         Academic Infrastructure
//                     </CardTitle>
//                     <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-black text-emerald-500 uppercase">
//                         <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
//                         Live
//                     </div>
//                 </div>
//             </CardHeader>

//             <CardContent className="p-6 space-y-5">
//                 {/* ── Active Curriculum Title ── */}
//                 <div className="flex items-center justify-between gap-4">
//                     <div className="flex items-center gap-3">
//                         <div className="p-2 bg-school-primary/10 rounded-lg">
//                             <BookOpen className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <h4 className="text-sm font-bold text-white uppercase italic">{stats.name}</h4>
//                     </div>
//                     <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
//                         {stats.totalSubjects} {stats.subjectLabel}s
//                     </p>
//                 </div>

//                 {/* ── Compact Stats Grid ── */}
//                 <div className="grid grid-cols-3 gap-3">
//                     {[
//                         { label: stats.yearLabel + 's', value: stats.totalGrades, icon: GraduationCap },
//                         { label: 'Topics', value: stats.totalTopics, icon: Layers },
//                         { label: 'Compliance', value: '100%', icon: CheckCircle2 },
//                     ].map((card) => (
//                         <div key={card.label} className="bg-slate-950 border border-white/5 rounded-2xl p-3 text-center">
//                             <card.icon className="h-3 w-3 text-slate-600 mx-auto mb-1" />
//                             <p className="text-sm font-black text-white leading-none">{card.value}</p>
//                             <p className="text-[8px] text-slate-500 uppercase font-bold mt-1 tracking-tighter">{card.label}</p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Current Term Focus ── */}
//                 {currentTerm && (
//                     <div className="bg-slate-950 border border-school-primary/20 rounded-2xl p-4 shadow-inner relative overflow-hidden">
//                         {/* Background glow */}
//                         <div className="absolute top-0 right-0 h-16 w-16 bg-school-primary/5 blur-2xl rounded-full" />
                        
//                         <div className="flex justify-between items-start mb-3 relative z-10">
//                             <div>
//                                 <p className="text-[9px] font-black text-school-primary uppercase tracking-[0.2em] mb-1">Active Window</p>
//                                 <h5 className="text-sm font-bold text-white uppercase">{currentTerm.displayName}</h5>
//                             </div>
//                             <span className="text-[10px] font-mono text-slate-500">
//                                 {progress}%
//                             </span>
//                         </div>

//                         {/* Progress Bar */}
//                         {progress !== null && (
//                             <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
//                                 <div 
//                                     className="h-full bg-school-primary shadow-[0_0_8px_var(--color-school-primary)] transition-all duration-1000" 
//                                     style={{ width: `${progress}%` }} 
//                                 />
//                             </div>
//                         )}

//                         <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-400">
//                             <CalendarDays className="h-3 w-3 text-school-primary" />
//                             {formatDate(currentTerm.startDate)} <span className="opacity-30">→</span> {formatDate(currentTerm.endDate)}
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Horizontal Term Timeline (Replaces the long list) ── */}
//                 <div className="pt-2">
//                     <div className="flex items-center gap-2 mb-3">
//                         <div className="h-px flex-1 bg-white/5" />
//                         <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.3em]">Timeline</span>
//                         <div className="h-px flex-1 bg-white/5" />
//                     </div>
//                     <div className="flex justify-between items-center px-2">
//                         {stats.terms.map((term, i) => {
//                             const isCurrent = i === currentTermIndex || (currentTermIndex === -1 && i === 0);
//                             const isPast = currentTermIndex > -1 && i < currentTermIndex;
                            
//                             return (
//                                 <div key={term.id} className="flex flex-col items-center gap-1.5 flex-1 relative">
//                                     {/* Line connectors */}
//                                     {i < stats.terms.length - 1 && (
//                                         <div className="absolute top-1.5 left-1/2 w-full h-[1px] bg-white/5 -z-0" />
//                                     )}
//                                     <div className={cn(
//                                         "h-3 w-3 rounded-full border-2 z-10 transition-all",
//                                         isCurrent ? "bg-school-primary border-slate-900 scale-125 shadow-[0_0_8px_#f59e0b]" : 
//                                         isPast ? "bg-slate-700 border-slate-900" : "bg-slate-900 border-white/10"
//                                     )} />
//                                     <span className={cn(
//                                         "text-[8px] font-bold uppercase tracking-tighter",
//                                         isCurrent ? "text-school-primary" : "text-slate-600"
//                                     )}>
//                                         {term.displayName.split(' ')[0]}
//                                     </span>
//                                 </div>
//                             )
//                         })}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//     )
// }