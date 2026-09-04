"use client";

import React from "react";
import { Quote, MessageSquareHeart, Star } from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";

export default function TestimonialsSection() {
  const { data } = usePortfolio();
  const { testimonialsSection } = data;
  const testimonials = testimonialsSection.testimonials;

  return (
    <section id="testimonials" className="relative py-20 lg:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold">
            <MessageSquareHeart className="w-3.5 h-3.5 text-orange-500" />
            <span>{testimonialsSection.subBadge}</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-display tracking-tight">
            {testimonialsSection.titleMain}{" "}
            <span className="text-gradient-orange">{testimonialsSection.titleAccent}</span>{" "}
            {testimonialsSection.titleEnd}
          </h2>

          <p className="text-slate-600 max-w-2xl text-sm sm:text-base">
            {testimonialsSection.description}
          </p>
        </div>

        {/* Testimonial Cards */}
        {testimonials.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 shadow-warm-sm max-w-xl mx-auto space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 mx-auto">
              <MessageSquareHeart className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display">Testimonials Coming Soon</h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Client feedback and testimonials will be added here shortly. Stay tuned!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => {
              const initials = testimonial.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              return (
                <div
                  key={testimonial.id}
                  className="group rounded-3xl bg-white border border-stone-200 hover:border-orange-300 transition-all duration-200 shadow-warm-sm hover:shadow-warm-md p-6 sm:p-8 flex flex-col justify-between space-y-5 hover:-translate-y-1"
                >
                  {/* Quote Icon & Rating */}
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center">
                      <Quote className="w-5 h-5 text-orange-500" />
                    </div>
                    {testimonial.rating && (
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-amber-400 fill-amber-400"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Testimonial Content */}
                  <p className="text-sm text-slate-600 leading-relaxed flex-1">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>

                  {/* Divider + Author Info */}
                  <div className="pt-4 border-t border-stone-100 flex items-center gap-3">
                    {/* Avatar */}
                    {testimonial.avatar ? (
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover border border-stone-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                        {initials}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 font-display">
                        {testimonial.name}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        {testimonial.role}, {testimonial.company}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
