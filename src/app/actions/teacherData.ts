

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



'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'

/**
 * Fetches the complete profile for a teacher, including all relations
 * required by the ProfileInStore interface.
 */
export async function getTeacherData(email: string) {
    try {
        const teacher = await prisma.profile.findUnique({
            where: { email },
            include: {
                school: {
                    include: {
                        curriculum: true,
                        classEnrollments: { select: { id: true, classId: true } },
                        classes: { select: { id: true, name: true, teacherId: true } },
                        assessments: { select: { id: true, score: true } },
                        feedbacks: { select: { id: true, sentAt: true } },
                    }
                },
                curriculum: true,
                notifications: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                },
                classEnrollments: {
                    select: { id: true, classId: true }
                },
                taughtClasses: {
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
                                /**
                                 * FIXED: Relation 'lessons' does not exist on Topic.
                                 * Using 'GlobalLesson' and 'SchoolLesson' as per the Prisma schema.
                                 */
                                GlobalLesson: {
                                    select: { id: true, aiContent: true }
                                },
                                SchoolLesson: {
                                    select: { 
                                        id: true, 
                                        customContent: true, 
                                        isCustomized: true,
                                        status: true,
                                        schoolId: true
                                    }
                                }
                            },
                        },
                        studentSubjects: true,
                    },
                },
            },
        });

        return teacher;
    } catch (err) {
        const message = getErrorMessage(err);
        console.error('[TEACHER_DATA_ACTION_ERROR]:', message);
        return null;
    }
}