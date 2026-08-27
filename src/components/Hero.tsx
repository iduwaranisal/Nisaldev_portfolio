"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Download,
  Zap,
  Brain,
  Code2,
  Cpu,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Hero() {
  const { data } = usePortfolio();
  const { general, contactSection } = data;

  return (
    <section
      id="home"
      className="relative min-h-[88vh] pt-28 pb-16 lg:pt-36 lg:pb-24 flex items-center justify-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Text & CTAs (Span 7) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="lg:col-span-7 flex flex-col items-start text-left space-y-6"
          >
            {/* Availability Sub-badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200/80 shadow-xs">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
              </span>
              <span className="text-xs font-mono font-bold text-orange-700">
                {general.availabilityStatus}
              </span>
            </div>

            {/* Main Titles */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight font-display leading-[1.08]">
                <span className="block text-slate-900">
                  {general.role1}
                </span>
                <span className="block text-gradient-orange font-extrabold">
                  {general.role2}
                </span>
              </h1>
            </div>

            {/* Headline Tagline */}
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-700 font-sans max-w-2xl">
              {general.tagline}
            </h2>

            {/* Bio Description */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
              {general.bio}
            </p>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 w-full sm:w-auto">
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-warm-md hover:shadow-warm-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{general.primaryBtnText}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </a>

              <a
                href="#articles"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-slate-700 bg-white border border-stone-200 hover:border-orange-400 hover:text-orange-600 shadow-warm-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-orange-500" />
                <span>{general.secondaryBtnText}</span>
              </a>

              <a
                href={contactSection.resumePdfUrl || "/resume.pdf"}
                target="_blank"
                rel="noopener noreferrer"
                download="Resume_Iduwara_Nisal.pdf"
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-semibold text-xs text-slate-600 hover:text-orange-600 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>{general.resumeBtnText}</span>
              </a>
            </div>

            {/* Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 w-full max-w-2xl border-t border-stone-200">
              {general.stats.map((stat, i) => (
                <div key={i} className="flex flex-col">
                  <span className="text-xl sm:text-2xl font-bold font-mono text-slate-900">
                    {stat.value}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column: Clean, Peaceful Profile Frame */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
          >
            <div className="relative group w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[340px]">
              {/* Minimal Border Frame */}
              <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-orange-400/50 via-amber-300/40 to-orange-300/40 shadow-warm-lg">
                <div className="relative overflow-hidden rounded-[23px] bg-white p-2">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-stone-100 flex items-center justify-center">
                    {general.profileImage ? (
                      <Image
                        src={general.profileImage}
                        alt={general.name}
                        fill
                        priority
                        sizes="(max-width: 768px) 280px, 340px"
                        className="object-cover object-center group-hover:scale-102 transition-transform duration-300 ease-out"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-5 text-center space-y-3 relative overflow-hidden bg-white">
                        <div className="w-16 h-16 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                          <Cpu className="w-8 h-8 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 font-display">
                            {general.name}
                          </h3>
                          <p className="text-[11px] text-orange-600 font-mono mt-0.5">
                            {general.role1}
                          </p>
                        </div>
                        <div className="flex gap-1.5">
                          <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[9px] font-mono text-orange-700">
                            Neural Swarms
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[9px] font-mono text-orange-700">
                            Next.js 16
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Info Pill */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 p-2.5 rounded-xl bg-white/95 border border-stone-200/80 flex items-center justify-between shadow-warm-sm backdrop-blur-md">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center">
                          <Brain className="w-3.5 h-3.5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-slate-900">{general.name}</p>
                          <p className="text-[9px] text-orange-600 font-mono font-medium">{general.role1}</p>
                        </div>
                      </div>
                      <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Tech Badges */}
              <div className="absolute -top-2.5 -left-2.5 sm:-left-3.5 px-2.5 py-1 rounded-xl bg-white border border-orange-200 shadow-warm-md flex items-center gap-1.5">
                <Zap className="w-3 h-3 text-orange-500" />
                <span className="text-[11px] font-mono font-bold text-slate-800">
                  {general.floatingBadge1}
                </span>
              </div>

              <div className="absolute -bottom-2.5 -right-2.5 sm:-right-3.5 px-2.5 py-1 rounded-xl bg-white border border-amber-200 shadow-warm-md flex items-center gap-1.5">
                <Code2 className="w-3 h-3 text-amber-500" />
                <span className="text-[11px] font-mono font-bold text-slate-800">
                  {general.floatingBadge2}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
