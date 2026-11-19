import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type BadgeTone =
  | "neutral"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-fill-2 text-fg-secondary border-border",
  accent: "bg-accent-dim text-accent border-accent/30",
  success: "bg-success-dim text-success border-success/30",
  warning: "bg-warning-dim text-warning border-warning/30",
  danger: "bg-danger-dim text-danger border-danger/30",
  info: "bg-info-dim text-info border-info/30",
};

interface BadgeProps {
  tone?: BadgeTone;
  children: ReactNode;
  className?: string;
}

export function Badge({ tone = "neutral", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-2xs font-semibold whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
