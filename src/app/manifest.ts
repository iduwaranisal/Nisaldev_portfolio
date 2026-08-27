import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Iduwara Nisal | AI Architect & Full Stack Developer",
    short_name: "Iduwara Nisal",
    description:
      "Official portfolio of Iduwara Nisal - AI Architect & Senior Full Stack Developer specializing in Autonomous Agent Swarms, Multimodal RAG, Distributed Systems, and Next.js 16 Applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#020617",
    theme_color: "#020617",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
