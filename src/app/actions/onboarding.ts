// 'use server';

// import { prisma } from '@/lib/prisma';
// import { createServerClient, CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { Role } from '@/generated/prisma/client';

// // ─── Types ────────────────────────────────────────────────────────────────────

// export interface AdminFormData {
//     name: string;
//     email: string;
//     password: string;
//     phone?: string;
// }

// export interface SchoolFormData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
//     country: string;
//     timezone: string;
// }

// export interface OnboardingResult {
//     success: boolean;
//     error?: string;
//     data?: any;
// }

// // ─── Step 1: Register Admin ───────────────────────────────────────────────────

// export async function registerAdmin(data: AdminFormData): Promise<OnboardingResult> {
//     try {
//         const cookieStore = await cookies();
        
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 get: (name: string) => cookieStore.get(name)?.value,
//                 set: (name: string, value: string, options: CookieOptions) => {
//                     cookieStore.set({ name, value, ...options });
//                 },
//                 remove: (name: string, options: CookieOptions) => { // Corrected
//                     cookieStore.delete({ name, ...options });  // Corrected
//                 },
//             },
//         }
//     );

//         // Check if email already exists
//         const existing = await prisma.profile.findUnique({
//             where: { email: data.email },
//         });
//         if (existing) {
//             return { success: false, error: 'An account with this email already exists.' };
//         }

//         const { data: authData, error } = await supabase.auth.signUp({
//             email: data.email,
//             password: data.password,
//             options: {
//                 data: {
//                     name: data.name,
//                     role: 'SCHOOL_ADMIN',
//                     // schoolId and curriculumId are set in step 3
//                 },
//             },
//         });

//         if (error) return { success: false, error: error.message };
//         return { success: true, data: { userId: authData.user?.id, email: data.email } };
//     } catch (err: any) {
//         console.error('registerAdmin error:', err);
//         return { success: false, error: 'Something went wrong. Please try again.' };
//     }
// }

// // ─── Step 2: Verify Payment ───────────────────────────────────────────────────

// export async function verifyPaystackPayment(reference: string): Promise<OnboardingResult> {
//     try {
//         const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//             },
//         });

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
//     } catch (err: any) {
//         return { success: false, error: 'Could not verify payment.' };
//     }
// }

// export async function verifyStripePayment(sessionId: string): Promise<OnboardingResult> {
//     try {
//         const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
//             },
//         });

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
//     } catch (err: any) {
//         return { success: false, error: 'Could not verify Stripe payment.' };
//     }
// }

// // ─── Step 3: Provision School Tenant ──────────────────────────────────────────

// export async function provisionSchool(
//     adminEmail: string,
//     schoolData: SchoolFormData,
//     paymentRef: string,
//     plan: string
// ): Promise<OnboardingResult> {
//     try {
//         // Get or create a curriculum
//         let curriculum = await prisma.curriculum.findFirst({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             return { success: false, error: 'Selected curriculum not found.' };
//         }

//         // Create the school
//         const school = await prisma.school.create({
//             data: {
//                 name: schoolData.schoolName,
//                 curriculumId: curriculum.id,
//                 primaryColor: schoolData.primaryColor,
//                 secondaryColor: schoolData.secondaryColor,
//                 whatsappCredits: plan === 'pro' ? 500 : plan === 'enterprise' ? 2000 : 100,
//                 subscription: {
//                     create: {
//                         plan,
//                         status: 'active',
//                         currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
//                     },
//                 },
//             },
//         });

//         // Update the admin profile with schoolId and curriculumId
//         await prisma.profile.update({
//             where: { email: adminEmail },
//             data: {
//                 schoolId: school.id,
//                 curriculumId: curriculum.id,
//                 role: Role.SCHOOL_ADMIN,
//             },
//         });

//         return {
//             success: true,
//             data: { schoolId: school.id, schoolName: school.name },
//         };
//     } catch (err: any) {
//         console.error('provisionSchool error:', err);
//         return { success: false, error: 'Failed to create your school workspace.' };
//     }
// }

// // ─── Fetch Curricula for Step 3 dropdown ─────────────────────────────────────

// export async function getCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null }, // Global/template curricula only
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: 'asc' },
//         });
//         return { success: true, data: curricula };
//     } catch {
//         return { success: false, data: [] };
//     }
// }


// // app/actions/onboarding.ts
// 'use server';

// import { prisma } from '@/lib/prisma';
// import { createServerClient, CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { Role } from '@/generated/prisma/client';
// import { AdminFormData, SchoolFormData } from '@/types/onboarding';

// // Add this to the end of app/actions/onboarding.ts
// export async function getCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null }, // Global template curricula only
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: 'asc' },
//         });
//         return { success: true, data: curricula };
//     } catch {
//         return { success: false, data: [] };
//     }
// }

// // Add to app/actions/onboarding.ts

// export async function verifyPaystackPayment(reference: string): Promise<{ success: boolean; error?: string; data?: any }> {
//     try {
//         const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//             },
//         });

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

// export async function verifyStripePayment(sessionId: string): Promise<{ success: boolean; error?: string; data?: any }> {
//     try {
//         const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
//             },
//         });

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

// // Single atomic function that does everything at the end
// export async function completeOnboarding(
//     adminData: AdminFormData,
//     schoolData: SchoolFormData,
//     paymentReference: string,
//     plan: string
// ): Promise<{ success: boolean; error?: string }> {
//     const cookieStore = await cookies();
    
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 get: (name: string) => cookieStore.get(name)?.value,
//                 set: (name: string, value: string, options: CookieOptions) => {
//                     cookieStore.set({ name, value, ...options });
//                 },
//                 remove: (name: string, options: CookieOptions) => { // Corrected
//                     cookieStore.delete({ name, ...options });  // Corrected
//                 },
//             },
//         }
//     );

//     // Step 1: Check email not already taken
//     const existing = await prisma.profile.findUnique({
//         where: { email: adminData.email },
//     });
//     if (existing) {
//         return { success: false, error: 'An account with this email already exists.' };
//     }

//     // Step 2: Create Supabase auth user
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: adminData.email,
//         password: adminData.password,
//         options: {
//             data: {
//                 name: adminData.name,
//                 role: 'SCHOOL_ADMIN',
//             },
//         },
//     });

//     if (authError || !authData.user) {
//         return { success: false, error: authError?.message ?? 'Failed to create account.' };
//     }

//     const userId = authData.user.id;

//     try {
//         // Step 3: Get curriculum
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });
//         if (!curriculum) {
//             // Rollback: delete the auth user we just created
//             await supabase.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Selected curriculum not found.' };
//         }

//         // Step 4: Create school + subscription in one transaction
//         const school = await prisma.school.create({
//             data: {
//                 name: schoolData.schoolName,
//                 curriculumId: curriculum.id,
//                 primaryColor: schoolData.primaryColor,
//                 secondaryColor: schoolData.secondaryColor,
//                 whatsappCredits: plan === 'pro' ? 500 : plan === 'enterprise' ? 2000 : 100,
//                 subscription: {
//                     create: {
//                         plan,
//                         status: 'active',
//                         currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
//                     },
//                 },
//             },
//         });

//         // Step 5: Update the profile the trigger created with schoolId
//         // The trigger fires when auth user is created, so profile should exist now
//         await prisma.profile.upsert({
//             where: { email: adminData.email },
//             update: {
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

//         // Step 6: Sign user in automatically
//         const { error: signInError } = await supabase.auth.signInWithPassword({
//             email: adminData.email,
//             password: adminData.password,
//         });

//         if (signInError) {
//             // Account created successfully, just couldn't auto sign-in
//             // Not a critical failure — they can log in manually
//             console.warn('Auto sign-in failed:', signInError.message);
//         }

//         return { success: true };

//     } catch (err: any) {
//         // Rollback: delete auth user if DB operations failed
//         console.error('completeOnboarding DB error:', err);
//         await supabase.auth.admin.deleteUser(userId);
//         return { success: false, error: 'Failed to set up your workspace. Please try again.' };
//     }
// }


// // app/actions/onboarding.ts
// 'use server';

// import { prisma } from '@/lib/prisma';
// import { createServerClient, CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';
// import { Role } from '@/generated/prisma/client';
// import { AdminFormData, SchoolFormData } from '@/types/onboarding';
// import { createClient } from '@supabase/supabase-js';

// export async function getCurricula() {
//     try {
//         const curricula = await prisma.curriculum.findMany({
//             where: { schoolId: null }, // Global template curricula only
//             select: { id: true, name: true, yearLabel: true, termLabel: true },
//             orderBy: { name: 'asc' },
//         });
//         return { success: true, data: curricula };
//     } catch {
//         return { success: false, data: [] };
//     }
// }

// export async function verifyPaystackPayment(reference: string): Promise<{ success: boolean; error?: string; data?: any }> {
//     try {
//         const res = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//             },
//         });

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

// export async function verifyStripePayment(sessionId: string): Promise<{ success: boolean; error?: string; data?: any }> {
//     try {
//         const res = await fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
//             headers: {
//                 Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
//             },
//         });

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

// // Single atomic function that does everything at the end
// export async function completeOnboarding(
//     adminData: AdminFormData,
//     schoolData: SchoolFormData,
//     paymentReference: string,
//     plan: string
// ): Promise<{ success: boolean; error?: string }> {
//     const cookieStore = await cookies();
    
//     // Client for standard auth operations
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 get: (name: string) => cookieStore.get(name)?.value,
//                 set: (name: string, value: string, options: CookieOptions) => {
//                     cookieStore.set({ name, value, ...options });
//                 },
//                 remove: (name: string, options: CookieOptions) => {
//                     cookieStore.delete({ name, ...options });
//                 },
//             },
//         }
//     );

//     // Client specifically for Admin Rollbacks (deleting a user if Prisma fails)
//     const supabaseAdmin = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.SUPABASE_SERVICE_ROLE_KEY! // Make sure this is in your .env.local
//     );

//     // Step 1: Check email not already taken
//     const existing = await prisma.profile.findUnique({
//         where: { email: adminData.email },
//     });
    
//     if (existing) {
//         return { success: false, error: 'An account with this email already exists.' };
//     }

//     // Step 2: Create Supabase auth user
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: adminData.email,
//         password: adminData.password,
//         options: {
//             data: {
//                 name: adminData.name,
//                 role: 'SCHOOL_ADMIN',
//             },
//         },
//     });

//     if (authError || !authData.user) {
//         return { success: false, error: authError?.message ?? 'Failed to create account.' };
//     }

//     const userId = authData.user.id;

//     try {
//         // Step 3: Get curriculum
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });
        
//         if (!curriculum) {
//             // Rollback auth user
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Selected curriculum not found.' };
//         }

//         // Step 4: Create school AND subscription in one transaction
//         const school = await prisma.school.create({
//             data: {
//                 name: schoolData.schoolName,
//                 curriculumId: curriculum.id,
//                 primaryColor: schoolData.primaryColor,
//                 secondaryColor: schoolData.secondaryColor,
//                 whatsappCredits: plan === 'pro' ? 500 : plan === 'enterprise' ? 2000 : 100,
//                 subscription: {
//                     create: {
//                         plan: plan,
//                         status: 'active',
//                         // 14-day trial as mentioned in UI
//                         currentPeriodEnd: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), 
//                     },
//                 },
//             },
//         });

//         // Step 5: Update the profile 
//         await prisma.profile.upsert({
//             where: { email: adminData.email },
//             update: {
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

//         // Step 6: Sign user in automatically
//         const { error: signInError } = await supabase.auth.signInWithPassword({
//             email: adminData.email,
//             password: adminData.password,
//         });

//         if (signInError) {
//             console.warn('Auto sign-in failed:', signInError.message);
//         }

//         return { success: true };

//     } catch (err: any) {
//         console.error('completeOnboarding DB error:', err);
//         // Rollback: delete auth user if DB operations failed
//         if (userId) {
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//         }
//         return { success: false, error: 'Failed to set up your workspace. Please try again.' };
//     }
// }

// 'use server';

// import { prisma } from '@/lib/prisma';
// import { createServerClient, CookieOptions } from '@supabase/ssr';
// import { createClient } from '@supabase/supabase-js';
// import { cookies } from 'next/headers';
// import { Role } from '@/generated/prisma/client';
// import { AdminFormData, SchoolFormData } from '@/types/onboarding';

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
//     } catch (err: any) {
//         console.error('Paystack init error:', err);
//         return { success: false, error: 'Could not connect to Paystack.' };
//     }
// }

// export async function verifyPaystackPayment(
//     reference: string
// ): Promise<{ success: boolean; error?: string; data?: any }> {
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
// ): Promise<{ success: boolean; error?: string; data?: any }> {
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
//     const cookieStore = await cookies();

//     // Standard client for auth operations (respects cookies/session)
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll: () => cookieStore.getAll(),
//                 setAll: (cookiesToSet) => {
//                     cookiesToSet.forEach(({ name, value, options }) => {
//                         cookieStore.set(name, value, options);
//                     });
//                 },
//             },
//         }
//     );

//     // Admin client for rollbacks (uses service role key — server only)
//     const supabaseAdmin = createClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.SUPABASE_SERVICE_ROLE_KEY!
//     );

//     // ── Step 1: Guard against duplicate emails ────────────────────────────────
//     const existing = await prisma.profile.findUnique({
//         where: { email: adminData.email },
//     });
//     if (existing) {
//         return { success: false, error: 'An account with this email already exists.' };
//     }

//     // ── Step 2: Create Supabase auth user ─────────────────────────────────────
//     // emailRedirectTo tells Supabase where to send the user after email confirmation
//     const { data: authData, error: authError } = await supabase.auth.signUp({
//         email: adminData.email,
//         password: adminData.password,
//         options: {
//             data: {
//                 name: adminData.name,
//                 role: 'SCHOOL_ADMIN',
//             },
//             emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//         },
//     });

//     if (authError || !authData.user) {
//         return {
//             success: false,
//             error: authError?.message ?? 'Failed to create account.',
//         };
//     }

//     const userId = authData.user.id;

//     try {
//         // ── Step 3: Validate curriculum ───────────────────────────────────────
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Selected curriculum not found.' };
//         }

//         // ── Step 4: Create school + subscription atomically ───────────────────
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
//                             Date.now() + 14 * 24 * 60 * 60 * 1000 // 14-day trial
//                         ),
//                     },
//                 },
//             },
//         });

//         // ── Step 5: Upsert profile ────────────────────────────────────────────
//         // upsert handles both cases:
//         // a) Trigger already created the profile → update with schoolId
//         // b) Trigger didn't fire → create profile from scratch
//         await prisma.profile.upsert({
//             where: { email: adminData.email },
//             update: {
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

//         // ── Step 6: NO sign-in here ───────────────────────────────────────────
//         // User must confirm their email first.
//         // Supabase will send a confirmation email automatically on signUp.
//         // After clicking the link they hit /auth/confirm which establishes
//         // their session and redirects them to /admin/dashboard.

//         return { success: true };

//     } catch (err: any) {
//         console.error('completeOnboarding DB error:', err);
//         // Rollback: delete the auth user so they can try again cleanly
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
// import { PrismaClient, Role } from "@prisma/client";
// import { AdminFormData, SchoolFormData } from '@/types/onboarding';

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
//     } catch (err: any) {
//         console.error('Paystack init error:', err);
//         return { success: false, error: 'Could not connect to Paystack.' };
//     }
// }

// export async function verifyPaystackPayment(
//     reference: string
// ): Promise<{ success: boolean; error?: string; data?: any }> {
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
// ): Promise<{ success: boolean; error?: string; data?: any }> {
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

//     // ── Step 1: Guard against duplicate emails ────────────────────────────────
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

//     // ── Step 2: Create Supabase auth user via admin API ───────────────────────
//     // email_confirm: false = user is created but must confirm email before
//     // logging in. Supabase will mark them as unconfirmed.
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
//         // ── Step 3: Validate curriculum ───────────────────────────────────────
//         const curriculum = await prisma.curriculum.findUnique({
//             where: { id: schoolData.curriculumId },
//         });

//         if (!curriculum) {
//             await supabaseAdmin.auth.admin.deleteUser(userId);
//             return { success: false, error: 'Selected curriculum not found.' };
//         }

//         // ── Step 4: Create school + subscription atomically ───────────────────
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

//         // ── Step 5: Create profile ────────────────────────────────────────────
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

//         // ── Step 6: Trigger Supabase confirmation email ───────────────────────
//         // admin.createUser with email_confirm:false creates the user but does
//         // NOT send the confirmation email automatically.
//         // supabaseAdmin.auth.resend() is the correct API to trigger it — it sends
//         // Supabase's built-in confirmation email to any address (no Resend needed).
//         const { error: resendError } = await supabaseAdmin.auth.resend({
//             type: 'signup',
//             email: adminData.email,
//             options: {
//                 emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
//             },
//         });

//         if (resendError) {
//             console.error('Confirmation email error:', resendError.message);
//             // Soft failure — workspace was created. Admin can use
//             // "Forgot Password" to access their account if email never arrives.
//         }

//         return { success: true };

//     } catch (err: any) {
//         console.error('completeOnboarding DB error:', err);
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
// ✅ FIX 1: Removed PrismaClient (unused). Kept Role.
import { Role } from "@prisma/client"; 
import { AdminFormData, SchoolFormData } from '@/types/onboarding';
// ✅ FIX 2: Import your error handler
import { getErrorMessage } from "@/lib/error-handler";

// Define interfaces for payment data to avoid 'any'
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

// ─── Curricula ────────────────────────────────────────────────────────────────

export async function getCurricula() {
    try {
        const curricula = await prisma.curriculum.findMany({
            where: { schoolId: null },
            select: { id: true, name: true, yearLabel: true, termLabel: true },
            orderBy: { name: 'asc' },
        });
        return { success: true, data: curricula };
    } catch {
        return { success: false, data: [] };
    }
}

// ─── Paystack ─────────────────────────────────────────────────────────────────

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
    } catch (err: unknown) { // ✅ FIX 3: Changed any to unknown
        console.error('Paystack init error:', getErrorMessage(err));
        return { success: false, error: 'Could not connect to Paystack.' };
    }
}

export async function verifyPaystackPayment(
    reference: string
): Promise<{ success: boolean; error?: string; data?: PaystackVerifyData }> { // ✅ FIX 4: Replaced any with Type
    try {
        const res = await fetch(
            `https://api.paystack.co/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                },
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
    } catch {
        return { success: false, error: 'Could not verify payment.' };
    }
}

// ─── Stripe ───────────────────────────────────────────────────────────────────

export async function verifyStripePayment(
    sessionId: string
): Promise<{ success: boolean; error?: string; data?: StripeVerifyData }> { // ✅ FIX 5: Replaced any with Type
    try {
        const res = await fetch(
            `https://api.stripe.com/v1/checkout/sessions/${sessionId}`,
            {
                headers: {
                    Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                },
            }
        );

        const session = await res.json();
        if (session.payment_status !== 'paid') {
            return { success: false, error: 'Payment not completed.' };
        }

        return {
            success: true,
            data: {
                sessionId,
                plan: session.metadata?.plan,
                amount: session.amount_total / 100,
            },
        };
    } catch {
        return { success: false, error: 'Could not verify Stripe payment.' };
    }
}

// ─── Complete Onboarding ──────────────────────────────────────────────────────

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

    const existingProfile = await prisma.profile.findUnique({
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

    const { data: authData, error: authError } =
        await supabaseAdmin.auth.admin.createUser({
            email: adminData.email,
            password: adminData.password,
            email_confirm: false,
            user_metadata: {
                name: adminData.name,
                role: 'SCHOOL_ADMIN',
            },
        });

    if (authError || !authData.user) {
        if (authError?.message?.includes('already been registered')) {
            return { success: false, error: 'An account with this email already exists.' };
        }
        return {
            success: false,
            error: authError?.message ?? 'Failed to create account.',
        };
    }

    const userId = authData.user.id;

    try {
        const curriculum = await prisma.curriculum.findUnique({
            where: { id: schoolData.curriculumId },
        });

        if (!curriculum) {
            await supabaseAdmin.auth.admin.deleteUser(userId);
            return { success: false, error: 'Selected curriculum not found.' };
        }

        const school = await prisma.school.create({
            data: {
                name: schoolData.schoolName,
                curriculumId: curriculum.id,
                primaryColor: schoolData.primaryColor,
                secondaryColor: schoolData.secondaryColor,
                whatsappCredits:
                    plan === 'enterprise' ? 2000 : plan === 'pro' ? 500 : 100,
                subscription: {
                    create: {
                        plan,
                        status: 'active',
                        currentPeriodEnd: new Date(
                            Date.now() + 14 * 24 * 60 * 60 * 1000
                        ),
                    },
                },
            },
        });

        await prisma.profile.upsert({
            where: { email: adminData.email },
            update: {
                id: userId,
                schoolId: school.id,
                curriculumId: curriculum.id,
                name: adminData.name,
                role: Role.SCHOOL_ADMIN,
            },
            create: {
                id: userId,
                email: adminData.email,
                name: adminData.name,
                role: Role.SCHOOL_ADMIN,
                schoolId: school.id,
                curriculumId: curriculum.id,
            },
        });

        const { error: resendError } = await supabaseAdmin.auth.resend({
            type: 'signup',
            email: adminData.email,
            options: {
                emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/confirm`,
            },
        });

        if (resendError) {
            console.error('Confirmation email error:', resendError.message);
        }

        return { success: true };

    } catch (err: unknown) { // ✅ FIX 6: Changed any to unknown
        console.error('completeOnboarding DB error:', getErrorMessage(err));
        await supabaseAdmin.auth.admin.deleteUser(userId);
        return {
            success: false,
            error: 'Failed to set up your workspace. Please try again.',
        };
    }
}