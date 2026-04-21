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


"use server";

import { uploadToGCS, generatePaperPath } from "@/lib/academics/pastQuestionConverter";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Question {
  number: string;
  text: string;
  marks?: string | null;
  type?: string;
}

interface ExtractedData {
  subject?: string | null;
  year?: string | null;
  grade?: string | null;
  questions: Question[];
}

interface Answer {
  number: string;
  answer: string;
  keyPoints?: string[];
  markingGuide?: string;
  difficulty?: "easy" | "medium" | "hard";
}

interface ProcessResult {
  success: boolean;
  imageUrl?: string | null;
  subject?: string | null;
  year?: string | null;
  grade?: string | null;
  questions?: Question[];
  answers?: Answer[];
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractTextFromGemini(data: GeminiResponse): string {
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
}

function cleanJsonText(raw: string): string {
  return raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
}

// ─── Step 1: OCR ─────────────────────────────────────────────────────────────

async function extractQuestionsFromImage(
  base64Image: string,
  mimeType: string
): Promise<ExtractedData> {
  const prompt = `You are an expert at reading scanned exam papers. 
  Extract the subject, academic year, grade level, and all questions.
  Return a valid JSON object matching the ExtractedData interface.`;

  const response = await fetch(
    `${GEMINI_BASE}/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: base64Image,
                },
              },
              { text: prompt },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini OCR failed: ${response.statusText}`);
  }

  const data: GeminiResponse = await response.json();
  const rawText = extractTextFromGemini(data);
  const cleaned = cleanJsonText(rawText);

  try {
    return JSON.parse(cleaned) as ExtractedData;
  } catch {
    throw new Error(`Could not parse Gemini OCR JSON.`);
  }
}

// ─── Step 2: Answers ─────────────────────────────────────────────────────────

async function generateAnswers(
  extractedData: ExtractedData
): Promise<Answer[]> {
  const { subject, year, grade, questions } = extractedData;

  // FIX: These variables are now utilized in the prompt below
  const questionsText: string = questions
    .map(
      (q) =>
        `Question ${q.number}${q.marks ? ` [${q.marks} marks]` : ""} (${q.type || 'Theory'}):\n${q.text}`
    )
    .join("\n\n");

  const contextLine: string = [
    subject && `Subject: ${subject}`,
    grade && `Grade/Class: ${grade}`,
    year && `Year: ${year}`,
  ]
    .filter(Boolean)
    .join(" | ");

  const prompt = `You are an expert Nigerian teacher and examiner. 
  Based on this context: ${contextLine}, generate detailed pedagogical answers and marking guides for the following questions:
  
  ${questionsText}
  
  Return a JSON array of objects matching the Answer interface.`;

  const response = await fetch(
    `${GEMINI_BASE}/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 16384,
          responseMimeType: "application/json",
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(`Gemini answer generation failed: ${response.statusText}`);
  }

  const data: GeminiResponse = await response.json();
  const rawText = extractTextFromGemini(data);
  const cleaned = cleanJsonText(rawText);

  try {
    return JSON.parse(cleaned) as Answer[];
  } catch {
    throw new Error(`Could not parse Gemini answers JSON.`);
  }
}

// ─── Type Guard ──────────────────────────────────────────────────────────────

function isFile(value: unknown): value is File {
  return typeof value === "object" && value !== null && "arrayBuffer" in value;
}

// ─── Main Server Action ──────────────────────────────────────────────────────

export async function processPastQuestion(
  formData: FormData
): Promise<ProcessResult> {
  try {
    const imageFile = formData.get("image");

    if (!isFile(imageFile)) {
      return { success: false, error: "No image file provided." };
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(imageFile.type)) {
      return { success: false, error: "Please upload a JPEG, PNG, or WebP image." };
    }

    if (imageFile.size > 10 * 1024 * 1024) {
      return { success: false, error: "Image must be smaller than 10MB." };
    }

    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");

    let imageUrl: string | null = null;
    try {
      const filePath = generatePaperPath(imageFile.name);
      imageUrl = await uploadToGCS(buffer, filePath, imageFile.type);
    } catch (err: unknown) {
      console.warn("GCS upload failed:", err);
    }

    const extractedData = await extractQuestionsFromImage(base64Image, imageFile.type);

    if (!extractedData.questions || extractedData.questions.length === 0) {
      return { success: false, error: "No questions detected in image." };
    }

    const answers = await generateAnswers(extractedData);

    return {
      success: true,
      imageUrl,
      subject: extractedData.subject ?? null,
      year: extractedData.year ?? null,
      grade: extractedData.grade ?? null,
      questions: extractedData.questions,
      answers,
    };
  } catch (error: unknown) {
    console.error("processPastQuestion error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Internal system failure.",
    };
  }
}