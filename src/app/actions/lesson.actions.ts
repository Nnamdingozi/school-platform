

// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { revalidatePath } from 'next/cache'
// export interface LessonBankStats {
//     totalLessons: number
//     coverageRate: number
//     recentCount: number
// }

// export interface LessonRegistryItem {
//     id: string
//     title: string
//     topicTitle: string
//     subjectName: string
//     gradeName: string
//     teacherName: string | null
//     updatedAt: Date
//     isGlobal: boolean // ✅ This is what the Page expects
// }



// export async function getAdminLessonBank(schoolId: string) {
//     try {
//         const now = new Date()
//         const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

//         // 1. Identify the School's Curriculum
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true }
//         });

//         if (!school) throw new Error("Institution not found.");
//         const currId = school.curriculumId;

//         // 2. Fetch Stats using Topic-Centric Logic
//         // This is the fix for the 0% coverage issue
//         const [totalRequiredTopics, totalTopicsWithLessons, recentActivity] = await Promise.all([
//             // Count every topic that belongs to this school's curriculum
//             prisma.topic.count({
//                 where: {
//                     OR: [
//                         { schoolId: schoolId }, // Custom school topics
//                         { gradeSubject: { grade: { curriculumId: currId } } } // Standard curriculum topics
//                     ]
//                 }
//             }),

//             // Count only topics that have AT LEAST ONE lesson (Global or Local)
//             prisma.topic.count({
//                 where: {
//                     OR: [
//                         { schoolId: schoolId },
//                         { gradeSubject: { grade: { curriculumId: currId } } }
//                     ],
//                     lessons: {
//                         some: {} // ✅ This is the key: it checks if the Lesson array is not empty
//                     }
//                 }
//             }),

//             // Count lessons created/edited in the last 24h for this curriculum
//             prisma.lesson.count({
//                 where: {
//                     createdAt: { gte: twentyFourHoursAgo },
//                     OR: [
//                         { schoolId: schoolId },
//                         { topic: { gradeSubject: { grade: { curriculumId: currId } } } }
//                     ]
//                 }
//             })
//         ])

//         // 3. Calculate Coverage
//         const coverageRate = totalRequiredTopics > 0 
//             ? Math.round((totalTopicsWithLessons / totalRequiredTopics) * 100) 
//             : 0

//         // 4. Fetch the Registry List for the table
//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 OR: [
//                     { schoolId: schoolId },
//                     { topic: { gradeSubject: { grade: { curriculumId: currId } } } }
//                 ]
//             },
//             include: {
//                 topic: {
//                     include: {
//                         gradeSubject: {
//                             include: {
//                                 subject: true,
//                                 grade: true,
//                                 teachers: { take: 1, select: { name: true } }
//                             }
//                         }
//                     }
//                 }
//             },
//             orderBy: { updatedAt: 'desc' }
//         })

//         const registry: LessonRegistryItem[] = lessons.map(l => ({
//             id: l.id,
//             title: l.title,
//             topicTitle: l.topic.title,
//             subjectName: l.topic.gradeSubject.subject.name,
//             gradeName: l.topic.gradeSubject.grade.displayName,
//             teacherName: l.topic.gradeSubject.teachers[0]?.name ?? 'Curriculum Bank',
//             updatedAt: l.updatedAt,
//             isGlobal: l.schoolId === null
//         }))

//         return {
//             success: true,
//             stats: { 
//                 totalLessons: totalTopicsWithLessons, // Unique content count
//                 coverageRate, 
//                 recentCount: recentActivity 
//             },
//             registry
//         }
//     } catch (err) {
//         console.error('getAdminLessonBank error:', getErrorMessage(err))
//         return { 
//             success: false, 
//             error: getErrorMessage(err), 
//             registry: [] as LessonRegistryItem[], 
//             stats: { totalLessons: 0, coverageRate: 0, recentCount: 0 } 
//         }
//     }
// }


// export async function getLessonForTopic(topicId: string, schoolId: string) {
//     try {
//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 topicId,
//                 OR: [{ schoolId }, { schoolId: null }]
//             }
//         });

//         const schoolVersion = lessons.find(l => l.schoolId === schoolId);
//         const globalVersion = lessons.find(l => l.schoolId === null);
//         const activeLesson = schoolVersion || globalVersion;

//         if (!activeLesson) return { success: true, data: null };

//         return { 
//             success: true, 
//             data: {
//                 id: activeLesson.id,
//                 isPrivate: activeLesson.schoolId !== null,
//                 aiContent: activeLesson.aiContent
//             } 
//         };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }


// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { revalidatePath } from 'next/cache'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface LessonBankStats {
//     totalLessons: number // ✅ Changed from totalAvailable
//     coverageRate:  number // ✅ Changed from readinessRate
//     recentCount: number // ✅ Changed from localEngagement
// }

// export interface LessonRegistryItem {
//     id: string
//     title: string
//     topicTitle: string
//     subjectName: string
//     gradeName: string
//     teacherName: string | null
//     updatedAt: Date
//     isPrivate: boolean // True if this is a school-specific version
    
// }

// // ── Main Action ────────────────────────────────────────────────────────────────

// export async function getAdminLessonBank(schoolId: string) {
//     try {
//         // 1. Resolve Institutional Context
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true }
//         });

//         if (!school) throw new Error("Institution not discovered in registry.");
//         const currId = school.curriculumId;

//         // 2. Define the "Academic Scope" 
//         // This includes all GradeSubjects belonging to the national curriculum 
//         // PLUS any GradeSubjects created specifically by this school (e.g. Robotics)
//         const schoolScopeFilter = {
//             OR: [
//                 { schoolId: schoolId }, // School-specific subjects
//                 { schoolId: null, grade: { curriculumId: currId } } // National curriculum
//             ]
//         };

//         // 3. Parallel Stats Query (Topic-Centric)
//         const [totalTopicsInSyllabus, topicsWithContent, schoolSpecificLessons] = await Promise.all([
//             // A. Count every topic the school is required to teach
//             prisma.topic.count({
//                 where: { gradeSubject: schoolScopeFilter }
//             }),

//             // B. Count unique topics that have AT LEAST one lesson (Global or Private)
//             prisma.topic.count({
//                 where: { 
//                     gradeSubject: schoolScopeFilter,
//                     lessons: { some: {} } 
//                 }
//             }),

//             // C. Count lessons that were specifically created or edited by this school
//             prisma.lesson.count({
//                 where: { schoolId: schoolId }
//             })
//         ]);

//         // 4. Calculate Success Metrics
//         const readinessRate = totalTopicsInSyllabus > 0 
//             ? Math.round((topicsWithContent / totalTopicsInSyllabus) * 100) 
//             : 0;

//         const localEngagement = topicsWithContent > 0
//             ? Math.round((schoolSpecificLessons / topicsWithContent) * 100)
//             : 0;

//         // 5. Fetch the Registry (Prioritized List)
//         // If a topic has both a Global and School version, we show the School version first
//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 OR: [
//                     { schoolId: schoolId },
//                     { 
//                         schoolId: null, 
//                         topic: { gradeSubject: schoolScopeFilter } 
//                     }
//                 ]
//             },
//             include: {
//                 topic: {
//                     include: {
//                         gradeSubject: {
//                             include: {
//                                 subject: true,
//                                 grade: true,
//                                 teachers: { take: 1, select: { name: true } }
//                             }
//                         }
//                     }
//                 }
//             },
//             orderBy: [
//                 { schoolId: 'desc' }, // Private edits appear at the top
//                 { updatedAt: 'desc' }
//             ]
//         });

//         // 6. Map to clean UI Interface
//         const registry: LessonRegistryItem[] = lessons.map(l => ({
//             id: l.id,
//             title: l.title,
//             topicTitle: l.topic.title,
//             subjectName: l.topic.gradeSubject.subject.name,
//             gradeName: l.topic.gradeSubject.grade.displayName,
//             teacherName: l.topic.gradeSubject.teachers[0]?.name ?? 'Curriculum Bank',
//             updatedAt: l.updatedAt,
//             isPrivate: l.schoolId !== null
//         }));

//         return {
//             success: true,
//             stats: { 
//                 totalLessons: topicsWithContent, 
//                 coverageRate: readinessRate, 
//                 recentCount: localEngagement 
//             },
//             registry
//         }
//     } catch (err) {
//         console.error('getAdminLessonBank failure:', getErrorMessage(err));
//         return { 
//             success: false, 
//             error: getErrorMessage(err), 
//             registry: [] as LessonRegistryItem[], 
//             stats: { totalLessons: 0, coverageRate: 0, recentCount: 0 } 
//         };
//     }
// }

// /**
//  * Prioritized Single Fetch (Teacher/Student View)
//  */
// export async function getLessonForTopic(topicId: string, schoolId: string) {
//     try {
//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 topicId,
//                 OR: [{ schoolId }, { schoolId: null }]
//             }
//         });

//         const schoolVersion = lessons.find(l => l.schoolId === schoolId);
//         const globalVersion = lessons.find(l => l.schoolId === null);
//         const activeLesson = schoolVersion || globalVersion;

//         if (!activeLesson) return { success: true, data: null };

//         return { 
//             success: true, 
//             data: {
//                 id: activeLesson.id,
//                 isPrivate: activeLesson.schoolId !== null,
//                 aiContent: activeLesson.aiContent
//             } 
//         };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { revalidatePath } from 'next/cache'

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface LessonBankStats {
//     totalLessons: number 
//     coverageRate:  number 
//     recentCount: number 
// }

// export interface LessonRegistryItem {
//     id: string
//     title: string
//     topicTitle: string
//     subjectName: string
//     gradeName: string
//     teacherName: string | null
//     updatedAt: Date
//     isPrivate: boolean 
// }

// // ── Main Action ────────────────────────────────────────────────────────────────

// export async function getAdminLessonBank(schoolId: string) {
//     try {
//         // 1. Resolve Institutional Context
//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true }
//         });

//         if (!school) throw new Error("Institution not discovered in registry.");
//         const currId = school.curriculumId;

//         const schoolScopeFilter = {
//             OR: [
//                 { schoolId: schoolId }, 
//                 { schoolId: null, grade: { curriculumId: currId } } 
//             ]
//         };

//         // 3. Parallel Stats Query
//         const [totalTopicsInSyllabus, topicsWithContent, schoolSpecificLessons] = await Promise.all([
//             prisma.topic.count({ where: { gradeSubject: schoolScopeFilter } }),
//             prisma.topic.count({ 
//                 where: { 
//                     gradeSubject: schoolScopeFilter,
//                     lessons: { some: {} } 
//                 } 
//             }),
//             prisma.lesson.count({ where: { schoolId: schoolId } })
//         ]);

//         const readinessRate = totalTopicsInSyllabus > 0 
//             ? Math.round((topicsWithContent / totalTopicsInSyllabus) * 100) 
//             : 0;

//         const localEngagement = topicsWithContent > 0
//             ? Math.round((schoolSpecificLessons / topicsWithContent) * 100)
//             : 0;

//         // 5. Fetch the Registry
//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 OR: [
//                     { schoolId: schoolId },
//                     { schoolId: null, topic: { gradeSubject: schoolScopeFilter } }
//                 ]
//             },
//             include: {
//                 topic: {
//                     include: {
//                         gradeSubject: {
//                             include: {
//                                 subject: true,
//                                 grade: true,
//                                 teachers: { take: 1, select: { name: true } }
//                             }
//                         }
//                     }
//                 }
//             },
//             orderBy: [
//                 { schoolId: 'desc' }, 
//                 { updatedAt: 'desc' }
//             ]
//         });

//         const registry: LessonRegistryItem[] = lessons.map(l => ({
//             id: l.id,
//             title: l.title,
//             topicTitle: l.topic.title,
//             subjectName: l.topic.gradeSubject.subject.name,
//             gradeName: l.topic.gradeSubject.grade.displayName,
//             teacherName: l.topic.gradeSubject.teachers[0]?.name ?? 'Curriculum Bank',
//             updatedAt: l.updatedAt,
//             isPrivate: l.schoolId !== null
//         }));

//         // ✅ REVALIDATION: Ensure the Admin Bank and main Admin Dashboard show fresh data
//         revalidatePath('/admin/lessons')
//         revalidatePath('/admin')

//         return {
//             success: true,
//             stats: { 
//                 totalLessons: topicsWithContent, 
//                 coverageRate: readinessRate, 
//                 recentCount: localEngagement 
//             },
//             registry
//         }
//     } catch (err) {
//         console.error('getAdminLessonBank failure:', getErrorMessage(err));
//         return { 
//             success: false, 
//             error: getErrorMessage(err), 
//             registry: [] as LessonRegistryItem[], 
//             stats: { totalLessons: 0, coverageRate: 0, recentCount: 0 } 
//         };
//     }
// }

// /**
//  * Prioritized Single Fetch (Teacher/Student View)
//  */
// export async function getLessonForTopic(topicId: string, schoolId: string) {
//     try {
//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 topicId,
//                 OR: [{ schoolId }, { schoolId: null }]
//             }
//         });

//         const schoolVersion = lessons.find(l => l.schoolId === schoolId);
//         const globalVersion = lessons.find(l => l.schoolId === null);
//         const activeLesson = schoolVersion || globalVersion;

//         if (!activeLesson) return { success: true, data: null };

//         // ✅ REVALIDATION: Ensure teacher and student see the latest version
//         revalidatePath(`/teacher/lessons/${topicId}`)
//         revalidatePath(`/student/lessons/${topicId}`)

//         return { 
//             success: true, 
//             data: {
//                 id: activeLesson.id,
//                 isPrivate: activeLesson.schoolId !== null,
//                 aiContent: activeLesson.aiContent
//             } 
//         };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * ── WRITER ──────────────────────────────────────────────────────────────────
//  * This is where revalidatePath is most critical.
//  */
// export async function saveLesson(data: {
//     topicId: string,
//     schoolId: string,
//     title: string,
//     content: string,
//     aiContent: any
// }) {
//     try {
//         const lesson = await prisma.lesson.upsert({
//             where: {
//                 topicId_schoolId: {
//                     topicId: data.topicId,
//                     schoolId: data.schoolId
//                 }
//             },
//             update: {
//                 title: data.title,
//                 content: data.content,
//                 aiContent: data.aiContent,
//             },
//             create: {
//                 topicId: data.topicId,
//                 schoolId: data.schoolId,
//                 title: data.title,
//                 content: data.content,
//                 aiContent: data.aiContent,
//             }
//         });

//         // ✅ REVALIDATION: Clear cache for all related views after a save
//         revalidatePath('/admin/lessons');
//         revalidatePath(`/teacher/lessons/${data.topicId}`);
//         revalidatePath(`/student/lessons/${data.topicId}`);

//         return { success: true, data: lesson };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }



// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { revalidatePath } from 'next/cache'
// import { Prisma } from '@prisma/client'
// // ✅ Import the strict type from your generator
// import { type LessonAiContent } from '@/app/actions/ai-generator' 

// // ── Types ──────────────────────────────────────────────────────────────────────

// export interface LessonBankStats {
//     totalLessons: number 
//     coverageRate:  number 
//     recentCount: number 
// }

// export interface LessonRegistryItem {
//     id: string
//     title: string
//     topicTitle: string
//     subjectName: string
//     gradeName: string
//     teacherName: string | null
//     updatedAt: Date
//     isPrivate: boolean 
// }

// // ── Main Action ────────────────────────────────────────────────────────────────

// export async function getAdminLessonBank(schoolId: string) {
//     try {
//         // const now = new Date()
//         // const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

//         const school = await prisma.school.findUnique({
//             where: { id: schoolId },
//             select: { curriculumId: true }
//         });

//         if (!school) throw new Error("Institution not discovered in registry.");
//         const currId = school.curriculumId;

//         const schoolScopeFilter = {
//             OR: [
//                 { schoolId: schoolId }, 
//                 { schoolId: null, grade: { curriculumId: currId } } 
//             ]
//         };

//         const [totalTopicsInSyllabus, topicsWithContent, schoolSpecificLessons] = await Promise.all([
//             prisma.topic.count({ where: { gradeSubject: schoolScopeFilter } }),
//             prisma.topic.count({ 
//                 where: { 
//                     gradeSubject: schoolScopeFilter,
//                     lessons: { some: {} } 
//                 } 
//             }),
//             prisma.lesson.count({ where: { schoolId: schoolId } })
//         ]);

//         const readinessRate = totalTopicsInSyllabus > 0 
//             ? Math.round((topicsWithContent / totalTopicsInSyllabus) * 100) 
//             : 0;

//         const localEngagement = topicsWithContent > 0
//             ? Math.round((schoolSpecificLessons / topicsWithContent) * 100)
//             : 0;

//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 OR: [
//                     { schoolId: schoolId },
//                     { schoolId: null, topic: { gradeSubject: schoolScopeFilter } }
//                 ]
//             },
//             include: {
//                 topic: {
//                     include: {
//                         gradeSubject: {
//                             include: {
//                                 subject: true,
//                                 grade: true,
//                                 teachers: { take: 1, select: { name: true } }
//                             }
//                         }
//                     }
//                 }
//             },
//             orderBy: [
//                 { schoolId: 'desc' }, 
//                 { updatedAt: 'desc' }
//             ]
//         });

//         const registry: LessonRegistryItem[] = lessons.map(l => ({
//             id: l.id,
//             title: l.title,
//             topicTitle: l.topic.title,
//             subjectName: l.topic.gradeSubject.subject.name,
//             gradeName: l.topic.gradeSubject.grade.displayName,
//             teacherName: l.topic.gradeSubject.teachers[0]?.name ?? 'Curriculum Bank',
//             updatedAt: l.updatedAt,
//             isPrivate: l.schoolId !== null
//         }));

//         revalidatePath('/admin/lessons')
//         revalidatePath('/admin')

//         return {
//             success: true,
//             stats: { 
//                 totalLessons: topicsWithContent, 
//                 coverageRate: readinessRate, 
//                 recentCount: localEngagement 
//             },
//             registry
//         }
//     } catch (err: unknown) {
//         console.error('getAdminLessonBank failure:', getErrorMessage(err));
//         return { 
//             success: false, 
//             error: getErrorMessage(err), 
//             registry: [] as LessonRegistryItem[], 
//             stats: { totalLessons: 0, coverageRate: 0, recentCount: 0 } 
//         };
//     }
// }

// /**
//  * Prioritized Single Fetch (Teacher/Student View)
//  */
// export async function getLessonForTopic(topicId: string, schoolId: string) {
//     try {
//         const lessons = await prisma.lesson.findMany({
//             where: {
//                 topicId,
//                 OR: [{ schoolId }, { schoolId: null }]
//             }
//         });

//         const schoolVersion = lessons.find(l => l.schoolId === schoolId);
//         const globalVersion = lessons.find(l => l.schoolId === null);
//         const activeLesson = schoolVersion || globalVersion;

//         if (!activeLesson) return { success: true, data: null };

//         revalidatePath(`/teacher/lessons/${topicId}`)
//         revalidatePath(`/student/lessons/${topicId}`)

//         return { 
//             success: true, 
//             data: {
//                 id: activeLesson.id,
//                 isPrivate: activeLesson.schoolId !== null,
//                 aiContent: activeLesson.aiContent
//             } 
//         };
//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// /**
//  * ✅ FIX: Replaced 'any' with 'LessonAiContent' to resolve Build Error
//  */
// export async function saveLesson(data: {
//     topicId: string,
//     schoolId: string,
//     title: string,
//     content: string,
//     aiContent: LessonAiContent // ✅ Strictly typed
// }) {
//     try {
//         const lesson = await prisma.lesson.upsert({
//             where: {
//                 topicId_schoolId: {
//                     topicId: data.topicId,
//                     schoolId: data.schoolId
//                 }
//             },
//             update: {
//                 title: data.title,
//                 content: data.content,
//                 aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//             },
//             create: {
//                 topicId: data.topicId,
//                 schoolId: data.schoolId,
//                 title: data.title,
//                 content: data.content,
//                 aiContent: data.aiContent as unknown as Prisma.InputJsonValue,
//             }
//         });

//         revalidatePath('/admin/lessons');
//         revalidatePath(`/teacher/lessons/${data.topicId}`);
//         revalidatePath(`/student/lessons/${data.topicId}`);

//         return { success: true, data: lesson };
//     } catch (err: unknown) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }


// export async function getStudentLesson(topicId: string, schoolId: string) {
//     try {
//       const lessons = await prisma.lesson.findMany({
//         where: {
//           topicId,
//           OR: [{ schoolId }, { schoolId: null }],
//         },
//         include: {
//           topic: {
//             include: {
//               gradeSubject: {
//                 include: {
//                   subject: true,
//                 },
//               },
//             },
//           },
//         },
//       });
  
//       const schoolLesson = lessons.find((l) => l.schoolId === schoolId);
//       const globalLesson = lessons.find((l) => l.schoolId === null);
  
//       const activeLesson = schoolLesson || globalLesson;
  
//       if (!activeLesson) {
//         return { success: true, data: null };
//       }
  
//       revalidatePath(`/student/lessons/${topicId}`);
  
//       return {
//         success: true,
//         data: {
//           id: activeLesson.id,
//           title: activeLesson.title,
//           subject: activeLesson.topic.gradeSubject.subject.name,
//           aiContent: activeLesson.aiContent,
//         },
//       };
//     } catch (err: unknown) {
//       return {
//         success: false,
//         error: getErrorMessage(err),
//       };
//     }
//   }


//   // /app/actions/lesson.actions.ts

// export async function getLessonForTeacher(topicId: string, schoolId: string) {
//     // 1. Check if school already has lesson
//     let schoolLesson = await db.schoolLesson.findFirst({
//       where: { topicId, schoolId },
//       include: { globalLesson: true }
//     });
  
//     // 2. If NOT → create from global
//     if (!schoolLesson) {
//       let globalLesson = await db.globalLesson.findUnique({
//         where: { topicId }
//       });
  
//       // 3. If global does NOT exist → generate
//       if (!globalLesson) {
//         const aiContent = await generateLessonForTopic(topicId);
  
//         globalLesson = await db.globalLesson.create({
//           data: { topicId, aiContent }
//         });
//       }
  
//       // 4. Create school-specific lesson
//       schoolLesson = await db.schoolLesson.create({
//         data: {
//           topicId,
//           schoolId,
//           globalLessonId: globalLesson.id,
//           status: "draft"
//         },
//         include: { globalLesson: true }
//       });
//     }
  
//     return {
//       success: true,
//       data: schoolLesson
//     };
//   }


//   export async function publishLesson({
//     topicId,
//     schoolId,
//     content
//   }: {
//     topicId: string;
//     schoolId: string;
//     content: any;
//   }) {
//     await db.schoolLesson.update({
//       where: {
//         topicId_schoolId: { topicId, schoolId }
//       },
//       data: {
//         customContent: content,
//         status: "published",
//         isCustomized: true
//       }
//     });
  
//     return { success: true };
//   }


//   export async function getStudentLesson(topicId: string, schoolId: string) {
//     const lesson = await db.schoolLesson.findFirst({
//       where: {
//         topicId,
//         schoolId,
//         status: "published"
//       },
//       include: {
//         globalLesson: true
//       }
//     });
  
//     if (!lesson) {
//       return { success: true, data: null };
//     }
  
//     const aiContent =
//       lesson.customContent ?? lesson.globalLesson.aiContent;
  
//     return {
//       success: true,
//       data: {
//         ...lesson,
//         aiContent
//       }
//     };
//   }

//   export async function createLessonVersion(schoolLessonId: string, content: any) {
//     await db.lessonVersion.create({
//       data: {
//         schoolLessonId,
//         content,
//       },
//     });
//   }



'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { revalidatePath } from 'next/cache'
import { Prisma } from '@prisma/client'
import { type LessonAiContent } from '@/app/actions/ai-generator'

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface LessonVersionInput {
  schoolLessonId: string
  content: LessonAiContent
}

// ─────────────────────────────────────────────
// 1. GLOBAL AI GENERATION
// ─────────────────────────────────────────────

export async function generateLessonForTopic(topicId: string, schoolId: string) {
  try {
    let globalLesson = await prisma.globalLesson.findUnique({
      where: { topicId }
    })

    if (!globalLesson) {
      const aiContent = await fakeAIGeneration(topicId)

      globalLesson = await prisma.globalLesson.create({
        data: {
          topicId,
          aiContent: aiContent as Prisma.InputJsonValue
        }
      })
    }

    return {
      success: true,
      aiContent: globalLesson.aiContent
    }

  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    }
  }
}

// ─────────────────────────────────────────────
// 2. SCHOOL LESSON GET OR CREATE
// ─────────────────────────────────────────────

export async function getOrCreateSchoolLesson({
  topicId,
  schoolId,
  aiContent
}: {
  topicId: string
  schoolId: string
  aiContent: LessonAiContent
}) {
  try {
    let lesson = await prisma.schoolLesson.findFirst({
      where: { topicId, schoolId },
      include: { globalLesson: true }
    })

    if (!lesson) {
      const globalLesson = await prisma.globalLesson.findUnique({
        where: { topicId }
      })

      if (!globalLesson) {
        throw new Error("Global lesson missing")
      }

      lesson = await prisma.schoolLesson.create({
        data: {
          topicId,
          schoolId,
          globalLessonId: globalLesson.id,
          aiContent: globalLesson.aiContent as Prisma.InputJsonValue,
          isCustomized: false,
          status: "draft"
        },
        include: { globalLesson: true }
      })
    }

    return {
      success: true,
      data: lesson
    }

  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    }
  }
}

// ─────────────────────────────────────────────
// 3. TEACHER SAVE (UPDATE + VERSION HISTORY)
// ─────────────────────────────────────────────

export async function saveSchoolLesson({
  lessonId,
  schoolId,
  topicId,
  aiContent
}: {
  lessonId: string
  schoolId: string
  topicId: string
  aiContent: LessonAiContent
}) {
  try {
    const lesson = await prisma.schoolLesson.update({
      where: {
        id: lessonId
      },
      data: {
        aiContent: aiContent as Prisma.InputJsonValue,
        isCustomized: true,
        status: "draft"
      }
    })

    // 🧠 VERSION HISTORY (IMPORTANT)
    await prisma.lessonVersion.create({
      data: {
        schoolLessonId: lessonId,
        content: aiContent as Prisma.InputJsonValue
      }
    })

    revalidatePath(`/teacher/lessons/${topicId}`)
    revalidatePath(`/student/lessons/${topicId}`)

    return {
      success: true,
      data: lesson
    }

  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    }
  }
}

// ─────────────────────────────────────────────
// 4. TEACHER FETCH (SCHOOL → GLOBAL FALLBACK)
// ─────────────────────────────────────────────

export async function getLessonForTeacher(topicId: string, schoolId: string) {
  try {
    const schoolLesson = await prisma.schoolLesson.findFirst({
      where: { topicId, schoolId },
      include: { globalLesson: true }
    })

    if (schoolLesson) {
      return {
        success: true,
        data: schoolLesson
      }
    }

    const globalLesson = await prisma.globalLesson.findUnique({
      where: { topicId }
    })

    return {
      success: true,
      data: globalLesson
        ? {
            id: "",
            aiContent: globalLesson.aiContent,
            isCustomized: false
          }
        : null
    }

  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    }
  }
}

// ─────────────────────────────────────────────
// 5. STUDENT FETCH (ONLY PUBLISHED SCHOOL VERSION)
// ─────────────────────────────────────────────

export async function getStudentLesson(topicId: string, schoolId: string) {
  try {
    const lesson = await prisma.schoolLesson.findFirst({
      where: {
        topicId,
        schoolId,
        status: "published"
      },
      include: {
        globalLesson: true
      }
    })

    if (!lesson) {
      const globalLesson = await prisma.globalLesson.findUnique({
        where: { topicId }
      })

      if (!globalLesson) {
        return { success: true, data: null }
      }

      return {
        success: true,
        data: {
          id: "",
          subject: "",
          title: "",
          aiContent: globalLesson.aiContent
        }
      }
    }

    return {
      success: true,
      data: {
        id: lesson.id,
        subject: "",
        title: "",
        aiContent:
          lesson.customContent ?? lesson.globalLesson.aiContent
      }
    }

  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    }
  }
}

// ─────────────────────────────────────────────
// 6. PUBLISH LESSON (TEACHER CONTROL)
// ─────────────────────────────────────────────

export async function publishLesson({
  topicId,
  schoolId,
  content
}: {
  topicId: string
  schoolId: string
  content: LessonAiContent
}) {
  try {
    await prisma.schoolLesson.update({
      where: {
        topicId_schoolId: {
          topicId,
          schoolId
        }
      },
      data: {
        customContent: content as Prisma.InputJsonValue,
        status: "published",
        isCustomized: true
      }
    })

    revalidatePath(`/student/lessons/${topicId}`)

    return { success: true }

  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    }
  }
}

// ─────────────────────────────────────────────
// 7. VERSION HISTORY
// ─────────────────────────────────────────────

export async function createLessonVersion({
  schoolLessonId,
  content
}: LessonVersionInput) {
  try {
    await prisma.lessonVersion.create({
      data: {
        schoolLessonId,
        content: content as Prisma.InputJsonValue
      }
    })

    return { success: true }

  } catch (err) {
    return {
      success: false,
      error: getErrorMessage(err)
    }
  }
}

// ─────────────────────────────────────────────
// MOCK AI (REMOVE IN PRODUCTION)
// ─────────────────────────────────────────────

async function fakeAIGeneration(topicId: string) {
  return {
    metadata: {
      topicContext: topicId,
      difficultyLevel: "medium"
    },
    teacherLogic: {
      teachingMethod: "interactive",
      timeAllocation: "45 mins",
      pedagogicalTips: "Use examples",
      introductionHook: "Start with question"
    },
    studentContent: {
      title: "Generated Lesson",
      explanation: "This is AI generated content",
      summary: "Summary here",
      learningObjectives: [],
      vocabulary: [],
      visualAids: [],
      examples: [],
      quiz: []
    }
  }
}