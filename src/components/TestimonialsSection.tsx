"use client";

import React, { useState } from "react";
import { Star, MessageSquarePlus, Check, Send, Loader2 } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { useToast } from "@/context/ToastContext";
import { submitTestimonialAction } from "@/actions/testimonialActions";

export default function TestimonialsSection() {
  const { data } = usePortfolio();
  const { toast } = useToast();
  const { testimonialsSection } = data;
  const testimonials = testimonialsSection?.testimonials || [];

  // Form State
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !role.trim() || !content.trim()) return;

    setIsSubmitting(true);

    try {
      const res = await submitTestimonialAction({
        name: name.trim(),
        role: role.trim(),
        rating,
        content: content.trim(),
      });

      if (res.success) {
        toast.success(
          "Thank you! Your feedback has been submitted and will appear once approved.",
          "Review Submitted"
        );
        setName("");
        setRole("");
        setContent("");
        setRating(5);
        setShowForm(false);
      } else {
        toast.error(res.error || "Failed to submit. Please check your fields.", "Submission Error");
      }
    } catch {
      toast.error("Something went wrong. Please try again later.", "Submission Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="testimonials" className="relative py-16 lg:py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <span className="px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
            {testimonialsSection?.subBadge || "Client Feedback"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-display">
            {testimonialsSection?.titleMain || "What People"}{" "}
            <span className="text-gradient-orange">{testimonialsSection?.titleAccent || "Say"}</span>{" "}
            {testimonialsSection?.titleEnd || ""}
          </h2>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            {testimonialsSection?.description || "Kind words from clients, partners, and team members."}
          </p>
        </div>

        {/* Testimonials Grid */}
        {testimonials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-6 rounded-2xl bg-white border border-stone-200 shadow-warm-sm flex flex-col justify-between space-y-4"
              >
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm text-slate-700 leading-relaxed flex-1">
                  &ldquo;{t.content}&rdquo;
                </p>

                {/* Author Info */}
                <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-bold shrink-0">
                    {t.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500 font-mono">
                      {t.role}
                      {t.company ? ` · ${t.company}` : ""}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500 text-xs">
            No reviews yet. Be the first to share your feedback below!
          </div>
        )}

        {/* Simple "Leave Feedback" Toggle & Form */}
        <div className="max-w-xl mx-auto">
          {!showForm ? (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-orange-700 bg-white border border-orange-200 hover:border-orange-400 hover:bg-orange-50/50 shadow-warm-sm transition-all cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4 text-orange-500" />
                <span>Leave a Review</span>
              </button>
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 font-display">Write a Quick Review</h3>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Rating Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-600 font-medium">Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="cursor-pointer p-0.5"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-stone-300 fill-transparent"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Your Role / Company *"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Review Message */}
                <textarea
                  required
                  rows={3}
                  placeholder="Share a few words about our work together... *"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-orange-500"
                />

                {/* Submit button */}
                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-xs transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Review</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
