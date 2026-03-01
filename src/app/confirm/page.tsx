// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { getTeacherData } from '@/app/actions/teacherData';
// import { useProfileStore } from '@/store/profileStore';
// import { Loader2 } from 'lucide-react';

// export default function ConfirmPage() {
//     const router = useRouter();
//     const [status, setStatus] = useState<'loading' | 'error'>('loading');
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);

//     useEffect(() => {
//         async function handleConfirm() {
//             const supabase = createClient();

//             console.log('✅ Confirm page hit');
//             console.log('Full URL:', window.location.href);
//             console.log('Hash:', window.location.hash);
//             console.log('Search:', window.location.search);

//             // ── Case 1: Hash fragment ({{ .ConfirmationURL }} flow) ────────
//             if (window.location.hash) {
//                 console.log('📦 Hash detected — parsing session from fragment');

//                 const { data: { session }, error } = await supabase.auth.getSession();

//                 console.log('🔐 Session result:', {
//                     error: error?.message ?? null,
//                     userId: session?.user?.id ?? null,
//                     email: session?.user?.email ?? null,
//                 });

//                 if (error || !session?.user?.email) {
//                     setErrorMessage(error?.message ?? 'Confirmation failed.');
//                     setStatus('error');
//                     return;
//                 }

//                 await resolveAndRedirect(session.user.email, router);
//                 return;
//             }

//             // ── Case 2: Query params (manual token_hash template) ──────────
//             const params = new URLSearchParams(window.location.search);
//             const token_hash = params.get('token_hash');
//             const type = params.get('type');

//             console.log('📦 Query params:', { token_hash: token_hash?.slice(0, 10), type });

//             if (token_hash && type) {
//                 const { data, error } = await supabase.auth.verifyOtp({
//                     type: type as any,
//                     token_hash,
//                 });

//                 console.log('🔐 verifyOtp result:', {
//                     error: error?.message ?? null,
//                     userId: data?.user?.id ?? null,
//                     email: data?.user?.email ?? null,
//                 });

//                 if (error || !data?.user) {
//                     setErrorMessage(error?.message ?? 'Confirmation failed.');
//                     setStatus('error');
//                     return;
//                 }

//                 if (type === 'invite') {
//                     router.replace('/set-password');
//                     return;
//                 }

//                 await resolveAndRedirect(data.user.email!, router);
//                 return;
//             }

//             // ── Case 3: Nothing usable in URL ──────────────────────────────
//             console.error('❌ No hash or token_hash found');
//             setErrorMessage('Invalid or expired confirmation link.');
//             setStatus('error');
//         }

//         handleConfirm();
//     }, []);

//     if (status === 'error') {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-school-secondary-950 gap-4">
//                 <div className="text-center space-y-2">
//                     <p className="text-red-400 font-semibold">Confirmation failed</p>
//                     <p className="text-school-secondary-100/50 text-sm max-w-sm">
//                         {errorMessage ?? 'This link may have expired or already been used.'}
//                     </p>
//                 </div>
//                 <a href="/login" className="text-school-primary text-sm hover:underline">
//                     Back to login
//                 </a>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-school-secondary-950 gap-4">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-school-secondary-100/50 text-sm">
//                 Confirming your account...
//             </p>
//         </div>
//     );
// }

// // ── Fetch profile, hydrate store, redirect ────────────────────────────────────
// async function resolveAndRedirect(
//     email: string,
//     router: ReturnType<typeof useRouter>
// ) {
//     console.log('🔍 Fetching profile for:', email);

//     // Reuse existing getTeacherData action — same one used by dashboard layout
//     const profile = await getTeacherData(email);

//     console.log('👤 Profile found:', profile ? { role: profile.role, name: profile.name } : null);

//     if (!profile) {
//         console.error('❌ No profile found for:', email);
//         router.replace('/login?error=profile_not_found');
//         return;
//     }

//     // ✅ Hydrate the store so dashboard layout doesn't have to re-fetch
//     useProfileStore.getState().setProfile(profile);

//     const dashboardPath = getDashboardPath(profile.role);
//     console.log('➡️ Redirecting to:', dashboardPath);
//     router.replace(dashboardPath);
// }

// function getDashboardPath(role?: string | null): string {
//     switch (role) {
//         case 'SUPER_ADMIN':
//         case 'SCHOOL_ADMIN':
//             return '/admin';
//         case 'TEACHER':
//             return '/teacher';
//         case 'STUDENT':
//             return '/student';
//         case 'PARENT':
//             return '/parent';
//         default:
//             return '/login';
//     }
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { getTeacherData } from '@/app/actions/teacherData';
// import { useProfileStore } from '@/store/profileStore';
// import { Loader2 } from 'lucide-react';

// export default function ConfirmPage() {
//     const router = useRouter();
//     const [status, setStatus] = useState<'loading' | 'error'>('loading');
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);

//     useEffect(() => {
//         const supabase = createClient();

//         console.log('✅ Confirm page hit');
//         console.log('Hash:', window.location.hash ? 'present' : 'empty');

//         // ── Listen for auth state change ───────────────────────────────────
//         // The Supabase client SDK automatically detects the access_token in
//         // the URL hash and fires SIGNED_IN. We wait for that event instead
//         // of calling getSession() immediately which races against the parsing.
//         const { data: { subscription } } = supabase.auth.onAuthStateChange(
//             async (event, session) => {
//                 console.log('🔐 Auth event:', event);
//                 console.log('🔐 Session:', {
//                     userId: session?.user?.id ?? null,
//                     email: session?.user?.email ?? null,
//                 });

//                 if (event === 'SIGNED_IN' && session?.user?.email) {
//                     // Unsubscribe immediately — we only need the first event
//                     subscription.unsubscribe();

//                     await resolveAndRedirect(
//                         session.user.email,
//                         router,
//                         setErrorMessage,
//                         setStatus
//                     );
//                     return;
//                 }

//                 if (event === 'TOKEN_REFRESHED' && session?.user?.email) {
//                     subscription.unsubscribe();
//                     await resolveAndRedirect(
//                         session.user.email,
//                         router,
//                         setErrorMessage,
//                         setStatus
//                     );
//                     return;
//                 }
//             }
//         );

//         // ── Fallback timeout ───────────────────────────────────────────────
//         // If no auth event fires within 8 seconds something went wrong
//         const timeout = setTimeout(() => {
//             console.error('❌ Auth event timeout — no SIGNED_IN received');
//             subscription.unsubscribe();
//             setErrorMessage('Confirmation timed out. Please try again.');
//             setStatus('error');
//         }, 8000);

//         return () => {
//             subscription.unsubscribe();
//             clearTimeout(timeout);
//         };
//     }, []);

//     if (status === 'error') {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-school-secondary-950 gap-4">
//                 <div className="text-center space-y-3">
//                     <p className="text-red-400 font-semibold text-lg">Confirmation failed</p>
//                     <p className="text-school-secondary-100/50 text-sm max-w-sm">
//                         {errorMessage ?? 'This link may have expired or already been used.'}
//                     </p>
//                 </div>
//                 <a
//                     href="/login"
//                     className="text-school-primary text-sm hover:underline font-semibold"
//                 >
//                     Back to login
//                 </a>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-school-secondary-950 gap-4">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-school-secondary-100/50 text-sm">
//                 Confirming your account...
//             </p>
//         </div>
//     );
// }

// async function resolveAndRedirect(
//     email: string,
//     router: ReturnType<typeof useRouter>,
//     setErrorMessage: (msg: string) => void,
//     setStatus: (s: 'loading' | 'error') => void
// ) {
//     console.log('🔍 Fetching profile for:', email);

//     const profile = await getTeacherData(email);

//     console.log('👤 Profile:', profile ? { role: profile.role, name: profile.name } : null);

//     if (!profile) {
//         console.error('❌ No profile found for:', email);
//         setErrorMessage('Account setup incomplete. Please contact support.');
//         setStatus('error');
//         return;
//     }

//     // Hydrate store so dashboard layout finds profile immediately
//     useProfileStore.getState().setProfile(profile);

//     const dashboardPath = getDashboardPath(profile.role);
//     console.log('➡️ Redirecting to:', dashboardPath);
//     router.replace(dashboardPath);
// }

// function getDashboardPath(role?: string | null): string {
//     switch (role) {
//         case 'SUPER_ADMIN':
//         case 'SCHOOL_ADMIN':
//             return '/admin';
//         case 'TEACHER':
//             return '/teacher';
//         case 'STUDENT':
//             return '/student';
//         case 'PARENT':
//             return '/parent';
//         default:
//             return '/login';
//     }
// }



// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { getTeacherData } from '@/app/actions/teacherData';
// import { useProfileStore } from '@/store/profileStore';
// import { Loader2 } from 'lucide-react';

// export default function ConfirmPage() {
//     const router = useRouter();
//     const [status, setStatus] = useState<'loading' | 'error'>('loading');
//     const [errorMessage, setErrorMessage] = useState<string | null>(null);

//     useEffect(() => {
//         const supabase = createClient();

//         console.log('✅ Confirm page hit');
//         console.log('Hash:', window.location.hash ? 'present' : 'empty');

//         // ── Listen for auth state change ───────────────────────────────────
//         // The Supabase client SDK automatically detects the access_token in
//         // the URL hash and fires SIGNED_IN. We wait for that event instead
//         // of calling getSession() immediately which races against the parsing.
//         const { data: { subscription } } = supabase.auth.onAuthStateChange(
//             async (event, session) => {
//                 console.log('🔐 Auth event:', event);
//                 console.log('🔐 Session:', {
//                     userId: session?.user?.id ?? null,
//                     email: session?.user?.email ?? null,
//                 });

//                 // ✅ Handle all events that indicate a valid session exists
//                 // INITIAL_SESSION — SDK already parsed hash before listener registered
//                 // SIGNED_IN      — SDK parsed hash after listener registered
//                 // TOKEN_REFRESHED — session refreshed mid-flow
//                 const validEvents = ['INITIAL_SESSION', 'SIGNED_IN', 'TOKEN_REFRESHED'];

//                 if (validEvents.includes(event) && session?.user?.email) {
//                     subscription.unsubscribe();
//                     await resolveAndRedirect(
//                         session.user.email,
//                         router,
//                         setErrorMessage,
//                         setStatus
//                     );
//                     return;
//                 }

//                 // INITIAL_SESSION with no session = not logged in, not an error
//                 // SIGNED_OUT = something cleared the session
//                 if (event === 'INITIAL_SESSION' && !session) {
//                     console.log('⚠️ INITIAL_SESSION with no session — waiting for SIGNED_IN');
//                     // Don't error yet — SIGNED_IN may still fire shortly after
//                 }
//             }
//         );

//         // ── Fallback timeout ───────────────────────────────────────────────
//         // If no auth event fires within 8 seconds something went wrong
//         const timeout = setTimeout(() => {
//             console.error('❌ Auth event timeout — no SIGNED_IN received');
//             subscription.unsubscribe();
//             setErrorMessage('Confirmation timed out. Please try again.');
//             setStatus('error');
//         }, 8000);

//         return () => {
//             subscription.unsubscribe();
//             clearTimeout(timeout);
//         };
//     }, []);

//     if (status === 'error') {
//         return (
//             <div className="min-h-screen flex flex-col items-center justify-center bg-school-secondary-950 gap-4">
//                 <div className="text-center space-y-3">
//                     <p className="text-red-400 font-semibold text-lg">Confirmation failed</p>
//                     <p className="text-school-secondary-100/50 text-sm max-w-sm">
//                         {errorMessage ?? 'This link may have expired or already been used.'}
//                     </p>
//                 </div>
//                 <a
//                     href="/login"
//                     className="text-school-primary text-sm hover:underline font-semibold"
//                 >
//                     Back to login
//                 </a>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen flex flex-col items-center justify-center bg-school-secondary-950 gap-4">
//             <Loader2 className="h-8 w-8 animate-spin text-school-primary" />
//             <p className="text-school-secondary-100/50 text-sm">
//                 Confirming your account...
//             </p>
//         </div>
//     );
// }

// async function resolveAndRedirect(
//     email: string,
//     router: ReturnType<typeof useRouter>,
//     setErrorMessage: (msg: string) => void,
//     setStatus: (s: 'loading' | 'error') => void
// ) {
//     console.log('🔍 Fetching profile for:', email);

//     const profile = await getTeacherData(email);

//     console.log('👤 Profile:', profile ? { role: profile.role, name: profile.name } : null);

//     if (!profile) {
//         console.error('❌ No profile found for:', email);
//         setErrorMessage('Account setup incomplete. Please contact support.');
//         setStatus('error');
//         return;
//     }

//     // Hydrate store so dashboard layout finds profile immediately
//     useProfileStore.getState().setProfile(profile);

//     const dashboardPath = getDashboardPath(profile.role);
//     console.log('➡️ Redirecting to:', dashboardPath);
//     router.replace(dashboardPath);
// }

// function getDashboardPath(role?: string | null): string {
//     switch (role) {
//         case 'SUPER_ADMIN':
//         case 'SCHOOL_ADMIN':
//             return '/admin';
//         case 'TEACHER':
//             return '/teacher';
//         case 'STUDENT':
//             return '/student';
//         case 'PARENT':
//             return '/parent';
//         default:
//             return '/login';
//     }
// }


// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { createClient } from '@/lib/supabase/client';
// import { Loader2 } from 'lucide-react';

// export default function ConfirmPage() {
//     const router = useRouter();
//     const [status, setStatus] = useState<'loading' | 'error'>('loading');

//     useEffect(() => {
//         const supabase = createClient();

//         const { data: { subscription } } = supabase.auth.onAuthStateChange(
//             async (event, session) => {
//                 console.log('🔐 Auth event:', event, '| Has session:', !!session);

//                 if (!session?.user) return;

//                 // ✅ Session confirmed — unsubscribe and redirect to login
//                 // Login page will handle profile fetch and role-based redirect
//                 subscription.unsubscribe();

//                 if (event === 'INITIAL_SESSION' || event === 'SIGNED_IN') {
//                     // Small delay to ensure session cookies are written
//                     await new Promise(r => setTimeout(r, 500));
//                     router.replace('/login?confirmed=true');
//                 }
//             }
//         );

//         const timeout = setTimeout(() => {
//             subscription.unsubscribe();
//             setStatus('error');
//         }, 10000);

//         return () => {
//             subscription.unsubscribe();
//             clearTimeout(timeout);
//         };
//     }, []);

//     if (status === 'error') {
//         return (
//             <div style={{
//                 minHeight: '100vh',
//                 display: 'flex',
//                 flexDirection: 'column',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 background: '#0f172a',
//                 gap: '16px',
//             }}>
//                 <p style={{ color: '#f87171', fontWeight: 600 }}>
//                     Confirmation failed
//                 </p>
//                 <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
//                     This link may have expired. Try logging in or request a new link.
//                 </p>
//                 <a href="/login" style={{ color: '#f59e0b', fontSize: '14px' }}>
//                     Go to login
//                 </a>
//             </div>
//         );
//     }

//     return (
//         <div style={{
//             minHeight: '100vh',
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//             justifyContent: 'center',
//             background: '#0f172a',
//             gap: '16px',
//         }}>
//             <Loader2 style={{
//                 width: 32,
//                 height: 32,
//                 color: '#f59e0b',
//                 animation: 'spin 1s linear infinite'
//             }} />
//             <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
//                 Confirming your account...
//             </p>
//         </div>
//     );
// }



'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function ConfirmPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'loading' | 'error'>('loading');
    const [message, setMessage] = useState('Confirming your account...');

    useEffect(() => {
        async function confirm() {
            const supabase = createClient();

            console.log('✅ Confirm page hit');
            console.log('URL:', window.location.href);

            const params = new URLSearchParams(window.location.search);
            const token_hash = params.get('token_hash');
            const type = params.get('type');

            console.log('token_hash:', token_hash ? 'present' : 'missing');
            console.log('type:', type);

            if (!token_hash || !type) {
                console.error('❌ Missing params');
                setStatus('error');
                return;
            }

            setMessage('Verifying your email...');

            const { error, data } = await supabase.auth.verifyOtp({
                type: type as any,
                token_hash,
            });

            console.log('verifyOtp:', {
                error: error?.message ?? null,
                userId: data?.user?.id ?? null,
                email: data?.user?.email ?? null,
            });

            if (error) {
                console.error('❌ verifyOtp failed:', error.message);
                setStatus('error');
                return;
            }

            if (type === 'invite') {
                router.replace('/auth/set-password');
                return;
            }

            // ✅ Email confirmed — send to login with success message
            // Login handles profile fetch and role-based redirect
            setMessage('Confirmed! Redirecting to login...');
            await new Promise(r => setTimeout(r, 800));
            router.replace('/login?confirmed=true');
        }

        confirm();
    }, []);

    if (status === 'error') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0f172a',
                gap: '16px',
            }}>
                <p style={{ color: '#f87171', fontWeight: 600, fontSize: '18px' }}>
                    Confirmation failed
                </p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', maxWidth: '320px', textAlign: 'center' }}>
                    This link may have expired or already been used.
                    Try logging in directly or use Forgot Password.
                </p>
                <a href="/login" style={{ color: '#f59e0b', fontSize: '14px' }}>
                    Go to login
                </a>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0f172a',
            gap: '16px',
        }}>
            <Loader2 style={{
                width: 32,
                height: 32,
                color: '#f59e0b',
                animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>
                {message}
            </p>
        </div>
    );
}
