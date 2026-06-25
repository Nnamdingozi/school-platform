// 'use client';

// import { useState, useTransition } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { getRegistryProfile } from '@/app/actions/profileRegistry';
// import { useProfileStore } from '@/store/profileStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
// import { type AnyProfile } from '@/types/profile';
// import { Role } from '@prisma/client';
// import { getErrorMessage } from '@/lib/error-handler';
// import { cn } from '@/lib/utils';

// interface SetPasswordFormProps {
//     userEmail: string;
// }

// /**
//  * SECURITY CREDENTIALING INTERFACE (Tier 3)
//  * Rule 11: Finalizes user layer logic and hydrates Global Context.
//  * Rule 17: Syncs the Zustand Store directly to prevent prop-drilling identity.
//  */
// export function SetPasswordForm({ userEmail }: SetPasswordFormProps) {
//     const router = useRouter();
//     const setProfile = useProfileStore((state) => state.setProfile);
//     const [isPending, startTransition] = useTransition();

//     const [password, setPassword] = useState('');
//     const [confirm, setConfirm] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     // Registry Validation Protocol
//     const rules = [
//         { label: 'Minimum 8 Characters', pass: password.length >= 8 },
//         { label: 'Numeric Sequence Integration', pass: /\d/.test(password) },
//         { label: 'Bitwise Sequence Match', pass: password === confirm && confirm.length > 0 },
//     ];
    
//     const allRulesPassed = rules.every((r) => r.pass);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!allRulesPassed) return;

//         startTransition(async () => {
//             try {
//                 const supabase = createClient();

//                 // 1. Update Auth Key in Supabase
//                 const { error: authError } = await supabase.auth.updateUser({ password });
//                 if (authError) throw authError;

//                 // 2. Rule 11: Fetch Hydrated Registry Truth (Profile + Relations)
//                 const profile = await getRegistryProfile(userEmail);

//                 if (!profile) {
//                     toast.error('Identity record not discovered in registry.');
//                     return;
//                 }

//                 // 3. Rule 17: Initialize Zustand Store (Tier 3 Sync)
//                 setProfile(profile as unknown as AnyProfile);
                
//                 toast.success('Security credentials synchronized.');

//                 // 4. Rule 2 & 6: Tiered Redirection Matrix
//                 const role = profile.role as Role;
//                 switch (role) {
//                     case Role.SUPER_ADMIN:
//                     case Role.SCHOOL_ADMIN:
//                         router.replace('/admin');
//                         break;
//                     case Role.TEACHER:
//                         router.replace('/teacher');
//                         break;
//                     case Role.STUDENT:
//                     case Role.INDIVIDUAL_LEARNER:
//                         router.replace('/student');
//                         break;
//                     case Role.PARENT:
//                         router.replace('/parent');
//                         break;
//                     default:
//                         router.replace('/login');
//                 }
//             } catch (err: unknown) {
//                 toast.error(getErrorMessage(err));
//             }
//         });
//     }

//     return (
//         <div className="w-full max-w-md bg-slate-900 border border-white/5 rounded-[3rem] shadow-2xl p-10 md:p-12 relative overflow-hidden group">
            
//             {/* Ambient Background Aura */}
//             <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary/10 rounded-full blur-3xl" />

//             {/* Lock State Overlay */}
//             {isPending && (
//                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/90 backdrop-blur-sm animate-in fade-in duration-300">
//                     <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//                     <p className="text-white text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Encrypting_Registry_Key...</p>
//                 </div>
//             )}

//             {/* Header identity */}
//             <div className="text-center mb-10 space-y-4">
//                 <div className="h-14 w-14 bg-slate-950 rounded-2xl flex items-center justify-center mx-auto border border-white/5 shadow-inner">
//                     <Lock className="h-6 w-6 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Set Secret Key</h1>
//                     <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
//                         Defining access node for: <span className="text-white">{userEmail}</span>
//                     </p>
//                 </div>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                     <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">New Password String</Label>
//                     <div className="relative group">
//                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-12 py-4 text-sm text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
//                             placeholder="••••••••"
//                             required
//                         />
//                         <button
//                             type="button"
//                             className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors"
//                             onClick={() => setShowPassword(!showPassword)}
//                         >
//                             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                     </div>
//                 </div>

//                 <div className="space-y-2">
//                     <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Confirm Bit-Sequence</Label>
//                     <div className="relative group">
//                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             value={confirm}
//                             onChange={(e) => setConfirm(e.target.value)}
//                             className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 py-4 text-sm text-white focus:border-school-primary outline-none transition-all placeholder:text-slate-800 font-bold"
//                             placeholder="••••••••"
//                             required
//                         />
//                     </div>
//                 </div>

//                 {password.length > 0 && (
//                     <div className="space-y-2 rounded-2xl bg-slate-950/50 border border-white/5 p-5 shadow-inner">
//                         {rules.map((rule) => (
//                             <div key={rule.label} className="flex items-center gap-3">
//                                 <CheckCircle2 className={cn("h-3.5 w-3.5 transition-colors", rule.pass ? 'text-emerald-500' : 'text-slate-800')} />
//                                 <span className={cn("text-[9px] font-black uppercase tracking-widest", rule.pass ? 'text-slate-300' : 'text-slate-600')}>
//                                     {rule.label}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 <Button 
//                     type="submit" 
//                     disabled={isPending || !allRulesPassed} 
//                     className="w-full py-8 bg-school-primary text-slate-950 font-black rounded-2xl text-[11px] uppercase tracking-[0.3em] hover:scale-[1.02] transition-all shadow-xl shadow-school-primary/10"
//                 >
//                     Finalize Registry Node
//                 </Button>
//             </form>

//             <div className="mt-10 flex justify-center items-center gap-2 text-slate-700">
//                 <ShieldCheck className="h-3 w-3" />
//                 <span className="text-[8px] font-black uppercase tracking-[0.4em]">Protocol_Secure_v1.2</span>
//             </div>
//         </div>
//     );
// }



'use client';

// import React, { useState, useTransition } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { getRegistryProfile } from '@/app/actions/profileRegistry';
// import { useProfileStore } from '@/store/profileStore';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
// import { type AnyProfile } from '@/types/profile';
// import { Role } from '@prisma/client';
// import { getErrorMessage } from '@/lib/error-handler';
// import { cn } from '@/lib/utils';

// interface SetPasswordFormProps {
//     userEmail: string;
// }

// /**
//  * SECURITY CREDENTIALING TERMINAL (Tier 3)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 17: Anti-Prop Drilling - syncs store directly.
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [3rem].
//  * Rule 21: Scale Protocol for mathematical brand tints.
//  */
// export function SetPasswordForm({ userEmail }: SetPasswordFormProps) {
//     const router = useRouter();
//     const setProfile = useProfileStore((state) => state.setProfile);
//     const [isPending, startTransition] = useTransition();

//     const [password, setPassword] = useState('');
//     const [confirm, setConfirm] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     // Registry Validation Protocol (Rule 11 System Truth)
//     const validationRules = [
//         { label: 'Minimum 8 Characters', pass: password.length >= 8 },
//         { label: 'Numeric Sequence Integration', pass: /\d/.test(password) },
//         { label: 'Credential Sequence Match', pass: password === confirm && confirm.length > 0 },
//     ];
    
//     const allRulesPassed = validationRules.every((r) => r.pass);

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (!allRulesPassed) return;

//         startTransition(async () => {
//             try {
//                 const supabase = createClient();

//                 // 1. Supabase Security Hub Update
//                 const { error: authError } = await supabase.auth.updateUser({ password });
//                 if (authError) throw authError;

//                 // 2. Rule 11: Authorized Registry Hydration
//                 const profile = await getRegistryProfile(userEmail);

//                 if (!profile) {
//                     toast.error('Identity record not discovered in registry.');
//                     return;
//                 }

//                 // 3. Rule 17: Synchronize Global Store
//                 setProfile(profile as unknown as AnyProfile);
                
//                 toast.success('Security credentials synchronized.');

//                 // 4. Contextual Redirection Matrix (Rule 6)
//                 const role = profile.role as Role;
//                 switch (role) {
//                     case Role.SUPER_ADMIN:
//                     case Role.SCHOOL_ADMIN:
//                         router.replace('/admin');
//                         break;
//                     case Role.TEACHER:
//                         router.replace('/teacher');
//                         break;
//                     case Role.STUDENT:
//                     case Role.INDIVIDUAL_LEARNER:
//                         router.replace('/student');
//                         break;
//                     case Role.PARENT:
//                         router.replace('/parent');
//                         break;
//                     default:
//                         router.replace('/login');
//                 }
//             } catch (err: unknown) {
//                 toast.error(getErrorMessage(err));
//             }
//         });
//     }

//     return (
//         <div className="w-full max-w-md bg-card border border-border rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden group animate-in fade-in zoom-in-95 duration-700">
            
//             {/* Rule 21: Scale Protocol Background Accent */}
//             <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary-50 rounded-full blur-3xl opacity-50" />

//             {/* SYNC OVERLAY (Rule 14) */}
//             {isPending && (
//                 <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card/90 backdrop-blur-md animate-in fade-in duration-300">
//                     <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
//                     <p className="text-foreground text-[10px] font-extrabold uppercase tracking-[0.4em] animate-pulse">Synchronizing_Profile...</p>
//                 </div>
//             )}

//             {/* ── HEADER (Rule 11) ── */}
//             <div className="text-center mb-10 space-y-4 relative">
//                 {/* Rule 21 Scale Protocol Icon hub */}
//                 <div className="h-16 w-16 bg-surface rounded-2xl flex items-center justify-center mx-auto border border-border shadow-inner">
//                     <Lock className="h-7 w-7 text-school-primary" />
//                 </div>
//                 <div>
//                     <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                         Secure Access Hub
//                     </h1>
//                     <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mt-2">
//                         Defining access profile for: <span className="text-foreground font-extrabold">{userEmail}</span>
//                     </p>
//                 </div>
//             </div>

//             {/* ── FORM ── */}
//             <form onSubmit={handleSubmit} className="space-y-8 relative">
//                 <div className="space-y-2 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">New Access Key</Label>
//                     <div className="relative">
//                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             value={password}
//                             onChange={(e) => setPassword(e.target.value)}
//                             className={cn(
//                                 "w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-12 text-sm text-foreground outline-none transition-all font-bold",
//                                 "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary placeholder:text-muted-foreground/20"
//                             )}
//                             placeholder="••••••••"
//                             required
//                         />
//                         <button
//                             type="button"
//                             className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
//                             onClick={() => setShowPassword((prev) => !prev)}
//                         >
//                             {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//                         </button>
//                     </div>
//                 </div>

//                 <div className="space-y-2 group">
//                     <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">Verify Sequence</Label>
//                     <div className="relative">
//                         <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
//                         <input
//                             type={showPassword ? 'text' : 'password'}
//                             value={confirm}
//                             onChange={(e) => setConfirm(e.target.value)}
//                             className={cn(
//                                 "w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-12 text-sm text-foreground outline-none transition-all font-bold",
//                                 "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary placeholder:text-muted-foreground/20"
//                             )}
//                             placeholder="••••••••"
//                             required
//                         />
//                     </div>
//                 </div>

//                 {/* ── VALIDATION MATRIX (Rule 21) ── */}
//                 {password.length > 0 && (
//                     <div className="space-y-3 rounded-2xl bg-surface border border-border p-5 shadow-inner">
//                         <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest italic mb-2">Protocol Requirements</p>
//                         {validationRules.map((rule) => (
//                             <div key={rule.label} className="flex items-center gap-3">
//                                 <CheckCircle2 className={cn("h-4 w-4 transition-colors", rule.pass ? 'text-emerald-500' : 'text-muted-foreground/20')} />
//                                 <span className={cn("text-[10px] font-bold uppercase tracking-widest", rule.pass ? 'text-foreground' : 'text-muted-foreground/40')}>
//                                     {rule.label}
//                                 </span>
//                             </div>
//                         ))}
//                     </div>
//                 )}

//                 {/* ── ACTION HUB (Rule 21) ── */}
//                 <Button 
//                     type="submit" 
//                     disabled={isPending || !allRulesPassed} 
//                     className={cn(
//                         "w-full h-16 bg-school-primary text-on-school-primary font-extrabold rounded-2xl transition-all shadow-xl active:scale-95",
//                         "text-[11px] uppercase tracking-widest shadow-school-primary-200 disabled:opacity-20"
//                     )}
//                 >
//                     {isPending ? (
//                         <div className="flex items-center gap-3"><Loader2 className="h-5 w-5 animate-spin" /> Finalizing Hub...</div>
//                     ) : (
//                         <div className="flex items-center gap-3">Finalize Registry Profile <Zap className="h-4 w-4 fill-current" /></div>
//                     )}
//                 </Button>
//             </form>

//             <div className="mt-12 flex justify-center items-center gap-3 text-muted-foreground/40 italic">
//                 <ShieldCheck className="h-4 w-4" />
//                 <span className="text-[9px] font-bold uppercase tracking-[0.4em]">Protocol_Secure_v1.2</span>
//             </div>
//         </div>
//     );
// }

'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { getRegistryProfile } from '@/app/actions/profileRegistry';
import { acceptInvitation } from '@/app/actions/invitations';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, CheckCircle2, ShieldCheck, Zap, Building2 } from 'lucide-react';
import { type AnyProfile } from '@/types/profile';
import { Role } from '@prisma/client';
import { getErrorMessage } from '@/lib/error-handler';
import { cn } from '@/lib/utils';

// ── Props ───────────────────────────────────────────────────────────────────

interface SetPasswordFormProps {
    userEmail: string;
    invitationToken: string;
    schoolName: string;
}

// ── Component ────────────────────────────────────────────────────────────────

export function SetPasswordForm({ userEmail, invitationToken, schoolName }: SetPasswordFormProps) {
    const router = useRouter();
    const setProfile = useProfileStore((state) => state.setProfile);
    const [isPending, startTransition] = useTransition();

    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ── Validation Rules ──────────────────────────────────────────────────────

    const validationRules = [
        { label: 'Minimum 8 Characters', pass: password.length >= 8 },
        { label: 'Numeric Sequence Integration', pass: /\d/.test(password) },
        { label: 'Credential Sequence Match', pass: password === confirm && confirm.length > 0 },
    ];

    const allRulesPassed = validationRules.every((r) => r.pass);

    // ── Submit Handler ────────────────────────────────────────────────────────

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!allRulesPassed) return;

        startTransition(async () => {
            try {
                const supabase = createClient();

                // 1. Set the password — session already exists from invite
                //    code exchange that happened on the server page
                const { error: authError } = await supabase.auth.updateUser({ password });
                if (authError) throw new Error(authError.message);

                // 2. Get current user ID for profile provisioning
                const { data: { user: currentUser }, error: userError } =
                    await supabase.auth.getUser();

                if (userError || !currentUser) {
                    throw new Error('Session lost. Please click the invite link again.');
                }

                // 3. Mark invitation accepted + provision profile atomically
                const result = await acceptInvitation(
                    invitationToken,
                    userEmail,
                    currentUser.id
                );
                if (!result.success) {
                    throw new Error(result.error ?? 'Failed to accept invitation.');
                }

                // 4. Hydrate global profile store
                const profile = await getRegistryProfile(userEmail);
                if (!profile) {
                    toast.error('Identity record not discovered in registry.');
                    return;
                }

                setProfile(profile as unknown as AnyProfile);
                toast.success('Security credentials synchronized.');

                // 5. Role-based redirect
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
    };

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className="w-full max-w-md bg-card border border-border rounded-[3rem] shadow-2xl p-8 md:p-12 relative overflow-hidden animate-in fade-in zoom-in-95 duration-700">

            {/* Background accent */}
            <div className="absolute -top-24 -right-24 h-48 w-48 bg-school-primary-50 rounded-full blur-3xl opacity-50 pointer-events-none" />

            {/* Processing overlay */}
            {isPending && (
                <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-card/90 backdrop-blur-md rounded-[3rem] animate-in fade-in duration-300">
                    <Loader2 className="h-10 w-10 animate-spin text-school-primary mb-4" />
                    <p className="text-foreground text-[10px] font-extrabold uppercase tracking-[0.4em] animate-pulse">
                        Synchronizing_Profile...
                    </p>
                </div>
            )}

            {/* Header */}
            <div className="text-center mb-10 space-y-4 relative">
                <div className="h-16 w-16 bg-surface rounded-2xl flex items-center justify-center mx-auto border border-border shadow-inner">
                    <Lock className="h-7 w-7 text-school-primary" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-2xl md:text-3xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
                        Secure Access Hub
                    </h1>
                    <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        Defining access profile for:{' '}
                        <span className="text-foreground font-extrabold">{userEmail}</span>
                    </p>
                </div>

                {/* School context badge */}
                <div className="flex items-center justify-center gap-2 bg-surface border border-border rounded-xl px-4 py-2 w-fit mx-auto">
                    <Building2 className="h-3 w-3 text-school-primary shrink-0" />
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground">
                        {schoolName}
                    </span>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-8 relative">

                {/* Password field */}
                <div className="space-y-2 group">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                        New Access Key
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-12 text-sm text-foreground outline-none transition-all font-bold",
                                "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary placeholder:text-muted-foreground/20"
                            )}
                            placeholder="••••••••"
                            required
                        />
                        <button
                            type="button"
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-all"
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                {/* Confirm password field */}
                <div className="space-y-2 group">
                    <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                        Verify Sequence
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className={cn(
                                "w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-12 text-sm text-foreground outline-none transition-all font-bold",
                                "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary placeholder:text-muted-foreground/20"
                            )}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                </div>

                {/* Validation matrix */}
                {password.length > 0 && (
                    <div className="space-y-3 rounded-2xl bg-surface border border-border p-5 shadow-inner">
                        <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest italic">
                            Protocol Requirements
                        </p>
                        {validationRules.map((rule) => (
                            <div key={rule.label} className="flex items-center gap-3">
                                <CheckCircle2 className={cn(
                                    "h-4 w-4 transition-colors",
                                    rule.pass ? 'text-emerald-500' : 'text-muted-foreground/20'
                                )} />
                                <span className={cn(
                                    "text-[10px] font-bold uppercase tracking-widest",
                                    rule.pass ? 'text-foreground' : 'text-muted-foreground/40'
                                )}>
                                    {rule.label}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                {/* Submit */}
                <Button
                    type="submit"
                    disabled={isPending || !allRulesPassed}
                    className={cn(
                        "w-full h-16 bg-school-primary text-on-school-primary font-extrabold rounded-2xl transition-all shadow-xl active:scale-95",
                        "text-[11px] uppercase tracking-widest shadow-school-primary-200 disabled:opacity-20"
                    )}
                >
                    {isPending ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Finalizing Hub...
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            Finalize Registry Profile
                            <Zap className="h-4 w-4 fill-current" />
                        </div>
                    )}
                </Button>
            </form>

            {/* Footer */}
            <div className="mt-12 flex justify-center items-center gap-3 text-muted-foreground/40 italic">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-[9px] font-bold uppercase tracking-[0.4em]">
                    Protocol_Secure_v1.2
                </span>
            </div>
        </div>
    );
}