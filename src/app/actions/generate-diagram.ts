// app/actions/generate-diagram.ts
// "use server";

// import OpenAI from "openai";
// import { customAlphabet } from 'nanoid';
// import { supabase } from "@/lib/supabase/supabaseClient"; // <--- Import your Supabase client

// // Initialize OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// // Generate a URL-friendly unique ID for filenames
// const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

// /**
//  * Generates an educational diagram using DALL-E 3 and stores it on Supabase Storage.
//  *
//  * @param prompt - The detailed prompt for DALL-E to generate the image.
//  * @returns An object with success status and the permanent Supabase Storage URL, or an error.
//  */
// export async function generateDiagramImage(prompt: string) {
//   if (!prompt) {
//     return { success: false, error: "No prompt provided for diagram generation." };
//   }

//   try {
//     // 1. DALL-E 3 Call: Generate the image
//     const dallePrompt = `
//       Educational textbook illustration style. Clear, clean lines, flat colors, high contrast.
//       Pure white background (#FFFFFF). Accurate scientific, mathematical, or subject-specific details.
//       Avoid photorealism or 3D rendering unless explicitly requested in prompt.
//       Topic: ${prompt}
//     `;

//     console.log("Sending prompt to DALL-E:", dallePrompt);
//     const dalleResponse = await openai.images.generate({
//       model: "dall-e-3",
//       prompt: dallePrompt,
//       n: 1,
//       size: "1024x1024",
//       quality: "standard",
//       style: "natural",
//       response_format: "url", // DALL-E returns a temporary URL
//     });
//     if (!dalleResponse.data || dalleResponse.data.length === 0) {
//       throw new Error("DALL-E did not return any image data.");
//     }

//     const temporaryImageUrl = dalleResponse.data[0].url;

//     if (!temporaryImageUrl) {
//       throw new Error("DALL-E did not return an image URL.");
//     }

//     console.log("Temporary DALL-E URL received:", temporaryImageUrl);

//     // 2. Download the temporary image from DALL-E's URL
//     const imageFetchResponse = await fetch(temporaryImageUrl);
//     if (!imageFetchResponse.ok) {
//       throw new Error(`Failed to download image from DALL-E: ${imageFetchResponse.statusText}`);
//     }
//     const imageBuffer = await imageFetchResponse.arrayBuffer(); // Get as ArrayBuffer for Supabase

//     // 3. Upload the image to Supabase Storage
//     const bucketName = 'lesson-diagrams'; // <--- IMPORTANT: Match your bucket name!
//     const filename = `diagrams/${nanoid()}-${Date.now()}.png`; // e.g., diagrams/ab12c3d4e5-1678888888.png

//     console.log("Uploading to Supabase Storage:", bucketName, filename);
//     const { data: uploadData, error: uploadError } = await supabase.storage
//       .from(bucketName)
//       .upload(filename, imageBuffer, {
//         contentType: 'image/png', // DALL-E generates PNGs
//         upsert: false, // Do not overwrite if file exists (shouldn't with unique names)
//       });

//     if (uploadError) {
//       throw new Error(`Supabase upload failed: ${uploadError.message}`);
//     }
    
//     // 4. Construct the permanent public URL
//     // Supabase public URL structure: [SUPABASE_URL]/storage/v1/object/public/[BUCKET_NAME]/[FILENAME]
//     const permanentImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uploadData.path}`;

//     console.log("Permanent Supabase Storage URL:", permanentImageUrl);

//     // 5. Return the permanent Supabase Storage URL
//     return { success: true, url: permanentImageUrl };

//   } catch (error) {
//     console.error(":: Error generating or storing diagram image ::", error);
//     // Be careful not to expose too much internal error detail to the client
//     return { success: false, error: "Failed to generate diagram. Please check server logs." };
//   }
// }

"use server";

import OpenAI from "openai";
import { customAlphabet } from 'nanoid';
import { supabase } from "@/lib/supabase/supabaseClient";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { logActivity } from "@/app/actions/activitylog";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a URL-friendly unique ID for filenames
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

interface GenerateDiagramParams {
  prompt: string;
  schoolId: string | null;
  userId: string;
  userRole: Role;
}

/**
 * GENERATE OR RETRIEVE DIAGRAM
 * Rule 8: AI content (Images) should be stored once and reused globally if possible.
 */
export async function generateDiagramImage({ 
  prompt, 
  schoolId, 
  userId, 
  userRole 
}: GenerateDiagramParams) {
  
  // Rule 10: Backend authorization check
  if (userRole === Role.STUDENT || userRole === Role.PARENT) {
    return { success: false, error: "Unauthorized: Only educators can synthesize visuals." };
  }

  if (!prompt) {
    return { success: false, error: "No prompt provided for diagram generation." };
  }

  try {
    /* ─────────────────────────────────────────────────────────────
       1. DUPLICATE PREVENTION (Rule 4 & 8)
       Search the global lesson bank for this exact prompt to avoid 
       duplicate AI costs.
       ───────────────────────────────────────────────────────────── */
    const existingAsset = await prisma.globalLesson.findFirst({
        where: {
            aiContent: {
                path: ['studentContent', 'visualAids'],
                array_contains: { imagePrompt: prompt }
            }
        },
        select: { aiContent: true }
    });

    // Type-safe navigation of the JSON content
    if (existingAsset?.aiContent) {
        const content = existingAsset.aiContent as any; // Temporary cast for deep JSON navigation
        const aids = content?.studentContent?.visualAids;
        
        if (Array.isArray(aids)) {
            const match = aids.find((v: { imagePrompt: string, url: string }) => v.imagePrompt === prompt);
            if (match?.url) {
                console.log("♻️ Reusing existing Global Asset for prompt:", prompt);
                return { success: true, url: match.url, cached: true };
            }
        }
    }

    /* ─────────────────────────────────────────────────────────────
       2. AI GENERATION (Rule 8)
       ───────────────────────────────────────────────────────────── */
    const dallePrompt = `
      Educational textbook illustration style. Clear, clean lines, flat colors, high contrast.
      Pure white background (#FFFFFF). Accurate subject-specific details.
      Topic: ${prompt}
    `;

    console.log("Sending prompt to DALL-E:", dallePrompt);
    const dalleResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: dallePrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      style: "natural",
      response_format: "url", 
    });

    // ✅ FIXED: TypeScript Guard for dalleResponse.data (Resolves Error 18048)
    if (!dalleResponse.data || dalleResponse.data.length === 0 || !dalleResponse.data[0].url) {
        throw new Error("DALL-E failed to return valid image data.");
    }

    const temporaryImageUrl = dalleResponse.data[0].url;

    /* ─────────────────────────────────────────────────────────────
       3. STORAGE (Supabase)
       ───────────────────────────────────────────────────────────── */
    // Download the temporary image
    const imageFetchResponse = await fetch(temporaryImageUrl);
    if (!imageFetchResponse.ok) {
      throw new Error(`Failed to download image from DALL-E: ${imageFetchResponse.statusText}`);
    }
    const imageBuffer = await imageFetchResponse.arrayBuffer();

    const bucketName = 'lesson-diagrams';
    // Rule 11: System pathing isolation
    const scopePrefix = schoolId ? `schools/${schoolId}` : 'global';
    const filename = `${scopePrefix}/${nanoid()}-${Date.now()}.png`;

    console.log("Uploading to Supabase Storage:", bucketName, filename);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filename, imageBuffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }
    
    // Construct the permanent public URL
    const permanentImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uploadData.path}`;

    /* ─────────────────────────────────────────────────────────────
       4. ACTIVITY LOGGING
       ───────────────────────────────────────────────────────────── */
    await logActivity({
        schoolId,
        actorId: userId,
        actorRole: userRole,
        type: "SETTINGS_UPDATED",
        title: "AI Visual Generated",
        description: `Generated educational diagram for prompt: ${prompt.substring(0, 50)}...`
    });

    return { success: true, url: permanentImageUrl, cached: false };

  } catch (error: unknown) {
    console.error(":: Error generating or storing diagram image ::", error);
    return { success: false, error: "Failed to generate diagram. Please check server logs." };
  }
}