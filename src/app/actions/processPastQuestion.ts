// "use server";

// import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";

// // ─── Types ───────────────────────────────────────────────────────────────────

// type Question = {
//   number: string;
//   text: string;
//   marks?: string | null;
//   type?: string;
// };

// type ExtractedData = {
//   subject?: string | null;
//   year?: string | null;
//   grade?: string | null;
//   questions: Question[];
// };

// type Answer = {
//   number: string;
//   answer: string;
//   keyPoints?: string[];
//   markingGuide?: string;
//   difficulty?: "easy" | "medium" | "hard";
// };

// type ProcessResult = {
//   success: boolean;
//   imageUrl?: string | null;
//   subject?: string | null;
//   year?: string | null;
//   grade?: string | null;
//   questions?: Question[];
//   answers?: Answer[];
//   error?: string;
// };

// // Gemini response (loose typing but safe access)
// type GeminiResponse = {
//   candidates?: {
//     content?: {
//       parts?: { text?: string }[];
//     };
//   }[];
// };

// // ─── Constants ───────────────────────────────────────────────────────────────

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
// const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// function extractTextFromGemini(data: GeminiResponse): string {
//   return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
// }

// function cleanJsonText(raw: string): string {
//   return raw
//     .replace(/```json\s*/gi, "")
//     .replace(/```\s*/g, "")
//     .trim();
// }

// // ─── Step 1: OCR ─────────────────────────────────────────────────────────────

// async function extractQuestionsFromImage(
//   base64Image: string,
//   mimeType: string
// ): Promise<ExtractedData> {
//   const prompt = `You are an expert at reading scanned exam papers...`;

//   const response = await fetch(
//     `${GEMINI_BASE}/gemini-2.5-flash-preview-05-20:generateContent?key=${GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 inlineData: {
//                   mimeType,
//                   data: base64Image,
//                 },
//               },
//               { text: prompt },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.1,
//           maxOutputTokens: 8192,
//         },
//       }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Gemini OCR failed: ${await response.text()}`);
//   }

//   const data: GeminiResponse = await response.json();
//   const rawText = extractTextFromGemini(data);
//   const cleaned = cleanJsonText(rawText);

//   try {
//     return JSON.parse(cleaned) as ExtractedData;
//   } catch {
//     throw new Error(
//       `Could not parse Gemini OCR JSON. Raw: ${rawText.slice(0, 300)}`
//     );
//   }
// }

// // ─── Step 2: Answers ─────────────────────────────────────────────────────────

// async function generateAnswers(
//   extractedData: ExtractedData
// ): Promise<Answer[]> {
//   const { subject, year, grade, questions } = extractedData;

//   const questionsText = questions
//     .map(
//       (q) =>
//         `Question ${q.number}${q.marks ? ` [${q.marks} marks]` : ""} (${q.type}):\n${q.text}`
//     )
//     .join("\n\n");

//   const contextLine = [
//     subject && `Subject: ${subject}`,
//     grade && `Grade/Class: ${grade}`,
//     year && `Year: ${year}`,
//   ]
//     .filter(Boolean)
//     .join(" | ");

//   const prompt = `You are an expert teacher...`;

//   const response = await fetch(
//     `${GEMINI_BASE}/gemini-2.5-pro-preview-06-05:generateContent?key=${GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//         generationConfig: {
//           temperature: 0.3,
//           maxOutputTokens: 16384,
//         },
//       }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Gemini answer generation failed: ${await response.text()}`);
//   }

//   const data: GeminiResponse = await response.json();
//   const rawText = extractTextFromGemini(data);
//   const cleaned = cleanJsonText(rawText);

//   try {
//     return JSON.parse(cleaned) as Answer[];
//   } catch {
//     throw new Error(
//       `Could not parse Gemini answers JSON. Raw: ${rawText.slice(0, 300)}`
//     );
//   }
// }

// // ─── Type Guard ──────────────────────────────────────────────────────────────

// function isFile(value: unknown): value is File {
//   return typeof value === "object" && value !== null && "arrayBuffer" in value;
// }

// // ─── Main Server Action ──────────────────────────────────────────────────────

// export async function processPastQuestion(
//   formData: FormData
// ): Promise<ProcessResult> {
//   try {
//     const imageFile = formData.get("image");

//     if (!isFile(imageFile)) {
//       return { success: false, error: "No image file provided." };
//     }

//     const allowedTypes = [
//       "image/jpeg",
//       "image/png",
//       "image/webp",
//       "image/gif",
//     ];

//     if (!allowedTypes.includes(imageFile.type)) {
//       return {
//         success: false,
//         error: "Please upload a JPEG, PNG, or WebP image.",
//       };
//     }

//     if (imageFile.size > 10 * 1024 * 1024) {
//       return {
//         success: false,
//         error: "Image must be smaller than 10MB.",
//       };
//     }

//     // Convert to buffer
//     const arrayBuffer = await imageFile.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64Image = buffer.toString("base64");

//     // ── Upload ───────────────────────────────────────────────────────────────
//     let imageUrl: string | null = null;

//     try {
//       const filePath = generatePaperPath(imageFile.name);
//       imageUrl = await uploadToGCS(buffer, filePath, imageFile.type);
//     } catch (err: unknown) {
//       console.warn("GCS upload failed:", err);
//     }

//     // ── OCR ──────────────────────────────────────────────────────────────────
//     const extractedData = await extractQuestionsFromImage(
//       base64Image,
//       imageFile.type
//     );

//     if (!extractedData.questions?.length) {
//       return {
//         success: false,
//         error: "No questions detected. Ensure image is clear.",
//       };
//     }

//     // ── Answers ──────────────────────────────────────────────────────────────
//     const answers = await generateAnswers(extractedData);

//     return {
//       success: true,
//       imageUrl,
//       subject: extractedData.subject ?? null,
//       year: extractedData.year ?? null,
//       grade: extractedData.grade ?? null,
//       questions: extractedData.questions,
//       answers,
//     };
//   } catch (error: unknown) {
//     console.error("processPastQuestion error:", error);

//     return {
//       success: false,
//       error:
//         error instanceof Error
//           ? error.message
//           : "An unexpected error occurred.",
//     };
//   }
// }


// "use server";

// import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface Question {
//   number: string;
//   text: string;
//   marks?: string | null;
//   type?: string;
// }

// interface ExtractedData {
//   subject?: string | null;
//   year?: string | null;
//   grade?: string | null;
//   questions: Question[];
// }

// interface Answer {
//   number: string;
//   answer: string;
//   keyPoints?: string[];
//   markingGuide?: string;
//   difficulty?: "easy" | "medium" | "hard";
// }

// interface ProcessResult {
//   success: boolean;
//   imageUrl?: string | null;
//   subject?: string | null;
//   year?: string | null;
//   grade?: string | null;
//   questions?: Question[];
//   answers?: Answer[];
//   error?: string;
// }

// interface GeminiResponse {
//   candidates?: {
//     content?: {
//       parts?: { text?: string }[];
//     };
//   }[];
// }

// // ─── Constants ───────────────────────────────────────────────────────────────

// const GEMINI_API_KEY: string = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
// const GEMINI_BASE: string = "https://generativelanguage.googleapis.com/v1beta/models";

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// function extractTextFromGemini(data: GeminiResponse): string {
//   return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
// }

// function cleanJsonText(raw: string): string {
//   return raw
//     .replace(/```json\s*/gi, "")
//     .replace(/```\s*/g, "")
//     .trim();
// }

// // ─── Step 1: OCR ─────────────────────────────────────────────────────────────

// async function extractQuestionsFromImage(
//   base64Image: string,
//   mimeType: string
// ): Promise<ExtractedData> {
//   const prompt = `You are an expert at reading scanned exam papers. 
//   Extract the subject, academic year, grade level, and all questions.
//   Return a valid JSON object matching the ExtractedData interface.`;

//   const response = await fetch(
//     `${GEMINI_BASE}/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [
//           {
//             parts: [
//               {
//                 inlineData: {
//                   mimeType,
//                   data: base64Image,
//                 },
//               },
//               { text: prompt },
//             ],
//           },
//         ],
//         generationConfig: {
//           temperature: 0.1,
//           maxOutputTokens: 8192,
//           responseMimeType: "application/json",
//         },
//       }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Gemini OCR failed: ${response.statusText}`);
//   }

//   const data: GeminiResponse = await response.json();
//   const rawText = extractTextFromGemini(data);
//   const cleaned = cleanJsonText(rawText);

//   try {
//     return JSON.parse(cleaned) as ExtractedData;
//   } catch {
//     throw new Error(`Could not parse Gemini OCR JSON.`);
//   }
// }

// // ─── Step 2: Answers ─────────────────────────────────────────────────────────

// async function generateAnswers(
//   extractedData: ExtractedData
// ): Promise<Answer[]> {
//   const { subject, year, grade, questions } = extractedData;

//   // FIX: These variables are now utilized in the prompt below
//   const questionsText: string = questions
//     .map(
//       (q) =>
//         `Question ${q.number}${q.marks ? ` [${q.marks} marks]` : ""} (${q.type || 'Theory'}):\n${q.text}`
//     )
//     .join("\n\n");

//   const contextLine: string = [
//     subject && `Subject: ${subject}`,
//     grade && `Grade/Class: ${grade}`,
//     year && `Year: ${year}`,
//   ]
//     .filter(Boolean)
//     .join(" | ");

//   const prompt = `You are an expert Nigerian teacher and examiner. 
//   Based on this context: ${contextLine}, generate detailed pedagogical answers and marking guides for the following questions:
  
//   ${questionsText}
  
//   Return a JSON array of objects matching the Answer interface.`;

//   const response = await fetch(
//     `${GEMINI_BASE}/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         contents: [{ parts: [{ text: prompt }] }],
//         generationConfig: {
//           temperature: 0.3,
//           maxOutputTokens: 16384,
//           responseMimeType: "application/json",
//         },
//       }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Gemini answer generation failed: ${response.statusText}`);
//   }

//   const data: GeminiResponse = await response.json();
//   const rawText = extractTextFromGemini(data);
//   const cleaned = cleanJsonText(rawText);

//   try {
//     return JSON.parse(cleaned) as Answer[];
//   } catch {
//     throw new Error(`Could not parse Gemini answers JSON.`);
//   }
// }

// // ─── Type Guard ──────────────────────────────────────────────────────────────

// function isFile(value: unknown): value is File {
//   return typeof value === "object" && value !== null && "arrayBuffer" in value;
// }

// // ─── Main Server Action ──────────────────────────────────────────────────────

// export async function processPastQuestion(
//   formData: FormData
// ): Promise<ProcessResult> {
//   try {
//     const imageFile = formData.get("image");

//     if (!isFile(imageFile)) {
//       return { success: false, error: "No image file provided." };
//     }

//     const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
//     if (!allowedTypes.includes(imageFile.type)) {
//       return { success: false, error: "Please upload a JPEG, PNG, or WebP image." };
//     }

//     if (imageFile.size > 10 * 1024 * 1024) {
//       return { success: false, error: "Image must be smaller than 10MB." };
//     }

//     const arrayBuffer = await imageFile.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64Image = buffer.toString("base64");

//     let imageUrl: string | null = null;
//     try {
//       const filePath = generatePaperPath(imageFile.name);
//       imageUrl = await uploadToGCS(buffer, filePath, imageFile.type);
//     } catch (err: unknown) {
//       console.warn("GCS upload failed:", err);
//     }

//     const extractedData = await extractQuestionsFromImage(base64Image, imageFile.type);

//     if (!extractedData.questions || extractedData.questions.length === 0) {
//       return { success: false, error: "No questions detected in image." };
//     }

//     const answers = await generateAnswers(extractedData);

//     return {
//       success: true,
//       imageUrl,
//       subject: extractedData.subject ?? null,
//       year: extractedData.year ?? null,
//       grade: extractedData.grade ?? null,
//       questions: extractedData.questions,
//       answers,
//     };
//   } catch (error: unknown) {
//     console.error("processPastQuestion error:", error);
//     return {
//       success: false,
//       error: error instanceof Error ? error.message : "Internal system failure.",
//     };
//   }
// }


// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, QuestionType, QuestionCategory, Prisma } from "@prisma/client";
// import { logActivity } from "@/lib/activitylogger";
// import { getErrorMessage } from "@/lib/error-handler";
// import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface QuestionPart {
//   number: string;
//   text: string;
//   marks?: string | null;
//   type?: string;
// }

// interface ExtractedData {
//   subject?: string | null;
//   year?: string | null;
//   grade?: string | null;
//   questions: QuestionPart[];
// }

// interface AnswerPart {
//   number: string;
//   answer: string;
//   explanation?: string;
//   difficulty?: "easy" | "medium" | "hard";
// }

// interface ProcessResult {
//   success: boolean;
//   imageUrl?: string | null;
//   count?: number;
//   error?: string;
// }

// interface GeminiResponse {
//   candidates?: {
//     content?: {
//       parts?: { text?: string }[];
//     };
//   }[];
// }

// // ─── Constants ───────────────────────────────────────────────────────────────

// const GEMINI_API_KEY: string = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
// const GEMINI_BASE: string = "https://generativelanguage.googleapis.com/v1beta/models";

// // ─── AI Processing Helpers ───────────────────────────────────────────────────

// function cleanJsonText(raw: string): string {
//   return raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
// }

// async function callGemini(prompt: string, inlineData?: { mimeType: string, data: string }) {
//   const model = inlineData ? "gemini-1.5-flash" : "gemini-1.5-pro";
//   const body = {
//     contents: [{
//       parts: [
//         ...(inlineData ? [{ inlineData }] : []),
//         { text: prompt }
//       ]
//     }],
//     generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
//   };

//   const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) throw new Error(`Gemini API Error: ${res.statusText}`);
//   const json: GeminiResponse = await res.json();
//   return JSON.parse(cleanJsonText(json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}"));
// }

// // ─── Main Server Action ──────────────────────────────────────────────────────

// /**
//  * Rule 5: Processes a scanned exam paper and persists it to the school's private bank.
//  * Rule 10: Enforces role-based access.
//  */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string;
//   userRole: Role;
//   topicId: string; // The questions must be attached to a specific curriculum node
// }): Promise<ProcessResult> {
//   const { formData, userId, schoolId, userRole, topicId } = params;

//   // 1. Security Gate (Rule 10)
//   if (userRole === Role.STUDENT || userRole === Role.PARENT) {
//     return { success: false, error: "Unauthorized: Students cannot digitize exam papers." };
//   }

//   try {
//     const imageFile = formData.get("image");
//     if (!(imageFile instanceof File)) return { success: false, error: "No image provided." };

//     // 2. Buffer conversion for AI and Storage
//     const arrayBuffer = await imageFile.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64Image = buffer.toString("base64");

//     // 3. Google Cloud Storage Implementation (Isolated by School)
//     // Rule 5: Store in a path specific to the school
//     let imageUrl: string | null = null;
//     try {
//       const fileName = `${schoolId}/past-papers/${Date.now()}-${imageFile.name}`;
//       imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);
//     } catch (gcsErr) {
//       console.warn("Storage upload failed, continuing with OCR...", gcsErr);
//     }

//     // 4. AI Step 1: Extract Questions
//     const extracted = await callGemini(
//       "Extract exam questions. Return JSON: {subject, year, grade, questions: [{number, text, marks}]}",
//       { mimeType: imageFile.type, data: base64Image }
//     ) as ExtractedData;

//     if (!extracted.questions?.length) throw new Error("No questions found on page.");

//     // 5. AI Step 2: Generate Answers & Explanations
//     const answered = await callGemini(
//       `Solve these questions for ${extracted.subject}. Return JSON array: [{number, answer, explanation, difficulty}]`
//     ) as AnswerPart[];

//     // 6. Rule 8 & 11: Persist to Database within School Layer
//     const createdCount = await prisma.$transaction(async (tx) => {
//       const questionsToCreate = extracted.questions.map((q) => {
//         const sol = answered.find(a => a.number === q.number);
//         return {
//           topicId,
//           schoolId, // Rule 5: Private to school
//           isGlobal: false,
//           text: q.text,
//           options: [] as any, // Theory questions use empty options
//           correctAnswer: sol?.answer ?? "See explanation",
//           explanation: sol?.explanation ?? "No explanation provided.",
//           type: QuestionType.ESSAY,
//           category: QuestionCategory.EXAM,
//           points: parseInt(q.marks || "1") || 1,
//         };
//       });

//       const batch = await tx.question.createMany({
//         data: questionsToCreate
//       });

//       // Log the digital transformation activity
//       await logActivity({
//         schoolId,
//         actorId: userId,
//         actorRole: userRole,
//         type: "SETTINGS_UPDATED",
//         title: "Exam Digitized",
//         description: `Successfully converted scan into ${batch.count} digital questions for ${extracted.subject}.`
//       });

//       return batch.count;
//     });

//     return {
//       success: true,
//       imageUrl,
//       count: createdCount
//     };

//   } catch (error: unknown) {
//     console.error("OCR Digitization Error:", error);
//     return { success: false, error: getErrorMessage(error) };
//   }
// }



// "use server";

// import { prisma } from "@/lib/prisma";
// import { Role, QuestionType, QuestionCategory, Prisma } from "@prisma/client";
// import { logActivity } from "@/lib/activitylogger";
// import { getErrorMessage } from "@/lib/error-handler";
// import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";

// // ─── Types ───────────────────────────────────────────────────────────────────

// interface QuestionPart {
//   number: string;
//   text: string;
//   marks?: string | null;
//   type?: string;
// }

// interface ExtractedData {
//   subject?: string | null;
//   year?: string | null;
//   grade?: string | null;
//   questions: QuestionPart[];
// }

// interface AnswerPart {
//   number: string;
//   answer: string;
//   explanation?: string;
//   difficulty?: "easy" | "medium" | "hard";
// }

// interface ProcessResult {
//   success: boolean;
//   imageUrl?: string | null;
//   count?: number;
//   error?: string;
// }

// interface GeminiResponse {
//   candidates?: {
//     content?: {
//       parts?: { text?: string }[];
//     };
//   }[];
// }

// // ─── Constants ───────────────────────────────────────────────────────────────

// const GEMINI_API_KEY: string = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
// const GEMINI_BASE: string = "https://generativelanguage.googleapis.com/v1beta/models";

// // ─── AI Processing Helpers ───────────────────────────────────────────────────

// function cleanJsonText(raw: string): string {
//   return raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
// }

// async function callGemini(prompt: string, inlineData?: { mimeType: string, data: string }) {
//   const model = inlineData ? "gemini-1.5-flash" : "gemini-1.5-pro";
//   const body = {
//     contents: [{
//       parts: [
//         ...(inlineData ? [{ inlineData }] : []),
//         { text: prompt }
//       ]
//     }],
//     generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
//   };

//   const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(body),
//   });

//   if (!res.ok) throw new Error(`Gemini API Error: ${res.statusText}`);
//   const json: GeminiResponse = await res.json();
//   return JSON.parse(cleanJsonText(json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}"));
// }

// // ─── Main Server Action ──────────────────────────────────────────────────────

// /**
//  * Rule 5: Processes a scanned exam paper and persists it to the school's private bank.
//  * Rule 10: Enforces role-based access.
//  */
// export async function processPastQuestion(params: {
//   formData: FormData;
//   userId: string;
//   schoolId: string | null; // Nullable for Independent Learners
//   userRole: Role;
//   topicId: string;
// }) {
//   const { formData, userId, schoolId, userRole, topicId } = params;

//   try {
//     const imageFile = formData.get("image");
//     if (!(imageFile instanceof File)) return { success: false, error: "No image provided." };

//     const arrayBuffer = await imageFile.arrayBuffer();
//     const buffer = Buffer.from(arrayBuffer);
//     const base64Image = buffer.toString("base64");

//     // 1. Storage Pathing Logic (Rule 11)
//     // If schoolId exists, store in school folder. Otherwise, store in user folder.
//     const storagePath = schoolId 
//         ? `schools/${schoolId}/past-papers` 
//         : `users/${userId}/personal-scans`;
    
//     const fileName = `${storagePath}/${Date.now()}-${imageFile.name}`;
//     let imageUrl: string | null = null;

//     try {
//       imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);
//     } catch (gcsErr) {
//       console.warn("Storage failed, continuing to AI...");
//     }

//     // 4. AI Step 1: Extract Questions
//     const extracted = await callGemini("Extract questions...", { mimeType: imageFile.type, data: base64Image });
//     const answered = await callGemini(`Solve questions for ${extracted.subject}...`);

//     // 3. Database Persistence (Tier 2 vs Tier 3)
//     const createdCount = await prisma.$transaction(async (tx) => {
//       const questionsToCreate = extracted.questions.map((q: any) => {
//         const sol = answered.find((a: any) => a.number === q.number);
//         return {
//           topicId,
//           schoolId: schoolId ?? null, // Null for Independent Learners
//           isGlobal: false,           // Personal scans are NEVER global by default
//           text: q.text,
//           options: [] as any,
//           correctAnswer: sol?.answer ?? "Theory response",
//           explanation: sol?.explanation ?? "Generated by AI",
//           type: QuestionType.ESSAY,
//           category: QuestionCategory.PRACTICE, // Rule 6: For personal practice
//           points: parseInt(q.marks || "1") || 1,
//         };
//       });

//       const batch = await tx.question.createMany({ data: questionsToCreate });

//       // Log the digital transformation activity
//       await logActivity({
//         schoolId: schoolId ?? null,
//         actorId: userId,
//         actorRole: userRole,
//         type: "SETTINGS_UPDATED",
//         title: "Personal Paper Digitized",
//         description: `Processed ${batch.count} questions for personal practice.`
//       });

//       return batch.count;
//     });

//     return {
//       success: true,
//       imageUrl,
//       count: createdCount
//     };

//   } catch (error: unknown) {
//     console.error("OCR Digitization Error:", error);
//     return { success: false, error: getErrorMessage(error) };
//   }
// }


"use server";

import { prisma } from "@/lib/prisma";
import { Role, QuestionType, QuestionCategory, Prisma } from "@prisma/client";
import { logActivity } from "@/lib/activitylogger";
import { getErrorMessage } from "@/lib/error-handler";
import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";

// ─── Types ───────────────────────────────────────────────────────────────────

interface QuestionPart {
  number: string;
  text: string;
  marks?: string | null;
  type?: string;
}

interface ExtractedData {
  subject?: string | null;
  year?: string | null;
  grade?: string | null;
  questions: QuestionPart[];
}

interface AnswerPart {
  number: string;
  answer: string;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface ProcessResult {
  success: boolean;
  imageUrl?: string | null;
  count?: number;
  error?: string;
}

interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[];
    };
  }[];
}

// ─── Constants ───────────────────────────────────────────────────────────────

const GEMINI_API_KEY: string = process.env.GOOGLE_GENERATIVE_AI_API_KEY || "";
const GEMINI_BASE: string = "https://generativelanguage.googleapis.com/v1beta/models";

// ─── AI Processing Helpers ───────────────────────────────────────────────────

function cleanJsonText(raw: string): string {
  return raw.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
}

async function callGemini(prompt: string, inlineData?: { mimeType: string, data: string }) {
  const model = inlineData ? "gemini-1.5-flash" : "gemini-1.5-pro";
  const body = {
    contents: [{
      parts: [
        ...(inlineData ? [{ inlineData }] : []),
        { text: prompt }
      ]
    }],
    generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
  };

  const res = await fetch(`${GEMINI_BASE}/${model}:generateContent?key=${GEMINI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(`Gemini API Error: ${res.statusText}`);
  const json: GeminiResponse = await res.json();
  return JSON.parse(cleanJsonText(json.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}"));
}

// ─── Main Server Action ──────────────────────────────────────────────────────

/**
 * Rule 5: Processes a scanned exam paper and persists it to the school's private bank.
 * Rule 10: Enforces role-based access.
 */
export async function processPastQuestion(params: {
  formData: FormData;
  userId: string;
  schoolId: string | null; // Nullable for Independent Learners
  userRole: Role;
  topicId: string;
}) {
  const { formData, userId, schoolId, userRole, topicId } = params;

  try {
    const imageFile = formData.get("image");
    if (!(imageFile instanceof File)) return { success: false, error: "No image provided." };

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    // 1. Storage Pathing Logic (Rule 11)
    // If schoolId exists, store in school folder. Otherwise, store in user folder.
    const storagePath = schoolId 
        ? `schools/${schoolId}/past-papers` 
        : `users/${userId}/personal-scans`;
    
    const fileName = `${storagePath}/${Date.now()}-${imageFile.name}`;
    let imageUrl: string | null = null;

    try {
      imageUrl = await uploadToGCS(buffer, fileName, imageFile.type);
    } catch (gcsErr) {
      console.warn("Storage failed, continuing to AI...");
    }

    // 4. AI Step 1: Extract Questions
    const extracted = await callGemini("Extract questions...", { mimeType: imageFile.type, data: base64Image });
    const answered = await callGemini(`Solve questions for ${extracted.subject}...`);

    // 3. Database Persistence (Tier 2 vs Tier 3)
    const createdCount = await prisma.$transaction(async (tx) => {
      const questionsToCreate = extracted.questions.map((q: any) => {
        const sol = answered.find((a: any) => a.number === q.number);
        return {
          topicId,
          schoolId: schoolId ?? null, // Null for Independent Learners
          isGlobal: false,           // Personal scans are NEVER global by default
          text: q.text,
          options: [] as any,
          correctAnswer: sol?.answer ?? "Theory response",
          explanation: sol?.explanation ?? "Generated by AI",
          type: QuestionType.ESSAY,
          category: QuestionCategory.PRACTICE, // Rule 6: For personal practice
          points: parseInt(q.marks || "1") || 1,
        };
      });

      const batch = await tx.question.createMany({ data: questionsToCreate });

      // Log the digital transformation activity
      await logActivity({
        schoolId: schoolId ?? null,
        actorId: userId,
        actorRole: userRole,
        type: "SETTINGS_UPDATED",
        title: "Personal Paper Digitized",
        description: `Processed ${batch.count} questions for personal practice.`
      });

      return batch.count;
    });

    return {
      success: true,
      imageUrl,
      count: createdCount
    };

  } catch (error: unknown) {
    console.error("OCR Digitization Error:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}