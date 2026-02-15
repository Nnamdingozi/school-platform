

// import Link from "next/link";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@/generated/prisma/client";

// // Ensure the page always reflects the latest database state and URL params
// export const dynamic = "force-dynamic";

// const teacherQuery = {
//   include: {
//     selectedSubjects: {
//       include: {
//         grade: true,
//         subject: true,
//         enrollments: true,
//         topics: {
//           include: { term: true },
//           orderBy: [
//             { term: { index: 'asc' } }, 
//             { weekNumber: 'asc' }       
//           ]
//         }
//       },
//     },
//   },
// } as const;

// type TeacherProfile = Prisma.ProfileGetPayload<typeof teacherQuery>;

// export default async function TeacherDashboard({
//   searchParams,
// }: {
//   searchParams: Promise<{ 
//     subjectId?: string; 
//     topicId?: string; 
//     termId?: string; 
//     week?: string 
//   }>;
// }) {
//   const params = await searchParams;
//   const { subjectId, topicId, termId, week } = params;
  
//   const teacherEmail = "teacher@lagosacademy.test";

//   const teacher = await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: teacherQuery.include,
//   }) as TeacherProfile | null;

//   if (!teacher) return <div className="p-20 text-center">Teacher profile not found.</div>;

//   // 1. Determine Active Subject (URL first, or default to first assigned)
//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) 
//     ?? teacher.selectedSubjects[0];

//   if (!activeSubject) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen gap-4">
//         <p>No subjects assigned to your profile yet.</p>
//         <Button asChild><Link href="/subjects/manage">Manage Subjects</Link></Button>
//       </div>
//     );
//   }

//   // 2. Determine Active Topic based on Hierarchy of Priority
//   let activeTopic = activeSubject.topics.find(t => t.id === topicId);

//   // If no topic selected, but user picked Term/Week, find the matching topic
//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t => 
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }

//   // Final fallback: First topic of the subject (Term 1 Week 1)
//   if (!activeTopic) {
//     activeTopic = activeSubject.topics[0];
//   }

//   // Prepare header subject list
//   const subjects = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <DashboardHeader 
//           teacherName={teacher.name ?? "Teacher"} 
//           subjects={subjects} 
//           activeSubjectId={activeSubject.id} 
//         />
        
//         <main className="flex-1 overflow-auto p-4 md:p-6">
//           <div className="mx-auto max-w-7xl space-y-6">
            
//             {/* 1. Manage Subjects CTA */}
//             <section>
//               <Card className="border-dashed bg-muted/30">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">Class Management</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                   <p className="text-sm text-muted-foreground">
//                     Currently teaching <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong> with {activeSubject.enrollments.length} students.
//                   </p>
//                   <Button variant="outline" size="sm" asChild>
//                     <Link href="/subjects/manage?role=teacher">Update Assigned Subjects</Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </section>

//             {/* 2. Reactive Topic Selector Card */}
//             <section>
//               <ActiveTopicCard 
//                 activeSubject={activeSubject} 
//                 activeTopic={activeTopic}
//                 selectedTermId={termId || activeTopic?.termId}
//                 selectedWeek={week || String(activeTopic?.weekNumber)}
//               />
//             </section>

//             {/* 3. Performance Overview (Filters by Subject) */}
//             <section className="space-y-4">
//               <h2 className="text-lg font-semibold tracking-tight">Student Performance Overview</h2>
//               <div className="grid gap-6 lg:grid-cols-3">
//                 <div className="lg:col-span-2">
//                   <PerformanceCharts subjectId={activeSubject.id} />
//                 </div>
//                 <WhatsAppStatus />
//               </div>
//             </section>

//             {/* 4. AI Tools (Context-aware based on Active Topic) */}
//             <section>
//             <AILessonPlanner 
//   topicId={activeTopicData.topicId} 
//   topicTitle={activeTopicData.topicTitle} 
//   // Fetch existing AI data if it exists from your DB query
//   initialData={activeTopic?.aiContent as any} 
// />
//             </section>

//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }


// import Link from "next/link";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@/generated/prisma/client";

// /**
//  * 1. THE QUERY DEFINITION
//  */
// const teacherQuery = {
//   include: {
//     selectedSubjects: {
//       include: {
//         grade: true,
//         subject: true,
//         enrollments: true, 
//       },
//     },
//   },
// } as const;

// type TeacherProfile = Prisma.ProfileGetPayload<typeof teacherQuery>;

// /**
//  * 2. DASHBOARD PAGE COMPONENT
//  */
// export default async function TeacherDashboard() {
//   // A. Fetch the Teacher Data
//   const teacherEmail = "teacher@lagosacademy.test";
//   const teacher = (await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: teacherQuery.include,
//   })) as TeacherProfile | null;

//   // B. Handle "Not Found" State
//   if (!teacher) {
//     return <div className="p-10 text-center">Teacher profile not found. Please run seed.</div>;
//   }

//   // C. Prepare data for the Header
//   const teacherName = teacher.name ?? "Teacher";
//   const headerSubjects = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   // D. LOGIC FOR THE ACTIVE TOPIC CARD
//   // We check if the teacher has any subjects first to avoid crashes
//   const firstSubject = teacher.selectedSubjects[0];
  
//   let activeTopicData = null;

//   if (firstSubject) {
//     // We fetch the first topic (Week 1) for their first assigned subject
//     const activeTopic = await prisma.topic.findFirst({
//       where: {
//         gradeSubjectId: firstSubject.id,
//         weekNumber: 1, 
//       },
//       include: {
//         lessons: true, 
//       }
//     });

//     if (activeTopic) {
//       activeTopicData = {
//         topicId: activeTopic.id,
//         topicTitle: activeTopic.title,
//         topicDescription: activeTopic.description ?? "No description available",
//         weekNumber: activeTopic.weekNumber ?? 1,
//         studentCount: firstSubject.enrollments.length,
//         hasLesson: activeTopic.lessons.length > 0
//       };
//     }
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <DashboardHeader teacherName={teacherName} subjects={headerSubjects} />
        
//         <main className="flex-1 overflow-auto p-4 md:p-6">
//           <div className="mx-auto max-w-7xl space-y-6">
            
//             {/* Subject Management Link */}
//             <section>
//               <Card className="border-dashed border-amber-200 bg-amber-50/30">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-bold uppercase tracking-wide text-amber-700">
//                     Quick Setup
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   <p className="text-sm text-muted-foreground">
//                     Assign your grades and subjects to personalize your planning tools.
//                   </p>
//                   <Button asChild variant="outline" className="border-amber-200 text-amber-700 hover:bg-amber-100">
//                     <Link href="/subjects/manage?role=teacher">
//                       Open Subject Management
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </section>

//             {/* Active Topic Section - Only shows if data was found */}
//             <section>
//               {activeTopicData ? (
//                 <ActiveTopicCard 
//                   topicId={activeTopicData.topicId}
//                   topicTitle={activeTopicData.topicTitle}
//                   topicDescription={activeTopicData.topicDescription}
//                   termName="First Term" 
//                   weekNumber={activeTopicData.weekNumber}
//                   studentCount={activeTopicData.studentCount}
//                   hasLesson={activeTopicData.hasLesson}
//                 />
//               ) : (
//                 <Card className="p-6 text-center text-muted-foreground border-dashed">
//                   No active topics found. Select a subject to get started.
//                 </Card>
//               )}
//             </section>

//             {/* Performance Overview Section */}
//             <section>
//               <h2 className="mb-4 text-lg font-semibold text-foreground">
//                 Student Performance Overview
//               </h2>
//               <PerformanceCharts />
//             </section>

//             <section className="grid gap-6 lg:grid-cols-2">
//             <AILessonPlanner 
//   topicId={activeTopicData.topicId} 
//   topicTitle={activeTopicData.topicTitle} 
//   // Fetch existing AI data if it exists from your DB query
//   initialData={activeTopic?.aiContent as any} 
// />
//               <WhatsAppStatus />
//             </section>
//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// import Link from "next/link";
// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@/generated/prisma/client";

// export const dynamic = "force-dynamic";

// /**
//  * 1. THE QUERY DEFINITION
//  * Removed 'as const' to fix the Prisma 'readonly' Type Error.
//  */
// const teacherInclude = {
//   selectedSubjects: {
//     include: {
//       grade: true,
//       subject: true,
//       enrollments: true,
//       topics: {
//         include: { term: true },
//         orderBy: [
//           { term: { index: 'asc' } },
//           { weekNumber: 'asc' },
//         ],
//       },
//     },
//   },
// } satisfies Prisma.ProfileInclude;

// type TeacherProfile = Prisma.ProfileGetPayload<{
//   include: typeof teacherInclude
// }>;

// export default async function TeacherDashboard({
//   searchParams,
// }: {
//   searchParams: Promise<{ 
//     subjectId?: string; 
//     topicId?: string; 
//     termId?: string; 
//     week?: string 
//   }>;
// }) {
//   const params = await searchParams;
//   const { subjectId, topicId, termId, week } = params;
  
//   const teacherEmail = "teacher@lagosacademy.test";

//   const teacher = await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: teacherInclude,
//   }) as TeacherProfile | null;

//   if (!teacher) return <div className="p-20 text-center">Teacher profile not found.</div>;

//   // 1. Determine Active Subject
//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) 
//     ?? teacher.selectedSubjects[0];

//   if (!activeSubject) {
//     return (
//       <div className="flex h-screen items-center justify-center gap-4">
//         <p>No subjects assigned yet.</p>
//         <Button asChild><Link href="/subjects/manage">Manage Subjects</Link></Button>
//       </div>
//     );
//   }

//   // 2. Determine Active Topic Logic
//   let activeTopic = activeSubject.topics.find(t => t.id === topicId);

//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t => 
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }

//   // Final fallback
//   if (!activeTopic) {
//     activeTopic = activeSubject.topics[0];
//   }

//   // Prepare header subject list
//   const subjects = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <DashboardHeader 
//           teacherName={teacher.name ?? "Teacher"} 
//           subjects={subjects} 
//           activeSubjectId={activeSubject.id} 
//         />
        
//         <main className="flex-1 overflow-auto p-4 md:p-6">
//           <div className="mx-auto max-w-7xl space-y-6">
            
//             {/* Class Info Section */}
//             <section>
//               <Card className="border-dashed bg-muted/30">
//                 <CardHeader className="pb-2">
//                   <CardTitle className="text-sm font-medium">Class Management</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
//                   <p className="text-sm text-muted-foreground">
//                     Active Class: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                   </p>
//                   <Button variant="outline" size="sm" asChild>
//                     <Link href="/subjects/manage?role=teacher">Update Assigned Subjects</Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </section>

//             {/* 2. Active Topic Card */}
//             {/* FIXED: Passing the correct props 'activeSubject' and 'activeTopic' */}
//             <section>
//               <ActiveTopicCard 
//                 key={`${activeSubject.id}-${activeTopic?.id}-${termId}-${week}`}
//                 activeSubject={activeSubject} 
//                 activeTopic={activeTopic}
//                 urlTermId={termId || activeTopic?.termId}
//                 urlWeek={week || String(activeTopic?.weekNumber)}
//               />
//             </section>

//             {/* 3. Performance Overview */}
//             <section className="space-y-4">
//               <h2 className="text-lg font-semibold tracking-tight">Student Performance Overview</h2>
//               <div className="grid gap-6 lg:grid-cols-3">
//                 <div className="lg:col-span-2">
//                   <PerformanceCharts subjectId={activeSubject.id} />
//                 </div>
//                 <WhatsAppStatus />
//               </div>
//             </section>

//             {/* 4. AI Planner Section */}
//             {/* FIXED: Using 'activeTopic' properties directly */}
//             <section>
//               <AILessonPlanner 
//                 topicId={activeTopic?.id ?? ""} 
//                 topicTitle={activeTopic?.title ?? "General Subject"} 
//                 initialData={activeTopic?.aiContent as any} 
//               />
//             </section>

//           </div>
//         </main>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

import Link from "next/link";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/TeacherDashboard/app-sidebar";
import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export const dynamic = "force-dynamic";

/**
 * 1. THE QUERY DEFINITION
 * (Removed 'as const' to avoid Prisma 'readonly' array errors)
 */

const teacherInclude = {
  selectedSubjects: {
    include: {
      grade: true,
      subject: true,
      enrollments: true,
      topics: {
        include: { 
          term: true,
          lessons: true // ✅ ADDED: To get access to aiContent
        },
        orderBy: [
          { term: { index: 'asc' } },
          { weekNumber: 'asc' },
        ],
      },
    },
  },
} satisfies Prisma.ProfileInclude;

type TeacherProfile = Prisma.ProfileGetPayload<{
  include: typeof teacherInclude
}>;

export default async function TeacherDashboard({
  searchParams,
}: {
  searchParams: Promise<{ 
    subjectId?: string; 
    topicId?: string; 
    termId?: string; 
    week?: string 
  }>;
}) {
  const params = await searchParams;
  const { subjectId, topicId, termId, week } = params;
  
  const teacherEmail = "teacher@lagosacademy.test";

  const teacher = await prisma.profile.findUnique({
    where: { email: teacherEmail },
    include: teacherInclude,
  }) as TeacherProfile | null;

  if (!teacher) return <div className="p-20 text-center">Teacher profile not found.</div>;

  // 1. Determine Active Subject
  const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) 
    ?? teacher.selectedSubjects[0];

  if (!activeSubject) return <div>No subjects assigned.</div>;

  // 2. Determine Active Topic Logic
  let activeTopic = activeSubject.topics.find(t => t.id === topicId);

  if (!activeTopic && termId && week) {
    activeTopic = activeSubject.topics.find(t => 
      t.termId === termId && t.weekNumber === parseInt(week)
    );
  }

  // Fallback to absolute first topic
  if (!activeTopic) {
    activeTopic = activeSubject.topics[0];
  }

  // Format subjects for header
  const subjects = teacher.selectedSubjects.map((gs) => ({
    id: gs.id,
    displayName: `${gs.grade.displayName} ${gs.subject.name}`,
    studentCount: gs.enrollments?.length ?? 0,
  }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader 
          teacherName={teacher.name ?? "Teacher"} 
          subjects={subjects} 
          activeSubjectId={activeSubject.id} 
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          
          {/* 1. Subject Update CTA */}
          <section>
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex items-center justify-between p-4">
                <p className="text-sm text-muted-foreground">
                  Currently viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/subjects/manage?role=teacher">Switch Subject Assignments</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* 2. ACTIVE TOPIC CARD (FIXED PROPS) */}
          <section>
          <ActiveTopicCard 
  key={activeSubject.id} // Only reset if the SUBJECT changes
  activeSubject={activeSubject} 
  activeTopic={activeTopic}
  selectedTermId={termId || activeTopic?.termId}
  selectedWeek={week || String(activeTopic?.weekNumber)}
/>
          </section>

          {/* 3. PERFORMANCE & STATUS */}
          <section className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <PerformanceCharts subjectId={activeSubject.id} />
            </div>
            <WhatsAppStatus />
          </section>

          {/* 4. AI PLANNER (FIXED PROPS) */}
          <section>
            <AILessonPlanner 
              topicId={activeTopic?.id ?? ""} 
              topicTitle={activeTopic?.title ?? "General Subject"} 
              // ✅ Access aiContent from the first lesson in the topic
              initialData={activeTopic?.lessons?.[0]?.aiContent as any} 
            />
          </section>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}