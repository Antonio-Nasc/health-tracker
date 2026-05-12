/**
 * App/FSD: composição de providers globais (TanStack Query, tema e camada de toasts).
 */
import { type PropsWithChildren, useEffect } from "react";

import { useHealthStore } from "@/app/store/healthStore";
import { Toast } from "@/shared/ui/Toast";

import { QueryProvider } from "./QueryProvider";

const ThemeSync = () => {
  const darkMode = useHealthStore((state) => state.darkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return null;
};

const ToastLayer = () => {
  const toasts = useHealthStore((state) => state.toasts);
  const removeToast = useHealthStore((state) => state.removeToast);

  return (
    <div className="fixed right-4 bottom-4 z-50 flex w-[22rem] max-w-[calc(100vw-2rem)] flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={removeToast} />
      ))}
    </div>
  );
};

export const AppProviders = ({ children }: PropsWithChildren) => (
  <QueryProvider>
    <ThemeSync />
    {children}
    <ToastLayer />
  </QueryProvider>
);
