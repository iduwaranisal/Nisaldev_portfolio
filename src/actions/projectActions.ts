"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { ProjectModel } from "@/models/Project";
import { Project, DUMMY_PROJECT_IDS } from "@/data/portfolioData";

export interface ProjectActionResult {
  success: boolean;
  project?: Project;
  projects?: Project[];
  message?: string;
  error?: string;
}

export async function getProjectsAction(): Promise<ProjectActionResult> {
  try {
    await connectToDatabase();
    await ProjectModel.deleteMany({ id: { $in: DUMMY_PROJECT_IDS } });
    const docs = await ProjectModel.find().sort({ featured: -1, createdAt: -1 }).lean();
    const projects: Project[] = (docs || []).map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      fullOverview: p.fullOverview,
      image: p.image || "",
      tags: p.tags || [],
      metrics: p.metrics || [],
      architectureDetails: p.architectureDetails || [],
      liveUrl: p.liveUrl,
      githubUrl: p.githubUrl,
      featured: p.featured,
    }));
    return { success: true, projects };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch projects";
    return { success: false, error: message };
  }
}

export async function addProjectAction(project: Project): Promise<ProjectActionResult> {
  try {
    if (!project || !project.title) {
      return { success: false, error: "Project data and title are required" };
    }

    await connectToDatabase();

    const cleanProject = { ...project };
    delete (cleanProject as Record<string, unknown>)._id;
    delete (cleanProject as Record<string, unknown>).__v;

    const projectId = cleanProject.id || `proj-${Date.now()}`;
    cleanProject.id = projectId;

    const saved = await ProjectModel.findOneAndUpdate(
      { id: projectId },
      { $set: cleanProject },
      { upsert: true, new: true, runValidators: true }
    ).lean();

    revalidatePath("/projects");
    revalidatePath("/");

    return {
      success: true,
      message: "Project successfully saved to MongoDB Atlas",
      project: {
        id: saved.id,
        title: saved.title,
        category: saved.category,
        tagline: saved.tagline,
        description: saved.description,
        fullOverview: saved.fullOverview,
        image: saved.image || "",
        tags: saved.tags || [],
        metrics: saved.metrics || [],
        architectureDetails: saved.architectureDetails || [],
        liveUrl: saved.liveUrl,
        githubUrl: saved.githubUrl,
        featured: saved.featured,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to add project";
    console.error("addProjectAction error:", error);
    return { success: false, error: message };
  }
}

export async function updateProjectAction(
  id: string,
  updatedFields: Partial<Project>
): Promise<ProjectActionResult> {
  try {
    if (!id) {
      return { success: false, error: "Project ID is required" };
    }

    await connectToDatabase();

    const cleanFields = { ...updatedFields };
    delete (cleanFields as Record<string, unknown>)._id;
    delete (cleanFields as Record<string, unknown>).__v;

    const cleanId = String(id).trim();
    const query = cleanId.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const updated = await ProjectModel.findOneAndUpdate(
      query,
      { $set: cleanFields },
      { new: true, runValidators: true }
    ).lean();

    if (!updated) {
      return { success: false, error: "Project not found in database" };
    }

    revalidatePath("/projects");
    revalidatePath("/");

    return {
      success: true,
      message: "Project updated in MongoDB Atlas",
      project: {
        id: updated.id,
        title: updated.title,
        category: updated.category,
        tagline: updated.tagline,
        description: updated.description,
        fullOverview: updated.fullOverview,
        image: updated.image || "",
        tags: updated.tags || [],
        metrics: updated.metrics || [],
        architectureDetails: updated.architectureDetails || [],
        liveUrl: updated.liveUrl,
        githubUrl: updated.githubUrl,
        featured: updated.featured,
      },
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update project";
    console.error("updateProjectAction error:", error);
    return { success: false, error: message };
  }
}

export async function deleteProjectAction(id: string): Promise<ProjectActionResult> {
  try {
    if (!id) {
      return { success: false, error: "Project ID is required" };
    }

    await connectToDatabase();

    const cleanId = String(id).trim();
    const query = cleanId.match(/^[0-9a-fA-F]{24}$/)
      ? { $or: [{ id: cleanId }, { _id: cleanId }] }
      : { id: cleanId };

    const deleted = await ProjectModel.findOneAndDelete(query);
    if (!deleted) {
      return { success: false, error: "Project not found to delete" };
    }

    revalidatePath("/projects");
    revalidatePath("/");

    return { success: true, message: "Project deleted from database." };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete project";
    console.error("deleteProjectAction error:", error);
    return { success: false, error: message };
  }
}
