// "use client"
// import { useState, useEffect } from "react"
// import { Sidebar } from "@/components/admin-dasboard/sidebar"
// import { Header } from "@/components/admin-dasboard/header"
// import { StatsCards } from "@/components/admin-dasboard/stats-cards"
// import { StudentsTable } from "@/components/admin-dasboard/students-table"
// import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
// import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
// import { GradeDistributionChart,AssessmentScoresChart,EnrollmentTrendChart,StatusDistributionChart } from "@/components/admin-dasboard/analitcs-charts"

// export default function Dashboard() {
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [isMounted, setIsMounted] = useState(false)

//   // Handle initial mount and window resize
//   useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   // Calculate margin based on sidebar state
//   const mainMargin = sidebarCollapsed ? 64 : 256

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Sidebar */}
//       <Sidebar onCollapsedChange={setSidebarCollapsed} />

//       {/* Main Content */}
//       <div 
//         className="transition-all duration-300 ease-in-out min-h-screen"
//         style={{ marginLeft: isMounted ? `${mainMargin}px` : "256px" }}
//       >
//         {/* Header */}
//         <Header />

//         {/* Dashboard Content */}
//         <main className="p-4 md:p-6 lg:p-8">
//           <div className="mx-auto max-w-7xl space-y-6">
//             {/* Page Title */}
//             <div>
//               <h2 className="text-2xl font-bold text-foreground tracking-tight">
//                 Dashboard Overview
//               </h2>
//               <p className="text-muted-foreground">
//                 Welcome back! Here{"'"}s what{"'"}s happening at your school today.
//               </p>
//             </div>

//             {/* Stats Cards */}
//             <StatsCards />

//             {/* Charts Row */}
//             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//               <GradeDistributionChart />
//               <AssessmentScoresChart />
//               <div className="space-y-6">
//                 <StatusDistributionChart />
//               </div>
//             </div>

//             {/* Main Grid - Students Table + Right Column */}
//             <div className="grid gap-6 xl:grid-cols-3">
//               {/* Students Table - Takes 2 columns on xl */}
//               <div className="xl:col-span-2">
//                 <StudentsTable />
//               </div>

//               {/* Right Column - Curriculum, Enrollment Trend & Activity */}
//               <div className="space-y-6 xl:col-span-1">
//                 <CurriculumCard />
//                 <EnrollmentTrendChart />
//                 <ActivityFeed />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
// )
// }



// "use client"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { useProfileStore } from "@/store/profileStore"
// import { Loader2 } from "lucide-react" // Import a spinner icon

// import { Header } from "@/components/admin-dasboard/header"
// import { StatsCards } from "@/components/admin-dasboard/stats-cards"
// import { StudentsTable } from "@/components/admin-dasboard/students-table"
// import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
// import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
// import { GradeDistributionChart, AssessmentScoresChart, EnrollmentTrendChart, StatusDistributionChart } from "@/components/admin-dasboard/analitcs-charts"

// export default function Dashboard() {
//   const router = useRouter()
//   // 1. Get profile and loading state from your store
//   const { profile, isLoading: isProfileLoading } = useProfileStore()
  
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//   const [isMounted, setIsMounted] = useState(false)

//   // Handle initial mount to prevent hydration errors
//   useEffect(() => {
//     setIsMounted(true)
//   }, [])

//   // 2. Authentication & Authorization Guard
// // In your Dashboard component
// useEffect(() => {
//   if (!isProfileLoading) {
//       if (!profile) {
//           // ✅ Small delay to allow profile store to hydrate from Supabase session
//           const timer = setTimeout(() => {
//               router.replace('/login');
//           }, 1500);
//           return () => clearTimeout(timer);
//       } else if (profile.role !== 'SCHOOL_ADMIN' && profile.role !== 'SUPER_ADMIN') {
//           router.replace('/');
//       }
//   }
// }, [profile, isProfileLoading, router]);

//   // 3. Show loading state while checking auth or fetching profile
//   if (!isMounted || isProfileLoading || !profile) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-background">
//         <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//         <p className="text-muted-foreground animate-pulse">Loading workspace...</p>
//       </div>
//     )
//   }

//   // Calculate margin based on sidebar state
//   const mainMargin = sidebarCollapsed ? 64 : 256

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Sidebar - Note: Ensure your Sidebar component also reads from the store internally to show the admin name/email */}


//       {/* Main Content */}
//       <div 
//         className="transition-all duration-300 ease-in-out min-h-screen"
//         style={{ marginLeft: `${mainMargin}px` }}
//       >
//         {/* Header */}
//         <Header />

//         {/* Dashboard Content */}
//         <main className="p-4 md:p-6 lg:p-8">
//           <div className="mx-auto max-w-7xl space-y-6">
            
//             {/* 4. Inject Real User Data into Page Title */}
//             <div>
//               <h2 className="text-2xl font-bold text-foreground tracking-tight">
//                 {profile.school?.name ? `${profile.school.name} Dashboard` : "Dashboard Overview"}
//               </h2>
//               <p className="text-muted-foreground">
//                 Welcome back, <span className="font-semibold text-foreground">{profile.name || 'Admin'}</span>! Here{"'"}s what{"'"}s happening at your school today.
//               </p>
//             </div>

//             {/* 
//                 IMPORTANT NEXT STEPS: 
//                 To make the charts and tables real, you need to open these components 
//                 (StatsCards, StudentsTable, etc.) and add `const { profile } = useProfileStore()` 
//                 inside them so they can use `profile.schoolId` to fetch their specific data from your database!
//             */}

//             {/* Stats Cards */}
//             <StatsCards />

//             {/* Charts Row */}
//             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//               <GradeDistributionChart />
//               <AssessmentScoresChart />
//               <div className="space-y-6">
//                 <StatusDistributionChart />
//               </div>
//             </div>

//             {/* Main Grid - Students Table + Right Column */}
//             <div className="grid gap-6 xl:grid-cols-3">
//               {/* Students Table - Takes 2 columns on xl */}
//               <div className="xl:col-span-2">
//                 <StudentsTable />
//               </div>

//               {/* Right Column - Curriculum, Enrollment Trend & Activity */}
//               <div className="space-y-6 xl:col-span-1">
//                 <CurriculumCard />
//                 <EnrollmentTrendChart />
//                 <ActivityFeed />
//               </div>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }


// app/(dashboard)/admin/page.tsx
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
//     // EnrollmentTrendChart,
//     StatusDistributionChart
// } from "@/components/admin-dasboard/analitcs-charts"

// export default function Dashboard() {
//     const { profile, isLoading: isProfileLoading } = useProfileStore()
//     const [isMounted, setIsMounted] = useState(false)

//     useEffect(() => {
//         setIsMounted(true)
//     }, [])

//     // ✅ Auth guard removed — layout.tsx handles it server-side before this
//     // page ever renders. No redirect logic needed here at all.

//     // Show spinner while store hydrates on client
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

//                     <div>
//                         <h2 className="text-2xl font-bold text-foreground tracking-tight">
//                             {profile.school?.name
//                                 ? `${profile.school.name} Dashboard`
//                                 : "Dashboard Overview"}
//                         </h2>
//                         <p className="text-muted-foreground">
//                             Welcome back,{' '}
//                             <span className="font-semibold text-foreground">
//                                 {profile.name || 'Admin'}
//                             </span>! Here's what's happening at your school today.
//                         </p>
//                     </div>

//                     <StatsCards />

//                     <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
//                         <GradeDistributionChart />
//                         <AssessmentScoresChart />
//                         <div className="space-y-6">
//                             <StatusDistributionChart />
//                         </div>
//                     </div>

//                     <div className="grid gap-6 xl:grid-cols-3">
//     <div className="xl:col-span-2">
//         <StudentsTable />
//     </div>
//     <div className="space-y-6 xl:col-span-1">
//         <StudentsPerClassTable />   {/* ← add here */}
//         <CurriculumCard />
//         <ActivityFeed />
//     </div>
// </div>

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
    // ✅ FIX 1: Removed 'EnrollmentTrendChart' (was unused)
    StatusDistributionChart
} from "@/components/admin-dasboard/analitcs-charts"

// ✅ FIX 2: Ensure 'Header' is not imported if it isn't used

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

                    <div>
                        <h2 className="text-2xl font-bold text-foreground tracking-tight">
                            {profile.school?.name
                                ? `${profile.school.name} Dashboard`
                                : "Dashboard Overview"}
                        </h2>
                        
                        <p className="text-muted-foreground">
                            Welcome back,{' '}
                            <span className="font-semibold text-foreground">
                                {profile.name || 'Admin'}
                            </span>
                            {/* ✅ FIX 3: Escaped apostrophes using {" "} */}
                            {"! Here's what's happening at your school today."}
                        </p>
                    </div>

                    <StatsCards />

                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <GradeDistributionChart />
                        <AssessmentScoresChart />
                        <div className="space-y-6">
                            <StatusDistributionChart />
                        </div>
                    </div>

                    <div className="grid gap-6 xl:grid-cols-3">
                        <div className="xl:col-span-2">
                            <StudentsTable />
                        </div>
                        <div className="space-y-6 xl:col-span-1">
                            <StudentsPerClassTable />
                            <CurriculumCard />
                            <ActivityFeed />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    )
}