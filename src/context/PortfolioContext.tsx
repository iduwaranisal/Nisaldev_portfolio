"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  PortfolioData,
  INITIAL_PORTFOLIO_DATA,
  Project,
  Article,
  BentoConfig,
} from "@/data/portfolioData";

interface PortfolioContextType {
  data: PortfolioData;
  isLoaded: boolean;
  isDbConnected: boolean;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  updateGeneral: (fields: Partial<PortfolioData["general"]>) => Promise<void>;
  updateSkillsSection: (fields: Partial<PortfolioData["skillsSection"]>) => Promise<void>;
  updateBentoConfig: (bento: BentoConfig) => Promise<void>;
  updateProjectsSection: (fields: Partial<PortfolioData["projectsSection"]>) => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updated: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateArticlesSection: (fields: Partial<PortfolioData["articlesSection"]>) => Promise<void>;
  addArticle: (article: Article) => Promise<void>;
  updateArticle: (id: string, updated: Partial<Article>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  updateContactSection: (fields: Partial<PortfolioData["contactSection"]>) => Promise<void>;
  updateSocialLinks: (fields: Partial<PortfolioData["socialLinks"]>) => Promise<void>;
  updateFooter: (fields: Partial<PortfolioData["footer"]>) => Promise<void>;
  resetToDefaults: () => Promise<void>;
  exportJSON: () => string;
  importJSON: (jsonString: string) => Promise<boolean>;
}

function sanitizeData(raw: PortfolioData): PortfolioData {
  const sanitize = (url?: string) => {
    if (!url || typeof url !== "string") return "";
    if (url.includes("unsplash.com")) return "";
    return url;
  };

  return {
    ...raw,
    general: {
      ...raw.general,
      profileImage: sanitize(raw.general?.profileImage),
    },
    projectsSection: {
      ...raw.projectsSection,
      projects: (raw.projectsSection?.projects || []).map((p) => ({
        ...p,
        image: sanitize(p.image),
      })),
    },
  };
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({
  children,
  initialData,
}: {
  children: React.ReactNode;
  initialData?: PortfolioData;
}) {
  const [data, setData] = useState<PortfolioData>(() =>
    initialData ? sanitizeData(initialData) : INITIAL_PORTFOLIO_DATA
  );
  const [isLoaded, setIsLoaded] = useState(!!initialData);
  const [isDbConnected, setIsDbConnected] = useState(!!initialData);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFromApi = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/portfolio", { cache: "no-store" });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const clean = sanitizeData(json.data);
          setData(clean);
          setIsDbConnected(true);
          try {
            localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(clean));
          } catch {}
          return;
        }
      }
      throw new Error("API returned non-success");
    } catch (err) {
      console.warn("Failed to fetch from MongoDB API, using cached fallback:", err);
      try {
        const saved = localStorage.getItem("nisaldev_portfolio_cms_data_2026");
        if (saved) {
          setData(sanitizeData(JSON.parse(saved)));
        }
      } catch {}
    } finally {
      setIsLoading(false);
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!initialData) {
      fetchFromApi();
    }
  }, [initialData, fetchFromApi]);

  const saveConfigToApi = async (updatedData: PortfolioData) => {
    const clean = sanitizeData(updatedData);
    setData(clean);
    try {
      localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(clean));
      await fetch("/api/portfolio", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          general: clean.general,
          skillsSection: clean.skillsSection,
          contactSection: clean.contactSection,
          socialLinks: clean.socialLinks,
          footer: clean.footer,
        }),
      });
    } catch (err) {
      console.error("Failed to sync config to MongoDB:", err);
    }
  };

  const updateGeneral = async (fields: Partial<PortfolioData["general"]>) => {
    const updated: PortfolioData = {
      ...data,
      general: { ...data.general, ...fields },
    };
    await saveConfigToApi(updated);
  };

  const updateSkillsSection = async (fields: Partial<PortfolioData["skillsSection"]>) => {
    const updated: PortfolioData = {
      ...data,
      skillsSection: { ...data.skillsSection, ...fields },
    };
    await saveConfigToApi(updated);
  };

  const updateBentoConfig = async (bento: BentoConfig) => {
    const updated: PortfolioData = {
      ...data,
      skillsSection: { ...data.skillsSection, bento },
    };
    await saveConfigToApi(updated);
  };

  const updateProjectsSection = async (fields: Partial<PortfolioData["projectsSection"]>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        projectsSection: { ...prev.projectsSection, ...fields },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addProject = async (project: Project) => {
    setData((prev) => {
      const existing = prev.projectsSection?.projects || [];
      const updated = {
        ...prev,
        projectsSection: {
          ...prev.projectsSection,
          projects: [project, ...existing.filter((p) => p.id !== project.id)],
        },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Failed to add project to MongoDB:", err);
      throw err;
    }
  };

  const updateProject = async (id: string, updatedFields: Partial<Project>) => {
    setData((prev) => {
      const existing = prev.projectsSection?.projects || [];
      const updatedProjects = existing.map((p) =>
        p.id === id ? { ...p, ...updatedFields } : p
      );
      const updated = {
        ...prev,
        projectsSection: {
          ...prev.projectsSection,
          projects: updatedProjects,
        },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Failed to update project in MongoDB:", err);
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    setData((prev) => {
      const existing = prev.projectsSection?.projects || [];
      const updatedProjects = existing.filter((p) => p.id !== id);
      const updated = {
        ...prev,
        projectsSection: {
          ...prev.projectsSection,
          projects: updatedProjects,
        },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch(`/api/projects/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Failed to delete project from MongoDB:", err);
      throw err;
    }
  };

  const updateArticlesSection = async (fields: Partial<PortfolioData["articlesSection"]>) => {
    setData((prev) => {
      const updated = {
        ...prev,
        articlesSection: { ...prev.articlesSection, ...fields },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const addArticle = async (article: Article) => {
    setData((prev) => {
      const existing = prev.articlesSection?.articles || [];
      const updated = {
        ...prev,
        articlesSection: {
          ...prev.articlesSection,
          articles: [article, ...existing.filter((a) => a.id !== article.id)],
        },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Failed to add article to MongoDB:", err);
      throw err;
    }
  };

  const updateArticle = async (id: string, updatedFields: Partial<Article>) => {
    setData((prev) => {
      const existing = prev.articlesSection?.articles || [];
      const updatedArticles = existing.map((a) =>
        a.id === id ? { ...a, ...updatedFields } : a
      );
      const updated = {
        ...prev,
        articlesSection: {
          ...prev.articlesSection,
          articles: updatedArticles,
        },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedFields),
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Failed to update article in MongoDB:", err);
      throw err;
    }
  };

  const deleteArticle = async (id: string) => {
    setData((prev) => {
      const existing = prev.articlesSection?.articles || [];
      const updatedArticles = existing.filter((a) => a.id !== id);
      const updated = {
        ...prev,
        articlesSection: {
          ...prev.articlesSection,
          articles: updatedArticles,
        },
      };
      try {
        localStorage.setItem("nisaldev_portfolio_cms_data_2026", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    try {
      const res = await fetch(`/api/articles/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
      }
    } catch (err) {
      console.error("Failed to delete article from MongoDB:", err);
      throw err;
    }
  };

  const updateContactSection = async (fields: Partial<PortfolioData["contactSection"]>) => {
    const updated: PortfolioData = {
      ...data,
      contactSection: { ...data.contactSection, ...fields },
    };
    await saveConfigToApi(updated);
  };

  const updateSocialLinks = async (fields: Partial<PortfolioData["socialLinks"]>) => {
    const updated: PortfolioData = {
      ...data,
      socialLinks: { ...data.socialLinks, ...fields },
    };
    await saveConfigToApi(updated);
  };

  const updateFooter = async (fields: Partial<PortfolioData["footer"]>) => {
    const updated: PortfolioData = {
      ...data,
      footer: { ...data.footer, ...fields },
    };
    await saveConfigToApi(updated);
  };

  const resetToDefaults = async () => {
    setData(INITIAL_PORTFOLIO_DATA);
    await saveConfigToApi(INITIAL_PORTFOLIO_DATA);
  };

  const exportJSON = () => {
    return JSON.stringify(data, null, 2);
  };

  const importJSON = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.general || !parsed.projectsSection || !parsed.articlesSection) {
        throw new Error("Invalid schema");
      }
      await saveConfigToApi(parsed);
      return true;
    } catch (err) {
      console.error("Failed to import JSON:", err);
      return false;
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        isLoaded,
        isDbConnected,
        isLoading,
        refreshData: fetchFromApi,
        updateGeneral,
        updateSkillsSection,
        updateBentoConfig,
        updateProjectsSection,
        addProject,
        updateProject,
        deleteProject,
        updateArticlesSection,
        addArticle,
        updateArticle,
        deleteArticle,
        updateContactSection,
        updateSocialLinks,
        updateFooter,
        resetToDefaults,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
}
