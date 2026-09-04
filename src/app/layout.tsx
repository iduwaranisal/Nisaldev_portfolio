import type { Metadata, Viewport } from "next";
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import BackgroundElements from "@/components/BackgroundElements";
import ScrollProgress from "@/components/ScrollProgress";
import { PortfolioProvider } from "@/context/PortfolioContext";
import { ToastProvider } from "@/context/ToastContext";
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
    default: "Iduwara Nisal Palihawadana | AI Architect & Full Stack Developer",
    template: "%s | Iduwara Nisal Palihawadana",
  },
  description:
    "I am an Information Systems student at Sabaragamuwa University working toward becoming an AI Architect. My main focus is taking artificial intelligence from the testing phase and turning it into real, working web applications. I enjoy hands-on problem-solving and connecting machine learning with reliable software development.",
  applicationName: "Iduwara Nisal Palihawadana Portfolio",
  authors: [
    { name: "Iduwara Nisal Palihawadana", url: DOMAIN },
    { name: "Iduwara Nisal", url: DOMAIN },
  ],
  generator: "Next.js 16",
  keywords: [
    "Iduwara Nisal",
    "Iduwara Nisal Palihawadana",
    "iduwaranisal",
    "iduwaranisal.dev",
    "AI Architect Sri Lanka",
    "AI Architect",
    "Full Stack Developer",
    "Next.js",
    "Next.js 16",
    "MERN",
    "MERN Stack",
    "Python",
    "Django",
    "Machine Learning",
    "PyTorch",
    "LangChain",
    "Hugging Face",
    "Vector Databases",
    "Sabaragamuwa University",
    "Sabaragamuwa University of Sri Lanka",
    "Docker",
    "Kubernetes",
    "Linux",
    "CI/CD",
    "Web Development",
    "Software Engineering",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Iduwara Nisal Palihawadana",
  publisher: "Iduwara Nisal Palihawadana",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: DOMAIN,
  },
  openGraph: {
    title: "Iduwara Nisal Palihawadana | AI Architect & Full Stack Developer",
    description:
      "Information Systems student at Sabaragamuwa University working toward becoming an AI Architect. Turning AI into production-grade web applications using Next.js, Python, MERN, and PyTorch.",
    url: DOMAIN,
    siteName: "Iduwara Nisal Palihawadana | AI Architect & Full Stack Developer",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Iduwara Nisal Palihawadana | AI Architect & Full Stack Developer",
    description:
      "Information Systems student at Sabaragamuwa University working toward becoming an AI Architect. Bridging machine learning with reliable web development.",
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon.png",
      },
    ],
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
    name: "Iduwara Nisal Palihawadana",
    givenName: "Iduwara Nisal",
    familyName: "Palihawadana",
    additionalName: "Iduwara",
    alternateName: [
      "Iduwara Nisal",
      "iduwaranisal",
      "Nisal Palihawadana",
      "Iduwara Nisal (iduwaranisal)",
      "Nisal",
    ],
    url: DOMAIN,
    image: initialData.general.profileImage || `${DOMAIN}/profile.png`,
    jobTitle: "AI Architect & Full Stack Developer",
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "Sabaragamuwa University of Sri Lanka",
      sameAs: "https://www.sab.ac.lk",
    },
    affiliation: {
      "@type": "CollegeOrUniversity",
      name: "Sabaragamuwa University of Sri Lanka",
    },
    sameAs: [
      initialData.socialLinks.github || "https://github.com/iduwaranisal",
      initialData.socialLinks.linkedin || "https://linkedin.com/in/iduwaranisal",
      initialData.socialLinks.twitter || "https://twitter.com/iduwaranisal",
    ],
    knowsAbout: [
      "Web Development",
      "Artificial Intelligence",
      "Deployment & Operations",
      "Next.js",
      "Python",
      "Django",
      "MERN Stack",
      "PyTorch",
      "LangChain",
      "Hugging Face",
      "Vector Databases",
      "Machine Learning",
      "Linux",
      "Docker",
      "Kubernetes",
      "CI/CD",
    ],
    description: initialData.general.bio,
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Iduwara Nisal Palihawadana | AI Architect & Full Stack Developer",
    alternateName: [
      "Iduwara Nisal Portfolio",
      "iduwaranisal.dev",
      "Iduwara Nisal",
      "Iduwara Nisal Palihawadana",
    ],
    url: DOMAIN,
    description:
      "Official portfolio of Iduwara Nisal Palihawadana — AI Architect & Full Stack Developer. Sabaragamuwa University Information Systems student building production AI and web applications.",
    author: {
      "@type": "Person",
      name: "Iduwara Nisal Palihawadana",
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
          <ToastProvider>
            <ScrollProgress />
            <BackgroundElements />
            <div className="relative z-10">{children}</div>
          </ToastProvider>
        </PortfolioProvider>
      </body>
    </html>
  );
}
