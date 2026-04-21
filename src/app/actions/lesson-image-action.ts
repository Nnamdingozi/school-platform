// // // app/actions/lesson-image-actions.ts
// // "use server";

// // import { prisma } from "@/lib/prisma";
// // import { revalidatePath } from "next/cache";
// // // Ensure this path is correct for your LessonAiContent type
// // import { LessonAiContent } from "./ai-generator"; 

// // /**
// //  * Saves the permanent image URL of a generated diagram into the lesson's aiContent in the database.
// //  *
// //  * @param lessonId - The ID of the lesson to update.
// //  * @param visualAidIndex - The array index of the visual aid within the aiContent.visualAids array.
// //  * @param imageUrl - The permanent URL of the generated image (e.g., from Vercel Blob).
// //  * @returns An object with success status, or an error.
// //  */
// // export async function saveGeneratedImageUrlToLesson(
// //   lessonId: string,
// //   visualAidIndex: number,
// //   imageUrl: string
// // ) {
// //   try {
// //     // 1. Fetch the current lesson, including its aiContent (JSONB field)
// //     const lesson = await prisma.lesson.findUnique({
// //       where: { id: lessonId },
// //       select: { id: true, aiContent: true, topicId: true } // Select necessary fields
// //     });

// //     if (!lesson || !lesson.aiContent) {
// //       throw new Error("Lesson or AI content not found for update.");
// //     }

// //     // 2. Cast the JSONB content to your LessonAiContent type for safe manipulation
// //     const currentAiContent = lesson.aiContent as unknown as LessonAiContent;

// //     // 3. Update the specific visual aid's URL property
// //     if (currentAiContent.visualAids && currentAiContent.visualAids[visualAidIndex]) {
// //       currentAiContent.visualAids[visualAidIndex].url = imageUrl;

// //       // 4. Save the updated aiContent (JSONB) back to the database
// //       await prisma.lesson.update({
// //         where: { id: lessonId },
// //         data: {
// //           aiContent: currentAiContent as any, // Prisma expects 'JsonValue' for JSONB fields
// //         },
// //       });

// //       console.log(`Saved image URL for lesson ${lessonId}, visual aid ${visualAidIndex}`); // For debugging

// //       // 5. Revalidate relevant paths to ensure the UI refreshes and shows the new image
// //       revalidatePath(`/dashboard/lessons/${lesson.topicId}`); 
// //       // If your lesson detail page uses /lessons/[lessonId], also revalidate that:
// //       revalidatePath(`/dashboard/lessons/${lessonId}`); 

// //       return { success: true };
// //     } else {
// //       throw new Error(`Visual aid at index ${visualAidIndex} not found in lesson ${lessonId}.`);
// //     }
// //   } catch (error) {
// //     console.error(":: Error saving generated image URL to lesson ::", error);
// //     return { success: false, error: "Failed to save image URL to lesson." };
// //   }
// // }


// 'use server';

// import { prisma } from "@/lib/prisma";
// import { revalidatePath } from "next/cache";
// import { LessonAiContent } from "./ai-generator"; 
// // ✅ Import Prisma to access Json types
// import { Prisma } from "@prisma/client";
// // ✅ Import your error handler
// import { getErrorMessage } from "@/lib/error-handler";

// /**
//  * Saves the permanent image URL of a generated diagram into the lesson's aiContent.
//  */
// export async function saveGeneratedImageUrlToLesson(
//   lessonId: string,
//   visualAidIndex: number,
//   imageUrl: string
// ) {
//   try {
//     const lesson = await prisma.lesson.findUnique({
//       where: { id: lessonId },
//       select: { id: true, aiContent: true, topicId: true } 
//     });

//     if (!lesson || !lesson.aiContent) {
//       throw new Error("Lesson or AI content not found for update.");
//     }

//     // 2. Cast JSONB to LessonAiContent
//     const currentAiContent = lesson.aiContent as unknown as LessonAiContent;

//     // 3. Update the specific visual aid's URL property
//     if (currentAiContent.visualAids && currentAiContent.visualAids[visualAidIndex]) {
//       currentAiContent.visualAids[visualAidIndex].url = imageUrl;

//       // 4. Save back to DB
//       await prisma.lesson.update({
//         where: { id: lessonId },
//         data: {
//           // ✅ FIX: Use Prisma.InputJsonValue instead of any
//           aiContent: currentAiContent as unknown as Prisma.InputJsonValue,
//         },
//       });

//       console.log(`Saved image URL for lesson ${lessonId}`);

//       // 5. Revalidate paths
//       revalidatePath(`/teacher/lessons/${lesson.topicId}`); 
//       revalidatePath(`/student/lessons/${lessonId}`); 

//       return { success: true };
//     } else {
//       throw new Error(`Visual aid at index ${visualAidIndex} not found.`);
//     }
//   } catch (error: unknown) { // ✅ FIX: Use unknown instead of any
//     const message = getErrorMessage(error);
//     console.error(":: Error saving generated image URL ::", message);
//     return { success: false, error: message };
//   }
// }



'use server';

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { LessonAiContent } from "./ai-generator"; 
import { Prisma } from "@prisma/client";
import { getErrorMessage } from "@/lib/error-handler";

/**
 * Saves the permanent image URL of a generated diagram into the lesson's aiContent.
 * Updated to handle the nested studentContent.visualAids structure.
 */
export async function saveGeneratedImageUrlToLesson(
  lessonId: string,
  visualAidIndex: number,
  imageUrl: string
) {
  try {
    // 1. Fetch the lesson data
    const lesson = await prisma.globalLesson.findUnique({
      where: { id: lessonId },
      select: { id: true, aiContent: true, topicId: true } 
    });

    if (!lesson || !lesson.aiContent) {
      throw new Error("Lesson registry or AI metadata not found for update.");
    }

    // 2. Cast the JSONB field to our strict LessonAiContent interface
    const currentAiContent = lesson.aiContent as unknown as LessonAiContent;

    // 3. Navigate the NEW nested structure: studentContent -> visualAids
    const visualAids = currentAiContent.studentContent?.visualAids;

    if (visualAids && visualAids[visualAidIndex]) {
      // ✅ Apply the persistent URL to the specific index
      visualAids[visualAidIndex].url = imageUrl;

      // 4. Perform an atomic update back to the database
      await prisma.globalLesson.update({
        where: { id: lessonId },
        data: {
          aiContent: currentAiContent as unknown as Prisma.InputJsonValue,
        },
      });

      console.log(`[Asset Registry] Permanent URL saved for Lesson: ${lessonId}, Aid Index: ${visualAidIndex}`);

      // 5. Revalidate paths to ensure Teachers and Students see the image immediately
      // Note: We use topicId for the teacher and student routes
      revalidatePath(`/teacher/lessons/${lesson.topicId}`); 
      revalidatePath(`/student/lessons/${lesson.topicId}`); 

      return { success: true };
    } else {
      throw new Error(`Syllabus node (Visual Aid) at index ${visualAidIndex} was not discovered in this content version.`);
    }
  } catch (error: unknown) {
    const message = getErrorMessage(error);
    console.error(":: image-persistence-failure ::", message);
    return { success: false, error: message };
  }
}