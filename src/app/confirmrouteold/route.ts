// // app/auth/confirm/route.ts
// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient, CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const token_hash = searchParams.get('token_hash');
//     const type = searchParams.get('type');
//     const next = searchParams.get('next') ?? '/admin';

//     if (token_hash && type) {
//         const cookieStore = await cookies();
//         const supabase = createServerClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//             {
//                 cookies: {
//                     get: (name: string) => cookieStore.get(name)?.value,
//                     set: (name: string, value: string, options: CookieOptions) => {
//                         cookieStore.set({ name, value, ...options });
//                     },
//                     remove: (name: string, options: CookieOptions) => { // Corrected
//                         cookieStore.delete({ name, ...options });  // Corrected
//                     },
//                 },
//             }
//         );
    

//         const { error } = await supabase.auth.verifyOtp({
//             type: type as any,
//             token_hash,
//         });

//         if (!error) {
//             // ✅ Session is now established — redirect to dashboard
//             return NextResponse.redirect(new URL('/admin', request.url));
//         }

//         console.error('Auth confirm error:', error.message);
//     }

//     // Something went wrong — send to login with error
//     return NextResponse.redirect(
//         new URL('/login?error=confirmation_failed', request.url)
//     );
// }


// // Site URL: http://localhost:3000
// // Redirect URLs: http://localhost:3000/confirm
// // ```

// // For production add:

// // https://yourdomain.com/auth/confirm




// // app/auth/confirm/route.ts
// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const token_hash = searchParams.get('token_hash');
//     const type = searchParams.get('type');

//     if (token_hash && type) {
//         const cookieStore = await cookies();

//         const supabase = createServerClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//             {
//                 cookies: {
//                     getAll: () => cookieStore.getAll(),
//                     setAll: (cookiesToSet) => {
//                         cookiesToSet.forEach(({ name, value, options }) => {
//                             cookieStore.set(name, value, options);
//                         });
//                     },
//                 },
//             }
//         );

//         const { error } = await supabase.auth.verifyOtp({
//             type: type as any,
//             token_hash,
//         });

//         if (!error) {
//             return NextResponse.redirect(new URL('/admin', request.url));
//         }

//         console.error('Auth confirm error:', error.message);
//     }

//     return NextResponse.redirect(
//         new URL('/login?error=confirmation_failed', request.url)
//     );
// }


// // app/auth/confirm/route.ts
// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const token_hash = searchParams.get('token_hash');
//     const type = searchParams.get('type');

//     if (token_hash && type) {
//         const cookieStore = await cookies();

//         const supabase = createServerClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//             {
//                 cookies: {
//                     getAll: () => cookieStore.getAll(),
//                     setAll: (cookiesToSet) => {
//                         cookiesToSet.forEach(({ name, value, options }) => {
//                             cookieStore.set(name, value, options);
//                         });
//                     },
//                 },
//             }
//         );

//         const { error, data } = await supabase.auth.verifyOtp({
//             type: type as any,
//             token_hash,
//         });

//         if (!error && data?.user?.email) {
//             // ✅ Fetch profile to determine correct dashboard
//             const profile = await prisma.profile.findUnique({
//                 where: { email: data.user.email },
//                 select: { role: true },
//             });

//             // ✅ Role-based redirect — each role lands on their own dashboard
//             const dashboardPath = getDashboardPath(profile?.role);
//             return NextResponse.redirect(new URL(dashboardPath, request.url));
//         }

//         console.error('Auth confirm error:', error?.message);
//     }

//     return NextResponse.redirect(
//         new URL('/login?error=confirmation_failed', request.url)
//     );
// }

// function getDashboardPath(role?: string | null): string {
//     switch (role) {
//         case 'SUPER_ADMIN':
//         case 'SCHOOL_ADMIN':
//             return '/admin';
//         case 'TEACHER':
//             return '/dashboard';
//         case 'STUDENT':
//             return '/student';
//         case 'PARENT':
//             return '/parent';
//         default:
//             return '/login';
//     }
// }


// // app/auth/confirm/route.ts
// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const token_hash = searchParams.get('token_hash');
//     const type = searchParams.get('type');

//     if (token_hash && type) {
//         const cookieStore = await cookies();

//         const supabase = createServerClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//             {
//                 cookies: {
//                     getAll: () => cookieStore.getAll(),
//                     setAll: (cookiesToSet) => {
//                         cookiesToSet.forEach(({ name, value, options }) => {
//                             cookieStore.set(name, value, options);
//                         });
//                     },
//                 },
//             }
//         );

//         const { error, data } = await supabase.auth.verifyOtp({
//             type: type as any,
//             token_hash,
//         });

//         if (!error && data?.user?.email) {
//             // ✅ Fetch profile to determine correct dashboard
//             const profile = await prisma.profile.findUnique({
//                 where: { email: data.user.email },
//                 select: { role: true },
//             });

//             // ✅ Role-based redirect — each role lands on their own dashboard
//             const dashboardPath = getDashboardPath(profile?.role);
//             return NextResponse.redirect(new URL(dashboardPath, request.url));
//         }

//         console.error('Auth confirm error:', error?.message);
//     }

//     return NextResponse.redirect(
//         new URL('/login?error=confirmation_failed', request.url)
//     );
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


// // app/confirm/route.ts
// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const token_hash = searchParams.get('token_hash');
//     const type = searchParams.get('type');

//     if (token_hash && type) {
//         const cookieStore = await cookies();

//         const supabase = createServerClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//             {
//                 cookies: {
//                     getAll: () => cookieStore.getAll(),
//                     setAll: (cookiesToSet) => {
//                         cookiesToSet.forEach(({ name, value, options }) => {
//                             cookieStore.set(name, value, options);
//                         });
//                     },
//                 },
//             }
//         );

//         const { error, data } = await supabase.auth.verifyOtp({
//             type: type as any,
//             token_hash,
//         });

//         if (!error && data?.user?.email) {

//             // ✅ Invited users (type=invite) must set a password first
//             // They have a session but no password yet — send to set-password
//             if (type === 'invite') {
//                 return NextResponse.redirect(
//                     new URL('/set-password', request.url)
//                 );
//             }

//             // ✅ Email confirmations (type=email) — existing onboarding admins
//             // Fetch role and redirect to correct dashboard
//             const profile = await prisma.profile.findUnique({
//                 where: { email: data.user.email },
//                 select: { role: true },
//             });

//             const dashboardPath = getDashboardPath(profile?.role);
//             return NextResponse.redirect(new URL(dashboardPath, request.url));
//         }

//         console.error('Auth confirm error:', error?.message);
//     }

//     return NextResponse.redirect(
//         new URL('/login?error=confirmation_failed', request.url)
//     );
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


// app/confirm/route.ts
import { type NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');

    if (token_hash && type) {
        const cookieStore = await cookies();

        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    getAll: () => cookieStore.getAll(),
                    setAll: (cookiesToSet) => {
                        cookiesToSet.forEach(({ name, value, options }) => {
                            cookieStore.set(name, value, options);
                        });
                    },
                },
            }
        );

        const { error, data } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
        });

        // ✅ Debug log — remove after confirming flow works
        console.log('verifyOtp result:', {
            error: error?.message ?? null,
            userId: data?.user?.id ?? null,
            email: data?.user?.email ?? null,
            emailConfirmed: data?.user?.email_confirmed_at ?? null,
        });

        if (!error && data?.user) {
            // Invited users must set a password before accessing dashboard
            if (type === 'invite') {
                return NextResponse.redirect(
                    new URL('/set-password', request.url)
                );
            }

            // ✅ Look up profile by Supabase user ID first (most reliable),
            // fall back to email in case ID wasn't stored correctly.
            // This fixes the case where anon signUp returns null email on verifyOtp.
            const profile = await prisma.profile.findFirst({
                where: {
                    OR: [
                        { id: data.user.id },
                        ...(data.user.email ? [{ email: data.user.email }] : []),
                    ],
                },
                select: { role: true },
            });

            console.log('Profile found:', profile);

            if (!profile) {
                // Auth confirmed but no profile — onboarding DB step failed
                console.error('No profile found for user:', data.user.id);
                return NextResponse.redirect(
                    new URL('/login?error=profile_not_found', request.url)
                );
            }

            const dashboardPath = getDashboardPath(profile.role);
            return NextResponse.redirect(new URL(dashboardPath, request.url));
        }

        console.error('Auth confirm error:', error?.message);
    }

    return NextResponse.redirect(
        new URL('/login?error=confirmation_failed', request.url)
    );
}

function getDashboardPath(role?: string | null): string {
    switch (role) {
        case 'SUPER_ADMIN':
        case 'SCHOOL_ADMIN':
            return '/admin';
        case 'TEACHER':
            return '/teacher';
        case 'STUDENT':
            return '/student';
        case 'PARENT':
            return '/parent';
        default:
            return '/login';
    }
}


// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { prisma } from '@/lib/prisma';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
    
//     // Supabase sends a 'code' parameter for the PKCE flow
//     const code = searchParams.get('code');
    
//     // Check for errors returned by Supabase
//     const error = searchParams.get('error');
//     const error_description = searchParams.get('error_description');

//     const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

//     if (error) {
//         console.error('Supabase Redirect Error:', error, error_description);
//         return NextResponse.redirect(`${appUrl}/login?error=${error}`);
//     }

//     if (code) {
//         const cookieStore = await cookies();

//         const supabase = createServerClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//             {
//                 cookies: {
//                     getAll: () => cookieStore.getAll(),
//                     setAll: (cookiesToSet) => {
//                         cookiesToSet.forEach(({ name, value, options }) => {
//                             cookieStore.set(name, value, options);
//                         });
//                     },
//                 },
//             }
//         );

//         // 1. Exchange the auth code for a user session
//         const { error: sessionError, data } = await supabase.auth.exchangeCodeForSession(code);

//         if (!sessionError && data?.user) {
            
//             // 2. Fetch the user's role from Prisma
//             const profile = await prisma.profile.findUnique({
//                 where: { id: data.user.id },
//                 select: { role: true },
//             });

//             if (!profile) {
//                 // Profile might be missing if the transaction failed but Auth succeeded
//                 // In a production app, you might want to redirect to a "Finish Setup" page here
//                 console.error('Profile missing for user:', data.user.id);
//                 return NextResponse.redirect(`${appUrl}/login?error=profile_missing`);
//             }

//             // 3. Determine the correct dashboard based on role
//             const redirectPath = getDashboardPath(profile.role);
            
//             // 4. Redirect the user to their dashboard
//             return NextResponse.redirect(`${appUrl}${redirectPath}`);
//         }
        
//         if (sessionError) {
//             console.error('Session Exchange Error:', sessionError.message);
//         }
//     }

//     // Fallback: If no code or exchange failed, send to login
//     return NextResponse.redirect(`${appUrl}/login?error=auth_code_error`);
// }

// function getDashboardPath(role?: string | null): string {
//     switch (role) {
//         case 'SUPER_ADMIN':
//         case 'SCHOOL_ADMIN':
//             return '/admin'; // Redirects Admin to /admin
//         case 'TEACHER':
//             return '/teacher'; // Redirects Teacher to /dashboard
//         case 'STUDENT':
//             return '/student';
//         case 'PARENT':
//             return '/parent';
//         default:
//             return '/login';
//     }
// }