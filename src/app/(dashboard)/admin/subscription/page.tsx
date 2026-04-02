'use client'

import { useState, useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { getSchoolSettings, SchoolSettingsData } from '@/app/actions/school-settings.action'
import { BillingSection } from '@/components/settings/billingSection'
import { Loader2, CreditCard, ShieldCheck, Zap } from 'lucide-react'
import { toast } from 'sonner'

export default function BillingPage() {
    const { profile, isLoading: isProfileLoading } = useProfileStore()
    const schoolId = profile?.schoolId ?? ''
    
    const [data, setData] = useState<SchoolSettingsData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!schoolId) return
        setLoading(true)
        getSchoolSettings(schoolId)
            .then(setData)
            .catch(() => toast.error('Failed to load financial registry.'))
            .finally(() => setLoading(false))
    }, [schoolId])

    if (isProfileLoading || loading) return (
        <div className="h-screen flex flex-col items-center justify-center bg-slate-950 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-school-primary" />
            <p className="text-slate-500 font-mono text-xs uppercase tracking-widest animate-pulse">Accessing_Financial_Vault...</p>
        </div>
    )

    if (!data) return null

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-10 bg-slate-950 min-h-screen text-slate-50">
            {/* ── Page Header ── */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-10">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-2xl shadow-school-primary/10">
                        <CreditCard className="h-7 w-7 text-school-primary" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic leading-none text-white">Financial Hub</h1>
                        <p className="text-slate-500 text-sm mt-2 font-medium">Manage institutional subscriptions, billing history, and access tiers.</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 bg-slate-900 px-5 py-2.5 rounded-2xl border border-white/5 w-fit shadow-xl">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">Secure Payment Environment</span>
                </div>
            </header>

            {/* ── Main Subscription Module ── */}
            <main className="max-w-5xl">
                <BillingSection data={data} />
            </main>

            {/* ── Institutional Footer ── */}
            <footer className="pt-10 border-t border-white/5">
                <div className="flex items-center gap-3 text-slate-600">
                    <Zap className="h-4 w-4 text-school-primary/40" />
                    <p className="text-[9px] font-black uppercase tracking-[0.3em]">
                        Subscription management powered by Paystack Secure Gateway
                    </p>
                </div>
            </footer>
        </div>
    )
}