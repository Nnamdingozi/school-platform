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


'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Mail, Check, Loader2 } from 'lucide-react';

export function ConfirmationScreen() {
    const { confirmedEmail, schoolData, setProvisioned, reset } = useOnboardingStore();
    const [isResending, setIsResending] = useState(false);

    async function handleResend() {
        if (!confirmedEmail) {
            toast.error('Email address not found. Please contact support.');
            return;
        }
        setIsResending(true);
        const supabase = createClient();
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email: confirmedEmail,
        });
        setIsResending(false);
        if (error) {
            toast.error('Could not resend. Please wait a moment and try again.');
        } else {
            toast.success('Confirmation email resent!');
        }
    }

    function handleStartOver() {
        reset();           
        setProvisioned(false); 
    }

    return (
        <div className="animate-in fade-in zoom-in-95 duration-500 flex flex-col items-center text-center py-10 gap-6">
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
                    . Click it to activate your account and access your dashboard.
                </p>
            </div>

            <div className="w-full max-w-sm rounded-xl bg-school-secondary-800 border border-school-secondary-700 p-4 text-left space-y-3">
                <p className="text-[10px] text-school-secondary-100/40 uppercase tracking-widest font-bold">
                    What happens next
                </p>
                {[
                    'Open the email from EduAI in your inbox',
                    'Click the "Confirm your account" link',
                    // ✅ FIX 1: Handled apostrophe in JS string array
                    "You'll land directly on your school dashboard",
                ].map((step, i) => (
                    <div key={i} className="flex items-start gap-3">
                        <span className="h-5 w-5 rounded-full bg-school-primary/20 text-school-primary text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                            {i + 1}
                        </span>
                        <p className="text-xs text-school-secondary-100/70 leading-relaxed">
                            {step}
                        </p>
                    </div>
                ))}
            </div>

            {schoolData?.schoolName && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-school-secondary-800 border border-school-secondary-700">
                    <div
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ background: schoolData.primaryColor }}
                    />
                    <span className="text-xs text-school-secondary-100/60 font-medium">
                        {schoolData.schoolName} workspace created
                    </span>
                </div>
            )}

            {/* ✅ FIX 2: Wrapped text in curly braces to escape apostrophe */}
            <p className="text-xs text-school-secondary-100/30">
                {"Didn't receive it? Check your spam folder or "}
                <button
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
                Go to login page instead →
            </a>
            <button
                onClick={handleStartOver}
                className="text-xs text-school-secondary-100 hover:text-red-400 transition-colors mt-2"
            >
                Onboard a different school instead
            </button>
        </div>
    );
}