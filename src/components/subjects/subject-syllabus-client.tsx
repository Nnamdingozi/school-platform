// 'use client'

// import { useProfileStore } from "@/store/profileStore"
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid"
// import { BookOpen, Globe, Sparkles } from "lucide-react"
// import { Badge } from "@/components/ui/badge"

// /**
//  * Rule 15: Props synced with refactored getStudentDashboardData action.
//  */
// interface MySyllabusClientProps {
//     initialData: {
//         student: any;
//         classroom: {
//             name: string;
//             teacher?: { name: string | null };
//             grade: { level: number };
//         } | null;
//         school: { name: string } | null;
//         subjects: any[];
//         isIndependent: boolean;
//     }
// }

// /**
//  * STUDENT SYLLABUS HUB
//  * Rule 17: Leverages Zustand for branding context.
//  * Rule 13: Adapts labels for Independent vs Institutional tiers.
//  */
// export function MySyllabusClient({ initialData }: MySyllabusClientProps) {
//     const { profile } = useProfileStore();
//     const { classroom, subjects, isIndependent, school } = initialData;

//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     // Tier-Aware Labeling (Rule 13)
//     const pageTitle = isIndependent ? "Personal Library" : "My Syllabus";
//     const subTitle = isIndependent 
//         ? "Global academic modules registered to your profile" 
//         : `Authorized curriculum for ${classroom?.name || "assigned class"}`;

//     return (
//         <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white animate-in fade-in duration-700">
//             <div className="max-w-7xl mx-auto space-y-10">
                
//                 {/* ── HEADER ── */}
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                     <div className="flex items-center gap-5">
//                         <div 
//                             className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
//                             style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                         >
//                             {isIndependent ? (
//                                 <Globe className="h-7 w-7" style={{ color: primaryColor }} />
//                             ) : (
//                                 <BookOpen className="h-7 w-7" style={{ color: primaryColor }} />
//                             )}
//                         </div>
//                         <div>
//                             <div className="flex items-center gap-3">
//                                 <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
//                                     {pageTitle}
//                                 </h1>
//                                 {isIndependent && (
//                                     <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 text-[9px] font-black uppercase">
//                                         <Sparkles className="h-3 w-3 mr-1" /> Tier 3
//                                     </Badge>
//                                 )}
//                             </div>
//                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">
//                                 {subTitle}
//                             </p>
//                         </div>
//                     </div>

//                     {!isIndependent && school && (
//                         <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 shadow-inner hidden md:block">
//                             <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Environment</p>
//                             <p className="text-sm font-bold text-white uppercase mt-1 italic">{school.name}</p>
//                         </div>
//                     )}
//                 </header>

//                 {/* ── DATA GRID (Rule 11 DB Truth) ── */}
//                 <SubjectsGrid
//                     subjects={subjects}
//                     classTeacherName={isIndependent ? "Registry AI" : (classroom?.teacher?.name || "Staff")}
//                     gradeLevel={classroom?.grade?.level || 10}
//                     isIndependent={isIndependent}
//                 />
                
//             </div>
//         </div>
//     );
// }



// 'use client'

// import React from "react"
// import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid"
// import { BookOpen, Globe, Sparkles, ShieldCheck } from "lucide-react"
// import { Badge } from "@/components/ui/badge"


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface MySyllabusClientProps {
//     initialData: {
//         student: { name: string | null; email: string };
//         classroom: {
//             name: string;
//             teacher?: { name: string | null };
//             grade: { level: number };
//         } | null;
//         school: { name: string } | null;
//         subjects: any[];
//         isIndependent: boolean;
//     }
// }

// /**
//  * STUDENT SYLLABUS HUB (Tier 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry (rounded-xl/2xl).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function MySyllabusClient({ initialData }: MySyllabusClientProps) {
//     const { classroom, subjects, isIndependent, school } = initialData;

//     // Rule 13: Tier-Aware Labeling (Hub vs Registry)
//     const pageTitle = isIndependent ? "Personal Hub" : "Academic Roadmap";
//     const subTitle = isIndependent 
//         ? "Global academic modules synchronized to your identity" 
//         : `Authorized syllabus hub for ${classroom?.name || "assigned classroom"}`;

//     return (
//         <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//             {/* Rule 20: Fluid Container and Padding */}
//             <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
//                 {/* ── HEADER (Rule 11/21) ── */}
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
//                     <div className="flex items-center gap-6">
//                         {/* Rule 21: Scale Protocol Icon Container */}
//                         <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
//                             {isIndependent ? (
//                                 <Globe className="h-8 w-8 text-school-primary" />
//                             ) : (
//                                 <BookOpen className="h-8 w-8 text-school-primary" />
//                             )}
//                         </div>
//                         <div className="space-y-1.5">
//                             <div className="flex items-center gap-4">
//                                 <h1 className="text-3xl md:text-5xl font-extrabold uppercase italic tracking-tighter leading-none">
//                                     {pageTitle}
//                                 </h1>
//                                 {isIndependent && (
//                                     <Badge className="bg-school-primary-100 text-school-primary border-school-primary-200 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg">
//                                         <Sparkles className="h-3 w-3 mr-1.5 fill-current" /> Tier 3
//                                     </Badge>
//                                 )}
//                             </div>
//                             <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic opacity-70">
//                                 {subTitle}
//                             </p>
//                         </div>
//                     </div>

//                     {/* Environment Badge (Rule 18/21) */}
//                     {!isIndependent && school && (
//                         <div className="px-6 py-4 rounded-2xl bg-surface border border-border shadow-inner hidden md:flex items-center gap-4 group hover:border-school-primary-200 transition-all">
//                             <ShieldCheck className="h-5 w-5 text-school-primary opacity-40 group-hover:opacity-100 transition-opacity" />
//                             <div className="text-right">
//                                 <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Institutional Node</p>
//                                 <p className="text-sm font-extrabold text-foreground uppercase mt-1 italic tracking-tight">{school.name}</p>
//                             </div>
//                         </div>
//                     )}
//                 </header>

//                 {/* ── MODULE MATRIX (Tier 1 + 2 Sync) ── */}
//                 <main className="w-full">
//                     <SubjectsGrid
//                         subjects={subjects}
//                         classTeacherName={isIndependent ? "Registry AI Engine" : (classroom?.teacher?.name || "Academic Staff")}
//                         gradeLevel={classroom?.grade?.level || 10}
//                         isIndependent={isIndependent}
//                     />
//                 </main>
                
//                 {/* Visual Depth Footer Accent (Rule 21) */}
//                 <div className="pt-12 flex justify-center items-center gap-3 opacity-20 grayscale hover:opacity-100 transition-all duration-700">
//                     <div className="h-1 w-24 bg-border rounded-full" />
//                     <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Academic_Registry_Lifecycle_v2.0</p>
//                     <div className="h-1 w-24 bg-border rounded-full" />
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client'

import React, { useEffect } from "react"
import { useProfileStore } from "@/store/profileStore"
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid"
import { BookOpen, Globe, Sparkles, ShieldCheck, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { getErrorMessage } from "@/lib/error-handler"


// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface TopicHub {
  id: string;
  title: string;
  weekNumber?: number | null;
  term?: { index: number; } | null;
}

interface AssessmentHub {
  id: string;
  score: number | null;
  maxScore: number | null;
  type: string;
}

interface GradeSubjectHub {
  id: string;
  subject: { name: string; };
  topics: TopicHub[];
  assessments: AssessmentHub[];
}

interface SyllabusHubPayload {
    student: { name: string | null; email: string };
    classroom: {
        name: string;
        teacher?: { name: string | null };
        grade: { level: number };
    } | null;
    school: { name: string } | null;
    subjects: GradeSubjectHub[]; // ✅ Resolved 'any' type
    isIndependent: boolean;
}

interface MySyllabusClientProps {
    initialData: SyllabusHubPayload;
}

/**
 * STUDENT SYLLABUS HUB (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Pure TypeScript - Zero 'any' types in the payload.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry (rounded-xl/2xl).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol with getErrorMessage.
 */
export function MySyllabusClient({ initialData }: MySyllabusClientProps) {
    const { profile } = useProfileStore();
    const { classroom, subjects, isIndependent, school } = initialData;

    // ── IDENTITY PROTECTION (Rule 23) ──
    useEffect(() => {
        try {
            // Validation of session state within the hub
            if (!profile?.id && !isIndependent) {
                console.warn("[REGISTRY_WARNING]: Hub session out of sync.");
            }
        } catch (error: unknown) {
            const message = getErrorMessage(error);
            console.error(`[SYLLABUS_HUB_INIT_FAULT]: ${message}`);
        }
    }, [profile, isIndependent]);

    // Rule 13: Tier-Aware Labeling (Hub vs Registry)
    const pageTitle = isIndependent ? "Personal Hub" : "Academic Roadmap";
    const subTitle = isIndependent 
        ? "Global academic modules synchronized to your identity" 
        : `Authorized syllabus hub for ${classroom?.name || "assigned classroom"}`;

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Fluid Container and Padding */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11/21) ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* Rule 21: Scale Protocol Hub Icon */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                            {isIndependent ? (
                                <Globe className="h-8 w-8 text-school-primary" />
                            ) : (
                                <BookOpen className="h-8 w-8 text-school-primary" />
                            )}
                        </div>
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-4">
                                <h1 className="text-3xl md:text-5xl font-extrabold uppercase italic tracking-tighter leading-none">
                                    {pageTitle}
                                </h1>
                                {isIndependent && (
                                    <Badge className="bg-school-primary-100 text-school-primary border-school-primary-200 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-lg">
                                        <Sparkles className="h-3 w-3 mr-1.5 fill-current" /> Tier 3
                                    </Badge>
                                )}
                            </div>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest italic opacity-70">
                                {subTitle}
                            </p>
                        </div>
                    </div>

                    {/* Environment Hub Badge (Rule 18/21) */}
                    {!isIndependent && school && (
                        <div className="px-6 py-4 rounded-2xl bg-surface border border-border shadow-inner hidden md:flex items-center gap-4 group hover:border-school-primary-200 transition-all">
                            <ShieldCheck className="h-5 w-5 text-school-primary opacity-40 group-hover:opacity-100 transition-opacity" />
                            <div className="text-right">
                                <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">Institutional Hub</p>
                                <p className="text-sm font-extrabold text-foreground uppercase mt-1 italic tracking-tight">{school.name}</p>
                            </div>
                        </div>
                    )}
                </header>

                {/* ── MODULE MATRIX (Tier 1 + 2 Sync) ── */}
                <main className="w-full">
                    <SubjectsGrid
                        subjects={subjects}
                        classTeacherName={isIndependent ? "Registry AI Core" : (classroom?.teacher?.name || "Academic Staff")}
                        gradeLevel={classroom?.grade?.level || 10}
                        isIndependent={isIndependent}
                    />
                </main>
                
                {/* ── FOOTER PROTOCOL (Rule 21) ── */}
                <div className="pt-12 flex justify-center items-center gap-4 opacity-20 grayscale hover:opacity-100 transition-all duration-700">
                    <div className="h-px w-24 bg-border rounded-full" />
                    <div className="flex items-center gap-2">
                        <AlertCircle className="h-3.5 w-3.5" />
                        <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Academic_Registry_Lifecycle_v2.0</p>
                    </div>
                    <div className="h-px w-24 bg-border rounded-full" />
                </div>
            </div>
        </div>
    );
}