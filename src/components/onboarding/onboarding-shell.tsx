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


// 'use client';

// import { useOnboardingStore, type CurriculumTemplate } from '@/store/onboardingStore';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { useEffect } from 'react';
// import { AdminStep } from '@/app/steps/admin-step';
// import { PaymentStep } from '@/app/steps/payment-step';
// import { SchoolStep } from '@/app/steps/school-step';
// import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
// import { cn } from '@/lib/utils';
// import { Check, GraduationCap, ShieldCheck, Zap } from 'lucide-react';

// interface OnboardingShellProps {
//     initialCurricula: CurriculumTemplate[];
//     initialPlans: SubscriptionPlanItem[];
// }

// const STEPS = [
//     { number: 1, label: 'Identity Node' },
//     { number: 2, label: 'License Tier' },
//     { number: 3, label: 'Institutional Sync' },
// ];

// export function OnboardingShell({ initialCurricula, initialPlans }: OnboardingShellProps) {
//     const { step, isProvisioned, setCurricula, setPlans } = useOnboardingStore();

//     // Rule 17: Sync initial server data into Zustand
//     useEffect(() => {
//         if (initialCurricula) setCurricula(initialCurricula);
//         if (initialPlans) setPlans(initialPlans);
//     }, [initialCurricula, initialPlans, setCurricula, setPlans]);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, [step]);

//     if (isProvisioned) {
//         return <ConfirmationScreen />;
//     }

//     return (
//         <div className="min-h-screen bg-slate-950 flex flex-col">
//             <header className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
//                 <div className="flex items-center gap-3">
//                     <div className="h-10 w-10 rounded-2xl bg-school-primary flex items-center justify-center shadow-lg">
//                         <GraduationCap className="text-slate-950 h-6 w-6" strokeWidth={2.5} />
//                     </div>
//                     <span className="text-2xl font-black text-white uppercase italic tracking-tighter leading-none">SchoolPaaS</span>
//                 </div>
//                 <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-white/5">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secure Provisioning</span>
//                 </div>
//             </header>

//             <div className="flex items-center justify-center pt-12 pb-10 px-4">
//                 <div className="flex items-center">
//                     {STEPS.map((s, i) => {
//                         const isCompleted = step > s.number;
//                         const isActive = step === s.number;

//                         return (
//                             <div key={s.number} className="flex items-center">
//                                 <div className="flex flex-col items-center gap-3">
//                                     <div className={cn(
//                                         'h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-black transition-all border',
//                                         isCompleted ? 'bg-school-primary border-school-primary text-slate-950' :
//                                         isActive ? 'bg-slate-900 border-school-primary text-school-primary scale-110' :
//                                         'bg-slate-900 border-white/5 text-slate-700'
//                                     )}>
//                                         {isCompleted ? <Check className="h-6 w-6 stroke-[3]" /> : `0${s.number}`}
//                                     </div>
//                                     <span className={cn('text-[9px] font-black uppercase tracking-[0.2em]', isActive ? "text-white" : "text-slate-700")}>
//                                         {s.label}
//                                     </span>
//                                 </div>
//                                 {i < STEPS.length - 1 && (
//                                     <div className={cn('h-[1px] w-12 sm:w-20 mx-4 mb-8', step > s.number ? 'bg-school-primary' : 'bg-white/5')} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <main className="flex-1 flex items-start justify-center px-4 pb-20">
//                 <div className="w-full max-w-xl animate-in slide-in-from-bottom-4">
//                     {step === 1 && <AdminStep />}
//                     {step === 2 && <PaymentStep />}
//                     {step === 3 && <SchoolStep />}
//                 </div>
//             </main>
//         </div>
//     );
// }



// 'use client';

// import React, { useEffect } from 'react';
// import { useOnboardingStore, type CurriculumTemplate } from '@/store/onboardingStore';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { AdminStep } from '@/app/steps/admin-step';
// import { PaymentStep } from '@/app/steps/payment-step';
// import { SchoolStep } from '@/app/steps/school-step';
// import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
// import { cn } from '@/lib/utils';
// import { Check, GraduationCap, ShieldCheck } from 'lucide-react';

// interface OnboardingShellProps {
//     initialCurricula: CurriculumTemplate[];
//     initialPlans: SubscriptionPlanItem[];
// }

// const STEPS = [
//     { number: 1, label: 'Identity Profile' },
//     { number: 2, label: 'License Tier' },
//     { number: 3, label: 'Institutional Hub' },
// ];

// /**
//  * INSTITUTIONAL ONBOARDING TERMINAL (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
//  * Rule 19: Standardized Geometry (rounded-2xl, rounded-[2rem]).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function OnboardingShell({ initialCurricula, initialPlans }: OnboardingShellProps) {
//     const { step, isProvisioned, setCurricula, setPlans } = useOnboardingStore();

//     // Rule 17: Synchronize Tier-1 Global metadata into the onboarding state hub
//     useEffect(() => {
//         if (initialCurricula) setCurricula(initialCurricula);
//         if (initialPlans) setPlans(initialPlans);
//     }, [initialCurricula, initialPlans, setCurricula, setPlans]);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, [step]);

//     if (isProvisioned) {
//         return <ConfirmationScreen />;
//     }

//     return (
//         <div className="min-h-screen bg-background flex flex-col animate-in fade-in duration-700">
//             {/* ── HEADER (Rule 18/21) ── */}
//             <header className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
//                 <div className="flex items-center gap-3 group">
//                     <div className="h-10 w-10 rounded-2xl bg-school-primary flex items-center justify-center shadow-lg shadow-school-primary-200 transition-transform group-hover:scale-105">
//                         <GraduationCap className="text-on-school-primary h-6 w-6" strokeWidth={2.5} />
//                     </div>
//                     {/* Rule 11: Header Scaling */}
//                     <span className="text-xl md:text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         SchoolPaaS
//                     </span>
//                 </div>
                
//                 <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2 rounded-xl shadow-inner">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="hidden sm:inline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         Secure Provisioning Protocol
//                     </span>
//                 </div>
//             </header>

//             {/* ── STEP INDICATOR HUB (Rule 21) ── */}
//             <div className="flex items-center justify-center pt-10 md:pt-16 pb-12 px-6">
//                 <div className="flex items-center">
//                     {STEPS.map((s, i) => {
//                         const isCompleted = step > s.number;
//                         const isActive = step === s.number;

//                         return (
//                             <div key={s.number} className="flex items-center">
//                                 <div className="flex flex-col items-center gap-3">
//                                     <div className={cn(
//                                         'h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all border shadow-sm',
//                                         isCompleted ? 'bg-school-primary border-school-primary text-on-school-primary' :
//                                         isActive ? 'bg-school-primary-50 border-school-primary text-school-primary scale-110 shadow-lg shadow-school-primary-200' :
//                                         'bg-surface border-border text-muted-foreground/30'
//                                     )}>
//                                         {isCompleted ? <Check className="h-6 w-6 stroke-[3]" /> : `0${s.number}`}
//                                     </div>
//                                     <span className={cn(
//                                         'text-[9px] font-bold uppercase tracking-widest italic',
//                                         isActive ? "text-foreground" : "text-muted-foreground/40"
//                                     )}>
//                                         {s.label}
//                                     </span>
//                                 </div>
//                                 {i < STEPS.length - 1 && (
//                                     <div className={cn(
//                                         'h-[2px] w-8 sm:w-16 md:w-24 mx-2 md:mx-4 mb-8 transition-colors duration-500 rounded-full',
//                                         step > s.number ? 'bg-school-primary' : 'bg-border'
//                                     )} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* ── STEP CONTENT (Rule 20) ── */}
//             <main className="flex-1 flex items-start justify-center px-4 pb-24">
//                 <div className="w-full max-w-xl animate-in slide-in-from-bottom-6 duration-700">
//                     <div className="relative">
//                         {step === 1 && <AdminStep />}
//                         {step === 2 && <PaymentStep />}
//                         {step === 3 && <SchoolStep />}
//                     </div>
//                 </div>
//             </main>

//             {/* ── FOOTER DECORATION ── */}
//             <div className="hidden lg:block fixed bottom-8 left-8">
//                 <div className="flex items-center gap-3 opacity-20 hover:opacity-50 transition-opacity">
//                     <div className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                     <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
//                         Institutional Deployment v2.4
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useEffect } from 'react';
// import { useOnboardingStore, type CurriculumTemplate } from '@/store/onboardingStore';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { AdminStep } from '@/app/steps/admin-step';
// import { PaymentStep } from '@/app/steps/payment-step';
// import { SchoolStep } from '@/app/steps/school-step';
// import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
// import { cn } from '@/lib/utils';
// import { Check, GraduationCap, ShieldCheck } from 'lucide-react';
// import { useHydrated } from '@/hooks/useHydrate';

// interface OnboardingShellProps {
//     initialCurricula: CurriculumTemplate[];
//     initialPlans: SubscriptionPlanItem[];
// }

// /**
//  * REFACTORED STEP SEQUENCE:
//  * 1. Admin Identity (Identity Profile)
//  * 2. School Setup (Institutional Hub) - High Investment Phase
//  * 3. Payment (License Tier) - Final Protocol Threshold
//  */
// const STEPS = [
//     { number: 1, label: 'Identity Profile' },
//     { number: 2, label: 'Institutional Hub' },
//     { number: 3, label: 'License Tier' },
// ];

// /**
//  * INSTITUTIONAL ONBOARDING TERMINAL (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
//  * Rule 19: Standardized Geometry (rounded-2xl).
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function OnboardingShell({ initialCurricula, initialPlans }: OnboardingShellProps) {

//     const { step, isProvisioned, setCurricula, setPlans } = useOnboardingStore();

//     const hydrated = useHydrated();

//     // ✅ Don't render store-dependent UI until client has hydrated
//     if (!hydrated) return null; // or a skeleton/spinner

   

//     // Rule 17: Synchronize Tier-1 Global metadata into the state hub
//     useEffect(() => {
//         if (initialCurricula) setCurricula(initialCurricula);
//         if (initialPlans) setPlans(initialPlans);
//     }, [initialCurricula, initialPlans, setCurricula, setPlans]);

//     useEffect(() => {
//         window.scrollTo({ top: 0, behavior: 'smooth' });
//     }, [step]);

//     if (isProvisioned) {
//         return <ConfirmationScreen />;
//     }

//     return (
//         <div className="min-h-screen bg-background flex flex-col animate-in fade-in duration-700">
//             {/* ── HEADER ── */}
//             <header className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
//                 <div className="flex items-center gap-3 group">
//                     <div className="h-10 w-10 rounded-2xl bg-school-primary flex items-center justify-center shadow-lg shadow-school-primary-200 transition-transform group-hover:scale-105">
//                         <GraduationCap className="text-on-school-primary h-6 w-6" strokeWidth={2.5} />
//                     </div>
//                     <span className="text-xl md:text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         SchoolPaaS
//                     </span>
//                 </div>
                
//                 <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2 rounded-xl shadow-inner">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="hidden sm:inline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         Secure Provisioning Protocol
//                     </span>
//                 </div>
//             </header>

//             {/* ── STEP INDICATOR HUB (Rule 21 Scale Protocol) ── */}
//             <div className="flex items-center justify-center pt-10 md:pt-16 pb-12 px-6">
//                 <div className="flex items-center">
//                     {STEPS.map((s, i) => {
//                         const isCompleted = step > s.number;
//                         const isActive = step === s.number;

//                         return (
//                             <div key={s.number} className="flex items-center">
//                                 <div className="flex flex-col items-center gap-3">
//                                     <div className={cn(
//                                         'h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all border shadow-sm',
//                                         isCompleted ? 'bg-school-primary border-school-primary text-on-school-primary' :
//                                         isActive ? 'bg-school-primary-50 border-school-primary text-school-primary scale-110 shadow-lg shadow-school-primary-200' :
//                                         'bg-surface border-border text-muted-foreground/30'
//                                     )}>
//                                         {isCompleted ? <Check className="h-6 w-6 stroke-[3]" /> : `0${s.number}`}
//                                     </div>
//                                     <span className={cn(
//                                         'text-[9px] font-bold uppercase tracking-widest italic',
//                                         isActive ? "text-foreground" : "text-muted-foreground/40"
//                                     )}>
//                                         {s.label}
//                                     </span>
//                                 </div>
//                                 {i < STEPS.length - 1 && (
//                                     <div className={cn(
//                                         'h-[2px] w-8 sm:w-16 md:w-24 mx-2 md:mx-4 mb-8 transition-colors duration-500 rounded-full',
//                                         step > s.number ? 'bg-school-primary' : 'bg-border'
//                                     )} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             {/* ── STEP CONTENT ── */}
//             <main className="flex-1 flex items-start justify-center px-4 pb-24">
//                 <div className="w-full max-w-xl">
//                     {/* Logic Routing based on refined sequence */}
//                     {step === 1 && <AdminStep />}
//                     {step === 2 && <SchoolStep />}
//                     {step === 3 && <PaymentStep />}
//                 </div>
//             </main>

//             {/* ── FOOTER DECORATION ── */}
//             <div className="hidden lg:block fixed bottom-8 left-8">
//                 <div className="flex items-center gap-3 opacity-20 hover:opacity-50 transition-opacity">
//                     <div className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                     <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
//                         Institutional Deployment v2.4
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import { useEffect } from 'react';
// import { useOnboardingStore, type CurriculumTemplate } from '@/store/onboardingStore';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { AdminStep } from '@/app/steps/admin-step';
// import { PaymentStep } from '@/app/steps/payment-step';
// import { SchoolStep } from '@/app/steps/school-step';
// import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
// import { cn } from '@/lib/utils';
// import { Check, GraduationCap, ShieldCheck } from 'lucide-react';
// import { useHydrated } from '@/hooks/useHydrate';

// interface OnboardingShellProps {
//     initialCurricula: CurriculumTemplate[];
//     initialPlans: SubscriptionPlanItem[];
// }

// const STEPS = [
//     { number: 1, label: 'Identity Profile' },
//     { number: 2, label: 'Institutional Hub' },
//     { number: 3, label: 'License Tier' },
// ];

// export function OnboardingShell({ initialCurricula, initialPlans }: OnboardingShellProps) {

//     const { step, isProvisioned, setCurricula, setPlans } = useOnboardingStore();
//     const hydrated = useHydrated();

//     // ✅ All hooks declared before any early returns
//     useEffect(() => {
//         if (initialCurricula) setCurricula(initialCurricula);
//         if (initialPlans) setPlans(initialPlans);
//     }, [initialCurricula, initialPlans, setCurricula, setPlans]);

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             window.scrollTo({ top: 0, behavior: 'smooth' });
//         }
//     }, [step]);

//     // ✅ Early returns after all hooks
//     if (!hydrated) return null;

//     if (isProvisioned) {
//         return <ConfirmationScreen />;
//     }

//     return (
//         <div className="min-h-screen bg-background flex flex-col animate-in fade-in duration-700">
//             <header className="flex items-center justify-between px-4 md:px-8 py-5 border-b border-border bg-surface/80 backdrop-blur-md sticky top-0 z-50">
//                 <div className="flex items-center gap-3 group">
//                     <div className="h-10 w-10 rounded-2xl bg-school-primary flex items-center justify-center shadow-lg shadow-school-primary-200 transition-transform group-hover:scale-105">
//                         <GraduationCap className="text-on-school-primary h-6 w-6" strokeWidth={2.5} />
//                     </div>
//                     <span className="text-xl md:text-2xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         SchoolPaaS
//                     </span>
//                 </div>

//                 <div className="flex items-center gap-3 bg-surface border border-border px-4 py-2 rounded-xl shadow-inner">
//                     <ShieldCheck className="h-4 w-4 text-emerald-500" />
//                     <span className="hidden sm:inline text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         Secure Provisioning Protocol
//                     </span>
//                 </div>
//             </header>

//             <div className="flex items-center justify-center pt-10 md:pt-16 pb-12 px-6">
//                 <div className="flex items-center">
//                     {STEPS.map((s, i) => {
//                         const isCompleted = step > s.number;
//                         const isActive = step === s.number;

//                         return (
//                             <div key={s.number} className="flex items-center">
//                                 <div className="flex flex-col items-center gap-3">
//                                     <div className={cn(
//                                         'h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all border shadow-sm',
//                                         isCompleted ? 'bg-school-primary border-school-primary text-on-school-primary' :
//                                         isActive ? 'bg-school-primary-50 border-school-primary text-school-primary scale-110 shadow-lg shadow-school-primary-200' :
//                                         'bg-surface border-border text-muted-foreground/30'
//                                     )}>
//                                         {isCompleted ? <Check className="h-6 w-6 stroke-[3]" /> : `0${s.number}`}
//                                     </div>
//                                     <span className={cn(
//                                         'text-[9px] font-bold uppercase tracking-widest italic',
//                                         isActive ? 'text-foreground' : 'text-muted-foreground/40'
//                                     )}>
//                                         {s.label}
//                                     </span>
//                                 </div>
//                                 {i < STEPS.length - 1 && (
//                                     <div className={cn(
//                                         'h-[2px] w-8 sm:w-16 md:w-24 mx-2 md:mx-4 mb-8 transition-colors duration-500 rounded-full',
//                                         step > s.number ? 'bg-school-primary' : 'bg-border'
//                                     )} />
//                                 )}
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>

//             <main className="flex-1 flex items-start justify-center px-4 pb-24">
//                 <div className="w-full max-w-xl">
//                     {step === 1 && <AdminStep />}
//                     {step === 2 && <SchoolStep />}
//                     {step === 3 && <PaymentStep />}
//                 </div>
//             </main>

//             <div className="hidden lg:block fixed bottom-8 left-8">
//                 <div className="flex items-center gap-3 opacity-20 hover:opacity-50 transition-opacity">
//                     <div className="h-1.5 w-1.5 rounded-full bg-school-primary animate-pulse" />
//                     <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
//                         Institutional Deployment v2.4
//                     </span>
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useEffect } from 'react';
// import { useOnboardingStore, type CurriculumTemplate } from '@/store/onboardingStore';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { AdminStep } from '@/app/steps/admin-step';
// import { PaymentStep } from '@/app/steps/payment-step';
// import { SchoolStep } from '@/app/steps/school-step';
// import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
// import { cn } from '@/lib/utils';
// import { Check, GraduationCap, ShieldCheck } from 'lucide-react';
// import { useHydrated } from '@/hooks/useHydrate';

// interface OnboardingShellProps {
//     initialCurricula: any[];
//     initialPlans: any[];
//     isExistingUser?: boolean;
// }

// export function OnboardingShell({ initialCurricula, initialPlans, isExistingUser }: OnboardingShellProps) {
//     const { step, paymentStatus, setPlans, setCurricula } = useOnboardingStore();

//     // HYDRATION PROTOCOL: Push server data into the client store on mount
//     // This prevents the "Synchronizing Tiers" infinite loop
//     useEffect(() => {
//         if (initialPlans?.length > 0) setPlans(initialPlans);
//         if (initialCurricula?.length > 0) setCurricula(initialCurricula);
//     }, [initialPlans, initialCurricula, setPlans, setCurricula]);

//     // Logic: If user has paid, we force them to the Confirmation/Verification state
//     const hasPaid = paymentStatus === 'paid';

//     const renderStep = () => {
//         // BUG 1 & 4 FIX: If paid, always show confirmation screen
//         if (hasPaid) {
//             return <ConfirmationScreen />;
//         }

//         switch (step) {
//             case 1:
//                 return <AdminStep />;
//             case 2:
//                 return <SchoolStep curricula={initialCurricula} />;
//             case 3:
//                 return <PaymentStep plans={initialPlans} />;
//             default:
//                 return <AdminStep />;
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
//             {/* PROGRESS TRACKER - Hidden once paid to prevent navigation */}
//             {!hasPaid && (
//                 <div className="flex justify-between mb-12 relative">
//                     {[1, 2, 3].map((i) => (
//                         <div key={i} className="flex flex-col items-center z-10">
//                             <div className={cn(
//                                 "h-10 w-10 rounded-xl flex items-center justify-center font-extrabold transition-all duration-500",
//                                 step >= i ? "bg-school-primary text-white" : "bg-surface border border-border text-muted-foreground"
//                             )}>
//                                 {i}
//                             </div>
//                         </div>
//                     ))}
//                     <div className="absolute top-5 left-0 w-full h-[2px] bg-border -z-0" />
//                 </div>
//             )}

//             {/* SECURITY HEADER FOR PAID USERS */}
//             {hasPaid && (
//                 <div className="flex items-center justify-center gap-2 mb-8 animate-pulse">
//                     <Lock className="h-3 w-3 text-emerald-500" />
//                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600">
//                         Transaction Secured | Registry Locked
//                     </span>
//                 </div>
//             )}

//             <div className="relative">
//                 {renderStep()}
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useEffect } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { AdminStep } from '@/app/steps/admin-step';
// import { PaymentStep } from '@/app/steps/payment-step';
// import { SchoolStep } from '@/app/steps/school-step';
// import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
// import { cn } from '@/lib/utils';
// import { Loader2, Lock  } from 'lucide-react';
// import { useHydrated } from '@/hooks/useHydrate';

// export function OnboardingShell({ initialCurricula, initialPlans }: any) {
//     const hydrated = useHydrated(); // ✅ Call it first
//     const { step, paymentStatus, setPlans, setCurricula } = useOnboardingStore();

//     // Push server data into store
//     useEffect(() => {
//         if (hydrated) {
//             if (initialPlans?.length > 0) setPlans(initialPlans);
//             if (initialCurricula?.length > 0) setCurricula(initialCurricula);
//         }
//     }, [hydrated, initialPlans, initialCurricula, setPlans, setCurricula]);

//     const hasPaid = paymentStatus === 'paid';

//     // ── CRITICAL FIX ──
//     // If not hydrated, return a simple loader that matches exactly what 
//     // the server will send. Do NOT render any "steps" or "store data" yet.
//     if (!hydrated) {
//         return (
//             <div className="min-h-[60vh] flex items-center justify-center w-full">
//                 <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/20" />
//             </div>
//         );
//     }

//     const renderStep = () => {
//         if (hasPaid) return <ConfirmationScreen />;

//         switch (step) {
//             case 1: return <AdminStep />;
//             case 2: return <SchoolStep curricula={initialCurricula} />;
//             case 3: return <PaymentStep plans={initialPlans} />;
//             default: return <AdminStep />;
//         }
//     };

//     return (
//         <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
//             {!hasPaid && (
//                 <div className="flex justify-between mb-12 relative max-w-xs mx-auto">
//                     {[1, 2, 3].map((i) => (
//                         <div key={i} className="flex flex-col items-center z-10">
//                             <div className={cn(
//                                 "h-8 w-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all",
//                                 step >= i ? "bg-school-primary text-white" : "bg-surface border border-border text-muted-foreground"
//                             )}>
//                                 {i}
//                             </div>
//                         </div>
//                     ))}
//                     <div className="absolute top-4 left-0 w-full h-[1px] bg-border -z-0" />
//                 </div>
//             )}

//             {hasPaid && (
//                 <div className="flex items-center justify-center gap-2 mb-8 animate-pulse">
//                     <Lock className="h-3 w-3 text-emerald-500" />
//                     <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-600">
//                         Registry Provisioned & Locked
//                     </span>
//                 </div>
//             )}

//             <div className="relative">
//                 {renderStep()}
//             </div>
//         </div>
//     );
// }


'use client';

import React, { useEffect } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
import { AdminStep } from '@/app/steps/admin-step';
import { PaymentStep } from '@/app/steps/payment-step';
import { SchoolStep } from '@/app/steps/school-step';
import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
import { cn } from '@/lib/utils';
import { Loader2, Lock, Check, ShieldCheck } from 'lucide-react';
import { useHydrated } from '@/hooks/useHydrate';
import { getErrorMessage } from '@/lib/error-handler';

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface CurriculumTemplate {
    id: string;
    name: string;
    yearLabel: string;
    termLabel: string;
}

interface OnboardingShellProps {
    initialCurricula: CurriculumTemplate[];
    initialPlans: SubscriptionPlanItem[];
}

/**
 * INSTITUTIONAL ONBOARDING SHELL (Tier 2)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Pure TypeScript - Zero 'any' types.
 * Rule 18: Semantic Flip (bg-background, bg-surface, border-border).
 * Rule 19: Standardized Geometry (rounded-2xl, rounded-[2rem]).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol via getErrorMessage.
 */
export function OnboardingShell({ initialCurricula, initialPlans }: OnboardingShellProps) {
    const hydrated = useHydrated(); 
    const { step, isProvisioned, setPlans, setCurricula, setError } = useOnboardingStore();

    // ── HUB HYDRATION (Rule 17/23) ──
    useEffect(() => {
        if (hydrated) {
            try {
                if (initialPlans?.length > 0) setPlans(initialPlans);
                if (initialCurricula?.length > 0) setCurricula(initialCurricula);
            } catch (error: unknown) {
                // ✅ Rule 23: Standardized Error Extraction
                const message = getErrorMessage(error);
                console.error(`[ONBOARDING_HYDRATION_FAULT]: ${message}`);
                setError(message);
            }
        }
    }, [hydrated, initialPlans, initialCurricula, setPlans, setCurricula, setError]);

    // ── HYDRATION GUARD (Rule 14) ──
    if (!hydrated) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center w-full gap-6">
                <div className="relative">
                    <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
                    {/* Rule 21 mathematical tint */}
                    <div className="absolute inset-0 blur-xl bg-school-primary-50 -z-10" />
                </div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-muted-foreground animate-pulse italic">
                    Initializing_Registry_Terminal...
                </p>
            </div>
        );
    }

    const renderStepHub = () => {
        if (isProvisioned) return <ConfirmationScreen />;

        switch (step) {
            case 1: return <AdminStep />;
            case 2: return <SchoolStep />;
            case 3: return <PaymentStep />;
            default: return <AdminStep />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 animate-in fade-in duration-700">
            
            {/* ── STEP INDICATOR HUB (Rule 19/21) ── */}
            {!isProvisioned && (
                <div className="flex justify-between mb-20 relative max-w-sm mx-auto">
                    {[1, 2, 3].map((i) => {
                        const isActive = step === i;
                        const isCompleted = step > i;

                        return (
                            <div key={i} className="flex flex-col items-center z-10 gap-3">
                                <div className={cn(
                                    "h-12 w-12 rounded-2xl flex items-center justify-center text-xs font-extrabold transition-all duration-500 border shadow-lg",
                                    isCompleted ? "bg-school-primary text-on-school-primary border-school-primary" :
                                    isActive ? "bg-school-primary-50 border-school-primary text-school-primary scale-110 shadow-school-primary-200" : 
                                    "bg-surface border-border text-muted-foreground"
                                )}>
                                    {isCompleted ? <Check className="h-6 w-6 stroke-[3]" /> : `0${i}`}
                                </div>
                                <span className={cn(
                                    "text-[9px] font-bold uppercase tracking-widest italic transition-colors duration-500",
                                    isActive ? "text-foreground" : "text-muted-foreground/20"
                                )}>
                                    {i === 1 ? 'Identity' : i === 2 ? 'Hub' : 'License'}
                                </span>
                            </div>
                        );
                    })}
                    {/* Progress Track Hub (Rule 18) */}
                    <div className="absolute top-6 left-0 w-full h-[1.5px] bg-border -z-0" />
                </div>
            )}

            {/* ── PROVISIONING STATUS (Rule 21) ── */}
            {isProvisioned && (
                <div className="flex items-center justify-center gap-4 mb-12 animate-in zoom-in-95 duration-500">
                    <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
                        <Lock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 italic">
                            Institutional Hub Sealed
                        </h2>
                        <div className="flex items-center gap-2">
                             <ShieldCheck className="h-3 w-3 text-emerald-500/40" />
                             <p className="text-[8px] font-bold text-muted-foreground/40 uppercase tracking-widest">Protocol Verified</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── TERMINAL HUB CONTENT ── */}
            <div className="relative">
                {renderStepHub()}
            </div>

            {/* ── FOOTER PROTOCOL ── */}
            {!isProvisioned && (
                <div className="mt-24 flex justify-center items-center gap-5 opacity-20 grayscale transition-all hover:opacity-100 hover:grayscale-0">
                    <div className="h-[1px] w-12 bg-border" />
                    <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-muted-foreground">
                        Institutional_Registry_Protocol_v2.4
                    </p>
                    <div className="h-[1px] w-12 bg-border" />
                </div>
            )}
        </div>
    );
}