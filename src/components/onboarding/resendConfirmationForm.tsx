'use client';

import React, { useState } from 'react';
import { resendConfirmationEmail } from '@/app/actions/individualOnboarding';
import { Loader2, Mail, CheckCircle2 } from 'lucide-react';

export function ResendConfirmationForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;

        setStatus('loading');
        setErrorMessage(null);

        const result = await resendConfirmationEmail(email);

        if (result.success) {
            setStatus('sent');
        } else {
            setStatus('error');
            setErrorMessage(result.error ?? 'Something went wrong. Please try again.');
        }
    };

    if (status === 'sent') {
        return (
            <div className="flex flex-col items-center gap-2 py-4 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
                <p className="text-sm font-medium">
                    If an account exists for that email, a new confirmation link is on its way.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
            <p className="text-xs text-muted-foreground">
                Enter your email to receive a new confirmation link.
            </p>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    disabled={status === 'loading'}
                    className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-school-primary/30 disabled:opacity-50"
                />
            </div>
            {errorMessage && (
                <p className="text-xs text-red-600">{errorMessage}</p>
            )}
            <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-2.5 rounded-xl bg-school-primary text-on-school-primary text-sm font-semibold disabled:opacity-50 transition-all active:scale-95"
            >
                {status === 'loading' ? (
                    <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                    </span>
                ) : (
                    'Resend confirmation email'
                )}
            </button>
        </form>
    );
}
