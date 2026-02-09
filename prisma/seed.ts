import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env
dotenv.config();

// Prisma 7: Use PostgreSQL adapter for direct connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ESM-safe __dirname resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type WeekJson = {
  week: number | string;
  topic: string;
  description?: string;
};

type TermJson = {
  term: number;
  weeks: WeekJson[];
};

type GradeJson = {
  grade: string;
  terms: TermJson[];
};

type SubjectJson = {
  subject: string;
  curriculum?: string;
  grades: GradeJson[];
};

function slugifyGrade(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function shortNameFromGrade(name: string): string {
  return name.replace(/\s+/g, "");
}

function levelFromGradeName(name: string): number | null {
  const trimmed = name.trim();

  // JSS 1 => 7, JSS 2 => 8, JSS 3 => 9
  const jssMatch = /^JSS\s+(\d+)$/i.exec(trimmed);
  if (jssMatch) {
    const n = Number(jssMatch[1]);
    if (!Number.isNaN(n)) return 6 + n;
  }

  // SSS 1 => 10, SSS 2 => 11, SSS 3 => 12
  const sssMatch = /^SSS\s+(\d+)$/i.exec(trimmed);
  if (sssMatch) {
    const n = Number(sssMatch[1]);
    if (!Number.isNaN(n)) return 9 + n;
  }

  // Fallback: "Grade 1" => 1, etc.
  const gradeMatch = /^Grade\s+(\d+)$/i.exec(trimmed);
  if (gradeMatch) {
    const n = Number(gradeMatch[1]);
    if (!Number.isNaN(n)) return n;
  }

  return null;
}

function termDisplayName(index: number): string {
  if (index === 1) return "First Term";
  if (index === 2) return "Second Term";
  if (index === 3) return "Third Term";
  return `Term ${index}`;
}

function weekNumberFromValue(value: number | string | undefined): number | null {
  if (value === undefined) return null;
  if (typeof value === "number") return value;
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
}

async function ensureCurriculum() {
  const name = "Nigerian National Curriculum";

  const existing = await prisma.curriculum.findFirst({
    where: { name },
  });

  if (!existing) {
    const created = await prisma.curriculum.create({
      data: {
        name,
        yearLabel: "Grade",
        termLabel: "Term",
        subjectLabel: "Subject",
      },
    });

    console.log(`Created curriculum '${name}'`);
    return created;
  }

  // Ensure labels are up to date
  if (
    existing.yearLabel !== "Grade" ||
    existing.termLabel !== "Term" ||
    existing.subjectLabel !== "Subject"
  ) {
    const updated = await prisma.curriculum.update({
      where: { id: existing.id },
      data: {
        yearLabel: "Grade",
        termLabel: "Term",
        subjectLabel: "Subject",
      },
    });
    console.log(`Updated labels for curriculum '${name}'`);
    return updated;
  }

  return existing;
}

async function ensureSchool(curriculumId: string) {
  const name = "Lagos International Academy";

  let school = await prisma.school.findFirst({
    where: { name, curriculumId },
  });

  if (!school) {
    school = await prisma.school.create({
      data: {
        name,
        curriculumId,
      },
    });
    console.log(`Created school '${name}'`);
  }

  return school;
}

async function upsertSubjectForCurriculum(
  curriculumId: string,
  schoolId: string | null,
  subjectName: string
) {
  let subject = await prisma.subject.findFirst({
    where: { name: subjectName, curriculumId },
  });

  if (!subject) {
    subject = await prisma.subject.create({
      data: {
        name: subjectName,
        curriculumId,
        schoolId: schoolId ?? undefined,
      },
    });
    console.log(`  Created subject '${subjectName}'`);
  } else if (!subject.schoolId && schoolId) {
    subject = await prisma.subject.update({
      where: { id: subject.id },
      data: { schoolId },
    });
    console.log(`  Linked subject '${subjectName}' to school`);
  } else {
    console.log(`  Reusing subject '${subjectName}'`);
  }

  return subject;
}

async function upsertGrade(
  curriculumId: string,
  schoolId: string | null,
  gradeName: string
) {
  const level = levelFromGradeName(gradeName);
  if (level == null) {
    console.warn(`  Skipping grade '${gradeName}' - could not infer level`);
    return null;
  }

  const slug = slugifyGrade(gradeName);
  const shortName = shortNameFromGrade(gradeName);

  const grade = await prisma.grade.upsert({
    where: {
      curriculumId_level: {
        curriculumId,
        level,
      },
    },
    update: {
      displayName: gradeName,
      shortName,
      slug,
      schoolId: schoolId ?? undefined,
    },
    create: {
      level,
      slug,
      displayName: gradeName,
      shortName,
      curriculumId,
      schoolId: schoolId ?? undefined,
    },
  });

  console.log(`  Upserted grade '${gradeName}' (level=${level}, slug='${slug}')`);
  return grade;
}

async function upsertGradeSubject(
  gradeId: string,
  subjectId: string,
  schoolId: string | null
) {
  const gradeSubject = await prisma.gradeSubject.upsert({
    where: {
      gradeId_subjectId: {
        gradeId,
        subjectId,
      },
    },
    update: {
      schoolId: schoolId ?? undefined,
    },
    create: {
      gradeId,
      subjectId,
      schoolId: schoolId ?? undefined,
    },
  });

  console.log(`    Linked grade and subject via GradeSubject`);
  return gradeSubject;
}

async function upsertTerm(
  gradeId: string,
  index: number,
  schoolId: string | null
) {
  const displayName = termDisplayName(index);

  const term = await prisma.term.upsert({
    where: {
      gradeId_index: {
        gradeId,
        index,
      },
    },
    update: {
      displayName,
      schoolId: schoolId ?? undefined,
    },
    create: {
      index,
      displayName,
      gradeId,
      schoolId: schoolId ?? undefined,
    },
  });

  console.log(`    Upserted term '${displayName}' (index=${index})`);
  return term;
}

async function upsertTopic(
  title: string,
  description: string | undefined,
  weekNumber: number | null,
  gradeSubjectId: string,
  termId: string,
  schoolId: string | null
) {
  const existing = await prisma.topic.findFirst({
    where: {
      title,
      gradeSubjectId,
      termId,
      weekNumber: weekNumber ?? undefined,
    },
  });

  if (existing) {
    await prisma.topic.update({
      where: { id: existing.id },
      data: {
        description,
        weekNumber: weekNumber ?? undefined,
        schoolId: schoolId ?? undefined,
      },
    });
    console.log(
      `      Updated topic '${title}' (week=${weekNumber ?? "n/a"})`
    );
    return;
  }

  await prisma.topic.create({
    data: {
      title,
      description,
      weekNumber: weekNumber ?? undefined,
      gradeSubjectId,
      termId,
      schoolId: schoolId ?? undefined,
    },
  });
  console.log(`      Created topic '${title}' (week=${weekNumber ?? "n/a"})`);
}

async function processSubjectFile(
  filePath: string,
  curriculumId: string,
  schoolId: string | null
) {
  const fileName = path.basename(filePath);
  const raw = await fs.readFile(filePath, "utf-8");
  const data = JSON.parse(raw) as SubjectJson;

  console.log(`\nProcessing file: ${fileName}`);
  console.log(` Subject: ${data.subject}`);

  const subject = await upsertSubjectForCurriculum(
    curriculumId,
    schoolId,
    data.subject
  );

  for (const gradeJson of data.grades) {
    console.log(` Grade: ${gradeJson.grade}`);

    const grade = await upsertGrade(curriculumId, schoolId, gradeJson.grade);
    if (!grade) continue;

    const gradeSubject = await upsertGradeSubject(
      grade.id,
      subject.id,
      schoolId
    );

    for (const termJson of gradeJson.terms) {
      const termIndex = termJson.term ?? 0;
      if (!termIndex) {
        console.warn(
          `    Skipping term with invalid index for grade '${grade.displayName}'`
        );
        continue;
      }

      const term = await upsertTerm(grade.id, termIndex, schoolId);

      for (const weekJson of termJson.weeks) {
        const weekNumber = weekNumberFromValue(weekJson.week);
        await upsertTopic(
          weekJson.topic,
          weekJson.description,
          weekNumber,
          gradeSubject.id,
          term.id,
          schoolId
        );
      }
    }
  }
}

async function main() {
  const curriculum = await ensureCurriculum();
  const school = await ensureSchool(curriculum.id);

  // Still seed basic demo users so the app has some accounts to work with
  const teacher = await prisma.user.upsert({
    where: { email: "teacher@lagosacademy.test" },
    update: {
      name: "Test Teacher",
      schoolId: school.id,
      curriculumId: curriculum.id,
      role: Role.TEACHER,
    },
    create: {
      email: "teacher@lagosacademy.test",
      name: "Test Teacher",
      role: Role.TEACHER,
      schoolId: school.id,
      curriculumId: curriculum.id,
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@lagosacademy.test" },
    update: {
      name: "Test Student",
      schoolId: school.id,
      curriculumId: curriculum.id,
      role: Role.STUDENT,
    },
    create: {
      email: "student@lagosacademy.test",
      name: "Test Student",
      role: Role.STUDENT,
      schoolId: school.id,
      curriculumId: curriculum.id,
    },
  });

  console.log(
    `\nUsing curriculum '${curriculum.name}' and school '${school.name}'`
  );

  const dataDir = path.join(__dirname, "data");
  const entries = await fs.readdir(dataDir);
  const jsonFiles = entries.filter((f) => f.toLowerCase().endsWith(".json"));

  if (jsonFiles.length === 0) {
    console.warn("No JSON files found in prisma/data");
  }

  for (const file of jsonFiles) {
    const fullPath = path.join(dataDir, file);
    try {
      await processSubjectFile(fullPath, curriculum.id, school.id);
    } catch (err) {
      console.error(`Error processing file ${file}:`, err);
    }
  }

  console.log("\nSeeding complete.");
  console.log(" Demo users:", {
    teacher: teacher.email,
    student: student.email,
  });
}

main()
  .catch((e) => {
    console.error("Seeding error", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

// import { PrismaClient, Role } from "@prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";
// import * as dotenv from 'dotenv'

// // Load the environment variables from your .env file
// dotenv.config()

// // Prisma 7: Use PostgreSQL adapter for direct connection
// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error("DATABASE_URL environment variable is not set");
// }

// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   // 1. Curriculum
//   const existingCurriculum = await prisma.curriculum.findFirst({
//     where: { name: "Nigerian National Curriculum" },
//   });

//   const curriculum =
//     existingCurriculum ??
//     (await prisma.curriculum.create({
//       data: {
//         name: "Nigerian National Curriculum",
//         yearLabel: "Grade",
//         termLabel: "Term",
//         subjectLabel: "Subject",
//       },
//     }));

//   // Ensure labels are up to date if it already existed
//   if (
//     existingCurriculum &&
//     (existingCurriculum.yearLabel !== "Grade" ||
//       existingCurriculum.termLabel !== "Term")
//   ) {
//     await prisma.curriculum.update({
//       where: { id: existingCurriculum.id },
//       data: {
//         yearLabel: "Grade",
//         termLabel: "Term",
//       },
//     });
//   }

//   // 2. School linked to curriculum
//   let school = await prisma.school.findFirst({
//     where: {
//       name: "Lagos International Academy",
//       curriculumId: curriculum.id,
//     },
//   });

//   if (!school) {
//     school = await prisma.school.create({
//       data: {
//         name: "Lagos International Academy",
//         curriculumId: curriculum.id,
//       },
//     });
//   }

//   // 3. Grade 7 (JSS 1)
//   const grade7 = await prisma.grade.upsert({
//     where: {
//       curriculumId_level: {
//         curriculumId: curriculum.id,
//         level: 7,
//       },
//     },
//     update: {
//       displayName: "JSS 1",
//       shortName: "JSS1",
//       slug: "jss-1",
//       schoolId: school.id,
//     },
//     create: {
//       level: 7,
//       slug: "jss-1",
//       displayName: "JSS 1",
//       shortName: "JSS1",
//       curriculumId: curriculum.id,
//       schoolId: school.id,
//     },
//   });

//   // 4. Terms for Grade 7
//   const firstTerm = await prisma.term.upsert({
//     where: {
//       gradeId_index: {
//         gradeId: grade7.id,
//         index: 1,
//       },
//     },
//     update: {
//       displayName: "First Term",
//       schoolId: school.id,
//     },
//     create: {
//       index: 1,
//       displayName: "First Term",
//       gradeId: grade7.id,
//       schoolId: school.id,
//     },
//   });

//   const secondTerm = await prisma.term.upsert({
//     where: {
//       gradeId_index: {
//         gradeId: grade7.id,
//         index: 2,
//       },
//     },
//     update: {
//       displayName: "Second Term",
//       schoolId: school.id,
//     },
//     create: {
//       index: 2,
//       displayName: "Second Term",
//       gradeId: grade7.id,
//       schoolId: school.id,
//     },
//   });

//   const thirdTerm = await prisma.term.upsert({
//     where: {
//       gradeId_index: {
//         gradeId: grade7.id,
//         index: 3,
//       },
//     },
//     update: {
//       displayName: "Third Term",
//       schoolId: school.id,
//     },
//     create: {
//       index: 3,
//       displayName: "Third Term",
//       gradeId: grade7.id,
//       schoolId: school.id,
//     },
//   });

//   // 5. Subject: Mathematics
//   let math = await prisma.subject.findFirst({
//     where: {
//       name: "Mathematics",
//       curriculumId: curriculum.id,
//     },
//   });

//   if (!math) {
//     math = await prisma.subject.create({
//       data: {
//         name: "Mathematics",
//         curriculumId: curriculum.id,
//         schoolId: school.id,
//       },
//     });
//   } else if (!math.schoolId) {
//     math = await prisma.subject.update({
//       where: { id: math.id },
//       data: { schoolId: school.id },
//     });
//   }

//   // 6. GradeSubject: JSS 1 Mathematics
//   const gradeSubject = await prisma.gradeSubject.upsert({
//     where: {
//       gradeId_subjectId: {
//         gradeId: grade7.id,
//         subjectId: math.id,
//       },
//     },
//     update: {
//       schoolId: school.id,
//     },
//     create: {
//       gradeId: grade7.id,
//       subjectId: math.id,
//       schoolId: school.id,
//     },
//   });

//   // 7. Topics for Term 1 and Term 2
//   const topicsTerm1 = ["Whole Numbers", "Number Bases"];
//   const topicsTerm2 = ["Fractions", "Decimals"];

//   for (const title of topicsTerm1) {
//     const existing = await prisma.topic.findFirst({
//       where: {
//         title,
//         gradeSubjectId: gradeSubject.id,
//         termId: firstTerm.id,
//       },
//     });
//     if (!existing) {
//       await prisma.topic.create({
//         data: {
//           title,
//           gradeSubjectId: gradeSubject.id,
//           termId: firstTerm.id,
//           schoolId: school.id,
//         },
//       });
//     }
//   }

//   for (const title of topicsTerm2) {
//     const existing = await prisma.topic.findFirst({
//       where: {
//         title,
//         gradeSubjectId: gradeSubject.id,
//         termId: secondTerm.id,
//       },
//     });
//     if (!existing) {
//       await prisma.topic.create({
//         data: {
//           title,
//           gradeSubjectId: gradeSubject.id,
//           termId: secondTerm.id,
//           schoolId: school.id,
//         },
//       });
//     }
//   }

//   // 8. Users: Teacher and Student
//   const teacher = await prisma.user.upsert({
//     where: { email: "teacher@lagosacademy.test" },
//     update: {
//       name: "Test Teacher",
//       schoolId: school.id,
//       curriculumId: curriculum.id,
//       role: Role.TEACHER,
//     },
//     create: {
//       email: "teacher@lagosacademy.test",
//       name: "Test Teacher",
//       role: Role.TEACHER,
//       schoolId: school.id,
//       curriculumId: curriculum.id,
//     },
//   });

//   const student = await prisma.user.upsert({
//     where: { email: "student@lagosacademy.test" },
//     update: {
//       name: "Test Student",
//       schoolId: school.id,
//       curriculumId: curriculum.id,
//       role: Role.STUDENT,
//     },
//     create: {
//       email: "student@lagosacademy.test",
//       name: "Test Student",
//       role: Role.STUDENT,
//       schoolId: school.id,
//       curriculumId: curriculum.id,
//     },
//   });

//   // Assign teacher to GradeSubject
//   await prisma.gradeSubject.update({
//     where: { gradeId_subjectId: { gradeId: grade7.id, subjectId: math.id } },
//     data: { teacherId: teacher.id },
//   });

//   console.log("Seed completed:", {
//     curriculum: curriculum.name,
//     school: school.name,
//     grade: grade7.displayName,
//     terms: [firstTerm.displayName, secondTerm.displayName, thirdTerm.displayName],
//     subject: math.name,
//     teacher: teacher.email,
//     student: student.email,
//   });
// }

// main()
//   .catch((e) => {
//     console.error("Seeding error", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//     await pool.end();
//   });

