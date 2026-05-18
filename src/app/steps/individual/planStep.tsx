'use client';

import { useTransition } from 'react';
import { useRegisterStore } from '@/store/individualOnboardingStore';
import { initiateIndividualPayment } from '@/app/actions/subscription.actions';
import { Check } from 'lucide-react';
import { toast } from 'sonner';

export function RegisterPlanStep() {
    const { plans, email, setComplete } = useRegisterStore();
    const [isPending, startTransition] = useTransition();

    const handleSelect = (planId: string) => {
        startTransition(async () => {
            const res = await initiateIndividualPayment(planId);
            if (res.success && res.authorizationUrl) {
                window.location.href = res.authorizationUrl;
            } else {
                toast.error("Billing initialization failed.");
            }
        });
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-right-4">
            <div className="space-y-4">
                {plans.map((plan) => (
                    <button
                        key={plan.id}
                        onClick={() => handleSelect(plan.id)}
                        disabled={isPending}
                        className="w-full p-6 bg-slate-950 border border-white/5 rounded-[2rem] text-left hover:border-school-primary transition-all group"
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{plan.name}</h3>
                            <span className="text-school-primary font-black italic">₦{plan.priceNGN.toLocaleString()}</span>
                        </div>
                        <ul className="space-y-2">
                            {plan.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-300">
                                    <Check className="h-3 w-3 text-school-primary" /> {f}
                                </li>
                            ))}
                        </ul>
                    </button>
                ))}
            </div>

            <button 
                onClick={() => setComplete(true)}
                className="w-full py-4 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:text-white"
            >
                Skip for now & verify email
            </button>
        </div>
    );
}