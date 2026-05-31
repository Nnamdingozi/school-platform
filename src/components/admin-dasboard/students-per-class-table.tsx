
// "use client"

// import { useMemo } from "react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { useProfileStore } from "@/store/profileStore"
// import { Layers, Users, ArrowRight } from "lucide-react" // ✅ FIX 1: Removed unused 'GraduationCap'
// import Link from "next/link"
// import { Badge } from "@/components/ui/badge"

// export function StudentsPerClassTable() {
//     const { profile } = useProfileStore()

//     const classRows = useMemo(() => {
//         if (!profile?.school) return []

//         const s = profile.school
//         const classes = s.classes ?? []
//         const enrollments = s.classEnrollments ?? []

//         return classes
//             .map((cls) => {
//                 // ✅ FIX 2: Typed 'e' as an object with classId to avoid 'any'
//                 const studentCount = enrollments.filter(
//                     (e: { classId: string | null }) => e.classId === cls.id
//                 ).length

//                 // ✅ FIX 3: Removed the unused 'teacher' variable lookup logic

//                 return {
//                     id: cls.id,
//                     name: cls.name,
//                     teacherId: cls.teacherId,
//                     studentCount,
//                 }
//             })
//             .sort((a, b) => b.studentCount - a.studentCount) // highest first
//     }, [profile])

//     const totalStudents = classRows.reduce((sum, c) => sum + c.studentCount, 0)
//     const isEmpty = classRows.length === 0

//     return (
//         <Card className="bg-school-secondary-900 border-school-secondary-700 relative overflow-hidden">
//             {/* Top glow */}
//             <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary/30 to-transparent" />

//             <CardHeader className="pb-3 border-b border-school-secondary-700">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-2">
//                         <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-school-primary/10 border border-school-primary/20">
//                             <Layers className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-school-secondary-100">
//                                 Students Per Class
//                             </CardTitle>
//                             {!isEmpty && (
//                                 <p className="text-[11px] text-school-secondary-100/40 mt-0.5">
//                                     {classRows.length} classes · {totalStudents} students total
//                                 </p>
//                             )}
//                         </div>
//                     </div>
//                     <Link
//                         href="/admin/classes"
//                         className="text-[11px] text-school-primary hover:text-school-primary/80 font-semibold flex items-center gap-1 transition-colors"
//                     >
//                         View all
//                         <ArrowRight className="h-3 w-3" />
//                     </Link>
//                 </div>
//             </CardHeader>

//             <CardContent className="p-0">
//                 {isEmpty ? (
//                     <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3">
//                         <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-secondary-800 border border-school-secondary-700">
//                             <Layers className="h-7 w-7 text-school-secondary-100/20" />
//                         </div>
//                         <div className="space-y-1">
//                             <p className="text-sm font-semibold text-school-secondary-100/50">
//                                 No classes created yet
//                             </p>
//                             <p className="text-xs text-school-secondary-100/30 max-w-xs leading-relaxed">
//                                 Once you create classes and assign teachers, each class will appear here with a live student count.
//                             </p>
//                         </div>
//                         <Link
//                             href="/admin/classes"
//                             className="inline-flex items-center gap-1.5 text-xs font-bold text-school-primary border border-school-primary/30 rounded-lg px-4 py-2 hover:bg-school-primary/10 transition-colors"
//                         >
//                             <Layers className="h-3.5 w-3.5" />
//                             Create First Class
//                         </Link>
//                     </div>
//                 ) : (
//                     <div className="divide-y divide-school-secondary-700/50">
//                         <div className="grid grid-cols-12 px-4 py-2">
//                             <p className="col-span-6 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30">
//                                 Class
//                             </p>
//                             <p className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30">
//                                 Students
//                             </p>
//                             <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30 text-right">
//                                 Status
//                             </p>
//                         </div>

//                         {classRows.map((cls, index) => {
//                             const isFull = cls.studentCount >= 40  
//                             const isClassEmpty = cls.studentCount === 0
//                             const barWidth = totalStudents > 0
//                                 ? Math.max((cls.studentCount / totalStudents) * 100, 2)
//                                 : 0

//                             return (
//                                 <div
//                                     key={cls.id}
//                                     className="grid grid-cols-12 items-center px-4 py-3 hover:bg-school-secondary-800/50 transition-colors group"
//                                 >
//                                     <div className="col-span-6 flex items-center gap-2.5 min-w-0">
//                                         <span className="text-[10px] font-black text-school-secondary-100/20 w-4 shrink-0">
//                                             {index + 1}
//                                         </span>
//                                         <div className="min-w-0">
//                                             <p className="text-sm font-semibold text-school-secondary-100 truncate">
//                                                 {cls.name}
//                                             </p>
//                                             {isClassEmpty && (
//                                                 <p className="text-[10px] text-school-secondary-100/30 italic">
//                                                     No students enrolled
//                                                 </p>
//                                             )}
//                                         </div>
//                                     </div>

//                                     <div className="col-span-4 space-y-1.5">
//                                         <div className="flex items-center gap-2">
//                                             <Users className="h-3 w-3 text-school-secondary-100/30 shrink-0" />
//                                             <span className="text-sm font-bold text-school-secondary-100">
//                                                 {cls.studentCount}
//                                             </span>
//                                         </div>
//                                         <div className="h-1 w-full rounded-full bg-school-secondary-700 overflow-hidden">
//                                             <div
//                                                 className="h-full rounded-full bg-school-primary transition-all duration-500"
//                                                 style={{ width: `${barWidth}%` }}
//                                             />
//                                         </div>
//                                     </div>

//                                     <div className="col-span-2 flex justify-end">
//                                         {isClassEmpty ? (
//                                             <Badge className="text-[9px] bg-school-secondary-700 text-school-secondary-100/40 border-0 px-1.5 py-0.5">
//                                                 Empty
//                                             </Badge>
//                                         ) : isFull ? (
//                                             <Badge className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5">
//                                                 Full
//                                             </Badge>
//                                         ) : (
//                                             <Badge className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5">
//                                                 Active
//                                             </Badge>
//                                         )}
//                                     </div>
//                                 </div>
//                             )
//                         })}

//                         <div className="grid grid-cols-12 items-center px-4 py-3 bg-school-secondary-800/30">
//                             <div className="col-span-6 flex items-center gap-2.5">
//                                 <span className="w-4 shrink-0" />
//                                 <p className="text-xs font-bold text-school-secondary-100/50">
//                                     Total
//                                 </p>
//                             </div>
//                             <div className="col-span-4 flex items-center gap-2">
//                                 <Users className="h-3 w-3 text-school-primary/50 shrink-0" />
//                                 <span className="text-sm font-black text-school-primary">
//                                     {totalStudents}
//                                 </span>
//                             </div>
//                             <div className="col-span-2 flex justify-end">
//                                 <span className="text-[10px] text-school-secondary-100/30">
//                                     {classRows.length} classes
//                                 </span>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     )
// }





"use client"

import React, { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfileStore } from "@/store/profileStore"
import { Layers, Users, ArrowRight, Activity, Plus } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"


/**
 * CLASSROOM DISTRIBUTION LEDGER (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-card, bg-surface, border-border).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function StudentsPerClassTable() {
    const { profile } = useProfileStore()

    const classRows = useMemo(() => {
        if (!profile?.school) return []

        const s = profile.school
        const classes = s.classes ?? []
        const enrollments = s.classEnrollments ?? []

        return classes
            .map((cls) => {
                // Rule 15: Strict filter typing to avoid 'any'
                const studentCount = enrollments.filter(
                    (e: { classId: string | null }) => e.classId === cls.id
                ).length

                return {
                    id: cls.id,
                    name: cls.name,
                    teacherId: cls.teacherId,
                    studentCount,
                }
            })
            .sort((a, b) => b.studentCount - a.studentCount) // Highest density first
    }, [profile])

    const totalStudents = classRows.reduce((sum, c) => sum + c.studentCount, 0)
    const isEmpty = classRows.length === 0

    return (
        <Card className="bg-card border-border rounded-[2rem] relative overflow-hidden shadow-xl animate-in fade-in duration-700">
            {/* Rule 21: Scale Protocol Top Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-school-primary-100" />

            <CardHeader className="pb-4 border-b border-border bg-surface/30">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {/* Rule 19: Inner item radius 2xl */}
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-school-primary-50 border border-school-primary-200 transition-colors">
                            <Layers className="h-5 w-5 text-school-primary" />
                        </div>
                        <div>
                            {/* Rule 11: Registry Header Typography */}
                            <CardTitle className="text-base font-extrabold text-foreground uppercase italic tracking-tighter">
                                Registry Density
                            </CardTitle>
                            {!isEmpty && (
                                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-0.5">
                                    {classRows.length} Nodes · {totalStudents} Identities
                                </p>
                            )}
                        </div>
                    </div>
                    <Link
                        href="/admin/classes"
                        className="text-[10px] font-bold text-school-primary hover:opacity-80 uppercase tracking-widest flex items-center gap-1.5 transition-all"
                    >
                        Audit All
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isEmpty ? (
                    /* ── EMPTY STATE (Rule 18/19) ── */
                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-6">
                        <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-surface border border-border shadow-inner">
                            <Activity className="h-8 w-8 text-muted-foreground/20" />
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-foreground uppercase tracking-tight">
                                Registry Empty
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest max-w-[240px] leading-relaxed italic">
                                Initialize classroom nodes to monitor distribution telemetry.
                            </p>
                        </div>
                        <Link
                            href="/admin/classes"
                            className="inline-flex items-center gap-2 text-[10px] font-extrabold text-on-school-primary bg-school-primary rounded-xl px-6 py-3 hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-school-primary-200"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Create First Node
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {/* ── TABLE HEAD ── */}
                        <div className="grid grid-cols-12 px-6 py-3 bg-surface/50">
                            <p className="col-span-6 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Class Node
                            </p>
                            <p className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                                Volume
                            </p>
                            <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 text-right">
                                Status
                            </p>
                        </div>

                        {/* ── TABLE BODY ── */}
                        <div className="custom-scrollbar max-h-[420px] overflow-y-auto">
                            {classRows.map((cls, index) => {
                                const isFull = cls.studentCount >= 40  
                                const isClassEmpty = cls.studentCount === 0
                                const barWidth = totalStudents > 0
                                    ? Math.max((cls.studentCount / totalStudents) * 100, 2)
                                    : 0

                                return (
                                    <div
                                        key={cls.id}
                                        className="grid grid-cols-12 items-center px-6 py-4 hover:bg-muted/30 transition-colors group"
                                    >
                                        <div className="col-span-6 flex items-center gap-3 min-w-0">
                                            <span className="text-[10px] font-extrabold text-muted-foreground/30 w-5 shrink-0 tabular-nums">
                                                {String(index + 1).padStart(2, '0')}
                                            </span>
                                            <div className="min-w-0">
                                                <p className="text-sm font-bold text-foreground uppercase italic tracking-tight truncate">
                                                    {cls.name}
                                                </p>
                                                {isClassEmpty && (
                                                    <p className="text-[9px] text-destructive/60 font-semibold uppercase tracking-widest mt-0.5">
                                                        Awaiting Enrollment
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-span-4 pr-6 space-y-2">
                                            <div className="flex items-center gap-2">
                                                <Users className="h-3.5 w-3.5 text-school-primary opacity-60 shrink-0" />
                                                <span className="text-xs font-extrabold text-foreground tabular-nums">
                                                    {cls.studentCount}
                                                </span>
                                            </div>
                                            {/* Rule 21: Track Scale */}
                                            <div className="h-1.5 w-full rounded-full bg-surface border border-border overflow-hidden">
                                                <div
                                                    className="h-full rounded-full bg-school-primary transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(var(--school-primary-raw),0.2)]"
                                                    style={{ width: `${barWidth}%` }}
                                                />
                                            </div>
                                        </div>

                                        <div className="col-span-2 flex justify-end">
                                            {isClassEmpty ? (
                                                <Badge variant="outline" className="text-[8px] font-bold border-border bg-surface text-muted-foreground uppercase px-2 py-0">
                                                    Idle
                                                </Badge>
                                            ) : isFull ? (
                                                <Badge className="text-[8px] font-bold bg-destructive/10 text-destructive border-destructive/20 uppercase px-2 py-0">
                                                    Capacity
                                                </Badge>
                                            ) : (
                                                <Badge className="text-[8px] font-bold bg-emerald-50 text-emerald-600 border-emerald-200 uppercase px-2 py-0">
                                                    Optimal
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* ── FOOTER SUMMARY (Rule 18/11) ── */}
                        <div className="grid grid-cols-12 items-center px-6 py-5 bg-surface/50 border-t border-border">
                            <div className="col-span-6">
                                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-[0.2em]">
                                    Institutional Aggregate
                                </p>
                            </div>
                            <div className="col-span-4 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-school-primary" />
                                <span className="text-sm font-extrabold text-foreground italic tracking-tighter">
                                    {totalStudents} <span className="text-[10px] font-normal not-italic text-muted-foreground ml-1">Synced</span>
                                </span>
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <span className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">
                                    {classRows.length} Nodes
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}