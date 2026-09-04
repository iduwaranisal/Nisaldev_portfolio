export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  title: string;
  category: "AI & Agents" | "Full Stack Web" | "Cloud & Distributed" | string;
  tagline: string;
  description: string;
  fullOverview: string;
  image: string;
  tags: string[];
  metrics: ProjectMetric[];
  architectureDetails: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: "AI Systems" | "Web Architecture" | "Distributed Systems" | string;
  readTime: string;
  publishedDate: string;
  excerpt: string;
  content: string[];
  slug: string;
  tags: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating?: number;
  email?: string;
  status?: "pending" | "approved" | "rejected";
  createdAt?: string;
}

export type SkillCardTheme = "orange" | "amber" | "rose" | "blue" | "emerald" | "purple";

export interface SkillBar {
  name: string;
  level: string;
}

export interface MetricItem {
  label: string;
  value: string;
}

export interface SkillCard {
  id: string;
  title: string;
  badge?: string;
  icon?: string;
  theme?: SkillCardTheme;
  description: string;
  tags?: string[];
  skillBars?: SkillBar[];
  metrics?: MetricItem[];
  principles?: string[];
}

export interface SkillItem {
  name: string;
  level: string;
}

export interface BentoConfig {
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
    skillBars: SkillItem[];
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
}

export interface PortfolioData {
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
    cards?: SkillCard[];
    bento?: BentoConfig;
  };
  projectsSection: {
    subBadge: string;
    titleMain: string;
    titleAccent: string;
    titleEnd: string;
    description: string;
    categories: string[];
    projects: Project[];
  };
  articlesSection: {
    subBadge: string;
    titleMain: string;
    titleAccent: string;
    titleEnd: string;
    description: string;
    articles: Article[];
  };
  testimonialsSection: {
    subBadge: string;
    titleMain: string;
    titleAccent: string;
    titleEnd: string;
    description: string;
    testimonials: Testimonial[];
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

export const INITIAL_PORTFOLIO_DATA: PortfolioData = {
  general: {
    brandName: "iduwaranisal",
    brandDomain: ".dev",
    availabilityStatus: "Available for new opportunities & collaboration",
    name: "Iduwara Nisal Palihawadana",
    role1: "AI Architect",
    role2: "& Full Stack Developer",
    tagline: "Information Systems Student at Sabaragamuwa University & Aspiring AI Architect",
    bio: "I am an Information Systems student at Sabaragamuwa University working toward becoming an AI Architect. My main focus is taking artificial intelligence from the testing phase and turning it into real, working web applications. I enjoy hands-on problem-solving and connecting machine learning with reliable software development. I enjoy building the entire product rather than just training the AI—from setting up the database to creating the user interface and getting the application live on the internet.",
    profileImage: "",
    floatingBadge1: "Next.js 16 & MERN",
    floatingBadge2: "PyTorch & LangChain",
    primaryBtnText: "Explore Projects",
    secondaryBtnText: "Read My Articles",
    resumeBtnText: "Resume / CV",
    stats: [
      { value: "8+", label: "Years Experience" },
      { value: "45M+", label: "Daily AI Inferences" },
      { value: "<35ms", label: "P99 Inference Latency" },
      { value: "99.99%", label: "System Availability" },
    ],
  },
  skillsSection: {
    subBadge: "Skills & Technical Stack",
    titleMain: "Technical",
    titleAccent: "Skills",
    titleEnd: "& Architecture",
    description: "I enjoy building the entire product rather than just training the AI—from setting up the database to creating the user interface and getting the application live on the internet. Always happy to connect and chat about software design, practical AI, and new technical ideas.",
    cards: [
      {
        id: "card-ai",
        title: "Artificial Intelligence & Machine Learning",
        badge: "AI & Data",
        icon: "BrainCircuit",
        theme: "orange",
        description: "I work with tools like PyTorch, large language models (Hugging Face, LangChain), and vector databases to create smart, data-driven features.",
        tags: [
          "PyTorch",
          "Large Language Models (LLMs)",
          "Hugging Face Transformers",
          "LangChain",
          "Vector Databases",
          "Data-Driven AI Features",
        ],
        metrics: [
          { label: "AI Frameworks", value: "PyTorch & LangChain" },
          { label: "Tech Focus", value: "LLMs & Vector Search" },
        ],
      },
      {
        id: "card-web",
        title: "Full-Stack Web Development",
        badge: "Web Apps",
        icon: "Layers",
        theme: "amber",
        description: "I build complete, interactive applications using Python (Django), Next.js, and the MERN stack with modern responsive user interfaces.",
        tags: [
          "Next.js 16 (App Router)",
          "Python (Django)",
          "MERN Stack",
          "TypeScript",
          "Tailwind CSS",
          "React 19",
        ],
        skillBars: [
          { name: "Next.js 16 & React", level: "96%" },
          { name: "Python (Django)", level: "92%" },
          { name: "MERN Stack (MongoDB, Node, Express)", level: "94%" },
          { name: "TypeScript & Tailwind CSS", level: "95%" },
        ],
      },
      {
        id: "card-devops",
        title: "Deployment & Operations",
        badge: "Cloud & DevOps",
        icon: "Server",
        theme: "orange",
        description: "I make sure these applications run smoothly and reliably online using Linux, Docker, Kubernetes, and automated release processes (CI/CD).",
        tags: [
          "Linux Administration",
          "Docker Containers",
          "Kubernetes (K8s)",
          "CI/CD Pipelines",
          "Automated Releases",
          "Cloud Hosting",
        ],
        principles: [
          "Automated testing and releases (CI/CD)",
          "Containerized applications with Docker",
          "Reliable server setup and uptime",
        ],
      },
      {
        id: "card-databases",
        title: "Databases & Data Storage",
        badge: "Databases",
        icon: "Database",
        theme: "amber",
        description: "Setting up reliable data storage with vector search, structured SQL relational databases, and fast document stores.",
        tags: [
          "Vector Databases (Qdrant/Pinecone)",
          "MongoDB Atlas",
          "PostgreSQL",
          "Redis In-Memory Cache",
          "Django ORM",
          "Mongoose",
        ],
        metrics: [
          { label: "Vector Search", value: "Fast Semantic Search" },
          { label: "Data Modeling", value: "SQL & NoSQL" },
        ],
      },
      {
        id: "card-principles",
        title: "Software Engineering Principles",
        badge: "Best Practices",
        icon: "Workflow",
        theme: "rose",
        description: "Connecting hands-on machine learning with dependable software engineering, clean code, and end-to-end product ownership.",
        tags: [
          "End-to-End Development",
          "Type Safety",
          "Clean Code Architecture",
          "Application Monitoring",
        ],
        principles: [
          "Full product development from database to UI",
          "Connecting ML models with reliable software applications",
          "Automated CI/CD and reliable cloud deployments",
        ],
      },
    ],
  },
  projectsSection: {
    subBadge: "Featured Projects",
    titleMain: "Featured",
    titleAccent: "Projects",
    titleEnd: "& Applications",
    description: "Real-world web applications, AI tools, and software projects built with modern technologies.",
    categories: ["All", "AI & Agents", "Full Stack Web", "Cloud & Distributed"],
    projects: [],
  },
  articlesSection: {
    subBadge: "Articles & Insights",
    titleMain: "Technical",
    titleAccent: "Articles",
    titleEnd: "& Guides",
    description: "Practical guides and tutorials on building AI applications, modern web development, and database architecture.",
    articles: [],
  },
  testimonialsSection: {
    subBadge: "Client Testimonials",
    titleMain: "What People",
    titleAccent: "Say",
    titleEnd: "About My Work",
    description:
      "Feedback from clients, collaborators, and colleagues I've had the pleasure of working with on various projects.",
    testimonials: [
      {
        id: "testimonial-1",
        name: "Sarah Chen",
        role: "CTO",
        company: "NovaTech Solutions",
        content:
          "Nisal delivered an outstanding AI-powered analytics dashboard that exceeded our expectations. His ability to bridge machine learning with clean, production-ready web applications is remarkable.",
        rating: 5,
      },
      {
        id: "testimonial-2",
        name: "Marcus Williams",
        role: "Product Manager",
        company: "DataFlow Systems",
        content:
          "Working with Nisal was a fantastic experience. He transformed our complex data pipeline requirements into an elegant, user-friendly interface. His full-stack expertise really shines through.",
        rating: 5,
      },
      {
        id: "testimonial-3",
        name: "Ayesha Rahman",
        role: "Lead Developer",
        company: "CloudBridge AI",
        content:
          "Nisal's deep understanding of both AI architectures and modern web frameworks made him the perfect fit for our LLM integration project. The results were impressive and delivered ahead of schedule.",
        rating: 5,
      },
      {
        id: "testimonial-4",
        name: "David Park",
        role: "Startup Founder",
        company: "Velocity Labs",
        content:
          "From database design to deploying a fully containerized application, Nisal handled everything with professionalism. His end-to-end development approach saved us weeks of coordination.",
        rating: 5,
      },
      {
        id: "testimonial-5",
        name: "Elena Kowalski",
        role: "Engineering Manager",
        company: "Nexus Digital",
        content:
          "Nisal's code quality and attention to detail are exceptional. He built a Next.js platform for us that's both performant and maintainable. A truly skilled full-stack developer.",
        rating: 5,
      },
      {
        id: "testimonial-6",
        name: "James Rodrigo",
        role: "AI Research Lead",
        company: "IntelliCore Labs",
        content:
          "Nisal seamlessly integrated our PyTorch models into a production web application with real-time inference. His understanding of MLOps and deployment best practices is top-notch.",
        rating: 5,
      },
    ],
  },
  contactSection: {
    subBadge: "Get In Touch",
    titleMain: "Let's Start a",
    titleAccent: "Conversation",
    titleEnd: "",
    description: "Whether you have a question about web development, an AI project idea, or want to discuss collaboration, feel free to reach out!",
    email: "nisal.dev.ai@gmail.com",
    location: "Sri Lanka & Remote",
    resumePdfUrl: "/resume.pdf",
    resumeCardTitle: "Full Resume / CV",
    resumeCardDesc: "Updated PDF covering technical skills, projects, and education.",
  },
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    discord: "https://discord.com",
  },
  footer: {
    brandTitle: "Iduwara Nisal",
    brandSub: "/ Portfolio",
    tagline: "Building reliable web applications, AI tools, and full-stack software solutions.",
    copyrightText: "All rights reserved.",
    creditsText: "Built with Next.js 16 · TypeScript · Tailwind CSS · MongoDB",
  },
};

export function getSkillsCards(skillsSection?: any): SkillCard[] {
  if (!skillsSection) return INITIAL_PORTFOLIO_DATA.skillsSection.cards || [];
  if (Array.isArray(skillsSection.cards) && skillsSection.cards.length > 0) {
    return skillsSection.cards.map((c: any) => ({
      id: c.id || `card-${Math.random()}`,
      title: c.title || "Specialization",
      badge: c.badge || "",
      icon: c.icon || "BrainCircuit",
      theme: (c.theme as SkillCardTheme) || "orange",
      description: c.description || "",
      tags: Array.isArray(c.tags) ? c.tags : [],
      skillBars: Array.isArray(c.skillBars) ? c.skillBars : [],
      metrics: Array.isArray(c.metrics) ? c.metrics : [],
      principles: Array.isArray(c.principles) ? c.principles : [],
    }));
  }
  if (skillsSection.bento) {
    const b = skillsSection.bento;
    return [
      {
        id: "card-ai",
        title: b.bento1?.title || "Artificial Intelligence & Machine Learning",
        badge: b.bento1?.badge || "AI & Data",
        icon: "BrainCircuit",
        theme: "orange",
        description: b.bento1?.description || "Developing practical AI applications with PyTorch, large language models, and vector search.",
        tags: b.bento1?.tags || ["PyTorch", "LLMs", "LangChain", "Vector Databases"],
        metrics: [
          { label: b.bento1?.metric1Label || "AI Frameworks", value: b.bento1?.metric1Value || "PyTorch" },
          { label: b.bento1?.metric2Label || "Tech Focus", value: b.bento1?.metric2Value || "LLMs & Search" },
        ],
      },
      {
        id: "card-web",
        title: b.bento2?.title || "Full-Stack Web Development",
        badge: b.bento2?.badge || "Web Apps",
        icon: "Layers",
        theme: "amber",
        description: b.bento2?.description || "Building full-stack web applications with Python (Django), Next.js, and the MERN stack.",
        tags: ["Next.js 16", "Python (Django)", "MERN Stack", "TypeScript"],
        skillBars: b.bento2?.skillBars || [],
      },
      {
        id: "card-devops",
        title: b.bento3?.title || "Deployment & Operations",
        badge: "Cloud & DevOps",
        icon: "Server",
        theme: "orange",
        description: b.bento3?.description || "Deploying and managing applications with Linux, Docker, Kubernetes, and automated CI/CD pipelines.",
        tags: b.bento3?.tags || ["Linux", "Docker", "Kubernetes", "CI/CD"],
        principles: ["Automated testing & releases (CI/CD)", "Containerized applications with Docker", "Reliable server setup & monitoring"],
      },
      {
        id: "card-databases",
        title: b.bento4?.title || "Databases & Data Storage",
        badge: "Databases",
        icon: "Database",
        theme: "amber",
        description: b.bento4?.description || "Setting up reliable SQL, NoSQL, and vector databases for high-speed data retrieval.",
        tags: b.bento4?.tags || ["PostgreSQL", "MongoDB Atlas", "Redis", "Vector Databases"],
        metrics: [{ label: "Databases", value: "SQL & NoSQL" }, { label: "Caching", value: "Redis Caching" }],
      },
      {
        id: "card-principles",
        title: b.bento5?.title || "Software Engineering Principles",
        badge: "Best Practices",
        icon: "Workflow",
        theme: "rose",
        description: "Connecting machine learning with reliable software engineering, clean code, and end-to-end product ownership.",
        principles: b.bento5?.principles || ["Full product development from database to UI", "Connecting ML models with reliable applications", "Automated CI/CD and reliable cloud deployments"],
      },
    ];
  }
  return INITIAL_PORTFOLIO_DATA.skillsSection.cards || [];
}

export const DUMMY_PROJECT_IDS = [
  "agentic-orchestrator",
  "realtime-enterprise-rag",
  "hyper-scalable-fintech-gateway",
  "cloud-telemetry-fabric",
  "neural-creative-studio",
  "developer-productivity-os",
];

export const DUMMY_ARTICLE_IDS = [
  "langgraph-agentic-patterns-2026",
  "nextjs16-app-router-zero-latency",
  "vector-embeddings-at-scale",
  "ebpf-and-ai-observability",
];
