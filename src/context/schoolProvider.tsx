// // components/SchoolProvider.tsx
// 'use client'; // This directive is necessary for client-side React features like createContext, useContext, useEffect

// import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
// import { Prisma } from '@/generated/prisma/client'; // Import Prisma types for better typing

// // Define the exact shape of the school data that will be provided via context.
// // This should match the 'select' fields you defined in your teacherInclude for 'school'.
// interface ProvidedSchoolData {
//   id: string;
//   name: string;
//   primaryColor: string;
//   secondaryColor: string;
//   whatsappCredits: number; // Example
//   curriculum: { // Nested curriculum data
//     id: string;
//     name: string;
//     yearLabel: string;
//     termLabel: string;
//     subjectLabel: string;
//   };
//   // Add any other fields selected in the 'school' part of your teacherInclude
// }

// // Create the Context with an initial undefined value
// const SchoolContext = createContext<ProvidedSchoolData | undefined>(undefined);

// interface SchoolProviderProps {
//   school: ProvidedSchoolData; // The school data is now a required prop
//   children: ReactNode;
// }

// export function SchoolProvider({ school, children }: SchoolProviderProps) {
//   // Use useMemo to ensure the context value is stable across re-renders
//   // unless the `school` prop itself changes.
//   const contextValue = useMemo(() => school, [school]);

//   // Dynamically set CSS variables for school colors
//   useEffect(() => {
//     if (school) {
//       const root = document.documentElement;
//       root.style.setProperty('--school-primary', school.primaryColor);
//       root.style.setProperty('--school-secondary', school.secondaryColor);
//       // As discussed, color-mix() in CSS will handle shades automatically.
//     }
//   }, [school]); // Re-run effect if school object (and thus its colors) changes

//   return (
//     <SchoolContext.Provider value={contextValue}>
//       {children}
//     </SchoolContext.Provider>
//   );
// }

// // Custom hook to consume the school data
// export function useSchool() {
//   const context = useContext(SchoolContext);
//   if (context === undefined) {
//     throw new Error('useSchool must be used within a SchoolProvider');
//   }
//   return context;
// }


// 'use client'; // This directive is necessary for client-side React features like createContext, useContext, useEffect

// import React, { createContext, useContext, useEffect, useMemo, ReactNode } from 'react';
// import { Prisma } from '@/generated/prisma/client'; // Import Prisma types for better typing

// // Define the exact shape of the school data that will be provided via context.
// // This should match the 'select' fields you defined in your teacherInclude for 'school'.
// interface ProvidedSchoolData {
//   id: string;
//   name: string;
//   primaryColor: string;
//   secondaryColor: string;
//   whatsappCredits: number; // Example
//   curriculum: { // Nested curriculum data
//     id: string;
//     name: string;
//     yearLabel: string;
//     termLabel: string;
//     subjectLabel: string;
//   };
//   // Add any other fields selected in the 'school' part of your teacherInclude
// }

// // Create the Context with an initial undefined value
// const SchoolContext = createContext<ProvidedSchoolData | undefined>(undefined);

// interface SchoolProviderProps {
//   school: ProvidedSchoolData | null; // The school data is now a required prop
//   children: ReactNode;
// }

// export function SchoolProvider({ school, children }: SchoolProviderProps) {

//   // Use useMemo to ensure the context value is stable across re-renders
//   // unless the `school` prop itself changes.
//   const contextValue = useMemo(() => school, [school]);

//   // Dynamically set CSS variables for school colors
//   useEffect(() => {
//     if (school) {
//       const root = document.documentElement;
//       root.style.setProperty('--school-primary', school.primaryColor);
//       root.style.setProperty('--school-secondary', school.secondaryColor);
//       // As discussed, color-mix() in CSS will handle shades automatically.
//     }
//   }, [school]); // Re-run effect if school object (and thus its colors) changes

//   return (
//     <SchoolContext.Provider value={contextValue}>
//       {children}
//     </SchoolContext.Provider>
//   );
// }

// // Custom hook to consume the school data
// export function useSchool() {
//   const context = useContext(SchoolContext);
//   if (context === undefined) {
//     throw new Error('useSchool must be used within a SchoolProvider');
//   }
//   return context;
// }

// 'use client';

// import React, { createContext, useContext, useEffect, useMemo, ReactNode, useState } from 'react';
// import { Prisma } from '@/generated/prisma/client';
// import { useProfileStore } from '@/store/profileStore';
// import { Profile } from '@/generated/prisma/client'

// const SchoolContext = createContext<ProvidedSchoolData | undefined>(undefined);

// interface ProvidedSchoolData {
//   id: string;
//   name: string;
//   primaryColor: string;
//   secondaryColor: string;
//   whatsappCredits: number; // Example
//   curriculum: { // Nested curriculum data
//     id: string;
//     name: string;
//     yearLabel: string;
//     termLabel: string;
//     subjectLabel: string;
//   };
//   // Add any other fields selected in the 'school' part of your teacherInclude
// }


// interface SchoolProviderProps {
//     children: ReactNode;
//     teacher: Profile | null; // Pass the teacher here
// }

// export function SchoolProvider({ children, teacher }: SchoolProviderProps) {
//     const [school, setSchool] = useState<ProvidedSchoolData | undefined>(undefined);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         setIsLoading(true);
//         if (teacher?.school) {
//             setSchool({
//                 id: teacher.school.id,
//                 name: teacher.school.name,
//                 primaryColor: teacher.school.primaryColor,
//                 secondaryColor: teacher.school.secondaryColor,
//                 whatsappCredits: teacher.school.whatsappCredits,
//                 curriculum: {
//                     id: teacher.school.curriculum.id,
//                     name: teacher.school.curriculum.name,
//                     yearLabel: teacher.school.curriculum.yearLabel,
//                     termLabel: teacher.school.curriculum.termLabel,
//                     subjectLabel: teacher.school.curriculum.subjectLabel,
//                 },
//             });
//         } else {
//             setSchool(undefined);
//         }
//         setIsLoading(false);
//     }, [teacher]);


//     const contextValue = useMemo(() => {
//         if (isLoading) {
//             return undefined; // Or a loading indicator
//         }
//         return school;
//     }, [school, isLoading]);

//     // Dynamically set CSS variables for school colors
//     useEffect(() => {
//         if (school) {
//             const root = document.documentElement;
//             root.style.setProperty('--school-primary', school.primaryColor);
//             root.style.setProperty('--school-secondary', school.secondaryColor);
//         }
//     }, [school]);

//     return (
//         <SchoolContext.Provider value={contextValue}>
//             {children}
//         </SchoolContext.Provider>
//     );
// }

// // Custom hook to consume the school data
// export function useSchool() {
//     const context = useContext(SchoolContext);
//     if (context === undefined) {
//         throw new Error('useSchool must be used within a SchoolProvider');
//     }
//     return context;
// }


// 'use client';

// import React, { createContext, useContext, useEffect, useMemo, ReactNode, useState } from 'react';
// import { Prisma } from '@/generated/prisma/client';
// import { useProfileStore } from '@/store/profileStore';
// import { Profile } from '@/generated/prisma/client';
// import { getTeacherData } from '@/app/actions/teacherData'; // Import the getTeacherData function

// interface ProvidedSchoolData {
//   id: string;
//   name: string;
//   primaryColor: string;
//   secondaryColor: string;
//   whatsappCredits: number; // Example
//   curriculum: { // Nested curriculum data
//     id: string;
//     name: string;
//     yearLabel: string;
//     termLabel: string;
//     subjectLabel: string;
//   };
//   // Add any other fields selected in the 'school' part of your teacherInclude
// }


// const SchoolContext = createContext<ProvidedSchoolData | undefined>(undefined);

// interface SchoolProviderProps {
//     children: ReactNode;
//     teacher: Profile | null; // Pass the teacher here
// }

// export function SchoolProvider({ children, teacher }: SchoolProviderProps) {
//     const [school, setSchool] = useState<ProvidedSchoolData | undefined>(undefined);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         setIsLoading(true);
//         async function fetchSchoolData() {
//             if (teacher?.schoolId) {
//                 try {
//                     const teacherData = await getTeacherData(teacher.email);
//                     if (teacherData?.school) {
//                         setSchool({
//                             id: teacherData.school.id,
//                             name: teacherData.school.name,
//                             primaryColor: teacherData.school.primaryColor,
//                             secondaryColor: teacherData.school.secondaryColor,
//                             whatsappCredits: teacherData.school.whatsappCredits,
//                             curriculum: {
//                                 id: teacherData.school.curriculum.id,
//                                 name: teacherData.school.curriculum.name,
//                                 yearLabel: teacherData.school.curriculum.yearLabel,
//                                 termLabel: teacherData.school.curriculum.termLabel,
//                                 subjectLabel: teacherData.school.curriculum.subjectLabel,
//                             },
//                         });
//                     } else {
//                         setSchool(undefined);
//                     }
//                 } catch (error) {
//                     console.error('Error fetching school data:', error);
//                     setSchool(undefined); // Or handle the error as appropriate
//                 } finally {
//                     setIsLoading(false);
//                 }
//             } else {
//                 setSchool(undefined);
//                 setIsLoading(false);
//             }
//         }

//         if (teacher) {
//             fetchSchoolData();
//         } else {
//             setSchool(undefined);
//             setIsLoading(false);
//         }
//     }, [teacher]);


//     const contextValue = useMemo(() => {
//         if (isLoading) {
//             return undefined; // Or a loading indicator
//         }
//         return school;
//     }, [school, isLoading]);

//     // Dynamically set CSS variables for school colors
//     useEffect(() => {
//         if (school) {
//             const root = document.documentElement;
//             root.style.setProperty('--school-primary', school.primaryColor);
//             root.style.setProperty('--school-secondary', school.secondaryColor);
//         }
//     }, [school]);

//     return (
//         <SchoolContext.Provider value={contextValue}>
//             {children}
//         </SchoolContext.Provider>
//     );
// }

// // Custom hook to consume the school data
// export function useSchool() {
//     const context = useContext(SchoolContext);
//     if (context === undefined) {
//         throw new Error('useSchool must be used within a SchoolProvider');
//     }
//     return context;
// }

// 'use client'; // This directive is necessary for client-side React features like createContext, useContext, useEffect, useState

// import React, { createContext, useContext, useEffect, useMemo, ReactNode, useState } from 'react';
// import { Prisma } from '@/generated/prisma/client';
// import { useProfileStore } from '@/store/profileStore';

// import { ProfileInStore } from '@/types/profile';
// import { getTeacherData } from '@/app/actions/teacherData';


// interface ProvidedSchoolData {
//     id: string;
//     name: string;
//     primaryColor: string;
//     secondaryColor: string;
//     whatsappCredits: number; // Example
//     curriculum: { // Nested curriculum data
//       id: string;
//       name: string;
//       yearLabel: string;
//       termLabel: string;
//       subjectLabel: string;
//     };
//     // Add any other fields selected in the 'school' part of your teacherInclude
//   }
  
  

// // Define the shape of the context value
// interface SchoolContextValue {
//     school: ProvidedSchoolData | undefined;
//     teacher: ProfileInStore | null;
//     isLoading: boolean;
// }

// // Create the Context with an initial undefined value
// const SchoolContext = createContext<SchoolContextValue | undefined>(undefined);

// interface SchoolProviderProps {
//     children: ReactNode;
//     initialProfile: ProfileInStore | null;
// }

// export function SchoolProvider({ children }: SchoolProviderProps) {
//     const { profile } = useProfileStore();
//     console.log("profile in schoolprovider", profile)

//     const [school, setSchool] = useState<ProvidedSchoolData | undefined>(undefined);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         async function fetchSchoolData() {
//             setIsLoading(true);
//             if (profile?.schoolId) {
//                 try {
//                     // Only refetch if teacher data is not already available on the user
//                     if (profile?.school == null) {
//                         const teacherData = await getTeacherData(profile.email);
//                         if (teacherData?.school) {
//                             setSchool({
//                                 id: teacherData.school.id,
//                                 name: teacherData.school.name,
//                                 primaryColor: teacherData.school.primaryColor,
//                                 secondaryColor: teacherData.school.secondaryColor,
//                                 whatsappCredits: teacherData.school.whatsappCredits,
//                                 curriculum: {
//                                     id: teacherData.curriculum.id,
//                                     name: teacherData.curriculum.name,
//                                     yearLabel: teacherData.curriculum.yearLabel,
//                                     termLabel: teacherData.curriculum.termLabel,
//                                     subjectLabel: teacherData.curriculum.subjectLabel,
//                                 },
//                             });
//                         } else {
//                             setSchool(undefined);
//                         }
//                     }
//                 } catch (error) {
//                     console.error('Error fetching school data:', error);
//                     setSchool(undefined); // Or handle the error as appropriate
//                 } finally {
//                     setIsLoading(false);
//                 }
//             } else {
//                 setSchool(undefined);
//                 setIsLoading(false);
//             }
//         }

//         if (profile) {
//             fetchSchoolData();
//         } else {
//             setSchool(undefined);
//             setIsLoading(false);
//         }
//     }, [profile]);

//     const contextValue = useMemo(() => ({
//         school,
//         teacher: profile,
//         isLoading,
//     }), [school, profile, isLoading]);

//     // Dynamically set CSS variables for school colors
//     useEffect(() => {
//         if (school) {
//             const root = document.documentElement;
//             root.style.setProperty('--school-primary', school.primaryColor);
//             root.style.setProperty('--school-secondary', school.secondaryColor);
//         }
//     }, [school]);

//     return (
//         <SchoolContext.Provider value={contextValue}>
//             {children}
//         </SchoolContext.Provider>
//     );
// }

// // Custom hook to consume the school data
// export function useSchool() {
//     const context = useContext(SchoolContext);
//     if (context === undefined) {
//         throw new Error('useSchool must be used within a SchoolProvider');
//     }
//     return context;
// }


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