'use client'

import { useState, useTransition, useMemo } from 'react';
import { useProfileStore } from "@/store/profileStore";
import { submitSeniorSubjects } from "@/app/actions/subject-allocation";
import { 
    BookOpen, Info, Loader2, 
    Zap, Check, AlertTriangle, CheckCircle2 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getErrorMessage } from '@/lib/error-handler';
import { type SubjectAllocationData } from "@/app/actions/subject-allocation";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StudentElectiveClientProps {
    allocationData: SubjectAllocationData;
    initialSelectedIds: string[];
    studentId: string;
    schoolId: string;
}

/**
 * STUDENT ELECTIVE CONSOLE (Tier 3 Interactivity)
 * Rule 14: Optimistic UI state for subject toggling.
 * Rule 17: Pulls primary branding from Zustand.
 */
export function StudentElectiveClient({ 
    allocationData, 
    initialSelectedIds, 
    studentId, 
    schoolId 
}: StudentElectiveClientProps) {
    const { profile } = useProfileStore();
    const [isPending, startTransition] = useTransition();

    // Rule 11: Set initial state from database truth
    const [selected, setSelected] = useState<string[]>(initialSelectedIds);

    const primaryColor = profile?.primaryColor || "#f59e0b";

    // ── Handlers ──

    /**
     * Rule 14: Optimistic Toggle
     */
    const toggleSubject = (id: string, isCompulsory: boolean) => {
        if (isCompulsory) return; // Rule 3: Core subjects are read-only
        
        setSelected(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    const handleConfirm = async () => {
        // Policy Guard (e.g., WAEC standard)
        if (allocationData.isNigerianCurriculum && allocationData.grade.isSSS && selected.length < 9) {
            toast.error("Academic Policy: Senior Secondary requires a minimum of 9 subjects.");
            return;
        }

        startTransition(async () => {
            try {
                // Rule 10: Backend Security
                const res = await submitSeniorSubjects(schoolId, studentId, selected);
                if (res.success) {
                    toast.success("Identity registry synchronized. Selection pending approval.");
                } else {
                    toast.error(res.error || "Submission failed.");
                }
            } catch (err: unknown) {
                toast.error(getErrorMessage(err));
            }
        });
    };

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* ── HEADER ── */}
                <header className="space-y-4 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-slate-900 rounded-2xl border border-white/5 shadow-xl">
                            <BookOpen className="h-6 w-6" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">Subject Selection</h1>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2">Personal Academic Roadmap Configuration</p>
                        </div>
                    </div>
                </header>

                {/* ── GUIDANCE ── */}
                <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-8 flex items-start gap-6 shadow-2xl">
                    <Info className="h-6 w-6 shrink-0 mt-1" style={{ color: primaryColor }} />
                    <div className="space-y-2">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Institutional Protocol</p>
                        <p className="text-xs text-slate-400 leading-relaxed italic font-medium uppercase">
                            You are required to maintain a <span className="text-white font-bold underline underline-offset-4" style={{ textDecorationColor: primaryColor }}>minimum of 9 subjects</span>. 
                            Core academic nodes are locked and cannot be removed from your registry.
                        </p>
                    </div>
                </div>

                {/* ── GRID ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allocationData.availableSubjects.map((sub) => {
                        const isSelected = selected.includes(sub.id);
                        const isCore = sub.isCompulsory;

                        return (
                            <div 
                                key={sub.id}
                                onClick={() => toggleSubject(sub.id, isCore)}
                                className={cn(
                                    "p-6 rounded-[2rem] border transition-all duration-300 cursor-pointer flex items-center justify-between group",
                                    isSelected 
                                        ? "bg-slate-900 shadow-2xl" 
                                        : "bg-slate-950 border-white/5 hover:border-white/10"
                                )}
                                style={isSelected ? { borderColor: `${primaryColor}40` } : {}}
                            >
                                <div className="flex items-center gap-4">
                                    <div 
                                        className={cn(
                                            "h-12 w-12 rounded-xl flex items-center justify-center transition-all border border-white/5 shadow-inner",
                                            isSelected ? "text-slate-950" : "text-slate-700"
                                        )}
                                        style={isSelected ? { backgroundColor: primaryColor } : {}}
                                    >
                                        <BookOpen className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-white uppercase italic tracking-tight">
                                            {sub.subjectName}
                                        </p>
                                        {isCore && (
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60" style={{ color: primaryColor }}>Required Core</span>
                                        )}
                                    </div>
                                </div>
                                <div 
                                    className="h-10 w-10 rounded-full border flex items-center justify-center transition-all"
                                    style={isSelected ? { backgroundColor: `${primaryColor}15`, borderColor: primaryColor, color: primaryColor } : { borderColor: 'rgba(255,255,255,0.05)', color: '#1e293b' }}
                                >
                                    {isSelected ? <Check className="h-5 w-5 stroke-[3]" /> : <Zap className="h-5 w-5" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── SUBMISSION ── */}
                <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-8">
                    <div 
                        className="px-6 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                        style={{ 
                            backgroundColor: selected.length >= 9 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                            borderColor: selected.length >= 9 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)',
                            color: selected.length >= 9 ? '#10b981' : primaryColor
                        }}
                    >
                        {selected.length} / 9 Nodes Synchronized
                    </div>

                    <button 
                        onClick={handleConfirm}
                        disabled={isPending || selected.length < 9}
                        className="w-full max-w-sm text-slate-950 font-black py-6 rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3"
                        style={{ backgroundColor: primaryColor }}
                    >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                        Transmit Selections
                    </button>
                    
                    <div className="flex items-center gap-3 text-slate-600 opacity-50">
                        <AlertTriangle className="h-4 w-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest italic">Changes subject to administrative verification</p>
                    </div>
                </div>
            </div>
        </div>
    );
}