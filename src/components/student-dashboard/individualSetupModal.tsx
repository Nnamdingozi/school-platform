// components/student-dashboard/IndividualSetupModal.tsx
'use client';

import { useState, useEffect, useTransition } from 'react';
import { getGradesForCurriculum, getSubjectsForGrade, saveIndividualSetup } from '@/app/actions/individualSetupuAction';
import { Loader2, Check, ChevronRight, GraduationCap, BookOpen } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

interface Grade { id: string; level: number; displayName: string; }
interface GradeSubject { id: string; subject: { name: string }; }

interface Props {
    profileId: string;
    curriculumId: string;
    onComplete: () => void;
}

export function IndividualSetupModal({ profileId, curriculumId, onComplete }: Props) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState<'grade' | 'subjects'>('grade');

    const [grades, setGrades] = useState<Grade[]>([]);
    const [subjects, setSubjects] = useState<GradeSubject[]>([]);
    const [selectedGradeId, setSelectedGradeId] = useState<string>('');
    const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    // Load grades on mount
    useEffect(() => {
        getGradesForCurriculum(curriculumId).then(res => {
            if (res.success) setGrades(res.data);
            setLoading(false);
        });
    }, [curriculumId]);

    // Load subjects when grade selected
    useEffect(() => {
        if (!selectedGradeId) return;
        setLoading(true);
        getSubjectsForGrade(selectedGradeId).then(res => {
            if (res.success) setSubjects(res.data);
            setLoading(false);
        });
    }, [selectedGradeId]);

    const toggleSubject = (id: string) => {
        setSelectedSubjectIds(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleSave = () => {
        if (selectedSubjectIds.length === 0) {
            toast.error('Select at least one subject.');
            return;
        }
        startTransition(async () => {
            const res = await saveIndividualSetup(profileId, selectedSubjectIds);
            if (res.success) {
                toast.success('Learning hub personalized.');
                router.refresh();
                onComplete();
            } else {
                toast.error(res.error ?? 'Setup failed.');
            }
        });
    };

    return (
        // Backdrop
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 space-y-8 shadow-2xl animate-in zoom-in-95 duration-300">

                {/* Header */}
                <div className="space-y-2">
                    <div className="h-14 w-14 bg-school-primary rounded-2xl flex items-center justify-center shadow-xl mb-4">
                        <GraduationCap className="h-7 w-7 text-on-school-primary" />
                    </div>
                    <h2 className="text-2xl font-extrabold uppercase italic tracking-tighter text-white">
                        {step === 'grade' ? 'Select Your Grade' : 'Select Your Subjects'}
                    </h2>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        {step === 'grade'
                            ? 'What level are you currently studying?'
                            : 'Choose the subjects you want to learn'
                        }
                    </p>
                </div>

                {/* Step indicator */}
                <div className="flex items-center gap-3">
                    {['grade', 'subjects'].map((s, i) => (
                        <div key={s} className="flex items-center gap-3">
                            <div className={cn(
                                "h-7 w-7 rounded-xl flex items-center justify-center text-[10px] font-black transition-all",
                                step === s || (s === 'grade' && selectedGradeId)
                                    ? "bg-school-primary text-on-school-primary"
                                    : "bg-slate-800 text-slate-500"
                            )}>
                                {s === 'grade' && selectedGradeId ? <Check className="h-3.5 w-3.5" /> : i + 1}
                            </div>
                            {i === 0 && <div className="h-[1px] w-8 bg-slate-800" />}
                        </div>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-school-primary/40" />
                    </div>
                ) : step === 'grade' ? (
                    <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                        {grades.map(g => (
                            <button
                                key={g.id}
                                onClick={() => setSelectedGradeId(g.id)}
                                className={cn(
                                    "p-4 rounded-2xl border-2 text-left transition-all duration-300",
                                    selectedGradeId === g.id
                                        ? "border-school-primary bg-school-primary/10 scale-[1.02]"
                                        : "border-slate-800 bg-slate-950 hover:border-slate-700"
                                )}
                            >
                                <p className="text-xs font-extrabold uppercase italic text-white tracking-tighter">
                                    {g.displayName}
                                </p>
                                <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                                    Level {g.level}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {subjects.map(gs => {
                            const isSelected = selectedSubjectIds.includes(gs.id);
                            return (
                                <button
                                    key={gs.id}
                                    onClick={() => toggleSubject(gs.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-300",
                                        isSelected
                                            ? "border-school-primary bg-school-primary/10"
                                            : "border-slate-800 bg-slate-950 hover:border-slate-700"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <BookOpen className={cn(
                                            "h-4 w-4",
                                            isSelected ? "text-school-primary" : "text-slate-500"
                                        )} />
                                        <span className="text-xs font-extrabold uppercase italic text-white tracking-tighter">
                                            {gs.subject.name}
                                        </span>
                                    </div>
                                    {isSelected && <Check className="h-4 w-4 text-school-primary stroke-[3]" />}
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-4 pt-2">
                    {step === 'subjects' && (
                        <button
                            onClick={() => setStep('grade')}
                            disabled={isPending}
                            className="px-6 h-14 rounded-2xl border border-slate-800 bg-slate-950 text-slate-400 font-extrabold text-[10px] uppercase tracking-widest"
                        >
                            Back
                        </button>
                    )}
                    <button
                        onClick={step === 'grade'
                            ? () => { if (selectedGradeId) setStep('subjects'); }
                            : handleSave
                        }
                        disabled={
                            isPending ||
                            (step === 'grade' && !selectedGradeId) ||
                            (step === 'subjects' && selectedSubjectIds.length === 0)
                        }
                        className="flex-1 h-14 bg-school-primary text-on-school-primary font-extrabold rounded-2xl uppercase text-[10px] tracking-widest shadow-xl disabled:opacity-40 flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                {step === 'grade' ? 'Continue' : 'Unlock Dashboard'}
                                <ChevronRight className="h-4 w-4" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}