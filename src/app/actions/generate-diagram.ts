// app/actions/generate-diagram.ts
"use server";

import OpenAI from "openai";
import { customAlphabet } from 'nanoid';
import { supabase } from "@/lib/supabase/supabaseClient"; // <--- Import your Supabase client

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Generate a URL-friendly unique ID for filenames
const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10);

/**
 * Generates an educational diagram using DALL-E 3 and stores it on Supabase Storage.
 *
 * @param prompt - The detailed prompt for DALL-E to generate the image.
 * @returns An object with success status and the permanent Supabase Storage URL, or an error.
 */
export async function generateDiagramImage(prompt: string) {
  if (!prompt) {
    return { success: false, error: "No prompt provided for diagram generation." };
  }

  try {
    // 1. DALL-E 3 Call: Generate the image
    const dallePrompt = `
      Educational textbook illustration style. Clear, clean lines, flat colors, high contrast.
      Pure white background (#FFFFFF). Accurate scientific, mathematical, or subject-specific details.
      Avoid photorealism or 3D rendering unless explicitly requested in prompt.
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
      response_format: "url", // DALL-E returns a temporary URL
    });
    if (!dalleResponse.data || dalleResponse.data.length === 0) {
      throw new Error("DALL-E did not return any image data.");
    }

    const temporaryImageUrl = dalleResponse.data[0].url;

    if (!temporaryImageUrl) {
      throw new Error("DALL-E did not return an image URL.");
    }

    console.log("Temporary DALL-E URL received:", temporaryImageUrl);

    // 2. Download the temporary image from DALL-E's URL
    const imageFetchResponse = await fetch(temporaryImageUrl);
    if (!imageFetchResponse.ok) {
      throw new Error(`Failed to download image from DALL-E: ${imageFetchResponse.statusText}`);
    }
    const imageBuffer = await imageFetchResponse.arrayBuffer(); // Get as ArrayBuffer for Supabase

    // 3. Upload the image to Supabase Storage
    const bucketName = 'lesson-diagrams'; // <--- IMPORTANT: Match your bucket name!
    const filename = `diagrams/${nanoid()}-${Date.now()}.png`; // e.g., diagrams/ab12c3d4e5-1678888888.png

    console.log("Uploading to Supabase Storage:", bucketName, filename);
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filename, imageBuffer, {
        contentType: 'image/png', // DALL-E generates PNGs
        upsert: false, // Do not overwrite if file exists (shouldn't with unique names)
      });

    if (uploadError) {
      throw new Error(`Supabase upload failed: ${uploadError.message}`);
    }
    
    // 4. Construct the permanent public URL
    // Supabase public URL structure: [SUPABASE_URL]/storage/v1/object/public/[BUCKET_NAME]/[FILENAME]
    const permanentImageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucketName}/${uploadData.path}`;

    console.log("Permanent Supabase Storage URL:", permanentImageUrl);

    // 5. Return the permanent Supabase Storage URL
    return { success: true, url: permanentImageUrl };

  } catch (error) {
    console.error(":: Error generating or storing diagram image ::", error);
    // Be careful not to expose too much internal error detail to the client
    return { success: false, error: "Failed to generate diagram. Please check server logs." };
  }
}