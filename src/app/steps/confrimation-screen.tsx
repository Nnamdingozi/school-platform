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



// 'use client';

// import { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { createClient } from '@/lib/supabase/client';
// import { toast } from 'sonner';
// import { Mail, Check, Loader2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
// import { cn } from '@/lib/utils';

// /**
//  * PROVISIONING CONFIRMATION (Tier 2)
//  * Rule 11: Final System Truth - Awaiting Email Verification.
//  * Rule 17: Leverages Onboarding Store for persistent metadata.
//  */
// export function ConfirmationScreen() {
//     const { confirmedEmail, schoolData, setProvisioned, reset } = useOnboardingStore();
//     const [isResending, setIsResending] = useState(false);

//     const primaryColor = schoolData?.primaryColor || "#f59e0b";

//     async function handleResend() {
//         if (!confirmedEmail) {
//             toast.error('Identity node not found. Please contact support.');
//             return;
//         }
//         setIsResending(true);
//         try {
//             const supabase = createClient();
//             const { error } = await supabase.auth.resend({
//                 type: 'signup',
//                 email: confirmedEmail,
//             });
//             if (error) throw error;
//             toast.success('Security link re-transmitted.');
//         } catch (err) {
//             toast.error('Transmission failure. Please try again.');
//         } finally {
//             setIsResending(false);
//         }
//     }

//     function handleStartOver() {
//         // Rule 11: Manual reset of the provisioning buffer
//         reset();           
//         setProvisioned(false); 
//     }

//     return (
//         <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center text-center py-10 gap-8">
            
//             {/* ── VISUAL STATUS ── */}
//             <div className="relative">
//                 <div 
//                     className="h-24 w-24 rounded-[2.5rem] border-4 flex items-center justify-center shadow-2xl"
//                     style={{ backgroundColor: `${primaryColor}10`, borderColor: `${primaryColor}30` }}
//                 >
//                     <Mail className="h-10 w-10" style={{ color: primaryColor }} />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-xl bg-emerald-500 border-4 border-slate-950 flex items-center justify-center shadow-lg">
//                     <Check className="h-4 w-4 text-slate-950 stroke-[4]" />
//                 </div>
//             </div>

//             {/* ── MESSAGING ── */}
//             <div className="space-y-3">
//                 <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
//                     Activation Pending
//                 </h2>
//                 <p className="text-slate-500 text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
//                     A security synchronization link has been dispatched to:{' '}
//                     <span className="text-white font-black break-all block mt-1 underline decoration-white/10 underline-offset-4">
//                         {confirmedEmail}
//                     </span>
//                 </p>
//             </div>

//             {/* ── INSTRUCTIONAL NODES ── */}
//             <div className="w-full max-w-sm rounded-[2rem] bg-slate-900 border border-white/5 p-6 text-left space-y-4 shadow-2xl">
//                 <div className="flex items-center gap-2 mb-2">
//                     <ShieldCheck className="h-3.5 w-3.5 text-slate-600" />
//                     <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
//                         Deployment Protocol
//                     </p>
//                 </div>
//                 {[
//                     'Locate the synchronization email from SchoolPaaS',
//                     'Execute the "Confirm Identity" security node',
//                     "Initialize your institutional dashboard node",
//                 ].map((step, i) => (
//                     <div key={i} className="flex items-start gap-4 group">
//                         <span 
//                             className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black italic shadow-inner"
//                             style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
//                         >
//                             0{i + 1}
//                         </span>
//                         <p className="text-xs font-bold text-slate-300 uppercase tracking-tight leading-relaxed group-hover:text-white transition-colors">
//                             {step}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* ── WORKSPACE PREVIEW ── */}
//             {schoolData?.schoolName && (
//                 <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-slate-900 border border-white/5 shadow-inner">
//                     <div
//                         className="h-2.5 w-2.5 rounded-full shrink-0 animate-pulse"
//                         style={{ backgroundColor: primaryColor }}
//                     />
//                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                         {schoolData.schoolName} Registry Node Reserved
//                     </span>
//                 </div>
//             )}

//             {/* ── ACTIONS ── */}
//             <div className="space-y-6 pt-4">
//                 <div className="space-y-3">
//                     <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
//                         Registry link not discovered?
//                     </p>
//                     <button
//                         onClick={handleResend}
//                         disabled={isResending}
//                         className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto hover:brightness-125 transition-all"
//                         style={{ color: primaryColor }}
//                     >
//                         {isResending ? (
//                             <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Re-transmitting...</>
//                         ) : (
//                             <><Zap className="h-3.5 w-3.5 fill-current" /> Re-transmit Link</>
//                         )}
//                     </button>
//                 </div>

//                 <div className="flex flex-col gap-3 border-t border-white/5 pt-6">
//                     <a
//                         href="/login"
//                         className="text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
//                     >
//                         Access Terminal <ArrowRight className="h-3 w-3" />
//                     </a>
//                     <button
//                         onClick={handleStartOver}
//                         className="text-[9px] font-black text-slate-700 hover:text-red-500 uppercase tracking-widest transition-colors"
//                     >
//                         Abort Provisioning & Restart
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { createClient } from '@/lib/supabase/client';
// import { toast } from 'sonner';
// import { Mail, Check, Loader2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
// import { cn } from '@/lib/utils';

// /**
//  * PROVISIONING CONFIRMATION (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2.5rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ConfirmationScreen() {
//     const { confirmedEmail, schoolData, setProvisioned, reset } = useOnboardingStore();
//     const [isResending, setIsResending] = useState(false);

//     async function handleResend() {
//         if (!confirmedEmail) {
//             toast.error('Identity record not discovered. Please contact support.');
//             return;
//         }
//         setIsResending(true);
//         try {
//             const supabase = createClient();
//             const { error } = await supabase.auth.resend({
//                 type: 'signup',
//                 email: confirmedEmail,
//             });
//             if (error) throw error;
//             toast.success('Security link re-transmitted successfully.');
//         } catch (err) {
//             toast.error('Transmission failure. Protocol timeout.');
//         } finally {
//             setIsResending(false);
//         }
//     }

//     function handleStartOver() {
//         // Rule 11: Manual reset of the provisioning buffer
//         reset();           
//         setProvisioned(false); 
//     }

//     return (
//         <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center text-center py-10 gap-10">
            
//             {/* ── VISUAL STATUS (Rule 21) ── */}
//             <div className="relative">
//                 {/* Rule 19: Large item radius */}
//                 <div 
//                     className="h-28 w-28 rounded-[2.5rem] border-4 border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-2xl shadow-school-primary-100"
//                 >
//                     <Mail className="h-12 w-12 text-school-primary" />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-emerald-500 border-4 border-background flex items-center justify-center shadow-lg">
//                     <Check className="h-5 w-5 text-white stroke-[4]" />
//                 </div>
//             </div>

//             {/* ── MESSAGING (Rule 11) ── */}
//             <div className="space-y-4">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     Activation Pending
//                 </h2>
//                 <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
//                     A security synchronization link has been dispatched to:{' '}
//                     <span className="text-foreground font-extrabold break-all block mt-2 underline decoration-school-primary/30 underline-offset-4">
//                         {confirmedEmail}
//                     </span>
//                 </p>
//             </div>

//             {/* ── INSTRUCTIONAL HUB (Rule 18/19) ── */}
//             <div className="w-full max-w-md rounded-[2rem] bg-card border border-border p-8 text-left space-y-6 shadow-xl relative overflow-hidden">
//                 <div className="flex items-center gap-3 mb-2">
//                     <ShieldCheck className="h-4 w-4 text-school-primary" />
//                     <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
//                         Deployment Protocol
//                     </p>
//                 </div>
                
//                 {[
//                     'Locate the synchronization email from SchoolPaaS',
//                     'Execute the "Confirm Identity" security link',
//                     "Initialize your institutional dashboard core",
//                 ].map((step, i) => (
//                     <div key={i} className="flex items-start gap-5 group">
//                         <span 
//                             className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold italic bg-school-primary-50 border border-school-primary-200 text-school-primary shadow-inner"
//                         >
//                             0{i + 1}
//                         </span>
//                         <p className="text-sm font-semibold text-foreground uppercase italic tracking-tight leading-relaxed group-hover:text-school-primary transition-colors">
//                             {step}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* ── WORKSPACE PREVIEW (Rule 21) ── */}
//             {schoolData?.schoolName && (
//                 <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-surface border border-border shadow-inner">
//                     <div className="h-2 w-2 rounded-full bg-school-primary animate-pulse" />
//                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         {schoolData.schoolName} Registry Hub Reserved
//                     </span>
//                 </div>
//             )}

//             {/* ── ACTIONS ── */}
//             <div className="space-y-8 pt-4 w-full">
//                 <div className="space-y-4">
//                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         Registry link not discovered?
//                     </p>
//                     <button
//                         onClick={handleResend}
//                         disabled={isResending}
//                         className="text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2 mx-auto text-school-primary hover:brightness-110 transition-all active:scale-95 disabled:opacity-30"
//                     >
//                         {isResending ? (
//                             <><Loader2 className="h-4 w-4 animate-spin" /> Re-transmitting Protocol...</>
//                         ) : (
//                             <><Zap className="h-4 w-4 fill-current" /> Re-transmit Security Link</>
//                         )}
//                     </button>
//                 </div>

//                 <div className="flex flex-col gap-4 border-t border-border pt-8">
//                     <a
//                         href="/login"
//                         className="text-[10px] font-extrabold text-muted-foreground hover:text-foreground uppercase tracking-widest flex items-center justify-center gap-2 transition-all group"
//                     >
//                         Access Terminal <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                     </a>
//                     <button
//                         onClick={handleStartOver}
//                         className="text-[9px] font-bold text-muted-foreground/40 hover:text-destructive uppercase tracking-widest transition-colors"
//                     >
//                         Abort Provisioning & Restart Hub Initialization
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { createClient } from '@/lib/supabase/client';
// import { toast } from 'sonner';
// import { Mail, Check, Loader2, ShieldCheck, ArrowRight, Zap } from 'lucide-react';
// import { cn } from '@/lib/utils';

// /**
//  * PROVISIONING CONFIRMATION (Tier 2)
//  * Rule 11: High-fidelity Registry Typography (font-extrabold italic).
//  * Rule 18: Semantic Flip (bg-background, bg-card, bg-surface).
//  * Rule 19: Standardized Geometry [2.5rem].
//  * Rule 21: Scale Protocol for clean mathematical brand tints.
//  */
// export function ConfirmationScreen() {
//     const { confirmedEmail, schoolData, setProvisioned, reset } = useOnboardingStore();
//     const [isResending, setIsResending] = useState(false);

//     async function handleResend() {
//         if (!confirmedEmail) {
//             toast.error('No email address found. Please contact support.');
//             return;
//         }
//         setIsResending(true);
//         try {
//             const supabase = createClient();
//             const { error } = await supabase.auth.resend({
//                 type: 'signup',
//                 email: confirmedEmail,
//                 options: {
//                     emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`, // ✅ was missing
//                 },
//             });
//             if (error) throw error;
//             toast.success('Confirmation email sent successfully.');
//         } catch (err) {
//             toast.error('Failed to resend. Please try again.');
//         } finally {
//             setIsResending(false);
//         }
//     }

//     function handleStartOver() {
//         // Rule 11: Manual reset of the provisioning buffer
//         reset();           
//         setProvisioned(false); 
//     }

//     return (
//         <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center text-center py-10 gap-10">
            
//             {/* ── VISUAL STATUS (Rule 21) ── */}
//             <div className="relative">
//                 {/* Rule 19: Large item radius */}
//                 <div 
//                     className="h-28 w-28 rounded-[2.5rem] border-4 border-school-primary-200 bg-school-primary-50 flex items-center justify-center shadow-2xl shadow-school-primary-100"
//                 >
//                     <Mail className="h-12 w-12 text-school-primary" />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-emerald-500 border-4 border-background flex items-center justify-center shadow-lg">
//                     <Check className="h-5 w-5 text-white stroke-[4]" />
//                 </div>
//             </div>

//             {/* ── MESSAGING (Rule 11) ── */}
//             <div className="space-y-4">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     Activation Pending
//                 </h2>
//                 <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
//                     A security synchronization link has been dispatched to:{' '}
//                     {confirmedEmail && <span className="text-foreground font-extrabold break-all block mt-2 underline decoration-school-primary/30 underline-offset-4">
//                         {confirmedEmail}
//                     </span>}
//                 </p>
//             </div>

//             {/* ── INSTRUCTIONAL HUB (Rule 18/19) ── */}
//             <div className="w-full max-w-md rounded-[2rem] bg-card border border-border p-8 text-left space-y-6 shadow-xl relative overflow-hidden">
//                 <div className="flex items-center gap-3 mb-2">
//                     <ShieldCheck className="h-4 w-4 text-school-primary" />
//                     <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
//                         Deployment Protocol
//                     </p>
//                 </div>
                
//                 {[
//                     'Locate the synchronization email from SchoolPaaS',
//                     'Execute the "Confirm Identity" security link',
//                     "Initialize your institutional dashboard core",
//                 ].map((step, i) => (
//                     <div key={i} className="flex items-start gap-5 group">
//                         <span 
//                             className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold italic bg-school-primary-50 border border-school-primary-200 text-school-primary shadow-inner"
//                         >
//                             0{i + 1}
//                         </span>
//                         <p className="text-sm font-semibold text-foreground uppercase italic tracking-tight leading-relaxed group-hover:text-school-primary transition-colors">
//                             {step}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* ── WORKSPACE PREVIEW (Rule 21) ── */}
//             {schoolData?.schoolName && (
//                 <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-surface border border-border shadow-inner">
//                     <div className="h-2 w-2 rounded-full bg-school-primary animate-pulse" />
//                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         {schoolData.schoolName} Registry Hub Reserved
//                     </span>
//                 </div>
//             )}

//             {/* ── ACTIONS ── */}
//             <div className="space-y-8 pt-4 w-full">
//                 <div className="space-y-4">
//                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         Registry link not discovered?
//                     </p>
//                     <button
//                         onClick={handleResend}
//                         disabled={isResending}
//                         className="text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2 mx-auto text-school-primary hover:brightness-110 transition-all active:scale-95 disabled:opacity-30"
//                     >
//                         {isResending ? (
//                             <><Loader2 className="h-4 w-4 animate-spin" /> Re-transmitting Protocol...</>
//                         ) : (
//                             <><Zap className="h-4 w-4 fill-current" /> Re-transmit Security Link</>
//                         )}
//                     </button>
//                 </div>

//                 <div className="flex flex-col gap-4 border-t border-border pt-8">
//                     <a
//                         href="/login"
//                         className="text-[10px] font-extrabold text-muted-foreground hover:text-foreground uppercase tracking-widest flex items-center justify-center gap-2 transition-all group"
//                     >
//                         Access Terminal <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                     </a>
//                     <button
//                         onClick={handleStartOver}
//                         className="text-[9px] font-bold text-muted-foreground/40 hover:text-destructive uppercase tracking-widest transition-colors"
//                     >
//                         Abort Provisioning & Restart Hub Initialization
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { createClient } from '@/lib/supabase/client';
// import { toast } from 'sonner';
// import { Mail, Check, Loader2, ShieldCheck, ArrowRight, Zap, Lock } from 'lucide-react';
// import { cn } from '@/lib/utils';

// /**
//  * PROVISIONING CONFIRMATION (Tier 2)
//  * Fixes Bug 3: Prevents data deletion after payment.
//  * Fixes Bug 4: Handles persistent verification state.
//  */
// export function ConfirmationScreen() {
//     const { confirmedEmail, schoolData, setProvisioned, reset, paymentStatus } = useOnboardingStore();
//     const [isResending, setIsResending] = useState(false);

//     const hasPaid = paymentStatus === 'paid';

//     async function handleResend() {
//         if (!confirmedEmail) {
//             toast.error('No email address found. Please contact support.');
//             return;
//         }
//         setIsResending(true);
//         try {
//             const supabase = createClient();
//             const { error } = await supabase.auth.resend({
//                 type: 'signup',
//                 email: confirmedEmail,
//                 options: {
//                     emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//                 },
//             });
//             if (error) throw error;
//             toast.success('Security synchronization link re-transmitted.');
//         } catch (err: any) {
//             toast.error(err.message || 'Failed to resend protocol.');
//         } finally {
//             setIsResending(false);
//         }
//     }

//     function handleStartOver() {
//         // BUG 3 PROTECTION: If they paid, they cannot delete and start over.
//         if (hasPaid) {
//             toast.error('Security Protocol: Provisioned hubs cannot be deleted during activation.');
//             return;
//         }
//         reset();           
//         setProvisioned(false); 
//     }

//     return (
//         <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center text-center py-10 gap-10">
            
//             {/* ── VISUAL STATUS (Rule 21) ── */}
//             <div className="relative">
//                 <div 
//                     className={cn(
//                         "h-28 w-28 rounded-[2.5rem] border-4 flex items-center justify-center shadow-2xl transition-colors duration-700",
//                         hasPaid 
//                             ? "border-emerald-200 bg-emerald-50 shadow-emerald-100" 
//                             : "border-school-primary-200 bg-school-primary-50 shadow-school-primary-100"
//                     )}
//                 >
//                     {hasPaid ? (
//                         <ShieldCheck className="h-12 w-12 text-emerald-600" />
//                     ) : (
//                         <Mail className="h-12 w-12 text-school-primary" />
//                     )}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-emerald-500 border-4 border-background flex items-center justify-center shadow-lg">
//                     <Check className="h-5 w-5 text-white stroke-[4]" />
//                 </div>
//             </div>

//             {/* ── MESSAGING (Rule 11) ── */}
//             <div className="space-y-4">
//                 <h2 className="text-3xl md:text-4xl font-extrabold text-foreground uppercase italic tracking-tighter leading-none">
//                     {hasPaid ? 'Payment Confirmed' : 'Activation Pending'}
//                 </h2>
//                 <p className="text-muted-foreground text-[11px] font-bold uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
//                     {hasPaid 
//                         ? 'Your hub subscription is active. Please complete identity verification sent to:' 
//                         : 'A security synchronization link has been dispatched to:'}
//                     {confirmedEmail && (
//                         <span className="text-foreground font-extrabold break-all block mt-2 underline decoration-school-primary/30 underline-offset-4">
//                             {confirmedEmail}
//                         </span>
//                     )}
//                 </p>
//             </div>

//             {/* ── INSTRUCTIONAL HUB (Rule 18/19) ── */}
//             <div className="w-full max-w-md rounded-[2rem] bg-card border border-border p-8 text-left space-y-6 shadow-xl relative overflow-hidden">
//                 <div className="flex items-center gap-3 mb-2">
//                     <Lock className="h-4 w-4 text-school-primary" />
//                     <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
//                         Deployment Protocol
//                     </p>
//                 </div>
                
//                 {[
//                     'Locate the synchronization email from SchoolPaaS',
//                     'Execute the "Confirm Identity" security link',
//                     "Initialize your institutional dashboard core",
//                 ].map((step, i) => (
//                     <div key={i} className="flex items-start gap-5 group">
//                         <span 
//                             className="h-7 w-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-extrabold italic bg-school-primary-50 border border-school-primary-200 text-school-primary shadow-inner"
//                         >
//                             0{i + 1}
//                         </span>
//                         <p className="text-sm font-semibold text-foreground uppercase italic tracking-tight leading-relaxed group-hover:text-school-primary transition-colors">
//                             {step}
//                         </p>
//                     </div>
//                 ))}
//             </div>

//             {/* ── WORKSPACE PREVIEW (Rule 21) ── */}
//             {schoolData?.schoolName && (
//                 <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-surface border border-border shadow-inner">
//                     <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
//                     <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         {schoolData.schoolName} Registry Hub Reserved
//                     </span>
//                 </div>
//             )}

//             {/* ── ACTIONS ── */}
//             <div className="space-y-8 pt-4 w-full">
//                 <div className="space-y-4">
//                     <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
//                         Registry link not discovered?
//                     </p>
//                     <button
//                         onClick={handleResend}
//                         disabled={isResending}
//                         className="text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2 mx-auto text-school-primary hover:brightness-110 transition-all active:scale-95 disabled:opacity-30"
//                     >
//                         {isResending ? (
//                             <><Loader2 className="h-4 w-4 animate-spin" /> Re-transmitting Protocol...</>
//                         ) : (
//                             <><Zap className="h-4 w-4 fill-current" /> Re-transmit Security Link</>
//                         )}
//                     </button>
//                 </div>

//                 <div className="flex flex-col gap-4 border-t border-border pt-8">
//                     <a
//                         href="/login"
//                         className="text-[10px] font-extrabold text-foreground hover:text-school-primary uppercase tracking-widest flex items-center justify-center gap-2 transition-all group"
//                     >
//                         Access Terminal <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
//                     </a>
                    
//                     {/* BUG 3 FIX: Only show "Restart" if the user has NOT paid yet */}
//                     {!hasPaid && (
//                         <button
//                             onClick={handleStartOver}
//                             className="text-[9px] font-bold text-muted-foreground/40 hover:text-destructive uppercase tracking-widest transition-colors"
//                         >
//                             Abort Provisioning & Restart Hub Initialization
//                         </button>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// }



// 'use client';

// import React, { useState } from 'react';
// import { useOnboardingStore } from '@/store/onboardingStore';
// import { createClient } from '@/lib/supabase/client'; // Use public client for resend
// import { toast } from 'sonner';
// import { Mail, Check, Loader2, ArrowRight, Zap, Edit3, ShieldCheck } from 'lucide-react';
// import { cn } from '@/lib/utils';

// export function ConfirmationScreen() {
//     const { confirmedEmail, paymentStatus } = useOnboardingStore();
//     const [isResending, setIsResending] = useState(false);

//     async function handleResend() {
//         if (!confirmedEmail) {
//             toast.error("No identity found. Please contact support.");
//             return;
//         }

//         setIsResending(true);
//         try {
//             const supabase = createClient();
//             // FIX: Explicitly using 'signup' type and providing redirect URL
//             const { error } = await supabase.auth.resend({
//                 type: 'signup',
//                 email: confirmedEmail,
//                 options: {
//                     emailRedirectTo: `${window.location.origin}/confirm`,
//                 },
//             });

//             if (error) throw error;
//             toast.success("Security link re-transmitted to your inbox.");
//         } catch (err: any) {
//             console.error(err);
//             toast.error(err.message || "Protocol transmission failed.");
//         } finally {
//             setIsResending(false);
//         }
//     }

//     return (
//         <div className="animate-in fade-in zoom-in-95 duration-700 flex flex-col items-center text-center py-10 gap-10">
//             <div className="relative">
//                 <div className="h-28 w-28 rounded-[2.5rem] border-4 border-emerald-200 bg-emerald-50 flex items-center justify-center shadow-2xl">
//                     <ShieldCheck className="h-12 w-12 text-emerald-600" />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-emerald-500 border-4 border-background flex items-center justify-center">
//                     <Check className="h-5 w-5 text-white stroke-[4]" />
//                 </div>
//             </div>

//             <div className="space-y-4">
//                 <h2 className="text-3xl font-extrabold text-foreground uppercase italic tracking-tighter">Activation Pending</h2>
//                 <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
//                     Identity synchronized. Check: <br/>
//                     <span className="text-foreground underline decoration-school-primary/30">{confirmedEmail}</span>
//                 </p>
//             </div>

//             <div className="space-y-8 pt-4 w-full">
//                 <button
//                     onClick={handleResend}
//                     disabled={isResending}
//                     className="text-[11px] font-extrabold uppercase tracking-widest flex items-center gap-2 mx-auto text-school-primary hover:brightness-110 active:scale-95 disabled:opacity-30"
//                 >
//                     {isResending ? (
//                         <><Loader2 className="h-4 w-4 animate-spin" /> Transmission active...</>
//                     ) : (
//                         <><Zap className="h-4 w-4 fill-current" /> Re-transmit Activation Link</>
//                     )}
//                 </button>

//                 <div className="flex flex-col gap-4 border-t border-border pt-8">
//                     <a href="/login" className="text-[10px] font-extrabold text-muted-foreground hover:text-foreground uppercase tracking-widest flex items-center justify-center gap-2">
//                         Access Terminal <ArrowRight className="h-4 w-4" />
//                     </a>
//                 </div>
//             </div>
//         </div>
//     );
// }


'use client';

import React, { useState } from 'react';
import { useOnboardingStore } from '@/store/onboardingStore';
import { updateOnboardingEmail } from '@/app/actions/onboarding';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Loader2, ArrowRight, Zap, Edit3, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { getErrorMessage } from '@/lib/error-handler';


export function ConfirmationScreen() {
    const { confirmedEmail, setConfirmedEmail, paymentData } = useOnboardingStore();
    const [isResending, setIsResending] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [newEmail, setNewEmail] = useState(confirmedEmail || '');
    const [isUpdating, setIsUpdating] = useState(false);

    async function handleResend() {
        setIsResending(true);
        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email: confirmedEmail!,
                options: { emailRedirectTo: `${window.location.origin}/confirm` },
            });
            if (error) {
                getErrorMessage(error)
                throw error;}
            toast.success("Security link re-transmitted.");
        } catch (err: unknown) {
            const message = getErrorMessage(err)
            toast.error( message || "Failed to resend. You may be rate-limited (3/hr).");
        } finally {
            setIsResending(false);
        }
    }

    async function handleEmailUpdate(e: React.FormEvent) {
        e.preventDefault();
        setIsUpdating(true);
        try {
            const res = await updateOnboardingEmail(confirmedEmail!, newEmail, paymentData?.reference || '');
            if (res.success) {
                setConfirmedEmail(newEmail);
                setIsEditing(false);
                toast.success("Identity updated. New link dispatched.");
            } else {
                toast.error(res.error);
            }
        } catch (err) {
            toast.error("Update failed.");
            getErrorMessage(err)
        } finally {
            setIsUpdating(false);
        }
    }

    return (
        <div className="flex flex-col items-center text-center py-10 gap-10 animate-in fade-in zoom-in-95">
            <div className="h-28 w-28 rounded-[2.5rem] border-4 border-emerald-200 bg-emerald-50 flex items-center justify-center shadow-2xl">
                <ShieldCheck className="h-12 w-12 text-emerald-600" />
            </div>

            <div className="space-y-4 w-full max-w-sm">
                <h2 className="text-3xl font-extrabold uppercase italic">Activation Pending</h2>
                
                {!isEditing ? (
                    <div className="space-y-2">
                        <p className="text-muted-foreground text-[10px] font-bold uppercase">Link dispatched to:</p>
                        <div className="flex items-center justify-center gap-2">
                            <span className="text-foreground font-extrabold underline">{confirmedEmail}</span>
                            <button onClick={() => setIsEditing(true)} className="p-1 hover:text-school-primary"><Edit3 className="h-3 w-3" /></button>
                        </div>
                    </div>
                ) : (
                    <form onSubmit={handleEmailUpdate} className="space-y-4">
                        <Input 
                            value={newEmail} 
                            onChange={(e) => setNewEmail(e.target.value.toLowerCase())} 
                            className="text-center font-bold h-12 rounded-xl"
                            type="email" required
                        />
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setIsEditing(false)} className="flex-1 h-10 rounded-xl bg-muted font-bold text-[10px] uppercase">Cancel</button>
                            <button type="submit" disabled={isUpdating} className="flex-1 h-10 rounded-xl bg-school-primary text-white font-bold text-[10px] uppercase">
                                {isUpdating ? <Loader2 className="animate-spin mx-auto" /> : "Update"}
                            </button>
                        </div>
                    </form>
                )}
            </div>

            <div className="space-y-8 w-full">
                <button onClick={handleResend} disabled={isResending || isEditing} className="text-[11px] font-extrabold uppercase flex items-center gap-2 mx-auto text-school-primary">
                    {isResending ? <Loader2 className="animate-spin" /> : <Zap className="h-4 w-4 fill-current" />} Re-transmit Link
                </button>
                <a href="/login" className="text-[10px] font-extrabold text-muted-foreground uppercase flex items-center justify-center gap-2">
                    Access Terminal <ArrowRight className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
}