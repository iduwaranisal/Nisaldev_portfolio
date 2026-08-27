import mongoose, { Schema, Document, Model } from "mongoose";

export interface IArticle extends Document {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  content: string[];
  slug: string;
  tags: string[];
}

const ArticleSchema = new Schema<IArticle>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    readTime: { type: String, default: "5 min read" },
    publishedDate: { type: String, default: "" },
    excerpt: { type: String, default: "" },
    content: [{ type: String }],
    slug: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

export const ArticleModel: Model<IArticle> =
  mongoose.models.Article || mongoose.model<IArticle>("Article", ArticleSchema);
