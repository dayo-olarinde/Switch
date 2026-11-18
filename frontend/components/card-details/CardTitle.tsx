"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

const PRIORITY_STYLES: Record<string, string> = {
  urgent: "bg-danger-dim text-danger border-danger",
  high: "bg-accent-dim text-accent border-accent",
  medium: "bg-warning-dim text-warning border-warning",
  low: "bg-success-dim text-success border-success",
  none: "bg-fill-2 text-fg-muted border-border-md",
};

interface CardTitleProps {
  title: string;
  priority: string;
  onSave: (title: string) => void;
}

export function CardTitle({ title, priority, onSave }: CardTitleProps) {
  const [value, setValue] = useState(title);

  const [prevTitle, setPrevTitle] = useState(title);
  if (title !== prevTitle) {
    setPrevTitle(title);
    setValue(title);
  }

  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [value]);

  const handleSave = () => {
    if (!value.trim()) {
      setValue(title);
      return;
    }
    if (value !== title) onSave(value);
  };

  const p = priority?.toLowerCase() || "none";
  const pStyle = PRIORITY_STYLES[p] ?? PRIORITY_STYLES.none;

  return (
    <div className="mb-8">
      <textarea
        ref={ref}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.currentTarget.blur();
          }
          if (e.key === "Escape") {
            setValue(title);
            e.currentTarget.blur();
          }
        }}
        className="w-full bg-transparent text-[24px] font-bold text-fg border border-transparent hover:border-border focus:border-accent/50 focus:bg-fill-1 rounded-lg px-3 py-1.5 -ml-3 outline-none transition-colors resize-none overflow-hidden leading-tight mb-3"
        rows={1}
      />
      {priority && priority !== "none" && (
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider border",
            pStyle,
          )}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
          {priority}
        </div>
      )}
    </div>
  );
}
