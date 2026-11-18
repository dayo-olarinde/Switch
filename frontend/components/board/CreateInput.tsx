"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { Plus, Loader2 } from "lucide-react";
import { cn, getErrorMessage } from "@/lib/utils";
import { toast } from "sonner";

interface CreateInputProps {
  onSubmit: (value: string) => Promise<void>;
  placeholder?: string;
  buttonText: string;
  isColumn?: boolean;
}

export function CreateInput({
  onSubmit,
  placeholder = "Enter title...",
  buttonText,
  isColumn = false,
}: CreateInputProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleSubmit = async () => {
    const trimmed = value.trim();
    if (!trimmed) {
      setIsEditing(false);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(trimmed);
      setValue("");
      if (isColumn) setIsEditing(false);
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
    if (e.key === "Escape") {
      setIsEditing(false);
      setValue("");
    }
  };

  if (isEditing) {
    return (
      <div
        className={cn(
          "bg-surface border border-accent rounded-lg p-2 shadow-lg transition-all",
          isColumn ? "w-[320px] shrink-0" : "w-full",
        )}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!value.trim()) setIsEditing(false);
          }}
          disabled={loading}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm text-fg placeholder:text-fg-secondary focus:outline-none mb-2"
        />
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => {
              setIsEditing(false);
              setValue("");
            }}
            className="px-2 py-1 text-xs font-medium text-fg-secondary hover:text-fg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !value.trim()}
            className="flex items-center justify-center min-w-12.5 px-3 py-1 bg-success hover:bg-success disabled:opacity-50 disabled:cursor-not-allowed text-on-accent text-xs font-semibold rounded-md transition-colors"
          >
            {loading ? <Loader2 size={12} className="animate-spin" /> : "Add"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className={cn(
        "flex items-center justify-center gap-2 py-2 text-sm font-medium transition-all",
        isColumn
          ? "w-[320px] shrink-0 h-14 border-2 border-dashed border-border-md hover:border-border-md rounded-xl text-fg-secondary hover:text-fg bg-base/50 hover:bg-surface"
          : "w-full text-fg-secondary hover:text-fg hover:bg-card rounded-md",
      )}
    >
      <Plus size={16} /> {buttonText}
    </button>
  );
}
