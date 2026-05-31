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



// 'use server';

// import { prisma } from '@/lib/prisma';
// import { createClient } from '@supabase/supabase-js';
// import { Role, Prisma, TxStatus } from "@prisma/client"; 
// import { AdminFormData, SchoolFormData } from '@/types/onboarding';
// import { getErrorMessage } from "@/lib/error-handler";
// import { logActivity } from '@/lib/activitylogger';

// // ── Types ──────────────────────────────────────────────────────────────────────

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

// // ─── Curricula (Tier 1) ────────────────────────────────────────────────────────

// /**
//  * Rule 4: Global content is universally accessible.
//  * Fetches platform-wide curricula for new schools to choose from.
//  */
// export async function getCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null },
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: 'asc' },
//         });
//         return { success: true, data: curricula };
//     } catch (err: unknown) {
//         return { success: false, data: [], error: getErrorMessage(err) };
//     }
// }

// // ─── Payment Gateway Logic ──────────────────────────────────────────────────────

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
//     } catch (err: unknown) {
//         console.error('Paystack init error:', getErrorMessage(err));
//         return { success: false, error: 'Could not connect to Paystack.' };
//     }
// }

// export async function verifyPaystackPayment(
//     reference: string
// ): Promise<{ success: boolean; error?: string; data?: PaystackVerifyData }> {
//     try {
//         const res = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
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
//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// // ─── Complete Onboarding (Tier 2 Setup) ────────────────────────────────────────

// /**
//  * Rule 5: Creates a strictly isolated School environment.
//  * Rule 11: Final system truth setup.
//  */
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

//     // ✅ FIX 1: findFirst instead of findUnique (composite key conflict)
//     const existingProfile = await prisma.profile.findFirst({
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

//     // Create Auth User
//     const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
//             email: adminData.email,
//             password: adminData.password,
//             email_confirm: false,
//             user_metadata: {
//                 name: adminData.name,
//                 role: Role.SCHOOL_ADMIN,
//             },
//         });

//     if (authError || !authData.user) {
//         return { success: false, error: authError?.message ?? 'Failed to create auth account.' };
//     }

//     const userId = authData.user.id;

//     try {
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Selected curriculum template not found.' };
//         }

//         // Rule 11: Transactional creation of School and Profile
//         const result = await prisma.$transaction(async (tx) => {
//             const school = await tx.school.create({
//                 data: {
//                     name: schoolData.schoolName,
//                     curriculumId: curriculum.id,
//                     whatsappCredits: plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
//                     subscription: {
//                         create: {
//                             plan,
//                             status: 'active',
//                             currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 day trial
//                         },
//                     },
//                 },
//             });

//             // ✅ FIX 2: Branding colors saved to Profile, not School
//             // ✅ FIX 3: findUnique/Upsert by 'id' (Primary Key)
//             const profile = await tx.profile.upsert({
//                 where: { id: userId }, 
//                 update: {
//                     schoolId: school.id,
//                     curriculumId: curriculum.id,
//                     name: adminData.name,
//                     role: Role.SCHOOL_ADMIN,
//                     primaryColor: schoolData.primaryColor,
//                     secondaryColor: schoolData.secondaryColor,
//                 },
//                 create: {
//                     id: userId,
//                     email: adminData.email,
//                     name: adminData.name,
//                     role: Role.SCHOOL_ADMIN,
//                     schoolId: school.id,
//                     curriculumId: curriculum.id,
//                     primaryColor: schoolData.primaryColor,
//                     secondaryColor: schoolData.secondaryColor,
//                 },
//             });

//             return { school, profile };
//         });

//         // Rule 11: Log the workspace creation
//         await logActivity({
//             schoolId: result.school.id,
//             actorId: result.profile.id,
//             actorName: result.profile.name,
//             actorRole: result.profile.role,
//             type: "SETTINGS_UPDATED",
//             title: 'Workspace Initialized',
//             description: `Onboarding completed for ${schoolData.schoolName}. Plan: ${plan}`
//         });

//         // Trigger confirmation email
//         await supabaseAdmin.auth.resend({
//             type: 'signup',
//             email: adminData.email,
//             options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm` },
//         });

//         return { success: true };

//     } catch (err: unknown) {
//         console.error('completeOnboarding DB error:', getErrorMessage(err));
//         await supabaseAdmin.auth.admin.deleteUser(userId);
//         return { success: false, error: 'Workspace setup failed. Rollback initiated.' };
//     }
// }


// 'use server';

// import { prisma } from '@/lib/prisma';
// import { createClient } from '@supabase/supabase-js';
// import { Role, ActivityType } from "@prisma/client"; 
// import { type AdminFormData, type SchoolFormData } from '@/types/onboarding';
// import { getErrorMessage } from "@/lib/error-handler";
// import { logActivity } from '@/app/actions/activitylog';

// // ── Complete Onboarding (Institutional Tier Initialization) ──────────────────

// /**
//  * COMPLETE ONBOARDING (Hub Sync Protocol)
//  * Rule 5: Anchors branding to the School Hub (Tier 2).
//  * Rule 11: Atomic transaction ensures registry consistency.
//  * Rule 15: Strictly typed parameters.
//  */
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

//     // 1. IDENTITY INTEGRITY CHECK
//     const existingProfile = await prisma.profile.findFirst({
//         where: { email: adminData.email },
//     });
    
//     if (existingProfile) {
//         return { success: false, error: 'Identity Protocol Conflict: Email already exists in registry.' };
//     }

//     // 2. PROVISION AUTHENTICATION PROFILE
//     const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
//             email: adminData.email,
//             password: adminData.password,
//             email_confirm: false,
//             user_metadata: {
//                 name: adminData.name,
//                 role: Role.SCHOOL_ADMIN,
//             },
//         });

//     if (authError || !authData.user) {
//         return { success: false, error: authError?.message ?? 'Credentialing failure.' };
//     }

//     const userId = authData.user.id;

//     try {
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Academic Blueprint not found.' };
//         }

//         // 3. ATOMIC REGISTRY TRANSACTION (Rule 11)
//         const result = await prisma.$transaction(async (tx) => {
            
//             // A. Create the Institutional Hub (Master Identity)
//             const school = await tx.school.create({
//                 data: {
//                     name: schoolData.schoolName,
//                     curriculumId: curriculum.id,
//                     // ✅ Tier 2: Permanent Branding Storage
//                     primaryColor: schoolData.primaryColor,
//                     secondaryColor: schoolData.secondaryColor,
//                     whatsappCredits: plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
//                     subscription: {
//                         create: {
//                             plan,
//                             status: 'active',
//                             currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14-day cycle start
//                         },
//                     },
//                 },
//             });

//             // B. Create the Administrator Profile (Identity Hub)
//             // Note: primaryColor/secondaryColor removed from Profile table logic
//             const profile = await tx.profile.create({
//                 data: {
//                     id: userId,
//                     email: adminData.email,
//                     name: adminData.name,
//                     role: Role.SCHOOL_ADMIN,
//                     schoolId: school.id,
//                     curriculumId: curriculum.id,
//                 },
//             });

//             return { school, profile };
//         });

//         // 4. REGISTRY AUDIT (Rule 11)
//         await logActivity({
//             schoolId: result.school.id,
//             actorId: result.profile.id,
//             actorRole: result.profile.role,
//             type: "SETTINGS_UPDATED",
//             title: 'Institutional Hub Initialized',
//             description: `Provisioned Hub: ${schoolData.schoolName}. Licensing Tier: ${plan}`
//         });

//         // 5. SECURITY DISPATCH: Synchronization Link
//         await supabaseAdmin.auth.resend({
//             type: 'signup',
//             email: adminData.email,
//             options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm` },
//         });

//         return { success: true };

//     } catch (err: unknown) {
//         console.error('[HUB_PROVISION_FAULT]:', getErrorMessage(err));
        
//         // Protocol Recovery: Rollback Supabase identity if DB commit fails
//         await supabaseAdmin.auth.admin.deleteUser(userId);
//         return { success: false, error: 'Hub synchronization failed. Transactional rollback triggered.' };
//     }
// }




// "use server";

// import { prisma } from "@/lib/prisma";
// import { createClient } from "@supabase/supabase-js";
// import { Role, ActivityType } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { logActivity } from "@/app/actions/activitylog";
// import { toTitleCase } from "@/lib/utils/formatters";

// // ── Types ───────────────────────────────────────────────────────────────────

// interface AdminData {
//     name: string;
//     email: string;
//     password?: string;
// }

// interface HubData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
// }

// // ── Registry Fetching Protocols (Tier 1) ────────────────────────────────────

// /**
//  * GET CURRICULA
//  * Rule 4: Fetches Tier-1 Global Core curriculum blueprints.
//  */
// export async function getCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null },
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: 'asc' },
//         });
//         return { success: true, data: curricula };
//     } catch (err: unknown) {
//         console.error("[REGISTRY_BLUEPRINT_FAULT]:", getErrorMessage(err));
//         return { success: false, data: [], error: "Failed to fetch curriculum registry." };
//     }
// }

// // ── Hub Provisioning Protocol (Tier 2) ──────────────────────────────────────

// /**
//  * COMPLETE ONBOARDING
//  * Rule 5: Anchors institutional branding to the School Hub.
//  * Rule 11: Atomic transaction ensures absolute registry consistency.
//  */
// export async function completeOnboarding(
//     adminData: AdminData,
//     schoolData: HubData,
//     paymentReference: string,
//     plan: string
// ): Promise<{ success: boolean; error?: string }> {

//     const supabaseAdmin = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.SUPABASE_SERVICE_ROLE_KEY!
//     );

//     // 1. Identity Pre-Verification
//     const existingProfile = await prisma.profile.findFirst({
//         where: { email: adminData.email },
//     });
    
//     if (existingProfile) {
//         return { success: false, error: 'Identity Protocol Conflict: Email already synchronized.' };
//     }

//     // 2. Provision Security Profile
//     const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
//             email: adminData.email,
//             password: adminData.password,
//             email_confirm: false,
//             user_metadata: {
//                 name: adminData.name,
//                 role: Role.SCHOOL_ADMIN,
//             },
//         });

//     if (authError || !authData.user) {
//         return { success: false, error: authError?.message ?? 'Security provisioning failure.' };
//     }

//     const userId = authData.user.id;

//     try {
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Blueprint Sync Failure: Curriculum not found.' };
//         }

//         // 3. ATOMIC REGISTRY TRANSACTION (Rule 11)
//         const result = await prisma.$transaction(async (tx) => {
            
//             // A. Create the Institutional Hub (Tier 2 Anchor)
//             const school = await tx.school.create({
//                 data: {
//                     name: schoolData.schoolName,
//                     curriculumId: curriculum.id,
//                     // ✅ Permanent Branding Storage (Institutional Tier)
//                     primaryColor: schoolData.primaryColor,
//                     secondaryColor: schoolData.secondaryColor,
//                     whatsappCredits: plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
//                     subscription: {
//                         create: {
//                             plan,
//                             status: 'active',
//                             currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//                         },
//                     },
//                 },
//             });

//             // B. Create the Admin Identity Profile (Tier 3)
//             const profile = await tx.profile.create({
//                 data: {
//                     id: userId,
//                     email: adminData.email,
//                     name: adminData.name,
//                     role: Role.SCHOOL_ADMIN,
//                     schoolId: school.id,
//                     curriculumId: curriculum.id,
//                 },
//             });

//             return { school, profile };
//         });

//         // 4. Registry Logging (Rule 11)
//         await logActivity({
//             schoolId: result.school.id,
//             actorId: result.profile.id,
//             actorRole: result.profile.role,
//             type: ActivityType.SETTINGS_UPDATED,
//             title: 'Institutional Hub Initialized',
//             description: `Provisioned Hub: ${schoolData.schoolName}. Tier: ${plan}`
//         });

//         // 5. Handshake Protocol: Resend Security Confirmation
//         await supabaseAdmin.auth.resend({
//             type: 'signup',
//             email: adminData.email,
//             options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm` },
//         });

//         return { success: true };

//     } catch (err: unknown) {
//         console.error('[HUB_INIT_CRITICAL_FAULT]:', getErrorMessage(err));
        
//         // Protocol Recovery: Delete Supabase user if DB sync fails
//         await supabaseAdmin.auth.admin.deleteUser(userId);
//         return { success: false, error: 'Registry synchronization failed. Rollback initiated.' };
//     }
// }

// /**
//  * VERIFY PAYSTACK PAYMENT
//  * Rule 11: Server-side validation of transaction truth.
//  */
// export async function verifyPaystackPayment(reference: string) {
//     try {
//         const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//             headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
//         });

//         const json = await res.json();
//         if (!json.status || json.data?.status !== 'success') {
//             return { success: false, error: 'Payment verification protocol failed.' };
//         }

//         return { success: true, reference };
//     } catch (err: unknown) {
//         return { success: false, error: "Gateway connection timeout." };
//     }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { createClient } from "@supabase/supabase-js";
// import { Role, ActivityType } from "@prisma/client";
// import { getErrorMessage } from "@/lib/error-handler";
// import { logActivity } from "@/app/actions/activitylog";

// interface AdminData {
//     name: string;
//     email: string;
//     password?: string;
// }

// interface HubData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
// }

// export async function getCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null },
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: 'asc' },
//         });
//         return { success: true, data: curricula };
//     } catch (err: unknown) {
//         console.error("[REGISTRY_BLUEPRINT_FAULT]:", getErrorMessage(err));
//         return { success: false, data: [], error: "Failed to fetch curriculum registry." };
//     }
// }

// export async function completeOnboarding(
//     adminData: AdminData,
//     schoolData: HubData,
//     paymentReference: string,
//     plan: string
// ): Promise<{ success: boolean; error?: string }> {

//     const supabaseAdmin = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.SUPABASE_SERVICE_ROLE_KEY!
//     );

//     // 1. Identity Pre-Verification
//     const existingProfile = await prisma.profile.findFirst({
//         where: { email: adminData.email },
//     });

//     if (existingProfile) {
//         return { success: false, error: 'This email is already registered.' };
//     }

//     // 2. Provision Supabase Auth User
//     //    email_confirm: false → Supabase automatically sends a confirmation
//     //    email using the redirect URL configured in your Supabase dashboard.
//     //    Do NOT call resend() after this — the email is already in flight.
//     const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
//         email: adminData.email,
//         password: adminData.password,
//         email_confirm: false,
//         user_metadata: {
//             name: adminData.name,
//             role: Role.SCHOOL_ADMIN,
//         },
//     });

//     if (authError || !authData.user) {
//         return { success: false, error: authError?.message ?? 'Failed to create user account.' };
//     }

//     const userId = authData.user.id;

//     const { error: emailError } = await supabaseAdmin.auth.resend({
//         type: 'signup',
//         email: adminData.email,
//         options: {
//             emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//         },
//     });

//     if (emailError) {
//         console.error('[CONFIRMATION_EMAIL_FAULT]:', emailError.message);
//         // Don't return error here — user is created, DB transaction should still proceed
//         // The resend button on screen handles recovery
//     }

//     try {
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             // Clean up the Supabase user since we can't proceed
//             const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
//             if (deleteError) {
//                 console.error('[ROLLBACK_FAULT] Orphaned Supabase user after missing curriculum:', userId, deleteError.message);
//             }
//             return { success: false, error: 'Selected curriculum not found.' };
//         }

//         // 3. Atomic DB Transaction
//         const result = await prisma.$transaction(async (tx) => {
//             const school = await tx.school.create({
//                 data: {
//                     name: schoolData.schoolName,
//                     curriculumId: curriculum.id,
//                     primaryColor: schoolData.primaryColor,
//                     secondaryColor: schoolData.secondaryColor,
//                     whatsappCredits: plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
//                     subscription: {
//                         create: {
//                             plan,
//                             status: 'active',
//                             currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
//                         },
//                     },
//                 },
//             });

//             const profile = await tx.profile.create({
//                 data: {
//                     id: userId,
//                     email: adminData.email,
//                     name: adminData.name,
//                     role: Role.SCHOOL_ADMIN,
//                     schoolId: school.id,
//                     curriculumId: curriculum.id,
//                 },
//             });

//             return { school, profile };
//         });

//         // 4. Activity Log
//         await logActivity({
//             schoolId: result.school.id,
//             actorId: result.profile.id,
//             actorRole: result.profile.role,
//             type: ActivityType.SETTINGS_UPDATED,
//             title: 'Institutional Hub Initialized',
//             description: `Provisioned Hub: ${schoolData.schoolName}. Tier: ${plan}`,
//         });

//         return { success: true };

//     } catch (err: unknown) {
//         console.error('[HUB_INIT_CRITICAL_FAULT]:', getErrorMessage(err));

//         // Rollback: remove the Supabase user so the email can be reused
//         const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);
//         if (deleteError) {
//             console.error('[ROLLBACK_FAULT] Orphaned Supabase user after DB failure:', userId, deleteError.message);
//         }

//         return { success: false, error: 'Registration failed. Please try again.' };
//     }
// }

// export async function verifyPaystackPayment(reference: string) {
//     try {
//         const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//             headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
//         });

//         const json = await res.json();
//         if (!json.status || json.data?.status !== 'success') {
//             return { success: false, error: 'Payment verification failed.' };
//         }

//         return { success: true, reference };
//     } catch (err: unknown) {
//         return { success: false, error: 'Payment gateway timeout.' };
//     }
// }



// 


"use server";

import { prisma } from "@/lib/prisma";
import { supabaseAdmin } from "@/lib/supabase/admin"; // Using your custom admin client
import { Role, ActivityType } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";
import { logActivity } from "@/app/actions/activitylog";

interface AdminData {
    name: string;
    email: string;
    password?: string;
}

interface HubData {
    schoolName: string;
    curriculumId: string;
    primaryColor: string;
    secondaryColor: string;
}

/**
 * FETCH CURRICULA
 * Rule: Standardized registry retrieval
 */
export async function getCurricula() {
    try {
        const curricula = await prisma.curriculum.findMany({
            where: { schoolId: null },
            select: { id: true, name: true, yearLabel: true, termLabel: true },
            orderBy: { name: 'asc' },
        });
        return { success: true, data: curricula };
    } catch (err) {
        return { success: false, data: [], error: getErrorMessage(err) };
    }
}

/**
 * COMPLETE ONBOARDING
 * Logic: Atomic transaction ensuring data consistency post-payment.
 * Bug Fix: Replaced getUserByEmail with listUsers audit.
 * Bug Fix: Corrected 'reference' to 'paystackReference'.
 */
export async function completeOnboarding(
    adminData: AdminData,
    schoolData: HubData,
    paymentReference: string,
    plan: string
): Promise<{ success: boolean; error?: string }> {

    try {
        // 1. IDEMPOTENCY CHECK: Ensure this specific payment hasn't already provisioned a school
        const existingPayment = await prisma.subscription.findFirst({
            where: { paystackReference: paymentReference }
        });
        
        // If payment already exists in DB, we've already done this. Return success to allow redirect.
        if (existingPayment) return { success: true };

        // 2. IDENTITY AUDIT: Find if Supabase Auth user already exists (v2 Admin SDK Fix)
        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw new Error("Terminal Audit Failed: Could not reach identity registry.");

        const existingAuthUser = users.find(u => u.email?.toLowerCase() === adminData.email.toLowerCase());
        
        let userId: string;

        if (existingAuthUser) {
            userId = existingAuthUser.id;
        } else {
            // 3. PROVISION AUTH USER: Only if they don't exist
            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: adminData.email,
                password: adminData.password,
                email_confirm: false,
                user_metadata: { 
                    name: adminData.name, 
                    role: Role.SCHOOL_ADMIN 
                },
            });

            if (authError || !authData.user) {
                throw new Error(authError?.message || "Identity Provisioning Protocol Failed.");
            }
            userId = authData.user.id;
        }

        // 4. ATOMIC DB TRANSACTION
        const result = await prisma.$transaction(async (tx) => {
            
            // Provision Institutional Hub
            const school = await tx.school.create({
                data: {
                    name: schoolData.schoolName,
                    curriculumId: schoolData.curriculumId,
                    primaryColor: schoolData.primaryColor,
                    secondaryColor: schoolData.secondaryColor,
                    whatsappCredits: plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
                    subscription: {
                        create: {
                            plan,
                            status: 'active',
                            paystackReference: paymentReference,
                            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                        },
                    },
                },
            });

            // Provision/Update Profile (Linking Auth User to School)
            const profile = await tx.profile.upsert({
                where: { id: userId },
                update: {
                    schoolId: school.id,
                    curriculumId: schoolData.curriculumId,
                    role: Role.SCHOOL_ADMIN,
                },
                create: {
                    id: userId,
                    email: adminData.email,
                    name: adminData.name,
                    role: Role.SCHOOL_ADMIN,
                    schoolId: school.id,
                    curriculumId: schoolData.curriculumId,
                },
            });

            return { school, profile };
        });

        // 5. DISPATCH ACTIVATION EMAIL
        await supabaseAdmin.auth.resend({
            type: 'signup',
            email: adminData.email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
            },
        });

        // 6. LOG INITIALIZATION
        await logActivity({
            schoolId: result.school.id,
            actorId: result.profile.id,
            actorRole: result.profile.role,
            type: ActivityType.SETTINGS_UPDATED,
            title: 'Hub Provisioned',
            description: `Registry synchronized for ${schoolData.schoolName}. Tier: ${plan}`,
        });

        return { success: true };

    } catch (err) {
        console.error('[ONBOARDING_CRITICAL_FAULT]:', getErrorMessage(err));

        return { 
            success: false, 
            error: getErrorMessage(err) 
        };
    }
}

/**
 * VERIFY PAYSTACK PAYMENT
 */
export async function verifyPaystackPayment(reference: string) {
    try {
        const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { 
                Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json'
            },
        });

        const json = await res.json();
        if (!json.status || json.data?.status !== 'success') {
            return { success: false, error: 'Payment verification protocol failed.' };
        }

        return { success: true, reference };
    } catch (err) {
        getErrorMessage(err)
        return { success: false, error: 'Gateway timeout.' };
    }
}

/**
 * UPDATE ONBOARDING EMAIL
 * Logic: Allows paid users to correct email typos and re-trigger activation.
 */
export async function updateOnboardingEmail(
    oldEmail: string, 
    newEmail: string, 
    paymentReference: string
) {
    try {
        // 1. Verification Check: Match old email to the payment reference
        const profile = await prisma.profile.findFirst({
            where: { email: oldEmail },
            include: { school: { include: { subscription: true } } }
        });

        if (!profile || profile.school?.subscription?.paystackReference !== paymentReference) {
            return { success: false, error: "Identity Update Denied: Reference mismatch." };
        }

        // 2. Update Supabase Auth Registry
        const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            profile.id,
            { email: newEmail }
        );
        if (authError) throw authError;

        // 3. Update Prisma Profile Hub
        await prisma.profile.update({
            where: { id: profile.id },
            data: { email: newEmail }
        });

        // 4. Dispatch New Activation Protocol
        await supabaseAdmin.auth.resend({
            type: 'signup',
            email: newEmail,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
            },
        });

        return { success: true };
    } catch (err) {
        console.error("[EMAIL_CORRECTION_FAULT]:", getErrorMessage(err));
        return { success: false, error: "Registry identity update failed." };
    }
}