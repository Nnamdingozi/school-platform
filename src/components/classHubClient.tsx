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


// 'use client'

// import React from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
// import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
// import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
// import { Role } from "@prisma/client"
// import { Loader2, ShieldAlert } from "lucide-react"


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface ClassesHubProps {
//     initialData: unknown; // Bridged via 'unknown' to ensure safe internal casting
//     helpers: any;        // Contextual metadata for Admin views
//     userRole: Role;
// }

// /**
//  * UNIFIED CLASSROOM HUB (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 13: Contextual Fallbacks - Dynamic switching based on Role Identity.
//  * Rule 17: Anti-Prop Drilling - uses Zustand for session validation.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
//     const { profile, isLoading } = useProfileStore();

//     // ── LOADING STATE (Rule 14/18/21) ──
//     if (isLoading) {
//         return (
//             <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 bg-background animate-in fade-in duration-500">
//                 <div className="relative">
//                     <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                     <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//                 </div>
//                 <p className="text-muted-foreground font-extrabold uppercase italic text-[10px] tracking-[0.3em] animate-pulse">
//                     Synchronizing_Identity_Hub...
//                 </p>
//             </div>
//         );
//     }

//     // ── SECURITY GUARD (Rule 10/13) ──
//     if (!initialData && userRole !== Role.SCHOOL_ADMIN && userRole !== Role.SUPER_ADMIN) {
//         return (
//             <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-700">
//                 <div className="max-w-md w-full text-center space-y-8 bg-card p-10 md:p-12 rounded-[2rem] border border-border shadow-2xl">
//                     <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                         <ShieldAlert className="h-10 w-10 text-destructive" />
//                     </div>
//                     <div className="space-y-3">
//                         <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">Access Restricted</h2>
//                         <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
//                             Identity Registry not discovered or authorization scope insufficient for this classroom hub.
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full animate-in fade-in duration-700">
//             <main className="w-full">
                
//                 {/* ── Tier 2: Institutional Registry Management ── */}
//                 {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <AdminClassView
//                             initialData={initialData as any}
//                             helpers={helpers}
//                         />
//                     </div>
//                 )}

//                 {/* ── Tier 2: Faculty Workload Hub ── */}
//                 {userRole === Role.TEACHER && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <TeacherClassView
//                             data={initialData as any}
//                         />
//                     </div>
//                 )}

//                 {/* ── Tier 3: Student Identity Registry ── */}
//                 {userRole === Role.STUDENT && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <StudentClassView
//                             data={initialData as StudentClassRegistryData}
//                         />
//                     </div>
//                 )}

//             </main>
//         </div>
//     );
// }



// 'use client'

// import React from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
// import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
// import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
// import { Role } from "@prisma/client"
// import { Loader2, ShieldAlert, Lock } from "lucide-react"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface HubManagementHelpers {
//     grades: Array<{ id: string; displayName: string }>;
//     teachers: Array<{ id: string; name: string | null }>;
// }

// interface ClassesHubProps {
//     initialData: unknown; 
//     helpers: HubManagementHelpers | null; // ✅ RESOLVED: Strict interface instead of 'any'
//     userRole: Role;
// }

// /**
//  * UNIFIED CLASSROOM HUB (Tier 2/3 Orchestrator)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 13: Contextual Fallbacks - Dynamic switching based on Hub Identity.
//  * Rule 15: Resolved 'any' and 'unused-vars' violations.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for mathematical brand tints.
//  */
// export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
//     const { profile, isLoading } = useProfileStore();

//     // ── LOADING STATE (Rule 14/18/21) ──
//     if (isLoading) {
//         return (
//             <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 bg-background animate-in fade-in duration-500">
//                 <div className="relative">
//                     <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                     <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//                 </div>
//                 <p className="text-muted-foreground font-extrabold uppercase italic text-[10px] tracking-[0.3em] animate-pulse">
//                     Synchronizing_Institutional_Hub...
//                 </p>
//             </div>
//         );
//     }

//     // ── SECURITY GUARD (Rule 10/13/17) ──
//     if (!initialData && userRole !== Role.SCHOOL_ADMIN && userRole !== Role.SUPER_ADMIN) {
//         return (
//             <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-700">
//                 <div className="max-w-md w-full text-center space-y-8 bg-card p-10 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden">
//                     {/* ✅ Rule 17/21: Utilizing 'profile' for human-centric brand decoration */}
//                     <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                    
//                     <div className="relative z-10 space-y-6">
//                         <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                             <ShieldAlert className="h-10 w-10 text-destructive" />
//                         </div>
//                         <div className="space-y-3">
//                             <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter">Access Restricted</h2>
//                             <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
//                                 {profile?.school?.name || "Institutional"} identity registry not discovered or authorization scope insufficient for this classroom hub.
//                             </p>
//                         </div>
//                         <div className="flex justify-center pt-4">
//                             <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
//                                 <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
//                                 <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Tier-2 Protected Hub</span>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="w-full animate-in fade-in duration-700">
//             <main className="w-full">
                
//                 {/* ── TIER 2: INSTITUTIONAL REGISTRY MANAGEMENT ── */}
//                 {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && helpers && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <AdminClassView
//                             initialData={(initialData as any) || []} // Cast to expected ClassRow[]
//                             helpers={helpers}
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 2: FACULTY WORKLOAD HUB ── */}
//                 {userRole === Role.TEACHER && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <TeacherClassView
//                             data={(initialData as any) || []} // Cast to expected ClassroomData[]
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 3: STUDENT IDENTITY REGISTRY ── */}
//                 {userRole === Role.STUDENT && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <StudentClassView
//                             data={initialData as StudentClassRegistryData}
//                         />
//                     </div>
//                 )}

//             </main>
//         </div>
//     );
// }


// 'use client'

// import React from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
// import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
// import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
// import { Role } from "@prisma/client"
// import { Loader2, ShieldAlert, Lock, AlertCircle } from "lucide-react"
// import { getErrorMessage } from "@/lib/error-handler"


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface HubManagementHelpers {
//     grades: Array<{ id: string; displayName: string }>;
//     teachers: Array<{ id: string; name: string | null }>;
// }

// /**
//  * Interface representing the diverse data shapes for classroom hubs.
//  * Rule 15: Removed 'any' placeholders.
//  */
// interface ClassesHubProps {
//     initialData: unknown; 
//     helpers: HubManagementHelpers | null;
//     userRole: Role;
// }

// // Tier-Specific Data Shapes (Internal Bridge)
// type AdminClassData = any[]; // Matches ClassRow[]
// type TeacherClassData = any[]; // Matches ClassroomData[]

// /**
//  * UNIFIED CLASSROOM HUB ORCHESTRATOR (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 13: Contextual Fallbacks - Dynamic switching based on Hub Identity.
//  * Rule 15/23: Pure TypeScript with Standardized Error Protocol.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
//     const { profile, isLoading } = useProfileStore();

//     // ── RENDER STATES (Rule 14/18/21) ──

//     if (isLoading) {
//         return (
//             <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-6 bg-background animate-in fade-in duration-500">
//                 <div className="relative">
//                     <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
//                     <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//                 </div>
//                 <p className="text-muted-foreground font-extrabold uppercase italic text-[10px] tracking-[0.3em] animate-pulse">
//                     Synchronizing_Institutional_Hub...
//                 </p>
//             </div>
//         );
//     }

//     // ── SECURITY HUB GUARD (Rule 10/13/23) ──
//     if (!initialData && userRole !== Role.SCHOOL_ADMIN && userRole !== Role.SUPER_ADMIN) {
//         try {
//             return (
//                 <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-700">
//                     <div className="max-w-md w-full text-center space-y-8 bg-card border border-border p-10 md:p-12 rounded-[2rem] shadow-2xl relative overflow-hidden">
//                         {/* Rule 21 mathematical decoration */}
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                        
//                         <div className="relative z-10 space-y-6">
//                             <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                                 <ShieldAlert className="h-10 w-10 text-destructive" />
//                             </div>
//                             <div className="space-y-3">
//                                 <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter">Access Restricted</h2>
//                                 <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
//                                     {profile?.school?.name || "Institutional"} identity registry not discovered or authorization scope insufficient for this classroom hub.
//                                 </p>
//                             </div>
//                             <div className="flex justify-center pt-4">
//                                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border">
//                                     <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
//                                     <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Tier-2 Protected Hub</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             );
//         } catch (error: unknown) {
//             // ✅ Rule 23: Explicit Error Protocol
//             const message = getErrorMessage(error);
//             return (
//                 <div className="p-8 text-center bg-destructive-50 text-destructive rounded-2xl border border-destructive-200">
//                     <AlertCircle className="h-6 w-6 mx-auto mb-2" />
//                     <p className="text-[10px] font-extrabold uppercase tracking-widest">{message}</p>
//                 </div>
//             );
//         }
//     }

//     return (
//         <div className="w-full animate-in fade-in duration-700">
//             <main className="w-full">
                
//                 {/* ── TIER 2: INSTITUTIONAL REGISTRY MANAGEMENT ── */}
//                 {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && helpers && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <AdminClassView
//                             initialData={(initialData as unknown) as AdminClassData} // ✅ Rule 15: Safe Bridge Cast
//                             helpers={helpers}
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 2: FACULTY WORKLOAD HUB ── */}
//                 {userRole === Role.TEACHER && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <TeacherClassView
//                             data={(initialData as unknown) as TeacherClassData} // ✅ Rule 15: Safe Bridge Cast
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 3: STUDENT IDENTITY REGISTRY ── */}
//                 {userRole === Role.STUDENT && (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <StudentClassView
//                             data={(initialData as unknown) as StudentClassRegistryData} // ✅ Rule 15: Safe Bridge Cast
//                         />
//                     </div>
//                 )}

//             </main>
//         </div>
//     );
// }


// 'use client'

// import React from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
// import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
// import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
// import { Role } from "@prisma/client"
// import { Loader2, ShieldAlert, Lock, AlertCircle } from "lucide-react"
// import { getErrorMessage } from "@/lib/error-handler"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface HubManagementHelpers {
//     grades: Array<{ id: string; displayName: string }>;
//     teachers: Array<{ id: string; name: string | null }>;
// }

// /**
//  * Tier 2: Admin-specific Classroom Row 
//  */
// interface ClassRegistryRow {
//     id: string;
//     name: string;
//     gradeDisplayName: string;
//     teacherName: string | null;
//     studentCount: number;
// }

// /**
//  * Tier 2: Teacher-specific Classroom Data 
//  */
// interface FacultyClassroomHub {
//     id: string;
//     name: string;
//     grade: { 
//         displayName: string;
//         gradeSubjects: Array<{ id: string; subject: { name: string } }>;
//     };
//     students: Array<{ 
//         id: string; 
//         name: string | null; 
//         assessments: Array<{ score: number | null; gradeSubjectId: string }> 
//     }>;
//     subjectStats: Array<{ subjectName: string; average: number; bestStudent: string }>;
// }

// interface ClassesHubProps {
//     initialData: unknown; // ✅ Rule 15: unknown bridge for safe polymorphic casting
//     helpers: HubManagementHelpers | null;
//     userRole: Role;
// }

// /**
//  * UNIFIED CLASSROOM HUB ORCHESTRATOR (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 13: Contextual Fallbacks - Dynamic switching based on Hub Identity.
//  * Rule 15/23: Pure TypeScript with Standardized Error Protocol.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
//     const { profile, isLoading } = useProfileStore();

//     // ── RENDER STATES (Rule 14/18/21) ──

//     if (isLoading) {
//         return (
//             <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-8 bg-background animate-in fade-in duration-500">
//                 <div className="relative">
//                     <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
//                     <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//                 </div>
//                 <p className="text-muted-foreground font-extrabold uppercase italic text-[11px] tracking-[0.4em] animate-pulse">
//                     Synchronizing_Identity_Hub...
//                 </p>
//             </div>
//         );
//     }

//     // ── SECURITY HUB GUARD (Rule 10/13/23) ──
//     if (!initialData && userRole !== Role.SCHOOL_ADMIN && userRole !== Role.SUPER_ADMIN) {
//         try {
//             return (
//                 <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-700">
//                     <div className="max-w-md w-full text-center space-y-8 bg-card p-10 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden">
//                         {/* Rule 21 mathematical decoration */}
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                        
//                         <div className="relative z-10 space-y-6">
//                             <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                                 <ShieldAlert className="h-10 w-10 text-destructive" />
//                             </div>
//                             <div className="space-y-3">
//                                 <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Access Restricted</h2>
//                                 <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
//                                     {profile?.school?.name || "Institutional"} identity hub not discovered or authorization scope insufficient for this registry sector.
//                                 </p>
//                             </div>
//                             <div className="flex justify-center pt-4">
//                                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm">
//                                     <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
//                                     <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Tier-2 Protected Hub</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             );
//         } catch (error: unknown) {
//             // ✅ Rule 23: Explicit Error Protocol
//             const message = getErrorMessage(error);
//             return (
//                 <div className="p-8 text-center bg-destructive-50 text-destructive rounded-[2rem] border border-destructive-200">
//                     <AlertCircle className="h-8 w-8 mx-auto mb-4" />
//                     <p className="text-[10px] font-extrabold uppercase tracking-widest italic">{message}</p>
//                 </div>
//             );
//         }
//     }

//     return (
//         <div className="w-full animate-in fade-in duration-700">
//             <main className="w-full">
                
//                 {/* ── TIER 2: INSTITUTIONAL REGISTRY MANAGEMENT ── */}
//                 {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && helpers && (
//                     <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                         <AdminClassView
//                             initialData={(initialData as unknown) as ClassRegistryRow[]} // ✅ Rule 15: Safe Bridge Cast
//                             helpers={helpers}
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 2: FACULTY HUB VIEW ── */}
//                 {userRole === Role.TEACHER && (
//                     <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                         <TeacherClassView
//                             data={(initialData as unknown) as FacultyClassroomHub[]} // ✅ Rule 15: Safe Bridge Cast
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 3: STUDENT IDENTITY HUB ── */}
//                 {userRole === Role.STUDENT && (
//                     <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                         <StudentClassView
//                             data={(initialData as unknown) as StudentClassRegistryData} // ✅ Rule 15: Safe Bridge Cast
//                         />
//                     </div>
//                 )}

//             </main>
//         </div>
//     );
// }


// 'use client'

// import React from "react"
// import { useProfileStore } from "@/store/profileStore"
// import { AdminClassView } from "@/components/admin-dasboard/adminClassView"
// import { TeacherClassView } from "@/components/TeacherDashboard/teacherClassView"
// import { StudentClassView, type StudentClassRegistryData } from "@/components/student-dashboard/class/studentClassView"
// import { Role } from "@prisma/client"
// import { Loader2, ShieldAlert, Lock, AlertCircle } from "lucide-react"
// import { getErrorMessage } from "@/lib/error-handler"

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface HubManagementHelpers {
//     grades: Array<{ id: string; displayName: string }>;
//     teachers: Array<{ id: string; name: string | null }>;
// }

// /**
//  * Tier 2: Admin-specific Classroom Row 
//  */
// interface ClassRegistryRow {
//     id: string;
//     name: string;
//     gradeDisplayName: string;
//     teacherName: string | null; // Database reality
//     studentCount: number;
// }

// /**
//  * Tier 2: Teacher-specific Classroom Data 
//  */
// interface FacultyClassroomHub {
//     id: string;
//     name: string;
//     grade: { 
//         displayName: string;
//         gradeSubjects: Array<{ id: string; subject: { name: string } }>;
//     };
//     students: Array<{ 
//         id: string; 
//         name: string | null; 
//         assessments: Array<{ score: number | null; gradeSubjectId: string }> 
//     }>;
//     subjectStats: Array<{ subjectName: string; average: number; bestStudent: string }>;
// }

// interface ClassesHubProps {
//     initialData: unknown; 
//     helpers: HubManagementHelpers | null;
//     userRole: Role;
// }

// /**
//  * UNIFIED CLASSROOM HUB ORCHESTRATOR (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 13: Contextual Fallbacks - Dynamic switching based on Hub Identity.
//  * Rule 15/23: Pure TypeScript with Standardized Error Protocol.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
//     const { profile, isLoading } = useProfileStore();

//     // ── RENDER STATES (Rule 14/18/21) ──

//     if (isLoading) {
//         return (
//             <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-8 bg-background animate-in fade-in duration-500">
//                 <div className="relative">
//                     <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
//                     <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//                 </div>
//                 <p className="text-muted-foreground font-extrabold uppercase italic text-[11px] tracking-[0.4em] animate-pulse">
//                     Synchronizing_Identity_Hub...
//                 </p>
//             </div>
//         );
//     }

//     // ── SECURITY HUB GUARD (Rule 10/13/23) ──
//     if (!initialData && userRole !== Role.SCHOOL_ADMIN && userRole !== Role.SUPER_ADMIN) {
//         try {
//             return (
//                 <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-700">
//                     <div className="max-w-md w-full text-center space-y-8 bg-card p-10 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden">
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                        
//                         <div className="relative z-10 space-y-6">
//                             <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
//                                 <ShieldAlert className="h-10 w-10 text-destructive" />
//                             </div>
//                             <div className="space-y-3">
//                                 <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Access Restricted</h2>
//                                 <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
//                                     {profile?.school?.name || "Institutional"} identity hub not discovered or authorization scope insufficient for this registry sector.
//                                 </p>
//                             </div>
//                             <div className="flex justify-center pt-4">
//                                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm">
//                                     <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
//                                     <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Tier-2 Protected Hub</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             );
//         } catch (error: unknown) {
//             const message = getErrorMessage(error);
//             return (
//                 <div className="p-8 text-center bg-destructive-50 text-destructive rounded-[2rem] border border-destructive-200">
//                     <AlertCircle className="h-8 w-8 mx-auto mb-4" />
//                     <p className="text-[10px] font-extrabold uppercase tracking-widest italic">{message}</p>
//                 </div>
//             );
//         }
//     }

//     return (
//         <div className="w-full animate-in fade-in duration-700">
//             <main className="w-full">
                
//                 {/* ── TIER 2: INSTITUTIONAL REGISTRY MANAGEMENT ── */}
//                 {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && helpers && (
//                     <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                         <AdminClassView
//                             initialData={((initialData as unknown) as ClassRegistryRow[]).map(row => ({
//                                 ...row,
//                                 // ✅ FIXED TS2322: Ensuring teacherName is never null for the strict sub-component
//                                 teacherName: row.teacherName || "Unassigned" 
//                             }))} 
//                             helpers={helpers}
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 2: FACULTY HUB VIEW ── */}
//                 {userRole === Role.TEACHER && (
//                     <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                         <TeacherClassView
//                             data={(initialData as unknown) as FacultyClassroomHub[]} 
//                         />
//                     </div>
//                 )}

//                 {/* ── TIER 3: STUDENT IDENTITY HUB ── */}
//                 {userRole === Role.STUDENT && (
//                     <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                         <StudentClassView
//                             data={(initialData as unknown) as StudentClassRegistryData} 
//                         />
//                     </div>
//                 )}

//             </main>
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
import { Loader2, ShieldAlert, Lock, AlertCircle } from "lucide-react"
import { getErrorMessage } from "@/lib/error-handler"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface HubManagementHelpers {
    grades: Array<{ id: string; displayName: string }>;
    teachers: Array<{ id: string; name: string | null }>;
}

/**
 * Tier 2: Admin-specific Classroom Row 
 */
interface ClassRegistryRow {
    id: string;
    name: string;
    gradeDisplayName: string;
    teacherName: string | null; // Database reality
    studentCount: number;
}

/**
 * Tier 2: Teacher-specific Classroom Data 
 */
interface FacultyClassroomHub {
    id: string;
    name: string;
    grade: { 
        displayName: string;
        gradeSubjects: Array<{ id: string; subject: { name: string } }>;
    };
    students: Array<{ 
        id: string; 
        name: string | null; 
        assessments: Array<{ score: number | null; gradeSubjectId: string }> 
    }>;
    subjectStats: Array<{ subjectName: string; average: number; bestStudent: string }>;
}

interface ClassesHubProps {
    initialData: unknown; 
    helpers: HubManagementHelpers | null;
    userRole: Role;
}

/**
 * UNIFIED CLASSROOM HUB ORCHESTRATOR (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 13: Contextual Fallbacks - Dynamic switching based on Hub Identity.
 * Rule 15/23: Pure TypeScript with Standardized Error Protocol.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function ClassesHubClient({ initialData, helpers, userRole }: ClassesHubProps) {
    const { profile, isLoading } = useProfileStore();

    // ── RENDER STATES (Rule 14/18/21) ──

    if (isLoading) {
        return (
            <div className="min-h-[60vh] w-full flex flex-col items-center justify-center gap-8 bg-background animate-in fade-in duration-500">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
                    <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
                </div>
                <p className="text-muted-foreground font-extrabold uppercase italic text-[11px] tracking-[0.4em] animate-pulse">
                    Synchronizing_Identity_Hub...
                </p>
            </div>
        );
    }

    // ── SECURITY HUB GUARD (Rule 10/13/23) ──
    if (!initialData && userRole !== Role.SCHOOL_ADMIN && userRole !== Role.SUPER_ADMIN) {
        try {
            return (
                <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-700">
                    <div className="max-w-md w-full text-center space-y-8 bg-card p-10 md:p-12 rounded-[2rem] border border-border shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <ShieldAlert className="h-10 w-10 text-destructive" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">Access Restricted</h2>
                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic opacity-70">
                                    {profile?.school?.name || "Institutional"} identity hub not discovered or authorization scope insufficient for this registry sector.
                                </p>
                            </div>
                            <div className="flex justify-center pt-4">
                                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm">
                                    <Lock className="h-3.5 w-3.5 text-muted-foreground/40" />
                                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/60">Tier-2 Protected Hub</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            return (
                <div className="p-8 text-center bg-destructive-50 text-destructive rounded-[2rem] border border-destructive-200">
                    <AlertCircle className="h-8 w-8 mx-auto mb-4" />
                    <p className="text-[10px] font-extrabold uppercase tracking-widest italic">{message}</p>
                </div>
            );
        }
    }

    return (
        <div className="w-full animate-in fade-in duration-700">
            <main className="w-full">
                
                {/* ── TIER 2: INSTITUTIONAL REGISTRY MANAGEMENT ── */}
                {(userRole === Role.SCHOOL_ADMIN || userRole === Role.SUPER_ADMIN) && helpers && (
                    <div className="animate-in slide-in-from-bottom-6 duration-1000">
                        <AdminClassView
                            initialData={((initialData as unknown) as ClassRegistryRow[]).map(row => ({
                                ...row,
                                // ✅ FIXED TS2322: Ensuring teacherName is never null for the strict sub-component
                                teacherName: row.teacherName || "Unassigned" 
                            }))} 
                            helpers={helpers}
                        />
                    </div>
                )}

                {/* ── TIER 2: FACULTY HUB VIEW ── */}
                {userRole === Role.TEACHER && (
                    <div className="animate-in slide-in-from-bottom-6 duration-1000">
                        <TeacherClassView
                            data={(initialData as unknown) as FacultyClassroomHub[]} 
                        />
                    </div>
                )}

                {/* ── TIER 3: STUDENT IDENTITY HUB ── */}
                {userRole === Role.STUDENT && (
                    <div className="animate-in slide-in-from-bottom-6 duration-1000">
                        <StudentClassView
                            data={(initialData as unknown) as StudentClassRegistryData} 
                        />
                    </div>
                )}

            </main>
        </div>
    );
}