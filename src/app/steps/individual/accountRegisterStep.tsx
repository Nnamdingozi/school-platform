// 'use client';

// import { useState, useTransition } from 'react';
// import { useRegisterStore } from '@/store/individualOnboardingStore';
// import { registerUser } from '@/app/actions/auth';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { Role } from '@prisma/client';

// export function RegisterAccountStep() {
//     const { nextStep, setIdentity } = useRegisterStore();
//     const [isPending, startTransition] = useTransition();
//     const [form, setForm] = useState({ name: '', email: '', password: '' });

//     const handleNext = (e: React.FormEvent) => {
//         e.preventDefault();
//         if (form.password.length < 8) return toast.error("Security key too short.");

//         startTransition(async () => {
//             // Rule 11: Create the Auth user and Tier 3 Profile
//             const res = await registerUser({
//                 ...form,
//                 role: Role.INDIVIDUAL_LEARNER,
//                 curriculumId: "GLOBAL_DEFAULT_ID" // You can fetch this from DB
//             });

//             if (res.success) {
//                 setIdentity(form.name, form.email);
//                 nextStep();
//             } else {
//                 toast.error(res.error || "Identity creation failed.");
//             }
//         });
//     };

//     return (
//         <form onSubmit={handleNext} className="space-y-6 animate-in slide-in-from-right-4">
//             <div className="space-y-2">
//                 <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Legal Name</Label>
//                 <div className="relative group">
//                     <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                     <input 
//                         required
//                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-school-primary outline-none font-black uppercase italic text-sm"
//                         value={form.name}
//                         onChange={e => setForm({...form, name: e.target.value})}
//                     />
//                 </div>
//             </div>

//             <div className="space-y-2">
//                 <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Email Node</Label>
//                 <div className="relative group">
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                     <input 
//                         required
//                         type="email"
//                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-school-primary outline-none font-mono text-sm lowercase"
//                         value={form.email}
//                         onChange={e => setForm({...form, email: e.target.value})}
//                     />
//                 </div>
//             </div>

//             <div className="space-y-2">
//                 <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-2">Access Key</Label>
//                 <div className="relative group">
//                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                     <input 
//                         required
//                         type="password"
//                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-4 text-white focus:border-school-primary outline-none font-bold text-sm"
//                         value={form.password}
//                         onChange={e => setForm({...form, password: e.target.value})}
//                     />
//                 </div>
//             </div>

//             <Button className="w-full py-8 bg-school-primary text-slate-950 font-black rounded-2xl uppercase text-[11px] tracking-[0.3em] hover:scale-[1.02] shadow-xl">
//                 {isPending ? <Loader2 className="animate-spin" /> : <>Continue to Plans <ArrowRight className="ml-2 h-4 w-4" /></>}
//             </Button>
//         </form>
//     );
// }




// 'use client';

// import { useState, useTransition } from 'react';
// import { useRegisterStore } from '@/store/individualOnboardingStore';
// import { registerUser } from '@/app/actions/auth';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
// import { toast } from 'sonner';
// import { Role } from '@prisma/client';
// import { getErrorMessage } from '@/lib/error-handler';

// /**
//  * INDIVIDUAL IDENTITY PROVISIONING (Tier 3)
//  * Rule 11: Registers the user and establishes the Tier-3 registry context.
//  * Rule 17: Interacts with useRegisterStore for step navigation.
//  */
// export function RegisterAccountStep() {
//     // ✅ FIXED: nextStep is now available in the store
//     const { nextStep, setIdentity } = useRegisterStore();
//     const [isPending, startTransition] = useTransition();
    
//     const [form, setForm] = useState({ 
//         name: '', 
//         email: '', 
//         password: '' 
//     });

//     const handleNext = (e: React.FormEvent) => {
//         e.preventDefault();
        
//         if (form.password.length < 8) {
//             toast.error("Security Protocol: Access key must be at least 8 characters.");
//             return;
//         }

//         startTransition(async () => {
//             try {
//                 // Rule 11: System Truth - Creating the Individual Learner profile
//                 const res = await registerUser({
//                     name: form.name.trim(),
//                     email: form.email.trim().toLowerCase(),
//                     password: form.password,
//                     role: Role.INDIVIDUAL_LEARNER,
//                     // Tier 1 Default: Attaching to the global generic curriculum
//                     curriculumId: "generic-curriculum-id" 
//                 });

//                 if (res.success) {
//                     setIdentity(form.name, form.email);
//                     toast.success("Identity node initialized.");
//                     nextStep();
//                 } else {
//                     toast.error(res.error || "Registry error: Identity creation failed.");
//                 }
//             } catch (err: unknown) {
//                 toast.error(getErrorMessage(err));
//             }
//         });
//     };

//     return (
//         <form onSubmit={handleNext} className="space-y-8 animate-in slide-in-from-right-4 duration-500">
            
//             {/* NAME ENTRY */}
//             <div className="space-y-3">
//                 <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
//                     Full Display Name
//                 </Label>
//                 <div className="relative group">
//                     <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                     <input 
//                         required
//                         placeholder="e.g. ALEX RIDER"
//                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white focus:border-school-primary outline-none font-black uppercase italic text-sm transition-all"
//                         value={form.name}
//                         onChange={e => setForm({...form, name: e.target.value})}
//                     />
//                 </div>
//             </div>

//             {/* EMAIL ENTRY */}
//             <div className="space-y-3">
//                 <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
//                     Primary Email Node
//                 </Label>
//                 <div className="relative group">
//                     <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                     <input 
//                         required
//                         type="email"
//                         placeholder="learner@example.com"
//                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white focus:border-school-primary outline-none font-mono text-sm lowercase transition-all"
//                         value={form.email}
//                         onChange={e => setForm({...form, email: e.target.value})}
//                     />
//                 </div>
//             </div>

//             {/* PASSWORD ENTRY */}
//             <div className="space-y-3">
//                 <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
//                     Secure Access Key
//                 </Label>
//                 <div className="relative group">
//                     <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-school-primary transition-colors" />
//                     <input 
//                         required
//                         type="password"
//                         placeholder="••••••••"
//                         className="w-full bg-slate-950 border border-white/5 rounded-2xl pl-12 pr-6 py-5 text-white focus:border-school-primary outline-none font-bold text-sm transition-all"
//                         value={form.password}
//                         onChange={e => setForm({...form, password: e.target.value})}
//                     />
//                 </div>
//             </div>

//             {/* ACTION BUTTON */}
//             <Button 
//                 disabled={isPending}
//                 className="w-full py-8 bg-school-primary text-slate-950 font-black rounded-[2rem] uppercase text-[11px] tracking-[0.3em] hover:scale-[1.02] shadow-xl shadow-school-primary/10 transition-all flex items-center justify-center gap-3"
//             >
//                 {isPending ? (
//                     <>
//                         <Loader2 className="h-4 w-4 animate-spin" />
//                         Initializing...
//                     </>
//                 ) : (
//                     <>
//                         Select License Tier <ArrowRight className="h-4 w-4" />
//                     </>
//                 )}
//             </Button>

//             <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest">
//                 By initializing, you accept the Registry Protocols & Privacy Shield.
//             </p>
//         </form>
//     );
// }




'use client';

import React, { useState, useTransition } from 'react';
import { useRegisterStore } from '@/store/individualOnboardingStore';
import { registerUser } from '@/app/actions/auth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Role } from '@prisma/client';
import { getErrorMessage } from '@/lib/error-handler';
import { cn } from '@/lib/utils';

/**
 * INDIVIDUAL IDENTITY PROVISIONING (Tier 3)
 * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
 * Rule 18: Semantic Flip (bg-surface, bg-card, border-border).
 * Rule 19: Standardized Geometry (rounded-xl/2xl).
 * Rule 21: Scale Protocol for clean mathematical brand tints.
 */
export function RegisterAccountStep() {
    const { nextStep, setIdentity } = useRegisterStore();
    const [isPending, startTransition] = useTransition();
    
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '' 
    });

    const handleNext = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (form.password.length < 8) {
            toast.error("Security Protocol: Access credentials must be at least 8 characters.");
            return;
        }

        startTransition(async () => {
            try {
                // Rule 11: System Truth - Creating the Individual Learner profile in Tier 3
                const res = await registerUser({
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    password: form.password,
                    role: Role.INDIVIDUAL_LEARNER,
                    // Tier 1 Default: Mapping to the global curriculum core
                    curriculumId: "generic-curriculum-id" 
                });

                if (res.success) {
                    setIdentity(form.name, form.email);
                    toast.success("Identity profile initialized.");
                    nextStep();
                } else {
                    toast.error(res.error || "Identity creation protocol failed.");
                }
            } catch (err: unknown) {
                toast.error(getErrorMessage(err));
            }
        });
    };

    return (
        <form onSubmit={handleNext} className="space-y-8 animate-in slide-in-from-right-6 duration-700">
            
            {/* ── NAME ENTRY (Rule 11/18) ── */}
            <div className="space-y-3 group">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                    Full Identification
                </Label>
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                    <input 
                        required
                        placeholder="e.g. ALEX RIDER"
                        className={cn(
                            "w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-6 py-4 text-foreground outline-none transition-all",
                            "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary",
                            "font-extrabold uppercase italic text-sm placeholder:text-muted-foreground/20"
                        )}
                        value={form.name}
                        onChange={e => setForm({...form, name: e.target.value})}
                    />
                </div>
            </div>

            {/* ── EMAIL ENTRY (Rule 18/21) ── */}
            <div className="space-y-3 group">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                    Primary Email Node
                </Label>
                <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                    <input 
                        required
                        type="email"
                        placeholder="learner@registry.node"
                        className={cn(
                            "w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-6 py-4 text-foreground outline-none transition-all",
                            "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary",
                            "font-mono text-sm lowercase placeholder:text-muted-foreground/20"
                        )}
                        value={form.email}
                        onChange={e => setForm({...form, email: e.target.value})}
                    />
                </div>
            </div>

            {/* ── PASSWORD ENTRY ── */}
            <div className="space-y-3 group">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-widest ml-1 transition-colors group-focus-within:text-school-primary">
                    Security Credentials
                </Label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-school-primary transition-colors" />
                    <input 
                        required
                        type="password"
                        placeholder="••••••••"
                        className={cn(
                            "w-full h-14 bg-surface border border-border rounded-xl pl-12 pr-6 py-4 text-foreground outline-none transition-all",
                            "focus:ring-2 focus:ring-school-primary-200 focus:border-school-primary",
                            "font-bold text-sm placeholder:text-muted-foreground/20"
                        )}
                        value={form.password}
                        onChange={e => setForm({...form, password: e.target.value})}
                    />
                </div>
            </div>

            {/* ── ACTION BUTTON (Rule 21) ── */}
            <div className="pt-4">
                <Button 
                    disabled={isPending}
                    className={cn(
                        "w-full h-16 bg-school-primary text-on-school-primary font-extrabold rounded-2xl transition-all",
                        "uppercase text-[11px] tracking-widest hover:brightness-110 active:scale-95",
                        "shadow-xl shadow-school-primary-200 disabled:opacity-20 flex items-center justify-center gap-3"
                    )}
                >
                    {isPending ? (
                        <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Synchronizing...
                        </>
                    ) : (
                        <>
                            Select License Tier <ArrowRight className="h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>

            <p className="text-center text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 leading-relaxed italic">
                By initializing this profile, you accept the Registry Protocols & Privacy Shield infrastructure.
            </p>
        </form>
    );
}