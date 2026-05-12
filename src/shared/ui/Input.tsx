/**
 * Shared/FSD: input padrão com label, helper e estado de erro para formulários.
 */
import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  helperText?: string;
  error?: string;
  containerClassName?: string;
}

export const Input = ({
  label,
  helperText,
  error,
  className,
  containerClassName,
  id,
  ...props
}: InputProps) => {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, "-")}`;

  return (
    <label htmlFor={inputId} className={cn("flex flex-col gap-1.5", containerClassName)}>
      <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}</span>
      <input
        id={inputId}
        className={cn(
          "h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100",
          error && "border-rose-500 focus:border-rose-500",
          className,
        )}
        {...props}
      />
      {error ? (
        <span className="text-xs text-rose-600 dark:text-rose-400">{error}</span>
      ) : (
        helperText && (
          <span className="text-xs text-slate-500 dark:text-slate-400">{helperText}</span>
        )
      )}
    </label>
  );
};
