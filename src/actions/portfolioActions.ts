"use server";

import { revalidatePath } from "next/cache";
import { connectToDatabase } from "@/lib/mongodb";
import { PortfolioConfig } from "@/models/PortfolioConfig";
import { ProjectModel } from "@/models/Project";
import { ArticleModel } from "@/models/Article";
import { TestimonialModel } from "@/models/Testimonial";
import { INITIAL_PORTFOLIO_DATA, PortfolioData, getSkillsCards, DUMMY_PROJECT_IDS, DUMMY_ARTICLE_IDS } from "@/data/portfolioData";

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

    let configDoc = await PortfolioConfig.findOne().lean();
    if (!configDoc) {
      configDoc = await PortfolioConfig.create({
        general: INITIAL_PORTFOLIO_DATA.general,
        skillsSection: INITIAL_PORTFOLIO_DATA.skillsSection,
        contactSection: INITIAL_PORTFOLIO_DATA.contactSection,
        socialLinks: INITIAL_PORTFOLIO_DATA.socialLinks,
        footer: INITIAL_PORTFOLIO_DATA.footer,
      });
    }

    // Automatically purge any remaining legacy dummy demo records
    await ProjectModel.deleteMany({ id: { $in: DUMMY_PROJECT_IDS } });
    await ArticleModel.deleteMany({ id: { $in: DUMMY_ARTICLE_IDS } });

    let projects = await ProjectModel.find().sort({ featured: -1, createdAt: -1 }).lean();
    let articles = await ArticleModel.find().sort({ createdAt: -1 }).lean();

    // Ensure default testimonials exist if database is fresh
    const totalTestimonials = await TestimonialModel.countDocuments();
    if (totalTestimonials === 0 && INITIAL_PORTFOLIO_DATA.testimonialsSection?.testimonials?.length) {
      await TestimonialModel.insertMany(
        INITIAL_PORTFOLIO_DATA.testimonialsSection.testimonials.map((t) => ({
          ...t,
          status: "approved",
          featured: false,
        }))
      );
    }

    let approvedTestimonials = await TestimonialModel.find({ status: "approved" })
      .sort({ featured: -1, createdAt: -1 })
      .lean();

    const generalData = { ...configDoc.general };
    generalData.profileImage = sanitizeUrl(generalData.profileImage);

    const skillsSec = configDoc.skillsSection || INITIAL_PORTFOLIO_DATA.skillsSection;
    const cards = getSkillsCards(skillsSec);

    const fullData: PortfolioData = {
      general: generalData,
      skillsSection: {
        subBadge: skillsSec.subBadge || INITIAL_PORTFOLIO_DATA.skillsSection.subBadge,
        titleMain: skillsSec.titleMain || INITIAL_PORTFOLIO_DATA.skillsSection.titleMain,
        titleAccent: skillsSec.titleAccent || INITIAL_PORTFOLIO_DATA.skillsSection.titleAccent,
        titleEnd: skillsSec.titleEnd || INITIAL_PORTFOLIO_DATA.skillsSection.titleEnd,
        description: skillsSec.description || INITIAL_PORTFOLIO_DATA.skillsSection.description,
        cards,
      },
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
      testimonialsSection: {
        subBadge: INITIAL_PORTFOLIO_DATA.testimonialsSection.subBadge,
        titleMain: INITIAL_PORTFOLIO_DATA.testimonialsSection.titleMain,
        titleAccent: INITIAL_PORTFOLIO_DATA.testimonialsSection.titleAccent,
        titleEnd: INITIAL_PORTFOLIO_DATA.testimonialsSection.titleEnd,
        description: INITIAL_PORTFOLIO_DATA.testimonialsSection.description,
        testimonials: approvedTestimonials.map((t) => ({
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
