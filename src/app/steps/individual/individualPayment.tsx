// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useRegisterStore } from '@/store/individualOnboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { type PlanType } from '@/store/onboardingStore';
// import { 
//     Check, ArrowLeft, Loader2, CreditCard, 
//     Zap, Lock,ChevronRight 
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { getErrorMessage } from '@/lib/error-handler';

// // ── Types (Rule 28: Strict Type Sovereignty) ──────────────────────────────────

// interface PaystackResponse {
//     reference: string;
//     status?: string;
// }

// /**
//  * FIXED TS2717: Interface matches 'payment-step.tsx' exactly to prevent global collision.
//  */
// interface PaystackSetupConfig {
//     key: string | undefined;
//     email: string;
//     amount: number;
//     currency: string;
//     metadata: {
//         plan: string | null;
//         schoolName: string;
//         adminName: string;
//     };
//     callback: (response: PaystackResponse) => void;
//     onClose: () => void;
// }

// interface PaystackPop {
//     setup: (config: PaystackSetupConfig) => {
//         openIframe: () => void;
//     };
// }

// declare global {
//     interface Window {
//         PaystackPop: PaystackPop;
//     }
// }

// /**
//  * INDIVIDUAL PLAN SELECTION & PAYMENT (Tier 3)
//  * Rule 24: Mandatory Settlement via Paystack Protocol.
//  * Rule 26: Persona-Based Labeling ("Finalize Payment").
//  * Rule 28: Explicit typing using PlanType and PaystackSetupConfig.
//  */
// export function RegisterPlanStep() {
//     const { 
//         plans, name, email, curriculumId, prevStep, 
//         setPaymentSuccess, setComplete, paymentStatus 
//     } = useRegisterStore();

//     const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || "");
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const [isGateOpening, setIsGateOpening] = useState(false);
//     const [isProcessing, setIsProcessing] = useState(false);

//     const activePlan = plans.find(p => p.id === selectedPlanId);
//     const hasPaid = paymentStatus === 'paid';

//     useEffect(() => {
//         if (typeof window !== 'undefined' && !window.PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             document.head.appendChild(script);
//         }
//     }, []);

//     /**
//      * Rule 24: Financial Gatekeeping
//      */
//     const handlePayment = useCallback(() => {
//         if (!activePlan || isGateOpening || isProcessing) return;
//         setIsGateOpening(true);

//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         try {
//             const handler = window.PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: email,
//                 amount: amount,
//                 currency: currency.toUpperCase(),
//                 metadata: {
//                     plan: activePlan.slug,
//                     schoolName: "Individual Learner Hub",
//                     adminName: name
//                 },
//                 callback: (response: PaystackResponse) => {
//                     setIsProcessing(true);
//                     const executeSync = async () => {
//                         try {
//                             // 1. Verify Gateway Truth
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment verification protocol failed.");

//                             // ✅ FIXED TS2345: Strict casting and fallback for PlanType
//                             // Ensuring the nullable 'slug' is handled before passing to completeOnboarding
//                             const planSlug = activePlan.slug || 'individual';
//                             const planTypeCast = planSlug as PlanType;

//                             // 2. Atomic Finalization
//                             const result = await completeOnboarding(
//                                 { name, email },
//                                 { 
//                                     schoolName: `${name.split(' ')[0]}'s Hub`, 
//                                     curriculumId: curriculumId || "generic", 
//                                     primaryColor: "#f59e0b", 
//                                     secondaryColor: "#1e293b" 
//                                 },
//                                 response.reference,
//                                 planSlug // completeOnboarding expects string
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             // 3. Update Hub State
//                             setPaymentSuccess(response.reference, planSlug);
//                             setComplete(true);
//                             toast.success("Personal Registry Synchronized.");
//                         } catch (err: unknown) {
//                             toast.error(getErrorMessage(err));
//                             setIsProcessing(false);
//                             setIsGateOpening(false);
//                         }
//                     };
//                     executeSync();
//                 },
//                 onClose: () => {
//                     setIsGateOpening(false);
//                     setIsProcessing(false);
//                 },
//             });
//             handler.openIframe();
//         } catch (err: unknown) {
//             setIsGateOpening(false);
//             toast.error("Gateway protocol breach.");
//         }
//     }, [activePlan, currency, email, name, curriculumId, isGateOpening, isProcessing, setPaymentSuccess, setComplete]);

//     if (!activePlan) return (
//         <div className="p-20 text-center animate-pulse text-slate-500 italic uppercase text-[10px] tracking-widest">
//             Synchronizing Tiers...
//         </div>
//     );

//     return (
//         <div className="space-y-8 animate-in slide-in-from-right-6 duration-700">
//             <div className="text-center space-y-2">
//                 <h2 className="text-xl font-extrabold text-white uppercase italic tracking-tight leading-none">
//                     Select Learning Plan
//                 </h2>
//                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest opacity-70">
//                     Personalize your academic capacity
//                 </p>
//             </div>

//             {/* CURRENCY HUB */}
//             <div className="flex justify-center">
//                 <div className="flex bg-slate-950 border border-slate-800 rounded-2xl p-1.5 gap-2 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)}
//                             className={cn(
//                                 "px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95",
//                                 currency === c ? "bg-school-primary text-on-school-primary shadow-lg" : "text-slate-500 hover:text-white"
//                             )}
//                         >
//                             {c === 'ngn' ? '₦ NGN' : '$ USD'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* PLANS LIST */}
//             <div className="space-y-4">
//                 {plans.map((p: SubscriptionPlanItem) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 "w-full text-left rounded-[2rem] border-2 p-6 transition-all duration-500 relative overflow-hidden",
//                                 isSelected ? "bg-slate-900/50 border-school-primary shadow-xl scale-[1.02]" : "bg-slate-950 border-slate-800 hover:border-slate-700"
//                             )}
//                         >
//                             <div className="flex justify-between items-start relative z-10">
//                                 <div className="space-y-4">
//                                     <div className="flex items-center gap-3">
//                                         <Zap className={cn("h-4 w-4", isSelected ? "text-school-primary" : "text-slate-600")} />
//                                         <p className="text-lg font-extrabold text-white uppercase italic tracking-tighter leading-none">{p.name}</p>
//                                     </div>
//                                     <ul className="space-y-1.5">
//                                         {p.features.slice(0, 2).map((f: string) => (
//                                             <li key={f} className="flex items-center gap-2 text-[9px] font-bold text-slate-400 uppercase tracking-tight">
//                                                 <Check className="h-3 w-3 text-school-primary" strokeWidth={4} /> {f}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                                 <p className="text-xl font-black text-white italic tracking-tighter tabular-nums leading-none">
//                                     {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                 </p>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ACTIONS */}
//             <div className="flex gap-4 pt-4">
//                 <Button 
//                     variant="ghost" 
//                     onClick={prevStep} 
//                     disabled={isProcessing}
//                     className="h-16 px-8 rounded-2xl border border-slate-800 bg-slate-950 text-slate-400 hover:text-white transition-all"
//                 >
//                     <ArrowLeft className="h-5 w-5" />
//                 </Button>
                
//                 <Button 
//                     onClick={handlePayment} 
//                     disabled={isGateOpening || isProcessing}
//                     className={cn(
//                         "flex-1 h-16 rounded-2xl bg-school-primary text-on-school-primary font-extrabold uppercase text-[11px] tracking-widest",
//                         "shadow-xl shadow-school-primary-200 active:scale-95 disabled:opacity-50 transition-all"
//                     )}
//                 >
//                     {isProcessing || isGateOpening ? (
//                         <Loader2 className="h-5 w-5 animate-spin mx-auto" />
//                     ) : (
//                         <div className="flex items-center justify-center gap-3">
//                             <CreditCard className="h-4 w-4" />
//                             Finalize Payment
//                             <ChevronRight className="h-4 w-4" />
//                         </div>
//                     )}
//                 </Button>
//             </div>

//             {/* SECURITY FOOTER */}
//             <div className="flex justify-center items-center gap-4 opacity-20 pt-2 grayscale pointer-events-none">
//                 <div className="flex items-center gap-2">
//                     <Lock className="h-3 w-3 text-white" />
//                     <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white">PCI-DSS Compliant</span>
//                 </div>
//                 <div className="h-1 w-1 rounded-full bg-white" />
//                 <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-white">Encrypted Sync</span>
//             </div>
//         </div>
//     );
// }


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRegisterStore } from '@/store/individualOnboardingStore';
import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
import { type PlanType } from '@/store/onboardingStore';
import { 
    Check, ArrowLeft, Loader2, CreditCard, 
    Zap, Lock, ShieldCheck, ChevronRight, ShieldAlert 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/error-handler';

// ── Types (Rule 28: Strict Type Sovereignty) ──────────────────────────────────

interface PaystackResponse {
    reference: string;
    status?: string;
}

/**
 * Interface for Paystack Inline Hub Configuration.
 * Rule 15: Zero 'any' types in the gateway protocol.
 */
interface PaystackSetupConfig {
    key: string | undefined;
    email: string;
    amount: number;
    currency: string;
    metadata: {
        plan: string | null;
        schoolName: string;
        adminName: string;
    };
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
}

interface PaystackPop {
    setup: (config: PaystackSetupConfig) => {
        openIframe: () => void;
    };
}

declare global {
    interface Window {
        PaystackPop: PaystackPop;
    }
}


/**
 * INDIVIDUAL PLAN SELECTION & PAYMENT (Tier 3)
 * Logic: Prevents double-billing and handles semantic theme switching.
 */
export function RegisterPlanStep() {
    const { 
        plans, name, email, curriculumId, prevStep, 
        setPaymentSuccess, setComplete, paymentStatus 
    } = useRegisterStore();

    const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || "");
    const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
    const [isGateOpening, setIsGateOpening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const activePlan = plans.find(p => p.id === selectedPlanId);
    
    // ✅ IMPLEMENTED: Prevents users from seeing payment options if already paid
    const hasPaid = paymentStatus === 'paid';

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.PaystackPop) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    const handlePayment = useCallback(() => {
        // ✅ Rule 24: Block execution if already paid or processing
        if (!activePlan || isGateOpening || isProcessing || hasPaid) return;
        
        const planSlug: string = activePlan.slug || 'individual-monthly';
        
        setIsGateOpening(true);
        const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

        try {
            const handler = window.PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: email,
                amount: amount,
                currency: currency.toUpperCase(),
                metadata: {
                    plan: planSlug,
                    schoolName: "Individual Learner Hub",
                    adminName: name
                },
                callback: (response: PaystackResponse) => {
                    setIsProcessing(true);
                    const executeSync = async () => {
                        try {
                            const verification = await verifyPaystackPayment(response.reference);
                            if (!verification.success) throw new Error("Payment verification failed.");

                            const result = await completeOnboarding(
                                { name, email },
                                { 
                                    schoolName: `${name.split(' ')[0]}'s Hub`, 
                                    curriculumId: curriculumId || "generic", 
                                    primaryColor: "#f59e0b", 
                                    secondaryColor: "#1e293b" 
                                },
                                response.reference,
                                planSlug
                            );

                            if (!result.success) throw new Error(result.error);

                            // ✅ FIXED unused planTypeCast: Applying cast directly to protocol action
                            setPaymentSuccess(response.reference, planSlug as PlanType);
                            setComplete(true);
                            toast.success("Personal Registry Synchronized.");
                        } catch (error: unknown) {
                            toast.error(getErrorMessage(error));
                            setIsProcessing(false);
                            setIsGateOpening(false);
                        }
                    };
                    executeSync();
                },
                onClose: () => {
                    setIsGateOpening(false);
                    setIsProcessing(false);
                },
            });
            handler.openIframe();
        } catch (error: unknown) {
            setIsGateOpening(false);
            const msg = getErrorMessage(error);
            console.error("[PAYMENT_GATEWAY_FAULT]:", msg);
            toast.error("Gateway connection breach.");
        }
    }, [activePlan, currency, email, name, curriculumId, isGateOpening, isProcessing, hasPaid, setPaymentSuccess, setComplete]);

    // ✅ IMPLEMENTED: Optimized UI for paid users to prevent double debiting
    if (hasPaid) {
        return (
            <div className="flex flex-col items-center justify-center p-12 space-y-6 text-center animate-in fade-in">
                <div className="h-20 w-20 rounded-[2rem] bg-emerald-50 border-4 border-emerald-100 flex items-center justify-center shadow-xl shadow-emerald-50">
                    <ShieldCheck className="h-10 w-10 text-emerald-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-xl font-extrabold text-foreground uppercase italic tracking-tight">Transaction Verified</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                        Your academic registry is provisioned. <br />Initializing security protocol...
                    </p>
                </div>
                <Loader2 className="h-6 w-6 animate-spin text-emerald-500" />
            </div>
        );
    }

    if (!activePlan) return (
        <div className="p-20 text-center animate-pulse text-muted-foreground italic uppercase text-[10px] tracking-widest">
            Synchronizing Tiers...
        </div>
    );

    return (
        <div className="space-y-8 animate-in slide-in-from-right-6 duration-700">
            <div className="text-center space-y-2">
                <h2 className="text-xl font-extrabold text-foreground uppercase italic tracking-tight leading-none">
                    Select Learning Plan
                </h2>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-70">
                    Personalize your academic capacity
                </p>
            </div>

            <div className="flex justify-center">
                <div className="flex bg-background border border-border rounded-2xl p-1 gap-2 shadow-inner">
                    {(['ngn', 'usd'] as const).map((c) => (
                        <button 
                            key={c} 
                            disabled={isProcessing || isGateOpening}
                            onClick={() => setCurrency(c)}
                            className={cn(
                                "px-6 py-2 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95 disabled:opacity-20",
                                currency === c 
                                    ? "bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200" 
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {c === 'ngn' ? '₦ NGN' : '$ USD'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                {plans.map((p: SubscriptionPlanItem) => {
                    const isSelected = selectedPlanId === p.id;
                    const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    return (
                        <button
                            key={p.id}
                            disabled={isProcessing || isGateOpening}
                            onClick={() => setSelectedPlanId(p.id)}
                            className={cn(
                                "w-full text-left rounded-[2rem] border-2 p-6 transition-all duration-500 relative overflow-hidden",
                                isSelected 
                                    ? "bg-card border-school-primary shadow-xl scale-[1.02]" 
                                    : "bg-background border-border hover:border-school-primary/20 disabled:opacity-50"
                            )}
                        >
                            <div className="flex justify-between items-start relative z-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Zap className={cn("h-4 w-4", isSelected ? "text-school-primary" : "text-muted-foreground/40")} />
                                        <p className="text-lg font-extrabold text-foreground uppercase italic tracking-tighter leading-none">{p.name}</p>
                                    </div>
                                    <ul className="space-y-1.5">
                                        {p.features.slice(0, 2).map((f: string) => (
                                            <li key={f} className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase tracking-tight">
                                                <Check className="h-3 w-3 text-school-primary stroke-[4]" /> {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-xl font-black text-foreground italic tracking-tighter tabular-nums leading-none">
                                    {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-4 pt-4">
                <Button 
                    variant="ghost" 
                    onClick={prevStep} 
                    disabled={isProcessing}
                    className="h-16 px-8 rounded-2xl border border-border bg-background text-muted-foreground hover:text-foreground transition-all"
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                
                <Button 
                    onClick={handlePayment} 
                    disabled={isGateOpening || isProcessing}
                    className={cn(
                        "flex-1 h-16 rounded-2xl bg-school-primary text-on-school-primary font-extrabold uppercase text-[11px] tracking-widest",
                        "shadow-xl shadow-school-primary-200 active:scale-95 disabled:opacity-50 transition-all"
                    )}
                >
                    {isProcessing || isGateOpening ? (
                        <div className="flex items-center justify-center gap-3">
                            <Loader2 className="h-4 w-4 animate-spin text-on-school-primary" />
                            <span className="animate-pulse">Authorizing...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            <CreditCard className="h-4 w-4" />
                            Finalize Payment
                            <ChevronRight className="h-4 w-4" />
                        </div>
                    )}
                </Button>
            </div>

            <div className="flex justify-center items-center gap-4 opacity-30 pt-2 grayscale pointer-events-none">
                <div className="flex items-center gap-2">
                    <Lock className="h-3 w-3 text-foreground" />
                    <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-foreground">Encrypted Hub</span>
                </div>
                <div className="h-1 w-1 rounded-full bg-border" />
                <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-foreground">PCI-DSS Compliant</span>
            </div>
        </div>
    );
}