// 'use server'

// import { prisma } from '@/lib/prisma'
// import { getErrorMessage } from '@/lib/error-handler'
// import { revalidatePath } from 'next/cache'



// export interface TopicInput {
//     title: string
//     termIndex: number // 1, 2, or 3
//     weekNumber?: number | null
//     description?: string | null
// }


// /**
//  * Creates a subject and distributes it across multiple grades with its syllabus
//  */

// // interface CreateSubjectInput {
// //     name: string
// //     schoolId: string
// //     gradeIds: string[]
// //     topics: TopicInput[]
// // }


// export interface GradeConfig {
//     gradeId: string
//     topics: TopicInput[]
// }

// // export async function createSubjectWithSyllabus(data: CreateSubjectInput) {
// //     try {
// //         return await prisma.$transaction(async (tx) => {
// //             // 1. Resolve Curriculum ID from one of the grades
// //             const firstGrade = await tx.grade.findUnique({
// //                 where: { id: data.gradeIds[0] },
// //                 select: { curriculumId: true }
// //             })

// //             if (!firstGrade) throw new Error("Invalid grade selection.")

// //             // 2. Create the Master Subject record
// //             const subject = await tx.subject.create({
// //                 data: {
// //                     name: data.name,
// //                     schoolId: data.schoolId,
// //                     curriculumId: firstGrade.curriculumId
// //                 }
// //             })

// //             // 3. For every grade selected, create a Link and the Syllabus
// //             for (const gradeId of data.gradeIds) {
// //                 // Link Subject to Grade
// //                 const gradeSubject = await tx.gradeSubject.create({
// //                     data: {
// //                         gradeId,
// //                         subjectId: subject.id,
// //                         schoolId: data.schoolId
// //                     }
// //                 })

// //                 // Find the Terms for this specific grade to get their IDs
// //                 const terms = await tx.term.findMany({
// //                     where: { gradeId }
// //                 })

// //                 // 4. Inject Topics (The Syllabus)
// //                 if (data.topics.length > 0) {
// //                     await tx.topic.createMany({
// //                         data: data.topics.map(t => {
// //                             // Find the term UUID that matches the index (1, 2, or 3)
// //                             const matchedTerm = terms.find(tm => tm.index === t.termIndex)
                            
// //                             if (!matchedTerm) {
// //                                 throw new Error(`Term index ${t.termIndex} not found for grade selection.`)
// //                             }

// //                             return {
// //                                 title: t.title,
// //                                 gradeSubjectId: gradeSubject.id,
// //                                 termId: matchedTerm.id,
// //                                 schoolId: data.schoolId,
// //                                 weekNumber: t.weekNumber ?? null
// //                             }
// //                         })
// //                     })
// //                 }
// //             }

// //             revalidatePath('/admin/catalogue')
// //             return { success: true }
// //         })
// //     } catch (err) {
// //         return { success: false, error: getErrorMessage(err) }
// //     }
// // }



// export async function createSubjectWithSyllabus(data: {
//     name: string
//     schoolId: string
//     configs: GradeConfig[]
// }) {
//     try {
//         return await prisma.$transaction(async (tx) => {
//             const firstGrade = await tx.grade.findUnique({
//                 where: { id: data.configs[0].gradeId },
//                 select: { curriculumId: true }
//             })
//             if (!firstGrade) throw new Error("Invalid grade selection.")

//             const subject = await tx.subject.create({
//                 data: {
//                     name: data.name,
//                     schoolId: data.schoolId,
//                     curriculumId: firstGrade.curriculumId
//                 }
//             })

//             for (const config of data.configs) {
//                 const gradeSubject = await tx.gradeSubject.create({
//                     data: {
//                         gradeId: config.gradeId,
//                         subjectId: subject.id,
//                         schoolId: data.schoolId
//                     }
//                 })

//                 const terms = await tx.term.findMany({ where: { gradeId: config.gradeId } })

//                 if (config.topics.length > 0) {
//                     await tx.topic.createMany({
//                         data: config.topics.map(t => {
//                             const matchedTerm = terms.find(tm => tm.index === t.termIndex)
//                             return {
//                                 title: t.title,
//                                 description: t.description ?? null,
//                                 weekNumber: t.weekNumber ?? null,
//                                 gradeSubjectId: gradeSubject.id,
//                                 termId: matchedTerm!.id,
//                                 schoolId: data.schoolId,
//                             }
//                         })
//                     })
//                 }
//             }
//             revalidatePath('/admin/catalogue')
//             return { success: true }
//         })
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) }
//     }
// }


// export async function getCourseCatalogue(schoolId: string) {
//     try {
//         const subjects = await prisma.gradeSubject.findMany({
//             where: { OR: [{ schoolId }, { schoolId: null }] },
//             include: {
//                 subject: true,
//                 grade: true,
//                 topics: { // ✅ Add topics to see the syllabus
//                     include: { term: true },
//                     orderBy: { weekNumber: 'asc' }
//                 }
//             },
//             orderBy: { subject: { name: 'asc' } }
//         });

//         // Grouping by Subject Name
//         const catalogueMap = new Map();
//         subjects.forEach(gs => {
//             const name = gs.subject.name;
//             if (!catalogueMap.has(name)) {
//                 catalogueMap.set(name, {
//                     name,
//                     id: gs.subject.id,
//                     grades: []
//                 });
//             }
//             const existing = catalogueMap.get(name);
//             existing.grades.push({
//                 id: gs.id,
//                 displayName: gs.grade.displayName,
//                 topics: gs.topics // Attach syllabus to each grade
//             });
//         });

//         return { success: true, data: Array.from(catalogueMap.values()) };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }

// export async function getSubjectSyllabus(subjectId: string, schoolId: string) {
//     try {
//         const gradeSubjects = await prisma.gradeSubject.findMany({
//             where: { 
//                 subjectId,
//                 OR: [{ schoolId }, { schoolId: null }]
//             },
//             include: {
//                 grade: true,
//                 topics: {
//                     include: { term: true },
//                     orderBy: [{ term: { index: 'asc' } }, { weekNumber: 'asc' }]
//                 }
//             }
//         });

//         return { success: true, data: gradeSubjects };
//     } catch (err) {
//         return { success: false, error: getErrorMessage(err) };
//     }
// }


'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { revalidatePath } from 'next/cache'
import { ActivityType, Role, OwnershipType, Prisma } from '@prisma/client'
import { logActivity } from '@/lib/activitylogger'
import { academicCoreScope, contentScope } from '@/lib/content-scope'

// ── Types ──────────────────────────────────────────────────────────────────────

export interface TopicInput {
    title: string
    termIndex: number // 1, 2, or 3
    weekNumber?: number | null
    description?: string | null
}

export interface GradeConfig {
    gradeId: string
    topics: TopicInput[]
}

export interface CatalogueGrade {
    id: string
    displayName: string
    topics: Prisma.TopicGetPayload<{ include: { term: true } }>[]
}

export interface CatalogueSubject {
    id: string
    name: string
    grades: CatalogueGrade[]
}

// ── Mutations ──────────────────────────────────────────────────────────────────

/**
 * Creates a subject and distributes it across multiple grades with its syllabus.
 * Rule 9: Created as schoolId != null and ownershipType = SCHOOL.
 */
export async function createSubjectWithSyllabus(params: {
    name: string
    schoolId: string
    configs: GradeConfig[]
    actorId: string
    actorRole: Role
}) {
    const { name, schoolId, configs, actorId, actorRole } = params;

    try {
        return await prisma.$transaction(async (tx) => {
            // 1. Resolve Curriculum ID
            const firstGrade = await tx.grade.findUnique({
                where: { id: configs[0].gradeId },
                select: { curriculumId: true }
            })
            if (!firstGrade) throw new Error("Invalid grade selection.")

            // 2. Create the School-Specific Subject (Rule 9)
            const subject = await tx.subject.create({
                data: {
                    name,
                    schoolId,
                    curriculumId: firstGrade.curriculumId
                }
            })

            // 3. Process each Grade Configuration
            for (const config of configs) {
                const gradeSubject = await tx.gradeSubject.create({
                    data: {
                        gradeId: config.gradeId,
                        subjectId: subject.id,
                        schoolId
                    }
                })

                const terms = await tx.term.findMany({ where: { gradeId: config.gradeId } })

                // 4. Inject Topics (Syllabus)
                if (config.topics.length > 0) {
                    await tx.topic.createMany({
                        data: config.topics.map(t => {
                            const matchedTerm = terms.find(tm => tm.index === t.termIndex)
                            if (!matchedTerm) throw new Error(`Term ${t.termIndex} not found for grade.`)

                            return {
                                title: t.title,
                                description: t.description ?? null,
                                weekNumber: t.weekNumber ?? null,
                                gradeSubjectId: gradeSubject.id,
                                termId: matchedTerm.id,
                                schoolId,
                                isGlobal: false, // Rule 5: School content is private
                                ownershipType: OwnershipType.SCHOOL // Rule 9
                            }
                        })
                    })
                }
            }

            // 5. Log Activity (Tier 2 Action)
            await logActivity({
                schoolId,
                actorId,
                actorRole,
                type: ActivityType.SETTINGS_UPDATED,
                title: `Subject Created: ${name}`,
                description: `New institutional subject added to ${configs.length} grades with syllabus.`
            });

            revalidatePath('/admin/catalogue')
            return { success: true }
        })
    } catch (err: unknown) {
        console.error("createSubjectWithSyllabus error:", err);
        return { success: false, error: getErrorMessage(err) }
    }
}

// ── Queries ─────────────────────────────────────────────────────────────────────

/**
 * Fetches the Course Catalogue.
 * Rule 7: WHERE (schoolId = user.schoolId OR schoolId IS NULL)
 */
export async function getCourseCatalogue(schoolId: string | null): Promise<{
    success: boolean;
    data?: CatalogueSubject[];
    error?: string;
}> {
    try {
        const gradeSubjects = await prisma.gradeSubject.findMany({
            where: academicCoreScope({ schoolId }),
            include: {
                subject: true,
                grade: true,
                topics: {
                    where: contentScope({ schoolId }),
                    include: { term: true },
                    orderBy: { weekNumber: 'asc' }
                }
            },
            orderBy: { subject: { name: 'asc' } }
        });

        // Grouping logic (Tier 3 Visibility check already handled by academicCoreScope)
        const catalogueMap = new Map<string, CatalogueSubject>();

        gradeSubjects.forEach(gs => {
            const subjectName = gs.subject.name;
            if (!catalogueMap.has(subjectName)) {
                catalogueMap.set(subjectName, {
                    id: gs.subject.id,
                    name: subjectName,
                    grades: []
                });
            }
            
            const currentSubject = catalogueMap.get(subjectName)!;
            currentSubject.grades.push({
                id: gs.id,
                displayName: gs.grade.displayName,
                topics: gs.topics
            });
        });

        return { success: true, data: Array.from(catalogueMap.values()) };
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

/**
 * Fetches syllabus for a specific subject ID.
 */
export async function getSubjectSyllabus(subjectId: string, schoolId: string | null) {
    try {
        const gradeSubjects = await prisma.gradeSubject.findMany({
            where: { 
                subjectId,
                ...academicCoreScope({ schoolId })
            },
            include: {
                grade: true,
                topics: {
                    where: contentScope({ schoolId }),
                    include: { term: true },
                    orderBy: [{ term: { index: 'asc' } }, { weekNumber: 'asc' }]
                }
            }
        });

        return { success: true, data: gradeSubjects };
    } catch (err: unknown) {
        return { success: false, error: getErrorMessage(err) };
    }
}

