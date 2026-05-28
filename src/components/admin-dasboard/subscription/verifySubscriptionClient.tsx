// 'use client'

// import { useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import {  CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react'
// import { Button } from '@/components/ui/button'
// import { useProfileStore } from '@/store/profileStore'


// interface VerifySubscriptionClientProps {
//     initialStatus: 'success' | 'error';
//     initialMessage: string;
// }

// /**
//  * REGISTRY SYNC INTERFACE (Tier 2/3)
//  * Rule 17: Injects school primary color via Zustand to avoid prop drilling.
//  * Rule 13: Handles both School and Individual redirection targets.
//  */
// export function VerifySubscriptionClient({ initialStatus, initialMessage }: VerifySubscriptionClientProps) {
//     const router = useRouter();
//     const { profile } = useProfileStore();
//     const primaryColor = profile?.primaryColor || "#f59e0b";

//     useEffect(() => {
//         // Rule 11: If database truth is "success", trigger auto-redirect
//         if (initialStatus === 'success') {
//             const destination = profile?.schoolId ? '/admin/settings?tab=billing' : '/billing';
//             const timer = setTimeout(() => {
//                 router.push(destination);
//             }, 3500);
//             return () => clearTimeout(timer);
//         }
//     }, [initialStatus, router, profile]);

//     return (
//         <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
//             <div className="max-w-md w-full bg-slate-900 border border-white/5 rounded-[3rem] p-12 shadow-2xl text-center space-y-10 animate-in fade-in zoom-in-95 duration-700">
                
//                 {/* ── Visual Indicator ── */}
//                 <div className="flex justify-center">
//                     {initialStatus === 'success' ? (
//                         <div 
//                             className="h-24 w-24 rounded-full flex items-center justify-center animate-in bounce-in duration-1000 shadow-2xl"
//                             style={{ backgroundColor: `${primaryColor}15`, border: `2px solid ${primaryColor}30` }}
//                         >
//                             <CheckCircle2 className="h-12 w-12" style={{ color: primaryColor }} />
//                         </div>
//                     ) : (
//                         <div className="h-24 w-24 rounded-full bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center animate-in shake duration-500">
//                             <XCircle className="h-12 w-12 text-red-500" />
//                         </div>
//                     )}
//                 </div>

//                 {/* ── Text Content ── */}
//                 <div className="space-y-3">
//                     <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
//                         {initialStatus === 'success' ? 'Access Restored' : 'Registry Error'}
//                     </h1>
//                     <p className="text-slate-400 text-sm font-medium leading-relaxed italic">
//                         {initialMessage}
//                     </p>
//                 </div>

//                 {/* ── Contextual Actions ── */}
//                 <div className="pt-4">
//                     {initialStatus === 'success' ? (
//                         <div 
//                             className="text-[10px] font-black uppercase tracking-[0.4em] animate-pulse"
//                             style={{ color: primaryColor }}
//                         >
//                             Synchronizing Global Registry...
//                         </div>
//                     ) : (
//                         <Button 
//                             onClick={() => router.push(profile?.schoolId ? '/admin/settings?tab=billing' : '/billing')}
//                             className="bg-slate-950 text-white font-black px-10 py-7 rounded-2xl w-full border border-white/10 hover:bg-slate-800 transition-all uppercase text-[10px] tracking-widest"
//                         >
//                             Return to Billing Terminal <ArrowRight className="ml-2 h-4 w-4" />
//                         </Button>
//                     )}
//                 </div>

//                 {/* ── Status Footer ── */}
//                 <div className="flex items-center justify-center gap-3 text-slate-700 border-t border-white/5 pt-8">
//                     <ShieldCheck className="h-4 w-4" />
//                     <span className="text-[9px] font-black uppercase tracking-[0.3em]">Institutional_Synchronization_v1.2</span>
//                 </div>
//             </div>
//         </div>
//     );
// }



'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, ShieldCheck, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/store/profileStore'
import { cn } from '@/lib/utils'

interface VerifySubscriptionClientProps {
    initialStatus: 'success' | 'error';
    initialMessage: string;
}

/**
 * REGISTRY SYNC INTERFACE (Tier 2/3)
 * Rule 11: Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
 * Rule 19: Standardized Geometry [2rem].
 * Rule 21: Scale Protocol - Uses mathematical CSS tokens (-100, -200) instead of opacity.
 */
export function VerifySubscriptionClient({ initialStatus, initialMessage }: VerifySubscriptionClientProps) {
    const router = useRouter();
    const { profile } = useProfileStore();

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
        <div className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
            {/* Rule 19: Primary Card Geometry [2rem] */}
            <div className="max-w-md w-full bg-card border border-border rounded-[2rem] p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.1)] text-center space-y-10 animate-in zoom-in-95 duration-500">
                
                {/* ── VISUAL INDICATOR (Rule 21) ── */}
                <div className="flex justify-center">
                    {initialStatus === 'success' ? (
                        <div 
                            className="h-24 w-24 rounded-full flex items-center justify-center animate-in bounce-in duration-1000 shadow-xl bg-school-primary-100 border-2 border-school-primary-200"
                        >
                            <CheckCircle2 className="h-12 w-12 text-school-primary" />
                        </div>
                    ) : (
                        <div className="h-24 w-24 rounded-full bg-destructive/10 border-2 border-destructive/20 flex items-center justify-center animate-in shake duration-500 shadow-xl">
                            <XCircle className="h-12 w-12 text-destructive" />
                        </div>
                    )}
                </div>

                {/* ── TEXT CONTENT (Rule 11) ── */}
                <div className="space-y-4">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                        {initialStatus === 'success' ? 'Access Restored' : 'Registry Error'}
                    </h1>
                    <p className="text-muted-foreground text-sm font-medium leading-relaxed italic">
                        {initialMessage}
                    </p>
                </div>

                {/* ── CONTEXTUAL ACTIONS ── */}
                <div className="pt-2">
                    {initialStatus === 'success' ? (
                        <div className="flex flex-col items-center gap-3">
                            <div className="h-1 w-32 bg-surface rounded-full overflow-hidden">
                                <div className="h-full bg-school-primary animate-progress-loading w-1/3" />
                            </div>
                            <span className="text-[10px] font-bold text-school-primary uppercase tracking-[0.3em] animate-pulse">
                                Synchronizing Global Registry
                            </span>
                        </div>
                    ) : (
                        <Button 
                            onClick={() => router.push(profile?.schoolId ? '/admin/settings?tab=billing' : '/billing')}
                            variant="outline"
                            className="h-14 px-10 rounded-2xl w-full border-border bg-surface hover:bg-background text-foreground font-bold uppercase text-[10px] tracking-widest transition-all active:scale-95 shadow-sm"
                        >
                            Return to Billing Terminal <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    )}
                </div>

                {/* ── STATUS FOOTER (Rule 11) ── */}
                <div className="flex items-center justify-center gap-3 text-muted-foreground/40 border-t border-border pt-8">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="text-[9px] font-bold uppercase tracking-widest italic">
                        Institutional_Synchronization_v1.2
                    </span>
                </div>
            </div>
        </div>
    );
}