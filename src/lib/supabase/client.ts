// // lib/supabase/client.ts
// import { createBrowserClient } from '@supabase/ssr';

// export function createClient() {
//     return createBrowserClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//     );
// }


import { createBrowserClient } from '@supabase/ssr';

/**
 * Rule 10: Public Browser Client
 * Used only in 'use client' components for real-time or auth-state.
 */
export function createClient() {
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}