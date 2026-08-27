import { NextResponse } from "next/server";
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

    const cleanId = String(id).replace(/[^a-zA-Z0-9-_]/g, "");
    const body = await req.json();

    const project = await ProjectModel.findOneAndUpdate(
      { id: cleanId },
      { $set: body },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
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

    const cleanId = String(id).replace(/[^a-zA-Z0-9-_]/g, "");
    await ProjectModel.findOneAndDelete({ id: cleanId });
    return NextResponse.json({ success: true, message: "Project deleted from MongoDB" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
