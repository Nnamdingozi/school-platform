


// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { SubscriptionPlanItem } from '@/app/actions/subscription.actions';

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface RegisterState {
//     step: number;
//     email: string;
//     name: string;
//     plans: SubscriptionPlanItem[];
//     isRegistered: boolean;
    
//     // Actions
//     setStep: (step: number) => void;
//     nextStep: () => void;
//     prevStep: () => void;
//     setIdentity: (name: string, email: string) => void;
//     setPlans: (plans: SubscriptionPlanItem[]) => void;
//     setComplete: (val: boolean) => void;
//     reset: () => void;
// }

// // ── Store Implementation ─────────────────────────────────────────────────────

// export const useRegisterStore = create<RegisterState>()(
//     persist(
//         (set) => ({
//             // Initial State
//             step: 1,
//             email: '',
//             name: '',
//             plans: [],
//             isRegistered: false,

//             // Actions Implementation
//             setStep: (step) => set({ step }),
            
//             nextStep: () => set((state) => ({ 
//                 step: Math.min(state.step + 1, 2) 
//             })),
            
//             prevStep: () => set((state) => ({ 
//                 step: Math.max(state.step - 1, 1) 
//             })),
            
//             setIdentity: (name, email) => set({ name, email }),
            
//             setPlans: (plans) => set({ plans }),
            
//             setComplete: (isRegistered) => set({ isRegistered }),
            
//             reset: () => set({ 
//                 step: 1, 
//                 email: '', 
//                 name: '', 
//                 isRegistered: false 
//             }),
//         }),
//         { 
//             name: 'personal-register-registry-v1' 
//         }
//     )
// );


// // src/store/individualOnboardingStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';
// import { SubscriptionPlanItem } from '@/app/actions/subscription.actions';

// export type PaymentStatus = 'pending' | 'paid';

// export interface RegisterState {
//     step: number;
//     email: string;
//     name: string;
//     curriculumId: string; // ✅ Added
//     plans: SubscriptionPlanItem[];
//     isRegistered: boolean;
//     paymentStatus: PaymentStatus;
//     selectedPlanSlug: string | null;
//     paymentReference: string | null;

//     setStep: (step: number) => void;
//     nextStep: () => void;
//     prevStep: () => void;
//     setIdentity: (name: string, email: string, curriculumId: string) => void; // ✅ Updated
//     setPlans: (plans: SubscriptionPlanItem[]) => void;
//     setPaymentSuccess: (reference: string, planSlug: string) => void;
//     setComplete: (val: boolean) => void;
//     reset: () => void;
// }

// export const useRegisterStore = create<RegisterState>()(
//     persist(
//         (set, get) => ({
//             step: 1,
//             email: '',
//             name: '',
//             curriculumId: '',
//             plans: [],
//             isRegistered: false,
//             paymentStatus: 'pending',
//             selectedPlanSlug: null,
//             paymentReference: null,

//             setStep: (step) => {
//                 if (get().paymentStatus === 'paid') return;
//                 set({ step });
//             },
//             nextStep: () => set((state) => {
//                 if (state.paymentStatus === 'paid') return state;
//                 return { step: Math.min(state.step + 1, 2) };
//             }),
//             prevStep: () => set((state) => {
//                 if (state.paymentStatus === 'paid') return state;
//                 return { step: Math.max(state.step - 1, 1) };
//             }),
//             setIdentity: (name, email, curriculumId) => {
//                 if (get().paymentStatus === 'paid') return;
//                 set({ name, email, curriculumId });
//             },
//             setPlans: (plans) => set({ plans }),
//             setPaymentSuccess: (reference, planSlug) => set({
//                 paymentStatus: 'paid',
//                 paymentReference: reference,
//                 selectedPlanSlug: planSlug
//             }),
//             setComplete: (isRegistered) => set({ isRegistered }),
//             reset: () => {
//                 if (get().paymentStatus === 'paid') return;
//                 set({ step: 1, email: '', name: '', curriculumId: '', isRegistered: false, paymentStatus: 'pending' });
//             },
//         }),
//         { name: 'personal-register-registry-v2' }
//     )
// );


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { SubscriptionPlanItem } from '@/app/actions/subscription.actions';

export type PaymentStatus = 'pending' | 'paid';

export interface RegisterState {
    step: number;
    email: string;
    name: string;
    curriculumId: string; 
    plans: SubscriptionPlanItem[];
    isRegistered: boolean;
    paymentStatus: PaymentStatus;
    selectedPlanSlug: string | null;
    paymentReference: string | null;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setIdentity: (name: string, email: string, curriculumId: string) => void;
    setPlans: (plans: SubscriptionPlanItem[]) => void;
    setPaymentSuccess: (reference: string, planSlug: string) => void;
    setComplete: (val: boolean) => void;
    reset: () => void;
}

export const useRegisterStore = create<RegisterState>()(
    persist(
        (set, get) => ({
            step: 1,
            email: '',
            name: '',
            curriculumId: '',
            plans: [],
            isRegistered: false,
            paymentStatus: 'pending',
            selectedPlanSlug: null,
            paymentReference: null,

            setStep: (step: number) => {
                if (get().paymentStatus === 'paid') return;
                set({ step });
            },
            nextStep: () => set((state) => {
                if (state.paymentStatus === 'paid') return state;
                return { step: Math.min(state.step + 1, 2) };
            }),
            prevStep: () => set((state) => {
                if (state.paymentStatus === 'paid') return state;
                return { step: Math.max(state.step - 1, 1) };
            }),
            setIdentity: (name: string, email: string, curriculumId: string) => {
                if (get().paymentStatus === 'paid') return;
                set({ name, email, curriculumId });
            },
            setPlans: (plans: SubscriptionPlanItem[]) => set({ plans }),
            setPaymentSuccess: (reference: string, planSlug: string) => set({
                paymentStatus: 'paid',
                paymentReference: reference,
                selectedPlanSlug: planSlug
            }),
            setComplete: (isRegistered: boolean) => set({ isRegistered }),
            reset: () => {
                if (get().paymentStatus === 'paid') return;
                set({ 
                    step: 1, email: '', name: '', curriculumId: '', 
                    isRegistered: false, paymentStatus: 'pending',
                    selectedPlanSlug: null, paymentReference: null
                });
            },
        }),
        { name: 'personal-register-registry-v2' }
    )
);