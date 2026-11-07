// import { generateObject } from 'ai';
// import { openai } from '@ai-sdk/openai'; // or your preferred model provider
// import * as fs from 'fs';
// import * as path from 'path';
// import { z } from 'zod';

// // Define the Zod schema matching your JSON structure to guarantee strict formatting
// const curriculumSchema = z.object({
//   subject: z.string(),
//   curriculum: z.string(),
//   grades: z.array(
//     z.object({
//       grade: z.string(), // e.g., "Grade 9", "Year 10", "Grade 11"
//       terms: z.array(
//         z.object({
//           term: z.number(), // 1, 2, 3 (or semesters: 1, 2)
//           weeks: z.array(
//             z.object({
//               week: z.union([z.number(), z.string()]), // Handles "1" or "11-13"
//               topic: z.string(),
//               description: z.string().nullable(),
//             })
//           ),
//         })
//       ),
//     })
//   ),
// });

// async function generateCurriculumFile(
//   countrySystem: 'British' | 'American' | 'Canadian',
//   subjectName: string,
//   targetGrades: string[]
// ) {
//   console.log(`🤖 Generating ${countrySystem} curriculum for ${subjectName}...`);

//   const prompt = `
//     You are an expert international curriculum developer specializing in the ${countrySystem} educational system.
//     Generate a comprehensive syllabus for the subject: "${subjectName}" covering these grade levels: ${targetGrades.join(', ')}.
    
//     Structure it strictly by grades, terms (or semesters), and weekly topics with a short description for each topic.
//     Ensure the terminology, grade naming conventions (e.g., "Year 7" or "Grade 9"), and scope align accurately with official educational standards for ${countrySystem}.
//   `;

//   try {
//     const { object } = await generateObject({
//       model: openai('gpt-4o'), // Use a capable model for structured generation
//       schema: curriculumSchema,
//       prompt: prompt,
//     });

//     const fileName = `${countrySystem.toLowerCase()}-${subjectName.toLowerCase().replace(/\s+/g, '-')}.json`;
//     const outputPath = path.join(process.cwd(), 'prisma', 'data', fileName);

//     fs.writeFileSync(outputPath, JSON.stringify(object, null, 2));
//     console.log(`✅ Saved successfully to: prisma/data/${fileName}`);
//   } catch (error) {
//     console.error(`❌ Failed to generate ${subjectName}:`, error);
//   }
// }

// async function runBatchGeneration() {
//   // Example: Generate British Curriculum for Mathematics
//   await generateCurriculumFile('British', 'Mathematics', ['Year 7', 'Year 8', 'Year 9']);

//   // Example: Generate American Curriculum for Algebra
//   await generateCurriculumFile('American', 'Algebra I', ['Grade 9', 'Grade 10']);
// }

// runBatchGeneration();


import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const CURRICULA_DATA = [

  {
    id: 'british-curriculum',
    name: 'British National Curriculum',
    type: 'generic',
    subjectLabel: 'Subject',
    termLabel: 'Term',
    yearLabel: 'Year',
  },
  {
    id: 'american-curriculum',
    name: 'American Common Core Curriculum',
    type: 'generic',
    subjectLabel: 'Subject',
    termLabel: 'Semester',
    yearLabel: 'Grade',
  },
  {
    id: 'canadian-curriculum',
    name: 'Canadian Provincial Curriculum',
    type: 'generic',
    subjectLabel: 'Subject',
    termLabel: 'Semester',
    yearLabel: 'Grade',
  },
];

async function seedCurricula() {
  console.log('🌱 Starting curriculum table seeding...');

  for (const curriculum of CURRICULA_DATA) {
    const existing = await prisma.curriculum.findUnique({
      where: { id: curriculum.id },
    });

    if (existing) {
      console.log(`  ♻️ Exists: ${curriculum.name}`);
      // Update fields if needed to match latest config
      await prisma.curriculum.update({
        where: { id: curriculum.id },
        data: {
          name: curriculum.name,
          subjectLabel: curriculum.subjectLabel,
          termLabel: curriculum.termLabel,
          yearLabel: curriculum.yearLabel,
        },
      });
    } else {
      await prisma.curriculum.create({
        data: {
          id: curriculum.id,
          name: curriculum.name,
          type: curriculum.type,
          subjectLabel: curriculum.subjectLabel,
          termLabel: curriculum.termLabel,
          yearLabel: curriculum.yearLabel,
          schoolId: null, // Global curriculum record
        },
      });
      console.log(`  ➕ Created: ${curriculum.name}`);
    }
  }

  console.log('\n🎉 Curriculum seeding completed successfully!');
}

async function main() {
  await seedCurricula();
}

main()
  .catch((error) => {
    console.error('❌ Curriculum seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });