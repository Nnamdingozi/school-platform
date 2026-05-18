'use client'

import { useProfileStore } from "@/store/profileStore";
import { TermTimelineView } from "@/components/TeacherDashboard/term/termTimelineView";
import { ShieldCheck, CalendarX, Loader2, Globe, Zap, BookOpen } from "lucide-react";
import { Role } from "@prisma/client";
import { type TermScheduleResponse } from "@/app/actions/termly-schedule"
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface RoadmapHubClientProps {
    initialData: TermScheduleResponse | null;
    userRole: Role;
}

/**
 * UNIFIED ROADMAP HUB
 * Rule 6: Adapts terminology and logic for Independent Learners.
 * Rule 17: Injects branding from Zustand.
 */
export function RoadmapHubClient({ initialData, userRole }: RoadmapHubClientProps) {
    const { profile, isLoading } = useProfileStore();
    const primaryColor = profile?.primaryColor || "#f59e0b";

    if (isLoading) {
        return (
            <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-school-primary" style={{ color: primaryColor }} />
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.4em] animate-pulse">Synchronizing_Timeline...</p>
            </div>
        );
    }

    const isIndependent = userRole === Role.INDIVIDUAL_LEARNER || !profile?.schoolId;

    return (
        <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* ── HEADER ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-5">
                        <div 
                            className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
                            style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                        >
                            {isIndependent ? (
                                <Globe className="h-7 w-7" style={{ color: primaryColor }} />
                            ) : (
                                <ShieldCheck className="h-7 w-7" style={{ color: primaryColor }} />
                            )}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black uppercase italic text-white tracking-tighter leading-none">
                                {isIndependent ? "Learning Path" : "Term Roadmap"}
                            </h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3 italic">
                                {isIndependent 
                                    ? "Global Syllabus Navigation & Progress" 
                                    : "Institutional Schedule & Syllabus Registry"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {isIndependent ? (
                            <Link href="/subjects/manage">
                                <Button variant="outline" className="border-white/10 text-slate-400 hover:text-white rounded-xl uppercase font-black text-[10px] tracking-widest px-6 h-12">
                                    <BookOpen className="h-4 w-4 mr-2" /> Modify Library
                                </Button>
                            </Link>
                        ) : (
                            <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
                                <Zap className="h-4 w-4 text-emerald-500 animate-pulse" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Institutional Sync Active</span>
                            </div>
                        )}
                    </div>
                </header>

                {initialData && initialData.schedule.length > 0 ? (
                    <div className="animate-in slide-in-from-bottom-4 duration-1000">
                        <TermTimelineView data={initialData} />
                    </div>
                ) : (
                    /* Rule 13: Registry Standby View */
                    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-12 bg-slate-900/30 rounded-[3rem] border border-dashed border-white/5 animate-in zoom-in-95">
                        <CalendarX className="h-16 w-16 text-slate-800 mb-6" />
                        <div className="space-y-4">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Registry Standby</h2>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs mx-auto">
                                {isIndependent 
                                    ? "Your personal learning library is empty. Select modules from the global catalogue to generate your roadmap." 
                                    : "Institutional term dates have not been synchronized. Contact your registrar to initialize the timeline."}
                            </p>
                            {isIndependent && (
                                <Link href="/subjects/manage" className="block pt-4">
                                    <Button className="bg-school-primary text-slate-950 font-black px-10 py-6 rounded-2xl uppercase text-[10px] tracking-widest shadow-xl" style={{ backgroundColor: primaryColor }}>
                                        Open Global Catalogue
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}