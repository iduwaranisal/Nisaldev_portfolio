import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BentoGrid from "@/components/BentoGrid";

// Dynamic imports for below-the-fold components
const ProjectShowcase = dynamic(() => import("@/components/ProjectShowcase"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const BlogSection = dynamic(() => import("@/components/BlogSection"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});

const TestimonialsSection = dynamic(() => import("@/components/TestimonialsSection"), {
  ssr: true,
  loading: () => <div className="min-h-[300px]" />,
});

const ContactSection = dynamic(() => import("@/components/ContactSection"), {
  ssr: true,
  loading: () => <div className="min-h-[400px]" />,
});

const Footer = dynamic(() => import("@/components/Footer"), {
  ssr: true,
});

export const revalidate = 60; // ISR cache revalidation at edge

export default function Home() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-orange-500/20 selection:text-orange-950">
      <Navbar />
      <Hero />
      <BentoGrid />
      <ProjectShowcase />
      <BlogSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
