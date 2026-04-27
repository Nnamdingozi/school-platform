// 'use server';

// import { prisma } from '@/lib/prisma';
// import { createClient } from '@supabase/supabase-js';
// // ✅ FIX 1: Removed PrismaClient (unused). Kept Role.
// import { Role } from "@prisma/client"; 
// import { AdminFormData, SchoolFormData } from '@/types/onboarding';
// // ✅ FIX 2: Import your error handler
// import { getErrorMessage } from "@/lib/error-handler";

// // Define interfaces for payment data to avoid 'any'
// interface PaystackVerifyData {
//     reference: string;
//     plan: string;
//     amount: number;
// }

// interface StripeVerifyData {
//     sessionId: string;
//     plan: string;
//     amount: number;
// }

// // ─── Curricula ────────────────────────────────────────────────────────────────

// export async function getCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null },
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: 'asc' },
//         });
//         return { success: true, data: curricula };
//     } catch {
//         return { success: false, data: [] };
//     }
// }

// // ─── Paystack ─────────────────────────────────────────────────────────────────

// export async function initializePaystackTransaction(
//     email: string,
//     amount: number,
//     currency: string,
//     plan: string
// ): Promise<{ success: boolean; authorizationUrl?: string; error?: string }> {
//     try {
//         const res = await fetch('https://api.paystack.co/transaction/initialize', {
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email,
//                 amount: amount * 100,
//                 currency: currency.toUpperCase(),
//                 metadata: { plan },
//                 callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/payment-callback`,
//             }),
//         });

//         const json = await res.json();
//         if (!json.status) {
//             return { success: false, error: json.message ?? 'Failed to initialize payment.' };
//         }

//         return { success: true, authorizationUrl: json.data.authorization_url };
//     } catch (err: unknown) { // ✅ FIX 3: Changed any to unknown
//         console.error('Paystack init error:', getErrorMessage(err));
//         return { success: false, error: 'Could not connect to Paystack.' };
//     }
// }

// export async function verifyPaystackPayment(
//     reference: string
// ): Promise<{ success: boolean; error?: string; data?: PaystackVerifyData }> { // ✅ FIX 4: Replaced any with Type
//     try {
//         const res = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 },
//             }
//         );

//         const json = await res.json();
//         if (!json.status || json.data?.status !== 'success') {
//             return { success: false, error: 'Payment verification failed.' };
//         }

//         return {
//             success: true,
//             data: {
//                 reference,
//                 plan: json.data.metadata?.plan,
//                 amount: json.data.amount / 100,
//             },
//         };
//     } catch {
//         return { success: false, error: 'Could not verify payment.' };
//     }
// }

// // ─── Stripe ───────────────────────────────────────────────────────────────────

// export async function verifyStripePayment(
//     sessionId: string
// ): Promise<{ success: boolean; error?: string; data?: StripeVerifyData }> { // ✅ FIX 5: Replaced any with Type
//     try {
//         const res = await fetch(
//             `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
//                 },
//             }
//         );

//         const session = await res.json();
//         if (session.payment_status !== 'paid') {
//             return { success: false, error: 'Payment not completed.' };
//         }

//         return {
//             success: true,
//             data: {
//                 sessionId,
//                 plan: session.metadata?.plan,
//                 amount: session.amount_total / 100,
//             },
//         };
//     } catch {
//         return { success: false, error: 'Could not verify Stripe payment.' };
//     }
// }

// // ─── Complete Onboarding ──────────────────────────────────────────────────────

// export async function completeOnboarding(
//     adminData: AdminFormData,
//     schoolData: SchoolFormData,
//     paymentReference: string,
//     plan: string
// ): Promise<{ success: boolean; error?: string }> {

//     const supabaseAdmin = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.SUPABASE_SERVICE_ROLE_KEY!
//     );

//     const existingProfile = await prisma.profile.findUnique({
//         where: { email: adminData.email },
//     });
//     if (existingProfile) {
//         return { success: false, error: 'An account with this email already exists.' };
//     }

//     const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
//     const authUserExists = existingAuthUsers?.users?.some(
//         (u) => u.email === adminData.email
//     );
//     if (authUserExists) {
//         return { success: false, error: 'An account with this email already exists.' };
//     }

//     const { data: authData, error: authError } =
//         await supabaseAdmin.auth.admin.createUser({
//             email: adminData.email,
//             password: adminData.password,
//             email_confirm: false,
//             user_metadata: {
//                 name: adminData.name,
//                 role: 'SCHOOL_ADMIN',
//             },
//         });

//     if (authError || !authData.user) {
//         if (authError?.message?.includes('already been registered')) {
//             return { success: false, error: 'An account with this email already exists.' };
//         }
//         return {
//             success: false,
//             error: authError?.message ?? 'Failed to create account.',
//         };
//     }

//     const userId = authData.user.id;

//     try {
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Selected curriculum not found.' };
//         }

//         const school = await prisma.school.create({
//             data: {
//                 name: schoolData.schoolName,
//                 curriculumId: curriculum.id,
//                 primaryColor: schoolData.primaryColor,
//                 secondaryColor: schoolData.secondaryColor,
//                 whatsappCredits:
//                     plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
//                 subscription: {
//                     create: {
//                         plan,
//                         status: 'active',
//                         currentPeriodEnd: new Date(
//                             Date.now() + 14 * 24 * 60 * 60 * 1000
//                         ),
//                     },
//                 },
//             },
//         });

//         await prisma.profile.upsert({
//             where: { email: adminData.email },
//             update: {
//                 id: userId,
//                 schoolId: school.id,
//                 curriculumId: curriculum.id,
//                 name: adminData.name,
//                 role: Role.SCHOOL_ADMIN,
//             },
//             create: {
//                 id: userId,
//                 email: adminData.email,
//                 name: adminData.name,
//                 role: Role.SCHOOL_ADMIN,
//                 schoolId: school.id,
//                 curriculumId: curriculum.id,
//             },
//         });

//         const { error: resendError } = await supabaseAdmin.auth.resend({
//             type: 'signup',
//             email: adminData.email,
//             options: {
//                 emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//             },
//         });

//         if (resendError) {
//             console.error('Confirmation email error:', resendError.message);
//         }

//         return { success: true };

//     } catch (err: unknown) { // ✅ FIX 6: Changed any to unknown
//         console.error('completeOnboarding DB error:', getErrorMessage(err));
//         await supabaseAdmin.auth.admin.deleteUser(userId);
//         return {
//             success: false,
//             error: 'Failed to set up your workspace. Please try again.',
//         };
//     }
// }



'use server';

import { prisma } from '@/lib/prisma';
import { createClient } from '@supabase/supabase-js';
import { Role, Prisma, TxStatus } from "@prisma/client"; 
import { AdminFormData, SchoolFormData } from '@/types/onboarding';
import { getErrorMessage } from "@/lib/error-handler";
import { logActivity } from '@/lib/activitylogger';

// ── Types ──────────────────────────────────────────────────────────────────────

interface PaystackVerifyData {
    reference: string;
    plan: string;
    amount: number;
}

interface StripeVerifyData {
    sessionId: string;
    plan: string;
    amount: number;
}

// ─── Curricula (Tier 1) ────────────────────────────────────────────────────────

/**
 * Rule 4: Global content is universally accessible.
 * Fetches platform-wide curricula for new schools to choose from.
 */
export async function getCurricula() {
    try {
        const curricula = await prisma.curriculum.findMany({
            where: { schoolId: null },
            select: { id: true, name: true, yearLabel: true, termLabel: true },
            orderBy: { name: 'asc' },
        });
        return { success: true, data: curricula };
    } catch (err: unknown) {
        return { success: false, data: [], error: getErrorMessage(err) };
    }
}

// ─── Payment Gateway Logic ──────────────────────────────────────────────────────

export async function initializePaystackTransaction(
    email: string,
    amount: number,
    currency: string,
    plan: string
): Promise<{ success: boolean; authorizationUrl?: string; error?: string }> {
    try {
        const res = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: amount * 100,
                currency: currency.toUpperCase(),
                metadata: { plan },
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/payment-callback`,
            }),
        });

        const json = await res.json();
        if (!json.status) {
            return { success: false, error: json.message ?? 'Failed to initialize payment.' };
        }

        return { success: true, authorizationUrl: json.data.authorization_url };
    } catch (err: unknown) {
        console.error('Paystack init error:', getErrorMessage(err));
        return { success: false, error: 'Could not connect to Paystack.' };
    }
}

export async function verifyPaystackPayment(
    reference: string
): Promise<{ success: boolean; error?: string; data?: PaystackVerifyData }> {
    try {
        const res = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
            }
        );

        const json = await res.json();
        if (!json.status || json.data?.status !== 'success') {
            return { success: false, error: 'Payment verification failed.' };
        }

        return {
            success: true,
            data: {
                reference,
                plan: json.data.metadata?.plan,
                amount: json.data.amount / 100,
            },
        };
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

// ─── Complete Onboarding (Tier 2 Setup) ────────────────────────────────────────

/**
 * Rule 5: Creates a strictly isolated School environment.
 * Rule 11: Final system truth setup.
 */
export async function completeOnboarding(
    adminData: AdminFormData,
    schoolData: SchoolFormData,
    paymentReference: string,
    plan: string
): Promise<{ success: boolean; error?: string }> {

    const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // ✅ FIX 1: findFirst instead of findUnique (composite key conflict)
    const existingProfile = await prisma.profile.findFirst({
        where: { email: adminData.email },
    });
    if (existingProfile) {
        return { success: false, error: 'An account with this email already exists.' };
    }

    const { data: existingAuthUsers } = await supabaseAdmin.auth.admin.listUsers();
    const authUserExists = existingAuthUsers?.users?.some(
        (u) => u.email === adminData.email
    );
    if (authUserExists) {
        return { success: false, error: 'An account with this email already exists.' };
    }

    // Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: adminData.email,
            password: adminData.password,
            email_confirm: false,
            user_metadata: {
                name: adminData.name,
                role: Role.SCHOOL_ADMIN,
            },
        });

    if (authError || !authData.user) {
        return { success: false, error: authError?.message ?? 'Failed to create auth account.' };
    }

    const userId = authData.user.id;

    try {
        const curriculum = await prisma.curriculum.findUnique({
            where: { id: schoolData.curriculumId },
        });

        if (!curriculum) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return { success: false, error: 'Selected curriculum template not found.' };
        }

        // Rule 11: Transactional creation of School and Profile
        const result = await prisma.$transaction(async (tx) => {
            const school = await tx.school.create({
                data: {
                    name: schoolData.schoolName,
                    curriculumId: curriculum.id,
                    whatsappCredits: plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
                    subscription: {
                        create: {
                            plan,
                            status: 'active',
                            currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
                        },
                    },
                },
            });

            // ✅ FIX 2: Branding colors saved to Profile, not School
            // ✅ FIX 3: findUnique/Upsert by 'id' (Primary Key)
            const profile = await tx.profile.upsert({
                where: { id: userId }, 
                update: {
                    schoolId: school.id,
                    curriculumId: curriculum.id,
                    name: adminData.name,
                    role: Role.SCHOOL_ADMIN,
                    primaryColor: schoolData.primaryColor,
                    secondaryColor: schoolData.secondaryColor,
                },
                create: {
                    id: userId,
                    email: adminData.email,
                    name: adminData.name,
                    role: Role.SCHOOL_ADMIN,
                    schoolId: school.id,
                    curriculumId: curriculum.id,
                    primaryColor: schoolData.primaryColor,
                    secondaryColor: schoolData.secondaryColor,
                },
            });

            return { school, profile };
        });

        // Rule 11: Log the workspace creation
        await logActivity({
            schoolId: result.school.id,
            actorId: result.profile.id,
            actorName: result.profile.name,
            actorRole: result.profile.role,
            type: "SETTINGS_UPDATED",
            title: 'Workspace Initialized',
            description: `Onboarding completed for ${schoolData.schoolName}. Plan: ${plan}`
        });

        // Trigger confirmation email
        await supabaseAdmin.auth.resend({
            type: 'signup',
            email: adminData.email,
            options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm` },
        });

        return { success: true };

    } catch (err: unknown) {
        console.error('completeOnboarding DB error:', getErrorMessage(err));
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return { success: false, error: 'Workspace setup failed. Rollback initiated.' };
    }
}