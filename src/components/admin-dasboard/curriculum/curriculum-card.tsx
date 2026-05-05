// "use client"

// import { useState, useEffect } from "react"
// import {
//     BookOpen, Calendar, CheckCircle2,
//     Loader2, GraduationCap, Layers,
//     CalendarDays, ChevronRight,
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { useProfileStore } from "@/store/profileStore"
// import { getCurriculumStats, CurriculumStats } from "@/app/actions/curiculum-stats"

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function formatDate(date: Date | null): string {
//     if (!date) return 'Not set'
//     return new Date(date).toLocaleDateString('en-GB', {
//         day: 'numeric', month: 'short', year: 'numeric',
//     })
// }

// function getTermProgress(
//     startDate: Date | null,
//     endDate:   Date | null
// ): number | null {
//     if (!startDate || !endDate) return null
//     const now   = new Date().getTime()
//     const start = new Date(startDate).getTime()
//     const end   = new Date(endDate).getTime()
//     if (now < start) return 0
//     if (now > end)   return 100
//     return Math.round(((now - start) / (end - start)) * 100)
// }

// // ── Component ──────────────────────────────────────────────────────────────────

// export function CurriculumCard() {
//     const { profile }  = useProfileStore()
//     const schoolId     = profile?.schoolId ?? ''

//     const [stats,   setStats]   = useState<CurriculumStats | null>(null)
//     const [loading, setLoading] = useState(true)

//     useEffect(() => {
//         if (!schoolId) return
//         setLoading(true)
//         getCurriculumStats(schoolId)
//             .then(data => { setStats(data); setLoading(false) })
//             .catch(() => setLoading(false))
//     }, [schoolId])

//     // ── Loading ────────────────────────────────────────────────────────────
//     if (loading) return (
//         <Card className="h-full bg-gray-50 border-gray-200">
//             <CardContent className="flex items-center justify-center h-48">
//                 <div className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
//                     <span className="text-xs text-gray-500">Loading curriculum...</span>
//                 </div>
//             </CardContent>
//         </Card>
//     )

//     // ── Empty ──────────────────────────────────────────────────────────────
//     if (!stats) return (
//         <Card className="h-full bg-gray-50 border-gray-200">
//             <CardContent className="flex flex-col items-center justify-center h-48 gap-2 text-center p-6">
//                 <BookOpen className="h-8 w-8 text-gray-300" />
//                 <p className="text-sm font-semibold text-gray-700">No curriculum found</p>
//                 <p className="text-xs text-gray-400">
//                     Assign a curriculum to your school to see stats here.
//                 </p>
//             </CardContent>
//         </Card>
//     )

//     // ── Current term ───────────────────────────────────────────────────────
//     const today            = new Date()
//     const currentTermIndex = (() => {
//         const byDate = stats.terms.findIndex(t =>
//             t.startDate && t.endDate &&
//             today >= new Date(t.startDate) &&
//             today <= new Date(t.endDate)
//         )
//         return byDate !== -1 ? byDate : Math.floor((stats.terms.length - 1) / 2)
//     })()

//     const currentTerm = stats.terms[currentTermIndex]
//     const progress    = currentTerm
//         ? getTermProgress(currentTerm.startDate, currentTerm.endDate)
//         : null

//     return (
//         <Card className="h-fit bg-gray-50 border-gray-200">

//             {/* ── Header ── */}
//             <CardHeader className="pb-3 border-b border-gray-200 px-4 sm:px-5">
//                 <div className="flex items-center justify-between gap-2">
//                     <CardTitle className="text-sm sm:text-base font-bold text-gray-800">
//                         Curriculum Status
//                     </CardTitle>
//                     <Badge className="bg-school-primary/20 text-school-primary border border-school-primary/30 text-[10px] font-semibold shrink-0">
//                         Active
//                     </Badge>
//                 </div>
//             </CardHeader>

//             <CardContent className="p-4 sm:p-5 space-y-4">

//                 {/* ── Active Curriculum ── */}
//                 <div className="rounded-xl border border-gray-200 bg-white p-3">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <BookOpen className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <h4 className="text-sm font-bold text-gray-800 truncate">
//                                 {stats.name}
//                             </h4>
//                             <p className="text-[11px] text-gray-400 mt-0.5">
//                                 {stats.subjectLabel}s · {stats.termLabel}s · {stats.yearLabel}s
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Quick Stats ── */}
//                 <div className="grid grid-cols-3 gap-2">
//                     {[
//                         { label: stats.subjectLabel + 's', value: stats.totalSubjects, icon: BookOpen       },
//                         { label: stats.yearLabel + 's',    value: stats.totalGrades,   icon: GraduationCap  },
//                         { label: 'Topics',                 value: stats.totalTopics,   icon: Layers         },
//                     ].map((card, i) => (
//                         <div
//                             key={card.label}
//                             className={`rounded-lg border border-gray-200 p-2 sm:p-2.5 text-center ${
//                                 i % 2 === 0 ? 'bg-white' : 'bg-gray-100'
//                             }`}
//                         >
//                             <card.icon className="h-3.5 w-3.5 text-school-primary mx-auto mb-1" />
//                             <p className="text-base sm:text-lg font-black text-gray-800 leading-none">
//                                 {card.value}
//                             </p>
//                             <p className="text-[9px] sm:text-[10px] text-gray-500 mt-0.5 truncate">
//                                 {card.label}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Current Term ── */}
//                 {currentTerm && (
//                     <div className="space-y-2">
//                         <div className="flex items-center gap-1.5">
//                             <Calendar className="h-3.5 w-3.5 text-gray-400" />
//                             <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
//                                 Current {stats.termLabel}
//                             </span>
//                         </div>
//                         <div className="rounded-xl border border-school-primary/30 bg-school-primary/10 p-3 space-y-2">
//                             <div className="flex items-center justify-between gap-2">
//                                 <p className="text-sm font-bold text-gray-800">
//                                     {currentTerm.displayName}
//                                 </p>
//                                 <span className="text-[10px] font-semibold text-school-primary shrink-0">
//                                     {stats.termLabel} {currentTerm.index + 1}/{stats.terms.length}
//                                 </span>
//                             </div>

//                             {/* Dates */}
//                             <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
//                                 <CalendarDays className="h-3 w-3 text-school-primary shrink-0" />
//                                 <span>
//                                     {formatDate(currentTerm.startDate)}
//                                     {' → '}
//                                     {formatDate(currentTerm.endDate)}
//                                 </span>
//                             </div>

//                             {/* Progress bar */}
//                             {progress !== null && (
//                                 <div className="space-y-1">
//                                     <div className="flex items-center justify-between">
//                                         <span className="text-[10px] text-gray-500">Progress</span>
//                                         <span className="text-[10px] font-semibold text-school-primary">
//                                             {progress}%
//                                         </span>
//                                     </div>
//                                     <div className="h-1.5 w-full rounded-full bg-gray-200">
//                                         <div
//                                             className="h-1.5 rounded-full bg-school-primary transition-all duration-500"
//                                             style={{ width: `${progress}%` }}
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* No dates warning */}
//                             {!currentTerm.startDate && (
//                                 <p className="text-[10px] text-amber-500">
//                                     ⚠ Term dates not set — configure in school settings
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* ── All Terms ── */}
//                 {stats.terms.length > 0 && (
//                     <div className="space-y-1.5">
//                         <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">
//                             All {stats.termLabel}s
//                         </p>
//                         <div className="space-y-1">
//                             {stats.terms.map((term, i) => {
//                                 const isCurrent = i === currentTermIndex
//                                 const isPast    = i < currentTermIndex
//                                 return (
//                                     <div
//                                         key={term.id}
//                                         className={`flex items-center justify-between rounded-lg px-3 py-2 border transition-colors ${
//                                             isCurrent
//                                                 ? 'border-school-primary/30 bg-school-primary/10'
//                                                 : i % 2 === 0
//                                                 ? 'border-gray-200 bg-white'
//                                                 : 'border-gray-200 bg-gray-100'
//                                         } ${isPast && !isCurrent ? 'opacity-60' : ''}`}
//                                     >
//                                         <div className="flex items-center gap-2 min-w-0">
//                                             <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
//                                                 isCurrent ? 'bg-school-primary'
//                                                 : isPast   ? 'bg-gray-300'
//                                                 :            'bg-gray-400'
//                                             }`} />
//                                             <span className={`text-xs font-medium truncate ${
//                                                 isCurrent ? 'text-school-primary' : 'text-gray-600'
//                                             }`}>
//                                                 {term.displayName}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center gap-2 shrink-0">
//                                             {term.startDate && (
//                                                 <span className="hidden sm:block text-[10px] text-gray-400">
//                                                     {new Date(term.startDate).toLocaleDateString('en-GB', {
//                                                         day: 'numeric', month: 'short',
//                                                     })}
//                                                     {' — '}
//                                                     {term.endDate
//                                                         ? new Date(term.endDate).toLocaleDateString('en-GB', {
//                                                             day: 'numeric', month: 'short',
//                                                         })
//                                                         : '?'
//                                                     }
//                                                 </span>
//                                             )}
//                                             {isCurrent ? (
//                                                 <span className="text-[9px] sm:text-[10px] font-semibold text-school-primary">
//                                                     Current
//                                                 </span>
//                                             ) : (
//                                                 <ChevronRight className="h-3 w-3 text-gray-300" />
//                                             )}
//                                         </div>
//                                     </div>
//                                 )
//                             })}
//                         </div>
//                     </div>
//                 )}

//                 {/* ── Compliance ── */}
//                 <div className="flex items-center gap-2.5 rounded-xl bg-school-primary/10 border border-school-primary/20 p-3">
//                     <CheckCircle2 className="h-4 w-4 text-school-primary shrink-0" />
//                     <div className="min-w-0">
//                         <p className="text-xs font-semibold text-gray-800">
//                             Compliance Status
//                         </p>
//                         <p className="text-[11px] text-gray-500 mt-0.5">
//                             All curriculum requirements are being met
//                         </p>
//                     </div>
//                 </div>

//             </CardContent>
//         </Card>
//     )
// }

"use client"


import {
    BookOpen, Calendar,
    GraduationCap, Layers,
    CalendarDays, ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useProfileStore } from "@/store/profileStore"
import { type CurriculumStats } from "@/app/actions/curiculum-stats"

// ── Helpers ────────────────────────────────────────────────────────────────────

function formatDate(date: Date | string | null): string {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric',
    })
}

function getTermProgress(startDate: Date | null, endDate: Date | null): number | null {
    if (!startDate || !endDate) return null
    const now   = new Date().getTime()
    const start = new Date(startDate).getTime()
    const end   = new Date(endDate).getTime()
    if (now < start) return 0
    if (now > end)   return 100
    return Math.round(((now - start) / (end - start)) * 100)
}

// ── Main Component ──────────────────────────────────────────────────────────

export function CurriculumCard({ initialStats }: { initialStats: CurriculumStats | null }) {
    const { profile }  = useProfileStore()
    const primaryColor = profile?.primaryColor || "#f59e0b";

    if (!initialStats) return (
        <Card className="bg-slate-900 border-white/5 p-12 text-center rounded-[2.5rem]">
            <BookOpen className="h-10 w-10 text-slate-800 mx-auto mb-4" />
            <p className="text-slate-500 text-xs font-black uppercase tracking-widest italic">Registry Data Missing</p>
        </Card>
    )

    const stats = initialStats;
    const today = new Date()
    const currentTermIndex = stats.terms.findIndex(t =>
        t.startDate && t.endDate && today >= new Date(t.startDate) && today <= new Date(t.endDate)
    ) !== -1 ? stats.terms.findIndex(t => t.startDate && t.endDate && today >= new Date(t.startDate) && today <= new Date(t.endDate)) : 0;

    const currentTerm = stats.terms[currentTermIndex]
    const progress    = currentTerm ? getTermProgress(currentTerm.startDate, currentTerm.endDate) : null

    return (
        <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-8 border-b border-white/5 bg-slate-950/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-slate-950 border border-white/10 rounded-xl flex items-center justify-center">
                            <BookOpen className="h-5 w-5" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <h4 className="text-lg font-black text-white uppercase italic tracking-tight">{stats.name}</h4>
                            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-0.5">
                                {stats.subjectLabel}s • {stats.termLabel}s • {stats.yearLabel}s
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[9px] font-black uppercase px-3 py-1">Active Core</Badge>
                </div>
            </CardHeader>

            <CardContent className="p-8 space-y-10">
                <div className="grid grid-cols-3 gap-6">
                    {[
                        { label: stats.subjectLabel + 's', value: stats.totalSubjects, icon: BookOpen },
                        { label: stats.yearLabel + 's', value: stats.totalGrades, icon: GraduationCap },
                        { label: 'Syllabus Nodes', value: stats.totalTopics, icon: Layers },
                    ].map((card) => (
                        <div key={card.label} className="bg-slate-950 border border-white/5 p-6 rounded-3xl text-center space-y-2 shadow-inner">
                            <card.icon className="h-4 w-4 mx-auto" style={{ color: primaryColor }} />
                            <p className="text-2xl font-black text-white italic tracking-tighter">{card.value}</p>
                            <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest">{card.label}</p>
                        </div>
                    ))}
                </div>

                {currentTerm && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase text-slate-500 tracking-widest">
                            <Calendar className="h-3.5 w-3.5" /> Live {stats.termLabel} Timeline
                        </div>
                        <div className="bg-slate-950 border border-white/5 p-6 rounded-[2rem] space-y-4">
                            <div className="flex justify-between items-center">
                                <p className="text-sm font-black text-white uppercase italic">{currentTerm.displayName}</p>
                                <span className="text-[9px] font-black uppercase tracking-widest px-2 py-1 bg-white/5 rounded" style={{ color: primaryColor }}>
                                    Progress: {progress ?? 0}%
                                </span>
                            </div>

                            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: primaryColor }} />
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-bold uppercase tracking-tighter">
                                <CalendarDays className="h-3.5 w-3.5" style={{ color: primaryColor }} />
                                {formatDate(currentTerm.startDate)} <ArrowRight className="h-3 w-3 inline mx-1" /> {formatDate(currentTerm.endDate)}
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

