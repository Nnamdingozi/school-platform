import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface GradeInput {
  level: number;
  slug: string;
  displayName: string;
  shortName?: string;
}

const INTERNATIONAL_GRADES: Record<string, GradeInput[]> = {
  'british-curriculum': [
    { level: 7, slug: 'year-7', displayName: 'Year 7', shortName: 'Y7' },
    { level: 8, slug: 'year-8', displayName: 'Year 8', shortName: 'Y8' },
    { level: 9, slug: 'year-9', displayName: 'Year 9', shortName: 'Y9' },
    { level: 10, slug: 'year-10', displayName: 'Year 10', shortName: 'Y10' },
    { level: 11, slug: 'year-11', displayName: 'Year 11', shortName: 'Y11' },
    { level: 12, slug: 'year-12', displayName: 'Year 12 (Lower Sixth)', shortName: 'Y12' },
    { level: 13, slug: 'year-13', displayName: 'Year 13 (Upper Sixth)', shortName: 'Y13' },
  ],
  'american-curriculum': [
    { level: 7, slug: 'grade-7', displayName: 'Grade 7', shortName: 'G7' },
    { level: 8, slug: 'grade-8', displayName: 'Grade 8', shortName: 'G8' },
    { level: 9, slug: 'grade-9', displayName: 'Grade 9 (Freshman)', shortName: 'G9' },
    { level: 10, slug: 'grade-10', displayName: 'Grade 10 (Sophomore)', shortName: 'G10' },
    { level: 11, slug: 'grade-11', displayName: 'Grade 11 (Junior)', shortName: 'G11' },
    { level: 12, slug: 'grade-12', displayName: 'Grade 12 (Senior)', shortName: 'G12' },
  ],
  'canadian-curriculum': [
    { level: 7, slug: 'grade-7', displayName: 'Grade 7', shortName: 'G7' },
    { level: 8, slug: 'grade-8', displayName: 'Grade 8', shortName: 'G8' },
    { level: 9, slug: 'grade-9', displayName: 'Grade 9', shortName: 'G9' },
    { level: 10, slug: 'grade-10', displayName: 'Grade 10', shortName: 'G10' },
    { level: 11, slug: 'grade-11', displayName: 'Grade 11', shortName: 'G11' },
    { level: 12, slug: 'grade-12', displayName: 'Grade 12', shortName: 'G12' },
  ],
};

async function seedGrades() {
  console.log('🌱 Starting grade table seeding...');

  for (const [curriculumId, grades] of Object.entries(INTERNATIONAL_GRADES)) {
    const curriculum = await prisma.curriculum.findUnique({
      where: { id: curriculumId },
    });

    if (!curriculum) {
      console.warn(`⚠️ Curriculum with ID "${curriculumId}" not found. Make sure to run your curriculum seed script first. Skipping.`);
      continue;
    }

    console.log(`\n🎓 Processing grades for: ${curriculum.name} (${curriculumId})`);

    for (const gradeData of grades) {
      const existingGrade = await prisma.grade.findFirst({
        where: {
          curriculumId: curriculumId,
          level: gradeData.level,
        },
      });

      if (existingGrade) {
        console.log(`  ♻️ Exists: ${gradeData.displayName} (Level ${gradeData.level})`);
      } else {
        await prisma.grade.create({
          data: {
            level: gradeData.level,
            slug: gradeData.slug,
            displayName: gradeData.displayName,
            shortName: gradeData.shortName ?? null,
            curriculumId: curriculumId,
            schoolId: null,
          },
        });
        console.log(`  ➕ Created: ${gradeData.displayName} (Level ${gradeData.level})`);
      }
    }
  }

  console.log('\n🎉 Grade seeding completed successfully!');
}

async function main() {
  await seedGrades();
}

main()
  .catch((error) => {
    console.error('❌ Grade seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });