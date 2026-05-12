/**
 * Shared/FSD: toast visual isolado para feedbacks de sucesso/erro/info.
 */
import { useEffect } from "react";

import { cn } from "@/shared/lib/cn";

type ToastVariant = "success" | "error" | "info";

interface ToastProps {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  onDismiss: (id: string) => void;
  durationMs?: number;
}

const variantClasses: Record<ToastVariant, string> = {
  success:
    "border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-100",
  error:
    "border-rose-300 bg-rose-50 text-rose-900 dark:border-rose-700 dark:bg-rose-950 dark:text-rose-100",
  info: "border-sky-300 bg-sky-50 text-sky-900 dark:border-sky-700 dark:bg-sky-950 dark:text-sky-100",
};

export const Toast = ({
  id,
  title,
  description,
  variant,
  onDismiss,
  durationMs = 3500,
}: ToastProps) => {
  useEffect(() => {
    const timeout = window.setTimeout(() => onDismiss(id), durationMs);
    return () => window.clearTimeout(timeout);
  }, [durationMs, id, onDismiss]);

  return (
    <div
      role="status"
      className={cn("rounded-lg border px-4 py-3 shadow-md", variantClasses[variant])}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold">{title}</p>
          {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onDismiss(id)}
          className="cursor-pointer text-xs opacity-80 transition-opacity hover:opacity-100"
          aria-label="Fechar toast"
        >
          Fechar
        </button>
      </div>
    </div>
  );
};
