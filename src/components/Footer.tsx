"use client";

import React from "react";
import Link from "next/link";
import { ArrowUp, Cpu, Settings } from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/Icons";
import { usePortfolio } from "@/context/PortfolioContext";

export default function Footer() {
  const { data } = usePortfolio();
  const { footer, socialLinks } = data;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative border-t border-stone-200 bg-white py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Tagline */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 p-[1px] flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                  <Cpu className="w-3.5 h-3.5 text-orange-600" />
                </div>
              </div>
              <span className="font-display font-bold text-sm tracking-tight text-slate-900">
                {footer.brandTitle}{" "}
                <span className="text-orange-600 font-mono text-xs">{footer.brandSub}</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm">
              {footer.tagline}
            </p>
          </div>

          {/* Social Links & Admin Entry */}
          <div className="flex items-center gap-3">
            {socialLinks.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 transition-all shadow-xs"
                aria-label="GitHub Profile"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}

            {socialLinks.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 transition-all shadow-xs"
                aria-label="LinkedIn Profile"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            )}

            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 hover:bg-orange-50 transition-all shadow-xs"
                aria-label="Twitter / X Profile"
              >
                <TwitterIcon className="w-4 h-4" />
              </a>
            )}

            {/* Direct Admin Link */}
            <Link
              href="/admin"
              className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-500 hover:text-orange-600 hover:border-orange-300 transition-all shadow-xs"
              title="Executive Console"
            >
              <Settings className="w-4 h-4" />
            </Link>

            {/* Back to Top Button */}
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-600 hover:text-orange-600 hover:border-orange-300 transition-all ml-2 cursor-pointer shadow-xs"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Bottom Credits & Tech Details */}
        <div className="mt-8 pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} {data.general.name}. {footer.copyrightText}
          </div>
          <div className="flex items-center gap-2 font-medium">
            <span>{footer.creditsText}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
