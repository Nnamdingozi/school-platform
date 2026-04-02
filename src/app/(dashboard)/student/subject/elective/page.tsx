// 'use client'

// import { useState } from 'react';
// import { useProfileStore } from "@/store/profileStore";
// import { submitSeniorSubjects } from "@/app/actions/subject-allocation";
// import { toast } from "sonner";

// export default function StudentElectivePage() {
//     const { profile } = useProfileStore();
//     const [selected, setSelected] = useState<string[]>([]);

//     const handleConfirm = async () => {
//         const res = await submitSeniorSubjects(profile!.schoolId!, profile!.id, selected);
//         if (res.success) toast.success("Selection submitted for teacher approval.");
//     };

//     return (
//         <div className="p-8 max-w-2xl mx-auto">
//             <h1 className="text-2xl font-black text-white uppercase italic">Subject Selection</h1>
//             <p className="text-slate-500 mb-8">Choose your electives according to your department.</p>
            
//             {/* Logic: Display checkboxes for available subjects in their Grade */}
//             {/* ... (UI implementation) ... */}

//             <button 
//                 onClick={handleConfirm}
//                 className="w-full bg-school-primary text-school-secondary-950 font-black py-4 rounded-2xl mt-8"
//             >
//                 SUBMIT SELECTION
//             </button>
//         </div>
//     );
// }


'use client'

import { useState, useEffect, useTransition } from 'react';
import { useProfileStore } from "@/store/profileStore";
import { isTeacherProfile } from "@/types/profile";
import { getClassSubjectAllocation, submitSeniorSubjects } from "@/app/actions/subject-allocation";
import { 
    BookOpen, CheckCircle2, Info, Loader2, 
    Zap, Check, AlertTriangle 
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { getErrorMessage } from '@/lib/error-handler';

// --- Types ---
interface Subject {
    id: string;
    subjectName: string;
    isCompulsory: boolean;
}

export default function StudentElectivePage() {
    const { profile } = useProfileStore();
    const [availableSubjects, setAvailableSubjects] = useState<Subject[]>([]);
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isPending, startTransition] = useTransition();

    // 1. Fetch available subjects for the student's current grade
    useEffect(() => {
        async function loadSubjects() {
            // Find the student's active class ID
            if (!profile || !isTeacherProfile(profile)) return; 

        // Now TypeScript knows 'classEnrollments' exists
        const classId = profile.classEnrollments[0]?.classId;
        const schoolId = profile.schoolId;

        if (!classId || !schoolId) {
            setLoading(false);
            return;
        }

            try {
                const res = await getClassSubjectAllocation(classId, schoolId);
                if (res) {
                    setAvailableSubjects(res.availableSubjects);
                    // Pre-fill with subjects student already has (if any)
                    const existing = res.students.find(s => s.id === profile?.id)?.subjects || [];
                    setSelected(existing);
                }
            } catch (err) {
                toast.error("Failed to load academic catalog.");
                getErrorMessage(err)
            } finally {
                setLoading(false);
            }
        }
        loadSubjects();
    }, [profile]);

    // 2. Toggle Selection (Utilizing setSelected)
    const toggleSubject = (id: string, isCompulsory: boolean) => {
        if (isCompulsory) return; // Core subjects cannot be toggled off
        
        setSelected(prev => 
            prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id]
        );
    };

    // 3. Final Submission
    const handleConfirm = async () => {
        if (selected.length < 9) {
            toast.error("Academic Policy: A minimum of 9 subjects is required.");
            return;
        }

        startTransition(async () => {
            const res = await submitSeniorSubjects(profile!.schoolId!, profile!.id, selected);
            if (res.success) {
                toast.success("Selection transmitted for teacher approval.");
            } else {
                toast.error(res.error || "Submission failed.");
            }
        });
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
            <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest animate-pulse">
                Accessing_Subject_Registry...
            </p>
        </div>
    );

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50">
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* ── Header ── */}
                <header className="space-y-2 border-b border-white/5 pb-8">
                    <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter">Subject Selection</h1>
                    <p className="text-slate-500 text-sm">Design your academic path by selecting your elective courses.</p>
                </header>

                {/* ── Guidance Banner ── */}
                <div className="bg-school-primary/5 border border-school-primary/20 rounded-3xl p-6 flex items-start gap-4 shadow-2xl">
                    <Info className="h-6 w-6 text-school-primary shrink-0 mt-1" />
                    <div className="space-y-1">
                        <p className="text-xs font-black text-white uppercase tracking-widest">Academic Requirements</p>
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                            You must maintain a <span className="text-white font-bold underline decoration-school-primary">minimum of 9 subjects</span>. 
                            Core subjects are automatically locked into your registry.
                        </p>
                    </div>
                </div>

                {/* ── Subject Grid ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {availableSubjects.map((sub) => {
                        const isSelected = selected.includes(sub.id);
                        return (
                            <div 
                                key={sub.id}
                                onClick={() => toggleSubject(sub.id, sub.isCompulsory)}
                                className={cn(
                                    "p-6 rounded-[2rem] border transition-all cursor-pointer flex items-center justify-between group",
                                    isSelected 
                                        ? "bg-school-primary/10 border-school-primary/40 shadow-xl" 
                                        : "bg-slate-900 border-white/5 hover:border-white/20"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-xl flex items-center justify-center transition-all",
                                        isSelected ? "bg-school-primary text-slate-950 shadow-lg" : "bg-slate-950 text-slate-600"
                                    )}>
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase italic tracking-tight">
                                            {sub.subjectName}
                                        </p>
                                        {sub.isCompulsory && (
                                            <span className="text-[9px] font-black text-school-primary uppercase tracking-[0.2em]">Required Core</span>
                                        )}
                                    </div>
                                </div>
                                <div className={cn(
                                    "h-8 w-8 rounded-full border flex items-center justify-center transition-all",
                                    isSelected ? "bg-school-primary border-school-primary text-slate-950" : "border-white/10 text-slate-800"
                                )}>
                                    {isSelected ? <Check className="h-4 w-4 stroke-[4]" /> : <Zap className="h-4 w-4" />}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* ── Footer / Submission ── */}
                <div className="pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all",
                            selected.length >= 9 ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-amber-500/10 border-amber-500/30 text-amber-500"
                        )}>
                            {selected.length} / 9 Subjects Selected
                        </div>
                    </div>

                    <button 
                        onClick={handleConfirm}
                        disabled={isPending || selected.length < 9}
                        className="w-full max-w-sm bg-school-primary text-school-secondary-950 font-black py-5 rounded-[2rem] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-20 uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
                    >
                        {isPending ? <Loader2 className="h-5 w-5 animate-spin" /> : <CheckCircle2 className="h-5 w-5" />}
                        Finalize Selection
                    </button>
                    
                    <p className="text-[10px] text-slate-600 font-bold uppercase tracking-widest flex items-center gap-2 italic">
                        <AlertTriangle className="h-3.5 w-3.5" /> All selections require Class Teacher verification
                    </p>
                </div>
            </div>
        </div>
    );
}


