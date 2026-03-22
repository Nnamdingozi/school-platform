import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const NGN_RATE = 1600

const plans = [
    {
        name:         'Monthly',
        slug:         'monthly',
        priceUSD:     29,
        priceNGN:     Math.round(29 * NGN_RATE),
        priceKobo:    Math.round(29 * NGN_RATE * 100),
        durationDays: 30,
        description:  'Flexible monthly billing',
        popular:      false,
        sortOrder:    1,
        features: [
            'Unlimited students',
            'WhatsApp parent notifications',
            'AI lesson planner',
            'Assessment management',
            'Priority support',
        ],
    },
    {
        name:         'Per Term',
        slug:         'termly',
        priceUSD:     75,
        priceNGN:     Math.round(75 * NGN_RATE),
        priceKobo:    Math.round(75 * NGN_RATE * 100),
        durationDays: 90,
        description:  'Pay once per school term',
        popular:      true,
        sortOrder:    2,
        features: [
            'Everything in Monthly',
            'Save 14% vs monthly',
            'Term-based billing',
            'Dedicated onboarding',
            'Priority support',
        ],
    },
    {
        name:         'Annual',
        slug:         'annual',
        priceUSD:     249,
        priceNGN:     Math.round(249 * NGN_RATE),
        priceKobo:    Math.round(249 * NGN_RATE * 100),
        durationDays: 365,
        description:  'Best value — pay once a year',
        popular:      false,
        sortOrder:    3,
        features: [
            'Everything in Per Term',
            'Save 28% vs monthly',
            'Annual receipt for records',
            'Custom onboarding session',
            '24/7 priority support',
        ],
    },
]

const creditPackages = [
    {
        id:          'starter',
        name:        'Starter',
        credits:     100,
        priceUSD:    2.00,
        priceNGN:    Math.round(2.00 * NGN_RATE),
        priceKobo:   Math.round(2.00 * NGN_RATE * 100),
        description: 'Perfect for small schools just getting started',
        sortOrder:   1,
    },
    {
        id:          'standard',
        name:        'Standard',
        credits:     500,
        priceUSD:    9.00,
        priceNGN:    Math.round(9.00 * NGN_RATE),
        priceKobo:   Math.round(9.00 * NGN_RATE * 100),
        popular:     true,
        description: 'Best value for growing schools',
        sortOrder:   2,
    },
    {
        id:          'pro',
        name:        'Pro',
        credits:     1000,
        priceUSD:    16.00,
        priceNGN:    Math.round(16.00 * NGN_RATE),
        priceKobo:   Math.round(16.00 * NGN_RATE * 100),
        description: 'For schools with regular parent communication',
        sortOrder:   3,
    },
    {
        id:          'enterprise',
        name:        'Enterprise',
        credits:     5000,
        priceUSD:    70.00,
        priceNGN:    Math.round(70.00 * NGN_RATE),
        priceKobo:   Math.round(70.00 * NGN_RATE * 100),
        description: 'Maximum value for large school networks',
        sortOrder:   4,
    },
]

async function main() {
    console.log('🌱 Start seeding...')

    // 1. Seed Subscription Plans
    console.log('Syncing subscription plans...')
    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where:  { slug: plan.slug },
            update: plan,
            create: plan,
        })
    }
    console.log('✅ Subscription plans synced')

    // 2. Seed Credit Packages
    console.log('Syncing credit packages...')
    for (const pkg of creditPackages) {
        await prisma.creditPackage.upsert({
            where: { id: pkg.id },
            update: pkg,
            create: pkg
        });
    }
    console.log('✅ Credit packages synced')

    console.log('🏁 Seeding finished successfully.')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })