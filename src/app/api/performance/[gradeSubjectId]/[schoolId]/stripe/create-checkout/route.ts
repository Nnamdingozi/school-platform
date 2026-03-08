// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getErrorMessage } from '@/lib/error-handler';

const STRIPE_PRICE_IDS: Record<string, Record<string, string>> = {
    starter: {
        usd: process.env.STRIPE_STARTER_USD_PRICE_ID ?? '',
        ngn: process.env.STRIPE_STARTER_NGN_PRICE_ID ?? '',
    },
    pro: {
        usd: process.env.STRIPE_PRO_USD_PRICE_ID ?? '',
        ngn: process.env.STRIPE_PRO_NGN_PRICE_ID ?? '',
    },
    enterprise: {
        usd: process.env.STRIPE_ENTERPRISE_USD_PRICE_ID ?? '',
        ngn: process.env.STRIPE_ENTERPRISE_NGN_PRICE_ID ?? '',
    },
};

export async function POST(req: NextRequest) {
    try {
        const { plan, email, currency, successUrl, cancelUrl } = await req.json();

        const priceId = STRIPE_PRICE_IDS[plan]?.[currency];
        if (!priceId) {
            return NextResponse.json({ error: 'Invalid plan or currency.' }, { status: 400 });
        }

        const res = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'payment_method_types[]': 'card',
                'line_items[0][price]': priceId,
                'line_items[0][quantity]': '1',
                mode: 'subscription',
                customer_email: email,
                success_url: successUrl,
                cancel_url: cancelUrl,
                'metadata[plan]': plan,
                'subscription_data[trial_period_days]': '14',
            }),
        });

        const session = await res.json();
        if (!session.url) {
            return NextResponse.json({ error: 'Failed to create session.' }, { status: 500 });
        }

        return NextResponse.json({ url: session.url });
    } catch (error: unknown) { // ✅ FIX: Change 'any' to 'unknown'
        const message = getErrorMessage(error);
        console.error('API Error fetching performance data:', message);
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}