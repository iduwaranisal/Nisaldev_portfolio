"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle, Cpu, Sparkles } from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import { Project } from "@/data/portfolioData";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-warm-lg z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 border border-stone-200 text-slate-700 hover:text-slate-950 hover:bg-stone-50 transition-colors shadow-warm-sm cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header Image */}
          <div className="relative w-full h-56 sm:h-72 shrink-0 overflow-hidden bg-stone-100 flex items-center justify-center">
            {project.image && !project.image.includes("unsplash.com") ? (
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover object-center"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 via-white to-amber-50 border-b border-stone-100 relative overflow-hidden">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 mb-3">
                  <Cpu className="w-8 h-8" />
                </div>
                <h4 className="text-sm font-mono font-bold text-orange-700 uppercase tracking-widest">
                  {project.category}
                </h4>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />

            <div className="absolute bottom-4 left-6 right-6 flex flex-wrap items-end justify-between gap-2">
              <span className="px-3 py-1 rounded-full bg-white/95 border border-orange-200 text-orange-700 text-xs font-mono font-bold shadow-warm-sm backdrop-blur-md">
                {project.category}
              </span>
            </div>
          </div>

          {/* Modal Body (Scrollable) */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                {project.title}
              </h3>
              <p className="text-orange-600 font-mono text-sm mt-1 font-semibold">{project.tagline}</p>
            </div>

            {/* Performance Metrics */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-orange-50/60 border border-orange-100 flex flex-col"
                  >
                    <span className="text-xs text-slate-500 font-medium">{metric.label}</span>
                    <span className="text-xl font-bold font-mono text-orange-600 mt-0.5">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Overview */}
            <div className="space-y-2">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-500" />
                <span>Architecture & Overview</span>
              </h4>
              <p className="text-slate-600 text-sm leading-relaxed">{project.fullOverview}</p>
            </div>

            {/* Architectural Highlights */}
            {project.architectureDetails && project.architectureDetails.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-700 font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Key Engineering Highlights</span>
                </h4>
                <ul className="space-y-2">
                  {project.architectureDetails.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tech Stack Tags */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-mono">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 rounded-lg bg-stone-100 border border-stone-200 text-xs font-mono text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action CTAs */}
            <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-4">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm shadow-warm-sm hover:shadow-warm-md transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                </a>
              )}

              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-slate-700 hover:text-slate-900 hover:border-orange-300 text-xs sm:text-sm transition-all"
                >
                  <GithubIcon className="w-4 h-4" />
                  <span>View Repository</span>
                </a>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
