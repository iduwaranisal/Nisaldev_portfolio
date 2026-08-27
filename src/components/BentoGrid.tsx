"use client";

import React from "react";
import {
  BrainCircuit,
  Layers,
  Server,
  Database,
  Cpu,
  CheckCircle2,
  Sparkles,
  Workflow,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function BentoGrid() {
  const { data } = usePortfolio();
  const { skillsSection } = data;
  const { bento } = skillsSection;

  return (
    <section id="skills" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
            <Cpu className="w-3.5 h-3.5 text-orange-500" />
            <span>{skillsSection.subBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            {skillsSection.titleMain}{" "}
            <span className="text-gradient-orange">{skillsSection.titleAccent}</span>{" "}
            {skillsSection.titleEnd}
          </h2>

          <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
            {skillsSection.description}
          </p>
        </div>

        {/* Apple-Style Asymmetric Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Bento 1: AI & Machine Learning (Span 7) */}
          <div className="md:col-span-7 rounded-3xl p-6 sm:p-8 bg-white border border-stone-200 hover:border-orange-300 transition-all duration-200 shadow-warm-sm hover:shadow-warm-md relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                    <BrainCircuit className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
                    {bento.bento1.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                    {bento.bento1.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{bento.bento1.description}</p>
                </div>

                {/* Skill Chips / Tags */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  {bento.bento1.tags.map((skill, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-orange-50/50 border border-orange-100 text-xs text-slate-700 font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Metric Banner */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-semibold">
                    {bento.bento1.metric1Label}
                  </p>
                  <p className="text-base sm:text-lg font-bold font-mono text-orange-600">
                    {bento.bento1.metric1Value}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] uppercase tracking-wider text-slate-400 font-mono font-semibold">
                    {bento.bento1.metric2Label}
                  </p>
                  <p className="text-base sm:text-lg font-bold font-mono text-amber-600">
                    {bento.bento1.metric2Value}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bento 2: Full-Stack Engineering (Span 5) */}
          <div className="md:col-span-5 rounded-3xl p-6 sm:p-8 bg-white border border-stone-200 hover:border-amber-300 transition-all duration-200 shadow-warm-sm hover:shadow-warm-md relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                    <Layers className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-bold">
                    {bento.bento2.badge}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display">
                    {bento.bento2.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">{bento.bento2.description}</p>
                </div>

                <div className="space-y-3 pt-1">
                  {bento.bento2.skillBars.map((tech, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{tech.name}</span>
                        <span className="text-orange-600 font-mono">{tech.level}</span>
                      </div>
                      <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 rounded-full"
                          style={{ width: tech.level }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Metric */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">{bento.bento2.metricLabel}</span>
                <span className="text-sm font-bold font-mono text-orange-600">
                  {bento.bento2.metricValue}
                </span>
              </div>
            </div>
          </div>

          {/* Bento 3: Database & Cloud Architecture (Span 4) */}
          <div className="md:col-span-4 rounded-3xl p-6 sm:p-7 bg-white border border-stone-200 hover:border-orange-300 transition-all duration-200 shadow-warm-sm hover:shadow-warm-md relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Server className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {bento.bento3.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bento.bento3.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bento.bento3.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200/60 text-[11px] font-mono text-orange-700 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bento 4: Vector & Real-Time Storage (Span 4) */}
          <div className="md:col-span-4 rounded-3xl p-6 sm:p-7 bg-white border border-stone-200 hover:border-amber-300 transition-all duration-200 shadow-warm-sm hover:shadow-warm-md relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {bento.bento4.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {bento.bento4.description}
              </p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {bento.bento4.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/60 text-[11px] font-mono text-amber-800 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bento 5: Architecture Principles (Span 4) */}
          <div className="md:col-span-4 rounded-3xl p-6 sm:p-7 bg-white border border-stone-200 hover:border-orange-300 transition-all duration-200 shadow-warm-sm hover:shadow-warm-md relative overflow-hidden group">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                <Workflow className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-display">
                {bento.bento5.title}
              </h3>
              <div className="space-y-2 text-xs text-slate-700">
                {bento.bento5.principles.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
