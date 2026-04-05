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



'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyCreditsPayment } from '@/app/actions/credits.actions'
import { CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react'

export default function VerifyPaymentPage() {
    const router       = useRouter()
    const searchParams = useSearchParams()
    const reference    = searchParams.get('reference')

    const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading')
    const [credits, setCredits] = useState<number | null>(null)
    const [error,   setError]   = useState<string | null>(null)

    useEffect(() => {
        if (!reference) {
            setStatus('failed')
            setError('No payment reference found.')
            return
        }

        verifyCreditsPayment(reference).then(result => {
            if (result.success && result.credits) {
                setCredits(result.credits)
                setStatus('success')
                setTimeout(() => router.push('/admin/settings?tab=whatsapp'), 4000)
            } else {
                setError(result.error ?? 'Payment verification failed.')
                setStatus('failed')
            }
        })
    }, [reference, router])

    return (
        <div className="min-h-screen bg-school-secondary-950 flex items-center justify-center px-4">
            <div className="max-w-sm w-full text-center space-y-6">

                {status === 'loading' && (
                    <>
                        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-school-primary/20 border border-school-primary/20">
                            <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
                        </div>
                        <div>
                            <p className="text-lg font-black text-white">Verifying Payment</p>
                            <p className="text-sm text-school-secondary-400 mt-1">
                                Please wait while we confirm your transaction...
                            </p>
                        </div>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-green-500/10 border border-green-500/20">
                            <CheckCircle2 className="h-8 w-8 text-green-400" />
                        </div>
                        <div>
                            <p className="text-lg font-black text-white">Payment Successful!</p>
                            <p className="text-sm text-school-secondary-400 mt-1">
                                <span className="text-school-primary font-bold">
                                    {credits?.toLocaleString()} credits
                                </span>{' '}
                                have been added to your account.
                            </p>
                        </div>
                        <div className="flex items-center justify-center gap-2 rounded-xl border border-school-secondary-700 bg-school-secondary-900 px-4 py-3">
                            <Zap className="h-4 w-4 text-school-primary" />
                            <p className="text-xs text-school-secondary-400">
                                Redirecting to settings in a moment...
                            </p>
                        </div>
                    </>
                )}

                {status === 'failed' && (
                    <>
                        <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-red-500/10 border border-red-500/20">
                            <XCircle className="h-8 w-8 text-red-400" />
                        </div>
                        <div>
                            <p className="text-lg font-black text-white">Payment Failed</p>
                            <p className="text-sm text-school-secondary-400 mt-1">
                                {error ?? 'Something went wrong with your payment.'}
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/credits')}
                            className="w-full py-3 rounded-xl bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 text-sm font-bold transition-all"
                        >
                            Try Again
                        </button>
                    </>
                )}

            </div>
        </div>
    )
}