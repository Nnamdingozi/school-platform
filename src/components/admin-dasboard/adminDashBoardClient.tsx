// "use client"

// import { useState, useEffect } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2 } from "lucide-react"
// import { StatsCards } from "@/components/admin-dasboard/stats-cards"
// import { StudentsTable } from "@/components/admin-dasboard/students-table"
// import { CurriculumCard } from "@/components/admin-dasboard/curriculum/curriculum-card"
// import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
// import { StudentsPerClassTable } from "@/components/admin-dasboard/students-per-class-table"
// import { Header } from "@/components/admin-dasboard/header"
// import { ParentChildLinker } from "@/components/admin-dasboard/parent/parent-child-linker"
// import {
//     GradeDistributionChart,
//     AssessmentScoresChart,
//     StatusDistributionChart,
// } from "@/components/admin-dasboard/analytics/analytics-charts"
// import { UnassignedStudentsAlert } from "@/components/admin-dasboard/analytics/unassigned-students-alert"
// import {
//     type AnalyticsData,
//     type UnassignedStudentsData,
// } from "@/app/actions/analytics.action"

// interface AdminDashboardClientProps {
//     analyticsData:    AnalyticsData | null
//     unassignedData:   UnassignedStudentsData | null
//     userCount:        number
//     whatsappCredits:  number
// }

// export function AdminDashboardClient({
//     analyticsData,
//     unassignedData,
//     userCount,
//     whatsappCredits,
// }: AdminDashboardClientProps) {
//     const { profile, isLoading: isProfileLoading } = useProfileStore()
//     const [isMounted, setIsMounted] = useState(false)

//     useEffect(() => {
//         setIsMounted(true)
//     }, [])

//     if (!isMounted || isProfileLoading || !profile) {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-background">
//                 <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//                 <p className="text-muted-foreground animate-pulse">Loading workspace...</p>
//             </div>
//         )
//     }

//     return (
//         <div className="min-h-screen bg-background">
//             <main className="p-4 md:p-6 lg:p-8">
//                 <div className="mx-auto max-w-7xl space-y-6">

//                     <Header />

//                     <StatsCards />

//                     {/* Charts Grid — data flows from server via props */}
//                     <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//                         <GradeDistributionChart
//                             data={analyticsData?.gradeDistribution ?? []}
//                         />
//                         <AssessmentScoresChart
//                             data={analyticsData?.assessmentScores ?? []}
//                         />
//                         <StatusDistributionChart
//                             data={analyticsData?.statusDistribution ?? []}
//                         />
//                         <div className="md:col-span-2 xl:col-span-3">
//                             <UnassignedStudentsAlert initialData={unassignedData} />
//                         </div>
//                     </div>

//                     {/* Main Content Layout */}
//                     <div className="grid gap-6 xl:grid-cols-3">

//                         {/* LEFT COLUMN */}
//                         <div className="xl:col-span-2 space-y-6">
//                             <StudentsTable />
//                             <CurriculumCard />
//                             <ParentChildLinker />
//                         </div>

//                         {/* RIGHT COLUMN */}
//                         <div className="space-y-6 xl:col-span-1">
//                             <StudentsPerClassTable />
//                             <ActivityFeed />
//                         </div>

//                     </div>
//                 </div>
//             </main>
//         </div>
//     )
// }


"use client"

import React, { useState, useEffect } from "react"
import { useProfileStore } from "@/store/profileStore"
import { 
    Loader2, 
    ShieldCheck, 
    Users, 
    Zap, 
    MessageSquare, 
    Database,
    Activity
} from "lucide-react"
import { StatsCards } from "@/components/admin-dasboard/stats-cards"
import { StudentsTable } from "@/components/admin-dasboard/students-table"
import { CurriculumCard } from "@/components/admin-dasboard/curriculum/curriculum-card"
import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
import { StudentsPerClassTable } from "@/components/admin-dasboard/students-per-class-table"
import { Header } from "@/components/admin-dasboard/header"
import { ParentChildLinker } from "@/components/admin-dasboard/parent/parent-child-linker"
import {
    GradeDistributionChart,
    AssessmentScoresChart,
    StatusDistributionChart,
} from "@/components/admin-dasboard/analytics/analytics-charts"
import { UnassignedStudentsAlert } from "@/components/admin-dasboard/analytics/unassigned-students-alert"
import {
    type AnalyticsData,
    type UnassignedStudentsData,
} from "@/app/actions/analytics.action"
import { cn } from "@/lib/utils"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface AdminDashboardClientProps {
    analyticsData:    AnalyticsData | null
    unassignedData:   UnassignedStudentsData | null
    userCount:        number
    whatsappCredits:  number
}

/**
 * INSTITUTIONAL COMMAND HUB (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, border-border).
 * Rule 19: Standardized Geometry [2rem] for layout modules.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function AdminDashboardClient({
    analyticsData,
    unassignedData,
    userCount,
    whatsappCredits,
}: AdminDashboardClientProps) {
    const { profile, isLoading: isProfileLoading } = useProfileStore()
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    if (!isMounted || isProfileLoading || !profile) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background animate-in fade-in duration-500">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
                    <div className="absolute inset-0 blur-2xl bg-school-primary-50 -z-10" />
                </div>
                <p className="mt-6 text-muted-foreground font-extrabold uppercase italic text-[11px] tracking-[0.3em] animate-pulse">
                    Synchronizing_Institutional_Registry...
                </p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            <main className="p-4 md:p-8 lg:p-12">
                {/* Rule 20: Standardized Container Constraints */}
                <div className="mx-auto max-w-7xl space-y-10 md:space-y-16">

                    {/* ── HEADER HUB ── */}
                    <Header />

                    {/* ── HUB VITALITY TELEMETRY (Utilizing userCount & whatsappCredits) ── */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Registry Density Hub */}
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-surface border border-border shadow-inner group hover:border-school-primary-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-sm">
                                    <Users className="h-6 w-6 text-school-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Registry Density</p>
                                    <h4 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter mt-1 tabular-nums">
                                        {userCount.toLocaleString()} Active Profiles
                                    </h4>
                                </div>
                            </div>
                            <ShieldCheck className="h-5 w-5 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Resource Provision Hub */}
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-surface border border-border shadow-inner group hover:border-school-primary-200 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="h-12 w-12 rounded-xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center shadow-sm">
                                    <MessageSquare className="h-6 w-6 text-school-primary" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Transmission Capacity</p>
                                    <h4 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter mt-1 tabular-nums">
                                        {whatsappCredits.toLocaleString()} Units Verified
                                    </h4>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Zap className={cn(
                                    "h-5 w-5 animate-pulse",
                                    whatsappCredits > 50 ? "text-school-primary" : "text-destructive"
                                )} />
                            </div>
                        </div>
                    </section>

                    {/* ── CORE METRICS ── */}
                    <StatsCards />

                    {/* ── ANALYTICS HUB (Rule 20) ── */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <Activity className="h-4 w-4 text-school-primary" />
                            <h3 className="text-sm font-extrabold uppercase tracking-widest text-foreground italic">Analytical Performance Hub</h3>
                        </div>
                        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                            <GradeDistributionChart
                                data={analyticsData?.gradeDistribution ?? []}
                            />
                            <AssessmentScoresChart
                                data={analyticsData?.assessmentScores ?? []}
                            />
                            <StatusDistributionChart
                                data={analyticsData?.statusDistribution ?? []}
                            />
                            <div className="md:col-span-2 xl:col-span-3">
                                <UnassignedStudentsAlert initialData={unassignedData} />
                            </div>
                        </div>
                    </section>

                    {/* ── REGISTRY INFRASTRUCTURE LAYOUT (Rule 20) ── */}
                    <div className="grid gap-10 md:gap-12 xl:grid-cols-3">

                        {/* LEFT WING: SYLLABUS & IDENTITY */}
                        <div className="xl:col-span-2 space-y-10 md:space-y-16">
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 px-2">
                                    <Database className="h-4 w-4 text-school-primary" />
                                    <h3 className="text-sm font-extrabold uppercase tracking-widest text-foreground italic">Student Ledger Matrix</h3>
                                </div>
                                <StudentsTable />
                            </div>
                            
                            <CurriculumCard />
                            <ParentChildLinker />
                        </div>

                        {/* RIGHT WING: TELEMETRY & FEED */}
                        <div className="space-y-10 md:space-y-16 xl:col-span-1">
                            <StudentsPerClassTable />
                            <ActivityFeed />
                        </div>

                    </div>
                </div>
            </main>

            {/* ── FOOTER PROTOCOL ── */}
            <footer className="pt-16 pb-8 flex flex-col items-center gap-4 opacity-20 border-t border-border mt-20">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <p className="text-[9px] font-bold uppercase tracking-[0.5em] text-muted-foreground text-center">
                    Institutional_Command_Terminal_v4.2
                </p>
            </footer>
        </div>
    )
}