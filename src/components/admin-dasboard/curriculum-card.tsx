// "use client"

// import { useState } from "react"
// import { BookOpen, Calendar, CheckCircle2, ChevronDown, Check } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// // import { Progress } from "@/components/ui/progress"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const curriculumOptions = [
//   {
//     id: "british",
//     name: "British National",
//     description: "National Curriculum of England and Wales",
//     subjects: 24,
//     objectives: 156,
//   },
//   {
//     id: "nigerian",
//     name: "Nigerian National",
//     description: "Federal Ministry of Education Curriculum",
//     subjects: 18,
//     objectives: 132,
//   },
//   {
//     id: "cambridge",
//     name: "Cambridge IGCSE",
//     description: "Cambridge International Examinations",
//     subjects: 22,
//     objectives: 178,
//   },
//   {
//     id: "american",
//     name: "American Common Core",
//     description: "US State Standards Initiative",
//     subjects: 20,
//     objectives: 145,
//   },
// ]

// export function CurriculumCard() {
//   const [selectedCurriculum, setSelectedCurriculum] = useState(curriculumOptions[0])

//   return (
//     <Card className="h-full">
//       <CardHeader className="pb-3">
//         <div className="flex items-center justify-between">
//           <CardTitle className="text-lg font-semibold text-foreground">
//             Curriculum Status
//           </CardTitle>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" size="sm" className="h-8 gap-1 bg-transparent">
//                 <span className="text-xs">Switch</span>
//                 <ChevronDown className="h-3 w-3" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-56">
//               {curriculumOptions.map((curriculum) => (
//                 <DropdownMenuItem
//                   key={curriculum.id}
//                   onClick={() => setSelectedCurriculum(curriculum)}
//                   className="flex items-center justify-between cursor-pointer"
//                 >
//                   <div className="flex flex-col">
//                     <span className="font-medium">{curriculum.name}</span>
//                     <span className="text-xs text-muted-foreground">
//                       {curriculum.subjects} subjects
//                     </span>
//                   </div>
//                   {selectedCurriculum.id === curriculum.id && (
//                     <Check className="h-4 w-4 text-primary" />
//                   )}
//                 </DropdownMenuItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Active Curriculum */}
//         <div className="rounded-lg border border-border bg-muted/30 p-4">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
//               <BookOpen className="h-5 w-5 text-primary" />
//             </div>
//             <div className="flex-1 space-y-1">
//               <div className="flex items-center gap-2">
//                 <h4 className="font-medium text-foreground">{selectedCurriculum.name}</h4>
//                 <Badge className="bg-accent/15 text-accent hover:bg-accent/25 border-0 text-xs">
//                   Active
//                 </Badge>
//               </div>
//               <p className="text-sm text-muted-foreground">
//                 {selectedCurriculum.description}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Current Term */}
//         <div className="space-y-3">
//           <div className="flex items-center gap-2">
//             <Calendar className="h-4 w-4 text-muted-foreground" />
//             <span className="text-sm font-medium text-foreground">Current Term</span>
//           </div>
//           <div className="flex items-center justify-between rounded-lg border border-border p-3">
//             <div>
//               <p className="font-semibold text-foreground">Term 2</p>
//               <p className="text-xs text-muted-foreground">Jan 8 - Apr 12, 2026</p>
//             </div>
//             <Badge variant="secondary" className="text-xs">
//               Week 5 of 14
//             </Badge>
//           </div>
//         </div>

//         {/* Term Progress */}
//         <div className="space-y-3">
//           <div className="flex items-center justify-between text-sm">
//             <span className="text-muted-foreground">Term Progress</span>
//             <span className="font-medium text-foreground">36%</span>
//           </div>
//           {/* <Progress value={36} className="h-2" /> */}
//         </div>

//         {/* Quick Stats */}
//         <div className="grid grid-cols-2 gap-3">
//           <div className="rounded-lg border border-border p-3 text-center">
//             <p className="text-2xl font-bold text-foreground">{selectedCurriculum.subjects}</p>
//             <p className="text-xs text-muted-foreground">Subjects</p>
//           </div>
//           <div className="rounded-lg border border-border p-3 text-center">
//             <p className="text-2xl font-bold text-foreground">{selectedCurriculum.objectives}</p>
//             <p className="text-xs text-muted-foreground">Learning Objectives</p>
//           </div>
//         </div>

//         {/* Curriculum Compliance */}
//         <div className="flex items-center gap-2 rounded-lg bg-accent/10 p-3">
//           <CheckCircle2 className="h-5 w-5 text-accent" />
//           <div>
//             <p className="text-sm font-medium text-foreground">Compliance Status</p>
//             <p className="text-xs text-muted-foreground">
//               All curriculum requirements are being met
//             </p>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   )
// }

// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import {
//     BookOpen, Calendar, CheckCircle2,
//     Loader2, GraduationCap, Layers,
//     CalendarDays, ChevronRight, AlertTriangle
// } from "lucide-react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { useProfileStore } from "@/store/profileStore"
// import { getCurriculumStats, CurriculumStats } from "@/app/actions/curiculum-stats"

// function formatDate(date: Date | null): string {
//     if (!date) return 'Not set'
//     return new Date(date).toLocaleDateString('en-GB', {
//         day: 'numeric', month: 'short', year: 'numeric',
//     })
// }

// function getTermProgress(startDate: Date | null, endDate: Date | null): number | null {
//     if (!startDate || !endDate) return null
//     const now    = new Date().getTime()
//     const start  = new Date(startDate).getTime()
//     const end    = new Date(endDate).getTime()
//     if (now < start) return 0
//     if (now > end)   return 100
//     return Math.round(((now - start) / (end - start)) * 100)
// }

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
//         <Card className="h-full bg-school-secondary-900 border-school-secondary-700">
//             <CardContent className="flex items-center justify-center h-48">
//                 <div className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin text-school-primary" />
//                     <span className="text-xs text-school-secondary-400">
//                         Loading curriculum...
//                     </span>
//                 </div>
//             </CardContent>
//         </Card>
//     )

//     // ── Empty ──────────────────────────────────────────────────────────────
//     if (!stats) return (
//         <Card className="h-full bg-school-secondary-900 border-school-secondary-700">
//             <CardContent className="flex flex-col items-center justify-center h-48 gap-2 text-center p-6">
//                 <BookOpen className="h-8 w-8 text-school-secondary-600" />
//                 <p className="text-sm font-semibold text-white">No curriculum found</p>
//                 <p className="text-xs text-school-secondary-400">
//                     Assign a curriculum to your school to see stats here.
//                 </p>
//             </CardContent>
//         </Card>
//     )
    

//     // ── Current term by date ───────────────────────────────────────────────
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
//         <Card className="h-full bg-school-secondary-900 border-school-secondary-700">

//             {/* ── Header ── */}
//             <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-5">
//                 <div className="flex items-center justify-between gap-2">
//                     <CardTitle className="text-sm sm:text-base font-bold text-white">
//                         Curriculum Status
//                     </CardTitle>
//                     <Badge className="bg-school-primary/20 text-school-primary border border-school-primary/30 text-[10px] font-semibold shrink-0">
//                         Active
//                     </Badge>
//                 </div>
//             </CardHeader>

//             <CardContent className="p-4 sm:p-5 space-y-4">

//                 {/* ── Active Curriculum ── */}
//                 <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <BookOpen className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div className="flex-1 min-w-0">
//                             <h4 className="text-sm font-bold text-white truncate">
//                                 {stats.name}
//                             </h4>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 {stats.subjectLabel}s · {stats.termLabel}s · {stats.yearLabel}s
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* ── Quick Stats ── */}
//                 <div className="grid grid-cols-3 gap-2">
//                     {[
//                         { label: stats.subjectLabel + 's', value: stats.totalSubjects, icon: BookOpen },
//                         { label: stats.yearLabel + 's',    value: stats.totalGrades,   icon: GraduationCap },
//                         { label: 'Topics',                 value: stats.totalTopics,   icon: Layers },
//                     ].map(card => (
//                         <div
//                             key={card.label}
//                             className="rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 p-2 sm:p-2.5 text-center"
//                         >
//                             <card.icon className="h-3.5 w-3.5 text-school-primary mx-auto mb-1" />
//                             <p className="text-base sm:text-lg font-black text-white leading-none">
//                                 {card.value}
//                             </p>
//                             <p className="text-[9px] sm:text-[10px] text-school-secondary-400 mt-0.5 truncate">
//                                 {card.label}
//                             </p>
//                         </div>
//                     ))}
//                 </div>

//                 {/* ── Current Term ── */}
//                 {currentTerm && (
//                     <div className="space-y-2">
//                         <div className="flex items-center gap-1.5">
//                             <Calendar className="h-3.5 w-3.5 text-school-secondary-400" />
//                             <span className="text-[10px] font-semibold text-school-secondary-400 uppercase tracking-wider">
//                                 Current {stats.termLabel}
//                             </span>
//                         </div>
//                         <div className="rounded-xl border border-school-primary/30 bg-school-primary/10 p-3 space-y-2">
//                             <div className="flex items-center justify-between gap-2">
//                                 <p className="text-sm font-bold text-white">
//                                     {currentTerm.displayName}
//                                 </p>
//                                 <span className="text-[10px] font-semibold text-school-primary shrink-0">
//                                     {stats.termLabel} {currentTerm.index + 1}/{stats.terms.length}
//                                 </span>
//                             </div>
//                             // In CurriculumCard — replace the warning
// {!currentTerm.startDate && (
//     <Link
//         href="/admin/settings?tab=terms"
//         className="inline-flex items-center gap-1 text-[10px] text-amber-400 hover:text-amber-300 hover:underline transition-colors"
//     >
//         <AlertTriangle className="h-3 w-3" />
//         Term dates not set — configure in Settings
//         <ChevronRight className="h-3 w-3" />
//     </Link>
// )}

//                             {/* Dates */}
//                             <div className="flex items-center gap-1.5 text-[11px] text-school-secondary-300">
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
//                                         <span className="text-[10px] text-school-secondary-400">
//                                             Progress
//                                         </span>
//                                         <span className="text-[10px] font-semibold text-school-primary">
//                                             {progress}%
//                                         </span>
//                                     </div>
//                                     <div className="h-1.5 w-full rounded-full bg-school-secondary-700">
//                                         <div
//                                             className="h-1.5 rounded-full bg-school-primary transition-all duration-500"
//                                             style={{ width: `${progress}%` }}
//                                         />
//                                     </div>
//                                 </div>
//                             )}

//                             {/* No dates set hint */}
//                             {!currentTerm.startDate && (
//                                 <p className="text-[10px] text-amber-400">
//                                     ⚠ Term dates not set — configure in school settings
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                 )}

//                 {/* ── All Terms ── */}
//                 {stats.terms.length > 0 && (
//                     <div className="space-y-1.5">
//                         <p className="text-[10px] font-semibold text-school-secondary-400 uppercase tracking-wider">
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
//                                                 : isPast
//                                                 ? 'border-school-secondary-700 bg-school-secondary-800/30 opacity-60'
//                                                 : 'border-school-secondary-700 bg-school-secondary-800/30'
//                                         }`}
//                                     >
//                                         <div className="flex items-center gap-2 min-w-0">
//                                             <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
//                                                 isCurrent ? 'bg-school-primary' :
//                                                 isPast    ? 'bg-school-secondary-500' :
//                                                             'bg-school-secondary-600'
//                                             }`} />
//                                             <span className={`text-xs font-medium truncate ${
//                                                 isCurrent ? 'text-school-primary' : 'text-school-secondary-300'
//                                             }`}>
//                                                 {term.displayName}
//                                             </span>
//                                         </div>
//                                         <div className="flex items-center gap-2 shrink-0">
//                                             {term.startDate && (
//                                                 <span className="hidden sm:block text-[10px] text-school-secondary-500">
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
//                                             {isCurrent && (
//                                                 <span className="text-[9px] sm:text-[10px] font-semibold text-school-primary">
//                                                     Current
//                                                 </span>
//                                             )}
//                                             {!isCurrent && (
//                                                 <ChevronRight className="h-3 w-3 text-school-secondary-600" />
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
//                         <p className="text-xs font-semibold text-white">
//                             Compliance Status
//                         </p>
//                         <p className="text-[11px] text-school-secondary-300 mt-0.5">
//                             All curriculum requirements are being met
//                         </p>
//                     </div>
//                 </div>

//             </CardContent>
//         </Card>
//     )
// }


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
        <Card className="h-full bg-gray-50 border-gray-200">

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