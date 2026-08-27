import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackgroundElements from "@/components/BackgroundElements";
import ScrollProgress from "@/components/ScrollProgress";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { getCachedPortfolioData } from "@/lib/getPortfolioData";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: true,
});

export const viewport: Viewport = {
  themeColor: "#FFF7ED",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const DOMAIN = "https://iduwaranisal.dev";

export const metadata: Metadata = {
  metadataBase: new URL(DOMAIN),
  title: {
    default: "Iduwara Nisal | AI Architect & Senior Full Stack Developer",
    template: "%s | Iduwara Nisal",
  },
  description:
    "Official portfolio of Iduwara Nisal (iduwaranisal.dev) — AI Architect & Senior Full Stack Developer specializing in Autonomous Agent Swarms, LangGraph, Multimodal RAG, Distributed Cloud Systems, and Next.js 16 Applications.",
  applicationName: "Iduwara Nisal Portfolio",
  authors: [{ name: "Iduwara Nisal", url: DOMAIN }],
  generator: "Next.js 16",
  keywords: [
    "Iduwara Nisal",
    "iduwaranisal",
    "iduwaranisal.dev",
    "AI Architect",
    "Senior Full Stack Developer",
    "Autonomous Agent Swarms",
    "LangGraph",
    "Multimodal RAG",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "PyTorch",
    "Distributed Cloud Systems",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Iduwara Nisal",
  publisher: "Iduwara Nisal",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: DOMAIN,
  },
  openGraph: {
    title: "Iduwara Nisal | AI Architect & Senior Full Stack Developer",
    description:
      "Architecting high-throughput Autonomous AI Agent Swarms, Multimodal RAG pipelines, and cutting-edge 60fps Next.js 16 web applications.",
    url: DOMAIN,
    siteName: "Iduwara Nisal | AI Architect",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iduwara Nisal | AI Architect & Senior Full Stack Developer",
    description:
      "Designing low-latency multimodal AI pipelines, autonomous multi-agent swarms, and enterprise distributed systems.",
    creator: "@iduwaranisal",
    site: "@iduwaranisal",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialData = await getCachedPortfolioData();

  const jsonLdPerson = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Iduwara Nisal",
    alternateName: ["iduwaranisal", "Nisal", "Nisal R."],
    url: DOMAIN,
    image: initialData.general.profileImage || `${DOMAIN}/profile.png`,
    jobTitle: "AI Architect & Senior Full Stack Developer",
    worksFor: {
      "@type": "Organization",
      name: "Autonomous Intelligence Systems",
    },
    sameAs: [
      initialData.socialLinks.github || "https://github.com/iduwaranisal",
      initialData.socialLinks.linkedin || "https://linkedin.com/in/iduwaranisal",
      initialData.socialLinks.twitter || "https://twitter.com/iduwaranisal",
    ],
    knowsAbout: [
      "Artificial Intelligence Architecture",
      "Multi-Agent Swarms",
      "LangGraph",
      "Retrieval-Augmented Generation (RAG)",
      "Next.js 16",
      "React 19",
      "TypeScript",
      "PyTorch",
      "Distributed Cloud Computing",
    ],
    description: initialData.general.bio,
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Iduwara Nisal | AI Architect & Full Stack Developer",
    url: DOMAIN,
    description:
      "Official portfolio showcasing production AI architectures, case studies, and engineering research by Iduwara Nisal.",
    author: {
      "@type": "Person",
      name: "Iduwara Nisal",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="bg-[#FAF9F6] text-slate-900 min-h-screen relative font-sans antialiased selection:bg-orange-500/20 selection:text-orange-950">
        <PortfolioProvider initialData={initialData}>
          <ScrollProgress />
          <BackgroundElements />
          <div className="relative z-10">{children}</div>
        </PortfolioProvider>
      </body>
    </html>
  );
}
