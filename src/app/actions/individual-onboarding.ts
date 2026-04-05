// 'use server'

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

import { prisma } from "@/lib/prisma"
import { createClient as createServerSupabase } from "@/lib/supabase/server"
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js"
import { Role } from "@prisma/client"
import { redirect } from "next/navigation"

type CurriculumOption = {
  id: string
  name: string
  yearLabel: string
  termLabel: string
}

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

type OnboardingInput = {
  name: string
  email: string
  password: string
  phone: string | null
  curriculumId: string
}

export async function requireIndividualLearner() {
  const supabase = await createServerSupabase()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect("/login")
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      role: true,
      schoolId: true,
    },
  })

  if (!profile) return null

  if (profile.role !== "INDIVIDUAL_LEARNER") {
    const roleRedirects: Record<string, string> = {
      STUDENT: "/dashboard/student",
      TEACHER: "/dashboard/teacher",
      SCHOOL_ADMIN: "/dashboard/admin",
      SUPER_ADMIN: "/dashboard/super-admin",
      PARENT: "/dashboard/parent",
    }
    redirect(roleRedirects[profile.role] ?? "/dashboard")
  }

 
  if (profile.schoolId) {
    redirect("/dashboard/student")
  }

  return profile
}


export async function getIndividualCurricula(): Promise<ActionResult<CurriculumOption[]>> {
  try {
    const curricula = await prisma.curriculum.findMany({
      where: {
        schoolId: null, // global templates only — not tenant-scoped copies
      },
      select: {
        id: true,
        name: true,
        yearLabel: true,
        termLabel: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    if (curricula.length === 0) {
      return {
        success: false,
        error: "No curricula available at this time. Please try again later.",
      }
    }

    return { success: true, data: curricula }
  } catch (err) {
    console.error("[getIndividualCurricula]", err)
    return {
      success: false,
      error: "Failed to load curricula. Please refresh and try again.",
    }
  }
}

export async function completeIndividualOnboarding(
  input: OnboardingInput
): Promise<ActionResult> {
  const { name, email, password, phone, curriculumId } = input
  const emailNormalized = email.trim().toLowerCase()

  // ── 1. Basic input validation ──────────────
  if (!name?.trim() || name.trim().length < 2) {
    return { success: false, error: "Name must be at least 2 characters." }
  }

  if (!email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailNormalized)) {
    return { success: false, error: "Please enter a valid email address." }
  }

  if (!password || password.length < 8) {
    return { success: false, error: "Password must be at least 8 characters." }
  }

  if (!curriculumId) {
    return { success: false, error: "Please select a curriculum." }
  }

  // ── 2. Verify curriculum exists and is a global template ─
  const curriculum = await prisma.curriculum.findFirst({
    where: {
      id: curriculumId,
      schoolId: null,
    },
    select: {
      id: true,
      name: true,
    },
  })

  if (!curriculum) {
    return {
      success: false,
      error: "Selected curriculum is not available for individual learners.",
    }
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { email: emailNormalized },
    select: { id: true, role: true },
  })

  if (existingProfile) {
    if (existingProfile.role === "INDIVIDUAL_LEARNER") {
      return {
        success: false,
        error: "An account with this email already exists. Please sign in.",
      }
    }
    return {
      success: false,
      error:
        "This email is already associated with a school account. " +
        "Please use a different email or sign in.",
    }
  }

  const supabaseAdmin = createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers()
  const authUserExists = existingAuthUsers?.users?.some(
    (u) => u.email?.toLowerCase() === emailNormalized
  )
  if (authUserExists) {
    return {
      success: false,
      error: "An account with this email already exists.",
    }
  }

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: emailNormalized,
      password,
      email_confirm: false,
      user_metadata: {
        name,
        role: Role.INDIVIDUAL_LEARNER,
      },
    })

  if (authError || !authData.user) {
    if (authError?.message?.includes("already been registered")) {
      return {
        success: false,
        error: "An account with this email already exists.",
      }
    }
    return {
      success: false,
      error: authError?.message ?? "Failed to create account.",
    }
  }

  const userId = authData.user.id

  try {
    await prisma.profile.create({
      data: {
        id: userId,
        email: emailNormalized,
        name,
        role: Role.INDIVIDUAL_LEARNER,
        phone: phone ?? null,
        schoolId: null,
        curriculumId: curriculum.id,
        primaryColor: "#f59e0b",
        secondaryColor: "#1e293b",
      },
    })

    const { error: resendError } = await supabaseAdmin.auth.resend({
      type: "signup",
      email: emailNormalized,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
      },
    })

    if (resendError) {
      console.error(
        "[completeIndividualOnboarding] Confirmation email error:",
        resendError.message
      )
    }

    return { success: true, data: undefined }
  } catch (dbError) {
    console.error("[completeIndividualOnboarding] Prisma create error:", dbError)
    await supabaseAdmin.auth.admin.deleteUser(userId).catch(() => {
      console.error(
        "[completeIndividualOnboarding] Failed to clean up auth user:",
        userId
      )
    })
    return {
      success: false,
      error: "Account setup failed. Please try again.",
    }
  }
}

export async function getIndividualLearnerProfile(): Promise<
  ActionResult<{
    id: string
    name: string | null
    email: string
    primaryColor: string
    secondaryColor: string
    curriculum: {
      id: string
      name: string
      yearLabel: string
      termLabel: string
      subjectLabel: string
    }
  }>
> {
  try {
    const supabase = await createServerSupabase()
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return { success: false, error: "Not authenticated." }
    }

    const profile = await prisma.profile.findUnique({
      where: {
        id: user.id,
        role: "INDIVIDUAL_LEARNER",
        schoolId: null,  
      },
      select: {
        id: true,
        name: true,
        email: true,
        primaryColor: true,
        secondaryColor: true,
        curriculum: {
          select: {
            id: true,
            name: true,
            yearLabel: true,
            termLabel: true,
            subjectLabel: true,
          },
        },
      },
    })

    if (!profile) {
      return {
        success: false,
        error: "Profile not found. Please complete onboarding.",
      }
    }

    return {
      success: true,
      data: {
        ...profile,
        // Fall back to School @default values if 
        // colors were never set on this profile
        primaryColor: profile.primaryColor ?? "#f59e0b",
        secondaryColor: profile.secondaryColor ?? "#1e293b",
      },
    }
  } catch (err) {
    console.error("[getIndividualLearnerProfile]", err)
    return { success: false, error: "Failed to load profile." }
  }
}