// 'use client';

// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// import { useSchool } from "@/context/schoolProvider";
// import { SidebarProfileData } from '@/types/profile'; // Import SidebarProfileData


// interface TeacherDashboardContentProps {
//   teacher: {
//     name: string | null;
//     email: string;
//     role: string; // Make sure it's string, not Prisma.Role
//     selectedSubjects: any; // TODO: Add type
//     // ... other properties from teacher, adjust from store type
//   } | null;
//   searchParams: {
//     subjectId?: string;
//     topicId?: string;
//     termId?: string;
//     week?: string;
//   };
// }


// export default function TeacherDashboardContent({ teacher, searchParams }: TeacherDashboardContentProps) {
//   if (!teacher) {
//     return <div className="p-20 text-center">Teacher not found.</div>;
//   }
//   const { subjectId, topicId, termId, week } = searchParams;

//   // Use the school data from the context provider
//   const school = useSchool();

//   const activeSubject = teacher.selectedSubjects.find(s: any => s.id === subjectId)
//     ?? teacher.selectedSubjects[0];

//   if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//   let activeTopic = activeSubject.topics.find(t: any => t.id === topicId);
//   if (!activeTopic && termId && week) {
//     activeTopic = activeSubject.topics.find(t =>
//       t.termId === termId && t.weekNumber === parseInt(week)
//     );
//   }
//   activeTopic = activeTopic ?? activeSubject.topics[0];

//   const subjectsForHeader = teacher.selectedSubjects.map((gs: any) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0,
//   }));

//   // MODIFIED: Use school.id from context
//   const performanceResult = getPerformanceDashboardData(activeSubject.id, school.id); // Remove await
// //I am not 100% so this doesn't work, this may give the errors needed
//   return (
//     // REMOVED: SchoolProvider wrapper here, as it's in layout.tsx
//     <>
//       <DashboardHeader
//         teacherName={teacher.name ?? "Teacher"}
//         subjects={subjectsForHeader}
//         activeSubjectId={activeSubject.id}
//       // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//       // These will now be consumed directly by DashboardHeader via useSchool()
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
//             // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//             // These will now be consumed directly by ActiveTopicCard via useSchool()
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
//             <PerformanceCharts
//               gradeSubjectId={activeSubject.id}
//               schoolId={school.id} // MODIFIED: Use school.id from context
//               initialPerformanceData={null} //REMOVED
//               initialPerformanceError={null} //REMOVED
//             // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//             // These will now be consumed directly by PerformanceCharts via useSchool()
//             />
//           </section>

//           {/* 4. WHATSAPP STATUS - Row 3 (Now on its own row) */}
//           <section>
//             <WhatsAppStatus
//             // REMOVED: schoolPrimaryColor and schoolSecondaryColor props
//             // These will now be consumed directly by WhatsAppStatus via useSchool()
//             />
//           </section>

//         </div>
//       </main>
//     </>
//   );
// }

// src/app/(dashboard)/TeacherDashboardContent.tsx
// 'use client';

// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useSchool } from "@/context/schoolProvider";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// import { GradeSubject, Profile, Assessment } from "@/generated/prisma/client";

// export const dynamic = "force-dynamic";

// interface TeacherDashboardContentProps {

//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// function TeacherDashboardContent({  searchParams }: TeacherDashboardContentProps) {

//     const { subjectId, topicId, termId, week } = searchParams;
//     const school = useSchool();
//     const [performanceResult, setPerformanceResult] = useState<{ data: Assessment[]; error: string | null }>({ // Corrected
//         data: [],
//         error: null,
//     });

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (teacher?.selectedSubjects && teacher.selectedSubjects[0] && school?.id) {
//                 const result = await getPerformanceDashboardData(teacher.selectedSubjects[0].id, school.id);
//                 setPerformanceResult(result);
//             }
//         }
//         loadPerformanceData();
//     }, [teacher, school?.id]);

//     if (!teacher) {
//         return <div className="p-20 text-center">Teacher not found.</div>;
//     }
//     if (!school) {
//         return <div className="p-20 text-center">School not found.</div>;
//     }

//     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0];

//     if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//     let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//     if (!activeTopic && termId && week) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         );
//     }
//     activeTopic = activeTopic ?? activeSubject.topics[0];

//     const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.enrollments?.length ?? 0,
//     }));

//     return (
//         <>
//             <DashboardHeader
//                 teacherName={teacher.name ?? "Teacher"}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject.id}
//             />

//             <main className="flex-1 p-4 md:p-6 space-y-6">
//                 <section>
//                     <Card className="border-dashed bg-muted/30">
//                         <CardContent className="flex items-center justify-between p-4">
//                             <p className="text-sm text-muted-foreground">
//                                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                             </p>
//                             <Button variant="outline" size="sm" asChild>
//                                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="mx-auto max-w-7xl space-y-6">
//                     <section>
//                         <ActiveTopicCard
//                             key={activeSubject.id}
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId}
//                             selectedWeek={week || String(activeTopic?.weekNumber)}
//                         />
//                     </section>

//                     <section>
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "General Subject"}
//                             initialData={activeTopic?.lessons?.[0]?.aiContent as any}
//                         />
//                     </section>

//                     <section>
//                         <PerformanceCharts
//                             gradeSubjectId={activeSubject.id}
//                             schoolId={school.id}
//                             initialPerformanceData={performanceResult.data}
//                             initialPerformanceError={performanceResult.error}
//                         />
//                     </section>

//                     <section>
//                         <WhatsAppStatus />
//                     </section>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default TeacherDashboardContent;


// src/components/TeacherDashboard/teacherDashBoardContent.tsx
// 'use client';

// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useSchool } from "@/context/schoolProvider";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// import { GradeSubject, Profile, Assessment } from "@/generated/prisma/client";


// export const dynamic = "force-dynamic";

// interface TeacherDashboardContentProps {
//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// function TeacherDashboardContent({  searchParams }: TeacherDashboardContentProps) {

//     const { subjectId, topicId, termId, week } = searchParams;
//     const { school, teacher, isLoading } = useSchool(); // Use the useSchool hook

//     const [performanceResult, setPerformanceResult] = useState<{ data: Assessment[]; error: string | null }>({
//         data: [],
//         error: null,
//     });

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (teacher?.selectedSubjects && teacher.selectedSubjects[0] && school) {
//                 const result = await getPerformanceDashboardData(teacher.selectedSubjects[0].id, school.id);
//                 setPerformanceResult(result);
//             }
//         }
//         loadPerformanceData();
//     }, [teacher, school?.id]);

//     if (isLoading) {
//         return <div className="p-20 text-center">Loading...</div>;
//     }

//     if (!teacher) {
//         return <div className="p-20 text-center">Teacher not found.</div>;
//     }
//     if (!school) { // Check if school is available
//         return <div className="p-20 text-center">School data not available.</div>;
//     }

//     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0];

//     if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//     let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//     if (!activeTopic && termId && week) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         );
//     }
//     activeTopic = activeTopic ?? activeSubject.topics[0];

//     const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.enrollments?.length ?? 0,
//     }));

//     return (
//         <>
//             <DashboardHeader
//                 teacherName={teacher.name ?? "Teacher"}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject.id}
//             />

//             <main className="flex-1 p-4 md:p-6 space-y-6">
//                 <section>
//                     <Card className="border-dashed bg-muted/30">
//                         <CardContent className="flex items-center justify-between p-4">
//                             <p className="text-sm text-muted-foreground">
//                                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                             </p>
//                             <Button variant="outline" size="sm" asChild>
//                                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="mx-auto max-w-7xl space-y-6">
//                     <section>
//                         <ActiveTopicCard
//                             key={activeSubject.id}
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId}
//                             selectedWeek={week || String(activeTopic?.weekNumber)}
//                         />
//                     </section>

//                     <section>
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "General Subject"}
//                             initialData={activeTopic?.lessons?.[0]?.aiContent as any}
//                         />
//                     </section>

//                     <section>
//                         <PerformanceCharts
//                             gradeSubjectId={activeSubject.id}
//                             schoolId={school.id}
//                             initialPerformanceData={performanceResult.data}
//                             initialPerformanceError={performanceResult.error}
//                         />
//                     </section>

//                     <section>
//                         <WhatsAppStatus />
//                     </section>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default TeacherDashboardContent;



// src/components/TeacherDashboard/teacherDashBoardContent.tsx
'use client';

// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useSchool } from "@/context/schoolProvider";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// import { GradeSubject, Profile, Assessment } from "@/generated/prisma/client";
// import { useProfileStore } from "@/store/profileStore";

// // export const dynamic = "force-dynamic";

// interface TeacherDashboardContentProps {
//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// console.log("rendering teacherDashboardComponent")

// function TeacherDashboardContent({  searchParams }: TeacherDashboardContentProps) {
//     const { subjectId, topicId, termId, week } = searchParams;
//     const { school, teacher, isLoading } = useSchool(); // Use the useSchool hook
//     const { profile } = useProfileStore(); // Get the profile from the store
//     console.log("profile in teachercontent component:", profile)

//     const [performanceResult, setPerformanceResult] = useState<{ data: Assessment[]; error: string | null }>({
//         data: [],
//         error: null,
//     });

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (profile?.selectedSubjects && profile.selectedSubjects[0] && school) {
//                 const result = await getPerformanceDashboardData(profile.selectedSubjects[0].id, school.id);
//                 setPerformanceResult(result);
//             }
//         }
//         loadPerformanceData();
//     }, [profile, school?.id]);

//     if (isLoading) {
//         return <div className="p-20 text-center">Loading...</div>;
//     }

//     if (!profile) {
//         return <div className="p-20 text-center">Teacher not found.</div>;
//     }
//     if (!school) { // Check if school is available
//         return <div className="p-20 text-center">School data not available.</div>;
//     }

//     const activeSubject = profile.selectedSubjects.find(s => s.id === subjectId)
//         ?? profile.selectedSubjects[0];

//     if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//     let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//     if (!activeTopic && termId && week) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         );
//     }
//     activeTopic = activeTopic ?? activeSubject.topics[0];

//     const subjectsForHeader = profile.selectedSubjects.map((gs) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.enrollments?.length ?? 0,
//     }));

//     return (
//         <>
//             <DashboardHeader
//                 teacherName={profile.name ?? "Teacher"}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject.id}
//             />

//             <main className="flex-1 p-4 md:p-6 space-y-6">
//                 <section>
//                     <Card className="border-dashed bg-muted/30">
//                         <CardContent className="flex items-center justify-between p-4">
//                             <p className="text-sm text-muted-foreground">
//                                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                             </p>
//                             <Button variant="outline" size="sm" asChild>
//                                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="mx-auto max-w-7xl space-y-6">
//                     <section>
//                         <ActiveTopicCard
//                             key={activeSubject.id}
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId}
//                             selectedWeek={week || String(activeTopic?.weekNumber)}
//                         />
//                     </section>

//                     <section>
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "General Subject"}
//                             initialData={activeTopic?.lessons?.[0]?.aiContent as any}
//                         />
//                     </section>

//                     <section>
//                         <PerformanceCharts
//                             gradeSubjectId={activeSubject.id}
//                             schoolId={school.id}
//                             initialPerformanceData={performanceResult.data}
//                             initialPerformanceError={performanceResult.error}
//                         />
//                     </section>

//                     <section>
//                         <WhatsAppStatus />
//                     </section>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default TeacherDashboardContent;

// src/components/TeacherDashboard/teacherDashBoardContent.tsx
// 'use client';

// import Link from "next/link";
// import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
// import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
// import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
// import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
// import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { useSchool } from "@/context/schoolProvider";
// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";
// import { getPerformanceDashboardData } from "@/app/actions/performance-data";
// import { GradeSubject, Profile, Assessment } from "@/generated/prisma/client";
// import { useProfileStore } from "@/store/profileStore";
// import { ProfileInStore } from "@/types/profile";

// export const dynamic = "force-dynamic";

// interface TeacherDashboardContentProps {
//     teacher: ProfileInStore | null; // Receive teacher as a prop
//     searchParams: {
//         subjectId?: string;
//         topicId?: string;
//         termId?: string;
//         week?: string;
//     };
// }

// function TeacherDashboardContent({ teacher, searchParams }: TeacherDashboardContentProps) {
//     const { subjectId, topicId, termId, week } = searchParams;

//     console.log('subjectId from params in teacher content', subjectId)
//     console.log('topicId from params in teacher content', topicId)
//     console.log('termId from params in teacher content', termId)
//     console.log('week from params in teacher content', week)

//     const { school } = useSchool(); // Use the useSchool hook
//     // No useProfileStore() here

//     const [performanceResult, setPerformanceResult] = useState<{ data: Assessment[]; error: string | null }>({
//         data: [],
//         error: null,
//     });

//     useEffect(() => {
//         async function loadPerformanceData() {
//             if (teacher?.selectedSubjects && teacher.selectedSubjects[0] && school) {
//                 const result = await getPerformanceDashboardData(teacher.selectedSubjects[0].id, school.id);
//                 setPerformanceResult(result);
//             }
//         }
//         loadPerformanceData();
//     }, [teacher, school?.id]);

//     if (!teacher) {
//         return <div className="p-20 text-center">Teacher not found.</div>;
//     }
//     if (!school) { // Check if school is available
//         return <div className="p-20 text-center">School data not available.</div>;
//     }

//     const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
//         ?? teacher.selectedSubjects[0];

//     if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

//     let activeTopic = activeSubject.topics.find(t => t.id === topicId);
//     if (!activeTopic && termId && week) {
//         activeTopic = activeSubject.topics.find(t =>
//             t.termId === termId && t.weekNumber === parseInt(week || '0')
//         );
//     }
//     activeTopic = activeTopic ?? activeSubject.topics[0];

//     const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
//         id: gs.id,
//         displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//         studentCount: gs.enrollments?.length ?? 0,
//     }));

//     return (
//         <>
//             <DashboardHeader
//                 teacherName={teacher.name ?? "Teacher"}
//                 subjects={subjectsForHeader}
//                 activeSubjectId={activeSubject.id}
//             />

//             <main className="flex-1 p-4 md:p-6 space-y-6">
//                 <section>
//                     <Card className="border-dashed bg-muted/30">
//                         <CardContent className="flex items-center justify-between p-4">
//                             <p className="text-sm text-muted-foreground">
//                                 Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
//                             </p>
//                             <Button variant="outline" size="sm" asChild>
//                                 <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
//                             </Button>
//                         </CardContent>
//                     </Card>
//                 </section>

//                 <div className="mx-auto max-w-7xl space-y-6">
//                     <section>
//                         <ActiveTopicCard
//                             key={activeSubject.id}
//                             activeSubject={activeSubject}
//                             activeTopic={activeTopic}
//                             selectedTermId={termId || activeTopic?.termId}
//                             selectedWeek={week || String(activeTopic?.weekNumber)}
//                         />
//                     </section>

//                     <section>
//                         <AILessonPlanner
//                             topicId={activeTopic?.id ?? ""}
//                             lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
//                             topicTitle={activeTopic?.title ?? "General Subject"}
//                             initialData={activeTopic?.lessons?.[0]?.aiContent as any}
//                         />
//                     </section>

//                     <section>
//                         <PerformanceCharts
//                             gradeSubjectId={activeSubject.id}
//                             schoolId={school.id}
//                             initialPerformanceData={performanceResult.data}
//                             initialPerformanceError={performanceResult.error}
//                         />
//                     </section>

//                     <section>
//                         <WhatsAppStatus />
//                     </section>
//                 </div>
//             </main>
//         </>
//     );
// }

// export default TeacherDashboardContent;


'use client';

import Link from "next/link";
import { DashboardHeader } from "@/components/TeacherDashboard/dashboard-header";
import { ActiveTopicCard } from "@/components/TeacherDashboard/active-topic-card";
import { PerformanceCharts } from "@/components/TeacherDashboard/performance-charts";
import { AILessonPlanner } from "@/components/TeacherDashboard/ai-learning-planner";
import { WhatsAppStatus } from "@/components/TeacherDashboard/whatsapp-status";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSchool } from "@/context/schoolProvider";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getPerformanceDashboardData } from "@/app/actions/performance-data";
import { Assessment } from "@/generated/prisma/client";
import { ProfileInStore } from "@/types/profile";
import { PerformanceDashboardData } from "@/types/performanceData";

export const dynamic = "force-dynamic";

interface TeacherDashboardContentProps {
    teacher: ProfileInStore | null;
}

function TeacherDashboardContent({ teacher }: TeacherDashboardContentProps) {
    // Read params directly from the URL on the client — no prop needed
    const searchParams = useSearchParams();
    const subjectId = searchParams.get('subjectId') ?? undefined;
    const topicId = searchParams.get('topicId') ?? undefined;
    const termId = searchParams.get('termId') ?? undefined;
    const week = searchParams.get('week') ?? undefined;

    const { school } = useSchool();

    const [performanceResult, setPerformanceResult] = useState<{ data: PerformanceDashboardData | null; error: string | null }>({
        data: null,
        error: null,
    });

    useEffect(() => {
        async function loadPerformanceData() {
            if (teacher?.selectedSubjects && teacher.selectedSubjects[0] && school) {
                const result = await getPerformanceDashboardData(teacher.selectedSubjects[0].id, school.id);
                setPerformanceResult(result);
            }
        }
        loadPerformanceData();
    }, [teacher, school?.id]);

    if (!teacher) {
        return <div className="p-20 text-center">Teacher not found.</div>;
    }
    if (!school) {
        return <div className="p-20 text-center">School data not available.</div>;
    }

    const activeSubject = teacher.selectedSubjects.find(s => s.id === subjectId)
        ?? teacher.selectedSubjects[0];

    if (!activeSubject) return <div className="p-20 text-center">No subjects assigned.</div>;

    let activeTopic = activeSubject.topics.find(t => t.id === topicId);
    if (!activeTopic && termId && week) {
        activeTopic = activeSubject.topics.find(t =>
            t.termId === termId && t.weekNumber === parseInt(week || '0')
        );
    }
    activeTopic = activeTopic ?? activeSubject.topics[0];

    const subjectsForHeader = teacher.selectedSubjects.map((gs) => ({
        id: gs.id,
        displayName: `${gs.grade.displayName} ${gs.subject.name}`,
        studentCount: gs.enrollments?.length ?? 0,
    }));

    return (
        <div className="flex flex-col w-full min-h-screen overflow-x-hidden">
            <DashboardHeader
                teacherName={teacher.name ?? "Teacher"}
                subjects={subjectsForHeader}
                activeSubjectId={activeSubject.id}
            />

            <main className="flex-1 p-4 md:p-6 space-y-6 w-full overflow-x-hidden">
                <section>
                    <Card className="border-dashed bg-muted/30">
                        <CardContent className="flex items-center justify-between p-4">
                            <p className="text-sm text-muted-foreground">
                                Viewing: <strong>{activeSubject.grade.displayName} {activeSubject.subject.name}</strong>
                            </p>
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/subjects/manage?role=teacher">Edit Assignments</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>

                {/* Constrain max width and allow vertical scroll */}
                <div className="w-full max-w-7xl mx-auto space-y-6">
                    <section className="w-full">
                        <ActiveTopicCard
                            key={activeSubject.id}
                            activeSubject={activeSubject}
                            activeTopic={activeTopic}
                            selectedTermId={termId || activeTopic?.termId}
                            selectedWeek={week || String(activeTopic?.weekNumber)}
                        />
                    </section>

                    <section className="w-full">
                        <AILessonPlanner
                            topicId={activeTopic?.id ?? ""}
                            lessonId={activeTopic?.lessons?.[0]?.id ?? ""}
                            topicTitle={activeTopic?.title ?? "General Subject"}
                            initialData={activeTopic?.lessons?.[0]?.aiContent as any}
                        />
                    </section>

                    <section className="w-full">
                        <PerformanceCharts
                            gradeSubjectId={activeSubject.id}
                            schoolId={school.id}
                            // Pass the fetched data down
                            initialPerformanceData={performanceResult.data}
                            initialPerformanceError={performanceResult.error}
                        />
                    </section>

                    <section className="w-full">
                        <WhatsAppStatus />
                    </section>
                </div>
            </main>
        </div>
    );
}

export default TeacherDashboardContent;