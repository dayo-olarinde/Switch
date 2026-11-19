"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center bg-base px-4 py-10">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute top-0 left-1/2 size-150 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-dim blur-3xl" />
      </div>

      <Link
        href="/"
        className="relative mb-8 flex items-center gap-3 transition-opacity hover:opacity-85"
      >
        <span className="flex size-10 items-center justify-center overflow-hidden rounded-xl bg-accent-solid">
          <Image
            src="/logo.svg"
            alt=""
            width={32}
            height={32}
            priority
            className="size-8"
          />
        </span>
        <span className="text-xl font-semibold tracking-tight text-fg">
          Switch
        </span>
      </Link>

      <div className="relative w-full max-w-105 rounded-xl border border-border bg-surface p-8 pop-elevated">
        {children}
      </div>
    </div>
  );
}

export function AuthHeader({
  title,
  description,
  backHref,
  backLabel,
}: {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
}) {
  return (
    <div className="mb-6">
      {backHref && backLabel && (
        <Link
          href={backHref}
          className="mb-5 inline-flex items-center gap-1 text-body font-medium text-fg-muted transition-colors hover:text-fg"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          {backLabel}
        </Link>
      )}

      <h1 className="text-xl font-semibold tracking-tight text-fg">{title}</h1>
      {description && (
        <p className="mt-1.5 text-body leading-relaxed text-fg-muted">
          {description}
        </p>
      )}
    </div>
  );
}

export function AuthFooterLink({
  prompt,
  href,
  label,
}: {
  prompt: string;
  href: string;
  label: string;
}) {
  return (
    <p className="mt-6 text-center text-body text-fg-muted">
      {prompt}{" "}
      <Link
        href={href}
        className="font-medium text-accent transition-opacity hover:opacity-85"
      >
        {label}
      </Link>
    </p>
  );
}

export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="my-5 flex items-center gap-3">
      <div className="h-px flex-1 bg-border" />
      <span className="text-2xs font-medium tracking-wide text-fg-muted uppercase">
        {label}
      </span>
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}

const STEPS = ["Email", "Verify", "Profile"];

export function AuthSteps({ current }: { current: 1 | 2 | 3 }) {
  return (
    <ol className="mb-7 flex items-center" aria-label="Progress">
      {STEPS.map((label, index) => {
        const step = index + 1;
        const isDone = step < current;
        const isCurrent = step === current;

        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                aria-current={isCurrent ? "step" : undefined}
                className={cn(
                  "flex size-6 items-center justify-center rounded-full text-2xs font-semibold",
                  isDone && "bg-success text-on-accent",
                  isCurrent && "bg-accent-solid text-on-accent",
                  !isDone && !isCurrent && "border border-border-lg text-fg-muted",
                )}
              >
                {isDone ? <Check size={13} strokeWidth={3} /> : step}
              </span>
              <span
                className={cn(
                  "text-2xs",
                  isDone && "font-semibold text-success",
                  isCurrent && "font-semibold text-fg",
                  !isDone && !isCurrent && "text-fg-muted",
                )}
              >
                {label}
              </span>
            </div>

            {index < STEPS.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "mx-3 h-px flex-1",
                  isDone ? "bg-success/40" : "bg-border",
                )}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export function AuthStatus({
  icon,
  tone,
  title,
  description,
  children,
}: {
  icon: ReactNode;
  tone: "success" | "danger" | "accent";
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const tones = {
    success: "bg-success-dim text-success",
    danger: "bg-danger-dim text-danger",
    accent: "bg-accent-dim text-accent",
  } as const;

  return (
    <div className="flex flex-col items-center py-2 text-center">
      <div
        className={cn(
          "mb-4 flex size-12 items-center justify-center rounded-full",
          tones[tone],
        )}
      >
        {icon}
      </div>
      <h1 className="text-xl font-semibold tracking-tight text-fg">{title}</h1>
      <p className="mt-1.5 text-body leading-relaxed text-fg-muted">
        {description}
      </p>
      {children && <div className="mt-6 w-full">{children}</div>}
    </div>
  );
}
