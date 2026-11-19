"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "mb-7 flex flex-wrap items-start justify-between gap-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-headline font-semibold text-fg">{title}</h1>
        {description && (
          <p className="mt-1 text-body text-fg-muted">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

interface SectionHeaderProps {
  title: string;
  count?: number;
  action?: ReactNode;
}

export function SectionHeader({ title, count, action }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <h2 className="text-body font-semibold text-fg">{title}</h2>
        {count !== undefined && (
          <span className="rounded-md bg-fill-2 px-1.5 py-0.5 text-2xs font-semibold text-fg-muted">
            {count}
          </span>
        )}
      </div>
      {action}
    </div>
  );
}

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
}

export function Card({ children, className, as: Tag = "div" }: CardProps) {
  return (
    <Tag
      className={cn(
        "rounded-xl border border-border bg-surface p-5 card-elevated",
        className,
      )}
    >
      {children}
    </Tag>
  );
}

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border-md bg-fill-1 px-6 py-14 text-center",
        className,
      )}
    >
      <div className="mb-4 flex size-11 items-center justify-center rounded-xl border border-border-md bg-fill-2 text-fg-muted">
        {icon}
      </div>
      <h3 className="text-body font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-body leading-relaxed text-fg-muted">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface StatProps {
  label: string;
  value: string | number | undefined;
  icon: ReactNode;
  hint?: string;
}

export function Stat({ label, value, icon, hint }: StatProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-md hover:bg-overlay">
      <div className="flex items-center gap-2 text-fg-muted">
        <span className="flex size-6 items-center justify-center rounded-md bg-fill-2">
          {icon}
        </span>
        <span className="truncate text-2xs font-semibold tracking-wide uppercase">
          {label}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-fg">
        {value ?? "0"}
      </p>
      {hint && <p className="mt-0.5 text-2xs text-fg-muted">{hint}</p>}
    </div>
  );
}
