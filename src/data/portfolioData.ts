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
      { value: "Sabaragamuwa", label: "University" },
      { value: "Full Stack", label: "Python & Next.js" },
      { value: "AI / ML", label: "PyTorch & LLMs" },
      { value: "DevOps", label: "Docker & K8s" },
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
    projects: [
      {
        id: "agentic-orchestrator",
        title: "NeuroMesh: Multi-Agent AI Task Assistant",
        category: "AI & Agents",
        tagline: "Coordinated multi-agent AI system for automated research, code writing, and task planning.",
        description:
          "A multi-agent AI system that divides complex tasks among specialized AI assistants to gather information, write code, and verify results automatically.",
        fullOverview:
          "NeuroMesh organizes team-based AI workflows using LangGraph and FastAPI. Different AI agents specialize in research, coding, and validation, sharing a unified memory store using Qdrant vector database and Redis caching.",
        image: "",
        tags: ["LangGraph", "PyTorch", "vLLM", "Qdrant", "Next.js 16", "WebSockets", "FastAPI"],
        metrics: [
          { label: "Processing Speed", value: "Fast Streaming" },
          { label: "Task Success Rate", value: "94.8%" },
          { label: "Memory Efficiency", value: "40% Less RAM" },
        ],
        architectureDetails: [
          "Step-by-step workflow planner with real-time progress updates",
          "Searchable long-term memory using vector embeddings",
          "Live interactive dashboard built with Next.js 16 and WebSockets",
        ],
        liveUrl: "https://neuromesh-demo.vercel.app",
        githubUrl: "https://github.com/nisaldev/neuromesh-orchestrator",
        featured: true,
      },
      {
        id: "realtime-enterprise-rag",
        title: "AuraRAG: AI Document Search & Knowledge Engine",
        category: "AI & Agents",
        tagline: "Fast semantic search and accurate question-answering over large document collections.",
        description:
          "An intelligent document search platform that reads PDFs, tables, and text files, answering user questions with exact source citations to prevent incorrect information.",
        fullOverview:
          "Built to make large internal document libraries easy to search. AuraRAG uses advanced embedding models and re-ranking to find the exact paragraphs needed to answer questions accurately with clickable citations.",
        image: "",
        tags: ["ColBERT", "Pinecone", "Next.js", "TypeScript", "Tailwind CSS", "Docker", "Python"],
        metrics: [
          { label: "Search Speed", value: "< 50ms" },
          { label: "Accuracy Gain", value: "+38% Better" },
          { label: "Docs Handled", value: "10M+ Pages" },
        ],
        architectureDetails: [
          "Fast PDF and table parser for structured data extraction",
          "Two-stage search with semantic ranking for high accuracy",
          "Interactive chat interface with hoverable citations and markdown support",
        ],
        liveUrl: "https://aurarag-preview.vercel.app",
        githubUrl: "https://github.com/nisaldev/aurarag-engine",
        featured: true,
      },
      {
        id: "hyper-scalable-fintech-gateway",
        title: "PulseTrade: Real-Time Trading & Market Dashboard",
        category: "Full Stack Web",
        tagline: "Fast real-time cryptocurrency and stock trading platform with interactive live charts.",
        description:
          "A modern financial web application featuring live price streaming, interactive candlestick charts, instant trade simulation, and secure user authentication.",
        fullOverview:
          "A high-performance full-stack trading application built with Next.js 16, TypeScript, and Go. It uses WebSockets for instant live data streaming and canvas rendering for smooth 60fps price charts.",
        image: "",
        tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Go / Golang", "Redis", "WebGL", "Kafka"],
        metrics: [
          { label: "Live Updates", value: "Real-Time" },
          { label: "Concurrent Users", value: "100k+" },
          { label: "Uptime", value: "99.99%" },
        ],
        architectureDetails: [
          "Fast WebSocket communication for live market prices",
          "Smooth 60fps chart rendering using HTML5 Canvas",
          "Reliable transaction management and data caching with Redis",
        ],
        liveUrl: "https://pulsetrade-demo.vercel.app",
        githubUrl: "https://github.com/nisaldev/pulsetrade-gateway",
        featured: true,
      },
      {
        id: "cloud-telemetry-fabric",
        title: "KubePulse: Cloud & Kubernetes Monitoring Dashboard",
        category: "Cloud & Distributed",
        tagline: "Real-time cluster health monitoring and automated alerts for Docker and Kubernetes.",
        description:
          "A clean monitoring dashboard that tracks server health, container status, and memory usage in real time, alerting developers before server crashes occur.",
        fullOverview:
          "KubePulse provides a visual overview of microservices and server health. It collects Prometheus metrics and uses AI to explain server error logs in plain English for faster troubleshooting.",
        image: "",
        tags: ["Kubernetes", "eBPF", "Prometheus", "Next.js", "Golang", "Framer Motion", "Three.js"],
        metrics: [
          { label: "Issue Resolution", value: "65% Faster" },
          { label: "Monitored Nodes", value: "500+" },
          { label: "Alert Accuracy", value: "99.1%" },
        ],
        architectureDetails: [
          "Direct system metric collection without slowing down servers",
          "Interactive health status map with visual alerts",
          "Automated notifications when servers need attention",
        ],
        liveUrl: "https://kubepulse.vercel.app",
        githubUrl: "https://github.com/nisaldev/kubepulse-fabric",
      },
      {
        id: "neural-creative-studio",
        title: "SynapseStudio: Visual AI Canvas & Design Studio",
        category: "AI & Agents",
        tagline: "Visual workflow builder connecting AI image generators, text models, and editing tools.",
        description:
          "An interactive visual canvas where creators can connect AI tools together to generate images, write text, and create design assets in one place.",
        fullOverview:
          "An easy-to-use creative workspace with infinite zoom and drag-and-drop nodes. Users can chain together image generators and text assistants, with real-time multi-user collaboration.",
        image: "",
        tags: ["React Flow", "Next.js 16", "Stable Diffusion", "WebRTC", "Tailwind CSS", "CUDA"],
        metrics: [
          { label: "Generation Speed", value: "Fast GPU" },
          { label: "Canvas Smoothness", value: "60 FPS" },
          { label: "Active Users", value: "25k+" },
        ],
        architectureDetails: [
          "Infinite drag-and-drop canvas powered by React Flow",
          "Real-time collaboration allowing multiple users to edit together",
          "Fast model processing with modern web acceleration",
        ],
        liveUrl: "https://synapsestudio-ai.vercel.app",
        githubUrl: "https://github.com/nisaldev/synapse-studio",
      },
      {
        id: "developer-productivity-os",
        title: "DevFlow: In-Browser Code Editor & AI Workspace",
        category: "Full Stack Web",
        tagline: "Fast code editor, terminal, and AI programming assistant running directly in the browser.",
        description:
          "A full-featured coding workspace in the browser with instant project setup, syntax highlighting, an integrated terminal, and AI code assistance.",
        fullOverview:
          "Allows developers to start coding instantly without installing local dependencies. Powered by WebAssembly and Monaco Editor with smart autocomplete and project sharing.",
        image: "",
        tags: ["WebAssembly", "TypeScript", "Next.js", "Monaco Editor", "Tailwind CSS", "Node.js"],
        metrics: [
          { label: "Startup Time", value: "< 350ms" },
          { label: "Memory Usage", value: "< 80MB" },
          { label: "User Rating", value: "98.4%" },
        ],
        architectureDetails: [
          "Instant code execution in the browser using WebAssembly",
          "Monaco code editor with smart AI auto-complete",
          "Secure project saving with one-click sharing links",
        ],
        liveUrl: "https://devflow-os.vercel.app",
        githubUrl: "https://github.com/nisaldev/devflow-os",
      },
    ],
  },
  articlesSection: {
    subBadge: "Articles & Insights",
    titleMain: "Technical",
    titleAccent: "Articles",
    titleEnd: "& Guides",
    description: "Practical guides and tutorials on building AI applications, modern web development, and database architecture.",
    articles: [
      {
        id: "langgraph-agentic-patterns-2026",
        title: "Building Reliable Multi-Agent AI Systems: Best Practices and Architecture",
        category: "AI Systems",
        readTime: "8 min read",
        publishedDate: "Feb 2026",
        slug: "architecting-multi-agent-swarms",
        tags: ["Agents", "LangGraph", "System Design", "LLMs"],
        excerpt:
          "How to build multi-agent AI applications with clear task division, shared memory, and automated error handling to achieve dependable results.",
        content: [
          "In modern AI development, connecting multiple specialized AI assistants produces much better results than relying on single prompts. However, making these systems reliable requires careful design.",
          "Key practices include: 1) Giving each AI agent a clear, single responsibility, 2) Validating data formats between agents, and 3) Providing a shared memory database so agents do not lose context.",
          "By implementing validation checks between agent steps, task success rates in automated code and research pipelines improve dramatically.",
        ],
      },
      {
        id: "nextjs16-app-router-zero-latency",
        title: "Speeding Up Next.js 16 & React 19 for Instant Page Loads",
        category: "Web Architecture",
        readTime: "6 min read",
        publishedDate: "Jan 2026",
        slug: "nextjs16-zero-latency-patterns",
        tags: ["Next.js 16", "React 19", "Performance", "Edge Runtime"],
        excerpt:
          "Using Partial Prerendering (PPR), streaming components, and smart caching to make web applications load instantly.",
        content: [
          "Users expect modern web applications to respond instantly. Next.js Partial Prerendering makes this possible by sending the static page layout immediately while streaming dynamic data in the background.",
          "In this guide, we walk through setting up smart caching, optimizing Tailwind CSS for small bundle sizes, and ensuring smooth UI updates with React 19.",
        ],
      },
      {
        id: "vector-embeddings-at-scale",
        title: "Scaling Vector Databases for Fast Search Over Millions of Records",
        category: "Distributed Systems",
        readTime: "10 min read",
        publishedDate: "Dec 2025",
        slug: "scaling-hybrid-vector-search",
        tags: ["Vector DB", "Qdrant", "HNSW", "Embeddings"],
        excerpt:
          "A practical comparison of vector indexing methods and databases to keep search fast and memory usage low.",
        content: [
          "As vector databases grow from thousands to millions of entries, keeping search fast and server memory manageable becomes important.",
          "This article explains indexing techniques like HNSW and quantization, and shares real-world performance comparisons between Pinecone, Qdrant, and PostgreSQL.",
        ],
      },
      {
        id: "ebpf-and-ai-observability",
        title: "Server & Container Monitoring for High-Performance AI Applications",
        category: "Distributed Systems",
        readTime: "7 min read",
        publishedDate: "Nov 2025",
        slug: "ebpf-ai-observability",
        tags: ["eBPF", "Kubernetes", "Monitoring", "DevOps"],
        excerpt:
          "How to monitor CPU, GPU, and memory performance in Linux and Kubernetes to prevent application slowdowns.",
        content: [
          "Monitoring servers during heavy machine learning workloads is essential to prevent sudden crashes. Using lightweight Linux tools, we can track memory usage and network traffic without slowing down the application.",
          "Combining real-time metrics with automated alerts helps developers catch issues before they affect end users.",
        ],
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
