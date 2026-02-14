// app/actions/lesson-image-actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// Ensure this path is correct for your LessonAiContent type
import { LessonAiContent } from "./ai-generator"; 

/**
 * Saves the permanent image URL of a generated diagram into the lesson's aiContent in the database.
 *
 * @param lessonId - The ID of the lesson to update.
 * @param visualAidIndex - The array index of the visual aid within the aiContent.visualAids array.
 * @param imageUrl - The permanent URL of the generated image (e.g., from Vercel Blob).
 * @returns An object with success status, or an error.
 */
export async function saveGeneratedImageUrlToLesson(
  lessonId: string,
  visualAidIndex: number,
  imageUrl: string
) {
  try {
    // 1. Fetch the current lesson, including its aiContent (JSONB field)
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { id: true, aiContent: true, topicId: true } // Select necessary fields
    });

    if (!lesson || !lesson.aiContent) {
      throw new Error("Lesson or AI content not found for update.");
    }

    // 2. Cast the JSONB content to your LessonAiContent type for safe manipulation
    const currentAiContent = lesson.aiContent as unknown as LessonAiContent;

    // 3. Update the specific visual aid's URL property
    if (currentAiContent.visualAids && currentAiContent.visualAids[visualAidIndex]) {
      currentAiContent.visualAids[visualAidIndex].url = imageUrl;

      // 4. Save the updated aiContent (JSONB) back to the database
      await prisma.lesson.update({
        where: { id: lessonId },
        data: {
          aiContent: currentAiContent as any, // Prisma expects 'JsonValue' for JSONB fields
        },
      });

      console.log(`Saved image URL for lesson ${lessonId}, visual aid ${visualAidIndex}`); // For debugging

      // 5. Revalidate relevant paths to ensure the UI refreshes and shows the new image
      revalidatePath(`/dashboard/lessons/${lesson.topicId}`); 
      // If your lesson detail page uses /lessons/[lessonId], also revalidate that:
      revalidatePath(`/dashboard/lessons/${lessonId}`); 

      return { success: true };
    } else {
      throw new Error(`Visual aid at index ${visualAidIndex} not found in lesson ${lessonId}.`);
    }
  } catch (error) {
    console.error(":: Error saving generated image URL to lesson ::", error);
    return { success: false, error: "Failed to save image URL to lesson." };
  }
}