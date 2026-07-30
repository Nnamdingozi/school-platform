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


// export default async function OnboardingPage() {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     if (user) {
//         // 1. Fetch Profile and Subscription status from Prisma
//         const profile = await prisma.profile.findUnique({
//             where: { id: user.id },
//             include: { 
//                 school: true,
//                 // Assuming you have a subscription relation
//                 subscription: true 
//             }
//         });

//         // FIX BUG 1 & 4: If paid but not verified
//         const hasPaid = profile?.subscription?.status === 'active' || profile?.subscription?.status === 'trailing';
//         const isEmailVerified = user.email_confirmed_at;

//         if (hasPaid) {
//             // If they paid but haven't verified email, redirect to verification hold page
//             if (!isEmailVerified) {
//                 redirect("/confirm"); 
//             }
            
//             // If they paid and have a school, go to admin
//             if (profile?.schoolId) {
//                 redirect("/admin");
//             }
            
//             // If they paid but school creation failed/interrupted, 
//             // the OnboardingShell should handle resuming at the "School Info" step
//         }
//     }

//     const [curriculaRes, plans] = await Promise.all([
//         getCurricula(),
//         getSubscriptionPlans()
//     ]);

//     return (
//         <main className="min-h-screen bg-background">
//             <OnboardingShell 
//                 initialCurricula={curriculaRes.success ? curriculaRes.data : []} 
//                 initialPlans={plans}
//                 // Pass user state down to prevent re-edits
//                 isExistingUser={!!user}
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

//     if (user) {
//         // 1. Fetch Profile and Subscription status from Prisma
//         const profile = await prisma.profile.findUnique({
//             where: { id: user.id },
//             include: { 
//                 school: true,
//                 subscription: true 
//             }
//         });

//         // FIX BUG 1 & 4: If paid but not verified
//         // Rule: If payment is active but email is not confirmed, force verification state.
//         const hasPaid = profile?.subscription?.status === 'active' || profile?.subscription?.status === 'trailing';
//         const isEmailVerified = !!user.email_confirmed_at;

//         if (hasPaid) {
//             // If they paid but haven't verified email, redirect to verification hold page
//             if (!isEmailVerified) {
//                 redirect("/confirm"); 
//             }
            
//             // If they paid and have a school, go to admin
//             if (profile?.schoolId) {
//                 redirect("/admin");
//             }
            
//             // If they paid but school creation failed/interrupted, 
//             // the OnboardingShell handles resuming at the "School Info" step via store hydration.
//         }
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


// import { Metadata } from "next";
// import { redirect } from "next/navigation";
// import { createClient } from "@/lib/supabase/server";
// import { prisma } from "@/lib/prisma";
// import { getCurricula } from "@/app/actions/onboarding";
// import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
// import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
// import { Profile, School, Subscription, Curriculum } from "@prisma/client";
// import { SubscriptionPlanItem } from "@/app/actions/subscription.actions";

// /**
//  * INSTITUTIONAL PROVISIONING | SERVER PAGE
//  * Rule 16: Dynamic Contextual SEO
//  */
// export const metadata: Metadata = {
//     title: "School Hub Initialization | SchoolPaaS",
//     description: "Initialize your school hub and configure your academic architecture.",
// };

// /**
//  * ONBOARDING ENTRY POINT
//  * Logic: Security gate for active institutions and server-side data pre-fetching.
//  */
// export default async function OnboardingPage(): Promise<JSX.Element> {
//     const supabase = await createClient();
//     const { data: { user } } = await supabase.auth.getUser();

//     if (user) {
//         // 1. Audit Profile and Subscription status
//         const profile: (Profile & { school: School | null; subscription: Subscription | null }) | null = await prisma.profile.findUnique({
//             where: { id: user.id },
//             include: { 
//                 school: true,
//                 subscription: true 
//             }
//         });

//         // Determine activation status
//         const hasActiveSubscription: boolean = profile?.subscription?.status === 'active' || profile?.subscription?.status === 'trailing';
//         const isEmailVerified: boolean = !!user.email_confirmed_at;

//         if (hasActiveSubscription) {
//             // If payment is complete but email is unverified, force verification screen
//             if (!isEmailVerified) {
//                 redirect("/confirm"); 
//             }
            
//             // If fully provisioned, redirect to admin console
//             if (profile?.schoolId) {
//                 redirect("/admin");
//             }
//         }
//     }

//     // Concurrent fetching of Global Registry metadata
//     const [curriculaRes, plans]: [{ success: boolean; data: Pick<Curriculum, "id" | "name" | "yearLabel" | "termLabel">[] }, SubscriptionPlanItem[]] = await Promise.all([
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



import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { getCurricula } from "@/app/actions/onboarding";
import { getSubscriptionPlans } from "@/app/actions/subscription.actions";
import { OnboardingShell } from "@/components/onboarding/onboarding-shell";
import { Profile, School, Subscription, Curriculum } from "@prisma/client";
import { SubscriptionPlanItem } from "@/app/actions/subscription.actions";
import React from "react";

/**
 * INSTITUTIONAL PROVISIONING | SERVER PAGE
 * Rule 16: Dynamic Contextual SEO
 */
export const metadata: Metadata = {
    title: "School Hub Initialization | SchoolPaaS",
    description: "Initialize your school hub and configure your academic architecture.",
};

/**
 * ONBOARDING ENTRY POINT
 * Rule 12: Server-First Data Fetching.
 * Rule 10: Security Gate - Prevents re-onboarding of active institutions.
 * Type Fix: Replaced JSX.Element with React.ReactNode for compatibility.
 */
export default async function OnboardingPage(): Promise<React.ReactNode> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        // 1. Fetch Profile and Subscription status from Prisma
        const profile: (Profile & { school: School | null; subscription: Subscription | null }) | null = await prisma.profile.findUnique({
            where: { id: user.id },
            include: { 
                school: true,
                subscription: true 
            }
        });

        // Audit payment and verification status
        const hasPaid: boolean = profile?.subscription?.status === 'active' || profile?.subscription?.status === 'trailing';
        const isEmailVerified: boolean = !!user.email_confirmed_at;

        if (hasPaid) {
            // Redirect to verification hold if email is unconfirmed
            if (!isEmailVerified) {
                redirect("/confirm"); 
            }
            
            // Redirect to admin if hub is fully provisioned
            if (profile?.schoolId) {
                redirect("/admin");
            }
        }
    }

    // Rule 12: Concurrent fetching of Global Tier-1 metadata
    const [curriculaRes, plans]: [{ success: boolean; data: Pick<Curriculum, "id" | "name" | "yearLabel" | "termLabel">[] }, SubscriptionPlanItem[]] = await Promise.all([
        getCurricula(),
        getSubscriptionPlans()
    ]);

    return (
        <main className="min-h-screen bg-background">
            <OnboardingShell 
                initialCurricula={curriculaRes.success ? curriculaRes.data : []} 
                initialPlans={plans}
            />
        </main>
    );
}