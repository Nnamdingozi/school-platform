import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
    const { searchParams, origin } = new URL(request.url);
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type') as 'email' | 'recovery' | null;
    const next = searchParams.get('next') ?? '/admin';

    if (!token_hash || !type) {
        return NextResponse.redirect(`${origin}/error?message=Missing+confirmation+parameters`);
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
    });

    if (error) {
        console.error('[confirm] OTP verification error:', error.message);
        return NextResponse.redirect(
            `${origin}/error?message=${encodeURIComponent(error.message)}`
        );
    }

    // Verification succeeded — redirect to dashboard or login
    return NextResponse.redirect(`${origin}${next}`);
}