
// // src/app/(dashboard)/teacher/page.tsx
// import { Suspense } from 'react';
// import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
// import { getTeacherData } from "@/app/actions/teacherData";

// export const dynamic = "force-dynamic";

// export default async function TeacherDashboardPage() {
//     const email = "teacher@lagosacademy.test";
//     const teacher = await getTeacherData(email);

//     if (!teacher) {
//         return <div className="p-20 text-center">Teacher not found.</div>;
//     }

//     return (
//         <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
//             <Suspense fallback={
//                 <div className="flex items-center justify-center min-h-screen">
//                     <p className="text-muted-foreground">Loading...</p>
//                 </div>
//             }>
//                 <TeacherDashboardContent teacher={teacher} />
//             </Suspense>
//         </div>
//     );
// }


import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import TeacherDashboardContent from "@/components/TeacherDashboard/teacherDashBoardContent";
import { getTeacherData } from "@/app/actions/teacherData";
import { type ProfileInStore } from '@/types/profile'; // Ensure this path is correct

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        redirect('/login');
    }

    const teacherData = await getTeacherData(user.email!);

    if (!teacherData || teacherData.role !== 'TEACHER') {
        return (
            <div className="p-20 text-center">
                <p className="text-slate-400 italic font-medium">
                    Institutional record not found or access restricted.
                </p>
            </div>
        );
    }

    // ✅ FIX: Cast the data to ProfileInStore
    // We can safely cast because the 'include' in the action now matches the interface
    const teacher = teacherData as unknown as ProfileInStore;

    return (
        <div className="flex flex-col min-h-screen w-full overflow-x-hidden">
            <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                    <div className="flex items-center gap-3">
                         <span className="h-5 w-5 rounded-full border-2 border-t-transparent border-school-primary animate-spin" />
                         <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">Loading_Session...</p>
                    </div>
                </div>
            }>
                <TeacherDashboardContent teacher={teacher} />
            </Suspense>
        </div>
    );
}