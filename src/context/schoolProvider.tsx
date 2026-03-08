'use client';

import React, { createContext, useContext, useEffect, useMemo, ReactNode, useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { ProfileInStore } from '@/types/profile';
import { getTeacherData } from '@/app/actions/teacherData';

interface ProvidedSchoolData {
    id: string;
    name: string;
    primaryColor: string;
    secondaryColor: string;
    whatsappCredits: number;
    curriculum: {
        id: string;
        name: string;
        yearLabel: string;
        termLabel: string;
        subjectLabel: string;
    };
}

interface SchoolContextValue {
    school: ProvidedSchoolData | undefined;
    teacher: ProfileInStore | null;
    isLoading: boolean;
}

const SchoolContext = createContext<SchoolContextValue | undefined>(undefined);

interface SchoolProviderProps {
    children: ReactNode;
    initialProfile: ProfileInStore | null;
}

export function SchoolProvider({ children, initialProfile }: SchoolProviderProps) {
    const setProfile = useProfileStore((state) => state.setProfile);
    const profile = useProfileStore((state) => state.profile);

    const [school, setSchool] = useState<ProvidedSchoolData | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize the store with the server-fetched profile
    // This runs before the school data effect, ensuring profile is set
    useEffect(() => {
        setProfile(initialProfile);
    }, [initialProfile, setProfile]);

    // Fetch school data only after profile is set in the store
    useEffect(() => {
        async function fetchSchoolData() {
            setIsLoading(true);
            if (profile?.schoolId) {
                try {
                    if (profile?.school == null) {
                        const teacherData = await getTeacherData(profile.email);
                        if (teacherData?.school) {
                            setSchool({
                                id: teacherData.school.id,
                                name: teacherData.school.name,
                                primaryColor: teacherData.school.primaryColor,
                                secondaryColor: teacherData.school.secondaryColor,
                                whatsappCredits: teacherData.school.whatsappCredits,
                                curriculum: {
                                    id: teacherData.curriculum.id,
                                    name: teacherData.curriculum.name,
                                    yearLabel: teacherData.curriculum.yearLabel,
                                    termLabel: teacherData.curriculum.termLabel,
                                    subjectLabel: teacherData.curriculum.subjectLabel,
                                },
                            });
                        } else {
                            setSchool(undefined);
                        }
                    } else {
                        // School data already exists on the profile, use it directly
                        setSchool({
                            id: profile.school.id,
                            name: profile.school.name,
                            primaryColor: profile.school.primaryColor,
                            secondaryColor: profile.school.secondaryColor,
                            whatsappCredits: profile.school.whatsappCredits,
                            curriculum: {
                                id: profile.curriculum.id,
                                name: profile.curriculum.name,
                                yearLabel: profile.curriculum.yearLabel,
                                termLabel: profile.curriculum.termLabel,
                                subjectLabel: profile.curriculum.subjectLabel,
                            },
                        });
                    }
                } catch (error) {
                    console.error('Error fetching school data:', error);
                    setSchool(undefined);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setSchool(undefined);
                setIsLoading(false);
            }
        }

        if (profile) {
            fetchSchoolData();
        } else {
            setSchool(undefined);
            setIsLoading(false);
        }
    }, [profile]); // Runs whenever profile changes in the store

    // Set CSS variables when school data is available
    useEffect(() => {
        if (school) {
            const root = document.documentElement;
            root.style.setProperty('--school-primary', school.primaryColor);
            root.style.setProperty('--school-secondary', school.secondaryColor);
        }
    }, [school]);

    const contextValue = useMemo(() => ({
        school,
        teacher: profile,
        isLoading,
    }), [school, profile, isLoading]);

    return (
        <SchoolContext.Provider value={contextValue}>
            {children}
        </SchoolContext.Provider>
    );
}

export function useSchool() {
    const context = useContext(SchoolContext);
    if (context === undefined) {
        throw new Error('useSchool must be used within a SchoolProvider');
    }
    return context;
}