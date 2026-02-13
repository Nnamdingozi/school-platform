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

// type GradeSubjectWithRelations = Prisma.GradeSubjectGetPayload<{
//   include: {
//     grade: true;
//     subject: true;
//     classEnrollments: true;
//   };
// }>;

// type TeacherWithSelectedSubjects = Prisma.ProfileGetPayload<{
//   include: {
//     selectedSubjects: {
//       include: {
//         grade: true;
//         subject: true;
//         classEnrollments: true;
//       };
//     };
//   };
// }>;

// type SubjectOption = {
//   id: string;
//   displayName: string;
//   studentCount: number;
// };

// async function getTeacherWithSubjects(): Promise<{
//   teacherName: string;
//   subjects: SubjectOption[];
// }> {
//   const teacherEmail = "teacher@lagosacademy.test";

//   const teacher = await prisma.profile.findUnique<TeacherWithSelectedSubjects>({
//     where: { email: teacherEmail },
//     include: {
//       selectedSubjects: {
//         include: {
//           grade: true,
//           subject: true,
//           classEnrollments: true,
//         },
//       },
//     },
//   });

//   const teacherName = teacher?.name ?? "Teacher";

//   const subjects: SubjectOption[] =
//     teacher?.selectedSubjects.map((gradeSubject: GradeSubjectWithRelations) => ({
//       id: gradeSubject.id,
//       // UI requirement: "[Grade Name] [Subject Name]"
//       displayName: `${gradeSubject.grade.displayName} ${gradeSubject.subject.name}`,
//       // Student Count Logic: number of classEnrollments per GradeSubject
//       studentCount: gradeSubject.classEnrollments.length,
//     })) ?? [];

//   return {
//     teacherName,
//     subjects,
//   };
// }

// export default async function TeacherDashboard() {
//   const { teacherName, subjects } = await getTeacherWithSubjects();

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <DashboardHeader teacherName={teacherName} subjects={subjects} />
//         <main className="flex-1 overflow-auto p-4 md:p-6">

//           {/* Subject Management Link */}
//           <section>
//               <Card className="border-dashed">
//                 <CardHeader>
//                   <CardTitle>Manage Your Subjects</CardTitle>
//                 </CardHeader>
//                 <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                   <p className="text-sm text-muted-foreground">
//                     Choose which grades and subjects you actively teach. This
//                     helps personalize your dashboard and planning tools.
//                   </p>
//                   <Button asChild>
//                     <Link href="/subjects/manage?role=teacher">
//                       Open Subject Management
//                     </Link>
//                   </Button>
//                 </CardContent>
//               </Card>
//             </section>
            
//           <div className="mx-auto max-w-7xl space-y-6">
            
//             {/* Active Topic Section */}
//             <section>
//               <ActiveTopicCard />
//             </section>

//             {/* Performance Overview Section */}
//             <section>
//               <h2 className="mb-4 text-lg font-semibold text-foreground">
//                 Student Performance Overview
//               </h2>
//               <PerformanceCharts />
//             </section>

//             {/* AI Lesson Planner and WhatsApp Status */}
//             <section className="grid gap-6 lg:grid-cols-2">
//               <AILessonPlanner />
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

// /**
//  * 1. THE QUERY BLUEPRINT
//  * We define the data structure here with 'as const' so Prisma 7
//  * can generate the exact types for the nested relations.
//  */
// const teacherQuery = {
//   include: {
//     selectedSubjects: {
//       include: {
//         grade: true,
//         subject: true,
//         classEnrollments: true, // This unlocks the array for studentCount
//       },
//     },
//   },
// } as const;

// /**
//  * 2. AUTOMATIC TYPE INFERENCE
//  * This creates a type that matches the result of the query above exactly.
//  */
// type TeacherProfile = Prisma.ProfileGetPayload<typeof teacherQuery>;


// type SubjectOption = {
//   id: string;
//   displayName: string;
//   studentCount: number;
// };

// async function getTeacherWithSubjects() {
//   const teacherEmail = "teacher@lagosacademy.test";

//   const teacher = (await prisma.profile.findUnique({
//     where: { email: teacherEmail },
//     include: {
//       selectedSubjects: {
//         include: {
//           grade: true,
//           subject: true,
//           enrollments: true, // Fetch the students!
//         },
//       },
//     },
//   })) as TeacherProfile | null;

//   const teacherName = teacher?.name ?? "Teacher";

//   // Now .length will work because TypeScript sees the array!
//   const subjects = teacher?.selectedSubjects.map((gs) => ({
//     id: gs.id,
//     displayName: `${gs.grade.displayName} ${gs.subject.name}`,
//     studentCount: gs.enrollments?.length ?? 0, 
//   })) ?? [];

//   return { teacherName, subjects };
// }
// export default async function TeacherDashboard() {
//   const { teacherName, subjects } = await getTeacherWithSubjects();

//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <DashboardHeader teacherName={teacherName} subjects={subjects} />
//         <main className="flex-1 overflow-auto p-4 md:p-6">
//           {/* Subject Management Link */}
//           <section>
//             <Card className="border-dashed">
//               <CardHeader>
//                 <CardTitle>Manage Your Subjects</CardTitle>
//               </CardHeader>
//               <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <p className="text-sm text-muted-foreground">
//                   Choose which grades and subjects you actively teach. This
//                   helps personalize your dashboard and planning tools.
//                 </p>
//                 <Button asChild>
//                   <Link href="/subjects/manage?role=teacher">
//                     Open Subject Management
//                   </Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           </section>

//           <div className="mx-auto max-w-7xl space-y-6">
//             {/* Active Topic Section */}
//             <section>
//               <ActiveTopicCard />
//             </section>

//             {/* Performance Overview Section */}
//             <section>
//               <h2 className="mb-4 text-lg font-semibold text-foreground">
//                 Student Performance Overview
//               </h2>
//               <PerformanceCharts />
//             </section>

//             {/* AI Lesson Planner and WhatsApp Status */}
//             <section className="grid gap-6 lg:grid-cols-2">
//               <AILessonPlanner />
//               <WhatsAppStatus />
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

/**
 * 1. THE QUERY DEFINITION
 * We use 'as const' so Prisma can infer the exact return types.
 * Relationship name 'enrollments' matches GradeSubject in schema.prisma.
 */
const teacherQuery = {
  include: {
    selectedSubjects: {
      include: {
        grade: true,
        subject: true,
        enrollments: true, // This is the fix: matches the schema relation name
      },
    },
  },
} as const;

/**
 * 2. TYPE INFERENCE
 */
type TeacherProfile = Prisma.ProfileGetPayload<typeof teacherQuery>;

type SubjectOption = {
  id: string;
  displayName: string;
  studentCount: number;
};

/**
 * 3. DATA FETCHING
 */
async function getTeacherWithSubjects(): Promise<{
  teacherName: string;
  subjects: SubjectOption[];
}> {
  // Update this to use your actual auth session email in production
  const teacherEmail = "teacher@lagosacademy.test";

  const teacher = (await prisma.profile.findUnique({
    where: { email: teacherEmail },
    include: teacherQuery.include,
  })) as TeacherProfile | null;

  const teacherName = teacher?.name ?? "Teacher";

  // Map the Prisma results to the format expected by the DashboardHeader
  const subjects: SubjectOption[] =
    teacher?.selectedSubjects.map((gs) => ({
      id: gs.id,
      displayName: `${gs.grade.displayName} ${gs.subject.name}`,
      // .enrollments is now correctly typed as an array
      studentCount: gs.enrollments?.length ?? 0,
    })) ?? [];

  return {
    teacherName,
    subjects,
  };
}

/**
 * 4. DASHBOARD PAGE COMPONENT
 */
export default async function TeacherDashboard() {
  const { teacherName, subjects } = await getTeacherWithSubjects();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* The subjects array here provides the dropdown in the header */}
        <DashboardHeader teacherName={teacherName} subjects={subjects} />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
            
            {/* Subject Management Link */}
            <section>
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle>Manage Your Subjects</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-muted-foreground">
                    Choose which grades and subjects you actively teach. This
                    helps personalize your dashboard and planning tools.
                  </p>
                  <Button asChild>
                    <Link href="/subjects/manage?role=teacher">
                      Open Subject Management
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>

            {/* Active Topic Section */}
            <section>
              <ActiveTopicCard />
            </section>

            {/* Performance Overview Section */}
            <section>
              <h2 className="mb-4 text-lg font-semibold text-foreground">
                Student Performance Overview
              </h2>
              <PerformanceCharts />
            </section>

            {/* AI Lesson Planner and WhatsApp Status */}
            <section className="grid gap-6 lg:grid-cols-2">
              <AILessonPlanner />
              <WhatsAppStatus />
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}