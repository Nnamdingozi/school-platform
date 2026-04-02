
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
