import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import { Role } from "../src/generated/prisma/enums";

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

  // 1. Ensure the parent Curriculum exists
  const curriculum = await prisma.curriculum.upsert({
    where: { id: "nigerian-national-curriculum" },
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
    where: { id: "lagos-international-academy-id" },
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

  // 5. NEW: Link the Teacher to the Subject Grade
  console.log("🔗 Linking Teacher to Subjects...");
  
  // Find the specific "Bridge" (GradeSubject) you want to link
  const mathLink = await prisma.gradeSubject.findFirst({
    where: {
      grade: { displayName: "JSS 1" },
      subject: { name: "Mathematics" }
    }
  });

  if (mathLink) {
    await prisma.profile.update({
      where: { email: teacher.email },
      data: {
        selectedSubjects: {
          connect: { id: mathLink.id }
        }
      }
    });
    console.log("✅ Teacher is now enrolled in JSS 1 Mathematics");
  } else {
    console.warn("⚠️ Could not find JSS 1 Mathematics. Ensure curriculum is seeded first.");
  }

  console.log("✅ Seeding complete.");
  console.log("Teacher Email:", teacher.email);
  console.log("Student Email:", student.email);
}