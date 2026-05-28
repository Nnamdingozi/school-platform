// // app/onboarding/page.tsx
// import { OnboardingShell } from '@/components/onboarding/onboarding-shell';

// export const metadata = {
//     title: 'Get Started | EduAI',
//     description: 'Set up your school workspace in minutes.',
// };

// export default function OnboardingPage() {
//     return <OnboardingShell />;
// }


// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getCurricula } from "@/app/actions/onboarding";
// import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
// import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

// /**
//  * Rule 16: Dynamic Contextual SEO
//  */
// export const metadata: Metadata = {
//     title: "Provision Workspace | Institutional Onboarding | SchoolPaaS",
//     description: "Initialize your institutional node and configure your multicurricular academic registry.",
// };

// /**
//  * Rule 12: Server-First Data Fetching
//  */
// export default async function OnboardingPage() {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     // Rule 10 Security: Prevent double-onboarding
//     if (user) {
//         const profile = await prisma.profile.findUnique({
//             where: { id: user.id },
//             select: { schoolId: true }
//         });
//         if (profile?.schoolId) redirect("/admin");
//     }

//     // Rule 12: Parallel Fetching of Tier-1 Global Core
//     const [curriculaRes, plans] = await Promise.all([
//         getCurricula(),
//         getSubscriptionPlans()
//     ]);

//     return (
//         <main className="min-h-screen bg-slate-950">
//             <OnboardingShell 
//                 initialCurricula={curriculaRes.success ? curriculaRes.data : []} 
//                 initialPlans={plans}
//             />
//         </main>
//     );
// }



// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getCurricula } from "@/app/actions/onboarding";
// import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
// import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

// /**
//  * INSTITUTIONAL PROVISIONING | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export const metadata: Metadata = {
//     title: "Provision Hub | Institutional Onboarding | SchoolPaaS",
//     description: "Initialize your institutional core and configure your academic registry architecture.",
// };

// /**
//  * ONBOARDING ENTRY POINT
//  * Rule 12: Server-First Data Fetching.
//  * Rule 10: Security Gate - Prevents re-onboarding of active institutions.
//  */
// export default async function OnboardingPage() {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     // Security protocol: If user exists and already has a hub, redirect to dashboard
//     if (user) {
//         const profile = await prisma.profile.findUnique({
//             where: { id: user.id },
//             select: { schoolId: true }
//         });
//         if (profile?.schoolId) redirect("/admin");
//     }

//     // Rule 12: Concurrent fetching of Global Tier-1 metadata
//     const [curriculaRes, plans] = await Promise.all([
//         getCurricula(),
//         getSubscriptionPlans()
//     ]);

//     return (
//         <main className="min-h-screen bg-background">
//             <OnboardingShell 
//                 initialCurricula={curriculaRes.success ? curriculaRes.data : []} 
//                 initialPlans={plans}
//             />
//         </main>
//     );
// }



// @/app/onboarding/page.tsx


import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getCurricula } from "@/app/actions/onboarding";
import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";

/**
 * INSTITUTIONAL PROVISIONING | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export const metadata: Metadata = {
    title: "Provision Hub | Institutional Onboarding | SchoolPaaS",
    description: "Initialize your institutional core and configure your academic registry architecture.",
};


export default async function OnboardingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // 1. Fetch Profile and Subscription status from Prisma
        const profile = await prisma.profile.findUnique({
            where: { id: user.id },
            include: { 
                school: true,
                // Assuming you have a subscription relation
                subscription: true 
            }
        });

        // FIX BUG 1 & 4: If paid but not verified
        const hasPaid = profile?.subscription?.status === 'active' || profile?.subscription?.status === 'trailing';
        const isEmailVerified = user.email_confirmed_at;

        if (hasPaid) {
            // If they paid but haven't verified email, redirect to verification hold page
            if (!isEmailVerified) {
                redirect("/confirm"); 
            }
            
            // If they paid and have a school, go to admin
            if (profile?.schoolId) {
                redirect("/admin");
            }
            
            // If they paid but school creation failed/interrupted, 
            // the OnboardingShell should handle resuming at the "School Info" step
        }
    }

    const [curriculaRes, plans] = await Promise.all([
        getCurricula(),
        getSubscriptionPlans()
    ]);

    return (
        <main className="min-h-screen bg-background">
            <OnboardingShell 
                initialCurricula={curriculaRes.success ? curriculaRes.data : []} 
                initialPlans={plans}
                // Pass user state down to prevent re-edits
                isExistingUser={!!user}
            />
        </main>
    );
}