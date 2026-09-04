"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Sparkles, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { submitTestimonialAction } from "@/actions/testimonialActions";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Needs Improvement",
  2: "Fair Experience",
  3: "Good & Reliable",
  4: "Very Good & Impressive",
  5: "Exceptional & Outstanding",
};

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const resetForm = () => {
    setName("");
    setRole("");
    setCompany("");
    setContent("");
    setRating(5);
    setEmail("");
    setAvatar("");
    setErrorMsg("");
    setIsSuccess(false);
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      setTimeout(resetForm, 300);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!role.trim()) {
      setErrorMsg("Please enter your role or title (e.g. CTO, Product Lead).");
      return;
    }
    if (!content.trim() || content.trim().length < 15) {
      setErrorMsg("Please write at least 15 characters of feedback.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitTestimonialAction({
        name: name.trim(),
        role: role.trim(),
        company: company.trim(),
        content: content.trim(),
        rating,
        email: email.trim(),
        avatar: avatar.trim(),
      });

      if (!res.success) {
        throw new Error(res.error || "Failed to submit testimonial.");
      }

      setIsSuccess(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#F97316", "#F59E0B", "#EA580C", "#10B981"],
        });
      } catch {}
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
          className="relative w-full max-w-xl bg-white border border-stone-200 rounded-3xl overflow-hidden shadow-warm-lg z-10 my-6 max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 border-b border-stone-100 flex items-start justify-between gap-4 bg-gradient-to-r from-orange-50/70 to-amber-50/40">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-orange-600" />
                <span>Client Feedback</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-display">
                Share Your Experience
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Your review helps validate technical quality and ongoing collaborations.
              </p>
            </div>

            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="p-2 rounded-full bg-white/80 border border-stone-200 text-slate-500 hover:text-slate-900 hover:bg-white transition-colors shrink-0 cursor-pointer shadow-xs"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
            {isSuccess ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mx-auto shadow-warm-sm">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    Thank You for Your Feedback!
                  </h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Your testimonial has been submitted to the moderation queue. Once approved by the administrator, it will appear publicly on the testimonials wall.
                  </p>
                </div>
                <div className="pt-4">
                  <button
                    onClick={handleClose}
                    className="px-6 py-2.5 rounded-full font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 shadow-warm-sm transition-all cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {errorMsg && (
                  <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Rating Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 font-display block">
                    Your Overall Rating <span className="text-orange-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 p-2 rounded-2xl bg-stone-50 border border-stone-200">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const activeVal = hoverRating ?? rating;
                        const isFilled = star <= activeVal;
                        return (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(null)}
                            className="p-1 text-amber-400 hover:scale-115 transition-transform focus:outline-none cursor-pointer"
                            aria-label={`${star} Stars`}
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-stone-300 fill-transparent"
                              }`}
                            />
                          </button>
                        );
                      })}
                    </div>
                    <span className="text-xs font-mono text-slate-600 font-semibold pl-1">
                      {RATING_LABELS[hoverRating ?? rating]}
                    </span>
                  </div>
                </div>

                {/* Full Name & Role */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 font-display block">
                      Full Name <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samantha Wright"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 font-display block">
                      Role / Position <span className="text-orange-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CTO, Engineering Lead"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Company & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 font-display block">
                      Company / Organization <span className="text-slate-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. SynthWave AI"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 font-display block">
                      Email Address <span className="text-slate-400 font-normal">(Private, for verification)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. samantha@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-700 font-display block">
                      Testimonial / Review <span className="text-orange-500">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-slate-400">
                      {content.length}/2000
                    </span>
                  </div>
                  <textarea
                    required
                    rows={4}
                    maxLength={2000}
                    placeholder="Describe your collaboration, technical achievements, reliability, or how Nisal contributed to your project..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 leading-relaxed"
                  />
                </div>

                {/* Avatar URL (Optional) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 font-display block">
                    Profile Photo / Avatar URL <span className="text-slate-400 font-normal">(Optional, LinkedIn/GitHub/etc.)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://images.example.com/photo.jpg"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-slate-800 text-xs focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  />
                </div>

                {/* Notice */}
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200/70 text-[11px] text-slate-600 leading-relaxed">
                  🛡️ <strong>Admin Moderation Notice:</strong> To maintain genuine quality and prevent spam, submissions are reviewed and verified by Nisal before going live on the website.
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-stone-100 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-warm-sm hover:shadow-warm-md hover:scale-102 transition-all duration-200 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Review...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Testimonial</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
