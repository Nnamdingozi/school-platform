

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




// 'use client';

// import { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType, type PaymentProvider } from '@/store/onboardingStore';
// import { verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowRight, ArrowLeft, Zap, Shield, 
//     Building2, Loader2
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';

// /**
//  * ONBOARDING PHASE 02: LICENSE PROVISIONING
//  * Rule 17: Pulls plans directly from the Onboarding Store (Hydrated by Shell).
//  * Rule 11: Real-time DB Plans (System Truth).
//  */
// export function PaymentStep() {
//     const { 
//         plans, nextStep, prevStep, adminData, setPaymentData, 
//         setLoading, setError, isLoading, error 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find(p => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const isScriptLoaded = useRef(false);

//     const activePlan = plans.find(p => p.id === selectedPlanId);

//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             script.onload = () => { isScriptLoaded.current = true; };
//             document.head.appendChild(script);
//         } else { isScriptLoaded.current = true; }
//     }, []);

//     const getPlanIcon = (slug: string) => {
//         if (slug.includes('enterprise')) return Building2;
//         if (slug.includes('pro')) return Shield;
//         return Zap;
//     };

//     const handlePaystack = useCallback(() => {
//         if (!adminData || !activePlan) return setError("Protocol error: Logic context missing.");
        
//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         setLoading(true);
//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { plan: activePlan.slug, name: adminData.name },
//                 callback: (response: { reference: string }) => {
//                     const verify = async () => {
//                         try {
//                             const result = await verifyPaystackPayment(response.reference);
//                             if (!result.success) throw new Error(result.error);
//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
//                             nextStep();
//                         } catch (err: any) { setError(err.message); } finally { setLoading(false); }
//                     };
//                     verify();
//                 },
//                 onClose: () => setLoading(false),
//             });
//             handler.openIframe();
//         } catch (err) { setLoading(false); }
//     }, [adminData, currency, activePlan, setPaymentData, nextStep, setLoading, setError]);

//     if (!activePlan) return <div className="p-20 text-center animate-pulse">Initializing Tiers...</div>;

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-10">
//             <div className="text-center space-y-2">
//                 <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">License Tier</h1>
//                 <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">Institutional Node Scaling</p>
//             </div>

//             {/* Currency */}
//             <div className="flex justify-center">
//                 <div className="flex bg-slate-900 border border-white/5 rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button key={c} onClick={() => setCurrency(c)} className={cn('px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all', currency === c ? 'bg-school-primary text-slate-950 shadow-xl' : 'text-slate-500 hover:text-white')}>
//                             {c === 'ngn' ? '₦ NGN Sync' : '$ USD Sync'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Plans */}
//             <div className="space-y-4">
//                 {plans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const Icon = getPlanIcon(p.slug);
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn('w-full text-left rounded-[2rem] border-2 p-8 transition-all duration-500 group relative', isSelected ? 'bg-slate-900 border-school-primary shadow-2xl' : 'bg-slate-950 border-white/5 hover:border-white/10')}
//                         >
//                             <div className="relative z-10 flex items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn('h-12 w-12 rounded-xl flex items-center justify-center shrink-0 mt-1 transition-colors', isSelected ? 'bg-slate-950 border-white/10 border' : 'bg-slate-900')}>
//                                         <Icon className="h-6 w-6 text-slate-600 group-hover:text-school-primary" />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <span className="text-xl font-black text-white uppercase italic tracking-tight">{p.name}</span>
//                                         <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest italic">{p.description}</p>
//                                         {isSelected && (
//                                             <ul className="mt-6 grid grid-cols-1 gap-3 animate-in slide-in-from-top-2">
//                                                 {p.features.map((f) => (
//                                                     <li key={f} className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase">
//                                                         <Check className="h-3 w-3 text-school-primary shrink-0" /> {f}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-2xl font-black text-white italic">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             <div className="flex gap-4">
//                 <Button variant="outline" onClick={prevStep} className="h-16 px-8 rounded-2xl border-white/5 bg-slate-900 text-slate-500"><ArrowLeft /></Button>
//                 <Button onClick={handlePaystack} disabled={isLoading} className="flex-1 bg-school-primary text-slate-950 font-black h-16 rounded-2xl shadow-xl uppercase text-[11px] tracking-[0.2em]">
//                     {isLoading ? <Loader2 className="animate-spin" /> : "Initialize Registry License"}
//                 </Button>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType, type PaymentProvider } from '@/store/onboardingStore';
// import { verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowLeft, Zap, Shield, 
//     Building2, Loader2, CreditCard
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';

// /**
//  * ONBOARDING PHASE 02: LICENSE PROVISIONING
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem] for plan cards.
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function PaymentStep() {
//     const { 
//         plans, nextStep, prevStep, adminData, setPaymentData, 
//         setLoading, setError, isLoading 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find(p => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const isScriptLoaded = useRef(false);

//     const activePlan = plans.find(p => p.id === selectedPlanId);

//     // Rule 11: System Truth - External Gateway Script Loading
//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             script.onload = () => { isScriptLoaded.current = true; };
//             document.head.appendChild(script);
//         } else { isScriptLoaded.current = true; }
//     }, []);

//     const getPlanIcon = (slug: string) => {
//         if (slug.includes('enterprise')) return Building2;
//         if (slug.includes('pro')) return Shield;
//         return Zap;
//     };

//     const handlePaystack = useCallback(() => {
//         if (!adminData || !activePlan) return setError("Protocol Error: Logic context missing.");
        
//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         setLoading(true);
//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { plan: activePlan.slug, name: adminData.name },
//                 callback: (response: { reference: string }) => {
//                     const verify = async () => {
//                         try {
//                             const result = await verifyPaystackPayment(response.reference);
//                             if (!result.success) throw new Error(result.error);
//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
//                             nextStep();
//                         } catch (err: any) { setError(err.message); } finally { setLoading(false); }
//                     };
//                     verify();
//                 },
//                 onClose: () => setLoading(false),
//             });
//             handler.openIframe();
//         } catch (err) { 
//             setLoading(false); 
//             toast.error("Gateway Protocol Breach: Connection aborted.");
//         }
//     }, [adminData, currency, activePlan, setPaymentData, nextStep, setLoading, setError]);

//     if (!activePlan) return (
//         <div className="p-20 flex flex-col items-center justify-center gap-4 animate-pulse">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Initializing Licensing Tiers...</p>
//         </div>
//     );

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
            
//             {/* ── HEADER (Rule 11) ── */}
//             <div className="text-center space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Institutional Registry Scaling
//                 </p>
//             </div>

//             {/* ── CURRENCY SELECTOR (Rule 18/19/21) ── */}
//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95', 
//                                 currency === c 
//                                     ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-100' 
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
//                 {plans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const Icon = getPlanIcon(p.slug);
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden', 
//                                 isSelected 
//                                     ? 'bg-card border-school-primary shadow-xl scale-[1.02]' 
//                                     : 'bg-surface border-border hover:border-school-primary-200'
//                             )}
//                         >
//                             {/* Rule 21 Scale Decoration */}
//                             {isSelected && <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-60" />}

//                             <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn(
//                                         'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-inner', 
//                                         isSelected ? 'bg-school-primary text-on-school-primary' : 'bg-card border border-border text-muted-foreground'
//                                     )}>
//                                         <Icon className="h-6 w-6" strokeWidth={2.5} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <span className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                             {p.name}
//                                         </span>
//                                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-70">
//                                             {p.description}
//                                         </p>
                                        
//                                         {isSelected && (
//                                             <ul className="mt-6 grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-300">
//                                                 {p.features.map((f) => (
//                                                     <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                         <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200">
//                                                             <Check className="h-3 w-3 text-school-primary" strokeWidth={4} />
//                                                         </div>
//                                                         {f}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="text-right self-end md:self-start">
//                                     <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                     <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-1 opacity-40">
//                                         Per Provisioning Cycle
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ── NAVIGATION ACTIONS (Rule 20) ── */}
//             <div className="flex items-center gap-4 pt-4">
//                 <Button 
//                     variant="outline" 
//                     onClick={prevStep} 
//                     className="h-16 w-16 md:w-20 rounded-2xl border-border bg-surface text-muted-foreground hover:bg-background hover:text-foreground transition-all shrink-0 shadow-sm"
//                 >
//                     <ArrowLeft className="h-5 w-5" strokeWidth={3} />
//                 </Button>
                
//                 <Button 
//                     onClick={handlePaystack} 
//                     disabled={isLoading} 
//                     className={cn(
//                         "flex-1 h-16 rounded-2xl shadow-xl transition-all active:scale-95 group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
//                     )}
//                 >
//                     {isLoading ? (
//                         <Loader2 className="h-5 w-5 animate-spin mx-auto" />
//                     ) : (
//                         <div className="flex items-center justify-center gap-3">
//                             <CreditCard className="h-4 w-4" />
//                             Initialize Registry License
//                         </div>
//                     )}
//                 </Button>
//             </div>

//             <div className="flex justify-center items-center gap-4 opacity-30 grayscale pt-2">
//                 <div className="h-[1px] flex-1 bg-border" />
//                 <p className="text-[8px] font-bold uppercase tracking-[0.3em]">Paystack Secure Transaction Hub</p>
//                 <div className="h-[1px] flex-1 bg-border" />
//             </div>
//         </div>
//     );
// }





// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowLeft, Zap, Shield, 
//     Building2, Loader2, CreditCard,
//     Lock
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';

// /**
//  * ONBOARDING PHASE 03: LICENSE PROVISIONING
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 12: Atomic Server Action for Hub Initialization.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem] for plan cards.
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function PaymentStep() {
//     const { 
//         plans, prevStep, adminData, schoolData, 
//         setPaymentData, setLoading, setError, 
//         isLoading, setProvisioned, setConfirmedEmail 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find(p => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const isScriptLoaded = useRef(false);

//     const activePlan = plans.find(p => p.id === selectedPlanId);

//     // Rule 11: External Gateway Script Synchronization
//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             script.onload = () => { isScriptLoaded.current = true; };
//             document.head.appendChild(script);
//         } else { isScriptLoaded.current = true; }
//     }, []);

//     const getPlanIcon = (slug: string) => {
//         if (slug.includes('enterprise')) return Building2;
//         if (slug.includes('pro')) return Shield;
//         return Zap;
//     };

//     /**
//      * ATOMIC SYNC HUB
//      * Rule 11: Executes the single-transaction provisioning after payment.
//      */
//     const handlePaystack = useCallback(() => {
//         if (!adminData || !schoolData || !activePlan) {
//             toast.error("Registry Context Missing: Protocol aborted.");
//             return;
//         }
        
//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         setLoading(true);
//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { 
//                     plan: activePlan.slug, 
//                     schoolName: schoolData.schoolName,
//                     adminName: adminData.name 
//                 },
//                 callback: (response: { reference: string }) => {
//                     const finalizeRegistry = async () => {
//                         try {
//                             // 1. Verify Payment Truth
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment Verification Failed.");

//                             // 2. Rule 11: Create Institutional Hub + Admin Profile + Subscription
//                             const result = await completeOnboarding(
//                                 adminData,
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug as PlanType
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
                            
//                             setConfirmedEmail(adminData.email);
//                             setProvisioned(true);
//                             toast.success("Institutional Hub Synchronized.");
//                         } catch (err: any) { 
//                             setError(err.message || "Registry synchronization failed."); 
//                         } finally { 
//                             setLoading(false); 
//                         }
//                     };
//                     finalizeRegistry();
//                 },
//                 onClose: () => setLoading(false),
//             });
//             handler.openIframe();
//         } catch (err) { 
//             setLoading(false); 
//             toast.error("Gateway protocol breach.");
//         }
//     }, [adminData, schoolData, currency, activePlan, setPaymentData, setLoading, setError, setProvisioned, setConfirmedEmail]);

//     if (!activePlan) return (
//         <div className="p-20 flex flex-col items-center justify-center gap-4 animate-pulse">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Initializing Licensing Hub...</p>
//         </div>
//     );

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
            
//             {/* ── HEADER (Rule 11) ── */}
//             <div className="text-center space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Select institutional registry capacity
//                 </p>
//             </div>

//             {/* ── CURRENCY HUB (Rule 21 Scale Protocol) ── */}
//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all', 
//                                 currency === c 
//                                     ? 'bg-school-primary text-on-school-primary shadow-lg' 
//                                     : 'text-muted-foreground hover:text-foreground'
//                             )}
//                         >
//                             {c === 'ngn' ? '₦ NGN' : '$ USD'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* ── PLANS LIST (Rule 19/21) ── */}
//             <div className="space-y-4">
//                 {plans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const Icon = getPlanIcon(p.slug);
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden', 
//                                 isSelected 
//                                     ? 'bg-card border-school-primary shadow-xl scale-[1.02]' 
//                                     : 'bg-surface border-border hover:border-school-primary-200'
//                             )}
//                         >
//                             <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn(
//                                         'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-inner', 
//                                         isSelected ? 'bg-school-primary text-on-school-primary' : 'bg-card border border-border text-muted-foreground'
//                                     )}>
//                                         <Icon className="h-6 w-6" strokeWidth={2.5} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <span className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                             {p.name}
//                                         </span>
//                                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest italic opacity-70">
//                                             {p.description}
//                                         </p>
                                        
//                                         {isSelected && (
//                                             <ul className="mt-6 grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-300">
//                                                 {p.features.slice(0, 4).map((f) => (
//                                                     <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                         <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200">
//                                                             <Check className="h-3 w-3 text-school-primary" strokeWidth={4} />
//                                                         </div>
//                                                         {f}
//                                                     </li>
//                                                 ))}
//                                             </ul>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="text-right self-end md:self-start">
//                                     <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ── NAVIGATION ACTIONS (Rule 20) ── */}
//             <div className="flex items-center gap-4 pt-4">
//                 <Button 
//                     variant="outline" 
//                     onClick={prevStep} 
//                     className="h-16 w-16 md:w-20 rounded-2xl border-border bg-surface text-muted-foreground hover:bg-background hover:text-foreground transition-all shrink-0"
//                 >
//                     <ArrowLeft className="h-5 w-5" strokeWidth={3} />
//                 </Button>
                
//                 <Button 
//                     onClick={handlePaystack} 
//                     disabled={isLoading} 
//                     className={cn(
//                         "flex-1 h-16 rounded-2xl shadow-xl transition-all active:scale-95 group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
//                     )}
//                 >
//                     {isLoading ? (
//                         <Loader2 className="h-5 w-5 animate-spin mx-auto" />
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

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowLeft, Zap, Shield, 
//     Building2, Loader2, CreditCard,
//     Lock
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { toTitleCase } from '@/lib/utils/formatters';

// /**
//  * ONBOARDING PHASE 03: LICENSE PROVISIONING & FINAL DEPLOYMENT
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 12: Atomic Server Action for Hub Initialization.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem] for plan cards.
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function PaymentStep() {
//     const { 
//         plans, prevStep, adminData, schoolData, 
//         setPaymentData, setLoading, setError, 
//         isLoading, setProvisioned, setConfirmedEmail 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find(p => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const isScriptLoaded = useRef(false);

//     const activePlan = plans.find(p => p.id === selectedPlanId);

//     // Rule 11: External Gateway Script Synchronization
//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             script.onload = () => { isScriptLoaded.current = true; };
//             document.head.appendChild(script);
//         } else { isScriptLoaded.current = true; }
//     }, []);

//     const getPlanIcon = (slug: string) => {
//         if (slug.includes('enterprise')) return Building2;
//         if (slug.includes('pro')) return Shield;
//         return Zap;
//     };

//     /**
//      * TRANSACTIONAL DEPLOYMENT HUB
//      * Rule 11/12: This is the final transactional unit of the onboarding flow.
//      */
//     const handleFinalizeDeployment = useCallback(() => {
//         if (!adminData || !schoolData || !activePlan || !adminData.password) {
//             setError("Registry Context Error: Identity profile or hub data incomplete.");
//             return;
//         }
        
//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         setLoading(true);
//         setError(null);

//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { 
//                     plan: activePlan.slug, 
//                     schoolName: schoolData.schoolName,
//                     adminName: adminData.name 
//                 },
//                 callback: (response: { reference: string }) => {
//                     const executeFinalSync = async () => {
//                         try {
//                             // 1. Rule 11: Verify Gateway Truth
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment Verification Failed.");

//                             // 2. Rule 11/12: Single Atomic Transaction (Hub + Profile + Subscription)
//                             const result = await completeOnboarding(
//                                 {
//                                     ...adminData,
//                                     name: toTitleCase(adminData.name),
//                                 },
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug as PlanType
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             // 3. Update Registry State
//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
                            
//                             // 4. Rule 17: Promote to Confirmation Hub
//                             setConfirmedEmail(adminData.email);
//                             setProvisioned(true); // Triggers the Shell to show ConfirmationScreen
//                             toast.success("Institutional Hub Synchronized Successfully.");
                            
//                         } catch (err: any) { 
//                             setError(err.message || "Final synchronization protocol failed."); 
//                         } finally { 
//                             setLoading(false); 
//                         }
//                     };
//                     executeFinalSync();
//                 },
//                 onClose: () => setLoading(false),
//             });
//             handler.openIframe();
//         } catch (err) { 
//             setLoading(false); 
//             toast.error("Gateway connection breach: Hub sync aborted.");
//         }
//     }, [adminData, schoolData, currency, activePlan, setPaymentData, setLoading, setError, setProvisioned, setConfirmedEmail]);

//     if (!activePlan) return (
//         <div className="p-20 flex flex-col items-center justify-center gap-4 animate-pulse">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground italic">Initializing Licensing Hub...</p>
//         </div>
//     );

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
            
//             {/* ── HEADER (Rule 11) ── */}
//             <div className="text-center space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Finalize institutional registry capacity
//                 </p>
//             </div>

//             {/* ── CURRENCY SELECTOR (Rule 21) ── */}
//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all active:scale-95', 
//                                 currency === c 
//                                     ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-100' 
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
//                 {plans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const Icon = getPlanIcon(p.slug);
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden', 
//                                 isSelected 
//                                     ? 'bg-card border-school-primary shadow-xl scale-[1.02]' 
//                                     : 'bg-surface border-border hover:border-school-primary-200'
//                             )}
//                         >
//                             {/* Rule 21 mathematical decoration */}
//                             {isSelected && <div className="absolute top-0 right-0 w-32 h-32 bg-school-primary-50 rounded-full blur-3xl opacity-60" />}

//                             <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn(
//                                         'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-inner', 
//                                         isSelected ? 'bg-school-primary text-on-school-primary' : 'bg-card border border-border text-muted-foreground'
//                                     )}>
//                                         <Icon className="h-6 w-6" strokeWidth={2.5} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <span className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                             {p.name}
//                                         </span>
//                                         <ul className="mt-4 space-y-2">
//                                             {p.features.slice(0, 3).map((f) => (
//                                                 <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                     <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200">
//                                                         <Check className="h-3 w-3 text-school-primary" strokeWidth={4} />
//                                                     </div>
//                                                     {f}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>
//                                 <div className="text-right self-end md:self-start">
//                                     <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ── ERROR DISPLAY ── */}
//             {error && (
//                 <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold uppercase tracking-widest italic animate-in shake">
//                     Protocol Error: {error}
//                 </div>
//             )}

//             {/* ── NAVIGATION ACTIONS (Rule 20) ── */}
//             <div className="flex items-center gap-4 pt-4">
//                 <Button 
//                     variant="outline" 
//                     type="button"
//                     onClick={prevStep} 
//                     className="h-16 px-8 rounded-xl border-border bg-surface text-muted-foreground transition-all hover:bg-background shadow-sm"
//                 >
//                     <ArrowLeft className="h-5 w-5" strokeWidth={3} />
//                 </Button>
                
//                 <Button 
//                     onClick={handleFinalizeDeployment} 
//                     disabled={isLoading} 
//                     className={cn(
//                         "flex-1 h-16 rounded-xl shadow-xl transition-all active:scale-95 group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
//                     )}
//                 >
//                     {isLoading ? (
//                         <Loader2 className="h-5 w-5 animate-spin mx-auto" />
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

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowLeft, Zap, Shield, 
//     Building2, Loader2, CreditCard,
//     Lock, ShieldAlert
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { toTitleCase } from '@/lib/utils/formatters';

// /**
//  * ONBOARDING PHASE 03: LICENSE PROVISIONING & FINAL DEPLOYMENT
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 15: Resolved Error at 1720 by strict destructuring and null-checks.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 21: Scale Protocol for mathematical tints.
//  */
// export function PaymentStep() {
//     // ✅ FIX: Explicit destructuring of 'error' and 'setError' from the Hub Store
//     const { 
//         plans, prevStep, adminData, schoolData, 
//         setPaymentData, setLoading, setError, 
//         isLoading, error, setProvisioned, setConfirmedEmail 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find(p => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const isScriptLoaded = useRef(false);

//     const activePlan = plans.find(p => p.id === selectedPlanId);

//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             script.onload = () => { isScriptLoaded.current = true; };
//             document.head.appendChild(script);
//         } else { isScriptLoaded.current = true; }
//     }, []);

//     const getPlanIcon = (slug: string) => {
//         if (slug.includes('enterprise')) return Building2;
//         if (slug.includes('pro')) return Shield;
//         return Zap;
//     };

//     const handleFinalizeDeployment = useCallback(() => {
//         if (!adminData || !schoolData || !activePlan || !adminData.password) {
//             setError("Registry Context Error: Identity profile or hub data incomplete.");
//             return;
//         }
        
//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         setLoading(true);
//         setError(null);

//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { 
//                     plan: activePlan.slug, 
//                     schoolName: schoolData.schoolName,
//                     adminName: adminData.name 
//                 },
//                 callback: (response: { reference: string }) => {
//                     const executeFinalSync = async () => {
//                         try {
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment Verification Failed.");

//                             const result = await completeOnboarding(
//                                 {
//                                     ...adminData,
//                                     name: toTitleCase(adminData.name),
//                                 },
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug as PlanType
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
                            
//                             setConfirmedEmail(adminData.email);
//                             setProvisioned(true);
//                             toast.success("Institutional Hub Synchronized.");
                            
//                         } catch (err: any) { 
//                             setError(err.message || "Final synchronization protocol failed."); 
//                         } finally { 
//                             setLoading(false); 
//                         }
//                     };
//                     executeFinalSync();
//                 },
//                 onClose: () => setLoading(false),
//             });
//             handler.openIframe();
//         } catch (err) { 
//             setLoading(false); 
//             toast.error("Gateway connection breach.");
//         }
//     }, [adminData, schoolData, currency, activePlan, setPaymentData, setLoading, setError, setProvisioned, setConfirmedEmail]);

//     if (!activePlan) return <div className="p-20 text-center italic opacity-40">Synchronizing Tiers...</div>;

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
            
//             <div className="text-center space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Finalize institutional registry capacity
//                 </p>
//             </div>

//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all', 
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

//             <div className="space-y-4">
//                 {plans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const Icon = getPlanIcon(p.slug);
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden', 
//                                 isSelected 
//                                     ? 'bg-card border-school-primary shadow-xl scale-[1.02]' 
//                                     : 'bg-surface border-border hover:border-school-primary-200'
//                             )}
//                         >
//                             <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn(
//                                         'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-inner', 
//                                         isSelected ? 'bg-school-primary text-on-school-primary' : 'bg-card border border-border text-muted-foreground'
//                                     )}>
//                                         <Icon className="h-6 w-6" strokeWidth={2.5} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <span className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                             {p.name}
//                                         </span>
//                                         <ul className="mt-4 space-y-2">
//                                             {p.features.slice(0, 3).map((f) => (
//                                                 <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                     <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200">
//                                                         <Check className="h-3 w-3 text-school-primary" strokeWidth={4} />
//                                                     </div>
//                                                     {f}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>
//                                 <div className="text-right self-end md:self-start">
//                                     <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ✅ RESOLVED ERROR 1720: Using a clean conditional render for the error protocol */}
//             {typeof error === 'string' && error.length > 0 && (
//                 <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-extrabold uppercase tracking-widest italic animate-in shake duration-500">
//                     <div className="flex items-center gap-3">
//                         <ShieldAlert className="h-4 w-4 shrink-0" />
//                         <span>Protocol Breach: {error}</span>
//                     </div>
//                 </div>
//             )}

//             <div className="flex items-center gap-4 pt-4">
//                 <Button 
//                     variant="outline" 
//                     type="button"
//                     onClick={prevStep} 
//                     className="h-16 px-8 rounded-2xl border-border bg-surface text-muted-foreground transition-all hover:bg-background"
//                 >
//                     <ArrowLeft className="h-5 w-5" strokeWidth={3} />
//                 </Button>
                
//                 <Button 
//                     onClick={handleFinalizeDeployment} 
//                     disabled={isLoading} 
//                     className={cn(
//                         "flex-1 h-16 rounded-2xl shadow-xl transition-all active:scale-95 group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
//                     )}
//                 >
//                     {isLoading ? (
//                         <Loader2 className="h-5 w-5 animate-spin mx-auto" />
//                     ) : (
//                         <div className="flex items-center justify-center gap-3">
//                             <CreditCard className="h-4 w-4" />
//                             Finalize Hub Synchronization
//                         </div>
//                     )}
//                 </Button>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowLeft, Zap, Shield, 
//     Building2, Loader2, CreditCard,
//     Lock, ShieldAlert, ShieldCheck
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { toTitleCase } from '@/lib/utils/formatters';

// /**
//  * ONBOARDING PHASE 03: LICENSE PROVISIONING & FINAL DEPLOYMENT
//  * Logic Fix: Ensures DB records are only created post-payment verification.
//  * Bug 1 Fix: Prevents double payment by checking paymentStatus.
//  */
// export function PaymentStep() {
//     const { 
//         plans, prevStep, adminData, schoolData, 
//         setPaymentData, setLoading, setError, 
//         isLoading, error, setProvisioned, setConfirmedEmail,
//         paymentStatus // ✅ Added to prevent double payment
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find(p => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const isScriptLoaded = useRef(false);

//     const activePlan = plans.find(p => p.id === selectedPlanId);
//     const hasPaid = paymentStatus === 'paid';

//     // Rule: Inject Paystack Script
//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             script.onload = () => { isScriptLoaded.current = true; };
//             document.head.appendChild(script);
//         } else { isScriptLoaded.current = true; }
//     }, []);

//     const getPlanIcon = (slug: string) => {
//         if (slug.includes('enterprise')) return Building2;
//         if (slug.includes('pro')) return Shield;
//         return Zap;
//     };

//     const handleFinalizeDeployment = useCallback(() => {
//         // PREVENT DOUBLE PAYMENT: If user has already paid, block the gateway
//         if (hasPaid) {
//             toast.error("Payment already verified. Initializing secure redirect...");
//             setProvisioned(true);
//             return;
//         }

//         if (!adminData || !schoolData || !activePlan || !adminData.password) {
//             setError("Registry Context Error: Identity profile or hub data incomplete.");
//             return;
//         }
        
//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         setLoading(true);
//         setError(null);

//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { 
//                     plan: activePlan.slug, 
//                     schoolName: schoolData.schoolName,
//                     adminName: adminData.name 
//                 },
//                 callback: (response: { reference: string }) => {
//                     const executeFinalSync = async () => {
//                         try {
//                             // 1. VERIFY PAYMENT (SERVER-SIDE)
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment Verification Failed.");

//                             // 2. ONLY AFTER VERIFICATION: Populate Profile and School Tables
//                             // This ensures the DB is only touched if the money has moved.
//                             const result = await completeOnboarding(
//                                 {
//                                     ...adminData,
//                                     name: toTitleCase(adminData.name),
//                                 },
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug as PlanType
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             // 3. UPDATE STORE STATUS
//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
                            
//                             setConfirmedEmail(adminData.email);
//                             setProvisioned(true);
//                             toast.success("Institutional Hub Synchronized.");
                            
//                         } catch (err: any) { 
//                             setError(err.message || "Final synchronization protocol failed."); 
//                         } finally { 
//                             setLoading(false); 
//                         }
//                     };
//                     executeFinalSync();
//                 },
//                 onClose: () => setLoading(false),
//             });
//             handler.openIframe();
//         } catch (err) { 
//             setLoading(false); 
//             toast.error("Gateway connection breach.");
//         }
//     }, [adminData, schoolData, currency, activePlan, setPaymentData, setLoading, setError, setProvisioned, setConfirmedEmail, hasPaid]);

//     // PREVENT UI VIEW FOR PAID USERS
//     if (hasPaid) {
//         return (
//             <div className="flex flex-col items-center justify-center p-20 space-y-6 animate-pulse">
//                 <ShieldCheck className="h-16 w-16 text-emerald-500" />
//                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
//                     Transaction Active | Registry Synchronized
//                 </p>
//                 <Button onClick={() => setProvisioned(true)} className="bg-emerald-600">Continue to Dashboard</Button>
//             </div>
//         );
//     }

//     if (!activePlan) return <div className="p-20 text-center italic opacity-40">Synchronizing Tiers...</div>;

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
            
//             <div className="text-center space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Finalize institutional registry capacity
//                 </p>
//             </div>

//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button 
//                             key={c} 
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all', 
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

//             <div className="space-y-4">
//                 {plans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const Icon = getPlanIcon(p.slug);
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
                    
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden', 
//                                 isSelected 
//                                     ? 'bg-card border-school-primary shadow-xl scale-[1.02]' 
//                                     : 'bg-surface border-border hover:border-school-primary-200'
//                             )}
//                         >
//                             <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn(
//                                         'h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-inner', 
//                                         isSelected ? 'bg-school-primary text-on-school-primary' : 'bg-card border border-border text-muted-foreground'
//                                     )}>
//                                         <Icon className="h-6 w-6" strokeWidth={2.5} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <span className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                                             {p.name}
//                                         </span>
//                                         <ul className="mt-4 space-y-2">
//                                             {p.features.slice(0, 3).map((f) => (
//                                                 <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                     <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-school-primary-50 border border-school-primary-200">
//                                                         <Check className="h-3 w-3 text-school-primary" strokeWidth={4} />
//                                                     </div>
//                                                     {f}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>
//                                 <div className="text-right self-end md:self-start">
//                                     <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums">
//                                         {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                     </p>
//                                 </div>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {typeof error === 'string' && error.length > 0 && (
//                 <div className="p-5 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-extrabold uppercase tracking-widest italic animate-in shake duration-500">
//                     <div className="flex items-center gap-3">
//                         <ShieldAlert className="h-4 w-4 shrink-0" />
//                         <span>Protocol Breach: {error}</span>
//                     </div>
//                 </div>
//             )}

//             <div className="flex items-center gap-4 pt-4">
//                 <Button 
//                     variant="outline" 
//                     type="button"
//                     onClick={prevStep} 
//                     className="h-16 px-8 rounded-2xl border-border bg-surface text-muted-foreground transition-all hover:bg-background"
//                 >
//                     <ArrowLeft className="h-5 w-5" strokeWidth={3} />
//                 </Button>
                
//                 <Button 
//                     onClick={handleFinalizeDeployment} 
//                     disabled={isLoading} 
//                     className={cn(
//                         "flex-1 h-16 rounded-2xl shadow-xl transition-all active:scale-95 group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200 disabled:opacity-30"
//                     )}
//                 >
//                     {isLoading ? (
//                         <Loader2 className="h-5 w-5 animate-spin mx-auto" />
//                     ) : (
//                         <div className="flex items-center justify-center gap-3">
//                             <CreditCard className="h-4 w-4" />
//                             Finalize Hub Synchronization
//                         </div>
//                     )}
//                 </Button>
//             </div>
            
//             {/* SECURITY FOOTER */}
//             <div className="flex items-center justify-center gap-4 pt-6 opacity-30 grayscale">
//                 <div className="flex items-center gap-2">
//                     <Lock className="h-3 w-3" />
//                     <span className="text-[8px] font-bold uppercase tracking-widest">SSL 256-BIT ENCRYPTION</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Shield className="h-3 w-3" />
//                     <span className="text-[8px] font-bold uppercase tracking-widest">PCI-DSS COMPLIANT GATEWAY</span>
//                 </div>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowLeft, Loader2, CreditCard,
//     Lock, ShieldAlert, ShieldCheck, Shield, Zap, Building2
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { toTitleCase } from '@/lib/utils/formatters';

// export function PaymentStep() {
//     const { 
//         plans, prevStep, adminData, schoolData, 
//         setPaymentData, setLoading, setError, 
//         isLoading, error, setProvisioned, setConfirmedEmail,
//         paymentStatus 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         plans.find(p => p.popular)?.id || plans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const [isGateOpening, setIsGateOpening] = useState(false); // New: Local lock

//     const activePlan = plans.find(p => p.id === selectedPlanId);
//     const hasPaid = paymentStatus === 'paid';

//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             document.head.appendChild(script);
//         }
//     }, []);

//     const handleFinalizeDeployment = useCallback(() => {
//         if (hasPaid || isGateOpening || isLoading) return;

//         if (!adminData || !schoolData || !activePlan || !adminData.password) {
//             setError("Registry Context Error: Data incomplete.");
//             return;
//         }
        
//         setIsGateOpening(true); // Lock the button immediately
//         setLoading(true);

//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { 
//                     plan: activePlan.slug, 
//                     schoolName: schoolData.schoolName 
//                 },
//                 callback: (response: { reference: string }) => {
//                     const executeFinalSync = async () => {
//                         try {
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment Verification Failed.");

//                             const result = await completeOnboarding(
//                                 { ...adminData, name: toTitleCase(adminData.name) },
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug as PlanType
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             // ── CRITICAL STATE UPDATE ORDER ──
//                             // 1. Set data and verified status
//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
//                             // 2. Set confirmed email
//                             setConfirmedEmail(adminData.email);
//                             // 3. Set provisioned (This should trigger the Shell redirect)
//                             setProvisioned(true);
                            
//                             toast.success("Institutional Hub Synchronized.");
//                         } catch (err: any) { 
//                             setError(err.message || "Synchronization failed."); 
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
//         } catch (err) { 
//             setIsGateOpening(false);
//             setLoading(false); 
//             toast.error("Gateway connection breach.");
//         }
//     }, [adminData, schoolData, currency, activePlan, hasPaid, isGateOpening, isLoading]);

//     if (hasPaid) {
//         return (
//             <div className="flex flex-col items-center justify-center p-20 space-y-6 animate-in fade-in">
//                 <div className="h-20 w-20 rounded-[2rem] bg-emerald-50 flex items-center justify-center border-4 border-emerald-100 shadow-xl shadow-emerald-50">
//                     <ShieldCheck className="h-10 w-10 text-emerald-600" />
//                 </div>
//                 <div className="text-center space-y-2">
//                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">
//                         Transaction Verified
//                     </p>
//                     <p className="text-sm font-bold italic text-muted-foreground">Initializing Security Protocol...</p>
//                 </div>
//                 <Loader2 className="h-5 w-5 animate-spin text-emerald-500" />
//             </div>
//         );
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
//             <div className="text-center space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     License Tier
//                 </h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">
//                     Finalize institutional registry capacity
//                 </p>
//             </div>

//             {/* CURRENCY TOGGLE */}
//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button 
//                             key={c} 
//                             disabled={isLoading || isGateOpening}
//                             onClick={() => setCurrency(c)} 
//                             className={cn(
//                                 'px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all', 
//                                 currency === c 
//                                     ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200' 
//                                     : 'text-muted-foreground hover:text-foreground disabled:opacity-20'
//                             )}
//                         >
//                             {c === 'ngn' ? '₦ NGN' : '$ USD'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* PLANS LIST */}
//             <div className="space-y-4">
//                 {plans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
//                     return (
//                         <button
//                             key={p.id}
//                             disabled={isLoading || isGateOpening}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-6 transition-all duration-500 relative overflow-hidden', 
//                                 isSelected 
//                                     ? 'bg-card border-school-primary shadow-xl scale-[1.01]' 
//                                     : 'bg-surface border-border hover:border-school-primary-200 disabled:opacity-50'
//                             )}
//                         >
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-5">
//                                     <div className={cn(
//                                         'h-12 w-12 rounded-xl flex items-center justify-center shrink-0', 
//                                         isSelected ? 'bg-school-primary text-white' : 'bg-muted text-muted-foreground'
//                                     )}>
//                                         <Zap className="h-5 w-5" />
//                                     </div>
//                                     <div>
//                                         <p className="text-lg font-extrabold text-foreground uppercase italic tracking-tight">{p.name}</p>
//                                         <p className="text-[10px] font-bold text-muted-foreground uppercase">{p.slug}</p>
//                                     </div>
//                                 </div>
//                                 <p className="text-xl font-black italic tracking-tighter tabular-nums">
//                                     {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                 </p>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {error && (
//                 <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-black uppercase tracking-widest italic animate-bounce">
//                     {error}
//                 </div>
//             )}

//             {/* ACTION BUTTONS */}
//             <div className="flex items-center gap-4 pt-4">
//                 <Button 
//                     variant="outline" 
//                     type="button"
//                     disabled={isLoading || isGateOpening}
//                     onClick={prevStep} 
//                     className="h-16 px-8 rounded-2xl border-border bg-surface text-muted-foreground"
//                 >
//                     <ArrowLeft className="h-5 w-5" />
//                 </Button>
                
//                 <Button 
//                     onClick={handleFinalizeDeployment} 
//                     disabled={isLoading || isGateOpening || !activePlan} 
//                     className={cn(
//                         "flex-1 h-16 rounded-2xl shadow-xl transition-all group",
//                         "bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest",
//                         "hover:brightness-110 shadow-school-primary-200 disabled:opacity-40"
//                     )}
//                 >
//                     {isLoading || isGateOpening ? (
//                         <div className="flex items-center gap-3">
//                             <Loader2 className="h-4 w-4 animate-spin" />
//                             SECURE PROTOCOL ACTIVE...
//                         </div>
//                     ) : (
//                         <div className="flex items-center justify-center gap-3">
//                             <CreditCard className="h-4 w-4" />
//                             Finalize Hub Synchronization
//                         </div>
//                     )}
//                 </Button>
//             </div>
            
//             <div className="flex items-center justify-center gap-6 opacity-20 grayscale pointer-events-none">
//                 <div className="flex items-center gap-2">
//                     <Lock className="h-3 w-3" />
//                     <span className="text-[8px] font-bold uppercase tracking-widest">SSL SECURED</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                     <Shield className="h-3 w-3" />
//                     <span className="text-[8px] font-bold uppercase tracking-widest">PCI COMPLIANT</span>
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useState, useEffect, useCallback } from 'react';
// import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
// import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
// import { 
//     Check, ArrowLeft, Loader2, CreditCard,
//     Lock, ShieldAlert, ShieldCheck, Shield, Zap, Building2
// } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import { toast } from 'sonner';
// import { Button } from '@/components/ui/button';
// import { toTitleCase } from '@/lib/utils/formatters';

// export function PaymentStep({ plans: initialPlans }: { plans: any[] }) {
//     const { 
//         adminData, schoolData, setPaymentData, setLoading, 
//         setError, isLoading, error, setProvisioned, 
//         setConfirmedEmail, paymentStatus, prevStep 
//     } = useOnboardingStore();
    
//     const [selectedPlanId, setSelectedPlanId] = useState<string>(
//         initialPlans.find(p => p.popular)?.id || initialPlans[0]?.id || ""
//     );
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const [isGateOpening, setIsGateOpening] = useState(false);

//     const activePlan = initialPlans.find(p => p.id === selectedPlanId);
//     const hasPaid = paymentStatus === 'paid';

//     useEffect(() => {
//         if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.async = true;
//             document.head.appendChild(script);
//         }
//     }, []);

//     const getPlanIcon = (slug: string) => {
//         if (slug.includes('enterprise')) return Building2;
//         if (slug.includes('pro')) return Shield;
//         return Zap;
//     };

//     const handleFinalizeDeployment = useCallback(() => {
//         if (hasPaid || isGateOpening || isLoading) return;
//         if (!adminData || !schoolData || !activePlan) {
//             setError("Registry Context Error: Data incomplete.");
//             return;
//         }
        
//         setIsGateOpening(true);
//         setLoading(true);

//         const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

//         try {
//             const handler = (window as any).PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount, 
//                 currency: currency.toUpperCase(),
//                 metadata: { plan: activePlan.slug, schoolName: schoolData.schoolName },
//                 callback: (response: { reference: string }) => {
//                     const executeFinalSync = async () => {
//                         try {
//                             const verification = await verifyPaystackPayment(response.reference);
//                             if (!verification.success) throw new Error("Payment Verification Failed.");

//                             const result = await completeOnboarding(
//                                 { ...adminData, name: toTitleCase(adminData.name) },
//                                 schoolData,
//                                 response.reference,
//                                 activePlan.slug as PlanType
//                             );

//                             if (!result.success) throw new Error(result.error);

//                             setPaymentData({ 
//                                 provider: 'paystack', 
//                                 plan: activePlan.slug as PlanType, 
//                                 reference: response.reference, 
//                                 verified: true 
//                             });
//                             setConfirmedEmail(adminData.email);
//                             setProvisioned(true);
//                             toast.success("Institutional Hub Synchronized.");
//                         } catch (err: any) { 
//                             setError(err.message || "Synchronization failed."); 
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
//         } catch (err) { 
//             setIsGateOpening(false);
//             setLoading(false); 
//             toast.error("Gateway connection breach.");
//         }
//     }, [adminData, schoolData, currency, activePlan, hasPaid, isGateOpening, isLoading]);

//     if (hasPaid) {
//         return (
//             <div className="flex flex-col items-center justify-center p-20 space-y-6">
//                 <ShieldCheck className="h-16 w-16 text-emerald-500 animate-bounce" />
//                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Verified. Dispatching Registry...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-right-6 duration-700 space-y-10">
//             {/* ... Header ... */}
//             <div className="text-center space-y-2">
//                 <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">License Tier</h1>
//                 <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest opacity-70">Finalize registry capacity</p>
//             </div>

//             {/* CURRENCY TOGGLE */}
//             <div className="flex justify-center">
//                 <div className="flex bg-surface border border-border rounded-2xl p-1.5 gap-1.5 shadow-inner">
//                     {(['ngn', 'usd'] as const).map((c) => (
//                         <button key={c} onClick={() => setCurrency(c)} className={cn('px-6 py-2.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest transition-all', currency === c ? 'bg-school-primary text-on-school-primary shadow-lg shadow-school-primary-200' : 'text-muted-foreground')}>
//                             {c === 'ngn' ? '₦ NGN' : '$ USD'}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* PLANS LIST */}
//             <div className="space-y-4">
//                 {initialPlans.map((p) => {
//                     const isSelected = selectedPlanId === p.id;
//                     const Icon = getPlanIcon(p.slug);
//                     const price = currency === 'ngn' ? p.priceNGN : p.priceUSD;
//                     return (
//                         <button
//                             key={p.id}
//                             onClick={() => setSelectedPlanId(p.id)}
//                             className={cn(
//                                 'w-full text-left rounded-[2rem] border-2 p-6 md:p-8 transition-all duration-500 group relative overflow-hidden', 
//                                 isSelected ? 'bg-card border-school-primary shadow-xl scale-[1.01]' : 'bg-surface border-border hover:border-school-primary-200'
//                             )}
//                         >
//                             <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
//                                 <div className="flex items-start gap-6">
//                                     <div className={cn('h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 transition-all shadow-inner', isSelected ? 'bg-school-primary text-white' : 'bg-card border border-border text-muted-foreground')}>
//                                         <Icon className="h-6 w-6" strokeWidth={2.5} />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <span className="text-xl font-extrabold text-foreground uppercase italic tracking-tighter">{p.name}</span>
//                                         {/* FEATURES RE-ADDED HERE */}
//                                         <ul className="mt-4 space-y-2">
//                                             {p.features?.map((f: string) => (
//                                                 <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
//                                                     <Check className="h-3 w-3 text-school-primary stroke-[4]" />
//                                                     {f}
//                                                 </li>
//                                             ))}
//                                         </ul>
//                                     </div>
//                                 </div>
//                                 <p className="text-2xl font-extrabold text-foreground italic tracking-tighter tabular-nums">
//                                     {currency === 'ngn' ? '₦' : '$'}{price.toLocaleString()}
//                                 </p>
//                             </div>
//                         </button>
//                     );
//                 })}
//             </div>

//             {/* ACTION BUTTONS */}
//             <div className="flex items-center gap-4 pt-4">
//                 <Button variant="outline" onClick={prevStep} className="h-16 px-8 rounded-2xl border-border bg-surface text-muted-foreground"><ArrowLeft className="h-5 w-5" /></Button>
//                 <Button onClick={handleFinalizeDeployment} disabled={isLoading || isGateOpening} className="flex-1 h-16 rounded-2xl bg-school-primary text-on-school-primary font-extrabold text-[11px] uppercase tracking-widest shadow-xl shadow-school-primary-200 active:scale-95">
//                     {isLoading || isGateOpening ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : "Finalize Hub Synchronization"}
//                 </Button>
//             </div>
//         </div>
//     );
// }


'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useOnboardingStore, type PlanType } from '@/store/onboardingStore';
import { completeOnboarding, verifyPaystackPayment } from '@/app/actions/onboarding';
import { 
    Check, ArrowLeft, Loader2, CreditCard,
    ShieldCheck, Shield, Zap, Building2, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { toTitleCase } from '@/lib/utils/formatters';

export function PaymentStep({ plans: initialPlans }: { plans: any[] }) {
    const { 
        adminData, schoolData, setPaymentData, setLoading, 
        setError, isLoading, error, setProvisioned, 
        setConfirmedEmail, paymentStatus, prevStep 
    } = useOnboardingStore();
    
    const [selectedPlanId, setSelectedPlanId] = useState<string>(
        initialPlans.find(p => p.popular)?.id || initialPlans[0]?.id || ""
    );
    const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
    const [isGateOpening, setIsGateOpening] = useState(false);

    const activePlan = initialPlans.find(p => p.id === selectedPlanId);
    const hasPaid = paymentStatus === 'paid';

    useEffect(() => {
        if (typeof window !== 'undefined' && !(window as any).PaystackPop) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true;
            document.head.appendChild(script);
        }
    }, []);

    const handleFinalizeDeployment = useCallback(() => {
        if (hasPaid || isGateOpening || isLoading) return;
        
        setIsGateOpening(true);
        setLoading(true);

        const amount = currency === 'ngn' ? activePlan.priceKobo : activePlan.priceUSD * 100;

        try {
            const handler = (window as any).PaystackPop.setup({
                key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
                email: adminData.email,
                amount: amount, 
                currency: currency.toUpperCase(),
                metadata: { plan: activePlan.slug, schoolName: schoolData.schoolName },
                callback: (response: { reference: string }) => {
                    const executeFinalSync = async () => {
                        try {
                            const verification = await verifyPaystackPayment(response.reference);
                            if (!verification.success) throw new Error("Payment Verification Failed.");

                            const result = await completeOnboarding(
                                { ...adminData, password: adminData.password },
                                schoolData,
                                response.reference,
                                activePlan.slug as PlanType
                            );

                            if (!result.success) throw new Error(result.error);

                            // UPDATE STORE STATUS (Triggers Redirect)
                            setPaymentData({ 
                                provider: 'paystack', 
                                plan: activePlan.slug as PlanType, 
                                reference: response.reference, 
                                verified: true 
                            });
                            setConfirmedEmail(adminData.email);
                            setProvisioned(true);
                            toast.success("Institutional Hub Synchronized.");
                        } catch (err: any) { 
                            setError(err.message || "Synchronization failed."); 
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
        } catch (err) { 
            setIsGateOpening(false);
            setLoading(false); 
        }
    }, [adminData, schoolData, currency, activePlan, hasPaid, isGateOpening, isLoading]);

    if (hasPaid) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto" /></div>;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-6 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-extrabold uppercase italic">License Tier</h1>
                <p className="text-muted-foreground text-[10px] font-bold uppercase">Choose your registry capacity</p>
            </div>

            <div className="space-y-4">
                {initialPlans.map((p) => (
                    <button
                        key={p.id}
                        onClick={() => setSelectedPlanId(p.id)}
                        className={cn(
                            "w-full text-left rounded-[2rem] border-2 p-8 transition-all",
                            selectedPlanId === p.id ? "border-school-primary bg-card shadow-xl" : "border-border bg-surface"
                        )}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xl font-extrabold uppercase italic">{p.name}</p>
                                <ul className="mt-4 space-y-2">
                                    {p.features?.map((f: string) => (
                                        <li key={f} className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase">
                                            <Check className="h-3 w-3 text-school-primary stroke-[4]" /> {f}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <p className="text-2xl font-black italic">
                                {currency === 'ngn' ? '₦' : '$'}{(currency === 'ngn' ? p.priceNGN : p.priceUSD).toLocaleString()}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex gap-4">
                <Button variant="outline" onClick={prevStep} className="h-16 px-8 rounded-2xl"><ArrowLeft /></Button>
                <Button 
                    onClick={handleFinalizeDeployment} 
                    disabled={isLoading || isGateOpening} 
                    className="flex-1 h-16 rounded-2xl bg-school-primary font-bold uppercase"
                >
                    {isLoading || isGateOpening ? <Loader2 className="animate-spin" /> : "Finalize Hub Sync"}
                </Button>
            </div>
        </div>
    );
}