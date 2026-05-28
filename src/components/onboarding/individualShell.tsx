// 'use client';

// import { useEffect, useState } from 'react';
// import { useRegisterStore } from '@/store/individualOnboardingStore';
// import { RegisterAccountStep } from '@/app/steps/individual/accountRegisterStep';
// import { RegisterPlanStep } from '@/app/steps/individual/planStep';
// import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
// import { GraduationCap, ShieldCheck, Globe } from 'lucide-react';
// import { cn } from '@/lib/utils';

// export function RegisterShell({ initialPlans }: { initialPlans: any[] }) {
//     const { step, isRegistered, setPlans } = useRegisterStore();

//     useEffect(() => {
//         setPlans(initialPlans);
//     }, [initialPlans, setPlans]);

//     if (isRegistered) {
//         return (
//             <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
//                 <ConfirmationScreen />
//             </div>
//         );
//     }

//     return (
//         <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
//             {/* Header */}
//             <div className="text-center space-y-4">
//                 <div className="h-16 w-16 bg-school-primary rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-school-primary/20">
//                     <GraduationCap className="h-10 w-10 text-slate-950" strokeWidth={2.5} />
//                 </div>
//                 <div>
//                     <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Personal Registry</h1>
//                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Identity Node Initialization</p>
//                 </div>
//             </div>

//             {/* Step Content */}
//             <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
//                 <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary/5 rounded-full blur-3xl" />
                
//                 <div className="relative z-10">
//                     {step === 1 ? <RegisterAccountStep /> : <RegisterPlanStep />}
//                 </div>
//             </div>

//             {/* Global Tier Indicator */}
//             <div className="flex justify-center items-center gap-6 opacity-30">
//                 <div className="flex items-center gap-2">
//                     <Globe className="h-3 w-3 text-slate-400" />
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Tier 3 Node</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <ShieldCheck className="h-3 w-3 text-slate-400" />
//                     <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Encrypted Registry</span>
//                 </div>
//             </div>
//         </div>
//     );
// }



'use client';

import React, { useEffect } from 'react';
import { useRegisterStore } from '@/store/individualOnboardingStore';
import { RegisterAccountStep } from '@/app/steps/individual/accountRegisterStep';
import { RegisterPlanStep } from '@/app/steps/individual/planStep';
import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
import { GraduationCap, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RegisterShellProps {
    initialPlans: any[]; // Rule 15: Synced with Server-fetched plans
}

/**
 * PERSONAL REGISTRY SHELL (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, border-border).
 * Rule 19: Standardized Geometry [2.5rem] for onboarding shells.
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function RegisterShell({ initialPlans }: RegisterShellProps) {
    const { step, isRegistered, setPlans } = useRegisterStore();

    useEffect(() => {
        // Rule 11: Synchronize Tier-1 Global plans into the local state hub
        setPlans(initialPlans);
    }, [initialPlans, setPlans]);

    if (isRegistered) {
        return (
            <div className="w-full max-w-md animate-in zoom-in-95 duration-700">
                <ConfirmationScreen />
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* ── HEADER (Rule 11/21) ── */}
            <div className="text-center space-y-4">
                <div 
                    className="h-20 w-20 bg-school-primary rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-school-primary-200 transition-transform hover:scale-105 duration-500"
                >
                    <GraduationCap className="h-10 w-10 text-on-school-primary" strokeWidth={2.5} />
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                        Personal Registry
                    </h1>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-2">
                        Identity Hub Initialization
                    </p>
                </div>
            </div>

            {/* ── STEP CONTAINER (Rule 18/19/21) ── */}
            <div className="bg-card border border-border rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Rule 21: Scale Protocol background decoration */}
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary-50 rounded-full blur-3xl opacity-40 pointer-events-none" />
                
                <div className="relative z-10">
                    {/* Multi-step Logic */}
                    {step === 1 ? <RegisterAccountStep /> : <RegisterPlanStep />}
                </div>
            </div>

            {/* ── GLOBAL INDICATORS (Rule 20) ── */}
            <div className="flex flex-wrap justify-center items-center gap-y-4 gap-x-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-2.5">
                    <Globe className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        Global Tier-3 Core
                    </span>
                </div>
                <div className="h-1 w-1 rounded-full bg-border" />
                <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest leading-none">
                        Encrypted Registry
                    </span>
                </div>
            </div>
        </div>
    );
}