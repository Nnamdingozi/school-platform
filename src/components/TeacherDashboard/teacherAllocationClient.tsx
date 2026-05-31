// 'use client'

// import { useProfileStore } from "@/store/profileStore"
// import { SubjectAllocationClient } from "@/components/admin-dasboard/subjectAllocationClient"
// import { TableProperties, ShieldAlert, Loader2, BookOpen } from "lucide-react"
// import { Card } from "@/components/ui/card"
// import { cn } from "@/lib/utils"

// interface TeacherAllocationClientProps {
//     initialClass: {
//         id: string;
//         name: string;
//         gradeName: string;
//         schoolId: string;
//     } | null;
// }

// /**
//  * TEACHER CLASS MAPPING HUB (Tier 2)
//  * Rule 17: Leverages Zustand for branding context.
//  * Rule 11: Real-time sync of the classroom broadsheet.
//  */
// export function TeacherAllocationClient({ initialClass }: TeacherAllocationClientProps) {
//     const { profile, isLoading } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     if (isLoading) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
//                 <Loader2 className="h-10 w-10 animate-spin text-school-primary" style={{ color: primaryColor }} />
//                 <p className="text-slate-500 font-black uppercase text-[10px] tracking-widest">Hydrating Registry...</p>
//             </div>
//         );
//     }

//     // Rule 13: Graceful Fallback if no class is assigned
//     if (!initialClass) {
//         return (
//             <div className="min-h-screen bg-slate-950 p-8 flex items-center justify-center">
//                 <Card className="max-w-md w-full bg-slate-900 border-white/5 rounded-[3rem] p-12 text-center space-y-6 shadow-2xl">
//                     <div className="h-20 w-20 bg-slate-950 rounded-full flex items-center justify-center mx-auto border border-white/5">
//                         <ShieldAlert className="h-10 w-10 text-slate-700" />
//                     </div>
//                     <div className="space-y-2">
//                         <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">Assignment Missing</h2>
//                         <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
//                             Your instructor profile is not currently mapped to a lead classroom registry. 
//                             Contact administration to initialize placement.
//                         </p>
//                     </div>
//                 </Card>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 md:p-8 lg:p-12 bg-slate-950 min-h-screen text-slate-50 animate-in fade-in duration-700">
//              <div className="max-w-7xl mx-auto space-y-10">
                
//                 {/* ── HEADER ── */}
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
//                     <div className="flex items-center gap-5">
//                         <div 
//                             className="h-14 w-14 rounded-2xl border flex items-center justify-center shadow-2xl shadow-school-primary/10"
//                             style={{ backgroundColor: `${primaryColor}15`, borderColor: `${primaryColor}30` }}
//                         >
//                             <TableProperties className="h-7 w-7" style={{ color: primaryColor }} />
//                         </div>
//                         <div>
//                             <h1 className="text-4xl font-black text-white uppercase italic tracking-tighter leading-none">
//                                 Subject Allocation
//                             </h1>
//                             <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
//                                 {initialClass.name} • {initialClass.gradeName} Registry Hub
//                             </p>
//                         </div>
//                     </div>
                    
//                     <div className="px-6 py-3 rounded-2xl bg-slate-900 border border-white/5 flex items-center gap-3">
//                         <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Lead Context</span>
//                     </div>
//                 </header>

//                 {/* 
//                   ── DATA MODULE ──
//                   Rule 11: We reuse the SubjectAllocationClient but filter 
//                   it strictly to the teacher's single class context. 
//                 */}
//                 <div className="animate-in slide-in-from-bottom-4 duration-1000">
//                     <SubjectAllocationClient 
//                         initialClasses={[{
//                             id: initialClass.id,
//                             name: initialClass.name,
//                             grade: { displayName: initialClass.gradeName, level: 10, id: "DUMMY" },
//                             _count: { enrollments: 0 } // Counts will be re-fetched inside the matrix
//                         }]} 
//                     />
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client'

// import React from 'react'
// import { SubjectAllocationClient } from "@/components/admin-dasboard/subjectAllocationClient"
// import { TableProperties, ShieldAlert, Loader2, Activity } from "lucide-react"
// import { Card } from "@/components/ui/card"


// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface TeacherAllocationClientProps {
//     initialClass: {
//         id: string;
//         name: string;
//         gradeName: string;
//         schoolId: string;
//     } | null;
// }

// /**
//  * TEACHER CLASS MAPPING HUB (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function TeacherAllocationClient({ initialClass }: TeacherAllocationClientProps) {


//     // ── LOADING STATE (Rule 14/21) ──
//     if (isLoading) {
//         return (
//             <div className="h-screen flex flex-col items-center justify-center bg-background gap-6 animate-in fade-in duration-500">
//                 <div className="relative">
//                     <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
//                     <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
//                 </div>
//                 <p className="text-muted-foreground font-extrabold uppercase italic text-[10px] tracking-[0.4em] animate-pulse">
//                     Hydrating_Registry_Ledger...
//                 </p>
//             </div>
//         );
//     }

//     // ── CONTEXTUAL FALLBACK (Rule 13/19) ──
//     if (!initialClass) {
//         return (
//             <div className="min-h-screen bg-background p-6 md:p-12 flex items-center justify-center animate-in zoom-in-95 duration-700">
//                 <Card className="max-w-md w-full bg-card border-border rounded-[2rem] p-10 md:p-14 text-center space-y-8 shadow-2xl">
//                     <div className="h-24 w-24 bg-surface rounded-full flex items-center justify-center mx-auto border border-border shadow-inner">
//                         <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
//                     </div>
//                     <div className="space-y-3">
//                         <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                             Assignment Missing
//                         </h2>
//                         <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
//                             Your instructor profile is not currently mapped to a lead classroom hub. 
//                             Contact administration to initialize registry placement.
//                         </p>
//                     </div>
//                 </Card>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
//             {/* Rule 20: Fluid Container and Padding */}
//             <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
//                 {/* ── HEADER (Rule 11/21) ── */}
//                 <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
//                     <div className="flex items-center gap-6">
//                         {/* Rule 21: Scale Protocol Hub Icon */}
//                         <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
//                             <TableProperties className="h-8 w-8 text-school-primary" />
//                         </div>
//                         <div className="space-y-1.5">
//                             <h1 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                 Subject Allocation
//                             </h1>
//                             <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
//                                 <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                                 {initialClass.name} • {initialClass.gradeName} Registry Hub
//                             </p>
//                         </div>
//                     </div>
                    
//                     {/* Status Badge (Rule 18/21) */}
//                     <div className="px-6 py-3 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-inner group hover:border-school-primary-200 transition-all">
//                         <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
//                         <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
//                             Class Lead Active
//                         </span>
//                     </div>
//                 </header>

//                 {/* ── ALLOCATION MATRIX Hub (Rule 11/20) ── */}
//                 <main className="w-full">
//                     <div className="animate-in slide-in-from-bottom-6 duration-1000">
//                         {/* Syncing props with existing SubjectAllocationClient interface */}
//                         <SubjectAllocationClient 
//                             initialClasses={[{
//                                 id: initialClass.id,
//                                 name: initialClass.name
//                             }]} 
//                         />
//                     </div>
//                 </main>

//                 {/* Visual Depth Footer Accent (Rule 21) */}
//                 <div className="pt-12 flex justify-center items-center gap-3 opacity-20 grayscale hover:opacity-100 transition-all duration-700">
//                     <div className="h-px w-24 bg-border" />
//                     <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Institutional_Governance_Protocol_v4.2</p>
//                     <div className="h-px w-24 bg-border" />
//                 </div>
//             </div>
//         </div>
//     );
// }

'use client'

import React from 'react'
import { useProfileStore } from "@/store/profileStore"
import { SubjectAllocationClient } from "@/components/admin-dasboard/subjectAllocationClient"
import { TableProperties, ShieldAlert, Loader2, Activity } from "lucide-react"
import { Card } from "@/components/ui/card"

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

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
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 14: Optimistic Loading UI synchronized with store.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function TeacherAllocationClient({ initialClass }: TeacherAllocationClientProps) {
    // ✅ FIXED: Initializing isLoading from the authoritative profile store
    const { isLoading } = useProfileStore();

    // ── LOADING STATE (Rule 14/21) ──
    if (isLoading) {
        return (
            <div className="h-screen flex flex-col items-center justify-center bg-background gap-6 animate-in fade-in duration-500">
                <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-school-primary" />
                    <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
                </div>
                <p className="text-muted-foreground font-extrabold uppercase italic text-[10px] tracking-[0.4em] animate-pulse">
                    Hydrating_Registry_Ledger...
                </p>
            </div>
        );
    }

    // ── CONTEXTUAL FALLBACK (Rule 13/19) ──
    if (!initialClass) {
        return (
            <div className="min-h-screen bg-background p-6 md:p-12 flex items-center justify-center animate-in zoom-in-95 duration-700">
                <Card className="max-w-md w-full bg-card border-border rounded-[2rem] p-10 md:p-14 text-center space-y-8 shadow-2xl">
                    <div className="h-24 w-24 bg-surface rounded-full flex items-center justify-center mx-auto border border-border shadow-inner">
                        <ShieldAlert className="h-10 w-10 text-muted-foreground/30" />
                    </div>
                    <div className="space-y-3">
                        <h2 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                            Assignment Missing
                        </h2>
                        <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-relaxed italic opacity-70">
                            Your instructor profile is not currently mapped to a lead classroom hub. 
                            Contact administration to initialize registry placement.
                        </p>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground animate-in fade-in duration-700">
            {/* Rule 20: Fluid Container and Padding */}
            <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 md:space-y-16">
                
                {/* ── HEADER (Rule 11/21) ── */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-border pb-10">
                    <div className="flex items-center gap-6">
                        {/* Rule 21: Scale Protocol Hub Icon */}
                        <div className="h-16 w-16 rounded-2xl border border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-lg transition-colors">
                            <TableProperties className="h-8 w-8 text-school-primary" />
                        </div>
                        <div className="space-y-1.5">
                            <h1 className="text-2xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                                Subject Allocation
                            </h1>
                            <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest mt-2 flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
                                {initialClass.name} • {initialClass.gradeName} Registry Hub
                            </p>
                        </div>
                    </div>
                    
                    {/* Status Badge (Rule 18/21) */}
                    <div className="px-6 py-3 rounded-2xl bg-surface border border-border flex items-center gap-4 shadow-inner group hover:border-school-primary-200 transition-all">
                        <Activity className="h-4 w-4 text-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                            Class Lead Active
                        </span>
                    </div>
                </header>

                {/* ── ALLOCATION MATRIX Hub (Rule 11/20) ── */}
                <main className="w-full">
                    <div className="animate-in slide-in-from-bottom-6 duration-1000">
                        {/* Syncing props with existing SubjectAllocationClient interface */}
                        <SubjectAllocationClient 
                            initialClasses={[{
                                id: initialClass.id,
                                name: initialClass.name
                            }]} 
                        />
                    </div>
                </main>

                {/* Visual Depth Footer Accent (Rule 21) */}
                <div className="pt-12 flex justify-center items-center gap-3 opacity-20 grayscale hover:opacity-100 transition-all duration-700">
                    <div className="h-px w-24 bg-border" />
                    <p className="text-[8px] font-bold uppercase tracking-[0.4em]">Institutional_Governance_Protocol_v4.2</p>
                    <div className="h-px w-24 bg-border" />
                </div>
            </div>
        </div>
    );
}