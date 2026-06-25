import { PrismaClient, OwnershipType } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Registry Re-sync Protocol
 * This script deletes existing data for a specific subject within a curriculum
 * and repopulates it from a JSON source.
 */
async function syncSubjectRegistry(jsonPath: string) {
    // 1. Load and Validate JSON
    const absolutePath = path.resolve(process.cwd(), jsonPath);
    if (!fs.existsSync(absolutePath)) {
        console.error(`❌ File not found: ${jsonPath}`);
        return;
    }
    const data = JSON.parse(fs.readFileSync(absolutePath, 'utf-8'));
    
    const subjectName = data.subject; // e.g., "Biology"
    const curriculumName = data.curriculum; // e.g., "Nigeria Curiculum"

    console.log(`\n🚀 Initializing Re-sync for: [${subjectName}] in [${curriculumName}]`);

    await prisma.$transaction(async (tx) => {
        // 2. Resolve Curriculum Node
        const curriculum = await tx.curriculum.findFirst({
            where: { name: curriculumName }
        });

        if (!curriculum) {
            throw new Error(`Curriculum Hub "${curriculumName}" not discovered in registry.`);
        }

        // 3. DESTRUCTIVE CLEANUP (Cascade Order)
        // Find existing subject to prune its branches
        const existingSubject = await tx.subject.findFirst({
            where: { name: subjectName, curriculumId: curriculum.id, schoolId: null }
        });

        if (existingSubject) {
            console.log(`🧹 Pruning existing [${subjectName}] branches (Topics & Junctions)...`);
            
            // Delete all Topics linked to this subject through GradeSubject
            await tx.topic.deleteMany({
                where: { gradeSubject: { subjectId: existingSubject.id } }
            });

            // Delete the junction records
            await tx.gradeSubject.deleteMany({
                where: { subjectId: existingSubject.id }
            });

            // Delete the subject node
            await tx.subject.delete({
                where: { id: existingSubject.id }
            });
        }

        // 4. REPOPULATION PROTOCOL
        console.log(`🧬 Provisioning new [${subjectName}] Subject Node...`);
        const newSubject = await tx.subject.create({
            data: {
                name: subjectName,
                curriculumId: curriculum.id,
                schoolId: null, // Global Tier
            }
        });

        for (const g of data.grades) {
            // Extract numeric level (SS 1 -> 1, JSS 3 -> 3)
            const numericLevel = parseInt(g.grade.replace(/\D/g, ''));
            
            // a. Upsert Grade (Rule 7: Unique via curriculumId_level)
            const grade = await tx.grade.upsert({
                where: {
                    curriculumId_level: {
                        curriculumId: curriculum.id,
                        level: numericLevel
                    }
                },
                update: {},
                create: {
                    level: numericLevel,
                    displayName: g.grade,
                    slug: g.grade.toLowerCase().replace(/\s+/g, '-'),
                    curriculumId: curriculum.id,
                }
            });

            // b. Create GradeSubject Junction
            // Unique via schoolId_gradeId_subjectId (all null for Global)
            const gradeSubject = await tx.gradeSubject.create({
                data: {
                    gradeId: grade.id,
                    subjectId: newSubject.id,
                    schoolId: null
                }
            });

            for (const t of g.terms) {
                // c. Upsert Term (Unique via gradeId_index)
                const term = await tx.term.upsert({
                    where: {
                        gradeId_index: {
                            gradeId: grade.id,
                            index: t.term
                        }
                    },
                    update: {},
                    create: {
                        index: t.term,
                        displayName: `Term ${t.term}`,
                        gradeId: grade.id,
                    }
                });

                // d. Batch Create Topics (Weeks)
                console.log(`   📝 Seeding ${g.grade} - Term ${t.term} (${t.weeks.length} weeks)`);
                await tx.topic.createMany({
                    data: t.weeks.map((w: any) => ({
                        title: w.topic,
                        description: (w.description === "–" || w.description === "—") ? null : w.description,
                        weekNumber: w.week,
                        gradeSubjectId: gradeSubject.id,
                        termId: term.id,
                        isGlobal: true,
                        ownershipType: OwnershipType.GLOBAL
                    }))
                });
            }
        }
    });

    console.log(`✅ Success: [${subjectName}] registry re-synced.`);
}

// ── EXECUTION HUB ──────────────────────────────────────────────────────────

async function main() {
    // List all your JSON files here
    const subjectsToSync = [
        './biology_data.json',
        // './chemistry_data.json',
        // './physics_data.json',
    ];

    for (const file of subjectsToSync) {
        await syncSubjectRegistry(file);
    }
}

main()
    .catch(e => {
        console.error("❌ Registry Sync Fault:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });