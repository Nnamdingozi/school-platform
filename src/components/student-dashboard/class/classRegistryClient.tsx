"use client";

import { StudentClassView, type StudentClassRegistryData } from "./studentClassView";
import { Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/profileStore";
import Link from "next/link";

interface ClassRegistryClientProps {
    initialData: StudentClassRegistryData | null;
    isIndependent: boolean;
}

/**
 * CLASS REGISTRY HUB (Controller Layer)
 * Rule 17: Uses Zustand for branding/session context.
 * Rule 13: Handles Tier-specific fallback UI.
 */
export function ClassRegistryClient({ initialData, isIndependent }: ClassRegistryClientProps) {
    const { profile } = useProfileStore();
    const primaryColor = profile?.primaryColor || "#f59e0b";

    if (isIndependent) {
        return (
            <main className="p-8 md:p-12 bg-slate-950 min-h-screen flex items-center justify-center">
                <div className="max-w-md w-full text-center space-y-6 bg-slate-900/50 p-12 rounded-[3rem] border border-white/5 shadow-2xl">
                    <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
                        <Globe className="h-10 w-10" />
                    </div>
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Private Context</h2>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                            Peer registries are restricted to institutional users. As an independent learner, you operate in a self-paced global tier.
                        </p>
                    </div>
                    <Link href="/student" className="block">
                        <Button className="w-full bg-slate-950 text-school-primary border border-white/10 hover:bg-school-primary hover:text-slate-950 font-black rounded-2xl py-6 transition-all" style={{ color: primaryColor }}>
                            RETURN TO HUB
                        </Button>
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="p-4 md:p-8 bg-slate-950 min-h-screen animate-in fade-in duration-700">
            <div className="max-w-7xl mx-auto space-y-10">
                
                {/* ── HEADER ── */}
                <header className="flex items-center gap-4 border-b border-white/5 pb-8">
                    <div 
                        className="h-12 w-12 rounded-2xl border flex items-center justify-center shadow-lg"
                        style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
                    >
                        <Users className="h-6 w-6" style={{ color: primaryColor }} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
                            Class Registry
                        </h1>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                            Institutional Peer & Classroom Ledger
                        </p>
                    </div>
                </header>

                {/* ── DISPLAY LAYER ── */}
                <StudentClassView data={initialData} />
                
            </div>
        </main>
    );
}