"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";

interface CardDescriptionProps {
  description: string;
  onSave: (value: string) => void;
}

export function CardDescription({
  description,
  onSave,
}: CardDescriptionProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(description || "");
  const [prevDescription, setPrevDescription] = useState(description);

  if (description !== prevDescription) {
    setPrevDescription(description);
    if (!isEditing) setValue(description || "");
  }

  useEffect(() => {
    if (!isEditing || !ref.current) return;
    const node = ref.current;
    node.focus();
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
    node.setSelectionRange(node.value.length, node.value.length);
  }, [isEditing]);

  const autosize = (node: HTMLTextAreaElement) => {
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  };

  const handleSave = () => {
    setIsEditing(false);
    if (value !== (description || "")) onSave(value);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setValue(description || "");
  };

  return (
    <section>
      <h3 className="mb-2 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
        Description
      </h3>

      {isEditing ? (
        <div className="space-y-2.5">
          <textarea
            ref={ref}
            value={value}
            placeholder="Add a description…"
            aria-label="Card description"
            onChange={(event) => {
              setValue(event.target.value);
              autosize(event.target);
            }}
            onKeyDown={(event) => {
              if (event.key === "Escape") handleCancel();
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
                handleSave();
              }
            }}
            className="custom-scrollbar min-h-28 w-full resize-none rounded-xl border border-accent bg-surface p-3.5 text-body leading-relaxed text-fg transition-colors outline-none placeholder:text-fg-muted focus:ring-2 focus:ring-accent/20"
          />

          <div className="flex items-center gap-2">
            <Button size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="min-h-24 w-full rounded-xl border border-border bg-surface p-3.5 text-left text-body leading-relaxed whitespace-pre-wrap text-fg-secondary transition-colors hover:border-border-md hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none card-elevated"
        >
          {value || <span className="text-fg-muted">Add a description…</span>}
        </button>
      )}
    </section>
  );
}
