// // src/store/profileStore.ts
// import { create } from 'zustand';
// import { ProfileInStore } from '@/types/profile'; // Import your defined type

// // 1. Define the state interface
// interface ProfileState {
//   profile: ProfileInStore | null;
//   isLoading: boolean; // Useful for initial fetch status
//   error: string | null; // Useful for displaying errors
// }

// // 2. Define the actions interface
// interface ProfileActions {
//   setProfile: (profile: ProfileInStore | null) => void;
//   updateProfile: (updates: Partial<ProfileInStore>) => void; // For partial updates
//   clearProfile: () => void; // For logout
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
// }

// // 3. Combine them into a single store interface
// type ProfileStore = ProfileState & ProfileActions;

// // 4. Create the Zustand store
// export const useProfileStore = create<ProfileStore>((set) => ({
//   profile: null,
//   isLoading: true, // Start as loading, assume layout will fetch it
//   error: null,

//   setProfile: (profileData) => set({
//     profile: profileData,
//     isLoading: false,
//     error: null, // Clear any previous error on successful set
//   }),

//   updateProfile: (updates) => set((state) => ({
//     profile: state.profile ? { ...state.profile, ...updates } : state.profile,
//   })),

//   clearProfile: () => set({
//     profile: null,
//     isLoading: false,
//     error: null,
//   }),

//   setLoading: (loading) => set({ isLoading: loading }),
//   setError: (error) => set({ error: error, isLoading: false }),
// }));



// // src/store/profileStore.ts
// import { create } from 'zustand';
// import { ProfileInStore } from '@/types/profile'; // Import your comprehensive type
// import { SidebarProfileData } from '@/types/profile';

// // 1. Define the state interface
// interface ProfileState {
//   profile: ProfileInStore | null;
//   sidebarData: SidebarProfileData | null;
//   isLoading: boolean;
//   error: string | null;
//   // Potentially add other global profile-related flags, e.g., isProfileComplete: boolean
// }

// // 2. Define the actions interface
// interface ProfileActions {
//   setProfile: (profile: ProfileInStore | null) => void;
//   updateProfile: (updates: Partial<ProfileInStore>) => void; // For partial updates
//   clearProfile: () => void;
//   setLoading: (loading: boolean) => void;
//   setError: (error: string | null) => void;
//   setSidebarData: (sidebarData: SidebarProfileData | null) => void; // New, needed from app/layout

// }

// // 3. Combine them into a single store interface
// type ProfileStore = ProfileState & ProfileActions;

// // 4. Create the Zustand store
// export const useProfileStore = create<ProfileStore>((set) => ({
//   profile: null,
//   sidebarData: null,
//   isLoading: true,
//   error: null,

//   setProfile: (profileData) => set({
//     profile: profileData,
//     isLoading: false,
//     error: null,
//   }),

//   updateProfile: (updates) => set((state) => ({
//     profile: state.profile ? { ...state.profile, ...updates } : state.profile,
//   })),

//   clearProfile: () => set({
//     profile: null,
//     sidebarData: null,
//     isLoading: false,
//     error: null,
//   }),

//   setLoading: (loading) => set({ isLoading: loading }),
//   setError: (error) => set({ error: error, isLoading: false }),
//   setSidebarData: (sidebarData) => set({ sidebarData }), // Just set the data
// }));

// src/store/profileStore.ts
import { create } from 'zustand';
import { ProfileInStore } from '@/types/profile';
import { SidebarProfileData } from '@/types/profile';

// 1. Define the state interface
interface ProfileState {
    profile: ProfileInStore | null;
    sidebarData: SidebarProfileData | null;
    isLoading: boolean;
    error: string | null;
    // Potentially add other global profile-related flags, e.g., isProfileComplete: boolean
}

// 2. Define the actions interface
interface ProfileActions {
    setProfile: (profile: ProfileInStore | null) => void;
    updateProfile: (updates: Partial<ProfileInStore>) => void; // For partial updates
    clearProfile: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    setSidebarData: (sidebarData: SidebarProfileData | null) => void; // New, needed from app/layout
}

// 3. Combine them into a single store interface
type ProfileStore = ProfileState & ProfileActions;

// 4. Create the Zustand store
export const useProfileStore = create<ProfileStore>((set) => ({
    profile: null,
    sidebarData: null,
    isLoading: true,
    error: null,

    setProfile: (profileData) => {
        console.log('Setting profile in store:', profileData); // Add this log
        set({
            profile: profileData,
            isLoading: false,
            error: null,
        });
    },

    updateProfile: (updates) => set((state) => ({
        profile: state.profile ? { ...state.profile, ...updates } : state.profile,
    })),

    clearProfile: () => set({
        profile: null,
        sidebarData: null,
        isLoading: false,
        error: null,
    }),

    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error: error, isLoading: false }),
    setSidebarData: (sidebarData) => set({ sidebarData }), // Just set the data
}));