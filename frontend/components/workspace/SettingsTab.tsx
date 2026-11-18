"use client";

import { useUpdateWorkspace, Workspace } from "@/hooks/useWorkspace";
import { AlertTriangle, Building2, Link2, Loader2, Save } from "lucide-react";
import { useState } from "react";

interface SettingsTabProps {
  activeWorkspace: Workspace;
  onOpenDeleteModal: () => void;
  isOwner: boolean;
}

export const SettingsTab = ({
  activeWorkspace,
  onOpenDeleteModal,
  isOwner,
}: SettingsTabProps) => {
  const [name, setName] = useState(activeWorkspace?.name || "");
  const [slug, setSlug] = useState(activeWorkspace?.slug || "");

  const hasNameChanged = name.trim() !== activeWorkspace?.name;
  const hasSlugChanged = slug.trim() !== activeWorkspace?.slug;
  const hasChanges = hasNameChanged || hasSlugChanged;

  const { mutate: updateWorkspace, isPending } = useUpdateWorkspace(
    activeWorkspace.slug,
  );

  const handleUpdate = async () => {
    if (!name.trim() || !slug.trim() || !hasChanges) return;

    const payload: { name?: string; slug?: string } = {};
    if (hasNameChanged) payload.name = name.trim();
    if (hasSlugChanged) payload.slug = slug.trim();

    updateWorkspace(payload);
  };

  if (!isOwner) return null;

  return (
    <div className="max-w-3xl animate-in fade-in duration-300 pb-10">
      <div className="bg-surface border border-border rounded-2xl p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 " />

        <div className="mb-8">
          <h2 className="text-lg font-bold text-fg tracking-tight">
            Workspace Settings
          </h2>
          <p className="text-[13px] text-fg-muted mt-1">
            Manage your workspace identity and core configuration.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-fg">
              Workspace Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg-muted group-focus-within:text-accent transition-colors">
                <Building2 size={16} />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-11 bg-scrim border border-border-md rounded-xl pl-10 pr-4 text-[14px] text-fg focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-fg-muted"
                placeholder="e.g. Acme Corp"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-semibold text-fg">
              Workspace URL Slug
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-fg-muted group-focus-within:text-accent transition-colors">
                <Link2 size={16} />
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full h-11 bg-scrim border border-border-md rounded-xl pl-10 pr-4 text-[14px] text-fg focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all placeholder:text-fg-muted"
              />
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <span className="text-[11px] font-medium text-fg-muted bg-fill-2 px-2 py-1 rounded-md">
                  app.yoursite.com/{slug || "slug"}
                </span>
              </div>
            </div>
            <p className="text-[12px] text-fg-muted">
              This is your workspace&apos;s unique identifier. Changing this
              will break existing links.
            </p>
          </div>

          <div className="pt-4 flex justify-end border-t border-border">
            <button
              onClick={handleUpdate}
              disabled={
                isPending || !name.trim() || !slug.trim() || !hasChanges
              }
              className="h-10 px-5 bg-accent-solid hover:bg-accent-solid/90 text-on-accent rounded-xl text-[13px] font-semibold transition-all shadow-lg shadow-accent disabled:shadow-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isPending ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {isPending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-danger rounded-2xl p-8 shadow-xl relative overflow-hidden group">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 relative z-10">
          <div>
            <h2 className="text-lg font-bold text-danger tracking-tight flex items-center gap-2 mb-2">
              <AlertTriangle size={18} />
              Danger Zone
            </h2>
            <p className="text-[13px] text-fg-muted leading-relaxed max-w-md">
              Permanently delete this workspace, including all projects,
              members, and data.
              <span className="block mt-1 font-semibold text-danger">
                This action cannot be undone.
              </span>
            </p>
          </div>

          <button
            onClick={onOpenDeleteModal}
            className="shrink-0 h-10 px-5 bg-danger-dim hover:bg-danger-dim hover:text-fg text-danger border border-danger rounded-xl text-[13px] font-semibold transition-all duration-300"
          >
            Delete Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
