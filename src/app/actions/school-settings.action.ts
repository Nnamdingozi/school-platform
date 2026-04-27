// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { toTitleCase } from '@/lib/utils/formatters'
// import { revalidatePath } from 'next/cache'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface SchoolProfileInput {
//     name:           string
//     primaryColor:   string
//     secondaryColor: string
// }

// export interface CurriculumLabelsInput {
//     subjectLabel: string
//     termLabel:    string
//     yearLabel:    string
// }

// export interface WhatsAppSettingsInput {
//     whatsappCredits: number
// }

// export interface UpdateTermDatesInput {
//     termId:    string
//     startDate: Date
//     endDate:   Date
// }

// export interface SchoolSettingsData {
//     school: {
//         id:             string
//         name:           string
//         primaryColor:   string
//         secondaryColor: string
//         whatsappCredits: number
//         subscription: {
//             plan:            string
//             status:          string
//             currentPeriodEnd: Date
//         } | null
//     }
//     curriculum: {
//         id:           string
//         name:         string
//         subjectLabel: string
//         termLabel:    string
//         yearLabel:    string
//     } | null
//     terms: {
//         id:          string
//         displayName: string
//         index:       number
//         startDate:   Date | null
//         endDate:     Date | null
//         gradeId:     string
//         grade: {
//             displayName: string
//         }
//     }[]
// }

// interface ActionResult {
//     success: boolean
//     error?:  string
// }

// // ── Auth helper ────────────────────────────────────────────────────────────────

// async function getAuthUser() {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return null
//         return data.user
//     } catch {
//         return null
//     }
// }

// // ── Get All School Settings ────────────────────────────────────────────────────

// export async function getSchoolSettings(
//     schoolId: string
// ): Promise<SchoolSettingsData | null> {
//     try {
//         const [school, terms] = await Promise.all([
//             prisma.school.findUnique({
//                 where:  { id: schoolId },
//                 select: {
//                     id:             true,
//                     name:           true,
//                     primaryColor:   true,
//                     secondaryColor: true,
//                     whatsappCredits: true,
//                     curriculumId:   true,
//                     subscription: {
//                         select: {
//                             plan:            true,
//                             status:          true,
//                             currentPeriodEnd: true,
//                         },
//                     },
//                     curriculum: {
//                         select: {
//                             id:           true,
//                             name:         true,
//                             subjectLabel: true,
//                             termLabel:    true,
//                             yearLabel:    true,
//                         },
//                     },
//                 },
//             }),
//             prisma.term.findMany({
//                 where:   { schoolId },
//                 orderBy: [{ index: 'asc' }],
//                 select: {
//                     id:          true,
//                     displayName: true,
//                     index:       true,
//                     startDate:   true,
//                     endDate:     true,
//                     gradeId:     true,
//                     grade: {
//                         select: { displayName: true },
//                     },
//                 },
//             }),
//         ])

//         if (!school) return null

//         return {
//             school: {
//                 id:              school.id,
//                 name:            school.name,
//                 primaryColor:    school.primaryColor,
//                 secondaryColor:  school.secondaryColor,
//                 whatsappCredits: school.whatsappCredits,
//                 subscription:    school.subscription ?? null,
//             },
//             curriculum: school.curriculum ?? null,
//             terms,
//         }
//     } catch (err) {
//         console.error('getSchoolSettings error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Update School Profile ──────────────────────────────────────────────────────

// export async function updateSchoolProfile(
//     schoolId: string,
//     input:    SchoolProfileInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (!input.name.trim()) {
//             return { success: false, error: 'School name is required.' }
//         }

//         if (!/^#[0-9A-Fa-f]{6}$/.test(input.primaryColor)) {
//             return { success: false, error: 'Invalid primary color hex value.' }
//         }

//         if (!/^#[0-9A-Fa-f]{6}$/.test(input.secondaryColor)) {
//             return { success: false, error: 'Invalid secondary color hex value.' }
//         }

//         await prisma.school.update({
//             where: { id: schoolId },
//             data: {
//                 name:           toTitleCase(input.name.trim()),
//                 primaryColor:   input.primaryColor,
//                 secondaryColor: input.secondaryColor,
//             },
//         })

//         revalidatePath('/admin')
//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateSchoolProfile error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Update Curriculum Labels ───────────────────────────────────────────────────

// export async function updateCurriculumLabels(
//     curriculumId: string,
//     input:        CurriculumLabelsInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (!input.subjectLabel.trim() || !input.termLabel.trim() || !input.yearLabel.trim()) {
//             return { success: false, error: 'All labels are required.' }
//         }

//         await prisma.curriculum.update({
//             where: { id: curriculumId },
//             data: {
//                 subjectLabel: toTitleCase(input.subjectLabel.trim()),
//                 termLabel:    toTitleCase(input.termLabel.trim()),
//                 yearLabel:    toTitleCase(input.yearLabel.trim()),
//             },
//         })

//         revalidatePath('/admin')
//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateCurriculumLabels error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Update Single Term Dates ───────────────────────────────────────────────────

// export async function updateTermDates(
//     input: UpdateTermDatesInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (input.startDate >= input.endDate) {
//             return { success: false, error: 'Start date must be before end date.' }
//         }

//         const term = await prisma.term.findUnique({
//             where:  { id: input.termId },
//             select: { id: true },
//         })

//         if (!term) return { success: false, error: 'Term not found.' }

//         await prisma.term.update({
//             where: { id: input.termId },
//             data:  { startDate: input.startDate, endDate: input.endDate },
//         })

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Bulk Update Term Dates ─────────────────────────────────────────────────────

// export async function bulkUpdateTermDates(
//     updates: UpdateTermDatesInput[]
// ): Promise<{ success: boolean; error?: string; failedTermIds?: string[] }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (updates.length === 0) {
//             return { success: false, error: 'No updates provided.' }
//         }

//         const invalid = updates.filter(u => u.startDate >= u.endDate)
//         if (invalid.length > 0) {
//             return {
//                 success:       false,
//                 error:         `${invalid.length} term(s) have invalid date ranges.`,
//                 failedTermIds: invalid.map(u => u.termId),
//             }
//         }

//         const results = await Promise.allSettled(
//             updates.map(u =>
//                 prisma.term.update({
//                     where: { id: u.termId },
//                     data:  { startDate: u.startDate, endDate: u.endDate },
//                 })
//             )
//         )

//         const failed = results
//             .map((r, i) => ({ r, termId: updates[i].termId }))
//             .filter(({ r }) => r.status === 'rejected')
//             .map(({ termId }) => termId)

//         if (failed.length > 0) {
//             return {
//                 success:       false,
//                 error:         `${failed.length} of ${updates.length} term(s) failed to update.`,
//                 failedTermIds: failed,
//             }
//         }

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('bulkUpdateTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Clear Term Dates ───────────────────────────────────────────────────────────

// export async function clearTermDates(
//     termId: string
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         await prisma.term.update({
//             where: { id: termId },
//             data:  { startDate: null, endDate: null },
//         })

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('clearTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Update WhatsApp Credits ────────────────────────────────────────────────────

// export async function updateWhatsAppCredits(
//     schoolId: string,
//     input:    WhatsAppSettingsInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (input.whatsappCredits < 0) {
//             return { success: false, error: 'Credits cannot be negative.' }
//         }

//         await prisma.school.update({
//             where: { id: schoolId },
//             data:  { whatsappCredits: input.whatsappCredits },
//         })

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateWhatsAppCredits error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


// // Add or verify this in your actions file
// export async function updateGlobalTermDates(
//     schoolId: string, 
//     index: number, 
//     startDate: Date, 
//     endDate: Date
// ) {
//     try {
//         await prisma.term.updateMany({
//             where: { 
//                 schoolId,
//                 index: index // 1, 2, or 3
//             },
//             data: { startDate, endDate }
//         });
//         revalidatePath('/admin/settings');
//         return { success: true };
//     } catch (err) {
//         return { success: false, error: "Failed to update global calendar." };
//     }
// }


// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface SchoolProfileInput {
//     name:           string
//     primaryColor:   string
//     secondaryColor: string
// }

// export interface CurriculumLabelsInput {
//     subjectLabel: string
//     termLabel:    string
//     yearLabel:    string
// }

// export interface WhatsAppSettingsInput {
//     whatsappCredits: number
// }

// export interface UpdateTermDatesInput {
//     termId:    string
//     startDate: Date
//     endDate:   Date
// }

// export interface SchoolSettingsData {
//     school: {
//         id:              string
//         name:            string
//         primaryColor:    string
//         secondaryColor:  string
//         whatsappCredits: number
//         subscription: {
//             plan:             string
//             status:           string
//             currentPeriodEnd: Date
//         } | null
//     }
//     curriculum: {
//         id:           string
//         name:         string
//         subjectLabel: string
//         termLabel:    string
//         yearLabel:    string
//     } | null
//     terms: {
//         id:          string
//         displayName: string
//         index:       number
//         startDate:   Date | null
//         endDate:     Date | null
//         gradeId:     string
//         grade: {
//             displayName: string
//         }
//     }[]
// }

// interface ActionResult {
//     success: boolean
//     error?:  string
// }

// // ── Auth helper ────────────────────────────────────────────────────────────────

// async function getAuthUser() {
//     try {
//         const supabase = await createClient()
//         const { data, error } = await supabase.auth.getUser()
//         if (error || !data.user) return null
//         return data.user
//     } catch {
//         return null
//     }
// }

// // ── Get School Settings ────────────────────────────────────────────────────────

// export async function getSchoolSettings(
//     schoolId: string
// ): Promise<SchoolSettingsData | null> {
//     try {
//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: {
//                 id:              true,
//                 name:            true,
//                 primaryColor:    true,
//                 secondaryColor:  true,
//                 whatsappCredits: true,
//                 curriculumId:    true,
//                 subscription: {
//                     select: {
//                         plan:             true,
//                         status:           true,
//                         currentPeriodEnd: true,
//                     },
//                 },
//                 curriculum: {
//                     select: {
//                         id:           true,
//                         name:         true,
//                         subjectLabel: true,
//                         termLabel:    true,
//                         yearLabel:    true,
//                     },
//                 },
//             },
//         })

//         if (!school) return null

//         // ✅ Terms are linked to grades which belong to the curriculum
//         // Term.schoolId is nullable — seeded terms have schoolId: null
//         // So we must find terms via grade → curriculumId, not via schoolId directly
//         const grades = await prisma.grade.findMany({
//             where:  { curriculumId: school.curriculumId },
//             select: { id: true },
//         })

//         const gradeIds = grades.map(g => g.id)

//         // Fetch all terms for these grades
//         const allTerms = await prisma.term.findMany({
//             where: {
//                 gradeId: { in: gradeIds },
//             },
//             orderBy: [
//                 { grade: { level: 'asc' } },
//                 { index:  'asc'          },
//             ],
//             select: {
//                 id:          true,
//                 displayName: true,
//                 index:       true,
//                 startDate:   true,
//                 endDate:     true,
//                 gradeId:     true,
//                 grade: {
//                     select: { displayName: true },
//                 },
//             },
//         })

//         return {
//             school: {
//                 id:              school.id,
//                 name:            school.name,
//                 primaryColor:    school.primaryColor,
//                 secondaryColor:  school.secondaryColor,
//                 whatsappCredits: school.whatsappCredits,
//                 subscription:    school.subscription ?? null,
//             },
//             curriculum: school.curriculum ?? null,
//             terms:      allTerms,
//         }
//     } catch (err) {
//         console.error('getSchoolSettings error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Update School Profile ──────────────────────────────────────────────────────

// export async function updateSchoolProfile(
//     schoolId: string,
//     input:    SchoolProfileInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (!input.name.trim()) {
//             return { success: false, error: 'School name is required.' }
//         }

//         if (!/^#[0-9A-Fa-f]{6}$/.test(input.primaryColor)) {
//             return { success: false, error: 'Invalid primary color.' }
//         }

//         if (!/^#[0-9A-Fa-f]{6}$/.test(input.secondaryColor)) {
//             return { success: false, error: 'Invalid secondary color.' }
//         }

//         await prisma.school.update({
//             where: { id: schoolId },
//             data: {
//                 name:           input.name.trim(),
//                 primaryColor:   input.primaryColor,
//                 secondaryColor: input.secondaryColor,
//             },
//         })

//         revalidatePath('/admin')
//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateSchoolProfile error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Update Curriculum Labels ───────────────────────────────────────────────────

// export async function updateCurriculumLabels(
//     curriculumId: string,
//     input:        CurriculumLabelsInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (!input.subjectLabel.trim() || !input.termLabel.trim() || !input.yearLabel.trim()) {
//             return { success: false, error: 'All labels are required.' }
//         }

//         await prisma.curriculum.update({
//             where: { id: curriculumId },
//             data: {
//                 subjectLabel: input.subjectLabel.trim(),
//                 termLabel:    input.termLabel.trim(),
//                 yearLabel:    input.yearLabel.trim(),
//             },
//         })

//         revalidatePath('/admin')
//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateCurriculumLabels error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Update Global Term Dates (all grades for a given index) ───────────────────
// // Terms are per-grade but admin sets them globally by index.
// // This updates ALL terms with the given index across all grades in the curriculum.

// export async function updateGlobalTermDates(
//     schoolId:  string,
//     termIndex: number,
//     startDate: Date,
//     endDate:   Date,
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (startDate >= endDate) {
//             return { success: false, error: 'Start date must be before end date.' }
//         }

//         // Get school's curriculumId
//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { curriculumId: true },
//         })

//         if (!school) return { success: false, error: 'School not found.' }

//         // Get all grades for this curriculum
//         const grades = await prisma.grade.findMany({
//             where:  { curriculumId: school.curriculumId },
//             select: { id: true },
//         })

//         if (!grades.length) return { success: false, error: 'No grades found.' }

//         const gradeIds = grades.map(g => g.id)

//         // ✅ Update ALL terms with matching index across ALL grades
//         const result = await prisma.term.updateMany({
//             where: {
//                 index:   termIndex,
//                 gradeId: { in: gradeIds },
//             },
//             data: { startDate, endDate },
//         })

//         if (result.count === 0) {
//             return { success: false, error: `No terms found with index ${termIndex}.` }
//         }

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateGlobalTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Update Single Term Dates ───────────────────────────────────────────────────

// export async function updateTermDates(
//     input: UpdateTermDatesInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (input.startDate >= input.endDate) {
//             return { success: false, error: 'Start date must be before end date.' }
//         }

//         await prisma.term.update({
//             where: { id: input.termId },
//             data:  { startDate: input.startDate, endDate: input.endDate },
//         })

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Bulk Update Term Dates ─────────────────────────────────────────────────────

// export async function bulkUpdateTermDates(
//     updates: UpdateTermDatesInput[]
// ): Promise<{ success: boolean; error?: string; failedTermIds?: string[] }> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (!updates.length) return { success: false, error: 'No updates provided.' }

//         const invalid = updates.filter(u => u.startDate >= u.endDate)
//         if (invalid.length > 0) {
//             return {
//                 success:       false,
//                 error:         `${invalid.length} term(s) have invalid date ranges.`,
//                 failedTermIds: invalid.map(u => u.termId),
//             }
//         }

//         const results = await Promise.allSettled(
//             updates.map(u =>
//                 prisma.term.update({
//                     where: { id: u.termId },
//                     data:  { startDate: u.startDate, endDate: u.endDate },
//                 })
//             )
//         )

//         const failed = results
//             .map((r, i) => ({ r, termId: updates[i].termId }))
//             .filter(({ r }) => r.status === 'rejected')
//             .map(({ termId }) => termId)

//         if (failed.length > 0) {
//             return {
//                 success:       false,
//                 error:         `${failed.length} of ${updates.length} term(s) failed.`,
//                 failedTermIds: failed,
//             }
//         }

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('bulkUpdateTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Clear Term Dates ───────────────────────────────────────────────────────────

// export async function clearTermDates(
//     termId: string
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         await prisma.term.update({
//             where: { id: termId },
//             data:  { startDate: null, endDate: null },
//         })

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('clearTermDates error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Update WhatsApp Credits ────────────────────────────────────────────────────

// export async function updateWhatsAppCredits(
//     schoolId: string,
//     input:    WhatsAppSettingsInput
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         if (input.whatsappCredits < 0) {
//             return { success: false, error: 'Credits cannot be negative.' }
//         }

//         await prisma.school.update({
//             where: { id: schoolId },
//             data:  { whatsappCredits: input.whatsappCredits },
//         })

//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('updateWhatsAppCredits error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Reset School Colors ────────────────────────────────────────────────────────

// export async function resetSchoolColors(
//     schoolId: string
// ): Promise<ActionResult> {
//     try {
//         const user = await getAuthUser()
//         if (!user) return { success: false, error: 'Unauthorized.' }

//         await prisma.school.update({
//             where: { id: schoolId },
//             data: {
//                 primaryColor:   '#f59e0b',
//                 secondaryColor: '#1e293b',
//             },
//         })

//         revalidatePath('/admin')
//         revalidatePath('/admin/settings')

//         return { success: true }
//     } catch (err) {
//         console.error('resetSchoolColors error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Role, ActivityType, Prisma } from '@prisma/client'
import { logActivity } from "@/lib/activitylogger";

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
        id:              string
        name:            string
        whatsappCredits: number
        subscription: {
            plan:             string
            status:           string
            currentPeriodEnd: Date
        } | null
    }
    curriculum: {
        id:           string
        name:         string
        subjectLabel: string
        termLabel:    string
        yearLabel:    string
        isGlobal:     boolean
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

async function getAuthenticatedActor() {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null
        return await prisma.profile.findUnique({
            where: { id: user.id },
            select: { id: true, schoolId: true, role: true, name: true }
        })
    } catch {
        return null
    }
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * FETCH INSTITUTIONAL SETTINGS
 * Rule 7: Resolves Curriculum and Terms within the school's context.
 */
export async function getSchoolSettings(
    schoolId: string
): Promise<SchoolSettingsData | null> {
    try {
        const school = await prisma.school.findUnique({
            where:  { id: schoolId },
            include: {
                subscription: {
                    select: { plan: true, status: true, currentPeriodEnd: true },
                },
                curriculum: {
                    select: { id: true, name: true, subjectLabel: true, termLabel: true, yearLabel: true, schoolId: true },
                },
            },
        })

        if (!school) return null

        // Rule 7: Find terms belonging to this school across all its grades
        const schoolTerms = await prisma.term.findMany({
            where: { schoolId: school.id },
            orderBy: [
                { grade: { level: 'asc' } },
                { index:  'asc'          },
            ],
            include: { grade: { select: { displayName: true } } }
        })

        return {
            school: {
                id:              school.id,
                name:            school.name,
                whatsappCredits: school.whatsappCredits,
                subscription:    school.subscription,
            },
            curriculum: school.curriculum ? {
                ...school.curriculum,
                isGlobal: school.curriculum.schoolId === null
            } : null,
            terms: schoolTerms,
        }
    } catch (err: unknown) {
        console.error('getSchoolSettings error:', getErrorMessage(err))
        return null
    }
}

// ── Mutations ──────────────────────────────────────────────────────────────────

/**
 * UPDATE SCHOOL PROFILE
 * Rule 5: Strict isolation. Actor must belong to the school.
 */
export async function updateSchoolProfile(
    schoolId: string,
    input:    SchoolProfileInput
): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || actor.schoolId !== schoolId || actor.role !== Role.SCHOOL_ADMIN) {
            return { success: false, error: 'Unauthorized institutional access.' }
        }

        await prisma.school.update({
            where: { id: schoolId },
            data: { name: input.name.trim() }
        })

        // Branding logic: Update the colors on the admin's profile (as per schema)
        await prisma.profile.update({
            where: { id: actor.id },
            data: {
                primaryColor: input.primaryColor,
                secondaryColor: input.secondaryColor,
            }
        })

        await logActivity({
            schoolId: schoolId,
            actorId: actor.id,
            actorRole: actor.role,
            type: ActivityType.SETTINGS_UPDATED,
            title: 'School Profile Updated',
            description: `Modified name and branding colors for the workspace.`
        })

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}

/**
 * UPDATE CURRICULUM LABELS
 * Rule 4: Admin cannot modify GLOBAL labels.
 * Only allowed if the curriculum is school-owned.
 */
export async function updateCurriculumLabels(
    curriculumId: string,
    input:        CurriculumLabelsInput
): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || actor.role !== Role.SCHOOL_ADMIN) return { success: false, error: 'Unauthorized.' }

        const curriculum = await prisma.curriculum.findUnique({ where: { id: curriculumId } })
        
        if (!curriculum || curriculum.schoolId !== actor.schoolId) {
            return { success: false, error: 'Access Denied: Cannot modify Global Curriculum Core. Contact support.' }
        }

        await prisma.curriculum.update({
            where: { id: curriculumId },
            data: {
                subjectLabel: input.subjectLabel.trim(),
                termLabel:    input.termLabel.trim(),
                yearLabel:    input.yearLabel.trim(),
            },
        })

        await logActivity({
            schoolId: actor.schoolId!,
            actorId: actor.id,
            actorRole: actor.role,
            type: ActivityType.SETTINGS_UPDATED,
            title: 'Curriculum Labels Updated',
            description: `Modified terminology for subjects, terms, and academic years.`
        })

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}

/**
 * SYNC INSTITUTIONAL TERM DATES
 * Rule 11: Transactional sync for school terms only.
 */
export async function syncInstitutionalTermDates(
    schoolId:  string,
    termIndex: number,
    startDate: Date,
    endDate:   Date,
): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || actor.schoolId !== schoolId || actor.role !== Role.SCHOOL_ADMIN) {
            return { success: false, error: 'Unauthorized.' }
        }

        if (startDate >= endDate) throw new Error("Timeline error: Start must precede End.");

        const result = await prisma.term.updateMany({
            where: {
                schoolId: schoolId, // Rule 5: Only modify institutional copies
                index: termIndex,
            },
            data: { startDate, endDate },
        })

        await logActivity({
            schoolId: schoolId,
            actorId: actor.id,
            actorRole: actor.role,
            type: ActivityType.TERM_DATES_UPDATED,
            title: 'Institutional Calendar Sync',
            description: `Updated all Term ${termIndex} dates across school grades.`
        })

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}

/**
 * UPDATE SPECIFIC TERM DATE
 */
export async function updateTermDates(
    input: UpdateTermDatesInput
): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || actor.role !== Role.SCHOOL_ADMIN) return { success: false, error: 'Unauthorized.' }

        const term = await prisma.term.findUnique({ where: { id: input.termId } })
        if (!term || term.schoolId !== actor.schoolId) {
            return { success: false, error: 'Access Denied: Record is part of Global Core.' }
        }

        await prisma.term.update({
            where: { id: input.termId },
            data:  { startDate: input.startDate, endDate: input.endDate },
        })

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}

/**
 * UPDATE WHATSAPP CREDITS (SUPER_ADMIN ONLY)
 * Rule 10: Prevents school admins from adding their own credits.
 */
export async function updateWhatsAppCredits(
    schoolId: string,
    input:    WhatsAppSettingsInput
): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || actor.role !== Role.SUPER_ADMIN) {
            return { success: false, error: 'Unauthorized: Billing modification restricted to Super Admin.' }
        }

        await prisma.school.update({
            where: { id: schoolId },
            data:  { whatsappCredits: input.whatsappCredits },
        })

        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}

/**
 * RESET SCHOOL COLORS
 */
export async function resetSchoolColors(
    schoolId: string
): Promise<ActionResult> {
    try {
        const actor = await getAuthenticatedActor()
        if (!actor || actor.schoolId !== schoolId || actor.role !== Role.SCHOOL_ADMIN) {
            return { success: false, error: 'Unauthorized.' }
        }

        await prisma.profile.update({
            where: { id: actor.id },
            data: {
                primaryColor:   '#f59e0b',
                secondaryColor: '#1e293b',
            },
        })

        revalidatePath('/admin/settings')
        return { success: true }
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) }
    }
}