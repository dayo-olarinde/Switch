"use client";

import { Portal } from "@/components/ui/Portal";
import { useCreateWorkspace } from "@/hooks/useWorkspace";
import { getInitials, slugify } from "@/lib/utils";
import { LayoutGrid, Loader2, Plus, X } from "lucide-react";
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

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualSlug(e.target.value);
  };

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

  if (!isOpen) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-scrim backdrop-blur-sm px-4">
        <div className="w-full max-w-115 bg-base border border-border rounded-2xl shadow-2xl relative flex flex-col">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-fg-muted hover:text-fg transition-colors"
          >
            <X size={18} />
          </button>

          <div className="p-6">
            <div className="w-10 h-10 bg-card border border-border-md rounded-xl flex items-center justify-center mb-4 shadow-inner">
              <LayoutGrid size={18} className="text-accent" />
            </div>

            <div className="mb-5">
              <h1 className="text-xl font-bold text-fg mb-1 tracking-tight">
                Create a workspace
              </h1>
              <p className="text-[13px] text-fg-secondary leading-relaxed">
                A workspace holds all your projects and brings your team
                together.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-fg flex gap-1">
                  Workspace name <span className="text-accent">*</span>
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  autoFocus
                  className="w-full bg-card border border-border-md focus:border-accent rounded-lg px-3 py-2 text-sm text-fg placeholder:text-fg-muted outline-none transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-fg flex gap-1">
                  URL slug <span className="text-accent">*</span>
                </label>
                <div className="flex w-full bg-card border border-border-md focus-within:border-accent rounded-lg overflow-hidden transition-all shadow-sm">
                  <div className="bg-card px-3 py-2 text-sm text-fg-muted border-r border-border-md select-none flex items-center">
                    switch.app/
                  </div>
                  <input
                    value={displayedSlug}
                    onChange={handleSlugChange}
                    placeholder="your-workspace"
                    className="flex-1 bg-transparent px-3 py-2 text-sm text-fg placeholder:text-fg-muted outline-none"
                  />
                </div>
                <p className="text-[11px] text-fg-muted">
                  Only lowercase letters, numbers, and hyphens.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <label className="text-[12px] font-semibold text-fg">
                  Avatar color
                </label>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-fg font-black text-xl tracking-tighter shadow-inner transition-colors duration-300"
                    style={{ backgroundColor: selectedColor }}
                  >
                    {getInitials(name)}
                  </div>

                  <div className="flex gap-2 ml-1">
                    {AVATAR_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        style={{ backgroundColor: color }}
                        className={`w-6 h-6 rounded-md transition-all duration-200 ${
                          selectedColor === color
                            ? "ring-2 ring-white ring-offset-2 ring-offset-base scale-110"
                            : "hover:scale-105 opacity-80 hover:opacity-100"
                        }`}
                        aria-label="Select color"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 py-4 border-t border-border flex justify-end gap-3 bg-base rounded-b-2xl">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-semibold text-fg bg-transparent border border-border-md hover:bg-card rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={!name.trim() || isPending}
              className="min-w-40 justify-center px-4 py-2 text-sm font-semibold text-on-accent bg-accent-solid hover:bg-accent-solid/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2 shadow-md"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin text-fg" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus size={16} /> Create workspace
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
