

// import { generateText, Output } from 'ai';
// import 'dotenv/config';
// import { PrismaClient } from '@prisma/client';
// import * as fs from 'fs';
// import * as path from 'path';
// import { z } from 'zod';

// const prisma = new PrismaClient();

// // Define schema matching your database structure
// const syllabusSchema = z.object({
//   subject: z.string(),
//   curriculum: z.string(),
//   grades: z.array(
//     z.object({
//       grade: z.string(), // e.g., "Year 7" or "Grade 9"
//       terms: z.array(
//         z.object({
//           term: z.number(),
//           weeks: z.array(
//             z.object({
//               week: z.union([z.number(), z.string()]),
//               topic: z.string(),
//               description: z.string().nullable(),
//             })
//           ),
//         })
//       ),
//     })
//   ),
// });

// async function generateSyllabiForCurriculum(curriculumId: string, targetSubjectName?: string) {
//   // 1. Fetch curriculum details to get its name and labels
//   const curriculum = await prisma.curriculum.findUnique({
//     where: { id: curriculumId },
//   });

//   if (!curriculum) {
//     throw new Error(`Curriculum not found for ID: ${curriculumId}`);
//   }

//   // 2. Fetch grades associated with this curriculum, ordered by level
//   const grades = await prisma.grade.findMany({
//     where: { curriculumId: curriculum.id },
//     orderBy: { level: 'asc' },
//   });

//   if (grades.length === 0) {
//     throw new Error(`No grades found for curriculum: ${curriculum.name}. Seed your grades first.`);
//   }

//   const gradeNames = grades.map((g) => g.displayName);

//   // 3. Construct the query cleanly to satisfy Prisma's strict typing
//   const subjects = await prisma.subject.findMany({
//     where: {
//       curriculumId: curriculum.id,
//       schoolId: null,
//       ...(targetSubjectName ? { name: targetSubjectName } : {}),
//     },
//   });

//   if (subjects.length === 0) {
//     console.log(`⚠️ No subjects found in database for ${curriculum.name}.`);
//     return;
//   }

//   console.log(`\n🎯 Target Curriculum: ${curriculum.name}`);
//   console.log(`📚 Found ${subjects.length} subject(s) to process.`);
//   console.log(`🎓 Grade levels: ${gradeNames.join(', ')}`);

//   // 4. Loop through each subject fetched from the DB
//   for (const subject of subjects) {
//     console.log(`\n🤖 Generating syllabus for subject: "${subject.name}" (${curriculum.name})...`);

//     const prompt = `
//       You are an expert international curriculum developer specializing in the ${curriculum.name}.
//       Generate a complete academic syllabus for the subject "${subject.name}" covering these exact grade/year levels: ${gradeNames.join(', ')}.
      
//       Structure it strictly into:
//       1. Grades/Years matching the exact names provided: ${gradeNames.join(', ')}.
//       2. Terms or Semesters (typically 3 terms for British/generic systems, or 2 semesters for American/Canadian).
//       3. Weekly breakdown containing the week number (or range like "11-13"), a clear lesson topic title, and a short description of what is taught that week.
      
//       Ensure academic rigor, accurate standard terminology, and logical progression across the weeks.
//     `;

//     try {
//         const result = await generateText({
//             model: 'openai/gpt-4o',
//             prompt: prompt,
//             output: Output.object({
//               schema: syllabusSchema,
//             }),
//           });
       
//           const syllabusData = result.output;

//       const systemPrefix = curriculum.name.toLowerCase().includes('british') ? 'british' : 
//                            curriculum.name.toLowerCase().includes('american') ? 'american' : 
//                            curriculum.name.toLowerCase().includes('canadian') ? 'canadian' : 'curriculum';

//       const fileName = `${systemPrefix}-${subject.name.toLowerCase().replace(/[\/\s]+/g, '-')}.json`;
//       const outputPath = path.join(process.cwd(), 'prisma', 'data', fileName);

//       fs.writeFileSync(outputPath, JSON.stringify(object, null, 2));
//       console.log(`✅ Saved JSON file: prisma/data/${fileName}`);
//     } catch (error) {
//       console.error(`❌ Failed to generate syllabus for ${subject.name}:`, error);
//     }
//   }

//   console.log(`\n🎉 Finished generating all syllabi for ${curriculum.name}!`);
// }

// async function main() {
//   await generateSyllabiForCurriculum('british-curriculum');
// }

// main()
//   .catch((error) => {
//     console.error('❌ Generation script failed:', error);
//     process.exitCode = 1;
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });import { generateText, Output } from 'ai';


import 'dotenv/config';
import { generateText, Output } from 'ai';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { z } from 'zod';

const prisma = new PrismaClient();

// Define schema matching your database structure
const syllabusSchema = z.object({
  subject: z.string(),
  curriculum: z.string(),
  grades: z.array(
    z.object({
      grade: z.string(), // e.g., "Year 7" or "Grade 9"
      terms: z.array(
        z.object({
          term: z.number(),
          weeks: z.array(
            z.object({
              week: z.union([z.number(), z.string()]),
              topic: z.string(),
              description: z.string().nullable(),
            })
          ),
        })
      ),
    })
  ),
});

async function generateSyllabiForCurriculum(curriculumId: string, targetSubjectName?: string) {
  // 1. Fetch curriculum details to get its name and labels
  const curriculum = await prisma.curriculum.findUnique({
    where: { id: curriculumId },
  });

  if (!curriculum) {
    throw new Error(`Curriculum not found for ID: ${curriculumId}`);
  }

  // 2. Fetch grades associated with this curriculum, ordered by level
  const grades = await prisma.grade.findMany({
    where: { curriculumId: curriculum.id },
    orderBy: { level: 'asc' },
  });

  if (grades.length === 0) {
    throw new Error(`No grades found for curriculum: ${curriculum.name}. Seed your grades first.`);
  }

  const gradeNames = grades.map((g) => g.displayName);

  // 3. Construct the query cleanly to satisfy Prisma's strict typing
  const subjects = await prisma.subject.findMany({
    where: {
      curriculumId: curriculum.id,
      schoolId: null,
      ...(targetSubjectName ? { name: targetSubjectName } : {}),
    },
  });

  if (subjects.length === 0) {
    console.log(`⚠️ No subjects found in database for ${curriculum.name}.`);
    return;
  }

  console.log(`\n🎯 Target Curriculum: ${curriculum.name}`);
  console.log(`📚 Found ${subjects.length} subject(s) to process.`);
  console.log(`🎓 Grade levels: ${gradeNames.join(', ')}`);

  // 4. Loop through each subject fetched from the DB
  for (const subject of subjects) {
    console.log(`\n🤖 Generating syllabus for subject: "${subject.name}" (${curriculum.name})...`);

    const prompt = `
      You are an expert international curriculum developer specializing in the ${curriculum.name}.
      Generate a complete academic syllabus for the subject "${subject.name}" covering these exact grade/year levels: ${gradeNames.join(', ')}.
      
      Structure it strictly into:
      1. Grades/Years matching the exact names provided: ${gradeNames.join(', ')}.
      2. Terms or Semesters (typically 3 terms for British/generic systems, or 2 semesters for American/Canadian).
      3. Weekly breakdown containing the week number (or range like "11-13"), a clear lesson topic title, and a short description of what is taught that week.
      
      Ensure academic rigor, accurate standard terminology, and logical progression across the weeks.
    `;

    try {
      const result = await generateText({
        model: 'openai/gpt-4o',
        prompt: prompt,
        output: Output.object({
          schema: syllabusSchema,
        }),
      });

      const syllabusData = result.output;

      const systemPrefix = curriculum.name.toLowerCase().includes('british') ? 'british' : 
                           curriculum.name.toLowerCase().includes('american') ? 'american' : 
                           curriculum.name.toLowerCase().includes('canadian') ? 'canadian' : 'curriculum';

      const fileName = `${systemPrefix}-${subject.name.toLowerCase().replace(/[\/\s]+/g, '-')}.json`;
      const outputPath = path.join(process.cwd(), 'prisma', 'data', fileName);

      fs.writeFileSync(outputPath, JSON.stringify(syllabusData, null, 2));
      console.log(`✅ Saved JSON file: prisma/data/${fileName}`);
    } catch (error) {
      console.error(`❌ Failed to generate syllabus for ${subject.name}:`, error);
    }
  }

  console.log(`\n🎉 Finished generating all syllabi for ${curriculum.name}!`);
}

async function main() {
  await generateSyllabiForCurriculum('british-curriculum');
}

main()
  .catch((error) => {
    console.error('❌ Generation script failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });