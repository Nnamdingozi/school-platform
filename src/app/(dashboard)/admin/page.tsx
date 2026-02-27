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


"use client"
import { useState, useEffect } from "react"
import { Sidebar } from "@/components/admin-dasboard/sidebar"
import { Header } from "@/components/admin-dasboard/header"
import { StatsCards } from "@/components/admin-dasboard/stats-cards"
import { StudentsTable } from "@/components/admin-dasboard/students-table"
import { CurriculumCard } from "@/components/admin-dasboard/curriculum-card"
import { ActivityFeed } from "@/components/admin-dasboard/activity-feed"
import { 
  GradeDistributionChart, 
  AssessmentScoresChart, 
  EnrollmentTrendChart, 
  StatusDistributionChart 
} from "@/components/admin-dasboard/analitcs-charts"

// 1. Import the new Modal component
import { AddUserModal } from "@/components/admin-dasboard/AddUserModal"

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  // In a real app, these would come from your Auth Session or a useQuery hook
  const currentSchoolId = "your-actual-school-id" 
  const currentCurriculumId = "your-actual-curriculum-id"

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const mainMargin = sidebarCollapsed ? 64 : 256

  return (
    <div className="min-h-screen bg-background">
      <Sidebar onCollapsedChange={setSidebarCollapsed} />

      <div 
        className="transition-all duration-300 ease-in-out min-h-screen"
        style={{ marginLeft: isMounted ? `${mainMargin}px` : "256px" }}
      >
        <Header />

        <main className="p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl space-y-6">
            
            {/* 2. Updated Header Section with the AddUserModal */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground tracking-tight">
                  Dashboard Overview
                </h2>
                <p className="text-muted-foreground">
                  Welcome back! Here{"'"}s what{"'"}s happening at your school today.
                </p>
              </div>
              
              {/* This places the button on the right side on desktop */}
              <div className="flex items-center gap-3">
                <AddUserModal 
                  schoolId={currentSchoolId} 
                  curriculumId={currentCurriculumId} 
                />
              </div>
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
                <CurriculumCard />
                <EnrollmentTrendChart />
                <ActivityFeed />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}