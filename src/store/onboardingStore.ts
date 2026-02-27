// // store/onboardingStore.ts
// import { create } from 'zustand';

// export type OnboardingStep = 1 | 2 | 3;
// export type PaymentProvider = 'paystack' | 'stripe' | null;
// export type PlanType = 'starter' | 'pro' | 'enterprise' | null;

// interface AdminData {
//     name: string;
//     email: string;
//     password: string;
//     phone?: string;
// }

// interface PaymentData {
//     provider: PaymentProvider;
//     plan: PlanType;
//     reference: string;
//     verified: boolean;
// }

// interface SchoolData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
//     country: string;
//     timezone: string;
// }

// interface OnboardingState {
//     step: OnboardingStep;
//     adminData: AdminData | null;
//     paymentData: PaymentData | null;
//     schoolData: SchoolData | null;
//     isLoading: boolean;
//     error: string | null;

//     setStep: (step: OnboardingStep) => void;
//     nextStep: () => void;
//     prevStep: () => void;
//     setAdminData: (data: AdminData) => void;
//     setPaymentData: (data: PaymentData) => void;
//     setSchoolData: (data: SchoolData) => void;
//     setLoading: (loading: boolean) => void;
//     setError: (error: string | null) => void;
//     reset: () => void;
// }

// export const useOnboardingStore = create<OnboardingState>((set, get) => ({
//     step: 1,
//     adminData: null,
//     paymentData: null,
//     schoolData: null,
//     isLoading: false,
//     error: null,

//     setStep: (step) => set({ step, error: null }),
//     nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) as OnboardingStep, error: null })),
//     prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) as OnboardingStep, error: null })),
//     setAdminData: (adminData) => set({ adminData }),
//     setPaymentData: (paymentData) => set({ paymentData }),
//     setSchoolData: (schoolData) => set({ schoolData }),
//     setLoading: (isLoading) => set({ isLoading }),
//     setError: (error) => set({ error }),
//     reset: () => set({ step: 1, adminData: null, paymentData: null, schoolData: null, error: null }),
// }));



// // store/onboardingStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type OnboardingStep = 1 | 2 | 3;
// export type PaymentProvider = 'paystack' | 'stripe' | null;
// export type PlanType = 'starter' | 'pro' | 'enterprise' | null;

// interface AdminData {
//     name: string;
//     email: string;
//     password: string;
//     phone?: string;
// }

// interface PaymentData {
//     provider: PaymentProvider;
//     plan: PlanType;
//     reference: string;
//     verified: boolean;
// }

// interface SchoolData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
//     country: string;
//     timezone: string;
// }

// interface OnboardingState {
//     step: OnboardingStep;
//     adminData: AdminData | null;
//     paymentData: PaymentData | null;
//     schoolData: SchoolData | null;
//     isLoading: boolean;
//     error: string | null;

//     setStep: (step: OnboardingStep) => void;
//     nextStep: () => void;
//     prevStep: () => void;
//     setAdminData: (data: AdminData) => void;
//     setPaymentData: (data: PaymentData) => void;
//     setSchoolData: (data: SchoolData) => void;
//     setLoading: (loading: boolean) => void;
//     setError: (error: string | null) => void;
//     reset: () => void;
// }

// export const useOnboardingStore = create<OnboardingState>()(
//     persist(
//         (set) => ({
//             step: 1,
//             adminData: null,
//             paymentData: null,
//             schoolData: null,
//             isLoading: false,
//             error: null,

//             setStep: (step) => set({ step, error: null }),
//             nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3) as OnboardingStep, error: null })),
//             prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1) as OnboardingStep, error: null })),
//             setAdminData: (adminData) => set({ adminData }),
//             setPaymentData: (paymentData) => set({ paymentData }),
//             setSchoolData: (schoolData) => set({ schoolData }),
//             setLoading: (isLoading) => set({ isLoading }),
//             setError: (error) => set({ error }),
//             reset: () => set({
//                 step: 1,
//                 adminData: null,
//                 paymentData: null,
//                 schoolData: null,
//                 error: null,
//             }),
//         }),
//         {
//             name: 'onboarding-store', // localStorage key
//             // Only persist the data fields, not loading/error states
//             partialize: (state) => ({
//                 step: state.step,
//                 adminData: state.adminData,
//                 paymentData: state.paymentData,
//                 schoolData: state.schoolData,
//             }),
//         }
//     )
// );



// // src/store/onboardingStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type PlanType = 'starter' | 'pro' | 'enterprise' | null; // Allow null
// export type PaymentProvider = 'paystack' | 'stripe' | null;  // Allow null

// export interface OnboardingAdminData {
//     name: string;
//     email: string;
//     password?: string; // Optional - or however your onboarding flow gets this data
//     phone?: string;
// }

// export interface OnboardingPaymentData {
//     provider: PaymentProvider;
//     plan: PlanType;
//     reference: string; // Paystack transaction reference or Stripe session ID
//     verified: boolean;
// }

// export interface SchoolData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
//     country: string;
//     timezone: string;
// }

// interface OnboardingState {
//     step: number;
//     adminData: OnboardingAdminData | null;
//     paymentData: OnboardingPaymentData | null;
//     schoolData: SchoolData | null;
//     isLoading: boolean;
//     error: string | null;

//     // Actions
//     setStep: (step: number) => void; // Use number for the step.
//     nextStep: () => void;
//     prevStep: () => void;
//     setAdminData: (data: OnboardingAdminData) => void;
//     setPaymentData: (data: OnboardingPaymentData) => void;
//     setSchoolData: (data: SchoolData) => void;
//     setLoading: (loading: boolean) => void;
//     setError: (error: string | null) => void;
//     reset: () => void;
// }

// export const useOnboardingStore = create(
//     persist<OnboardingState>(
//         (set, get) => ({
//             step: 1,
//             adminData: null,
//             paymentData: null,
//             schoolData: null,
//             isLoading: false,
//             error: null,

//             setStep: (step) => set({ step, error: null }),
//             nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3), error: null })),
//             prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1), error: null })),
//             setAdminData: (adminData) => set({ adminData }),
//             setPaymentData: (paymentData) => set({ paymentData }),
//             setSchoolData: (schoolData) => set({ schoolData }),
//             setLoading: (isLoading) => set({ isLoading }),
//             setError: (error) => set({ error }),
//             reset: () => set({
//                 step: 1,
//                 adminData: null,
//                 paymentData: null,
//                 schoolData: null,
//                 error: null,
//             }),
//         }),
//         {
//             name: 'onboarding-store', // localStorage key
//             // Only persist the data fields, not loading/error states
//             partialize: (state) => ({
//                 step: state.step,
//                 adminData: state.adminData,
//                 paymentData: state.paymentData,
//                 schoolData: state.schoolData,
//             }),
//         }
//     )
// );


// // store/onboardingStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type PlanType = 'starter' | 'pro' | 'enterprise' | null;
// export type PaymentProvider = 'paystack' | 'stripe' | null;

// export interface OnboardingAdminData {
//     name: string;
//     email: string;
//     password?: string; 
//     phone?: string;
// }

// export interface OnboardingPaymentData {
//     provider: PaymentProvider;
//     plan: PlanType;
//     reference: string; 
//     verified: boolean;
// }

// export interface SchoolData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
//     country: string;
//     timezone: string;
// }

// interface OnboardingState {
//     step: number;
//     adminData: OnboardingAdminData | null;
//     paymentData: OnboardingPaymentData | null;
//     schoolData: SchoolData | null;
//     isLoading: boolean;
//     error: string | null;

//     // Actions
//     setStep: (step: number) => void;
//     nextStep: () => void;
//     prevStep: () => void;
//     setAdminData: (data: OnboardingAdminData) => void;
//     setPaymentData: (data: OnboardingPaymentData) => void;
//     setSchoolData: (data: SchoolData) => void;
//     setLoading: (loading: boolean) => void;
//     setError: (error: string | null) => void;
//     reset: () => void;
// }

// // 1. Notice the `create<OnboardingState>()(...)` syntax here (Zustand v4+ standard)
// export const useOnboardingStore = create<OnboardingState>()(
//     persist(
//         (set, get) => ({
//             step: 1,
//             adminData: null,
//             paymentData: null,
//             schoolData: null,
//             isLoading: false,
//             error: null,

//             setStep: (step) => set({ step, error: null }),
//             nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 3), error: null })),
//             prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1), error: null })),
//             setAdminData: (adminData) => set({ adminData }),
//             setPaymentData: (paymentData) => set({ paymentData }),
//             setSchoolData: (schoolData) => set({ schoolData }),
//             setLoading: (isLoading) => set({ isLoading }),
//             setError: (error) => set({ error }),
//             reset: () => set({
//                 step: 1,
//                 adminData: null,
//                 paymentData: null,
//                 schoolData: null,
//                 error: null,
//             }),
//         }),
//         {
//             name: 'onboarding-store',
            
//             // 2. We use `as unknown as OnboardingState` to satisfy TypeScript's strict persist generic
//             partialize: (state) => ({
//                 step: state.step,
//                 adminData: state.adminData,
//                 paymentData: state.paymentData,
//                 schoolData: state.schoolData,
//             }) as unknown as OnboardingState, 
//         }
//     )
// );

// // store/onboardingStore.ts
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type PlanType = 'starter' | 'pro' | 'enterprise' | null;
// export type PaymentProvider = 'paystack' | 'stripe' | null;

// export interface OnboardingAdminData {
//     name: string;
//     email: string;
//     password?: string;
//     phone?: string;
// }

// export interface OnboardingPaymentData {
//     provider: PaymentProvider;
//     plan: PlanType;
//     reference: string;
//     verified: boolean;
// }

// export interface SchoolData {
//     schoolName: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
//     country: string;
//     timezone: string;
// }

// interface OnboardingState {
//     step: number;
//     adminData: OnboardingAdminData | null;
//     paymentData: OnboardingPaymentData | null;
//     schoolData: SchoolData | null;
//     isProvisioned: boolean;
//     isLoading: boolean;
//     error: string | null;

//     setStep: (step: number) => void;
//     nextStep: () => void;
//     prevStep: () => void;
//     setAdminData: (data: OnboardingAdminData) => void;
//     setPaymentData: (data: OnboardingPaymentData) => void;
//     setSchoolData: (data: SchoolData) => void;
//     setProvisioned: (value: boolean) => void;
//     setLoading: (loading: boolean) => void;
//     setError: (error: string | null) => void;
//     reset: () => void;
// }

// export const useOnboardingStore = create<OnboardingState>()(
//     persist(
//         (set) => ({
//             step: 1,
//             adminData: null,
//             paymentData: null,
//             schoolData: null,
//             isProvisioned: false,
//             isLoading: false,
//             error: null,

//             setStep: (step) => set({ step, error: null }),
//             nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3), error: null })),
//             prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1), error: null })),
//             setAdminData: (adminData) => set({ adminData }),
//             setPaymentData: (paymentData) => set({ paymentData }),
//             setSchoolData: (schoolData) => set({ schoolData }),
//             setProvisioned: (isProvisioned) => set({ isProvisioned }),
//             setLoading: (isLoading) => set({ isLoading }),
//             setError: (error) => set({ error }),

//             // reset clears everything including isProvisioned
//             // always call setProvisioned(true) AFTER reset if needed
//             reset: () => set({
//                 step: 1,
//                 adminData: null,
//                 paymentData: null,
//                 schoolData: null,
//                 isProvisioned: false,
//                 error: null,
//             }),
//         }),
//         {
//             name: 'onboarding-store',
//             // Only persist data fields — never persist loading/error states
//             partialize: (state) => ({
//                 step: state.step,
//                 adminData: state.adminData,
//                 paymentData: state.paymentData,
//                 schoolData: state.schoolData,
//                 isProvisioned: state.isProvisioned, // ✅ persisted so refresh shows confirmation
//             }) as unknown as OnboardingState,
//         }
//     )
// );

// store/onboardingStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PlanType = 'starter' | 'pro' | 'enterprise' | null;
export type PaymentProvider = 'paystack' | 'stripe' | null;

export interface OnboardingAdminData {
    name: string;
    email: string;
    password?: string;
    phone?: string;
}

export interface OnboardingPaymentData {
    provider: PaymentProvider;
    plan: PlanType;
    reference: string;
    verified: boolean;
}

export interface SchoolData {
    schoolName: string;
    curriculumId: string;
    primaryColor: string;
    secondaryColor: string;
    country: string;
    timezone: string;
}

interface OnboardingState {
    step: number;
    adminData: OnboardingAdminData | null;
    paymentData: OnboardingPaymentData | null;
    schoolData: SchoolData | null;
    isProvisioned: boolean;
    confirmedEmail: string | null;
    isLoading: boolean;
    error: string | null;

    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setAdminData: (data: OnboardingAdminData) => void;
    setPaymentData: (data: OnboardingPaymentData) => void;
    setSchoolData: (data: SchoolData) => void;
    setProvisioned: (value: boolean) => void;
    setConfirmedEmail: (email: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
    persist(
        (set) => ({
            step: 1,
            adminData: null,
            paymentData: null,
            schoolData: null,
            isProvisioned: false,
            confirmedEmail: null,
            isLoading: false,
            error: null,

            setStep: (step) => set({ step, error: null }),
            nextStep: () => set((s) => ({ step: Math.min(s.step + 1, 3), error: null })),
            prevStep: () => set((s) => ({ step: Math.max(s.step - 1, 1), error: null })),
            setAdminData: (adminData) => set({ adminData }),
            setPaymentData: (paymentData) => set({ paymentData }),
            setSchoolData: (schoolData) => set({ schoolData }),
            setProvisioned: (isProvisioned) => set({ isProvisioned }),
            setConfirmedEmail: (confirmedEmail) => set({ confirmedEmail }),
            setLoading: (isLoading) => set({ isLoading }),
            setError: (error) => set({ error }),

            reset: () => set({
                step: 1,
                adminData: null,
                paymentData: null,
                schoolData: null,
                isProvisioned: false,
                error: null,
                // ✅ confirmedEmail intentionally NOT reset here
                // so resend button still works after reset clears adminData
            }),
        }),
        {
            name: 'onboarding-store',
            partialize: (state) => ({
                step: state.step,
                adminData: state.adminData,
                paymentData: state.paymentData,
                schoolData: state.schoolData,
                isProvisioned: state.isProvisioned,
                confirmedEmail: state.confirmedEmail, // ✅ persisted for resend after refresh
            }) as unknown as OnboardingState,
        }
    )
);