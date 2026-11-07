import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedNigeriaCurriculumSubjects() {
  try {
    console.log("🇳🇬 Starting Nigeria Curriculum Grade-Subject seeding...");

    // 1. Find the Nigerian Curriculum record
    const nigeriaCurriculum = await prisma.curriculum.findFirst({
      where: {
        name: { contains: "Nigeria", mode: "insensitive" },
      },
    });

    if (!nigeriaCurriculum) {
      console.error("❌ Error: Could not find 'Nigeria' curriculum in the database.");
      return;
    }

    console.log(`✅ Found Curriculum: ${nigeriaCurriculum.name} (ID: ${nigeriaCurriculum.id})`);

    // 2. Fetch ONLY subjects belonging strictly to the Nigerian Curriculum
    const nigeriaSubjects = await prisma.subject.findMany({
      where: {
        curriculumId: nigeriaCurriculum.id,
      },
    });

    if (nigeriaSubjects.length === 0) {
      console.warn("⚠️ No subjects found linked directly to the Nigerian Curriculum.");
      return;
    }

    console.log(`📚 Found ${nigeriaSubjects.length} subjects for the Nigerian Curriculum.`);

    // 3. Fetch all grades linked to the Nigerian Curriculum
    const nigeriaGrades = await prisma.grade.findMany({
      where: {
        curriculumId: nigeriaCurriculum.id,
      },
    });

    if (nigeriaGrades.length === 0) {
      console.warn("⚠️ No grades found linked to the Nigerian Curriculum.");
      return;
    }

    console.log(`🏫 Found ${nigeriaGrades.length} grade levels for the Nigerian Curriculum.`);

    // 4. Loop through each Nigerian grade and link ONLY the Nigerian subjects
    let totalLinked = 0;

    for (const grade of nigeriaGrades) {
      console.log(`\nProcessing Grade: ${grade.displayName || grade.name} (Level: ${grade.level})`);

      for (const subject of nigeriaSubjects) {
        // Check if the GradeSubject link already exists
        const existing = await prisma.gradeSubject.findFirst({
          where: {
            gradeId: grade.id,
            subjectId: subject.id,
            schoolId: null, // Global core template
          },
        });

        if (!existing) {
          await prisma.gradeSubject.create({
            data: {
              gradeId: grade.id,
              subjectId: subject.id,
              schoolId: null,
            },
          });
          totalLinked++;
        }
      }
    }

    console.log(`\n🎉 Successfully synchronized Nigerian GradeSubjects! Newly created links: ${totalLinked}`);

  } catch (error) {
    console.error("❌ An error occurred during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedNigeriaCurriculumSubjects();