// import { type NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@/lib/supabase/server';

// export async function GET(request: NextRequest) {
//     const { searchParams, origin } = new URL(request.url);
//     const token_hash = searchParams.get('token_hash');
//     const type = searchParams.get('type') as 'email' | 'recovery' | null;
//     const next = searchParams.get('next') ?? '/admin';

//     if (!token_hash || !type) {
//         return NextResponse.redirect(`${origin}/confirmationError?message=Missing+confirmation+parameters`);
//     }

//     const supabase = await createClient();

//     const { error } = await supabase.auth.verifyOtp({
//         type,
//         token_hash,
//     });

//     if (error) {
//         console.error('[confirm] OTP verification error:', error.message);
//         return NextResponse.redirect(
//             `${origin}/confirmationError?message=${encodeURIComponent(error.message)}`
//         );
//     }

//     // Verification succeeded — redirect to dashboard or login
//     return NextResponse.redirect(`${origin}${next}`);
// }


import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@prisma/client';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as 'email' | 'recovery' | null;

    if (!token_hash || !type) {
        return NextResponse.redirect(`${origin}/confirmationError?message=Missing+confirmation+parameters`);
    }

    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
    });

    if (error || !data.user) {
        console.error('[confirm] OTP verification error:', error?.message);
        return NextResponse.redirect(
            `${origin}/confirmationError?message=${encodeURIComponent(error?.message ?? 'Verification failed')}`
        );
    }

    // ── Role-based destination ──────────────────────────────────────────────
    // /student serves BOTH individual learners (no school) and school-invited
    // students (schoolId set) — the split is by role, not by schoolId.
    // Other institutional roles (admin, staff, parent) land elsewhere.
    const profile = await prisma.profile.findUnique({
        where: { id: data.user.id },
        select: { role: true },
    });

    if (!profile) {
        return NextResponse.redirect(`${origin}/login?error=profile_not_found`);
    }

    let destination: string;

    switch (profile.role) {
        case Role.INDIVIDUAL_LEARNER:
        case Role.STUDENT:
            destination = '/student';
            break;
        case Role.PARENT:
            destination = '/parent';
            break;
        default:
            // SCHOOL_ADMIN, SUPER_ADMIN, TEACHER, etc.
            destination = '/admin';
    }

    return NextResponse.redirect(`${origin}${destination}`);
}