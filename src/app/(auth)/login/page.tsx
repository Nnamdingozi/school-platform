// 'use client';

// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { getTeacherData } from '@/app/actions/teacherData';
// import { useProfileStore } from '@/store/profileStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
// import Link from 'next/link';
// import { createClient } from '@/lib/supabase/client';
// import { useSearchParams } from 'next/navigation';
// import { useEffect } from 'react';

// export default function LoginPage() {
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const supabase = createClient();
//     const searchParams = useSearchParams();

// useEffect(() => {
//     if (searchParams.get('confirmed') === 'true') {
//         toast.success('Email confirmed! Please log in to access your dashboard.');
//     }
//     if (searchParams.get('error') === 'confirmation_failed') {
//         toast.error('Confirmation link expired. Please try logging in or use Forgot Password.');
//     }
// }, []);


//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             // 1. Authenticate with Supabase
//             const { data, error } = await supabase.auth.signInWithPassword({
//                 email,
//                 password,
//             });

//             if (error) {
//                 if (error.message.includes('Email not confirmed')) {
//                     toast.error('Please verify your email address before logging in.');
//                 } else if (error.message.includes('Invalid login credentials')) {
//                     toast.error('Incorrect email or password.');
//                 } else {
//                     toast.error(error.message);
//                 }
//                 setIsLoading(false); // ✅ Always reset on error
//                 return;
//             }

//             // 2. Fetch profile to determine role
//             if (!data.user?.email) {
//                 toast.error('Login failed. Please try again.');
//                 setIsLoading(false);
//                 return;
//             }

//             const profile = await getTeacherData(data.user.email);

//             if (!profile) {
//                 toast.error('Profile not found. Please contact support.');
//                 await supabase.auth.signOut();
//                 setIsLoading(false);
//                 return;
//             }

//             // 3. Hydrate client store
//             useProfileStore.getState().setProfile(profile);

//             toast.success(`Welcome back, ${profile.name?.split(' ')[0] || 'User'}!`);

//             // 4. Role-based redirect
//             // ✅ Use router.replace instead of push so back button doesn't
//             //    return them to login, and remove router.refresh() — it conflicts
//             //    with the navigation and causes the stuck spinner
//             switch (profile.role) {
//                 case 'SUPER_ADMIN':
//                 case 'SCHOOL_ADMIN':
//                     router.replace('/admin');
//                     break;
//                 case 'TEACHER':
//                     router.replace('/teacher');
//                     break;
//                 case 'STUDENT':
//                     router.replace('/student');
//                     break;
//                 case 'PARENT':
//                     router.replace('/parent');
//                     break;
//                 default:
//                     router.replace('/login');
//             }

//             // ✅ Do NOT call setIsLoading(false) here — keep spinner showing
//             // while navigation completes so UI doesn't flash back to the form

//         } catch (err) {
//             console.error('Login error:', err);
//             toast.error('An unexpected error occurred.');
//             setIsLoading(false); // ✅ Reset on catch
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-school-secondary-950 p-4 relative overflow-hidden">

//             {/* Background decoration */}
//             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//                 <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-school-primary/5 rounded-full blur-3xl" />
//                 <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-school-primary/5 rounded-full blur-3xl" />
//             </div>

//             <div className="w-full max-w-md bg-school-secondary-900 border border-school-secondary-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">

//                 {/* Header */}
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-school-primary/10 mb-4">
//                         <Lock className="h-6 w-6 text-school-primary" />
//                     </div>
//                     <h1 className="text-2xl font-black text-white tracking-tight">
//                         Welcome back
//                     </h1>
//                     <p className="text-school-secondary-100/50 text-sm mt-2">
//                         Enter your credentials to access your workspace.
//                     </p>
//                 </div>

//                 <form onSubmit={handleLogin} className="space-y-5">

//                     {/* Email */}
//                     <div className="space-y-1.5">
//                         <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                             Email Address
//                         </Label>
//                         <div className="relative">
//                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                             <Input
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="name@school.com"
//                                 className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-100/20 focus:border-school-primary"
//                                 required
//                                 disabled={isLoading}
//                             />
//                         </div>
//                     </div>

//                     {/* Password */}
//                     <div className="space-y-1.5">
//                         <div className="flex items-center justify-between">
//                             <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                                 Password
//                             </Label>
//                             <Link
//                                 href="/forgot-password"
//                                 className="text-xs text-school-primary hover:text-school-primary-400 transition-colors"
//                             >
//                                 Forgot?
//                             </Link>
//                         </div>
//                         <div className="relative">
//                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                             <Input
//                                 type={showPassword ? "text" : "password"}
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 placeholder="••••••••"
//                                 className="pl-10 pr-10 bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-100/20 focus:border-school-primary"
//                                 required
//                                 disabled={isLoading}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-100/30 hover:text-white transition-colors"
//                                 tabIndex={-1}
//                             >
//                                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                             </button>
//                         </div>
//                     </div>

//                     <Button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full h-11 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold transition-all duration-200"
//                     >
//                         {isLoading ? (
//                             <span className="flex items-center gap-2">
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                 Authenticating...
//                             </span>
//                         ) : (
//                             "Sign In"
//                         )}
//                     </Button>
//                 </form>

//                 <div className="mt-6 text-center text-sm text-school-secondary-100">
//                     Don't have an account?{' '}
//                     <Link href="/onboarding" className="text-school-primary hover:text-school-primary-400 font-semibold transition-colors">
//                         Get started
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }


// 'use client';

// import { useState, useEffect } from 'react'; // ✅ Consolidated imports
// import { useRouter, useSearchParams } from 'next/navigation';
// import { getTeacherData } from '@/app/actions/teacherData';
// import { useProfileStore } from '@/store/profileStore';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { toast } from 'sonner';
// import { Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
// import Link from 'next/link';
// import { createClient } from '@/lib/supabase/client';

// export default function LoginPage() {
//     const router = useRouter();
//     const [isLoading, setIsLoading] = useState(false);
//     const [showPassword, setShowPassword] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const supabase = createClient();
//     const searchParams = useSearchParams();

//     useEffect(() => {
//         if (searchParams.get('confirmed') === 'true') {
//             toast.success('Email confirmed! Please log in to access your dashboard.');
//         }
//         if (searchParams.get('error') === 'confirmation_failed') {
//             toast.error('Confirmation link expired. Please try logging in or use Forgot Password.');
//         }
//     }, [searchParams]); // ✅ FIX 1: Added searchParams to the dependency array

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setIsLoading(true);

//         try {
//             const { data, error } = await supabase.auth.signInWithPassword({
//                 email,
//                 password,
//             });

//             if (error) {
//                 if (error.message.includes('Email not confirmed')) {
//                     toast.error('Please verify your email address before logging in.');
//                 } else if (error.message.includes('Invalid login credentials')) {
//                     toast.error('Incorrect email or password.');
//                 } else {
//                     toast.error(error.message);
//                 }
//                 setIsLoading(false); 
//                 return;
//             }

//             if (!data.user?.email) {
//                 toast.error('Login failed. Please try again.');
//                 setIsLoading(false);
//                 return;
//             }

//             const profile = await getTeacherData(data.user.email);

//             if (!profile) {
//                 toast.error('Profile not found. Please contact support.');
//                 await supabase.auth.signOut();
//                 setIsLoading(false);
//                 return;
//             }

//             useProfileStore.getState().setProfile(profile);
//             toast.success(`Welcome back, ${profile.name?.split(' ')[0] || 'User'}!`);

//             switch (profile.role) {
//                 case 'SUPER_ADMIN':
//                 case 'SCHOOL_ADMIN':
//                     router.replace('/admin');
//                     break;
//                 case 'TEACHER':
//                     router.replace('/teacher');
//                     break;
//                 case 'STUDENT':
//                     router.replace('/student');
//                     break;
//                 case 'PARENT':
//                     router.replace('/parent');
//                     break;
//                 default:
//                     router.replace('/login');
//             }

//         } catch (err) {
//             console.error('Login error:', err);
//             toast.error('An unexpected error occurred.');
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-school-secondary-950 p-4 relative overflow-hidden">
//             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
//                 <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-school-primary/5 rounded-full blur-3xl" />
//                 <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-school-primary/5 rounded-full blur-3xl" />
//             </div>

//             <div className="w-full max-w-md bg-school-secondary-900 border border-school-secondary-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
//                 <div className="text-center mb-8">
//                     <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-school-primary/10 mb-4">
//                         <Lock className="h-6 w-6 text-school-primary" />
//                     </div>
//                     <h1 className="text-2xl font-black text-white tracking-tight">
//                         Welcome back
//                     </h1>
//                     <p className="text-school-secondary-100/50 text-sm mt-2">
//                         Enter your credentials to access your workspace.
//                     </p>
//                 </div>

//                 <form onSubmit={handleLogin} className="space-y-5">
//                     <div className="space-y-1.5">
//                         <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                             Email Address
//                         </Label>
//                         <div className="relative">
//                             <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                             <Input
//                                 type="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 placeholder="name@school.com"
//                                 className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-100/20 focus:border-school-primary"
//                                 required
//                                 disabled={isLoading}
//                             />
//                         </div>
//                     </div>

//                     <div className="space-y-1.5">
//                         <div className="flex items-center justify-between">
//                             <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
//                                 Password
//                             </Label>
//                             <Link
//                                 href="/forgot-password"
//                                 className="text-xs text-school-primary hover:text-school-primary-400 transition-colors"
//                             >
//                                 Forgot?
//                             </Link>
//                         </div>
//                         <div className="relative">
//                             <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
//                             <Input
//                                 type={showPassword ? "text" : "password"}
//                                 value={password}
//                                 onChange={(e) => setPassword(e.target.value)}
//                                 placeholder="••••••••"
//                                 className="pl-10 pr-10 bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-100/20 focus:border-school-primary"
//                                 required
//                                 disabled={isLoading}
//                             />
//                             <button
//                                 type="button"
//                                 onClick={() => setShowPassword(!showPassword)}
//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-100/30 hover:text-white transition-colors"
//                                 tabIndex={-1}
//                             >
//                                 {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//                             </button>
//                         </div>
//                     </div>

//                     <Button
//                         type="submit"
//                         disabled={isLoading}
//                         className="w-full h-11 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold transition-all duration-200"
//                     >
//                         {isLoading ? (
//                             <span className="flex items-center gap-2">
//                                 <Loader2 className="h-4 w-4 animate-spin" />
//                                 Authenticating...
//                             </span>
//                         ) : (
//                             "Sign In"
//                         )}
//                     </Button>
//                 </form>

//                 <div className="mt-6 text-center text-sm text-school-secondary-100">
//                     {/* ✅ FIX 2: Escaped apostrophe using curly braces */}
//                     {"Don't have an account? "}
//                     <Link href="/onboarding" className="text-school-primary hover:text-school-primary-400 font-semibold transition-colors">
//                         Get started
//                     </Link>
//                 </div>
//             </div>
//         </div>
//     );
// }



'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTeacherData } from '@/app/actions/teacherData';
import { useProfileStore } from '@/store/profileStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
    const router                          = useRouter();
    const [isLoading,    setIsLoading]    = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [email,        setEmail]        = useState('');
    const [password,     setPassword]     = useState('');
    const [loadingMsg,   setLoadingMsg]   = useState('Authenticating...');

    const supabase    = createClient();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (searchParams.get('confirmed') === 'true') {
            toast.success('Email confirmed! Please log in to access your dashboard.');
        }
        if (searchParams.get('error') === 'confirmation_failed') {
            toast.error('Confirmation link expired. Please try logging in or use Forgot Password.');
        }
    }, [searchParams]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setLoadingMsg('Authenticating...');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                if (error.message.includes('Email not confirmed')) {
                    toast.error('Please verify your email address before logging in.');
                } else if (error.message.includes('Invalid login credentials')) {
                    toast.error('Incorrect email or password.');
                } else {
                    toast.error(error.message);
                }
                setIsLoading(false);
                return;
            }

            if (!data.user?.email) {
                toast.error('Login failed. Please try again.');
                setIsLoading(false);
                return;
            }

            setLoadingMsg('Loading your profile...');
            const profile = await getTeacherData(data.user.email);

            if (!profile) {
                toast.error('Profile not found. Please contact support.');
                await supabase.auth.signOut();
                setIsLoading(false);
                return;
            }

            setLoadingMsg('Taking you to your dashboard...');
            useProfileStore.getState().setProfile(profile);
            toast.success(`Welcome back, ${profile.name?.split(' ')[0] || 'User'}!`);

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

        } catch (err) {
            console.error('Login error:', err);
            toast.error('An unexpected error occurred.');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-school-secondary-950 p-4 relative overflow-hidden">

            {/* ── Background blobs ── */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-school-primary/5 rounded-full blur-3xl" />
                <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-school-primary/5 rounded-full blur-3xl" />
            </div>

            {/* ── Full screen loading overlay ── */}
            {isLoading && (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-school-secondary-950/90 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative flex items-center justify-center h-16 w-16">
                            {/* Outer ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-school-primary/20" />
                            {/* Spinning ring */}
                            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-school-primary animate-spin" />
                            {/* Inner icon */}
                            <Lock className="h-6 w-6 text-school-primary" />
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-white font-semibold text-sm">
                                {loadingMsg}
                            </p>
                            <p className="text-school-secondary-100/40 text-xs">
                                Please wait a moment
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Login card ── */}
            <div className="w-full max-w-md bg-school-secondary-900 border border-school-secondary-800 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-school-primary/10 mb-4">
                        <Lock className="h-6 w-6 text-school-primary" />
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-tight">
                        Welcome back
                    </h1>
                    <p className="text-school-secondary-100/50 text-sm mt-2">
                        Enter your credentials to access your workspace.
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                            Email Address
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-school-secondary-100/30" />
                            <Input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@school.com"
                                className="pl-10 bg-school-secondary-800 border-school-secondary-700 text-white placeholder:text-school-secondary-100/20 focus:border-school-primary"
                                required
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                            <Label className="text-school-secondary-100/70 text-xs uppercase tracking-wider font-semibold">
                                Password
                            </Label>
                            <Link
                                href="/forgot-password"
                                className="text-xs text-school-primary hover:text-school-primary-400 transition-colors"
                            >
                                Forgot?
                            </Link>
                        </div>
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
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-school-secondary-100/30 hover:text-white transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword
                                    ? <EyeOff className="h-4 w-4" />
                                    : <Eye className="h-4 w-4" />
                                }
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-11 bg-school-primary hover:bg-school-primary-600 text-school-secondary-950 font-bold transition-all duration-200"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                {loadingMsg}
                            </span>
                        ) : (
                            'Sign In'
                        )}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-school-secondary-100">
                    {"Don't have an account? "}
                    <Link
                        href="/onboarding"
                        className="text-school-primary hover:text-school-primary-400 font-semibold transition-colors"
                    >
                        Get started
                    </Link>
                </div>
            </div>
        </div>
    );
}