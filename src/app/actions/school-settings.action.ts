'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { toTitleCase } from '@/lib/utils/formatters'
import { revalidatePath } from 'next/cache'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SchoolProfileInput {
    name:           string
    primaryColor:   string
    secondaryColor: string
}

export interface CurriculumLabelsInput {
    subjectLabel: string
    termLabel:    string
    yearLabel:    string
}

export interface WhatsAppSettingsInput {
    whatsappCredits: number
}

export interface UpdateTermDatesInput {
    termId:    string
    startDate: Date
    endDate:   Date
}

export interface SchoolSettingsData {
    school: {
        id:             string
        name:           string
        primaryColor:   string
        secondaryColor: string
        whatsappCredits: number
        subscription: {
            plan:            string
            status:          string
            currentPeriodEnd: Date
        } | null
    }
    curriculum: {
        id:           string
        name:         string
        subjectLabel: string
        termLabel:    string
        yearLabel:    string
    } | null
    terms: {
        id:          string
        displayName: string
        index:       number
        startDate:   Date | null
        endDate:     Date | null
        gradeId:     string
        grade: {
            displayName: string
        }
    }[]
}

interface ActionResult {
    success: boolean
    error?:  string
}

// ── Auth helper ────────────────────────────────────────────────────────────────

async function getAuthUser() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase.auth.getUser()
        if (error || !data.user) return null
        return data.user
    } catch {
        return null
    }
}

// ── Get All School Settings ────────────────────────────────────────────────────

export async function getSchoolSettings(
    schoolId: string
): Promise<SchoolSettingsData | null> {
    try {
        const [school, terms] = await Promise.all([
            prisma.school.findUnique({
                where:  { id: schoolId },
                select: {
                    id:             true,
                    name:           true,
                    primaryColor:   true,
                    secondaryColor: true,
                    whatsappCredits: true,
                    curriculumId:   true,
                    subscription: {
                        select: {
                            plan:            true,
                            status:          true,
                            currentPeriodEnd: true,
                        },
                    },
                    curriculum: {
                        select: {
                            id:           true,
                            name:         true,
                            subjectLabel: true,
                            termLabel:    true,
                            yearLabel:    true,
                        },
                    },
                },
            }),
            prisma.term.findMany({
                where:   { schoolId },
                orderBy: [{ index: 'asc' }],
                select: {
                    id:          true,
                    displayName: true,
                    index:       true,
                    startDate:   true,
                    endDate:     true,
                    gradeId:     true,
                    grade: {
                        select: { displayName: true },
                    },
                },
            }),
        ])

        if (!school) return null

        return {
            school: {
                id:              school.id,
                name:            school.name,
                primaryColor:    school.primaryColor,
                secondaryColor:  school.secondaryColor,
                whatsappCredits: school.whatsappCredits,
                subscription:    school.subscription ?? null,
            },
            curriculum: school.curriculum ?? null,
            terms,
        }
    } catch (err) {
        console.error('getSchoolSettings error:', getErrorMessage(err))
        return null
    }
}

// ── Update School Profile ──────────────────────────────────────────────────────

export async function updateSchoolProfile(
    schoolId: string,
    input:    SchoolProfileInput
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (!input.name.trim()) {
            return { success: false, error: 'School name is required.' }
        }

        if (!/^#[0-9A-Fa-f]{6}$/.test(input.primaryColor)) {
            return { success: false, error: 'Invalid primary color hex value.' }
        }

        if (!/^#[0-9A-Fa-f]{6}$/.test(input.secondaryColor)) {
            return { success: false, error: 'Invalid secondary color hex value.' }
        }

        await prisma.school.update({
            where: { id: schoolId },
            data: {
                name:           toTitleCase(input.name.trim()),
                primaryColor:   input.primaryColor,
                secondaryColor: input.secondaryColor,
            },
        })

        revalidatePath('/admin')
        revalidatePath('/admin/settings')

        return { success: true }
    } catch (err) {
        console.error('updateSchoolProfile error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Update Curriculum Labels ───────────────────────────────────────────────────

export async function updateCurriculumLabels(
    curriculumId: string,
    input:        CurriculumLabelsInput
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (!input.subjectLabel.trim() || !input.termLabel.trim() || !input.yearLabel.trim()) {
            return { success: false, error: 'All labels are required.' }
        }

        await prisma.curriculum.update({
            where: { id: curriculumId },
            data: {
                subjectLabel: toTitleCase(input.subjectLabel.trim()),
                termLabel:    toTitleCase(input.termLabel.trim()),
                yearLabel:    toTitleCase(input.yearLabel.trim()),
            },
        })

        revalidatePath('/admin')
        revalidatePath('/admin/settings')

        return { success: true }
    } catch (err) {
        console.error('updateCurriculumLabels error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Update Single Term Dates ───────────────────────────────────────────────────

export async function updateTermDates(
    input: UpdateTermDatesInput
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (input.startDate >= input.endDate) {
            return { success: false, error: 'Start date must be before end date.' }
        }

        const term = await prisma.term.findUnique({
            where:  { id: input.termId },
            select: { id: true },
        })

        if (!term) return { success: false, error: 'Term not found.' }

        await prisma.term.update({
            where: { id: input.termId },
            data:  { startDate: input.startDate, endDate: input.endDate },
        })

        revalidatePath('/admin/settings')

        return { success: true }
    } catch (err) {
        console.error('updateTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Bulk Update Term Dates ─────────────────────────────────────────────────────

export async function bulkUpdateTermDates(
    updates: UpdateTermDatesInput[]
): Promise<{ success: boolean; error?: string; failedTermIds?: string[] }> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (updates.length === 0) {
            return { success: false, error: 'No updates provided.' }
        }

        const invalid = updates.filter(u => u.startDate >= u.endDate)
        if (invalid.length > 0) {
            return {
                success:       false,
                error:         `${invalid.length} term(s) have invalid date ranges.`,
                failedTermIds: invalid.map(u => u.termId),
            }
        }

        const results = await Promise.allSettled(
            updates.map(u =>
                prisma.term.update({
                    where: { id: u.termId },
                    data:  { startDate: u.startDate, endDate: u.endDate },
                })
            )
        )

        const failed = results
            .map((r, i) => ({ r, termId: updates[i].termId }))
            .filter(({ r }) => r.status === 'rejected')
            .map(({ termId }) => termId)

        if (failed.length > 0) {
            return {
                success:       false,
                error:         `${failed.length} of ${updates.length} term(s) failed to update.`,
                failedTermIds: failed,
            }
        }

        revalidatePath('/admin/settings')

        return { success: true }
    } catch (err) {
        console.error('bulkUpdateTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Clear Term Dates ───────────────────────────────────────────────────────────

export async function clearTermDates(
    termId: string
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        await prisma.term.update({
            where: { id: termId },
            data:  { startDate: null, endDate: null },
        })

        revalidatePath('/admin/settings')

        return { success: true }
    } catch (err) {
        console.error('clearTermDates error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Update WhatsApp Credits ────────────────────────────────────────────────────

export async function updateWhatsAppCredits(
    schoolId: string,
    input:    WhatsAppSettingsInput
): Promise<ActionResult> {
    try {
        const user = await getAuthUser()
        if (!user) return { success: false, error: 'Unauthorized.' }

        if (input.whatsappCredits < 0) {
            return { success: false, error: 'Credits cannot be negative.' }
        }

        await prisma.school.update({
            where: { id: schoolId },
            data:  { whatsappCredits: input.whatsappCredits },
        })

        revalidatePath('/admin/settings')

        return { success: true }
    } catch (err) {
        console.error('updateWhatsAppCredits error:', getErrorMessage(err))
        return { success: false, error: getErrorMessage(err) }
    }
}