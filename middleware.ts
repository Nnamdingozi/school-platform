// // middleware.ts  ← sits at root, NOT inside src/app
// import { createServerClient } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//     let supabaseResponse = NextResponse.next({ request });

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll: () => request.cookies.getAll(),
//                 setAll: (cookiesToSet) => {
//                     cookiesToSet.forEach(({ name, value }) =>
//                         request.cookies.set(name, value)
//                     );
//                     supabaseResponse = NextResponse.next({ request });
//                     cookiesToSet.forEach(({ name, value, options }) =>
//                         supabaseResponse.cookies.set(name, value, options)
//                     );
//                 },
//             },
//         }
//     );

//     // Refresh session — do not remove this
//     await supabase.auth.getUser();

//     return supabaseResponse;
// }

// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     ],
// };


// import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Ensure 'type' is used for CookieOptions
// import { NextResponse, type NextRequest } from 'next/server';

// export async function middleware(request: NextRequest) {
//     // 1. Create an initial response
//     let supabaseResponse = NextResponse.next({
//         request: {
//             headers: request.headers,
//         },
//     });

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll() {
//                     return request.cookies.getAll();
//                 },
//                 // ✅ Fix 1: Type the parameter to avoid "any" errors
//                 setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
//                     // Update request cookies
//                     cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    
//                     // ✅ Fix 2: Use "supabaseResponse" (not "response")
//                     supabaseResponse = NextResponse.next({
//                         request,
//                     });

//                     // Update response cookies
//                     cookiesToSet.forEach(({ name, value, options }) =>
//                         supabaseResponse.cookies.set(name, value, options)
//                     );
//                 },
//             },
//         }
//     );

//     // IMPORTANT: Do not remove this. This refreshes the session if it's expired.
//     await supabase.auth.getUser();

//     return supabaseResponse;
// }

// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     ],
// };



// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { NextResponse, type NextRequest } from 'next/server';

// const ROLE_HOME: Record<string, string> = {
//     SCHOOL_ADMIN:  '/admin',
//     SUPER_ADMIN:   '/admin',
//     TEACHER:       '/teacher',
//     STUDENT:       '/student',
//     PARENT:        '/parent',
// };

// const PROTECTED_PREFIXES = ['/admin', '/teacher', '/student', '/parent'];
// const AUTH_ROUTES        = ['/login', '/register', '/forgot-password'];

// export async function middleware(request: NextRequest) {
//     const { pathname } = request.nextUrl;

//     let supabaseResponse = NextResponse.next({
//         request: { headers: request.headers },
//     });

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll() {
//                     return request.cookies.getAll();
//                 },
//                 setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
//                     cookiesToSet.forEach(({ name, value }) =>
//                         request.cookies.set(name, value)
//                     );
//                     supabaseResponse = NextResponse.next({ request });
//                     cookiesToSet.forEach(({ name, value, options }) =>
//                         supabaseResponse.cookies.set(name, value, options)
//                     );
//                 },
//             },
//         }
//     );

//     const { data: { user } } = await supabase.auth.getUser();

//     // ── Unauthenticated user trying to access protected route ──────────────────
//     const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
//     if (!user && isProtected) {
//         const loginUrl = request.nextUrl.clone();
//         loginUrl.pathname = '/login';
//         return NextResponse.redirect(loginUrl);
//     }

//     // ── Authenticated user hitting an auth route (e.g. /login) ────────────────
//     if (user && AUTH_ROUTES.some(r => pathname.startsWith(r))) {
//         // Fetch role from DB to redirect to correct home
//         const res = await fetch(
//             `${request.nextUrl.origin}/api/auth/role?userId=${user.id}`,
//             { headers: { cookie: request.headers.get('cookie') ?? '' } }
//         );

//         let home = '/teacher'; // safe fallback
//         if (res.ok) {
//             const { role } = await res.json();
//             home = ROLE_HOME[role] ?? '/teacher';
//         }

//         const homeUrl = request.nextUrl.clone();
//         homeUrl.pathname = home;
//         return NextResponse.redirect(homeUrl);
//     }

//     return supabaseResponse;
// }

// export const config = {
//     matcher: [
//         '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
//     ],
// };


import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const ROLE_HOME: Record<string, string> = {
    SCHOOL_ADMIN:  '/admin',
    SUPER_ADMIN:   '/admin',
    TEACHER:       '/teacher',
    STUDENT:       '/student',
    PARENT:        '/parent',
    INDIVIDUAL_LEARNER: '/student', // Added for individual learners
};

const PROTECTED_PREFIXES = ['/admin', '/teacher', '/student', '/parent', '/classes', '/billing', '/settings'];
const AUTH_ROUTES        = ['/login', '/register', '/forgot-password', '/set-password'];
const PUBLIC_ROUTES      = ['/accept-invite', '/confirm', '/api/invitations']; // ✅ Added safe zones

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    let supabaseResponse = NextResponse.next({
        request: { headers: request.headers },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // 1. Check if the route is a public "Safe Zone"
    const isPublicRoute = PUBLIC_ROUTES.some(p => pathname.startsWith(p));
    if (isPublicRoute) {
        return supabaseResponse;
    }

    // 2. Unauthenticated user trying to access protected route
    const isProtected = PROTECTED_PREFIXES.some(p => pathname.startsWith(p));
    if (!user && isProtected) {
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        // Append the current path so user returns here after login
        loginUrl.searchParams.set('next', pathname); 
        return NextResponse.redirect(loginUrl);
    }

    // 3. Authenticated user hitting an auth route (e.g. /login)
    // We only redirect if they are trying to go to login/register while already having a session
    if (user && AUTH_ROUTES.some(r => pathname.startsWith(r))) {
        const res = await fetch(
            `${request.nextUrl.origin}/api/auth/role?userId=${user.id}`,
            { headers: { cookie: request.headers.get('cookie') ?? '' } }
        );

        let home = '/teacher'; 
        if (res.ok) {
            const { role } = await res.json();
            home = ROLE_HOME[role] ?? '/teacher';
        }

        const homeUrl = request.nextUrl.clone();
        homeUrl.pathname = home;
        return NextResponse.redirect(homeUrl);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};