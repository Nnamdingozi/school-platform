// app/accept-invite/page.tsx
// app/accept-invite/page.tsx
'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'

interface InviteInfo {
    email: string
    role: string
}

interface FormState {
    fullName: string
    phone: string
    password: string
    confirm: string
}

function AcceptInviteContent() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [pageStatus, setPageStatus] = useState<'loading' | 'valid' | 'error'>('loading')
    const [errorReason, setErrorReason] = useState('')
    const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [formError, setFormError] = useState('')
    const [form, setForm] = useState<FormState>({
        fullName: '', phone: '', password: '', confirm: ''
    })

    const set = (field: keyof FormState) =>
        (e: React.ChangeEvent<HTMLInputElement>) =>
            setForm(prev => ({ ...prev, [field]: e.target.value }))

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            setPageStatus('error')
            setErrorReason('No invite token found in this link.')
            return
        }

        fetch(`/api/invitations/validate?token=${token}`)
            .then(r => r.json())
            .then(d => {
                if (d.valid) {
                    setInviteInfo(d.invite)
                    setPageStatus('valid')
                } else {
                    setPageStatus('error')
                    setErrorReason(d.reason)
                }
            })
            .catch(() => {
                setPageStatus('error')
                setErrorReason('Something went wrong. Please try again.')
            })
    }, [token])

    const validate = () => {
        if (!form.fullName.trim()) return 'Full name is required.'
        if (!form.phone.trim()) return 'Phone number is required.'
        if (form.password.length < 8) return 'Password must be at least 8 characters.'
        if (form.password !== form.confirm) return 'Passwords do not match.'
        return null
    }

    const handleSubmit = async () => {
        const validationError = validate()
        if (validationError) { setFormError(validationError); return }

        setSubmitting(true)
        setFormError('')

        try {
            // 1. Create account
            const res = await fetch('/api/invitations/accept', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    password: form.password,
                    fullName: form.fullName,
                    phone: form.phone,
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                setFormError(data.error)
                setSubmitting(false)
                return
            }

            // 2. Auto sign in
            const supabase = createClient()
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: data.email,
                password: form.password,
            })

            if (signInError) {
                // Account created but sign in failed — send to login
                router.replace('/login?account=created')
                return
            }

            // 3. Redirect based on role
            router.replace(data.redirectTo)

        } catch {
            setFormError('Something went wrong. Please try again.')
            setSubmitting(false)
        }
    }

    // ── Loading ──────────────────────────────────────────────────────
    if (pageStatus === 'loading') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] gap-3">
                <Loader2 className="w-8 h-8 text-[#f59e0b] animate-spin" />
                <p className="text-slate-400 text-sm">Validating your invite...</p>
            </div>
        )
    }

    // ── Error ────────────────────────────────────────────────────────
    if (pageStatus === 'error') {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-6 text-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h1 className="text-xl font-bold text-white mb-2">Invalid Invite</h1>
                <p className="text-slate-400 text-sm max-w-xs mb-6">{errorReason}</p>
                <button
                    onClick={() => router.push('/login')}
                    className="text-[#f59e0b] text-sm font-medium hover:underline"
                >
                    Back to login
                </button>
            </div>
        )
    }

    // ── Form ─────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-6">
            <div className="w-full max-w-sm space-y-6">

                {/* Header */}
                <div className="text-center space-y-1">
                    <h1 className="text-2xl font-bold text-white">Set Up Your Account</h1>
                    <p className="text-slate-400 text-sm">
                        Invited as <span className="text-[#f59e0b] font-medium">
                            {inviteInfo?.role.replace('_', ' ')}
                        </span>
                    </p>
                </div>

                {/* Fields */}
                <div className="space-y-3">

                    {/* Full Name */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400">
                            Full Name
                        </label>
                        <input
                            type="text"
                            placeholder="John Doe"
                            value={form.fullName}
                            onChange={set('fullName')}
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
                        />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-400">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+234 800 000 0000"
                            value={form.phone}
                            onChange={set('phone')}
                            className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
                        />
                    </div>

                    {/* Divider */}
                    <div className="border-t border-slate-700 pt-1">
                        <p className="text-xs font-medium text-slate-400 mb-3">
                            Create Password
                        </p>
                        <div className="space-y-3">
                            <input
                                type="password"
                                placeholder="Password (min 8 characters)"
                                value={form.password}
                                onChange={set('password')}
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
                            />
                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={form.confirm}
                                onChange={set('confirm')}
                                className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
                            />
                        </div>
                    </div>
                </div>

                {/* Error */}
                {formError && (
                    <p className="text-red-400 text-sm text-center">{formError}</p>
                )}

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-3 rounded-lg bg-[#f59e0b] text-white font-bold text-sm disabled:opacity-50 transition-opacity"
                >
                    {submitting ? (
                        <span className="flex items-center justify-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Creating account...
                        </span>
                    ) : 'Create Account'}
                </button>

            </div>
        </div>
    )
}

export default function AcceptInvitePage() {
    return (
        <Suspense fallback={null}>
            <AcceptInviteContent />
        </Suspense>
    )
}