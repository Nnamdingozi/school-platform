// "use server";

// import { prisma } from "@/lib/prisma";
// import { Question, Prisma } from "@prisma/client";

// export interface ScannedBankFilter {
//   subjectId?: string;
//   year?: number;
//   examBody?: string;
//   schoolId: string | null;
//   userId: string;
// }

// export interface ScannedBankFilter {
//   subjectId?: string;
//   topicId?: string;   // ✅ Added this to resolve your error
//   year?: number;
//   examBody?: string;
//   schoolId: string | null;
//   userId: string;
// }

// // In the getScannedQuestions action, ensure the where clause uses it:
// // where: { topicId: topicId || undefined, ... }

// /**
//  * Retrieves scanned questions based on user ownership.
//  * Rule 5: School users see school scans.
//  * Rule 6: Individuals see personal scans.
//  */
// export async function getScannedQuestions(params: ScannedBankFilter): Promise<Question[]> {
//   const { subjectId, year, examBody, schoolId, userId } = params;

//   try {
//     return await prisma.question.findMany({
//       where: {
//         category: "SCANNED",
//         subjectId: subjectId || undefined,
//         year: year || undefined,
//         examBody: examBody || undefined,
//         OR: [
//           // Tier 2: School Scans
//           schoolId ? { schoolId: schoolId } : { id: 'NEVER' },
//           // Tier 3: Personal Scans
//           {
//             AND: [
//               { creatorId: userId },
//               { schoolId: null }
//             ]
//           }
//         ]
//       },
//       orderBy: { createdAt: 'desc' }
//     });
//   } catch (error) {
//     console.error("Error fetching scanned questions:", error);
//     return [];
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { 
//     Question, 
//     Role, 
//     QuestionType, 
//     QuestionCategory, 
//     Prisma, 
//     ActivityType 
// } from "@prisma/client";
// import { logActivity } from "@/lib/activitylogger";
// import { getErrorMessage } from "@/lib/error-handler";
// import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";
// import { academicCoreScope } from "@/lib/content-scope";
// import { revalidatePath } from "next/cache";

// // ─── Types ───────────────────────────────────────────────────────────────────

// export interface ScannedBankFilter {
//   subjectId?: string;
//   topicId?: string;
//   year?: number;
//   examBody?: string;
//   schoolId: string | null;
//   userId: string;
// }

// interface QuestionPart {
//   number: string;
//   text: string;
//   marks?: string | null;
// }

// interface ExtractedData {
//   subject: string;
//   year: string;
//   examBody: string;
//   grade: string;
//   questions: QuestionPart[];
// }

// interface AnswerPart {
//   number: string;
//   answer: string;
//   explanation: string;
//   difficulty: "easy" | "medium" | "hard";
// }

// interface ProcessResult {
//   success: boolean;
//   count?: number;
//   imageUrl?: string | null;
//   error?: string;
// }

// // ─── AI Constants ─────────────────────────────────────────────────────────────

// const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
// const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// // ─── AI Processing Logic ──────────────────────────────────────────────────────

// async function callGemini(prompt: string, inlineData?: { mimeType: string, data: string }) {
//   const model = inlineData ? "gemini-1.5-flash" : "gemini-1.5-pro";
//   const body = {
//     contents: [{
//       parts: [
//         ...(inlineData ? [{ inlineData }] : []),
//         { text: prompt }
//       ]
//     }],
//     generationConfig: { 
//         temperature: 0.1, 
//         responseMimeType: "application/json" 
//     }
//   };

//   const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) throw new Error(`AI Service Error: ${res.statusText}`);
//   const json = await res.json();
//   const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
//   if (!text) throw new Error("AI returned empty context.");
//   return JSON.parse(text);
// }

// // ─── Main Server Actions ──────────────────────────────────────────────────────

// /**
//  * FETCH SCANNED REGISTRY
//  * Rule 5: School users see institutional scans.
//  * Rule 6: Individuals see personal scans linked via creatorId.
//  * Rule 11: Real-time filtering based on registry metadata.
//  */
// export async function getScannedQuestions(params: ScannedBankFilter): Promise<Question[]> {
//   const { subjectId, topicId, year, examBody, schoolId, userId } = params;

//   try {
//     return await prisma.question.findMany({
//       where: {
//         category: QuestionCategory.SCANNED,
//         subjectId: subjectId || undefined,
//         topicId: topicId || undefined, // ✅ FIXED: Implemented topicId filter
//         year: year || undefined,
//         examBody: examBody || undefined,
//         OR: [
//           // Tier 2: Institutional Ownership
//           schoolId ? { schoolId: schoolId } : { id: 'FORBIDDEN' },
//           // Tier 3: Personal Ownership (Creator match + No school context)
//           {
//             AND: [
//               { creatorId: userId },
//               { schoolId: null }
//             ]
//           }
//         ]
//       },
//       orderBy: { createdAt: 'desc' }
//     });
//   } catch (error: unknown) {
//     console.error("Scanned Bank Fetch Error:", getErrorMessage(error));
//     return [];
//   }
// }

// /**
//  * PROCESS & DIGITIZE PAPER
//  * Rule 5: Scopes scans to school folder/ID.
//  * Rule 6: Scopes scans to user folder/ID for independent learners.
//  * Rule 11: Persists metadata (Year, Body, Subject) for future retrieval.
//  */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   topicId: string;
// }): Promise<ProcessResult> {
//   const { formData, userId, schoolId, userRole, topicId } = params;

//   try {
//     const imageFile = formData.get("image") as File;
//     if (!imageFile) return { success: false, error: "No image payload provided." };

//     const buffer = Buffer.from(await imageFile.arrayBuffer());
//     const base64Image = buffer.toString("base64");

//     // 1. Google Cloud Storage Logic (Rule 11 Pathing)
//     const storagePath = schoolId ? `schools/${schoolId}/scans` : `users/${userId}/scans`;
//     const fileName = `${storagePath}/${Date.now()}-${imageFile.name}`;
//     let imageUrl: string | null = null;

//     try {
//         imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);
//     } catch (e) {
//         console.warn("GCS sync failed, continuing to AI OCR...");
//     }

//     // 2. AI Extraction & Solving (Rule 8)
//     const extracted = await callGemini(
//       "Extract questions. JSON: {subject, year, examBody, grade, questions: [{number, text, marks}]}",
//       { mimeType: imageFile.type, data: base64Image }
//     ) as ExtractedData;

//     const answered = await callGemini(
//       `Solve these questions for ${extracted.subject} ${extracted.year}. JSON array: [{number, answer, explanation, difficulty}]`
//     ) as AnswerPart[];

//     // 3. Resolve Subject Metadata (Rule 3 Access check)
//     const subjectRecord = await prisma.subject.findFirst({
//         where: {
//             name: { contains: extracted.subject, mode: 'insensitive' },
//             ...academicCoreScope({ schoolId })
//         }
//     });

//     // 4. Persistence Transaction (Rule 11 System Truth)
//     const count = await prisma.$transaction(async (tx) => {
//       const questionRecords = extracted.questions.map((q) => {
//         const sol = answered.find(a => a.number === q.number);
//         return {
//           topicId,
//           text: q.text,
//           correctAnswer: sol?.answer ?? "Theory submission",
//           explanation: sol?.explanation ?? "Generated by AI Synthesis",
//           type: QuestionType.ESSAY,
//           category: QuestionCategory.SCANNED,
          
//           // Ownership & Multi-Tier Identity (Rule 5, 6, 11)
//           schoolId: schoolId,
//           isGlobal: false, // Scans are never global by default
//           creatorId: userId,
//           subjectId: subjectRecord?.id ?? null,
//           year: parseInt(extracted.year) || null,
//           examBody: extracted.examBody || "External Registry",
//           points: parseInt(q.marks || "1") || 1,
//           options: [] as unknown as Prisma.JsonValue,
//         };
//       });

//       const batch = await tx.question.createMany({ data: questionRecords });

//       // 5. Rule 11: Activity Logging
//       await logActivity({
//         schoolId: schoolId,
//         actorId: userId,
//         actorRole: userRole,
//         type: ActivityType.SETTINGS_UPDATED,
//         title: schoolId ? "School Paper Digitized" : "Personal Scan Digitized",
//         description: `Successfully converted ${batch.count} nodes for ${extracted.subject} (${extracted.year}).`
//       });

//       return batch.count;
//     });

//     revalidatePath("/library/scans");
//     return { success: true, count, imageUrl };

//   } catch (error: unknown) {
//     return { success: false, error: getErrorMessage(error) };
//   }
// }




"use server";

import { prisma } from "@/lib/prisma";
import { 
    Question, 
    Role, 
    QuestionType, 
    QuestionCategory, 
    Prisma, 
    ActivityType 
} from "@prisma/client";
import { logActivity } from "@/lib/activitylogger";
import { getErrorMessage } from "@/lib/error-handler";
import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";
import { academicCoreScope } from "@/lib/content-scope";
import { revalidatePath } from "next/cache";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ScannedBankFilter {
  subjectId?: string;
  topicId?: string;
  year?: number;
  examBody?: string;
  schoolId: string | null;
  userId: string;
}

interface QuestionPart {
  number: string;
  text: string;
  marks?: string | null;
}

interface ExtractedData {
  subject: string;
  year: string;
  examBody: string;
  grade: string;
  questions: QuestionPart[];
}

interface AnswerPart {
  number: string;
  answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface ProcessResult {
  success: boolean;
  count?: number;
  imageUrl?: string | null;
  error?: string;
}

// ─── AI Constants ─────────────────────────────────────────────────────────────

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// ─── AI Processing Logic ──────────────────────────────────────────────────────

async function callGemini(prompt: string, inlineData?: { mimeType: string, data: string }) {
  const model = inlineData ? "gemini-1.5-flash" : "gemini-1.5-pro";
  const body = {
    contents: [{
      parts: [
        ...(inlineData ? [{ inlineData }] : []),
        { text: prompt }
      ]
    }],
    generationConfig: { 
        temperature: 0.1, 
        responseMimeType: "application/json" 
    }
  };

  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`AI Service Error: ${res.statusText}`);
  const json = await res.json();
  const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("AI returned empty context.");
  return JSON.parse(text);
}

// ─── Main Server Actions ──────────────────────────────────────────────────────

/**
 * FETCH SCANNED REGISTRY
 * Rule 5: School users see institutional scans.
 * Rule 6: Individuals see personal scans linked via creatorId.
 */
export async function getScannedQuestions(params: ScannedBankFilter): Promise<Question[]> {
  const { subjectId, topicId, year, examBody, schoolId, userId } = params;

  try {
    return await prisma.question.findMany({
      where: {
        category: QuestionCategory.SCANNED,
        subjectId: subjectId || undefined,
        topicId: topicId || undefined,
        year: year || undefined,
        examBody: examBody || undefined,
        OR: [
          // Tier 2: Institutional Ownership
          schoolId ? { schoolId: schoolId } : { id: 'FORBIDDEN' },
          // Tier 3: Personal Ownership
          {
            AND: [
              { creatorId: userId },
              { schoolId: null }
            ]
          }
        ]
      },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error: unknown) {
    console.error("Scanned Bank Fetch Error:", getErrorMessage(error));
    return [];
  }
}

/**
 * PROCESS & DIGITIZE PAPER
 * Rule 11: Persists metadata and resolves JSON type compatibility.
 */
export async function processPastQuestion(params: {
  formData: FormData;
  userId: string;
  schoolId: string | null;
  userRole: Role;
  topicId: string;
}): Promise<ProcessResult> {
  const { formData, userId, schoolId, userRole, topicId } = params;

  try {
    const imageFile = formData.get("image") as File;
    if (!imageFile) return { success: false, error: "No image payload provided." };

    const buffer = Buffer.from(await imageFile.arrayBuffer());
    const base64Image = buffer.toString("base64");

    // 1. Storage Logic
    const storagePath = schoolId ? `schools/${schoolId}/scans` : `users/${userId}/scans`;
    const fileName = `${storagePath}/${Date.now()}-${imageFile.name}`;
    let imageUrl: string | null = null;

    try {
        imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);
    } catch (e) {
        console.warn("GCS sync failed, continuing to AI OCR...");
    }

    // 2. AI Synthesis
    const extracted = await callGemini(
      "Extract questions. JSON: {subject, year, examBody, grade, questions: [{number, text, marks}]}",
      { mimeType: imageFile.type, data: base64Image }
    ) as ExtractedData;

    const answered = await callGemini(
      `Solve these questions for ${extracted.subject} ${extracted.year}. JSON array: [{number, answer, explanation, difficulty}]`
    ) as AnswerPart[];

    // 3. Metadata Resolution
    const subjectRecord = await prisma.subject.findFirst({
        where: {
            name: { contains: extracted.subject, mode: 'insensitive' },
            ...academicCoreScope({ schoolId })
        }
    });

    // 4. Persistence Transaction (Rule 11)
    const count = await prisma.$transaction(async (tx) => {
      // ✅ FIXED: Using QuestionCreateManyInput type to ensure property 'options' is valid
      const questionRecords: Prisma.QuestionCreateManyInput[] = extracted.questions.map((q) => {
        const sol = answered.find(a => a.number === q.number);
        return {
          topicId,
          text: q.text,
          correctAnswer: sol?.answer ?? "Theory submission",
          explanation: sol?.explanation ?? "Generated by AI Synthesis",
          type: QuestionType.ESSAY,
          category: QuestionCategory.SCANNED,
          
          // ✅ FIXED: Handled schoolId type mismatch for Tier 3
          schoolId: schoolId as string, 
          isGlobal: false,
          creatorId: userId,
          subjectId: subjectRecord?.id ?? null,
          year: parseInt(extracted.year) || null,
          examBody: extracted.examBody || "External Registry",
          points: parseInt(q.marks || "1") || 1,
          
          // ✅ FIXED: Correctly typed empty array for JSON field
          options: [] as Prisma.InputJsonValue,
        };
      });

      const batch = await tx.question.createMany({ data: questionRecords });

      // 5. Activity Logging
      await logActivity({
        schoolId: schoolId,
        actorId: userId,
        actorRole: userRole,
        type: ActivityType.SETTINGS_UPDATED,
        title: schoolId ? "School Paper Digitized" : "Personal Scan Digitized",
        description: `Successfully converted ${batch.count} nodes for ${extracted.subject} (${extracted.year}).`
      });

      return batch.count;
    });

    revalidatePath("/library/scans");
    return { success: true, count, imageUrl };

  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}