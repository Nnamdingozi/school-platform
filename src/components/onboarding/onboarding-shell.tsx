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

import { useOnboardingStore } from '@/store/onboardingStore';
import { useEffect } from 'react';
import { AdminStep } from '@/app/steps/admin-step';
import { PaymentStep } from '@/app/steps/payment-step';
import  SchoolStep  from '@/app/steps/school-step';
import { ConfirmationScreen } from '@/app/steps/confrimation-screen';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

const STEPS = [
    { number: 1, label: 'Your Account' },
    { number: 2, label: 'Choose Plan' },
    { number: 3, label: 'Your School' },
];

export function OnboardingShell() {
    const { step, isProvisioned } = useOnboardingStore();
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step])

    // ✅ If onboarding completed, always show confirmation screen
    // regardless of what step is in the store — persists across refreshes
    if (isProvisioned) {
        return (
            <div className="min-h-screen bg-school-secondary-950 flex flex-col">
                <header className="flex items-center justify-between px-6 py-4 border-b border-school-secondary-800">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-school-primary flex items-center justify-center">
                            <span className="text-school-secondary-950 font-black text-sm">E</span>
                        </div>
                        <span className="text-school-secondary-100 font-semibold text-lg">EduAI</span>
                    </div>
                    <p className="text-school-secondary-100/50 text-sm hidden sm:block">
                        Check your email to get started
                    </p>
                </header>
                <main className="flex-1 flex items-center justify-center px-4 pb-16">
                    <div className="w-full max-w-lg">
                        <ConfirmationScreen />
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-school-secondary-950 flex flex-col">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-school-secondary-800">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-school-primary flex items-center justify-center">
                        <span className="text-school-secondary-950 font-black text-sm">E</span>
                    </div>
                    <span className="text-school-secondary-100 font-semibold text-lg">EduAI</span>
                </div>
                <p className="text-school-secondary-100/50 text-sm hidden sm:block">
                    Setting up your school workspace
                </p>
            </header>

            {/* Step Indicator */}
            <div className="flex items-center justify-center pt-10 pb-6 px-4">
                <div className="flex items-center gap-0">
                    {STEPS.map((s, i) => {
                        const isCompleted = step > s.number;
                        const isActive = step === s.number;

                        return (
                            <div key={s.number} className="flex items-center">
                                <div className="flex flex-col items-center gap-1.5">
                                    <div className={cn(
                                        'h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300',
                                        isCompleted && 'bg-school-primary text-school-secondary-950',
                                        isActive && 'bg-school-primary/20 border-2 border-school-primary text-school-primary',
                                        !isCompleted && !isActive && 'bg-school-secondary-800 text-school-secondary-100/40'
                                    )}>
                                        {isCompleted ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            s.number
                                        )}
                                    </div>
                                    <span className={cn(
                                        'text-[10px] font-semibold uppercase tracking-wider whitespace-nowrap',
                                        isActive && 'text-school-primary',
                                        isCompleted && 'text-school-primary/70',
                                        !isCompleted && !isActive && 'text-school-secondary-100/30'
                                    )}>
                                        {s.label}
                                    </span>
                                </div>

                                {i < STEPS.length - 1 && (
                                    <div className={cn(
                                        'h-[2px] w-16 sm:w-24 mx-2 mb-5 transition-all duration-500',
                                        step > s.number
                                            ? 'bg-school-primary'
                                            : 'bg-school-secondary-800'
                                    )} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <main className="flex-1 flex items-start justify-center px-4 pb-16">
                <div className="w-full max-w-lg">
                    {step === 1 && <AdminStep />}
                    {step === 2 && <PaymentStep />}
                    {step === 3 && <SchoolStep />}
                </div>
            </main>
        </div>
    );
}
