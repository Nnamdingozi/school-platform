import { ResendConfirmationForm } from '@/components/onboarding/resendConfirmationForm'
import { AlertTriangle } from 'lucide-react';

interface ErrorPageProps {
    searchParams: Promise<{ message?: string }>;
}

export default async function ErrorPage({ searchParams }: ErrorPageProps) {
    const params = await searchParams;
    const message = params.message ? decodeURIComponent(params.message) : 'An unknown error occurred.';

    // Only offer the resend flow for the specific expired/invalid link case —
    // other errors (e.g. missing params, generic faults) don't apply.
    const isExpiredLinkError = message.toLowerCase().includes('invalid') || message.toLowerCase().includes('expired');

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="h-16 w-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center mx-auto">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
                <div className="space-y-2">
                    <h1 className="text-xl font-bold text-foreground">Something went wrong</h1>
                    <p className="text-sm text-muted-foreground">{message}</p>
                </div>

                {isExpiredLinkError && <ResendConfirmationForm />}

                <a
                    href="/login"
                    className="inline-block text-sm font-semibold text-school-primary hover:underline"
                >
                    Back to login
                </a>
            </div>
        </div>
    );
}
