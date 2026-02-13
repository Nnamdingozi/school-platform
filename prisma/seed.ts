import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import { Role } from "@prisma/client";

// Load environment variables
dotenv.config();



const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🚀 Starting targeted user seeding...");

  // 1. Ensure the parent Curriculum exists (needed for user foreign keys)
  const curriculum = await prisma.curriculum.upsert({
    where: { id: "nigerian-national-curriculum" }, // Using a stable ID
    update: {},
    create: {
      id: "nigerian-national-curriculum",
      name: "Nigerian National Curriculum",
      yearLabel: "Grade",
      termLabel: "Term",
      subjectLabel: "Subject",
    },
  });

  // 2. Ensure the parent School exists
  const school = await prisma.school.upsert({
    where: { id: "lagos-international-academy-id" }, // Using a stable ID
    update: {},
    create: {
      id: "lagos-international-academy-id",
      name: "Lagos International Academy",
      curriculumId: curriculum.id,
    },
  });

  // 3. Seed Test Teacher
  const teacher = await prisma.profile.upsert({
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

  // 4. Seed Test Student
  const student = await prisma.profile.upsert({
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

  console.log("✅ Seeding complete.");
  console.log("Teacher Email:", teacher.email);
  console.log("Student Email:", student.email);
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