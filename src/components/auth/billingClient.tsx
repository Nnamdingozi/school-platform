'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    CreditCard,
    ShieldAlert,
    School,
    User,
    Lock,
    Loader2,
    LogOut,
} from 'lucide-react'
import {
    initiateIndividualPayment,
    initiateSubscriptionPayment,
    type SubscriptionPlanItem,
} from '@/app/actions/subscription.actions'
import { logoutAction } from '@/app/actions/auth'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface BillingProfile {
    schoolId: string | null
    school?: { name: string } | null
}

interface BillingTerminalProps {
    profile: BillingProfile
    plans: SubscriptionPlanItem[]
    canPay: boolean
    isInstitutional: boolean
}

/**
 * RE-ACTIVATION TERMINAL (Tier 2/3)
 * Rule 12: Server-fetched profile and plans passed as props.
 * Rule 13: Graceful tier fallbacks for non-admin staff.
 * Rule 17: Branding via school-primary design tokens.
 */
export function BillingTerminalClient({
    profile,
    plans,
    canPay,
    isInstitutional,
}: BillingTerminalProps) {
    const [isPending, startTransition] = useTransition()
    const [activePlanId, setActivePlanId] = useState<string | null>(null)

    const handlePayment = (planId: string) => {
        setActivePlanId(planId)
        startTransition(async () => {
            try {
                const res = !isInstitutional
                    ? await initiateIndividualPayment(planId)
                    : await initiateSubscriptionPayment(profile.schoolId!, planId)

                if (res.success && res.authorizationUrl) {
                    window.location.href = res.authorizationUrl
                } else {
                    toast.error(res.error || 'Gateway connection failed.')
                    setActivePlanId(null)
                }
            } catch {
                toast.error('A registry error occurred.')
                setActivePlanId(null)
            }
        })
    }

    const handleLogout = async () => {
        await logoutAction()
    }

    return (
        <div className="max-w-5xl w-full space-y-12 animate-in fade-in zoom-in-95 duration-700">
            <div className="text-center space-y-4">
                <div className="h-20 w-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto text-red-500 mb-6 shadow-2xl">
                    <ShieldAlert className="h-10 w-10 animate-pulse" />
                </div>
                <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground">
                    Access Suspended
                </h1>
                <p className="text-muted-foreground uppercase tracking-[0.3em] text-[10px] font-black">
                    {isInstitutional
                        ? `Institutional Lock: ${profile.school?.name ?? 'Registry'}`
                        : 'Personal Learning Node Expired'}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="lg:col-span-1 space-y-6">
                    <Card className="bg-card border-border p-8 rounded-[2.5rem] shadow-2xl">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-lg font-black uppercase italic text-foreground flex items-center gap-3">
                                <Lock className="h-5 w-5 text-school-primary" />
                                Logic Restricted
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-6">
                            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-loose">
                                Academic modules, AI synthesis engine, and digitized question registries are
                                currently encrypted. Full bidirectional sync will restore upon license
                                verification.
                            </p>

                            {!canPay && (
                                <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-2xl">
                                    <p className="text-amber-500 text-[10px] font-black uppercase leading-normal italic">
                                        Protocol: Only the designated Registry Administrator can initialize
                                        license renewal. Please contact management.
                                    </p>
                                </div>
                            )}

                            <div className="flex items-center gap-4 text-[10px] font-black uppercase text-muted-foreground border-t border-border pt-6">
                                {isInstitutional ? (
                                    <>
                                        <School className="h-4 w-4" />
                                        Institutional Node
                                    </>
                                ) : (
                                    <>
                                        <User className="h-4 w-4" />
                                        Individual Node
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-foreground transition-all"
                    >
                        <LogOut className="h-3 w-3" />
                        Terminate Current Session
                    </button>
                </aside>

                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                    {canPay ? (
                        plans.map((plan) => (
                            <PlanCard
                                key={plan.id}
                                plan={plan}
                                isPending={isPending}
                                isActive={activePlanId === plan.id}
                                onPay={() => handlePayment(plan.id)}
                            />
                        ))
                    ) : (
                        <div className="col-span-full h-full border-2 border-dashed border-border rounded-[3rem] flex flex-col items-center justify-center text-center p-12 opacity-40 grayscale">
                            <ShieldAlert className="h-12 w-12 text-muted-foreground mb-4" />
                            <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                                Awaiting Administrative License Update
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

interface PlanCardProps {
    plan: SubscriptionPlanItem
    isPending: boolean
    isActive: boolean
    onPay: () => void
}

function PlanCard({ plan, isPending, isActive, onPay }: PlanCardProps) {
    return (
        <Card className="bg-card border-border hover:border-school-primary/30 transition-all p-8 rounded-[2.5rem] flex flex-col justify-between group shadow-xl">
            <div className="space-y-6">
                <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1 min-w-0">
                        <h3 className="font-black uppercase italic text-foreground text-xl tracking-tighter truncate">
                            {plan.name}
                        </h3>
                        <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">
                            {plan.durationDays} Days Registry Sync
                        </p>
                    </div>
                    <p className="text-2xl font-black italic text-school-primary shrink-0">
                        ₦{plan.priceNGN.toLocaleString()}
                    </p>
                </div>

                <ul className="space-y-3">
                    {plan.features.slice(0, 3).map((feature) => (
                        <li
                            key={feature}
                            className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter flex items-center gap-2"
                        >
                            <span className="h-1 w-1 rounded-full bg-school-primary shrink-0" />
                            {feature}
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                onClick={onPay}
                disabled={isPending}
                className={cn(
                    'w-full mt-10 bg-school-primary text-on-school-primary font-black rounded-2xl py-7',
                    'text-[10px] tracking-widest uppercase shadow-2xl transition-all hover:scale-[1.02]',
                    'hover:bg-school-primary/90 disabled:opacity-50',
                )}
            >
                {isPending && isActive ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Restore Logic Sync
                    </>
                )}
            </Button>
        </Card>
    )
}
