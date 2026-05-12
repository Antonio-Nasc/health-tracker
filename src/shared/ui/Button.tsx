/**
 * Shared/FSD: botão reutilizável com variantes visuais para toda a aplicação.
 */
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/shared/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-sky-600 text-white hover:bg-sky-700",
  secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100",
  ghost:
    "border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
};

export const Button = ({
  children,
  className,
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) => (
  <button
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60",
      fullWidth && "w-full",
      variantClasses[variant],
      className,
    )}
    disabled={disabled || isLoading}
    {...props}
  >
    {isLoading ? "Processando..." : children}
  </button>
);
