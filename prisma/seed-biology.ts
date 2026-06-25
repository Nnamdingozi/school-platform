import { PrismaClient, OwnershipType } from '@prisma/client';
import * as fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function syncBiologyRegistry() {
    const jsonPath: string = path.join(process.cwd(), 'prisma', 'data', 'nigeria-biology.json');
    
    if (!fs.existsSync(jsonPath)) {
        console.error(`❌ Critical Error: Data file not found at ${jsonPath}`);
        return;
    }

    const fileContent = fs.readFileSync(jsonPath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    const subjectName: string = "Biology"; 
    const curriculumName: string = "Nigerian National Curriculum"; 

    console.log(`\n🚀 Initializing Biology Re-sync from: [nigeria-biology.json]`);
    console.log(`📍 Target Curriculum: [${curriculumName}]`);

    // ✅ FIXED: Increased timeout to 30 seconds to handle network latency to Supabase
    await prisma.$transaction(async (tx) => {
        // 2. Resolve Existing Curriculum Hub
        const curriculum = await tx.curriculum.findFirst({
            where: { name: curriculumName }
        });

        if (!curriculum) {
            throw new Error(`Registry Fault: Curriculum "${curriculumName}" not found in database.`);
        }

        // 3. DESTRUCTIVE CLEANUP
        const existingSubject = await tx.subject.findFirst({
            where: { 
                name: subjectName, 
                curriculumId: curriculum.id, 
                schoolId: null 
            }
        });

        if (existingSubject) {
            console.log(`🧹 Pruning existing Biology registry branches...`);
            
            await tx.topic.deleteMany({
                where: { gradeSubject: { subjectId: existingSubject.id } }
            });

            await tx.gradeSubject.deleteMany({
                where: { subjectId: existingSubject.id }
            });

            await tx.subject.delete({
                where: { id: existingSubject.id }
            });
        }

        // 4. REPOPULATION PROTOCOL
        console.log(`🧬 Provisioning new Biology Subject node...`);
        const newSubject = await tx.subject.create({
            data: {
                name: subjectName,
                curriculumId: curriculum.id,
                schoolId: null,
            }
        });

        for (const g of data.grades) {
            const numericLevel: number = parseInt(g.grade.replace(/\D/g, ''));
            
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

            const gradeSubject = await tx.gradeSubject.create({
                data: {
                    gradeId: grade.id,
                    subjectId: newSubject.id,
                    schoolId: null
                }
            });

            for (const t of g.terms) {
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

                console.log(`   📝 Seeding ${g.grade} - Term ${t.term}...`);
                await tx.topic.createMany({
                    data: t.weeks.map((w: { week: number; topic: string; description: string }) => ({
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
    }, {
        maxWait: 10000, // 10s to acquire connection
        timeout: 30000  // 30s to execute (Fixes P2028)
    });

    console.log(`✅ Success: Biology registry re-synced successfully.`);
}

async function main() {
    await syncBiologyRegistry();
}

main()
    .catch((error: unknown) => {
        console.error("❌ Critical Registry Fault:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });