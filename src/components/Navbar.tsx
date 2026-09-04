"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowUpRight, Cpu, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePortfolio } from "@/context/PortfolioContext";

const NAV_ITEMS = [
  { name: "Home", href: "#home" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Articles", href: "#articles" },
  { name: "Contact", href: "#contact" },
];

export default function Navbar() {
  const { data } = usePortfolio();
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = NAV_ITEMS.map((item) => item.href.substring(1));
      const scrollPosition = window.scrollY + 200;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sectionEl = document.getElementById(sections[i]);
        if (sectionEl && sectionEl.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (window.location.pathname !== "/") return;

    e.preventDefault();
    const targetId = href.substring(1);
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setActiveSection(targetId);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-6 lg:px-8 py-4 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <a
          href="/#home"
          onClick={(e) => scrollToSection(e, "#home")}
          className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-stone-200/80 shadow-warm-sm hover:border-orange-400/60 transition-all duration-200 backdrop-blur-md"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-orange-500 via-amber-500 to-orange-400 p-[1px] flex items-center justify-center shadow-xs">
            <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
              <Cpu className="w-4 h-4 text-orange-600" />
            </div>
          </div>
          <span className="font-display font-bold text-sm tracking-tight text-slate-900 flex items-center gap-1">
            <span>{data.general.brandName}</span>
            <span className="text-orange-600 font-mono text-xs">{data.general.brandDomain}</span>
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden sm:inline-block" />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className={cn(
            "hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full transition-all duration-200 backdrop-blur-md",
            scrolled
              ? "bg-white/95 border border-stone-200 shadow-warm-md"
              : "bg-white/70 border border-stone-200/60"
          )}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <a
                key={item.name}
                href={`/${item.href}`}
                onClick={(e) => scrollToSection(e, item.href)}
                className={cn(
                  "relative px-4 py-1.5 text-xs font-medium tracking-wide uppercase transition-all duration-150 rounded-full",
                  isActive ? "text-orange-600 font-bold" : "text-slate-600 hover:text-slate-900"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-orange-500/10 border border-orange-500/30 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {item.name}
              </a>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* Hire Me CTA */}
          <a
            href="/#contact"
            onClick={(e) => scrollToSection(e, "#contact")}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 shadow-warm-sm hover:shadow-warm-md hover:scale-102 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Hire Me</span>
            <ArrowUpRight className="w-3.5 h-3.5 opacity-80" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-full bg-white border border-stone-200 text-slate-700 hover:text-slate-950 shadow-warm-sm focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="md:hidden mt-3 mx-auto max-w-md rounded-2xl bg-white/95 border border-stone-200 p-5 shadow-warm-lg backdrop-blur-md"
          >
            <div className="flex flex-col gap-2">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.substring(1);
                return (
                  <a
                    key={item.name}
                    href={`/${item.href}`}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      isActive
                        ? "bg-orange-500/10 text-orange-600 border border-orange-500/20 font-bold"
                        : "text-slate-700 hover:bg-stone-50 hover:text-slate-950"
                    )}
                  >
                    <span>{item.name}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                  </a>
                );
              })}

              <Link
                href="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-orange-600 bg-orange-50 border border-orange-200"
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  <span>Executive Console</span>
                </span>
                <span className="text-xs font-mono bg-orange-100 text-orange-700 px-2 py-0.5 rounded font-bold">
                  Console
                </span>
              </Link>

              <div className="pt-3 mt-1 border-t border-stone-100">
                <a
                  href="/#contact"
                  onClick={(e) => scrollToSection(e, "#contact")}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-sm shadow-warm-sm"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get In Touch</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
