"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock,
  ArrowRight,
  ArrowLeft,
  Search,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleModal from "@/components/ArticleModal";
import { usePortfolio } from "@/context/PortfolioContext";
import { Article } from "@/data/portfolioData";

export default function ArticlesPage() {
  const { data } = usePortfolio();
  const { articlesSection } = data;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ["All", ...Array.from(new Set(articlesSection.articles.map((a) => a.category)))];

  const filteredArticles = articlesSection.articles.filter((article) => {
    const matchesCategory =
      activeCategory === "All" || article.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-[#FAF9F6] text-slate-900 selection:bg-orange-500/20 selection:text-orange-950">
      <Navbar />

      <section className="pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb / Back Link */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-mono font-bold text-slate-500 hover:text-orange-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portfolio Home</span>
            </Link>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 pb-8 border-b border-stone-200">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
                <BookOpen className="w-3.5 h-3.5 text-orange-500" />
                <span>Publications & Research Archive</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                Technical <span className="text-gradient-orange">Publications</span> & Research
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                In-depth architectural breakdowns, benchmarks, multi-agent orchestrations, and distributed engineering insights.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search publications, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-stone-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 shadow-warm-sm transition-all"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-10">
            {categories.map((cat) => (
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

          {/* Articles Full Grid */}
          {filteredArticles.length === 0 ? (
            <div className="py-20 text-center rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-3">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No Publications Found</h3>
              <p className="text-sm text-slate-500">
                Try adjusting your search query or topic filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article) => (
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
                      {article.tags.map((tag, i) => (
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
          )}
        </div>
      </section>

      {/* Article Reading Modal */}
      <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />

      <Footer />
    </main>
  );
}
