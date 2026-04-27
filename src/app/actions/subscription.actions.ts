// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface SubscriptionPlan {
//     id:           string
//     name:         string
//     slug:         string
//     priceNGN:     number
//     priceKobo:    number
//     priceUSD:     number
//     durationDays: number
//     description:  string
//     features:     string[]
//     popular:      boolean
//     sortOrder:    number
// }

// export interface PaymentHistoryEntry {
//     id:        string
//     planName:  string
//     amountNGN: number
//     status:    'PENDING' | 'SUCCESS' | 'FAILED'
//     paidAt:    Date | null
//     createdAt: Date
// }

// export interface SubscriptionWithHistory {
//     id:               string
//     plan:             string
//     status:           string
//     currentPeriodEnd: Date
//     amountNGN:        number | null
//     paidAt:           Date | null
//     subPlan: {
//         name:         string
//         priceNGN:     number
//         durationDays: number
//         description:  string
//         features:     string[]
//     } | null
//     transactions: PaymentHistoryEntry[]
// }

// // ── Get active plans ───────────────────────────────────────────────────────────

// export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
//     try {
//         return await prisma.subscriptionPlan.findMany({
//             where:   { active: true },
//             orderBy: { sortOrder: 'asc' },
//             select: {
//                 id:           true,
//                 name:         true,
//                 slug:         true,
//                 priceNGN:     true,
//                 priceKobo:    true,
//                 priceUSD:     true,
//                 durationDays: true,
//                 description:  true,
//                 features:     true,
//                 popular:      true,
//                 sortOrder:    true,
//             },
//         })
//     } catch (err) {
//         console.error('getSubscriptionPlans error:', getErrorMessage(err))
//         return []
//     }
// }

// // ── Get subscription with transaction history ──────────────────────────────────

// export async function getSchoolSubscription(
//     schoolId: string
// ): Promise<SubscriptionWithHistory | null> {
//     try {
//         const sub = await prisma.subscription.findUnique({
//             where:  { schoolId },
//             select: {
//                 id:               true,
//                 plan:             true,
//                 status:           true,
//                 currentPeriodEnd: true,
//                 amountNGN:        true,
//                 paidAt:           true,
//                 subPlan: {
//                     select: {
//                         name:         true,
//                         priceNGN:     true,
//                         durationDays: true,
//                         description:  true,
//                         features:     true,
//                     },
//                 },
//                 // ✅ Payment history from SubscriptionTransaction table
//                 transactions: {
//                     orderBy: { createdAt: 'desc' },
//                     take:    20,
//                     select: {
//                         id:        true,
//                         planName:  true,
//                         amountNGN: true,
//                         status:    true,
//                         paidAt:    true,
//                         createdAt: true,
//                     },
//                 },
//             },
//         })

//         if (!sub) return null

//         return {
//             ...sub,
//             transactions: sub.transactions.map(t => ({
//                 ...t,
//                 status: t.status as 'PENDING' | 'SUCCESS' | 'FAILED',
//             })),
//         }
//     } catch (err) {
//         console.error('getSchoolSubscription error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Initiate subscription payment ──────────────────────────────────────────────
// // Flow:
// // 1. Fetch plan from SubscriptionPlan table
// // 2. Create PENDING SubscriptionTransaction
// // 3. Upsert Subscription with paystackReference for deduplication
// // 4. Redirect to Paystack

// export async function initiateSubscriptionPayment(
//     schoolId: string,
//     planId:   string,
// ): Promise<{
//     success:           boolean
//     authorizationUrl?: string
//     reference?:        string
//     error?:            string
// }> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         // ✅ Fetch plan from SubscriptionPlan table
//         const plan = await prisma.subscriptionPlan.findUnique({
//             where: { id: planId },
//         })
//         if (!plan || !plan.active) {
//             return { success: false, error: 'Plan not found or inactive.' }
//         }

//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { id: true, name: true },
//         })
//         if (!school) return { success: false, error: 'School not found.' }

//         // Get initiator profile
//         const profile = await prisma.profile.findFirst({
//             where:  { email: user.email },
//             select: { id: true },
//         })

//         const reference = `sub_${schoolId}_${plan.slug}_${Date.now()}`

//         // ✅ Create PENDING record in SubscriptionTransaction
//         await prisma.subscriptionTransaction.create({
//             data: {
//                 schoolId,
//                 planId:      plan.id,
//                 planName:    plan.name,
//                 amountNGN:   plan.priceNGN,
//                 amountKobo:  plan.priceKobo,
//                 reference,
//                 status:      'PENDING',
//                 initiatedBy: profile?.id ?? user.id,
//             },
//         })

//         // ✅ Upsert Subscription with pending reference for deduplication
//         await prisma.subscription.upsert({
//             where:  { schoolId },
//             update: { paystackReference: reference },
//             create: {
//                 schoolId,
//                 plan:              plan.name,
//                 planId:            plan.id,
//                 status:            'pending',
//                 currentPeriodEnd:  new Date(),
//                 paystackReference: reference,
//             },
//         })

//         const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/settings/billing/verify?reference=${reference}`

//         const response = await fetch('https://api.paystack.co/transaction/initialize', {
//             method:  'POST',
//             headers: {
//                 Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email:    user.email,
//                 amount:   plan.priceKobo,
//                 reference,
//                 currency: 'NGN',
//                 metadata: {
//                     schoolId,
//                     planId:       plan.id,
//                     planSlug:     plan.slug,
//                     schoolName:   school.name,
//                     durationDays: plan.durationDays,
//                     custom_fields: [
//                         { display_name: 'School', variable_name: 'school', value: school.name },
//                         { display_name: 'Plan',   variable_name: 'plan',   value: plan.name   },
//                     ],
//                 },
//                 callback_url: callbackUrl,
//             }),
//         })

//         const paystackData = await response.json()
//         if (!paystackData.status) {
//             return { success: false, error: paystackData.message ?? 'Paystack error.' }
//         }

//         return {
//             success:          true,
//             authorizationUrl: paystackData.data.authorization_url,
//             reference,
//         }
//     } catch (err) {
//         console.error('initiateSubscriptionPayment error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Verify subscription payment ────────────────────────────────────────────────
// // Flow:
// // 1. Find PENDING SubscriptionTransaction by reference
// // 2. Verify with Paystack
// // 3. Update SubscriptionTransaction to SUCCESS or FAILED
// // 4. Update Subscription current state
// // 5. Send notification to admin

// export async function verifySubscriptionPayment(
//     reference: string,
// ): Promise<{
//     success:   boolean
//     planName?: string
//     expiresAt?: Date
//     error?:    string
// }> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         // ✅ Find the transaction in SubscriptionTransaction
//         const transaction = await prisma.subscriptionTransaction.findUnique({
//             where:  { reference },
//             select: {
//                 id:        true,
//                 status:    true,
//                 schoolId:  true,
//                 planId:    true,
//                 planName:  true,
//                 amountNGN: true,
//                 plan: {
//                     select: {
//                         name:         true,
//                         durationDays: true,
//                         priceNGN:     true,
//                     },
//                 },
//             },
//         })

//         if (!transaction) return { success: false, error: 'Transaction not found.' }

//         // ✅ Idempotency — already processed
//         if (transaction.status === 'SUCCESS') {
//             return { success: true, planName: transaction.planName }
//         }
//         if (transaction.status === 'FAILED') {
//             return { success: false, error: 'Payment previously failed.' }
//         }

//         // ✅ Verify with Paystack
//         const response = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 },
//             }
//         )

//         const paystackData = await response.json()
//         const paymentSucceeded =
//             paystackData.status && paystackData.data.status === 'success'

//         const now = new Date()

//         if (paymentSucceeded) {
//             const expiresAt = new Date(
//                 now.getTime() +
//                 transaction.plan.durationDays * 24 * 60 * 60 * 1000
//             )

//             // ✅ Update SubscriptionTransaction → SUCCESS
//             // ✅ Update Subscription current state
//             // Run atomically
//             await prisma.$transaction([
//                 prisma.subscriptionTransaction.update({
//                     where: { id: transaction.id },
//                     data: {
//                         status: 'SUCCESS',
//                         paidAt: now,
//                     },
//                 }),
//                 prisma.subscription.update({
//                     where: { schoolId: transaction.schoolId },
//                     data: {
//                         plan:             transaction.plan.name,
//                         planId:           transaction.planId,
//                         status:           'active',
//                         currentPeriodEnd: expiresAt,
//                         amountNGN:        transaction.plan.priceNGN,
//                         paidAt:           now,
//                     },
//                 }),
//             ])

//             // Notify admin
//             const admin = await prisma.profile.findFirst({
//                 where:  { schoolId: transaction.schoolId, role: 'SCHOOL_ADMIN' },
//                 select: { id: true },
//             })

//             if (admin) {
//                 await prisma.notification.create({
//                     data: {
//                         userId:  admin.id,
//                         message: `✅ Subscription renewed — ${transaction.plan.name} plan active until ${expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
//                         read:    false,
//                         link:    '/admin/settings?tab=billing',
//                     },
//                 })
//             }

//             revalidatePath('/admin/settings')

//             return {
//                 success:  true,
//                 planName: transaction.plan.name,
//                 expiresAt,
//             }

//         } else {
//             // ✅ Update SubscriptionTransaction → FAILED
//             await prisma.subscriptionTransaction.update({
//                 where: { id: transaction.id },
//                 data:  { status: 'FAILED' },
//             })

//             return { success: false, error: 'Payment not confirmed by Paystack.' }
//         }
//     } catch (err) {
//         console.error('verifySubscriptionPayment error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Notify expiring subscriptions (cron) ──────────────────────────────────────

// export async function notifyExpiringSubscriptions(): Promise<{ notified: number }> {
//     try {
//         const now     = new Date()
//         const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

//         // ✅ Query Subscription table for active subscriptions expiring soon
//         const expiring = await prisma.subscription.findMany({
//             where: {
//                 status:           'active',
//                 currentPeriodEnd: { lte: in7Days, gte: now },
//             },
//             select: {
//                 schoolId:         true,
//                 plan:             true,
//                 currentPeriodEnd: true,
//             },
//         })

//         let notified = 0

//         for (const sub of expiring) {
//             const daysLeft = Math.ceil(
//                 (new Date(sub.currentPeriodEnd).getTime() - now.getTime()) /
//                 (1000 * 60 * 60 * 24)
//             )

//             // Only notify at 7, 3, 1 days remaining
//             if (![7, 3, 1].includes(daysLeft)) continue

//             const admin = await prisma.profile.findFirst({
//                 where:  { schoolId: sub.schoolId, role: 'SCHOOL_ADMIN' },
//                 select: { id: true },
//             })
//             if (!admin) continue

//             // Deduplicate — skip if already notified today
//             const startOfDay = new Date(now)
//             startOfDay.setHours(0, 0, 0, 0)

//             const existing = await prisma.notification.findFirst({
//                 where: {
//                     userId:    admin.id,
//                     message:   { contains: `expires in ${daysLeft} day` },
//                     createdAt: { gte: startOfDay },
//                 },
//             })
//             if (existing) continue

//             const urgency = daysLeft === 1 ? '🚨' : daysLeft === 3 ? '⚠️' : '📅'

//             await prisma.notification.create({
//                 data: {
//                     userId:  admin.id,
//                     message: `${urgency} Your ${sub.plan} subscription expires in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} on ${new Date(sub.currentPeriodEnd).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}. Renew now to avoid interruption.`,
//                     read:    false,
//                     link:    '/admin/settings?tab=billing',
//                 },
//             })

//             notified++
//         }

//         return { notified }
//     } catch (err) {
//         console.error('notifyExpiringSubscriptions error:', getErrorMessage(err))
//         return { notified: 0 }
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { createClient } from '@/lib/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { logActivity } from '@/lib/activitylogger'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface SubscriptionPlan {
//     id:           string
//     name:         string
//     slug:         string
//     priceNGN:     number
//     priceKobo:    number
//     priceUSD:     number
//     durationDays: number
//     description:  string
//     features:     string[]
//     popular:      boolean
//     sortOrder:    number
// }

// export interface PaymentHistoryEntry {
//     id:        string
//     planName:  string
//     amountNGN: number
//     status:    'PENDING' | 'SUCCESS' | 'FAILED'
//     paidAt:    Date | null
//     createdAt: Date
// }

// export interface SubscriptionWithHistory {
//     id:               string
//     plan:             string
//     status:           string
//     currentPeriodEnd: Date
//     amountNGN:        number | null
//     paidAt:           Date | null
//     subPlan: {
//         name:         string
//         priceNGN:     number
//         durationDays: number
//         description:  string
//         features:     string[]
//     } | null
//     transactions: PaymentHistoryEntry[]
// }

// // ── Get active plans ───────────────────────────────────────────────────────────

// export async function getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
//     try {
//         return await prisma.subscriptionPlan.findMany({
//             where:   { active: true },
//             orderBy: { sortOrder: 'asc' },
//         })
//     } catch (err) {
//         console.error('getSubscriptionPlans error:', getErrorMessage(err))
//         return []
//     }
// }

// // ── Get subscription with transaction history ──────────────────────────────────

// export async function getSchoolSubscription(
//     schoolId: string
// ): Promise<SubscriptionWithHistory | null> {
//     try {
//         // ✅ FIX: Query the School model to get both the subscription AND transactions
//         const schoolData = await prisma.school.findUnique({
//             where: { id: schoolId },
//             include: {
//                 subscription: {
//                     include: {
//                         subPlan: true
//                     }
//                 },
//                 subscriptionTransactions: {
//                     orderBy: { createdAt: 'desc' },
//                     take: 20,
//                 }
//             }
//         })

//         if (!schoolData || !schoolData.subscription) return null

//         const sub = schoolData.subscription;

//         return {
//             id:               sub.id,
//             plan:             sub.plan,
//             status:           sub.status,
//             currentPeriodEnd: sub.currentPeriodEnd,
//             amountNGN:        sub.amountNGN,
//             paidAt:           sub.paidAt,
//             subPlan:          sub.subPlan,
//             transactions:     schoolData.subscriptionTransactions.map(t => ({
//                 id:        t.id,
//                 planName:  t.planName,
//                 amountNGN: t.amountNGN,
//                 status:    t.status as 'PENDING' | 'SUCCESS' | 'FAILED',
//                 paidAt:    t.paidAt,
//                 createdAt: t.createdAt
//             })),
//         }
//     } catch (err) {
//         console.error('getSchoolSubscription error:', getErrorMessage(err))
//         return null
//     }
// }

// // ── Initiate subscription payment ──────────────────────────────────────────────

// export async function initiateSubscriptionPayment(
//     schoolId: string,
//     planId:   string,
// ): Promise<{
//     success:           boolean
//     authorizationUrl?: string
//     reference?:        string
//     error?:            string
// }> {
//     try {
//         const supabase = await createClient()
//         const { data: { user }, error: authError } = await supabase.auth.getUser()
//         if (authError || !user) return { success: false, error: 'Unauthorized.' }

//         const plan = await prisma.subscriptionPlan.findUnique({
//             where: { id: planId },
//         })
//         if (!plan || !plan.active) {
//             return { success: false, error: 'Plan not found or inactive.' }
//         }

//         const school = await prisma.school.findUnique({
//             where:  { id: schoolId },
//             select: { id: true, name: true },
//         })
//         if (!school) return { success: false, error: 'School not found.' }

//         const profile = await prisma.profile.findFirst({
//             where:  { email: user.email },
//             select: { id: true },
//         })

//         const reference = `sub_${schoolId}_${plan.slug}_${Date.now()}`

//         // ✅ Uses correct model name from your schema: subscriptionTransaction
//         await prisma.subscriptionTransaction.create({
//             data: {
//                 schoolId,
//                 planId:      plan.id,
//                 planName:    plan.name,
//                 amountNGN:   plan.priceNGN,
//                 amountKobo:  plan.priceKobo,
//                 reference,
//                 status:      'PENDING',
//                 initiatedBy: profile?.id ?? user.id,
//             },
//         })

//         await prisma.subscription.upsert({
//             where:  { schoolId },
//             update: { paystackReference: reference },
//             create: {
//                 schoolId,
//                 plan:              plan.name,
//                 planId:            plan.id,
//                 status:            'pending',
//                 currentPeriodEnd:  new Date(),
//                 paystackReference: reference,
//             },
//         })

//         const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/subscription/verify?reference=${reference}`

//         const response = await fetch('https://api.paystack.co/transaction/initialize', {
//             method:  'POST',
//             headers: {
//                 Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 email:    user.email,
//                 amount:   plan.priceKobo,
//                 reference,
//                 currency: 'NGN',
//                 metadata: {
//                     schoolId,
//                     planId:       plan.id,
//                     planSlug:     plan.slug,
//                     schoolName:   school.name,
//                     durationDays: plan.durationDays,
//                 },
//                 callback_url: callbackUrl,
//             }),
//         })

//         const paystackData = await response.json()
//         if (!paystackData.status) {
//             return { success: false, error: paystackData.message ?? 'Paystack error.' }
//         }

//         return {
//             success:          true,
//             authorizationUrl: paystackData.data.authorization_url,
//             reference,
//         }
//     } catch (err) {
//         console.error('initiateSubscriptionPayment error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }

// // ── Verify subscription payment ────────────────────────────────────────────────

// // src/app/actions/subscription.actions.ts
// // Replace just the verifySubscriptionPayment function

// export async function verifySubscriptionPayment(
//     reference: string,
// ): Promise<{
//     success:    boolean
//     planName?:  string
//     expiresAt?: Date
//     error?:     string
// }> {
//     try {
//         const transaction = await prisma.subscriptionTransaction.findUnique({
//             where:   { reference },
//             include: { plan: true },
//         })

//         if (!transaction) return { success: false, error: 'Transaction not found.' }

//         // ✅ Idempotency — already processed
//         if (transaction.status === 'SUCCESS') {
//             return { success: true, planName: transaction.planName }
//         }
//         if (transaction.status === 'FAILED') {
//             return { success: false, error: 'Payment previously failed.' }
//         }

//         // Verify with Paystack
//         const response = await fetch(
//             `https://api.paystack.co/transaction/verify/${reference}`,
//             { headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` } }
//         )

//         const paystackData    = await response.json()
//         const paymentSucceeded = paystackData.status && paystackData.data.status === 'success'
//         const now             = new Date()

//         if (paymentSucceeded) {
//             const expiresAt = new Date(
//                 now.getTime() + transaction.plan.durationDays * 24 * 60 * 60 * 1000
//             )

//             // ✅ Atomic update — transaction + subscription together
//             await prisma.$transaction([
//                 prisma.subscriptionTransaction.update({
//                     where: { id: transaction.id },
//                     data:  { status: 'SUCCESS', paidAt: now },
//                 }),
//                 prisma.subscription.update({
//                     where: { schoolId: transaction.schoolId },
//                     data: {
//                         plan:             transaction.plan.name,
//                         planId:           transaction.planId,
//                         status:           'active',
//                         currentPeriodEnd: expiresAt,
//                         amountNGN:        transaction.plan.priceNGN,
//                         paidAt:           now,
//                     },
//                 }),
//             ])

//             // ✅ Get admin profile for notification + activity log
//             const admin = await prisma.profile.findFirst({
//                 where:  { schoolId: transaction.schoolId, role: 'SCHOOL_ADMIN' },
//                 select: { id: true, name: true, role: true },
//             })

//             if (admin) {
//                 // ✅ Notification — shows in the notification bell
//                 await prisma.notification.create({
//                     data: {
//                         userId:  admin.id,
//                         message: `✅ Subscription renewed — ${transaction.plan.name} plan active until ${expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.`,
//                         read:    false,
//                         link:    '/admin/settings?tab=billing',
//                     },
//                 })

//                 // ✅ Activity log — shows in admin activity feed
//                 await logActivity({
//                     schoolId:    transaction.schoolId,
//                     actorId:     admin.id,
//                     actorName:   admin.name ?? 'Admin',
//                     actorRole:   admin.role,
//                     type:        'SETTINGS_UPDATED',
//                     title:       'Subscription Renewed',
//                     description: `${transaction.plan.name} plan renewed for ₦${transaction.plan.priceNGN.toLocaleString()} via Paystack`,
//                     metadata: {
//                         planName:  transaction.plan.name,
//                         amountNGN: transaction.plan.priceNGN,
//                         reference,
//                         expiresAt: expiresAt.toISOString(),
//                     },
//                 })
//             }

//             revalidatePath('/admin/settings')
//             revalidatePath('/admin')

//             return { success: true, planName: transaction.plan.name, expiresAt }

//         } else {
//             // ✅ Record failed attempt
//             await prisma.subscriptionTransaction.update({
//                 where: { id: transaction.id },
//                 data:  { status: 'FAILED' },
//             })

//             // Notify admin of failed payment too
//             const admin = await prisma.profile.findFirst({
//                 where:  { schoolId: transaction.schoolId, role: 'SCHOOL_ADMIN' },
//                 select: { id: true, name: true, role: true },
//             })

//             if (admin) {
//                 await prisma.notification.create({
//                     data: {
//                         userId:  admin.id,
//                         message: `❌ Payment failed for ${transaction.plan.name} plan. Please try again or contact support.`,
//                         read:    false,
//                         link:    '/admin/settings?tab=billing',
//                     },
//                 })

//                 await logActivity({
//                     schoolId:    transaction.schoolId,
//                     actorId:     admin.id,
//                     actorName:   admin.name ?? 'Admin',
//                     actorRole:   admin.role,
//                     type:        'SETTINGS_UPDATED',
//                     title:       'Subscription Payment Failed',
//                     description: `Payment failed for ${transaction.plan.name} plan — reference: ${reference}`,
//                     metadata: {
//                         planName:  transaction.plan.name,
//                         reference,
//                         reason:    paystackData.data?.gateway_response ?? 'Unknown',
//                     },
//                 })
//             }

//             return { success: false, error: 'Payment not confirmed by Paystack.' }
//         }
//     } catch (err) {
//         console.error('verifySubscriptionPayment error:', getErrorMessage(err))
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from "@/lib/activitylogger";
import { Role, ActivityType, TxStatus, Prisma } from '@prisma/client'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface SubscriptionPlanItem {
    id:           string
    name:         string
    slug:         string
    priceNGN:     number
    priceKobo:    number
    durationDays: number
    description:  string
    features:     string[]
    popular:      boolean
    sortOrder:    number
}

export interface PaymentHistoryEntry {
    id:        string
    planName:  string
    amountNGN: number
    status:    TxStatus
    paidAt:    Date | null
    createdAt: Date
}

// ── 1. GLOBAL PLANS (Tier 1) ───────────────────────────────────────────────────

export async function getSubscriptionPlans(): Promise<SubscriptionPlanItem[]> {
    try {
        return await prisma.subscriptionPlan.findMany({
            where:   { active: true },
            orderBy: { sortOrder: 'asc' },
        })
    } catch (err: unknown) {
        return []
    }
}

// ── 2. INDIVIDUAL PAYMENT INITIATION (Tier 3) ──────────────────────────────────

/**
 * Rule 6: Individual Learner Payment Initiation.
 * Uses 'INDIVIDUAL' as a constant for schoolId to satisfy schema requirements 
 * while linking the transaction to the specific user profile.
 */
export async function initiateIndividualPayment(planId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized");

        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
        if (!plan || !plan.active) throw new Error("Plan not found or inactive");

        const reference = `indiv_${user.id.slice(0, 8)}_${Date.now()}`;

        // Rule 11: Atomic setup for Personal Subscription
        await prisma.$transaction([
            prisma.subscriptionTransaction.create({
                data: {
                    schoolId: "INDIVIDUAL", // Constant to identify Tier-3 payments
                    planId: plan.id,
                    planName: plan.name,
                    amountNGN: plan.priceNGN,
                    amountKobo: plan.priceKobo,
                    reference,
                    status: TxStatus.PENDING,
                    initiatedBy: user.id,
                }
            }),
            prisma.subscription.upsert({
                where: { profileId: user.id },
                update: { paystackReference: reference },
                create: {
                    profileId: user.id,
                    schoolId: "INDIVIDUAL", 
                    plan: plan.name,
                    planId: plan.id,
                    status: 'pending',
                    currentPeriodEnd: new Date(),
                    paystackReference: reference
                }
            })
        ]);

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method:  'POST',
            headers: {
                Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                amount: plan.priceKobo,
                reference,
                currency: 'NGN',
                metadata: { userId: user.id, planId: plan.id, tier: 'INDIVIDUAL' },
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/verify?reference=${reference}`,
            }),
        });

        const paystackData = await response.json();
        if (!paystackData.status) throw new Error(paystackData.message);

        return {
            success: true,
            authorizationUrl: paystackData.data.authorization_url as string,
            reference
        };

    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

// ── 3. INSTITUTIONAL PAYMENT INITIATION (Tier 2) ───────────────────────────────

export async function initiateSubscriptionPayment(schoolId: string, planId: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("Unauthorized");

        const plan = await prisma.subscriptionPlan.findUnique({ where: { id: planId } });
        if (!plan) throw new Error("Plan not found");

        const reference = `school_${schoolId.slice(0, 8)}_${Date.now()}`;

        await prisma.$transaction([
            prisma.subscriptionTransaction.create({
                data: {
                    schoolId,
                    planId: plan.id,
                    planName: plan.name,
                    amountNGN: plan.priceNGN,
                    amountKobo: plan.priceKobo,
                    reference,
                    status: TxStatus.PENDING,
                    initiatedBy: user.id,
                }
            }),
            prisma.subscription.upsert({
                where: { schoolId },
                update: { paystackReference: reference },
                create: {
                    schoolId,
                    plan: plan.name,
                    planId: plan.id,
                    status: 'pending',
                    currentPeriodEnd: new Date(),
                    paystackReference: reference
                }
            })
        ]);

        const response = await fetch('https://api.paystack.co/transaction/initialize', {
            method:  'POST',
            headers: {
                Authorization:  `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: user.email,
                amount: plan.priceKobo,
                reference,
                currency: 'NGN',
                metadata: { schoolId, planId: plan.id, tier: 'INSTITUTIONAL' },
                callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/verify?reference=${reference}`,
            }),
        });

        const paystackData = await response.json();
        return { success: true, authorizationUrl: paystackData.data.authorization_url, reference };
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

// ── 4. UNIFIED VERIFICATION (The "Tier-Aware" Logic) ───────────────────────────

/**
 * Rule 11: System Truth Update.
 * Dynamically detects if the payment was for a School or an Individual.
 */
export async function verifySubscriptionPayment(reference: string) {
    try {
        const transaction = await prisma.subscriptionTransaction.findUnique({
            where: { reference },
            include: { plan: true }
        });

        if (!transaction) throw new Error("Transaction record missing.");
        if (transaction.status === TxStatus.SUCCESS) return { success: true };

        const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` }
        });

        const paystackData = await response.json();
        if (!paystackData.status || paystackData.data.status !== 'success') {
            await prisma.subscriptionTransaction.update({ where: { reference }, data: { status: TxStatus.FAILED } });
            return { success: false, error: "Payment verification failed." };
        }

        const now = new Date();
        const expiresAt = new Date(now.getTime() + transaction.plan.durationDays * 24 * 60 * 60 * 1000);

        // TRANSACTIONAL TRUTH (Rule 11)
        await prisma.$transaction(async (tx) => {
            await tx.subscriptionTransaction.update({
                where: { reference },
                data: { status: TxStatus.SUCCESS, paidAt: now }
            });

            // Determine if we update by School or Profile (Individual Learner)
            if (transaction.schoolId === "INDIVIDUAL") {
                await tx.subscription.update({
                    where: { profileId: transaction.initiatedBy! },
                    data: {
                        plan: transaction.planName,
                        planId: transaction.planId,
                        status: 'active',
                        currentPeriodEnd: expiresAt,
                        paidAt: now
                    }
                });
            } else {
                await tx.subscription.update({
                    where: { schoolId: transaction.schoolId },
                    data: {
                        plan: transaction.planName,
                        planId: transaction.planId,
                        status: 'active',
                        currentPeriodEnd: expiresAt,
                        paidAt: now
                    }
                });
            }
        });

        // Log activity based on tier
        await logActivity({
            schoolId: transaction.schoolId === "INDIVIDUAL" ? null : transaction.schoolId,
            actorId: transaction.initiatedBy!,
            type: "SETTINGS_UPDATED",
            title: 'License Restored',
            description: `Successfully renewed ${transaction.planName} coverage.`
        });

        revalidatePath('/billing');
        return { success: true, planName: transaction.planName };

    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}