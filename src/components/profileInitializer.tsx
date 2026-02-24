// // src/components/ProfileInitializer.tsx
// 'use client';

// import { useEffect, useRef, ReactNode } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { ProfileInStore } from '@/types/profile';

// interface ProfileInitializerProps {
//   initialProfile: ProfileInStore | null;
//   children: ReactNode;
// }

// export function ProfileInitializer({ initialProfile, children }: ProfileInitializerProps) {
//   const initialized = useRef(false);

//   useEffect(() => {
//     // Ensure this runs only once to prevent re-initializing on every re-render
//     if (!initialized.current) {
//       useProfileStore.getState().setProfile(initialProfile);
//       initialized.current = true;
//     }
//   }, [initialProfile]); // Dependency array: Re-run if initialProfile itself changes (e.g., user logs in/out)

//   return <>{children}</>;
// }

// src/components/ProfileInitializer.tsx


// 'use client';

// import { useEffect, useRef, ReactNode } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { ProfileInStore } from '@/types/profile';

// interface ProfileInitializerProps {
//   initialProfile: ProfileInStore | null;
//   children: ReactNode;
// }

// export function ProfileInitializer({ initialProfile, children }: ProfileInitializerProps) {
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (!initialized.current) {
//       // Set loading to true initially, then false after setting profile
//       useProfileStore.getState().setLoading(true);
//       useProfileStore.getState().setProfile(initialProfile);
//       initialized.current = true;
//     }
//     // No need to re-run on initialProfile change unless you explicitly want to
//     // reset the store if the *entire* initialProfile prop itself changes during a session.
//     // For typical auth changes (login/logout), the layout will remount this component.
//   }, [initialProfile]);

//   return <>{children}</>;
// }

// 'use client';

// import { useEffect, useRef, ReactNode } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { ProfileInStore, SidebarProfileData } from '@/types/profile';

// interface ProfileInitializerProps {
//   initialProfile: ProfileInStore | null;
//   children: ReactNode;
// }

// export function ProfileInitializer({ initialProfile, children }: ProfileInitializerProps) {
//   const initialized = useRef(false);

//   useEffect(() => {
//     if (!initialized.current) {
//       // Logic to generate `sidebarData` *within this client component*
//       let sidebarData: SidebarProfileData | null = null;
//       if (initialProfile) {
//         sidebarData = {
//           name: initialProfile.name || "User",
//           email: initialProfile.email,
//           role: initialProfile.role,
//           primarySubject: initialProfile.selectedSubjects[0]?.subject.name || "General",
//           // Do *not* try to access `initialProfile.school` here, only direct properties
//         };
//       }

//       // Set loading to true initially, then false after setting profile
//       useProfileStore.getState().setLoading(true);
//       useProfileStore.getState().setProfile(initialProfile);
//       useProfileStore.getState().setSidebarData(sidebarData); // Set Sidebar Data
//       initialized.current = true;
//     }
//   }, [initialProfile]);

//   return <>{children}</>;
// }


// components/profileInitializer.tsx
'use client';

import { useEffect } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { ProfileInStore } from '@/types/profile';

interface Props {
    profile: ProfileInStore | null;
}

export function ProfileInitializer({ profile }: Props) {
    const setProfile = useProfileStore((state) => state.setProfile);

    useEffect(() => {
        setProfile(profile);
    }, [profile, setProfile]);

    return null; // renders nothing, just initializes store
}