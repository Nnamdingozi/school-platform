'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getTeacherData } from '@/app/actions/profileRegistry';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { type AnyProfile } from '@/types/profile';
import { Role } from '@prisma/client';
import { getErrorMessage } from '@/lib/error-handler';
import { cn } from '@/lib/utils';

interface SetPasswordFormProps {
    userEmail: string;
}

/**
 * SECURITY CREDENTIALING INTERFACE (Tier 3)
 * Rule 11: Finalizes user layer logic and hydrates Global Context.
 * Rule 17: Syncs the Zustand Store directly to prevent prop-drilling identity.
 */
export function SetPasswordForm({ userEmail }: SetPasswordFormProps) {
    const router = useRouter();
    const setProfile = useProfileStore((state) => state.setProfile);
    const [isPending, startTransition] = useTransition();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Registry Validation Protocol
    const rules = [
        { label: 'Minimum 8 Characters', pass: password.length >= 8 },
        { label: 'Numeric Sequence Integration', pass: /\d/.test(password) },
        { label: 'Bitwise Sequence Match', pass: password === confirm && confirm.length > 0 },
    ];
    
    const allRulesPassed = rules.every((r) => r.pass);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!allRulesPassed) return;

        startTransition(async () => {
            try {
                const supabase = createClient();

                // 1. Update Auth Key in Supabase
                const { error: authError } = await supabase.auth.updateUser({ password });
                if (authError) throw authError;

                // 2. Rule 11: Fetch Hydrated Registry Truth (Profile + Relations)
                const profile = await getTeacherData(userEmail);

                if (!profile) {
                    toast.error('Identity record not discovered in registry.');
                    return;
                }

                // 3. Rule 17: Initialize Zustand Store (Tier 3 Sync)
                setProfile(profile as unknown as AnyProfile);
                
                toast.success('Security credentials synchronized.');

                // 4. Rule 2 & 6: Tiered Redirection Matrix
                const role = profile.role as Role;
                switch (role) {
                    case Role.SUPER_ADMIN:
                    case Role.SCHOOL_ADMIN:
                        router.replace('/admin');
                        break;
                    case Role.TEACHER:
                        router.replace('/teacher');
                        break;
                    case Role.STUDENT:
                    case Role.INDIVIDUAL_LEARNER:
                        router.replace('/student');
                        break;
                    case Role.PARENT:
                        router.replace('/parent');
                        break;
                    default:
                        router.replace('/login');
                }
            } catch (err: unknown) {
                toast.error(getErrorMessage(err));
            }
        });
    }

    return (
        <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-[3rem] shadow-2xl p-10 md:p-12 relative overflow-hidden group">
            
            {/* Ambient Background Aura */}
            <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary/10 rounded-full blur-3xl" />

            {/* Lock State Overlay */}
            {isPending && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
                    <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Encrypting_Registry_Key...</p>
                </div>
            )}

            {/* Header identity */}
            <div className="text-center mb-10 space-y-4">
                <div className="h-14 w-14 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-white/5 shadow-inner">
                    <Lock className="h-6 w-6 text-school-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Set Secret Key</h1>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                        Defining access node for: <span className="text-white">{userEmail}</span>
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">New Password String</Label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Confirm Bit-Sequence</Label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 py-4 text-sm text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {password.length > 0 && (
                    <div className="space-y-2 rounded-2xl bg-slate-950/50 border border-white/5 p-5 shadow-inner">
                        {rules.map((rule) => (
                            <div key={rule.label} className="flex items-center gap-3">
                                <CheckCircle2 className={cn("h-3.5 w-3.5 transition-colors", rule.pass ? 'text-emerald-500' : 'text-slate-800')} />
                                <span className={cn("text-[9px] font-black uppercase tracking-widest", rule.pass ? 'text-slate-300' : 'text-slate-600')}>
                                    {rule.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <Button 
                    type="submit" 
                    disabled={isPending || !allRulesPassed} 
                    className="w-full py-8 bg-school-primary text-slate-950 font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-xl shadow-school-primary/10"
                >
                    Finalize Registry Node
                </Button>
            </form>

            <div className="mt-10 flex justify-center items-center gap-2 text-slate-700">
                <ShieldCheck className="h-3 w-3" />
                <span className="text-[8px] font-black uppercase tracking-[0.4em]">Protocol_Secure_v1.2</span>
            </div>
        </div>
    );
}