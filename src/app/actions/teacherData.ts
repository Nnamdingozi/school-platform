

// // src/app/actions/teacherData.ts
// 'use server';

// import { prisma } from "@/lib/prisma";
// import { comprehensiveProfileInclude, ProfileInStore } from "@/types/profile";

// export const getTeacherData = async (email: string): Promise<ProfileInStore | null> => {
//   try {
//     const teacher = await prisma.profile.findUnique({
//       where: {
//         email: email,
//       },
//       include: comprehensiveProfileInclude,
//     });
//     return teacher;
//   } catch (error) {
//     console.error("Error fetching teacher data:", error);
//     return null;
//   }
// };


// 'use server'

// import { prisma } from '@/lib/prisma'
// import { comprehensiveProfileInclude, ProfileInStore } from '@/types/profile'
// import { getErrorMessage } from '@/lib/error-handler'

// export const getTeacherData = async (
//     email: string
// ): Promise<ProfileInStore | null> => {
//     try {
//         const teacher = await prisma.profile.findUnique({
//             where:   { email },
//             include: comprehensiveProfileInclude,
//         })

//         if (!teacher) return null

//         return teacher as unknown as ProfileInStore

//     } catch (error: unknown) {
//         console.error('Error fetching teacher data:', getErrorMessage(error))
//         return null
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { Role } from '@prisma/client'

// /**
//  * Fetches the complete profile for a teacher, including all relations
//  * required by the ProfileInStore interface.
//  */
// export async function getTeacherData(email: string) {
//     try {
//         const teacher = await prisma.profile.findUnique({
//             where: { email },
//             include: {
//                 school: {
//                     include: {
//                         curriculum: true,
//                         classEnrollments: { select: { id: true, classId: true } },
//                         classes: { select: { id: true, name: true, teacherId: true } },
//                         assessments: { select: { id: true, score: true } },
//                         feedbacks: { select: { id: true, sentAt: true } },
//                     }
//                 },
//                 curriculum: true,
//                 notifications: {
//                     orderBy: { createdAt: 'desc' },
//                     take: 20,
//                 },
//                 classEnrollments: {
//                     select: { id: true, classId: true }
//                 },
//                 taughtClasses: {
//                     include: { grade: true }
//                 },
//                 selectedSubjects: {
//                     include: {
//                         grade: { select: { displayName: true } },
//                         subject: { select: { name: true } },
//                         topics: {
//                             include: {
//                                 term: {
//                                     select: {
//                                         id: true,
//                                         displayName: true,
//                                         startDate: true,
//                                         endDate: true,
//                                     },
//                                 },
//                                 lessons: {
//                                     select: { id: true, aiContent: true }
//                                 },
//                             },
//                         },
//                         studentSubjects: true, // Required for student count
//                     },
//                 },
//             },
//         });

//         return teacher;
//     } catch (err) {
//         // ✅ Use custom error handler
//         console.error('getTeacherData failure:', getErrorMessage(err));
//         return null;
//     }
// }

// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'

// /**
//  * Fetches the complete profile for a teacher, including all relations
//  * required by the ProfileInStore interface.
//  */
// export async function getTeacherData(email: string) {
//     try {
//         const teacher = await prisma.profile.findUnique({
//             where: { email },
//             include: {
//                 school: {
//                     include: {
//                         curriculum: true,
//                         classEnrollments: { select: { id: true, classId: true } },
//                         classes: { select: { id: true, name: true, teacherId: true } },
//                         assessments: { select: { id: true, score: true } },
//                         feedbacks: { select: { id: true, sentAt: true } },
//                     }
//                 },
//                 curriculum: true,
//                 notifications: {
//                     orderBy: { createdAt: 'desc' },
//                     take: 20,
//                 },
//                 classEnrollments: {
//                     select: { id: true, classId: true }
//                 },
//                 taughtClasses: {
//                     include: { grade: true }
//                 },
//                 selectedSubjects: {
//                     include: {
//                         grade: { select: { displayName: true } },
//                         subject: { select: { name: true } },
//                         topics: {
//                             include: {
//                                 term: {
//                                     select: {
//                                         id:          true,
//                                         displayName: true,
//                                         startDate:   true,
//                                         endDate:     true,
//                                     },
//                                 },
//                                 lessons: {
//                                     select: { id: true, aiContent: true }
//                                 },
//                             },
//                         },
//                         studentSubjects: true, // Required for enrollment metrics
//                     },
//                 },
//             },
//         });

//         return teacher;
//     } catch (err) {
//         // ✅ Utilizing custom error handler for logging
//         const message = getErrorMessage(err);
//         console.error('getTeacherData registry access failure:', message);
//         return null;
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'

// /**
//  * Fetches the complete profile for a teacher, including all relations
//  * required by the ProfileInStore interface.
//  */
// export async function getTeacherData(email: string) {
//     try {
//         const teacher = await prisma.profile.findUnique({
//             where: { email },
//             include: {
//                 school: {
//                     include: {
//                         curriculum: true,
//                         classEnrollments: { select: { id: true, classId: true } },
//                         classes: { select: { id: true, name: true, teacherId: true } },
//                         assessments: { select: { id: true, score: true } },
//                         feedbacks: { select: { id: true, sentAt: true } },
//                     }
//                 },
//                 curriculum: true,
//                 notifications: {
//                     orderBy: { createdAt: 'desc' },
//                     take: 20,
//                 },
//                 classEnrollments: {
//                     select: { id: true, classId: true }
//                 },
//                 taughtClasses: {
//                     include: { grade: true }
//                 },
//                 selectedSubjects: {
//                     include: {
//                         grade: { select: { displayName: true } },
//                         subject: { select: { name: true } },
//                         topics: {
//                             include: {
//                                 term: {
//                                     select: {
//                                         id:          true,
//                                         displayName: true,
//                                         startDate:   true,
//                                         endDate:     true,
//                                     },
//                                 },
//                                 /**
//                                  * FIXED: Relation 'lessons' does not exist on Topic.
//                                  * Using 'GlobalLesson' and 'SchoolLesson' as per the Prisma schema.
//                                  */
//                                 GlobalLesson: {
//                                     select: { id: true, aiContent: true }
//                                 },
//                                 SchoolLesson: {
//                                     select: { 
//                                         id: true, 
//                                         customContent: true, 
//                                         isCustomized: true,
//                                         status: true,
//                                         schoolId: true
//                                     }
//                                 }
//                             },
//                         },
//                         studentSubjects: true,
//                     },
//                 },
//             },
//         });

//         return teacher;
//     } catch (err) {
//         const message = getErrorMessage(err);
//         console.error('[TEACHER_DATA_ACTION_ERROR]:', message);
//         return null;
//     }
// }



'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { Role, Prisma } from '@prisma/client'

/**
 * FETCH COMPLETE TEACHER CONTEXT
 * Rule 5: Scopes institutional data (classes, assessments, customized lessons).
 * Rule 10: Backend validation - switches to findFirst for composite key safety.
 */
export async function getTeacherData(email: string) {
    if (!email) return null;

    try {
        // 1. Initial lookup to resolve the teacher's schoolId
        const baseProfile = await prisma.profile.findFirst({
            where: { email: email.toLowerCase(), role: Role.TEACHER },
            select: { schoolId: true }
        });

        if (!baseProfile) return null;
        const schoolId = baseProfile.schoolId;

        // 2. Comprehensive Fetch with Strict Scoping (Rule 7)
        const teacher = await prisma.profile.findFirst({
            where: { email: email.toLowerCase(), role: Role.TEACHER },
            include: {
                school: {
                    include: {
                        curriculum: true,
                        // Rule 5: Only fetch enrollments and classes for this school
                        classEnrollments: { where: { schoolId: schoolId ?? undefined }, select: { id: true, classId: true } },
                        classes: { where: { schoolId: schoolId ?? undefined }, select: { id: true, name: true, teacherId: true } },
                        assessments: { where: { schoolId: schoolId ?? undefined }, select: { id: true, score: true } },
                        feedbacks: { where: { schoolId: schoolId ?? undefined }, select: { id: true, sentAt: true } },
                    }
                },
                curriculum: true,
                notifications: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                classEnrollments: {
                    where: { schoolId: schoolId ?? undefined },
                    select: { id: true, classId: true }
                },
                taughtClasses: {
                    where: { schoolId: schoolId ?? undefined },
                    include: { grade: true }
                },
                selectedSubjects: {
                    include: {
                        grade: { select: { displayName: true } },
                        subject: { select: { name: true } },
                        topics: {
                            include: {
                                term: {
                                    select: {
                                        id:          true,
                                        displayName: true,
                                        startDate:   true,
                                        endDate:     true,
                                    },
                                },
                                // Tier 1: Global knowledge core
                                GlobalLesson: {
                                    select: { id: true, aiContent: true, isGlobal: true }
                                },
                                // Tier 2: Institutional customization (Rule 5)
                                // We ONLY fetch the customization belonging to this teacher's school
                                SchoolLesson: {
                                    where: { schoolId: schoolId ?? "NO_SCHOOL" },
                                    select: { 
                                        id: true, 
                                        customContent: true, 
                                        isCustomized: true,
                                        status: true
                                    }
                                }
                            },
                        },
                        studentSubjects: {
                            where: { schoolId: schoolId ?? undefined }
                        },
                    },
                },
            },
        });

        return teacher;
    } catch (err: unknown) {
        const message = getErrorMessage(err);
        console.error('[TEACHER_DATA_ACTION_ERROR]:', message);
        return null;
    }
}