// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toTitleCase, formatPhone } from '@/lib/utils/formatters'
// // ✅ FIX 1: Removed unused 'toast' import
// import { Eye, EyeOff, ArrowRight, User, Mail, Lock, Phone, CheckCircle } from 'lucide-react';
// import { cn } from '@/lib/utils';

// export function AdminStep() {
//     // ✅ FIX 2: Removed unused 'setLoading' from store destructuring
//     const { nextStep, setAdminData, setError, isLoading, error, adminData } = useOnboardingStore();
//     const [showPassword, setShowPassword] = useState(false);

//     const [form, setForm] = useState({
//         name: adminData?.name ?? '',
//         email: adminData?.email ?? '',
//         password: adminData?.password ?? '',
//         phone: adminData?.phone ?? '',
//     });

//     const alreadyRegistered = !!adminData?.email;

//     const passwordStrength = (pwd: string) => {
//         if (pwd.length === 0) return 0;
//         let score = 0;
//         if (pwd.length >= 8) score++;
//         if (/[A-Z]/.test(pwd)) score++;
//         if (/[0-9]/.test(pwd)) score++;
//         if (/[^A-Za-z0-9]/.test(pwd)) score++;
//         return score;
//     };

//     const strength = passwordStrength(form.password);
//     const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
//     const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-green-500'][strength];

//     async function handleSubmit(e: React.FormEvent) {
//         e.preventDefault();
//         setError(null);

//         if (form.password.length < 8) {
//             setError('Password must be at least 8 characters.');
//             return;
//         }
//         setAdminData({
//             ...form,
//             name: toTitleCase(form.name),
//             phone: formatPhone(form.phone),
//         })
//         nextStep();
//     }

//     return (
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//             <div className="mb-8 text-center">
//                 <h1 className="text-3xl font-black text-school-secondary-100 tracking-tight">
//                     Create your account
//                 </h1>
//                 {/* ✅ FIX 3: Escaped the apostrophe using curly braces */}
//                 <p className="text-school-secondary-100 mt-2 text-sm">
//                     {"You'll be the administrator of your school workspace."}
//                 </p>
//             </div>

//             {alreadyRegistered && (
//                 <div className="mb-5 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-3">
//                     <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />
//                     <div>
//                         <p className="text-green-400 text-sm font-semibold">Account already created</p>
//                         <p className="text-green-400/70 text-xs">Continuing as {adminData?.email}</p>
//                     </div>
//                 </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-5">
//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         Full Name
//                     </Label>
//                     <div className="relative">
//                         <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                         <Input
//                             value={form.name}
//                             onChange={(e) => setForm({ ...form, name: e.target.value })}
//                             onBlur={(e) => setForm({ ...form, name: toTitleCase(e.target.value) })}
//                             placeholder="Dr. Sarah Johnson"
//                             required
//                             disabled={alreadyRegistered}
//                             className={cn(
//                                 "pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20",
//                                 alreadyRegistered && "opacity-50 cursor-not-allowed"
//                             )}
//                         />
//                     </div>
//                 </div>

//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         Email Address
//                     </Label>
//                     <div className="relative">
//                         <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                         <Input
//                             type="email"
//                             value={form.email}
//                             onChange={(e) => setForm({ ...form, email: e.target.value })}
//                             placeholder="admin@yourschool.edu"
//                             required
//                             disabled={alreadyRegistered}
//                             className={cn(
//                                 "pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20",
//                                 alreadyRegistered && "opacity-50 cursor-not-allowed"
//                             )}
//                         />
//                     </div>
//                 </div>

//                 <div className="space-y-1.5">
//                     <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                         Phone Number{' '}
//                         <span className="text-school-secondary-100/30 normal-case font-normal">(optional)</span>
//                     </Label>
//                     <div className="relative">
//                         <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                         <Input
//                             type="tel"
//                             value={form.phone}
//                             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//                             onBlur={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
//                             placeholder="+234 800 000 0000"
//                             disabled={alreadyRegistered}
//                             className={cn(
//                                 "pl-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20",
//                                 alreadyRegistered && "opacity-50 cursor-not-allowed"
//                             )}
//                         />
//                     </div>
//                 </div>

//                 {!alreadyRegistered && (
//                     <div className="space-y-1.5">
//                         <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                             Password
//                         </Label>
//                         <div className="relative">
//                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                             <Input
//                                 type={showPassword ? 'text' : 'password'}
//                                 value={form.password}
//                                 onChange={(e) => setForm({ ...form, password: e.target.value })}
//                                 placeholder="Min. 8 characters"
//                                 required
//                                 className="pl-10 pr-10 bg-school-secondary-800 border-school-secondary-700 text-school-secondary-100 placeholder:text-school-secondary-100/30 focus:border-school-primary focus:ring-school-primary/20"
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-100/30 hover:text-school-secondary-100/70 transition-colors"
//                             >
//                                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                             </button>
//                         </div>

//                         {form.password.length > 0 && (
//                             <div className="space-y-1">
//                                 <div className="flex gap-1">
//                                     {[1, 2, 3, 4].map((i) => (
//                                         <div
//                                             key={i}
//                                             className={cn(
//                                                 "h-1 flex-1 rounded-full transition-all duration-300",
//                                                 i <= strength ? strengthColor : "bg-school-secondary-700"
//                                             )}
//                                         />
//                                     ))}
//                                 </div>
//                                 <p className="text-xs text-school-secondary-100/40">
//                                     Password strength:{' '}
//                                     <span className={cn(
//                                         strength === 1 && "text-red-400",
//                                         strength === 2 && "text-amber-400",
//                                         strength === 3 && "text-yellow-400",
//                                         strength === 4 && "text-green-400",
//                                     )}>
//                                         {strengthLabel}
//                                     </span>
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 )}

//                 {error && (
//                     <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
//                         {error}
//                     </div>
//                 )}

//                 <Button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold h-11 transition-all duration-200 hover:scale-[1.01]"
//                 >
//                     {isLoading ? (
//                         <span className="flex items-center gap-2">
//                             <span className="h-4 w-4 border-2 border-school-secondary-950/30 border-t-school-secondary-950 rounded-full animate-spin" />
//                             Processing...
//                         </span>
//                     ) : (
//                         <span className="flex items-center gap-2">
//                             {alreadyRegistered ? 'Continue' : 'Continue to Plan Selection'}
//                             <ArrowRight className="h-4 w-4" />
//                         </span>
//                     )}
//                 </Button>

//                 <p className="text-center text-xs text-school-secondary-100">
//                     Already have an account?{' '}
//                     <a href="/login" className="text-school-primary hover:underline">Sign in</a>
//                 </p>
//             </form>
//         </div>
//     );
// }


'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toTitleCase, formatPhone } from '@/lib/utils/formatters';
import { 
    Eye, EyeOff, ArrowRight, User, 
    Mail, Lock, Phone, CheckCircle2,
   Loader2, Fingerprint 
} from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ONBOARDING PHASE 01: IDENTITY PROVISIONING
 * Rule 1: Institutional Layer Initialization.
 * Rule 11: Enforces Registry typography and branding.
 */
export function AdminStep() {
    const { nextStep, setAdminData, setError, isLoading, error, adminData } = useOnboardingStore();
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        name: adminData?.name ?? '',
        email: adminData?.email ?? '',
        password: adminData?.password ?? '',
        phone: adminData?.phone ?? '',
    });

    const alreadyRegistered = !!adminData?.email;

    const passwordStrength = (pwd: string) => {
        if (pwd.length === 0) return 0;
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strength = passwordStrength(form.password);
    const strengthLabel = ['', 'Critical', 'Moderate', 'Secure', 'Optimal'][strength];
    const strengthColor = ['', 'bg-red-500', 'bg-amber-500', 'bg-yellow-400', 'bg-emerald-500'][strength];

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!alreadyRegistered && form.password.length < 8) {
            setError('Security protocol requires at least 8 characters.');
            return;
        }

        setAdminData({
            ...form,
            name: toTitleCase(form.name),
            phone: formatPhone(form.phone),
        });
        
        nextStep();
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8">
            
            {/* ── HEADER ── */}
            <div className="text-center space-y-2">
                <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-school-primary/10 border border-school-primary/20 flex items-center justify-center shadow-xl shadow-school-primary/5">
                        <Fingerprint className="h-6 w-6 text-school-primary" />
                    </div>
                </div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Identity Setup
                </h1>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">
                    Establish the master administrator node
                </p>
            </div>

            {alreadyRegistered && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4 animate-in zoom-in-95">
                    <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                    <div>
                        <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Node Provisioned</p>
                        <p className="text-slate-400 text-xs font-medium italic">Synchronized as: {adminData?.email}</p>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* NAME FIELD */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Full Legal Name
                    </Label>
                    <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                        <Input
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            onBlur={(e) => setForm({ ...form, name: toTitleCase(e.target.value) })}
                            placeholder="e.g. DR. SARAH JOHNSON"
                            required
                            disabled={alreadyRegistered}
                            className="pl-12 bg-slate-900 border-white/5 text-white font-black uppercase italic text-sm rounded-2xl h-14 focus:border-school-primary transition-all"
                        />
                    </div>
                </div>

                {/* EMAIL FIELD */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Institutional Email
                    </Label>
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                        <Input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            placeholder="admin@schoolpaas.com"
                            required
                            disabled={alreadyRegistered}
                            className="pl-12 bg-slate-900 border-white/5 text-white font-mono lowercase text-sm rounded-2xl h-14 focus:border-school-primary transition-all"
                        />
                    </div>
                </div>

                {/* PHONE FIELD */}
                <div className="space-y-2">
                    <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                        Contact Node (Optional)
                    </Label>
                    <div className="relative group">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                        <Input
                            type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            onBlur={(e) => setForm({ ...form, phone: formatPhone(e.target.value) })}
                            placeholder="+234..."
                            disabled={alreadyRegistered}
                            className="pl-12 bg-slate-900 border-white/5 text-white font-mono text-sm rounded-2xl h-14 focus:border-school-primary transition-all"
                        />
                    </div>
                </div>

                {/* PASSWORD FIELD (Only for new registrations) */}
                {!alreadyRegistered && (
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                            Access Secret Key
                        </Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
                            <Input
                                type={showPassword ? 'text' : 'password'}
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                placeholder="Min. 8 Bits"
                                required
                                className="pl-12 pr-12 bg-slate-900 border-white/5 text-white font-bold text-sm rounded-2xl h-14 focus:border-school-primary transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>

                        {form.password.length > 0 && (
                            <div className="p-4 bg-slate-950/50 rounded-2xl border border-white/5 space-y-3">
                                <div className="flex gap-1.5">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className={cn(
                                                "h-1 flex-1 rounded-full transition-all duration-500",
                                                i <= strength ? strengthColor : "bg-slate-800"
                                            )}
                                        />
                                    ))}
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-[9px] text-slate-600 font-black uppercase tracking-tighter italic">Encryption Strength</p>
                                    <span className={cn(
                                        "text-[9px] font-black uppercase italic",
                                        strength === 1 && "text-red-500",
                                        strength === 2 && "text-amber-500",
                                        strength === 3 && "text-yellow-400",
                                        strength === 4 && "text-emerald-500",
                                    )}>
                                        {strengthLabel}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* ERROR PANEL */}
                {error && (
                    <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest italic animate-in shake">
                        Protocol Error: {error}
                    </div>
                )}

                {/* SUBMIT ACTION */}
                <div className="pt-4 space-y-6">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-school-primary hover:scale-[1.02] active:scale-95 text-slate-950 font-black h-16 rounded-2xl transition-all duration-300 shadow-2xl shadow-school-primary/10 text-xs tracking-[0.2em] uppercase group"
                    >
                        {isLoading ? (
                            <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                            <span className="flex items-center gap-3">
                                {alreadyRegistered ? 'PROCEED TO RE-SYNC' : 'INITIALIZE SYNC'}
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                        )}
                    </Button>

                    <p className="text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Node already exists?{' '}
                        <a href="/login" className="text-school-primary hover:underline italic">Initialize access</a>
                    </p>
                </div>
            </form>
        </div>
    );
}