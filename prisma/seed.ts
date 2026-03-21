// // import { PrismaClient } from "../src/generated/prisma/umuse";
// import { PrismaClient } from "../src/generated/prisma/client";
// import { PrismaPg } from "@prisma/adapter-pg";
// import { Pool } from "pg";
// import * as dotenv from "dotenv";
// import { Role } from "../src/generated/prisma/enums";

// // Load environment variables
// dotenv.config();



// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error("DATABASE_URL environment variable is not set");
// }

// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log("🚀 Starting targeted user seeding...");

//   // 1. Ensure the parent Curriculum exists
//   const curriculum = await prisma.curriculum.upsert({
//     where: { id: "nigerian-national-curriculum" },
//     update: {},
//     create: {
//       id: "nigerian-national-curriculum",
//       name: "Nigerian National Curriculum",
//       yearLabel: "Grade",
//       termLabel: "Term",
//       subjectLabel: "Subject",
//     },
//   });

//   // 2. Ensure the parent School exists
//   const school = await prisma.school.upsert({
//     where: { id: "lagos-international-academy-id" },
//     update: {},
//     create: {
//       id: "lagos-international-academy-id",
//       name: "Lagos International Academy",
//       curriculumId: curriculum.id,
//     },
//   });

//   // 3. Seed Test Teacher
//   const teacher = await prisma.profile.upsert({
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

//   // 4. Seed Test Student
//   const student = await prisma.profile.upsert({
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

//   // 5. NEW: Link the Teacher to the Subject Grade
//   console.log("🔗 Linking Teacher to Subjects...");
  
//   // Find the specific "Bridge" (GradeSubject) you want to link
//   const mathLink = await prisma.gradeSubject.findFirst({
//     where: {
//       grade: { displayName: "JSS 1" },
//       subject: { name: "Mathematics" }
//     }
//   });

//   if (mathLink) {
//     await prisma.profile.update({
//       where: { email: teacher.email },
//       data: {
//         selectedSubjects: {
//           connect: { id: mathLink.id }
//         }
//       }
//     });
//     console.log("✅ Teacher is now enrolled in JSS 1 Mathematics");
//   } else {
//     console.warn("⚠️ Could not find JSS 1 Mathematics. Ensure curriculum is seeded first.");
//   }

//   console.log("✅ Seeding complete.");
//   console.log("Teacher Email:", teacher.email);
//   console.log("Student Email:", student.email);
// }


// import { PrismaClient, Role } from "@prisma/client"; // Updated import
// import { PrismaPg } from "@prisma/adapter-pg";

// import { Pool } from "pg";
// import * as dotenv from "dotenv";

// // Load environment variables
// dotenv.config();

// const connectionString = process.env.DATABASE_URL;
// if (!connectionString) {
//   throw new Error("DATABASE_URL environment variable is not set");
// }

// // Set up the PostgreSQL adapter
// const pool = new Pool({ connectionString });
// const adapter = new PrismaPg(pool);
// const prisma = new PrismaClient({ adapter });

// async function main() {
//   console.log("🚀 Starting targeted user seeding...");

//   // 1. Ensure the parent Curriculum exists
//   const curriculum = await prisma.curriculum.upsert({
//     where: { id: "nigerian-national-curriculum" },
//     update: {},
//     create: {
//       id: "nigerian-national-curriculum",
//       name: "Nigerian National Curriculum",
//       yearLabel: "Grade",
//       termLabel: "Term",
//       subjectLabel: "Subject",
//     },
//   });

//   // 2. Ensure the parent School exists
//   const school = await prisma.school.upsert({
//     where: { id: "lagos-international-academy-id" },
//     update: {},
//     create: {
//       id: "lagos-international-academy-id",
//       name: "Lagos International Academy",
//       curriculumId: curriculum.id,
//     },
//   });

//   // 3. Seed Test Teacher
//   const teacher = await prisma.profile.upsert({
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

//   // 4. Seed Test Student
//   const student = await prisma.profile.upsert({
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

//   // 5. Link the Teacher to the Subject Grade
//   console.log("🔗 Linking Teacher to Subjects...");
  
//   const mathLink = await prisma.gradeSubject.findFirst({
//     where: {
//       grade: { displayName: "JSS 1" },
//       subject: { name: "Mathematics" }
//     }
//   });

//   if (mathLink) {
//     await prisma.profile.update({
//       where: { email: teacher.email },
//       data: {
//         selectedSubjects: {
//           connect: { id: mathLink.id }
//         }
//       }
//     });
//     console.log("✅ Teacher is now enrolled in JSS 1 Mathematics");
//   } else {
//     console.warn("⚠️ Could not find JSS 1 Mathematics. Ensure curriculum is seeded first.");
//   }

//   console.log("✅ Seeding complete.");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//     await pool.end();
//   });



// import { PrismaClient, Role } from "@prisma/client";
// import * as dotenv from "dotenv";

// dotenv.config();

// // Standard initialization (automatically uses DATABASE_URL from .env)
// const prisma = new PrismaClient();

// async function main() {
//   console.log("🚀 Starting targeted user seeding...");

//   // 1. Ensure the parent Curriculum exists
//   const curriculum = await prisma.curriculum.upsert({
//     where: { id: "nigerian-national-curriculum" },
//     update: {},
//     create: {
//       id: "nigerian-national-curriculum",
//       name: "Nigerian National Curriculum",
//       yearLabel: "Grade",
//       termLabel: "Term",
//       subjectLabel: "Subject",
//     },
//   });

//   // ... rest of your logic remains exactly the same ...

//   console.log("✅ Seeding complete.");
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

const NGN_RATE = 1600

const plans = [
    {
        name:         'Monthly',
        slug:         'monthly',
        priceUSD:     29,
        priceNGN:     Math.round(29 * NGN_RATE),
        priceKobo:    Math.round(29 * NGN_RATE * 100),
        durationDays: 30,
        description:  'Flexible monthly billing',
        popular:      false,
        sortOrder:    1,
        features: [
            'Unlimited students',
            'WhatsApp parent notifications',
            'AI lesson planner',
            'Assessment management',
            'Priority support',
        ],
    },
    {
        name:         'Per Term',
        slug:         'termly',
        priceUSD:     75,
        priceNGN:     Math.round(75 * NGN_RATE),
        priceKobo:    Math.round(75 * NGN_RATE * 100),
        durationDays: 90,
        description:  'Pay once per school term',
        popular:      true,
        sortOrder:    2,
        features: [
            'Everything in Monthly',
            'Save 14% vs monthly',
            'Term-based billing',
            'Dedicated onboarding',
            'Priority support',
        ],
    },
    {
        name:         'Annual',
        slug:         'annual',
        priceUSD:     249,
        priceNGN:     Math.round(249 * NGN_RATE),
        priceKobo:    Math.round(249 * NGN_RATE * 100),
        durationDays: 365,
        description:  'Best value — pay once a year',
        popular:      false,
        sortOrder:    3,
        features: [
            'Everything in Per Term',
            'Save 28% vs monthly',
            'Annual receipt for records',
            'Custom onboarding session',
            '24/7 priority support',
        ],
    },
]

async function main() {
    console.log('🌱 Start seeding subscription plans...')
    for (const plan of plans) {
        await prisma.subscriptionPlan.upsert({
            where:  { slug: plan.slug },
            update: plan,
            create: plan,
        })
    }
    console.log('✅ Subscription plans seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })