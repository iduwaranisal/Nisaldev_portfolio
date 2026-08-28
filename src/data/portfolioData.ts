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
    bento: BentoConfig;
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
    subBadge: "Tech Arsenal & Capabilities",
    titleMain: "Engineering",
    titleAccent: "Skills",
    titleEnd: "& Architecture",
    description: "I enjoy building the entire product rather than just training the AI—from setting up the database to creating the user interface and getting the application live on the internet. Always happy to connect and chat about software design, practical AI, and new technical ideas.",
    bento: {
      bento1: {
        badge: "Machine Learning & AI",
        title: "Artificial Intelligence",
        description: "I work with tools like PyTorch, large language models (Hugging Face, LangChain), and vector databases to create smart, data-driven features.",
        tags: [
          "PyTorch & Deep Learning",
          "Large Language Models (LLMs)",
          "Hugging Face Transformers",
          "LangChain & Agent Workflows",
          "Vector Databases & Embeddings",
          "Data-Driven AI Features",
        ],
        metric1Label: "Core AI Frameworks",
        metric1Value: "PyTorch & LangChain",
        metric2Label: "Models & Data",
        metric2Value: "Hugging Face & Vectors",
      },
      bento2: {
        badge: "Full-Stack Web",
        title: "Web Development",
        description: "I build complete, interactive applications using Python (Django), Next.js, and the MERN stack.",
        skillBars: [
          { name: "Next.js 16 & React", level: "96%" },
          { name: "Python (Django)", level: "92%" },
          { name: "MERN Stack (MongoDB, Express, React, Node)", level: "94%" },
          { name: "TypeScript & Tailwind CSS", level: "95%" },
        ],
        metricLabel: "Interactive Architecture",
        metricValue: "Next.js · Django · MERN",
      },
      bento3: {
        title: "Deployment & Operations",
        description: "I make sure these applications run smoothly and reliably online using Linux, Docker, Kubernetes, and automated release processes (CI/CD).",
        tags: ["Linux Administration", "Docker Containers", "Kubernetes (K8s)", "CI/CD Pipelines", "Automated Releases", "Cloud Infrastructure"],
      },
      bento4: {
        title: "Databases & Vector Stores",
        description: "Designing end-to-end data persistence layers with vector search, relational modeling, and high-speed document stores.",
        tags: ["Vector Databases", "MongoDB", "PostgreSQL", "Redis", "Django ORM", "Mongoose"],
      },
      bento5: {
        title: "Engineering Philosophy",
        principles: [
          "End-to-End Product Lifecycle Ownership",
          "Connecting ML with Reliable Software Engineering",
          "Automated CI/CD & Resilient Cloud Deployments",
        ],
      },
    },
  },
  projectsSection: {
    subBadge: "Featured Innovations",
    titleMain: "Architected",
    titleAccent: "Projects",
    titleEnd: "& Deployments",
    description: "Real-world systems engineered for low latency, autonomous intelligence, and seamless user experiences.",
    categories: ["All", "AI & Agents", "Full Stack Web", "Cloud & Distributed"],
    projects: [
      {
        id: "agentic-orchestrator",
        title: "NeuroMesh: Autonomous Agent Swarm Orchestrator",
        category: "AI & Agents",
        tagline: "Self-healing distributed multi-agent swarm with hierarchical reasoning & dynamic memory banks.",
        description:
          "A high-throughput orchestration engine allowing autonomous agents to dynamically decompose tasks, cross-validate hypotheses, and query vector memory stores with sub-50ms latency.",
        fullOverview:
          "NeuroMesh coordinates fleets of specialized LLM agents (researchers, coders, validators, tool executors) over WebSockets and gRPC. It leverages LangGraph patterns, hierarchical episodic memory (Qdrant + Redis caching), and dynamic fallback routing across Gemini, Claude, and local vLLM instances.",
        image: "",
        tags: ["LangGraph", "PyTorch", "vLLM", "Qdrant", "Next.js 16", "WebSockets", "FastAPI"],
        metrics: [
          { label: "Token Throughput", value: "3.2k tok/sec" },
          { label: "Task Success Rate", value: "94.8%" },
          { label: "Memory Reduction", value: "40% (Quantized)" },
        ],
        architectureDetails: [
          "Dynamic DAG workflow scheduler with asynchronous stream processing",
          "Episodic memory recall with hybrid sparse-dense vector embedding search",
          "Zero-latency streaming telemetry dashboard built with Next.js 16 App Router",
        ],
        liveUrl: "https://neuromesh-demo.vercel.app",
        githubUrl: "https://github.com/nisaldev/neuromesh-orchestrator",
        featured: true,
      },
      {
        id: "realtime-enterprise-rag",
        title: "AuraRAG: Enterprise Multimodal Knowledge Engine",
        category: "AI & Agents",
        tagline: "Ultra-low latency hybrid search & cross-encoder re-ranking for multi-million document repositories.",
        description:
          "Enterprise document intelligence platform supporting PDF parsing, table extraction, OCR, dense embedding generation, and contextual hallucination guardrails.",
        fullOverview:
          "Engineered to ingest complex corporate data silos in real time. AuraRAG uses ColBERTv2 for late-interaction token scoring, rerankers for top-k precision, and automated citation synthesis with verifiable source attribution.",
        image: "",
        tags: ["ColBERT", "Pinecone", "Next.js", "TypeScript", "Tailwind CSS", "Docker", "Python"],
        metrics: [
          { label: "Query Latency", value: "< 42ms" },
          { label: "Accuracy Gain", value: "+38% vs Dense RAG" },
          { label: "Docs Indexed", value: "12.5M+" },
        ],
        architectureDetails: [
          "Chunk-aware streaming parser with layout analysis & table reconstruction",
          "Dynamic contextual reranking with cross-encoders",
          "Real-time streaming UI with inline citation hovering and markdown rendering",
        ],
        liveUrl: "https://aurarag-preview.vercel.app",
        githubUrl: "https://github.com/nisaldev/aurarag-engine",
        featured: true,
      },
      {
        id: "hyper-scalable-fintech-gateway",
        title: "PulseTrade: High-Frequency Crypto & Asset Platform",
        category: "Full Stack Web",
        tagline: "Sub-millisecond orderbook execution engine with animated glassmorphism trading UI.",
        description:
          "Modern Web3 & FinTech trading suite featuring instant order routing, real-time depth charts, responsive charting with WebGL, and biometric auth.",
        fullOverview:
          "A flagship full-stack architecture processing millions of order events. The frontend leverages React 19 concurrent features and Canvas 2D WebGL rendering to display 60fps live market ticks without UI thread bottlenecking.",
        image: "",
        tags: ["Next.js 16", "TypeScript", "Tailwind CSS", "Go / Golang", "Redis", "WebGL", "Kafka"],
        metrics: [
          { label: "Order Execution", value: "< 2.1ms" },
          { label: "Concurrent Connections", value: "150k" },
          { label: "Uptime", value: "99.999%" },
        ],
        architectureDetails: [
          "Zero-copy WebSocket binary data deserialization with Protocol Buffers",
          "Hardware-accelerated candlestick rendering at constant 60fps",
          "Atomic distributed lock management with Redis clusters",
        ],
        liveUrl: "https://pulsetrade-demo.vercel.app",
        githubUrl: "https://github.com/nisaldev/pulsetrade-gateway",
        featured: true,
      },
      {
        id: "cloud-telemetry-fabric",
        title: "KubePulse: Intelligent Kubernetes Observability",
        category: "Cloud & Distributed",
        tagline: "AI-powered anomaly detection & predictive pod autoscaling dashboard for cloud-native clusters.",
        description:
          "Distributed telemetry daemon and sleek dashboard that ingests Prometheus metrics, traces eBPF probes, and triggers autonomous remediation actions.",
        fullOverview:
          "KubePulse visualizes microservice dependencies as a living 3D graph. It utilizes an embedded lightweight LLM agent to inspect anomalous container crash loops and automatically output root cause post-mortems.",
        image: "",
        tags: ["Kubernetes", "eBPF", "Prometheus", "Next.js", "Golang", "Framer Motion", "Three.js"],
        metrics: [
          { label: "MTTR Reduction", value: "65%" },
          { label: "Cluster Nodes", value: "500+" },
          { label: "Anomaly Precision", value: "99.1%" },
        ],
        architectureDetails: [
          "Kernel-level eBPF packet sniffing without sidecar overhead",
          "Dynamic topology graph with real-time health gradient shading",
          "Zero-downtime canary deployment automation",
        ],
        liveUrl: "https://kubepulse.vercel.app",
        githubUrl: "https://github.com/nisaldev/kubepulse-fabric",
      },
      {
        id: "neural-creative-studio",
        title: "SynapseStudio: Generative Multimodal Design Canvas",
        category: "AI & Agents",
        tagline: "Node-based generative AI studio linking Diffusion models, LLM copywriters, and audio generators.",
        description:
          "Interactive node-based canvas for digital artists and engineers to compose generative AI workflows, layer latent spaces, and export high-res assets.",
        fullOverview:
          "A creative powerhouse featuring infinite canvas zoom/pan, real-time node evaluation, local TensorRT acceleration, and collaborative multiplayer state synchronization using WebRTC.",
        image: "",
        tags: ["React Flow", "Next.js 16", "Stable Diffusion", "WebRTC", "Tailwind CSS", "CUDA"],
        metrics: [
          { label: "Render Speedup", value: "4.5x via TensorRT" },
          { label: "Canvas FPS", value: "60 fps constant" },
          { label: "Active Creators", value: "25k+" },
        ],
        architectureDetails: [
          "Infinite virtualized canvas with GPU-accelerated shader passes",
          "CRDT-based state reconciliation for real-time team collaboration",
          "Custom ONNX runtime integration for edge neural inferencing",
        ],
        liveUrl: "https://synapsestudio-ai.vercel.app",
        githubUrl: "https://github.com/nisaldev/synapse-studio",
      },
      {
        id: "developer-productivity-os",
        title: "DevFlow OS: Next-Gen Developer Workspace",
        category: "Full Stack Web",
        tagline: "Unified terminal, code sandboxing, and AI pair-programming environment running directly in the browser.",
        description:
          "Modern cloud development environment with WebContainers, instant hot reloading, automated test runners, and contextual code explanations.",
        fullOverview:
          "Brings the full desktop IDE experience to the browser. Powered by WebAssembly, virtualized file systems, and seamless Git integrations.",
        image: "",
        tags: ["WebAssembly", "TypeScript", "Next.js", "Monaco Editor", "Tailwind CSS", "Node.js"],
        metrics: [
          { label: "Boot Time", value: "< 350ms" },
          { label: "Wasm Memory", value: "< 80MB" },
          { label: "Satisfaction", value: "98.4%" },
        ],
        architectureDetails: [
          "In-browser Node.js runtime emulation powered by WebAssembly",
          "Monaco editor customized with AI code completion hooks",
          "End-to-end encrypted project storage with instant sharing URLs",
        ],
        liveUrl: "https://devflow-os.vercel.app",
        githubUrl: "https://github.com/nisaldev/devflow-os",
      },
    ],
  },
  articlesSection: {
    subBadge: "Engineering Insights & Writing",
    titleMain: "Technical",
    titleAccent: "Publications",
    titleEnd: "",
    description: "In-depth architectural breakdowns on autonomous multi-agent swarms, zero-latency frontend engineering, and distributed vector infrastructure.",
    articles: [
      {
        id: "langgraph-agentic-patterns-2026",
        title: "Architecting Resilient Multi-Agent Swarms: Beyond Simple ReAct Loops",
        category: "AI Systems",
        readTime: "8 min read",
        publishedDate: "Feb 2026",
        slug: "architecting-multi-agent-swarms",
        tags: ["Agents", "LangGraph", "System Design", "LLMs"],
        excerpt:
          "A deep dive into building deterministic multi-agent state machines with hierarchical supervisor routing, episodic vector memory, and self-healing error recovery.",
        content: [
          "In 2026, single-prompt LLM wrappers have given way to resilient, asynchronous agentic swarms. Building systems that do not hallucinate when executing multi-step business logic requires moving beyond naive ReAct loops.",
          "Key takeaways include: 1) Strict state machine definitions with cycle detection, 2) Partitioning agent responsibilities with dedicated schema validation, and 3) Separating transient context from persistent episodic memory vectors.",
          "By deploying cross-agent validation gates, production failure rates in autonomous code generation pipelines can be reduced from 32% down to under 5%.",
        ],
      },
      {
        id: "nextjs16-app-router-zero-latency",
        title: "Optimizing Next.js 16 & React 19 for Sub-50ms Global TTFB",
        category: "Web Architecture",
        readTime: "6 min read",
        publishedDate: "Jan 2026",
        slug: "nextjs16-zero-latency-patterns",
        tags: ["Next.js 16", "React 19", "Performance", "Edge Runtime"],
        excerpt:
          "Exploiting Partial Prerendering (PPR), streaming Suspense boundaries, and Edge Data Caching to build responsive interfaces with instant initial loads.",
        content: [
          "Modern web applications must feel instantaneous regardless of the client's geographical location. Next.js Partial Prerendering represents a paradigm shift by delivering static shells immediately while streaming dynamic AI responses concurrently.",
          "We explore edge middleware authentication caching, zero-bundle CSS optimization with modern Tailwind, and memory management during high-frequency WebSocket state updates.",
        ],
      },
      {
        id: "vector-embeddings-at-scale",
        title: "Scaling Hybrid Vector Search to 50M+ Records with Sub-10ms Latency",
        category: "Distributed Systems",
        readTime: "10 min read",
        publishedDate: "Dec 2025",
        slug: "scaling-hybrid-vector-search",
        tags: ["Vector DB", "Qdrant", "HNSW", "Embeddings"],
        excerpt:
          "Benchmarking HNSW, Scalar Quantization (SQ8), and sparse BM25 indices to achieve balanced recall and lightning-fast query execution.",
        content: [
          "When vector indices exceed millions of dimensions, memory saturation and query degradation become critical challenges. Product Quantization and Binary Quantization offer massive memory savings with negligible accuracy degradation.",
          "This article shares production benchmarks comparing Pinecone, Qdrant, and pgvector under heavy concurrent read/write workloads.",
        ],
      },
      {
        id: "ebpf-and-ai-observability",
        title: "Zero-Overhead AI Cluster Observability with eBPF and LLM Diagnostic Agents",
        category: "Distributed Systems",
        readTime: "7 min read",
        publishedDate: "Nov 2025",
        slug: "ebpf-ai-observability",
        tags: ["eBPF", "Kubernetes", "AI Observability", "DevOps"],
        excerpt:
          "Tracing distributed GPU kernel memory bottlenecks and network socket contention directly inside the Linux kernel without injecting code into userland.",
        content: [
          "Monitoring high-throughput GPU clusters during distributed LLM training often adds unwanted latency. Using eBPF probes, we trace socket latency and memory paging in real time.",
          "Pairing this telemetry with a lightweight on-cluster diagnostic agent provides instant automated alerts before cluster nodes experience out-of-memory cascading panics.",
        ],
      },
    ],
  },
  contactSection: {
    subBadge: "Let's Build Together",
    titleMain: "Start an",
    titleAccent: "Intelligent",
    titleEnd: "Conversation",
    description: "Whether you are exploring autonomous agent workflows, scaling a high-throughput Next.js application, or seeking technical advisory, I'm ready to architect the solution.",
    email: "nisal.dev.ai@gmail.com",
    location: "San Francisco, CA & Remote",
    resumePdfUrl: "/resume.pdf",
    resumeCardTitle: "Full Technical Resume",
    resumeCardDesc: "Updated PDF covering full career trajectory & patents.",
  },
  socialLinks: {
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    twitter: "https://x.com",
    discord: "https://discord.com",
  },
  footer: {
    brandTitle: "Nisal R.",
    brandSub: "/ AI Architect",
    tagline: "Architecting intelligent neural systems, autonomous swarms & scalable web applications.",
    copyrightText: "All rights reserved.",
    creditsText: "Engineered with Next.js 16 · TypeScript · Tailwind CSS · Distributed Systems",
  },
};
