// import { createServerClient } from '@supabase/ssr'
// import { cookies } from 'next/headers'
// import type { CookieMethodsServer } from '@supabase/ssr'

// export async function createClient() {
//     const cookieStore = await cookies() // ← await needed in Next.js 15

//     const cookieMethods: CookieMethodsServer = {
//         getAll() {
//             return cookieStore.getAll()
//         },
//         setAll(cookiesToSet) {
//             try {
//                 cookiesToSet.forEach(({ name, value, options }) =>
//                     cookieStore.set(name, value, options)
//                 )
//             } catch {
//                 // Server component — safe to ignore
//             }
//         },
//     }

//     return createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         { cookies: cookieMethods }
//     )
// }


import { createServerClient, CookieMethodsServer } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()
    const cookieMethods: CookieMethodsServer = {
        getAll() {
            try {
                return cookieStore.getAll()
            } catch {
                return []  // ← return empty array instead of throwing
            }
        },
        setAll(cookiesToSet) {
            try {
                cookiesToSet.forEach(({ name, value, options }) =>
                    cookieStore.set(name, value, options)
                )
            } catch {
                // Safe to ignore in server components and public routes
            }
        },
    }
    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { cookies: cookieMethods }
    )
}