// "use server";

// import { prisma } from "@/lib/prisma";
// import { supabaseAdmin } from "@/lib/supabase/admin";
// import { Role } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";

// // ─── GET CURRICULA ────────────────────────────────────────────────────────────

// type CurriculumRow = {
//     id: string;
//     name: string;
//     yearLabel: string | null;
//     termLabel: string | null;
// };

// export async function getCurricula(): Promise<{
//     success: boolean;
//     data: CurriculumRow[];
//     error?: string;
// }> {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null },
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: "asc" },
//         });
//         return { success: true, data: curricula };
//     } catch (err) {
//         // Fix: don't reference 'curricula' here — it's out of scope in catch
//         return { success: false, data: [], error: getErrorMessage(err) };
//     }
// }

// // ─── REGISTER INDIVIDUAL LEARNER ──────────────────────────────────────────────

// export async function registerIndividualLearner(data: {
//     name: string;
//     email: string;
//     password: string;
//     curriculumId: string;
// }): Promise<{ success: boolean; error?: string }> {
//     try {
//         const { data: { users }, error: listError } =
//             await supabaseAdmin.auth.admin.listUsers();

//         if (listError) throw new Error("Identity registry unreachable.");

//         const existingAuthUser = users.find(
//             (u) => u.email?.toLowerCase() === data.email.toLowerCase()
//         );

//         let userId: string;

//         if (existingAuthUser) {
//             userId = existingAuthUser.id;
//         } else {
//             const { data: authData, error: authError } =
//                 await supabaseAdmin.auth.admin.createUser({
//                     email: data.email,
//                     password: data.password,
//                     email_confirm: false,
//                     user_metadata: {
//                         name: data.name,
//                         role: Role.INDIVIDUAL_LEARNER,
//                     },
//                 });

//             if (authError || !authData.user) {
//                 throw new Error(authError?.message ?? "Auth provisioning failed.");
//             }
//             userId = authData.user.id;
//         }

//         await prisma.profile.upsert({
//             where: { id: userId },
//             update: {
//                 name: data.name,
//                 curriculumId: data.curriculumId,
//                 role: Role.INDIVIDUAL_LEARNER,
//             },
//             create: {
//                 id: userId,
//                 email: data.email,
//                 name: data.name,
//                 role: Role.INDIVIDUAL_LEARNER,
//                 curriculumId: data.curriculumId,
//             },
//         });

//         return { success: true };
//     } catch (err) {
//         console.error("[INDIVIDUAL_REGISTER_FAULT]:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ─── VERIFY PAYSTACK PAYMENT ──────────────────────────────────────────────────

// export async function verifyIndividualPayment(
//     reference: string
// ): Promise<{ success: boolean; reference?: string; error?: string }> {
//     try {
//         const res = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//                 cache: "no-store",
//             }
//         );

//         const json = await res.json();

//         if (!json.status || json.data?.status !== "success") {
//             return { success: false, error: "Payment verification failed." };
//         }

//         return { success: true, reference };
//     } catch (err) {
//         console.error("[INDIVIDUAL_PAYMENT_VERIFY_FAULT]:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ─── COMPLETE INDIVIDUAL ONBOARDING ──────────────────────────────────────────

// export async function completeIndividualOnboarding(
//     email: string,
//     paymentReference: string,
//     plan: string
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         // 1. Idempotency — reference already used, safely return success
//         const existingSubscription = await prisma.subscription.findUnique({
//             where: { paystackReference: paymentReference },
//         });
//         if (existingSubscription) return { success: true };

//         // 2. Find profile
//         const profile = await prisma.profile.findFirst({
//             where: {
//                 email: email.toLowerCase(),
//                 role: Role.INDIVIDUAL_LEARNER,
//             },
//         });

//         if (!profile) {
//             return {
//                 success: false,
//                 error: "Learner profile not found. Please re-register.",
//             };
//         }

//         // 3. Profile already subscribed via a different reference
//         const existingProfileSub = await prisma.subscription.findUnique({
//             where: { profileId: profile.id },
//         });
//         if (existingProfileSub) return { success: true };

//         // 4. Create subscription — schoolId is now nullable after schema migration
//         await prisma.$transaction(async (tx) => {
//             await tx.subscription.create({
//                 data: {
//                     plan,
//                     status: "active",
//                     paystackReference: paymentReference,
//                     profileId: profile.id,
//                     schoolId: null,
//                     currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//                     paidAt: new Date(),
//                 },
//             });
//         });

//         // 5. Send activation email
//         await supabaseAdmin.auth.resend({
//             type: "signup",
//             email: email.toLowerCase(),
//             options: {
//                 emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//             },
//         });

//         return { success: true };
//     } catch (err) {
//         console.error("[INDIVIDUAL_ONBOARDING_FAULT]:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ─── UPDATE INDIVIDUAL EMAIL ──────────────────────────────────────────────────

// export async function updateIndividualEmail(
//     oldEmail: string,
//     newEmail: string,
//     paymentReference: string
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const profile = await prisma.profile.findFirst({
//             where: {
//                 email: oldEmail.toLowerCase(),
//                 role: Role.INDIVIDUAL_LEARNER,
//             },
//             include: { subscription: true },
//         });

//         if (!profile) {
//             return { success: false, error: "Profile not found." };
//         }

//         if (profile.subscription?.paystackReference !== paymentReference) {
//             return {
//                 success: false,
//                 error: "Identity Update Denied: Reference mismatch.",
//             };
//         }

//         // Check new email not already taken
//         const emailConflict = await prisma.profile.findFirst({
//             where: { email: newEmail.toLowerCase() },
//         });
//         if (emailConflict && emailConflict.id !== profile.id) {
//             return { success: false, error: "Email already registered to another account." };
//         }

//         // Update Supabase auth
//         const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
//             profile.id,
//             { email: newEmail.toLowerCase() }
//         );
//         if (authError) throw new Error(authError.message);

//         // Update Prisma profile
//         await prisma.profile.update({
//             where: { id: profile.id },
//             data: { email: newEmail.toLowerCase() },
//         });

//         // Re-send activation link
//         await supabaseAdmin.auth.resend({
//             type: "signup",
//             email: newEmail.toLowerCase(),
//             options: {
//                 emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//             },
//         });

//         return { success: true };
//     } catch (err) {
//         console.error("[INDIVIDUAL_EMAIL_UPDATE_FAULT]:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { supabaseAdmin } from "@/lib/supabase/admin";
// import { Role, Profile, Subscription, Prisma } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { User } from "@supabase/supabase-js";

// // ─── TYPES ────────────────────────────────────────────────────────────────────

// interface CurriculumRow {
//     id: string;
//     name: string;
//     yearLabel: string;
//     termLabel: string;
// }

// interface RegistrationData {
//     name: string;
//     email: string;
//     password: string;
//     curriculumId: string;
//     secondaryCurriculumId?: string | null;
// }

// /**
//  * GET CURRICULA
//  * Rule: Standardized registry retrieval for selection dropdowns.
//  */
// export async function getCurricula(): Promise<{
//     success: boolean;
//     data: CurriculumRow[];
//     error?: string;
// }> {
//     try {
//         const curricula: CurriculumRow[] = await prisma.curriculum.findMany({
//             where: { schoolId: null },
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: "asc" },
//         });
//         return { success: true, data: curricula };
//     } catch (err: unknown) {
//         return { success: false, data: [], error: getErrorMessage(err) };
//     }
// }

// /**
//  * REGISTER INDIVIDUAL LEARNER
//  * Provisions a Supabase identity and a local Profile with primary/secondary curricula.
//  * Rule: Uses explicit Prisma types and respects dual-curriculum schema.
//  */
// export async function registerIndividualLearner(data: RegistrationData): Promise<{ success: boolean; error?: string }> {
//     try {
//         // 1. Audit Auth Registry
//         const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
//         if (listError) throw new Error("Identity registry unreachable.");

//         const existingAuthUser: User | undefined = users.find(
//             (u: User) => u.email?.toLowerCase() === data.email.toLowerCase()
//         );

//         let userId: string;

//         if (existingAuthUser) {
//             userId = existingAuthUser.id;
//         } else {
//             // 2. Provision Supabase Identity
//             const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
//                 email: data.email,
//                 password: data.password,
//                 email_confirm: false,
//                 user_metadata: {
//                     name: data.name,
//                     role: Role.INDIVIDUAL_LEARNER,
//                 },
//             });

//             if (authError || !authData.user) {
//                 throw new Error(authError?.message ?? "Auth provisioning failed.");
//             }
//             userId = authData.user.id;
//         }

//         // 3. Synchronize Profile Hub (including dual curricula)
//         const profile: Profile = await prisma.profile.upsert({
//             where: { id: userId },
//             update: {
//                 name: data.name,
//                 curriculumId: data.curriculumId,
//                 secondaryCurriculumId: data.secondaryCurriculumId ?? null,
//                 role: Role.INDIVIDUAL_LEARNER,
//             },
//             create: {
//                 id: userId,
//                 email: data.email,
//                 name: data.name,
//                 role: Role.INDIVIDUAL_LEARNER,
//                 curriculumId: data.curriculumId,
//                 secondaryCurriculumId: data.secondaryCurriculumId ?? null,
//             },
//         });

//         return { success: true };
//     } catch (err: unknown) {
//         console.error("[INDIVIDUAL_REGISTER_FAULT]:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * VERIFY INDIVIDUAL PAYMENT
//  * Rules: Confirm payment status with Paystack Gateway.
//  */
// export async function verifyIndividualPayment(
//     reference: string
// ): Promise<{ success: boolean; reference?: string; error?: string }> {
//     try {
//         const res: Response = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                     "Content-Type": "application/json",
//                 },
//                 cache: "no-store",
//             }
//         );

//         const json: { status: boolean; data?: { status: string } } = await res.json();

//         if (!json.status || json.data?.status !== "success") {
//             return { success: false, error: "Payment verification failed." };
//         }

//         return { success: true, reference };
//     } catch (err: unknown) {
//         console.error("[INDIVIDUAL_PAYMENT_VERIFY_FAULT]:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * COMPLETE INDIVIDUAL ONBOARDING
//  * Finalizes the payment process by creating a subscription record.
//  */
// export async function completeIndividualOnboarding(
//     email: string,
//     paymentReference: string,
//     plan: string
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         // 1. Idempotency Audit
//         const existingSubscription: Subscription | null = await prisma.subscription.findUnique({
//             where: { paystackReference: paymentReference },
//         });
//         if (existingSubscription) return { success: true };

//         // 2. Identify Target Profile
//         const profile: Profile | null = await prisma.profile.findFirst({
//             where: {
//                 email: email.toLowerCase(),
//                 role: Role.INDIVIDUAL_LEARNER,
//             },
//         });

//         if (!profile) {
//             return {
//                 success: false,
//                 error: "Learner profile not found. Please re-register.",
//             };
//         }

//         // 3. Create Subscription via Atomic Transaction
//         await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
//             const sub: Subscription = await tx.subscription.create({
//                 data: {
//                     plan,
//                     status: "active",
//                     paystackReference: paymentReference,
//                     profileId: profile.id,
//                     schoolId: null, // Individual learners have no school hub
//                     currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//                     paidAt: new Date(),
//                 },
//             });
//             return sub;
//         });

//         // 4. Dispatch Final Activation Link
//         await supabaseAdmin.auth.resend({
//             type: "signup",
//             email: email.toLowerCase(),
//             options: {
//                 emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//             },
//         });

//         return { success: true };
//     } catch (err: unknown) {
//         console.error("[INDIVIDUAL_ONBOARDING_FAULT]:", getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * UPDATE INDIVIDUAL EMAIL
//  * Corrects registration email typos while maintaining payment links.
//  */
// export async function updateIndividualEmail(
//     oldEmail: string,
//     newEmail: string,
//     paymentReference: string
// ): Promise<{ success: boolean; error?: string }> {
//     try {
//         const profile: (Profile & { subscription: Subscription | null }) | null = await prisma.profile.findFirst({
//             where: {
//                 email: oldEmail.toLowerCase(),
//                 role: Role.INDIVIDUAL_LEARNER,
//             },
//             include: { subscription: true },
//         });

//         if (!profile) {
//             return { success: false, error: "Profile not found." };
//         }

//         if (profile.subscription?.paystackReference !== paymentReference) {
//             return {
//                 success: false,
//                 error: "Identity Update Denied: Reference mismatch.",
//             };
//         }

//         // Validate uniqueness of new email
//         const emailConflict: Profile | null = await prisma.profile.findFirst({
//             where: { email: newEmail.toLowerCase() },
//         });
//         if (emailConflict && emailConflict.id !== profile.id) {
//             return { success: false, error: "Email already registered to another account." };
//         }

//         // Update Identity Provider (Supabase)
//         const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
//             profile.id,
//             { email: newEmail.toLowerCase() }
//         );
//         if (authError) throw new Error(authError.message);

//         // Update Registry Database (Prisma)
//         const updatedProfile: Profile = await prisma.profile.update({
//             where: { id: profile.id },
//             data: { email: newEmail.toLowerCase() },
//         });

//         // Trigger New Activation
//         await supabaseAdmin.auth.resend({
//             type: "signup",
//             email: newEmail.toLowerCase(),
//             options: {
//                 emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//             },
//         });

//         return { success: true };
//     } catch (err: unknown) {
//         console.error("[INDIVIDUAL_EMAIL_UPDATE_FAULT]:", getErrorMessage(err));
//         return { success: false, error: "Registry identity update failed." };
//     }
// }


"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Role, Profile, Subscription, Prisma } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";
import { User } from "@supabase/supabase-js";

// ─── TYPES ────────────────────────────────────────────────────────────────────

interface CurriculumRow {
    id: string;
    name: string;
    yearLabel: string;
    termLabel: string;
}

interface RegistrationData {
    name: string;
    email: string;
    password: string;
    curriculumId: string;
    secondaryCurriculumId?: string | null;
}

/**
 * GET CURRICULA
 * Rule: Standardized registry retrieval for selection dropdowns.
 */
export async function getCurricula(): Promise<{
    success: boolean;
    data: CurriculumRow[];
    error?: string;
}> {
    try {
        const curricula: CurriculumRow[] = await prisma.curriculum.findMany({
            where: { schoolId: null },
            select: { id: true, name: true, yearLabel: true, termLabel: true },
            orderBy: { name: "asc" },
        });
        return { success: true, data: curricula };
    } catch (err: unknown) {
        return { success: false, data: [], error: getErrorMessage(err) };
    }
}

/**
 * REGISTER INDIVIDUAL LEARNER
 * Provisions a Supabase identity and a local Profile with primary/secondary curricula.
 * Rule: Uses explicit Prisma types and respects dual-curriculum schema.
 */
export async function registerIndividualLearner(data: RegistrationData): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Audit Auth Registry
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw new Error("Identity registry unreachable.");

        const existingAuthUser: User | undefined = users.find(
            (u: User) => u.email?.toLowerCase() === data.email.toLowerCase()
        );

        let userId: string;

        if (existingAuthUser) {
            userId = existingAuthUser.id;
        } else {
            // 2. Provision Supabase Identity
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: data.email,
                password: data.password,
                email_confirm: false,
                user_metadata: {
                    name: data.name,
                    role: Role.INDIVIDUAL_LEARNER,
                },
            });

            if (authError || !authData.user) {
                throw new Error(authError?.message ?? "Auth provisioning failed.");
            }
            userId = authData.user.id;
        }

        // 3. Synchronize Profile Hub (including dual curricula)
        await prisma.profile.upsert({
            where: { id: userId },
            update: {
                name: data.name,
                curriculumId: data.curriculumId,
                secondaryCurriculumId: data.secondaryCurriculumId ?? null,
                role: Role.INDIVIDUAL_LEARNER,
            },
            create: {
                id: userId,
                email: data.email,
                name: data.name,
                role: Role.INDIVIDUAL_LEARNER,
                curriculumId: data.curriculumId,
                secondaryCurriculumId: data.secondaryCurriculumId ?? null,
            },
        });

        return { success: true };
    } catch (err: unknown) {
        console.error("[INDIVIDUAL_REGISTER_FAULT]:", getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * VERIFY INDIVIDUAL PAYMENT
 * Rules: Confirm payment status with Paystack Gateway.
 */
export async function verifyIndividualPayment(
    reference: string
): Promise<{ success: boolean; reference?: string; error?: string }> {
    try {
        const res: Response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        const json: { status: boolean; data?: { status: string } } = await res.json();

        if (!json.status || json.data?.status !== "success") {
            return { success: false, error: "Payment verification failed." };
        }

        return { success: true, reference };
    } catch (err: unknown) {
        console.error("[INDIVIDUAL_PAYMENT_VERIFY_FAULT]:", getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * COMPLETE INDIVIDUAL ONBOARDING
 * Finalizes the payment process by creating a subscription record.
 */
export async function completeIndividualOnboarding(
    email: string,
    paymentReference: string,
    plan: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // 1. Idempotency Audit
        const existingSubscription: Subscription | null = await prisma.subscription.findUnique({
            where: { paystackReference: paymentReference },
        });
        if (existingSubscription) return { success: true };

        // 2. Identify Target Profile
        const profile: Profile | null = await prisma.profile.findFirst({
            where: {
                email: email.toLowerCase(),
                role: Role.INDIVIDUAL_LEARNER,
            },
        });

        if (!profile) {
            return {
                success: false,
                error: "Learner profile not found. Please re-register.",
            };
        }

        // 3. Create Subscription via Atomic Transaction
        await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
            const sub: Subscription = await tx.subscription.create({
                data: {
                    plan,
                    status: "active",
                    paystackReference: paymentReference,
                    profileId: profile.id,
                    schoolId: null, // Individual learners have no school hub
                    currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    paidAt: new Date(),
                },
            });
            return sub;
        });

        // 4. Dispatch Final Activation Link
        await supabaseAdmin.auth.resend({
            type: "signup",
            email: email.toLowerCase(),
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
            },
        });

        return { success: true };
    } catch (err: unknown) {
        console.error("[INDIVIDUAL_ONBOARDING_FAULT]:", getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * UPDATE INDIVIDUAL EMAIL
 * Corrects registration email typos while maintaining payment links.
 */
export async function updateIndividualEmail(
    oldEmail: string,
    newEmail: string,
    paymentReference: string
): Promise<{ success: boolean; error?: string }> {
    try {
        const profile: (Profile & { subscription: Subscription | null }) | null = await prisma.profile.findFirst({
            where: {
                email: oldEmail.toLowerCase(),
                role: Role.INDIVIDUAL_LEARNER,
            },
            include: { subscription: true },
        });

        if (!profile) {
            return { success: false, error: "Profile not found." };
        }

        if (profile.subscription?.paystackReference !== paymentReference) {
            return {
                success: false,
                error: "Identity Update Denied: Reference mismatch.",
            };
        }

        // Validate uniqueness of new email
        const emailConflict: Profile | null = await prisma.profile.findFirst({
            where: { email: newEmail.toLowerCase() },
        });
        if (emailConflict && emailConflict.id !== profile.id) {
            return { success: false, error: "Email already registered to another account." };
        }

        // Update Identity Provider (Supabase)
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            profile.id,
            { email: newEmail.toLowerCase() }
        );
        if (authError) throw new Error(authError.message);

        // Update Registry Database (Prisma)
        await prisma.profile.update({
            where: { id: profile.id },
            data: { email: newEmail.toLowerCase() },
        });

        // Trigger New Activation
        await supabaseAdmin.auth.resend({
            type: "signup",
            email: newEmail.toLowerCase(),
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
            },
        });

        return { success: true };
    } catch (err: unknown) {
        console.error("[INDIVIDUAL_EMAIL_UPDATE_FAULT]:", getErrorMessage(err));
        return { success: false, error: "Registry identity update failed." };
    }
}