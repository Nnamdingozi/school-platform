import { Metadata } from "next";
import { verifySubscriptionPayment } from '@/app/actions/subscription.actions';
import { VerifySubscriptionClient } from "@/components/admin-dasboard/subscription/verifySubscriptionClient";

/**
 * LICENSE SYNCHRONIZATION | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export const metadata: Metadata = {
    title: "License Synchronization | Registry | SchoolPaaS",
    description: "Institutional license verification and registry update in progress.",
};

interface PageProps {
    searchParams: Promise<{ reference?: string | string[] }>; // ✅ Rule 15: Handle Array possibility
}

/**
 * VERIFICATION HUB (Tier 1/2 Sync)
 * Rule 12: Server-First Execution.
 * Rule 11: Final System Truth - Squashes duplicate refs to prevent Prisma collision.
 */
export default async function VerifyPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const rawReference = params.reference;

    // ── autority reference normalization (The Fix) ──
    // If the gateway sends duplicate refs, we take the first authoritative string.
    const reference = Array.isArray(rawReference) ? rawReference[0] : rawReference;

    if (!reference) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4">
                <VerifySubscriptionClient 
                    initialStatus="error" 
                    initialMessage="Protocol Breach: Invalid or missing transaction reference." 
                />
            </main>
        );
    }

    // Rule 11: Final Transactional Verification with normalized string
    const result = await verifySubscriptionPayment(reference);

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4 md:p-8">
            <VerifySubscriptionClient 
                initialStatus={result.success ? "success" : "error"}
                initialMessage={result.success 
                    ? `License Activated: ${result.planName} tier is now synchronized.` 
                    : (result.error || "Registry synchronization failure.")
                }
            />
        </main>
    );
}