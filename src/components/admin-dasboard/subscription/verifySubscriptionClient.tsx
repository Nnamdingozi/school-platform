'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {  CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/store/profileStore'


interface VerifySubscriptionClientProps {
    initialStatus: 'success' | 'error';
    initialMessage: string;
}

/**
 * REGISTRY SYNC INTERFACE (Tier 2/3)
 * Rule 17: Injects school primary color via Zustand to avoid prop drilling.
 * Rule 13: Handles both School and Individual redirection targets.
 */
export function VerifySubscriptionClient({ initialStatus, initialMessage }: VerifySubscriptionClientProps) {
    const router = useRouter();
    const { profile } = useProfileStore();
    const primaryColor = profile?.primaryColor || "#f59e0b";

    useEffect(() => {
        // Rule 11: If database truth is "success", trigger auto-redirect
        if (initialStatus === 'success') {
            const destination = profile?.schoolId ? '/admin/settings?tab=billing' : '/billing';
            const timer = setTimeout(() => {
                router.push(destination);
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [initialStatus, router, profile]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-white/5 rounded-[3rem] p-12 shadow-2xl text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
                
                {/* ── Visual Indicator ── */}
                <div className="flex justify-center">
                    {initialStatus === 'success' ? (
                        <div 
                            className="h-24 w-24 rounded-full flex items-center justify-center animate-in bounce-in duration-1000 shadow-2xl"
                            style={{ backgroundColor: `${primaryColor}15`, border: `2px solid ${primaryColor}30` }}
                        >
                            <CheckCircle2 className="h-12 w-12" style={{ color: primaryColor }} />
                        </div>
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center animate-in shake duration-500">
                            <XCircle className="h-12 w-12 text-red-500" />
                        </div>
                    )}
                </div>

                {/* ── Text Content ── */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                        {initialStatus === 'success' ? 'Access Restored' : 'Registry Error'}
                    </h1>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
                        {initialMessage}
                    </p>
                </div>

                {/* ── Contextual Actions ── */}
                <div className="pt-4">
                    {initialStatus === 'success' ? (
                        <div 
                            className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse"
                            style={{ color: primaryColor }}
                        >
                            Synchronizing Global Registry...
                        </div>
                    ) : (
                        <Button 
                            onClick={() => router.push(profile?.schoolId ? '/admin/settings?tab=billing' : '/billing')}
                            className="bg-slate-950 text-white font-black px-10 py-7 rounded-2xl w-full border border-white/10 hover:bg-slate-800 transition-all uppercase text-[10px] tracking-widest"
                        >
                            Return to Billing Terminal <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* ── Status Footer ── */}
                <div className="flex items-center justify-center gap-3 text-slate-700 border-t border-white/5 pt-8">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[9px] font-black uppercase tracking-[0.3em]">Institutional_Synchronization_v1.2</span>
                </div>
            </div>
        </div>
    );
}