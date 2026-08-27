import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models/ContactMessage";

function sanitizeString(str: unknown, maxLen = 5000): string {
  if (typeof str !== "string") return "";
  // Strip control characters and trim
  return str
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET() {
  try {
    await connectToDatabase();
    const messages = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, messages });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch messages";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    const name = sanitizeString(body.name, 100);
    const email = sanitizeString(body.email, 150);
    const subject = sanitizeString(body.subject || "General Inquiry", 150);
    const message = sanitizeString(body.message, 5000);

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Please provide valid name, email, and message." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address format." },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const newMessage = await ContactMessageModel.create({
      name,
      email,
      subject,
      message,
    });

    return NextResponse.json({
      success: true,
      message: "Inquiry successfully received and saved.",
      id: newMessage._id,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit message";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json({ success: false, error: "Valid message ID is required" }, { status: 400 });
    }

    await ContactMessageModel.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Message deleted from database." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete message";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
