// // 'use client'

// // import { useState } from 'react'
// // import { useRouter } from 'next/navigation'
// // import { useProfileStore } from '@/store/profileStore'
// // import {
// //     CREDIT_PACKAGES,
// //     initiateCreditsPayment,
// //     CreditPackage,
// // } from '@/app/actions/credits.actions'
// // import {
// //     ShoppingCart, Zap, CheckCircle2,
// //     Loader2, Star, MessageCircle,
// //     ArrowRight, Shield, TrendingUp,
// // } from 'lucide-react'
// // import { Card, CardContent } from '@/components/ui/card'
// // import { toast } from 'sonner'

// // // ── Package card ───────────────────────────────────────────────────────────────
// // function PackageCard({
// //     pkg,
// //     onSelect,
// //     loading,
// //     selected,
// // }: {
// //     pkg:      CreditPackage
// //     onSelect: (id: string) => void
// //     loading:  boolean
// //     selected: string | null
// // }) {
// //     const isSelected = selected === pkg.id
// //     const isLoading  = isSelected && loading

// //     return (
// //         <div className={`relative rounded-2xl border p-5 transition-all cursor-pointer ${
// //             pkg.popular
// //                 ? 'border-school-primary bg-school-primary/5'
// //                 : 'border-school-secondary-700 bg-school-secondary-900 hover:border-school-secondary-600'
// //         }`}>

// //             {/* Popular badge */}
// //             {pkg.popular && (
// //                 <div className="absolute -top-3 left-1/2 -translate-x-1/2">
// //                     <span className="inline-flex items-center gap-1 rounded-full bg-school-primary px-3 py-1 text-[10px] font-black text-school-secondary-950">
// //                         <Star className="h-2.5 w-2.5" />
// //                         MOST POPULAR
// //                     </span>
// //                 </div>
// //             )}

// //             <div className="space-y-4">

// //                 {/* Package name + credits */}
// //                 <div>
// //                     <p className="text-xs font-semibold text-school-secondary-400 uppercase tracking-wider">
// //                         {pkg.name}
// //                     </p>
// //                     <div className="flex items-baseline gap-1.5 mt-1">
// //                         <span className="text-3xl font-black text-white">
// //                             {pkg.credits.toLocaleString()}
// //                         </span>
// //                         <span className="text-sm font-semibold text-school-secondary-400">
// //                             credits
// //                         </span>
// //                     </div>
// //                     <p className="text-[11px] text-school-secondary-500 mt-1">
// //                         {pkg.description}
// //                     </p>
// //                 </div>

// //                 {/* Price */}
// //                 <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3">
// //                     <div className="flex items-baseline justify-between gap-2">
// //                         <div>
// //                             <p className="text-lg font-black text-white">
// //                                 ₦{pkg.priceNGN.toLocaleString()}
// //                             </p>
// //                             <p className="text-[10px] text-school-secondary-500">
// //                                 ≈ ${pkg.priceUSD.toFixed(2)} USD
// //                             </p>
// //                         </div>
// //                         <div className="text-right">
// //                             <p className="text-xs font-semibold text-school-primary">
// //                                 ₦{(pkg.priceNGN / pkg.credits).toFixed(2)}/credit
// //                             </p>
// //                             <p className="text-[10px] text-school-secondary-500">
// //                                 per message
// //                             </p>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 {/* What you get */}
// //                 <div className="space-y-1.5">
// //                     {[
// //                         `${pkg.credits.toLocaleString()} WhatsApp messages`,
// //                         'Instant credit top-up',
// //                         'Never expires',
// //                     ].map(item => (
// //                         <div key={item} className="flex items-center gap-2">
// //                             <CheckCircle2 className="h-3.5 w-3.5 text-school-primary shrink-0" />
// //                             <span className="text-[11px] text-school-secondary-300">{item}</span>
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* CTA */}
// //                 <button
// //                     onClick={() => onSelect(pkg.id)}
// //                     disabled={loading}
// //                     className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
// //                         pkg.popular
// //                             ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
// //                             : 'bg-school-secondary-800 hover:bg-school-secondary-700 text-white border border-school-secondary-600'
// //                     }`}
// //                 >
// //                     {isLoading ? (
// //                         <><Loader2 className="h-3.5 w-3.5 animate-spin" />Processing...</>
// //                     ) : (
// //                         <><ShoppingCart className="h-3.5 w-3.5" />Buy Now<ArrowRight className="h-3 w-3" /></>
// //                     )}
// //                 </button>
// //             </div>
// //         </div>
// //     )
// // }

// // // ── Main page ──────────────────────────────────────────────────────────────────
// // export default function CreditsPage() {
// //     const router          = useRouter()
// //     const { profile }     = useProfileStore()
// //     const schoolId        = profile?.schoolId ?? ''
// //     const [loading,    setLoading]    = useState(false)
// //     const [selected,   setSelected]   = useState<string | null>(null)

// //     async function handleSelect(packageId: string) {
// //         if (!schoolId) {
// //             toast.error('School not found.')
// //             return
// //         }
// //         setSelected(packageId)
// //         setLoading(true)

// //         const result = await initiateCreditsPayment(schoolId, packageId)

// //         if (result.success && result.authorizationUrl) {
// //             // Redirect to Paystack checkout
// //             window.location.href = result.authorizationUrl
// //         } else {
// //             toast.error(result.error ?? 'Failed to initiate payment.')
// //             setLoading(false)
// //             setSelected(null)
// //         }
// //     }

// //     return (
// //         <div className="min-h-screen bg-school-secondary-950">
// //             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

// //                 {/* ── Header ── */}
// //                 <div className="flex items-center gap-3">
// //                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
// //                         <Zap className="h-5 w-5 text-school-primary" />
// //                     </div>
// //                     <div>
// //                         <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
// //                             Purchase Credits
// //                         </h1>
// //                         <p className="text-xs text-school-secondary-400">
// //                             Top up your WhatsApp messaging credits
// //                         </p>
// //                     </div>
// //                 </div>

// //                 {/* ── Current balance ── */}
// //                 <Card className="bg-school-secondary-900 border-school-secondary-700">
// //                     <CardContent className="p-4 sm:p-5">
// //                         <div className="flex items-center justify-between gap-4 flex-wrap">
// //                             <div className="flex items-center gap-3">
// //                                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
// //                                     <MessageCircle className="h-4 w-4 text-school-primary" />
// //                                 </div>
// //                                 <div>
// //                                     <p className="text-xs text-school-secondary-400">Current Balance</p>
// //                                     <p className="text-lg font-black text-white">
// //                                         {/* Credits shown from profile store */}
// //                                         Credits available in settings
// //                                     </p>
// //                                 </div>
// //                             </div>
// //                             <div className="flex items-center gap-1.5 text-[11px] text-school-secondary-400">
// //                                 <Shield className="h-3.5 w-3.5 text-green-400" />
// //                                 Secured by Paystack
// //                             </div>
// //                         </div>
// //                     </CardContent>
// //                 </Card>

// //                 {/* ── Pricing info ── */}
// //                 <div className="flex items-start gap-3 rounded-xl border border-school-primary/15 bg-school-primary/5 px-4 py-3">
// //                     <TrendingUp className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
// //                     <div>
// //                         <p className="text-xs font-semibold text-white">
// //                             1 credit = 1 WhatsApp message
// //                         </p>
// //                         <p className="text-[11px] text-school-secondary-400 mt-0.5">
// //                             Credits never expire and are applied instantly after payment confirmation.
// //                             Prices shown in Naira (NGN).
// //                         </p>
// //                     </div>
// //                 </div>

// //                 {/* ── Packages grid ── */}
// //                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
// //                     {CREDIT_PACKAGES.map(pkg => (
// //                         <PackageCard
// //                             key={pkg.id}
// //                             pkg={pkg}
// //                             onSelect={handleSelect}
// //                             loading={loading}
// //                             selected={selected}
// //                         />
// //                     ))}
// //                 </div>

// //                 {/* ── Trust indicators ── */}
// //                 <div className="grid gap-3 sm:grid-cols-3">
// //                     {[
// //                         { icon: Shield,       title: 'Secure Payment',    desc: 'All transactions secured by Paystack' },
// //                         { icon: Zap,          title: 'Instant Top-up',    desc: 'Credits added immediately after payment' },
// //                         { icon: MessageCircle, title: 'No Expiry',        desc: 'Your credits never expire' },
// //                     ].map(item => (
// //                         <div
// //                             key={item.title}
// //                             className="flex items-start gap-3 rounded-xl border border-school-secondary-700 bg-school-secondary-900 p-3"
// //                         >
// //                             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
// //                                 <item.icon className="h-3.5 w-3.5 text-school-primary" />
// //                             </div>
// //                             <div>
// //                                 <p className="text-xs font-bold text-white">{item.title}</p>
// //                                 <p className="text-[11px] text-school-secondary-400 mt-0.5">{item.desc}</p>
// //                             </div>
// //                         </div>
// //                     ))}
// //                 </div>

// //             </div>
// //         </div>
// //     )
// // }




// 'use client'

// import { useState } from 'react'
// // import { useRouter } from 'next/navigation'
// import { useProfileStore } from '@/store/profileStore'
// import {
//     CREDIT_PACKAGES,
//     initiateCreditsPayment,
//     CreditPackage,
// } from '@/app/actions/credits.actions'
// import {
//     ShoppingCart, Zap, CheckCircle2,
//     Loader2, Star, MessageCircle,
//     ArrowRight, Shield, TrendingUp,
// } from 'lucide-react'
// import { Card, CardContent } from '@/components/ui/card'
// import { toast } from 'sonner'

// // ── Package card ───────────────────────────────────────────────────────────────
// function PackageCard({
//     pkg,
//     onSelect,
//     loading,
//     selected,
// }: {
//     pkg:      CreditPackage
//     onSelect: (id: string) => void
//     loading:  boolean
//     selected: string | null
// }) {
//     const isSelected = selected === pkg.id
//     const isLoading  = isSelected && loading

//     return (
//         <div className={`relative rounded-2xl border p-5 transition-all cursor-pointer ${
//             pkg.popular
//                 ? 'border-school-primary bg-school-primary/5'
//                 : 'border-school-secondary-700 bg-school-secondary-900 hover:border-school-secondary-600'
//         }`}>

//             {/* Popular badge */}
//             {pkg.popular && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                     <span className="inline-flex items-center gap-1 rounded-full bg-school-primary px-3 py-1 text-[10px] font-black text-school-secondary-950">
//                         <Star className="h-2.5 w-2.5" />
//                         MOST POPULAR
//                     </span>
//                 </div>
//             )}

//             <div className="space-y-4">

//                 {/* Package name + credits */}
//                 <div>
//                     <p className="text-xs font-semibold text-school-secondary-400 uppercase tracking-wider">
//                         {pkg.name}
//                     </p>
//                     <div className="flex items-baseline gap-1.5 mt-1">
//                         <span className="text-3xl font-black text-white">
//                             {pkg.credits.toLocaleString()}
//                         </span>
//                         <span className="text-sm font-semibold text-school-secondary-400">
//                             credits
//                         </span>
//                     </div>
//                     <p className="text-[11px] text-school-secondary-500 mt-1">
//                         {pkg.description}
//                     </p>
//                 </div>

//                 {/* Price */}
//                 <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3">
//                     <div className="flex items-baseline justify-between gap-2">
//                         <div>
//                             <p className="text-lg font-black text-white">
//                                 ₦{pkg.priceNGN.toLocaleString()}
//                             </p>
//                             <p className="text-[10px] text-school-secondary-500">
//                                 ≈ ${pkg.priceUSD.toFixed(2)} USD
//                             </p>
//                         </div>
//                         <div className="text-right">
//                             <p className="text-xs font-semibold text-school-primary">
//                                 ₦{(pkg.priceNGN / pkg.credits).toFixed(2)}/credit
//                             </p>
//                             <p className="text-[10px] text-school-secondary-500">
//                                 per message
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 {/* What you get */}
//                 <div className="space-y-1.5">
//                     {[
//                         `${pkg.credits.toLocaleString()} WhatsApp messages`,
//                         'Instant credit top-up',
//                         'Never expires',
//                     ].map(item => (
//                         <div key={item} className="flex items-center gap-2">
//                             <CheckCircle2 className="h-3.5 w-3.5 text-school-primary shrink-0" />
//                             <span className="text-[11px] text-school-secondary-300">{item}</span>
//                         </div>
//                     ))}
//                 </div>

//                 {/* CTA */}
//                 <button
//                     onClick={() => onSelect(pkg.id)}
//                     disabled={loading}
//                     className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
//                         pkg.popular
//                             ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
//                             : 'bg-school-secondary-800 hover:bg-school-secondary-700 text-white border border-school-secondary-600'
//                     }`}
//                 >
//                     {isLoading ? (
//                         <><Loader2 className="h-3.5 w-3.5 animate-spin" />Processing...</>
//                     ) : (
//                         <><ShoppingCart className="h-3.5 w-3.5" />Buy Now<ArrowRight className="h-3 w-3" /></>
//                     )}
//                 </button>
//             </div>
//         </div>
//     )
// }

// // ── Main page ──────────────────────────────────────────────────────────────────
// export default function CreditsPage() {
//     // const router          = useRouter()
//     const { profile }     = useProfileStore()
//     const schoolId        = profile?.schoolId ?? ''
//     const [loading,    setLoading]    = useState(false)
//     const [selected,   setSelected]   = useState<string | null>(null)

//     async function handleSelect(packageId: string) {
//         if (!schoolId) {
//             toast.error('School not found.')
//             return
//         }
//         setSelected(packageId)
//         setLoading(true)

//         const result = await initiateCreditsPayment(schoolId, packageId)

//         if (result.success && result.authorizationUrl) {
//             // Redirect to Paystack checkout
//             window.location.href = result.authorizationUrl
//         } else {
//             toast.error(result.error ?? 'Failed to initiate payment.')
//             setLoading(false)
//             setSelected(null)
//         }
//     }

//     return (
//         <div className="min-h-screen bg-school-secondary-950">
//             <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

//                 {/* ── Header ── */}
//                 <div className="flex items-center gap-3">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                         <Zap className="h-5 w-5 text-school-primary" />
//                     </div>
//                     <div>
//                         <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
//                             Purchase Credits
//                         </h1>
//                         <p className="text-xs text-school-secondary-400">
//                             Top up your WhatsApp messaging credits
//                         </p>
//                     </div>
//                 </div>

//                 {/* ── Current balance ── */}
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardContent className="p-4 sm:p-5">
//                         <div className="flex items-center justify-between gap-4 flex-wrap">
//                             <div className="flex items-center gap-3">
//                                 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
//                                     <MessageCircle className="h-4 w-4 text-school-primary" />
//                                 </div>
//                                 <div>
//                                     <p className="text-xs text-school-secondary-400">Current Balance</p>
//                                     <p className="text-lg font-black text-white">
//                                         {/* Credits shown from profile store */}
//                                         Credits available in settings
//                                     </p>
//                                 </div>
//                             </div>
//                             <div className="flex items-center gap-1.5 text-[11px] text-school-secondary-400">
//                                 <Shield className="h-3.5 w-3.5 text-green-400" />
//                                 Secured by Paystack
//                             </div>
//                         </div>
//                     </CardContent>
//                 </Card>

//                 {/* ── Pricing info ── */}
//                 <div className="flex items-start gap-3 rounded-xl border border-school-primary/15 bg-school-primary/5 px-4 py-3">
//                     <TrendingUp className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
//                     <div>
//                         <p className="text-xs font-semibold text-white">
//                             1 credit = 1 WhatsApp message
//                         </p>
//                         <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                             Credits never expire and are applied instantly after payment confirmation.
//                             Prices shown in Naira (NGN).
//                         </p>
//                     </div>
//                 </div>

//                 {/* ── Packages grid ── */}
//                 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
//                     {CREDIT_PACKAGES.map(pkg => (
//                         <PackageCard
//                             key={pkg.id}
//                             pkg={pkg}
//                             onSelect={handleSelect}
//                             loading={loading}
//                             selected={selected}
//                         />
//                     ))}
//                 </div>

//                 {/* ── Trust indicators ── */}
//                 <div className="grid gap-3 sm:grid-cols-3">
//                     {[
//                         { icon: Shield,       title: 'Secure Payment',    desc: 'All transactions secured by Paystack' },
//                         { icon: Zap,          title: 'Instant Top-up',    desc: 'Credits added immediately after payment' },
//                         { icon: MessageCircle, title: 'No Expiry',        desc: 'Your credits never expire' },
//                     ].map(item => (
//                         <div
//                             key={item.title}
//                             className="flex items-start gap-3 rounded-xl border border-school-secondary-700 bg-school-secondary-900 p-3"
//                         >
//                             <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                 <item.icon className="h-3.5 w-3.5 text-school-primary" />
//                             </div>
//                             <div>
//                                 <p className="text-xs font-bold text-white">{item.title}</p>
//                                 <p className="text-[11px] text-school-secondary-400 mt-0.5">{item.desc}</p>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//             </div>
//         </div>
//     )
// }



'use client';

import { useState, useEffect } from 'react';
import { 
    getCreditPackages, 
    initiateCreditsPayment, 
} from '@/app/actions/credits.actions';
import { InitiatePaymentResult } from '@/types/credits';
import { useProfileStore } from '@/store/profileStore';
import { 
    Loader2, Zap, ShoppingCart, CheckCircle2, 
    Star, ArrowRight, Shield, MessageSquare 
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import { PackageCard } from '@/components/credit/packageCard';

// ── Interfaces ──────────────────────────────────────────────────────────────

interface CreditPackage {
    id: string;
    name: string;
    credits: number;
    priceNGN: number;
    priceUSD: number;
    description: string;
    popular: boolean;
}


// ── Main Page Component ──────────────────────────────────────────────────────

export default function CreditsPage() {
    const { profile } = useProfileStore();
    const schoolId = profile?.schoolId ?? '';
    
    const [packages, setPackages] = useState<CreditPackage[]>([]);
    const [loading, setLoading] = useState(true);
    const [purchaseLoading, setPurchaseLoading] = useState(false);

    useEffect(() => {
        async function loadPackages() {
            try {
                const res = await getCreditPackages();
                if (res.success && res.data) {
                    setPackages(res.data as CreditPackage[]);
                } else {
                    toast.error("Failed to load credit registry");
                }
            } catch {
                toast.error("An error occurred while fetching packages");
            } finally {
                setLoading(false);
            }
        }
        loadPackages();
    }, []);

    const handleSelect = async (id: string) => {
        if (!schoolId) {
            toast.error("Institutional identification is required.");
            return;
        }
        
        setPurchaseLoading(true);
        try {
            // ✅ FIX: Remove the manual type casting on this line
            const result = await initiateCreditsPayment(schoolId, id);
            
            // ✅ FIX: Check if 'result' exists first to satisfy the "possibly undefined" check
            if (result && result.success && result.authorizationUrl) {
                window.location.href = result.authorizationUrl;
            } else {
                // Handle the case where result is undefined or success is false
                const errorMsg = result?.error || "Payment gateway connection failed";
                toast.error(errorMsg);
                setPurchaseLoading(false); 
            }
        } catch (err) {
            toast.error("An unexpected communication error occurred.");
            setPurchaseLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
            <p className="text-slate-500 font-mono text-xs uppercase tracking-[0.3em] animate-pulse">Syncing_Credit_Registry...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                    <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
                            <Zap className="h-7 w-7 text-school-primary" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none">Credit Acquisition</h1>
                            <p className="text-slate-500 text-sm mt-2 font-medium">Replenish your WhatsApp units for automated reporting.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-900 border border-white/5 px-6 py-3 rounded-2xl">
                        <Shield className="h-4 w-4 text-emerald-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">PCI-DSS Compliant</span>
                    </div>
                </header>

                {/* Info Banner */}
                <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 flex items-start gap-4">
                    <MessageSquare className="h-6 w-6 text-school-primary shrink-0" />
                    <div className="space-y-1">
                        <p className="text-xs font-black uppercase tracking-widest text-white">Consumption Rate</p>
                        <p className="text-xs text-slate-500 leading-relaxed max-w-3xl">
                            Each successful transmission (Feedback, Reports, Attendance) consumes <span className="text-white font-bold">1 Credit Unit</span>. 
                            Credits never expire and remain valid for the duration of your institutional subscription.
                        </p>
                    </div>
                </div>

                {/* Packages Grid */}
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {packages.map((pkg) => (
                        <PackageCard 
                            key={pkg.id} 
                            pkg={pkg} 
                            loading={purchaseLoading}
                            onSelect={handleSelect}
                        />
                    ))}
                </div>

                {/* Footer Section */}
                <footer className="pt-10 flex items-center justify-center border-t border-white/5 opacity-50">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500 flex items-center gap-3">
                        <Shield className="h-3 w-3" /> Secure Transaction Hub <ArrowRight className="h-3 w-3" />
                    </p>
                </footer>
            </div>
        </div>
    );
}