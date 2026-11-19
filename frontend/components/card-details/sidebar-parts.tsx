"use client";

import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

export function SidebarSection({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-2", className)}>
      <h3 className="text-2xs font-semibold tracking-wider text-fg-muted uppercase">
        {label}
      </h3>
      {children}
    </section>
  );
}

interface PropertyButtonProps {
  onClick: () => void;
  expanded: boolean;
  children: ReactNode;
  ariaLabel: string;
}

export function PropertyButton({
  onClick,
  expanded,
  children,
  ariaLabel,
}: PropertyButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-expanded={expanded}
      className="flex h-10 w-full items-center justify-between rounded-lg border border-border bg-fill-1 px-2.5 text-left transition-colors hover:border-border-md hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
    >
      {children}
      <ChevronRight
        size={14}
        aria-hidden
        className={cn(
          "shrink-0 text-fg-muted transition-transform",
          expanded && "rotate-90 text-fg-secondary",
        )}
      />
    </button>
  );
}

export function PropertyMenu({ children }: { children: ReactNode }) {
  return (
    <div
      role="menu"
      className="absolute top-full z-30 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-overlay py-1 shadow-soft animate-in fade-in zoom-in-95 duration-100"
    >
      {children}
    </div>
  );
}

export function PropertyMenuItem({
  onClick,
  active,
  children,
}: {
  onClick: () => void;
  active: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-body font-medium transition-colors",
        active
          ? "bg-fill-2 text-fg"
          : "text-fg-secondary hover:bg-fill-2 hover:text-fg",
      )}
    >
      {children}
      {active && (
        <span aria-hidden className="size-1.5 rounded-full bg-accent" />
      )}
    </button>
  );
}

export function ToggleSwitch({
  checked,
  disabled,
}: {
  checked: boolean;
  disabled?: boolean;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-accent-solid" : "bg-fill-3",
        disabled && "opacity-50",
      )}
    >
      <span
        className={cn(
          "size-3 transform rounded-full bg-surface shadow-sm transition-transform",
          checked ? "translate-x-3.5" : "translate-x-0.5",
        )}
      />
    </span>
  );
}

export function SidebarListShell({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-fill-1">
      {children}
    </div>
  );
}

export function SidebarSearch({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="border-b border-border p-1.5">
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-8 w-full rounded-md border border-transparent bg-fill-1 px-2.5 text-body text-fg transition-colors outline-none placeholder:text-fg-muted hover:border-border focus:border-accent focus:bg-surface"
      />
    </div>
  );
}

export function SidebarEmpty({ children }: { children: string }) {
  return (
    <p className="px-3 py-6 text-center text-2xs text-fg-muted">{children}</p>
  );
}
