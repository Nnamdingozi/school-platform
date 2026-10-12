
// // src/store/profileStore.ts
// import { create } from 'zustand';
// import { ProfileInStore } from '@/types/profile';
// import { SidebarProfileData } from '@/types/profile';
// import { AnyProfile } from '@/types/profile'

// interface ProfileStore {
//     profile:      AnyProfile | null
//     isLoading:    boolean
//     setProfile:   (profile: AnyProfile) => void
//     clearProfile: () => void
// }

// // 1. Define the state interface
// interface ProfileState {
//     profile: ProfileInStore | null;
//     sidebarData: SidebarProfileData | null;
//     isLoading: boolean;
//     error: string | null;
//     // Potentially add other global profile-related flags, e.g., isProfileComplete: boolean
// }

// // 2. Define the actions interface
// interface ProfileActions {
//     setProfile: (profile: ProfileInStore | null) => void;
//     updateProfile: (updates: Partial<ProfileInStore>) => void; // For partial updates
//     clearProfile: () => void;
//     setLoading: (loading: boolean) => void;
//     setError: (error: string | null) => void;
//     setSidebarData: (sidebarData: SidebarProfileData | null) => void; // New, needed from app/layout
// }

// // 3. Combine them into a single store interface
// type ProfileStore = ProfileState & ProfileActions;

// // 4. Create the Zustand store
// export const useProfileStore = create<ProfileStore>((set) => ({
//     profile: null,
//     sidebarData: null,
//     isLoading: true,
//     error: null,

//     setProfile: (profileData) => {
//         console.log('Setting profile in store:', profileData); // Add this log
//         set({
//             profile: profileData,
//             isLoading: false,
//             error: null,
//         });
//     },

//     updateProfile: (updates) => set((state) => ({
//         profile: state.profile ? { ...state.profile, ...updates } : state.profile,
//     })),

//     clearProfile: () => set({
//         profile: null,
//         sidebarData: null,
//         isLoading: false,
//         error: null,
//     }),

//     setLoading: (loading) => set({ isLoading: loading }),
//     setError: (error) => set({ error: error, isLoading: false }),
//     setSidebarData: (sidebarData) => set({ sidebarData }), // Just set the data
// }));


// import { create } from 'zustand'
// import {
//     AnyProfile,
//     SidebarProfileData,
// } from '@/types/profile'

// // ── State ──────────────────────────────────────────────────────────────────────

// interface ProfileState {
//     profile:     AnyProfile | null  // ✅ union type — handles both parent and teacher
//     sidebarData: SidebarProfileData | null
//     isLoading:   boolean
//     error:       string | null
// }

// // ── Actions ────────────────────────────────────────────────────────────────────

// interface ProfileActions {
//     setProfile:     (profile: AnyProfile) => void          // ✅ AnyProfile not ProfileInStore
//     updateProfile:  (updates: Partial<AnyProfile>) => void // ✅ AnyProfile not ProfileInStore
//     clearProfile:   () => void
//     setLoading:     (loading: boolean) => void
//     setError:       (error: string | null) => void
//     setSidebarData: (sidebarData: SidebarProfileData | null) => void
// }

// // ── Combined store type ────────────────────────────────────────────────────────

// type ProfileStore = ProfileState & ProfileActions

// // ── Store ──────────────────────────────────────────────────────────────────────

// export const useProfileStore = create<ProfileStore>((set) => ({

//     // ── Initial state ──────────────────────────────────────────────────────
//     profile:     null,
//     sidebarData: null,
//     isLoading:   true,
//     error:       null,

//     // ── Actions ────────────────────────────────────────────────────────────
//     setProfile: (profileData) => {
//         set({
//             profile:   profileData,
//             isLoading: false,
//             error:     null,
//         })
//     },

//     updateProfile: (updates) => set((state) => ({
//         profile: state.profile
//             ? { ...state.profile, ...updates }
//             : null,
//     })),

//     clearProfile: () => set({
//         profile:     null,
//         sidebarData: null,
//         isLoading:   false,
//         error:       null,
//     }),


    

//     setLoading:     (loading) => set({ isLoading: loading }),
//     setError:       (error)   => set({ error, isLoading: false }),
//     setSidebarData: (sidebarData) => set({ sidebarData }),
// }))


import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
    AnyProfile,
    SidebarProfileData,
} from '@/types/profile';

// ── Types (Rule 15: Strict Registry Types) ──────────────────────────────────

interface ProfileState {
    profile: AnyProfile | null;     // Union type: supports Teacher, Parent, Admin, Individual
    sidebarData: SidebarProfileData | null;
    isLoading: boolean;
    error: string | null;
}

interface ProfileActions {
    setProfile: (profile: AnyProfile) => void;
    updateProfile: (updates: Partial<AnyProfile>) => void;
    clearProfile: () => void; // Standard alias for reset
    reset: () => void;        // Logic used by Logout Protocol
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSidebarData: (sidebarData: SidebarProfileData | null) => void;
}

type ProfileStore = ProfileState & ProfileActions;

/**
 * PROFILE REGISTRY STORE
 * Logic: Manages active user identity and role-specific sidebar navigation.
 * Rule 11: High-fidelity Registry state management.
 * Rule 15: Zero 'any' types - uses AnyProfile union.
 */
export const useProfileStore = create<ProfileStore>()(
    persist(
        (set) => ({
            // ── Initial Registry State ──
            profile: null,
            sidebarData: null,
            isLoading: true,
            error: null,

            // ── Identity Actions ──
            setProfile: (profileData: AnyProfile): void => {
                set({
                    profile: profileData,
                    isLoading: false,
                    error: null,
                });
            },

            updateProfile: (updates: Partial<AnyProfile>): void => {
                set((state: ProfileState) => ({
                    profile: state.profile
                        ? { ...state.profile, ...updates } as AnyProfile
                        : null,
                }));
            },

            /**
             * RESET PROTOCOL
             * Purges all identity and UI state during session termination.
             */
            reset: (): void => {
                set({
                    profile: null,
                    sidebarData: null,
                    isLoading: false,
                    error: null,
                });
            },

            clearProfile: (): void => {
                set({
                    profile: null,
                    sidebarData: null,
                    isLoading: false,
                    error: null,
                });
            },

            // ── UI & Status Actions ──
            setLoading: (loading: boolean): void => {
                set({ isLoading: loading });
            },

            setError: (error: string | null): void => {
                set({ error, isLoading: false });
            },

            setSidebarData: (sidebarData: SidebarProfileData | null): void => {
                set({ sidebarData });
            },
        }),
        {
            name: 'profile-registry-storage', // Persist user profile across refreshes
            partialize: (state: ProfileStore) => ({
                profile: state.profile,
                sidebarData: state.sidebarData,
            }) as ProfileStore,
        }
    )
);