"use client";

import { PROJECT_ICONS } from "@/components/modals/project-icons";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface ProjectIconPickerProps {
  value: string;
  onChange: (icon: string) => void;
  open: boolean;
  onToggle: () => void;
}

export function ProjectIconPicker({
  value,
  onChange,
  open,
  onToggle,
}: ProjectIconPickerProps) {
  const selected = PROJECT_ICONS.find((item) => item.value === value);
  const CurrentIcon = (selected ?? PROJECT_ICONS[0]).Icon;

  return (
    <div className="relative">
      <div className="mb-1.5 flex gap-1 text-sm font-semibold text-fg">
        Icon
      </div>

      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-label="Choose project icon"
        className="flex size-10 items-center justify-center rounded-lg border border-border-md bg-fill-1 text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      >
        <CurrentIcon size={18} />
      </button>

      {open && (
        <div className="absolute top-16 left-0 z-50 w-56 rounded-xl border border-border-md bg-surface p-2 shadow-lg animate-in fade-in zoom-in-95 duration-150">
          <div className="grid grid-cols-4 gap-2">
            {PROJECT_ICONS.map((item) => {
              const Icon = item.Icon;
              const active = value === item.value;

              return (
                <button
                  key={item.value}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  aria-pressed={active}
                  onClick={() => onChange(item.value)}
                  className={cn(
                    "relative flex size-10 items-center justify-center rounded-lg border transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                    active
                      ? "border-accent bg-accent-dim text-accent"
                      : "border-border-md bg-fill-1 text-fg-muted hover:bg-fill-2 hover:text-fg",
                  )}
                >
                  <Icon size={18} />
                  {active && (
                    <Check
                      size={11}
                      strokeWidth={3}
                      className="absolute top-1 right-1 text-accent"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
