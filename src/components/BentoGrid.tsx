"use client";

import React from "react";
import {
  BrainCircuit,
  Layers,
  Server,
  Database,
  Workflow,
  Cpu,
  Code2,
  ShieldCheck,
  Terminal,
  Globe,
  Cloud,
  Sparkles,
  Zap,
  Activity,
  GitBranch,
  FileCode,
  Bot,
  Boxes,
  CheckCircle2,
  LucideIcon,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { getSkillsCards, SkillCard, SkillCardTheme } from "@/data/portfolioData";
import { cn } from "@/lib/utils";

// Icon resolver for dynamic string names
const ICON_MAP: Record<string, LucideIcon> = {
  BrainCircuit,
  Layers,
  Server,
  Database,
  Workflow,
  Cpu,
  Code2,
  ShieldCheck,
  Terminal,
  Globe,
  Cloud,
  Sparkles,
  Zap,
  Activity,
  GitBranch,
  FileCode,
  Bot,
  Boxes,
};

// Theme styling configurations
const THEME_STYLES: Record<
  SkillCardTheme,
  {
    iconBg: string;
    iconBorder: string;
    iconText: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    tagBg: string;
    tagBorder: string;
    tagText: string;
    tagDot: string;
    barGradient: string;
    hoverBorder: string;
    metricValue: string;
  }
> = {
  orange: {
    iconBg: "bg-orange-50",
    iconBorder: "border-orange-200",
    iconText: "text-orange-600",
    badgeBg: "bg-orange-50",
    badgeBorder: "border-orange-200",
    badgeText: "text-orange-700",
    tagBg: "bg-orange-50/60",
    tagBorder: "border-orange-200/70",
    tagText: "text-orange-800",
    tagDot: "text-orange-500",
    barGradient: "from-orange-500 via-amber-500 to-orange-400",
    hoverBorder: "hover:border-orange-300",
    metricValue: "text-orange-600",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconBorder: "border-amber-200",
    iconText: "text-amber-600",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
    badgeText: "text-amber-700",
    tagBg: "bg-amber-50/60",
    tagBorder: "border-amber-200/70",
    tagText: "text-amber-800",
    tagDot: "text-amber-500",
    barGradient: "from-amber-500 via-orange-400 to-amber-500",
    hoverBorder: "hover:border-amber-300",
    metricValue: "text-amber-600",
  },
  rose: {
    iconBg: "bg-rose-50",
    iconBorder: "border-rose-200",
    iconText: "text-rose-600",
    badgeBg: "bg-rose-50",
    badgeBorder: "border-rose-200",
    badgeText: "text-rose-700",
    tagBg: "bg-rose-50/60",
    tagBorder: "border-rose-200/70",
    tagText: "text-rose-800",
    tagDot: "text-rose-500",
    barGradient: "from-rose-500 via-orange-500 to-rose-400",
    hoverBorder: "hover:border-rose-300",
    metricValue: "text-rose-600",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconBorder: "border-blue-200",
    iconText: "text-blue-600",
    badgeBg: "bg-blue-50",
    badgeBorder: "border-blue-200",
    badgeText: "text-blue-700",
    tagBg: "bg-blue-50/60",
    tagBorder: "border-blue-200/70",
    tagText: "text-blue-800",
    tagDot: "text-blue-500",
    barGradient: "from-blue-500 via-indigo-500 to-blue-400",
    hoverBorder: "hover:border-blue-300",
    metricValue: "text-blue-600",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconBorder: "border-emerald-200",
    iconText: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
    badgeText: "text-emerald-700",
    tagBg: "bg-emerald-50/60",
    tagBorder: "border-emerald-200/70",
    tagText: "text-emerald-800",
    tagDot: "text-emerald-500",
    barGradient: "from-emerald-500 via-teal-500 to-emerald-400",
    hoverBorder: "hover:border-emerald-300",
    metricValue: "text-emerald-600",
  },
  purple: {
    iconBg: "bg-purple-50",
    iconBorder: "border-purple-200",
    iconText: "text-purple-600",
    badgeBg: "bg-purple-50",
    badgeBorder: "border-purple-200",
    badgeText: "text-purple-700",
    tagBg: "bg-purple-50/60",
    tagBorder: "border-purple-200/70",
    tagText: "text-purple-800",
    tagDot: "text-purple-500",
    barGradient: "from-purple-500 via-pink-500 to-purple-400",
    hoverBorder: "hover:border-purple-300",
    metricValue: "text-purple-600",
  },
};

export default function BentoGrid() {
  const { data } = usePortfolio();
  const { skillsSection } = data;
  const cards = getSkillsCards(skillsSection);

  return (
    <section id="skills" aria-labelledby="skills-heading" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold shadow-warm-xs">
            <Cpu className="w-3.5 h-3.5 text-orange-500" />
            <span>{skillsSection.subBadge}</span>
          </div>

          <h2 id="skills-heading" className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            {skillsSection.titleMain}{" "}
            <span className="text-gradient-orange">{skillsSection.titleAccent}</span>{" "}
            {skillsSection.titleEnd}
          </h2>

          <p className="text-slate-600 max-w-3xl text-sm sm:text-base leading-relaxed">
            {skillsSection.description}
          </p>
        </div>

        {/* Equal-Sized Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {cards.map((card: SkillCard, index: number) => {
            const themeKey = (card.theme && THEME_STYLES[card.theme]) ? card.theme : "orange";
            const theme = THEME_STYLES[themeKey];
            const IconComponent = (card.icon && ICON_MAP[card.icon]) ? ICON_MAP[card.icon] : BrainCircuit;

            return (
              <article
                key={card.id || `card-${index}`}
                className={cn(
                  "rounded-3xl p-6 sm:p-7 bg-white border border-stone-200 transition-all duration-300 shadow-warm-sm hover:shadow-warm-md flex flex-col justify-between group relative overflow-hidden",
                  theme.hoverBorder
                )}
              >
                {/* Top Content */}
                <div className="space-y-5">
                  {/* Top Bar: Icon + Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl border flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-warm-xs",
                        theme.iconBg,
                        theme.iconBorder,
                        theme.iconText
                      )}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {card.badge && (
                      <span
                        className={cn(
                          "px-3 py-1 rounded-full border text-xs font-mono font-bold",
                          theme.badgeBg,
                          theme.badgeBorder,
                          theme.badgeText
                        )}
                      >
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold text-slate-900 font-display group-hover:text-orange-600 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {card.description}
                    </p>
                  </div>

                  {/* Skill Progress Bars if defined */}
                  {card.skillBars && card.skillBars.length > 0 && (
                    <div className="space-y-2.5 pt-1">
                      {card.skillBars.map((bar, bIdx) => (
                        <div key={bIdx} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className="text-slate-700">{bar.name}</span>
                            <span className={cn("font-mono font-bold", theme.metricValue)}>
                              {bar.level}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className={cn("h-full bg-gradient-to-r rounded-full", theme.barGradient)}
                              style={{ width: bar.level.includes("%") ? bar.level : `${bar.level}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tags / Chip List if defined */}
                  {card.tags && card.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {card.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-mono font-medium",
                            theme.tagBg,
                            theme.tagBorder,
                            theme.tagText
                          )}
                        >
                          <Sparkles className={cn("w-3 h-3 shrink-0", theme.tagDot)} />
                          <span>{tag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Principles / Bullet Points if defined */}
                  {card.principles && card.principles.length > 0 && (
                    <ul className="space-y-2 text-xs text-slate-700 pt-1">
                      {card.principles.map((item, pIdx) => (
                        <li key={pIdx} className="flex items-start gap-2">
                          <CheckCircle2 className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", theme.tagDot)} />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Bottom Metrics Bar (if present) */}
                {card.metrics && card.metrics.length > 0 && (
                  <div className="pt-4 mt-6 border-t border-stone-100 grid grid-cols-2 gap-4">
                    {card.metrics.map((metric, mIdx) => (
                      <div key={mIdx} className={mIdx === 1 ? "text-right" : ""}>
                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono font-semibold">
                          {metric.label}
                        </p>
                        <p className={cn("text-sm sm:text-base font-bold font-mono", theme.metricValue)}>
                          {metric.value}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
