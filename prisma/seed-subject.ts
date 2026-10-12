// import { PrismaClient, OwnershipType } from '@prisma/client';
// import * as fs from 'fs';
// import path from 'path';

// const prisma = new PrismaClient();

// /**
//  * Registry Re-sync Protocol
//  * This script deletes existing data for a specific subject within a curriculum
//  * and repopulates it from a JSON source.
//  */
// async function syncSubjectRegistry(jsonPath: string) {
//     // 1. Load and Validate JSON
//     const absolutePath = path.resolve(process.cwd(), jsonPath);
//     if (!fs.existsSync(absolutePath)) {
//         console.error(`❌ File not found: ${jsonPath}`);
//         return;
//     }
//     const data = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
    
//     const subjectName = data.subject; // e.g., "Biology"
//     const curriculumName = data.curriculum; // e.g., "Nigeria Curiculum"

//     console.log(`\n🚀 Initializing Re-sync for: [${subjectName}] in [${curriculumName}]`);

//     await prisma.$transaction(async (tx) => {
//         // 2. Resolve Curriculum Node
//         const curriculum = await tx.curriculum.findFirst({
//             where: { name: curriculumName }
//         });

//         if (!curriculum) {
//             throw new Error(`Curriculum Hub "${curriculumName}" not discovered in registry.`);
//         }

//         // 3. DESTRUCTIVE CLEANUP (Cascade Order)
//         // Find existing subject to prune its branches
//         const existingSubject = await tx.subject.findFirst({
//             where: { name: subjectName, curriculumId: curriculum.id, schoolId: null }
//         });

//         if (existingSubject) {
//             console.log(`🧹 Pruning existing [${subjectName}] branches (Topics & Junctions)...`);
            
//             // Delete all Topics linked to this subject through GradeSubject
//             await tx.topic.deleteMany({
//                 where: { gradeSubject: { subjectId: existingSubject.id } }
//             });

//             // Delete the junction records
//             await tx.gradeSubject.deleteMany({
//                 where: { subjectId: existingSubject.id }
//             });

//             // Delete the subject node
//             await tx.subject.delete({
//                 where: { id: existingSubject.id }
//             });
//         }

//         // 4. REPOPULATION PROTOCOL
//         console.log(`🧬 Provisioning new [${subjectName}] Subject Node...`);
//         const newSubject = await tx.subject.create({
//             data: {
//                 name: subjectName,
//                 curriculumId: curriculum.id,
//                 schoolId: null, // Global Tier
//             }
//         });

//         for (const g of data.grades) {
//             // Extract numeric level (SS 1 -> 1, JSS 3 -> 3)
//             const numericLevel = parseInt(g.grade.replace(/\D/g, ''));
            
//             // a. Upsert Grade (Rule 7: Unique via curriculumId_level)
//             const grade = await tx.grade.upsert({
//                 where: {
//                     curriculumId_level: {
//                         curriculumId: curriculum.id,
//                         level: numericLevel
//                     }
//                 },
//                 update: {},
//                 create: {
//                     level: numericLevel,
//                     displayName: g.grade,
//                     slug: g.grade.toLowerCase().replace(/\s+/g, '-'),
//                     curriculumId: curriculum.id,
//                 }
//             });

//             // b. Create GradeSubject Junction
//             // Unique via schoolId_gradeId_subjectId (all null for Global)
//             const gradeSubject = await tx.gradeSubject.create({
//                 data: {
//                     gradeId: grade.id,
//                     subjectId: newSubject.id,
//                     schoolId: null
//                 }
//             });

//             for (const t of g.terms) {
//                 // c. Upsert Term (Unique via gradeId_index)
//                 const term = await tx.term.upsert({
//                     where: {
//                         gradeId_index: {
//                             gradeId: grade.id,
//                             index: t.term
//                         }
//                     },
//                     update: {},
//                     create: {
//                         index: t.term,
//                         displayName: `Term ${t.term}`,
//                         gradeId: grade.id,
//                     }
//                 });

//                 // d. Batch Create Topics (Weeks)
//                 console.log(`   📝 Seeding ${g.grade} - Term ${t.term} (${t.weeks.length} weeks)`);
//                 await tx.topic.createMany({
//                     data: t.weeks.map((w: any) => ({
//                         title: w.topic,
//                         description: (w.description === "–" || w.description === "—") ? null : w.description,
//                         weekNumber: w.week,
//                         gradeSubjectId: gradeSubject.id,
//                         termId: term.id,
//                         isGlobal: true,
//                         ownershipType: OwnershipType.GLOBAL
//                     }))
//                 });
//             }
//         }
//     });

//     console.log(`✅ Success: [${subjectName}] registry re-synced.`);
// }

// // ── EXECUTION HUB ──────────────────────────────────────────────────────────

// async function main() {
//     // List all your JSON files here
//     const subjectsToSync = [
//         './biology_data.json',
//         // './chemistry_data.json',
//         // './physics_data.json',
//     ];

//     for (const file of subjectsToSync) {
//         await syncSubjectRegistry(file);
//     }
// }

// main()
//     .catch(e => {
//         console.error("❌ Registry Sync Fault:", e);
//         process.exit(1);
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });



import { PrismaClient, OwnershipType } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// CHANGE THESE THREE VALUES FOR EACH RUN
const JSON_FILE = 'naigeria-fashion-design.json';
const SUBJECT_NAME = 'Fashion Design and Garment Making';
const CURRICULUM_NAME = 'Nigerian National Curriculum';

type WeekData = {
    week: number;
    topic: string;
    description?: string | null;
};

type TermData = {
    term: number;
    weeks: WeekData[];
};

type GradeData = {
    grade: string;
    terms: TermData[];
};

type SubjectData = {
    grades: GradeData[];
};

async function syncSubjectRegistry() {
    const jsonPath = path.join(
        process.cwd(),
        'prisma',
        'data',
        JSON_FILE
    );

    if (!fs.existsSync(jsonPath)) {
        throw new Error(`Data file not found: ${jsonPath}`);
    }

    const data = JSON.parse(
        fs.readFileSync(jsonPath, 'utf-8')
    ) as SubjectData;

    if (!Array.isArray(data.grades)) {
        throw new Error(`Invalid JSON structure: ${JSON_FILE}`);
    }

    console.log(`\n🚀 Syncing ${SUBJECT_NAME}`);
    console.log(`📍 Curriculum: ${CURRICULUM_NAME}`);

    await prisma.$transaction(
        async (tx) => {
            // 1. Find curriculum
            const curriculum = await tx.curriculum.findFirst({
                where: { name: CURRICULUM_NAME },
            });

            if (!curriculum) {
                throw new Error(
                    `Curriculum not found: ${CURRICULUM_NAME}`
                );
            }

            // 2. Reuse existing global subject or create it
            let subject = await tx.subject.findFirst({
                where: {
                    name: SUBJECT_NAME,
                    curriculumId: curriculum.id,
                    schoolId: null,
                },
            });

            if (!subject) {
                subject = await tx.subject.create({
                    data: {
                        name: SUBJECT_NAME,
                        curriculumId: curriculum.id,
                        schoolId: null,
                    },
                });

                console.log(`➕ Created ${SUBJECT_NAME}`);
            } else {
                console.log(`♻️ Reusing ${SUBJECT_NAME}`);
            }

            for (const g of data.grades) {
                const numericLevel = parseInt(
                    g.grade.replace(/\D/g, ''),
                    10
                );

                if (!Number.isInteger(numericLevel)) {
                    throw new Error(`Invalid grade: ${g.grade}`);
                }

                // 3. Reuse or create grade
                // IMPORTANT: This uses your existing schema's
                // curriculumId_level unique constraint.
                const grade = await tx.grade.upsert({
                    where: {
                        curriculumId_level: {
                            curriculumId: curriculum.id,
                            level: numericLevel,
                        },
                    },
                    update: {},
                    create: {
                        level: numericLevel,
                        displayName: g.grade,
                        slug: g.grade
                            .toLowerCase()
                            .trim()
                            .replace(/\s+/g, '-'),
                        curriculumId: curriculum.id,
                    },
                });

                // 4. Reuse or create GradeSubject
                let gradeSubject =
                    await tx.gradeSubject.findFirst({
                        where: {
                            gradeId: grade.id,
                            subjectId: subject.id,
                            schoolId: null,
                        },
                    });

                if (!gradeSubject) {
                    gradeSubject = await tx.gradeSubject.create({
                        data: {
                            gradeId: grade.id,
                            subjectId: subject.id,
                            schoolId: null,
                        },
                    });
                }

                for (const t of g.terms) {
                    // 5. Reuse or create term
                    const term = await tx.term.upsert({
                        where: {
                            gradeId_index: {
                                gradeId: grade.id,
                                index: t.term,
                            },
                        },
                        update: {},
                        create: {
                            index: t.term,
                            displayName: `Term ${t.term}`,
                            gradeId: grade.id,
                        },
                    });

                    console.log(
                        `📝 ${g.grade} - Term ${t.term}`
                    );

                    for (const w of t.weeks) {
                        const description =
                            !w.description ||
                            ['–', '—'].includes(
                                w.description.trim()
                            )
                                ? null
                                : w.description.trim();

                        // 6. Find existing topic by logical identity
                        const existingTopic =
                            await tx.topic.findFirst({
                                where: {
                                    gradeSubjectId: gradeSubject.id,
                                    termId: term.id,
                                    weekNumber: w.week,
                                },
                            });

                        const topicData = {
                            title: w.topic,
                            description,
                            isGlobal: true,
                            ownershipType: OwnershipType.GLOBAL,
                        };

                        if (existingTopic) {
                            await tx.topic.update({
                                where: {
                                    id: existingTopic.id,
                                },
                                data: topicData,
                            });
                        } else {
                            await tx.topic.create({
                                data: {
                                    ...topicData,
                                    weekNumber: w.week,
                                    gradeSubjectId: gradeSubject.id,
                                    termId: term.id,
                                },
                            });
                        }
                    }
                }
            }
        },
        {
            maxWait: 10000,
            timeout: 30000,
        }
    );

    console.log(
        `✅ ${SUBJECT_NAME} synced successfully`
    );
}

async function main() {
    await syncSubjectRegistry();
}

main()
    .catch((error: unknown) => {
        console.error('❌ Registry sync failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
