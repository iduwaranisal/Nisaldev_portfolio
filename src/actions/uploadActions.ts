"use server";

import cloudinary from "@/lib/cloudinary";

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
];

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB maximum limit

export interface UploadActionResult {
  success: boolean;
  url?: string;
  publicId?: string;
  format?: string;
  bytes?: number;
  error?: string;
}

export async function uploadAssetAction(formData: FormData): Promise<UploadActionResult> {
  try {
    if (!formData) {
      return { success: false, error: "No form data provided" };
    }

    const file = formData.get("file") as File | null;
    if (!file) {
      return { success: false, error: "No file provided in upload" };
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, GIF, SVG, PDF",
      };
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return { success: false, error: "File exceeds 25MB maximum upload limit" };
    }

    const isPdf = file.type === "application/pdf";

    // Convert file to array buffer and base64 string
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: "nisal_portfolio_2026",
      resource_type: isPdf ? "raw" : "image",
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.format || (isPdf ? "pdf" : "auto"),
      bytes: uploadResponse.bytes,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload asset";
    console.error("uploadAssetAction error:", error);
    return { success: false, error: message };
  }
}
