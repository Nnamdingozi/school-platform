// // app/accept-invite/page.tsx
// // app/accept-invite/page.tsx
// 'use client'
// import { useSearchParams, useRouter } from 'next/navigation'
// import { useState, useEffect, Suspense } from 'react'
// import { createClient } from '@/lib/supabase/client'
// import { Loader2, AlertCircle } from 'lucide-react'

// interface InviteInfo {
//     email: string
//     role: string
// }

// interface FormState {
//     fullName: string
//     phone: string
//     password: string
//     confirm: string
// }

// function AcceptInviteContent() {
//     const searchParams = useSearchParams()
//     const router = useRouter()
//     const token = searchParams.get('token')

//     const [pageStatus, setPageStatus] = useState<'loading' | 'valid' | 'error'>('loading')
//     const [errorReason, setErrorReason] = useState('')
//     const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null)
//     const [submitting, setSubmitting] = useState(false)
//     const [formError, setFormError] = useState('')
//     const [form, setForm] = useState<FormState>({
//         fullName: '', phone: '', password: '', confirm: ''
//     })

//     const set = (field: keyof FormState) =>
//         (e: React.ChangeEvent<HTMLInputElement>) =>
//             setForm(prev => ({ ...prev, [field]: e.target.value }))

//     // Validate token on mount
//     useEffect(() => {
//         if (!token) {
//             setPageStatus('error')
//             setErrorReason('No invite token found in this link.')
//             return
//         }

//         fetch(`/api/invitations/validate?token=${token}`)
//             .then(r => r.json())
//             .then(d => {
//                 if (d.valid) {
//                     setInviteInfo(d.invite)
//                     setPageStatus('valid')
//                 } else {
//                     setPageStatus('error')
//                     setErrorReason(d.reason)
//                 }
//             })
//             .catch(() => {
//                 setPageStatus('error')
//                 setErrorReason('Something went wrong. Please try again.')
//             })
//     }, [token])

//     const validate = () => {
//         if (!form.fullName.trim()) return 'Full name is required.'
//         if (!form.phone.trim()) return 'Phone number is required.'
//         if (form.password.length < 8) return 'Password must be at least 8 characters.'
//         if (form.password !== form.confirm) return 'Passwords do not match.'
//         return null
//     }

//     const handleSubmit = async () => {
//         const validationError = validate()
//         if (validationError) { setFormError(validationError); return }

//         setSubmitting(true)
//         setFormError('')

//         try {
//             // 1. Create account
//             const res = await fetch('/api/invitations/accept', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({
//                     token,
//                     password: form.password,
//                     fullName: form.fullName,
//                     phone: form.phone,
//                 }),
//             })

//             const data = await res.json()
//             if (!res.ok) {
//                 setFormError(data.error)
//                 setSubmitting(false)
//                 return
//             }

//             // 2. Auto sign in
//             const supabase = createClient()
//             const { error: signInError } = await supabase.auth.signInWithPassword({
//                 email: data.email,
//                 password: form.password,
//             })

//             if (signInError) {
//                 // Account created but sign in failed — send to login
//                 router.replace('/login?account=created')
//                 return
//             }

//             // 3. Redirect based on role
//             window.location.href = data.redirectTo

//         } catch {
//             setFormError('Something went wrong. Please try again.')
//             setSubmitting(false)
//         }
//     }

//     // ── Loading ──────────────────────────────────────────────────────
//     if (pageStatus === 'loading') {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] gap-3">
//                 <Loader2 className="w-8 h-8 text-[#f59e0b] animate-spin" />
//                 <p className="text-slate-400 text-sm">Validating your invite...</p>
//             </div>
//         )
//     }

//     // ── Error ────────────────────────────────────────────────────────
//     if (pageStatus === 'error') {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-6 text-center">
//                 <div className="bg-red-500/10 p-4 rounded-full mb-4">
//                     <AlertCircle className="w-8 h-8 text-red-500" />
//                 </div>
//                 <h1 className="text-xl font-bold text-white mb-2">Invalid Invite</h1>
//                 <p className="text-slate-400 text-sm max-w-xs mb-6">{errorReason}</p>
//                 <button
//                     onClick={() => router.push('/login')}
//                     className="text-[#f59e0b] text-sm font-medium hover:underline"
//                 >
//                     Back to login
//                 </button>
//             </div>
//         )
//     }

//     // ── Form ─────────────────────────────────────────────────────────
//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] p-6">
//             <div className="w-full max-w-sm space-y-6">

//                 {/* Header */}
//                 <div className="text-center space-y-1">
//                     <h1 className="text-2xl font-bold text-white">Set Up Your Account</h1>
//                     <p className="text-slate-400 text-sm">
//                         Invited as <span className="text-[#f59e0b] font-medium">
//                             {inviteInfo?.role.replace('_', ' ')}
//                         </span>
//                     </p>
//                 </div>

//                 {/* Fields */}
//                 <div className="space-y-3">

//                     {/* Full Name */}
//                     <div className="space-y-1">
//                         <label className="text-xs font-medium text-slate-400">
//                             Full Name
//                         </label>
//                         <input
//                             type="text"
//                             placeholder="John Doe"
//                             value={form.fullName}
//                             onChange={set('fullName')}
//                             className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
//                         />
//                     </div>

//                     {/* Phone */}
//                     <div className="space-y-1">
//                         <label className="text-xs font-medium text-slate-400">
//                             Phone Number
//                         </label>
//                         <input
//                             type="tel"
//                             placeholder="+234 800 000 0000"
//                             value={form.phone}
//                             onChange={set('phone')}
//                             className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
//                         />
//                     </div>

//                     {/* Divider */}
//                     <div className="border-t border-slate-700 pt-1">
//                         <p className="text-xs font-medium text-slate-400 mb-3">
//                             Create Password
//                         </p>
//                         <div className="space-y-3">
//                             <input
//                                 type="password"
//                                 placeholder="Password (min 8 characters)"
//                                 value={form.password}
//                                 onChange={set('password')}
//                                 className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
//                             />
//                             <input
//                                 type="password"
//                                 placeholder="Confirm password"
//                                 value={form.confirm}
//                                 onChange={set('confirm')}
//                                 className="w-full px-4 py-2.5 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-[#f59e0b] focus:outline-none text-sm"
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Error */}
//                 {formError && (
//                     <p className="text-red-400 text-sm text-center">{formError}</p>
//                 )}

//                 {/* Submit */}
//                 <button
//                     onClick={handleSubmit}
//                     disabled={submitting}
//                     className="w-full py-3 rounded-lg bg-[#f59e0b] text-white font-bold text-sm disabled:opacity-50 transition-opacity"
//                 >
//                     {submitting ? (
//                         <span className="flex items-center justify-center gap-2">
//                             <Loader2 className="w-4 h-4 animate-spin" />
//                             Creating account...
//                         </span>
//                     ) : 'Create Account'}
//                 </button>

//             </div>
//         </div>
//     )
// }

// export default function AcceptInvitePage() {
//     return (
//         <Suspense fallback={null}>
//             <AcceptInviteContent />
//         </Suspense>
//     )
// }




// import { cookies } from 'next/headers'
// import { Navbar } from '@/components/landing/navbar'
// import { Footer } from '@/components/landing/footer'

// export default async function LandingLayout({
//     children,
// }: {
//     children: React.ReactNode
// }) {
//     // Read the theme cookie server-side so the correct class is applied
//     // before paint. Logged-out visitors default to light mode.
//     const cookieStore = await cookies()
//     const isDark = cookieStore.get('theme')?.value === 'dark'

//     return (
//         <div className={`min-h-screen flex flex-col bg-background text-foreground${isDark ? ' dark' : ''}`}>
//             <Navbar />
//             <main className="flex-1">
//                 {children}
//             </main>
//             <Footer />
//         </div>
//     )
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { SetPasswordForm } from "@/components/set-password-form";
// import { getErrorMessage } from "@/lib/error-handler";

// /**
//  * INVITATION HUB | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export const metadata: Metadata = {
//     title: "Accept Invitation | Registry | SchoolPaaS",
//     description: "Synchronizing institutional identity with the academic hub.",
// };

// interface PageProps {
//     // ✅ RESOLVED: Next.js pages do not take 'children'. 
//     // They take params and searchParams.
//     searchParams: Promise<{ token?: string; email?: string }>;
// }

// /**
//  * ACCEPT INVITATION HUB (Tier 3)
//  * Rule 12: Server-First Execution.
//  * Rule 23: Explicit Error Protocol.
//  */
// export default async function AcceptInvitePage({ searchParams }: PageProps) {
//     const { token, email } = await searchParams;

//     if (!token || !email) {
//         redirect("/login?error=invalid_invitation_link");
//     }

//     try {
//         // Rule 11: System Truth - Verify invitation exists and hasn't expired
//         const invitation = await prisma.invitation.findUnique({
//             where: { token }
//         });

//         if (!invitation || invitation.email !== email) {
//             throw new Error("Invitation protocol mismatch or link expired.");
//         }

//         if (invitation.acceptedAt) {
//             redirect("/login?message=invitation_already_synchronized");
//         }

//         return (
//             <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-700">
//                 <div className="w-full max-w-md">
//                     <SetPasswordForm userEmail={email} />
//                 </div>
//             </main>
//         );

//     } catch (error: unknown) {
//         const message = getErrorMessage(error);
//         console.error(`[INVITATION_HUB_FAULT]: ${message}`);
//         redirect(`/login?error=${encodeURIComponent(message)}`);
//     }
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { prisma } from "@/lib/prisma";
// import { createClient } from "@/lib/supabase/server";
// import { SetPasswordForm } from "@/components/set-password-form";
// import { getErrorMessage } from "@/lib/error-handler";

// export const metadata: Metadata = {
//     title: "Synchronize Identity | Registry | SchoolPaaS",
//     description: "Finalizing institutional identity synchronization for the academic hub.",
// };

// interface PageProps {
//     searchParams: Promise<{ 
//         code?: string | string[];
//         token?: string | string[];
//         email?: string | string[];
//         error?: string | string[];
//         error_description?: string | string[];
//     }>;
// }

// export default async function AcceptInvitePage({ searchParams }: PageProps) {
//     const params = await searchParams;

//     // ── Supabase error passed in URL ──────────────────────────────────────────
//     const urlError = Array.isArray(params.error) ? params.error[0] : params.error;
//     if (urlError) {
//         const description = Array.isArray(params.error_description)
//             ? params.error_description[0]
//             : params.error_description;
//         console.error(`[INVITE_URL_ERROR]: ${urlError} — ${description}`);
//         redirect(`/login?error=${encodeURIComponent(description ?? urlError)}`);
//     }

//     try {
//         const supabase = await createClient();

//         // ── Stage 1: PKCE code exchange ───────────────────────────────────────
//         // Supabase invite links land with ?code=xxx — must exchange before
//         // any session exists. Without this, getUser() returns null always.
//         const code = Array.isArray(params.code) ? params.code[0] : params.code;

//         if (code) {
//             const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
//             if (exchangeError) {
//                 console.error('[INVITE_CODE_EXCHANGE_FAULT]:', exchangeError.message);
//                 redirect('/login?error=invite_link_invalid_or_expired');
//             }
//         }

//         // ── Stage 2: Verify session exists after exchange ─────────────────────
//         const { data: { user }, error: userError } = await supabase.auth.getUser();
//         if (userError || !user) {
//             redirect('/login?error=session_not_established');
//         }

//         // ── Stage 3: Extract custom_token from user metadata ──────────────────
//         // This was passed in `data` when calling inviteUserByEmail()
//         const customToken = user.user_metadata?.custom_token as string | undefined;

//         if (!customToken) {
//             console.error('[INVITE_TOKEN_MISSING]: user metadata:', user.user_metadata);
//             redirect('/login?error=invite_token_missing');
//         }

//         // ── Stage 4: Validate invitation in DB ────────────────────────────────
//         const invitation = await prisma.invitation.findFirst({
//             where: {
//                 token: customToken,
//                 acceptedAt: null,
//                 expiresAt: { gt: new Date() },
//             },
//             include: {
//                 school: { select: { id: true, name: true } }
//             }
//         });

//         if (!invitation) {
//             redirect('/login?error=invite_expired_or_already_used');
//         }

//         // ── Stage 5: Email sanity check ───────────────────────────────────────
//         if (invitation.email !== user.email) {
//             console.error(`[INVITE_EMAIL_MISMATCH]: expected ${invitation.email}, got ${user.email}`);
//             redirect('/login?error=email_mismatch');
//         }

//         // ── Stage 6: Render password setup form ───────────────────────────────
//         return (
//             <section className="flex items-center justify-center py-20 px-4 animate-in fade-in duration-1000">
//                 <div className="w-full max-w-md">
//                     <SetPasswordForm
//                         userEmail={user.email!}
//                         invitationToken={customToken}
//                         schoolName={invitation.school.name}
//                     />
//                 </div>
//             </section>
//         );

//     } catch (error: unknown) {
//         const message = getErrorMessage(error);
//         console.error(`[INVITATION_HANDSHAKE_FAULT]: ${message}`);
//         redirect(`/login?error=${encodeURIComponent(message)}`);
//     }
// }


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { SetPasswordForm } from "@/components/set-password-form";
import { getErrorMessage } from "@/lib/error-handler";

export const metadata: Metadata = {
    title: "Synchronize Identity | Registry | SchoolPaaS",
    description: "Finalizing institutional identity synchronization for the academic hub.",
};

interface PageProps {
    searchParams: Promise<{ 
        code?: string | string[];
        token?: string | string[];
        email?: string | string[];
        error?: string | string[];
        error_description?: string | string[];
    }>;
}

export default async function AcceptInvitePage({ searchParams }: PageProps) {
    const params = await searchParams;

    // ── Supabase error passed in URL ──────────────────────────────────────────
    const urlError = Array.isArray(params.error) ? params.error[0] : params.error;
    if (urlError) {
        const description = Array.isArray(params.error_description)
            ? params.error_description[0]
            : params.error_description;
        console.error(`[INVITE_URL_ERROR]: ${urlError} — ${description}`);
        redirect(`/login?error=${encodeURIComponent(description ?? urlError)}`);
    }

    const supabase = await createClient();

    // ── Stage 1: PKCE code exchange (only if code present) ───────────────────
    const code = Array.isArray(params.code) ? params.code[0] : params.code;
    if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
            console.error('[INVITE_CODE_EXCHANGE_FAULT]:', exchangeError.message);
            redirect('/login?error=invite_link_invalid_or_expired');
        }
    }

    // ── Stage 2: Verify session ───────────────────────────────────────────────
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
        redirect('/login?error=session_not_established');
    }

    // ── Stage 3: Extract token ────────────────────────────────────────────────
    // Supabase invite links can deliver the token two ways:
    // 1. Via URL param ?token=xxx (when redirectTo contains the token in the URL)
    // 2. Via user_metadata.custom_token (after PKCE code exchange)
    // We check both so either flow works.
    const tokenFromUrl = Array.isArray(params.token) ? params.token[0] : params.token;
    const tokenFromMetadata = user.user_metadata?.custom_token as string | undefined;
    const customToken = tokenFromUrl ?? tokenFromMetadata;

    if (!customToken) {
        console.error('[INVITE_TOKEN_MISSING]: url params:', params, 'metadata:', user.user_metadata);
        redirect('/login?error=invite_token_missing');
    }

    // ── Stage 4: Validate invitation in DB ────────────────────────────────────
    const invitation = await prisma.invitation.findFirst({
        where: {
            token: customToken,
            acceptedAt: null,
            expiresAt: { gt: new Date() },
        },
        include: {
            school: { select: { id: true, name: true } }
        }
    });

    if (!invitation) {
        redirect('/login?error=invite_expired_or_already_used');
    }

    // ── Stage 5: Email sanity check ───────────────────────────────────────────
    if (invitation.email !== user.email) {
        console.error(`[INVITE_EMAIL_MISMATCH]: expected ${invitation.email}, got ${user.email}`);
        redirect('/login?error=email_mismatch');
    }

    // ── Stage 6: Render ───────────────────────────────────────────────────────
    try {
        return (
            <section className="flex items-center justify-center py-20 px-4 animate-in fade-in duration-1000">
                <div className="w-full max-w-md">
                    <SetPasswordForm
                        userEmail={user.email!}
                        invitationToken={customToken}
                        schoolName={invitation.school.name}
                    />
                </div>
            </section>
        );
    } catch (error: unknown) {
        if (
            error instanceof Error &&
            (error as { digest?: string }).digest?.startsWith('NEXT_REDIRECT')
        ) {
            throw error;
        }
        const message = getErrorMessage(error);
        console.error(`[INVITATION_HANDSHAKE_FAULT]: ${message}`);
        redirect(`/login?error=${encodeURIComponent(message)}`);
    }
}