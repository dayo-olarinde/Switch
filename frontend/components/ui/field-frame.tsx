"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

/** Shared shell for composite controls (input groups, native date pickers). */
export const controlClasses =
  "w-full rounded-lg border border-border-md bg-fill-1 text-body text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent disabled:cursor-not-allowed disabled:opacity-60";

interface FieldLabelProps {
  htmlFor?: string;
  required?: boolean;
  /** Sentence-style label for long copy; skips the uppercase caption styling. */
  plain?: boolean;
  children: ReactNode;
  className?: string;
}

export function FieldLabel({
  htmlFor,
  required,
  plain = false,
  children,
  className,
}: FieldLabelProps) {
  const classes = cn(
    plain
      ? "block text-body leading-relaxed text-fg-secondary"
      : "text-2xs font-semibold tracking-wider text-fg-muted uppercase",
    className,
  );
  const Tag = htmlFor ? "label" : "span";

  return (
    <Tag htmlFor={htmlFor} className={classes}>
      {children}
      {required && <span className="ml-1 text-accent">*</span>}
    </Tag>
  );
}

interface FieldFrameProps {
  id: string;
  label?: ReactNode;
  required?: boolean;
  labelPlain?: boolean;
  hint?: ReactNode;
  error?: string;
  className?: string;
  children: ReactNode;
}

export function FieldFrame({
  id,
  label,
  required,
  labelPlain,
  hint,
  error,
  className,
  children,
}: FieldFrameProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <FieldLabel htmlFor={id} required={required} plain={labelPlain}>
          {label}
        </FieldLabel>
      )}

      {children}

      {error ? (
        <p id={`${id}-error`} role="alert" className="text-2xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-2xs text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function describedBy(id: string, error?: string, hint?: ReactNode) {
  if (error) return `${id}-error`;
  return hint ? `${id}-hint` : undefined;
}
