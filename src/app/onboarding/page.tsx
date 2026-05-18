// // app/onboarding/page.tsx
// import { OnboardingShell } from '@/components/onboarding/onboarding-shell';

// export const metadata = {
//     title: 'Get Started | EduAI',
//     description: 'Set up your school workspace in minutes.',
// };

// export default function OnboardingPage() {
//     return <OnboardingShell />;
// }


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getCurricula } from "@/app/actions/onboarding";
import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

/**
 * Rule 16: Dynamic Contextual SEO
 */
export const metadata: Metadata = {
    title: "Provision Workspace | Institutional Onboarding | SchoolPaaS",
    description: "Initialize your institutional node and configure your multicurricular academic registry.",
};

/**
 * Rule 12: Server-First Data Fetching
 */
export default async function OnboardingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Rule 10 Security: Prevent double-onboarding
    if (user) {
        const profile = await prisma.profile.findUnique({
            where: { id: user.id },
            select: { schoolId: true }
        });
        if (profile?.schoolId) redirect("/teacher");
    }

    // Rule 12: Parallel Fetching of Tier-1 Global Core
    const [curriculaRes, plans] = await Promise.all([
        getCurricula(),
        getSubscriptionPlans()
    ]);

    return (
        <main className="min-h-screen bg-slate-950">
            <OnboardingShell 
                initialCurricula={curriculaRes.success ? curriculaRes.data : []} 
                initialPlans={plans}
            />
        </main>
    );
}