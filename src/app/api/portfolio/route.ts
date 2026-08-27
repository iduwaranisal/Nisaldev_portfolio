import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    await connectToDatabase();

    // Find or seed config
    let configDoc = await PortfolioConfig.findOne();
    if (!configDoc) {
      configDoc = await PortfolioConfig.create({
        general: INITIAL_PORTFOLIO_DATA.general,
        skillsSection: INITIAL_PORTFOLIO_DATA.skillsSection,
        contactSection: INITIAL_PORTFOLIO_DATA.contactSection,
        socialLinks: INITIAL_PORTFOLIO_DATA.socialLinks,
        footer: INITIAL_PORTFOLIO_DATA.footer,
      });
    }

    // Find or seed projects
    let projects = await ProjectModel.find().sort({ createdAt: -1 });
    if (!projects || projects.length === 0) {
      await ProjectModel.insertMany(INITIAL_PORTFOLIO_DATA.projectsSection.projects);
      projects = await ProjectModel.find().sort({ createdAt: -1 });
    }

    // Find or seed articles
    let articles = await ArticleModel.find().sort({ createdAt: -1 });
    if (!articles || articles.length === 0) {
      await ArticleModel.insertMany(INITIAL_PORTFOLIO_DATA.articlesSection.articles);
      articles = await ArticleModel.find().sort({ createdAt: -1 });
    }

    // Sanitize general config
    const generalData = { ...configDoc.general };
    generalData.profileImage = sanitizeUrl(generalData.profileImage);

    // Format unified response
    const fullData: PortfolioData = {
      general: generalData,
      skillsSection: configDoc.skillsSection,
      projectsSection: {
        subBadge: INITIAL_PORTFOLIO_DATA.projectsSection.subBadge,
        titleMain: INITIAL_PORTFOLIO_DATA.projectsSection.titleMain,
        titleAccent: INITIAL_PORTFOLIO_DATA.projectsSection.titleAccent,
        titleEnd: INITIAL_PORTFOLIO_DATA.projectsSection.titleEnd,
        description: INITIAL_PORTFOLIO_DATA.projectsSection.description,
        categories: INITIAL_PORTFOLIO_DATA.projectsSection.categories,
        projects: projects.map((p) => ({
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
        articles: articles.map((a) => ({
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
      contactSection: configDoc.contactSection,
      socialLinks: configDoc.socialLinks,
      footer: configDoc.footer,
    };

    return NextResponse.json({ success: true, data: fullData });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Database connection failed";
    console.error("API GET /api/portfolio error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();

    let configDoc = await PortfolioConfig.findOne();
    if (!configDoc) {
      configDoc = new PortfolioConfig(body);
    } else {
      if (body.general) configDoc.general = body.general;
      if (body.skillsSection) configDoc.skillsSection = body.skillsSection;
      if (body.contactSection) configDoc.contactSection = body.contactSection;
      if (body.socialLinks) configDoc.socialLinks = body.socialLinks;
      if (body.footer) configDoc.footer = body.footer;
    }

    await configDoc.save();

    return NextResponse.json({ success: true, message: "Configuration updated in MongoDB Atlas" });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update configuration";
    console.error("API PUT /api/portfolio error:", error);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
