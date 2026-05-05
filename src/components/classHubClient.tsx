// 'use client'

// import { useProfileStore } from "@/store/profileStore"
// import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
// import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
// import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/studentClassView"
// import { Role } from "@prisma/client"
// import { Loader2, ShieldAlert } from "lucide-react"

// interface ClassesHubProps {
//     initialData: any; // Strictly cast inside the render block
//     helpers: any;
//     userRole: Role;
// }

// /**
//  * UNIFIED CLASSROOM HUB
//  * Rule 13: Graceful Tier Fallbacks.
//  * Rule 17: Anti-Prop Drilling (Uses Zustand for current session context).
//  */
// export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
//     const { profile } = useProfileStore();

//     if (!initialData && userRole !== Role.SCHOOL_ADMIN) {
//         return (
//             <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
//                 <ShieldAlert className="h-12 w-12 text-slate-800" />
//                 <p className="text-slate-500 uppercase font-black text-[10px] tracking-widest">
//                     Registry Entry Not Found or Access Restricted
//                 </p>
//             </div>
//         );
//     }

//     return (
//         <div className="animate-in fade-in duration-700">
            
//             {/* ── Tier 2: Admin Registry Management ── */}
//             {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && (
//                 <AdminClassView
//                     initialData={initialData}
//                     helpers={helpers}
//                     profile={profile!}
//                 />
//             )}

//             {/* ── Tier 2: Teacher Load View ── */}
//             {userRole === Role.TEACHER && (
//                 <TeacherClassView
//                     data={initialData}
//                 />
//             )}

//             {/* ── Tier 2: Student Peer Registry ── */}
//             {userRole === Role.STUDENT && (
//                 <StudentClassView
//                     data={initialData as StudentClassRegistryData}
//                 />
//             )}
            
//         </div>
//     );
// }



'use client'

import { useProfileStore } from "@/store/profileStore"
import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
import { Role } from "@prisma/client"
import { Loader2, ShieldAlert } from "lucide-react"


interface ClassesHubProps {
    initialData: any; // Strictly cast inside the render logic
    helpers: any;
    userRole: Role;
}

/**
 * UNIFIED CLASSROOM HUB
 * Rule 13: Graceful Tier Fallbacks.
 * Rule 17: Anti-Prop Drilling - uses Zustand for session context.
 */
export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
    const { profile } = useProfileStore();

    if (!initialData && userRole !== Role.SCHOOL_ADMIN) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4">
                <ShieldAlert className="h-12 w-12 text-slate-800" />
                <p className="text-slate-500 uppercase font-black text-[10px] tracking-widest">
                    Registry Entry Not Found or Access Restricted
                </p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-700">
            
            {/* ── Tier 2: Admin Registry Management ── */}
            {/* ✅ FIXED: Removed 'profile' prop to resolve Error 2322 */}
            {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && (
                <AdminClassView
                    initialData={initialData}
                    helpers={helpers}
                />
            )}

            {/* ── Tier 2: Teacher Load View ── */}
            {userRole === Role.TEACHER && (
                <TeacherClassView
                    data={initialData}
                />
            )}

            {/* ── Tier 2: Student Peer Registry ── */}
            {userRole === Role.STUDENT && (
                <StudentClassView
                    data={initialData as StudentClassRegistryData}
                />
            )}
            
        </div>
    );
}