

// components/profileInitializer.tsx


// 'use client';

// import { useEffect } from 'react';
// import { useProfileStore } from '@/store/profileStore';
// import { ProfileInStore } from '@/types/profile';

// interface Props {
//     profile: ProfileInStore | null;
// }

// export function ProfileInitializer({ profile }: Props) {
//     const setProfile = useProfileStore((state) => state.setProfile);

//     useEffect(() => {
//         setProfile(profile);
//     }, [profile, setProfile]);

//     return null; // renders nothing, just initializes store
// }


// 'use client'

// import { useEffect } from 'react'
// import { useProfileStore } from '@/store/profileStore'
// import { AnyProfile } from '@/types/profile'

// interface Props {
//     profile: AnyProfile | null
// }

// export function ProfileInitializer({ profile }: Props) {
//     const setProfile = useProfileStore((state) => state.setProfile)

//     useEffect(() => {
//         if (profile) {
//             setProfile(profile)
//         }
//     }, [profile, setProfile])

//     return null
// }

'use client'

import { useEffect, useRef } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { AnyProfile } from '@/types/profile'

interface ProfileInitializerProps {
    /**
     * The profile object fetched on the server.
     * Can be a School User (Tier 2) or an Independent Learner (Tier 3).
     */
    profile: AnyProfile | null
}

/**
 * HYDRATION COMPONENT
 * Rule 11: Synchronizes the Client Store with the Database Truth fetched on the server.
 * This component does not render UI; it only manages side-effects for the User Layer.
 */
export function ProfileInitializer({ profile }: ProfileInitializerProps) {
    const setProfile = useProfileStore((state) => state.setProfile);
    const initialized = useRef(false);

    useEffect(() => {
        // Rule 11: Ensure the client-side store reflects the latest server-side data.
        // We allow re-initialization if the profile object changes (e.g., after an update action).
        if (profile) {
            setProfile(profile);
            initialized.current = true;
        }
    }, [profile, setProfile]);

    // This component is a "Functional Side-Effect" and renders no markup.
    return null;
}