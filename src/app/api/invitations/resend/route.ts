// app/api/invitations/resend/route.ts
import { prisma } from '@/lib/prisma';
import { randomBytes } from 'crypto';
import { sendInviteEmail } from '@/lib/email';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { email } = await req.json();

    // Delete old invite and create fresh token
    await prisma.invitation.deleteMany({
        where: { email, acceptedAt: null }
    });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 48);

    const invite = await prisma.invitation.findFirst({
        where: { email },
        orderBy: { createdAt: 'desc' }
    });

    await prisma.invitation.create({
        data: {
            email,
            role: invite!.role,
            schoolId: invite?.schoolId,
            token,
            expiresAt,
            invitedBy: invite!.invitedBy,
        }
    });

    const inviteUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/accept-invite?token=${token}`;
    await sendInviteEmail({ email, inviteUrl, role: invite!.role });

    return NextResponse.json({ success: true });
}