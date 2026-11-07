import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define curriculum codes/names mapping based on your database
const CURRICULA = {
  BRITISH: 'British National Curriculum',
  AMERICAN: 'American Common Core',
  CANADIAN: 'Canadian Provincial Curriculum',
};

// Master subject lists mapped to their respective curriculum titles
const SUBJECT_DATA: Record<string, string[]> = {
  [CURRICULA.BRITISH]: [
    'Mathematics',
    'English Language',
    'English Literature',
    'Biology',
    'Chemistry',
    'Physics',
    'Combined Science',
    'Computer Science / Information Technology',
    'History',
    'Geography',
    'Economics',
    'Business Studies',
    'Accounting / Financial Accounting',
    'Art and Design',
    'Music',
    'Physical Education (PE)',
    'French / Spanish / German',
    'Religious Studies',
  ],
  [CURRICULA.AMERICAN]: [
    'Algebra I',
    'Geometry',
    'Algebra II / Trigonometry',
    'Pre-Calculus / Calculus',
    'English Language Arts (ELA)',
    'General Science',
    'Biology',
    'Chemistry',
    'Physics',
    'U.S. History',
    'World History',
    'Government and Politics (Civics)',
    'Economics',
    'Computer Science / Coding',
    'Spanish / French',
    'Visual Arts',
    'Health and Physical Education',
  ],
  [CURRICULA.CANADIAN]: [
    'Mathematics',
    'English Language Arts',
    'General Science',
    'Biology',
    'Chemistry',
    'Physics',
    'Canadian and World Studies',
    'Social Studies',
    'Business Leadership / Accounting',
    'Computer Studies',
    'Visual Arts',
    'French (Core / Immersion)',
    'Health and Physical Education',
  ],
};

async function seedSubjects() {
  console.log('🌱 Starting global subjects seeding...');

  for (const [curriculumName, subjects] of Object.entries(SUBJECT_DATA)) {
    // 1. Find the curriculum record in the database
    const curriculum = await prisma.curriculum.findFirst({
      where: { name: curriculumName },
    });

    if (!curriculum) {
      console.warn(`⚠️ Curriculum not found in database: "${curriculumName}". Skipping its subjects. Make sure the curriculum exists first.`);
      continue;
    }

    console.log(`\n📚 Processing subjects for: ${curriculumName}`);

    for (const subjectName of subjects) {
      // 2. Upsert or check-and-create global subject (schoolId: null)
      const existingSubject = await prisma.subject.findFirst({
        where: {
          name: subjectName,
          curriculumId: curriculum.id,
          schoolId: null,
        },
      });

      if (existingSubject) {
        console.log(`  ♻️ Exists: ${subjectName}`);
      } else {
        await prisma.subject.create({
          data: {
            name: subjectName,
            curriculumId: curriculum.id,
            schoolId: null, // Global subject
          },
        });
        console.log(`  ➕ Created: ${subjectName}`);
      }
    }
  }

  console.log('\n🎉 Global subjects seeding completed successfully!');
}

async function main() {
  await seedSubjects();
}

main()
  .catch((error) => {
    console.error('❌ Subject seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });