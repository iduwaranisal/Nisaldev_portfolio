import { unstable_cache } from "next/cache";
import { connectToDatabase } from "./mongodb";
import { PortfolioConfig } from "@/models/PortfolioConfig";
import { ProjectModel } from "@/models/Project";
import { ArticleModel } from "@/models/Article";
import { INITIAL_PORTFOLIO_DATA, PortfolioData, getSkillsCards } from "@/data/portfolioData";

function sanitizeUrl(url?: string): string {
  if (!url || typeof url !== "string") return "";
  if (url.includes("unsplash.com") || url.includes("images.unsplash.com")) return "";
  return url;
}

export const getCachedPortfolioData = unstable_cache(
  async (): Promise<PortfolioData> => {
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

      return fullData;
    } catch (error) {
      console.warn("Failed to fetch MongoDB on server, using initial fallback:", error);
      return INITIAL_PORTFOLIO_DATA;
    }
  },
  ["portfolio-data-cache-key"],
  {
    revalidate: 60, // Edge cache revalidates every 60 seconds
    tags: ["portfolio_data"],
  }
);
