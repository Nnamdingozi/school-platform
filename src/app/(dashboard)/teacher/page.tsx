
// src/app/(dashboard)/teacher/page.tsx
import { Suspense } from 'react';
// This is a “Please wait” sign ⏳ If things are slow, we show Loading… so nobody gets confused.
import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// the actual dashboard UI? This is the actual classroom It contains all the teacher’s information.
import { getTeacherData } from "@/app/actions/teacherData";
// a function that fetches teacher info

export const dynamic = "force-dynamic";
// Don’t use old information. Always get the newest one.”

export default async function TeacherDashboardPage() {
    // This tells Next.js: // “Don’t cache this page. Always get fresh data.” “Wait a little… we need to fetch something first.”
    const email = "teacher@lagosacademy.test";
    // Go find THIS teacher.”
    const teacher = await getTeacherData(email);
    // We send our helper to get the teacher’s info.
    // We must wait (await) because it takes time to bring it back.

    if (!teacher) {
        return <div className="p-20 text-center">Teacher not found.</div>;
    }
    // If the teacher is missing, we say: “Oops! We can’t find them.”

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            }>
                {/* it let the user know that it is still wokin it */}
                <TeacherDashboardContent teacher={teacher} />
                {/* Now we give the classroom the teacher’s data, and it displays everything. */}
            </Suspense>
        </div>
    );
}



// in summary the code says

// Go find the teacher → wait while loading → if found, show their dashboard → if not, show an error.
