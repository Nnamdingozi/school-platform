/**
 * lib/gcs.ts
 * Google Cloud Storage utility for past question paper images.
 */

import { Storage } from "@google-cloud/storage";

let storageInstance: Storage | null = null;

/**
 * Singleton function to initialize or retrieve the GCS Storage instance.
 */
function getStorage(): Storage {
  if (storageInstance) return storageInstance;

  // Prefer inline key env vars (safer for Vercel / cloud deployments)
  if (process.env.GCS_CLIENT_EMAIL && process.env.GCS_PRIVATE_KEY) {
    storageInstance = new Storage({
      projectId: process.env.GCS_PROJECT_ID,
      credentials: {
        client_email: process.env.GCS_CLIENT_EMAIL,
        // The private key in env variables often has escaped newlines
        private_key: process.env.GCS_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
    });
  } else {
    // Falls back to GOOGLE_APPLICATION_CREDENTIALS file path if defined
    storageInstance = new Storage();
  }

  return storageInstance;
}

/**
 * Upload a Buffer or Uint8Array to GCS.
 * Returns the public URL of the uploaded file.
 *
 * @param fileBuffer - The file data
 * @param fileName   - e.g. "papers/2024-maths-grade10.jpg"
 * @param mimeType   - e.g. "image/jpeg"
 * @returns          - Promise resolving to the public GCS URL
 */
export async function uploadToGCS(
  fileBuffer: Buffer | Uint8Array,
  fileName: string,
  mimeType: string
): Promise<string> {
  const storage = getStorage();
  const bucketName = process.env.GCS_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("GCS_BUCKET_NAME is not set in environment variables.");
  }

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  // file.save handles the buffer upload
  await file.save(fileBuffer as Buffer, {
    metadata: { contentType: mimeType },
    resumable: false,
  });

  /**
   * Make the file publicly readable.
   * Note: This requires the "Storage Object Viewer" role to be 
   * available for "allUsers" or the bucket to have public access enabled.
   */
  await file.makePublic();

  return `https://storage.googleapis.com/${bucketName}/${fileName}`;
}

/**
 * Generate a unique file path for a paper upload.
 * @param originalName - Original filename from the upload
 * @returns A unique string path
 */
export function generatePaperPath(originalName: string): string {
  const timestamp = Date.now();
  // Remove special characters to prevent URL issues
  const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `past-papers/${timestamp}_${safeName}`;
}