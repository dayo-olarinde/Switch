"use client";

import { cn } from "@/lib/utils";
import { PRIORITY_META } from "../board/board-utils";
import { useEffect, useRef, useState } from "react";

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
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${ref.current.scrollHeight}px`;
  }, [value]);

  const handleSave = () => {
    if (!value.trim()) {
      setValue(title);
      return;
    }
    if (value !== title) onSave(value);
  };

  const key = (priority?.toLowerCase() ?? "none") as keyof typeof PRIORITY_META;
  const meta = PRIORITY_META[key] ?? PRIORITY_META.none;

  return (
    <div className="mb-6">
      <textarea
        ref={ref}
        value={value}
        rows={1}
        aria-label="Card title"
        onChange={(event) => setValue(event.target.value)}
        onBlur={handleSave}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            setValue(title);
            event.currentTarget.blur();
          }
        }}
        className="-ml-2 mb-3 w-full resize-none overflow-hidden rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-headline leading-tight font-semibold text-fg transition-colors outline-none hover:border-border focus:border-accent focus:bg-fill-1"
      />

      {priority && priority !== "none" && (
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-2xs font-semibold tracking-wide uppercase",
            meta.chip,
          )}
        >
          <span aria-hidden className={cn("size-1.5 rounded-full", meta.bar)} />
          {meta.label}
        </span>
      )}
    </div>
  );
}
