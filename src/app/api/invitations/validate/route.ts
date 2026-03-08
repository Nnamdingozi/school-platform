// app/api/invitations/validate/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    // 1. Token must be present
    if (!token) {
        return NextResponse.json(
            { valid: false, reason: 'No invite token found in this link.' },
            { status: 400 }
        )
    }

    // 2. Look up invitation
    const invite = await prisma.invitation.findUnique({
        where: { token }
    })

    // 3. Does not exist
    if (!invite) {
        return NextResponse.json(
            { valid: false, reason: 'Invalid invite link.' },
            { status: 404 }
        )
    }

    // 4. Already accepted
    if (invite.acceptedAt) {
        return NextResponse.json(
            { valid: false, reason: 'This invite has already been accepted.' },
            { status: 400 }
        )
    }

    // 5. Expired
    if (invite.expiresAt < new Date()) {
        return NextResponse.json(
            { valid: false, reason: 'This invite link has expired. Please ask your admin to resend.' },
            { status: 400 }
        )
    }

    // 6. Valid — return everything needed by accept route and accept-invite page
    return NextResponse.json({
        valid: true,
        invite: {
            email: invite.email,
            role: invite.role,
            schoolId: invite.schoolId,
            curriculumId: invite.curriculumId,
        }
    })
}