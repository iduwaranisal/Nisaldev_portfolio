"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { TestimonialModel } from "@/models/Testimonial";
import { Testimonial, INITIAL_PORTFOLIO_DATA } from "@/data/portfolioData";
import { verifyAdminSessionAction } from "@/actions/authActions";

function sanitizeString(str: unknown, maxLen = 5000): string {
  if (typeof str !== "string") return "";
  return str
    .replace(/[<>]/g, "")
    .trim()
    .slice(0, maxLen);
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface TestimonialActionResult {
  success: boolean;
  message?: string;
  error?: string;
  testimonial?: Testimonial;
  testimonials?: Testimonial[];
}

/**
 * Public Server Action: Client submits a new feedback/testimonial.
 * Always saved with status: "pending".
 * Requires admin approval before appearing publicly on the website.
 */
export async function submitTestimonialAction(payload: {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
  email?: string;
}): Promise<TestimonialActionResult> {
  try {
    if (!payload || typeof payload !== "object") {
      return { success: false, error: "Invalid submission data." };
    }

    const name = sanitizeString(payload.name, 100);
    const role = sanitizeString(payload.role, 100);
    const company = sanitizeString(payload.company || "", 100);
    const content = sanitizeString(payload.content, 2000);
    const avatar = sanitizeString(payload.avatar || "", 500);
    const email = sanitizeString(payload.email || "", 150);

    const parsedRating = typeof payload.rating === "number" ? Math.min(5, Math.max(1, Math.round(payload.rating))) : 5;

    if (!name) {
      return { success: false, error: "Please enter your full name." };
    }
    if (!role) {
      return { success: false, error: "Please enter your role or title (e.g. CTO, Product Manager)." };
    }
    if (!content || content.length < 15) {
      return { success: false, error: "Please provide a detailed testimonial (at least 15 characters)." };
    }
    if (email && !EMAIL_REGEX.test(email)) {
      return { success: false, error: "Please provide a valid email format or leave it empty." };
    }

    await connectToDatabase();

    const id = `testi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    await TestimonialModel.create({
      id,
      name,
      role,
      company,
      content,
      rating: parsedRating,
      avatar,
      email,
      status: "pending",
      featured: false,
    });

    return {
      success: true,
      message:
        "Thank you so much for your feedback! Your review has been successfully submitted and will appear on the site once verified by the administrator.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to submit testimonial";
    console.error("submitTestimonialAction error:", error);
    return { success: false, error: message };
  }
}

/**
 * Public query: Fetch all APPROVED testimonials for the live site.
 */
export async function getApprovedTestimonialsAction(): Promise<TestimonialActionResult> {
  try {
    await connectToDatabase();

    // Check count; if zero, seed the initial ones with approved status
    const count = await TestimonialModel.countDocuments();
    if (count === 0 && INITIAL_PORTFOLIO_DATA.testimonialsSection?.testimonials?.length) {
      await TestimonialModel.insertMany(
        INITIAL_PORTFOLIO_DATA.testimonialsSection.testimonials.map((t) => ({
          ...t,
          status: "approved",
          featured: false,
        }))
      );
    }

    const docs = await TestimonialModel.find({ status: "approved" })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    const testimonials: Testimonial[] = docs.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      rating: t.rating,
      avatar: t.avatar,
      email: t.email,
      status: t.status,
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : undefined,
    }));

    return { success: true, testimonials };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load testimonials";
    return { success: false, error: message };
  }
}

/**
 * Admin Action: Fetch all testimonials (pending, approved, rejected).
 */
export async function getAdminTestimonialsAction(): Promise<TestimonialActionResult> {
  try {
    const auth = await verifyAdminSessionAction();
    if (!auth.isValid) {
      return { success: false, error: "Unauthorized. Admin credentials required." };
    }

    await connectToDatabase();

    // Seed defaults if empty
    const count = await TestimonialModel.countDocuments();
    if (count === 0 && INITIAL_PORTFOLIO_DATA.testimonialsSection?.testimonials?.length) {
      await TestimonialModel.insertMany(
        INITIAL_PORTFOLIO_DATA.testimonialsSection.testimonials.map((t) => ({
          ...t,
          status: "approved",
          featured: false,
        }))
      );
    }

    const docs = await TestimonialModel.find().sort({ createdAt: -1 }).lean();

    const testimonials: Testimonial[] = docs.map((t) => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company,
      content: t.content,
      rating: t.rating,
      avatar: t.avatar,
      email: t.email,
      status: t.status,
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : undefined,
    }));

    return { success: true, testimonials };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch admin testimonials";
    return { success: false, error: message };
  }
}

/**
 * Admin Action: Update status (approve, reject, or mark pending).
 */
export async function updateTestimonialStatusAction(
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<TestimonialActionResult> {
  try {
    const auth = await verifyAdminSessionAction();
    if (!auth.isValid) {
      return { success: false, error: "Unauthorized access." };
    }

    if (!id || !["pending", "approved", "rejected"].includes(status)) {
      return { success: false, error: "Invalid ID or status." };
    }

    await connectToDatabase();

    const updated = await TestimonialModel.findOneAndUpdate(
      { id },
      { $set: { status } },
      { new: true }
    ).lean();

    if (!updated) {
      return { success: false, error: "Testimonial not found." };
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: `Testimonial status set to ${status}.`,
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update status";
    return { success: false, error: message };
  }
}

/**
 * Admin Action: Delete a testimonial.
 */
export async function deleteTestimonialAction(id: string): Promise<TestimonialActionResult> {
  try {
    const auth = await verifyAdminSessionAction();
    if (!auth.isValid) {
      return { success: false, error: "Unauthorized access." };
    }

    if (!id) {
      return { success: false, error: "Testimonial ID is required." };
    }

    await connectToDatabase();
    await TestimonialModel.findOneAndDelete({ id });

    revalidatePath("/");
    revalidatePath("/admin");

    return { success: true, message: "Testimonial permanently deleted." };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete testimonial";
    return { success: false, error: message };
  }
}

/**
 * Admin Action: Create a testimonial directly from Admin Panel.
 */
export async function createAdminTestimonialAction(payload: {
  name: string;
  role: string;
  company?: string;
  content: string;
  rating?: number;
  avatar?: string;
  email?: string;
  status?: "pending" | "approved" | "rejected";
}): Promise<TestimonialActionResult> {
  try {
    const auth = await verifyAdminSessionAction();
    if (!auth.isValid) {
      return { success: false, error: "Unauthorized access." };
    }

    const name = sanitizeString(payload.name, 100);
    const role = sanitizeString(payload.role, 100);
    const company = sanitizeString(payload.company || "", 100);
    const content = sanitizeString(payload.content, 2000);
    const avatar = sanitizeString(payload.avatar || "", 500);
    const email = sanitizeString(payload.email || "", 150);
    const rating = typeof payload.rating === "number" ? Math.min(5, Math.max(1, Math.round(payload.rating))) : 5;
    const status = payload.status || "approved";

    if (!name || !role || !content) {
      return { success: false, error: "Name, role, and content are required." };
    }

    await connectToDatabase();

    const id = `testi-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const created = await TestimonialModel.create({
      id,
      name,
      role,
      company,
      content,
      rating,
      avatar,
      email,
      status,
      featured: false,
    });

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Testimonial created successfully.",
      testimonial: {
        id: created.id,
        name: created.name,
        role: created.role,
        company: created.company,
        content: created.content,
        rating: created.rating,
        avatar: created.avatar,
        email: created.email,
        status: created.status,
        createdAt: created.createdAt ? new Date(created.createdAt).toISOString() : undefined,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create testimonial";
    return { success: false, error: message };
  }
}

/**
 * Admin Action: Edit an existing testimonial.
 */
export async function updateAdminTestimonialAction(
  id: string,
  payload: Partial<{
    name: string;
    role: string;
    company: string;
    content: string;
    rating: number;
    avatar: string;
    email: string;
    status: "pending" | "approved" | "rejected";
  }>
): Promise<TestimonialActionResult> {
  try {
    const auth = await verifyAdminSessionAction();
    if (!auth.isValid) {
      return { success: false, error: "Unauthorized access." };
    }

    if (!id) {
      return { success: false, error: "Testimonial ID is required." };
    }

    await connectToDatabase();

    const updateFields: Record<string, unknown> = {};
    if (payload.name !== undefined) updateFields.name = sanitizeString(payload.name, 100);
    if (payload.role !== undefined) updateFields.role = sanitizeString(payload.role, 100);
    if (payload.company !== undefined) updateFields.company = sanitizeString(payload.company, 100);
    if (payload.content !== undefined) updateFields.content = sanitizeString(payload.content, 2000);
    if (payload.avatar !== undefined) updateFields.avatar = sanitizeString(payload.avatar, 500);
    if (payload.email !== undefined) updateFields.email = sanitizeString(payload.email, 150);
    if (payload.rating !== undefined) updateFields.rating = Math.min(5, Math.max(1, Math.round(payload.rating)));
    if (payload.status !== undefined && ["pending", "approved", "rejected"].includes(payload.status)) {
      updateFields.status = payload.status;
    }

    const updated = await TestimonialModel.findOneAndUpdate(
      { id },
      { $set: updateFields },
      { new: true }
    ).lean();

    if (!updated) {
      return { success: false, error: "Testimonial not found." };
    }

    revalidatePath("/");
    revalidatePath("/admin");

    return {
      success: true,
      message: "Testimonial updated successfully.",
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update testimonial";
    return { success: false, error: message };
  }
}
