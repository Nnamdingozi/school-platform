// "use client"

// import { useState, useEffect } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2 } from "lucide-react"
// import { StatsCards } from "@/components/admin-dasboard/stats-cards"
// import { StudentsTable } from "@/components/admin-dasboard/students-table"
// import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
// import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
// import { StudentsPerClassTable } from "@/components/admin-dasboard/students-per-class-table"
// import {
//     GradeDistributionChart,
//     AssessmentScoresChart,
//     StatusDistributionChart,
// } from "@/components/admin-dasboard/analitcs-charts"
// import {UnassignedStudentsAlert} from "@/components/admin-dasboard/unassigned-students-alert"
// import { Header } from "@/components/admin-dasboard/header"
// import { ParentChildLinker } from "@/components/admin-dasboard/parent-child-linker"

// export default function Dashboard() {
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

//                     {/* Header */}
//                     <Header />

//                     {/* Stats */}
//                     <StatsCards />

//                     {/* Charts */}
//                     <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//                         <GradeDistributionChart />
//                         <AssessmentScoresChart />
//                         <StatusDistributionChart />
//                         <UnassignedStudentsAlert /> 

//                     </div>

//                     {/* Main content */}
//                     <div className="grid gap-6 xl:grid-cols-3">

//                         {/* Left: Students table + Curriculum card stacked */}
//                         <div className="xl:col-span-2 space-y-6 mb-12 xl:mb-0">
//                             <StudentsTable />
//                             <CurriculumCard />
//                         </div>

//                         {/* Right: sidebar */}
//                         <div className="space-y-6 xl:col-span-1">
//                             <StudentsPerClassTable />
//                             <ActivityFeed />
//                         </div>
//                         <div className="space-y-6 xl:col-span-1">
                            
//                     <ParentChildLinker />

//                         </div>

//                     </div>


//                 </div>
//             </main>
//         </div>
//     )
// }


"use client"

import { useState, useEffect } from "react"
import { useProfileStore } from "@/store/profileStore"
import { Loader2 } from "lucide-react"
import { StatsCards } from "@/components/admin-dasboard/stats-cards"
import { StudentsTable } from "@/components/admin-dasboard/students-table"
import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
import { StudentsPerClassTable } from "@/components/admin-dasboard/students-per-class-table"
import {
    GradeDistributionChart,
    AssessmentScoresChart,
    StatusDistributionChart,
} from "@/components/admin-dasboard/analitcs-charts"
import { UnassignedStudentsAlert } from "@/components/admin-dasboard/unassigned-students-alert"
import { Header } from "@/components/admin-dasboard/header"
import { ParentChildLinker } from "@/components/admin-dasboard/parent-child-linker"

export default function Dashboard() {
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

                    {/* Header */}
                    <Header />

                    {/* Stats */}
                    <StatsCards />

                    {/* Charts Grid */}
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <GradeDistributionChart />
                        <AssessmentScoresChart />
                        <StatusDistributionChart />
                        <UnassignedStudentsAlert /> 
                    </div>

                    {/* Main Content Layout */}
                    <div className="grid gap-6 xl:grid-cols-3">

                        {/* LEFT COLUMN (2/3 width on desktop) */}
                        <div className="xl:col-span-2 space-y-6">
                            <StudentsTable />
                            <CurriculumCard />
                            
                            {/* ✅ ParentChildLinker moved inside this container to stay below CurriculumCard */}
                            <ParentChildLinker />
                        </div>

                        {/* RIGHT COLUMN (1/3 width on desktop) */}
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