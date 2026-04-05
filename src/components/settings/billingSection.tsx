

// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//     CreditCard, CheckCircle2, Clock, AlertTriangle,
//     Loader2, Star, ArrowRight, Shield, Zap, Info,
//     History, ChevronDown, ChevronUp, XCircle,
// } from 'lucide-react'
// import {
//     initiateSubscriptionPayment,
//     getSubscriptionPlans,
//     getSchoolSubscription,
//     SubscriptionPlan,
//     SubscriptionWithHistory,
//     PaymentHistoryEntry,
// } from '@/app/actions/subscription.actions'
// // import { SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { useProfileStore } from '@/store/profileStore'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { format } from 'date-fns'

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function daysUntilExpiry(date: Date): number {
//     return Math.ceil(
//         (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
//     )
// }

// function getStatusConfig(status: string) {
//     switch (status.toLowerCase()) {
//         case 'active':
//             return {
//                 color:  'text-green-400',
//                 bg:     'bg-green-500/10',
//                 border: 'border-green-500/20',
//                 icon:   CheckCircle2,
//                 label:  'Active',
//             }
//         case 'trialing':
//             return {
//                 color:  'text-school-primary',
//                 bg:     'bg-school-primary/10',
//                 border: 'border-school-primary/20',
//                 icon:   Clock,
//                 label:  'Trial',
//             }
//         case 'past_due':
//             return {
//                 color:  'text-red-400',
//                 bg:     'bg-red-500/10',
//                 border: 'border-red-500/20',
//                 icon:   AlertTriangle,
//                 label:  'Past Due',
//             }
//         case 'pending':
//             return {
//                 color:  'text-amber-400',
//                 bg:     'bg-amber-500/10',
//                 border: 'border-amber-500/20',
//                 icon:   Clock,
//                 label:  'Pending',
//             }
//         default:
//             return {
//                 color:  'text-school-secondary-400',
//                 bg:     'bg-school-secondary-800',
//                 border: 'border-school-secondary-700',
//                 icon:   CreditCard,
//                 label:  status,
//             }
//     }
// }

// // ── Plan Card ──────────────────────────────────────────────────────────────────

// function PlanCard({
//     plan, onSelect, loading, selected,
// }: {
//     plan:     SubscriptionPlan
//     onSelect: (id: string) => void
//     loading:  boolean
//     selected: string | null
// }) {
//     const isLoading = selected === plan.id && loading

//     return (
//         <div className={cn(
//             'relative rounded-xl border p-4 space-y-3 transition-all',
//             plan.popular
//                 ? 'border-school-primary/40 bg-school-primary/5'
//                 : 'border-school-secondary-600 bg-school-secondary-800/30 hover:border-school-secondary-500'
//         )}>
//             {/* Popular badge */}
//             {plan.popular && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                     <span className="inline-flex items-center gap-1 rounded-full bg-school-primary px-3 py-0.5 text-[10px] font-black text-school-secondary-950">
//                         <Star className="h-2.5 w-2.5" />
//                         BEST VALUE
//                     </span>
//                 </div>
//             )}

//             {/* Name + price */}
//             <div>
//                 <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                     {plan.name}
//                 </p>
//                 <div className="flex items-baseline gap-1 mt-0.5">
//                     <span className="text-xl font-black text-white">
//                         ₦{plan.priceNGN.toLocaleString()}
//                     </span>
//                     <span className="text-[11px] text-school-secondary-500">
//                         /{plan.durationDays === 30
//                             ? 'mo'
//                             : plan.durationDays === 90
//                             ? 'term'
//                             : 'yr'
//                         }
//                     </span>
//                 </div>
//                 <p className="text-[10px] text-school-secondary-500 mt-0.5">
//                     ≈ ${plan.priceUSD} USD
//                 </p>
//                 <p className="text-[11px] text-school-secondary-400 mt-1">
//                     {plan.description}
//                 </p>
//             </div>

//             {/* Features */}
//             <div className="space-y-1">
//                 {plan.features.map(f => (
//                     <div key={f} className="flex items-center gap-1.5">
//                         <CheckCircle2 className="h-3 w-3 text-school-primary shrink-0" />
//                         <span className="text-[11px] text-school-secondary-300">{f}</span>
//                     </div>
//                 ))}
//             </div>

//             {/* CTA */}
//             <button
//                 onClick={() => onSelect(plan.id)}
//                 disabled={loading}
//                 className={cn(
//                     'w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all disabled:opacity-50',
//                     plan.popular
//                         ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
//                         : 'bg-school-secondary-700 hover:bg-school-secondary-600 text-white border border-school-secondary-600'
//                 )}
//             >
//                 {isLoading ? (
//                     <><Loader2 className="h-3.5 w-3.5 animate-spin" />Processing...</>
//                 ) : (
//                     <>Renew Now <ArrowRight className="h-3 w-3" /></>
//                 )}
//             </button>
//         </div>
//     )
// }

// // ── Payment History Row ────────────────────────────────────────────────────────

// function PaymentRow({ entry }: { entry: PaymentHistoryEntry }) {
//     const isSuccess = entry.status === 'SUCCESS'
//     const isPending = entry.status === 'PENDING'

//     return (
//         <div className="flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/40 transition-colors">
//             {/* Status icon */}
//             <div className={cn(
//                 'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
//                 isSuccess
//                     ? 'bg-green-500/10 border-green-500/20'
//                     : isPending
//                     ? 'bg-amber-500/10 border-amber-500/20'
//                     : 'bg-red-500/10 border-red-500/20'
//             )}>
//                 {isSuccess
//                     ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
//                     : isPending
//                     ? <Clock        className="h-3.5 w-3.5 text-amber-400" />
//                     : <XCircle      className="h-3.5 w-3.5 text-red-400"   />
//                 }
//             </div>

//             {/* Info */}
//             <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-white truncate">
//                     {entry.planName}
//                 </p>
//                 <p className="text-[10px] text-school-secondary-500">
//                     {entry.paidAt
//                         ? format(new Date(entry.paidAt), 'dd MMM yyyy · HH:mm')
//                         : format(new Date(entry.createdAt), 'dd MMM yyyy · HH:mm')
//                     }
//                 </p>
//             </div>

//             {/* Amount + status */}
//             <div className="text-right shrink-0">
//                 <p className="text-xs font-bold text-white">
//                     ₦{entry.amountNGN.toLocaleString()}
//                 </p>
//                 <span className={cn(
//                     'text-[10px] font-semibold',
//                     isSuccess ? 'text-green-400' :
//                     isPending ? 'text-amber-400' : 'text-red-400'
//                 )}>
//                     {entry.status.charAt(0) + entry.status.slice(1).toLowerCase()}
//                 </span>
//             </div>
//         </div>
//     )
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// // export function BillingSection({ data }: { data: SchoolSettingsData }) {
//     export function BillingSection() {
//     const { profile } = useProfileStore()
//     const schoolId    = profile?.schoolId ?? ''

//     // ── State ──────────────────────────────────────────────────────────────
//     const [sub,          setSub]          = useState<SubscriptionWithHistory | null>(null)
//     const [plans,        setPlans]        = useState<SubscriptionPlan[]>([])
//     const [subLoading,   setSubLoading]   = useState(true)
//     const [plansLoading, setPlansLoading] = useState(false)
//     const [showPlans,    setShowPlans]    = useState(false)
//     const [showHistory,  setShowHistory]  = useState(false)
//     const [paying,       setPaying]       = useState(false)
//     const [selected,     setSelected]     = useState<string | null>(null)

//     // ── Fetch subscription from DB ─────────────────────────────────────────
//     useEffect(() => {
//         if (!schoolId) return
//         setSubLoading(true)
//         getSchoolSubscription(schoolId)
//             .then(s => {
//                 setSub(s)
//                 // Auto-open plans if no active subscription
//                 setShowPlans(!s || s.status !== 'active')
//             })
//             .finally(() => setSubLoading(false))
//     }, [schoolId])

//     // ── Fetch plans lazily when panel opens ────────────────────────────────
//     useEffect(() => {
//         if (!showPlans || plans.length > 0) return
//         setPlansLoading(true)
//         getSubscriptionPlans()
//             .then(setPlans)
//             .finally(() => setPlansLoading(false))
//     }, [showPlans, plans.length])

//     async function handleSelectPlan(planId: string) {
//         if (!schoolId) { toast.error('School not found.'); return }
//         setSelected(planId)
//         setPaying(true)
//         const result = await initiateSubscriptionPayment(schoolId, planId)
//         if (result.success && result.authorizationUrl) {
//             window.location.href = result.authorizationUrl
//         } else {
//             toast.error(result.error ?? 'Failed to initiate payment.')
//             setPaying(false)
//             setSelected(null)
//         }
//     }

//     // ── Derived values ─────────────────────────────────────────────────────
//     const daysLeft       = sub?.currentPeriodEnd ? daysUntilExpiry(sub.currentPeriodEnd) : null
//     const isActive       = sub?.status === 'active'
//     const isExpiringSoon = isActive && daysLeft !== null && daysLeft <= 7
//     const hasHistory     = (sub?.transactions?.length ?? 0) > 0

//     // ── Loading ────────────────────────────────────────────────────────────
//     if (subLoading) return (
//         <Card className="bg-school-secondary-900 border-school-secondary-700">
//             <CardContent className="flex items-center justify-center py-16 gap-2">
//                 <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                 <span className="text-sm text-school-secondary-400">
//                     Loading billing information...
//                 </span>
//             </CardContent>
//         </Card>
//     )

//     return (
//         <div className="space-y-4">

//             {/* ── Current subscription status ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <CreditCard className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 Subscription & Billing
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 Managed securely via Paystack
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6 space-y-4">

//                     {/* ── No subscription ── */}
//                     {!sub || sub.status === 'pending' ? (
//                         <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
//                             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-secondary-800 border border-school-secondary-700">
//                                 <CreditCard className="h-7 w-7 text-school-secondary-500" />
//                             </div>
//                             <p className="text-sm font-bold text-white">
//                                 No active subscription
//                             </p>
//                             <p className="text-xs text-school-secondary-400 max-w-xs">
//                                 Subscribe to unlock full platform access for your school.
//                             </p>
//                             <button
//                                 onClick={() => setShowPlans(true)}
//                                 className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all"
//                             >
//                                 <Zap className="h-3.5 w-3.5" />
//                                 View Plans
//                             </button>
//                         </div>

//                     ) : (
//                         <>
//                             {/* ── Expiry warning ── */}
//                             {isExpiringSoon && (
//                                 <div className={cn(
//                                     'flex items-start gap-3 rounded-xl border px-4 py-3',
//                                     daysLeft! <= 1
//                                         ? 'bg-red-500/10 border-red-500/20'
//                                         : 'bg-amber-500/10 border-amber-500/20'
//                                 )}>
//                                     <AlertTriangle className={cn(
//                                         'h-4 w-4 shrink-0 mt-0.5',
//                                         daysLeft! <= 1 ? 'text-red-400' : 'text-amber-400'
//                                     )} />
//                                     <div className="flex-1 min-w-0">
//                                         <p className={cn(
//                                             'text-xs font-bold',
//                                             daysLeft! <= 1 ? 'text-red-400' : 'text-amber-400'
//                                         )}>
//                                             {daysLeft! <= 0
//                                                 ? 'Subscription expired'
//                                                 : daysLeft === 1
//                                                 ? 'Expires today'
//                                                 : `Expires in ${daysLeft} days`
//                                             }
//                                         </p>
//                                         <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                             Renew now to avoid service interruption.
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* ── Status banner ── */}
//                             {(() => {
//                                 const config = getStatusConfig(sub.status)
//                                 const Icon   = config.icon
//                                 return (
//                                     <div className={cn(
//                                         'flex items-center gap-3 rounded-xl border px-4 py-3',
//                                         config.bg, config.border
//                                     )}>
//                                         <Icon className={cn('h-4 w-4 shrink-0', config.color)} />
//                                         <div className="flex-1 min-w-0">
//                                             <p className={cn('text-xs font-bold', config.color)}>
//                                                 {config.label}
//                                             </p>
//                                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                                 {sub.plan} plan
//                                             </p>
//                                         </div>
//                                         {daysLeft !== null && daysLeft > 0 && (
//                                             <span className={cn(
//                                                 'text-xs font-black shrink-0',
//                                                 config.color
//                                             )}>
//                                                 {daysLeft}d left
//                                             </span>
//                                         )}
//                                     </div>
//                                 )
//                             })()}

//                             {/* ── Plan details grid ── */}
//                             <div className="grid gap-3 sm:grid-cols-3">
//                                 {[
//                                     {
//                                         label: 'Plan',
//                                         value: sub.plan,
//                                     },
//                                     {
//                                         label: 'Status',
//                                         value: getStatusConfig(sub.status).label,
//                                     },
//                                     {
//                                         label: 'Renews',
//                                         value: format(
//                                             new Date(sub.currentPeriodEnd),
//                                             'dd MMM yyyy'
//                                         ),
//                                     },
//                                 ].map(item => (
//                                     <div
//                                         key={item.label}
//                                         className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3"
//                                     >
//                                         <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider mb-1">
//                                             {item.label}
//                                         </p>
//                                         <p className="text-sm font-bold text-white">
//                                             {item.value}
//                                         </p>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* ── Last payment summary ── */}
//                             {sub.paidAt && sub.amountNGN && (
//                                 <div className="flex items-center gap-3 rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 px-4 py-3">
//                                     <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-xs font-semibold text-white">
//                                             Last payment
//                                         </p>
//                                         <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                             {format(new Date(sub.paidAt), 'dd MMM yyyy')}
//                                             {' · '}
//                                             ₦{sub.amountNGN.toLocaleString()}
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* ── Renew / manage ── */}
//                             <div className="flex items-center justify-between rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 p-3 sm:p-4 flex-wrap gap-3">
//                                 <div>
//                                     <p className="text-xs font-semibold text-white">
//                                         {isExpiringSoon
//                                             ? 'Renew your subscription'
//                                             : 'Manage subscription'
//                                         }
//                                     </p>
//                                     <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                         {isExpiringSoon
//                                             ? 'Select a plan to renew before expiry'
//                                             : 'Renew early or switch to a different plan'
//                                         }
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => setShowPlans(p => !p)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all shrink-0"
//                                 >
//                                     <Zap className="h-3.5 w-3.5" />
//                                     {showPlans ? 'Hide Plans' : 'View Plans'}
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* ── Plans grid ── */}
//             {showPlans && (
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                 <Zap className="h-4 w-4 text-school-primary" />
//                             </div>
//                             <div>
//                                 <CardTitle className="text-sm font-bold text-white">
//                                     Choose a Plan
//                                 </CardTitle>
//                                 <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                     All plans include full platform access · Prices in NGN
//                                 </p>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-4 sm:p-6 space-y-4">

//                         {/* Info banner */}
//                         <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
//                             <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
//                             <p className="text-[11px] text-school-secondary-400 leading-relaxed">
//                                 Click a plan to proceed to Paystack.
//                                 Subscription activates immediately after payment confirmation.
//                             </p>
//                         </div>

//                         {/* Plans */}
//                         {plansLoading ? (
//                             <div className="flex items-center justify-center py-10 gap-2">
//                                 <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                                 <span className="text-xs text-school-secondary-400">
//                                     Loading plans...
//                                 </span>
//                             </div>
//                         ) : plans.length === 0 ? (
//                             <p className="text-xs text-school-secondary-400 text-center py-8">
//                                 No plans available. Contact support.
//                             </p>
//                         ) : (
//                             <div className="grid gap-4 sm:grid-cols-3 pt-2">
//                                 {plans.map(plan => (
//                                     <PlanCard
//                                         key={plan.id}
//                                         plan={plan}
//                                         onSelect={handleSelectPlan}
//                                         loading={paying}
//                                         selected={selected}
//                                     />
//                                 ))}
//                             </div>
//                         )}

//                         {/* Trust indicators */}
//                         <div className="grid gap-3 sm:grid-cols-3 pt-1">
//                             {[
//                                 { icon: Shield,       label: 'Secure',   desc: 'Payments via Paystack'     },
//                                 { icon: Zap,          label: 'Instant',  desc: 'Activates on confirmation' },
//                                 { icon: CheckCircle2, label: 'Flexible', desc: 'No lock-in contracts'      },
//                             ].map(item => (
//                                 <div
//                                     key={item.label}
//                                     className="flex items-center gap-2.5 rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 px-3 py-2.5"
//                                 >
//                                     <item.icon className="h-4 w-4 text-school-primary shrink-0" />
//                                     <div>
//                                         <p className="text-[11px] font-bold text-white">
//                                             {item.label}
//                                         </p>
//                                         <p className="text-[10px] text-school-secondary-500">
//                                             {item.desc}
//                                         </p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* ── Payment history ── */}
//             {hasHistory && (
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardHeader className="px-4 sm:px-6 py-4">
//                         <button
//                             onClick={() => setShowHistory(p => !p)}
//                             className="flex items-center justify-between w-full"
//                         >
//                             <div className="flex items-center gap-3">
//                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                     <History className="h-4 w-4 text-school-primary" />
//                                 </div>
//                                 <div className="text-left">
//                                     <CardTitle className="text-sm font-bold text-white">
//                                         Payment History
//                                     </CardTitle>
//                                     <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                         {sub?.transactions?.length ?? 0} transaction{(sub?.transactions?.length ?? 0) !== 1 ? 's' : ''} recorded
//                                     </p>
//                                 </div>
//                             </div>
//                             {showHistory
//                                 ? <ChevronUp   className="h-4 w-4 text-school-secondary-400" />
//                                 : <ChevronDown className="h-4 w-4 text-school-secondary-400" />
//                             }
//                         </button>
//                     </CardHeader>

//                     {showHistory && (
//                         <CardContent className="p-0">
//                             <div className="border-t border-school-secondary-700 divide-y divide-school-secondary-800">
//                                 {(sub?.transactions ?? []).map((entry, i) => (
//                                     <PaymentRow
//                                         key={`${entry.id}-${i}`}
//                                         entry={entry}
//                                     />
//                                 ))}
//                             </div>
//                         </CardContent>
//                     )}
//                 </Card>
//             )}

//         </div>
//     )
// }



// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//     CreditCard, CheckCircle2, AlertTriangle,
//     Loader2, Star, ArrowRight, Shield, Zap, Info,
//     History, ChevronDown, ChevronUp, XCircle,
// } from 'lucide-react'
// import {
//     initiateSubscriptionPayment,
//     getSubscriptionPlans,
//     getSchoolSubscription,
//     type SubscriptionPlan,
//     type SubscriptionWithHistory,
//     type PaymentHistoryEntry,
// } from '@/app/actions/subscription.actions'
// import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { useProfileStore } from '@/store/profileStore'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { format } from 'date-fns'

// interface BillingSectionProps {
//     data: SchoolSettingsData
// }

// export function BillingSection({ data }: BillingSectionProps) {
//     const { profile } = useProfileStore()
//     const schoolId = profile?.schoolId ?? ''

//     const [subscription, setSubscription] = useState<SubscriptionWithHistory | null>(null)
//     const [plans, setPlans] = useState<SubscriptionPlan[]>([])
//     const [loading, setLoading] = useState(true)
//     const [plansLoading, setPlansLoading] = useState(false)
//     const [showPlans, setShowPlans] = useState(false)
//     const [showHistory, setShowHistory] = useState(false)
//     const [paying, setPaying] = useState(false)
//     const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null)

//     useEffect(() => {
//         if (!schoolId) return
//         setLoading(true)
//         getSchoolSubscription(schoolId)
//             .then(s => {
//                 setSubscription(s)
//                 if (!s || s.status !== 'active') setShowPlans(true)
//             })
//             .finally(() => setLoading(false))
//     }, [schoolId])

//     useEffect(() => {
//         if (!showPlans || plans.length > 0) return
//         setPlansLoading(true)
//         getSubscriptionPlans().then(setPlans).finally(() => setPlansLoading(false))
//     }, [showPlans, plans.length])

//     async function handleSelectPlan(planId: string) {
//         if (!schoolId) return toast.error('School context lost.')
//         setSelectedPlanId(planId)
//         setPaying(true)
//         const result = await initiateSubscriptionPayment(schoolId, planId)
//         if (result.success && result.authorizationUrl) {
//             window.location.href = result.authorizationUrl
//         } else {
//             toast.error(result.error ?? 'Payment failed.')
//             setPaying(false)
//             setSelectedPlanId(null)
//         }
//     }

//     if (loading) return (
//         <div className="py-20 flex flex-col items-center justify-center gap-4">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Accessing Vault...</p>
//         </div>
//     )

//     return (
//         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            
//             {/* ── Security Info Banner ── */}
//             <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-4">
//                 <Info className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
//                 <p className="text-[11px] text-slate-400 leading-relaxed">
//                     Billing for <span className="text-white font-bold">{data.school.name}</span> is processed via secure encrypted channels. We do not store your card details on our servers.
//                 </p>
//             </div>

//             {/* ── Status Card ── */}
//             <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
//                 <CardHeader className="p-8 border-b border-white/5 bg-slate-950/50">
//                     <div className="flex items-center gap-4">
//                         <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center">
//                             <CreditCard className="h-6 w-6 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-xl font-bold text-white uppercase italic tracking-tighter">Financial Registry</CardTitle>
//                             <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Manage subcriptions for {data.school.name}</p>
//                         </div>
//                     </div>
//                 </CardHeader>
                
//                 <CardContent className="p-8">
//                     {!subscription ? (
//                         <div className="py-10 text-center space-y-4">
//                             <AlertTriangle className="h-10 w-10 text-amber-500 mx-auto opacity-50" />
//                             <p className="text-slate-400 text-sm italic">Account currently in restricted mode.</p>
//                             <button onClick={() => setShowPlans(true)} className="bg-school-primary text-slate-950 font-black px-10 py-4 rounded-2xl flex items-center gap-2 mx-auto hover:scale-105 transition-all shadow-xl shadow-school-primary/20">
//                                 <Zap className="h-4 w-4" /> ACTIVATE NOW <ArrowRight className="h-4 w-4" />
//                             </button>
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                              <div className="p-6 rounded-3xl bg-slate-950 border border-white/5">
//                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Current Tier</p>
//                                 <p className="text-xl font-bold text-white">{subscription.plan}</p>
//                              </div>
//                              <div className="p-6 rounded-3xl bg-slate-950 border border-white/5">
//                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Link Status</p>
//                                 <p className={cn("text-xl font-bold", subscription.status === 'active' ? 'text-emerald-500' : 'text-amber-500')}>
//                                     {subscription.status.toUpperCase()}
//                                 </p>
//                              </div>
//                              <div className="p-6 rounded-3xl bg-slate-950 border border-white/5">
//                                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Subscription Renewal</p>
//                                 <p className="text-xl font-bold text-white">{format(new Date(subscription.currentPeriodEnd), 'dd MMM yyyy')}</p>
//                              </div>
//                         </div>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* ── Plans Section ── */}
//             {showPlans && (
//                 <div className="space-y-4">
//                     <div className="flex items-center gap-2 px-2 text-school-primary">
//                         <Zap className="h-4 w-4" />
//                         <span className="text-[10px] font-black uppercase tracking-[0.2em]">Available Packages</span>
//                     </div>
//                     {plansLoading ? (
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
//                             {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-900 rounded-3xl border border-white/5" />)}
//                         </div>
//                     ) : (
//                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                             {plans.map(plan => (
//                                 <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} loading={paying} selected={selectedPlanId} />
//                             ))}
//                         </div>
//                     )}
//                 </div>
//             )}

//             {/* ── History Section ── */}
//             {subscription?.transactions && (
//                 <Card className="bg-slate-900 border-white/5 rounded-[2rem] overflow-hidden">
//                     <button onClick={() => setShowHistory(!showHistory)} className="w-full p-6 flex items-center justify-between hover:bg-white/[0.02] transition-all">
//                         <div className="flex items-center gap-3">
//                             <History className="h-5 w-5 text-slate-500" />
//                             <span className="text-sm font-bold text-white uppercase tracking-widest">Accounting Archive</span>
//                         </div>
//                         {showHistory ? <ChevronUp /> : <ChevronDown />}
//                     </button>
//                     {showHistory && (
//                         <div className="border-t border-white/5 divide-y divide-white/5 max-h-80 overflow-y-auto">
//                             {subscription.transactions.map((entry, i) => (
//                                 <PaymentRow key={i} entry={entry} />
//                             ))}
//                         </div>
//                     )}
//                 </Card>
//             )}
//         </div>
//     )
// }

// function PlanCard({ plan, onSelect, loading, selected }: { plan: SubscriptionPlan, onSelect: (id: string) => void, loading: boolean, selected: string | null }) {
//     const isSelected = selected === plan.id && loading;
//     return (
//         <Card className={cn("bg-slate-900 border-white/5 rounded-3xl p-8 flex flex-col justify-between transition-all group hover:border-school-primary/30", plan.popular && "border-school-primary/40 shadow-2xl shadow-school-primary/10")}>
//             <div>
//                 {plan.popular && <div className="mb-4 flex items-center gap-1.5 text-[9px] font-black text-school-primary uppercase tracking-widest"><Star className="h-3 w-3 fill-school-primary" /> Most Popular Selection</div>}
//                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">{plan.name}</p>
//                 <h3 className="text-3xl font-black text-white mb-1">₦{plan.priceNGN.toLocaleString()}</h3>
//                 <p className="text-slate-500 text-xs mb-8 leading-relaxed">{plan.description}</p>
//                 <div className="space-y-3 mb-10">
//                     {plan.features.map(f => (
//                         <div key={f} className="flex items-center gap-2 text-xs text-slate-400"><CheckCircle2 className="h-3.5 w-3.5 text-school-primary shrink-0" /> {f}</div>
//                     ))}
//                 </div>
//             </div>
//             <button onClick={() => onSelect(plan.id)} disabled={loading} className="w-full bg-school-primary text-school-secondary-950 font-black py-4 rounded-xl flex items-center justify-center gap-2 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50">
//                 {isSelected ? <Loader2 className="h-4 w-4 animate-spin" /> : <>SELECT PLAN <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" /></>}
//             </button>
//         </Card>
//     )
// }

// function PaymentRow({ entry }: { entry: PaymentHistoryEntry }) {
//     const isFailed = entry.status === 'FAILED';
//     return (
//         <div className="p-6 flex items-center justify-between text-sm group hover:bg-white/[0.01]">
//             <div className="flex items-center gap-4">
//                 <div className={cn("h-10 w-10 rounded-xl bg-slate-950 flex items-center justify-center border", isFailed ? 'border-red-500/20' : 'border-white/5')}>
//                     {isFailed ? <XCircle className="h-5 w-5 text-red-500" /> : <Shield className="h-5 w-5 text-slate-500 group-hover:text-school-primary transition-colors" />}
//                 </div>
//                 <div>
//                     <p className="font-bold text-white uppercase text-xs tracking-tight">{entry.planName} Subscription</p>
//                     <p className="text-[10px] text-slate-600 font-mono mt-0.5">{format(new Date(entry.createdAt), 'dd MMM yyyy · HH:mm')}</p>
//                 </div>
//             </div>
//             <div className="text-right">
//                 <p className="font-black text-white italic">₦{entry.amountNGN.toLocaleString()}</p>
//                 <span className={cn("text-[8px] font-black uppercase px-2 py-0.5 rounded mt-1 inline-block", isFailed ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500')}>
//                     {entry.status}
//                 </span>
//             </div>
//         </div>
//     )
// }



// src/components/settings/billingSection.tsx
// 'use client'

// import { useState, useEffect } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//     CreditCard, CheckCircle2, Clock, AlertTriangle,
//     Loader2, Star, Shield, Zap, Info,
//     History, ChevronDown, ChevronUp, XCircle,
//     RefreshCw,
// } from 'lucide-react'
// import {
//     initiateSubscriptionPayment,
//     getSubscriptionPlans,
//     getSchoolSubscription,
//     SubscriptionPlan,
//     SubscriptionWithHistory,
//     PaymentHistoryEntry,
// } from '@/app/actions/subscription.actions'
// import { SchoolSettingsData } from '@/app/actions/school-settings.action'
// import { useProfileStore } from '@/store/profileStore'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'
// import { format } from 'date-fns'

// // ── Helpers ────────────────────────────────────────────────────────────────────

// function daysUntilExpiry(date: Date): number {
//     return Math.ceil(
//         (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
//     )
// }

// function getStatusConfig(status: string) {
//     switch (status.toLowerCase()) {
//         case 'active':
//             return { color: 'text-green-400',            bg: 'bg-green-500/10',            border: 'border-green-500/20',            icon: CheckCircle2,   label: 'Active'   }
//         case 'trialing':
//             return { color: 'text-school-primary',       bg: 'bg-school-primary/10',       border: 'border-school-primary/20',       icon: Clock,          label: 'Trial'    }
//         case 'past_due':
//             return { color: 'text-red-400',              bg: 'bg-red-500/10',              border: 'border-red-500/20',              icon: AlertTriangle,  label: 'Past Due' }
//         case 'pending':
//             return { color: 'text-amber-400',            bg: 'bg-amber-500/10',            border: 'border-amber-500/20',            icon: Clock,          label: 'Pending'  }
//         default:
//             return { color: 'text-school-secondary-400', bg: 'bg-school-secondary-800',    border: 'border-school-secondary-700',    icon: CreditCard,     label: status     }
//     }
// }

// // ── Plan Card ──────────────────────────────────────────────────────────────────

// function PlanCard({
//     plan, onSelect, loading, selected,
// }: {
//     plan:     SubscriptionPlan
//     onSelect: (id: string) => void
//     loading:  boolean
//     selected: string | null
// }) {
//     const isThisLoading = selected === plan.id && loading
//     const isOtherLoading = loading && selected !== plan.id

//     return (
//         <div className={cn(
//             'relative rounded-xl border p-4 space-y-3 transition-all',
//             plan.popular
//                 ? 'border-school-primary/40 bg-school-primary/5'
//                 : 'border-school-secondary-600 bg-school-secondary-800/30',
//             isOtherLoading && 'opacity-40 pointer-events-none'
//         )}>
//             {plan.popular && (
//                 <div className="absolute -top-3 left-1/2 -translate-x-1/2">
//                     <span className="inline-flex items-center gap-1 rounded-full bg-school-primary px-3 py-0.5 text-[10px] font-black text-school-secondary-950">
//                         <Star className="h-2.5 w-2.5" />
//                         BEST VALUE
//                     </span>
//                 </div>
//             )}

//             {/* Name + price */}
//             <div>
//                 <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
//                     {plan.name}
//                 </p>
//                 <div className="flex items-baseline gap-1 mt-0.5">
//                     <span className="text-xl font-black text-white">
//                         ₦{plan.priceNGN.toLocaleString()}
//                     </span>
//                     <span className="text-[11px] text-school-secondary-500">
//                         /{plan.durationDays === 30 ? 'mo' : plan.durationDays === 90 ? 'term' : 'yr'}
//                     </span>
//                 </div>
//                 <p className="text-[10px] text-school-secondary-500 mt-0.5">
//                     ≈ ${plan.priceUSD} USD
//                 </p>
//                 <p className="text-[11px] text-school-secondary-400 mt-1">
//                     {plan.description}
//                 </p>
//             </div>

//             {/* Features */}
//             <div className="space-y-1">
//                 {plan.features.map(f => (
//                     <div key={f} className="flex items-center gap-1.5">
//                         <CheckCircle2 className="h-3 w-3 text-school-primary shrink-0" />
//                         <span className="text-[11px] text-school-secondary-300">{f}</span>
//                     </div>
//                 ))}
//             </div>

//             {/* CTA */}
//             <button
//                 onClick={() => onSelect(plan.id)}
//                 disabled={loading}
//                 className={cn(
//                     'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50',
//                     plan.popular
//                         ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
//                         : 'bg-school-secondary-700 hover:bg-school-secondary-600 text-white border border-school-secondary-600'
//                 )}
//             >
//                 {isThisLoading ? (
//                     <><Loader2 className="h-3.5 w-3.5 animate-spin" />Processing...</>
//                 ) : (
//                     <><RefreshCw className="h-3.5 w-3.5" />Renew with this plan</>
//                 )}
//             </button>
//         </div>
//     )
// }

// // ── Payment History Row ────────────────────────────────────────────────────────

// function PaymentRow({ entry }: { entry: PaymentHistoryEntry }) {
//     const isSuccess = entry.status === 'SUCCESS'
//     const isPending = entry.status === 'PENDING'

//     return (
//         <div className="flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/40 transition-colors">
//             <div className={cn(
//                 'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
//                 isSuccess ? 'bg-green-500/10 border-green-500/20'
//                 : isPending ? 'bg-amber-500/10 border-amber-500/20'
//                 : 'bg-red-500/10 border-red-500/20'
//             )}>
//                 {isSuccess
//                     ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
//                     : isPending
//                     ? <Clock        className="h-3.5 w-3.5 text-amber-400" />
//                     : <XCircle      className="h-3.5 w-3.5 text-red-400"   />
//                 }
//             </div>

//             <div className="flex-1 min-w-0">
//                 <p className="text-xs font-semibold text-white truncate">
//                     {entry.planName}
//                 </p>
//                 <p className="text-[10px] text-school-secondary-500">
//                     {entry.paidAt
//                         ? format(new Date(entry.paidAt), 'dd MMM yyyy · HH:mm')
//                         : format(new Date(entry.createdAt), 'dd MMM yyyy · HH:mm')
//                     }
//                 </p>
//             </div>

//             <div className="text-right shrink-0">
//                 <p className="text-xs font-bold text-white">
//                     {entry.amountNGN === 0
//                         ? 'Free'
//                         : `₦${entry.amountNGN.toLocaleString()}`
//                     }
//                 </p>
//                 <span className={cn(
//                     'text-[10px] font-semibold',
//                     isSuccess ? 'text-green-400' :
//                     isPending ? 'text-amber-400' : 'text-red-400'
//                 )}>
//                     {entry.status.charAt(0) + entry.status.slice(1).toLowerCase()}
//                 </span>
//             </div>
//         </div>
//     )
// }

// // ── Main Component ─────────────────────────────────────────────────────────────

// export function BillingSection({ data }: { data: SchoolSettingsData }) {
//     const { profile } = useProfileStore()
//     const schoolId    = profile?.schoolId ?? ''

//     const [sub,           setSub]           = useState<SubscriptionWithHistory | null>(null)
//     const [plans,         setPlans]         = useState<SubscriptionPlan[]>([])
//     const [subLoading,    setSubLoading]    = useState(true)
//     const [plansLoading,  setPlansLoading]  = useState(false)
//     const [showPlans,     setShowPlans]     = useState(false)
//     const [showHistory,   setShowHistory]   = useState(false)
//     const [paying,        setPaying]        = useState(false)
//     const [selected,      setSelected]      = useState<string | null>(null)

//     // ── Fetch subscription ─────────────────────────────────────────────────
//     useEffect(() => {
//         if (!schoolId) return
//         setSubLoading(true)
//         getSchoolSubscription(schoolId)
//             .then(s => {
//                 setSub(s)
//                 setShowPlans(!s || s.status !== 'active')
//             })
//             .finally(() => setSubLoading(false))
//     }, [schoolId])

//     // ── Fetch plans lazily ─────────────────────────────────────────────────
//     useEffect(() => {
//         if (!showPlans || plans.length > 0) return
//         setPlansLoading(true)
//         getSubscriptionPlans()
//             .then(setPlans)
//             .finally(() => setPlansLoading(false))
//     }, [showPlans, plans.length])

//     async function handleSelectPlan(planId: string) {
//         if (!schoolId) { toast.error('School not found.'); return }
//         setSelected(planId)
//         setPaying(true)

//         const result = await initiateSubscriptionPayment(schoolId, planId)

//         if (result.success && result.authorizationUrl) {
//             // Paid plan — redirect to Paystack
//             window.location.href = result.authorizationUrl
//         } else if (result.success && !result.authorizationUrl) {
//             // Free plan — activated immediately, refresh subscription
//             toast.success('Free trial activated!')
//             const updated = await getSchoolSubscription(schoolId)
//             setSub(updated)
//             setShowPlans(false)
//             setPaying(false)
//             setSelected(null)
//         } else {
//             toast.error(result.error ?? 'Failed to initiate payment.')
//             setPaying(false)
//             setSelected(null)
//         }
//     }

//     // ── Derived ────────────────────────────────────────────────────────────
//     const daysLeft       = sub?.currentPeriodEnd ? daysUntilExpiry(sub.currentPeriodEnd) : null
//     const isActive       = sub?.status === 'active'
//     const isExpiringSoon = isActive && daysLeft !== null && daysLeft <= 7
//     const hasHistory     = (sub?.transactions?.length ?? 0) > 0
//     const successTxCount = sub?.transactions?.filter(t => t.status === 'SUCCESS').length ?? 0

//     // ── Loading ────────────────────────────────────────────────────────────
//     if (subLoading) return (
//         <Card className="bg-school-secondary-900 border-school-secondary-700">
//             <CardContent className="flex items-center justify-center py-16 gap-2">
//                 <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                 <span className="text-sm text-school-secondary-400">
//                     Loading billing information...
//                 </span>
//             </CardContent>
//         </Card>
//     )

//     return (
//         <div className="space-y-4">

//             {/* ── Subscription status card ── */}
//             <Card className="bg-school-secondary-900 border-school-secondary-700">
//                 <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                     <div className="flex items-center gap-3">
//                         <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                             <CreditCard className="h-4 w-4 text-school-primary" />
//                         </div>
//                         <div>
//                             <CardTitle className="text-sm font-bold text-white">
//                                 Subscription & Billing
//                             </CardTitle>
//                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                 Managed securely via Paystack
//                             </p>
//                         </div>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="p-4 sm:p-6 space-y-4">

//                     {/* ── No subscription ── */}
//                     {!sub || sub.status === 'pending' ? (
//                         <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
//                             <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-secondary-800 border border-school-secondary-700">
//                                 <CreditCard className="h-7 w-7 text-school-secondary-500" />
//                             </div>
//                             <p className="text-sm font-bold text-white">
//                                 No active subscription
//                             </p>
//                             <p className="text-xs text-school-secondary-400 max-w-xs">
//                                 Subscribe to unlock full platform access for your school.
//                             </p>
//                             <button
//                                 onClick={() => setShowPlans(true)}
//                                 className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all"
//                             >
//                                 <Zap className="h-3.5 w-3.5" />
//                                 View Plans
//                             </button>
//                         </div>

//                     ) : (
//                         <>
//                             {/* ── Expiry warning ── */}
//                             {isExpiringSoon && (
//                                 <div className={cn(
//                                     'flex items-start gap-3 rounded-xl border px-4 py-3',
//                                     daysLeft! <= 1
//                                         ? 'bg-red-500/10 border-red-500/20'
//                                         : 'bg-amber-500/10 border-amber-500/20'
//                                 )}>
//                                     <AlertTriangle className={cn(
//                                         'h-4 w-4 shrink-0 mt-0.5',
//                                         daysLeft! <= 1 ? 'text-red-400' : 'text-amber-400'
//                                     )} />
//                                     <div className="flex-1 min-w-0">
//                                         <p className={cn(
//                                             'text-xs font-bold',
//                                             daysLeft! <= 1 ? 'text-red-400' : 'text-amber-400'
//                                         )}>
//                                             {daysLeft! <= 0
//                                                 ? 'Subscription expired'
//                                                 : daysLeft === 1
//                                                 ? 'Expires today'
//                                                 : `Expires in ${daysLeft} days`
//                                             }
//                                         </p>
//                                         <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                             Renew now to avoid service interruption.
//                                         </p>
//                                     </div>
//                                     {/* Quick renew shortcut */}
//                                     <button
//                                         onClick={() => setShowPlans(true)}
//                                         className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-[11px] font-bold transition-all shrink-0"
//                                     >
//                                         <RefreshCw className="h-3 w-3" />
//                                         Renew
//                                     </button>
//                                 </div>
//                             )}

//                             {/* ── Status banner ── */}
//                             {(() => {
//                                 const config = getStatusConfig(sub.status)
//                                 const Icon   = config.icon
//                                 return (
//                                     <div className={cn(
//                                         'flex items-center gap-3 rounded-xl border px-4 py-3',
//                                         config.bg, config.border
//                                     )}>
//                                         <Icon className={cn('h-4 w-4 shrink-0', config.color)} />
//                                         <div className="flex-1 min-w-0">
//                                             <p className={cn('text-xs font-bold', config.color)}>
//                                                 {config.label}
//                                             </p>
//                                             <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                                 {sub.plan} plan
//                                             </p>
//                                         </div>
//                                         {daysLeft !== null && daysLeft > 0 && (
//                                             <span className={cn(
//                                                 'text-xs font-black shrink-0',
//                                                 config.color
//                                             )}>
//                                                 {daysLeft}d left
//                                             </span>
//                                         )}
//                                     </div>
//                                 )
//                             })()}

//                             {/* ── Plan details grid ── */}
//                             <div className="grid gap-3 sm:grid-cols-3">
//                                 {[
//                                     { label: 'Plan',   value: sub.plan },
//                                     { label: 'Status', value: getStatusConfig(sub.status).label },
//                                     {
//                                         label: 'Renews',
//                                         value: format(new Date(sub.currentPeriodEnd), 'dd MMM yyyy'),
//                                     },
//                                 ].map(item => (
//                                     <div
//                                         key={item.label}
//                                         className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3"
//                                     >
//                                         <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider mb-1">
//                                             {item.label}
//                                         </p>
//                                         <p className="text-sm font-bold text-white">{item.value}</p>
//                                     </div>
//                                 ))}
//                             </div>

//                             {/* ── Last payment ── */}
//                             {sub.paidAt && sub.amountNGN !== null && (
//                                 <div className="flex items-center gap-3 rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 px-4 py-3">
//                                     <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
//                                     <div className="flex-1 min-w-0">
//                                         <p className="text-xs font-semibold text-white">
//                                             Last payment
//                                         </p>
//                                         <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                             {format(new Date(sub.paidAt), 'dd MMM yyyy')}
//                                             {sub.amountNGN === 0
//                                                 ? ' · Free trial'
//                                                 : ` · ₦${sub.amountNGN.toLocaleString()}`
//                                             }
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* ── Renew button ── */}
//                             <div className="flex items-center justify-between rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 p-3 sm:p-4 flex-wrap gap-3">
//                                 <div>
//                                     <p className="text-xs font-semibold text-white">
//                                         {isExpiringSoon ? 'Renew your subscription' : 'Manage subscription'}
//                                     </p>
//                                     <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                         {isExpiringSoon
//                                             ? 'Select a plan below to renew before expiry'
//                                             : 'Renew early or switch to a different plan'
//                                         }
//                                     </p>
//                                 </div>
//                                 <button
//                                     onClick={() => setShowPlans(p => !p)}
//                                     className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-bold transition-all shrink-0"
//                                 >
//                                     <RefreshCw className="h-3.5 w-3.5" />
//                                     {showPlans ? 'Hide Plans' : 'Renew / Change Plan'}
//                                 </button>
//                             </div>
//                         </>
//                     )}
//                 </CardContent>
//             </Card>

//             {/* ── Plans grid ── */}
//             {showPlans && (
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
//                         <div className="flex items-center gap-3">
//                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                 <Zap className="h-4 w-4 text-school-primary" />
//                             </div>
//                             <div>
//                                 <CardTitle className="text-sm font-bold text-white">
//                                     {sub && sub.status === 'active' ? 'Renew or Change Plan' : 'Choose a Plan'}
//                                 </CardTitle>
//                                 <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                     All plans include full platform access · Prices in NGN
//                                 </p>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent className="p-4 sm:p-6 space-y-4">

//                         {/* Info */}
//                         <div className="flex items-start gap-2 rounded-lg border border-school-secondary-700 bg-school-secondary-800/50 px-3 py-2.5">
//                             <Info className="h-3.5 w-3.5 text-school-primary shrink-0 mt-0.5" />
//                             <p className="text-[11px] text-school-secondary-400 leading-relaxed">
//                                 {sub && sub.status === 'active'
//                                     ? `Your current plan expires on ${format(new Date(sub.currentPeriodEnd), 'dd MMM yyyy')}. Renewing now extends from the current expiry date.`
//                                     : 'Click a plan to proceed to Paystack. Subscription activates immediately after payment confirmation.'
//                                 }
//                             </p>
//                         </div>

//                         {/* Plans */}
//                         {plansLoading ? (
//                             <div className="flex items-center justify-center py-10 gap-2">
//                                 <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
//                                 <span className="text-xs text-school-secondary-400">Loading plans...</span>
//                             </div>
//                         ) : plans.length === 0 ? (
//                             <p className="text-xs text-school-secondary-400 text-center py-8">
//                                 No plans available. Contact support.
//                             </p>
//                         ) : (
//                             <div className="grid gap-4 sm:grid-cols-3 pt-2">
//                                 {plans.map(plan => (
//                                     <PlanCard
//                                         key={plan.id}
//                                         plan={plan}
//                                         onSelect={handleSelectPlan}
//                                         loading={paying}
//                                         selected={selected}
//                                     />
//                                 ))}
//                             </div>
//                         )}

//                         {/* Trust indicators */}
//                         <div className="grid gap-3 sm:grid-cols-3 pt-1">
//                             {[
//                                 { icon: Shield,       label: 'Secure',   desc: 'Payments via Paystack'     },
//                                 { icon: Zap,          label: 'Instant',  desc: 'Activates on confirmation' },
//                                 { icon: CheckCircle2, label: 'Flexible', desc: 'No lock-in contracts'      },
//                             ].map(item => (
//                                 <div
//                                     key={item.label}
//                                     className="flex items-center gap-2.5 rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 px-3 py-2.5"
//                                 >
//                                     <item.icon className="h-4 w-4 text-school-primary shrink-0" />
//                                     <div>
//                                         <p className="text-[11px] font-bold text-white">{item.label}</p>
//                                         <p className="text-[10px] text-school-secondary-500">{item.desc}</p>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </CardContent>
//                 </Card>
//             )}

//             {/* ── Payment history ── */}
//             {hasHistory && (
//                 <Card className="bg-school-secondary-900 border-school-secondary-700">
//                     <CardHeader className="px-4 sm:px-6 py-4">
//                         <button
//                             onClick={() => setShowHistory(p => !p)}
//                             className="flex items-center justify-between w-full"
//                         >
//                             <div className="flex items-center gap-3">
//                                 <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
//                                     <History className="h-4 w-4 text-school-primary" />
//                                 </div>
//                                 <div className="text-left">
//                                     <CardTitle className="text-sm font-bold text-white">
//                                         Payment History
//                                     </CardTitle>
//                                     <p className="text-[11px] text-school-secondary-400 mt-0.5">
//                                         {successTxCount} successful payment{successTxCount !== 1 ? 's' : ''}
//                                         {' · '}
//                                         {sub?.transactions?.length ?? 0} total transactions
//                                     </p>
//                                 </div>
//                             </div>
//                             {showHistory
//                                 ? <ChevronUp   className="h-4 w-4 text-school-secondary-400" />
//                                 : <ChevronDown className="h-4 w-4 text-school-secondary-400" />
//                             }
//                         </button>
//                     </CardHeader>

//                     {showHistory && (
//                         <CardContent className="p-0">
//                             <div className="border-t border-school-secondary-700 divide-y divide-school-secondary-800">
//                                 {(sub?.transactions ?? []).map((entry, i) => (
//                                     <PaymentRow key={`${entry.id}-${i}`} entry={entry} />
//                                 ))}
//                             </div>
//                         </CardContent>
//                     )}
//                 </Card>
//             )}

//         </div>
//     )
// }


'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
    CreditCard, CheckCircle2, Clock, AlertTriangle,
    Loader2, Star, Shield, Zap, Info,
    History, ChevronDown, ChevronUp, XCircle,
    RefreshCw, ArrowRight
} from 'lucide-react'
import {
    initiateSubscriptionPayment,
    getSubscriptionPlans,
    getSchoolSubscription,
    type SubscriptionPlan,
    type SubscriptionWithHistory,
    type PaymentHistoryEntry,
} from '@/app/actions/subscription.actions'
import { type SchoolSettingsData } from '@/app/actions/school-settings.action'
import { useProfileStore } from '@/store/profileStore'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { getErrorMessage } from '@/lib/error-handler'

// ── Helpers ────────────────────────────────────────────────────────────────────

function daysUntilExpiry(date: Date): number {
    return Math.ceil(
        (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    )
}

function getStatusConfig(status: string) {
    switch (status.toLowerCase()) {
        case 'active':
            return { color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2, label: 'Active' }
        case 'trialing':
            return { color: 'text-school-primary', bg: 'bg-school-primary/10', border: 'border-school-primary/20', icon: Clock, label: 'Trial' }
        case 'past_due':
            return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertTriangle, label: 'Past Due' }
        case 'pending':
            return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock, label: 'Pending' }
        default:
            return { color: 'text-school-secondary-400', bg: 'bg-school-secondary-800', border: 'border-school-secondary-700', icon: CreditCard, label: status }
    }
}

// ── Plan Card ──────────────────────────────────────────────────────────────────

function PlanCard({
    plan, onSelect, loading, selected,
}: {
    plan: SubscriptionPlan
    onSelect: (id: string) => void
    loading: boolean
    selected: string | null
}) {
    const isThisLoading = selected === plan.id && loading
    const isOtherLoading = loading && selected !== plan.id

    return (
        <div className={cn(
            'relative rounded-xl border p-4 space-y-3 transition-all',
            plan.popular
                ? 'border-school-primary/40 bg-school-primary/5'
                : 'border-school-secondary-600 bg-school-secondary-800/30',
            isOtherLoading && 'opacity-40 pointer-events-none'
        )}>
            {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-school-primary px-3 py-0.5 text-[10px] font-black text-school-secondary-950">
                        <Star className="h-2.5 w-2.5" />
                        BEST VALUE
                    </span>
                </div>
            )}

            <div>
                <p className="text-[10px] font-semibold text-school-secondary-500 uppercase tracking-wider">
                    {plan.name}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-xl font-black text-white">
                        ₦{plan.priceNGN.toLocaleString()}
                    </span>
                    <span className="text-[11px] text-school-secondary-500">
                        /{plan.durationDays === 30 ? 'mo' : plan.durationDays === 90 ? 'term' : 'yr'}
                    </span>
                </div>
                <p className="text-[10px] text-school-secondary-500 mt-0.5">
                    ≈ ${plan.priceUSD} USD
                </p>
                <p className="text-[11px] text-school-secondary-400 mt-1">
                    {plan.description}
                </p>
            </div>

            <div className="space-y-1">
                {plan.features.map(f => (
                    <div key={f} className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3 w-3 text-school-primary shrink-0" />
                        <span className="text-[11px] text-school-secondary-300">{f}</span>
                    </div>
                ))}
            </div>

            <button
                onClick={() => onSelect(plan.id)}
                disabled={loading}
                className={cn(
                    'w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50',
                    plan.popular
                        ? 'bg-school-primary hover:bg-school-primary-600 text-school-secondary-950'
                        : 'bg-school-secondary-700 hover:bg-school-secondary-600 text-white border border-school-secondary-600'
                )}
            >
                {isThisLoading ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" />Processing...</>
                ) : (
                    <>Select this plan <ArrowRight className="h-3 w-3" /></>
                )}
            </button>
        </div>
    )
}

// ── Payment History Row ────────────────────────────────────────────────────────

function PaymentRow({ entry }: { entry: PaymentHistoryEntry }) {
    const isSuccess = entry.status === 'SUCCESS'
    const isPending = entry.status === 'PENDING'

    return (
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-school-secondary-800/40 transition-colors">
            <div className={cn(
                'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
                isSuccess ? 'bg-green-500/10 border-green-500/20'
                    : isPending ? 'bg-amber-500/10 border-amber-500/20'
                        : 'bg-red-500/10 border-red-500/20'
            )}>
                {isSuccess
                    ? <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                    : isPending
                        ? <Clock className="h-3.5 w-3.5 text-amber-400" />
                        : <XCircle className="h-3.5 w-3.5 text-red-400" />
                }
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">
                    {entry.planName}
                </p>
                <p className="text-[10px] text-school-secondary-500">
                    {entry.paidAt
                        ? format(new Date(entry.paidAt), 'dd MMM yyyy · HH:mm')
                        : format(new Date(entry.createdAt), 'dd MMM yyyy · HH:mm')
                    }
                </p>
            </div>

            <div className="text-right shrink-0">
                <p className="text-xs font-bold text-white">
                    {entry.amountNGN === 0 ? 'Free' : `₦${entry.amountNGN.toLocaleString()}`}
                </p>
                <span className={cn(
                    'text-[10px] font-semibold',
                    isSuccess ? 'text-green-400' :
                        isPending ? 'text-amber-400' : 'text-red-400'
                )}>
                    {entry.status.charAt(0) + entry.status.slice(1).toLowerCase()}
                </span>
            </div>
        </div>
    )
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function BillingSection({ data }: { data: SchoolSettingsData }) {
    const { profile } = useProfileStore()
    const schoolId = profile?.schoolId ?? ''

    const [sub, setSub] = useState<SubscriptionWithHistory | null>(() => {
        // Initialize state with data passed from props to ensure usage of 'data' variable
        if (data.school.subscription) {
            return data.school.subscription as unknown as SubscriptionWithHistory
        }
        return null
    })

    const [plans, setPlans] = useState<SubscriptionPlan[]>([])
    const [subLoading, setSubLoading] = useState(!data.school.subscription)
    const [plansLoading, setPlansLoading] = useState(false)
    const [showPlans, setShowPlans] = useState(false)
    const [showHistory, setShowHistory] = useState(false)
    const [paying, setPaying] = useState(false)
    const [selected, setSelected] = useState<string | null>(null)

    useEffect(() => {
        if (!schoolId) return
        
        const fetchFullSub = async () => {
            try {
                // Fetch full data including transactions not present in initial 'data' prop
                const s = await getSchoolSubscription(schoolId)
                if (s) {
                    setSub(s)
                    if (s.status !== 'active') setShowPlans(true)
                }
            } finally {
                setSubLoading(false)
            }
        }
        fetchFullSub()
    }, [schoolId])

    useEffect(() => {
        if (!showPlans || plans.length > 0) return
        setPlansLoading(true)
        getSubscriptionPlans()
            .then(setPlans)
            .finally(() => setPlansLoading(false))
    }, [showPlans, plans.length])

    async function handleSelectPlan(planId: string) {
        if (!schoolId) { toast.error('School not found.'); return }
        setSelected(planId)
        setPaying(true)

        try {
            const result = await initiateSubscriptionPayment(schoolId, planId)
            if (result.success && result.authorizationUrl) {
                window.location.href = result.authorizationUrl
            } else if (result.success && !result.authorizationUrl) {
                toast.success('Subscription activated!')
                const updated = await getSchoolSubscription(schoolId)
                setSub(updated)
                setShowPlans(false)
            } else {
                toast.error(result.error ?? 'Failed to initiate payment.')
            }
        } catch (err) {
            toast.error('A network error occurred.')
            getErrorMessage(err)
        } finally {
            setPaying(false)
            setSelected(null)
        }
    }

    const daysLeft = sub?.currentPeriodEnd ? daysUntilExpiry(sub.currentPeriodEnd) : null
    const isActive = sub?.status === 'active'
    const isExpiringSoon = isActive && daysLeft !== null && daysLeft <= 7
    const hasHistory = (sub?.transactions?.length ?? 0) > 0
    const successTxCount = sub?.transactions?.filter(t => t.status === 'SUCCESS').length ?? 0

    if (subLoading && !sub) return (
        <Card className="bg-school-secondary-900 border-school-secondary-700">
            <CardContent className="flex items-center justify-center py-16 gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-school-primary" />
                <span className="text-sm text-school-secondary-400">Loading billing data...</span>
            </CardContent>
        </Card>
    )

    return (
        <div className="space-y-4 animate-in fade-in duration-500">
            {/* Header utilizing 'data' to ensure usage and show school context */}
            <div className="flex items-center gap-2 px-2">
                <Shield className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Institutional Billing Ledger: {data.school.name}
                </span>
            </div>

            <Card className="bg-school-secondary-900 border-school-secondary-700">
                <CardHeader className="pb-3 border-b border-school-secondary-700 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-school-primary/20 border border-school-primary/20">
                            <CreditCard className="h-4 w-4 text-school-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-sm font-bold text-white uppercase tracking-tight">
                                Current Subscription
                            </CardTitle>
                            <p className="text-[11px] text-school-secondary-400 mt-0.5 font-medium">
                                Secured via Paystack Gateway
                            </p>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4">
                    {!sub || sub.status === 'pending' ? (
                        <div className="flex flex-col items-center justify-center py-8 gap-3 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-school-secondary-800 border border-school-secondary-700 shadow-inner">
                                <CreditCard className="h-7 w-7 text-school-secondary-500" />
                            </div>
                            <p className="text-sm font-bold text-white uppercase italic">No active subscription found</p>
                            <p className="text-xs text-school-secondary-400 max-w-xs leading-relaxed">
                                Unlock full institutional features including AI lesson generation and parent WhatsApp reporting.
                            </p>
                            <button
                                onClick={() => setShowPlans(true)}
                                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-school-primary/10"
                            >
                                <Zap className="h-3.5 w-3.5 fill-current" />
                                View Plans
                            </button>
                        </div>
                    ) : (
                        <>
                            {isExpiringSoon && (
                                <div className={cn(
                                    'flex items-start gap-3 rounded-xl border px-4 py-3 animate-pulse',
                                    daysLeft! <= 1 ? 'bg-red-500/10 border-red-500/20' : 'bg-amber-500/10 border-amber-500/20'
                                )}>
                                    <AlertTriangle className={cn('h-4 w-4 shrink-0 mt-0.5', daysLeft! <= 1 ? 'text-red-400' : 'text-amber-400')} />
                                    <div className="flex-1 min-w-0">
                                        <p className={cn('text-xs font-black uppercase', daysLeft! <= 1 ? 'text-red-400' : 'text-amber-400')}>
                                            {daysLeft! <= 0 ? 'Subscription Expired' : daysLeft === 1 ? 'Expires Today' : `Expires in ${daysLeft} days`}
                                        </p>
                                        <p className="text-[11px] text-school-secondary-400 mt-0.5 font-medium italic">
                                            Renew to maintain service continuity.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowPlans(true)}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-school-primary text-school-secondary-950 text-[10px] font-black uppercase transition-all"
                                    >
                                        <RefreshCw className="h-3 w-3" /> Renew
                                    </button>
                                </div>
                            )}

                            {(() => {
                                const config = getStatusConfig(sub.status)
                                const Icon = config.icon
                                return (
                                    <div className={cn('flex items-center gap-4 rounded-xl border px-4 py-4', config.bg, config.border)}>
                                        <div className={cn('p-2 rounded-lg bg-slate-950/40 border border-white/5', config.color)}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={cn('text-xs font-black uppercase tracking-widest', config.color)}>{config.label}</p>
                                            <p className="text-sm font-bold text-white mt-0.5">{sub.plan} Tier</p>
                                        </div>
                                        {daysLeft !== null && daysLeft > 0 && (
                                            <div className="text-right">
                                                <p className={cn('text-lg font-black leading-none', config.color)}>{daysLeft}</p>
                                                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 tracking-widest">Days Left</p>
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}

                            <div className="grid gap-3 sm:grid-cols-3">
                                {[
                                    { label: 'Current Plan', value: sub.plan },
                                    { label: 'Cycle Status', value: getStatusConfig(sub.status).label },
                                    { label: 'Next Renewal', value: format(new Date(sub.currentPeriodEnd), 'dd MMM yyyy') },
                                ].map(item => (
                                    <div key={item.label} className="rounded-xl border border-school-secondary-700 bg-school-secondary-800/50 p-3 shadow-inner">
                                        <p className="text-[9px] font-black text-school-secondary-500 uppercase tracking-widest mb-1">{item.label}</p>
                                        <p className="text-sm font-bold text-white uppercase italic">{item.value}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center justify-between rounded-xl border border-school-secondary-700 bg-school-secondary-800/30 p-4 flex-wrap gap-4 group hover:border-school-primary/20 transition-all">
                                <div>
                                    <p className="text-xs font-bold text-white uppercase tracking-tight">Upgrade or Change Plan</p>
                                    <p className="text-[11px] text-school-secondary-400 mt-1 font-medium italic">Adjust your access level for the next billing cycle.</p>
                                </div>
                                <button
                                    onClick={() => setShowPlans(p => !p)}
                                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-school-secondary-700 hover:bg-school-secondary-600 text-white text-[10px] font-black uppercase tracking-widest transition-all"
                                >
                                    <Zap className="h-3.5 w-3.5 text-school-primary fill-current" />
                                    {showPlans ? 'Hide Options' : 'Modify Tier'}
                                </button>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {showPlans && (
                <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                    <div className="flex items-start gap-3 rounded-2xl border border-school-primary/15 bg-slate-900 p-5 shadow-2xl">
                        <Info className="h-5 w-5 text-school-primary shrink-0 mt-0.5" />
                        <p className="text-[11px] text-slate-400 leading-relaxed font-medium italic">
                            All plan extensions are calculated from your current expiry date. Transitioning to a new tier will apply immediately.
                        </p>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-3">
                        {plansLoading ? (
                            [1, 2, 3].map(i => <div key={i} className="h-48 rounded-2xl bg-school-secondary-900 animate-pulse border border-white/5" />)
                        ) : (
                            plans.map(plan => (
                                <PlanCard key={plan.id} plan={plan} onSelect={handleSelectPlan} loading={paying} selected={selected} />
                            ))
                        )}
                    </div>
                </div>
            )}

            {hasHistory && (
                <Card className="bg-school-secondary-900 border-school-secondary-700 rounded-[1.5rem] overflow-hidden">
                    <button onClick={() => setShowHistory(p => !p)} className="flex items-center justify-between w-full p-6 hover:bg-white/[0.02] transition-all">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-slate-950 rounded-lg border border-white/5 shadow-inner">
                                <History className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-white uppercase tracking-tighter italic">Accounting History</p>
                                <p className="text-[10px] text-school-secondary-500 font-bold uppercase mt-0.5">
                                    {successTxCount} Settled · {sub?.transactions?.length ?? 0} Total Records
                                </p>
                            </div>
                        </div>
                        {showHistory ? <ChevronUp className="h-4 w-4 text-slate-500" /> : <ChevronDown className="h-4 w-4 text-slate-500" />}
                    </button>

                    {showHistory && (
                        <div className="border-t border-school-secondary-700 divide-y divide-school-secondary-800 bg-slate-950/20">
                            {(sub?.transactions ?? []).map((entry, i) => (
                                <PaymentRow key={`${entry.id}-${i}`} entry={entry} />
                            ))}
                        </div>
                    )}
                </Card>
            )}
        </div>
    )
}