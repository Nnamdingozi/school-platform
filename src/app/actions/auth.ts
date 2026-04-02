// // app/actions/auth.ts
// 'use server';

// import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { Role } from '@/generated/prisma/client';

// export async function registerUser(data: {
//     email: string;
//     password: string;
//     name: string;
//     role: Role;
//     schoolId?: string;
//     curriculumId?: string;
// }) {
//     const cookieStore = await cookies();
 
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 get: (name: string) => cookieStore.get(name)?.value,
//                 set: (name: string, value: string, options: CookieOptions) => {
//                     cookieStore.set({ name, value, ...options });
//                 },
//                 remove: (name: string, options: CookieOptions) => { // Corrected
//                     cookieStore.delete({ name, ...options });  // Corrected
//                 },
//             },
//         }
//     );


//     const { data: authData, error } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//         options: {
//             data: {
//                 name: data.name,
//                 role: data.role,           // TEACHER, STUDENT, PARENT etc.
//                 schoolId: data.schoolId,   // provided when admin invites users
//                 curriculumId: data.curriculumId,
//             },
//         },
//     });

//     if (error) return { error: error.message };
//     return { user: authData.user };
// }



// 'use server';

// import { createServerClient } from '@supabase/ssr';
// import { cookies } from 'next/headers';

// import { Role } from "@prisma/client";

// export async function registerUser(data: {
//     email: string;
//     password: string;
//     name: string;
//     role: Role;
//     schoolId?: string;
//     curriculumId?: string;
// }) {
//     const cookieStore = await cookies();

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll: () => cookieStore.getAll(),
//                 setAll: (cookiesToSet) => {
//                     cookiesToSet.forEach(({ name, value, options }) => {
//                         cookieStore.set(name, value, options);
//                     });
//                 },
//             },
//         }
//     );

//     const { data: authData, error } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//         options: {
//             data: {
//                 name: data.name,
//                 role: data.role,
//                 schoolId: data.schoolId,
//                 curriculumId: data.curriculumId,
//             },
//         },
//     });

//     if (error) return { error: error.message };
//     return { user: authData.user };
// }



// 'use server';

// import { createServerClient, type CookieOptions } from '@supabase/ssr'; // Added CookieOptions
// import { cookies } from 'next/headers';
// import { Role } from "@prisma/client";

// export async function registerUser(data: {
//     email: string;
//     password: string;
//     name: string;
//     role: Role;
//     schoolId?: string;
//     curriculumId?: string;
// }) {
//     const cookieStore = await cookies();

// const supabase = createServerClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//     {
//         cookies: {
//             getAll() {
//                 return cookieStore.getAll()
//             },
//             // ✅ Fix: Added explicit types to cookiesToSet and destructuring
//             setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
//                 try {
//                     cookiesToSet.forEach(({ name, value, options }) => {
//                         cookieStore.set(name, value, options)
//                     })
//                 } catch {
//                     // This can be ignored if middleware is handling session refreshes
//                 }
//             },
//         },
//     }
// )
//     const { data: authData, error } = await supabase.auth.signUp({
//         email: data.email,
//         password: data.password,
//         options: {
//             data: {
//                 name: data.name,
//                 role: data.role,
//                 schoolId: data.schoolId,
//                 curriculumId: data.curriculumId,
//             },
//         },
//     });

//     if (error) return { error: error.message };
//     return { user: authData.user };
// }



'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/error-handler'
import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import { logActivity } from '@/lib/activitylogger'

// ── Register ───────────────────────────────────────────────────────────────────
// Used during onboarding — creates Supabase auth user
// The Supabase webhook / trigger handles creating the Profile record
// so we don't need to create it here

export async function registerUser(data: {
    email:        string
    password:     string
    name:         string
    role:         Role
    schoolId?:    string
    curriculumId?: string
}): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: authData, error } = await supabase.auth.signUp({
            email:    data.email,
            password: data.password,
            options: {
                data: {
                    name:         data.name,
                    role:         data.role,
                    schoolId:     data.schoolId    ?? null,
                    curriculumId: data.curriculumId ?? null,
                },
            },
        })

        if (error) {
            console.error('registerUser error:', error.message)
            return { success: false, error: error.message }
        }

        if (!authData.user) {
            return { success: false, error: 'Registration failed — no user returned.' }
        }

        return { success: true }
    } catch (err) {
        console.error('registerUser unexpected error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Login ──────────────────────────────────────────────────────────────────────

export async function loginUser(data: {
    email:    string
    password: string
}): Promise<{ success: boolean; error?: string }> {
    try {
        const supabase = await createClient()

        const { data: authData, error } = await supabase.auth.signInWithPassword({
            email:    data.email,
            password: data.password,
        })

        if (error) {
            console.error('loginUser error:', error.message)
            return { success: false, error: error.message }
        }

        if (!authData.user) {
            return { success: false, error: 'Login failed.' }
        }

        // ✅ Log login activity — fire and forget
        const profile = await prisma.profile.findFirst({
            where:  { email: authData.user.email },
            select: { id: true, name: true, role: true, schoolId: true },
        })

        if (profile?.schoolId) {
            logActivity({
                schoolId:    profile.schoolId,
                actorId:     profile.id,
                actorName:   profile.name,
                actorRole:   profile.role,
                type:        'LOGIN',
                title:       'Logged In',
                description: `${profile.name ?? 'User'} signed in to the platform`,
            }).catch(() => {})
        }

        return { success: true }
    } catch (err) {
        console.error('loginUser unexpected error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Logout ─────────────────────────────────────────────────────────────────────

export async function logoutAction(): Promise<void> {
    try {
        const supabase = await createClient()

        // ✅ Get user before signing out so we can log the activity
        const { data: { user } } = await supabase.auth.getUser()

        if (user?.email) {
            const profile = await prisma.profile.findFirst({
                where:  { email: user.email },
                select: { id: true, name: true, role: true, schoolId: true },
            })

            if (profile?.schoolId) {
                // Log before signing out — fire and forget
                logActivity({
                    schoolId:    profile.schoolId,
                    actorId:     profile.id,
                    actorName:   profile.name,
                    actorRole:   profile.role,
                    type:        'LOGOUT',
                    title:       'Logged Out',
                    description: `${profile.name ?? 'User'} signed out of the platform`,
                }).catch(() => {})
            }
        }

        await supabase.auth.signOut()
    } catch (err) {
        console.error('logoutAction error:', getErrorMessage(err))
    }

    // ✅ Always redirect regardless of errors
    redirect('/login')
}