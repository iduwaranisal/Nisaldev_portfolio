"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { toast as sonnerToast, Toaster } from "sonner";

interface ToastContextType {
  toast: {
    success: (message: string, title?: string) => void;
    error: (message: string, title?: string) => void;
    info: (message: string, title?: string) => void;
    warning: (message: string, title?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const toast = {
    success: (message: string, title?: string) => {
      sonnerToast.success(title ? `${title}: ${message}` : message, {
        duration: 4000,
      });
    },
    error: (message: string, title?: string) => {
      sonnerToast.error(title ? `${title}: ${message}` : message, {
        duration: 5000,
      });
    },
    info: (message: string, title?: string) => {
      sonnerToast.info(title ? `${title}: ${message}` : message, {
        duration: 4000,
      });
    },
    warning: (message: string, title?: string) => {
      sonnerToast.warning(title ? `${title}: ${message}` : message, {
        duration: 4000,
      });
    },
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <Toaster
        position="top-right"
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            borderRadius: "1rem",
            padding: "0.875rem 1rem",
            fontSize: "0.8125rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          },
        }}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback to sonnerToast directly
    return {
      toast: {
        success: (msg: string, title?: string) =>
          sonnerToast.success(title ? `${title}: ${msg}` : msg),
        error: (msg: string, title?: string) =>
          sonnerToast.error(title ? `${title}: ${msg}` : msg),
        info: (msg: string, title?: string) =>
          sonnerToast.info(title ? `${title}: ${msg}` : msg),
        warning: (msg: string, title?: string) =>
          sonnerToast.warning(title ? `${title}: ${msg}` : msg),
      },
    };
  }
  return context;
}
