// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { SubscriptionPlanItem } from '@/app/actions/subscription.actions';

// interface RegisterState {
//     step: number;
//     email: string;
//     name: string;
//     plans: SubscriptionPlanItem[];
//     isRegistered: boolean;
    
//     setStep: (step: number) => void;
//     setIdentity: (name: string, email: string) => void;
//     setPlans: (plans: SubscriptionPlanItem[]) => void;
//     setComplete: (val: boolean) => void;
//     reset: () => void;
// }

// export const useRegisterStore = create<RegisterState>()(
//     persist(
//         (set) => ({
//             step: 1,
//             email: '',
//             name: '',
//             plans: [],
//             isRegistered: false,
//             setStep: (step) => set({ step }),
//             setIdentity: (name, email) => set({ name, email }),
//             setPlans: (plans) => set({ plans }),
//             setComplete: (isRegistered) => set({ isRegistered }),
//             reset: () => set({ step: 1, email: '', name: '', isRegistered: false }),
//         }),
//         { name: 'personal-register-registry' }
//     )
// );



import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubscriptionPlanItem } from '@/app/actions/subscription.actions';

// ── Types ───────────────────────────────────────────────────────────────────

export interface RegisterState {
    step: number;
    email: string;
    name: string;
    plans: SubscriptionPlanItem[];
    isRegistered: boolean;
    
    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setIdentity: (name: string, email: string) => void;
    setPlans: (plans: SubscriptionPlanItem[]) => void;
    setComplete: (val: boolean) => void;
    reset: () => void;
}

// ── Store Implementation ─────────────────────────────────────────────────────

export const useRegisterStore = create<RegisterState>()(
    persist(
        (set) => ({
            // Initial State
            step: 1,
            email: '',
            name: '',
            plans: [],
            isRegistered: false,

            // Actions Implementation
            setStep: (step) => set({ step }),
            
            nextStep: () => set((state) => ({ 
                step: Math.min(state.step + 1, 2) 
            })),
            
            prevStep: () => set((state) => ({ 
                step: Math.max(state.step - 1, 1) 
            })),
            
            setIdentity: (name, email) => set({ name, email }),
            
            setPlans: (plans) => set({ plans }),
            
            setComplete: (isRegistered) => set({ isRegistered }),
            
            reset: () => set({ 
                step: 1, 
                email: '', 
                name: '', 
                isRegistered: false 
            }),
        }),
        { 
            name: 'personal-register-registry-v1' 
        }
    )
);