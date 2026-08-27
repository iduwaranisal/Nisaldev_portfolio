"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BookOpen, Clock, ArrowRight } from "lucide-react";
import { Article } from "@/data/portfolioData";
import ArticleModal from "./ArticleModal";
import { usePortfolio } from "@/context/PortfolioContext";

export default function BlogSection() {
  const { data } = usePortfolio();
  const { articlesSection } = data;
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  // Maximum 6 articles displayed on homepage
  const displayedArticles = articlesSection.articles.slice(0, 6);

  return (
    <section id="articles" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
            <BookOpen className="w-3.5 h-3.5 text-orange-500" />
            <span>{articlesSection.subBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            {articlesSection.titleMain}{" "}
            <span className="text-gradient-orange">{articlesSection.titleAccent}</span>{" "}
            {articlesSection.titleEnd}
          </h2>

          <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
            {articlesSection.description}
          </p>
        </div>

        {/* Article Cards Grid (Max 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayedArticles.map((article) => (
            <article
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group cursor-pointer rounded-3xl bg-white border border-stone-200 hover:border-orange-300 transition-all duration-200 shadow-warm-sm hover:shadow-warm-md p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:-translate-y-1"
            >
              <div className="space-y-3">
                {/* Meta Bar */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-orange-500" />
                      <span>{article.readTime}</span>
                    </div>
                    <span>·</span>
                    <span>{article.publishedDate}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-display group-hover:text-orange-600 transition-colors leading-snug">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              {/* Bottom Footer: Tags & Read Link */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 3).map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-stone-100 text-[11px] font-mono text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 transition-colors">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* See More Articles CTA Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-warm-md hover:shadow-warm-lg hover:scale-102 transition-all duration-200 cursor-pointer"
          >
            <span>Read All Technical Publications ({articlesSection.articles.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Article Reading Modal */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />
    </section>
  );
}
