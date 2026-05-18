import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
import { RegisterShell } from "@/components/onboarding/individualShell";

export const metadata: Metadata = {
    title: "Initialize Registry | Individual Learner | SchoolPaaS",
    description: "Create your personal academic registry node and access global curriculum modules.",
};

export default async function RegisterPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rule 10: Redirect if already authenticated
    if (user) redirect("/student");

    // Rule 12: Fetch Tier-1 Personal Plans on server
    const allPlans = await getSubscriptionPlans();
    // Filter for personal/individual plans if your DB has a type field, 
    // otherwise pass all for selection.
    const personalPlans = allPlans.filter(p => p.slug.includes('individual') || p.priceNGN < 20000);

    return (
        <main className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            <RegisterShell initialPlans={personalPlans} />
        </main>
    );
}