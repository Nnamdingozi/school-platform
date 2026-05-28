"use client"

import { useState, useEffect } from "react"
import { useProfileStore } from "@/store/profileStore"
import { Loader2 } from "lucide-react"
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

interface AdminDashboardClientProps {
    analyticsData:    AnalyticsData | null
    unassignedData:   UnassignedStudentsData | null
    userCount:        number
    whatsappCredits:  number
}

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
            <div className="min-h-screen flex flex-col items-center justify-center bg-background">
                <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Loading workspace...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <main className="p-4 md:p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">

                    <Header />

                    <StatsCards />

                    {/* Charts Grid — data flows from server via props */}
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

                    {/* Main Content Layout */}
                    <div className="grid gap-6 xl:grid-cols-3">

                        {/* LEFT COLUMN */}
                        <div className="xl:col-span-2 space-y-6">
                            <StudentsTable />
                            <CurriculumCard />
                            <ParentChildLinker />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="space-y-6 xl:col-span-1">
                            <StudentsPerClassTable />
                            <ActivityFeed />
                        </div>

                    </div>
                </div>
            </main>
        </div>
    )
}