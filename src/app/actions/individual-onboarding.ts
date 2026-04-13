'use server'

// import { prisma } from '@/lib/prisma'
// import { createClient } from '@supabase/supabase-js'
// import { Role } from '@prisma/client'
// import { getErrorMessage } from '@/lib/error-handler'

// type IndividualOnboardingData = {
//     name: string
//     email: string
//     password: string
//     phone?: string | null
//     curriculumId: string
// }

// export async function getIndividualCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null },
//             select: {
//                 id: true,
//                 name: true,
//                 yearLabel: true,
//                 termLabel: true,
//             },
//             orderBy: { name: 'asc' },
//         })

//         return { success: true, data: curricula }
//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err), data: [] }
//     }
// }

// export async function completeIndividualOnboarding(data: IndividualOnboardingData) {
//     try {
//         const { name, email, password, phone, curriculumId } = data

//         if (!email?.trim()) {
//             return { success: false as const, error: 'Email is required.' }
//         }
//         if (!password || password.length < 8) {
//             return { success: false as const, error: 'Password must be at least 8 characters.' }
//         }

//         // 1) Ensure curriculum template exists (must not belong to any school)
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: curriculumId },
//             select: { id: true, schoolId: true },
//         })

//         if (!curriculum) {
//             return { success: false as const, error: 'Selected curriculum not found.' }
//         }
//         if (curriculum.schoolId) {
//             return { success: false as const, error: 'Selected curriculum is not a template.' }
//         }

//         // 2) Guard against duplicate profile
//         const existingProfile = await prisma.profile.findUnique({
//             where: { email },
//             select: { id: true },
//         })

//         if (existingProfile) {
//             return { success: false as const, error: 'An account with this email already exists.' }
//         }

//         // 3) Create auth user (no email confirmation screen dependency)
//         const supabaseAdmin = createClient(
//             process.env.NEXT_PUBLIC_SUPABASE_URL!,
//             process.env.SUPABASE_SERVICE_ROLE_KEY!,
//         )

//         const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
//             email,
//             password,
//             email_confirm: true,
//             user_metadata: {
//                 name,
//                 role: Role.INDIVIDUAL_LEARNER,
//             },
//         })

//         if (authError || !authData?.user) {
//             return {
//                 success: false as const,
//                 error: authError?.message ?? 'Failed to create account.',
//             }
//         }

//         // 4) Create profile (no school; curriculum template only)
//         await prisma.profile.create({
//             data: {
//                 id: authData.user.id,
//                 email,
//                 name,
//                 phone: phone ?? null,
//                 role: Role.INDIVIDUAL_LEARNER,
//                 schoolId: null,
//                 curriculumId,
//             },
//         })

//         return { success: true as const }
//     } catch (err: unknown) {
//         console.error('completeIndividualOnboarding error:', err)
//         return { success: false as const, error: getErrorMessage(err) }
//     }
// }


"use server"
// ... existing imports
import { Role } from "@prisma/client"
// Ensure you have this env variable in your .env.local
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

export async function completeIndividualOnboarding(
  input: OnboardingInput
): Promise<ActionResult> {
  // ... (existing validation and curriculum checks)

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // 1. Create the user as UNCONFIRMED
  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: emailNormalized,
      password,
      email_confirm: false, // This is key: prevents auto-login
      user_metadata: {
        name,
        role: Role.INDIVIDUAL_LEARNER,
      },
    })

  if (authError || !authData.user) {
    // ... existing error handling
    return { success: false, error: authError?.message ?? "Auth failed" }
  }

  const userId = authData.user.id

  try {
    // 2. Create the Database Profile
    await prisma.profile.create({
      data: {
        id: userId,
        email: emailNormalized,
        name,
        role: Role.INDIVIDUAL_LEARNER,
        curriculumId: curriculum.id,
        primaryColor: "#f59e0b",
        secondaryColor: "#1e293b",
      },
    })

    // 3. Trigger the confirmation email to our custom /auth/confirm route
    const { error: resendError } = await supabaseAdmin.auth.resend({
      type: "signup",
      email: emailNormalized,
      options: {
        // This MUST match the route we create in Step 2
        emailRedirectTo: `${APP_URL}/confirm`,
      },
    })

    if (resendError) throw resendError

    return { success: true, data: undefined }
  } catch (dbError) {
    // ... existing cleanup logic
    await supabaseAdmin.auth.admin.deleteUser(userId)
    return { success: false, error: "Setup failed. Please try again." }
  }
}