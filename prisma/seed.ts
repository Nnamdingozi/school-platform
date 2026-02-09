import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from 'dotenv'

// Load the environment variables from your .env file
dotenv.config()

// Prisma 7: Use PostgreSQL adapter for direct connection
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

 v async function main() {
  // 1. Curriculum
  const existingCurriculum = await prisma.curriculum.findFirst({
    where: { name: "Nigerian National Curriculum" },
  });

  const curriculum =
    existingCurriculum ??
    (await prisma.curriculum.create({
      data: {
        name: "Nigerian National Curriculum",
        yearLabel: "Grade",
        termLabel: "Term",
        subjectLabel: "Subject",
      },
    }));

  // Ensure labels are up to date if it already existed
  if (
    existingCurriculum &&
    (existingCurriculum.yearLabel !== "Grade" ||
      existingCurriculum.termLabel !== "Term")
  ) {
    await prisma.curriculum.update({
      where: { id: existingCurriculum.id },
      data: {
        yearLabel: "Grade",
        termLabel: "Term",
      },
    });
  }

  // 2. School linked to curriculum
  let school = await prisma.school.findFirst({
    where: {
      name: "Lagos International Academy",
      curriculumId: curriculum.id,
    },
  });

  if (!school) {
    school = await prisma.school.create({
      data: {
        name: "Lagos International Academy",
        curriculumId: curriculum.id,
      },
    });
  }

  // 3. Grade 7 (JSS 1)
  const grade7 = await prisma.grade.upsert({
    where: {
      curriculumId_level: {
        curriculumId: curriculum.id,
        level: 7,
      },
    },
    update: {
      displayName: "JSS 1",
      shortName: "JSS1",
      slug: "jss-1",
      schoolId: school.id,
    },
    create: {
      level: 7,
      slug: "jss-1",
      displayName: "JSS 1",
      shortName: "JSS1",
      curriculumId: curriculum.id,
      schoolId: school.id,
    },
  });

  // 4. Terms for Grade 7
  const firstTerm = await prisma.term.upsert({
    where: {
      gradeId_index: {
        gradeId: grade7.id,
        index: 1,
      },
    },
    update: {
      displayName: "First Term",
      schoolId: school.id,
    },
    create: {
      index: 1,
      displayName: "First Term",
      gradeId: grade7.id,
      schoolId: school.id,
    },
  });

  const secondTerm = await prisma.term.upsert({
    where: {
      gradeId_index: {
        gradeId: grade7.id,
        index: 2,
      },
    },
    update: {
      displayName: "Second Term",
      schoolId: school.id,
    },
    create: {
      index: 2,
      displayName: "Second Term",
      gradeId: grade7.id,
      schoolId: school.id,
    },
  });

  const thirdTerm = await prisma.term.upsert({
    where: {
      gradeId_index: {
        gradeId: grade7.id,
        index: 3,
      },
    },
    update: {
      displayName: "Third Term",
      schoolId: school.id,
    },
    create: {
      index: 3,
      displayName: "Third Term",
      gradeId: grade7.id,
      schoolId: school.id,
    },
  });

  // 5. Subject: Mathematics
  let math = await prisma.subject.findFirst({
    where: {
      name: "Mathematics",
      curriculumId: curriculum.id,
    },
  });

  if (!math) {
    math = await prisma.subject.create({
      data: {
        name: "Mathematics",
        curriculumId: curriculum.id,
        schoolId: school.id,
      },
    });
  } else if (!math.schoolId) {
    math = await prisma.subject.update({
      where: { id: math.id },
      data: { schoolId: school.id },
    });
  }

  // 6. GradeSubject: JSS 1 Mathematics
  const gradeSubject = await prisma.gradeSubject.upsert({
    where: {
      gradeId_subjectId: {
        gradeId: grade7.id,
        subjectId: math.id,
      },
    },
    update: {
      schoolId: school.id,
    },
    create: {
      gradeId: grade7.id,
      subjectId: math.id,
      schoolId: school.id,
    },
  });

  // 7. Topics for Term 1 and Term 2
  const topicsTerm1 = ["Whole Numbers", "Number Bases"];
  const topicsTerm2 = ["Fractions", "Decimals"];

  for (const title of topicsTerm1) {
    const existing = await prisma.topic.findFirst({
      where: {
        title,
        gradeSubjectId: gradeSubject.id,
        termId: firstTerm.id,
      },
    });
    if (!existing) {
      await prisma.topic.create({
        data: {
          title,
          gradeSubjectId: gradeSubject.id,
          termId: firstTerm.id,
          schoolId: school.id,
        },
      });
    }
  }

  for (const title of topicsTerm2) {
    const existing = await prisma.topic.findFirst({
      where: {
        title,
        gradeSubjectId: gradeSubject.id,
        termId: secondTerm.id,
      },
    });
    if (!existing) {
      await prisma.topic.create({
        data: {
          title,
          gradeSubjectId: gradeSubject.id,
          termId: secondTerm.id,
          schoolId: school.id,
        },
      });
    }
  }

  // 8. Users: Teacher and Student
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

  // Assign teacher to GradeSubject
  await prisma.gradeSubject.update({
    where: { gradeId_subjectId: { gradeId: grade7.id, subjectId: math.id } },
    data: { teacherId: teacher.id },
  });

  console.log("Seed completed:", {
    curriculum: curriculum.name,
    school: school.name,
    grade: grade7.displayName,
    terms: [firstTerm.displayName, secondTerm.displayName, thirdTerm.displayName],
    subject: math.name,
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

