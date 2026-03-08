// app/api/invitations/send/route.ts
import { prisma } from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';
import { randomBytes } from 'crypto';
import { sendInviteEmail } from '@/lib/email'; // your email util
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email, role, schoolId } = await req.json();
    const supabase = createClient();

    // Check auth - only admins can invite
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Delete any existing pending invite for this email (allows resend)
    await prisma.invitation.deleteMany({
        where: { email, acceptedAt: null }
    });

    // Create new invite token
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48); // 48 hours

    await prisma.invitation.create({
        data: {
            email,
            role,
            schoolId,
            token,
            expiresAt,
            invitedBy: user.id,
        }
    });

    // Send email with your own link (NOT Supabase invite)
    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;
    await sendInviteEmail({ email, inviteUrl, role });

    return NextResponse.json({ success: true });
}