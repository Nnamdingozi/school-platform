'use client' 
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { completeIndividualOnboarding, getIndividualCurricula } from '@/app/actions/individual-onboarding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { toTitleCase, formatPhone } from '@/lib/utils/formatters'
import { CheckCircle2, Loader2, ArrowRight, Mail, Check } from 'lucide-react'

type Step = 1 | 2

export default function IndividualStudentOnboardingPage() {
    const router = useRouter()

    const [step, setStep] = useState<Step>(1)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [curricula, setCurricula] = useState<Array<{ id: string; name: string; yearLabel: string; termLabel: string }>>([])
    const [curriculumId, setCurriculumId] = useState<string>('')

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
    })

    const [isProvisioned, setIsProvisioned] = useState(false)
    const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)
    const [isResending, setIsResending] = useState(false)

    const canContinue = useMemo(() => {
        return (
            form.name.trim().length > 1 &&
            !!form.email.trim() &&
            form.password.length >= 8
        )
    }, [form.email, form.name, form.password])

    useEffect(() => {
        let mounted = true
        getIndividualCurricula().then((res) => {
            if (!mounted) return
            if (!res.success) {
                toast.error(res.error ?? 'Failed to load curricula.')
                return
            }

            setCurricula(res.data)
            if (res.data.length > 0) {
                setCurriculumId(String(res.data[0].id))
            }
        })

        return () => {
            mounted = false
        }
    }, [])

    async function handleCreate() {
        setError(null)

        if (!curriculumId) {
            setError('Please select a curriculum.')
            return
        }
        if (!canContinue) {
            setError('Please fill in all required fields.')
            return
        }

        setIsLoading(true)
        try {
            const result = await completeIndividualOnboarding({
                name: toTitleCase(form.name),
                email: form.email.trim(),
                password: form.password,
                phone: form.phone.trim() ? formatPhone(form.phone.trim()) : null,
                curriculumId,
            })

            if (!result.success) {
                setError(result.error ?? 'Failed to create account.')
                toast.error(result.error ?? 'Failed to create account.')
                return
            }

            // Email confirmation flow (same as school onboarding): user is unconfirmed until they click the link.
            // Do not signInWithPassword here — it fails with "Email not confirmed" and would send users to /login.
            setConfirmedEmail(form.email.trim().toLowerCase())
            setIsProvisioned(true)
            toast.success('Check your email to confirm your account.')
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'Something went wrong.'
            setError(msg)
            toast.error(msg)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleResend() {
        if (!confirmedEmail) {
            toast.error('Email address not found. Please contact support.')
            return
        }
        setIsResending(true)
        const supabase = createClient()
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: confirmedEmail,
        })
        setIsResending(false)
        if (error) {
            toast.error('Could not resend. Please wait a moment and try again.')
        } else {
            toast.success('Confirmation email resent!')
        }
    }

    if (isProvisioned && confirmedEmail) {
        return (
            <div className="min-h-screen bg-school-secondary-950 flex flex-col">
                <header className="flex items-center justify-between px-6 py-4 border-b border-school-secondary-800">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-school-primary flex items-center justify-center">
                            <span className="text-school-secondary-950 font-black text-sm">E</span>
                        </div>
                        <span className="text-school-secondary-100 font-semibold text-lg">EduAI</span>
                    </div>
                    <p className="text-school-secondary-100/50 text-sm hidden sm:block">
                        Check your email to get started
                    </p>
                </header>
                <main className="flex-1 flex items-center justify-center px-4 pb-16">
                    <div className="w-full max-w-lg animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center py-10 gap-6">
                        <div className="relative">
                            <div className="h-20 w-20 rounded-full bg-school-primary/10 border-4 border-school-primary/30 flex items-center justify-center">
                                <Mail className="h-9 w-9 text-school-primary" />
                            </div>
                            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-green-500 border-2 border-school-secondary-950 flex items-center justify-center">
                                <Check className="h-3.5 w-3.5 text-white" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-black text-school-secondary-100 tracking-tight">
                                Almost there! Check your inbox
                            </h2>
                            <p className="text-school-secondary-100/50 text-sm max-w-sm mx-auto leading-relaxed">
                                We sent a confirmation link to{' '}
                                <span className="text-school-primary font-semibold break-all">
                                    {confirmedEmail}
                                </span>
                                . Click it to activate your account, then sign in to open your learner dashboard.
                            </p>
                        </div>
                        <p className="text-xs text-school-secondary-100/30">
                            {"Didn't receive it? Check your spam folder or "}
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending}
                                className="text-school-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
                            >
                                {isResending ? (
                                    <>
                                        <Loader2 className="h-3 w-3 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    'resend the email'
                                )}
                            </button>
                        </p>
                        <a
                            href="/login"
                            className="text-xs text-school-secondary-100 hover:text-school-secondary-100/50 transition-colors"
                        >
                            Go to login page →
                        </a>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-school-secondary-950 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 border-b border-school-secondary-800">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-school-primary flex items-center justify-center">
                        <span className="text-school-secondary-950 font-black text-sm">E</span>
                    </div>
                    <span className="text-school-secondary-100 font-semibold text-lg">EduAI</span>
                </div>
                <p className="text-school-secondary-100/50 text-sm hidden sm:block">
                    Individual learner onboarding
                </p>
            </header>

            <main className="flex-1 flex items-start justify-center px-4 pb-16 pt-8">
                <div className="w-full max-w-lg">
                    <div className="mb-8 text-center">
                        <h1 className="text-2xl font-black text-school-secondary-100 tracking-tight">
                            {step === 1 ? 'Create your account' : 'Choose your curriculum'}
                        </h1>
                        <p className="text-school-secondary-100/50 mt-2 text-sm">
                            {step === 1
                                ? 'Start learning without registering with a school.'
                                : 'Pick a template curriculum to begin.'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Full Name
                                </Label>
                                <Input
                                    value={form.name}
                                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                                    placeholder="John Doe"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Email Address
                                </Label>
                                <Input
                                    value={form.email}
                                    type="email"
                                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                                    placeholder="learner@example.com"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Password
                                </Label>
                                <Input
                                    value={form.password}
                                    type="password"
                                    onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                                    placeholder="Min. 8 characters"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                                <p className="text-[10px] text-school-secondary-100/30">
                                    Password must be at least 8 characters.
                                </p>
                            </div>

                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Phone Number <span className="text-school-secondary-100/30">(optional)</span>
                                </Label>
                                <Input
                                    value={form.phone}
                                    type="tel"
                                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                                    placeholder="+234 800 000 0000"
                                    className={cn(
                                        'bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100',
                                        'placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20',
                                    )}
                                />
                            </div>

                            <Button
                                type="button"
                                onClick={() => setStep(2)}
                                disabled={!canContinue}
                                className="w-full bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 disabled:opacity-40"
                            >
                                Continue to curriculum
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>

                            <p className="text-center text-xs text-school-secondary-100/30">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    className="text-school-primary hover:underline font-semibold"
                                    onClick={() => router.replace('/login')}
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-5">
                            <div className="space-y-1.5">
                                <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                    Curriculum Template
                                </Label>
                                <Select value={curriculumId} onValueChange={(v) => setCurriculumId(v)}>
                                    <SelectTrigger className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                        <SelectValue placeholder="Select curriculum..." />
                                    </SelectTrigger>
                                    <SelectContent className="bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100">
                                        {curricula.length === 0 ? (
                                            <SelectItem value="loading" disabled>
                                                Loading curricula...
                                            </SelectItem>
                                        ) : (
                                            curricula.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>
                                                    {c.name} ({c.yearLabel}, {c.termLabel})
                                                </SelectItem>
                                            ))
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="rounded-xl p-4 bg-school-secondary-800/40 border border-school-secondary-700/60">
                                <p className="text-sm font-semibold text-school-secondary-100">
                                    What happens next?
                                </p>
                                <ul className="mt-2 space-y-1 text-[13px] text-school-secondary-100/70">
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-school-primary" />
                                        Account created (no school needed)
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-school-primary" />
                                        Confirmation link sent to your email
                                    </li>
                                </ul>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setStep(1)}
                                    disabled={isLoading}
                                    className="flex-1 border-school-secondary-700 text-school-secondary-100/60 hover:text-school-secondary-100 hover:bg-school-secondary-800"
                                >
                                    Back
                                </Button>

                                <Button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={isLoading || !curriculumId}
                                    className="flex-1 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 disabled:opacity-40"
                                >
                                    {isLoading ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Creating...
                                        </span>
                                    ) : (
                                        'Create account'
                                    )}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

