import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  id: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  fullOverview: string;
  image: string;
  tags: string[];
  metrics: { label: string; value: string }[];
  architectureDetails: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

const ProjectSchema = new Schema<IProject>(
  {
    id: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    tagline: { type: String, default: "" },
    description: { type: String, default: "" },
    fullOverview: { type: String, default: "" },
    image: { type: String, default: "" },
    tags: [{ type: String }],
    metrics: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    architectureDetails: [{ type: String }],
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const ProjectModel: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);
