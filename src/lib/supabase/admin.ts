// // lib/supabaseClient.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
// const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// if (!supabaseUrl || !supabaseServiceRoleKey) {
//   throw new Error('Missing Supabase URL or Service Role Key in environment variables.');
// }

// // Create a Supabase client for server-side usage (bypasses RLS)
// export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
//   auth: {
//     persistSession: false, // No need for session persistence in server actions
//   },
// });


import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error('Critical Configuration Error: Admin Client Keys missing.');
}

/**
 * Rule 10: Admin Service Client
 * WARNING: This client bypasses Row Level Security.
 * Use ONLY for backend administrative tasks like account deletion.
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
  },
});