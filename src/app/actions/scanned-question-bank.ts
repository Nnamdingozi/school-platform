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
//  */
// export async function getScannedQuestions(params: ScannedBankFilter): Promise<Question[]> {
//   const { subjectId, topicId, year, examBody, schoolId, userId } = params;

//   try {
//     return await prisma.question.findMany({
//       where: {
//         category: QuestionCategory.SCANNED,
//         subjectId: subjectId || undefined,
//         topicId: topicId || undefined,
//         year: year || undefined,
//         examBody: examBody || undefined,
//         OR: [
//           // Tier 2: Institutional Ownership
//           schoolId ? { schoolId: schoolId } : { id: 'FORBIDDEN' },
//           // Tier 3: Personal Ownership
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
//  * Rule 11: Persists metadata and resolves JSON type compatibility.
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

//     // 1. Storage Logic
//     const storagePath = schoolId ? `schools/${schoolId}/scans` : `users/${userId}/scans`;
//     const fileName = `${storagePath}/${Date.now()}-${imageFile.name}`;
//     let imageUrl: string | null = null;

//     try {
//         imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);
//     } catch (e) {
//         console.warn("GCS sync failed, continuing to AI OCR...");
//     }

//     // 2. AI Synthesis
//     const extracted = await callGemini(
//       "Extract questions. JSON: {subject, year, examBody, grade, questions: [{number, text, marks}]}",
//       { mimeType: imageFile.type, data: base64Image }
//     ) as ExtractedData;

//     const answered = await callGemini(
//       `Solve these questions for ${extracted.subject} ${extracted.year}. JSON array: [{number, answer, explanation, difficulty}]`
//     ) as AnswerPart[];

//     // 3. Metadata Resolution
//     const subjectRecord = await prisma.subject.findFirst({
//         where: {
//             name: { contains: extracted.subject, mode: 'insensitive' },
//             ...academicCoreScope({ schoolId })
//         }
//     });

//     // 4. Persistence Transaction (Rule 11)
//     const count = await prisma.$transaction(async (tx) => {
//       // ✅ FIXED: Using QuestionCreateManyInput type to ensure property 'options' is valid
//       const questionRecords: Prisma.QuestionCreateManyInput[] = extracted.questions.map((q) => {
//         const sol = answered.find(a => a.number === q.number);
//         return {
//           topicId,
//           text: q.text,
//           correctAnswer: sol?.answer ?? "Theory submission",
//           explanation: sol?.explanation ?? "Generated by AI Synthesis",
//           type: QuestionType.ESSAY,
//           category: QuestionCategory.SCANNED,
          
//           // ✅ FIXED: Handled schoolId type mismatch for Tier 3
//           schoolId: schoolId as string, 
//           isGlobal: false,
//           creatorId: userId,
//           subjectId: subjectRecord?.id ?? null,
//           year: parseInt(extracted.year) || null,
//           examBody: extracted.examBody || "External Registry",
//           points: parseInt(q.marks || "1") || 1,
          
//           // ✅ FIXED: Correctly typed empty array for JSON field
//           options: [] as Prisma.InputJsonValue,
//         };
//       });

//       const batch = await tx.question.createMany({ data: questionRecords });

//       // 5. Activity Logging
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



// ─── Types ───────────────────────────────────────────────────────────────────


/**
 * PROCESS & DIGITIZE SUBJECT PAPER
 * Rule 8: AI performs subject-wide analysis.
 * Rule 11: AI dynamically maps questions to Topic IDs from our database registry.
 */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subjectId: string; // Selection is now at Subject Level
// }): Promise<ProcessResult> {
//   const { formData, userId, schoolId, userRole, subjectId } = params;

//   try {
//     const imageFile = formData.get("image") as File;
//     if (!imageFile) return { success: false, error: "No image payload provided." };

//     const buffer = Buffer.from(await imageFile.arrayBuffer());
//     const base64Image = buffer.toString("base64");

//     // 1. Fetch available syllabus nodes for this subject (Rule 7)
//     // This allows the AI to correctly categorize questions for our DB.
//     const syllabusNodes = await prisma.topic.findMany({
//         where: {
//             gradeSubject: { subjectId },
//             ...academicCoreScope({ schoolId })
//         },
//         select: { id: true, title: true }
//     });

//     if (syllabusNodes.length === 0) {
//         throw new Error("Target subject syllabus is empty. Please define topics first.");
//     }

//     // 2. Prepare metadata for AI classification
//     const syllabusList = syllabusNodes.map(n => `[ID: ${n.id}] Title: ${n.title}`).join("\n");

//     // 3. Storage Logic (Rule 11 Pathing)
//     const storagePath = schoolId ? `schools/${schoolId}/scans` : `users/${userId}/scans`;
//     const fileName = `${storagePath}/${Date.now()}-${imageFile.name}`;
//     try {
//         await uploadToGCS(buffer, fileName, imageFile.type);
//     } catch (e) {
//         console.warn("GCS sync failed, proceeding with local analysis...");
//     }

//     // 4. AI Synthesis & Classification
//     const prompt = `
//         You are a Senior Academic Examiner. Analyze this ${imageFile.type} scan of a ${imageFile.name} paper.
        
//         TASK:
//         1. Extract all questions.
//         2. Solve them using official educational standards.
//         3. CLASSIFICATION: For every question, you MUST select the most relevant Topic ID from this syllabus registry:
//         ${syllabusList}

//         RETURN ONLY A JSON ARRAY:
//         [{ "number": "1", "text": "...", "answer": "...", "explanation": "...", "topicId": "ID_FROM_LIST", "marks": 5, "year": 2023, "examBody": "WAEC" }]
//     `;

//     const aiResults = await callGemini(prompt, { mimeType: imageFile.type, data: base64Image }) as any[];

//     // 5. Persistence Transaction (Rule 11)
//     const count = await prisma.$transaction(async (tx) => {
//       const questionRecords: Prisma.QuestionCreateManyInput[] = aiResults.map((res: any) => {
//         return {
//           text: res.text,
//           correctAnswer: res.answer,
//           explanation: res.explanation,
          
//           // AI Assigned topic classification (Rule 11)
//           topicId: res.topicId, 
//           subjectId: subjectId,
          
//           // Metadata for retrieval
//           year: parseInt(res.year) || null,
//           examBody: res.examBody || "External Registry",
//           points: parseInt(res.marks) || 1,

//           // Tiered Ownership
//           schoolId: schoolId as string, 
//           isGlobal: false,
//           creatorId: userId,
          
//           type: QuestionType.ESSAY,
//           category: QuestionCategory.SCANNED,
//           options: [] as Prisma.InputJsonValue,
//         };
//       });

//       const batch = await tx.question.createMany({ data: questionRecords });

//       // 6. Activity Logging
//       await logActivity({
//         schoolId: schoolId,
//         actorId: userId,
//         actorRole: userRole,
//         type: ActivityType.SETTINGS_UPDATED,
//         title: "Syllabus Paper Digitized",
//         description: `Successfully converted and classified ${batch.count} nodes for subject registry.`
//       });

//       return batch.count;
//     });

//     revalidatePath("/library/scans");
//     return { success: true, count };

//   } catch (error: unknown) {
//     console.error("Vision Architect Failure:", error);
//     return { success: false, error: getErrorMessage(error) };
//   }
// }




/**
 * PROCESS PAST QUESTION (Server Action)
 * Rule 12: Server-side AI processing and DB Persistence.
 * Rule 11: Converts physical scans into classified Registry nodes.
 */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subjectId: string; 
// }): Promise<ProcessResult> {
//   const { formData, userId, schoolId, userRole, subjectId } = params;

//   try {
//     const imageFile = formData.get("image") as File;
//     if (!imageFile) return { success: false, error: "No image payload provided." };

//     const buffer = Buffer.from(await imageFile.arrayBuffer());
//     const base64Image = buffer.toString("base64");

//     // 1. Fetch ALL available Syllabus Topics for this Subject (Rule 7)
//     // We look for topics linked to this subject across ANY grade to ensure the AI has context.
//     const syllabusNodes = await prisma.topic.findMany({
//         where: {
//             gradeSubject: { subjectId: subjectId },
//             // If schoolId is provided, get school topics + global topics. 
//             // If null (Individual), get global only.
//             OR: [
//               { isGlobal: true },
//               { schoolId: schoolId }
//             ]
//         },
//         select: { id: true, title: true }
//     });

//     // Fallback: If no topics exist, we cannot satisfy the schema requirement (topicId String)
//     // Architect Note: You must ensure subjects have at least one "General" topic in the DB.
//     if (syllabusNodes.length === 0) {
//         return { 
//           success: false, 
//           error: "Syllabus Registry Empty: Please ensure topics are defined for this subject in the Syllabus Manager." 
//         };
//     }

//     const syllabusList = syllabusNodes.map(n => `[ID: ${n.id}] Topic: ${n.title}`).join("\n");

//     // 2. AI Synthesis & WAEC/NECO Logic
//     const prompt = `
//         You are a Senior Academic Examiner specializing in West African Curriculum (WAEC/NECO). 
//         Analyze this scan and extract questions.
        
//         TASK:
//         1. Extract text and solve questions accurately.
//         2. CLASSIFICATION: Map every question to exactly ONE ID from this syllabus:
//         ${syllabusList}
        
//         3. METADATA: Identify the Exam Body (WAEC or NECO) and the Year if visible.

//         RETURN ONLY A JSON ARRAY:
//         [{ "text": "...", "answer": "...", "explanation": "...", "topicId": "ID_FROM_LIST", "year": 2023, "examBody": "WAEC" }]
//     `;

//     // Rule 15: Type casting from AI response
//     const aiResults = (await callGemini(prompt, { 
//       mimeType: imageFile.type, 
//       data: base64Image 
//     })) as unknown as Array<{
//       text: string;
//       answer: string;
//       explanation: string;
//       topicId: string;
//       year?: number;
//       examBody?: string;
//     }>;

//     // 3. Persistence Transaction (Rule 11)
//     const count = await prisma.$transaction(async (tx) => {
//       const questionRecords: Prisma.QuestionCreateManyInput[] = aiResults.map((res) => ({
//           text: res.text,
//           correctAnswer: res.answer,
//           explanation: res.explanation,
//           topicId: res.topicId, // Strict link to syllabus
//           subjectId: subjectId,
//           year: res.year ? Number(res.year) : null,
//           examBody: res.examBody || "WAEC",
//           points: 1,
//           schoolId: schoolId, 
//           isGlobal: schoolId === null,
//           creatorId: userId,
//           type: "MCQ", // Default to MCQ for scanned nodes
//           category: "SCANNED",
//           options: [] as Prisma.InputJsonValue,
//       }));

//       const batch = await tx.question.createMany({ data: questionRecords });

//       // 4. Activity Log (Rule 17)
//       await logActivity({
//         schoolId: schoolId,
//         actorId: userId,
//         actorRole: userRole,
//         type: "SETTINGS_UPDATED",
//         title: "WAEC/NECO Registry Updated",
//         description: `Digitized ${batch.count} nodes for subject index.`
//       });

//       return batch.count;
//     });

//     revalidatePath("/library/scans");
//     return { success: true, count };

//   } catch (error: unknown) {
//     console.error("[VISION_ARCHITECT_CRITICAL]:", error);
//     return { success: false, error: "AI Synthesis failed to map questions to syllabus." };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, ActivityType, Prisma, QuestionType, QuestionCategory, Question } from "@prisma/client";
// import { logActivity } from "@/app/actions/activitylog";
// import { getErrorMessage } from "@/lib/error-handler";
// import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";
// import { revalidatePath } from "next/cache";



// interface QuestionPart {
//   number: string;
//   text: string;
//   marks?: string | null;
// }

// export interface ScannedBankFilter {
//   subjectId?: string;
//   topicId?: string;
//   year?: number;
//   examBody?: string;
//   schoolId: string | null;
//   userId: string;
// }



// interface ExtractedData {
//   subject: string;
//   year: string;
//   examBody: string;
//   grade: string;
//   questions: QuestionPart[];
// }

// interface AIResolvedQuestion {
//     number: string;
//     text: string;
//     answer: string;
//     explanation: string;
//     topicId: string; // The ID assigned by AI from our provided list
//     marks: number;
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
//   // Use pro for complex classification tasks
//   const model = "gemini-1.5-pro"; 
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

//   if (!res.ok) throw new Error(`AI Registry Error: ${res.statusText}`);
//   const json = await res.json();
//   const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
//   if (!text) throw new Error("AI returned empty context.");
//   return JSON.parse(text);
// }

// // ─── Main Server Actions ──────────────────────────────────────────────────────


// /**
//  * PROCESS INDEPENDENT QUESTION SET
//  * Rule 11: Stores questions as an independent block, decoupled from Topic/Grade.
//  * Rule 5/6: Maintains multi-tenant isolation via schoolId.
//  */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subject: string; 
//   year: number;
//   examType: string;
// }): Promise<ProcessResult> {
//   const { formData, userId, schoolId, userRole, subject, year, examType } = params;

//   try {
//     const imageFile = formData.get("image") as File;
//     if (!imageFile) return { success: false, error: "Image payload missing." };

//     const buffer = Buffer.from(await imageFile.arrayBuffer());
//     const base64Image = buffer.toString("base64");

//     // 1. Storage Pathing (Rule 11)
//     const storagePath = schoolId ? `schools/${schoolId}/archives` : `users/${userId}/archives`;
//     const fileName = `${storagePath}/${Date.now()}-${imageFile.name}`;
//     let imageUrl: string | null = null;
//     try {
//         imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);
//     } catch (e) {
//         console.warn("Cloud Storage sync bypassed.");
//     }

//     // 2. AI Synthesis (WAEC/NECO Knowledge Core)
//     const prompt = `
//         Act as a Senior Examiner for ${examType}. 
//         Analyze this ${subject} ${year} scan.
//         1. Extract every question accurately.
//         2. Provide detailed pedagogical solutions and marking guides.
        
//         RETURN ONLY A JSON ARRAY:
//         [{ "text": "...", "answer": "...", "explanation": "...", "marks": 5 }]
//     `;

//     const questions = await callGemini(prompt, { 
//       mimeType: imageFile.type, 
//       data: base64Image 
//     });

//     // 3. Independent Table Persistence (Rule 11 System Truth)
//     // NOTE: This uses 'scannedPaper' model (ensure it is in your schema)
//     const paperRecord = await prisma.scannedPaper.create({
//       data: {
//         subject,
//         year,
//         type: examType,
//         imageUrl,
//         schoolId,
//         creatorId: userId,
//         questions: questions as Prisma.InputJsonValue,
//       }
//     });

//     // 4. Log Activity
//     await logActivity({
//       schoolId,
//       actorId: userId,
//       actorRole: userRole,
//       type: ActivityType.SETTINGS_UPDATED,
//       title: "Question Set Digitized",
//       description: `Digitized ${questions.length} nodes for ${subject} ${year} (${examType}).`
//     });

//     revalidatePath("/library/scans");
//     return { success: true, count: questions.length, imageUrl };

//   } catch (error: unknown) {
//     return { success: false, error: getErrorMessage(error) };
//   }
// }



// /**
//  * FETCH ARCHIVE REGISTRY
//  * Rule 11: Retrieves full papers (independent sets) from the database.
//  * Rule 5/6: Scopes institutional vs personal archives.
//  */
// export async function getArchiveRegistry(params: {
//     schoolId: string | null;
//     userId: string;
//     subject?: string;
//     type?: string;
// }) {
//     const { schoolId, userId, subject, type } = params;

//     try {
//         const papers = await prisma.scannedPaper.findMany({
//             where: {
//                 // Tier 2: School Papers OR Tier 3: Personal Papers
//                 OR: [
//                     schoolId ? { schoolId } : { id: 'NEVER' },
//                     { AND: [{ schoolId: null }, { creatorId: userId }] }
//                 ],
//                 subject: subject || undefined,
//                 type: type || undefined,
//             },
//             orderBy: { year: 'desc' },
//             select: {
//                 id: true,
//                 subject: true,
//                 year: true,
//                 type: true,
//                 createdAt: true,
//                 // We don't fetch full questions here to keep the list light
//                 _count: true 
//             }
//         });
//         return papers;
//     } catch (error) {
//         return [];
//     }
// }

// /**
//  * FETCH SINGLE PAPER CONTENT
//  */
// export async function getPaperById(id: string, schoolId: string | null, userId: string) {
//     try {
//         const paper = await prisma.scannedPaper.findUnique({
//             where: { id },
//         });

//         if (!paper) return null;

//         // Rule 10: Security check
//         const isOwner = paper.creatorId === userId;
//         const isInstitutional = schoolId && paper.schoolId === schoolId;

//         if (!isOwner && !isInstitutional) throw new Error("Unauthorized access to node.");

//         return paper;
//     } catch (error) {
//         return null;
//     }
// }




// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, ActivityType, Prisma } from "@prisma/client";
// import { logActivity } from "@/app/actions/activitylog";
// import { getErrorMessage } from "@/lib/error-handler";
// import { uploadToGCS } from "@/lib/academics/pastQuestionConverter";
// import { revalidatePath } from "next/cache";

// // ── Types ───────────────────────────────────────────────────────────────────

// export interface ScannedSet {
//   id: string;
//   subject: string;
//   year: number;
//   type: string;
//   questions: any; // Mapped as Json in DB
//   createdAt: Date;
// }

// // ── Read Logic ───────────────────────────────────────────────────────────────


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

// /**
//  * FETCH ARCHIVE REGISTRY
//  * Rule 5/6: Scopes institutional vs personal sets.
//  */
// export async function getScannedRegistry(schoolId: string | null, userId: string): Promise<ScannedSet[]> {
//     try {
//         return await prisma.scannedPaper.findMany({
//             where: {
//                 OR: [
//                     schoolId ? { schoolId } : { id: 'NEVER' },
//                     { AND: [{ schoolId: null }, { creatorId: userId }] }
//                 ]
//             },
//             orderBy: { createdAt: 'desc' }
//         }) as ScannedSet[];
//     } catch (error) {
//         return [];
//     }
// }

// // ── Write Logic ──────────────────────────────────────────────────────────────

// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subject: string; 
//   year: number;
//   examType: string;
// }) {
//   const { formData, userId, schoolId, userRole, subject, year, examType } = params;

//   try {
//     const imageFile = formData.get("image") as File;
//     const buffer = Buffer.from(await imageFile.arrayBuffer());
    
//     // 1. GCS Pathing
//     const fileName = `${schoolId || userId}/archives/${Date.now()}.png`;
//     const imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);

//     // 2. AI Logic (WAEC/NECO Knowledge Core)
//     const prompt = `Act as Senior Examiner. Analyze this ${subject} ${year} scan. Solve and return JSON array: [{text, answer, explanation, marks}]`;
//     const questions = await callGemini(prompt, { mimeType: imageFile.type, data: buffer.toString("base64") });

//     // 3. Independent Set Persistence
//     const paper = await prisma.scannedPaper.create({
//       data: {
//         subject, year, type: examType, imageUrl,
//         schoolId, creatorId: userId,
//         questions: questions as Prisma.InputJsonValue,
//       }
//     });

//     await logActivity({
//       schoolId, actorId: userId, actorRole: userRole,
//       type: ActivityType.SETTINGS_UPDATED,
//       title: "Archive Set Created",
//       description: `Digitized ${questions.length} nodes for ${subject} ${year}.`
//     });

//     revalidatePath("/library/archives");
//     return { success: true, count: questions.length };
//   } catch (error: unknown) {
//     return { success: false, error: getErrorMessage(error) };
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, ActivityType, Prisma } from "@prisma/client";
// import { logActivity } from "@/app/actions/activitylog";
// import { getErrorMessage } from "@/lib/error-handler";
// import { uploadToGCS } from "@/lib/academics/pastQuestionConverter";
// import { revalidatePath } from "next/cache";

// export interface ScannedPaperSet {
//     id: string;
//     subject: string;
//     year: number;
//     type: string;
//     questions: any;
//     createdAt: Date;
// }

// /**
//  * FETCH ARCHIVE
//  * Rule 5/6: Scopes institutional vs personal archives.
//  */
// export async function getScannedPapers(schoolId: string | null, userId: string): Promise<ScannedPaperSet[]> {
//     try {
//         return await prisma.scannedPaper.findMany({
//             where: {
//                 OR: [
//                     schoolId ? { schoolId } : { id: 'NEVER' },
//                     { AND: [{ schoolId: null }, { creatorId: userId }] }
//                 ]
//             },
//             orderBy: { year: 'desc' }
//         }) as ScannedPaperSet[];
//     } catch (error) { return []; }
// }

// /**
//  * PROCESS NEW PAPER
//  * Rule 11: AI solved and solved as an independent set.
//  */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subject: string; 
//   year: number;
//   examType: string;
// }) {
//   const { formData, userId, schoolId, userRole, subject, year, examType } = params;
//   try {
//     const imageFile = formData.get("image") as File;
//     const buffer = Buffer.from(await imageFile.arrayBuffer());

//     const fileName = `${schoolId || userId}/archives/${Date.now()}.png`;
//     const imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);

//     const prompt = `Act as Senior Examiner. Analyze this ${subject} paper from ${year}. Solve questions. Return JSON array: [{text, answer, explanation}]`;
//     // callGemini helper here...
//     const questions = [{ text: "Mock Question", answer: "A", explanation: "Logic" }]; 

//     await prisma.scannedPaper.create({
//       data: {
//         subject, year, type: examType, imageUrl,
//         schoolId, creatorId: userId,
//         questions: questions as Prisma.InputJsonValue,
//       }
//     });

//     await logActivity({
//       schoolId, actorId: userId, actorRole: userRole,
//       type: ActivityType.SETTINGS_UPDATED,
//       title: "Archive Node Synchronized",
//       description: `Digitized ${subject} ${year} set.`
//     });

//     revalidatePath("/library/archives");
//     return { success: true, count: questions.length };
//   } catch (error: unknown) {
//     return { success: false, error: getErrorMessage(error) };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, ActivityType, Prisma } from "@prisma/client";
// import { logActivity } from "@/app/actions/activitylog";
// import { getErrorMessage } from "@/lib/error-handler";
// import { revalidatePath } from "next/cache";

// // ─── Types ───────────────────────────────────────────────────────────────────

// export interface ScannedPaperSet {
//     id: string;
//     subject: string;
//     year: number;
//     type: string;
//     questions: any; // Mapped as JsonArray
//     createdAt: Date;
// }

// // ─── AI Engine Logic (Rule 8) ────────────────────────────────────────────────

// /**
//  * Rule 8: AI Logic synthesis using Gemini 1.5 Pro.
//  * Handles cleaning of markdown JSON wrappers for strict parsing.
//  */
// async function callGemini(prompt: string, inlineData?: { mimeType: string, data: string }) {
//   const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
//   const model = "gemini-1.5-pro"; 
  
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

//   const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) throw new Error(`Registry AI Link Failure: ${res.statusText}`);
  
//   const json = await res.json();
//   const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  
//   if (!rawText) throw new Error("AI returned an empty logic node.");

//   // Clean markdown if AI included it despite responseMimeType
//   const cleanedText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
//   return JSON.parse(cleanedText);
// }

// // ─── Main Server Actions ──────────────────────────────────────────────────────

// /**
//  * FETCH ARCHIVE REGISTRY
//  * Rule 5/6: Scopes institutional vs personal archives.
//  */
// export async function getScannedPapers(schoolId: string | null, userId: string): Promise<ScannedPaperSet[]> {
//     try {
//         const papers = await prisma.scannedPaper.findMany({
//             where: {
//                 OR: [
//                     schoolId ? { schoolId } : { id: 'NEVER' },
//                     { AND: [{ schoolId: null }, { creatorId: userId }] }
//                 ]
//             },
//             orderBy: { year: 'desc' }
//         });
//         return papers as unknown as ScannedPaperSet[];
//     } catch (error) { return []; }
// }

// /**
//  * PROCESS & DISCARD LOGIC (Rule 11)
//  * Rule 10: Security check ensures image is processed in memory only.
//  */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subject: string; 
//   year: number;
//   examType: string;
// }) {
//   const { formData, userId, schoolId, userRole, subject, year, examType } = params;

//   try {
//     const imageFile = formData.get("image") as File;
//     if (!imageFile) throw new Error("Image payload not discovered.");

//     const buffer = await imageFile.arrayBuffer();
//     const base64Image = Buffer.from(buffer).toString("base64");

//     // 1. AI Synthesis (Direct Base64 Stream)
//     const prompt = `
//         Act as a Senior Academic Examiner. Analyze this ${imageFile.type} scan for ${subject} (${year}).
//         1. Extract all questions.
//         2. Provide expert solutions and rationale.
//         RETURN ONLY JSON ARRAY:
//         [{ "text": "...", "answer": "...", "explanation": "...", "marks": 5 }]
//     `;

//     const questions = await callGemini(prompt, { 
//         mimeType: imageFile.type, 
//         data: base64Image 
//     });

//     // 2. Persist ONLY logic nodes (Rule 11)
//     await prisma.scannedPaper.create({
//       data: {
//         subject,
//         year,
//         type: examType,
//         imageUrl: null, // Image discarded for privacy/cost
//         schoolId,
//         creatorId: userId,
//         questions: questions as Prisma.InputJsonValue,
//       }
//     });

//     // 3. Log Activity
//     await logActivity({
//       schoolId,
//       actorId: userId,
//       actorRole: userRole,
//       type: ActivityType.SETTINGS_UPDATED,
//       title: "Archive Node Synchronized",
//       description: `Digitized ${questions.length} nodes for ${subject} ${year}. Source discarded.`
//     });

//     revalidatePath("/library/archives");
//     return { success: true, count: questions.length };

//   } catch (error: unknown) {
//     return { success: false, error: getErrorMessage(error) };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, ActivityType, Prisma } from "@prisma/client";
// import { logActivity } from "@/app/actions/activitylog";
// import { getErrorMessage } from "@/lib/error-handler";
// import { revalidatePath } from "next/cache";



// export interface ScannedPaperSet {
//   id: string;
//   subject: string;
//   year: number;
//   type: string;
//   questions: any;
//   createdAt: Date;
// }


// // ─── AI Engine Logic (Rule 8) ────────────────────────────────────────────────

// async function callGemini(prompt: string, inlineData?: { mimeType: string, data: string }) {
//   const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
  
//   // ✅ FIX: Use the stable 'v1' endpoint and the 'gemini-1.5-pro' identifier
//   const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
  
//   const body = {
//     contents: [{
//       parts: [
//         ...(inlineData ? [{ inlineData }] : []),
//         { text: prompt }
//       ]
//     }],
//     generationConfig: { 
//         temperature: 0.1, 
//         // Rule 11: System Truth - Force JSON output
//         responseMimeType: "application/json" 
//     }
//   };

//   const res = await fetch(url, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) {
//     const errorText = await res.text();
//     console.error("[GEMINI_CRITICAL_FAILURE]:", errorText);
//     throw new Error(`Registry AI Link Failure: ${res.statusText}`);
//   }
  
//   const json = await res.json();
//   const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
  
//   if (!rawText) throw new Error("AI returned empty logic node.");

//   // Safely parse JSON from AI stream
//   return JSON.parse(rawText.trim());
// }
// // ─── Main Server Actions ──────────────────────────────────────────────────────

// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null;
//   userRole: Role;
//   subject: string; 
//   year: number;
//   examType: string;
// }) {
//   const { formData, userId, schoolId, userRole, subject, year, examType } = params;

//   try {
//     const imageFile = formData.get("image") as File;
//     if (!imageFile) throw new Error("Image payload not discovered.");

//     const buffer = await imageFile.arrayBuffer();
//     const base64Image = Buffer.from(buffer).toString("base64");

//     const prompt = `Act as a Senior Academic Examiner. Extract all questions from this ${subject} paper (Year ${year}). Provide solutions and rationale. Return JSON array: [{ "text": "...", "answer": "...", "explanation": "..." }]`;

//     const questions = await callGemini(prompt, { 
//         mimeType: imageFile.type, 
//         data: base64Image 
//     });

//     await prisma.scannedPaper.create({
//       data: {
//         subject,
//         year,
//         type: examType,
//         imageUrl: null, 
//         schoolId,
//         creatorId: userId,
//         questions: questions as Prisma.InputJsonValue,
//       }
//     });

//     await logActivity({
//       schoolId,
//       actorId: userId,
//       actorRole: userRole,
//       type: ActivityType.SETTINGS_UPDATED,
//       title: "Archive Node Synchronized",
//       description: `Digitized ${questions.length} nodes for ${subject} ${year}.`
//     });

//     revalidatePath("/library/archives");
//     return { success: true, count: questions.length };

//   } catch (error: unknown) {
//     console.error("[PROCESS_PAPER_ERROR]:", error);
//     return { success: false, error: getErrorMessage(error) };
//   }
// }

// export async function getScannedPapers(schoolId: string | null, userId: string) {
//     try {
//         return await prisma.scannedPaper.findMany({
//             where: {
//                 OR: [
//                     schoolId ? { schoolId } : { id: 'NEVER' },
//                     { AND: [{ schoolId: null }, { creatorId: userId }] }
//                 ]
//             },
//             orderBy: { year: 'desc' }
//         });
//     } catch (error) { return []; }
// }



"use server";

import { prisma } from "@/lib/prisma";
import { Role, ActivityType, Prisma } from "@prisma/client";
import { logActivity } from "@/app/actions/activitylog";
import { getErrorMessage } from "@/lib/error-handler";
import { revalidatePath } from "next/cache";

// ─── Type Export (Fix #1) ─────────────────────────────────────────────────────
export type ScannedPaperSet = Awaited<ReturnType<typeof getScannedPapers>>[number];

export type ExtractedQuestion = {
  text: string;
  answer: string;
  explanation: string;
};

// ─── AI Engine ────────────────────────────────────────────────────────────────


async function callGemini(
  prompt: string,
  inlineData?: { mimeType: string; data: string }
): Promise<ExtractedQuestion[]> {
  const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";

  if (!GEMINI_API_KEY) throw new Error("Gemini API key is not configured.");

  const model = "gemini-2.5-flash"; // ← confirmed available on your key

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

  // Validate MIME type
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
  if (inlineData && !allowedMimeTypes.includes(inlineData.mimeType)) {
    throw new Error(`Unsupported image type: ${inlineData.mimeType}. Please upload a JPG, PNG, or WEBP.`);
  }

  const body = {
    contents: [
      {
        parts: [
          ...(inlineData ? [{ inlineData }] : []),
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.1,
      responseMimeType: "application/json",
    },
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const reason = errorBody?.error?.message ?? res.statusText;
    console.error("[GEMINI_CRITICAL_FAILURE]:", JSON.stringify(errorBody, null, 2));
    throw new Error(`AI extraction failed: ${reason}`);
  }

  const json = await res.json();
  const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawText) throw new Error("AI returned empty logic node.");

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText.trim());
  } catch {
    throw new Error("AI returned malformed JSON. Try a clearer image.");
  }

  let questions: unknown = parsed;

  if (!Array.isArray(questions)) {
    const obj = questions as Record<string, unknown>;
    questions =
      obj.questions ??
      obj.data ??
      obj.items ??
      Object.values(obj).find((v) => Array.isArray(v)) ??
      [];
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("AI returned no questions. Try a clearer or higher-resolution image.");
  }

  const validated = (questions as unknown[]).filter(
    (q): q is ExtractedQuestion =>
      typeof q === "object" &&
      q !== null &&
      "text" in q &&
      "answer" in q &&
      "explanation" in q
  );

  if (validated.length === 0) {
    throw new Error("AI questions missing required fields (text, answer, explanation).");
  }

  return validated;
}
// ─── Server Actions ───────────────────────────────────────────────────────────

export async function processPastQuestion(params: {
  formData: FormData;
  userId: string;
  schoolId: string | null;
  userRole: Role;
  subject: string;
  year: number;
  examType: string;
}) {
  const { formData, userId, schoolId, userRole, subject, year, examType } = params;

  try {
    const imageFile = formData.get("image") as File | null;
    if (!imageFile || imageFile.size === 0)
      throw new Error("Image payload not discovered.");

    const buffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(buffer).toString("base64");

    const prompt = `
      Act as a Senior Academic Examiner for Nigerian secondary school exams.
      Extract ALL questions visible in this ${subject} past question paper (${examType}, Year ${year}).
      For each question, provide the correct answer and a clear explanation of the reasoning.
      
      Return a JSON array ONLY — no wrapper object, no extra keys, no markdown.
      Schema: [{ "text": "full question text", "answer": "correct answer", "explanation": "step-by-step rationale" }]
    `;

    const questions = await callGemini(
      prompt,
      { mimeType: imageFile.type, data: base64Image }
    );

    await prisma.scannedPaper.create({
      data: {
        subject,
        year,
        type: examType,
        imageUrl: null,
        schoolId,
        creatorId: userId,
        questions: questions as Prisma.InputJsonValue,
      },
    });

    await logActivity({
      schoolId,
      actorId: userId,
      actorRole: userRole,
      type: ActivityType.SETTINGS_UPDATED,
      title: "Archive Node Synchronized",
      description: `Digitized ${questions.length} nodes for ${subject} ${year}.`,
    });

    revalidatePath("/pastQuestions");
    return { success: true, count: questions.length };
  } catch (error: unknown) {
    console.error("[PROCESS_PAPER_ERROR]:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}

export async function getScannedPapers(schoolId: string | null, userId: string) {
  try {
    // Fix #4 — Correct null schoolId query logic
    return await prisma.scannedPaper.findMany({
      where: schoolId
        ? {
            OR: [
              { schoolId },
              { creatorId: userId, schoolId: null },
            ],
          }
        : { creatorId: userId, schoolId: null },
      orderBy: { year: "desc" },
    });
  } catch (error) {
    console.error("[GET_SCANNED_PAPERS_ERROR]:", error);
    return [];
  }
}