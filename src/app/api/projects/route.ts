import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel } from "@/models/Project";

export async function GET() {
  try {
    await connectToDatabase();
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, projects });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      body.id = `proj-${Date.now()}`;
    }

    const project = await ProjectModel.create(body);
    return NextResponse.json({ success: true, project });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create project in MongoDB";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
