'use client'

import { useProfileStore } from "@/store/profileStore"
import { SubjectsGrid } from "@/components/student-dashboard/subjects-grid"
import { BookOpen, Globe, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"

/**
 * Rule 15: Props synced with refactored getStudentDashboardData action.
 */
interface MySyllabusClientProps {
    initialData: {
        student: any;
        classroom: {
            name: string;
            teacher?: { name: string | null };
            grade: { level: number };
        } | null;
        school: { name: string } | null;
        subjects: any[];
        isIndependent: boolean;
    }
}

/**
 * STUDENT SYLLABUS HUB
 * Rule 17: Leverages Zustand for branding context.
 * Rule 13: Adapts labels for Independent vs Institutional tiers.
 */
export function MySyllabusClient({ initialData }: MySyllabusClientProps) {
    const { profile } = useProfileStore();
    const { classroom, subjects, isIndependent, school } = initialData;

    const primaryColor = profile?.primaryColor || "#f59e0b";

    // Tier-Aware Labeling (Rule 13)
    const pageTitle = isIndependent ? "Personal Library" : "My Syllabus";
    const subTitle = isIndependent 
        ? "Global academic modules registered to your profile" 
        : `Authorized curriculum for ${classroom?.name || "assigned class"}`;

    return (
        <div className="p-4 md:p-8 bg-slate-950 min-h-screen text-white animate-in fade-in duration-700">
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
                                <BookOpen className="h-7 w-7" style={{ color: primaryColor }} />
                            )}
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                                    {pageTitle}
                                </h1>
                                {isIndependent && (
                                    <Badge className="bg-school-primary/10 text-school-primary border-school-primary/20 text-[9px] font-black uppercase">
                                        <Sparkles className="h-3 w-3 mr-1" /> Tier 3
                                    </Badge>
                                )}
                            </div>
                            <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2 italic">
                                {subTitle}
                            </p>
                        </div>
                    </div>

                    {!isIndependent && school && (
                        <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 shadow-inner hidden md:block">
                            <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Environment</p>
                            <p className="text-sm font-bold text-white uppercase mt-1 italic">{school.name}</p>
                        </div>
                    )}
                </header>

                {/* ── DATA GRID (Rule 11 DB Truth) ── */}
                <SubjectsGrid
                    subjects={subjects}
                    classTeacherName={isIndependent ? "Registry AI" : (classroom?.teacher?.name || "Staff")}
                    gradeLevel={classroom?.grade?.level || 10}
                    isIndependent={isIndependent}
                />
                
            </div>
        </div>
    );
}