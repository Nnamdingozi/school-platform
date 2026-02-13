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

type GradeSubjectWithRelations = Prisma.GradeSubjectGetPayload<{
  include: {
    grade: true;
    subject: true;
    classEnrollments: true;
  };
}>;

type TeacherWithSelectedSubjects = Prisma.ProfileGetPayload<{
  include: {
    selectedSubjects: {
      include: {
        grade: true;
        subject: true;
        classEnrollments: true;
      };
    };
  };
}>;

type SubjectOption = {
  id: string;
  displayName: string;
  studentCount: number;
};

async function getTeacherWithSubjects(): Promise<{
  teacherName: string;
  subjects: SubjectOption[];
}> {
  const teacherEmail = "teacher@lagosacademy.test";

  const teacher = await prisma.profile.findUnique<TeacherWithSelectedSubjects>({
    where: { email: teacherEmail },
    include: {
      selectedSubjects: {
        include: {
          grade: true,
          subject: true,
          classEnrollments: true,
        },
      },
    },
  });

  const teacherName = teacher?.name ?? "Teacher";

  const subjects: SubjectOption[] =
    teacher?.selectedSubjects.map((gradeSubject: GradeSubjectWithRelations) => ({
      id: gradeSubject.id,
      // UI requirement: "[Grade Name] [Subject Name]"
      displayName: `${gradeSubject.grade.displayName} ${gradeSubject.subject.name}`,
      // Student Count Logic: number of classEnrollments per GradeSubject
      studentCount: gradeSubject.classEnrollments.length,
    })) ?? [];

  return {
    teacherName,
    subjects,
  };
}

export default async function TeacherDashboard() {
  const { teacherName, subjects } = await getTeacherWithSubjects();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader teacherName={teacherName} subjects={subjects} />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl space-y-6">
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
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

