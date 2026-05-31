// "use client";

// import { StudentClassView, type StudentClassRegistryData } from "./studentClassView";
// import { Users, Globe } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { useProfileStore } from "@/store/profileStore";
// import Link from "next/link";

// interface ClassRegistryClientProps {
//     initialData: StudentClassRegistryData | null;
//     isIndependent: boolean;
// }

// /**
//  * CLASS REGISTRY HUB (Controller Layer)
//  * Rule 17: Uses Zustand for branding/session context.
//  * Rule 13: Handles Tier-specific fallback UI.
//  */
// export function ClassRegistryClient({ initialData, isIndependent }: ClassRegistryClientProps) {
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     if (isIndependent) {
//         return (
//             <main className="p-8 md:p-12 bg-slate-950 min-h-screen flex items-center justify-center">
//                 <div className="max-w-md w-full text-center space-y-6 bg-slate-900/50 p-12 rounded-[3rem] border border-white/5 shadow-2xl">
//                     <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-500/20">
//                         <Globe className="h-10 w-10" />
//                     </div>
//                     <div className="space-y-2">
//                         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Private Context</h2>
//                         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
//                             Peer registries are restricted to institutional users. As an independent learner, you operate in a self-paced global tier.
//                         </p>
//                     </div>
//                     <Link href="/student" className="block">
//                         <Button className="w-full bg-slate-950 text-school-primary border border-white/10 hover:bg-school-primary hover:text-slate-950 font-black rounded-2xl py-6 transition-all" style={{ color: primaryColor }}>
//                             RETURN TO HUB
//                         </Button>
//                     </Link>
//                 </div>
//             </main>
//         );
//     }

//     return (
//         <main className="p-4 md:p-8 bg-slate-950 min-h-screen animate-in fade-in duration-700">
//             <div className="max-w-7xl mx-auto space-y-10">
                
//                 {/* ── HEADER ── */}
//                 <header className="flex items-center gap-4 border-b border-white/5 pb-8">
//                     <div 
//                         className="h-12 w-12 rounded-2xl border flex items-center justify-center shadow-lg"
//                         style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                     >
//                         <Users className="h-6 w-6" style={{ color: primaryColor }} />
//                     </div>
//                     <div>
//                         <h1 className="text-3xl font-black uppercase italic text-white tracking-tighter leading-none">
//                             Class Registry
//                         </h1>
//                         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
//                             Institutional Peer & Classroom Ledger
//                         </p>
//                     </div>
//                 </header>

//                 {/* ── DISPLAY LAYER ── */}
//                 <StudentClassView data={initialData} />
                
//             </div>
//         </main>
//     );
// }



"use client";

import React from "react";
import { StudentClassView, type StudentClassRegistryData } from "./studentClassView";
import { Users, Globe, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";


interface ClassRegistryClientProps {
    initialData: StudentClassRegistryData | null;
    isIndependent: boolean;
}

/**
 * CLASS REGISTRY HUB (Controller Layer)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 13: Contextual View - Gates peer registries for Independent Learners.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem] and [3rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function ClassRegistryClient({ initialData, isIndependent }: ClassRegistryClientProps) {

    if (isIndependent) {
        return (
            <main className="p-4 md:p-12 bg-background min-h-[80vh] flex items-center justify-center animate-in fade-in zoom-in-95 duration-700">
                {/* Rule 19: Restricted Hub standard radius [3rem] */}
                <div className="max-w-md w-full text-center space-y-8 bg-card p-8 md:p-12 rounded-[3rem] border border-border shadow-2xl relative overflow-hidden">
                    {/* Rule 21: Brand Scale Decoration */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                    
                    <div className="relative z-10 space-y-6">
                        <div className="h-20 w-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-500 border border-amber-200 shadow-inner">
                            <Globe className="h-10 w-10" />
                        </div>
                        <div className="space-y-3">
                            <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                                Private Hub
                            </h2>
                            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest leading-relaxed italic">
                                Peer registries are restricted to institutional users. As an independent learner, you operate in a dedicated self-paced global hub.
                            </p>
                        </div>
                        <Link href="/student" passHref>
                            <Button 
                                className="w-full h-14 bg-school-primary text-on-school-primary font-extrabold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                RETURN TO HUB
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Standardized Container & Fluid Spacing */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11/21) ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* Rule 21: Scale Protocol Icon Box */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                            <Users className="h-8 w-8 text-school-primary" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl md:text-4xl font-extrabold uppercase italic text-foreground tracking-tighter leading-none">
                                Class Registry
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                Institutional Peer & Classroom Ledger
                            </p>
                        </div>
                    </div>
                </header>

                {/* ── DISPLAY LAYER ── */}
                <div className="w-full animate-in slide-in-from-bottom-4 duration-700">
                    <StudentClassView data={initialData} />
                </div>
                
            </div>
        </main>
    );
}