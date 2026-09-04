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
  FileText,
  BrainCircuit,
  Cpu,
  Code2,
  Terminal,
  Globe,
  Cloud,
  Zap,
  Activity,
  GitBranch,
  Bot,
  Boxes,
  Copy,
  MessageSquareQuote,
  Star,
  Check,
} from "lucide-react";
import { usePortfolio } from "@/context/PortfolioContext";
import {
  Project,
  Article,
  SkillCard,
  SkillCardTheme,
  getSkillsCards,
  Testimonial,
} from "@/data/portfolioData";
import { cn } from "@/lib/utils";
import {
  loginAdminAction,
  logoutAdminAction,
  verifyAdminSessionAction,
} from "@/actions/authActions";
import {
  getContactMessagesAction,
  deleteContactMessageAction,
  ContactMessageItem,
} from "@/actions/contactActions";
import { uploadAssetAction } from "@/actions/uploadActions";
import {
  getAdminTestimonialsAction,
  updateTestimonialStatusAction,
  deleteTestimonialAction,
  createAdminTestimonialAction,
  updateAdminTestimonialAction,
} from "@/actions/testimonialActions";

type AdminTab =
  | "dashboard"
  | "general"
  | "bento"
  | "projects"
  | "articles"
  | "testimonials"
  | "inbox"
  | "contact"
  | "footer";

const AVAILABLE_ICONS = [
  { name: "BrainCircuit", label: "AI & Neural" },
  { name: "Layers", label: "Full Stack & Web" },
  { name: "Server", label: "DevOps & Infrastructure" },
  { name: "Database", label: "Databases & Vector Storage" },
  { name: "Workflow", label: "System Architecture" },
  { name: "Cpu", label: "Compute & Hardware" },
  { name: "Code2", label: "Clean Code & Logic" },
  { name: "ShieldCheck", label: "Security & Auth" },
  { name: "Terminal", label: "CLI & Linux Admin" },
  { name: "Globe", label: "Web & Distributed" },
  { name: "Cloud", label: "Cloud & Microservices" },
  { name: "Sparkles", label: "Innovation & Features" },
  { name: "Zap", label: "Low Latency & Speed" },
  { name: "Activity", label: "Telemetry & Performance" },
  { name: "GitBranch", label: "CI/CD & Git Pipelines" },
  { name: "Bot", label: "Autonomous Agent Swarms" },
  { name: "Boxes", label: "Modular Systems" },
];

const AVAILABLE_THEMES: { id: SkillCardTheme; label: string; bg: string; text: string }[] = [
  { id: "orange", label: "Orange (Signature)", bg: "bg-orange-500", text: "text-orange-700" },
  { id: "amber", label: "Amber (Warm)", bg: "bg-amber-500", text: "text-amber-700" },
  { id: "rose", label: "Rose (Accent)", bg: "bg-rose-500", text: "text-rose-700" },
  { id: "blue", label: "Blue (Tech)", bg: "bg-blue-500", text: "text-blue-700" },
  { id: "emerald", label: "Emerald (System)", bg: "bg-emerald-500", text: "text-emerald-700" },
  { id: "purple", label: "Purple (Future/AI)", bg: "bg-purple-500", text: "text-purple-700" },
];

export default function AdminPage() {
  const {
    data,
    isDbConnected,
    refreshData,
    updateGeneral,
    updateSkillsSection,
    updateSkillsCards,
    addSkillCard,
    updateSkillCard,
    deleteSkillCard,
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
    async function checkSession() {
      try {
        const savedToken = localStorage.getItem("admin_auth_token_2026");
        if (savedToken) {
          setIsAuthenticated(true);
        }
        const verifyRes = await verifyAdminSessionAction();
        if (verifyRes.isValid) {
          setIsAuthenticated(true);
        }
      } catch {}
    }
    checkSession();
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

  // Skills & Architecture Card State for Edit Modal
  const [editingSkillCard, setEditingSkillCard] = useState<SkillCard | null>(null);
  const [isSavingSkillCard, setIsSavingSkillCard] = useState(false);
  const [newCardTag, setNewCardTag] = useState("");
  const [newCardPrinciple, setNewCardPrinciple] = useState("");

  // Uploading States
  const [isUploadingProfile, setIsUploadingProfile] = useState(false);
  const [isUploadingProjectImg, setIsUploadingProjectImg] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [isSavingProject, setIsSavingProject] = useState(false);
  const [isSavingArticle, setIsSavingArticle] = useState(false);

  // Messages Inbox State
  const [inboxMessages, setInboxMessages] = useState<ContactMessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Testimonials State
  const [adminTestimonials, setAdminTestimonials] = useState<Testimonial[]>([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [testimonialFilter, setTestimonialFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [isSavingTestimonial, setIsSavingTestimonial] = useState(false);

  const handleSaveProject = async () => {
    if (!editingProject) return;
    if (!editingProject.title.trim()) {
      alert("Project title cannot be empty");
      return;
    }
    setIsSavingProject(true);
    try {
      const existing = data.projectsSection.projects.some((p) => p.id === editingProject.id);
      if (existing) {
        await updateProject(editingProject.id, editingProject);
      } else {
        await addProject(editingProject);
      }
      setEditingProject(null);
      showToast("Project successfully saved & synced to MongoDB!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save project";
      alert(`Save failed: ${msg}`);
    } finally {
      setIsSavingProject(false);
    }
  };

  const handleDeleteProject = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete project "${title}"? This cannot be undone.`)) {
      try {
        await deleteProject(id);
        showToast(`Project "${title}" deleted from database.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to delete project";
        alert(`Delete failed: ${msg}`);
      }
    }
  };

  const handleSaveArticle = async () => {
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      alert("Article title cannot be empty");
      return;
    }
    setIsSavingArticle(true);
    try {
      const existing = data.articlesSection.articles.some((a) => a.id === editingArticle.id);
      if (existing) {
        await updateArticle(editingArticle.id, editingArticle);
      } else {
        await addArticle(editingArticle);
      }
      setEditingArticle(null);
      showToast("Article successfully saved & published!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save article";
      alert(`Save failed: ${msg}`);
    } finally {
      setIsSavingArticle(false);
    }
  };

  const handleDeleteArticle = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete article "${title}"? This cannot be undone.`)) {
      try {
        await deleteArticle(id);
        showToast(`Article "${title}" deleted from database.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to delete article";
        alert(`Delete failed: ${msg}`);
      }
    }
  };

  const handleCreateNewSkillCard = () => {
    const newCard: SkillCard = {
      id: `card-${Date.now()}`,
      title: "New Technical Specialization",
      badge: "Architecture",
      icon: "BrainCircuit",
      theme: "orange",
      description: "Describe the architectural patterns, technologies, and high-performance components.",
      tags: ["Python", "Next.js", "Cloud"],
      skillBars: [
        { name: "Core Architecture", level: "92%" },
      ],
      metrics: [
        { label: "Throughput / Metric", value: "Sub-50ms" },
      ],
      principles: [
        "Key architectural principle or system guarantee",
      ],
    };
    setEditingSkillCard(newCard);
  };

  const handleSaveSkillCard = async () => {
    if (!editingSkillCard) return;
    if (!editingSkillCard.title.trim()) {
      alert("Card title cannot be empty");
      return;
    }
    setIsSavingSkillCard(true);
    try {
      const currentCards = getSkillsCards(data.skillsSection);
      const exists = currentCards.some((c) => c.id === editingSkillCard.id);
      let updatedCards: SkillCard[];
      if (exists) {
        updatedCards = currentCards.map((c) =>
          c.id === editingSkillCard.id ? editingSkillCard : c
        );
      } else {
        updatedCards = [...currentCards, editingSkillCard];
      }
      await updateSkillsCards(updatedCards);
      setEditingSkillCard(null);
      showToast("Architecture card successfully saved & synced!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save card";
      alert(`Save failed: ${msg}`);
    } finally {
      setIsSavingSkillCard(false);
    }
  };

  const handleDeleteSkillCard = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete card "${title}"? This cannot be undone.`)) {
      try {
        const currentCards = getSkillsCards(data.skillsSection);
        const updatedCards = currentCards.filter((c) => c.id !== id);
        await updateSkillsCards(updatedCards);
        showToast(`Card "${title}" deleted from database.`);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Failed to delete card";
        alert(`Delete failed: ${msg}`);
      }
    }
  };

  const handleDuplicateSkillCard = async (card: SkillCard) => {
    const duplicated: SkillCard = {
      ...card,
      id: `card-${Date.now()}`,
      title: `${card.title} (Copy)`,
    };
    const currentCards = getSkillsCards(data.skillsSection);
    await updateSkillsCards([...currentCards, duplicated]);
    showToast(`Duplicated "${card.title}"!`);
  };

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await getContactMessagesAction();
      if (res.success && res.messages) {
        setInboxMessages(res.messages);
      }
    } catch (err) {
      console.error("Failed to fetch inquiries via Server Action:", err);
    } finally {
      setLoadingMessages(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === "inbox") {
      fetchMessages();
    }
  }, [isAuthenticated, activeTab, fetchMessages]);

  const fetchTestimonials = useCallback(async () => {
    setLoadingTestimonials(true);
    try {
      const res = await getAdminTestimonialsAction();
      if (res.success && res.testimonials) {
        setAdminTestimonials(res.testimonials);
      }
    } catch (err) {
      console.error("Failed to fetch testimonials in Admin:", err);
    } finally {
      setLoadingTestimonials(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTestimonials();
    }
  }, [isAuthenticated, fetchTestimonials]);

  const handleStatusChange = async (id: string, newStatus: "pending" | "approved" | "rejected") => {
    try {
      const res = await updateTestimonialStatusAction(id, newStatus);
      if (res.success) {
        setAdminTestimonials((prev) =>
          prev.map((t) => (t.id === id ? { ...t, status: newStatus } : t))
        );
        showToast(`Testimonial status updated to ${newStatus}.`);
        refreshData();
      } else {
        alert(res.error || "Failed to update status");
      }
    } catch {
      alert("Error updating testimonial status");
    }
  };

  const handleDeleteTestimonial = async (id: string, name: string) => {
    if (confirm(`Permanently delete testimonial from "${name}"? This action cannot be undone.`)) {
      try {
        const res = await deleteTestimonialAction(id);
        if (res.success) {
          setAdminTestimonials((prev) => prev.filter((t) => t.id !== id));
          showToast("Testimonial deleted from database.");
          refreshData();
        } else {
          alert(res.error || "Failed to delete testimonial");
        }
      } catch {
        alert("Error deleting testimonial");
      }
    }
  };

  const handleSaveTestimonialModal = async () => {
    if (!editingTestimonial) return;
    if (!editingTestimonial.name?.trim() || !editingTestimonial.role?.trim() || !editingTestimonial.content?.trim()) {
      alert("Name, role, and feedback content are required.");
      return;
    }

    setIsSavingTestimonial(true);
    try {
      if (editingTestimonial.id) {
        const res = await updateAdminTestimonialAction(editingTestimonial.id, {
          name: editingTestimonial.name,
          role: editingTestimonial.role,
          company: editingTestimonial.company,
          content: editingTestimonial.content,
          rating: editingTestimonial.rating,
          avatar: editingTestimonial.avatar,
          email: editingTestimonial.email,
          status: editingTestimonial.status as "pending" | "approved" | "rejected",
        });
        if (res.success) {
          showToast("Testimonial updated successfully!");
          setEditingTestimonial(null);
          await fetchTestimonials();
          refreshData();
        } else {
          alert(res.error || "Failed to update testimonial");
        }
      } else {
        const res = await createAdminTestimonialAction({
          name: editingTestimonial.name,
          role: editingTestimonial.role,
          company: editingTestimonial.company,
          content: editingTestimonial.content,
          rating: editingTestimonial.rating || 5,
          avatar: editingTestimonial.avatar,
          email: editingTestimonial.email,
          status: (editingTestimonial.status as "pending" | "approved" | "rejected") || "approved",
        });
        if (res.success) {
          showToast("Testimonial created and published!");
          setEditingTestimonial(null);
          await fetchTestimonials();
          refreshData();
        } else {
          alert(res.error || "Failed to create testimonial");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save testimonial";
      alert(msg);
    } finally {
      setIsSavingTestimonial(false);
    }
  };

  // Secure Server Auth Handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthError("");

    try {
      const res = await loginAdminAction({ username, password });

      if (res.success && res.token) {
        setIsAuthenticated(true);
        try {
          localStorage.setItem("admin_auth_token_2026", res.token);
        } catch {}
        showToast("Authenticated. Welcome back!");
      } else {
        setAuthError(res.error || "Invalid username or password credentials.");
      }
    } catch {
      setAuthError("Failed to connect to authentication gateway.");
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
    try {
      localStorage.removeItem("admin_auth_token_2026");
      await logoutAdminAction();
    } catch {}
    showToast("Logged out securely.");
  };

  // Upload Helper
  const handleCloudinaryUpload = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadAssetAction(formData);

    if (res.success && res.url) {
      return res.url;
    }
    throw new Error(res.error || "Upload failed");
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
            {(() => {
              const pendingCount = adminTestimonials.filter((t) => t.status === "pending").length;
              return [
                { id: "dashboard", label: "Overview", icon: LayoutDashboard },
                { id: "general", label: "Hero & Identity", icon: User },
                { id: "bento", label: "Skills & Technical Stack", icon: Brain },
                { id: "projects", label: "Projects Portfolio", icon: FolderGit2 },
                { id: "articles", label: "Technical Articles", icon: BookOpen },
                {
                  id: "testimonials",
                  label: "Testimonials & Reviews",
                  icon: MessageSquareQuote,
                  badge: pendingCount,
                },
                { id: "inbox", label: "Inbound Messages", icon: Inbox },
                { id: "contact", label: "Contact & Resume", icon: Mail },
                { id: "footer", label: "Footer & Socials", icon: Globe },
              ];
            })().map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={cn(
                    "w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer",
                    isActive
                      ? "bg-orange-50 text-orange-700 border border-orange-200"
                      : "text-slate-600 hover:text-slate-900 hover:bg-stone-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </div>
                  {"badge" in tab && typeof tab.badge === "number" && tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-mono font-bold shadow-xs">
                      {tab.badge}
                    </span>
                  )}
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
                  <p className="text-xs font-mono font-medium text-slate-400">Resume Status</p>
                  <p className="text-base font-bold font-mono text-emerald-600 mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{data.contactSection.resumePdfUrl ? "Online PDF" : "Standard PDF"}</span>
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

                {/* Dynamic Hero Metric Badges / Stats Section */}
                <div className="pt-6 border-t border-stone-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                        <Activity className="w-4 h-4 text-orange-500" />
                        <span>Hero Key Metrics & Performance Stats</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Customize the metric badges displayed in the Hero banner (e.g. 8+ Years Experience, 45M+ Daily AI Inferences, &lt;35ms Latency, 99.99% Availability).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const currentStats = data.general.stats || [];
                        const newStats = [...currentStats, { value: "New Value", label: "Metric Label" }];
                        updateGeneral({ stats: newStats });
                        showToast("New metric item added!");
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-50 border border-orange-200 text-orange-700 text-xs font-mono font-bold hover:bg-orange-500 hover:text-white transition-all cursor-pointer shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Metric</span>
                    </button>
                  </div>

                  {(!data.general.stats || data.general.stats.length === 0) ? (
                    <div className="p-6 rounded-2xl bg-stone-50 border border-dashed border-stone-300 text-center space-y-2">
                      <p className="text-xs text-slate-500">No hero metric badges configured yet.</p>
                      <button
                        type="button"
                        onClick={() => {
                          const defaultStats = [
                            { value: "8+", label: "Years Experience" },
                            { value: "45M+", label: "Daily AI Inferences" },
                            { value: "<35ms", label: "P99 Inference Latency" },
                            { value: "99.99%", label: "System Availability" },
                          ];
                          updateGeneral({ stats: defaultStats });
                          showToast("Default metrics initialized!");
                        }}
                        className="text-xs font-mono font-bold text-orange-600 hover:underline cursor-pointer"
                      >
                        Click here to load standard metrics
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {data.general.stats.map((stat, idx) => (
                        <div
                          key={idx}
                          className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 hover:border-orange-300 transition-all space-y-2 relative group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold text-orange-700 uppercase">
                              Metric #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newStats = data.general.stats.filter((_, i) => i !== idx);
                                updateGeneral({ stats: newStats });
                                showToast("Metric removed!");
                              }}
                              className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete Metric"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                              Value (e.g. 8+, 45M+)
                            </label>
                            <input
                              type="text"
                              value={stat.value}
                              onChange={(e) => {
                                const newStats = [...data.general.stats];
                                newStats[idx] = { ...newStats[idx], value: e.target.value };
                                updateGeneral({ stats: newStats });
                              }}
                              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-slate-900 font-mono font-bold text-sm focus:border-orange-500"
                            />
                          </div>

                          <div>
                            <label className="text-[10px] font-mono text-slate-500 uppercase font-semibold">
                              Label / Description
                            </label>
                            <input
                              type="text"
                              value={stat.label}
                              onChange={(e) => {
                                const newStats = [...data.general.stats];
                                newStats[idx] = { ...newStats[idx], label: e.target.value };
                                updateGeneral({ stats: newStats });
                              }}
                              className="w-full mt-0.5 px-2.5 py-1.5 rounded-lg bg-white border border-stone-200 text-slate-800 text-xs focus:border-orange-500"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SKILLS & TECHNICAL CARDS */}
          {activeTab === "bento" && (
            <div className="space-y-8">
              {/* Header & Section Title Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
                    <BrainCircuit className="w-6 h-6 text-orange-600" />
                    <span>Skills & Technical Cards</span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Add, edit, delete, and customize technical skill cards in an equal-sized, responsive grid.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCreateNewSkillCard}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm hover:shadow-warm-md hover:scale-102 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Card</span>
                  </button>
                </div>
              </div>

              {/* Section Header Metadata */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Section Header & Banner Text</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Top Pill Badge Text</label>
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
                  <label className="text-xs font-mono font-bold text-slate-700">Section Overview Description</label>
                  <textarea
                    rows={2}
                    value={data.skillsSection.description}
                    onChange={(e) => updateSkillsSection({ description: e.target.value })}
                    className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm resize-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Dynamic Cards Grid */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900 font-display">
                      Skills & Technical Cards
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-700 text-xs font-mono font-bold">
                      {getSkillsCards(data.skillsSection).length} Cards Active
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Cards render in an equal-sized grid layout</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {getSkillsCards(data.skillsSection).map((card: SkillCard, idx: number) => {
                    const themeChoice = AVAILABLE_THEMES.find((t) => t.id === card.theme) || AVAILABLE_THEMES[0];
                    return (
                      <div
                        key={card.id || `card-${idx}`}
                        className="p-5 rounded-2xl bg-white border border-stone-200 shadow-warm-sm hover:shadow-warm-md hover:border-orange-300 transition-all flex flex-col justify-between space-y-4 relative group"
                      >
                        <div className="space-y-3">
                          {/* Top Row: Icon + Badge + Number */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2.5">
                              <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs", themeChoice.bg)}>
                                <BrainCircuit className="w-5 h-5" />
                              </div>
                              <div>
                                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                                  Card #{idx + 1}
                                </span>
                                <p className="text-xs font-mono text-slate-500">{card.icon || "BrainCircuit"}</p>
                              </div>
                            </div>
                            {card.badge && (
                              <span className="px-2.5 py-0.5 rounded-full bg-stone-100 border border-stone-200 text-[11px] font-mono font-bold text-slate-700">
                                {card.badge}
                              </span>
                            )}
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="text-base font-bold text-slate-900 font-display line-clamp-1">
                              {card.title}
                            </h4>
                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                              {card.description}
                            </p>
                          </div>

                          {/* Components Preview */}
                          <div className="space-y-1.5 pt-2 border-t border-stone-100 text-[11px] text-slate-600">
                            {card.skillBars && card.skillBars.length > 0 && (
                              <p className="flex items-center gap-1.5 text-amber-700 font-medium">
                                <Layers className="w-3.5 h-3.5" />
                                <span>{card.skillBars.length} Skill Progress Bars</span>
                              </p>
                            )}
                            {card.tags && card.tags.length > 0 && (
                              <p className="flex items-center gap-1.5 text-orange-700 font-medium">
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>{card.tags.length} Specialization Tags</span>
                              </p>
                            )}
                            {card.metrics && card.metrics.length > 0 && (
                              <p className="flex items-center gap-1.5 text-blue-700 font-medium">
                                <Activity className="w-3.5 h-3.5" />
                                <span>{card.metrics.length} Performance Metrics</span>
                              </p>
                            )}
                            {card.principles && card.principles.length > 0 && (
                              <p className="flex items-center gap-1.5 text-rose-700 font-medium">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>{card.principles.length} System Principles</span>
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                          <button
                            onClick={() => setEditingSkillCard(card)}
                            className="flex-1 py-1.5 px-3 rounded-lg bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-700 font-mono text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Card</span>
                          </button>
                          <button
                            onClick={() => handleDuplicateSkillCard(card)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-stone-100 cursor-pointer"
                            title="Duplicate Card"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSkillCard(card.id, card.title)}
                            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Delete Card"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CARD EDIT / CREATE MODAL */}
              {editingSkillCard && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="w-full max-w-2xl bg-white rounded-3xl border border-stone-200 shadow-warm-lg p-6 sm:p-8 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between pb-4 border-b border-stone-100">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 font-display">
                          {editingSkillCard.title ? `Edit Card: ${editingSkillCard.title}` : "Create New Architecture Card"}
                        </h2>
                        <p className="text-xs text-slate-500">Configure visual styling, skill bars, chips, and metrics.</p>
                      </div>
                      <button
                        onClick={() => setEditingSkillCard(null)}
                        className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-stone-100 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {/* Title & Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700">Card Title</label>
                          <input
                            type="text"
                            value={editingSkillCard.title}
                            onChange={(e) => setEditingSkillCard({ ...editingSkillCard, title: e.target.value })}
                            placeholder="e.g. Artificial Intelligence & LLMs"
                            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500 font-medium"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700">Badge / Pill Text</label>
                          <input
                            type="text"
                            value={editingSkillCard.badge || ""}
                            onChange={(e) => setEditingSkillCard({ ...editingSkillCard, badge: e.target.value })}
                            placeholder="e.g. Core Specialization"
                            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500 font-medium"
                          />
                        </div>
                      </div>

                      {/* Icon & Theme Selector */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700">Lucide Icon</label>
                          <select
                            value={editingSkillCard.icon || "BrainCircuit"}
                            onChange={(e) => setEditingSkillCard({ ...editingSkillCard, icon: e.target.value })}
                            className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500 font-mono"
                          >
                            {AVAILABLE_ICONS.map((icon) => (
                              <option key={icon.name} value={icon.name}>
                                {icon.name} ({icon.label})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-mono font-bold text-slate-700">Color Theme</label>
                          <div className="grid grid-cols-6 gap-2 mt-1">
                            {AVAILABLE_THEMES.map((theme) => (
                              <button
                                key={theme.id}
                                type="button"
                                onClick={() => setEditingSkillCard({ ...editingSkillCard, theme: theme.id })}
                                className={cn(
                                  "h-10 rounded-xl border flex items-center justify-center transition-all cursor-pointer",
                                  theme.bg,
                                  editingSkillCard.theme === theme.id ? "ring-2 ring-slate-900 ring-offset-2 scale-105" : "opacity-80 hover:opacity-100"
                                )}
                                title={theme.label}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs font-mono font-bold text-slate-700">Description</label>
                        <textarea
                          rows={3}
                          value={editingSkillCard.description}
                          onChange={(e) => setEditingSkillCard({ ...editingSkillCard, description: e.target.value })}
                          placeholder="Describe architecture components, frameworks, and patterns..."
                          className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm resize-none focus:bg-white focus:border-orange-500"
                        />
                      </div>

                      {/* Specialization Tags / Chips */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-orange-500" />
                          <span>Specialization Tags / Tech Chips</span>
                        </label>
                        <div className="flex flex-wrap gap-1.5">
                          {(editingSkillCard.tags || []).map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-xs font-medium text-slate-800 flex items-center gap-1.5 shadow-xs"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedTags = (editingSkillCard.tags || []).filter((_, i) => i !== tIdx);
                                  setEditingSkillCard({ ...editingSkillCard, tags: updatedTags });
                                }}
                                className="text-slate-400 hover:text-rose-600 cursor-pointer"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add technology / tag (e.g. PyTorch, Next.js 16)"
                            value={newCardTag}
                            onChange={(e) => setNewCardTag(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newCardTag.trim()) {
                                e.preventDefault();
                                const currentTags = editingSkillCard.tags || [];
                                setEditingSkillCard({ ...editingSkillCard, tags: [...currentTags, newCardTag.trim()] });
                                setNewCardTag("");
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-slate-900 text-xs focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newCardTag.trim()) {
                                const currentTags = editingSkillCard.tags || [];
                                setEditingSkillCard({ ...editingSkillCard, tags: [...currentTags, newCardTag.trim()] });
                                setNewCardTag("");
                              }
                            }}
                            className="px-4 py-1.5 rounded-xl bg-orange-500 text-white text-xs font-mono font-bold cursor-pointer hover:bg-orange-600 transition-all"
                          >
                            + Add Tag
                          </button>
                        </div>
                      </div>

                      {/* Skill Level Bars */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                            <Layers className="w-3.5 h-3.5 text-amber-500" />
                            <span>Skill Progress Bars (Optional)</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentBars = editingSkillCard.skillBars || [];
                              setEditingSkillCard({
                                ...editingSkillCard,
                                skillBars: [...currentBars, { name: "New Skill", level: "90%" }],
                              });
                            }}
                            className="text-xs text-orange-700 font-mono font-bold hover:underline cursor-pointer"
                          >
                            + Add Bar
                          </button>
                        </div>
                        <div className="space-y-2">
                          {(editingSkillCard.skillBars || []).map((bar, bIdx) => (
                            <div key={bIdx} className="p-3 rounded-xl bg-white border border-stone-200 space-y-2">
                              <div className="flex items-center gap-2">
                                <input
                                  type="text"
                                  value={bar.name}
                                  onChange={(e) => {
                                    const updatedBars = [...(editingSkillCard.skillBars || [])];
                                    updatedBars[bIdx].name = e.target.value;
                                    setEditingSkillCard({ ...editingSkillCard, skillBars: updatedBars });
                                  }}
                                  placeholder="Skill Name"
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-medium"
                                />
                                <input
                                  type="text"
                                  value={bar.level}
                                  onChange={(e) => {
                                    const updatedBars = [...(editingSkillCard.skillBars || [])];
                                    updatedBars[bIdx].level = e.target.value;
                                    setEditingSkillCard({ ...editingSkillCard, skillBars: updatedBars });
                                  }}
                                  placeholder="Level %"
                                  className="w-16 px-2 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-xs font-mono text-center font-bold text-orange-600"
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updatedBars = (editingSkillCard.skillBars || []).filter((_, i) => i !== bIdx);
                                    setEditingSkillCard({ ...editingSkillCard, skillBars: updatedBars });
                                  }}
                                  className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <input
                                type="range"
                                min="1"
                                max="100"
                                value={parseInt(bar.level.replace("%", "")) || 85}
                                onChange={(e) => {
                                  const updatedBars = [...(editingSkillCard.skillBars || [])];
                                  updatedBars[bIdx].level = `${e.target.value}%`;
                                  setEditingSkillCard({ ...editingSkillCard, skillBars: updatedBars });
                                }}
                                className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Performance Metrics */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-blue-500" />
                            <span>Performance Callout Metrics (Optional)</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const currentMetrics = editingSkillCard.metrics || [];
                              setEditingSkillCard({
                                ...editingSkillCard,
                                metrics: [...currentMetrics, { label: "Metric Label", value: "<30ms" }],
                              });
                            }}
                            className="text-xs text-orange-700 font-mono font-bold hover:underline cursor-pointer"
                          >
                            + Add Metric
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(editingSkillCard.metrics || []).map((m, mIdx) => (
                            <div key={mIdx} className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-center gap-2">
                              <input
                                type="text"
                                value={m.label}
                                onChange={(e) => {
                                  const updated = [...(editingSkillCard.metrics || [])];
                                  updated[mIdx].label = e.target.value;
                                  setEditingSkillCard({ ...editingSkillCard, metrics: updated });
                                }}
                                placeholder="Label (e.g. Latency)"
                                className="flex-1 px-2 py-1 rounded bg-stone-50 border border-stone-200 text-xs"
                              />
                              <input
                                type="text"
                                value={m.value}
                                onChange={(e) => {
                                  const updated = [...(editingSkillCard.metrics || [])];
                                  updated[mIdx].value = e.target.value;
                                  setEditingSkillCard({ ...editingSkillCard, metrics: updated });
                                }}
                                placeholder="Value (e.g. <45ms)"
                                className="w-24 px-2 py-1 rounded bg-stone-50 border border-stone-200 text-xs font-mono font-bold text-orange-600"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingSkillCard.metrics || []).filter((_, i) => i !== mIdx);
                                  setEditingSkillCard({ ...editingSkillCard, metrics: updated });
                                }}
                                className="p-1 text-rose-400 hover:text-rose-600"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Principles / Bullet Points */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <label className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-rose-500" />
                          <span>System Principles & Guarantees (Optional)</span>
                        </label>
                        <div className="space-y-1.5">
                          {(editingSkillCard.principles || []).map((p, pIdx) => (
                            <div key={pIdx} className="p-2 rounded-xl bg-white border border-stone-200 flex items-center justify-between text-xs text-slate-800">
                              <span className="flex-1">{p}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = (editingSkillCard.principles || []).filter((_, i) => i !== pIdx);
                                  setEditingSkillCard({ ...editingSkillCard, principles: updated });
                                }}
                                className="text-slate-400 hover:text-rose-600 ml-2"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Add bullet principle (e.g. Zero-downtime rolling updates)"
                            value={newCardPrinciple}
                            onChange={(e) => setNewCardPrinciple(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && newCardPrinciple.trim()) {
                                e.preventDefault();
                                const currentP = editingSkillCard.principles || [];
                                setEditingSkillCard({ ...editingSkillCard, principles: [...currentP, newCardPrinciple.trim()] });
                                setNewCardPrinciple("");
                              }
                            }}
                            className="flex-1 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-slate-900 text-xs focus:border-orange-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (newCardPrinciple.trim()) {
                                const currentP = editingSkillCard.principles || [];
                                setEditingSkillCard({ ...editingSkillCard, principles: [...currentP, newCardPrinciple.trim()] });
                                setNewCardPrinciple("");
                              }
                            }}
                            className="px-4 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-mono font-bold cursor-pointer hover:bg-rose-600 transition-all"
                          >
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => setEditingSkillCard(null)}
                        className="px-5 py-2.5 rounded-xl border border-stone-200 text-slate-600 text-xs font-mono font-bold hover:bg-stone-50 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleSaveSkillCard}
                        disabled={isSavingSkillCard}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-mono font-bold shadow-warm-sm hover:shadow-warm-md hover:scale-102 transition-all cursor-pointer flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>{isSavingSkillCard ? "Saving Card..." : "Save Architecture Card"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
                  onClick={() => {
                    const newProj: Project = {
                      id: `proj-${Date.now()}`,
                      title: "New Architectural Project",
                      category: "AI & Agents",
                      tagline: "Modern web application and AI assistant.",
                      description: "Brief summary of the application features and technologies used.",
                      fullOverview: "Detailed breakdown of the application architecture, technical decisions, and features.",
                      image: "",
                      tags: ["Next.js 16", "Python", "PyTorch"],
                      metrics: [
                        { label: "Performance", value: "Fast" },
                        { label: "Accuracy", value: "95%" },
                      ],
                      architectureDetails: ["Step-by-step workflow planning", "Vector search integration"],
                      liveUrl: "",
                      githubUrl: "",
                      featured: false,
                    };
                    setEditingProject(newProj);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer hover:shadow-warm-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Project</span>
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
                        {proj.featured && (
                          <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold border border-emerald-200">
                            Featured
                          </span>
                        )}
                        <h3 className="text-base font-bold text-slate-900 font-display">
                          {proj.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{proj.tagline || proj.description}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => setEditingProject({ ...proj })}
                        className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id, proj.title)}
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
                    {data.projectsSection.projects.some((p) => p.id === editingProject.id)
                      ? `Edit Project: ${editingProject.title}`
                      : "Create New Project"}
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
                      <label className="text-xs font-mono font-bold text-slate-700">Project Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Category *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.category}
                        onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                        placeholder="e.g. AI & Agents, Full Stack Web"
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
                                  setEditingProject({ ...editingProject, image: url });
                                  showToast("Asset uploaded successfully!");
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
                          onChange={(e) => setEditingProject({ ...editingProject, image: e.target.value })}
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
                      onChange={(e) => setEditingProject({ ...editingProject, tagline: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Card Overview Summary</label>
                    <textarea
                      rows={2}
                      value={editingProject.description}
                      onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Full Case Study Overview</label>
                    <textarea
                      rows={4}
                      value={editingProject.fullOverview}
                      onChange={(e) => setEditingProject({ ...editingProject, fullOverview: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(editingProject.tags || []).join(", ")}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="e.g. Next.js 16, Python, PyTorch, Docker"
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Live Demo URL</label>
                      <input
                        type="text"
                        value={editingProject.liveUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, liveUrl: e.target.value })}
                        placeholder="https://..."
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">GitHub Repository URL</label>
                      <input
                        type="text"
                        value={editingProject.githubUrl || ""}
                        onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                        placeholder="https://github.com/..."
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      id="featured-checkbox"
                      checked={!!editingProject.featured}
                      onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                      className="w-4 h-4 text-orange-500 rounded border-stone-300 focus:ring-orange-500"
                    />
                    <label htmlFor="featured-checkbox" className="text-xs font-mono font-bold text-slate-700 cursor-pointer">
                      Featured Project (Highlighted in Homepage Showcase)
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-5 py-2.5 rounded-xl bg-stone-100 text-slate-700 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isSavingProject}
                    onClick={handleSaveProject}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm hover:shadow-warm-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingProject ? "Saving to Database..." : "Save Project"}
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
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Technical Articles</h1>
                  <p className="text-xs text-slate-500">Write, publish, and manage technical articles and guides.</p>
                </div>
                <button
                  onClick={() => {
                    const newArt: Article = {
                      id: `art-${Date.now()}`,
                      title: "New Technical Article",
                      category: "AI & Web",
                      readTime: "5 min read",
                      publishedDate: "Feb 2026",
                      slug: `article-${Date.now()}`,
                      tags: ["Web Development", "AI", "Software"],
                      excerpt: "Brief summary and key takeaways of the article.",
                      content: [
                        "Introduction to the technical topic and why it matters.",
                        "Step-by-step breakdown with code examples and best practices.",
                      ],
                    };
                    setEditingArticle(newArt);
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer hover:shadow-warm-md transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Write New Article</span>
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
                        onClick={() => setEditingArticle({ ...art })}
                        className="px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-orange-600 hover:text-orange-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleDeleteArticle(art.id, art.title)}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                        title="Delete article"
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
                    {data.articlesSection.articles.some((a) => a.id === editingArticle.id)
                      ? `Edit Article: ${editingArticle.title}`
                      : "Write New Article"}
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
                    <label className="text-xs font-mono font-bold text-slate-700">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={editingArticle.title}
                      onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Category *</label>
                      <input
                        type="text"
                        required
                        value={editingArticle.category}
                        onChange={(e) => setEditingArticle({ ...editingArticle, category: e.target.value })}
                        placeholder="e.g. AI Systems"
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Read Time</label>
                      <input
                        type="text"
                        value={editingArticle.readTime}
                        onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                        placeholder="e.g. 5 min read"
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-mono font-bold text-slate-700">Published Date</label>
                      <input
                        type="text"
                        value={editingArticle.publishedDate}
                        onChange={(e) => setEditingArticle({ ...editingArticle, publishedDate: e.target.value })}
                        placeholder="e.g. Feb 2026"
                        className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">
                      Tags (Comma-separated)
                    </label>
                    <input
                      type="text"
                      value={(editingArticle.tags || []).join(", ")}
                      onChange={(e) =>
                        setEditingArticle({
                          ...editingArticle,
                          tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      placeholder="e.g. LLMs, Next.js, Architecture"
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Excerpt / Summary</label>
                    <textarea
                      rows={2}
                      value={editingArticle.excerpt}
                      onChange={(e) => setEditingArticle({ ...editingArticle, excerpt: e.target.value })}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">
                      Paragraph Content (Separate paragraphs with double enter)
                    </label>
                    <textarea
                      rows={6}
                      value={(editingArticle.content || []).join("\n\n")}
                      onChange={(e) => {
                        const paragraphs = e.target.value.split("\n\n").filter(Boolean);
                        setEditingArticle({ ...editingArticle, content: paragraphs });
                      }}
                      className="w-full mt-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingArticle(null)}
                    className="px-5 py-2.5 rounded-xl bg-stone-100 text-slate-700 font-bold text-xs hover:bg-stone-200 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={isSavingArticle}
                    onClick={handleSaveArticle}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm hover:shadow-warm-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingArticle ? "Publishing to Database..." : "Save Article"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: TESTIMONIALS & REVIEWS MANAGEMENT (SIMPLE & CLEAN) */}
          {activeTab === "testimonials" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">
                    Client Reviews & Feedback
                  </h1>
                  <p className="text-xs text-slate-500">
                    Approve reviews to display them on your live portfolio, or decline and delete them.
                  </p>
                </div>
                <button
                  onClick={fetchTestimonials}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-stone-200 text-orange-600 text-xs font-mono font-bold cursor-pointer shadow-xs hover:border-orange-300"
                >
                  <RefreshCw className={cn("w-3.5 h-3.5", loadingTestimonials && "animate-spin")} />
                  <span>Refresh</span>
                </button>
              </div>

              {/* Reviews List */}
              {adminTestimonials.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-2">
                  <MessageSquareQuote className="w-10 h-10 text-slate-300 mx-auto" />
                  <h3 className="text-base font-bold text-slate-700">No reviews yet</h3>
                  <p className="text-xs text-slate-400">
                    When visitors or clients submit feedback from the website, they will appear here for approval.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {adminTestimonials.map((item) => (
                    <div
                      key={item.id}
                      className={cn(
                        "p-5 rounded-2xl bg-white border shadow-warm-sm space-y-3 transition-all",
                        item.status === "pending"
                          ? "border-amber-300 ring-1 ring-amber-200/50"
                          : "border-stone-200"
                      )}
                    >
                      {/* Top Row: Name, Role, Rating & Status */}
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-900">{item.name}</h3>
                            <span className="text-xs text-slate-500 font-mono">
                              ({item.role}{item.company ? ` · ${item.company}` : ""})
                            </span>
                          </div>

                          {/* Star Rating */}
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: item.rating || 5 }).map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {item.status === "pending" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-[11px] font-mono font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                              <span>Pending</span>
                            </span>
                          )}
                          {item.status === "approved" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-bold">
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span>Approved & Live</span>
                            </span>
                          )}
                          {item.status === "rejected" && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-slate-600 text-[11px] font-mono font-bold">
                              <span>Declined</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quote */}
                      <p className="text-xs sm:text-sm text-slate-700 bg-stone-50 p-3.5 rounded-xl leading-relaxed border border-stone-100">
                        &ldquo;{item.content}&rdquo;
                      </p>

                      {/* Simple Actions */}
                      <div className="flex items-center justify-between pt-1">
                        <div className="flex items-center gap-2">
                          {item.status !== "approved" ? (
                            <button
                              onClick={() => handleStatusChange(item.id, "approved")}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleStatusChange(item.id, "rejected")}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Unpublish
                            </button>
                          )}

                          {item.status === "pending" && (
                            <button
                              onClick={() => handleStatusChange(item.id, "rejected")}
                              className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-medium transition-colors cursor-pointer"
                            >
                              Decline
                            </button>
                          )}
                        </div>

                        <button
                          onClick={() => handleDeleteTestimonial(item.id, item.name)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg cursor-pointer"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
                                const delRes = await deleteContactMessageAction(msg._id);
                                if (delRes.success) {
                                  setInboxMessages((prev) => prev.filter((m) => m._id !== msg._id));
                                  showToast("Message removed.");
                                } else {
                                  alert(delRes.error || "Failed to delete message");
                                }
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

          {/* TAB 7: CONTACT & RESUME */}
          {activeTab === "contact" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display">Contact Channels & Resume PDF</h1>
                  <p className="text-xs text-slate-500">Upload official PDF resume, edit email, location, and metadata.</p>
                </div>
                <button
                  onClick={() => showToast("Contact specifications updated!")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Changes</span>
                </button>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-6">
                {/* Resume PDF Uploader */}
                <div className="p-5 rounded-2xl bg-orange-50/60 border border-orange-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 font-display">
                          Technical Resume PDF Document
                        </h4>
                        <p className="text-xs text-slate-500">
                          Upload your updated PDF resume. Visitors will download this file directly.
                        </p>
                      </div>
                    </div>

                    {data.contactSection.resumePdfUrl && (
                      <a
                        href={data.contactSection.resumePdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-mono font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 self-start sm:self-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Preview / Test Download</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-1">
                    <label className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-mono font-bold shadow-warm-sm hover:shadow-warm-md hover:scale-102 transition-all cursor-pointer inline-flex items-center gap-2 shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{isUploadingResume ? "Uploading PDF..." : "Upload New Resume (PDF)"}</span>
                      <input
                        type="file"
                        accept="application/pdf"
                        disabled={isUploadingResume}
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingResume(true);
                          try {
                            const url = await handleCloudinaryUpload(file);
                            if (url) {
                              await updateContactSection({ resumePdfUrl: url });
                              showToast("Resume PDF uploaded & saved to database!");
                            }
                          } catch (err: unknown) {
                            const msg = err instanceof Error ? err.message : "PDF upload failed";
                            alert(msg);
                          } finally {
                            setIsUploadingResume(false);
                          }
                        }}
                      />
                    </label>

                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={data.contactSection.resumePdfUrl || ""}
                        onChange={(e) => updateContactSection({ resumePdfUrl: e.target.value })}
                        placeholder="Direct URL (e.g. https://res.cloudinary.com/... or /resume.pdf)"
                        className="w-full px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-slate-900 text-xs font-mono focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

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

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Twitter / X Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.twitter}
                      onChange={(e) => updateSocialLinks({ twitter: e.target.value })}
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* TAB 8: FOOTER & SOCIAL LINKS */}
          {activeTab === "footer" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 font-display flex items-center gap-2">
                    <Globe className="w-6 h-6 text-orange-600" />
                    <span>Footer & Social Links</span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Customize footer branding, copyright statement, technology credits, and social profile links.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => showToast("Footer settings saved & synced to database!")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-warm-sm cursor-pointer hover:shadow-warm-md transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Footer</span>
                </button>
              </div>

              {/* Footer Branding & Tagline */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-orange-500" />
                  <span>Footer Brand & Headline</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Brand Title</label>
                    <input
                      type="text"
                      value={data.footer.brandTitle}
                      onChange={(e) => updateFooter({ brandTitle: e.target.value })}
                      placeholder="e.g. Iduwara Nisal"
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Brand Sub-Badge / Extension</label>
                    <input
                      type="text"
                      value={data.footer.brandSub}
                      onChange={(e) => updateFooter({ brandSub: e.target.value })}
                      placeholder="e.g. / Portfolio"
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-mono font-bold text-slate-700">Footer Tagline & Summary</label>
                  <textarea
                    rows={2}
                    value={data.footer.tagline}
                    onChange={(e) => updateFooter({ tagline: e.target.value })}
                    placeholder="Brief footer tagline..."
                    className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm resize-none focus:bg-white focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Copyright & System Credits */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                  <span>Copyright & Technology Credits</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Copyright Statement</label>
                    <input
                      type="text"
                      value={data.footer.copyrightText}
                      onChange={(e) => updateFooter({ copyrightText: e.target.value })}
                      placeholder="e.g. All rights reserved."
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Technology Credits Text</label>
                    <input
                      type="text"
                      value={data.footer.creditsText}
                      onChange={(e) => updateFooter({ creditsText: e.target.value })}
                      placeholder="e.g. Built with Next.js 16 · TypeScript · Tailwind CSS · MongoDB"
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                  <Globe className="w-4 h-4 text-orange-500" />
                  <span>Social Media Profiles & External Links</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">GitHub Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.github}
                      onChange={(e) => updateSocialLinks({ github: e.target.value })}
                      placeholder="https://github.com/..."
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">LinkedIn Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.linkedin}
                      onChange={(e) => updateSocialLinks({ linkedin: e.target.value })}
                      placeholder="https://linkedin.com/in/..."
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Twitter / X Profile URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.twitter}
                      onChange={(e) => updateSocialLinks({ twitter: e.target.value })}
                      placeholder="https://x.com/..."
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono font-bold text-slate-700">Discord Profile / Server URL</label>
                    <input
                      type="text"
                      value={data.socialLinks.discord || ""}
                      onChange={(e) => updateSocialLinks({ discord: e.target.value })}
                      placeholder="https://discord.com/..."
                      className="w-full mt-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-slate-900 text-sm focus:bg-white focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Live Footer Preview */}
              <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-warm-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                    <Eye className="w-4 h-4 text-orange-500" />
                    <span>Live Footer Preview</span>
                  </h3>
                  <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2.5 py-1 rounded-full border border-orange-200">
                    Realtime Preview
                  </span>
                </div>

                <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200 space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-xs">
                        <Cpu className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <span className="font-display font-bold text-sm text-slate-900">
                        {data.footer.brandTitle}{" "}
                        <span className="text-orange-600 font-mono text-xs">{data.footer.brandSub}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      {data.socialLinks.github && <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono">GitHub</span>}
                      {data.socialLinks.linkedin && <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono">LinkedIn</span>}
                      {data.socialLinks.twitter && <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono">Twitter/X</span>}
                      {data.socialLinks.discord && <span className="px-2 py-0.5 rounded bg-white border border-stone-200 font-mono">Discord</span>}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">{data.footer.tagline}</p>

                  <div className="pt-3 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
                    <span>© {new Date().getFullYear()} {data.general.name}. {data.footer.copyrightText}</span>
                    <span>{data.footer.creditsText}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
