import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type BadgeProps = {
  children: ReactNode;
  tone?: "success" | "warning" | "info" | "neutral";
  className?: string;
};

const tones = {
  success: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
  warning: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
  info: "bg-sky-500/20 text-sky-300 border border-sky-500/40",
  neutral: "bg-slate-500/20 text-slate-200 border border-slate-500/40"
};

export default function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}>{children}</span>;
}
