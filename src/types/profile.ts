// // src/types/profile.ts (or wherever you keep your custom types)
// import { Prisma } from '@/generated/prisma/client'; // Assuming this path

// // Define the shape of the profile data that will be stored in Zustand.
// // This should mirror the Prisma.ProfileGetPayload with the specific `include`
// // that your `app/layout.tsx` uses when fetching the profile.
// export type ProfileInStore = Prisma.ProfileGetPayload<{
//   include: {
//     selectedSubjects: {
//       include: { subject: true }
//     }
//   }
// }>;

// // You might also want a simplified version for common usage
// export interface SidebarProfileData {
//   name: string;
//   email: string;
//   primarySubject: string; // Derived from selectedSubjects
// }


// import { Prisma } from '@/generated/prisma/client';
// import { Role } from '@/generated/prisma/client';

// // Define a comprehensive Prisma include that covers all relevant relations
// // for various roles. Fields that might not be fetched or apply to all roles
// // should be handled as optional or nullable in the fetched data.
// export const comprehensiveProfileInclude = {
//   // Always include basic relations
//   school: { 
//     select: {
//       id: true, name: true, primaryColor: true, secondaryColor: true, whatsappCredits: true,
//       curriculum: {
//         select: { id: true, name: true, yearLabel: true, termLabel: true, subjectLabel: true },
//       },
//     },
//   },
//   curriculum: true, // Every user has a curriculum
//   notifications: {
//     orderBy: { createdAt: 'desc' }, // Example: order notifications
//     take: 10, // Example: only fetch recent notifications
//   },

//   // Relations specific to TEACHER role
//   taughtClasses: { include: { grade: true } },
//   gradeSubjectsTaught: { include: { grade: true, subject: true } },
//   ownedGradeSubjects: { include: { grade: true, subject: true } }, // ProfileToGradeSubject

//   // Relations specific to STUDENT role
//   assessments: { include: { gradeSubject: true, topic: true } },
//   classEnrollments: { include: { class: true, gradeSubject: true } },

//   // Relations applicable to TEACHER / STUDENT / INDIVIDUAL_LEARNER
//   selectedSubjects: { include: { grade: true, subject: true } }, // UserSelectedSubjects

//   // Add any other top-level fields you always want
//   // (e.g., id, email, name, role, createdAt, updatedAt are implicitly included)
// } satisfies Prisma.ProfileInclude;

// // This type represents the full profile object fetched from Prisma with all relations
// export type ProfileInStore = Prisma.ProfileGetPayload<{
//   include: typeof comprehensiveProfileInclude;
// }>;

// // A simplified type for the sidebar, if needed, can be derived
// export interface SidebarProfileData {
//   name: string;
//   email: string;
//   role: Role;
//   primarySubject: string; // Derived from selectedSubjects, or 'General'
//   schoolName?: string; // Optional, as Individual Learner might not have a school
// }

// src/types/profile.ts
// import { GradeSubject, School, Curriculum } from '@/generated/prisma/client';

// export interface ProfileInStore {
//     id: string;
//     email: string;
//     name?: string | null;
//     role: "SUPER_ADMIN" | "SCHOOL_ADMIN" | "TEACHER" | "STUDENT" | "PARENT" | "INDIVIDUAL_LEARNER";
//     schoolId: string | null;
//     curriculumId: string;
//     school?: School | null;  // Include School data
//     curriculum: Curriculum
//     selectedSubjects: (GradeSubject & { grade: { displayName: string; }; subject: { name: string; }; topics: { id: string; termId: string; weekNumber: number | null; lessons: { id?: string | undefined; aiContent: any; }[]; title: string; }[]; enrollments: any[]; })[]; // Include selectedSubjects
// }

// export interface SidebarProfileData {
//   name: string;
//   email: string;
//   primarySubject: string; // Derived from selectedSubjects
// }


// export const comprehensiveProfileInclude = {
//     school: { // Include school data
//         include: {
//             curriculum: true,
//         },
//     },
//     curriculum: true,
//     selectedSubjects: {
//         include: {
//             grade: true,
//             subject: true,
//             topics: true,
//             enrollments: true,
//         },
//     },
// };

// src/types/profile.ts
// import { GradeSubject, School, Curriculum } from '@/generated/prisma/client';
// import { Role } from '@/generated/prisma/client';

// export interface ProfileInStore {
//     id: string;
//     email: string;
//     name?: string | null;
//     role: Role;
//     schoolId: string | null;
//     curriculumId: string;
//     school?: School | null;  // Include School data
//     curriculum: Curriculum
//     selectedSubjects: (GradeSubject & { grade: { displayName: string; }; subject: { name: string; }; topics: { id: string; termId: string; weekNumber: number | null; lessons: { id?: string | undefined; aiContent: any; }[]; title: string; }[]; enrollments: any[]; })[]; // Include selectedSubjects
//     createdAt: Date; // Add
//     updatedAt: Date; // Add
//     // Add role-specific properties here:
//     // For teachers:
//     taughtClasses?: { id: string; name: string; }[];  // Example
//     // For students:
//     // Add Student-specific fields like enrolledClasses, etc.
// }

// export const comprehensiveProfileInclude = {
//     school: { // Include school data
//         include: {
//             curriculum: true,
//         },
//     },
//     curriculum: true,
//     selectedSubjects: {
//         include: {
//             grade: true,
//             subject: true,
//             topics: true,
//             enrollments: true,
//         },
//     },
// };


// src/types/profile.ts
// import { GradeSubject, School, Curriculum } from '@/generated/prisma/client';
// import { Role } from '@/generated/prisma/client';

// export interface ProfileInStore {
//     id: string;
//     email: string;
//     name?: string | null;
//     role: Role;
//     schoolId: string | null;
//     curriculumId: string;
//     school?: School | null;
//     curriculum: Curriculum;
//     selectedSubjects: (GradeSubject & {
//         grade: { displayName: string; };
//         subject: { name: string; };
//         topics: {
//             id: string;
//             termId: string;
//             term: { id: string; displayName: string; } | null;
//             weekNumber: number | null;
//             lessons: { id?: string; aiContent: any; }[];
//             title: string;
//             description?: string | null;
//         }[];
//         enrollments: any[];
//     })[];
//     createdAt: Date;
//     updatedAt: Date;
//     taughtClasses?: { id: string; name: string; }[];
// }

// export const comprehensiveProfileInclude = {
//     school: {
//         include: {
//             curriculum: true,
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
// };

// export interface SidebarProfileData {
//     name: string;
//     email: string;
//     role: Role;
//     schoolName?: string;
//     primarySubject?: string;
// }


// import { GradeSubject, School, Curriculum, Notification } from '@/generated/prisma/client';
// import { Role } from '@/generated/prisma/client';

// export interface ProfileInStore {
//     id: string;
//     email: string;
//     name?: string | null;
//     role: Role;
//     schoolId: string | null;
//     curriculumId: string;
//     school?: School | null;
//     curriculum: Curriculum;
//     selectedSubjects: (GradeSubject & {
//         grade: { displayName: string; };
//         subject: { name: string; };
//         topics: {
//             id: string;
//             termId: string;
//             term: { id: string; displayName: string; } | null;
//             weekNumber: number | null;
//             lessons: { id?: string; aiContent: any; }[];
//             title: string;
//             description?: string | null;
//         }[];
//         enrollments: any[];
//     })[];
//     notifications: Notification[]; // ✅ real Notification model from Prisma
//     createdAt: Date;
//     updatedAt: Date;
//     taughtClasses?: { id: string; name: string; }[];
// }

// export const comprehensiveProfileInclude = {
//     school: {
//         include: {
//             curriculum: true,
//             classEnrollments: true,   // ← for student count
//             classes: true,             // ← for teacher count
//             assessments: true,         // ← for completion rate
//             feedbacks: true,           // ← for WhatsApp count
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
//         orderBy: { createdAt: 'desc' as const }, // ✅ newest first
//         take: 20,                                 // ✅ cap at 20 to avoid over-fetching
//     },
// };

// export interface SidebarProfileData {
//     name: string;
//     email: string;
//     role: Role;
//     schoolName?: string;
//     primarySubject?: string;
// }


// import { Curriculum, Notification, GradeSubject } from '@/generated/prisma/client';
// import { Role } from '@/generated/prisma/client';

// // ── Richer School type that includes the relations we actually use ──────────
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
//     // Relations included via comprehensiveProfileInclude
//     classEnrollments: { id: string }[];
//     classes: { id: string; name: string; teacherId: string }[];
//     assessments: { id: string; score: number | null }[];
//     feedbacks: { id: string; sentAt: Date | null }[];
// }

// export interface ProfileInStore {
//     id: string;
//     email: string;
//     name?: string | null;
//     role: Role;
//     schoolId: string | null;
//     curriculumId: string;
//     school?: SchoolWithRelations | null; // ✅ richer type, not bare School
//     curriculum: Curriculum;
//     selectedSubjects: (GradeSubject & {
//         grade: { displayName: string };
//         subject: { name: string };
//         topics: {
//             id: string;
//             termId: string;
//             term: { id: string; displayName: string } | null;
//             weekNumber: number | null;
//             lessons: { id?: string; aiContent: any }[];
//             title: string;
//             description?: string | null;
//         }[];
//         enrollments: any[];
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
//             classEnrollments: true,  // → totalStudents
//             classes: true,           // → activeTeachers
//             assessments: true,       // → completionRate
//             feedbacks: true,         // → whatsappSent
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
// };

// export interface SidebarProfileData {
//     name: string;
//     email: string;
//     role: Role;
//     schoolName?: string;
//     primarySubject?: string;
// }


import { Curriculum, Notification, GradeSubject } from '@/generated/prisma/client';
import { Role } from '@/generated/prisma/client';

export interface SchoolWithRelations {
    id: string;
    name: string;
    curriculumId: string;
    primaryColor: string;
    secondaryColor: string;
    whatsappCredits: number;
    createdAt: Date;
    updatedAt: Date;
    curriculum: Curriculum;
    classEnrollments: {
        id: string;
        classId: string | null; // ✅ explicitly typed so filter works
    }[];
    classes: {
        id: string;
        name: string;
        teacherId: string;
    }[];
    assessments: {
        id: string;
        score: number | null;
    }[];
    feedbacks: {
        id: string;
        sentAt: Date | null;
    }[];
}

export interface ProfileInStore {
    id: string;
    email: string;
    name?: string | null;
    role: Role;
    schoolId: string | null;
    curriculumId: string;
    school?: SchoolWithRelations | null;
    curriculum: Curriculum;
    selectedSubjects: (GradeSubject & {
        grade: { displayName: string };
        subject: { name: string };
        topics: {
            id: string;
            termId: string;
            term: { id: string; displayName: string } | null;
            weekNumber: number | null;
            lessons: { id?: string; aiContent: any }[];
            title: string;
            description?: string | null;
        }[];
        enrollments: any[];
    })[];
    notifications: Notification[];
    createdAt: Date;
    updatedAt: Date;
    taughtClasses?: { id: string; name: string }[];
}

export const comprehensiveProfileInclude = {
    school: {
        include: {
            curriculum: true,
            classEnrollments: {
                select: {
                    id: true,
                    classId: true, // ✅ required for per-class student count
                },
            },
            classes: {
                select: {
                    id: true,
                    name: true,
                    teacherId: true, // ✅ required for active teacher count
                },
            },
            assessments: {
                select: {
                    id: true,
                    score: true, // ✅ required for completion rate
                },
            },
            feedbacks: {
                select: {
                    id: true,
                    sentAt: true, // ✅ required for WhatsApp sent count
                },
            },
        },
    },
    curriculum: true,
    selectedSubjects: {
        include: {
            grade: true,
            subject: true,
            topics: {
                include: {
                    term: true,
                    lessons: true,
                },
            },
            enrollments: true,
        },
    },
    notifications: {
        orderBy: { createdAt: 'desc' as const },
        take: 20,
    },
};

export interface SidebarProfileData {
    name: string;
    email: string;
    role: Role;
    schoolName?: string;
    primarySubject?: string;
}
