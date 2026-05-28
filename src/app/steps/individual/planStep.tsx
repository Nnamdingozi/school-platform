// 'use client';

// import { useTransition } from 'react';
// import { useRegisterStore } from '@/store/individualOnboardingStore';
// import { initiateIndividualPayment } from '@/app/actions/subscription.actions';
// import { Check } from 'lucide-react';
// import { toast } from 'sonner';

// export function RegisterPlanStep() {
//     const { plans, email, setComplete } = useRegisterStore();
//     const [isPending, startTransition] = useTransition();

//     const handleSelect = (planId: string) => {
//         startTransition(async () => {
//             const res = await initiateIndividualPayment(planId);
//             if (res.success && res.authorizationUrl) {
//                 window.location.href = res.authorizationUrl;
//             } else {
//                 toast.error("Billing initialization failed.");
//             }
//         });
//     };

//     return (
//         <div className="space-y-8 animate-in slide-in-from-right-4">
//             <div className="space-y-4">
//                 {plans.map((plan) => (
//                     <button
//                         key={plan.id}
//                         onClick={() => handleSelect(plan.id)}
//                         disabled={isPending}
//                         className="w-full p-6 bg-slate-950 border border-white/5 rounded-[2rem] text-left hover:border-school-primary transition-all group"
//                     >
//                         <div className="flex justify-between items-center mb-4">
//                             <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{plan.name}</h3>
//                             <span className="text-school-primary font-black italic">₦{plan.priceNGN.toLocaleString()}</span>
//                         </div>
//                         <ul className="space-y-2">
//                             {plan.features.slice(0, 3).map((f, i) => (
//                                 <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-300">
//                                     <Check className="h-3 w-3 text-school-primary" /> {f}
//                                 </li>
//                             ))}
//                         </ul>
//                     </button>
//                 ))}
//             </div>

//             <button 
//                 onClick={() => setComplete(true)}
//                 className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white"
//             >
//                 Skip for now & verify email
//             </button>
//         </div>
//     );
// }



'use client';

import React, { useTransition } from 'react';
import { useRegisterStore } from '@/store/individualOnboardingStore';
import { initiateIndividualPayment } from '@/app/actions/subscription.actions';
import { Check, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

/**
 * INDIVIDUAL PLAN SELECTION HUB (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-surface, bg-card, border-border).
 * Rule 19: Standardized Geometry (rounded-2xl).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function RegisterPlanStep() {
    const { plans, setComplete } = useRegisterStore();
    const [isPending, startTransition] = useTransition();

    const handleSelect = (planId: string) => {
        startTransition(async () => {
            try {
                const res = await initiateIndividualPayment(planId);
                if (res.success && res.authorizationUrl) {
                    // Rule 11: Gateway Truth Handoff
                    window.location.href = res.authorizationUrl;
                } else {
                    toast.error("Billing Protocol Breach: Initialization failed.");
                }
            } catch (error) {
                toast.error("Registry connection error.");
            }
        });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-6 duration-700">
            <div className="space-y-4">
                {plans.map((plan) => (
                    <button
                        key={plan.id}
                        onClick={() => handleSelect(plan.id)}
                        disabled={isPending}
                        className={cn(
                            "w-full p-6 text-left transition-all duration-300 group relative overflow-hidden",
                            "bg-surface border border-border rounded-2xl shadow-sm", // Rule 18/19
                            "hover:border-school-primary-300 hover:shadow-lg disabled:opacity-50",
                            "active:scale-[0.98]"
                        )}
                    >
                        {/* Rule 21: Brand Scale Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-school-primary-50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="space-y-1">
                                    {/* Rule 11: High-Density Typography */}
                                    <h3 className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                                        {plan.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                        Registry Access Tier
                                    </p>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-extrabold text-school-primary italic tracking-tighter">
                                        ₦{plan.priceNGN.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <ul className="space-y-3">
                                {plan.features.slice(0, 4).map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                                        <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-md bg-school-primary-50 border border-school-primary-200">
                                            <Check className="h-2.5 w-2.5 text-school-primary" strokeWidth={4} />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-8 flex justify-end">
                                <div className="h-8 w-8 rounded-full bg-surface border border-border flex items-center justify-center group-hover:bg-school-primary group-hover:border-transparent transition-all">
                                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-on-school-primary transition-all" />
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <div className="pt-4 border-t border-border flex flex-col items-center gap-4">
                <button 
                    onClick={() => setComplete(true)}
                    disabled={isPending}
                    className="w-full py-4 text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2"
                >
                    Skip for now & verify email hub
                </button>
                
                <div className="flex items-center gap-2 opacity-20 grayscale">
                    <div className="h-1 w-1 rounded-full bg-foreground" />
                    <p className="text-[8px] font-bold uppercase tracking-widest">
                        PCI-DSS Secured Transaction Hub
                    </p>
                </div>
            </div>
        </div>
    );
}