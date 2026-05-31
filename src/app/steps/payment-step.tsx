



// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { 
//     Check, ArrowLeft, Loader2, CreditCard,
//     ShieldCheck, Zap, ShieldAlert, Lock
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { toTitleCase } from '@/lib/utils/formatters';

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface PaystackResponse {
//     reference: string;
//     status: string;
// }

// interface PaystackHandler {
//     setup: (config: any) => {
//         openIframe: () => void;
//     };
// }

// declare global {
//     interface Window {
//         PaystackPop: PaystackHandler;
//     }
// }

// /**
//  * ONBOARDING PHASE 03: LICENSE PROVISIONING
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 15: Resolved TS7006 by explicitly typing plan iterations.
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function PaymentStep() {
//     const { 
//         plans,
//         adminData, 
//         schoolData, 
//         setPaymentData, 
//         setLoading, 
//         setError, 
//         isLoading, 
//         error, 
//         setProvisioned, 
//         setConfirmedEmail, 
//         prevStep 
//     } = useOnboardingStore();
    
//     // ✅ RESOLVED TS7006: Strictly typing the find operation
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find((p: SubscriptionPlanItem) => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const [isGateOpening, setIsGateOpening] = useState(false);

//     // ✅ RESOLVED TS7006: Strictly typing the state resolution
//     const activePlan = plans.find((p: SubscriptionPlanItem) => p.id === selectedPlanId);

//     useEffect(() => {
//         if (typeof window !== 'undefined' && !window.PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             document.head.appendChild(script);
//         }
//     }, []);

//     const handleFinalizeDeployment = useCallback(() => {
//         if (!activePlan || !adminData || !schoolData || isGateOpening || isLoading) return;
        
//         setIsGateOpening(true);
//         setLoading(true);
//         setError(null);

//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         try {
//             const handler = window.PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { 
//                     plan: activePlan.slug, 
//                     schoolName: schoolData.schoolName,
//                     adminName: adminData.name 
//                 },
//                 callback: (response: PaystackResponse) => {
//                     const executeFinalSync = async () => {
//                         try {
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment Verification Failed.");

//                             const result = await completeOnboarding(
//                                 { ...adminData, name: toTitleCase(adminData.name) },
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug || 'starter'
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as any, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
                            
//                             setConfirmedEmail(adminData.email);
//                             setProvisioned(true);
//                             toast.success("Institutional Hub Synchronized.");
//                         } catch (err: unknown) { 
//                             const msg = err instanceof Error ? err.message : "Sync failure.";
//                             setError(msg); 
//                             setIsGateOpening(false);
//                             setLoading(false);
//                         }
//                     };
//                     executeFinalSync();
//                 },
//                 onClose: () => {
//                     setIsGateOpening(false);
//                     setLoading(false);
//                 },
//             });
//             handler.openIframe();
//         } catch (protocolError) { 
//             console.error("[GATEWAY_PROTOCOL_BREACH]:", protocolError);
//             setIsGateOpening(false);
//             setLoading(false); 
//         }
//     }, [
//         activePlan, adminData, schoolData, currency, 
//         isGateOpening, isLoading, setLoading, setError, 
//         setPaymentData, setConfirmedEmail, setProvisioned
//     ]);

//     if (!activePlan) return (
//         <div className="p-20 flex flex-col items-center justify-center gap-4 animate-pulse">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Synchronizing Tiers...</p>
//         </div>
//     );

//     return (
//         <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
//             {/* ── HEADER ── */}
//             <div className="text-center space-y-3">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center mx-auto shadow-sm">
//                     <ShieldCheck className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70 italic">
//                     Select institutional registry capacity
//                 </p>
//             </div>

//             {/* ── CURRENCY HUB ── */}
//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-2 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c: 'ngn' | 'usd') => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95', 
//                                 currency === c 
//                                     ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200' 
//                                     : 'text-muted-foreground hover:text-foreground'
//                             )}
//                         >
//                             {c === 'ngn' ? '₦ NGN Sync' : '$ USD Global'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* ── PLANS LIST ── */}
//             <div className="space-y-4">
//                 {plans.map((p: SubscriptionPlanItem) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 "w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden",
//                                 isSelected 
//                                     ? "bg-card border-school-primary shadow-xl scale-[1.02]" 
//                                     : "bg-surface border-border hover:border-school-primary-100"
//                             )}
//                         >
//                             {isSelected && <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-60" />}

//                             <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
//                                 <div className="space-y-4">
//                                     <div className="flex items-center gap-3">
//                                         <Zap className={cn("h-5 w-5", isSelected ? "text-school-primary" : "text-muted-foreground/30")} />
//                                         <p className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                             {p.name}
//                                         </p>
//                                     </div>
//                                     <ul className="space-y-2">
//                                         {p.features?.slice(0, 3).map((f: string) => (
//                                             <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                 <Check className="h-3.5 w-3.5 text-school-primary shrink-0" strokeWidth={4} /> {f}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                                 <div className="text-right self-end md:self-start">
//                                     <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums leading-none">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ── ERROR PROTOCOL ── */}
//             {error && (
//                 <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-extrabold uppercase tracking-widest italic animate-in shake duration-500">
//                     <div className="flex items-center gap-3">
//                         <ShieldAlert className="h-4 w-4 shrink-0" />
//                         <span>Protocol Breach: {error}</span>
//                     </div>
//                 </div>
//             )}

//             {/* ── ACTIONS ── */}
//             <div className="flex gap-4">
//                 <Button 
//                     variant="outline" 
//                     type="button"
//                     onClick={prevStep} 
//                     className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground hover:bg-background shadow-sm transition-all"
//                 >
//                     <ArrowLeft className="h-5 w-5" strokeWidth={3} />
//                 </Button>
                
//                 <Button 
//                     onClick={handleFinalizeDeployment} 
//                     disabled={isLoading || isGateOpening} 
//                     className={cn(
//                         "flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200"
//                     )}
//                 >
//                     {isLoading || isGateOpening ? (
//                         <Loader2 className="animate-spin h-5 w-5" />
//                     ) : (
//                         <div className="flex items-center justify-center gap-3">
//                             <CreditCard className="h-4 w-4" />
//                             Finalize Hub Synchronization
//                         </div>
//                     )}
//                 </Button>
//             </div>

//             <div className="flex justify-center items-center gap-4 opacity-30 grayscale pt-2">
//                 <Lock className="h-3 w-3" />
//                 <p className="text-[8px] font-bold uppercase tracking-[0.3em]">PCI-DSS Secured Transaction Hub</p>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
// import { 
//     Check, ArrowLeft, Loader2, CreditCard,
//     ShieldCheck, Zap, ShieldAlert, Lock, ChevronRight
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { toTitleCase } from '@/lib/utils/formatters';
// import { getErrorMessage } from '@/lib/error-handler';

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface PaystackResponse {
//     reference: string;
//     status?: string;
// }

// /**
//  * Interface for Paystack Inline Hub Configuration.
//  * Rule 15: Zero 'any' types in the gateway protocol.
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
//  * ONBOARDING PHASE 03: LICENSE PROVISIONING
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 15: Pure TypeScript - Zero 'any' types.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  * Rule 23: Explicit Error Protocol with getErrorMessage.
//  */
// export function PaymentStep() {
//     // Rule 17: Pulling registry state directly from the Onboarding Store
//     const { 
//         plans,
//         adminData, 
//         schoolData, 
//         setPaymentData, 
//         setLoading, 
//         setError, 
//         isLoading, 
//         error, 
//         setProvisioned, 
//         setConfirmedEmail, 
//         prevStep 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find((p: SubscriptionPlanItem) => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const [isGateOpening, setIsGateOpening] = useState(false);

//     const activePlan = plans.find((p: SubscriptionPlanItem) => p.id === selectedPlanId);

//     useEffect(() => {
//         if (typeof window !== 'undefined' && !window.PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             document.head.appendChild(script);
//         }
//     }, []);

//     /**
//      * FINAL DEPLOYMENT HUB
//      * Rule 11/12: Server-First atomic synchronization logic.
//      * Rule 23: Typed error handling via unknown bridge.
//      */
//     const handleFinalizeDeployment = useCallback(() => {
//         if (!activePlan || !adminData || !schoolData || isGateOpening || isLoading || !adminData.password) {
//             setError("Registry Context Error: Identity profile or hub data incomplete.");
//             return;
//         }
        
//         setIsGateOpening(true);
//         setLoading(true);
//         setError(null);

//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         try {
//             const handler = window.PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { 
//                     plan: activePlan.slug, 
//                     schoolName: schoolData.schoolName,
//                     adminName: adminData.name 
//                 },
//                 callback: (response: PaystackResponse) => {
//                     const executeFinalSync = async () => {
//                         try {
//                             // 1. Verify Gateway Truth
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment verification protocol failed.");

//                             // 2. Atomic Hub Synchronization (Rule 11)
//                             const result = await completeOnboarding(
//                                 { ...adminData, name: toTitleCase(adminData.name) },
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug || 'starter'
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             // 3. Update Hub State & Redirect
//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
                            
//                             setConfirmedEmail(adminData.email);
//                             setProvisioned(true);
//                             toast.success("Institutional Hub Synchronized.");
//                         } catch (error: unknown) { 
//                             // ✅ Rule 23: Standardized Error Extraction
//                             const message = getErrorMessage(error);
//                             setError(message); 
//                             setIsGateOpening(false);
//                             setLoading(false);
//                         }
//                     };
//                     executeFinalSync();
//                 },
//                 onClose: () => {
//                     setIsGateOpening(false);
//                     setLoading(false);
//                 },
//             });
//             handler.openIframe();
//         } catch (error: unknown) { 
//             // ✅ Rule 23: Explicit Error Protocol
//             const message = getErrorMessage(error);
//             console.error("[GATEWAY_PROTOCOL_FAULT]:", message);
//             setError(message);
//             setIsGateOpening(false);
//             setLoading(false); 
//         }
//     }, [
//         activePlan, adminData, schoolData, currency, 
//         isGateOpening, isLoading, setLoading, setError, 
//         setPaymentData, setConfirmedEmail, setProvisioned
//     ]);

//     if (!activePlan) return (
//         <div className="p-20 flex flex-col items-center justify-center gap-4 animate-pulse">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Initializing Licensing Hub...</p>
//         </div>
//     );

//     return (
//         <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
//             {/* ── HEADER (Rule 11) ── */}
//             <div className="text-center space-y-3">
//                 <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center mx-auto shadow-sm">
//                     <ShieldCheck className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70 italic">
//                     Select institutional hub capacity
//                 </p>
//             </div>

//             {/* ── CURRENCY HUB (Rule 21) ── */}
//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-2 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c: 'ngn' | 'usd') => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95', 
//                                 currency === c 
//                                     ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200' 
//                                     : 'text-muted-foreground hover:text-foreground'
//                             )}
//                         >
//                             {c === 'ngn' ? '₦ NGN Sync' : '$ USD Global'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* ── PLANS LIST (Rule 19/21) ── */}
//             <div className="space-y-4">
//                 {plans.map((p: SubscriptionPlanItem) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 "w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden",
//                                 isSelected 
//                                     ? "bg-card border-school-primary shadow-xl scale-[1.02]" 
//                                     : "bg-surface border-border hover:border-school-primary-100"
//                             )}
//                         >
//                             {isSelected && <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-60" />}

//                             <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
//                                 <div className="space-y-4">
//                                     <div className="flex items-center gap-3">
//                                         <Zap className={cn("h-5 w-5", isSelected ? "text-school-primary" : "text-muted-foreground/30")} />
//                                         <p className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                             {p.name}
//                                         </p>
//                                     </div>
//                                     <ul className="space-y-2">
//                                         {p.features?.slice(0, 3).map((f: string) => (
//                                             <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                 <div className="flex h-3.5 w-3.5 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200">
//                                                     <Check className="h-3 w-3 text-school-primary stroke-[4]" /> 
//                                                 </div>
//                                                 {f}
//                                             </li>
//                                         ))}
//                                     </ul>
//                                 </div>
//                                 <div className="text-right self-end md:self-start">
//                                     <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums leading-none">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ── ERROR HUB (Rule 23) ── */}
//             {typeof error === 'string' && error.length > 0 && (
//                 <div className="p-5 rounded-2xl bg-destructive-50 border border-destructive-200 text-destructive text-[10px] font-extrabold uppercase tracking-widest italic animate-in shake duration-500">
//                     <div className="flex items-center gap-3">
//                         <ShieldAlert className="h-4 w-4 shrink-0" />
//                         <span>Protocol Error: {error}</span>
//                     </div>
//                 </div>
//             )}

//             {/* ── ACTIONS (Rule 20) ── */}
//             <div className="flex gap-4 pt-4">
//                 <Button 
//                     variant="outline" 
//                     type="button"
//                     onClick={prevStep} 
//                     className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground hover:bg-background shadow-sm transition-all"
//                 >
//                     <ArrowLeft className="h-5 w-5" strokeWidth={3} />
//                 </Button>
                
//                 <Button 
//                     onClick={handleFinalizeDeployment} 
//                     disabled={isLoading || isGateOpening} 
//                     className={cn(
//                         "flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
//                     )}
//                 >
//                     {isLoading || isGateOpening ? (
//                         <Loader2 className="animate-spin h-5 w-5 mx-auto" />
//                     ) : (
//                         <div className="flex items-center justify-center gap-3">
//                             <CreditCard className="h-4 w-4" />
//                             <span>Finalize Hub Sync</span>
//                             <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                         </div>
//                     )}
//                 </Button>
//             </div>

//             <div className="flex justify-center items-center gap-4 opacity-30 grayscale pt-2">
//                 <Lock className="h-3 w-3" />
//                 <p className="text-[8px] font-bold uppercase tracking-[0.3em]">PCI-DSS Secured Transaction Hub</p>
//             </div>
//         </div>
//     );
// }



'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
import { type SubscriptionPlanItem } from '@/app/actions/subscription.actions';
import { 
    Check, ArrowLeft, Loader2, CreditCard,
    ShieldCheck, Zap, ShieldAlert, Lock, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { toTitleCase } from '@/lib/utils/formatters';
import { getErrorMessage } from '@/lib/error-handler';

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

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
 * ONBOARDING PHASE 03: LICENSE PROVISIONING
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 15: Pure TypeScript - Zero 'any' types.
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 * Rule 23: Explicit Error Protocol with getErrorMessage.
 */
export function PaymentStep() {
    // Rule 17: Pulling registry state directly from the Onboarding Store
    const { 
        plans,
        adminData, 
        schoolData, 
        setPaymentData, 
        setLoading, 
        setError, 
        isLoading, 
        error, 
        setProvisioned, 
        setConfirmedEmail, 
        prevStep 
    } = useOnboardingStore();
    
    const [selectedPlanId, setSelectedPlanId] = useState<string>(
        plans.find((p: SubscriptionPlanItem) => p.popular)?.id || plans[0]?.id || ""
    );
    const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
    const [isGateOpening, setIsGateOpening] = useState(false);

    const activePlan = plans.find((p: SubscriptionPlanItem) => p.id === selectedPlanId);

    useEffect(() => {
        if (typeof window !== 'undefined' && !window.PaystackPop) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    /**
     * FINAL DEPLOYMENT HUB
     * Rule 11/12: Server-First atomic synchronization logic.
     * Rule 23: Typed error handling via unknown bridge.
     */
    const handleFinalizeDeployment = useCallback(() => {
        if (!activePlan || !adminData || !schoolData || isGateOpening || isLoading || !adminData.password) {
            setError("Registry Context Error: Identity profile or hub data incomplete.");
            return;
        }
        
        setIsGateOpening(true);
        setLoading(true);
        setError(null);

        const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

        try {
            const handler = window.PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: adminData.email,
                amount: amount, 
                currency: currency.toUpperCase(),
                metadata: { 
                    plan: activePlan.slug, 
                    schoolName: schoolData.schoolName,
                    adminName: adminData.name 
                },
                callback: (response: PaystackResponse) => {
                    const executeFinalSync = async () => {
                        try {
                            // 1. Verify Gateway Truth
                            const verification = await verifyPaystackPayment(response.reference);
                            if (!verification.success) throw new Error("Payment verification protocol failed.");

                            // 2. Atomic Hub Synchronization (Rule 11)
                            const result = await completeOnboarding(
                                { ...adminData, name: toTitleCase(adminData.name) },
                                schoolData,
                                response.reference,
                                activePlan.slug
                            );

                            if (!result.success) throw new Error(result.error);

                            // 3. Update Hub State & Redirect
                            // ✅ FIXED TS2333: Explicit cast to PlanType to satisfy the store contract
                            setPaymentData({ 
                                provider: 'paystack', 
                                plan: activePlan.slug as PlanType, 
                                reference: response.reference, 
                                verified: true 
                            });
                            
                            setConfirmedEmail(adminData.email);
                            setProvisioned(true);
                            toast.success("Institutional Hub Synchronized.");
                        } catch (error: unknown) { 
                            const message = getErrorMessage(error);
                            setError(message); 
                            setIsGateOpening(false);
                            setLoading(false);
                        }
                    };
                    executeFinalSync();
                },
                onClose: () => {
                    setIsGateOpening(false);
                    setLoading(false);
                },
            });
            handler.openIframe();
        } catch (error: unknown) { 
            const message = getErrorMessage(error);
            console.error("[GATEWAY_PROTOCOL_FAULT]:", message);
            setError(message);
            setIsGateOpening(false);
            setLoading(false); 
        }
    }, [
        activePlan, adminData, schoolData, currency, 
        isGateOpening, isLoading, setLoading, setError, 
        setPaymentData, setConfirmedEmail, setProvisioned
    ]);

    if (!activePlan) return (
        <div className="p-20 flex flex-col items-center justify-center gap-4 animate-pulse">
            <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Initializing Licensing Hub...</p>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
            {/* ── HEADER ── */}
            <div className="text-center space-y-3">
                <div className="h-14 w-14 rounded-2xl bg-school-primary-50 border border-school-primary-200 flex items-center justify-center mx-auto shadow-sm">
                    <ShieldCheck className="h-7 w-7 text-school-primary" />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                    License Tier
                </h1>
                <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70 italic">
                    Select institutional hub capacity
                </p>
            </div>

            {/* ── CURRENCY HUB ── */}
            <div className="flex justify-center">
                <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-2 shadow-inner">
                    {(['ngn', 'usd'] as const).map((c: 'ngn' | 'usd') => (
                        <button 
                            key={c} 
                            onClick={() => setCurrency(c)} 
                            className={cn(
                                'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95', 
                                currency === c 
                                    ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200' 
                                    : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            {c === 'ngn' ? '₦ NGN Sync' : '$ USD Global'}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── PLANS LIST ── */}
            <div className="space-y-4">
                {plans.map((p: SubscriptionPlanItem) => {
                    const isSelected = selectedPlanId === p.id;
                    const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
                    return (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPlanId(p.id)}
                            className={cn(
                                "w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden",
                                isSelected 
                                    ? "bg-card border-school-primary shadow-xl scale-[1.02]" 
                                    : "bg-surface border-border hover:border-school-primary-100"
                            )}
                        >
                            {isSelected && <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-60" />}

                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Zap className={cn("h-5 w-5", isSelected ? "text-school-primary" : "text-muted-foreground/30")} />
                                        <p className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                                            {p.name}
                                        </p>
                                    </div>
                                    <ul className="space-y-2">
                                        {p.features?.slice(0, 3).map((f: string) => (
                                            <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                                                <div className="flex h-3.5 w-3.5 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200">
                                                    <Check className="h-3 w-3 text-school-primary stroke-[4]" /> 
                                                </div>
                                                {f}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="text-right self-end md:self-start">
                                    <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums leading-none">
                                        {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* ── ERROR HUB ── */}
            {typeof error === 'string' && error.length > 0 && (
                <div className="p-5 rounded-2xl bg-destructive-50 border border-destructive-200 text-destructive text-[10px] font-extrabold uppercase tracking-widest italic animate-in shake duration-500">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="h-4 w-4 shrink-0" />
                        <span>Protocol Error: {error}</span>
                    </div>
                </div>
            )}

            {/* ── ACTIONS ── */}
            <div className="flex gap-4 pt-4">
                <Button 
                    variant="outline" 
                    type="button"
                    onClick={prevStep} 
                    className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground hover:bg-background shadow-sm transition-all"
                >
                    <ArrowLeft className="h-5 w-5" strokeWidth={3} />
                </Button>
                
                <Button 
                    onClick={handleFinalizeDeployment} 
                    disabled={isLoading || isGateOpening} 
                    className={cn(
                        "flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group",
                        "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
                        "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
                    )}
                >
                    {isLoading || isGateOpening ? (
                        <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                    ) : (
                        <div className="flex items-center justify-center gap-3">
                            <CreditCard className="h-4 w-4" />
                            <span>Finalize Hub Sync</span>
                            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </div>
                    )}
                </Button>
            </div>

            <div className="flex justify-center items-center gap-4 opacity-30 grayscale pt-2">
                <Lock className="h-3 w-3" />
                <p className="text-[8px] font-bold uppercase tracking-[0.3em]">PCI-DSS Secured Transaction Hub</p>
            </div>
        </div>
    );
}