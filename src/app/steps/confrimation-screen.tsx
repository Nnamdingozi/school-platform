// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { createClient } from '@/lib/supabase/client';
// import { toast } from 'sonner';
// import { Mail, Check, Loader2 } from 'lucide-react';

// export function ConfirmationScreen() {
//     // const { adminData, schoolData } = useOnboardingStore();
//     const { confirmedEmail, schoolData, setProvisioned, reset } = useOnboardingStore();
//     const [isResending, setIsResending] = useState(false);

//     async function handleResend() {
//         if (!confirmedEmail) {
//             toast.error('Email address not found. Please contact support.');
//             return;
//         }
//         setIsResending(true);
//         const supabase = createClient();
//         const { error } = await supabase.auth.resend({
//             type: 'signup',
//             email: confirmedEmail,
//         });
//         setIsResending(false);
//         if (error) {
//             toast.error('Could not resend. Please wait a moment and try again.');
//         } else {
//             toast.success('Confirmation email resent!');
//         }

       
//     }

//     function handleStartOver() {
//         reset();           // clears all store data
//         setProvisioned(false); // but reset already sets this to false, just explicit
//         // No router.push needed — shell will re-render to step 1 automatically
//     }
//     return (
//         <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center py-10 gap-6">
//             {/* Icon with green check badge */}
//             <div className="relative">
//                 <div className="h-20 w-20 rounded-full bg-school-primary/10 border-4 border-school-primary/30 flex items-center justify-center">
//                     <Mail className="h-9 w-9 text-school-primary" />
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-green-500 border-2 border-school-secondary-950 flex items-center justify-center">
//                     <Check className="h-3.5 w-3.5 text-white" />
//                 </div>
//             </div>

//             {/* Title */}
//             <div className="space-y-2">
//                 <h2 className="text-2xl font-black text-school-secondary-100 tracking-tight">
//                     Almost there! Check your inbox
//                 </h2>
//                 <p className="text-school-secondary-100/50 text-sm max-w-sm mx-auto leading-relaxed">
//                     We sent a confirmation link to{' '}
//                     <span className="text-school-primary font-semibold break-all">
//                         {confirmedEmail}
//                     </span>
//                     . Click it to activate your account and access your dashboard.
//                 </p>
//             </div>

//             {/* Steps */}
//             <div className="w-full max-w-sm rounded-xl bg-school-secondary-800 border border-school-secondary-700 p-4 text-left space-y-3">
//                 <p className="text-[10px] text-school-secondary-100/40 uppercase tracking-widest font-bold">
//                     What happens next
//                 </p>
//                 {[
//                     'Open the email from EduAI in your inbox',
//                     'Click the "Confirm your account" link',
//                     "You'll land directly on your school dashboard",
//                 ].map((step, i) => (
//                     <div key={i} className="flex items-start gap-3">
//                         <span className="h-5 w-5 rounded-full bg-school-primary/20 text-school-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
//                             {i + 1}
//                         </span>
//                         <p className="text-xs text-school-secondary-100/70 leading-relaxed">
//                             {step}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* School name pill */}
//             {schoolData?.schoolName && (
//                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-school-secondary-800 border border-school-secondary-700">
//                     <div
//                         className="h-3 w-3 rounded-full shrink-0"
//                         style={{ background: schoolData.primaryColor }}
//                     />
//                     <span className="text-xs text-school-secondary-100/60 font-medium">
//                         {schoolData.schoolName} workspace created
//                     </span>
//                 </div>
//             )}

//             {/* Resend */}
//             <p className="text-xs text-school-secondary-100/30">
//                 Didn't receive it? Check your spam folder or{' '}
//                 <button
//                     onClick={handleResend}
//                     disabled={isResending}
//                     className="text-school-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
//                 >
//                     {isResending ? (
//                         <>
//                             <Loader2 className="h-3 w-3 animate-spin" />
//                             Sending...
//                         </>
//                     ) : (
//                         'resend the email'
//                     )}
//                 </button>
//             </p>

//             <a
//                 href="/login"
//                 className="text-xs text-school-secondary-100 hover:text-school-secondary-100/50 transition-colors"
//             >
//                 Go to login page instead →
//             </a>
//             <button
//     onClick={handleStartOver}
//     className="text-xs text-school-secondary-100 hover:text-red-400 transition-colors mt-2"
// >
//     Onboard a different school instead
// </button>
//         </div>
//     );
// }


// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { createClient } from '@/lib/supabase/client';
// import { toast } from 'sonner';
// import { Mail, Check, Loader2 } from 'lucide-react';

// export function ConfirmationScreen() {
//     const { confirmedEmail, schoolData, setProvisioned, reset } = useOnboardingStore();
//     const [isResending, setIsResending] = useState(false);

//     async function handleResend() {
//         if (!confirmedEmail) {
//             toast.error('Email address not found. Please contact support.');
//             return;
//         }
//         setIsResending(true);
//         const supabase = createClient();
//         const { error } = await supabase.auth.resend({
//             type: 'signup',
//             email: confirmedEmail,
//         });
//         setIsResending(false);
//         if (error) {
//             toast.error('Could not resend. Please wait a moment and try again.');
//         } else {
//             toast.success('Confirmation email resent!');
//         }
//     }

//     function handleStartOver() {
//         reset();           
//         setProvisioned(false); 
//     }

//     return (
//         <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center py-10 gap-6">
//             <div className="relative">
//                 <div className="h-20 w-20 rounded-full bg-school-primary/10 border-4 border-school-primary/30 flex items-center justify-center">
//                     <Mail className="h-9 w-9 text-school-primary" />
//                 </div>
//                 <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-green-500 border-2 border-school-secondary-950 flex items-center justify-center">
//                     <Check className="h-3.5 w-3.5 text-white" />
//                 </div>
//             </div>

//             <div className="space-y-2">
//                 <h2 className="text-2xl font-black text-school-secondary-100 tracking-tight">
//                     Almost there! Check your inbox
//                 </h2>
//                 <p className="text-school-secondary-100/50 text-sm max-w-sm mx-auto leading-relaxed">
//                     We sent a confirmation link to{' '}
//                     <span className="text-school-primary font-semibold break-all">
//                         {confirmedEmail}
//                     </span>
//                     . Click it to activate your account and access your dashboard.
//                 </p>
//             </div>

//             <div className="w-full max-w-sm rounded-xl bg-school-secondary-800 border border-school-secondary-700 p-4 text-left space-y-3">
//                 <p className="text-[10px] text-school-secondary-100/40 uppercase tracking-widest font-bold">
//                     What happens next
//                 </p>
//                 {[
//                     'Open the email from EduAI in your inbox',
//                     'Click the "Confirm your account" link',
//                     // ✅ FIX 1: Handled apostrophe in JS string array
//                     "You'll land directly on your school dashboard",
//                 ].map((step, i) => (
//                     <div key={i} className="flex items-start gap-3">
//                         <span className="h-5 w-5 rounded-full bg-school-primary/20 text-school-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
//                             {i + 1}
//                         </span>
//                         <p className="text-xs text-school-secondary-100/70 leading-relaxed">
//                             {step}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {schoolData?.schoolName && (
//                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-school-secondary-800 border border-school-secondary-700">
//                     <div
//                         className="h-3 w-3 rounded-full shrink-0"
//                         style={{ background: schoolData.primaryColor }}
//                     />
//                     <span className="text-xs text-school-secondary-100/60 font-medium">
//                         {schoolData.schoolName} workspace created
//                     </span>
//                 </div>
//             )}

//             {/* ✅ FIX 2: Wrapped text in curly braces to escape apostrophe */}
//             <p className="text-xs text-school-secondary-100/30">
//                 {"Didn't receive it? Check your spam folder or "}
//                 <button
//                     onClick={handleResend}
//                     disabled={isResending}
//                     className="text-school-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1"
//                 >
//                     {isResending ? (
//                         <>
//                             <Loader2 className="h-3 w-3 animate-spin" />
//                             Sending...
//                         </>
//                     ) : (
//                         'resend the email'
//                     )}
//                 </button>
//             </p>

//             <a
//                 href="/login"
//                 className="text-xs text-school-secondary-100 hover:text-school-secondary-100/50 transition-colors"
//             >
//                 Go to login page instead →
//             </a>
//             <button
//                 onClick={handleStartOver}
//                 className="text-xs text-school-secondary-100 hover:text-red-400 transition-colors mt-2"
//             >
//                 Onboard a different school instead
//             </button>
//         </div>
//     );
// }



'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Mail, Check, Loader2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * PROVISIONING CONFIRMATION (Tier 2)
 * Rule 11: Final System Truth - Awaiting Email Verification.
 * Rule 17: Leverages Onboarding Store for persistent metadata.
 */
export function ConfirmationScreen() {
    const { confirmedEmail, schoolData, setProvisioned, reset } = useOnboardingStore();
    const [isResending, setIsResending] = useState(false);

    const primaryColor = schoolData?.primaryColor || "#f59e0b";

    async function handleResend() {
        if (!confirmedEmail) {
            toast.error('Identity node not found. Please contact support.');
            return;
        }
        setIsResending(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: confirmedEmail,
            });
            if (error) throw error;
            toast.success('Security link re-transmitted.');
        } catch (err) {
            toast.error('Transmission failure. Please try again.');
        } finally {
            setIsResending(false);
        }
    }

    function handleStartOver() {
        // Rule 11: Manual reset of the provisioning buffer
        reset();           
        setProvisioned(false); 
    }

    return (
        <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center text-center py-10 gap-8">
            
            {/* ── VISUAL STATUS ── */}
            <div className="relative">
                <div 
                    className="h-24 w-24 rounded-[2.5rem] border-4 flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30` }}
                >
                    <Mail className="h-10 w-10" style={{ color: primaryColor }} />
                </div>
                <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 border-4 border-slate-950 flex items-center justify-center shadow-lg">
                    <Check className="h-4 w-4 text-slate-950 stroke-[4]" />
                </div>
            </div>

            {/* ── MESSAGING ── */}
            <div className="space-y-3">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
                    Activation Pending
                </h2>
                <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
                    A security synchronization link has been dispatched to:{' '}
                    <span className="text-white font-black break-all block mt-1 underline decoration-white/10 underline-offset-4">
                        {confirmedEmail}
                    </span>
                </p>
            </div>

            {/* ── INSTRUCTIONAL NODES ── */}
            <div className="w-full max-w-sm rounded-[2rem] bg-slate-900 border border-white/5 p-6 text-left space-y-4 shadow-2xl">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                        Deployment Protocol
                    </p>
                </div>
                {[
                    'Locate the synchronization email from SchoolPaaS',
                    'Execute the "Confirm Identity" security node',
                    "Initialize your institutional dashboard node",
                ].map((step, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                        <span 
                            className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black italic shadow-inner"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                        >
                            0{i + 1}
                        </span>
                        <p className="text-xs font-bold text-slate-300 uppercase tracking-tight leading-relaxed group-hover:text-white transition-colors">
                            {step}
                        </p>
                    </div>
                ))}
            </div>

            {/* ── WORKSPACE PREVIEW ── */}
            {schoolData?.schoolName && (
                <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900 border border-white/5 shadow-inner">
                    <div
                        className="h-2.5 w-2.5 rounded-full shrink-0 animate-pulse"
                        style={{ backgroundColor: primaryColor }}
                    />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {schoolData.schoolName} Registry Node Reserved
                    </span>
                </div>
            )}

            {/* ── ACTIONS ── */}
            <div className="space-y-6 pt-4">
                <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                        Registry link not discovered?
                    </p>
                    <button
                        onClick={handleResend}
                        disabled={isResending}
                        className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto hover:brightness-125 transition-all"
                        style={{ color: primaryColor }}
                    >
                        {isResending ? (
                            <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Re-transmitting...</>
                        ) : (
                            <><Zap className="h-3.5 w-3.5 fill-current" /> Re-transmit Link</>
                        )}
                    </button>
                </div>

                <div className="flex flex-col gap-3 border-t border-white/5 pt-6">
                    <a
                        href="/login"
                        className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                    >
                        Access Terminal <ArrowRight className="h-3 w-3" />
                    </a>
                    <button
                        onClick={handleStartOver}
                        className="text-[9px] font-black text-slate-700 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                        Abort Provisioning & Restart
                    </button>
                </div>
            </div>
        </div>
    );
}