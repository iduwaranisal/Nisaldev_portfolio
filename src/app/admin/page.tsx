"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  LayoutDashboard,
  User,
  Brain,
  FolderGit2,
  BookOpen,
  Mail,
  Database,
  Lock,
  Save,
  RotateCcw,
  Download,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Eye,
  Layers,
  ArrowLeft,
  X,
  Server,
  Workflow,
  Sparkles,
  Upload,
  Inbox,
  RefreshCw,
  KeyRound,
  ShieldCheck,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import { Project, Article } from "@/data/portfolioData";
import { cn } from "@/lib/utils";

type AdminTab =
  | "dashboard"
  | "general"
  | "bento"
  | "projects"
  | "articles"
  | "inbox"
  | "contact"
  | "backup";

interface ContactMessageItem {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead?: boolean;
}

export default function AdminPage() {
  const {
    data,
    isDbConnected,
    refreshData,
    updateGeneral,
    updateSkillsSection,
    updateBentoConfig,
    addProject,
    updateProject,
    deleteProject,
    addArticle,
    updateArticle,
    deleteArticle,
    updateContactSection,
    updateSocialLinks,
    updateFooter,
    resetToDefaults,
    exportJSON,
  } = usePortfolio();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState("");

  // Check saved session on mount
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("admin_auth_token_2026");
      if (savedToken) {
        setIsAuthenticated(true);
      }
    } catch {}
  }, []);

  // Active Tab
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Projects State for Edit Modal
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Articles State for Edit Modal
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Temp tag inputs for Bento
  const [newBento1Tag, setNewBento1Tag] = useState("");
  const [newBento3Tag, setNewBento3Tag] = useState("");
  const [newBento4Tag, setNewBento4Tag] = useState("");
  const [newBento5Principle, setNewBento5Principle] = useState("");

  // Uploading States
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingProjectImg, setIsUploadingProjectImg] = useState(false);

  // Messages Inbox State
  const [inboxMessages, setInboxMessages] = useState<ContactMessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch("/api/contact");
      const json = await res.json();
      if (json.success && json.messages) {
        setInboxMessages(json.messages);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === "inbox") {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab, fetchMessages]);

  // Secure Server Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.token) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem("admin_auth_token_2026", json.token);
        } catch {}
        showToast("Authenticated. Welcome back!");
      } else {
        setAuthError(json.error || "Invalid username or password credentials.");
      }
    } catch {
      setAuthError("Failed to connect to authentication gateway.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    try {
      localStorage.removeItem("admin_auth_token_2026");
    } catch {}
    showToast("Logged out securely.");
  };

  // Upload Helper
  const handleCloudinaryUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const json = await res.json();
    if (json.success && json.url) {
      return json.url;
    }
    throw new Error(json.error || "Upload failed");
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-[#FAF9F6] text-slate-900">
        <div className="w-full max-w-md p-8 rounded-3xl bg-white border border-stone-200 shadow-warm-lg relative z-10">
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 font-display">
              Portfolio Control Center
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Executive Authentication & Management Console
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span>Admin Username</span>
              </label>
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-orange-500" />
                <span>Admin Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 font-mono transition-all"
              />
            </div>

            {authError && (
              <p className="text-xs text-rose-600 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{authError}</span>
              </p>
            )}

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white font-bold text-sm shadow-warm-md hover:shadow-warm-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 mt-2"
            >
              {isAuthenticating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>

            <div className="pt-4 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-orange-600 transition-colors font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Site</span>
              </Link>
            </div>
          </form>
        </div>
      </main>
    );
  }

  const { bento } = data.skillsSection;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 flex flex-col md:flex-row relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-lg flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-white" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-stone-200 p-5 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-orange-500 to-amber-400 p-[1px] flex items-center justify-center shadow-xs">
                <div className="w-full h-full bg-white rounded-[7px] flex items-center justify-center">
                  <Settings className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <div>
                <h2 className="font-bold text-sm text-slate-900 font-display">Console Control</h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      isDbConnected ? "bg-emerald-500" : "bg-orange-500 animate-pulse"
                    )}
                  />
                  <span className="text-[10px] text-slate-500 font-mono">
                    {isDbConnected ? "Live System" : "Synchronizing"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {[
              { id: "dashboard", label: "Overview", icon: LayoutDashboard },
              { id: "general", label: "Hero & Identity", icon: User },
              { id: "bento", label: "Skills & Architecture", icon: Brain },
              { id: "projects", label: "Projects Portfolio", icon: FolderGit2 },
              { id: "articles", label: "Technical Articles", icon: BookOpen },
              { id: "inbox", label: "Inbound Inquiries", icon: Inbox },
              { id: "contact", label: "Contact & Footer", icon: Mail },
              { id: "backup", label: "System Backup", icon: Database },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer",
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-stone-50"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="pt-6 border-t border-stone-100 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-700 hover:text-slate-900 hover:border-orange-300 text-xs font-medium transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-orange-500" />
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        <div className="max-w-5xl mx-auto space-y-8">
          {/* TAB 1: DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-slate-900 font-display">
                    Executive Management Console
                  </h1>
                  <p className="text-sm text-slate-500 mt-1">
                    System Status: <span className="text-emerald-600 font-mono font-bold">Live & Operational</span>
                  </p>
                </div>

                <button
                  onClick={async () => {
                    await refreshData();
                    showToast("Content refreshed successfully!");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-xs font-mono font-bold text-slate-700 hover:text-orange-600 hover:border-orange-300 transition-colors cursor-pointer w-fit shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-orange-500" />
                  <span>Refresh State</span>
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm">
                  <p className="text-xs font-mono font-medium text-slate-400">Showcase Projects</p>
                  <p className="text-3xl font-bold font-mono text-orange-600 mt-1">
                    {data.projectsSection.projects.length}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm">
                  <p className="text-xs font-mono font-medium text-slate-400">Published Articles</p>
                  <p className="text-3xl font-bold font-mono text-amber-600 mt-1">
                    {data.articlesSection.articles.length}
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm">
                  <p className="text-xs font-mono font-medium text-slate-400">Media Assets</p>
                  <p className="text-3xl font-bold font-mono text-rose-500 mt-1">
                    Cloud Active
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm">
                  <p className="text-xs font-mono font-medium text-slate-400">Infrastructure</p>
                  <p className="text-sm font-bold font-mono text-emerald-600 mt-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Synchronized</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & GENERAL IDENTITY */}
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Hero & General Identity</h1>
                  <p className="text-xs text-slate-500">Manage headline roles, bio descriptions, and branding.</p>
                </div>
                <button
                  onClick={() => showToast("Changes saved successfully!")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-5">
                {/* Profile Photo Uploader */}
                <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <label className="text-xs font-mono text-orange-700 uppercase tracking-wider font-bold">
                    Profile Photo Asset
                  </label>

                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <div className="relative w-24 h-28 rounded-2xl overflow-hidden bg-white border border-orange-200 shrink-0 flex items-center justify-center shadow-xs">
                      {data.general.profileImage ? (
                        <Image
                          src={data.general.profileImage}
                          alt="Profile Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="text-center p-2">
                          <User className="w-8 h-8 text-slate-400 mx-auto" />
                          <span className="text-[9px] text-slate-400 font-mono">No Image</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 w-full">
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold hover:bg-orange-500 hover:text-white transition-all cursor-pointer flex items-center gap-2 shadow-xs">
                          <Upload className="w-4 h-4" />
                          <span>{isUploadingProfile ? "Uploading..." : "Upload New Photo"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingProfile}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploadingProfile(true);
                              try {
                                const url = await handleCloudinaryUpload(file);
                                if (url) {
                                  await updateGeneral({ profileImage: url });
                                  showToast("Photo uploaded and updated successfully!");
                                }
                              } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Upload failed";
                                alert(msg);
                              } finally {
                                setIsUploadingProfile(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                      <input
                        type="text"
                        value={data.general.profileImage}
                        onChange={(e) => updateGeneral({ profileImage: e.target.value })}
                        placeholder="Or provide direct image URL"
                        className="w-full px-3 py-2 rounded-lg bg-white border border-stone-200 text-slate-900 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Brand Name</label>
                    <input
                      type="text"
                      value={data.general.brandName}
                      onChange={(e) => updateGeneral({ brandName: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Brand Extension</label>
                    <input
                      type="text"
                      value={data.general.brandDomain}
                      onChange={(e) => updateGeneral({ brandDomain: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      value={data.general.name}
                      onChange={(e) => updateGeneral({ name: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Availability Status</label>
                    <input
                      type="text"
                      value={data.general.availabilityStatus}
                      onChange={(e) => updateGeneral({ availabilityStatus: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Main Title (e.g. AI Architect)</label>
                    <input
                      type="text"
                      value={data.general.role1}
                      onChange={(e) => updateGeneral({ role1: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Secondary Title (e.g. & Full Stack Developer)</label>
                    <input
                      type="text"
                      value={data.general.role2}
                      onChange={(e) => updateGeneral({ role2: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700">Headline Tagline</label>
                  <input
                    type="text"
                    value={data.general.tagline}
                    onChange={(e) => updateGeneral({ tagline: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700">Executive Bio Description</label>
                  <textarea
                    rows={3}
                    value={data.general.bio}
                    onChange={(e) => updateGeneral({ bio: e.target.value })}
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm resize-none focus:bg-white focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Feature Pill 1</label>
                    <input
                      type="text"
                      value={data.general.floatingBadge1}
                      onChange={(e) => updateGeneral({ floatingBadge1: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Feature Pill 2</label>
                    <input
                      type="text"
                      value={data.general.floatingBadge2}
                      onChange={(e) => updateGeneral({ floatingBadge2: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Primary CTA Text</label>
                    <input
                      type="text"
                      value={data.general.primaryBtnText}
                      onChange={(e) => updateGeneral({ primaryBtnText: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Secondary CTA Text</label>
                    <input
                      type="text"
                      value={data.general.secondaryBtnText}
                      onChange={(e) => updateGeneral({ secondaryBtnText: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Resume Link Text</label>
                    <input
                      type="text"
                      value={data.general.resumeBtnText}
                      onChange={(e) => updateGeneral({ resumeBtnText: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Hero Stats */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <h4 className="text-xs font-mono font-bold text-orange-700 uppercase">
                    Performance & Experience Metrics
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.general.stats.map((stat, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex gap-2">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...data.general.stats];
                            newStats[idx].value = e.target.value;
                            updateGeneral({ stats: newStats });
                          }}
                          placeholder="Value"
                          className="w-1/3 px-2 py-1 bg-white rounded-lg text-slate-900 font-mono text-xs border border-stone-200"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...data.general.stats];
                            newStats[idx].label = e.target.value;
                            updateGeneral({ stats: newStats });
                          }}
                          placeholder="Label"
                          className="w-2/3 px-2 py-1 bg-white rounded-lg text-slate-900 text-xs border border-stone-200"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BENTO & SKILLS ARSENAL */}
          {activeTab === "bento" && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Skills & Architecture Bento</h1>
                  <p className="text-xs text-slate-500">
                    Full management for architecture specializations, skill bars, and system principles.
                  </p>
                </div>
                <button
                  onClick={() => showToast("Architecture specifications saved!")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              {/* Section Header Customization */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Section Header & Sub-badge</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Top Sub-Badge Text</label>
                    <input
                      type="text"
                      value={data.skillsSection.subBadge}
                      onChange={(e) => updateSkillsSection({ subBadge: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Title Main</label>
                      <input
                        type="text"
                        value={data.skillsSection.titleMain}
                        onChange={(e) => updateSkillsSection({ titleMain: e.target.value })}
                        className="w-full mt-1 px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-orange-700">Accent Text</label>
                      <input
                        type="text"
                        value={data.skillsSection.titleAccent}
                        onChange={(e) => updateSkillsSection({ titleAccent: e.target.value })}
                        className="w-full mt-1 px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-orange-600 font-semibold text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Title End</label>
                      <input
                        type="text"
                        value={data.skillsSection.titleEnd}
                        onChange={(e) => updateSkillsSection({ titleEnd: e.target.value })}
                        className="w-full mt-1 px-2.5 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700">Section Overview</label>
                  <textarea
                    rows={2}
                    value={data.skillsSection.description}
                    onChange={(e) => updateSkillsSection({ description: e.target.value })}
                    className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm resize-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Bento Box 1: AI & ML */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <h3 className="text-base font-bold text-orange-700 font-display flex items-center gap-2">
                  <Brain className="w-4 h-4 text-orange-500" />
                  <span>Bento Card 1: AI & Machine Learning Architecture</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Card Badge</label>
                    <input
                      type="text"
                      value={bento.bento1.badge}
                      onChange={(e) => {
                        const newBento = { ...bento };
                        newBento.bento1.badge = e.target.value;
                        updateBentoConfig(newBento);
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Heading Title</label>
                    <input
                      type="text"
                      value={bento.bento1.title}
                      onChange={(e) => {
                        const newBento = { ...bento };
                        newBento.bento1.title = e.target.value;
                        updateBentoConfig(newBento);
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700">Description</label>
                  <input
                    type="text"
                    value={bento.bento1.description}
                    onChange={(e) => {
                      const newBento = { ...bento };
                      newBento.bento1.description = e.target.value;
                      updateBentoConfig(newBento);
                    }}
                    className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                  />
                </div>

                {/* Skill Tags */}
                <div className="space-y-2">
                  <label className="text-xs font-mono font-bold text-slate-700">Specialization Tags</label>
                  <div className="flex flex-wrap gap-2">
                    {bento.bento1.tags.map((tag, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-orange-50 border border-orange-200 text-xs font-medium text-orange-800"
                      >
                        <span>{tag}</span>
                        <button
                          onClick={() => {
                            const newBento = { ...bento };
                            newBento.bento1.tags = newBento.bento1.tags.filter((_, i) => i !== idx);
                            updateBentoConfig(newBento);
                          }}
                          className="text-orange-400 hover:text-rose-600 ml-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Add new tag"
                      value={newBento1Tag}
                      onChange={(e) => setNewBento1Tag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newBento1Tag.trim()) {
                          e.preventDefault();
                          const newBento = { ...bento };
                          newBento.bento1.tags.push(newBento1Tag.trim());
                          updateBentoConfig(newBento);
                          setNewBento1Tag("");
                        }
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-xs focus:bg-white focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newBento1Tag.trim()) {
                          const newBento = { ...bento };
                          newBento.bento1.tags.push(newBento1Tag.trim());
                          updateBentoConfig(newBento);
                          setNewBento1Tag("");
                        }
                      }}
                      className="px-4 py-1.5 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-mono font-bold hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-stone-100">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-500">Metric 1 (Label & Value)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bento.bento1.metric1Label}
                        onChange={(e) => {
                          const newBento = { ...bento };
                          newBento.bento1.metric1Label = e.target.value;
                          updateBentoConfig(newBento);
                        }}
                        className="w-1/2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-slate-800 text-xs"
                      />
                      <input
                        type="text"
                        value={bento.bento1.metric1Value}
                        onChange={(e) => {
                          const newBento = { ...bento };
                          newBento.bento1.metric1Value = e.target.value;
                          updateBentoConfig(newBento);
                        }}
                        className="w-1/2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-orange-600 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-mono font-bold text-slate-500">Metric 2 (Label & Value)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bento.bento1.metric2Label}
                        onChange={(e) => {
                          const newBento = { ...bento };
                          newBento.bento1.metric2Label = e.target.value;
                          updateBentoConfig(newBento);
                        }}
                        className="w-1/2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-slate-800 text-xs"
                      />
                      <input
                        type="text"
                        value={bento.bento1.metric2Value}
                        onChange={(e) => {
                          const newBento = { ...bento };
                          newBento.bento1.metric2Value = e.target.value;
                          updateBentoConfig(newBento);
                        }}
                        className="w-1/2 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-amber-600 font-mono font-bold text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento Box 2: Full-Stack Skill Bars */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <h3 className="text-base font-bold text-amber-700 font-display flex items-center gap-2">
                  <Layers className="w-4 h-4 text-amber-500" />
                  <span>Bento Card 2: Full-Stack Engineering Proficiency</span>
                </h3>

                <div className="space-y-3">
                  {bento.bento2.skillBars.map((skill, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2"
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => {
                            const newBento = { ...bento };
                            newBento.bento2.skillBars[idx].name = e.target.value;
                            updateBentoConfig(newBento);
                          }}
                          className="flex-1 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-slate-900 text-xs font-medium"
                        />
                        <input
                          type="text"
                          value={skill.level}
                          onChange={(e) => {
                            const newBento = { ...bento };
                            newBento.bento2.skillBars[idx].level = e.target.value;
                            updateBentoConfig(newBento);
                          }}
                          className="w-20 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-orange-600 font-mono font-bold text-xs text-center"
                        />
                        <button
                          onClick={() => {
                            const newBento = { ...bento };
                            newBento.bento2.skillBars = newBento.bento2.skillBars.filter(
                              (_, i) => i !== idx
                            );
                            updateBentoConfig(newBento);
                          }}
                          className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <input
                        type="range"
                        min="1"
                        max="100"
                        value={parseInt(skill.level.replace("%", "")) || 80}
                        onChange={(e) => {
                          const newBento = { ...bento };
                          newBento.bento2.skillBars[idx].level = `${e.target.value}%`;
                          updateBentoConfig(newBento);
                        }}
                        className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                      />
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const newBento = { ...bento };
                      newBento.bento2.skillBars.push({ name: "Distributed Systems & WebSockets", level: "92%" });
                      updateBentoConfig(newBento);
                    }}
                    className="flex items-center gap-1.5 text-xs text-orange-700 hover:text-orange-600 font-mono font-bold cursor-pointer pt-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Skill Bar</span>
                  </button>
                </div>
              </div>

              {/* Bento Box 3, 4, 5 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bento 3 */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm space-y-3">
                  <h4 className="text-sm font-bold text-orange-700 flex items-center gap-2">
                    <Server className="w-4 h-4 text-orange-500" />
                    <span>Cloud Systems</span>
                  </h4>
                  <input
                    type="text"
                    value={bento.bento3.title}
                    onChange={(e) => {
                      const newBento = { ...bento };
                      newBento.bento3.title = e.target.value;
                      updateBentoConfig(newBento);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-slate-900 text-xs font-semibold"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {bento.bento3.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200 text-[10px] text-orange-800 font-mono flex items-center gap-1 font-medium"
                      >
                        {tag}
                        <button
                          onClick={() => {
                            const newBento = { ...bento };
                            newBento.bento3.tags = newBento.bento3.tags.filter((_, i) => i !== idx);
                            updateBentoConfig(newBento);
                          }}
                          className="hover:text-rose-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Add tag"
                      value={newBento3Tag}
                      onChange={(e) => setNewBento3Tag(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-stone-50 border border-stone-200 text-slate-900 text-xs"
                    />
                    <button
                      onClick={() => {
                        if (newBento3Tag.trim()) {
                          const newBento = { ...bento };
                          newBento.bento3.tags.push(newBento3Tag.trim());
                          updateBentoConfig(newBento);
                          setNewBento3Tag("");
                        }
                      }}
                      className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bento 4 */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm space-y-3">
                  <h4 className="text-sm font-bold text-amber-700 flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-500" />
                    <span>Vector & Storage</span>
                  </h4>
                  <input
                    type="text"
                    value={bento.bento4.title}
                    onChange={(e) => {
                      const newBento = { ...bento };
                      newBento.bento4.title = e.target.value;
                      updateBentoConfig(newBento);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-slate-900 text-xs font-semibold"
                  />
                  <div className="flex flex-wrap gap-1.5">
                    {bento.bento4.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-[10px] text-amber-800 font-mono flex items-center gap-1 font-medium"
                      >
                        {tag}
                        <button
                          onClick={() => {
                            const newBento = { ...bento };
                            newBento.bento4.tags = newBento.bento4.tags.filter((_, i) => i !== idx);
                            updateBentoConfig(newBento);
                          }}
                          className="hover:text-rose-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Add tag"
                      value={newBento4Tag}
                      onChange={(e) => setNewBento4Tag(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-stone-50 border border-stone-200 text-slate-900 text-xs"
                    />
                    <button
                      onClick={() => {
                        if (newBento4Tag.trim()) {
                          const newBento = { ...bento };
                          newBento.bento4.tags.push(newBento4Tag.trim());
                          updateBentoConfig(newBento);
                          setNewBento4Tag("");
                        }
                      }}
                      className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bento 5 */}
                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm space-y-3">
                  <h4 className="text-sm font-bold text-rose-700 flex items-center gap-2">
                    <Workflow className="w-4 h-4 text-rose-500" />
                    <span>System Principles</span>
                  </h4>
                  <input
                    type="text"
                    value={bento.bento5.title}
                    onChange={(e) => {
                      const newBento = { ...bento };
                      newBento.bento5.title = e.target.value;
                      updateBentoConfig(newBento);
                    }}
                    className="w-full px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-slate-900 text-xs font-semibold"
                  />
                  <div className="space-y-1">
                    {bento.bento5.principles.map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] text-slate-700 bg-stone-50 p-1.5 rounded border border-stone-100">
                        <span className="line-clamp-1">{p}</span>
                        <button
                          onClick={() => {
                            const newBento = { ...bento };
                            newBento.bento5.principles = newBento.bento5.principles.filter((_, i) => i !== idx);
                            updateBentoConfig(newBento);
                          }}
                          className="hover:text-rose-600 text-slate-400 ml-1"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <input
                      type="text"
                      placeholder="Add principle"
                      value={newBento5Principle}
                      onChange={(e) => setNewBento5Principle(e.target.value)}
                      className="w-full px-2 py-1 rounded bg-stone-50 border border-stone-200 text-slate-900 text-xs"
                    />
                    <button
                      onClick={() => {
                        if (newBento5Principle.trim()) {
                          const newBento = { ...bento };
                          newBento.bento5.principles.push(newBento5Principle.trim());
                          updateBentoConfig(newBento);
                          setNewBento5Principle("");
                        }
                      }}
                      className="px-2 py-1 bg-rose-500 text-white text-xs font-bold rounded"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PROJECTS PORTFOLIO */}
          {activeTab === "projects" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Projects Portfolio</h1>
                  <p className="text-xs text-slate-500">Curate showcase projects, case studies, and architecture blueprints.</p>
                </div>
                <button
                  onClick={async () => {
                    const newProj: Project = {
                      id: `proj-${Date.now()}`,
                      title: "New Autonomous Intelligence System",
                      category: "AI & Agents",
                      tagline: "High-performance autonomous intelligence system.",
                      description: "Executive summary of the system architecture and innovations.",
                      fullOverview: "Comprehensive architectural breakdown covering technical decisions, low-latency data pipelines, and production outcomes.",
                      image: "",
                      tags: ["Next.js 16", "PyTorch", "TypeScript"],
                      metrics: [{ label: "Throughput", value: "3.2k tok/s" }],
                      architectureDetails: ["Dynamic workflow orchestration", "Vector recall caching"],
                      liveUrl: "https://demo.vercel.app",
                      githubUrl: "https://github.com",
                    };
                    await addProject(newProj);
                    setEditingProject(newProj);
                    showToast("New project added to portfolio!");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-3">
                {data.projectsSection.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-orange-700 font-mono text-[10px] font-bold border border-orange-200">
                          {proj.category}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 font-display">
                          {proj.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{proj.tagline}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingProject(proj)}
                        className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Remove project "${proj.title}" from portfolio?`)) {
                            await deleteProject(proj.id);
                            showToast("Project removed from portfolio.");
                          }
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PROJECT EDIT MODAL */}
          {editingProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
              <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-warm-lg">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    Edit Project: {editingProject.title}
                  </h3>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="p-2 text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Project Title</label>
                      <input
                        type="text"
                        value={editingProject.title}
                        onChange={(e) => {
                          const updated = { ...editingProject, title: e.target.value };
                          setEditingProject(updated);
                          updateProject(editingProject.id, { title: e.target.value });
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Category</label>
                      <input
                        type="text"
                        value={editingProject.category}
                        onChange={(e) => {
                          const updated = { ...editingProject, category: e.target.value };
                          setEditingProject(updated);
                          updateProject(editingProject.id, { category: e.target.value });
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Image Uploader */}
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                    <label className="text-xs font-mono font-bold text-orange-700">
                      Project Thumbnail Asset
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 shrink-0 flex items-center justify-center">
                        {editingProject.image ? (
                          <Image
                            src={editingProject.image}
                            alt="Thumbnail preview"
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="text-center p-1">
                            <FolderGit2 className="w-5 h-5 text-slate-400 mx-auto" />
                            <span className="text-[8px] text-slate-400 font-mono">No Image</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <label className="px-3.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold hover:bg-orange-500 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploadingProjectImg ? "Uploading..." : "Upload New Asset"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            disabled={isUploadingProjectImg}
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploadingProjectImg(true);
                              try {
                                const url = await handleCloudinaryUpload(file);
                                if (url) {
                                  const updated = { ...editingProject, image: url };
                                  setEditingProject(updated);
                                  await updateProject(editingProject.id, { image: url });
                                  showToast("Asset uploaded and assigned successfully!");
                                }
                              } catch (err: unknown) {
                                const msg = err instanceof Error ? err.message : "Upload failed";
                                alert(msg);
                              } finally {
                                setIsUploadingProjectImg(false);
                              }
                            }}
                          />
                        </label>
                        <input
                          type="text"
                          value={editingProject.image}
                          onChange={(e) => {
                            const updated = { ...editingProject, image: e.target.value };
                            setEditingProject(updated);
                            updateProject(editingProject.id, { image: e.target.value });
                          }}
                          placeholder="Or paste direct image URL"
                          className="w-full px-3 py-1.5 rounded bg-white border border-stone-200 text-slate-900 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Tagline / Subtitle</label>
                    <input
                      type="text"
                      value={editingProject.tagline}
                      onChange={(e) => {
                        const updated = { ...editingProject, tagline: e.target.value };
                        setEditingProject(updated);
                        updateProject(editingProject.id, { tagline: e.target.value });
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Card Overview Summary</label>
                    <textarea
                      rows={2}
                      value={editingProject.description}
                      onChange={(e) => {
                        const updated = { ...editingProject, description: e.target.value };
                        setEditingProject(updated);
                        updateProject(editingProject.id, { description: e.target.value });
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Full Case Study Overview</label>
                    <textarea
                      rows={4}
                      value={editingProject.fullOverview}
                      onChange={(e) => {
                        const updated = { ...editingProject, fullOverview: e.target.value };
                        setEditingProject(updated);
                        updateProject(editingProject.id, { fullOverview: e.target.value });
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Live Demo URL</label>
                      <input
                        type="text"
                        value={editingProject.liveUrl || ""}
                        onChange={(e) => {
                          const updated = { ...editingProject, liveUrl: e.target.value };
                          setEditingProject(updated);
                          updateProject(editingProject.id, { liveUrl: e.target.value });
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ""}
                        onChange={(e) => {
                          const updated = { ...editingProject, githubUrl: e.target.value };
                          setEditingProject(updated);
                          updateProject(editingProject.id, { githubUrl: e.target.value });
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => {
                      setEditingProject(null);
                      showToast("Project specifications updated!");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                  >
                    Done & Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: ARTICLES MANAGER */}
          {activeTab === "articles" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Technical Publications</h1>
                  <p className="text-xs text-slate-500">Compose, publish, and manage architectural articles.</p>
                </div>
                <button
                  onClick={async () => {
                    const newArt: Article = {
                      id: `art-${Date.now()}`,
                      title: "New Architectural Publication",
                      category: "AI Systems",
                      readTime: "7 min read",
                      publishedDate: "Feb 2026",
                      slug: "new-architectural-publication",
                      tags: ["AI", "Architecture", "Engineering"],
                      excerpt: "Executive summary and core architectural takeaways.",
                      content: [
                        "Paragraph 1 introducing the technical domain and architectural hypothesis.",
                        "Paragraph 2 presenting benchmark metrics, latency analyses, and implementation insights.",
                      ],
                    };
                    await addArticle(newArt);
                    setEditingArticle(newArt);
                    showToast("New article draft created!");
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write Article</span>
                </button>
              </div>

              {/* Articles List */}
              <div className="space-y-3">
                {data.articlesSection.articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 font-mono text-[10px] font-bold border border-amber-200">
                          {art.category}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">· {art.readTime}</span>
                        <h3 className="text-base font-bold text-slate-900 font-display">
                          {art.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingArticle(art)}
                        className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={async () => {
                          if (confirm(`Remove article "${art.title}"?`)) {
                            await deleteArticle(art.id);
                            showToast("Article removed.");
                          }
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ARTICLE EDIT MODAL */}
          {editingArticle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
              <div className="relative w-full max-w-3xl bg-white border border-stone-200 rounded-3xl p-6 sm:p-8 space-y-5 my-8 max-h-[90vh] overflow-y-auto shadow-warm-lg">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <h3 className="text-xl font-bold text-slate-900 font-display">
                    Edit Article: {editingArticle.title}
                  </h3>
                  <button
                    onClick={() => setEditingArticle(null)}
                    className="p-2 text-slate-500 hover:text-slate-900"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Article Title</label>
                    <input
                      type="text"
                      value={editingArticle.title}
                      onChange={(e) => {
                        const updated = { ...editingArticle, title: e.target.value };
                        setEditingArticle(updated);
                        updateArticle(editingArticle.id, { title: e.target.value });
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Category</label>
                      <input
                        type="text"
                        value={editingArticle.category}
                        onChange={(e) => {
                          const updated = { ...editingArticle, category: e.target.value };
                          setEditingArticle(updated);
                          updateArticle(editingArticle.id, { category: e.target.value });
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Read Time</label>
                      <input
                        type="text"
                        value={editingArticle.readTime}
                        onChange={(e) => {
                          const updated = { ...editingArticle, readTime: e.target.value };
                          setEditingArticle(updated);
                          updateArticle(editingArticle.id, { readTime: e.target.value });
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Published Date</label>
                      <input
                        type="text"
                        value={editingArticle.publishedDate}
                        onChange={(e) => {
                          const updated = { ...editingArticle, publishedDate: e.target.value };
                          setEditingArticle(updated);
                          updateArticle(editingArticle.id, { publishedDate: e.target.value });
                        }}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Excerpt</label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt}
                      onChange={(e) => {
                        const updated = { ...editingArticle, excerpt: e.target.value };
                        setEditingArticle(updated);
                        updateArticle(editingArticle.id, { excerpt: e.target.value });
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">
                      Paragraph Content (Separate with double enter)
                    </label>
                    <textarea
                      rows={6}
                      value={editingArticle.content.join("\n\n")}
                      onChange={(e) => {
                        const paragraphs = e.target.value.split("\n\n").filter(Boolean);
                        const updated = { ...editingArticle, content: paragraphs };
                        setEditingArticle(updated);
                        updateArticle(editingArticle.id, { content: paragraphs });
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    onClick={() => {
                      setEditingArticle(null);
                      showToast("Article published successfully!");
                    }}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                  >
                    Done & Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: INBOUND INQUIRIES */}
          {activeTab === "inbox" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Inbound Inquiries & Messages</h1>
                  <p className="text-xs text-slate-500">Direct inquiries received from visitors and hiring partners.</p>
                </div>
                <button
                  onClick={fetchMessages}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-orange-600 text-xs font-mono font-bold cursor-pointer shadow-xs"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", loadingMessages && "animate-spin")} />
                  <span>Refresh Inbox</span>
                </button>
              </div>

              {inboxMessages.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-3">
                  <Inbox className="w-10 h-10 text-slate-400 mx-auto" />
                  <h3 className="text-base font-bold text-slate-700">Inbox Clear</h3>
                  <p className="text-xs text-slate-400">
                    New inquiries submitted via your portfolio contact form will appear here in real time.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {inboxMessages.map((msg) => (
                    <div
                      key={msg._id}
                      className="p-6 rounded-2xl bg-white border border-stone-200 shadow-warm-sm space-y-3"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-bold text-slate-900">{msg.name}</h3>
                            <span className="text-xs font-mono text-orange-600 font-medium">({msg.email})</span>
                          </div>
                          <p className="text-xs text-amber-700 font-mono mt-0.5 font-bold">{msg.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(msg.createdAt).toLocaleDateString()}
                          </span>
                          <button
                            onClick={async () => {
                              if (confirm("Delete this message?")) {
                                await fetch(`/api/contact?id=${msg._id}`, { method: "DELETE" });
                                setInboxMessages((prev) => prev.filter((m) => m._id !== msg._id));
                                showToast("Message removed.");
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded cursor-pointer"
                            title="Delete message"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-700 bg-stone-50 p-4 rounded-xl leading-relaxed whitespace-pre-wrap border border-stone-100">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: CONTACT & FOOTER */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Contact Channels & Footer</h1>
                  <p className="text-xs text-slate-500">Edit contact email, location, socials, and copyright metadata.</p>
                </div>
                <button
                  onClick={() => showToast("Contact specifications updated!")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Direct Contact Email</label>
                    <input
                      type="email"
                      value={data.contactSection.email}
                      onChange={(e) => updateContactSection({ email: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Location</label>
                    <input
                      type="text"
                      value={data.contactSection.location}
                      onChange={(e) => updateContactSection({ location: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.github}
                      onChange={(e) => updateSocialLinks({ github: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.linkedin}
                      onChange={(e) => updateSocialLinks({ linkedin: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Twitter / X Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.twitter}
                      onChange={(e) => updateSocialLinks({ twitter: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Resume Download URL</label>
                    <input
                      type="text"
                      value={data.contactSection.resumePdfUrl}
                      onChange={(e) => updateContactSection({ resumePdfUrl: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 space-y-4">
                  <h4 className="text-xs font-mono font-bold text-slate-700 uppercase">
                    Footer & Metadata
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Footer Headline</label>
                      <input
                        type="text"
                        value={data.footer.tagline}
                        onChange={(e) => updateFooter({ tagline: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Copyright Statement</label>
                      <input
                        type="text"
                        value={data.footer.copyrightText}
                        onChange={(e) => updateFooter({ copyrightText: e.target.value })}
                        className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SYSTEM BACKUP */}
          {activeTab === "backup" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 font-display">System Backup & Snapshot</h1>
                <p className="text-xs text-slate-500">Export state snapshots or restore system presets.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Export Card */}
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Export Content Snapshot</h3>
                  <p className="text-xs text-slate-500">
                    Generate an offline JSON backup of all portfolio configurations, projects, and articles.
                  </p>
                  <button
                    onClick={() => {
                      const json = exportJSON();
                      const blob = new Blob([json], { type: "application/json" });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `portfolio_backup_${Date.now()}.json`;
                      a.click();
                      showToast("Content snapshot downloaded!");
                    }}
                    className="w-full py-2.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
                  >
                    Download JSON Snapshot
                  </button>
                </div>

                {/* Reset to Defaults */}
                <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Restore Standard Presets</h3>
                  <p className="text-xs text-slate-500">
                    Restore all portfolio sections to standard architectural defaults.
                  </p>
                  <button
                    onClick={async () => {
                      if (confirm("Restore all portfolio content to standard architectural presets?")) {
                        await resetToDefaults();
                        showToast("Standard presets restored successfully.");
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-bold hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                  >
                    Restore Standard Presets
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
