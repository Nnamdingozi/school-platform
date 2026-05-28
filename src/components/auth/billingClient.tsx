// 'use client'

// import { useState, useTransition } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import {
//     CreditCard,
//     ShieldAlert,
//     School,
//     User,
//     Lock,
//     Loader2,
//     LogOut,
// } from 'lucide-react'
// import {
//     initiateIndividualPayment,
//     initiateSubscriptionPayment,
//     type SubscriptionPlanItem,
// } from '@/app/actions/subscription.actions'
// import { logoutAction } from '@/app/actions/auth'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// interface BillingProfile {
//     schoolId: string | null
//     school?: { name: string } | null
// }

// interface BillingTerminalProps {
//     profile: BillingProfile
//     plans: SubscriptionPlanItem[]
//     canPay: boolean
//     isInstitutional: boolean
// }

// /**
//  * RE-ACTIVATION TERMINAL (Tier 2/3)
//  * Rule 12: Server-fetched profile and plans passed as props.
//  * Rule 13: Graceful tier fallbacks for non-admin staff.
//  * Rule 17: Branding via school-primary design tokens.
//  */
// export function BillingTerminalClient({
//     profile,
//     plans,
//     canPay,
//     isInstitutional,
// }: BillingTerminalProps) {
//     const [isPending, startTransition] = useTransition()
//     const [activePlanId, setActivePlanId] = useState<string | null>(null)

//     const handlePayment = (planId: string) => {
//         setActivePlanId(planId)
//         startTransition(async () => {
//             try {
//                 const res = !isInstitutional
//                     ? await initiateIndividualPayment(planId)
//                     : await initiateSubscriptionPayment(profile.schoolId!, planId)

//                 if (res.success && res.authorizationUrl) {
//                     window.location.href = res.authorizationUrl
//                 } else {
//                     toast.error(res.error || 'Gateway connection failed.')
//                     setActivePlanId(null)
//                 }
//             } catch {
//                 toast.error('A registry error occurred.')
//                 setActivePlanId(null)
//             }
//         })
//     }

//     const handleLogout = async () => {
//         await logoutAction()
//     }

//     return (
//         <div className="max-w-5xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-700">
//             <div className="text-center space-y-4">
//                 <div className="h-20 w-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6 shadow-2xl">
//                     <ShieldAlert className="h-10 w-10 animate-pulse" />
//                 </div>
//                 <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground">
//                     Access Suspended
//                 </h1>
//                 <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-black">
//                     {isInstitutional
//                         ? `Institutional Lock: ${profile.school?.name ?? 'Registry'}`
//                         : 'Personal Learning Node Expired'}
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//                 <aside className="lg:col-span-1 space-y-6">
//                     <Card className="bg-card border-border p-8 rounded-[2.5rem] shadow-2xl">
//                         <CardHeader className="p-0 mb-6">
//                             <CardTitle className="text-lg font-black uppercase italic text-foreground flex items-center gap-3">
//                                 <Lock className="h-5 w-5 text-school-primary" />
//                                 Logic Restricted
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-0 space-y-6">
//                             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-loose">
//                                 Academic modules, AI synthesis engine, and digitized question registries are
//                                 currently encrypted. Full bidirectional sync will restore upon license
//                                 verification.
//                             </p>

//                             {!canPay && (
//                                 <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl">
//                                     <p className="text-amber-500 text-[10px] font-black uppercase leading-normal italic">
//                                         Protocol: Only the designated Registry Administrator can initialize
//                                         license renewal. Please contact management.
//                                     </p>
//                                 </div>
//                             )}

//                             <div className="flex items-center gap-4 text-[10px] font-black uppercase text-muted-foreground border-t border-border pt-6">
//                                 {isInstitutional ? (
//                                     <>
//                                         <School className="h-4 w-4" />
//                                         Institutional Node
//                                     </>
//                                 ) : (
//                                     <>
//                                         <User className="h-4 w-4" />
//                                         Individual Node
//                                     </>
//                                 )}
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <button
//                         type="button"
//                         onClick={handleLogout}
//                         className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
//                     >
//                         <LogOut className="h-3 w-3" />
//                         Terminate Current Session
//                     </button>
//                 </aside>

//                 <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                     {canPay ? (
//                         plans.map((plan) => (
//                             <PlanCard
//                                 key={plan.id}
//                                 plan={plan}
//                                 isPending={isPending}
//                                 isActive={activePlanId === plan.id}
//                                 onPay={() => handlePayment(plan.id)}
//                             />
//                         ))
//                     ) : (
//                         <div className="col-span-full h-full border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-40 grayscale">
//                             <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
//                             <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
//                                 Awaiting Administrative License Update
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// interface PlanCardProps {
//     plan: SubscriptionPlanItem
//     isPending: boolean
//     isActive: boolean
//     onPay: () => void
// }

// function PlanCard({ plan, isPending, isActive, onPay }: PlanCardProps) {
//     return (
//         <Card className="bg-card border-border hover:border-school-primary/30 transition-all p-8 rounded-[2.5rem] flex flex-col justify-between group shadow-xl">
//             <div className="space-y-6">
//                 <div className="flex justify-between items-start gap-4">
//                     <div className="space-y-1 min-w-0">
//                         <h3 className="font-black uppercase italic text-foreground text-xl tracking-tighter truncate">
//                             {plan.name}
//                         </h3>
//                         <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
//                             {plan.durationDays} Days Registry Sync
//                         </p>
//                     </div>
//                     <p className="text-2xl font-black italic text-school-primary shrink-0">
//                         ₦{plan.priceNGN.toLocaleString()}
//                     </p>
//                 </div>

//                 <ul className="space-y-3">
//                     {plan.features.slice(0, 3).map((feature) => (
//                         <li
//                             key={feature}
//                             className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-2"
//                         >
//                             <span className="h-1 w-1 rounded-full bg-school-primary shrink-0" />
//                             {feature}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <Button
//                 onClick={onPay}
//                 disabled={isPending}
//                 className={cn(
//                     'w-full mt-10 bg-school-primary text-on-school-primary font-black rounded-2xl py-7',
//                     'text-[10px] tracking-widest uppercase shadow-2xl transition-all hover:scale-[1.02]',
//                     'hover:bg-school-primary/90 disabled:opacity-50',
//                 )}
//             >
//                 {isPending && isActive ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                     <>
//                         <CreditCard className="h-4 w-4 mr-2" />
//                         Restore Logic Sync
//                     </>
//                 )}
//             </Button>
//         </Card>
//     )
// }




// 'use client'

// import React, { useState, useTransition } from 'react'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import {
//     CreditCard,
//     ShieldAlert,
//     School,
//     User,
//     Lock,
//     Loader2,
//     LogOut,
//     CheckCircle2
// } from 'lucide-react'
// import {
//     initiateIndividualPayment,
//     initiateSubscriptionPayment,
//     type SubscriptionPlanItem,
// } from '@/app/actions/subscription.actions'
// import { logoutAction } from '@/app/actions/auth'
// import { toast } from 'sonner'
// import { cn } from '@/lib/utils'

// // ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

// interface BillingProfile {
//     schoolId: string | null
//     school?: { name: string } | null
// }

// interface BillingTerminalProps {
//     profile: BillingProfile
//     plans: SubscriptionPlanItem[]
//     canPay: boolean
//     isInstitutional: boolean
// }

// /**
//  * RE-ACTIVATION TERMINAL (Tier 2/3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function BillingTerminalClient({
//     profile,
//     plans,
//     canPay,
//     isInstitutional,
// }: BillingTerminalProps) {
//     const [isPending, startTransition] = useTransition()
//     const [activePlanId, setActivePlanId] = useState<string | null>(null)

//     const handlePayment = (planId: string) => {
//         setActivePlanId(planId)
//         startTransition(async () => {
//             try {
//                 const res = !isInstitutional
//                     ? await initiateIndividualPayment(planId)
//                     : await initiateSubscriptionPayment(profile.schoolId!, planId)

//                 if (res.success && res.authorizationUrl) {
//                     window.location.href = res.authorizationUrl
//                 } else {
//                     toast.error(res.error || 'Gateway protocol failed.')
//                     setActivePlanId(null)
//                 }
//             } catch {
//                 toast.error('Registry synchronization error.')
//                 setActivePlanId(null)
//             }
//         })
//     }

//     const handleLogout = async () => {
//         await logoutAction()
//     }

//     return (
//         <div className="max-w-5xl mx-auto w-full space-y-12 animate-in fade-in zoom-in-95 duration-700">
            
//             {/* ── SECURITY HEADER (Rule 11) ── */}
//             <div className="text-center space-y-4">
//                 <div className="h-20 w-20 bg-destructive/10 border border-destructive/20 rounded-full flex items-center justify-center mx-auto text-destructive mb-6 shadow-xl">
//                     <ShieldAlert className="h-10 w-10 animate-pulse" />
//                 </div>
//                 <h1 className="text-4xl md:text-6xl font-extrabold uppercase italic tracking-tighter text-foreground">
//                     Access Suspended
//                 </h1>
//                 <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">
//                     {isInstitutional
//                         ? `Institutional Lock: ${profile.school?.name ?? 'Registry Node'}`
//                         : 'Personal Learning Node Expired'}
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
//                 {/* ── STATUS ASIDE ── */}
//                 <aside className="lg:col-span-1 space-y-6">
//                     <Card className="bg-card border-border p-6 md:p-8 rounded-[2rem] shadow-xl">
//                         <CardHeader className="p-0 mb-6">
//                             <CardTitle className="text-lg font-extrabold uppercase italic text-foreground flex items-center gap-3">
//                                 <Lock className="h-5 w-5 text-school-primary" />
//                                 Logic Restricted
//                             </CardTitle>
//                         </CardHeader>
//                         <CardContent className="p-0 space-y-6">
//                             <p className="text-muted-foreground text-[10px] font-semibold uppercase tracking-widest leading-loose italic">
//                                 Academic modules, AI synthesis engine, and digitized registries are
//                                 currently encrypted. Bidirectional sync will restore upon license
//                                 verification.
//                             </p>

//                             {!canPay && (
//                                 <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl">
//                                     <p className="text-amber-600 text-[10px] font-bold uppercase leading-normal italic">
//                                         Protocol: Only the designated Registrar can initialize
//                                         license renewal. Please contact institutional management.
//                                     </p>
//                                 </div>
//                             )}

//                             <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-widest text-muted-foreground border-t border-border pt-6">
//                                 {isInstitutional ? (
//                                     <>
//                                         <School className="h-4 w-4 text-school-primary/60" />
//                                         Institutional Node
//                                     </>
//                                 ) : (
//                                     <>
//                                         <User className="h-4 w-4 text-school-primary/60" />
//                                         Individual Node
//                                     </>
//                                 )}
//                             </div>
//                         </CardContent>
//                     </Card>

//                     <button
//                         type="button"
//                         onClick={handleLogout}
//                         className="w-full flex items-center justify-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all active:scale-95"
//                     >
//                         <LogOut className="h-4 w-4" />
//                         Terminate Session
//                     </button>
//                 </aside>

//                 {/* ── PLAN SELECTION (Rule 20/21) ── */}
//                 <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {canPay ? (
//                         plans.map((plan) => (
//                             <PlanCard
//                                 key={plan.id}
//                                 plan={plan}
//                                 isPending={isPending}
//                                 isActive={activePlanId === plan.id}
//                                 onPay={() => handlePayment(plan.id)}
//                             />
//                         ))
//                     ) : (
//                         <div className="col-span-full h-full border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center p-12 bg-surface/50">
//                             <ShieldAlert className="h-12 w-12 text-muted-foreground/20 mb-4" />
//                             <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest italic leading-relaxed">
//                                 Awaiting Administrative License Update<br />Registry is Read-Only
//                             </p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </div>
//     )
// }

// // ── Sub-Components (Rule 11/19) ─────────────────────────────────────────────

// interface PlanCardProps {
//     plan: SubscriptionPlanItem
//     isPending: boolean
//     isActive: boolean
//     onPay: () => void
// }

// function PlanCard({ plan, isPending, isActive, onPay }: PlanCardProps) {
//     return (
//         <Card className="bg-card border-border hover:border-school-primary/40 transition-all p-8 rounded-[2rem] flex flex-col justify-between group shadow-xl">
//             <div className="space-y-8">
//                 <div className="flex justify-between items-start gap-4">
//                     <div className="space-y-1 min-w-0">
//                         <h3 className="font-extrabold uppercase italic text-foreground text-xl tracking-tighter truncate">
//                             {plan.name}
//                         </h3>
//                         <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
//                             {plan.durationDays} Days Registry Sync
//                         </p>
//                     </div>
//                     {/* Rule 21: Price using high-contrast branding */}
//                     <p className="text-2xl font-extrabold italic text-school-primary tracking-tighter shrink-0">
//                         ₦{plan.priceNGN.toLocaleString()}
//                     </p>
//                 </div>

//                 <ul className="space-y-3 pt-6 border-t border-border">
//                     {plan.features.slice(0, 4).map((feature) => (
//                         <li
//                             key={feature}
//                             className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest flex items-center gap-3"
//                         >
//                             <CheckCircle2 className="h-4 w-4 text-school-primary shrink-0" />
//                             {feature}
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             <button
//                 onClick={onPay}
//                 disabled={isPending}
//                 className={cn(
//                     'w-full mt-10 rounded-2xl py-5 transition-all active:scale-95 shadow-lg',
//                     'bg-school-primary text-on-school-primary font-extrabold text-[10px] tracking-widest uppercase',
//                     'hover:brightness-110 shadow-school-primary-200 disabled:opacity-20'
//                 )}
//             >
//                 {isPending && isActive ? (
//                     <Loader2 className="h-5 w-5 animate-spin mx-auto" />
//                 ) : (
//                     <div className="flex items-center justify-center gap-2">
//                         <CreditCard className="h-4 w-4" />
//                         Restore Logic Sync
//                     </div>
//                 )}
//             </button>
//         </Card>
//     )
// }



'use client'

import React, { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
    ShieldAlert, Lock, CreditCard, 
    Loader2, LogOut, Mail, UserCheck, 
    Zap, ChevronRight 
} from 'lucide-react'
import { 
    initiateIndividualPayment, 
    initiateSubscriptionPayment,
    type SubscriptionPlanItem
} from '@/app/actions/subscription.actions'
import { logoutAction } from '@/app/actions/auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BillingTerminalProps {
    profile: {
        id: string;
        name: string | null;
        email: string;
        schoolId: string | null;
        schoolName: string;
    };
    plans: SubscriptionPlanItem[];
    canPay: boolean;
    isInstitutional: boolean;
    adminContact?: { name: string | null; email: string } | null;
}

/**
 * RE-ACTIVATION TERMINAL (Tier 2/3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for mathematical brand tints (-50, -100).
 */
export function BillingTerminalClient({ 
    profile, plans, canPay, isInstitutional, adminContact 
}: BillingTerminalProps) {
    const [isPending, startTransition] = useTransition();
    const [activePlanId, setActivePlanId] = useState<string | null>(null);

    const handlePayment = (planId: string) => {
        setActivePlanId(planId);
        startTransition(async () => {
            try {
                const res = !isInstitutional
                    ? await initiateIndividualPayment(planId)
                    : await initiateSubscriptionPayment(profile.schoolId!, planId);

                if (res.success && res.authorizationUrl) {
                    window.location.href = res.authorizationUrl;
                } else {
                    toast.error("Gateway Protocol Error: Initialization failed.");
                    setActivePlanId(null);
                }
            } catch {
                toast.error("Registry connection failure.");
                setActivePlanId(null);
            }
        });
    };

    return (
        <div className="max-w-5xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-700">
            
            {/* ── SECURITY STATUS ── */}
            <div className="text-center space-y-4">
                <div className="h-20 w-20 bg-destructive-50 border border-destructive-200 rounded-full flex items-center justify-center mx-auto text-destructive mb-6 shadow-xl shadow-destructive-100">
                    <ShieldAlert className="h-10 w-10 animate-pulse" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                    Access Suspended
                </h1>
                <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-bold">
                    {isInstitutional 
                        ? `Institutional Hub Locked: ${profile.schoolName}` 
                        : "Personal Hub Expired"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* ── LOGIC RESTRICTION INFO (Rule 19/21) ── */}
                <aside className="lg:col-span-1 space-y-6">
                    <Card className="bg-card border-border p-6 md:p-8 rounded-[2rem] shadow-xl relative overflow-hidden">
                        {/* Rule 21 Scale Decoration */}
                        <div className="absolute top-0 right-0 w-24 h-24 bg-school-primary-50 rounded-full blur-3xl opacity-50" />
                        
                        <div className="relative z-10 space-y-8">
                            <div className="flex items-center gap-3 border-b border-border pb-4">
                                <Lock className="h-5 w-5 text-school-primary" />
                                <h3 className="text-sm font-extrabold uppercase italic tracking-widest text-foreground">Logic Restricted</h3>
                            </div>

                            <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-widest leading-loose italic opacity-80">
                                Academic modules, AI synthesis hubs, and identity registries are
                                currently encrypted. Full bidirectional sync will restore upon license
                                verification.
                            </p>

                            {/* Rule 6: Contextual Info for non-admins */}
                            {!canPay && adminContact && (
                                <div className="bg-surface border border-border p-5 rounded-2xl space-y-4 shadow-inner">
                                    <div className="flex items-center gap-2 text-school-primary">
                                        <UserCheck className="h-4 w-4" />
                                        <p className="text-[9px] font-extrabold uppercase tracking-widest">Hub Administrator</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs font-extrabold text-foreground uppercase italic">{adminContact.name}</p>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
                                            <Mail className="h-3 w-3 text-school-primary-400" /> {adminContact.email}
                                        </div>
                                    </div>
                                    <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-normal">
                                        Contact your Hub Manager to restore institutional registry access.
                                    </p>
                                </div>
                            )}

                            <button
                                onClick={() => logoutAction()}
                                className="w-full flex items-center justify-center gap-3 pt-4 text-[10px] font-bold text-muted-foreground hover:text-destructive transition-all group"
                            >
                                <LogOut className="h-4 w-4 group-hover:scale-110" />
                                Terminate Session Hub
                            </button>
                        </div>
                    </Card>
                </aside>

                {/* ── LICENSE TIER HUB (Rule 20/21) ── */}
                <div className="lg:col-span-2 space-y-6">
                    {canPay ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {plans.map((plan) => (
                                <Card key={plan.id} className="bg-card border-border p-8 rounded-[2rem] flex flex-col justify-between group hover:border-school-primary-200 transition-all shadow-lg">
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="space-y-1">
                                                <h3 className="font-extrabold uppercase italic text-foreground text-xl tracking-tighter">
                                                    {plan.name}
                                                </h3>
                                                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">
                                                    {plan.durationDays} Days Global Sync
                                                </p>
                                            </div>
                                            <p className="text-2xl font-extrabold italic text-school-primary tabular-nums">
                                                ₦{plan.priceNGN.toLocaleString()}
                                            </p>
                                        </div>
                                        <ul className="space-y-3 pt-6 border-t border-border">
                                            {plan.features.slice(0, 4).map((f: string) => (
                                                <li key={f} className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-3">
                                                    <Zap className="h-3.5 w-3.5 text-school-primary" /> {f}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={() => handlePayment(plan.id)}
                                        disabled={isPending}
                                        className="w-full mt-10 h-14 bg-school-primary text-on-school-primary font-extrabold rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all disabled:opacity-20 flex items-center justify-center gap-2"
                                    >
                                        {isPending && activePlanId === plan.id ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CreditCard className="h-4 w-4" /> Restore Hub Access
                                            </>
                                        )}
                                    </button>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        /* Read-Only State for non-authority roles */
                        <div className="h-full border-2 border-dashed border-border rounded-[3rem] bg-surface/50 flex flex-col items-center justify-center text-center p-12 space-y-6">
                            <div className="h-16 w-16 bg-card rounded-2xl border border-border flex items-center justify-center shadow-lg">
                                <ShieldAlert className="h-8 w-8 text-muted-foreground/30" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-extrabold text-foreground uppercase italic tracking-tighter">Read-Only Protocol</p>
                                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-relaxed max-w-xs italic">
                                    Awaiting institutional license synchronization. Registry actions are restricted.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}