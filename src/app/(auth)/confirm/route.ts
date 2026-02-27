// // app/auth/confirm/route.ts
// import { type NextRequest, NextResponse } from 'next/server';
// import { createServerClient, CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url);
//     const token_hash = searchParams.get('token_hash');
//     const type = searchParams.get('type');
//     const next = searchParams.get('next') ?? '/admin/dashboard';

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
// // Redirect URLs: http://localhost:3000/auth/confirm
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


// app/auth/confirm/route.ts
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

        if (!error && data?.user?.email) {

            // ✅ Invited users (type=invite) must set a password first
            // They have a session but no password yet — send to set-password
            if (type === 'invite') {
                return NextResponse.redirect(
                    new URL('/set-password', request.url)
                );
            }

            // ✅ Email confirmations (type=email) — existing onboarding admins
            // Fetch role and redirect to correct dashboard
            const profile = await prisma.profile.findUnique({
                where: { email: data.user.email },
                select: { role: true },
            });

            const dashboardPath = getDashboardPath(profile?.role);
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
            return '/dashboard';
        case 'STUDENT':
            return '/student';
        case 'PARENT':
            return '/parent';
        default:
            return '/login';
    }
}