"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export interface TabItem<T extends string = string> {
  value: T;
  label: string;
  count?: number;
  icon?: ReactNode;
}

interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function Tabs<T extends string = string>({
  items,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn(
        "flex items-center gap-1 border-b border-border",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            className={cn(
              "relative -mb-px flex items-center gap-2 border-b-2 px-3 py-2.5 text-[13px] font-medium transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              isActive
                ? "border-accent text-fg"
                : "border-transparent text-fg-muted hover:border-border-md hover:text-fg",
            )}
          >
            {item.icon}
            {item.label}
            {typeof item.count === "number" && (
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                  isActive
                    ? "bg-accent-dim text-accent"
                    : "bg-fill-2 text-fg-muted",
                )}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
