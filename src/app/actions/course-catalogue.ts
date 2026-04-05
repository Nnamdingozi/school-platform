'use server'

import { prisma } from '@/lib/prisma'
import { getErrorMessage } from '@/lib/error-handler'
import { revalidatePath } from 'next/cache'



export interface TopicInput {
    title: string
    termIndex: number // 1, 2, or 3
    weekNumber?: number | null
    description?: string | null
}


/**
 * Creates a subject and distributes it across multiple grades with its syllabus
 */

// interface CreateSubjectInput {
//     name: string
//     schoolId: string
//     gradeIds: string[]
//     topics: TopicInput[]
// }


export interface GradeConfig {
    gradeId: string
    topics: TopicInput[]
}

// export async function createSubjectWithSyllabus(data: CreateSubjectInput) {
//     try {
//         return await prisma.$transaction(async (tx) => {
//             // 1. Resolve Curriculum ID from one of the grades
//             const firstGrade = await tx.grade.findUnique({
//                 where: { id: data.gradeIds[0] },
//                 select: { curriculumId: true }
//             })

//             if (!firstGrade) throw new Error("Invalid grade selection.")

//             // 2. Create the Master Subject record
//             const subject = await tx.subject.create({
//                 data: {
//                     name: data.name,
//                     schoolId: data.schoolId,
//                     curriculumId: firstGrade.curriculumId
//                 }
//             })

//             // 3. For every grade selected, create a Link and the Syllabus
//             for (const gradeId of data.gradeIds) {
//                 // Link Subject to Grade
//                 const gradeSubject = await tx.gradeSubject.create({
//                     data: {
//                         gradeId,
//                         subjectId: subject.id,
//                         schoolId: data.schoolId
//                     }
//                 })

//                 // Find the Terms for this specific grade to get their IDs
//                 const terms = await tx.term.findMany({
//                     where: { gradeId }
//                 })

//                 // 4. Inject Topics (The Syllabus)
//                 if (data.topics.length > 0) {
//                     await tx.topic.createMany({
//                         data: data.topics.map(t => {
//                             // Find the term UUID that matches the index (1, 2, or 3)
//                             const matchedTerm = terms.find(tm => tm.index === t.termIndex)
                            
//                             if (!matchedTerm) {
//                                 throw new Error(`Term index ${t.termIndex} not found for grade selection.`)
//                             }

//                             return {
//                                 title: t.title,
//                                 gradeSubjectId: gradeSubject.id,
//                                 termId: matchedTerm.id,
//                                 schoolId: data.schoolId,
//                                 weekNumber: t.weekNumber ?? null
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



export async function createSubjectWithSyllabus(data: {
    name: string
    schoolId: string
    configs: GradeConfig[]
}) {
    try {
        return await prisma.$transaction(async (tx) => {
            const firstGrade = await tx.grade.findUnique({
                where: { id: data.configs[0].gradeId },
                select: { curriculumId: true }
            })
            if (!firstGrade) throw new Error("Invalid grade selection.")

            const subject = await tx.subject.create({
                data: {
                    name: data.name,
                    schoolId: data.schoolId,
                    curriculumId: firstGrade.curriculumId
                }
            })

            for (const config of data.configs) {
                const gradeSubject = await tx.gradeSubject.create({
                    data: {
                        gradeId: config.gradeId,
                        subjectId: subject.id,
                        schoolId: data.schoolId
                    }
                })

                const terms = await tx.term.findMany({ where: { gradeId: config.gradeId } })

                if (config.topics.length > 0) {
                    await tx.topic.createMany({
                        data: config.topics.map(t => {
                            const matchedTerm = terms.find(tm => tm.index === t.termIndex)
                            return {
                                title: t.title,
                                description: t.description ?? null,
                                weekNumber: t.weekNumber ?? null,
                                gradeSubjectId: gradeSubject.id,
                                termId: matchedTerm!.id,
                                schoolId: data.schoolId,
                            }
                        })
                    })
                }
            }
            revalidatePath('/admin/catalogue')
            return { success: true }
        })
    } catch (err) {
        return { success: false, error: getErrorMessage(err) }
    }
}


export async function getCourseCatalogue(schoolId: string) {
    try {
        const subjects = await prisma.gradeSubject.findMany({
            where: { OR: [{ schoolId }, { schoolId: null }] },
            include: {
                subject: true,
                grade: true,
                topics: { // ✅ Add topics to see the syllabus
                    include: { term: true },
                    orderBy: { weekNumber: 'asc' }
                }
            },
            orderBy: { subject: { name: 'asc' } }
        });

        // Grouping by Subject Name
        const catalogueMap = new Map();
        subjects.forEach(gs => {
            const name = gs.subject.name;
            if (!catalogueMap.has(name)) {
                catalogueMap.set(name, {
                    name,
                    id: gs.subject.id,
                    grades: []
                });
            }
            const existing = catalogueMap.get(name);
            existing.grades.push({
                id: gs.id,
                displayName: gs.grade.displayName,
                topics: gs.topics // Attach syllabus to each grade
            });
        });

        return { success: true, data: Array.from(catalogueMap.values()) };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}

export async function getSubjectSyllabus(subjectId: string, schoolId: string) {
    try {
        const gradeSubjects = await prisma.gradeSubject.findMany({
            where: { 
                subjectId,
                OR: [{ schoolId }, { schoolId: null }]
            },
            include: {
                grade: true,
                topics: {
                    include: { term: true },
                    orderBy: [{ term: { index: 'asc' } }, { weekNumber: 'asc' }]
                }
            }
        });

        return { success: true, data: gradeSubjects };
    } catch (err) {
        return { success: false, error: getErrorMessage(err) };
    }
}