"use client";

import { getConsistentColor } from "@/lib/utils";
import { ArrowRight, Command, Search } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";

export interface SearchSection {
  key: string;
  label: string;
  items: {
    id: string;
    label: string;
    hint?: string;
    icon: ReactNode;
    danger?: boolean;
    onSelect: () => void;
  }[];
}

export function SearchResults({
  sections,
  hasQuery,
}: {
  sections: SearchSection[];
  hasQuery: boolean;
}) {
  if (!hasQuery) return null;

  if (sections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-fill-2">
          <Command size={20} aria-hidden className="text-fg-muted" />
        </div>
        <p className="text-body font-semibold text-fg">No results found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 py-2">
      {sections.map((section) => (
        <div key={section.key}>
          <div className="px-3 pb-2 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
            {section.label}
          </div>
          {section.items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={item.onSelect}
              className={
                item.danger
                  ? "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-body font-medium text-danger transition-colors hover:bg-danger-dim focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  : "group flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-body font-medium text-fg-secondary transition-colors hover:bg-fill-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              }
            >
              <div className="flex min-w-0 items-center gap-3">
                {item.icon}
                <div className="flex min-w-0 flex-col">
                  <span className="truncate">{item.label}</span>
                  {item.hint && (
                    <span className="mt-0.5 truncate text-2xs font-normal text-fg-muted">
                      {item.hint}
                    </span>
                  )}
                </div>
              </div>
              {!item.danger && (
                <ArrowRight
                  size={14}
                  aria-hidden
                  className="shrink-0 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100"
                />
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center border-b border-border px-4">
      <Search size={17} aria-hidden className="mr-3 shrink-0 text-accent" />
      <input
        autoFocus
        type="text"
        placeholder="Search projects, members, or type a command..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full bg-transparent text-body text-fg outline-none placeholder:text-fg-muted"
      />
      <kbd className="ml-3 hidden h-6 items-center justify-center rounded border border-border-md bg-fill-2 px-2 text-2xs font-semibold text-fg-muted sm:inline-flex">
        ESC
      </kbd>
    </div>
  );
}

export function MemberAvatar({
  id,
  name,
  avatarUrl,
}: {
  id: string;
  name: string;
  avatarUrl?: string;
}) {
  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={name}
        width={24}
        height={24}
        className="size-6 shrink-0 rounded-full border border-border-md object-cover"
        unoptimized
      />
    );
  }

  return (
    <span
      className="flex size-6 shrink-0 items-center justify-center rounded-full border border-border-md text-2xs font-semibold text-on-accent"
      style={{ backgroundColor: getConsistentColor(id) }}
    >
      {name.charAt(0)}
    </span>
  );
}
