import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Iduwara Nisal Palihawadana | AI Architect & Full Stack Developer",
    short_name: "Iduwara Nisal",
    description:
      "Official portfolio of Iduwara Nisal Palihawadana - AI Architect & Full Stack Developer. Sabaragamuwa University Information Systems student building production AI and web applications.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF9F6",
    theme_color: "#FFF7ED",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
