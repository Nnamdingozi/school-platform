// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore, PlanType, PaymentProvider } from '@/store/onboardingStore';
// import { verifyPaystackPayment, verifyStripePayment } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { Check, ArrowRight, ArrowLeft, Zap, Shield, Building2, CreditCard } from 'lucide-react';
// import { cn } from '@/lib/utils';

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

// declare global {
//     interface Window {
//         PaystackPop: any;
//     }
// }

// export function PaymentStep() {
//     const { nextStep, prevStep, adminData, setPaymentData, setLoading, setError, isLoading, error } = useOnboardingStore();
//     const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
//     const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');

//     const plan = PLANS.find(p => p.id === selectedPlan)!;
//     const amount = plan.price[currency];

//     async function handlePaystack() {
//         if (!adminData) return;
//         setLoading(true);
//         setError(null);
    
//         const initPaystack = () => {
//             const handler = window.PaystackPop.setup({
//                 key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//                 email: adminData.email,
//                 amount: amount * 100,
//                 currency: currency.toUpperCase(),
//                 metadata: { plan: selectedPlan, name: adminData.name },
//             callback: async (response: { reference: string }) => {
//     try {
//         const result = await verifyPaystackPayment(response.reference);
//         setLoading(false);
//         if (!result.success) {
//             setError(result.error ?? 'Verification failed.');
//             return;
//         }
//         setPaymentData({
//             provider: 'paystack',
//             plan: selectedPlan,
//             reference: response.reference,
//             verified: true,
//         });
//         nextStep();
//     } catch (err) {
//         setLoading(false);
//         setError('Payment verification failed unexpectedly.');
//         console.error(err);
//     }
// },
//                 onClose: () => {
//                     setLoading(false);
//                     toast.info('Payment cancelled.');
//                 },
//             });
//             handler.openIframe();
//         };
    
//         // ✅ Check if Paystack is already loaded
//         if (window.PaystackPop) {
//             initPaystack();
//             return;
//         }
    
//         // ✅ Check if script tag already exists
//         const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
//         if (existingScript) {
//             existingScript.addEventListener('load', initPaystack);
//             return;
//         }
    
//         const script = document.createElement('script');
//         script.src = 'https://js.paystack.co/v1/inline.js';
//         script.onload = initPaystack;
//         script.onerror = () => {
//             setLoading(false);
//             setError('Failed to load Paystack. Check your internet connection.');
//         };
//         document.head.appendChild(script);
//     }

//     async function handleStripe() {
//         if (!adminData) return;
//         setLoading(true);
//         setError(null);

//         try {
//             // Create Stripe checkout session via your API route
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
//             if (url) {
//                 window.location.href = url; // Redirect to Stripe hosted page
//             }
//         } catch {
//             setError('Failed to initiate Stripe checkout.');
//             setLoading(false);
//         }
//     }

//     function handlePay() {
//         console.log('handlePay called');
//         console.log('adminData:', adminData);
//         console.log('selectedPlan:', selectedPlan);
//         console.log('amount:', amount);
//         console.log('currency:', currency);
//         console.log('PaystackPop available:', !!window.PaystackPop);
//         console.log('Paystack key:', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
    
//         if (selectedProvider === 'paystack') handlePaystack();
//         else handleStripe();
//     }

//     return (
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
//                                 "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200",
//                                 currency === c
//                                     ? "bg-school-primary text-school-secondary-950"
//                                     : "text-school-secondary-100/50 hover:text-school-secondary-100"
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
//                                 "w-full text-left rounded-xl border-2 p-4 transition-all duration-200",
//                                 isSelected
//                                     ? "border-school-primary bg-school-primary/5"
//                                     : "border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-600",
//                                 p.highlight && !isSelected && "border-school-primary/30"
//                             )}
//                         >
//                             <div className="flex items-start justify-between gap-3">
//                                 <div className="flex items-start gap-3 min-w-0">
//                                     <div className={cn(
//                                         "h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
//                                         isSelected ? "bg-school-primary text-school-secondary-950" : "bg-school-secondary-700 text-school-secondary-100/50"
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

//                                         {/* Features - show when selected */}
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
//                                 "rounded-xl border-2 p-3 text-left transition-all duration-200",
//                                 selectedProvider === provider.id
//                                     ? "border-school-primary bg-school-primary/5"
//                                     : "border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-600"
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

//             {/* Summary + CTA */}
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

//             <div className="flex gap-3">
//                 <Button
//                     type="button"
//                     variant="outline"
//                     onClick={prevStep}
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

// import { useState } from 'react';
// import { useOnboardingStore, PlanType, PaymentProvider } from '@/store/onboardingStore';
// import { verifyPaystackPayment } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { Check, ArrowRight, ArrowLeft, Zap, Shield, Building2, CreditCard } from 'lucide-react';
// import { cn } from '@/lib/utils';

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

// declare global {
//     interface Window {
//         PaystackPop: any;
//     }
// }

// export function PaymentStep() {
//     const { nextStep, prevStep, adminData, setPaymentData, setLoading, setError, isLoading, error } = useOnboardingStore();
//     const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
//     const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');

//     const plan = PLANS.find(p => p.id === selectedPlan)!;
//     const amount = plan.price[currency];

//     // ─── Paystack ─────────────────────────────────────────────────────────────

//     // Separated so it can be called both from onload and from direct click
//     const initPaystack = () => {
//         if (!window.PaystackPop) {
//             setLoading(false);
//             setError('Paystack failed to initialize. Please refresh and try again.');
//             return;
//         }

//         const handler = window.PaystackPop.setup({
//             key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//             email: adminData!.email,
//             amount: amount * 100, // kobo
//             currency: currency.toUpperCase(),
//             metadata: { plan: selectedPlan, name: adminData!.name },
//             callback: async (response: { reference: string }) => {
//                 try {
//                     const result = await verifyPaystackPayment(response.reference);
//                     setLoading(false);
//                     if (!result.success) {
//                         setError(result.error ?? 'Verification failed.');
//                         toast.error(result.error);
//                         return;
//                     }
//                     setPaymentData({
//                         provider: 'paystack',
//                         plan: selectedPlan,
//                         reference: response.reference,
//                         verified: true,
//                     });
//                     toast.success('Payment confirmed!');
//                     nextStep();
//                 } catch (err) {
//                     setLoading(false);
//                     setError('Payment verification failed unexpectedly.');
//                     console.error(err);
//                 }
//             },
//             onClose: () => {
//                 setLoading(false);
//                 toast.info('Payment cancelled.');
//             },
//         });

//         handler.openIframe();
//     };

//     // Not async — openIframe must be in same sync call stack as user click
//     function handlePaystack() {

//         console.log('adminData:', adminData);
//                 console.log('selectedPlan:', selectedPlan);
//                 console.log('amount:', amount);
//                 console.log('currency:', currency);
//                 console.log('PaystackPop available:', !!window.PaystackPop);
//                 console.log('Paystack key:', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);
//         if (!adminData) return;
//         setLoading(true);
//         setError(null);

//         // Already loaded from a previous attempt
//         if (window.PaystackPop) {
//             initPaystack();
//             return;
//         }

//         // Script tag exists but may still be loading
//         const existingScript = document.querySelector(
//             'script[src="https://js.paystack.co/v1/inline.js"]'
//         );
//         if (existingScript) {
//             existingScript.addEventListener('load', initPaystack);
//             return;
//         }

//         // First time — inject script tag
//         const script = document.createElement('script');
//         script.src = 'https://js.paystack.co/v1/inline.js';
//         script.onload = initPaystack;
//         script.onerror = () => {
//             setLoading(false);
//             setError('Failed to load Paystack. Check your internet connection.');
//         };
//         document.head.appendChild(script);
//     }

//     // ─── Stripe ───────────────────────────────────────────────────────────────

//     async function handleStripe() {
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
//         if (selectedProvider === 'paystack') handlePaystack();
//         else handleStripe();
//     }

//     // ─── Render ───────────────────────────────────────────────────────────────

//     return (
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


// src/components/PaymentStep.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useOnboardingStore, PlanType, PaymentProvider } from '@/store/onboardingStore';
// import { verifyPaystackPayment } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { Check, ArrowRight, ArrowLeft, Zap, Shield, Building2, CreditCard } from 'lucide-react';
// import { cn } from '@/lib/utils';

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

// declare global {
//     interface Window {
//         PaystackPop: any;
//     }
// }

// export function PaymentStep() {
//     const { nextStep, prevStep, adminData, setPaymentData, setLoading, setError, isLoading, error } = useOnboardingStore();
//     const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
//     const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const [paystackLoaded, setPaystackLoaded] = useState(false); // Track if Paystack is loaded

//     const plan = PLANS.find(p => p.id === selectedPlan)!;
//     const amount = plan.price[currency];

//     // ─── Paystack ─────────────────────────────────────────────────────────────

//     const initPaystack = () => {
//         if (!window.PaystackPop) {
//             setLoading(false);
//             setError('Paystack failed to initialize. Please refresh and try again.');
//             return;
//         }

//         const handler = window.PaystackPop.setup({
//             key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//             email: adminData!.email,
//             amount: amount * 100, // kobo
//             currency: currency.toUpperCase(),
//             metadata: { plan: selectedPlan, name: adminData!.name },
//             callback: async (response: { reference: string }) => {
//                 try {
//                     const result = await verifyPaystackPayment(response.reference);
//                     setLoading(false);
//                     if (!result.success) {
//                         setError(result.error ?? 'Verification failed.');
//                         toast.error(result.error);
//                         return;
//                     }
//                     setPaymentData({
//                         provider: 'paystack',
//                         plan: selectedPlan,
//                         reference: response.reference,
//                         verified: true,
//                     });
//                     toast.success('Payment confirmed!');
//                     nextStep();
//                 } catch (err) {
//                     setLoading(false);
//                     setError('Payment verification failed unexpectedly.');
//                     console.error(err);
//                 }
//             },
//             onClose: () => {
//                 setLoading(false);
//                 toast.info('Payment cancelled.');
//             },
//         });

//         handler.openIframe();
//     };

//     // Load Paystack script on component mount
//     useEffect(() => {
//         if (!window.PaystackPop) {
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.onload = () => {
//                 setPaystackLoaded(true); // Mark Paystack as loaded
//             };
//             script.onerror = () => {
//                 setLoading(false);
//                 setError('Failed to load Paystack. Check your internet connection.');
//             };
//             document.head.appendChild(script);
//         }
//         return () => {
//             // Clean up the event listener when the component unmounts
//             const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
//             if (existingScript) {
//                 existingScript.removeEventListener('load', initPaystack);
//             }
//         }
//     }, []);

//     function handlePaystack() {
//         console.log('adminData:', adminData);
//         console.log('selectedPlan:', selectedPlan);
//         console.log('amount:', amount);
//         console.log('currency:', currency);
//         console.log('PaystackPop available:', !!window.PaystackPop);
//         console.log('Paystack key:', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

//         if (!adminData) return;
//         setLoading(true);
//         setError(null);

//         if (paystackLoaded) {
//             initPaystack();
//         } else {
//             // Handle the case where Paystack hasn't loaded yet (shouldn't happen if useEffect is working)
//             setError('Paystack is still loading. Please wait.');
//             setLoading(false);
//             // Alternatively, you could disable the button and show a loading indicator
//         }
//     }

//     // ─── Stripe ───────────────────────────────────────────────────────────────

//     async function handleStripe() {
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



// // src/components/PaymentStep.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useOnboardingStore, PlanType, PaymentProvider, OnboardingAdminData, OnboardingPaymentData } from '@/store/onboardingStore';
// import { verifyPaystackPayment } from '@/app/actions/onboarding';
// import { Button } from '@/components/ui/button';
// import { toast } from 'sonner';
// import { Check, ArrowRight, ArrowLeft, Zap, Shield, Building2, CreditCard } from 'lucide-react';
// import { cn } from '@/lib/utils';

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

// declare global {
//     interface Window {
//         PaystackPop: any;
//     }
// }

// export function PaymentStep() {
//     const { nextStep, prevStep, adminData, setPaymentData, setLoading, setError, isLoading, error } = useOnboardingStore();
//     const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
//     const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
//     const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');
//     const [paystackLoaded, setPaystackLoaded] = useState(false); // Track if Paystack is loaded

//     const plan = PLANS.find(p => p.id === selectedPlan)!;
//     const amount = plan.price[currency];

//     // ─── Paystack ─────────────────────────────────────────────────────────────

//     const initPaystack = () => {
//         if (!window.PaystackPop) {
//             setLoading(false);
//             setError('Paystack failed to initialize. Please refresh and try again.');
//             console.log('PaystackPop failed to initialize');
//             return;
//         }
//          console.log('adminData inside initPaystack:', adminData);
//         const handler = window.PaystackPop.setup({
//             key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
//             email: adminData!.email,
//             amount: amount * 100, // kobo
//             currency: currency.toUpperCase(),
//             metadata: { plan: selectedPlan, name: adminData!.name },
//             callback: async (response: { reference: string }) => {
//                 console.log('Paystack callback triggered:', response);
//                 try {
//                     const result = await verifyPaystackPayment(response.reference);
//                     setLoading(false);
//                     if (!result.success) {
//                         setError(result.error ?? 'Verification failed.');
//                         toast.error(result.error);
//                         return;
//                     }
//                     setPaymentData({
//                         provider: 'paystack',
//                         plan: selectedPlan,
//                         reference: response.reference,
//                         verified: true,
//                     });
//                     toast.success('Payment confirmed!');
//                     nextStep();
//                 } catch (err) {
//                     setLoading(false);
//                     setError('Payment verification failed unexpectedly.');
//                     console.error('Paystack callback error:', err);
//                 }
//             },
//             onClose: () => {
//                 setLoading(false);
//                 toast.info('Payment cancelled.');
//             },
//         });

//         console.log('PaystackPop about to openIframe');
//         handler.openIframe();
//         console.log('PaystackPop opened');
//     };

//     // Load Paystack script on component mount
//     useEffect(() => {
//         if (!window.PaystackPop) {
//             console.log("Paystack script loading...")
//             const script = document.createElement('script');
//             script.src = 'https://js.paystack.co/v1/inline.js';
//             script.onload = () => {
//                 console.log("Paystack script loaded");
//                 setPaystackLoaded(true); // Mark Paystack as loaded
//             };
//             script.onerror = () => {
//                 setLoading(false);
//                 setError('Failed to load Paystack. Check your internet connection.');
//                 console.error("Failed to load paystack");
//             };
//             document.head.appendChild(script);
//         }
//         return () => {
//             // Clean up the event listener when the component unmounts
//             const existingScript = document.querySelector('script[src="https://js.paystack.co/v1/inline.js"]');
//             if (existingScript) {
//                 console.log("Paystack cleanup");
//                 existingScript.removeEventListener('load', initPaystack);
//             }
//         }
//     }, []);

//     function handlePaystack() {
//         console.log('adminData inside handlePaystack:', adminData);
//         console.log('selectedPlan:', selectedPlan);
//         console.log('amount:', amount);
//         console.log('currency:', currency);
//         console.log('PaystackPop available:', !!window.PaystackPop);
//         console.log('Paystack key:', process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY);

//         if (!adminData) {
//             console.log("No admin data available");
//             return;
//         }
//         setLoading(true);
//         setError(null);

//         if (paystackLoaded) {
//             console.log("initPaystack called from handlePaystack");
//             initPaystack();
//         } else {
//             console.log("Paystack script still loading");
//             setError('Paystack is still loading. Please wait.');
//             setLoading(false);
//         }
//     }

//     // ─── Stripe ───────────────────────────────────────────────────────────────

//     async function handleStripe() {
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

// src/components/PaymentStep.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useOnboardingStore, PlanType, PaymentProvider } from '@/store/onboardingStore';
import { verifyPaystackPayment } from '@/app/actions/onboarding';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Check, ArrowRight, ArrowLeft, Zap, Shield, Building2, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

// ... (PLANS and PAYMENT_PROVIDERS remain the same) ...
const PLANS = [
    {
        id: 'starter' as PlanType,
        name: 'Starter',
        price: { ngn: 25000, usd: 29 },
        icon: Zap,
        description: 'Perfect for small schools getting started.',
        features: [
            'Up to 5 teachers',
            'Up to 150 students',
            '100 WhatsApp credits/month',
            'AI Lesson Planner',
            'Basic analytics',
        ],
        highlight: false,
    },
    {
        id: 'pro' as PlanType,
        name: 'Pro',
        price: { ngn: 65000, usd: 79 },
        icon: Shield,
        description: 'For growing schools with advanced needs.',
        features: [
            'Up to 20 teachers',
            'Up to 600 students',
            '500 WhatsApp credits/month',
            'AI Lesson Planner + Quiz Generator',
            'Advanced analytics & reports',
            'Priority support',
        ],
        highlight: true,
    },
    {
        id: 'enterprise' as PlanType,
        name: 'Enterprise',
        price: { ngn: 150000, usd: 179 },
        icon: Building2,
        description: 'For large institutions at scale.',
        features: [
            'Unlimited teachers & students',
            '2000 WhatsApp credits/month',
            'Full AI suite',
            'Custom branding',
            'Dedicated support',
            'SLA guarantee',
        ],
        highlight: false,
    },
];

const PAYMENT_PROVIDERS = [
    {
        id: 'paystack' as PaymentProvider,
        name: 'Paystack',
        description: 'Pay with card, bank transfer, USSD (Nigeria)',
        logo: '🟢',
        recommended: true,
    },
    {
        id: 'stripe' as PaymentProvider,
        name: 'Stripe',
        description: 'Pay with card, Apple Pay, Google Pay',
        logo: '🔵',
        recommended: false,
    },
];

interface PaystackResponse {
    reference: string;
    status?: string;
    message?: string;
}

interface PaystackOptions {
    key: string | undefined;
    email: string;
    amount: number;
    currency: string;
    metadata: Record<string, unknown>;
    callback: (response: PaystackResponse) => void;
    onClose: () => void;
}

interface PaystackPop {
    setup(options: PaystackOptions): {
        openIframe(): void;
    };
}

declare global {
    interface Window {
        PaystackPop: PaystackPop; // ✅ Use the interface instead of 'any'
    }
}


export function PaymentStep() {
    const { nextStep, prevStep, adminData, setPaymentData, setLoading, setError, isLoading, error } = useOnboardingStore();
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('pro');
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paystack');
    const [currency, setCurrency] = useState<'ngn' | 'usd'>('ngn');

    // Use a ref to track if script is loaded to avoid re-renders just for this flag
    const isScriptLoaded = useRef(false);

    const plan = PLANS.find(p => p.id === selectedPlan)!;
    const amount = plan.price[currency];

    // Load Paystack script on component mount
    useEffect(() => {
        if (typeof window !== 'undefined' && !window.PaystackPop) {
            const script = document.createElement('script');
            script.src = 'https://js.paystack.co/v1/inline.js';
            script.async = true; // Use async loading
            script.onload = () => {
                isScriptLoaded.current = true;
            };
            script.onerror = () => {
                setError('Failed to load Paystack. Check your internet connection.');
            };
            document.head.appendChild(script);
        } else if (window.PaystackPop) {
             isScriptLoaded.current = true;
        }
    }, [setError]);

    // Use useCallback to prevent unnecessary recreation of the function
   // Use useCallback to prevent unnecessary recreation of the function
   // ✅ FIX 2: Correct types in the handlePaystack function
const handlePaystack = useCallback(() => {
    if (!adminData) {
        setError("Missing admin data required for payment.");
        return;
    }

    if (!isScriptLoaded.current || !window.PaystackPop) {
        setError('Payment gateway is still loading. Please try again in a moment.');
        return;
    }

    setLoading(true);
    setError(null);

    try {
        const handler = window.PaystackPop.setup({
            key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
            email: adminData.email,
            amount: amount * 100, 
            currency: currency.toUpperCase(),
            metadata: { 
                plan: selectedPlan, 
                name: adminData.name 
            },
            callback: function(response: PaystackResponse) { // ✅ Use typed response
                const processPayment = async () => {
                    try {
                        const result = await verifyPaystackPayment(response.reference);
                        if (!result.success) {
                            setLoading(false);
                            setError(result.error ?? 'Verification failed on our servers.');
                            toast.error(result.error);
                            return;
                        }
                        
                        setPaymentData({
                            provider: 'paystack',
                            plan: selectedPlan,
                            reference: response.reference,
                            verified: true,
                        });
                        
                        toast.success('Payment confirmed!');
                        setLoading(false); 
                        nextStep();
                    } catch (err: unknown) { // ✅ Use unknown instead of any
                        setLoading(false);
                        const msg = typeof err === 'string' ? err : 'Verification failed.';
                        setError(msg);
                    }
                };
                processPayment();
            },
            onClose: function() {
                setLoading(false);
                toast.info('Payment window closed.');
            },
        });

        handler.openIframe();
        
    } catch (err: unknown) { // ✅ Use unknown instead of any
        setLoading(false);
        setError("Failed to initialize payment gateway.");
        console.error("Paystack initialization error:", err);
    }
}, [adminData, amount, currency, selectedPlan, setPaymentData, nextStep, setLoading, setError]);
    // ─── Stripe ───────────────────────────────────────────────────────────────
    // ... (Your Stripe logic remains the same) ...
     async function handleStripe() {
        if (!adminData) return;
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/stripe/create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    plan: selectedPlan,
                    email: adminData.email,
                    currency,
                    successUrl: `${window.location.origin}/onboarding?step=3&session_id={CHECKOUT_SESSION_ID}`,
                    cancelUrl: `${window.location.origin}/onboarding?step=2`,
                }),
            });
            const { url } = await res.json();
            if (url) window.location.href = url;
        } catch {
            setError('Failed to initiate Stripe checkout.');
            setLoading(false);
        }
    }


    // ─── Dispatcher ───────────────────────────────────────────────────────────
    function handlePay() {
        if (selectedProvider === 'paystack') {
            handlePaystack();
        } else {
            handleStripe();
        }
    }

    // ─── Render ───────────────────────────────────────────────────────────────
    return (
       // ... (Your JSX remains EXACTLY the same) ...
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
                    Choose your plan
                </h1>
                <p className="text-school-secondary-100/50 mt-2 text-sm">
                    All plans include a 14-day free trial. Cancel anytime.
                </p>
            </div>

            {/* Currency toggle */}
            <div className="flex items-center justify-center mb-6">
                <div className="flex bg-school-secondary-800 rounded-full p-1 gap-1">
                    {(['ngn', 'usd'] as const).map((c) => (
                        <button
                            key={c}
                            onClick={() => setCurrency(c)}
                            className={cn(
                                'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200',
                                currency === c
                                    ? 'bg-school-primary text-school-secondary-950'
                                    : 'text-school-secondary-100/50 hover:text-school-secondary-100'
                            )}
                        >
                            {c === 'ngn' ? '₦ NGN' : '$ USD'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plans */}
            <div className="space-y-3 mb-6">
                {PLANS.map((p) => {
                    const Icon = p.icon;
                    const isSelected = selectedPlan === p.id;
                    return (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPlan(p.id)}
                            className={cn(
                                'w-full text-left rounded-xl border-2 p-4 transition-all duration-200',
                                isSelected
                                    ? 'border-school-primary bg-school-primary/5'
                                    : 'border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-600',
                                p.highlight && !isSelected && 'border-school-primary/30'
                            )}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-start gap-3 min-w-0">
                                    <div className={cn(
                                        'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5',
                                        isSelected
                                            ? 'bg-school-primary text-school-secondary-950'
                                            : 'bg-school-secondary-700 text-school-secondary-100/50'
                                    )}>
                                        <Icon className="h-4 w-4" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="font-bold text-school-secondary-100">{p.name}</span>
                                            {p.highlight && (
                                                <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-school-primary text-school-secondary-950">
                                                    Most Popular
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-school-secondary-100/40 mt-0.5">{p.description}</p>
                                        {isSelected && (
                                            <ul className="mt-3 space-y-1.5">
                                                {p.features.map((f) => (
                                                    <li key={f} className="flex items-center gap-2 text-xs text-school-secondary-100/70">
                                                        <Check className="h-3 w-3 text-school-primary shrink-0" />
                                                        {f}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right shrink-0">
                                    <p className="font-black text-school-secondary-100 text-lg">
                                        {currency === 'ngn' ? '₦' : '$'}{p.price[currency].toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-school-secondary-100/30">/month</p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Payment provider */}
            <div className="mb-6">
                <p className="text-xs uppercase tracking-wider font-semibold text-school-secondary-100/50 mb-3">
                    Pay with
                </p>
                <div className="grid grid-cols-2 gap-3">
                    {PAYMENT_PROVIDERS.map((provider) => (
                        <button
                            key={provider.id}
                            onClick={() => setSelectedProvider(provider.id)}
                            className={cn(
                                'rounded-xl border-2 p-3 text-left transition-all duration-200',
                                selectedProvider === provider.id
                                    ? 'border-school-primary bg-school-primary/5'
                                    : 'border-school-secondary-700 bg-school-secondary-800 hover:border-school-secondary-600'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{provider.logo}</span>
                                <span className="font-bold text-school-secondary-100 text-sm">{provider.name}</span>
                                {provider.recommended && (
                                    <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-school-primary/20 text-school-primary">
                                        Rec.
                                    </span>
                                )}
                            </div>
                            <p className="text-[10px] text-school-secondary-100/40 leading-tight">
                                {provider.description}
                            </p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Error */}
            {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-4">
                    {error}
                </div>
            )}

            {/* Summary */}
            <div className="bg-school-secondary-800 rounded-xl p-4 mb-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-school-secondary-100/60">
                        {plan.name} plan · {currency.toUpperCase()}
                    </span>
                    <span className="font-black text-school-secondary-100 text-base">
                        {currency === 'ngn' ? '₦' : '$'}{amount.toLocaleString()}/mo
                    </span>
                </div>
                <p className="text-[10px] text-school-secondary-100/30 mt-1">
                    You will not be charged until your 14-day trial ends.
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
                <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                    className="border-school-secondary-700 text-school-secondary-100/60 hover:text-school-secondary-100 hover:bg-school-secondary-800"
                >
                    <ArrowLeft className="h-4 w-4" />
                </Button>

                <Button
                    onClick={handlePay}
                    disabled={isLoading}
                    className="flex-1 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 hover:scale-[1.01]"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 border-2 border-school-secondary-950/30 border-t-school-secondary-950 rounded-full animate-spin" />
                            Processing...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Pay with {selectedProvider === 'paystack' ? 'Paystack' : 'Stripe'}
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    )}
                </Button>
            </div>
        </div>
    );
}



