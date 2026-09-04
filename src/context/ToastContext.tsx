"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (toast: Omit<ToastItem, "id">) => string;
  removeToast: (id: string) => void;
  toast: {
    success: (message: string, title?: string) => string;
    error: (message: string, title?: string) => string;
    info: (message: string, title?: string) => string;
    warning: (message: string, title?: string) => string;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<ToastItem, "id">) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev.slice(-3), newToast]); // Limit to 4 max visible

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }

      return id;
    },
    [removeToast]
  );

  const toast = {
    success: useCallback((message: string, title?: string) => addToast({ type: "success", message, title }), [addToast]),
    error: useCallback((message: string, title?: string) => addToast({ type: "error", message, title }), [addToast]),
    info: useCallback((message: string, title?: string) => addToast({ type: "info", message, title }), [addToast]),
    warning: useCallback((message: string, title?: string) => addToast({ type: "warning", message, title }), [addToast]),
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, toast }}>
      {children}
      {/* Toast Render Portal */}
      <div
        aria-live="polite"
        className="fixed bottom-6 right-6 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence mode="sync">
          {toasts.map((t) => {
            const config = {
              success: {
                icon: CheckCircle2,
                barColor: "bg-emerald-500",
                iconColor: "text-emerald-600",
                borderColor: "border-emerald-200/80",
                bgColor: "bg-white/95",
                defaultTitle: "Success",
              },
              error: {
                icon: AlertCircle,
                barColor: "bg-rose-500",
                iconColor: "text-rose-600",
                borderColor: "border-rose-200/80",
                bgColor: "bg-white/95",
                defaultTitle: "Action Failed",
              },
              warning: {
                icon: AlertTriangle,
                barColor: "bg-amber-500",
                iconColor: "text-amber-500",
                borderColor: "border-amber-200/80",
                bgColor: "bg-white/95",
                defaultTitle: "Warning",
              },
              info: {
                icon: Info,
                barColor: "bg-orange-500",
                iconColor: "text-orange-500",
                borderColor: "border-orange-200/80",
                bgColor: "bg-white/95",
                defaultTitle: "Information",
              },
            }[t.type];

            const Icon = config.icon;

            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
                className={cn(
                  "pointer-events-auto relative overflow-hidden rounded-2xl border shadow-warm-lg backdrop-blur-md p-4 flex items-start gap-3",
                  config.borderColor,
                  config.bgColor
                )}
              >
                {/* Left Colored Accent Bar */}
                <div className={cn("absolute left-0 top-0 bottom-0 w-1", config.barColor)} />

                {/* Status Icon */}
                <div className="shrink-0 mt-0.5">
                  <Icon className={cn("w-4 h-4", config.iconColor)} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pr-2">
                  <h4 className="text-xs font-bold text-slate-900 font-display">
                    {t.title || config.defaultTitle}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed break-words font-sans">
                    {t.message}
                  </p>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => removeToast(t.id)}
                  className="shrink-0 p-1 text-slate-400 hover:text-slate-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                  aria-label="Dismiss toast"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
