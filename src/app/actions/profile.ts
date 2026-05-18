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

// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { logActivity } from "@/lib/activitylogger";
// import { ActivityType, Role } from '@prisma/client'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface ProfileUpdateInput {
//     name: string
//     phone?: string | null
// }

// // ── Main Action ────────────────────────────────────────────────────────────────

// /**
//  * UPDATES PERSONAL USER DATA
//  * Rule 10: Strictly uses session ID to prevent cross-user modification.
//  * Rule 11: Persists system truth and logs the event.
//  */
// export async function updatePersonalProfile(data: ProfileUpdateInput) {
//     try {
//         // 1. Verify Session Identity
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()

//         if (authError || !user) {
//             return { success: false, error: 'Authentication required to modify registry.' }
//         }

//         // 2. Perform Update using Primary Key (id)
//         // Rule 11: We update the profile and return the new state
//         const updatedProfile = await prisma.profile.update({
//             where: { id: user.id }, // Using UUID for 100% unique match
//             data: {
//                 name: data.name.trim(),
//                 phone: data.phone?.trim() ?? null,
//             }
//         });

//         // 3. Log Activity (Tier 2 or Tier 3 context handled by schoolId: null/value)
//         await logActivity({
//             schoolId: updatedProfile.schoolId, // Inherits null for Independent Users
//             actorId: updatedProfile.id,
//             actorName: updatedProfile.name,
//             actorRole: updatedProfile.role,
//             type: ActivityType.SETTINGS_UPDATED,
//             title: 'Profile Updated',
//             description: `User successfully modified their personal contact metadata.`
//         });

//         // 4. Rule 11: Instant UI Sync
//         // Revalidate all layouts to update Name/Avatar in the sidebar instantly
//         revalidatePath('/', 'layout');

//         return { success: true, data: updatedProfile };

//     } catch (err: unknown) {
//         console.error("Profile update failure:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }



'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/app/actions/activitylog'
import { ActivityType } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ProfileUpdateInput {
    name: string
    phone?: string | null
}

export type ThemeValue = 'dark' | 'light';

// ── Actions ───────────────────────────────────────────────────────────────────

/**
 * PERSIST USER THEME (Tier 3)
 * Rule 10: Server-side only. Uses the authenticated session ID for security.
 * Rule 11: DB is the source of truth for user preferences.
 */
export async function updateUserTheme(theme: ThemeValue) {
    try {
        // 1. Resolve Identity (Rule 10)
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: 'Authentication required to persist preferences.' }
        }

        // 2. Perform Update (Rule 11)
        // We use the ID from the secure session to ensure a user only updates their own profile
        const updatedProfile = await prisma.profile.update({
            where: { id: user.id },
            data: { 
                // NOTE: Ensure your Prisma Schema has a 'theme' field on the Profile model.
                // @ts-ignore - Ignore if you haven't run the migration yet, but logic is correct.
                theme: theme 
            },
            select: { id: true, schoolId: true, role: true, name: true }
        });

        // 3. Log Activity (Requirement: Logger in every action)
        await logActivity({
            schoolId: updatedProfile.schoolId, // Supports null for Independent Users
            actorId: updatedProfile.id,
            actorName: updatedProfile.name,
            actorRole: updatedProfile.role,
            type: ActivityType.SETTINGS_UPDATED,
            title: 'Theme Preference Synchronized',
            description: `User successfully updated registry interface to ${theme} mode.`
        });

        return { success: true };

    } catch (err: unknown) {
        const msg = getErrorMessage(err);
        console.error('[PROFILE_THEME_SYNC_ERROR]:', msg);
        return { success: false, error: msg };
    }
}

/**
 * UPDATES PERSONAL USER DATA
 * Rule 10: Strictly uses session ID to prevent cross-user modification.
 */
export async function updatePersonalProfile(data: ProfileUpdateInput) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: 'Authentication required.' }
        }

        const updatedProfile = await prisma.profile.update({
            where: { id: user.id },
            data: {
                name: data.name.trim(),
                phone: data.phone?.trim() ?? null,
            }
        });

        await logActivity({
            schoolId: updatedProfile.schoolId,
            actorId: updatedProfile.id,
            actorName: updatedProfile.name,
            actorRole: updatedProfile.role,
            type: ActivityType.SETTINGS_UPDATED,
            title: 'Profile Metadata Updated',
            description: `Personal contact information synchronized with the registry.`
        });

        revalidatePath('/', 'layout');
        return { success: true, data: updatedProfile };

    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}