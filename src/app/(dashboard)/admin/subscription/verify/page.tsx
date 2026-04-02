'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifySubscriptionPayment } from '@/app/actions/subscription.actions'
import { Loader2, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { getErrorMessage } from '@/lib/error-handler'

function VerifySubscriptionContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const reference = searchParams.get('reference')
    
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
    const [message, setMessage] = useState('Communicating with payment gateway...')

    useEffect(() => {
        if (!reference) {
            setStatus('error')
            setMessage('Invalid transaction reference.')
            return
        }

        async function verify() {
            try {
                const result = await verifySubscriptionPayment(reference!)
                
                if (result.success) {
                    setStatus('success')
                    setMessage(`Subscription Activated: ${result.planName} plan is now live.`)
                    toast.success("Billing registry synchronized successfully.")
                    
                    // Auto-redirect after a short delay
                    setTimeout(() => {
                        router.push('/admin/subscription')
                    }, 4000)
                } else {
                    setStatus('error')
                    setMessage(result.error || 'Verification failed.')
                }
            } catch (err) {
                setStatus('error')
                setMessage('A system error occurred during synchronization.')
                getErrorMessage(err)
            }
        }

        verify()
    }, [reference, router])

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-6">
            <div className="max-w-md w-full bg-slate-900 border border-white/5 rounded-[2.5rem] p-10 shadow-2xl text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
                
                {/* ── Visual Indicator ── */}
                <div className="flex justify-center">
                    {status === 'verifying' && (
                        <div className="relative">
                            <Loader2 className="h-20 w-20 animate-spin text-school-primary opacity-20" />
                            <ShieldCheck className="h-10 w-10 text-school-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                        </div>
                    )}
                    {status === 'success' && (
                        <div className="h-20 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center animate-in bounce-in">
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="h-20 w-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-in shake">
                            <XCircle className="h-10 w-10 text-red-500" />
                        </div>
                    )}
                </div>

                {/* ── Text Content ── */}
                <div className="space-y-2">
                    <h1 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                        {status === 'verifying' ? 'Verifying Vault' : status === 'success' ? 'Access Granted' : 'Sync Failed'}
                    </h1>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* ── Actions ── */}
                <div className="pt-4">
                    {status === 'success' ? (
                        <div className="text-[10px] font-black text-school-primary uppercase tracking-[0.3em] animate-pulse">
                            Redirecting to Control Center...
                        </div>
                    ) : status === 'error' ? (
                        <Button 
                            onClick={() => router.push('/admin/settings?tab=billing')}
                            className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-8 py-6 rounded-2xl w-full"
                        >
                            Return to Billing
                        </Button>
                    ) : null}
                </div>

                {/* ── Footer ── */}
                <div className="pt-4 flex items-center justify-center gap-2 text-slate-700">
                    <ShieldCheck className="h-3 w-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Secure Financial Synchronization</span>
                </div>
            </div>
        </div>
    )
}

export default function VerifySubscriptionPage() {
    return (
        <Suspense fallback={null}>
            <VerifySubscriptionContent />
        </Suspense>
    )
}