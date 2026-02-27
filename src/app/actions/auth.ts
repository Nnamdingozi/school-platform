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



'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Role } from '@/generated/prisma/client';

export async function registerUser(data: {
    email: string;
    password: string;
    name: string;
    role: Role;
    schoolId?: string;
    curriculumId?: string;
}) {
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

    const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                name: data.name,
                role: data.role,
                schoolId: data.schoolId,
                curriculumId: data.curriculumId,
            },
        },
    });

    if (error) return { error: error.message };
    return { user: authData.user };
}