import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ArticleModel } from "@/models/Article";

export async function GET() {
  try {
    await connectToDatabase();
    const articles = await ArticleModel.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, articles });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch articles";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.id) {
      body.id = `art-${Date.now()}`;
    }

    const article = await ArticleModel.create(body);
    return NextResponse.json({ success: true, article });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create article in MongoDB";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
