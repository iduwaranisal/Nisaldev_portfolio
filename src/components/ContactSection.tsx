"use client";

import React, { useState } from "react";
import {
  Send,
  Mail,
  User,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Download,
  MapPin,
  AlertCircle,
} from "lucide-react";
import confetti from "canvas-confetti";
import { usePortfolio } from "@/context/PortfolioContext";
import { sendContactMessageAction } from "@/actions/contactActions";

export default function ContactSection() {
  const { data } = usePortfolio();
  const { contactSection } = data;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "Project Inquiry / Collaboration",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const res = await sendContactMessageAction(formData);

      if (!res.success) {
        throw new Error(res.error || "Unable to send message. Please try again.");
      }

      setSubmitted(true);

      // Trigger Confetti Celebration
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.6 },
          colors: ["#F97316", "#F59E0B", "#EA580C"],
        });
      } catch {}
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to send message";
      setSubmitError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Direct Info & Socials (Span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                <span>{contactSection.subBadge}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-tight">
                {contactSection.titleMain}{" "}
                <span className="text-gradient-orange">{contactSection.titleAccent}</span>{" "}
                {contactSection.titleEnd}
              </h2>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {contactSection.description}
              </p>
            </div>

            {/* Direct Contact Cards */}
            <div className="space-y-3">
              <a
                href={`mailto:${contactSection.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200 hover:border-orange-300 shadow-warm-sm hover:shadow-warm-md transition-all duration-200 group"
              >
                <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 group-hover:scale-105 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono font-semibold uppercase">Direct Email</p>
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-orange-600 transition-colors">
                    {contactSection.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-stone-200 shadow-warm-sm">
                <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-mono font-semibold uppercase">Primary Location</p>
                  <p className="text-sm font-semibold text-slate-800">{contactSection.location}</p>
                </div>
              </div>
            </div>

            {/* Resume Download Box */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/80 border border-orange-200 relative overflow-hidden group shadow-warm-sm">
              <div className="relative z-10 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-base font-bold text-slate-900 font-display">
                    {contactSection.resumeCardTitle}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {contactSection.resumeCardDesc}
                  </p>
                </div>
                <a
                  href={contactSection.resumePdfUrl || "/resume.pdf"}
                  download="Resume_Iduwara_Nisal.pdf"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm hover:shadow-warm-md hover:scale-102 transition-all duration-200 shrink-0 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Modern Contact Form (Span 7) */}
          <div className="lg:col-span-7 rounded-3xl p-6 sm:p-10 bg-white border border-stone-200 shadow-warm-md relative">
            {submitted ? (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-display">
                  Message Sent Successfully!
                </h3>
                <p className="text-sm text-slate-600 max-w-md">
                  Thank you for reaching out, {formData.name}. Your message has been received and I will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      subject: "Project Inquiry / Collaboration",
                      message: "",
                    });
                  }}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-stone-100 border border-stone-200 text-xs font-mono font-bold text-slate-700 hover:text-slate-950 transition-colors cursor-pointer"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-orange-500" />
                      <span>Your Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Elena Rostova"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-orange-500" />
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="elena@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all"
                    />
                  </div>
                </div>

                {/* Project Category / Subject Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700">
                    Topic / Scope of Engagement
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all font-sans cursor-pointer"
                  >
                    <option value="AI & Full Stack Architecture">
                      AI & Full Stack Architecture Development
                    </option>
                    <option value="Multi-Agent Swarm Integration">
                      Autonomous Multi-Agent Swarm / RAG Architecture
                    </option>
                    <option value="Enterprise Technical Advisory">
                      Enterprise Technical Advisory & Consulting
                    </option>
                    <option value="Leadership & Executive Engineering">
                      Technical Leadership & Executive Role
                    </option>
                  </select>
                </div>

                {/* Message Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-orange-500" />
                    <span>Project Brief / Message</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your architectural goals, timelines, or technical requirements..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all resize-none"
                  />
                </div>

                {submitError && (
                  <p className="text-xs text-rose-600 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{submitError}</span>
                  </p>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-warm-md hover:shadow-warm-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transmitting Inquiry...</span>
                    </div>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Project Inquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
