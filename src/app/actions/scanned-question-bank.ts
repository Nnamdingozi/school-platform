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





// ─── Download Action ──────────────────────────────────────────────────────────

export async function getScannedPaperById(id: string, userId: string, schoolId: string | null) {
  try {
    const paper = await prisma.scannedPaper.findFirst({
      where: {
        id,
        OR: schoolId
          ? [{ schoolId }, { creatorId: userId, schoolId: null }]
          : [{ creatorId: userId, schoolId: null }],
      },
    });

    if (!paper) throw new Error("Paper not found or access denied.");
    return { success: true, paper };
  } catch (error: unknown) {
    return { success: false, error: getErrorMessage(error) };
  }
}


// ─── Delete Action ────────────────────────────────────────────────────────────

export async function deleteScannedPaper(
  id: string,
  userId: string,
  schoolId: string | null,
  userRole: Role
) {
  try {
    // Verify ownership before deleting
    const paper = await prisma.scannedPaper.findFirst({
      where: {
        id,
        OR: schoolId
          ? [{ schoolId }, { creatorId: userId, schoolId: null }]
          : [{ creatorId: userId, schoolId: null }],
      },
    });

    if (!paper) throw new Error("Paper not found or access denied.");

    await prisma.scannedPaper.delete({ where: { id } });

    await logActivity({
      schoolId,
      actorId: userId,
      actorRole: userRole,
      type: ActivityType.SETTINGS_UPDATED,
      title: "Archive Node Deleted",
      description: `Removed ${paper.subject} ${paper.year} from the registry.`,
    });

    revalidatePath("/pastQuestions");
    return { success: true };
  } catch (error: unknown) {
    console.error("[DELETE_SCANNED_PAPER_ERROR]:", error);
    return { success: false, error: getErrorMessage(error) };
  }
}