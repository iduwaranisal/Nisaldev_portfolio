import mongoose, { Schema, Document, Model } from "mongoose";
import { PortfolioData } from "@/data/portfolioData";

export interface IPortfolioConfig extends Document {
  general: PortfolioData["general"];
  skillsSection: PortfolioData["skillsSection"];
  contactSection: PortfolioData["contactSection"];
  socialLinks: PortfolioData["socialLinks"];
  footer: PortfolioData["footer"];
}

const PortfolioConfigSchema = new Schema<IPortfolioConfig>(
  {
    general: {
      brandName: { type: String, default: "iduwaranisal" },
      brandDomain: { type: String, default: ".dev" },
      availabilityStatus: { type: String, default: "Available for new opportunities & collaboration" },
      name: { type: String, default: "Iduwara Nisal Palihawadana" },
      role1: { type: String, default: "AI Architect" },
      role2: { type: String, default: "& Full Stack Developer" },
      tagline: { type: String, default: "Information Systems Student at Sabaragamuwa University & Aspiring AI Architect" },
      bio: { type: String, default: "I am an Information Systems student at Sabaragamuwa University working toward becoming an AI Architect. My main focus is taking artificial intelligence from the testing phase and turning it into real, working web applications. I enjoy hands-on problem-solving and connecting machine learning with reliable software development." },
      profileImage: { type: String, default: "" },
      floatingBadge1: { type: String, default: "Next.js 16 & MERN" },
      floatingBadge2: { type: String, default: "PyTorch & LangChain" },
      primaryBtnText: { type: String, default: "Explore Projects" },
      secondaryBtnText: { type: String, default: "Read My Articles" },
      resumeBtnText: { type: String, default: "Resume / CV" },
      stats: [
        {
          value: { type: String },
          label: { type: String },
        },
      ],
    },
    skillsSection: {
      subBadge: { type: String, default: "Skills & Technical Stack" },
      titleMain: { type: String, default: "Technical" },
      titleAccent: { type: String, default: "Skills" },
      titleEnd: { type: String, default: "& Architecture" },
      description: { type: String, default: "I enjoy building the entire product rather than just training the AI—from setting up the database to creating the user interface and getting the application live on the internet." },
      cards: [
        {
          id: { type: String },
          title: { type: String },
          badge: { type: String },
          icon: { type: String },
          theme: { type: String },
          description: { type: String },
          tags: [{ type: String }],
          skillBars: [
            {
              name: { type: String },
              level: { type: String },
            },
          ],
          metrics: [
            {
              label: { type: String },
              value: { type: String },
            },
          ],
          principles: [{ type: String }],
        },
      ],
      bento: {
        bento1: {
          badge: { type: String, default: "AI & Data" },
          title: { type: String, default: "Artificial Intelligence & Machine Learning" },
          description: { type: String, default: "Developing practical AI applications with PyTorch, large language models, and vector search." },
          tags: [{ type: String }],
          metric1Label: { type: String, default: "AI Frameworks" },
          metric1Value: { type: String, default: "PyTorch & LangChain" },
          metric2Label: { type: String, default: "Tech Focus" },
          metric2Value: { type: String, default: "LLMs & Vector Search" },
        },
        bento2: {
          badge: { type: String, default: "Web Apps" },
          title: { type: String, default: "Full-Stack Web Development" },
          description: { type: String, default: "Building full-stack web applications with Python (Django), Next.js, and the MERN stack." },
          skillBars: [
            {
              name: { type: String },
              level: { type: String },
            },
          ],
          metricLabel: { type: String, default: "Frontend Framework" },
          metricValue: { type: String, default: "Next.js 16 & React 19" },
        },
        bento3: {
          title: { type: String, default: "Deployment & Operations" },
          description: { type: String, default: "Deploying and managing applications with Linux, Docker, Kubernetes, and automated CI/CD pipelines." },
          tags: [{ type: String }],
        },
        bento4: {
          title: { type: String, default: "Databases & Data Storage" },
          description: { type: String, default: "Setting up reliable SQL, NoSQL, and vector databases for high-speed data retrieval." },
          tags: [{ type: String }],
        },
        bento5: {
          title: { type: String, default: "Software Engineering Principles" },
          principles: [{ type: String }],
        },
      },
    },
    contactSection: {
      subBadge: { type: String, default: "Get In Touch" },
      titleMain: { type: String, default: "Let's Start a" },
      titleAccent: { type: String, default: "Conversation" },
      titleEnd: { type: String, default: "" },
      description: { type: String, default: "Whether you have a question about web development, an AI project idea, or want to discuss collaboration, feel free to reach out!" },
      email: { type: String, default: "nisal.dev.ai@gmail.com" },
      location: { type: String, default: "Sri Lanka & Remote" },
      resumePdfUrl: { type: String, default: "/resume.pdf" },
      resumeCardTitle: { type: String, default: "Full Resume / CV" },
      resumeCardDesc: { type: String, default: "Updated PDF covering technical skills, projects, and education." },
    },
    socialLinks: {
      github: { type: String, default: "https://github.com" },
      linkedin: { type: String, default: "https://linkedin.com" },
      twitter: { type: String, default: "https://x.com" },
      discord: { type: String, default: "https://discord.com" },
    },
    footer: {
      brandTitle: { type: String, default: "Iduwara Nisal" },
      brandSub: { type: String, default: "/ Portfolio" },
      tagline: { type: String, default: "Building reliable web applications, AI tools, and full-stack software solutions." },
      copyrightText: { type: String, default: "All rights reserved." },
      creditsText: { type: String, default: "Built with Next.js 16 · TypeScript · Tailwind CSS · MongoDB" },
    },
  },
  { timestamps: true }
);

export const PortfolioConfig: Model<IPortfolioConfig> =
  mongoose.models.PortfolioConfig || mongoose.model<IPortfolioConfig>("PortfolioConfig", PortfolioConfigSchema);
