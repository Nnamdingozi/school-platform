
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
//  * (Removed 'as const' to avoid Prisma 'readonly' array errors)
//  */

// const teacherInclude = {
//   selectedSubjects: {
//     include: {
//       grade: true,
//       subject: true,
//       enrollments: true,
//       topics: {
//         include: { 
//           term: true,
//           lessons: true // ✅ ADDED: To get access to aiContent
//         },
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

//   if (!activeSubject) return <div>No subjects assigned.</div>;

//   // 2. Determine Active Topic Logic
//   let activeTopic = activeSubject.topics.find(t => t.id === topicId);

//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t => 
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }

//   // Fallback to absolute first topic
//   if (!activeTopic) {
//     activeTopic = activeSubject.topics[0];
//   }

//   // Format subjects for header
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
        
//         <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          
//           {/* 1. Subject Update CTA */}
//           <section>
//             <Card className="border-dashed bg-muted/30">
//               <CardContent className="flex items-center justify-between p-4">
//                 <p className="text-sm text-muted-foreground">
//                   Currently viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                 </p>
//                 <Button variant="outline" size="sm" asChild>
//                   <Link href="/subjects/manage?role=teacher">Switch Subject Assignments</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </section>

//           {/* 2. ACTIVE TOPIC CARD (FIXED PROPS) */}
//           <section>
//           <ActiveTopicCard 
//   key={activeSubject.id} // Only reset if the SUBJECT changes
//   activeSubject={activeSubject} 
//   activeTopic={activeTopic}
//   selectedTermId={termId || activeTopic?.termId}
//   selectedWeek={week || String(activeTopic?.weekNumber)}
// />
//           </section>

//           {/* 3. PERFORMANCE & STATUS */}
//           <section className="grid gap-6 lg:grid-cols-3">
//             <div className="lg:col-span-2">
//               <PerformanceCharts subjectId={activeSubject.id} />
//             </div>
//             <WhatsAppStatus />
//           </section>

//           {/* 4. AI PLANNER (FIXED PROPS) */}
//           <section>
//             <AILessonPlanner 
//               topicId={activeTopic?.id ?? ""} 
//               topicTitle={activeTopic?.title ?? "General Subject"} 
//               // ✅ Access aiContent from the first lesson in the topic
//               initialData={activeTopic?.lessons?.[0]?.aiContent as any} 
//               lessonId={activeTopic?.lessons?.[0].id}
//             />
//           </section>

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

// // Import the server action for performance data
// import { getPerformanceDashboardData, PerformanceDashboardData } from "@/app/actions/performance-data";

// export const dynamic = "force-dynamic";

// const teacherInclude = {
//   selectedSubjects: {
//     include: {
//       grade: true,
//       subject: true,
//       enrollments: true,
//       topics: {
//         include: { 
//           term: true,
//           lessons: true // Include lessons to access aiContent for AI Planner
//         },
//         orderBy: [
//           { term: { index: 'asc' } },
//           { weekNumber: 'asc' },
//         ],
//       },
//     },
//   },
//   // Ensure schoolId is selected if not already part of top-level Profile
//   school: { select: { id: true } } // Select school info directly
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
  
//   // TODO: Replace with actual user session email/ID
//   const teacherEmail = "teacher@lagosacademy.test"; 

//   const teacher = await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: teacherInclude,
//   }) as TeacherProfile | null;

//   if (!teacher) return <div className="p-20 text-center">Teacher profile not found.</div>;

//   // Determine Active Subject
//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) 
//     ?? teacher.selectedSubjects[0];

//   if (!activeSubject) return <div className="p-20 text-center">No subjects assigned to this teacher.</div>;

//   // Determine Active Topic Logic
//   let activeTopic = activeSubject.topics.find(t => t.id === topicId);

//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t => 
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }

//   // Fallback to absolute first topic if none matched
//   if (!activeTopic && activeSubject.topics.length > 0) {
//     activeTopic = activeSubject.topics[0];
//   } else if (!activeTopic) {
//       // If there are no topics at all for the active subject
//       return <div className="p-20 text-center">No topics found for the selected subject.</div>;
//   }

//   // Format subjects for header
//   const subjects = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   // --- NEW: Fetch performance data on the server ---
//   let initialPerformanceData: PerformanceDashboardData | null = null;
//   let initialPerformanceError: string | null = null;

//   if (activeSubject.id && teacher.school?.id) { // Ensure school ID is available
//     const performanceResult = await getPerformanceDashboardData(activeSubject.id, teacher.school.id);
//     if (performanceResult.success) {
//       initialPerformanceData = performanceResult.data!;
//     } else {
//       if(performanceResult.error) {
//         initialPerformanceError = performanceResult.error;
//       }
      
//       console.error("Server-side performance data fetch failed:", performanceResult.error);
//     }
//   } else {
//     initialPerformanceError = "Missing active subject ID or teacher's school ID for performance data.";
//   }
//   // --- END NEW ---

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <DashboardHeader 
//           teacherName={teacher.name ?? "Teacher"} 
//           subjects={subjects} 
//           activeSubjectId={activeSubject.id} 
//         />
        
//         <main className="flex-1 overflow-auto p-4 md:p-6 space-y-6">
          
//           {/* 1. Subject Update CTA */}
//           <section>
//             <Card className="border-dashed bg-muted/30">
//               <CardContent className="flex items-center justify-between p-4">
//                 <p className="text-sm text-muted-foreground">
//                   Currently viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                 </p>
//                 <Button variant="outline" size="sm" asChild>
//                   <Link href="/subjects/manage?role=teacher">Switch Subject Assignments</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </section>

//           {/* 2. ACTIVE TOPIC CARD */}
//           <section>
//           <ActiveTopicCard 
//             key={activeSubject.id} // Only reset if the SUBJECT changes
//             activeSubject={activeSubject} 
//             activeTopic={activeTopic}
//             selectedTermId={termId || activeTopic?.termId}
//             selectedWeek={week || String(activeTopic?.weekNumber)}
//           />
//           </section>

//           {/* 3. PERFORMANCE & STATUS */}
//           <section className="grid gap-6 lg:grid-cols-3">
//             <div className="lg:col-span-2">
//               {/* Pass the fetched data as props */}
//               <PerformanceCharts 
//                 gradeSubjectId={activeSubject.id} 
//                 schoolId={teacher.school?.id || ""} // Pass schoolId, handle potential undefined
//                 initialPerformanceData={initialPerformanceData}
//                 initialPerformanceError={initialPerformanceError}
//               />
//             </div>
//             <WhatsAppStatus />
//           </section>

//           {/* 4. AI PLANNER */}
//           <section>
//             <AILessonPlanner 
//               topicId={activeTopic?.id ?? ""} 
//               // Ensure lessonId is passed if a lesson exists for the active topic
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""} 
//               topicTitle={activeTopic?.title ?? "General Subject"} 
//               // Access aiContent from the first lesson in the topic
//               initialData={activeTopic?.lessons?.[0]?.aiContent as any} 
//             />
//           </section>

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
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getPerformanceDashboardData } from "@/app/actions/performance-data";

export const dynamic = "force-dynamic";

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
    include: {
      selectedSubjects: {
        include: {
          grade: true,
          subject: true,
          enrollments: true,
          topics: {
            include: { term: true, lessons: true },
            orderBy: [{ term: { index: 'asc' } }, { weekNumber: 'asc' }],
          },
        },
      },
      school: { select: { id: true } }
    },
  });

  if (!teacher) return <div className="p-20 text-center">Teacher profile not found.</div>;

  const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) ?? teacher.selectedSubjects[0];
  if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

  let activeTopic = activeSubject.topics.find(t => t.id === topicId) 
    ?? activeSubject.topics.find(t => t.termId === termId && t.weekNumber === parseInt(week || ""))
    ?? activeSubject.topics[0];

  const subjects = teacher.selectedSubjects.map((gs) => ({
    id: gs.id,
    displayName: `${gs.grade.displayName} ${gs.subject.name}`,
    studentCount: gs.enrollments?.length ?? 0,
  }));

  const performanceResult = await getPerformanceDashboardData(activeSubject.id, teacher.school?.id || "");

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader 
          teacherName={teacher.name ?? "Teacher"} 
          subjects={subjects} 
          activeSubjectId={activeSubject.id} 
        />
        
        <main className="flex-1 overflow-auto p-4 md:p-6 space-y-12">
          
          {/* Section: Context Bar */}
          <section>
            <Card className="border-dashed bg-muted/30">
              <CardContent className="flex items-center justify-between p-4">
                <p className="text-sm text-muted-foreground">
                  Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/subjects/manage?role=teacher">Manage Assignments</Link>
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Section: Active Topic (Scroll Target) */}
          <section id="active-topic" className="scroll-mt-20">
            <ActiveTopicCard 
              key={activeSubject.id} 
              activeSubject={activeSubject} 
              activeTopic={activeTopic}
              selectedTermId={termId || activeTopic?.termId}
              selectedWeek={week || String(activeTopic?.weekNumber)}
            />
          </section>

          {/* Section: Performance (Scroll Target) */}
          <section id="performance-section" className="grid gap-6 lg:grid-cols-3 scroll-mt-20">
            <div className="lg:col-span-2">
              <PerformanceCharts 
                gradeSubjectId={activeSubject.id} 
                schoolId={teacher.school?.id || ""} 
                initialPerformanceData={performanceResult.success ? performanceResult.data : null}
                initialPerformanceError={performanceResult.success ? null : performanceResult.error}
              />
            </div>
            <WhatsAppStatus />
          </section>

          {/* Section: AI Planner (Scroll Target) */}
          <section id="ai-planner" className="scroll-mt-20">
            <AILessonPlanner 
              topicId={activeTopic?.id ?? ""} 
              lessonId={activeTopic?.lessons?.id ?? ""}
              topicTitle={activeTopic?.title ?? "General Subject"} 
              initialData={activeTopic?.lessons?.aiContent as any} 
            />
          </section>

        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}