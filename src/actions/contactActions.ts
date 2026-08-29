"use server";

import { connectToDatabase } from "@/lib/mongodb";
import { ContactMessageModel } from "@/models/ContactMessage";

function sanitizeString(str: unknown, maxLen = 5000): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export interface ContactActionResult {
  success: boolean;
  message?: string;
  error?: string;
  id?: string;
  messages?: ContactMessageItem[];
}

export async function sendContactMessageAction(payload: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}): Promise<ContactActionResult> {
  try {
    if (!payload || typeof payload !== "object") {
      return { success: false, error: "Invalid payload provided" };
    }

    const name = sanitizeString(payload.name, 100);
    const email = sanitizeString(payload.email, 150);
    const subject = sanitizeString(payload.subject || "General Inquiry", 150);
    const message = sanitizeString(payload.message, 5000);

    if (!name || !email || !message) {
      return { success: false, error: "Please provide valid name, email, and message." };
    }

    if (!EMAIL_REGEX.test(email)) {
      return { success: false, error: "Please provide a valid email address format." };
    }

    await connectToDatabase();

    const created = await ContactMessageModel.create({
      name,
      email,
      subject,
      message,
    });

    return {
      success: true,
      message: "Inquiry successfully received and saved.",
      id: created._id.toString(),
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit message";
    console.error("sendContactMessageAction error:", error);
    return { success: false, error: message };
  }
}

export async function getContactMessagesAction(): Promise<ContactActionResult> {
  try {
    await connectToDatabase();
    const docs = await ContactMessageModel.find().sort({ createdAt: -1 }).lean();
    const messages: ContactMessageItem[] = (docs || []).map((m) => ({
      _id: m._id.toString(),
      name: m.name,
      email: m.email,
      subject: m.subject,
      message: m.message,
      createdAt: m.createdAt ? new Date(m.createdAt).toISOString() : new Date().toISOString(),
      isRead: m.isRead,
    }));
    return { success: true, messages };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch inquiries";
    return { success: false, error: message };
  }
}

export async function deleteContactMessageAction(id: string): Promise<ContactActionResult> {
  try {
    if (!id || typeof id !== "string" || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return { success: false, error: "Valid message ID is required" };
    }

    await connectToDatabase();
    await ContactMessageModel.findByIdAndDelete(id);
    return { success: true, message: "Message deleted from database." };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete message";
    return { success: false, error: message };
  }
}
