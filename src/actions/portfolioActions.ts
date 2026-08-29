"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { PortfolioConfig } from "@/models/PortfolioConfig";
import { ProjectModel } from "@/models/Project";
import { ArticleModel } from "@/models/Article";
import { INITIAL_PORTFOLIO_DATA, PortfolioData } from "@/data/portfolioData";

function sanitizeUrl(url?: string): string {
  if (!url || typeof url !== "string") return "";
  if (url.includes("unsplash.com") || url.includes("images.unsplash.com")) return "";
  return url;
}

export interface PortfolioActionResult {
  success: boolean;
  data?: PortfolioData;
  message?: string;
  error?: string;
}

export async function getPortfolioDataAction(): Promise<PortfolioActionResult> {
  try {
    await connectToDatabase();

    let isFirstInit = false;
    let configDoc = await PortfolioConfig.findOne().lean();
    if (!configDoc) {
      isFirstInit = true;
      configDoc = await PortfolioConfig.create({
        general: INITIAL_PORTFOLIO_DATA.general,
        skillsSection: INITIAL_PORTFOLIO_DATA.skillsSection,
        contactSection: INITIAL_PORTFOLIO_DATA.contactSection,
        socialLinks: INITIAL_PORTFOLIO_DATA.socialLinks,
        footer: INITIAL_PORTFOLIO_DATA.footer,
      });
    }

    let projects = await ProjectModel.find().sort({ createdAt: -1 }).lean();
    if (isFirstInit && (!projects || projects.length === 0)) {
      await ProjectModel.insertMany(INITIAL_PORTFOLIO_DATA.projectsSection.projects);
      projects = await ProjectModel.find().sort({ createdAt: -1 }).lean();
    }

    let articles = await ArticleModel.find().sort({ createdAt: -1 }).lean();
    if (isFirstInit && (!articles || articles.length === 0)) {
      await ArticleModel.insertMany(INITIAL_PORTFOLIO_DATA.articlesSection.articles);
      articles = await ArticleModel.find().sort({ createdAt: -1 }).lean();
    }

    const generalData = { ...configDoc.general };
    generalData.profileImage = sanitizeUrl(generalData.profileImage);

    const fullData: PortfolioData = {
      general: generalData,
      skillsSection: configDoc.skillsSection || INITIAL_PORTFOLIO_DATA.skillsSection,
      projectsSection: {
        subBadge: INITIAL_PORTFOLIO_DATA.projectsSection.subBadge,
        titleMain: INITIAL_PORTFOLIO_DATA.projectsSection.titleMain,
        titleAccent: INITIAL_PORTFOLIO_DATA.projectsSection.titleAccent,
        titleEnd: INITIAL_PORTFOLIO_DATA.projectsSection.titleEnd,
        description: INITIAL_PORTFOLIO_DATA.projectsSection.description,
        categories: INITIAL_PORTFOLIO_DATA.projectsSection.categories,
        projects: (projects || []).map((p) => ({
          id: p.id,
          title: p.title,
          category: p.category,
          tagline: p.tagline,
          description: p.description,
          fullOverview: p.fullOverview,
          image: sanitizeUrl(p.image),
          tags: p.tags,
          metrics: p.metrics,
          architectureDetails: p.architectureDetails,
          liveUrl: p.liveUrl,
          githubUrl: p.githubUrl,
          featured: p.featured,
        })),
      },
      articlesSection: {
        subBadge: INITIAL_PORTFOLIO_DATA.articlesSection.subBadge,
        titleMain: INITIAL_PORTFOLIO_DATA.articlesSection.titleMain,
        titleAccent: INITIAL_PORTFOLIO_DATA.articlesSection.titleAccent,
        titleEnd: INITIAL_PORTFOLIO_DATA.articlesSection.titleEnd,
        description: INITIAL_PORTFOLIO_DATA.articlesSection.description,
        articles: (articles || []).map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          readTime: a.readTime,
          publishedDate: a.publishedDate,
          excerpt: a.excerpt,
          content: a.content,
          slug: a.slug,
          tags: a.tags,
        })),
      },
      contactSection: configDoc.contactSection || INITIAL_PORTFOLIO_DATA.contactSection,
      socialLinks: configDoc.socialLinks || INITIAL_PORTFOLIO_DATA.socialLinks,
      footer: configDoc.footer || INITIAL_PORTFOLIO_DATA.footer,
    };

    return { success: true, data: fullData };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    console.error("getPortfolioDataAction error:", error);
    return { success: false, error: message };
  }
}

export async function updatePortfolioConfigAction(
  fields: Partial<PortfolioData>
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    await connectToDatabase();

    let configDoc = await PortfolioConfig.findOne();
    if (!configDoc) {
      configDoc = new PortfolioConfig(fields);
    } else {
      if (fields.general) configDoc.general = fields.general;
      if (fields.skillsSection) configDoc.skillsSection = fields.skillsSection;
      if (fields.contactSection) configDoc.contactSection = fields.contactSection;
      if (fields.socialLinks) configDoc.socialLinks = fields.socialLinks;
      if (fields.footer) configDoc.footer = fields.footer;
    }

    await configDoc.save();

    // Revalidate paths to update static/cached pages immediately
    revalidatePath("/", "layout");
    revalidatePath("/");

    return { success: true, message: "Configuration updated in MongoDB Atlas" };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update configuration";
    console.error("updatePortfolioConfigAction error:", error);
    return { success: false, error: message };
  }
}
