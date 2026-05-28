// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { verifyCreditsPayment } from '@/app/actions/credits.actions'
// import { CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react'

// export default function VerifyPaymentPage() {
//     const router       = useRouter()
//     const searchParams = useSearchParams()
//     const reference    = searchParams.get('reference')

//     const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
//     const [credits, setCredits] = useState<number | null>(null)
//     const [error,   setError]   = useState<string | null>(null)

//     useEffect(() => {
//         if (!reference) {
//             setStatus('failed')
//             setError('No payment reference found.')
//             return
//         }

//         verifyCreditsPayment(reference).then(result => {
//             if (result.success && result.credits) {
//                 setCredits(result.credits)
//                 setStatus('success')
//                 setTimeout(() => router.push('/admin/settings?tab=whatsapp'), 4000)
//             } else {
//                 setError(result.error ?? 'Payment verification failed.')
//                 setStatus('failed')
//             }
//         })
//     }, [reference, router])

//     return (
//         <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center px-4">
//             <div className="max-w-sm w-full text-center space-y-6">

//                 {status === 'loading' && (
//                     <>
//                         <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-school-primary/20 border border-school-primary/20">
//                             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//                         </div>
//                         <div>
//                             <p className="text-lg font-black text-white">Verifying Payment</p>
//                             <p className="text-sm text-school-secondary-400 mt-1">
//                                 Please wait while we confirm your transaction...
//                             </p>
//                         </div>
//                     </>
//                 )}

//                 {status === 'success' && (
//                     <>
//                         <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
//                             <CheckCircle2 className="h-8 w-8 text-green-400" />
//                         </div>
//                         <div>
//                             <p className="text-lg font-black text-white">Payment Successful!</p>
//                             <p className="text-sm text-school-secondary-400 mt-1">
//                                 <span className="text-school-primary font-bold">
//                                     {credits?.toLocaleString()} credits
//                                 </span>{' '}
//                                 have been added to your account.
//                             </p>
//                         </div>
//                         <div className="flex items-center justify-center gap-2 rounded-xl border border-school-secondary-700 bg-school-secondary-900 px-4 py-3">
//                             <Zap className="h-4 w-4 text-school-primary" />
//                             <p className="text-xs text-school-secondary-400">
//                                 Redirecting to settings in a moment...
//                             </p>
//                         </div>
//                     </>
//                 )}

//                 {status === 'failed' && (
//                     <>
//                         <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
//                             <XCircle className="h-8 w-8 text-red-400" />
//                         </div>
//                         <div>
//                             <p className="text-lg font-black text-white">Payment Failed</p>
//                             <p className="text-sm text-school-secondary-400 mt-1">
//                                 {error ?? 'Something went wrong with your payment.'}
//                             </p>
//                         </div>
//                         <button
//                             onClick={() => router.push('/admin/credits')}
//                             className="w-full py-3 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-sm font-bold transition-all"
//                         >
//                             Try Again
//                         </button>
//                     </>
//                 )}

//             </div>
//         </div>
//     )
// }



// 'use client'

// import { useEffect, useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation'
// import { verifyCreditsPayment } from '@/app/actions/credits.actions'
// import { CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react'

// export default function VerifyPaymentPage() {
//     const router       = useRouter()
//     const searchParams = useSearchParams()
//     const reference    = searchParams.get('reference')

//     const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
//     const [credits, setCredits] = useState<number | null>(null)
//     const [error,   setError]   = useState<string | null>(null)

//     useEffect(() => {
//         if (!reference) {
//             setStatus('failed')
//             setError('No payment reference found.')
//             return
//         }

//         verifyCreditsPayment(reference).then(result => {
//             if (result.success && result.credits) {
//                 setCredits(result.credits)
//                 setStatus('success')
//                 setTimeout(() => router.push('/admin/communication'), 4000)
//             } else {
//                 setError(result.error ?? 'Payment verification failed.')
//                 setStatus('failed')
//             }
//         })
//     }, [reference, router])

//     return (
//         <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center px-4">
//             <div className="max-w-sm w-full text-center space-y-6">

//                 {status === 'loading' && (
//                     <>
//                         <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-school-primary/20 border border-school-primary/20">
//                             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//                         </div>
//                         <div>
//                             <p className="text-lg font-black text-white">Verifying Payment</p>
//                             <p className="text-sm text-school-secondary-400 mt-1">
//                                 Please wait while we confirm your transaction...
//                             </p>
//                         </div>
//                     </>
//                 )}

//                 {status === 'success' && (
//                     <>
//                         <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
//                             <CheckCircle2 className="h-8 w-8 text-green-400" />
//                         </div>
//                         <div>
//                             <p className="text-lg font-black text-white">Payment Successful!</p>
//                             <p className="text-sm text-school-secondary-400 mt-1">
//                                 <span className="text-school-primary font-bold">
//                                     {credits?.toLocaleString()} credits
//                                 </span>{' '}
//                                 have been added to your account.
//                             </p>
//                         </div>
//                         <div className="flex items-center justify-center gap-2 rounded-xl border border-school-secondary-700 bg-school-secondary-900 px-4 py-3">
//                             <Zap className="h-4 w-4 text-school-primary" />
//                             <p className="text-xs text-school-secondary-400">
//                                 Redirecting to settings in a moment...
//                             </p>
//                         </div>
//                     </>
//                 )}

//                 {status === 'failed' && (
//                     <>
//                         <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
//                             <XCircle className="h-8 w-8 text-red-400" />
//                         </div>
//                         <div>
//                             <p className="text-lg font-black text-white">Payment Failed</p>
//                             <p className="text-sm text-school-secondary-400 mt-1">
//                                 {error ?? 'Something went wrong with your payment.'}
//                             </p>
//                         </div>
//                         <button
//                             onClick={() => router.push('/admin/credits')}
//                             className="w-full py-3 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-sm font-bold transition-all"
//                         >
//                             Try Again
//                         </button>
//                     </>
//                 )}

//             </div>
//         </div>
//     )
// }





'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, XCircle, Zap, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useProfileStore } from '@/store/profileStore'

interface CreditVerificationClientProps {
    initialStatus: 'success' | 'failed';
    credits?: number;
    initialError?: string;
}

/**
 * Rule 1: Institutional Layer UI
 * Rule 17: Uses Zustand for branding colors on the success state.
 */
export function CreditVerificationClient({ initialStatus, credits, initialError }: CreditVerificationClientProps) {
    const router = useRouter();
    const { profile } = useProfileStore();

    useEffect(() => {
        // Rule 11: If successful, redirect back to the hub after a short delay
        if (initialStatus === 'success') {
            const timer = setTimeout(() => {
                router.push('/admin/communication');
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [initialStatus, router]);

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
            <div className="max-w-sm w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">

                {initialStatus === 'success' && (
                    <>
                        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                Credits Synchronized
                            </h1>
                            <p className="text-sm text-slate-400 font-medium uppercase tracking-widest leading-relaxed">
                                <span className="text-school-primary font-black" style={{ color: profile?.primaryColor }}>
                                    {credits?.toLocaleString()} Units
                                </span>{" "}
                                have been bound to your institutional registry.
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-3 rounded-2xl border border-white/5 bg-slate-900/50 px-6 py-4 shadow-inner">
                            <Zap className="h-4 w-4 text-school-primary" style={{ color: profile?.primaryColor }} />
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                                Auto-Redirecting to Hub...
                            </p>
                        </div>
                    </>
                )}

                {initialStatus === 'failed' && (
                    <>
                        <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-[2.5rem] bg-red-500/10 border border-red-500/20">
                            <XCircle className="h-10 w-10 text-red-400" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                Validation Failed
                            </h1>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest px-4">
                                {initialError ?? 'The transaction could not be verified by the gateway registry.'}
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push('/admin/communication')}
                            className="w-full py-8 rounded-2xl bg-school-primary text-slate-950 font-black uppercase text-xs tracking-widest hover:scale-[1.02] transition-all"
                            style={{ backgroundColor: profile?.primaryColor }}
                        >
                            Return to Registry <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </>
                )}

            </div>
        </div>
    )
}