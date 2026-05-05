// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'

// export interface ProfileUpdateInput {
//     name: string
//     phone?: string | null
// }

// /**
//  * Updates the personal details of the currently logged-in user.
//  */
// export async function updatePersonalProfile(data: ProfileUpdateInput) {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()

//         if (authError || !user) {
//             return { success: false, error: 'Authentication required.' }
//         }

//         const updatedProfile = await prisma.profile.update({
//             where: { email: user.email! },
//             data: {
//                 name: data.name,
//                 phone: data.phone,
//             }
//         })

//         // Revalidate all layouts to update the sidebar name instantly
//         revalidatePath('/', 'layout')

//         return { success: true, data: updatedProfile }
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from "@/lib/activitylogger";
import { ActivityType, Role } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProfileUpdateInput {
    name: string
    phone?: string | null
}

// ── Main Action ────────────────────────────────────────────────────────────────

/**
 * UPDATES PERSONAL USER DATA
 * Rule 10: Strictly uses session ID to prevent cross-user modification.
 * Rule 11: Persists system truth and logs the event.
 */
export async function updatePersonalProfile(data: ProfileUpdateInput) {
    try {
        // 1. Verify Session Identity
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: 'Authentication required to modify registry.' }
        }

        // 2. Perform Update using Primary Key (id)
        // Rule 11: We update the profile and return the new state
        const updatedProfile = await prisma.profile.update({
            where: { id: user.id }, // Using UUID for 100% unique match
            data: {
                name: data.name.trim(),
                phone: data.phone?.trim() ?? null,
            }
        });

        // 3. Log Activity (Tier 2 or Tier 3 context handled by schoolId: null/value)
        await logActivity({
            schoolId: updatedProfile.schoolId, // Inherits null for Independent Users
            actorId: updatedProfile.id,
            actorName: updatedProfile.name,
            actorRole: updatedProfile.role,
            type: ActivityType.SETTINGS_UPDATED,
            title: 'Profile Updated',
            description: `User successfully modified their personal contact metadata.`
        });

        // 4. Rule 11: Instant UI Sync
        // Revalidate all layouts to update Name/Avatar in the sidebar instantly
        revalidatePath('/', 'layout');

        return { success: true, data: updatedProfile };

    } catch (err: unknown) {
        console.error("Profile update failure:", getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}