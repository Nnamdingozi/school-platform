// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
// import { RegisterShell } from "@/components/onboarding/individualShell";

// export const metadata: Metadata = {
//     title: "Initialize Registry | Individual Learner | SchoolPaaS",
//     description: "Create your personal academic registry node and access global curriculum modules.",
// };

// export default async function RegisterPage() {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     // Rule 10: Redirect if already authenticated
//     if (user) redirect("/student");

//     // Rule 12: Fetch Tier-1 Personal Plans on server
//     const allPlans = await getSubscriptionPlans();
//     // Filter for personal/individual plans if your DB has a type field, 
//     // otherwise pass all for selection.
//     const personalPlans = allPlans.filter(p => p.slug.includes('individual') || p.priceNGN < 20000);

//     return (
//         <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
//             <RegisterShell initialPlans={personalPlans} />
//         </main>
//     );
// }



import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
import { IndividulalShell} from "@/components/onboarding/individualShell";
import { type SubscriptionPlanItem } from "@/app/actions/subscription.actions";

/**
 * INDIVIDUAL LEARNER PROVISIONING | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export const metadata: Metadata = {
    title: "Initialize Registry | Individual Learner | SchoolPaaS",
    description: "Create your personal academic registry node and access global curriculum modules.",
};

/**
 * REGISTRATION ENTRY POINT
 * Rule 12: Server-First Data Fetching.
 * Rule 10: Security Gate - Prevents re-registration of existing active accounts.
 */
export default async function RegisterPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rule 10: Security Protocol
    // If user session exists, verify registry status before allowing access to registration.
    if (user) {
        const profile = await prisma.profile.findUnique({
            where: { id: user.id },
            select: { id: true, role: true }
        });
        
        // If a profile exists, the user is already provisioned.
        if (profile) redirect("/student");
    }

    // Rule 12: Fetch Global Tier-1 metadata
    const allPlans: SubscriptionPlanItem[] = await getSubscriptionPlans();

    /**
     * Rule 27: Registry Filtering
     * Strictly isolate individual learner tiers from institutional/school plans.
     * Only slugs starting with 'individual-' are permitted in this hub.
     */
    const personalPlans: SubscriptionPlanItem[] = allPlans.filter((p: SubscriptionPlanItem) => 
        p.slug.startsWith('individual-') && p.active
    );

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <IndividulalShell initialPlans={personalPlans} />
        </main>
    );
}


