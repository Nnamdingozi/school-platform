// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface CreditPackage {
//     id:          string
//     name:        string
//     credits:     number
//     priceUSD:    number
//     priceKobo:   number   // Paystack uses kobo (1 USD = ~1600 NGN, 1 NGN = 100 kobo)
//     priceNGN:    number
//     popular?:    boolean
//     description: string
// }

// export interface InitiatePaymentResult {
//     success:      boolean
//     authorizationUrl?: string
//     reference?:   string
//     error?:       string
// }

// export interface VerifyPaymentResult {
//     success:  boolean
//     credits?: number
//     error?:   string
// }

// // ── Credit packages ────────────────────────────────────────────────────────────
// // Twilio cost: $0.004/message
// // Our price: $0.02/credit = 5x markup
// // NGN rate: 1 USD = ~1600 NGN (update as needed)

// const USD_TO_NGN = 1600

// export const CREDIT_PACKAGES: CreditPackage[] = [
//     {
//         id:          'starter',
//         name:        'Starter',
//         credits:     100,
//         priceUSD:    2.00,
//         priceNGN:    Math.round(2.00 * USD_TO_NGN),
//         priceKobo:   Math.round(2.00 * USD_TO_NGN * 100),
//         description: 'Perfect for small schools just getting started',
//     },
//     {
//         id:          'standard',
//         name:        'Standard',
//         credits:     500,
//         priceUSD:    9.00,
//         priceNGN:    Math.round(9.00 * USD_TO_NGN),
//         priceKobo:   Math.round(9.00 * USD_TO_NGN * 100),
//         popular:     true,
//         description: 'Best value for growing schools',
//     },
//     {
//         id:          'pro',
//         name:        'Pro',
//         credits:     1000,
//         priceUSD:    16.00,
//         priceNGN:    Math.round(16.00 * USD_TO_NGN),
//         priceKobo:   Math.round(16.00 * USD_TO_NGN * 100),
//         description: 'For schools with regular parent communication',
//     },
//     {
//         id:          'enterprise',
//         name:        'Enterprise',
//         credits:     5000,
//         priceUSD:    70.00,
//         priceNGN:    Math.round(70.00 * USD_TO_NGN),
//         priceKobo:   Math.round(70.00 * USD_TO_NGN * 100),
//         description: 'Maximum value for large school networks',
//     },
// ]

// // ── Initiate Paystack payment ──────────────────────────────────────────────────

// export async function initiateCreditsPayment(
//     schoolId:  string,
//     packageId: string,
// ): Promise<InitiatePaymentResult> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         const pkg = CREDIT_PACKAGES.find(p => p.id === packageId)
//         if (!pkg) return { success: false, error: 'Invalid package.' }

//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { id: true, name: true },
//         })
//         if (!school) return { success: false, error: 'School not found.' }

//         // Generate unique reference
//         const reference = `credits_${schoolId}_${packageId}_${Date.now()}`

//         // Store pending transaction
//         await prisma.creditTransaction.create({
//             data: {
//                 schoolId,
//                 packageId:   pkg.id,
//                 credits:     pkg.credits,
//                 amountNGN:   pkg.priceNGN,
//                 amountKobo:  pkg.priceKobo,
//                 reference,
//                 status:      'PENDING',
//                 initiatedBy: user.id,
//             },
//         })

//         // Initialize Paystack transaction
//         const response = await fetch('https://api.paystack.co/transaction/initialize', {
//             method:  'POST',
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email:     user.email,
//                 amount:    pkg.priceKobo,
//                 reference,
//                 currency:  'NGN',
//                 metadata: {
//                     schoolId,
//                     packageId:   pkg.id,
//                     credits:     pkg.credits,
//                     schoolName:  school.name,
//                     custom_fields: [
//                         { display_name: 'School',   variable_name: 'school',   value: school.name },
//                         { display_name: 'Package',  variable_name: 'package',  value: pkg.name    },
//                         { display_name: 'Credits',  variable_name: 'credits',  value: pkg.credits },
//                     ],
//                 },
//                 callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/credits/verify?reference=${reference}`,
//             }),
//         })

//         const paystackData = await response.json()

//         if (!paystackData.status) {
//             return { success: false, error: paystackData.message ?? 'Paystack initialization failed.' }
//         }

//         return {
//             success:          true,
//             authorizationUrl: paystackData.data.authorization_url,
//             reference,
//         }
//     } catch (err) {
//         console.error('initiateCreditsPayment error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Verify Paystack payment ────────────────────────────────────────────────────

// export async function verifyCreditsPayment(
//     reference: string,
// ): Promise<VerifyPaymentResult> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         // Check if already processed
//         const transaction = await prisma.creditTransaction.findUnique({
//             where:  { reference },
//             select: {
//                 id:       true,
//                 status:   true,
//                 credits:  true,
//                 schoolId: true,
//                 packageId: true,
//             },
//         })

//         if (!transaction) return { success: false, error: 'Transaction not found.' }
//         if (transaction.status === 'SUCCESS') {
//             return { success: true, credits: transaction.credits }
//         }
//         if (transaction.status === 'FAILED') {
//             return { success: false, error: 'Transaction previously failed.' }
//         }

//         // Verify with Paystack
//         const response = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 },
//             }
//         )

//         const paystackData = await response.json()

//         if (!paystackData.status || paystackData.data.status !== 'success') {
//             await prisma.creditTransaction.update({
//                 where: { reference },
//                 data:  { status: 'FAILED' },
//             })
//             return { success: false, error: 'Payment verification failed.' }
//         }

//         // ✅ Payment confirmed — top up credits
//         await prisma.$transaction([
//             prisma.school.update({
//                 where: { id: transaction.schoolId },
//                 data:  { whatsappCredits: { increment: transaction.credits } },
//             }),
//             prisma.creditTransaction.update({
//                 where: { reference },
//                 data:  { status: 'SUCCESS', paidAt: new Date() },
//             }),
//         ])

//         // Log activity
//         const profile = await prisma.profile.findFirst({
//             where:  { email: user.email },
//             select: { id: true, name: true, role: true },
//         })

//         if (profile) {
//             await logActivity({
//                 schoolId:    transaction.schoolId,
//                 actorId:     profile.id,
//                 actorName:   profile.name,
//                 actorRole:   profile.role,
//                 type:        'WHATSAPP_SENT',
//                 title:       'Credits Purchased',
//                 description: `${transaction.credits} WhatsApp credits added via Paystack`,
//                 metadata: {
//                     credits:   transaction.credits,
//                     packageId: transaction.packageId,
//                     reference,
//                 },
//             })
//         }

//         revalidatePath('/admin/credits')
//         revalidatePath('/admin/settings')

//         return { success: true, credits: transaction.credits }
//     } catch (err) {
//         console.error('verifyCreditsPayment error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Get transaction history ────────────────────────────────────────────────────

// export async function getCreditTransactions(schoolId: string) {
//     try {
//         return await prisma.creditTransaction.findMany({
//             where:   { schoolId, status: 'SUCCESS' },
//             orderBy: { paidAt: 'desc' },
//             take:    20,
//             select: {
//                 id:        true,
//                 packageId: true,
//                 credits:   true,
//                 amountNGN: true,
//                 reference: true,
//                 paidAt:    true,
//             },
//         })
//     } catch (err) {
//         console.error('getCreditTransactions error:', getErrorMessage(err))
//         return []
//     }
// }




// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'

// // ── Interfaces ──────────────────────────────────────────────────────────────

// export interface InitiatePaymentResult {
//     success: boolean
//     authorizationUrl?: string
//     reference?: string
//     error?: string
// }

// export interface VerifyPaymentResult {
//     success: boolean
//     credits?: number
//     error?: string
// }

// // ── Server Actions ────────────────────────────────────────────────────────────

// /**
//  * Fetches available credit bundles from the database.
//  */
// export async function getCreditPackages() {
//     try {
//         const packages = await prisma.creditPackage.findMany({
//             where: { active: true },
//             orderBy: { sortOrder: 'asc' }
//         });
//         return { success: true, data: packages };
//     } catch (err: unknown) {
//         console.error('getCreditPackages error:', getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err), data: [] };
//     }
// }

// /**
//  * Initiates a Paystack transaction for purchasing WhatsApp credits.
//  */
// export async function initiateCreditsPayment(
//     schoolId: string,
//     packageId: string
// ): Promise<InitiatePaymentResult> {
//     try {
//         // 1. Authenticate the Administrator
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) {
//             return { success: false, error: 'Session expired. Please log in again.' }
//         }

//         // 2. Resolve the Package from the Database
//         const pkg = await prisma.creditPackage.findUnique({
//             where: { id: packageId }
//         });

//         if (!pkg || !pkg.active) {
//             return { success: false, error: 'The selected bundle is no longer active.' };
//         }

//         // 3. Resolve the School Identity
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { id: true, name: true }
//         });

//         if (!school) {
//             return { success: false, error: 'Institutional record not found.' };
//         }

//         // 4. Generate a unique Financial Reference
//         const reference = `credits_${schoolId.slice(0, 8)}_${Date.now()}`;

//         // 5. Create a PENDING transaction record in the Registry
//         await prisma.creditTransaction.create({
//             data: {
//                 schoolId,
//                 packageId: pkg.id,
//                 credits: pkg.credits,
//                 amountNGN: pkg.priceNGN,
//                 amountKobo: pkg.priceKobo,
//                 reference,
//                 status: 'PENDING',
//                 initiatedBy: user.id,
//             },
//         });

//         // 6. Initialize Paystack Transaction via API
//         const response = await fetch('https://api.paystack.co/transaction/initialize', {
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email: user.email,
//                 amount: pkg.priceKobo, // Paystack requires amount in Kobo
//                 reference,
//                 currency: 'NGN',
//                 metadata: {
//                     schoolId,
//                     packageId: pkg.id,
//                     credits: pkg.credits,
//                     schoolName: school.name,
//                     custom_fields: [
//                         { display_name: 'Institution', variable_name: 'school', value: school.name },
//                         { display_name: 'Bundle', variable_name: 'package', value: pkg.name },
//                         { display_name: 'Volume', variable_name: 'credits', value: pkg.credits },
//                     ],
//                 },
//                 // Redirect back to our verification route
//                 callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/communication/verify?reference=${reference}`,
//             }),
//         });

//         const paystackData = await response.json();

//         if (!paystackData.status) {
//             return { 
//                 success: false, 
//                 error: paystackData.message ?? 'Communication failure with payment gateway.' 
//             };
//         }

//         // 7. Success: Return the Auth URL for the frontend redirect
//         return {
//             success: true,
//             authorizationUrl: paystackData.data.authorization_url,
//             reference,
//         };

//     } catch (err: unknown) {
//         const message = getErrorMessage(err);
//         console.error('initiateCreditsPayment execution error:', message);
//         return { 
//             success: false, 
//             error: `Payment initiation failed: ${message}` 
//         };
//     }
// }

// export async function verifyCreditsPayment(
//     reference: string,
// ): Promise<VerifyPaymentResult> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         // Check if already processed
//         const transaction = await prisma.creditTransaction.findUnique({
//             where:  { reference },
//             select: {
//                 id:       true,
//                 status:   true,
//                 credits:  true,
//                 schoolId: true,
//                 packageId: true,
//             },
//         })

//         if (!transaction) return { success: false, error: 'Transaction not found.' }
//         if (transaction.status === 'SUCCESS') {
//             return { success: true, credits: transaction.credits }
//         }
//         if (transaction.status === 'FAILED') {
//             return { success: false, error: 'Transaction previously failed.' }
//         }

//         // Verify with Paystack
//         const response = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 },
//             }
//         )

//         const paystackData = await response.json()

//         if (!paystackData.status || paystackData.data.status !== 'success') {
//             await prisma.creditTransaction.update({
//                 where: { reference },
//                 data:  { status: 'FAILED' },
//             })
//             return { success: false, error: 'Payment verification failed.' }
//         }

//         // ✅ Payment confirmed — top up credits
//         await prisma.$transaction([
//             prisma.school.update({
//                 where: { id: transaction.schoolId },
//                 data:  { whatsappCredits: { increment: transaction.credits } },
//             }),
//             prisma.creditTransaction.update({
//                 where: { reference },
//                 data:  { status: 'SUCCESS', paidAt: new Date() },
//             }),
//         ])
//     }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { logActivity } from '@/lib/activitylogger'
// import { ActivityType } from '@prisma/client'
// import { InitiatePaymentResult, VerifyPaymentResult } from '@/types/credits'

// // ── Interfaces ──────────────────────────────────────────────────────────────


// // ── Server Actions ────────────────────────────────────────────────────────────

// /**
//  * Fetches available credit bundles from the database.
//  */
// export async function getCreditPackages() {
//     try {
//         const packages = await prisma.creditPackage.findMany({
//             where: { active: true },
//             orderBy: { sortOrder: 'asc' }
//         });
//         return { success: true, data: packages };
//     } catch (err: unknown) {
//         console.error('getCreditPackages error:', getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err), data: [] };
//     }
// }

// /**
//  * Initiates a Paystack transaction for purchasing WhatsApp credits.
//  */
// export async function initiateCreditsPayment(
//     schoolId: string,
//     packageId: string
// ): Promise<InitiatePaymentResult> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) {
//             return { success: false, error: 'Session expired. Please log in again.' }
//         }

//         const pkg = await prisma.creditPackage.findUnique({
//             where: { id: packageId }
//         });

//         if (!pkg || !pkg.active) {
//             return { success: false, error: 'The selected bundle is no longer active.' };
//         }

//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { id: true, name: true }
//         });

//         if (!school) {
//             return { success: false, error: 'Institutional record not found.' };
//         }

//         const reference = `credits_${schoolId.slice(0, 8)}_${Date.now()}`;

//         await prisma.creditTransaction.create({
//             data: {
//                 schoolId,
//                 packageId: pkg.id,
//                 credits: pkg.credits,
//                 amountNGN: pkg.priceNGN,
//                 amountKobo: pkg.priceKobo,
//                 reference,
//                 status: 'PENDING',
//                 initiatedBy: user.id,
//             },
//         });

//         const response = await fetch('https://api.paystack.co/transaction/initialize', {
//             method: 'POST',
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email: user.email,
//                 amount: pkg.priceKobo,
//                 reference,
//                 currency: 'NGN',
//                 metadata: {
//                     schoolId,
//                     packageId: pkg.id,
//                     credits: pkg.credits,
//                     schoolName: school.name,
//                 },
//                 callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/communication/verify?reference=${reference}`,
//             }),
//         });

//         const paystackData = await response.json();

//         if (!paystackData.status) {
//             return { success: false, error: paystackData.message ?? 'Gateway communication failure.' };
//         }

//         return {
//             success: true,
//             authorizationUrl: paystackData.data.authorization_url,
//             reference,
//         };

//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * Verifies the Paystack transaction and updates school credit balance.
//  */
// export async function verifyCreditsPayment(
//     reference: string,
// ): Promise<VerifyPaymentResult> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         const transaction = await prisma.creditTransaction.findUnique({
//             where: { reference },
//             select: {
//                 id: true,
//                 status: true,
//                 credits: true,
//                 schoolId: true,
//                 packageId: true,
//             },
//         })

//         if (!transaction) return { success: false, error: 'Transaction not found.' }
//         if (transaction.status === 'SUCCESS') return { success: true, credits: transaction.credits }
//         if (transaction.status === 'FAILED') return { success: false, error: 'Transaction failed previously.' }

//         // Verify with Paystack API
//         const response = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 },
//             }
//         )

//         const paystackData = await response.json()

//         if (!paystackData.status || paystackData.data.status !== 'success') {
//             await prisma.creditTransaction.update({
//                 where: { reference },
//                 data: { status: 'FAILED' },
//             })
//             return { success: false, error: 'Payment verification failed at gateway.' }
//         }

//         // Top up credits and mark transaction as successful
//         await prisma.$transaction([
//             prisma.school.update({
//                 where: { id: transaction.schoolId },
//                 data: { whatsappCredits: { increment: transaction.credits } },
//             }),
//             prisma.creditTransaction.update({
//                 where: { reference },
//                 data: { status: 'SUCCESS', paidAt: new Date() },
//             }),
//         ])

//         // Fetch profile for logging
//         const profile = await prisma.profile.findFirst({
//             where: { email: user.email },
//             select: { id: true, name: true, role: true }
//         });

//         // Log the successful purchase
//         if (profile) {
//             await logActivity({
//                 schoolId: transaction.schoolId,
//                 actorId: profile.id,
//                 actorName: profile.name,
//                 actorRole: profile.role,
//                 type: ActivityType.SETTINGS_UPDATED, // Or a custom purchase type if available
//                 title: 'Credits Replenished',
//                 description: `Purchased ${transaction.credits} WhatsApp units via Paystack.`,
//                 metadata: { reference, packageId: transaction.packageId }
//             });
//         }

//         // Update UI caches
//         revalidatePath('/admin/communication')
        
//         return { success: true, credits: transaction.credits }

//     } catch (err: unknown) {
//         console.error('verifyCreditsPayment error:', getErrorMessage(err));
//         return { success: false, error: getErrorMessage(err) };
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'
import { getErrorMessage } from '@/lib/error-handler'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/activitylogger'
import { ActivityType, TxStatus, Role, Prisma } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface InitiatePaymentResult {
    success: boolean
    error?: string
    authorizationUrl?: string
    reference?: string
}

export interface VerifyPaymentResult {
    success: boolean
    error?: string
    credits?: number
}

// ── Server Actions ────────────────────────────────────────────────────────────

/**
 * Fetches available credit bundles from the database.
 * Tier 1: Global packages available to all school admins.
 */
export async function getCreditPackages() {
    try {
        const packages = await prisma.creditPackage.findMany({
            where: { active: true },
            orderBy: { sortOrder: 'asc' }
        });
        return { success: true, data: packages };
    } catch (err: unknown) {
        console.error('getCreditPackages error:', getErrorMessage(err));
        return { success: false, error: getErrorMessage(err), data: [] };
    }
}

/**
 * Initiates a Paystack transaction for purchasing WhatsApp credits.
 * Rule 10: Backend validation ensures user belongs to the school.
 */
export async function initiateCreditsPayment(
    schoolId: string,
    packageId: string
): Promise<InitiatePaymentResult> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return { success: false, error: 'Session expired. Please log in again.' }
        }

        // Rule 10 Security: Fetch profile to verify school membership
        const profile = await prisma.profile.findFirst({
            where: { id: user.id },
            select: { schoolId: true, name: true, role: true }
        });

        if (!profile || profile.schoolId !== schoolId) {
            return { success: false, error: 'Unauthorized: You do not belong to this institution.' };
        }

        const pkg = await prisma.creditPackage.findUnique({
            where: { id: packageId }
        });

        if (!pkg || !pkg.active) {
            return { success: false, error: 'The selected bundle is no longer active.' };
        }

        const school = await prisma.school.findUnique({
            where: { id: schoolId },
            select: { id: true, name: true }
        });

        if (!school) {
            return { success: false, error: 'Institutional record not found.' };
        }

        const reference = `credits_${schoolId.slice(0, 8)}_${Date.now()}`;

        // Create transaction record
        await prisma.creditTransaction.create({
            data: {
                schoolId,
                packageId: pkg.id,
                credits: pkg.credits,
                amountNGN: pkg.priceNGN,
                amountKobo: pkg.priceKobo,
                reference,
                status: TxStatus.PENDING,
                initiatedBy: user.id,
            },
        });

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                amount: pkg.priceKobo,
                reference,
                currency: 'NGN',
                metadata: {
                    schoolId,
                    packageId: pkg.id,
                    credits: pkg.credits,
                    schoolName: school.name,
                },
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin/communication/verify?reference=${reference}`,
            }),
        });

        const paystackData = await response.json();

        if (!paystackData.status) {
            return { success: false, error: paystackData.message ?? 'Gateway communication failure.' };
        }

        return {
            success: true,
            authorizationUrl: paystackData.data.authorization_url as string,
            reference,
        };

    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * Verifies the Paystack transaction and updates school credit balance.
 * Rule 11: Final Truth - Updates institutional credits and logs activity.
 */
export async function verifyCreditsPayment(
    reference: string,
): Promise<VerifyPaymentResult> {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) return { success: false, error: 'Unauthorized.' }

        const transaction = await prisma.creditTransaction.findUnique({
            where: { reference },
            select: {
                id: true,
                status: true,
                credits: true,
                schoolId: true,
                packageId: true,
            },
        })

        if (!transaction) return { success: false, error: 'Transaction record not found.' }
        if (transaction.status === TxStatus.SUCCESS) return { success: true, credits: transaction.credits }
        if (transaction.status === TxStatus.FAILED) return { success: false, error: 'Transaction failed previously.' }

        // Rule 10 Security: Ensure the user verifying the payment belongs to the school credited
        const profile = await prisma.profile.findFirst({
            where: { id: user.id },
            select: { schoolId: true, name: true, role: true, id: true}
        });

        if (!profile || profile.schoolId !== transaction.schoolId) {
            return { success: false, error: 'Unauthorized: Security context mismatch.' };
        }

        // Verify with Paystack API
        const response = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
            }
        )

        const paystackData = await response.json()

        if (!paystackData.status || paystackData.data.status !== 'success') {
            await prisma.creditTransaction.update({
                where: { reference },
                data: { status: TxStatus.FAILED },
            })
            return { success: false, error: 'Payment verification failed at gateway.' }
        }

        // Atomic Transaction: Top up credits and mark successful
        await prisma.$transaction([
            prisma.school.update({
                where: { id: transaction.schoolId },
                data: { whatsappCredits: { increment: transaction.credits } },
            }),
            prisma.creditTransaction.update({
                where: { reference },
                data: { status: TxStatus.SUCCESS, paidAt: new Date() },
            }),
        ])

        // Rule 11: Log the successful replenishment
        await logActivity({
            schoolId: transaction.schoolId,
            actorId: profile.id,
            actorName: profile.name,
            actorRole: profile.role,
            type: ActivityType.SETTINGS_UPDATED,
            title: 'Credits Replenished',
            description: `Successfully purchased ${transaction.credits} WhatsApp units via Paystack.`,
            metadata: { reference, packageId: transaction.packageId }
        });

        revalidatePath('/admin/communication')
        
        return { success: true, credits: transaction.credits }

    } catch (err: unknown) {
        console.error('verifyCreditsPayment error:', getErrorMessage(err));
        return { success: false, error: getErrorMessage(err) };
    }
}