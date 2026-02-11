import { PrismaClient, Role } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env
dotenv.config();

// Prisma 7: Setup Connection
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

// --- Types ---
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

// --- Helper Functions ---
function slugifyGrade(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function shortNameFromGrade(name: string): string {
  return name.replace(/\s+/g, "");
}

/**
 * Robustly maps JSS/SSS names to numeric levels.
 * Handles "SS 1", "SS1", "SSS 1", etc.
 */
function levelFromGradeName(name: string): number | null {
  const trimmed = name.trim();

  // JSS 1-3 => Levels 7-9
  const jssMatch = /^JSS\s*(\d+)$/i.exec(trimmed);
  if (jssMatch) {
    const n = Number(jssMatch[1]);
    return 6 + n;
  }

  // SSS or SS 1-3 => Levels 10-12
  const sssMatch = /^(SSS|SS)\s*(\d+)$/i.exec(trimmed);
  if (sssMatch) {
    const n = Number(sssMatch[2]);
    return 9 + n;
  }

  // Fallback for "Grade 1" or "Year 1"
  const gradeMatch = /^(Grade|Year)\s*(\d+)$/i.exec(trimmed);
  if (gradeMatch) {
    return Number(gradeMatch[2]);
  }

  return null;
}

function termDisplayName(index: number): string {
  const map: Record<number, string> = { 1: "First Term", 2: "Second Term", 3: "Third Term" };
  return map[index] || `Term ${index}`;
}

function weekNumberFromValue(value: number | string | undefined): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value === "number") return value;
  const match = String(value).match(/^(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

// --- Database Logic ---

async function ensureCurriculum() {
  const name = "Nigerian National Curriculum";
  return await prisma.curriculum.upsert({
    where: { id: "nigerian-national-curriculum" }, // Consistent ID for lookups
    update: { name, yearLabel: "Grade", termLabel: "Term", subjectLabel: "Subject" },
    create: { id: "nigerian-national-curriculum", name, yearLabel: "Grade", termLabel: "Term", subjectLabel: "Subject" },
  });
}

async function ensureSchool(curriculumId: string) {
  const name = "Lagos International Academy";
  const existing = await prisma.school.findFirst({ where: { name } });
  if (existing) return existing;
  return await prisma.school.create({ data: { name, curriculumId } });
}

async function processSubjectFile(filePath: string, curriculumId: string, schoolId: string) {
  const fileName = path.basename(filePath);
  const raw = await fs.readFile(filePath, "utf-8");
  const data: SubjectJson = JSON.parse(raw);

  console.log(`\n📘 Processing: ${data.subject} (${fileName})`);

  // 1. Ensure Subject
  const subject = await prisma.subject.upsert({
    where: { id: slugifyGrade(data.subject) + "-" + curriculumId }, // Create unique ID per curriculum
    update: { name: data.subject },
    create: { id: slugifyGrade(data.subject) + "-" + curriculumId, name: data.subject, curriculumId, schoolId },
  });

  for (const gradeJson of data.grades) {
    const level = levelFromGradeName(gradeJson.grade);
    if (level === null) {
      console.warn(`  ⚠️ Skipping Grade: "${gradeJson.grade}" - Format not recognized (Expected JSS 1, SS 1, etc.)`);
      continue;
    }

    // 2. Ensure Grade
    const grade = await prisma.grade.upsert({
      where: { curriculumId_level: { curriculumId, level } },
      update: { displayName: gradeJson.grade, slug: slugifyGrade(gradeJson.grade) },
      create: { curriculumId, level, displayName: gradeJson.grade, slug: slugifyGrade(gradeJson.grade), shortName: shortNameFromGrade(gradeJson.grade), schoolId },
    });

    // 3. Link Grade and Subject
    const gradeSubject = await prisma.gradeSubject.upsert({
      where: { gradeId_subjectId: { gradeId: grade.id, subjectId: subject.id } },
      update: {},
      create: { gradeId: grade.id, subjectId: subject.id, schoolId },
    });

    for (const termJson of gradeJson.terms) {
      // 4. Ensure Term
      const term = await prisma.term.upsert({
        where: { gradeId_index: { gradeId: grade.id, index: termJson.term } },
        update: { displayName: termDisplayName(termJson.term) },
        create: { gradeId: grade.id, index: termJson.term, displayName: termDisplayName(termJson.term), schoolId },
      });

      for (const weekJson of termJson.weeks) {
        // 5. Ensure Topic
        const weekNum = weekNumberFromValue(weekJson.week);
        await prisma.topic.upsert({
          where: { 
            // Composite key or unique check logic
            id: slugifyGrade(`${grade.displayName}-${subject.name}-${term.index}-${weekJson.topic}`)
          },
          update: { description: weekJson.description, weekNumber: weekNum },
          create: {
            id: slugifyGrade(`${grade.displayName}-${subject.name}-${term.index}-${weekJson.topic}`),
            title: weekJson.topic,
            description: weekJson.description,
            weekNumber: weekNum,
            gradeSubjectId: gradeSubject.id,
            termId: term.id,
            schoolId
          }
        });
      }
      console.log(`    ✅ ${grade.displayName} - ${term.displayName}: ${termJson.weeks.length} topics.`);
    }
  }
}

async function main() {
  const curriculum = await ensureCurriculum();
  const school = await ensureSchool(curriculum.id);

  const dataDir = path.join(__dirname, "data");
  const entries = await fs.readdir(dataDir);
  let jsonFiles = entries.filter((f) => f.toLowerCase().endsWith(".json"));

  // --- TARGETED FILTERING ---
  const subjectFilter = process.argv[2]; 
  if (subjectFilter) {
    const filtered = jsonFiles.filter(file => file.toLowerCase().includes(subjectFilter.toLowerCase()));
    if (filtered.length === 0) {
      console.error(`\n❌ ERROR: No file matching "${subjectFilter}" found in prisma/data/`);
      console.log(`Available: ${jsonFiles.join(", ")}`);
      process.exit(1);
    }
    jsonFiles = filtered;
    console.log(`\n🎯 Running single-subject mode: ${jsonFiles[0]}`);
  } else {
    console.log(`\n📂 Running all subjects (${jsonFiles.length} files)`);
  }

  for (const file of jsonFiles) {
    await processSubjectFile(path.join(dataDir, file), curriculum.id, school.id);
  }

  console.log("\n🚀 Seeding Complete.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); await pool.end(); });