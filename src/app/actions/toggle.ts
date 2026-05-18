// src/app/api/user/theme/route.ts
//
// PATCH /api/user/theme
// Body: { theme: "dark" | "light" }
//
// Persists the user's theme preference to the Profile table.
// Assumes Profile model has a `theme` field of type String (or an enum).
// If your field is named differently, update the `data` key below.

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient()
        const {
            data: { user },
        } = await supabase.auth.getUser()

        if (!user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await req.json()
        const theme = body?.theme

        if (theme !== 'dark' && theme !== 'light') {
            return NextResponse.json({ error: 'Invalid theme value' }, { status: 400 })
        }

        await prisma.profile.updateMany({
            where: { email: user.email },
            data: {
                // ── IMPORTANT ─────────────────────────────────────────────
                // If your Prisma Profile model does not yet have a `theme`
                // field, add this migration before deploying:
                //
                //   model Profile {
                //     ...
                //     theme  String  @default("light")
                //   }
                //
                // Then run: npx prisma migrate dev --name add_theme_to_profile
                // ──────────────────────────────────────────────────────────
                theme,
            },
        })

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.error('[theme PATCH]', error)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
