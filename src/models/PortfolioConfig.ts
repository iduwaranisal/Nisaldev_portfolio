import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortfolioConfig extends Document {
  general: {
    brandName: string;
    brandDomain: string;
    availabilityStatus: string;
    name: string;
    role1: string;
    role2: string;
    tagline: string;
    bio: string;
    profileImage: string;
    floatingBadge1: string;
    floatingBadge2: string;
    primaryBtnText: string;
    secondaryBtnText: string;
    resumeBtnText: string;
    stats: { value: string; label: string }[];
  };
  skillsSection: {
    subBadge: string;
    titleMain: string;
    titleAccent: string;
    titleEnd: string;
    description: string;
    bento: {
      bento1: {
        badge: string;
        title: string;
        description: string;
        tags: string[];
        metric1Label: string;
        metric1Value: string;
        metric2Label: string;
        metric2Value: string;
      };
      bento2: {
        badge: string;
        title: string;
        description: string;
        skillBars: { name: string; level: string }[];
        metricLabel: string;
        metricValue: string;
      };
      bento3: {
        title: string;
        description: string;
        tags: string[];
      };
      bento4: {
        title: string;
        description: string;
        tags: string[];
      };
      bento5: {
        title: string;
        principles: string[];
      };
    };
  };
  contactSection: {
    subBadge: string;
    titleMain: string;
    titleAccent: string;
    titleEnd: string;
    description: string;
    email: string;
    location: string;
    resumePdfUrl: string;
    resumeCardTitle: string;
    resumeCardDesc: string;
  };
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
    discord: string;
  };
  footer: {
    brandTitle: string;
    brandSub: string;
    tagline: string;
    copyrightText: string;
    creditsText: string;
  };
}

const PortfolioConfigSchema = new Schema<IPortfolioConfig>(
  {
    general: {
      brandName: { type: String, default: "Nisal" },
      brandDomain: { type: String, default: ".dev" },
      availabilityStatus: { type: String, default: "Available for new opportunities" },
      name: { type: String, default: "Nisal R." },
      role1: { type: String, default: "AI Architect" },
      role2: { type: String, default: "& Full Stack Developer" },
      tagline: { type: String, default: "Architecting Intelligent Systems & Scalable Web Applications." },
      bio: { type: String, default: "Designing low-latency multimodal AI pipelines, autonomous multi-agent swarms, and enterprise-grade distributed web applications." },
      profileImage: { type: String, default: "" },
      floatingBadge1: { type: String, default: "Sub-35ms Inferences" },
      floatingBadge2: { type: String, default: "Next.js 16 App Router" },
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
      subBadge: { type: String, default: "Tech Arsenal & Architecture" },
      titleMain: { type: String, default: "Engineering" },
      titleAccent: { type: String, default: "Expertise" },
      titleEnd: { type: String, default: "& Capabilities" },
      description: { type: String, default: "A high-performance technical stack forged across production AI pipelines, distributed cloud systems, and cutting-edge web applications." },
      bento: {
        bento1: {
          badge: { type: String, default: "Core Specialization" },
          title: { type: String, default: "AI & Machine Learning Architecture" },
          description: { type: String, default: "Specialized in constructing multi-agent swarms, low-latency RAG systems, and high-throughput model serving runtimes." },
          tags: [{ type: String }],
          metric1Label: { type: String, default: "Peak Performance" },
          metric1Value: { type: String, default: "3,200 tok/sec Throughput" },
          metric2Label: { type: String, default: "Evaluation Benchmark" },
          metric2Value: { type: String, default: "94.8% Accuracy" },
        },
        bento2: {
          badge: { type: String, default: "Modern Frontend" },
          title: { type: String, default: "Full-Stack Engineering" },
          description: { type: String, default: "Building reactive, 60fps applications with Next.js 16 App Router, TypeScript, and micro-interactions." },
          skillBars: [
            {
              name: { type: String },
              level: { type: String },
            },
          ],
          metricLabel: { type: String, default: "Lighthouse Vitals" },
          metricValue: { type: String, default: "100/100 Score" },
        },
        bento3: {
          title: { type: String, default: "Cloud & Distributed Systems" },
          description: { type: String, default: "Containerized microservices orchestration, auto-scaling Kubernetes topologies, and automated zero-downtime CI/CD." },
          tags: [{ type: String }],
        },
        bento4: {
          title: { type: String, default: "Vector & High-Scale DBs" },
          description: { type: String, default: "High-dimensional vector stores with HNSW scalar quantization, PostgreSQL relational modeling, and Redis caching layers." },
          tags: [{ type: String }],
        },
        bento5: {
          title: { type: String, default: "System Principles" },
          principles: [{ type: String }],
        },
      },
    },
    contactSection: {
      subBadge: { type: String, default: "Let's Build Together" },
      titleMain: { type: String, default: "Start an" },
      titleAccent: { type: String, default: "Intelligent" },
      titleEnd: { type: String, default: "Conversation" },
      description: { type: String, default: "Whether you are exploring autonomous agent workflows, scaling a high-throughput Next.js application, or seeking technical advisory, I'm ready to architect the solution." },
      email: { type: String, default: "nisal.dev.ai@gmail.com" },
      location: { type: String, default: "San Francisco, CA & Remote" },
      resumePdfUrl: { type: String, default: "/resume.pdf" },
      resumeCardTitle: { type: String, default: "Full Technical Resume" },
      resumeCardDesc: { type: String, default: "Updated PDF covering full career trajectory & patents." },
    },
    socialLinks: {
      github: { type: String, default: "https://github.com" },
      linkedin: { type: String, default: "https://linkedin.com" },
      twitter: { type: String, default: "https://x.com" },
      discord: { type: String, default: "https://discord.com" },
    },
    footer: {
      brandTitle: { type: String, default: "Nisal R." },
      brandSub: { type: String, default: "/ AI Architect" },
      tagline: { type: String, default: "Architecting intelligent neural systems, autonomous swarms & scalable web applications." },
      copyrightText: { type: String, default: "All rights reserved." },
      creditsText: { type: String, default: "Engineered with Next.js 16 · TypeScript · Tailwind CSS · Distributed Systems" },
    },
  },
  { timestamps: true }
);

export const PortfolioConfig: Model<IPortfolioConfig> =
  mongoose.models.PortfolioConfig || mongoose.model<IPortfolioConfig>("PortfolioConfig", PortfolioConfigSchema);
