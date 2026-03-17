// import { 
//     Curriculum, 
//     Notification, 
//     GradeSubject, 
//     Role, 
//     Prisma, 
//     ClassEnrollment 
// } from '@prisma/client'; // ✅ Consolidated imports

// export interface SchoolWithRelations {
//     id: string;
//     name: string;
//     curriculumId: string;
//     primaryColor: string;
//     secondaryColor: string;
//     whatsappCredits: number;
//     createdAt: Date;
//     updatedAt: Date;
//     curriculum: Curriculum;
//     classEnrollments: {
//         id: string;
//         classId: string | null;
//     }[];
//     classes: {
//         id: string;
//         name: string;
//         teacherId: string;
//     }[];
//     assessments: {
//         id: string;
//         score: number | null;
//     }[];
//     feedbacks: {
//         id: string;
//         sentAt: Date | null;
//     }[];
// }

// export interface ProfileInStore {
//     id: string;
//     email: string;
//     name?: string | null;
//     role: Role;
//     schoolId: string | null;
//     curriculumId: string;
//     school?: SchoolWithRelations | null;
//     curriculum: Curriculum;
//     selectedSubjects: (GradeSubject & {
//         grade: { displayName: string };
//         subject: { name: string };
//         topics: {
//             id: string;
//             termId: string;
//             term: {
//                 id:          string
//                 displayName: string
//                 startDate:   Date | null  // ← add
//                 endDate:     Date | null  // ← add
//             } | null
//             weekNumber: number | null;
//             // ✅ FIX 1: Replaced 'any' with Prisma.JsonValue
//             lessons: { id?: string; aiContent: Prisma.JsonValue }[];
//             title: string;
//             description?: string | null;
//         }[];
//         // ✅ FIX 2: Replaced 'any[]' with ClassEnrollment[]
//         enrollments: ClassEnrollment[];
//     })[];
//     notifications: Notification[];
//     createdAt: Date;
//     updatedAt: Date;
//     taughtClasses?: { id: string; name: string }[];
// }

// export const comprehensiveProfileInclude = {
//     school: {
//         include: {
//             curriculum: true,
//             classEnrollments: {
//                 select: {
//                     id: true,
//                     classId: true,
//                 },
//             },
//             classes: {
//                 select: {
//                     id: true,
//                     name: true,
//                     teacherId: true,
//                 },
//             },
//             assessments: {
//                 select: {
//                     id: true,
//                     score: true,
//                 },
//             },
//             feedbacks: {
//                 select: {
//                     id: true,
//                     sentAt: true,
//                 },
//             },
//         },
//     },
//     curriculum: true,
//     selectedSubjects: {
//         include: {
//             grade: true,
//             subject: true,
//             topics: {
//                 include: {
//                     term: true,
//                     lessons: true,
//                 },
//             },
//             enrollments: true,
//         },
//     },
//     notifications: {
//         orderBy: { createdAt: 'desc' as const },
//         take: 20,
//     },
// } satisfies Prisma.ProfileInclude; // ✅ Added satisfies for better type safety

// export interface SidebarProfileData {
//     name: string;
//     email: string;
//     role: Role;
//     schoolName?: string;
//     primarySubject?: string;
// }



import {
    Curriculum,
    Notification,
    GradeSubject,
    Role,
    Prisma,
    ClassEnrollment,
} from '@prisma/client'

export interface SchoolWithRelations {
    id:             string
    name:           string
    curriculumId:   string
    primaryColor:   string
    secondaryColor: string
    whatsappCredits: number
    createdAt:      Date
    updatedAt:      Date
    curriculum:     Curriculum
    classEnrollments: {
        id:      string
        classId: string | null
    }[]
    classes: {
        id:        string
        name:      string
        teacherId: string
    }[]
    assessments: {
        id:    string
        score: number | null
    }[]
    feedbacks: {
        id:     string
        sentAt: Date | null
    }[]
}

export interface ProfileInStore {
    id:           string
    email:        string
    name?:        string | null
    role:         Role
    schoolId:     string | null
    curriculumId: string
    school?:      SchoolWithRelations | null
    curriculum:   Curriculum
    selectedSubjects: (GradeSubject & {
        grade:   { displayName: string }
        subject: { name: string }
        topics: {
            id:          string
            termId:      string
            term: {
                id:          string
                displayName: string
                startDate:   Date | null
                endDate:     Date | null
            } | null
            weekNumber:   number | null
            // ✅ one-to-one relation — Lesson | null, not array
            lessons:      { id?: string; aiContent: Prisma.JsonValue } | null
            title:        string
            description?: string | null
        }[]
        enrollments: ClassEnrollment[]
    })[]
    notifications: Notification[]
    createdAt:     Date
    updatedAt:     Date
    taughtClasses?: { id: string; name: string }[]
}

export const comprehensiveProfileInclude = {
    school: {
        include: {
            curriculum: true,
            classEnrollments: {
                select: {
                    id:      true,
                    classId: true,
                },
            },
            classes: {
                select: {
                    id:        true,
                    name:      true,
                    teacherId: true,
                },
            },
            assessments: {
                select: {
                    id:    true,
                    score: true,
                },
            },
            feedbacks: {
                select: {
                    id:     true,
                    sentAt: true,
                },
            },
        },
    },
    curriculum: true,
    selectedSubjects: {
        include: {
            // ✅ use select — narrows grade to exactly { displayName }
            grade:   { select: { displayName: true } },
            // ✅ use select — narrows subject to exactly { name }
            subject: { select: { name: true } },
            topics: {
                include: {
                    // ✅ use select — narrows term to exactly the fields ProfileInStore declares
                    term: {
                        select: {
                            id:          true,
                            displayName: true,
                            startDate:   true,
                            endDate:     true,
                        },
                    },
                    // lessons is Lesson | null (one-to-one) — true is correct here
                    lessons: true,
                },
            },
            enrollments: true,
        },
    },
    notifications: {
        orderBy: { createdAt: 'desc' as const },
        take:    20,
    },
} satisfies Prisma.ProfileInclude

export interface SidebarProfileData {
    name:           string
    email:          string
    role:           Role
    schoolName?:    string
    primarySubject?: string
}