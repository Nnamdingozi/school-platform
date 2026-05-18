

// // src/components/PaymentStep.tsx
// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, PlanType, PaymentProvider } from '@/store/onboardingStore';
// import { verifyPaystackPayment } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { Check, ArrowRight, ArrowLeft, Zap, Shield, Building2, CreditCard } from 'lucide-react';
// import { cn } from '@/lib/utils';

// // ... (PLANS and PAYMENT_PROVIDERS remain the same) ...
// const PLANS = [
//     {
//         id: 'starter' as PlanType,
//         name: 'Starter',
//         price: { ngn: 25000, usd: 29 },
//         icon: Zap,
//         description: 'Perfect for small schools getting started.',
//         features: [
//             'Up to 5 teachers',
//             'Up to 150 students',
//             '100 WhatsApp credits/month',
//             'AI Lesson Planner',
//             'Basic analytics',
//         ],
//         highlight: false,
//     },
//     {
//         id: 'pro' as PlanType,
//         name: 'Pro',
//         price: { ngn: 65000, usd: 79 },
//         icon: Shield,
//         description: 'For growing schools with advanced needs.',
//         features: [
//             'Up to 20 teachers',
//             'Up to 600 students',
//             '500 WhatsApp credits/month',
//             'AI Lesson Planner + Quiz Generator',
//             'Advanced analytics & reports',
//             'Priority support',
//         ],
//         highlight: true,
//     },
//     {
//         id: 'enterprise' as PlanType,
//         name: 'Enterprise',
//         price: { ngn: 150000, usd: 179 },
//         icon: Building2,
//         description: 'For large institutions at scale.',
//         features: [
//             'Unlimited teachers & students',
//             '2000 WhatsApp credits/month',
//             'Full AI suite',
//             'Custom branding',
//             'Dedicated support',
//             'SLA guarantee',
//         ],
//         highlight: false,
//     },
// ];

// const PAYMENT_PROVIDERS = [
//     {
//         id: 'paystack' as PaymentProvider,
//         name: 'Paystack',
//         description: 'Pay with card, bank transfer, USSD (Nigeria)',
//         logo: '🟢',
//         recommended: true,
//     },
//     {
//         id: 'stripe' as PaymentProvider,
//         name: 'Stripe',
//         description: 'Pay with card, Apple Pay, Google Pay',
//         logo: '🔵',
//         recommended: false,
//     },
// ];

// interface PaystackResponse {
//     reference: string;
//     status?: string;
//     message?: string;
// }

// interface PaystackOptions {
//     key: string | undefined;
//     email: string;
//     amount: number;
//     currency: string;
//     metadata: Record<string, unknown>;
//     callback: (response: PaystackResponse) => void;
//     onClose: () => void;
// }

// interface PaystackPop {
//     setup(options: PaystackOptions): {
//         openIframe(): void;
//     };
// }

// declare global {
//     interface Window {
//         PaystackPop: PaystackPop; // ✅ Use the interface instead of 'any'
//     }
// }


// export function PaymentStep() {
//     const { nextStep, prevStep, adminData, setPaymentData, setLoading, setError, isLoading, error } = useOnboardingStore();
//     const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
//     const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');

//     // Use a ref to track if script is loaded to avoid re-renders just for this flag
//     const isScriptLoaded = useRef(false);

//     const plan = PLANS.find(p => p.id === selectedPlan)!;
//     const amount = plan.price[currency];

//     // Load Paystack script on component mount
//     useEffect(() => {
//         if (typeof window !== 'undefined' && !window.PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true; // Use async loading
//             script.onload = () => {
//                 isScriptLoaded.current = true;
//             };
//             script.onerror = () => {
//                 setError('Failed to load Paystack. Check your internet connection.');
//             };
//             document.head.appendChild(script);
//         } else if (window.PaystackPop) {
//              isScriptLoaded.current = true;
//         }
//     }, [setError]);

//     // Use useCallback to prevent unnecessary recreation of the function
//    // Use useCallback to prevent unnecessary recreation of the function
//    // ✅ FIX 2: Correct types in the handlePaystack function
// const handlePaystack = useCallback(() => {
//     if (!adminData) {
//         setError("Missing admin data required for payment.");
//         return;
//     }

//     if (!isScriptLoaded.current || !window.PaystackPop) {
//         setError('Payment gateway is still loading. Please try again in a moment.');
//         return;
//     }

//     setLoading(true);
//     setError(null);

//     try {
//         const handler = window.PaystackPop.setup({
//             key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//             email: adminData.email,
//             amount: amount * 100, 
//             currency: currency.toUpperCase(),
//             metadata: { 
//                 plan: selectedPlan, 
//                 name: adminData.name 
//             },
//             callback: function(response: PaystackResponse) { // ✅ Use typed response
//                 const processPayment = async () => {
//                     try {
//                         const result = await verifyPaystackPayment(response.reference);
//                         if (!result.success) {
//                             setLoading(false);
//                             setError(result.error ?? 'Verification failed on our servers.');
//                             toast.error(result.error);
//                             return;
//                         }
                        
//                         setPaymentData({
//                             provider: 'paystack',
//                             plan: selectedPlan,
//                             reference: response.reference,
//                             verified: true,
//                         });
                        
//                         toast.success('Payment confirmed!');
//                         setLoading(false); 
//                         nextStep();
//                     } catch (err: unknown) { // ✅ Use unknown instead of any
//                         setLoading(false);
//                         const msg = typeof err === 'string' ? err : 'Verification failed.';
//                         setError(msg);
//                     }
//                 };
//                 processPayment();
//             },
//             onClose: function() {
//                 setLoading(false);
//                 toast.info('Payment window closed.');
//             },
//         });

//         handler.openIframe();
        
//     } catch (err: unknown) { // ✅ Use unknown instead of any
//         setLoading(false);
//         setError("Failed to initialize payment gateway.");
//         console.error("Paystack initialization error:", err);
//     }
// }, [adminData, amount, currency, selectedPlan, setPaymentData, nextStep, setLoading, setError]);
//     // ─── Stripe ───────────────────────────────────────────────────────────────
//     // ... (Your Stripe logic remains the same) ...
//      async function handleStripe() {
//         if (!adminData) return;
//         setLoading(true);
//         setError(null);

//         try {
//             const res = await fetch('/api/stripe/create-checkout', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     plan: selectedPlan,
//                     email: adminData.email,
//                     currency,
//                     successUrl: `${window.location.origin}/onboarding?step=3&session_id={CHECKOUT_SESSION_ID}`,
//                     cancelUrl: `${window.location.origin}/onboarding?step=2`,
//                 }),
//             });
//             const { url } = await res.json();
//             if (url) window.location.href = url;
//         } catch {
//             setError('Failed to initiate Stripe checkout.');
//             setLoading(false);
//         }
//     }


//     // ─── Dispatcher ───────────────────────────────────────────────────────────
//     function handlePay() {
//         if (selectedProvider === 'paystack') {
//             handlePaystack();
//         } else {
//             handleStripe();
//         }
//     }

//     // ─── Render ───────────────────────────────────────────────────────────────
//     return (
//        // ... (Your JSX remains EXACTLY the same) ...
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="mb-8 text-center">
//                 <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
//                     Choose your plan
//                 </h1>
//                 <p className="text-school-secondary-100/50 mt-2 text-sm">
//                     All plans include a 14-day free trial. Cancel anytime.
//                 </p>
//             </div>

//             {/* Currency toggle */}
//             <div className="flex items-center justify-center mb-6">
//                 <div className="flex bg-school-secondary-800 rounded-full p-1 gap-1">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button
//                             key={c}
//                             onClick={() => setCurrency(c)}
//                             className={cn(
//                                 'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200',
//                                 currency === c
//                                     ? 'bg-school-primary text-school-secondary-950'
//                                     : 'text-school-secondary-100/50 hover:text-school-secondary-100'
//                             )}
//                         >
//                             {c === 'ngn' ? '₦ NGN' : '$ USD'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Plans */}
//             <div className="space-y-3 mb-6">
//                 {PLANS.map((p) => {
//                     const Icon = p.icon;
//                     const isSelected = selectedPlan === p.id;
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlan(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-xl border-2 p-4 transition-all duration-200',
//                                 isSelected
//                                     ? 'border-school-primary bg-school-primary/5'
//                                     : 'border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-600',
//                                 p.highlight && !isSelected && 'border-school-primary/30'
//                             )}
//                         >
//                             <div className="flex items-start justify-between gap-3">
//                                 <div className="flex items-start gap-3 min-w-0">
//                                     <div className={cn(
//                                         'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
//                                         isSelected
//                                             ? 'bg-school-primary text-school-secondary-950'
//                                             : 'bg-school-secondary-700 text-school-secondary-100/50'
//                                     )}>
//                                         <Icon className="h-4 w-4" />
//                                     </div>
//                                     <div className="min-w-0">
//                                         <div className="flex items-center gap-2 flex-wrap">
//                                             <span className="font-bold text-school-secondary-100">{p.name}</span>
//                                             {p.highlight && (
//                                                 <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-school-primary text-school-secondary-950">
//                                                     Most Popular
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <p className="text-xs text-school-secondary-100/40 mt-0.5">{p.description}</p>
//                                         {isSelected && (
//                                             <ul className="mt-3 space-y-1.5">
//                                                 {p.features.map((f) => (
//                                                     <li key={f} className="flex items-center gap-2 text-xs text-school-secondary-100/70">
//                                                         <Check className="h-3 w-3 text-school-primary shrink-0" />
//                                                         {f}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="text-right shrink-0">
//                                     <p className="font-black text-school-secondary-100 text-lg">
//                                         {currency === 'ngn' ? '₦' : '$'}{p.price[currency].toLocaleString()}
//                                     </p>
//                                     <p className="text-[10px] text-school-secondary-100/30">/month</p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* Payment provider */}
//             <div className="mb-6">
//                 <p className="text-xs uppercase tracking-wider font-semibold text-school-secondary-100/50 mb-3">
//                     Pay with
//                 </p>
//                 <div className="grid grid-cols-2 gap-3">
//                     {PAYMENT_PROVIDERS.map((provider) => (
//                         <button
//                             key={provider.id}
//                             onClick={() => setSelectedProvider(provider.id)}
//                             className={cn(
//                                 'rounded-xl border-2 p-3 text-left transition-all duration-200',
//                                 selectedProvider === provider.id
//                                     ? 'border-school-primary bg-school-primary/5'
//                                     : 'border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-600'
//                             )}
//                         >
//                             <div className="flex items-center gap-2 mb-1">
//                                 <span className="text-lg">{provider.logo}</span>
//                                 <span className="font-bold text-school-secondary-100 text-sm">{provider.name}</span>
//                                 {provider.recommended && (
//                                     <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-school-primary/20 text-school-primary">
//                                         Rec.
//                                     </span>
//                                 )}
//                             </div>
//                             <p className="text-[10px] text-school-secondary-100/40 leading-tight">
//                                 {provider.description}
//                             </p>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Error */}
//             {error && (
//                 <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
//                     {error}
//                 </div>
//             )}

//             {/* Summary */}
//             <div className="bg-school-secondary-800 rounded-xl p-4 mb-4">
//                 <div className="flex items-center justify-between text-sm">
//                     <span className="text-school-secondary-100/60">
//                         {plan.name} plan · {currency.toUpperCase()}
//                     </span>
//                     <span className="font-black text-school-secondary-100 text-base">
//                         {currency === 'ngn' ? '₦' : '$'}{amount.toLocaleString()}/mo
//                     </span>
//                 </div>
//                 <p className="text-[10px] text-school-secondary-100/30 mt-1">
//                     You will not be charged until your 14-day trial ends.
//                 </p>
//             </div>

//             {/* Actions */}
//             <div className="flex gap-3">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={prevStep}
//                     disabled={isLoading}
//                     className="border-school-secondary-700 text-school-secondary-100/60 hover:text-school-secondary-100 hover:bg-school-secondary-800"
//                 >
//                     <ArrowLeft className="h-4 w-4" />
//                 </Button>

//                 <Button
//                     onClick={handlePay}
//                     disabled={isLoading}
//                     className="flex-1 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 hover:scale-[1.01]"
//                 >
//                     {isLoading ? (
//                         <span className="flex items-center gap-2">
//                             <span className="h-4 w-4 border-2 border-school-secondary-950/30 border-t-school-secondary-950 rounded-full animate-spin" />
//                             Processing...
//                         </span>
//                     ) : (
//                         <span className="flex items-center gap-2">
//                             <CreditCard className="h-4 w-4" />
//                             Pay with {selectedProvider === 'paystack' ? 'Paystack' : 'Stripe'}
//                             <ArrowRight className="h-4 w-4" />
//                         </span>
//                     )}
//                 </Button>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType, type PaymentProvider } from '@/store/onboardingStore';
// import { verifyPaystackPayment } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { 
//     Check, ArrowRight, ArrowLeft, Zap, Shield, 
//     Building2, Loader2, ShieldCheck, Landmark 
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { useProfileStore } from '@/store/profileStore';

// // ── Configuration ───────────────────────────────────────────────────────────

// const PLANS = [
//     {
//         id: 'starter' as PlanType,
//         name: 'Starter Node',
//         price: { ngn: 25000, usd: 29 },
//         icon: Zap,
//         description: 'Provisioning for emerging learning centers.',
//         features: [
//             '5 Lead Instructors',
//             '150 Student Identities',
//             '100 WhatsApp Transmission Units',
//             'AI Syllabus Synthesis',
//             'Basic Telemetry',
//         ],
//         highlight: false,
//     },
//     {
//         id: 'pro' as PlanType,
//         name: 'Professional Tier',
//         price: { ngn: 65000, usd: 79 },
//         icon: Shield,
//         description: 'Advanced logic for established institutions.',
//         features: [
//             '20 Lead Instructors',
//             '600 Student Identities',
//             '500 WhatsApp Transmission Units',
//             'Full AI Node (Videos + Quizzes)',
//             'Advanced Registry Analytics',
//             'Priority Node Support',
//         ],
//         highlight: true,
//     },
//     {
//         id: 'enterprise' as PlanType,
//         name: 'Enterprise Grid',
//         price: { ngn: 150000, usd: 179 },
//         icon: Building2,
//         description: 'Full-scale infrastructure for large groups.',
//         features: [
//             'Unlimited Registry Identities',
//             '2000 WhatsApp Transmission Units',
//             'Full Multi-Curricular Suite',
//             'Institutional Branding Protocol',
//             'API Logic Access',
//             'Uptime SLA Guarantee',
//         ],
//         highlight: false,
//     },
// ];

// const PROVIDERS = [
//     {
//         id: 'paystack' as PaymentProvider,
//         name: 'Paystack',
//         description: 'Direct Local Settlement (NGN)',
//         logo: <Landmark className="h-4 w-4" />,
//         recommended: true,
//     },
//     {
//         id: 'stripe' as PaymentProvider,
//         name: 'Stripe',
//         description: 'Global Tier Settlement (USD)',
//         logo: <GlobeIcon className="h-4 w-4" />,
//         recommended: false,
//     },
// ];

// // ── Types ───────────────────────────────────────────────────────────────────

// interface PaystackResponse {
//     reference: string;
//     status?: string;
//     message?: string;
// }

// interface PaystackOptions {
//     key: string | undefined;
//     email: string;
//     amount: number;
//     currency: string;
//     metadata: Record<string, unknown>;
//     callback: (response: PaystackResponse) => void;
//     onClose: () => void;
// }

// interface PaystackPop {
//     setup(options: PaystackOptions): {
//         openIframe(): void;
//     };
// }

// declare global {
//     interface window {
//         PaystackPop: PaystackPop;
//     }
// }

// // ── Main Component ──────────────────────────────────────────────────────────

// /**
//  * ONBOARDING PHASE 02: LICENSE PROVISIONING
//  * Rule 1: Institutional Tier Selection.
//  * Rule 11: Real-time validation of license credentials.
//  */
// export function PaymentStep() {
//     const { nextStep, prevStep, adminData, setPaymentData, setLoading, setError, isLoading, error } = useOnboardingStore();
//     const { profile } = useProfileStore();
    
//     const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
//     const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');

//     const isScriptLoaded = useRef(false);
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     const plan = PLANS.find(p => p.id === selectedPlan)!;
//     const amount = plan.price[currency];

//     // Initialize Payment Gateway
//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             script.onload = () => { isScriptLoaded.current = true; };
//             script.onerror = () => { setError('Gateway connection failed. Check registry link.'); };
//             document.head.appendChild(script);
//         } else {
//              isScriptLoaded.current = true;
//         }
//     }, [setError]);

//     // ── Handlers ──

//     const handlePaystack = useCallback(() => {
//         if (!adminData) return setError("Identity node missing.");
//         if (!isScriptLoaded.current || !(window as any).PaystackPop) {
//             return setError('Gateway still initializing...');
//         }

//         setLoading(true);
//         setError(null);

//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount * 100, 
//                 currency: currency.toUpperCase(),
//                 metadata: { plan: selectedPlan, name: adminData.name },
//                 callback: (response: PaystackResponse) => {
//                     const verify = async () => {
//                         try {
//                             // Rule 11: Final System Truth Verification
//                             const result = await verifyPaystackPayment(response.reference);
//                             if (!result.success) throw new Error(result.error);
                            
//                             setPaymentData({
//                                 provider: 'paystack',
//                                 plan: selectedPlan,
//                                 reference: response.reference,
//                                 verified: true,
//                             });
                            
//                             toast.success('License Synchronized.');
//                             setLoading(false); 
//                             nextStep();
//                         } catch (err: unknown) {
//                             setLoading(false);
//                             setError(err instanceof Error ? err.message : "Verification failed.");
//                         }
//                     };
//                     verify();
//                 },
//                 onClose: () => {
//                     setLoading(false);
//                     toast.info('Transaction aborted.');
//                 },
//             });
//             handler.openIframe();
//         } catch (err: unknown) {
//             setLoading(false);
//             setError("Logic initialization failed.");
//         }
//     }, [adminData, amount, currency, selectedPlan, setPaymentData, nextStep, setLoading, setError]);

//     const handleStripe = async () => {
//         if (!adminData) return;
//         setLoading(true);
//         try {
//             const res = await fetch('/api/stripe/create-checkout', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     plan: selectedPlan,
//                     email: adminData.email,
//                     currency,
//                     successUrl: `${window.location.origin}/onboarding?step=3&session_id={CHECKOUT_SESSION_ID}`,
//                     cancelUrl: `${window.location.origin}/onboarding?step=2`,
//                 }),
//             });
//             const { url } = await res.json();
//             if (url) window.location.href = url;
//         } catch {
//             setError('Stripe terminal connection failed.');
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            
//             {/* ── HEADER ── */}
//             <div className="text-center space-y-2">
//                 <div className="flex justify-center mb-4">
//                     <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl">
//                         <ShieldCheck className="h-6 w-6 text-school-primary" />
//                     </div>
//                 </div>
//                 <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
//                     Define the scale of your institutional node
//                 </p>
//             </div>

//             {/* CURRENCY TOGGLE */}
//             <div className="flex justify-center">
//                 <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button
//                             key={c}
//                             onClick={() => setCurrency(c)}
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300',
//                                 currency === c
//                                     ? 'bg-school-primary text-slate-950 shadow-xl'
//                                     : 'text-slate-500 hover:text-white'
//                             )}
//                             style={currency === c ? { backgroundColor: primaryColor } : {}}
//                         >
//                             {c === 'ngn' ? '₦ NGN Sync' : '$ USD Sync'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* PLANS MATRIX */}
//             <div className="space-y-4">
//                 {PLANS.map((p) => {
//                     const isSelected = selectedPlan === p.id;
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlan(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-8 transition-all duration-500 group relative overflow-hidden',
//                                 isSelected
//                                     ? 'bg-slate-900 shadow-2xl'
//                                     : 'bg-slate-950 border-white/5 hover:border-white/10'
//                             )}
//                             style={isSelected ? { borderColor: primaryColor } : {}}
//                         >
//                             <div className="relative z-10 flex items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn(
//                                         'h-12 w-12 rounded-xl flex items-center justify-center shrink-0 mt-1 border transition-colors shadow-inner',
//                                         isSelected ? 'bg-slate-950' : 'bg-slate-900 border-white/5'
//                                     )}>
//                                         <p.icon className="h-6 w-6" style={{ color: isSelected ? primaryColor : '#475569' }} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <div className="flex items-center gap-3">
//                                             <span className="text-xl font-black text-white uppercase italic tracking-tight">{p.name}</span>
//                                             {p.highlight && (
//                                                 <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
//                                                     Optimal Sync
//                                                 </span>
//                                             )}
//                                         </div>
//                                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed italic">{p.description}</p>
                                        
//                                         {isSelected && (
//                                             <ul className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 animate-in slide-in-from-top-2">
//                                                 {p.features.map((f) => (
//                                                     <li key={f} className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-tighter">
//                                                         <Check className="h-3 w-3 text-school-primary shrink-0" style={{ color: primaryColor }} />
//                                                         {f}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="text-right shrink-0">
//                                     <p className="text-2xl font-black text-white italic tracking-tighter">
//                                         {currency === 'ngn' ? '₦' : '$'}{p.price[currency].toLocaleString()}
//                                     </p>
//                                     <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">/ Cycle</p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* PROVIDER SELECTION */}
//             <div className="space-y-4">
//                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 ml-2">Settlement Protocol</p>
//                 <div className="grid grid-cols-2 gap-4">
//                     {PROVIDERS.map((provider) => (
//                         <button
//                             key={provider.id}
//                             onClick={() => setSelectedProvider(provider.id)}
//                             className={cn(
//                                 'rounded-2xl border-2 p-5 text-left transition-all duration-300 shadow-xl',
//                                 selectedProvider === provider.id
//                                     ? 'bg-slate-900'
//                                     : 'bg-slate-950 border-white/5 hover:border-white/10'
//                             )}
//                             style={selectedProvider === provider.id ? { borderColor: primaryColor } : {}}
//                         >
//                             <div className="flex items-center justify-between mb-2">
//                                 <div className="flex items-center gap-3">
//                                     <div className="p-2 bg-slate-950 rounded-lg border border-white/5">
//                                         {provider.logo}
//                                     </div>
//                                     <span className="font-black text-white uppercase italic text-xs">{provider.name}</span>
//                                 </div>
//                                 {provider.recommended && (
//                                     <span className="text-[8px] font-black uppercase bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded">Native</span>
//                                 )}
//                             </div>
//                             <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter leading-tight italic">
//                                 {provider.description}
//                             </p>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {error && (
//                 <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase italic animate-in shake">
//                     Verification Failure: {error}
//                 </div>
//             )}

//             {/* ACTION FOOTER */}
//             <div className="pt-8 border-t border-white/5 flex gap-4">
//                 <Button
//                     variant="outline"
//                     onClick={prevStep}
//                     disabled={isLoading}
//                     className="h-16 px-8 rounded-2xl border-white/5 bg-slate-900 text-slate-500 hover:text-white transition-all"
//                 >
//                     <ArrowLeft className="h-5 w-5" />
//                 </Button>

//                 <Button
//                     onClick={() => selectedProvider === 'paystack' ? handlePaystack() : handleStripe()}
//                     disabled={isLoading}
//                     className="flex-1 text-slate-950 font-black h-16 rounded-2xl transition-all duration-300 shadow-2xl uppercase text-[11px] tracking-[0.2em] group"
//                     style={{ backgroundColor: primaryColor }}
//                 >
//                     {isLoading ? (
//                         <Loader2 className="h-5 w-5 animate-spin" />
//                     ) : (
//                         <span className="flex items-center gap-3">
//                             Initialize Synchronized Billing
//                             <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
//                         </span>
//                     )}
//                 </Button>
//             </div>
//         </div>
//     );
// }

// function GlobeIcon({ className }: { className?: string }) {
//     return (
//         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M2 12h20"/><path d="M12 2a14.5 14.5 0 0 1 0 20"/></svg>
//     )
// }




'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useOnboardingStore, type PlanType, type PaymentProvider } from '@/store/onboardingStore';
import { verifyPaystackPayment } from '@/app/actions/onboarding';
import { 
    Check, ArrowRight, ArrowLeft, Zap, Shield, 
    Building2, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

/**
 * ONBOARDING PHASE 02: LICENSE PROVISIONING
 * Rule 17: Pulls plans directly from the Onboarding Store (Hydrated by Shell).
 * Rule 11: Real-time DB Plans (System Truth).
 */
export function PaymentStep() {
    const { 
        plans, nextStep, prevStep, adminData, setPaymentData, 
        setLoading, setError, isLoading, error 
    } = useOnboardingStore();
    
    const [selectedPlanId, setSelectedPlanId] = useState<string>(
        plans.find(p => p.popular)?.id || plans[0]?.id || ""
    );
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
    const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
    const isScriptLoaded = useRef(false);

    const activePlan = plans.find(p => p.id === selectedPlanId);

    useEffect(() => {
        if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            script.onload = () => { isScriptLoaded.current = true; };
            document.head.appendChild(script);
        } else { isScriptLoaded.current = true; }
    }, []);

    const getPlanIcon = (slug: string) => {
        if (slug.includes('enterprise')) return Building2;
        if (slug.includes('pro')) return Shield;
        return Zap;
    };

    const handlePaystack = useCallback(() => {
        if (!adminData || !activePlan) return setError("Protocol error: Logic context missing.");
        
        const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

        setLoading(true);
        try {
            const handler = (window as any).PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: adminData.email,
                amount: amount, 
                currency: currency.toUpperCase(),
                metadata: { plan: activePlan.slug, name: adminData.name },
                callback: (response: { reference: string }) => {
                    const verify = async () => {
                        try {
                            const result = await verifyPaystackPayment(response.reference);
                            if (!result.success) throw new Error(result.error);
                            setPaymentData({ 
                                provider: 'paystack', 
                                plan: activePlan.slug as PlanType, 
                                reference: response.reference, 
                                verified: true 
                            });
                            nextStep();
                        } catch (err: any) { setError(err.message); } finally { setLoading(false); }
                    };
                    verify();
                },
                onClose: () => setLoading(false),
            });
            handler.openIframe();
        } catch (err) { setLoading(false); }
    }, [adminData, currency, activePlan, setPaymentData, nextStep, setLoading, setError]);

    if (!activePlan) return <div className="p-20 text-center animate-pulse">Initializing Tiers...</div>;

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">License Tier</h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Node Scaling</p>
            </div>

            {/* Currency */}
            <div className="flex justify-center">
                <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-1.5 gap-1.5 shadow-inner">
                    {(['ngn', 'usd'] as const).map((c) => (
                        <button key={c} onClick={() => setCurrency(c)} className={cn('px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', currency === c ? 'bg-school-primary text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white')}>
                            {c === 'ngn' ? '₦ NGN Sync' : '$ USD Sync'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plans */}
            <div className="space-y-4">
                {plans.map((p) => {
                    const isSelected = selectedPlanId === p.id;
                    const Icon = getPlanIcon(p.slug);
                    const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    return (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPlanId(p.id)}
                            className={cn('w-full text-left rounded-[2rem] border-2 p-8 transition-all duration-500 group relative', isSelected ? 'bg-slate-900 border-school-primary shadow-2xl' : 'bg-slate-950 border-white/5 hover:border-white/10')}
                        >
                            <div className="relative z-10 flex items-start justify-between gap-6">
                                <div className="flex items-start gap-6">
                                    <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0 mt-1 transition-colors', isSelected ? 'bg-slate-950 border-white/10 border' : 'bg-slate-900')}>
                                        <Icon className="h-6 w-6 text-slate-600 group-hover:text-school-primary" />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xl font-black text-white uppercase italic tracking-tight">{p.name}</span>
                                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{p.description}</p>
                                        {isSelected && (
                                            <ul className="mt-6 grid grid-cols-1 gap-3 animate-in slide-in-from-top-2">
                                                {p.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
                                                        <Check className="h-3 w-3 text-school-primary shrink-0" /> {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-white italic">
                                        {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep} className="h-16 px-8 rounded-2xl border-white/5 bg-slate-900 text-slate-500"><ArrowLeft /></Button>
                <Button onClick={handlePaystack} disabled={isLoading} className="flex-1 bg-school-primary text-slate-950 font-black h-16 rounded-2xl shadow-xl uppercase text-[11px] tracking-[0.2em]">
                    {isLoading ? <Loader2 className="animate-spin" /> : "Initialize Registry License"}
                </Button>
            </div>
        </div>
    );
}