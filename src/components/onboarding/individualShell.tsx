'use client';

import { useEffect, useState } from 'react';
import { useRegisterStore } from '@/store/individualOnboardingStore';
import { RegisterAccountStep } from '@/app/steps/individual/accountRegisterStep';
import { RegisterPlanStep } from '@/app/steps/individual/planStep';
import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
import { GraduationCap, ShieldCheck, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export function RegisterShell({ initialPlans }: { initialPlans: any[] }) {
    const { step, isRegistered, setPlans } = useRegisterStore();

    useEffect(() => {
        setPlans(initialPlans);
    }, [initialPlans, setPlans]);

    if (isRegistered) {
        return (
            <div className="w-full max-w-md animate-in zoom-in-95 duration-500">
                <ConfirmationScreen />
            </div>
        );
    }

    return (
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="text-center space-y-4">
                <div className="h-16 w-16 bg-school-primary rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-school-primary/20">
                    <GraduationCap className="h-10 w-10 text-slate-950" strokeWidth={2.5} />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Personal Registry</h1>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">Identity Node Initialization</p>
                </div>
            </div>

            {/* Step Content */}
            <div className="bg-slate-900 border border-white/5 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden">
                <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary/5 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    {step === 1 ? <RegisterAccountStep /> : <RegisterPlanStep />}
                </div>
            </div>

            {/* Global Tier Indicator */}
            <div className="flex justify-center items-center gap-6 opacity-30">
                <div className="flex items-center gap-2">
                    <Globe className="h-3 w-3 text-slate-400" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global Tier 3 Node</span>
                </div>
                <div className="flex items-center gap-2">
                    <ShieldCheck className="h-3 w-3 text-slate-400" />
                    <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Encrypted Registry</span>
                </div>
            </div>
        </div>
    );
}