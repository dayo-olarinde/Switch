"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { useCreateWorkspace } from "@/hooks/useWorkspace";
import { cn, getInitials, slugify } from "@/lib/utils";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";

const AVATAR_COLORS = [
  "#F472B6",
  "#8B5CF6",
  "#34D399",
  "#FBBF24",
  "#FB7185",
  "#60A5FA",
  "#A78BFA",
  "#F43F5E",
];

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [manualSlug, setManualSlug] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);

  const { mutate: createWorkspace, isPending } = useCreateWorkspace();
  const displayedSlug = manualSlug !== null ? manualSlug : slugify(name);

  const handleCreate = () => {
    if (!name) return;
    createWorkspace(
      { name, slug: displayedSlug, colour: selectedColor },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  const handleClose = () => {
    onClose();
    setName("");
    setManualSlug(null);
    setSelectedColor(AVATAR_COLORS[0]);
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={handleClose}
      title="Create a workspace"
      description="A workspace holds all your projects and brings your team together."
      footer={
        <>
          <button
            type="button"
            onClick={handleClose}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!name.trim() || isPending}
            className="flex h-10 min-w-40 items-center justify-center gap-2 rounded-lg bg-accent-solid px-4 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus size={16} /> Create workspace
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="workspace-name"
            className="flex gap-1 text-[12px] font-semibold text-fg"
          >
            Workspace name <span className="text-accent">*</span>
          </label>
          <input
            id="workspace-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Acme Corp"
            autoFocus
            className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="workspace-slug"
            className="flex gap-1 text-[12px] font-semibold text-fg"
          >
            URL slug <span className="text-accent">*</span>
          </label>
          <div className="flex h-10 w-full overflow-hidden rounded-lg border border-border-md bg-fill-1 transition-colors focus-within:border-accent">
            <div className="flex select-none items-center border-r border-border-md px-3 text-sm text-fg-muted">
              switch.app/
            </div>
            <input
              id="workspace-slug"
              value={displayedSlug}
              onChange={(event) => setManualSlug(event.target.value)}
              placeholder="your-workspace"
              className="flex-1 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg-muted"
            />
          </div>
          <p className="text-[11px] text-fg-muted">
            Only lowercase letters, numbers, and hyphens.
          </p>
        </div>

        <div className="space-y-2 pt-1">
          <span className="text-[12px] font-semibold text-fg">
            Avatar color
          </span>
          <div className="flex items-center gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-xl text-xl font-bold tracking-tighter text-on-accent transition-colors"
              style={{ backgroundColor: selectedColor }}
            >
              {getInitials(name)}
            </div>

            <div className="ml-1 flex gap-2">
              {AVATAR_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={cn(
                    "size-6 rounded-md transition-transform focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none",
                    selectedColor === color
                      ? "scale-110 ring-2 ring-fg ring-offset-2 ring-offset-surface"
                      : "opacity-80 hover:scale-105 hover:opacity-100",
                  )}
                  aria-label={`Use color ${color}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </DialogShell>
  );
}
