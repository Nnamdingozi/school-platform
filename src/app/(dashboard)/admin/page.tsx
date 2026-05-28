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


// "use client"

// import { useState, useEffect } from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2 } from "lucide-react"
// import { StatsCards } from "@/components/admin-dasboard/stats-cards"
// import { StudentsTable } from "@/components/admin-dasboard/students-table"
// import { CurriculumCard } from "@/components/admin-dasboard/curriculum/curriculum-card"
// import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
// import { StudentsPerClassTable } from "@/components/admin-dasboard/students-per-class-table"
// import {
//     GradeDistributionChart,
//     AssessmentScoresChart,
//     StatusDistributionChart,
// } from "@/components/admin-dasboard/analytics/analytics-charts"
// import { UnassignedStudentsAlert } from "@/components/admin-dasboard/analytics/unassigned-students-alert"
// import { Header } from "@/components/admin-dasboard/header"
// import { ParentChildLinker } from "@/components/admin-dasboard/parent/parent-child-linker"

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

//                     {/* Charts Grid */}
//                     <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//                         <GradeDistributionChart />
//                         <AssessmentScoresChart />
//                         <StatusDistributionChart />
//                         <UnassignedStudentsAlert /> 
//                     </div>

//                     {/* Main Content Layout */}
//                     <div className="grid gap-6 xl:grid-cols-3">

//                         {/* LEFT COLUMN (2/3 width on desktop) */}
//                         <div className="xl:col-span-2 space-y-6">
//                             <StudentsTable />
//                             <CurriculumCard />
                            
//                             {/* ✅ ParentChildLinker moved inside this container to stay below CurriculumCard */}
//                             <ParentChildLinker />
//                         </div>

//                         {/* RIGHT COLUMN (1/3 width on desktop) */}
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




import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getAnalyticsData, getUnassignedStudents } from "@/app/actions/analytics.action";
import { AdminDashboardClient } from "@/components/admin-dasboard/adminDashBoardClient";

export async function generateMetadata(): Promise<Metadata> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { title: "Dashboard | SchoolPaaS" };

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        include: { school: { select: { name: true } } },
    });

    return {
        title: `Dashboard | ${profile?.school?.name || "Institution"} | SchoolPaaS`,
        description: "Institutional overview and operational dashboard.",
    };
}

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const profile = await prisma.profile.findUnique({
        where: { id: user.id },
        include: {
            school: {
                include: {
                    _count: { select: { users: true } },
                },
            },
        },
    });

    if (
        !profile?.schoolId ||
        (profile.role !== Role.SCHOOL_ADMIN && profile.role !== Role.SUPER_ADMIN)
    ) {
        redirect("/teacher?error=unauthorized");
    }

    // Parallel fetch — same pattern as pastQuestions page
    const [analyticsData, unassignedData] = await Promise.all([
        getAnalyticsData(profile.schoolId),
        getUnassignedStudents(profile.schoolId),
    ]);

    return (
        <AdminDashboardClient
            analyticsData={analyticsData}
            unassignedData={unassignedData}
            userCount={profile.school?._count.users ?? 0}
            whatsappCredits={profile.school?.whatsappCredits ?? 0}
        />
    );
}


