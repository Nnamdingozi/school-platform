

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



// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@/generated/prisma/client";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";

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
//           lessons: true 
//         },
//         orderBy: [
//           { term: { index: 'asc' } },
//           { weekNumber: 'asc' },
//         ],
//       },
//     },
//   },
//   school: { select: { id: true } }
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
//   const { subjectId, topicId, termId, week } = await searchParams;
//   const teacherEmail = "teacher@lagosacademy.test"; 

//   const teacher = await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: teacherInclude,
//   }) as TeacherProfile | null;

//   if (!teacher) return <div className="p-20 text-center">Teacher not found.</div>;

//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) 
//     ?? teacher.selectedSubjects[0];

//   if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//   let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t => 
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }
//   activeTopic = activeTopic ?? activeSubject.topics[0];

//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   const performanceResult = await getPerformanceDashboardData(activeSubject.id, teacher.school?.id || "");

//   return (
//     <>
//       <DashboardHeader 
//         teacherName={teacher.name ?? "Teacher"} 
//         subjects={subjectsForHeader} 
//         activeSubjectId={activeSubject.id} 
//       />
      
//       <main className="flex-1 p-4 md:p-6 space-y-6">
//         {/* 1. Context Switcher Card */}
//         <section>
//           <Card className="border-dashed bg-muted/30">
//             <CardContent className="flex items-center justify-between p-4">
//               <p className="text-sm text-muted-foreground">
//                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//               </p>
//               <Button variant="outline" size="sm" asChild>
//                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="mx-auto max-w-7xl space-y-6">
//           {/* 2. ACTIVE TOPIC CARD - Row 1 */}
//           <section>
//             <ActiveTopicCard 
//               key={activeSubject.id} 
//               activeSubject={activeSubject} 
//               activeTopic={activeTopic}
//               selectedTermId={termId || activeTopic?.termId}
//               selectedWeek={week || String(activeTopic?.weekNumber)}
//             />
//           </section>

//             {/* 5. AI PLANNER - Row 4 */}
//             <section>
//             <AILessonPlanner 
//               topicId={activeTopic?.id ?? ""} 
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""} 
//               topicTitle={activeTopic?.title ?? "General Subject"} 
//               initialData={activeTopic?.lessons?.[0]?.aiContent as any} 
//             />
//           </section>

//           {/* 3. PERFORMANCE CHARTS - Row 2 (Full Width) */}
//           <section>
//              <PerformanceCharts 
//                 gradeSubjectId={activeSubject.id} 
//                 schoolId={teacher.school?.id || ""} 
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//               />
//           </section>

//           {/* 4. WHATSAPP STATUS - Row 3 (Now on its own row) */}
//           <section>
//              <WhatsAppStatus />
//           </section>

//         </div>
//       </main>
//     </>
//   );
// }


// // app/teacher/page.tsx
// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { prisma } from "@/lib/prisma";
// import { Prisma } from "@/generated/prisma/client";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// import { SchoolProvider } from "@/components/SchoolProvider"; // Import the new Provider

// export const dynamic = "force-dynamic";

// // Ensure this matches the updated definition in step 1, especially the 'school' select
// const teacherInclude = {
//   selectedSubjects: {
//     include: {
//       grade: true,
//       subject: true,
//       enrollments: true,
//       topics: {
//         include: { 
//           term: true,
//           lessons: true 
//         },
//         orderBy: [
//           { term: { index: 'asc' } },
//           { weekNumber: 'asc' },
//         ],
//       },
//     },
//   },
//   school: { 
//     select: { 
//       id: true, 
//       name: true, 
//       primaryColor: true, 
//       secondaryColor: true,
//       whatsappCredits: true, // Example
//       curriculum: {
//         select: {
//           id: true,
//           name: true,
//           yearLabel: true,
//           termLabel: true,
//           subjectLabel: true,
//         },
//       },
//     } 
//   }
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
//   const { subjectId, topicId, termId, week } = await searchParams;
//   const teacherEmail = "teacher@lagosacademy.test"; 

//   const teacher = await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: teacherInclude,
//   }) as TeacherProfile | null;

//   // Crucial: Ensure school and its curriculum are found before proceeding
//   if (!teacher || !teacher.school || !teacher.school.curriculum) {
//     return <div className="p-20 text-center">Teacher, school, or school's primary curriculum not found.</div>;
//   }

//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) 
//     ?? teacher.selectedSubjects[0];

//   if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//   let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t => 
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }
//   activeTopic = activeTopic ?? activeSubject.topics[0];

//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   const performanceResult = await getPerformanceDashboardData(activeSubject.id, teacher.school.id || "");

//   // The 'school' object from the Prisma query directly matches ProvidedSchoolData
//   const schoolData = teacher.school;

//   return (
//     // Wrap the entire dashboard with the SchoolProvider
//     <SchoolProvider school={schoolData}>
//       <DashboardHeader 
//         teacherName={teacher.name ?? "Teacher"} 
//         subjects={subjectsForHeader} 
//         activeSubjectId={activeSubject.id} 
//         // No more individual color props here. Components will use useSchool()
//       />
      
//       <main className="flex-1 p-4 md:p-6 space-y-6">
//         {/* 1. Context Switcher Card */}
//         <section>
//           <Card className="border-dashed bg-muted/30">
//             <CardContent className="flex items-center justify-between p-4">
//               <p className="text-sm text-muted-foreground">
//                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//               </p>
//               <Button variant="outline" size="sm" asChild>
//                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="mx-auto max-w-7xl space-y-6">
//           {/* 2. ACTIVE TOPIC CARD - Row 1 */}
//           <section>
//             <ActiveTopicCard 
//               key={activeSubject.id} 
//               activeSubject={activeSubject} 
//               activeTopic={activeTopic}
//               selectedTermId={termId || activeTopic?.termId}
//               selectedWeek={week || String(activeTopic?.weekNumber)}
//             />
//           </section>

//           {/* 5. AI PLANNER - Row 4 */}
//           <section>
//             <AILessonPlanner 
//               topicId={activeTopic?.id ?? ""} 
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""} 
//               topicTitle={activeTopic?.title ?? "General Subject"} 
//               initialData={activeTopic?.lessons?.[0]?.aiContent as any} 
//             />
//           </section>

//           {/* 3. PERFORMANCE CHARTS - Row 2 (Full Width) */}
//           <section>
//              <PerformanceCharts 
//                 gradeSubjectId={activeSubject.id} 
//                 schoolId={teacher.school.id} 
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//               />
//           </section>

//           {/* 4. WHATSAPP STATUS - Row 3 (Now on its own row) */}
//           <section>
//              <WhatsAppStatus />
//           </section>

//         </div>
//       </main>
//     </SchoolProvider>
//   );
// }


// "use client"

// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { prisma } from "@/lib/prisma"; // Will only be used for teacher-specific data
// import { Prisma } from "@/generated/prisma/client";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// import { useSchool } from "@/context/schoolProvider"; // Import the custom hook

// export const dynamic = "force-dynamic";

// // MODIFIED: Removed 'school' from teacherInclude, as it's provided by the layout's context
// const teacherInclude = {
//   selectedSubjects: {
//     include: {
//       grade: true,
//       subject: true,
//       enrollments: true,
//       topics: {
//         include: { 
//           term: true,
//           lessons: true 
//         },
//         orderBy: [
//           { term: { index: 'asc' } },
//           { weekNumber: 'asc' },
//         ],
//       },
//     },
//   },
//   // Removed 'school' here
// } satisfies Prisma.ProfileInclude;

// type TeacherProfile = Prisma.ProfileGetPayload<{
//   include: typeof teacherInclude
// }>;

// // You might consider moving the teacher data fetching to a Server Component wrapper
// // for this page, and passing `teacher` as a prop to this Client Component.
// // For now, keeping the fetch here, but acknowledging it runs client-side due to 'use client'.
// // The school data, however, will come from context.

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
//   const { subjectId, topicId, termId, week } = await searchParams;

//   // Use the school data from the context provider
//   const school = useSchool(); 

//   const teacherEmail = "teacher@lagosacademy.test"; 

//   const teacher = await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: teacherInclude, // This no longer includes school data
//   }) as TeacherProfile | null;

//   if (!teacher) return <div className="p-20 text-center">Teacher not found.</div>;

//   const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId) 
//     ?? teacher.selectedSubjects[0];

//   if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//   let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t => 
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }
//   activeTopic = activeTopic ?? activeSubject.topics[0];

//   const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   // MODIFIED: Use school.id from context
//   const performanceResult = await getPerformanceDashboardData(activeSubject.id, school.id);

//   return (
//     // REMOVED: SchoolProvider wrapper here, as it's in layout.tsx
//     <>
//       <DashboardHeader 
//         teacherName={teacher.name ?? "Teacher"} 
//         subjects={subjectsForHeader} 
//         activeSubjectId={activeSubject.id} 
//         // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//         // These will now be consumed directly by DashboardHeader via useSchool()
//       />
      
//       <main className="flex-1 p-4 md:p-6 space-y-6">
//         {/* 1. Context Switcher Card */}
//         <section>
//           <Card className="border-dashed bg-muted/30">
//             <CardContent className="flex items-center justify-between p-4">
//               <p className="text-sm text-muted-foreground">
//                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//               </p>
//               <Button variant="outline" size="sm" asChild>
//                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         </section>

//         <div className="mx-auto max-w-7xl space-y-6">
//           {/* 2. ACTIVE TOPIC CARD - Row 1 */}
//           <section>
//             <ActiveTopicCard 
//               key={activeSubject.id} 
//               activeSubject={activeSubject} 
//               activeTopic={activeTopic}
//               selectedTermId={termId || activeTopic?.termId}
//               selectedWeek={week || String(activeTopic?.weekNumber)}
//               // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//               // These will now be consumed directly by ActiveTopicCard via useSchool()
//             />
//           </section>

//           {/* 5. AI PLANNER - Row 4 */}
//           <section>
//             <AILessonPlanner 
//               topicId={activeTopic?.id ?? ""} 
//               lessonId={activeTopic?.lessons?.[0]?.id ?? ""} 
//               topicTitle={activeTopic?.title ?? "General Subject"} 
//               initialData={activeTopic?.lessons?.[0]?.aiContent as any} 
//             />
//           </section>

//           {/* 3. PERFORMANCE CHARTS - Row 2 (Full Width) */}
//           <section>
//              <PerformanceCharts 
//                 gradeSubjectId={activeSubject.id} 
//                 schoolId={school.id} // MODIFIED: Use school.id from context
//                 initialPerformanceData={performanceResult.data}
//                 initialPerformanceError={performanceResult.error}
//                 // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//                 // These will now be consumed directly by PerformanceCharts via useSchool()
//               />
//           </section>

//           {/* 4. WHATSAPP STATUS - Row 3 (Now on its own row) */}
//           <section>
//              <WhatsAppStatus 
//               // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//               // These will now be consumed directly by WhatsAppStatus via useSchool()
//              />
//           </section>

//         </div>
//       </main>
//     </>
//   );
// }


// // src/app/(dashboard)/teacher/page.tsx

// import { getTeacherData } from "@/app/actions/teacherData";
// import { Suspense } from 'react';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";

// export const dynamic = "force-dynamic";

// interface TeacherDashboardPageProps {
//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// // Use a function component and not arrow function
// export default async function TeacherDashboardPage({ searchParams }: TeacherDashboardPageProps) {

//     // Access the cookie store
//     // const cookieStore = cookies();
//     // const supabase = createServerClient(
//     //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     //     {
//     //         cookies: {
//     //             get: (name: string) => cookieStore.get(name)?.value,
//     //         },
//     //     }
//     // );
//     // const { data: { user } } = await supabase.auth.getUser();

//     //if (user && user.email) {
//     //    const teacher = await getTeacherData(user.email);
//     //    console.log("teacher", teacher)
//     //    return (
//     //        <Suspense fallback={<>...Loading</>}>
//     //            <TeacherDashboardContent teacher={teacher} searchParams={searchParams} />
//     //        </Suspense>
//     //    );
//     //}
//     return (
//         <Suspense fallback={<>...Loading</>}>
//             <TeacherDashboardContent teacher={null} searchParams={searchParams} />
//         </Suspense>
//     );
// }


// src/app/(dashboard)/teacher/page.tsx
// import { Suspense } from 'react';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { getTeacherData } from "@/app/actions/teacherData"; // Import getTeacherData

// export const dynamic = "force-dynamic";

// interface TeacherDashboardPageProps {
//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// // Use a function component and not arrow function
// export default async function TeacherDashboardPage({ searchParams }: TeacherDashboardPageProps) {
//     //  Fetch or derive the school data here. Since we have the teacher, let's use it
//     // Get the teacher data (using your test email or Supabase user)
//     //const teacher = await getTeacherData("test.teacher@example.com"); // Example: Use test email

//     return (
//         <Suspense fallback={<>...Loading</>}>
//             <TeacherDashboardContent
//                 searchParams={searchParams}
//             />
//         </Suspense>
//     );
// }

// src/app/(dashboard)/teacher/page.tsx
// import { Suspense } from 'react';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { useProfileStore } from "@/store/profileStore"; // Import useProfileStore
// import { Profile } from '@/generated/prisma/client'; // Import Profile type
// import { ProfileInStore } from '@/types/profile';
// import { getTeacherData } from '@/app/actions/teacherData';


// export const dynamic = "force-dynamic";

// interface TeacherDashboardPageProps {
//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// // Use a function component and not arrow function
// export default function name(params:type) {
    
// } async function TeacherDashboardPage({ searchParams }: TeacherDashboardPageProps) {
//     const { profile } = useProfileStore(); // Get the profile from the store



//     return (
//         <Suspense fallback={<>...Loading</>}>
//             <TeacherDashboardContent
//                 // teacher={teacherData as ProfileInStore | null} // Pass the teacher as a prop
//                 searchParams={searchParams}
//             />
//         </Suspense>
//     );
// }


// // src/app/(dashboard)/teacher/page.tsx
// import { Suspense } from 'react';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { Profile } from '@/generated/prisma/client'; // Import Profile type

// export const dynamic = "force-dynamic";

// interface TeacherDashboardPageProps {
//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// // Use a function component and not arrow function
// export default function TeacherDashboardPage({ searchParams }: TeacherDashboardPageProps) {
  

//     return (
//         <Suspense fallback={<>...Loading</>}>
//             <TeacherDashboardContent
//                 searchParams={searchParams}
//             />
//         </Suspense>
//     );
// }


// src/app/(dashboard)/teacher/page.tsx
// import { Suspense } from 'react';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { Profile } from '@/generated/prisma/client';
// import { getTeacherData } from "@/app/actions/teacherData"; // Import getTeacherData

// export const dynamic = "force-dynamic";

// // interface TeacherDashboardPageProps {
// //     searchParams: Promise<{
// //         subjectId?: string;
// //         topicId?: string;
// //         termId?: string;
// //         week?: string;
// //     }>;
// // }

// // Use a function component and not arrow function
// export default async function TeacherDashboardPage() {
//     // Server Action: Fetch the teacher data
//     const email = "teacher@lagosacademy.test"; //  Or get this from auth
//     const teacher = await getTeacherData(email); // Call getTeacherData
//     if (!teacher) {
//         return (
//             <div className="p-20 text-center">Teacher not found.</div>
//         );
//     }

//     return (
//         <Suspense fallback={<>...Loading</>}>
//             <TeacherDashboardContent
//                 teacher={teacher} // Pass the teacher data as a prop
//             />
//         </Suspense>
//     );
// }\\

// src/app/(dashboard)/teacher/page.tsx
import { Suspense } from 'react';
import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
import { getTeacherData } from "@/app/actions/teacherData";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
    const email = "teacher@lagosacademy.test";
    const teacher = await getTeacherData(email);

    if (!teacher) {
        return <div className="p-20 text-center">Teacher not found.</div>;
    }

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            }>
                <TeacherDashboardContent teacher={teacher} />
            </Suspense>
        </div>
    );
}
