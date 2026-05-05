'use client'

import { useState } from "react"
import { CurriculumCard } from "./curriculum-card"
import { useProfileStore } from "@/store/profileStore"
import { 
    BookMarked, Settings2, CheckCircle2, 
    AlertCircle, Loader2, ChevronRight 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { type CurriculumStats } from "@/app/actions/curiculum-stats"

// ── Types ──────────────────────────────────────────────────────────────────────

interface GradeWithSubjects {
    id: string;
    displayName: string;
    gradeSubjects: { id: string }[];
}

interface CurriculumManagementClientProps {
    initialGrades: GradeWithSubjects[];
    initialStats: CurriculumStats | null;
}

/**
 * INSTITUTIONAL ARCHITECTURE CONSOLE (Tier 2)
 * Rule 17: Pulls branding context from Zustand.
 */
export function CurriculumManagementClient({ initialGrades, initialStats }: CurriculumManagementClientProps) {
    const { profile } = useProfileStore();
    const primaryColor = profile?.primaryColor || "#f59e0b";

    return (
        <div className="p-4 md:p-8 lg:p-12 space-y-12 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            
            {/* ── Page Header ── */}
            <header className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div 
                        className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl"
                        style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                    >
                        <BookMarked className="h-7 w-7" style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Registry Architect</h1>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 italic">Institutional Master Syllabus Oversight</p>
                    </div>
                </div>

                <Button asChild variant="outline" className="border-white/10 text-slate-400 hover:bg-white/5 uppercase text-[10px] font-black tracking-widest px-6 h-12 rounded-xl">
                    <Link href="/admin/settings?tab=curriculum">
                        <Settings2 className="w-4 h-4 mr-2" style={{ color: primaryColor }} /> Terminology Settings
                    </Link>
                </Button>
            </header>

            <main className="max-w-5xl mx-auto space-y-10">
                
                {/* ── SECTION 01: STATUS CARD ── */}
                <section className="space-y-4">
                    <div className="flex items-center gap-3 px-2">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>01</span>
                        <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">System Vitality</h3>
                    </div>
                    <CurriculumCard initialStats={initialStats} />
                </section>

                {/* ── SECTION 02: GRADE AUDIT ── */}
                <section className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: primaryColor }}>02</span>
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-white">Grade Matrix Health</h3>
                        </div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase font-mono italic">
                            {initialGrades.length} Nodes Discovered
                        </span>
                    </div>

                    <Card className="bg-slate-900 border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-left text-slate-500 text-[10px] uppercase tracking-widest bg-slate-950/40 border-b border-white/5 font-black">
                                            <th className="px-10 py-6 italic">Academic Level</th>
                                            <th className="px-10 py-6 italic">Active Modules</th>
                                            <th className="px-10 py-6 italic">Registry Status</th>
                                            <th className="px-10 py-6 text-right italic">Audit</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {initialGrades.map((grade) => (
                                            <tr key={grade.id} className="hover:bg-white/[0.02] transition-all group">
                                                <td className="px-10 py-8 font-black text-white uppercase italic text-lg">
                                                    {grade.displayName}
                                                </td>
                                                <td className="px-10 py-8">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-12 bg-slate-950 rounded-lg border border-white/5 flex items-center justify-center text-xs font-mono font-bold shadow-inner" style={{ color: primaryColor }}>
                                                            {grade.gradeSubjects?.length || 0}
                                                        </div>
                                                        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter italic">Items</span>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-8">
                                                    {(grade.gradeSubjects?.length || 0) >= 8 ? (
                                                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                                            <CheckCircle2 className="h-4 w-4" /> Synchronized
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-widest">
                                                            <AlertCircle className="h-3 w-3" /> Under-Provisioned
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-10 py-8 text-right">
                                                    <Link href={`/admin/curriculum/allocation?gradeId=${grade.id}`}>
                                                        <Button variant="ghost" className="h-12 px-6 rounded-2xl bg-slate-950 border border-white/5 group-hover:bg-school-primary group-hover:text-slate-950 transition-all shadow-lg flex items-center gap-2 text-[10px] font-black uppercase tracking-widest" style={{ '--hover-bg': primaryColor } as any}>
                                                            Manage
                                                            <ChevronRight className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    )
}