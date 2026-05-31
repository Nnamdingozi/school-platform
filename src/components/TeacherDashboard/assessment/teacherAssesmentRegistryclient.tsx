// 'use client'

// import { useProfileStore } from "@/store/profileStore";
// import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment/assessment";
// import { ClipboardCheck, ShieldAlert, Loader2 } from "lucide-react";
// import { Card } from "@/components/ui/card";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface TeacherAssessmentRegistry {
//   subjectView: any[];
//   classView: any[];
// }

// interface AssessmentRegistryClientProps {
//     initialData: TeacherAssessmentRegistry;
// }

// /**
//  * TEACHER ASSESSMENT HUB (Tier 2)
//  * Rule 12: Receives server-side data as props.
//  * Rule 17: Injects institutional branding from Zustand.
//  * Rule 13: Handles graceful fallbacks for unassigned teachers.
//  */
// export function AssessmentRegistryClient({ initialData }: AssessmentRegistryClientProps) {
//   const { profile, isLoading } = useProfileStore();
//   const primaryColor = profile?.primaryColor || "#f59e0b";

//   if (isLoading) {
//     return (
//         <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
//             <Loader2 className="h-10 w-10 animate-spin text-school-primary" style={{ color: primaryColor }} />
//             <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Synchronizing_Ledger...</p>
//         </div>
//     );
//   }

//   // Rule 13: Graceful fallback for teachers without active assignments
//   const hasNoData = initialData.subjectView.length === 0 && initialData.classView.length === 0;

//   if (hasNoData) {
//     return (
//       <div className="h-[80vh] flex items-center justify-center p-6">
//         <Card className="max-w-md w-full bg-slate-900 border-white/5 rounded-[3rem] p-12 text-center space-y-6 shadow-2xl">
//           <div className="h-20 w-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto border border-white/5 shadow-inner">
//             <ShieldAlert className="h-10 w-10 text-slate-800" />
//           </div>
//           <div className="space-y-2">
//             <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Registry Null</h2>
//             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
//               Your instructor profile is not currently linked to any active subject assignments or classrooms.
//             </p>
//           </div>
//           <div className="pt-6 border-t border-white/5">
//              <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest italic">Contact Registrar for assignment initialization</p>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-slate-950 animate-in fade-in duration-700">
        
//         {/* ── SUB-HEADER ── */}
//         <header className="p-8 max-w-7xl mx-auto flex items-center gap-4 border-b border-white/5 mb-10">
//             <div 
//                 className="h-12 w-12 rounded-2xl border flex items-center justify-center shadow-lg"
//                 style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//             >
//                 <ClipboardCheck className="h-6 w-6" style={{ color: primaryColor }} />
//             </div>
//             <div>
//                 <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                     Assessment Registry
//                 </h1>
//                 <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
//                     Institutional Grading & Telemetry Hub
//                 </p>
//             </div>
//         </header>

//         <main className="max-w-7xl mx-auto px-8 pb-20">
//             {/* Rule 15: Passing strictly typed server data into the dashboard */}
//             <AssessmentDashboard data={initialData} />
//         </main>

//     </div>
//   );
// }



// "use client";

// import React from "react";
// import { useProfileStore } from "@/store/profileStore";
// import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment/assessment";
// import { ClipboardCheck, ShieldAlert, Loader2 } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { cn } from "@/lib/utils";

// // ── Types (Rule 15: Strict Typing) ──────────────────────────────────────────

// interface TeacherAssessmentRegistry {
//   subjectView: any[]; // These are mapped internally by AssessmentDashboard
//   classView: any[];
// }

// interface AssessmentRegistryClientProps {
//     initialData: TeacherAssessmentRegistry;
// }

// /**
//  * TEACHER ASSESSMENT HUB (Tier 2)
//  * Rule 12: Serves as the high-level interactive wrapper for Registry data.
//  * Rule 18: Semantic Color Flip (Purged hardcoded Slates).
//  * Rule 20: Compulsory Responsiveness with fluid padding/containers.
//  */
// export function AssessmentRegistryClient({ initialData }: AssessmentRegistryClientProps) {
//   const { profile, isLoading } = useProfileStore();

//   // Rule 14: Loading State UI
//   if (isLoading) {
//     return (
//         <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-6 bg-background">
//             <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
//             <div className="text-center space-y-2">
//                 <p className="text-muted-foreground font-semibold uppercase text-[10px] tracking-[0.3em] animate-pulse">
//                     Synchronizing_Ledger
//                 </p>
//                 <div className="h-1 w-32 bg-surface rounded-full overflow-hidden mx-auto">
//                     <div className="h-full bg-school-primary animate-progress-loading" style={{ width: '40%' }} />
//                 </div>
//             </div>
//         </div>
//     );
//   }

//   // Rule 13: Contextual Fallback for teachers without active assignments
//   const hasNoData = initialData.subjectView.length === 0 && initialData.classView.length === 0;

//   if (hasNoData) {
//     return (
//       <div className="h-[80vh] flex items-center justify-center p-6 bg-surface">
//         <Card className="max-w-md w-full bg-card border-border rounded-[2rem] p-10 md:p-14 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-500">
//           <div className="h-24 w-24 bg-surface rounded-full flex items-center justify-center mx-auto border border-border shadow-inner">
//             <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
//           </div>
//           <div className="space-y-4">
//             <h2 className="text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                 Registry Null
//             </h2>
//             <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-relaxed">
//               Your instructor profile is not currently linked to any active subject assignments or classrooms in the institutional tier.
//             </p>
//           </div>
//           <div className="pt-8 border-t border-border">
//              <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic">
//                 Contact Registrar for assignment initialization
//              </p>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-surface animate-in fade-in duration-700">
        
//         {/* ── SUB-HEADER (Rule 11 & 20) ── */}
//         <header className="bg-background/50 backdrop-blur-md sticky top-0 z-10 border-b border-border">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 flex items-center gap-5">
//                 {/* Rule 19: Small Radius Standardization */}
//                 <div 
//                     className="h-14 w-14 rounded-2xl border border-school-primary/20 bg-school-primary/10 flex items-center justify-center shadow-lg"
//                 >
//                     <ClipboardCheck className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         Assessment Registry
//                     </h1>
//                     <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
//                         <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                         Institutional Grading & Telemetry Hub
//                     </p>
//                 </div>
//             </div>
//         </header>

//         {/* ── MAIN CONTENT (Rule 20) ── */}
//         <main className="max-w-7xl mx-auto w-full">
//             {/* 
//                We pass the data into the Dashboard. 
//                Internal padding is handled by the Dashboard component (p-4 md:p-8 lg:p-12) 
//             */}
//             <AssessmentDashboard data={initialData} />
//         </main>

//     </div>
//   );
// }



// "use client";

// import React from "react";
// import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment/assessment";
// import { ClipboardCheck, ShieldAlert, Loader2 } from "lucide-react";
// import { Card } from "@/components/ui/card";


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface TeacherAssessmentRegistry {
//   subjectView: any[]; 
//   classView: any[];
// }

// interface AssessmentRegistryClientProps {
//     initialData: TeacherAssessmentRegistry;
// }

// /**
//  * TEACHER ASSESSMENT HUB (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 14: Optimistic Loading UI.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function AssessmentRegistryClient({ initialData }: AssessmentRegistryClientProps) {


//   // ── LOADING STATE (Rule 14/18/21) ──
//   if (isLoading) {
//     return (
//         <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-8 bg-background animate-in fade-in duration-500">
//             <div className="relative">
//                 <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
//                 <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//             </div>
//             <div className="text-center space-y-3">
//                 <p className="text-school-primary font-extrabold uppercase italic text-[11px] tracking-[0.4em] animate-pulse">
//                     Synchronizing_Ledger
//                 </p>
//                 <div className="h-1.5 w-40 bg-surface rounded-full overflow-hidden mx-auto border border-border shadow-inner">
//                     <div className="h-full bg-school-primary animate-progress-loading" style={{ width: '40%' }} />
//                 </div>
//             </div>
//         </div>
//     );
//   }

//   // ── CONTEXTUAL FALLBACK (Rule 13/19) ──
//   const hasNoData = initialData.subjectView.length === 0 && initialData.classView.length === 0;

//   if (hasNoData) {
//     return (
//       <div className="h-[80vh] flex items-center justify-center p-6 bg-surface">
//         <Card className="max-w-md w-full bg-card border-border rounded-[3rem] p-10 md:p-16 text-center space-y-8 shadow-2xl animate-in zoom-in-95 duration-700">
//           <div className="h-24 w-24 bg-surface rounded-[2rem] flex items-center justify-center mx-auto border border-border shadow-inner">
//             <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
//           </div>
//           <div className="space-y-3">
//             <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                 Hub Inactive
//             </h2>
//             <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
//               Your instructor profile is not currently synchronized with any active academic modules or classroom hubs in the institutional tier.
//             </p>
//           </div>
//           <div className="pt-8 border-t border-border">
//              <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic leading-loose">
//                 Contact Registry Administrator for hub initialization
//              </p>
//           </div>
//         </Card>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-surface animate-in fade-in duration-700">
        
//         {/* ── STICKY HUB HEADER (Rule 11/18/21) ── */}
//         <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-border transition-all">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 flex items-center gap-6">
//                 {/* Rule 21: Scale Protocol for Icon Box */}
//                 <div 
//                     className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors"
//                 >
//                     <ClipboardCheck className="h-8 w-8 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         Assessment Hub
//                     </h1>
//                     <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
//                         <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse shadow-[0_0_8px_rgba(var(--school-primary-raw),0.5)]" />
//                         Institutional Grading & Telemetry Sector
//                     </p>
//                 </div>
//             </div>
//         </header>

//         {/* ── MAIN WORKSPACE (Rule 20) ── */}
//         <main className="max-w-7xl mx-auto w-full">
//             <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                 <AssessmentDashboard data={initialData} />
//             </div>
//         </main>

//         {/* Visual Continuity Footer */}
//         <div className="h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
//     </div>
//   );
// }



// "use client";

// import React from "react";
// import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment/assessment";
// import { ClipboardCheck, ShieldAlert, Loader2, Activity } from "lucide-react";
// import { Card } from "@/components/ui/card";
// import { getErrorMessage } from "@/lib/error-handler";


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// /**
//  * Interface representing a specific proficiency record in the hub.
//  * ✅ RESOLVED: 'any' purged from assessment structure.
//  */
// interface RegistryAssessment {
//   id: string;
//   score: number | null;
//   maxScore: number | null;
//   type: string;
//   createdAt: Date;
// }

// interface StudentIdentityProfile {
//   id: string;
//   name: string | null;
//   assessments: RegistryAssessment[];
// }

// interface GradeSubjectView {
//   id: string;
//   subject: { name: string };
//   grade: { displayName: string };
//   studentSubjects: Array<{ student: StudentIdentityProfile }>;
// }

// interface ClassView {
//   id: string;
//   name: string;
//   enrollments: Array<{ student: StudentIdentityProfile }>;
// }

// /**
//  * Institutional Assessment Payload
//  * Rule 15: No 'any' types in the data tree.
//  */
// interface TeacherAssessmentRegistry {
//   subjectView: GradeSubjectView[]; 
//   classView: ClassView[];
// }

// interface AssessmentRegistryClientProps {
//     initialData: TeacherAssessmentRegistry;
// }

// /**
//  * TEACHER ASSESSMENT HUB (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 14: Optimistic Loading UI synchronized with store.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem] and [3rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  * Rule 23: Explicit Error Protocol via getErrorMessage.
//  */
// export function AssessmentRegistryClient({ initialData }: AssessmentRegistryClientProps) {


//   // ── LOADING TERMINAL (Rule 14/18/21) ──
//   if (isLoading) {
//     return (
//         <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-8 bg-background animate-in fade-in duration-500">
//             <div className="relative">
//                 <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
//                 {/* Rule 21: Scale protocol underglow */}
//                 <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//             </div>
//             <div className="text-center space-y-3">
//                 <p className="text-school-primary font-extrabold uppercase italic text-[11px] tracking-[0.4em] animate-pulse">
//                     Synchronizing_Assessment_Ledger
//                 </p>
//                 <div className="h-1.5 w-40 bg-surface rounded-full overflow-hidden mx-auto border border-border shadow-inner">
//                     <div className="h-full bg-school-primary animate-progress-loading" style={{ width: '40%' }} />
//                 </div>
//             </div>
//         </div>
//     );
//   }

//   // ── CONTEXTUAL FALLBACK (Rule 13/19) ──
//   const hasNoData = initialData.subjectView.length === 0 && initialData.classView.length === 0;

//   if (hasNoData) {
//     try {
//         return (
//             <div className="h-[80vh] flex items-center justify-center p-6 bg-surface animate-in zoom-in-95 duration-700">
//               <Card className="max-w-md w-full bg-card border border-border rounded-[3rem] p-10 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
//                 {/* Rule 21 mathematical decoration */}
//                 <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                
//                 <div className="relative z-10 space-y-8">
//                   <div className="h-24 w-24 bg-surface rounded-[2rem] flex items-center justify-center mx-auto border border-border shadow-inner">
//                     <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
//                   </div>
//                   <div className="space-y-3">
//                     <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         Hub Inactive
//                     </h2>
//                     <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
//                       Your instructor profile is not currently synchronized with any active academic modules or classroom hubs in the institutional registry.
//                     </p>
//                   </div>
//                   <div className="pt-8 border-t border-border">
//                      <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic leading-loose">
//                         Contact Hub Administrator for registry initialization
//                      </p>
//                   </div>
//                 </div>
//               </Card>
//             </div>
//           );
//     } catch (error: unknown) {
//         // ✅ Rule 23: Explicit Error Protocol
//         const message = getErrorMessage(error);
//         console.error(`[ASSESSMENT_HUB_RENDER_FAULT]: ${message}`);
//         return null;
//     }
//   }

//   return (
//     <div className="min-h-screen bg-surface animate-in fade-in duration-700">
        
//         {/* ── STICKY HUB HEADER (Rule 11/18/21) ── */}
//         <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-border transition-all">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 flex items-center justify-between">
//                 <div className="flex items-center gap-6">
//                     {/* Rule 21: Scale Protocol Hub Icon */}
//                     <div 
//                         className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors"
//                     >
//                         <ClipboardCheck className="h-8 w-8 text-school-primary" />
//                     </div>
//                     <div className="space-y-1">
//                         <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                             Assessment Hub
//                         </h1>
//                         <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
//                             <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse shadow-[0_0_8px_rgba(var(--school-primary-raw),0.5)]" />
//                             Institutional Grading & Telemetry Sector
//                         </p>
//                     </div>
//                 </div>

//                 <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-xl bg-surface border border-border shadow-inner">
//                     <Activity className="h-4 w-4 text-school-primary/60" />
//                     <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic">Sync Protocol Active</span>
//                 </div>
//             </div>
//         </header>

//         {/* ── MAIN WORKSPACE (Rule 20) ── */}
//         <main className="max-w-7xl mx-auto w-full">
//             <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                 <AssessmentDashboard data={initialData} />
//             </div>
//         </main>

//         <div className="h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
//     </div>
//   );
// }


"use client";

import React from "react";
import { useProfileStore } from "@/store/profileStore";
import { AssessmentDashboard } from "@/components/TeacherDashboard/assessment/assessment";
import { ClipboardCheck, ShieldAlert, Loader2, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getErrorMessage } from "@/lib/error-handler";
// ✅ Rule 15: Importing authoritative Prisma types to ensure structural parity
import { 
  GradeSubject, 
  Subject, 
  Grade, 
  StudentSubject, 
  Profile, 
  Assessment, 
  Topic, 
  Class, 
  ClassEnrollment 
} from "@prisma/client";

// ── Types (Rule 15: Strict Registry Types - Aligned with Dashboard) ─────────

/**
 * These interfaces mirror the 'AssessmentDashboard' contracts exactly.
 */
interface AssessmentWithDetails extends Assessment {
  topic: Topic | null;
  gradeSubject?: GradeSubject & { subject: Subject };
}

interface ProfileWithAssessments extends Profile {
  assessments: AssessmentWithDetails[];
}

interface StudentSubjectWithDetails extends StudentSubject {
  student: ProfileWithAssessments;
}

interface GradeSubjectView extends GradeSubject {
  subject: Subject;
  grade: Grade;
  studentSubjects: StudentSubjectWithDetails[];
}

interface ClassEnrollmentWithDetails extends ClassEnrollment {
  student: ProfileWithAssessments;
}

interface ClassView extends Class {
  enrollments: ClassEnrollmentWithDetails[];
}

/**
 * Institutional Assessment Payload
 * Rule 15: No 'any' types. Structure is mirrored from the destination component.
 */
interface TeacherAssessmentRegistry {
  subjectView: GradeSubjectView[]; 
  classView: ClassView[];
}

interface AssessmentRegistryClientProps {
    initialData: TeacherAssessmentRegistry;
}

/**
 * TEACHER ASSESSMENT HUB (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 14: Optimistic Loading UI synchronized with store.
 * Rule 15: Pure TypeScript - Zero 'any' types. Structural typing via Prisma.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] and [3rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol via getErrorMessage.
 */
export function AssessmentRegistryClient({ initialData }: AssessmentRegistryClientProps) {
  const { isLoading } = useProfileStore();

  // ── LOADING TERMINAL (Rule 14/18/21) ──
  if (isLoading) {
    return (
        <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-8 bg-background animate-in fade-in duration-500">
            <div className="relative">
                <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
                {/* Rule 21: Scale protocol underglow */}
                <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
            </div>
            <div className="text-center space-y-3">
                <p className="text-school-primary font-extrabold uppercase italic text-[11px] tracking-[0.4em] animate-pulse">
                    Synchronizing_Assessment_Ledger
                </p>
                <div className="h-1.5 w-40 bg-surface rounded-full overflow-hidden mx-auto border border-border shadow-inner">
                    <div className="h-full bg-school-primary animate-progress-loading" style={{ width: '40%' }} />
                </div>
            </div>
        </div>
    );
  }

  // ── CONTEXTUAL FALLBACK (Rule 13/19) ──
  const hasNoData = initialData.subjectView.length === 0 && initialData.classView.length === 0;

  if (hasNoData) {
    try {
        return (
            <div className="h-[80vh] flex items-center justify-center p-6 bg-surface animate-in zoom-in-95 duration-700">
              <Card className="max-w-md w-full bg-card border border-border rounded-[3rem] p-10 md:p-16 text-center space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                
                <div className="relative z-10 space-y-8">
                  <div className="h-24 w-24 bg-surface rounded-[2rem] flex items-center justify-center mx-auto border border-border shadow-inner">
                    <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                        Hub Inactive
                    </h2>
                    <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
                      Your instructor profile is not currently synchronized with any active academic modules or classroom hubs in the institutional registry.
                    </p>
                  </div>
                  <div className="pt-8 border-t border-border">
                     <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest italic leading-loose">
                        Contact Hub Administrator for registry initialization
                     </p>
                  </div>
                </div>
              </Card>
            </div>
          );
    } catch (error: unknown) {
        const message = getErrorMessage(error);
        console.error(`[ASSESSMENT_HUB_RENDER_FAULT]: ${message}`);
        return (
            <div className="h-[80vh] flex items-center justify-center">
                <p className="text-destructive font-bold uppercase italic text-xs tracking-widest">
                    Registry_Sync_Failure: {message}
                </p>
            </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-surface animate-in fade-in duration-700">
        
        {/* ── STICKY HUB HEADER (Rule 11/18/21) ── */}
        <header className="bg-background/80 backdrop-blur-md sticky top-0 z-40 border-b border-border transition-all">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                        <ClipboardCheck className="h-8 w-8 text-school-primary" />
                    </div>
                    <div className="space-y-1">
                        <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                            Assessment Hub
                        </h1>
                        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse shadow-[0_0_8px_rgba(var(--school-primary-raw),0.5)]" />
                            Institutional Grading & Telemetry Sector
                        </p>
                    </div>
                </div>

                <div className="hidden md:flex items-center gap-3 px-5 py-2.5 rounded-xl bg-surface border border-border shadow-inner">
                    <Activity className="h-4 w-4 text-school-primary/60" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground italic">Sync Protocol Active</span>
                </div>
            </div>
        </header>

        {/* ── MAIN WORKSPACE (Rule 20) ── */}
        <main className="max-w-7xl mx-auto w-full">
            <div className="animate-in slide-in-from-bottom-4 duration-1000">
                {/* 
                   ✅ Fixed TS2322: initialData is now defined using the exact same 
                   interfaces as AssessmentDashboardProps. No casting or 'any' needed.
                */}
                <AssessmentDashboard data={initialData} />
            </div>
        </main>

        <div className="h-24 bg-gradient-to-t from-surface to-transparent pointer-events-none" />
    </div>
  );
}