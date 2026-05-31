'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, ArrowRight, Loader2, ShieldCheck } from 'lucide-react'


interface CreditVerificationClientProps {
    initialStatus: 'success' | 'failed';
    credits?: number;
    initialError?: string;
}

/**
 * CREDIT VERIFICATION HUB
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function CreditVerificationClient({ initialStatus, credits, initialError }: CreditVerificationClientProps) {
    const router = useRouter();

    useEffect(() => {
        // Rule 11: Automatic Hub Redirection upon successful sync
        if (initialStatus === 'success') {
            const timer = setTimeout(() => {
                router.push('/admin/communication');
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [initialStatus, router]);

    return (
        <div className="max-w-md w-full bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-2xl text-center space-y-10 animate-in zoom-in-95 duration-500">

            {/* ── VISUAL INDICATOR (Rule 21) ── */}
            <div className="flex justify-center">
                {initialStatus === 'success' ? (
                    <div className="h-24 w-24 rounded-full flex items-center justify-center bg-emerald-50 border-2 border-emerald-200 shadow-xl animate-in bounce-in duration-1000">
                        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                ) : (
                    <div className="h-24 w-24 rounded-full bg-destructive/5 border-2 border-destructive/20 flex items-center justify-center animate-in shake duration-500 shadow-lg">
                        <XCircle className="h-12 w-12 text-destructive" />
                    </div>
                )}
            </div>

            {/* ── TEXT CONTENT (Rule 11) ── */}
            <div className="space-y-4">
                <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                    {initialStatus === 'success' ? 'Hub Synchronized' : 'Verification Failed'}
                </h1>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed italic opacity-80">
                    {initialStatus === 'success' ? (
                        <>
                            <span className="text-school-primary font-extrabold tabular-nums">
                                {credits?.toLocaleString()} Units
                            </span>{" "}
                            have been successfully bound to your institutional hub.
                        </>
                    ) : (
                        initialError ?? 'The transaction could not be verified by the registry gateway.'
                    )}
                </p>
            </div>

            {/* ── ACTION HUB ── */}
            <div className="pt-2">
                {initialStatus === 'success' ? (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-6 w-6 animate-spin text-school-primary" />
                        <span className="text-[10px] font-bold text-school-primary uppercase tracking-[0.3em] animate-pulse">
                            Returning to Communication Hub
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={() => router.replace('/admin/communication')}
                        className="w-full h-14 bg-school-primary text-on-school-primary font-extrabold rounded-2xl uppercase text-[10px] tracking-widest shadow-xl shadow-school-primary-200 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                        Return to Registry Hub <ArrowRight className="h-4 w-4" />
                    </button>
                )}
            </div>

            {/* ── FOOTER ── */}
            <div className="flex items-center justify-center gap-3 text-muted-foreground/30 border-t border-border pt-8">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Resource_Handshake_v2.1</span>
            </div>
        </div>
    )
}