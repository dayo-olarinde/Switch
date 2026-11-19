"use client";

import { cn, getConsistentColor } from "@/lib/utils";
import { ChevronDown, LucideIcon, Plus } from "lucide-react";
import Link from "next/link";

export interface NavEntry {
  name: string;
  href: string;
  icon: LucideIcon;
  count?: number;
}

const ROW =
  "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-body font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

const ROW_ACTIVE = "bg-fill-2 text-fg";
const ROW_IDLE = "text-fg-secondary hover:bg-fill-1 hover:text-fg";

function ActiveRail() {
  return (
    <span
      aria-hidden
      className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent"
    />
  );
}

export function NavItem({
  entry,
  active,
}: {
  entry: NavEntry;
  active: boolean;
}) {
  const Icon = entry.icon;

  return (
    <Link
      href={entry.href}
      aria-current={active ? "page" : undefined}
      className={cn(ROW, active ? ROW_ACTIVE : ROW_IDLE)}
    >
      {active && <ActiveRail />}
      <Icon
        size={16}
        className={cn(
          "shrink-0 transition-colors",
          active ? "text-accent" : "text-fg-muted group-hover:text-fg-secondary",
        )}
      />
      <span className="truncate">{entry.name}</span>
      {entry.count !== undefined && (
        <span
          className={cn(
            "ml-auto min-w-5 rounded-md px-1.5 text-center text-2xs font-semibold tabular-nums",
            active
              ? "bg-accent-dim text-accent"
              : "bg-fill-2 text-fg-muted group-hover:text-fg-secondary",
          )}
        >
          {entry.count}
        </span>
      )}
    </Link>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <p className="px-2.5 pt-5 pb-1.5 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
      {children}
    </p>
  );
}

interface ProjectLinkProps {
  id: string;
  name: string;
  href: string;
  active: boolean;
}

export function ProjectLink({ id, name, href, active }: ProjectLinkProps) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(ROW, active ? ROW_ACTIVE : ROW_IDLE)}
    >
      {active && <ActiveRail />}
      <span
        className="size-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: getConsistentColor(id) }}
      />
      <span className="truncate">{name}</span>
    </Link>
  );
}

export function NewProjectButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        ROW,
        "w-full text-fg-muted hover:bg-fill-1 hover:text-fg",
      )}
    >
      <Plus
        size={14}
        className="shrink-0 text-fg-muted group-hover:text-fg-secondary"
      />
      New project
    </button>
  );
}

export function ProjectListSkeleton() {
  return (
    <div className="space-y-1 px-2.5 py-1">
      {[70, 92, 58].map((width) => (
        <div
          key={width}
          className="h-4 animate-pulse rounded bg-fill-1"
          style={{ width: `${width}%` }}
        />
      ))}
    </div>
  );
}

export function WorkspaceSwitcherButton({
  name,
  role,
  colour,
  initials,
  hasWorkspaces,
  isOpen,
  onClick,
}: {
  name?: string;
  role?: string;
  colour?: string;
  initials?: string;
  hasWorkspaces: boolean;
  isOpen: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={hasWorkspaces ? isOpen : undefined}
      className={cn(
        "group flex h-11 w-full items-center gap-2.5 rounded-lg border px-2.5 transition-colors",
        isOpen
          ? "border-border-lg bg-fill-2"
          : "border-border bg-fill-1 hover:border-border-md hover:bg-fill-2",
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md text-2xs font-bold",
          hasWorkspaces && name ? "text-on-accent" : "bg-accent-dim text-accent",
        )}
        style={hasWorkspaces && colour ? { backgroundColor: colour } : undefined}
      >
        {hasWorkspaces ? (initials || "SW") : <Plus size={14} />}
      </span>

      <span className="flex min-w-0 flex-1 flex-col items-start">
        <span
          className={cn(
            "w-full truncate text-left text-body font-semibold",
            hasWorkspaces ? "text-fg" : "text-accent",
          )}
        >
          {hasWorkspaces ? (name ?? "Workspace") : "New workspace"}
        </span>
        {hasWorkspaces && role && (
          <span className="text-2xs font-medium text-fg-muted">{role}</span>
        )}
      </span>

      {hasWorkspaces && (
        <ChevronDown
          size={14}
          className={cn(
            "shrink-0 text-fg-muted transition-transform duration-200",
            isOpen && "rotate-180 text-fg-secondary",
          )}
        />
      )}
    </button>
  );
}
