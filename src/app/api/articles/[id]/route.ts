import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Invalid article ID" }, { status: 400 });
    }

    const cleanId = decodeURIComponent(id).trim();
    const body = await req.json();

    delete body._id;
    delete body.__v;

    const query = mongoose.Types.ObjectId.isValid(cleanId)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const article = await ArticleModel.findOneAndUpdate(
      query,
      { $set: { ...body, id: body.id || cleanId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, article });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update article";
    console.error("PUT /api/articles/[id] error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Invalid article ID" }, { status: 400 });
    }

    const cleanId = decodeURIComponent(id).trim();
    const query = mongoose.Types.ObjectId.isValid(cleanId)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const deleted = await ArticleModel.findOneAndDelete(query);
    return NextResponse.json({ success: true, message: "Article deleted from MongoDB", deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete article";
    console.error("DELETE /api/articles/[id] error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
