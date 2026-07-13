"use client";

import * as React from "react";
import {
  ToastProviderPrimitive,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
} from "@/components/ui/toast";

type ToastVariant = "default" | "destructive";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
}

interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const context = React.useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ToastItem[]>([]);

  const toast = React.useCallback((item: Omit<ToastItem, "id">) => {
    const id = crypto.randomUUID();
    setItems((current) => [...current, { ...item, id }]);
  }, []);

  const remove = React.useCallback((id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      <ToastProviderPrimitive swipeDirection="right">
        {children}
        {items.map((item) => (
          <Toast
            key={item.id}
            variant={item.variant}
            onOpenChange={(open) => {
              if (!open) remove(item.id);
            }}
          >
            <div className="flex flex-col gap-1">
              <ToastTitle>{item.title}</ToastTitle>
              {item.description && <ToastDescription>{item.description}</ToastDescription>}
            </div>
          </Toast>
        ))}
        <ToastViewport />
      </ToastProviderPrimitive>
    </ToastContext.Provider>
  );
}
