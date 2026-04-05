'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface ProfileUpdateInput {
    name: string
    phone?: string | null
}

/**
 * Updates the personal details of the currently logged-in user.
 */
export async function updatePersonalProfile(data: ProfileUpdateInput) {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return { success: false, error: 'Authentication required.' }
        }

        const updatedProfile = await prisma.profile.update({
            where: { email: user.email! },
            data: {
                name: data.name,
                phone: data.phone,
            }
        })

        // Revalidate all layouts to update the sidebar name instantly
        revalidatePath('/', 'layout')

        return { success: true, data: updatedProfile }
    } catch (err) {
        return { success: false, error: getErrorMessage(err) }
    }
}