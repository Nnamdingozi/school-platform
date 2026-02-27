// app/auth/set-password/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getTeacherData } from '@/app/actions/teacherData';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function SetPasswordPage() {
    const router = useRouter();
    const supabase = createClient();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isCheckingSession, setIsCheckingSession] = useState(true);
    const [userEmail, setUserEmail] = useState<string | null>(null);

    // ── Verify there's an active session ──────────────────────────────────
    // The user arrives here after clicking the invite link which goes through
    // /auth/confirm — that route verifyOtp() and establishes the session.
    // If there's no session here something went wrong.
    useEffect(() => {
        async function checkSession() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.replace('/login?error=session_expired');
                return;
            }
            setUserEmail(user.email ?? null);
            setIsCheckingSession(false);
        }
        checkSession();
    }, []);

    // ── Password rules ─────────────────────────────────────────────────────
    const rules = [
        { label: 'At least 8 characters', pass: password.length >= 8 },
        { label: 'Contains a number', pass: /\d/.test(password) },
        { label: 'Passwords match', pass: password === confirm && confirm.length > 0 },
    ];
    const allRulesPassed = rules.every((r) => r.pass);

    // ── Submit ─────────────────────────────────────────────────────────────
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!allRulesPassed) return;

        setIsLoading(true);

        // Update password in Supabase auth
        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            toast.error(error.message ?? 'Failed to set password. Please try again.');
            setIsLoading(false);
            return;
        }

        // Fetch profile to determine redirect
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) {
            const profile = await getTeacherData(user.email);
            if (profile) {
                useProfileStore.getState().setProfile(profile);
                toast.success('Password set! Welcome to EduAI.');

                // Role-based redirect
                switch (profile.role) {
                    case 'SUPER_ADMIN':
                    case 'SCHOOL_ADMIN':
                        router.replace('/admin');
                        break;
                    case 'TEACHER':
                        router.replace('/teacher');
                        break;
                    case 'STUDENT':
                        router.replace('/student');
                        break;
                    case 'PARENT':
                        router.replace('/parent');
                        break;
                    default:
                        router.replace('/login');
                }
                return;
            }
        }

        toast.error('Profile not found. Please contact your admin.');
        setIsLoading(false);
    }

    if (isCheckingSession) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-school-secondary-950">
                <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-school-secondary-950 p-4 relative overflow-hidden">

            {/* Background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-school-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-school-primary/5 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md bg-school-secondary-900 border border-school-secondary-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-school-primary/10 mb-4">
                        <Lock className="h-6 w-6 text-school-primary" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Set your password
                    </h1>
                    <p className="text-school-secondary-100/50 text-sm mt-2">
                        Choose a password for{' '}
                        <span className="text-school-primary font-semibold">{userEmail}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Password */}
                    <div className="space-y-1.5">
                        <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                            New Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="pl-10 pr-10 bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-100/20 focus:border-school-primary"
                                required
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                tabIndex={-1}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-100/30 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm password */}
                    <div className="space-y-1.5">
                        <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                placeholder="••••••••"
                                className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-100/20 focus:border-school-primary"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* Password rules */}
                    {password.length > 0 && (
                        <div className="space-y-1.5 rounded-xl bg-school-secondary-800/50 border border-school-secondary-700 p-3">
                            {rules.map((rule) => (
                                <div key={rule.label} className="flex items-center gap-2">
                                    <CheckCircle2
                                        className={`h-3.5 w-3.5 shrink-0 transition-colors ${
                                            rule.pass ? 'text-green-400' : 'text-school-secondary-100/20'
                                        }`}
                                    />
                                    <span className={`text-xs transition-colors ${
                                        rule.pass ? 'text-school-secondary-100/70' : 'text-school-secondary-100/30'
                                    }`}>
                                        {rule.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading || !allRulesPassed}
                        className="w-full h-11 bg-school-primary hover:bg-school-primary/90 text-school-secondary-950 font-bold transition-all duration-200 disabled:opacity-40"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Setting password...
                            </span>
                        ) : (
                            'Set Password & Enter'
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}
