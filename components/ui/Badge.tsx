import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "info";
  tone?: "success" | "warning" | "info" | "neutral";
  className?: string;
};

const variants: Record<string, string> = {
  default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
  secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
  destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
  outline: "text-foreground border border-white/25 bg-white/10 backdrop-blur-sm",
  success: "border-transparent bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  warning: "border-transparent bg-amber-500/15 text-amber-700 dark:text-amber-400",
  info: "border-transparent bg-sky-500/15 text-sky-700 dark:text-sky-400"
};

const toneToVariant: Record<string, keyof typeof variants> = {
  success: "success",
  warning: "warning",
  info: "info",
  neutral: "secondary"
};

export default function Badge({ children, variant, tone, className }: BadgeProps) {
  const v = variant ?? (tone ? toneToVariant[tone] : undefined) ?? "default";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variants[v],
        className
      )}
    >
      {children}
    </span>
  );
}
