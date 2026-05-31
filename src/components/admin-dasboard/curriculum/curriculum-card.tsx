// 'use client'

// import {
//     BookOpen,
//     Calendar,
//     GraduationCap,
//     Layers,
//     CalendarDays,
//     ArrowRight,
//     type LucideIcon,
// } from 'lucide-react'
// import { Card, CardContent, CardHeader } from '@/components/ui/card'
// import { Badge } from '@/components/ui/badge'
// import { type CurriculumStats, type TermStat } from '@/app/actions/curiculum-stats'

// export interface CurriculumCardProps {
//     initialStats?: CurriculumStats | null
// }

// function formatDate(date: Date | string | null): string {
//     if (!date) return 'TBD'
//     return new Date(date).toLocaleDateString('en-GB', {
//         day: 'numeric',
//         month: 'short',
//         year: 'numeric',
//     })
// }

// function getTermProgress(startDate: Date | null, endDate: Date | null): number | null {
//     if (!startDate || !endDate) return null
//     const now = Date.now()
//     const start = new Date(startDate).getTime()
//     const end = new Date(endDate).getTime()
//     if (now < start) return 0
//     if (now > end) return 100
//     return Math.round(((now - start) / (end - start)) * 100)
// }

// function getCurrentTermIndex(terms: TermStat[]): number {
//     const today = new Date()
//     const byDate = terms.findIndex(
//         (t) =>
//             t.startDate &&
//             t.endDate &&
//             today >= new Date(t.startDate) &&
//             today <= new Date(t.endDate),
//     )
//     return byDate !== -1 ? byDate : 0
// }

// /**
//  * CURRICULUM STATUS CARD (Tier 2)
//  * Rule 12: Receives server-fetched stats as props.
//  * Rule 16: Uses dynamic curriculum labels (yearLabel, termLabel, subjectLabel).
//  * Rule 17: Branding via school-primary design tokens.
//  */
// export function CurriculumCard({ initialStats }: CurriculumCardProps) {
//     if (!initialStats) {
//         return (
//             <Card className="bg-card border-border p-12 text-center rounded-[2.5rem] shadow-2xl">
//                 <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
//                 <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest italic">
//                     Registry Data Missing
//                 </p>
//             </Card>
//         )
//     }

//     const stats = initialStats
//     const currentTermIndex = getCurrentTermIndex(stats.terms)
//     const currentTerm = stats.terms[currentTermIndex]
//     const progress = currentTerm
//         ? getTermProgress(currentTerm.startDate, currentTerm.endDate)
//         : null

//     const statCards: { label: string; value: number; icon: LucideIcon }[] = [
//         { label: `${stats.subjectLabel}s`, value: stats.totalSubjects, icon: BookOpen },
//         { label: `${stats.yearLabel}s`, value: stats.totalGrades, icon: GraduationCap },
//         { label: 'Syllabus Nodes', value: stats.totalTopics, icon: Layers },
//     ]

//     return (
//         <Card className="bg-card border-border rounded-[2.5rem] overflow-hidden shadow-2xl">
//             <CardHeader className="p-8 border-b border-border bg-background/50">
//                 <div className="flex items-center justify-between gap-4">
//                     <div className="flex items-center gap-4 min-w-0">
//                         <div className="h-10 w-10 bg-school-primary/10 border border-school-primary/20 rounded-xl flex items-center justify-center shrink-0">
//                             <BookOpen className="h-5 w-5 text-school-primary" />
//                         </div>
//                         <div className="min-w-0">
//                             <h4 className="text-lg font-black text-foreground uppercase italic tracking-tight truncate">
//                                 {stats.name}
//                             </h4>
//                             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-0.5">
//                                 {stats.subjectLabel}s • {stats.termLabel}s • {stats.yearLabel}s
//                             </p>
//                         </div>
//                     </div>
//                     <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] font-black uppercase px-3 py-1 shrink-0">
//                         Active Core
//                     </Badge>
//                 </div>
//             </CardHeader>

//             <CardContent className="p-8 space-y-10">
//                 <div className="grid grid-cols-3 gap-6">
//                     {statCards.map((card) => (
//                         <StatTile key={card.label} {...card} />
//                     ))}
//                 </div>

//                 {currentTerm && (
//                     <div className="space-y-4">
//                         <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
//                             <Calendar className="h-3.5 w-3.5 text-school-primary" />
//                             Live {stats.termLabel} Timeline
//                         </div>

//                         <div className="bg-background border border-border p-6 rounded-[2rem] space-y-4">
//                             <div className="flex justify-between items-center gap-3">
//                                 <p className="text-sm font-black text-foreground uppercase italic">
//                                     {currentTerm.displayName}
//                                 </p>
//                                 <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-school-primary/10 text-school-primary rounded">
//                                     Progress: {progress ?? 0}%
//                                 </span>
//                             </div>

//                             <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
//                                 <div
//                                     className="h-full bg-school-primary transition-all duration-1000"
//                                     style={{ width: `${progress ?? 0}%` }}
//                                 ></div>
//                             </div>

//                             <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
//                                 <CalendarDays className="h-3.5 w-3.5 text-school-primary shrink-0" />
//                                 <span>
//                                     {formatDate(currentTerm.startDate)}
//                                     <ArrowRight className="h-3 w-3 inline mx-1" />
//                                     {formatDate(currentTerm.endDate)}
//                                 </span>
//                             </div>

//                             {!currentTerm.startDate && (
//                                 <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 italic">
//                                     {stats.termLabel} dates not set — configure in school settings
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }

// interface StatTileProps {
//     label: string
//     value: number
//     icon: LucideIcon
// }

// function StatTile({ label, value, icon: Icon }: StatTileProps) {
//     return (
//         <div className="bg-background border border-border p-6 rounded-[2rem] text-center space-y-2 shadow-inner">
//             <Icon className="h-4 w-4 mx-auto text-school-primary" />
//             <p className="text-2xl font-black text-foreground italic tracking-tighter">{value}</p>
//             <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest">
//                 {label}
//             </p>
//         </div>
//     )
// }



'use client'

import React from 'react'
import {
    BookOpen,
    Calendar,
    GraduationCap,
    Layers,
    CalendarDays,
    ArrowRight,
    type LucideIcon,
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type CurriculumStats, type TermStat } from '@/app/actions/curiculum-stats'


export interface CurriculumCardProps {
    initialStats?: CurriculumStats | null
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date | string | null): string {
    if (!date) return 'TBD'
    return new Date(date).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    })
}

function getTermProgress(startDate: Date | null, endDate: Date | null): number | null {
    if (!startDate || !endDate) return null
    const now = Date.now()
    const start = new Date(startDate).getTime()
    const end = new Date(endDate).getTime()
    if (now < start) return 0
    if (now > end) return 100
    return Math.round(((now - start) / (end - start)) * 100)
}

function getCurrentTermIndex(terms: TermStat[]): number {
    const today = new Date()
    const byDate = terms.findIndex(
        (t) =>
            t.startDate &&
            t.endDate &&
            today >= new Date(t.startDate) &&
            today <= new Date(t.endDate),
    )
    return byDate !== -1 ? byDate : 0
}

// ── Main Component ──────────────────────────────────────────────────────────

/**
 * CURRICULUM STATUS CARD (Tier 2)
 * Rule 11/19: High-fidelity Typography & [2rem] Registry Geometry.
 * Rule 18: Semantic tokens (bg-card, bg-surface, bg-background).
 * Rule 20: Mobile-first responsive stat grid.
 */
export function CurriculumCard({ initialStats }: CurriculumCardProps) {
    if (!initialStats) {
        return (
            <Card className="bg-card border-border p-12 text-center rounded-[2rem] shadow-xl">
                <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-6" />
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic">
                    Registry Data Offline
                </p>
            </Card>
        )
    }

    const stats = initialStats
    const currentTermIndex = getCurrentTermIndex(stats.terms)
    const currentTerm = stats.terms[currentTermIndex]
    const progress = currentTerm
        ? getTermProgress(currentTerm.startDate, currentTerm.endDate)
        : null

    const statTiles: { label: string; value: number; icon: LucideIcon }[] = [
        { label: `${stats.subjectLabel}s`, value: stats.totalSubjects, icon: BookOpen },
        { label: `${stats.yearLabel}s`, value: stats.totalGrades, icon: GraduationCap },
        { label: 'Topics', value: stats.totalTopics, icon: Layers },
    ]

    return (
        <Card className="bg-card border-border rounded-[2rem] overflow-hidden shadow-xl animate-in fade-in duration-500">
            {/* Rule 18: Header with subtle surface lift */}
            <CardHeader className="p-6 md:p-8 border-b border-border bg-surface/50">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                        {/* Rule 19: Item Radius Standardized */}
                        <div className="h-12 w-12 bg-school-primary/10 border border-school-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                            <BookOpen className="h-6 w-6 text-school-primary" />
                        </div>
                        <div className="min-w-0">
                            {/* Rule 11: Header scaling */}
                            <h4 className="text-lg md:text-xl font-extrabold text-foreground uppercase italic tracking-tighter truncate">
                                {stats.name}
                            </h4>
                            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest mt-1">
                                {stats.subjectLabel}s • {stats.termLabel}s • {stats.yearLabel}s
                            </p>
                        </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-bold uppercase tracking-widest px-3 py-1 shrink-0">
                        Active Core
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="p-6 md:p-8 space-y-10">
                {/* Rule 20: Responsive Stat Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                    {statTiles.map((tile) => (
                        <StatTile key={tile.label} {...tile} />
                    ))}
                </div>

                {currentTerm && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase text-muted-foreground tracking-widest ml-1">
                            <Calendar className="h-3.5 w-3.5 text-school-primary" />
                            Live {stats.termLabel} Timeline
                        </div>

                        {/* Rule 18/19: Nested Surface with [2rem] Radius */}
                        <div className="bg-surface border border-border p-6 rounded-[2rem] space-y-6 shadow-inner">
                            <div className="flex justify-between items-center gap-3">
                                <p className="text-sm font-extrabold text-foreground uppercase italic tracking-tight">
                                    {currentTerm.displayName}
                                </p>
                                <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-school-primary/10 text-school-primary rounded-lg">
                                    Progress: {progress ?? 0}%
                                </span>
                            </div>

                            <div className="h-2 w-full bg-background rounded-full overflow-hidden border border-border">
                                <div
                                    className="h-full bg-school-primary transition-all duration-1000 shadow-[0_0_10px_rgba(var(--school-primary-raw),0.2)]"
                                    style={{ width: `${progress ?? 0}%` }}
                                ></div>
                            </div>

                            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <CalendarDays className="h-3.5 w-3.5 text-school-primary shrink-0" />
                                    <span>{formatDate(currentTerm.startDate)}</span>
                                </div>
                                <ArrowRight className="h-3 w-3 opacity-40" />
                                <span>{formatDate(currentTerm.endDate)}</span>
                            </div>

                            {!currentTerm.startDate && (
                                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 italic pt-2">
                                    {stats.termLabel} configuration required in settings
                                </p>
                            )}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

// ── Sub-Components ──────────────────────────────────────────────────────────

interface StatTileProps {
    label: string
    value: number
    icon: LucideIcon
}

function StatTile({ label, value, icon: Icon }: StatTileProps) {
    return (
        <div className="bg-surface border border-border p-6 rounded-[2rem] text-center space-y-2 shadow-inner transition-transform hover:scale-[1.02] duration-300">
            <Icon className="h-4 w-4 mx-auto text-school-primary opacity-70" />
            <p className="text-3xl font-extrabold text-foreground italic tracking-tighter">{value}</p>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-widest">
                {label}
            </p>
        </div>
    )
}