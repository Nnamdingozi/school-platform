"use client"

import { useState, useEffect } from "react"
import {
    Users, GraduationCap, ClipboardCheck, User,
    TrendingUp, TrendingDown, Minus, ArrowRight,
    Loader2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useProfileStore } from "@/store/profileStore"
import { getDashboardStats, DashboardStats } from "@/app/actions/dashboard-stats"
import { useRouter } from "next/navigation"

type LoadState = 'loading' | 'done' | 'error'

interface StatCard {
    title:                string
    value:                string | null
    icon:                 React.ElementType
    trend:                string | null
    href:                 string
    emptyHeadline:        string
    emptyBody:            string
    emptyAction:          string
    populatedDescription: string
}

export function StatsCards() {
    const router           = useRouter()
    const { profile }      = useProfileStore()
    const schoolId         = profile?.schoolId ?? ''

    const [stats,        setStats]        = useState<DashboardStats | null>(null)
    const [loadState,    setLoadState]    = useState<LoadState>('loading')
    const [navigatingTo, setNavigatingTo] = useState<string | null>(null)

    useEffect(() => {
        if (!schoolId) return
        setLoadState('loading')
        getDashboardStats(schoolId)
            .then(data => {
                setStats(data)
                setLoadState('done')
            })
            .catch(() => setLoadState('error'))
    }, [schoolId])

    function handleCardClick(href: string) {
        if (navigatingTo) return   // prevent double click
        setNavigatingTo(href)
        router.push(href)
    }

    // ── Loading skeleton ───────────────────────────────────────────────
    if (!profile || loadState === 'loading') {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
                        <CardContent className="p-5 sm:p-6">
                            <div className="animate-pulse space-y-3">
                                <div className="h-3 w-24 rounded bg-school-secondary-700" />
                                <div className="h-8 w-16 rounded bg-school-secondary-700" />
                                <div className="h-3 w-32 rounded bg-school-secondary-700" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // ── Error ──────────────────────────────────────────────────────────
    if (loadState === 'error' || !stats) {
        return (
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <Card key={i} className="bg-school-secondary-900 border-school-secondary-700">
                        <CardContent className="p-5 sm:p-6 flex items-center justify-center h-24">
                            <p className="text-xs text-school-secondary-300">Failed to load</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    // ── Stat definitions ───────────────────────────────────────────────
    const statCards: StatCard[] = [
        {
            title:                "Total Students",
            value:                stats.totalStudents > 0
                                    ? stats.totalStudents.toLocaleString()
                                    : null,
            icon:                 Users,
            trend:                stats.totalStudents > 0 ? "up" : null,
            href:                 stats.totalStudents > 0
                                    ? "/admin/studentView"
                                    : "/admin/invite-users",
            emptyHeadline:        "No students registered yet",
            emptyBody:            "Invite students to your school. They will appear here once registered.",
            emptyAction:          "Invite Students",
            populatedDescription: "registered students",
        },
        {
            title:                "Active Teachers",
            value:                stats.activeTeachers > 0
                                    ? stats.activeTeachers.toLocaleString()
                                    : null,
            icon:                 GraduationCap,
            trend:                stats.activeTeachers > 0 ? "up" : null,
            href:                 stats.activeTeachers > 0
                                    ? "/admin/teacherView"
                                    : "/admin/invite-users",
            emptyHeadline:        "No teachers registered yet",
            emptyBody:            "Invite teachers to your school. They will appear here once registered.",
            emptyAction:          "Add Teachers",
            populatedDescription: "registered teachers",
        },
        {
            title:                "Total Parents",
            value:                stats.totalParents > 0
                                    ? stats.totalParents.toLocaleString()
                                    : null,
            icon:                 User,
            trend:                stats.totalParents > 0 ? "up" : null,
            href:                 stats.totalParents > 0
                                    ? "/admin/parentView"
                                    : "/admin/invite-users",
            emptyHeadline:        "No parents registered yet",
            emptyBody:            "Invite parents to your school. They will appear here once registered.",
            emptyAction:          "Invite Parents",
            populatedDescription: "registered parents",
        },
        {
            title:                "Assessment Completion",
            value:                stats.completionRate !== null
                                    ? `${stats.completionRate}%`
                                    : null,
            icon:                 ClipboardCheck,
            trend:                stats.completionRate !== null
                                    ? stats.completionRate >= 80 ? "up"
                                    : stats.completionRate >= 50 ? "neutral"
                                    : "down"
                                    : null,
            href:                 "/admin/assessments",
            emptyHeadline:        "No assessments recorded",
            emptyBody:            "Once teachers start grading students, completion rates will appear here.",
            emptyAction:          "View Assessments",
            populatedDescription: `${stats.completedAssessments} of ${stats.totalAssessments} graded`,
        },
    ]

    // ── Render ─────────────────────────────────────────────────────────
    return (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
            {statCards.map((stat) => {
                const Icon        = stat.icon
                const isEmpty     = stat.value === null
                const isNavigating = navigatingTo === stat.href

                return (
                    <Card
                        key={stat.title}
                        onClick={() => handleCardClick(stat.href)}
                        className={`relative overflow-hidden bg-school-secondary-900 border-school-secondary-700
                            transition-all duration-200 group
                            ${navigatingTo
                                ? 'cursor-not-allowed'
                                : 'cursor-pointer hover:border-school-primary hover:bg-school-secondary-800/60'
                            }
                            ${isNavigating ? 'border-school-primary/60 scale-[0.99]' : ''}
                        `}
                    >
                        {/* Top glow edge */}
                        <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-school-primary to-transparent transition-opacity
                            ${isNavigating ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}
                        `} />

                        {/* ── Navigation overlay ── */}
                        {isNavigating && (
                            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-school-secondary-900/80 backdrop-blur-sm rounded-[inherit]">
                                <Loader2 className="h-6 w-6 text-school-primary animate-spin" />
                                <p className="text-[11px] font-semibold text-school-primary">
                                    Loading...
                                </p>
                            </div>
                        )}

                        {/* ── Blur overlay for other cards while one is navigating ── */}
                        {navigatingTo && !isNavigating && (
                            <div className="absolute inset-0 z-10 bg-school-secondary-900/50 backdrop-blur-[1px] rounded-[inherit]" />
                        )}

                        <CardContent className="p-5 sm:p-6">
                            {isEmpty ? (
                                /* ── Empty State ──────────────────────── */
                                <div className="space-y-3">

                                    {/* Title + icon */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-school-secondary-300">
                                            {stat.title}
                                        </p>
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-school-secondary-800 border border-school-secondary-700 group-hover:border-school-primary/40 transition-colors">
                                            <Icon className="h-4 w-4 text-school-secondary-100" />
                                        </div>
                                    </div>

                                    {/* Zero value */}
                                    <p className="text-3xl font-black text-school-secondary-300 tracking-tight">
                                        0
                                    </p>

                                    {/* Guidance */}
                                    <div className="space-y-1 border-t border-school-secondary-700 pt-3">
                                        <p className="text-xs font-semibold text-school-secondary-200">
                                            {stat.emptyHeadline}
                                        </p>
                                        <p className="text-[11px] text-school-secondary-300/70 leading-relaxed">
                                            {stat.emptyBody}
                                        </p>
                                    </div>

                                    {/* CTA */}
                                    <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-school-primary">
                                        {stat.emptyAction}
                                        <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                    </div>

                                </div>
                            ) : (
                                /* ── Populated State ──────────────────── */
                                <div className="flex items-start justify-between gap-4">

                                    <div className="space-y-2 min-w-0 flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-school-secondary-300">
                                            {stat.title}
                                        </p>

                                        <h3 className="text-2xl sm:text-3xl font-black text-school-secondary-200 tracking-tight leading-none">
                                            {stat.value}
                                        </h3>

                                        <div className="flex items-center gap-1.5 flex-wrap">
                                            {stat.trend === "up"      && <TrendingUp  className="h-3 w-3 text-green-500 shrink-0" />}
                                            {stat.trend === "down"    && <TrendingDown className="h-3 w-3 text-red-500 shrink-0" />}
                                            {stat.trend === "neutral" && <Minus        className="h-3 w-3 text-amber-500 shrink-0" />}
                                            <span className="text-xs text-school-secondary-200 leading-relaxed">
                                                {stat.populatedDescription}
                                            </span>
                                        </div>

                                        {/* View hint */}
                                        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-school-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                            View all
                                            <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </div>

                                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-school-primary/10 border border-school-primary/20 group-hover:bg-school-primary/20 transition-colors">
                                        <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-school-primary" />
                                    </div>

                                </div>
                            )}
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}