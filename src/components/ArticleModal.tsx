"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Calendar, Tag, Share2 } from "lucide-react";
import { Article } from "@/data/portfolioData";
import { useToast } from "@/context/ToastContext";

interface ArticleModalProps {
  article: Article | null;
  onClose: () => void;
}

export default function ArticleModal({ article, onClose }: ArticleModalProps) {
  const { toast } = useToast();
  if (!article) return null;

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

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.1 }}
          className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-warm-lg z-10 my-8 max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-stone-100 flex items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
                  {article.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Clock className="w-3.5 h-3.5 text-orange-500" />
                  <span>{article.readTime}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{article.publishedDate}</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display leading-tight">
                {article.title}
              </h2>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full bg-stone-100 text-slate-600 hover:text-slate-900 hover:bg-stone-200 transition-colors shrink-0 cursor-pointer"
              aria-label="Close article"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Article Reading Content */}
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
            <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200 text-orange-900 text-sm font-medium italic">
              &ldquo;{article.excerpt}&rdquo;
            </div>

            {article.content.map((paragraph, idx) => (
              <p key={idx} className="leading-relaxed">
                {paragraph}
              </p>
            ))}

            <div className="pt-6 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap gap-2 items-center">
                <Tag className="w-3.5 h-3.5 text-orange-500" />
                {article.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-lg bg-stone-100 text-xs font-mono text-slate-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <button
                onClick={() => {
                  if (navigator.clipboard) {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Article link copied to clipboard!", "Link Copied");
                  }
                }}
                className="inline-flex items-center gap-2 text-xs font-mono font-bold text-orange-600 hover:text-orange-700 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Article</span>
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
