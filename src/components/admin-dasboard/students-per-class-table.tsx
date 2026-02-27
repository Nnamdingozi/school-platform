"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useProfileStore } from "@/store/profileStore"
import { Layers, Users, ArrowRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export function StudentsPerClassTable() {
    const { profile } = useProfileStore()

    const classRows = useMemo(() => {
        if (!profile?.school) return []

        const s = profile.school
        const classes = s.classes ?? []
        const enrollments = s.classEnrollments ?? []

        return classes
            .map((cls) => {
                // Count enrollments belonging to this class
                const studentCount = enrollments.filter(
                    (e: any) => e.classId === cls.id
                ).length

                // Find teacher name from profile relations
                const teacher = profile.school?.classes?.find(
                    (c) => c.teacherId === cls.teacherId
                )

                return {
                    id: cls.id,
                    name: cls.name,
                    teacherId: cls.teacherId,
                    studentCount,
                }
            })
            .sort((a, b) => b.studentCount - a.studentCount) // highest first
    }, [profile])

    const totalStudents = classRows.reduce((sum, c) => sum + c.studentCount, 0)
    const isEmpty = classRows.length === 0

    return (
        <Card className="bg-school-secondary-900 border-school-secondary-700 relative overflow-hidden">
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary/30 to-transparent" />

            <CardHeader className="pb-3 border-b border-school-secondary-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-school-primary/10 border border-school-primary/20">
                            <Layers className="h-4 w-4 text-school-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-school-secondary-100">
                                Students Per Class
                            </CardTitle>
                            {!isEmpty && (
                                <p className="text-[11px] text-school-secondary-100/40 mt-0.5">
                                    {classRows.length} classes · {totalStudents} students total
                                </p>
                            )}
                        </div>
                    </div>
                    <Link
                        href="/admin/classes"
                        className="text-[11px] text-school-primary hover:text-school-primary/80 font-semibold flex items-center gap-1 transition-colors"
                    >
                        View all
                        <ArrowRight className="h-3 w-3" />
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {isEmpty ? (
                    /* ── Empty State ──────────────────────────────────────── */
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-secondary-800 border border-school-secondary-700">
                            <Layers className="h-7 w-7 text-school-secondary-100/20" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-school-secondary-100/50">
                                No classes created yet
                            </p>
                            <p className="text-xs text-school-secondary-100/30 max-w-xs leading-relaxed">
                                Once you create classes and assign teachers, each class will appear here with a live student count.
                            </p>
                        </div>
                        <Link
                            href="/admin/classes"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-school-primary border border-school-primary/30 rounded-lg px-4 py-2 hover:bg-school-primary/10 transition-colors"
                        >
                            <Layers className="h-3.5 w-3.5" />
                            Create First Class
                        </Link>
                    </div>
                ) : (
                    /* ── Table ────────────────────────────────────────────── */
                    <div className="divide-y divide-school-secondary-700/50">
                        {/* Header row */}
                        <div className="grid grid-cols-12 px-4 py-2">
                            <p className="col-span-6 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30">
                                Class
                            </p>
                            <p className="col-span-4 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30">
                                Students
                            </p>
                            <p className="col-span-2 text-[10px] font-bold uppercase tracking-widest text-school-secondary-100/30 text-right">
                                Status
                            </p>
                        </div>

                        {classRows.map((cls, index) => {
                            const isFull = cls.studentCount >= 40  // arbitrary threshold
                            const isEmpty = cls.studentCount === 0
                            const barWidth = totalStudents > 0
                                ? Math.max((cls.studentCount / totalStudents) * 100, 2)
                                : 0

                            return (
                                <div
                                    key={cls.id}
                                    className="grid grid-cols-12 items-center px-4 py-3 hover:bg-school-secondary-800/50 transition-colors group"
                                >
                                    {/* Class name + rank */}
                                    <div className="col-span-6 flex items-center gap-2.5 min-w-0">
                                        <span className="text-[10px] font-black text-school-secondary-100/20 w-4 shrink-0">
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold text-school-secondary-100 truncate">
                                                {cls.name}
                                            </p>
                                            {isEmpty && (
                                                <p className="text-[10px] text-school-secondary-100/30 italic">
                                                    No students enrolled
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Student count + bar */}
                                    <div className="col-span-4 space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <Users className="h-3 w-3 text-school-secondary-100/30 shrink-0" />
                                            <span className="text-sm font-bold text-school-secondary-100">
                                                {cls.studentCount}
                                            </span>
                                        </div>
                                        {/* Mini bar */}
                                        <div className="h-1 w-full rounded-full bg-school-secondary-700 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-school-primary transition-all duration-500"
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Status badge */}
                                    <div className="col-span-2 flex justify-end">
                                        {isEmpty ? (
                                            <Badge className="text-[9px] bg-school-secondary-700 text-school-secondary-100/40 border-0 px-1.5 py-0.5">
                                                Empty
                                            </Badge>
                                        ) : isFull ? (
                                            <Badge className="text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 px-1.5 py-0.5">
                                                Full
                                            </Badge>
                                        ) : (
                                            <Badge className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-1.5 py-0.5">
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Summary footer */}
                        <div className="grid grid-cols-12 items-center px-4 py-3 bg-school-secondary-800/30">
                            <div className="col-span-6 flex items-center gap-2.5">
                                <span className="w-4 shrink-0" />
                                <p className="text-xs font-bold text-school-secondary-100/50">
                                    Total
                                </p>
                            </div>
                            <div className="col-span-4 flex items-center gap-2">
                                <Users className="h-3 w-3 text-school-primary/50 shrink-0" />
                                <span className="text-sm font-black text-school-primary">
                                    {totalStudents}
                                </span>
                            </div>
                            <div className="col-span-2 flex justify-end">
                                <span className="text-[10px] text-school-secondary-100/30">
                                    {classRows.length} classes
                                </span>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
