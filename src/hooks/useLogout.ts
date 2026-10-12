'use client';

import { useRouter } from 'next/navigation';
import { logoutAction } from '@/app/actions/auth';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useProfileStore } from '@/store/profileStore';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/error-handler';

interface UseLogoutReturn {
    performLogout: () => Promise<void>;
}

/**
 * USE LOGOUT HOOK
 * Logic: Coordinates atomic cleanup across Server (Cookies/Session),
 * Zustand (In-Memory Stores), and Browser (LocalStorage).
 */
export function useLogout(): UseLogoutReturn {
    const router = useRouter();
    
    // Connect to all stores that need clearing
    const resetOnboarding: () => void = useOnboardingStore((state) => state.reset);
    const resetProfile: () => void = useProfileStore((state) => state.reset);

    const performLogout = async (): Promise<void> => {
        try {
            // 1. Terminate Server-side Session & Cookies
            const res: { success: boolean } = await logoutAction();

            if (res.success) {
                // 2. Clear In-Memory Zustand State
                resetOnboarding();
                resetProfile();

                // 3. Clear Browser Hard Storage (Removes all cached data)
                if (typeof window !== 'undefined') {
                    window.localStorage.clear();
                    window.sessionStorage.clear();
                }

                toast.success("Identity session terminated.");

                // 4. Force hard redirect to home node
                router.push('/');
                router.refresh(); 
            } else {
                throw new Error("Server failed to terminate session protocol.");
            }
        } catch (error: unknown) {
            const message: string = getErrorMessage(error);
            console.error(`[LOGOUT_CRITICAL_FAULT]: ${message}`);
            toast.error("Logout synchronization failed. Please close your tab.");
        }
    };

    return { performLogout };
}