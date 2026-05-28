// 'use client'

// import { useProfileStore } from "@/store/profileStore";
// import { TermTimelineView } from "@/components/TeacherDashboard/term/termTimelineView";
// import { ShieldCheck, CalendarX, Loader2, Globe, Zap, BookOpen } from "lucide-react";
// import { Role } from "@prisma/client";
// import { type TermScheduleResponse } from "@/app/actions/termly-schedule"
// import Link from "next/link";
// import { Button } from "@/components/ui/button";

// interface RoadmapHubClientProps {
//     initialData: TermScheduleResponse | null;
//     userRole: Role;
// }

// /**
//  * UNIFIED ROADMAP HUB
//  * Rule 6: Adapts terminology and logic for Independent Learners.
//  * Rule 17: Injects branding from Zustand.
//  */
// export function RoadmapHubClient({ initialData, userRole }: RoadmapHubClientProps) {
//     const { profile, isLoading } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     if (isLoading) {
//         return (
//             <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
//                 <Loader2 className="h-10 w-10 animate-spin text-school-primary" style={{ color: primaryColor }} />
//                 <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Synchronizing_Timeline...</p>
//             </div>
//         );
//     }

//     const isIndependent = userRole === Role.INDIVIDUAL_LEARNER || !profile?.schoolId;

//     return (
//         <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
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
//                                 <ShieldCheck className="h-7 w-7" style={{ color: primaryColor }} />
//                             )}
//                         </div>
//                         <div>
//                             <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter leading-none">
//                                 {isIndependent ? "Learning Path" : "Term Roadmap"}
//                             </h1>
//                             <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic">
//                                 {isIndependent 
//                                     ? "Global Syllabus Navigation & Progress" 
//                                     : "Institutional Schedule & Syllabus Registry"}
//                             </p>
//                         </div>
//                     </div>

//                     <div className="flex items-center gap-3">
//                         {isIndependent ? (
//                             <Link href="/subjects/manage">
//                                 <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white rounded-xl uppercase font-black text-[10px] tracking-widest px-6 h-12">
//                                     <BookOpen className="h-4 w-4 mr-2" /> Modify Library
//                                 </Button>
//                             </Link>
//                         ) : (
//                             <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
//                                 <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
//                                 <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Institutional Sync Active</span>
//                             </div>
//                         )}
//                     </div>
//                 </header>

//                 {initialData && initialData.schedule.length > 0 ? (
//                     <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                         <TermTimelineView data={initialData} />
//                     </div>
//                 ) : (
//                     /* Rule 13: Registry Standby View */
//                     <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5 animate-in zoom-in-95">
//                         <CalendarX className="h-16 w-16 text-slate-800 mb-6" />
//                         <div className="space-y-4">
//                             <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h2>
//                             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
//                                 {isIndependent 
//                                     ? "Your personal learning library is empty. Select modules from the global catalogue to generate your roadmap." 
//                                     : "Institutional term dates have not been synchronized. Contact your registrar to initialize the timeline."}
//                             </p>
//                             {isIndependent && (
//                                 <Link href="/subjects/manage" className="block pt-4">
//                                     <Button className="bg-school-primary text-slate-950 font-black px-10 py-6 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl" style={{ backgroundColor: primaryColor }}>
//                                         Open Global Catalogue
//                                     </Button>
//                                 </Link>
//                             )}
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


'use client'

import React from 'react'
import { useProfileStore } from "@/store/profileStore";
import { TermTimelineView } from "@/components/TeacherDashboard/term/termTimelineView";
import { ShieldCheck, CalendarX, Loader2, Globe, Zap, BookOpen, ChevronRight } from "lucide-react";
import { Role } from "@prisma/client";
import { type TermScheduleResponse } from "@/app/actions/termly-schedule"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RoadmapHubClientProps {
    initialData: TermScheduleResponse | null;
    userRole: Role;
}

/**
 * UNIFIED ROADMAP HUB (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function RoadmapHubClient({ initialData, userRole }: RoadmapHubClientProps) {
    const { profile, isLoading } = useProfileStore();

    // ── LOADING STATE (Rule 14/18/21) ──
    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-6 bg-background animate-in fade-in duration-500">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
                    <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
                </div>
                <p className="text-muted-foreground font-extrabold uppercase italic text-[11px] tracking-[0.4em] animate-pulse">
                    Synchronizing_Timeline...
                </p>
            </div>
        );
    }

    const isIndependent = userRole === Role.INDIVIDUAL_LEARNER || !profile?.schoolId;

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Fluid Container and Padding */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11/21) ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* Rule 21: Scale Protocol Icon Hub */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                            {isIndependent ? (
                                <Globe className="h-8 w-8 text-school-primary" />
                            ) : (
                                <ShieldCheck className="h-8 w-8 text-school-primary" />
                            )}
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-extrabold uppercase italic text-foreground tracking-tighter leading-none">
                                {isIndependent ? "Learning Path" : "Term Roadmap"}
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                {isIndependent 
                                    ? "Global Hub Navigation & Progress" 
                                    : "Institutional Schedule & Syllabus Hub"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {isIndependent ? (
                            <Link href="/subjects/manage">
                                <Button variant="outline" className="border-border bg-surface text-muted-foreground hover:text-foreground rounded-xl uppercase font-extrabold text-[10px] tracking-widest px-8 h-12 shadow-sm transition-all">
                                    <BookOpen className="h-4 w-4 mr-2 text-school-primary" /> Modify Library
                                </Button>
                            </Link>
                        ) : (
                            <div className="px-6 py-3 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-inner group hover:border-school-primary-200 transition-all">
                                <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                                    Institutional Sync Active
                                </span>
                            </div>
                        )}
                    </div>
                </header>

                {initialData && initialData.schedule.length > 0 ? (
                    <div className="animate-in slide-in-from-bottom-6 duration-1000">
                        <TermTimelineView data={initialData} />
                    </div>
                ) : (
                    /* ── REGISTRY STANDBY VIEW (Rule 13/19) ── */
                    <div className="h-[50vh] md:h-[60vh] flex flex-col items-center justify-center text-center p-8 md:p-12 bg-card rounded-[3rem] border-2 border-dashed border-border shadow-2xl animate-in zoom-in-95 duration-500">
                        <div className="h-20 w-20 bg-surface rounded-[1.5rem] border border-border flex items-center justify-center mb-8 shadow-inner">
                            <CalendarX className="h-10 w-10 text-muted-foreground/20" />
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter">Registry Standby</h2>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-relaxed max-w-sm mx-auto italic opacity-70">
                                {isIndependent 
                                    ? "Your personal learning hub is currently empty. Synchronize modules from the global catalogue to generate your roadmap." 
                                    : "Institutional timeline hubs have not been synchronized. Contact your registrar to initialize the terminal roadmap."}
                            </p>
                            {isIndependent && (
                                <Link href="/subjects/manage" className="block pt-6">
                                    <button className="bg-school-primary text-on-school-primary font-extrabold px-12 py-5 rounded-2xl uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 mx-auto">
                                        Open Global Catalogue
                                        <ChevronRight className="h-4 w-4" />
                                    </button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}