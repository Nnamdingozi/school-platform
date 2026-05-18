// 'use client';

// import { useOnboardingStore } from '@/store/';
// import { AdminStep } from './steps/admin-step';
// import { PaymentStep } from './steps/payment-step';
// import { SchoolStep } from './steps/school-step';
// import { cn } from '@/lib/utils';
// import { Check } from 'lucide-react';

// const STEPS = [
//     { number: 1, label: 'Your Account' },
//     { number: 2, label: 'Choose Plan' },
//     { number: 3, label: 'Your School' },
// ];

// export function OnboardingShell() {
//     const { step } = useOnboardingStore();

//     return (
//         <div className="min-h-screen bg-school-secondary-950 flex flex-col">
//             {/* Header */}
//             <header className="flex items-center justify-between px-6 py-4 border-b border-school-secondary-800">
//                 <div className="flex items-center gap-2">
//                     <div className="h-8 w-8 rounded-lg bg-school-primary flex items-center justify-center">
//                         <span className="text-school-secondary-950 font-black text-sm">E</span>
//                     </div>
//                     <span className="text-school-secondary-100 font-semibold text-lg">EduAI</span>
//                 </div>
//                 <p className="text-school-secondary-100/50 text-sm hidden sm:block">
//                     Setting up your school workspace
//                 </p>
//             </header>

//             {/* Step Indicator */}
//             <div className="flex items-center justify-center pt-10 pb-6 px-4">
//                 <div className="flex items-center gap-0">
//                     {STEPS.map((s, i) => {
//                         const isCompleted = step > s.number;
//                         const isActive = step === s.number;

//                         return (
//                             <div key={s.number} className="flex items-center">
//                                 {/* Step circle */}
//                                 <div className="flex flex-col items-center gap-1.5">
//                                     <div className={cn(
//                                         "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
//                                         isCompleted && "bg-school-primary text-school-secondary-950",
//                                         isActive && "bg-school-primary/20 border-2 border-school-primary text-school-primary",
//                                         !isCompleted && !isActive && "bg-school-secondary-800 text-school-secondary-100/40"
//                                     )}>
//                                         {isCompleted ? (
//                                             <Check className="h-4 w-4" />
//                                         ) : (
//                                             s.number
//                                         )}
//                                     </div>
//                                     <span className={cn(
//                                         "text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap",
//                                         isActive && "text-school-primary",
//                                         isCompleted && "text-school-primary/70",
//                                         !isCompleted && !isActive && "text-school-secondary-100/30"
//                                     )}>
//                                         {s.label}
//                                     </span>
//                                 </div>

//                                 {/* Connector line */}
//                                 {i < STEPS.length - 1 && (
//                                     <div className={cn(
//                                         "h-[2px] w-16 sm:w-24 mx-2 mb-5 transition-all duration-500",
//                                         step > s.number
//                                             ? "bg-school-primary"
//                                             : "bg-school-secondary-800"
//                                     )} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Step Content */}
//             <main className="flex-1 flex items-start justify-center px-4 pb-16">
//                 <div className="w-full max-w-lg">
//                     {step === 1 && <AdminStep />}
//                     {step === 2 && <PaymentStep />}
//                     {step === 3 && <SchoolStep />}
//                 </div>
//             </main>
//         </div>
//     );
// }


// 'use client';

// import { useOnboardingStore } from '@/store/onboardingStore';
// import { AdminStep } from '@/app/steps/admin-step';
// import { PaymentStep } from '@/app/steps/payment-step';
// import { SchoolStep } from '@/app/steps/school-step';
// import { cn } from '@/lib/utils';
// import { Check } from 'lucide-react';

// const STEPS = [
//     { number: 1, label: 'Your Account' },
//     { number: 2, label: 'Choose Plan' },
//     { number: 3, label: 'Your School' },
// ];

// export function OnboardingShell() {
//     const { step } = useOnboardingStore();

//     return (
//         <div className="min-h-screen bg-school-secondary-950 flex flex-col">
//             {/* Header */}
//             <header className="flex items-center justify-between px-6 py-4 border-b border-school-secondary-800">
//                 <div className="flex items-center gap-2">
//                     <div className="h-8 w-8 rounded-lg bg-school-primary flex items-center justify-center">
//                         <span className="text-school-secondary-950 font-black text-sm">E</span>
//                     </div>
//                     <span className="text-school-secondary-100 font-semibold text-lg">EduAI</span>
//                 </div>
//                 <p className="text-school-secondary-100/50 text-sm hidden sm:block">
//                     Setting up your school workspace
//                 </p>
//             </header>

//             {/* Step Indicator */}
//             <div className="flex items-center justify-center pt-10 pb-6 px-4">
//                 <div className="flex items-center gap-0">
//                     {STEPS.map((s, i) => {
//                         const isCompleted = step > s.number;
//                         const isActive = step === s.number;

//                         return (
//                             <div key={s.number} className="flex items-center">
//                                 {/* Step circle */}
//                                 <div className="flex flex-col items-center gap-1.5">
//                                     <div className={cn(
//                                         "h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300",
//                                         isCompleted && "bg-school-primary text-school-secondary-950",
//                                         isActive && "bg-school-primary/20 border-2 border-school-primary text-school-primary",
//                                         !isCompleted && !isActive && "bg-school-secondary-800 text-school-secondary-100/40"
//                                     )}>
//                                         {isCompleted ? (
//                                             <Check className="h-4 w-4" />
//                                         ) : (
//                                             s.number
//                                         )}
//                                     </div>
//                                     <span className={cn(
//                                         "text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap",
//                                         isActive && "text-school-primary",
//                                         isCompleted && "text-school-primary/70",
//                                         !isCompleted && !isActive && "text-school-secondary-100/30"
//                                     )}>
//                                         {s.label}
//                                     </span>
//                                 </div>

//                                 {/* Connector line */}
//                                 {i < STEPS.length - 1 && (
//                                     <div className={cn(
//                                         "h-[2px] w-16 sm:w-24 mx-2 mb-5 transition-all duration-500",
//                                         step > s.number
//                                             ? "bg-school-primary"
//                                             : "bg-school-secondary-800"
//                                     )} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* Step Content */}
//             <main className="flex-1 flex items-start justify-center px-4 pb-16">
//                 <div className="w-full max-w-lg">
//                     {step === 1 && <AdminStep />}
//                     {step === 2 && <PaymentStep />}
//                     {step === 3 && <SchoolStep />}
//                 </div>
//             </main>
//         </div>
//     );
// }


'use client';

import { useOnboardingStore, type CurriculumTemplate } from '@/store/onboardingStore';
import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
import { useEffect } from 'react';
import { AdminStep } from '@/app/steps/admin-step';
import { PaymentStep } from '@/app/steps/payment-step';
import { SchoolStep } from '@/app/steps/school-step';
import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
import { cn } from '@/lib/utils';
import { Check, GraduationCap, ShieldCheck, Zap } from 'lucide-react';

interface OnboardingShellProps {
    initialCurricula: CurriculumTemplate[];
    initialPlans: SubscriptionPlanItem[];
}

const STEPS = [
    { number: 1, label: 'Identity Node' },
    { number: 2, label: 'License Tier' },
    { number: 3, label: 'Institutional Sync' },
];

export function OnboardingShell({ initialCurricula, initialPlans }: OnboardingShellProps) {
    const { step, isProvisioned, setCurricula, setPlans } = useOnboardingStore();

    // Rule 17: Sync initial server data into Zustand
    useEffect(() => {
        if (initialCurricula) setCurricula(initialCurricula);
        if (initialPlans) setPlans(initialPlans);
    }, [initialCurricula, initialPlans, setCurricula, setPlans]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    if (isProvisioned) {
        return <ConfirmationScreen />;
    }

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col">
            <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-school-primary flex items-center justify-center shadow-lg">
                        <GraduationCap className="text-slate-950 h-6 w-6" strokeWidth={2.5} />
                    </div>
                    <span className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">SchoolPaaS</span>
                </div>
                <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Provisioning</span>
                </div>
            </header>

            <div className="flex items-center justify-center pt-12 pb-10 px-4">
                <div className="flex items-center">
                    {STEPS.map((s, i) => {
                        const isCompleted = step > s.number;
                        const isActive = step === s.number;

                        return (
                            <div key={s.number} className="flex items-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className={cn(
                                        'h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all border',
                                        isCompleted ? 'bg-school-primary border-school-primary text-slate-950' :
                                        isActive ? 'bg-slate-900 border-school-primary text-school-primary scale-110' :
                                        'bg-slate-900 border-white/5 text-slate-700'
                                    )}>
                                        {isCompleted ? <Check className="h-6 w-6 stroke-[3]" /> : `0${s.number}`}
                                    </div>
                                    <span className={cn('text-[9px] font-black uppercase tracking-[0.2em]', isActive ? "text-white" : "text-slate-700")}>
                                        {s.label}
                                    </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn('h-[1px] w-12 sm:w-20 mx-4 mb-8', step > s.number ? 'bg-school-primary' : 'bg-white/5')} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <main className="flex-1 flex items-start justify-center px-4 pb-20">
                <div className="w-full max-w-xl animate-in slide-in-from-bottom-4">
                    {step === 1 && <AdminStep />}
                    {step === 2 && <PaymentStep />}
                    {step === 3 && <SchoolStep />}
                </div>
            </main>
        </div>
    );
}