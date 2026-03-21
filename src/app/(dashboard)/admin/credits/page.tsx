// 'use client'

// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
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
//     const router          = useRouter()
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




'use client'

import { useState } from 'react'
// import { useRouter } from 'next/navigation'
import { useProfileStore } from '@/store/profileStore'
import {
    CREDIT_PACKAGES,
    initiateCreditsPayment,
    CreditPackage,
} from '@/app/actions/credits.actions'
import {
    ShoppingCart, Zap, CheckCircle2,
    Loader2, Star, MessageCircle,
    ArrowRight, Shield, TrendingUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'

// ── Package card ───────────────────────────────────────────────────────────────
function PackageCard({
    pkg,
    onSelect,
    loading,
    selected,
}: {
    pkg:      CreditPackage
    onSelect: (id: string) => void
    loading:  boolean
    selected: string | null
}) {
    const isSelected = selected === pkg.id
    const isLoading  = isSelected && loading

    return (
        <div className={`relative rounded-2xl border p-5 transition-all cursor-pointer ${
            pkg.popular
                ? 'border-school-primary bg-school-primary/5'
                : 'border-school-secondary-700 bg-school-secondary-900 hover:border-school-secondary-600'
        }`}>

            {/* Popular badge */}
            {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-school-primary px-3 py-1 text-[10px] font-black text-school-secondary-950">
                        <Star className="h-2.5 w-2.5" />
                        MOST POPULAR
                    </span>
                </div>
            )}

            <div className="space-y-4">

                {/* Package name + credits */}
                <div>
                    <p className="text-xs font-semibold text-school-secondary-400 uppercase tracking-wider">
                        {pkg.name}
                    </p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                        <span className="text-3xl font-black text-white">
                            {pkg.credits.toLocaleString()}
                        </span>
                        <span className="text-sm font-semibold text-school-secondary-400">
                            credits
                        </span>
                    </div>
                    <p className="text-[11px] text-school-secondary-500 mt-1">
                        {pkg.description}
                    </p>
                </div>

                {/* Price */}
                <div className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3">
                    <div className="flex items-baseline justify-between gap-2">
                        <div>
                            <p className="text-lg font-black text-white">
                                ₦{pkg.priceNGN.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-school-secondary-500">
                                ≈ ${pkg.priceUSD.toFixed(2)} USD
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-semibold text-school-primary">
                                ₦{(pkg.priceNGN / pkg.credits).toFixed(2)}/credit
                            </p>
                            <p className="text-[10px] text-school-secondary-500">
                                per message
                            </p>
                        </div>
                    </div>
                </div>

                {/* What you get */}
                <div className="space-y-1.5">
                    {[
                        `${pkg.credits.toLocaleString()} WhatsApp messages`,
                        'Instant credit top-up',
                        'Never expires',
                    ].map(item => (
                        <div key={item} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-school-primary shrink-0" />
                            <span className="text-[11px] text-school-secondary-300">{item}</span>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <button
                    onClick={() => onSelect(pkg.id)}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
                        pkg.popular
                            ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
                            : 'bg-school-secondary-800 hover:bg-school-secondary-700 text-white border border-school-secondary-600'
                    }`}
                >
                    {isLoading ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" />Processing...</>
                    ) : (
                        <><ShoppingCart className="h-3.5 w-3.5" />Buy Now<ArrowRight className="h-3 w-3" /></>
                    )}
                </button>
            </div>
        </div>
    )
}

// ── Main page ──────────────────────────────────────────────────────────────────
export default function CreditsPage() {
    // const router          = useRouter()
    const { profile }     = useProfileStore()
    const schoolId        = profile?.schoolId ?? ''
    const [loading,    setLoading]    = useState(false)
    const [selected,   setSelected]   = useState<string | null>(null)

    async function handleSelect(packageId: string) {
        if (!schoolId) {
            toast.error('School not found.')
            return
        }
        setSelected(packageId)
        setLoading(true)

        const result = await initiateCreditsPayment(schoolId, packageId)

        if (result.success && result.authorizationUrl) {
            // Redirect to Paystack checkout
            window.location.href = result.authorizationUrl
        } else {
            toast.error(result.error ?? 'Failed to initiate payment.')
            setLoading(false)
            setSelected(null)
        }
    }

    return (
        <div className="min-h-screen bg-school-secondary-950">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">

                {/* ── Header ── */}
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
                        <Zap className="h-5 w-5 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
                            Purchase Credits
                        </h1>
                        <p className="text-xs text-school-secondary-400">
                            Top up your WhatsApp messaging credits
                        </p>
                    </div>
                </div>

                {/* ── Current balance ── */}
                <Card className="bg-school-secondary-900 border-school-secondary-700">
                    <CardContent className="p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-school-primary/20 border border-school-primary/20">
                                    <MessageCircle className="h-4 w-4 text-school-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-school-secondary-400">Current Balance</p>
                                    <p className="text-lg font-black text-white">
                                        {/* Credits shown from profile store */}
                                        Credits available in settings
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-school-secondary-400">
                                <Shield className="h-3.5 w-3.5 text-green-400" />
                                Secured by Paystack
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ── Pricing info ── */}
                <div className="flex items-start gap-3 rounded-xl border border-school-primary/15 bg-school-primary/5 px-4 py-3">
                    <TrendingUp className="h-4 w-4 text-school-primary shrink-0 mt-0.5" />
                    <div>
                        <p className="text-xs font-semibold text-white">
                            1 credit = 1 WhatsApp message
                        </p>
                        <p className="text-[11px] text-school-secondary-400 mt-0.5">
                            Credits never expire and are applied instantly after payment confirmation.
                            Prices shown in Naira (NGN).
                        </p>
                    </div>
                </div>

                {/* ── Packages grid ── */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 pt-2">
                    {CREDIT_PACKAGES.map(pkg => (
                        <PackageCard
                            key={pkg.id}
                            pkg={pkg}
                            onSelect={handleSelect}
                            loading={loading}
                            selected={selected}
                        />
                    ))}
                </div>

                {/* ── Trust indicators ── */}
                <div className="grid gap-3 sm:grid-cols-3">
                    {[
                        { icon: Shield,       title: 'Secure Payment',    desc: 'All transactions secured by Paystack' },
                        { icon: Zap,          title: 'Instant Top-up',    desc: 'Credits added immediately after payment' },
                        { icon: MessageCircle, title: 'No Expiry',        desc: 'Your credits never expire' },
                    ].map(item => (
                        <div
                            key={item.title}
                            className="flex items-start gap-3 rounded-xl border border-school-secondary-700 bg-school-secondary-900 p-3"
                        >
                            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
                                <item.icon className="h-3.5 w-3.5 text-school-primary" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-white">{item.title}</p>
                                <p className="text-[11px] text-school-secondary-400 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}