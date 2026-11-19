"use client";

import { cn } from "@/lib/utils";
import { useLayoutEffect, useRef, useState } from "react";
import { PRIORITY_META } from "../board/board-utils";

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
  const cancelledRef = useRef(false);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    let lastWidth = -1;

    const autosize = (force: boolean) => {
      if (!node.scrollHeight) return;
      if (!force && node.clientWidth === lastWidth) return;
      lastWidth = node.clientWidth;
      node.style.height = "auto";
      node.style.height = `${node.scrollHeight}px`;
    };

    autosize(true);

    const observer = new ResizeObserver(() => autosize(false));
    observer.observe(node);
    document.fonts?.ready.then(() => autosize(false));

    return () => observer.disconnect();
  }, [value]);

  const handleSave = () => {
    if (cancelledRef.current) {
      cancelledRef.current = false;
      return;
    }

    const next = value.trim();
    if (!next) {
      setValue(title);
      return;
    }

    if (next !== title) {
      setValue(next);
      onSave(next);
    }
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
        spellCheck={false}
        onChange={(event) => setValue(event.target.value)}
        onBlur={handleSave}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            event.currentTarget.blur();
          }
          if (event.key === "Escape") {
            cancelledRef.current = true;
            setValue(title);
            event.currentTarget.blur();
          }
        }}
        className="-ml-2 mb-3 block max-h-30 w-full resize-none overflow-y-auto rounded-lg border border-transparent bg-transparent px-2 py-1.5 text-headline leading-tight font-semibold text-fg transition-colors outline-none hover:border-border focus:border-accent focus:bg-fill-1"
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
