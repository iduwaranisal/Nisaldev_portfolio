import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel } from "@/models/Project";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ success: false, error: "Invalid project ID" }, { status: 400 });
    }

    const cleanId = decodeURIComponent(id).trim();
    const body = await req.json();

    delete body._id;
    delete body.__v;

    const query = mongoose.Types.ObjectId.isValid(cleanId)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const project = await ProjectModel.findOneAndUpdate(
      query,
      { $set: { ...body, id: body.id || cleanId } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    console.error("PUT /api/projects/[id] error:", error);
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
      return NextResponse.json({ success: false, error: "Invalid project ID" }, { status: 400 });
    }

    const cleanId = decodeURIComponent(id).trim();
    const query = mongoose.Types.ObjectId.isValid(cleanId)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const deleted = await ProjectModel.findOneAndDelete(query);
    return NextResponse.json({ success: true, message: "Project deleted from MongoDB", deleted });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    console.error("DELETE /api/projects/[id] error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
