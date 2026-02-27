// app/onboarding/page.tsx
import { OnboardingShell } from '@/components/onboarding/onboarding-shell';

export const metadata = {
    title: 'Get Started | EduAI',
    description: 'Set up your school workspace in minutes.',
};

export default function OnboardingPage() {
    return <OnboardingShell />;
}
