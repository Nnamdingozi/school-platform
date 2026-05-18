'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getRegistryProfile} from '@/app/actions/profileRegistry'
import { useProfileStore } from '@/store/profileStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Loader2, Eye, EyeOff, Lock, Mail, ShieldCheck, type LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { type AnyProfile } from '@/types/profile'
import { Role } from '@prisma/client'
import { getErrorMessage } from '@/lib/error-handler'
import { cn } from '@/lib/utils'

const INPUT_CLASS =
    'h-auto w-full bg-background border-border rounded-2xl pl-12 pr-6 py-4 text-sm text-foreground focus-visible:border-school-primary focus-visible:ring-school-primary/20 placeholder:text-muted-foreground'

/**
 * AUTHENTICATION INTERFACE (Tier 3)
 * Rule 14: Loading states on form submission.
 * Rule 17: Syncs database truth with Zustand store.
 */
export function LoginForm() {
    const router = useRouter()
    const setProfile = useProfileStore((state) => state.setProfile)

    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loadingMsg, setLoadingMsg] = useState('Authenticating...')

    useEffect(() => {
        const params = new URLSearchParams(window.location.search)
        if (params.get('confirmed') === 'true') {
            toast.success('Identity Verified. Please sign in.')
        }
        if (params.get('error') === 'confirmation_failed') {
            toast.error('Verification link expired.')
        }
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setLoadingMsg('Verifying identity...')

        try {
            const supabase = createClient()

            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim().toLowerCase(),
                password,
            })

            if (error) throw error
            if (!data.user?.email) throw new Error('Identity sync failed.')

            setLoadingMsg('Hydrating registry...')

            const profile = await getRegistryProfile(data.user.email)

            if (!profile) {
                toast.error('Identity record not discovered in registry.')
                await supabase.auth.signOut()
                setIsLoading(false)
                return
            }

            setProfile(profile as unknown as AnyProfile)

            toast.success(`Welcome back, ${profile.name?.split(' ')[0] || 'Registry User'}!`)
            setLoadingMsg('Finalizing redirection...')

            setTimeout(() => {
                switch (profile.role) {
                    case Role.SUPER_ADMIN:
                    case Role.SCHOOL_ADMIN:
                        router.replace('/admin')
                        break
                    case Role.TEACHER:
                        router.replace('/teacher')
                        break
                    case Role.STUDENT:
                        router.replace('/student')
                        break
                    case Role.PARENT:
                        router.push('/parent')
                        break
                    case Role.INDIVIDUAL_LEARNER:
                        router.replace('/student')
                        break
                    default:
                        router.replace('/login')
                }
            }, 500)
        } catch (err: unknown) {
            toast.error(getErrorMessage(err))
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full max-w-md bg-card border border-border rounded-[3rem] shadow-2xl p-10 md:p-12 relative overflow-hidden group">
            <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary/10 rounded-full blur-3xl transition-all group-hover:bg-school-primary/20 pointer-events-none" aria-hidden />

            {isLoading && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
                    <p className="text-foreground text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">
                        {loadingMsg}
                    </p>
                </div>
            )}

            <div className="text-center mb-10 space-y-4 relative">
                <div className="h-14 w-14 bg-background rounded-2xl flex items-center justify-center mx-auto border border-border shadow-inner">
                    <Lock className="h-6 w-6 text-school-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-foreground uppercase italic tracking-tighter">
                        Registry Access
                    </h1>
                    <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                        Institutional Synchronization Terminal
                    </p>
                </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6 relative">
                <AuthField
                    id="email"
                    label="Email Identity"
                    icon={Mail}
                    type="email"
                    placeholder="user@schoolpaas.com"
                    value={email}
                    onChange={setEmail}
                    inputClassName={cn(INPUT_CLASS, 'font-mono lowercase')}
                    disabled={isLoading}
                    autoComplete="email"
                />

                <AuthField
                    id="password"
                    label="Secret Key"
                    icon={Lock}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={setPassword}
                    inputClassName={cn(INPUT_CLASS, 'pr-12 font-bold')}
                    disabled={isLoading}
                    autoComplete="current-password"
                    trailing={
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    }
                />

                <Button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                        'w-full py-8 bg-school-primary text-on-school-primary font-black rounded-2xl',
                        'text-[10px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all',
                        'shadow-xl shadow-school-primary/10 mt-4 disabled:opacity-50',
                    )}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        'Initialize Session'
                    )}
                </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-border space-y-3">
                <Link
                    href="/forgot-password"
                    title="Recover Access"
                    className="block text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest hover:text-school-primary transition-colors"
                >
                    Lost encryption key?
                </Link>
                <p className="text-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                    Registry offline?{' '}
                    <Link
                        href="/onboarding"
                        className="text-school-primary hover:underline italic"
                    >
                        Provision workspace
                    </Link>
                </p>
            </div>

            <div className="mt-8 flex justify-center items-center gap-2 text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-school-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                    Protocol_Secure_v1.2
                </span>
            </div>
        </div>
    )
}

interface AuthFieldProps {
    id: string
    label: string
    icon: LucideIcon
    type: string
    placeholder: string
    value: string
    onChange: (value: string) => void
    inputClassName?: string
    disabled?: boolean
    autoComplete?: string
    trailing?: React.ReactNode
}

function AuthField({
    id,
    label,
    icon: Icon,
    type,
    placeholder,
    value,
    onChange,
    inputClassName,
    disabled,
    autoComplete,
    trailing,
}: AuthFieldProps) {
    return (
        <div className="space-y-2">
            <Label
                htmlFor={id}
                className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-2"
            >
                {label}
            </Label>
            <div className="relative group">
                <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-school-primary transition-colors z-10 pointer-events-none" />
                <Input
                    id={id}
                    type={type}
                    className={inputClassName}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required
                    disabled={disabled}
                    autoComplete={autoComplete}
                />
                {trailing}
            </div>
        </div>
    )
}
