import { NextResponse } from "next/server";
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

const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB limit for PDFs and High-Res Assets

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: "Invalid file type. Allowed: JPEG, PNG, WebP, AVIF, GIF, SVG, PDF" },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        { success: false, error: "File exceeds 25MB maximum upload limit" },
        { status: 400 }
      );
    }

    const isPdf = file.type === "application/pdf";

    // Convert file to array buffer and base64 string
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    // Upload to Cloudinary with appropriate resource_type
    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: "nisal_portfolio_2026",
      resource_type: isPdf ? "raw" : "image",
    });

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      format: uploadResponse.format || (isPdf ? "pdf" : "auto"),
      bytes: uploadResponse.bytes,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to upload asset";
    console.error("Upload error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
