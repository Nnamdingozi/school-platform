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


import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Ensure 'type' is used for CookieOptions
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
    // 1. Create an initial response
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                // ✅ Fix 1: Type the parameter to avoid "any" errors
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    // Update request cookies
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    
                    // ✅ Fix 2: Use "supabaseResponse" (not "response")
                    supabaseResponse = NextResponse.next({
                        request,
                    });

                    // Update response cookies
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // IMPORTANT: Do not remove this. This refreshes the session if it's expired.
    await supabase.auth.getUser();

    return supabaseResponse;
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};