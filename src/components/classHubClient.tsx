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



// 'use client'

// import { useProfileStore } from "@/store/profileStore"
// import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
// import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
// import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
// import { Role } from "@prisma/client"
// import { Loader2, ShieldAlert } from "lucide-react"


// interface ClassesHubProps {
//     initialData: any; // Strictly cast inside the render logic
//     helpers: any;
//     userRole: Role;
// }

// /**
//  * UNIFIED CLASSROOM HUB
//  * Rule 13: Graceful Tier Fallbacks.
//  * Rule 17: Anti-Prop Drilling - uses Zustand for session context.
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
//             {/* ✅ FIXED: Removed 'profile' prop to resolve Error 2322 */}
//             {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && (
//                 <AdminClassView
//                     initialData={initialData}
//                     helpers={helpers}
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

import React from "react"
import { useProfileStore } from "@/store/profileStore"
import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
import { Role } from "@prisma/client"
import { Loader2, ShieldAlert } from "lucide-react"
import { cn } from "@/lib/utils"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ClassesHubProps {
    initialData: unknown; // Bridged via 'unknown' to ensure safe internal casting
    helpers: any;        // Contextual metadata for Admin views
    userRole: Role;
}

/**
 * UNIFIED CLASSROOM HUB (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 13: Contextual Fallbacks - Dynamic switching based on Role Identity.
 * Rule 17: Anti-Prop Drilling - uses Zustand for session validation.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
    const { profile, isLoading } = useProfileStore();

    // ── LOADING STATE (Rule 14/18/21) ──
    if (isLoading) {
        return (
            <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 bg-background animate-in fade-in duration-500">
                <div className="relative">
                    <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                    <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
                </div>
                <p className="text-muted-foreground font-extrabold uppercase italic text-[10px] tracking-[0.3em] animate-pulse">
                    Synchronizing_Identity_Hub...
                </p>
            </div>
        );
    }

    // ── SECURITY GUARD (Rule 10/13) ──
    if (!initialData && userRole !== Role.SCHOOL_ADMIN && userRole !== Role.SUPER_ADMIN) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-700">
                <div className="max-w-md w-full text-center space-y-8 bg-card p-10 md:p-12 rounded-[2rem] border border-border shadow-2xl">
                    <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <ShieldAlert className="h-10 w-10 text-destructive" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">Access Restricted</h2>
                        <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
                            Identity Registry not discovered or authorization scope insufficient for this classroom hub.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full animate-in fade-in duration-700">
            <main className="w-full">
                
                {/* ── Tier 2: Institutional Registry Management ── */}
                {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && (
                    <div className="animate-in slide-in-from-bottom-4 duration-1000">
                        <AdminClassView
                            initialData={initialData as any}
                            helpers={helpers}
                        />
                    </div>
                )}

                {/* ── Tier 2: Faculty Workload Hub ── */}
                {userRole === Role.TEACHER && (
                    <div className="animate-in slide-in-from-bottom-4 duration-1000">
                        <TeacherClassView
                            data={initialData as any}
                        />
                    </div>
                )}

                {/* ── Tier 3: Student Identity Registry ── */}
                {userRole === Role.STUDENT && (
                    <div className="animate-in slide-in-from-bottom-4 duration-1000">
                        <StudentClassView
                            data={initialData as StudentClassRegistryData}
                        />
                    </div>
                )}

            </main>
        </div>
    );
}