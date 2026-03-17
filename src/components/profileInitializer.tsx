

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


'use client'

import { useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { AnyProfile } from '@/types/profile'

interface Props {
    profile: AnyProfile | null
}

export function ProfileInitializer({ profile }: Props) {
    const setProfile = useProfileStore((state) => state.setProfile)

    useEffect(() => {
        if (profile) {
            setProfile(profile)
        }
    }, [profile, setProfile])

    return null
}