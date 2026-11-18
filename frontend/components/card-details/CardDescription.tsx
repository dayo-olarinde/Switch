"use client";

import { useEffect, useRef, useState } from "react";

interface CardDescriptionProps {
  description: string;
  onSave: (value: string) => void;
}

export function CardDescription({ description, onSave }: CardDescriptionProps) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(description || "");
  const [prevDescription, setPrevDescription] = useState(description);

  if (description !== prevDescription) {
    setPrevDescription(description);
    if (!isEditing) {
      setValue(description || "");
    }
  }

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
      ref.current.style.height = "auto";
      ref.current.style.height = `${ref.current.scrollHeight}px`;
    }
  }, [isEditing]);

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
      <div className="text-[11px] font-bold text-fg-muted uppercase tracking-widest mb-3">
        Description
      </div>
      {isEditing ? (
        <div className="space-y-3">
          <textarea
            ref={ref}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Add a description..."
            className="w-full min-h-30 bg-surface border border-accent/50 focus:ring-1 focus:ring-accent/30 rounded-xl p-4 text-[14px] text-fg placeholder:text-fg-muted outline-none resize-none leading-relaxed"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-accent-solid hover:bg-accent-solid/90 text-on-accent text-[13px] font-semibold rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-fg-muted hover:text-fg hover:bg-fill-2 text-[13px] font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => setIsEditing(true)}
          className="w-full min-h-25 bg-surface hover:bg-surface border border-border hover:border-border-md rounded-xl p-5 text-[14px] text-fg-secondary cursor-text transition-all whitespace-pre-wrap leading-relaxed"
        >
          {value || <span className="text-fg-muted">Add a description...</span>}
        </div>
      )}
    </section>
  );
}
