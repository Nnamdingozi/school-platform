import { Metadata } from "next";
import { OnboardingOptions } from "@/components/onboarding/onboardingOptions";

export const metadata: Metadata = {
    title: "Get Started | SchoolPaaS",
    description: "Choose how you'd like to set up your SchoolPaaS workspace.",
};

export default function Page() {
    // No redirect logic here — middleware handles
    // authenticated users hitting /get-started and sends
    // them to the correct role-based home route.
    return (
        <main className="min-h-screen bg-surface flex items-center justify-center p-4">
            <OnboardingOptions />
        </main>
    );
}
