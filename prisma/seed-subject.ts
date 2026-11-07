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



// import { PrismaClient, OwnershipType } from '@prisma/client';
// import * as fs from 'fs';
// import path from 'path';

// const prisma = new PrismaClient();

// // CHANGE THESE THREE VALUES FOR EACH RUN
// const JSON_FILE = 'naigeria-fashion-design.json';
// const SUBJECT_NAME = 'Fashion Design and Garment Making';
// const CURRICULUM_NAME = 'Nigerian National Curriculum';

// type WeekData = {
//     week: number;
//     topic: string;
//     description?: string | null;
// };

// type TermData = {
//     term: number;
//     weeks: WeekData[];
// };

// type GradeData = {
//     grade: string;
//     terms: TermData[];
// };

// type SubjectData = {
//     grades: GradeData[];
// };

// async function syncSubjectRegistry() {
//     const jsonPath = path.join(
//         process.cwd(),
//         'prisma',
//         'data',
//         JSON_FILE
//     );

//     if (!fs.existsSync(jsonPath)) {
//         throw new Error(`Data file not found: ${jsonPath}`);
//     }

//     const data = JSON.parse(
//         fs.readFileSync(jsonPath, 'utf-8')
//     ) as SubjectData;

//     if (!Array.isArray(data.grades)) {
//         throw new Error(`Invalid JSON structure: ${JSON_FILE}`);
//     }

//     console.log(`\n🚀 Syncing ${SUBJECT_NAME}`);
//     console.log(`📍 Curriculum: ${CURRICULUM_NAME}`);

//     await prisma.$transaction(
//         async (tx) => {
//             // 1. Find curriculum
//             const curriculum = await tx.curriculum.findFirst({
//                 where: { name: CURRICULUM_NAME },
//             });

//             if (!curriculum) {
//                 throw new Error(
//                     `Curriculum not found: ${CURRICULUM_NAME}`
//                 );
//             }

//             // 2. Reuse existing global subject or create it
//             let subject = await tx.subject.findFirst({
//                 where: {
//                     name: SUBJECT_NAME,
//                     curriculumId: curriculum.id,
//                     schoolId: null,
//                 },
//             });

//             if (!subject) {
//                 subject = await tx.subject.create({
//                     data: {
//                         name: SUBJECT_NAME,
//                         curriculumId: curriculum.id,
//                         schoolId: null,
//                     },
//                 });

//                 console.log(`➕ Created ${SUBJECT_NAME}`);
//             } else {
//                 console.log(`♻️ Reusing ${SUBJECT_NAME}`);
//             }

//             for (const g of data.grades) {
//                 const numericLevel = parseInt(
//                     g.grade.replace(/\D/g, ''),
//                     10
//                 );

//                 if (!Number.isInteger(numericLevel)) {
//                     throw new Error(`Invalid grade: ${g.grade}`);
//                 }

//                 // 3. Reuse or create grade
//                 // IMPORTANT: This uses your existing schema's
//                 // curriculumId_level unique constraint.
//                 const grade = await tx.grade.upsert({
//                     where: {
//                         curriculumId_level: {
//                             curriculumId: curriculum.id,
//                             level: numericLevel,
//                         },
//                     },
//                     update: {},
//                     create: {
//                         level: numericLevel,
//                         displayName: g.grade,
//                         slug: g.grade
//                             .toLowerCase()
//                             .trim()
//                             .replace(/\s+/g, '-'),
//                         curriculumId: curriculum.id,
//                     },
//                 });

//                 // 4. Reuse or create GradeSubject
//                 let gradeSubject =
//                     await tx.gradeSubject.findFirst({
//                         where: {
//                             gradeId: grade.id,
//                             subjectId: subject.id,
//                             schoolId: null,
//                         },
//                     });

//                 if (!gradeSubject) {
//                     gradeSubject = await tx.gradeSubject.create({
//                         data: {
//                             gradeId: grade.id,
//                             subjectId: subject.id,
//                             schoolId: null,
//                         },
//                     });
//                 }

//                 for (const t of g.terms) {
//                     // 5. Reuse or create term
//                     const term = await tx.term.upsert({
//                         where: {
//                             gradeId_index: {
//                                 gradeId: grade.id,
//                                 index: t.term,
//                             },
//                         },
//                         update: {},
//                         create: {
//                             index: t.term,
//                             displayName: `Term ${t.term}`,
//                             gradeId: grade.id,
//                         },
//                     });

//                     console.log(
//                         `📝 ${g.grade} - Term ${t.term}`
//                     );

//                     for (const w of t.weeks) {
//                         const description =
//                             !w.description ||
//                             ['–', '—'].includes(
//                                 w.description.trim()
//                             )
//                                 ? null
//                                 : w.description.trim();

//                         // 6. Find existing topic by logical identity
//                         const existingTopic =
//                             await tx.topic.findFirst({
//                                 where: {
//                                     gradeSubjectId: gradeSubject.id,
//                                     termId: term.id,
//                                     weekNumber: w.week,
//                                 },
//                             });

//                         const topicData = {
//                             title: w.topic,
//                             description,
//                             isGlobal: true,
//                             ownershipType: OwnershipType.GLOBAL,
//                         };

//                         if (existingTopic) {
//                             await tx.topic.update({
//                                 where: {
//                                     id: existingTopic.id,
//                                 },
//                                 data: topicData,
//                             });
//                         } else {
//                             await tx.topic.create({
//                                 data: {
//                                     ...topicData,
//                                     weekNumber: w.week,
//                                     gradeSubjectId: gradeSubject.id,
//                                     termId: term.id,
//                                 },
//                             });
//                         }
//                     }
//                 }
//             }
//         },
//         {
//             maxWait: 20000,    // Allow more time to acquire a connection
//             timeout: 180000,   // Allow up to 3 minutes for the transaction
//         }
//     );

//     console.log(
//         `✅ ${SUBJECT_NAME} synced successfully`
//     );
// }

// async function main() {
//     await syncSubjectRegistry();
// }

// main()
//     .catch((error: unknown) => {
//         console.error('❌ Registry sync failed:', error);
//         process.exitCode = 1;
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });


// import { PrismaClient, OwnershipType } from '@prisma/client';
// import * as fs from 'fs';
// import path from 'path';

// const prisma = new PrismaClient();

// const DATA_FOLDER = path.join(process.cwd(), 'prisma', 'data');
// const DEFAULT_CURRICULUM_NAME = 'Nigerian National Curriculum';

// type WeekData = {
//     week: number | string; // Handled safely if string ranges like "11-13" appear
//     topic: string;
//     description?: string | null;
// };

// type TermData = {
//     term: number;
//     weeks: WeekData[];
// };

// type GradeData = {
//     grade: string;
//     terms: TermData[];
// };

// type SubjectData = {
//     subject: string;
//     curriculum?: string;
//     grades: GradeData[];
// };

// async function syncSubjectRegistry(jsonFile: string) {
//     const jsonPath = path.join(DATA_FOLDER, jsonFile);
//     const fileContent = fs.readFileSync(jsonPath, 'utf-8');
//     const data = JSON.parse(fileContent) as SubjectData;

//     const subjectName = data.subject;
//     const curriculumName = data.curriculum || DEFAULT_CURRICULUM_NAME;

//     if (!subjectName || !Array.isArray(data.grades)) {
//         console.warn(`⚠️ Skipping ${jsonFile}: Missing subject name or grades array.`);
//         return;
//     }

//     console.log(`\n🚀 Syncing Subject: ${subjectName} (File: ${jsonFile})`);
//     console.log(`📍 Curriculum: ${curriculumName}`);

//     await prisma.$transaction(
//         async (tx) => {
//             // 1. Find curriculum
//             const curriculum = await tx.curriculum.findFirst({
//                 where: { name: curriculumName },
//             });

//             if (!curriculum) {
//                 throw new Error(`Curriculum not found: ${curriculumName}`);
//             }

//             // 2. Reuse existing global subject or create it
//             let subject = await tx.subject.findFirst({
//                 where: {
//                     name: subjectName,
//                     curriculumId: curriculum.id,
//                     schoolId: null,
//                 },
//             });

//             if (!subject) {
//                 subject = await tx.subject.create({
//                     data: {
//                         name: subjectName,
//                         curriculumId: curriculum.id,
//                         schoolId: null,
//                     },
//                 });
//                 console.log(`➕ Created Subject: ${subjectName}`);
//             } else {
//                 console.log(`♻️ Reusing Subject: ${subjectName}`);
//             }

//             for (const g of data.grades) {
//                 // Extracts numeric level safely (e.g., "SS 1" -> 1, "Grade 10" -> 10)
//                 const numericLevel = parseInt(g.grade.replace(/\D/g, ''), 10);

//                 if (!Number.isInteger(numericLevel)) {
//                     throw new Error(`Invalid grade format: ${g.grade}`);
//                 }

//                 // 3. Reuse or create grade
//                 const grade = await tx.grade.upsert({
//                     where: {
//                         curriculumId_level: {
//                             curriculumId: curriculum.id,
//                             level: numericLevel,
//                         },
//                     },
//                     update: {},
//                     create: {
//                         level: numericLevel,
//                         displayName: g.grade,
//                         slug: g.grade
//                             .toLowerCase()
//                             .trim()
//                             .replace(/\s+/g, '-'),
//                         curriculumId: curriculum.id,
//                     },
//                 });

//                 // 4. Reuse or create GradeSubject
//                 let gradeSubject = await tx.gradeSubject.findFirst({
//                     where: {
//                         gradeId: grade.id,
//                         subjectId: subject.id,
//                         schoolId: null,
//                     },
//                 });

//                 if (!gradeSubject) {
//                     gradeSubject = await tx.gradeSubject.create({
//                         data: {
//                             gradeId: grade.id,
//                             subjectId: subject.id,
//                             schoolId: null,
//                         },
//                     });
//                 }

//                 for (const t of g.terms) {
//                     // 5. Reuse or create term
//                     const term = await tx.term.upsert({
//                         where: {
//                             gradeId_index: {
//                                 gradeId: grade.id,
//                                 index: t.term,
//                             },
//                         },
//                         update: {},
//                         create: {
//                             index: t.term,
//                             displayName: `Term ${t.term}`,
//                             gradeId: grade.id,
//                         },
//                     });

//                     console.log(`📝 ${g.grade} - Term ${t.term}`);

//                     for (const w of t.weeks) {
//                         const description =
//                             !w.description || ['–', '—', ''].includes(w.description.trim())
//                                 ? null
//                                 : w.description.trim();

//                         // Parse week number safely (handles strings like "11-13" by taking the first number or handling as text depending on schema)
//                         const weekNum = typeof w.week === 'number' 
//                             ? w.week 
//                             : parseInt(w.week.toString().split('-')[0], 10) || 1;

//                         const existingTopic = await tx.topic.findFirst({
//                             where: {
//                                 gradeSubjectId: gradeSubject.id,
//                                 termId: term.id,
//                                 weekNumber: weekNum,
//                             },
//                         });

//                         const topicData = {
//                             title: w.topic,
//                             description,
//                             isGlobal: true,
//                             ownershipType: OwnershipType.GLOBAL,
//                         };

//                         if (existingTopic) {
//                             await tx.topic.update({
//                                 where: { id: existingTopic.id },
//                                 data: topicData,
//                             });
//                         } else {
//                             await tx.topic.create({
//                                 data: {
//                                     ...topicData,
//                                     weekNumber: weekNum,
//                                     gradeSubjectId: gradeSubject.id,
//                                     termId: term.id,
//                                 },
//                             });
//                         }
//                     }
//                 }
//             }
//         },
//         {
//             maxWait: 20000,
//             timeout: 180000,
//         }
//     );

//     console.log(`✅ Successfully synced: ${subjectName}`);
// }

// async function main() {
//     if (!fs.existsSync(DATA_FOLDER)) {
//         throw new Error(`Data folder not found at: ${DATA_FOLDER}`);
//     }

//     // Read all JSON files in the prisma/data folder
//     const files = fs.readdirSync(DATA_FOLDER).filter(file => file.endsWith('.json'));

//     if (files.length === 0) {
//         console.log('⚠️ No JSON files found in prisma/data folder.');
//         return;
//     }

//     console.log(`📂 Found ${files.length} subject file(s) to process.`);

//     for (const file of files) {
//         try {
//             await syncSubjectRegistry(file);
//         } catch (error) {
//             console.error(`❌ Failed to sync file ${file}:`, error);
//             // Decide whether to throw or continue. Continuing lets other files seed even if one fails.
//         }
//     }

//     console.log('\n🎉 All subject seeding operations completed!');
// }

// main()
//     .catch((error: unknown) => {
//         console.error('❌ Batch registry sync failed:', error);
//         process.exitCode = 1;
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });


import { PrismaClient, OwnershipType } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const DATA_FOLDER = path.join(process.cwd(), 'prisma', 'data');
const DEFAULT_CURRICULUM_NAME = 'Nigerian National Curriculum';

type WeekData = {
    week: number | string;
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
    subject: string;
    curriculum?: string;
    grades: GradeData[];
};

/**
 * Maps grade text strings strictly to your database level standards
 * (e.g., JSS 1-3 -> 7-9, SS 1-3 -> 10-12)
 */
function resolveNumericLevel(gradeSlugOrName: string): number {
    const normalized = gradeSlugOrName.toLowerCase().trim();

    // Exact or clean substring slug checks
    if (normalized === 'jss-1' || normalized === 'jss1') return 7;
    if (normalized === 'jss-2' || normalized === 'jss2') return 8;
    if (normalized === 'jss-3' || normalized === 'jss3') return 9;

    if (normalized === 'ss-1' || normalized === 'ss1') return 10;
    if (normalized === 'ss-2' || normalized === 'ss2') return 11;
    if (normalized === 'ss-3' || normalized === 'ss3') return 12;

    // Fallback for standard numeric formats if needed
    const fallback = parseInt(normalized.replace(/\D/g, ''), 10);
    if (Number.isInteger(fallback)) {
        return fallback;
    }

    throw new Error(`Unable to resolve numeric level for grade: "${gradeSlugOrName}"`);
}

async function syncSubjectRegistry(jsonFile: string) {
    const jsonPath = path.join(DATA_FOLDER, jsonFile);
    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent) as SubjectData;

    const subjectName = data.subject;
    const curriculumName = data.curriculum || DEFAULT_CURRICULUM_NAME;

    if (!subjectName || !Array.isArray(data.grades)) {
        console.warn(`⚠️ Skipping ${jsonFile}: Missing subject name or grades array.`);
        return;
    }

    console.log(`\n🚀 Syncing Subject: ${subjectName} (File: ${jsonFile})`);
    console.log(`📍 Curriculum: ${curriculumName}`);

    await prisma.$transaction(
        async (tx) => {
            // 1. Find curriculum securely
            const curriculum = await tx.curriculum.findFirst({
                where: {
                    name: {
                        contains: curriculumName,
                        mode: 'insensitive',
                    },
                },
            });

            if (!curriculum) {
                throw new Error(`Curriculum not found: ${curriculumName}`);
            }

            // 2. Reuse existing global subject or create it tied to this curriculum
            let subject = await tx.subject.findFirst({
                where: {
                    name: subjectName,
                    curriculumId: curriculum.id,
                    schoolId: null,
                },
            });

            if (!subject) {
                subject = await tx.subject.create({
                    data: {
                        name: subjectName,
                        curriculumId: curriculum.id,
                        schoolId: null,
                    },
                });
                console.log(`➕ Created Subject: ${subjectName}`);
            } else {
                console.log(`♻️ Reusing Subject: ${subjectName}`);
            }

            for (const g of data.grades) {
                // Safely resolve exact grade levels (SS 1 -> 10, JSS 1 -> 7, etc.)
                const numericLevel = resolveNumericLevel(g.grade);

                // 3. Reuse or create grade matching curriculum and correct level
                const grade = await tx.grade.upsert({
                    where: {
                        curriculumId_level: {
                            curriculumId: curriculum.id,
                            level: numericLevel,
                        },
                    },
                    update: {
                        displayName: g.grade,
                    },
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

                // 4. Reuse or create GradeSubject link
                let gradeSubject = await tx.gradeSubject.findFirst({
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

                    console.log(`📝 ${g.grade} - Term ${t.term}`);

                    for (const w of t.weeks) {
                        const description =
                            !w.description || ['–', '—', ''].includes(w.description.trim())
                                ? null
                                : w.description.trim();

                        const weekNum = typeof w.week === 'number' 
                            ? w.week 
                            : parseInt(w.week.toString().split('-')[0], 10) || 1;

                        const existingTopic = await tx.topic.findFirst({
                            where: {
                                gradeSubjectId: gradeSubject.id,
                                termId: term.id,
                                weekNumber: weekNum,
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
                                where: { id: existingTopic.id },
                                data: topicData,
                            });
                        } else {
                            await tx.topic.create({
                                data: {
                                    ...topicData,
                                    weekNumber: weekNum,
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
            maxWait: 20000,
            timeout: 180000,
        }
    );

    console.log(`✅ Successfully synced: ${subjectName}`);
}

// async function main() {
//     if (!fs.existsSync(DATA_FOLDER)) {
//         throw new Error(`Data folder not found at: ${DATA_FOLDER}`);
//     }

//     const files = fs.readdirSync(DATA_FOLDER).filter(file => file.endsWith('.json'));

//     if (files.length === 0) {
//         console.log('⚠️ No JSON files found in prisma/data folder.');
//         return;
//     }

//     console.log(`📂 Found ${files.length} subject file(s) to process.`);

//     for (const file of files) {
//         try {
//             await syncSubjectRegistry(file);
//         } catch (error) {
//             console.error(`❌ Failed to sync file ${file}:`, error);
//         }
//     }

//     console.log('\n🎉 All subject seeding operations completed!');
// }

// main()
//     .catch((error: unknown) => {
//         console.error('❌ Batch registry sync failed:', error);
//         process.exitCode = 1;
//     })
//     .finally(async () => {
//         await prisma.$disconnect();
//     });


    // Helper function to retry an async operation upon network failure
async function retryOperation<T>(operation: () => Promise<T>, retries = 3, delay = 3000): Promise<T> {
    try {
        return await operation();
    } catch (error: any) {
        // P1001 is Prisma's error code for "Can't reach database server"
        const isNetworkError = error?.code === 'P1001' || error?.message?.includes('Can\'t reach database server');
        
        if (retries > 0 && isNetworkError) {
            console.warn(`⚠️ Network connection dropped. Retrying in ${delay / 1000}s... (${retries} attempts left)`);
            await new Promise((resolve) => setTimeout(resolve, delay));
            return retryOperation(operation, retries - 1, delay * 2); // Exponential backoff
        }
        throw error;
    }
}

async function main() {
    if (!fs.existsSync(DATA_FOLDER)) {
        throw new Error(`Data folder not found at: ${DATA_FOLDER}`);
    }

    const files = fs.readdirSync(DATA_FOLDER).filter(file => file.endsWith('.json'));

    if (files.length === 0) {
        console.log('⚠️ No JSON files found in prisma/data folder.');
        return;
    }

    console.log(`📂 Found ${files.length} subject file(s) to process.`);

    for (const file of files) {
        try {
            // Wrapped with retry logic to gracefully handle connection drops
            await retryOperation(() => syncSubjectRegistry(file), 3, 3000);
        } catch (error) {
            console.error(`❌ Failed to sync file ${file} after multiple attempts:`, error);
        }
    }

    console.log('\n🎉 All subject seeding operations completed!');
}

main()
    .catch((error: unknown) => {
        console.error('❌ Batch registry sync failed:', error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });