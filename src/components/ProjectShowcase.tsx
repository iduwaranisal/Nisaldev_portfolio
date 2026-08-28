"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  Cpu,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Project } from "@/data/portfolioData";
import ProjectModal from "./ProjectModal";
import { GithubIcon } from "./Icons";

export default function ProjectShowcase() {
  const { data } = usePortfolio();
  const { projectsSection } = data;
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const allFilteredProjects =
    activeCategory === "All"
      ? projectsSection.projects
      : projectsSection.projects.filter((p) => p.category === activeCategory);

  // Maximum 6 projects displayed on the home page showcase
  const displayedProjects = allFilteredProjects.slice(0, 6);

  return (
    <section id="projects" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-500" />
              <span>{projectsSection.subBadge}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
              {projectsSection.titleMain}{" "}
              <span className="text-gradient-orange">{projectsSection.titleAccent}</span>{" "}
              {projectsSection.titleEnd}
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {projectsSection.description}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {projectsSection.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold shadow-warm-sm"
                    : "bg-white text-slate-600 border border-stone-200 hover:border-orange-300 hover:text-slate-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Responsive Grid (Max 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project) => (
            <article
              key={project.id}
              className="group relative rounded-3xl bg-white border border-stone-200 hover:border-orange-300 overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-warm-sm hover:shadow-warm-md hover:-translate-y-1"
            >
              {/* Project Image Container */}
              <div
                onClick={() => setSelectedProject(project)}
                className="relative aspect-video w-full overflow-hidden bg-stone-100 cursor-pointer group/img"
              >
                {project.image && !project.image.includes("unsplash.com") ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover/img:scale-103 transition-transform duration-300 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-orange-50 via-white to-amber-50 border-b border-stone-100 relative overflow-hidden">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mb-2">
                      <Cpu className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-700 uppercase tracking-wider">
                      {project.category}
                    </span>
                  </div>
                )}

                {/* Top Badge Overlay */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/90 border border-orange-200 text-[10px] font-mono font-bold text-orange-700 shadow-warm-sm backdrop-blur-md">
                    {project.category}
                  </span>
                  {project.featured && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-700">
                      Featured
                    </span>
                  )}
                </div>
              </div>

              {/* Project Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="text-lg font-bold text-slate-900 font-display group-hover:text-orange-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Key Metrics Strip */}
                {project.metrics && project.metrics.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100">
                    {project.metrics.slice(0, 2).map((m, i) => (
                      <div key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-100">
                        <p className="text-[10px] text-slate-400 font-mono font-medium truncate">{m.label}</p>
                        <p className="text-xs font-bold font-mono text-orange-600 truncate">{m.value}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 4).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-stone-50 border border-stone-200/60 text-[10px] font-mono text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags.length > 4 && (
                    <span className="px-2 py-1 rounded-lg bg-stone-50 text-[10px] font-mono text-slate-500">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-orange-600 hover:text-orange-700 transition-colors cursor-pointer"
                  >
                    <span>Case Study</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex items-center gap-2">
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-stone-50 hover:bg-orange-50 text-slate-500 hover:text-orange-600 border border-stone-200 transition-colors"
                        title="Source Code"
                      >
                        <GithubIcon className="w-4 h-4" />
                      </a>
                    )}
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-stone-50 hover:bg-orange-50 text-slate-500 hover:text-orange-600 border border-stone-200 transition-colors"
                        title="Live Deployment"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* See More Projects CTA Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-warm-md hover:shadow-warm-lg hover:scale-102 transition-all duration-200 cursor-pointer"
          >
            <span>See All Projects ({projectsSection.projects.length})</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Case Study Full Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
