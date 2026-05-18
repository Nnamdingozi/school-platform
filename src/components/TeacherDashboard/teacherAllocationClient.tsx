'use client'

import { useProfileStore } from "@/store/profileStore"
import { SubjectAllocationClient } from "@/components/admin-dasboard/subjectAllocationClient"
import { TableProperties, ShieldAlert, Loader2, BookOpen } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TeacherAllocationClientProps {
    initialClass: {
        id: string;
        name: string;
        gradeName: string;
        schoolId: string;
    } | null;
}

/**
 * TEACHER CLASS MAPPING HUB (Tier 2)
 * Rule 17: Leverages Zustand for branding context.
 * Rule 11: Real-time sync of the classroom broadsheet.
 */
export function TeacherAllocationClient({ initialClass }: TeacherAllocationClientProps) {
    const { profile, isLoading } = useProfileStore();
    const primaryColor = profile?.primaryColor || "#f59e0b";

    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-school-primary" style={{ color: primaryColor }} />
                <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Hydrating Registry...</p>
            </div>
        );
    }

    // Rule 13: Graceful Fallback if no class is assigned
    if (!initialClass) {
        return (
            <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
                <Card className="max-w-md w-full bg-slate-900 border-white/5 rounded-[3rem] p-12 text-center space-y-6 shadow-2xl">
                    <div className="h-20 w-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto border border-white/5">
                        <ShieldAlert className="h-10 w-10 text-slate-700" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Assignment Missing</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Your instructor profile is not currently mapped to a lead classroom registry. 
                            Contact administration to initialize placement.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
             <div className="max-w-7xl mx-auto space-y-10">
                
                {/* ── HEADER ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-5">
                        <div 
                            className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl shadow-school-primary/10"
                            style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                        >
                            <TableProperties className="h-7 w-7" style={{ color: primaryColor }} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
                                Subject Allocation
                            </h1>
                            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                                {initialClass.name} • {initialClass.gradeName} Registry Hub
                            </p>
                        </div>
                    </div>
                    
                    <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Lead Context</span>
                    </div>
                </header>

                {/* 
                  ── DATA MODULE ──
                  Rule 11: We reuse the SubjectAllocationClient but filter 
                  it strictly to the teacher's single class context. 
                */}
                <div className="animate-in slide-in-from-bottom-4 duration-1000">
                    <SubjectAllocationClient 
                        initialClasses={[{
                            id: initialClass.id,
                            name: initialClass.name,
                            grade: { displayName: initialClass.gradeName, level: 10, id: "DUMMY" },
                            _count: { enrollments: 0 } // Counts will be re-fetched inside the matrix
                        }]} 
                    />
                </div>
            </div>
        </div>
    );
}