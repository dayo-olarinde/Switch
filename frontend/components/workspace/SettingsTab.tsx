"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/page";
import { useUpdateWorkspace, Workspace } from "@/hooks/useWorkspace";
import { AlertTriangle, Building2, Link2, Save } from "lucide-react";
import { useState } from "react";

interface SettingsTabProps {
  activeWorkspace: Workspace;
  onOpenDeleteModal: () => void;
  isOwner: boolean;
}

const fieldClass =
  "h-10 w-full rounded-lg border border-border bg-fill-1 pl-9 pr-3 text-body text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent";

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

  const handleUpdate = () => {
    if (!name.trim() || !slug.trim() || !hasChanges) return;

    const payload: { name?: string; slug?: string } = {};
    if (hasNameChanged) payload.name = name.trim();
    if (hasSlugChanged) payload.slug = slug.trim();

    updateWorkspace(payload);
  };

  if (!isOwner) return null;

  return (
    <div className="max-w-2xl space-y-4 pb-10">
      <Card>
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-fg">Workspace details</h2>
          <p className="mt-1 text-body text-fg-muted">
            Manage your workspace name and URL.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="workspace-name"
              className="block text-body font-medium text-fg-secondary"
            >
              Name
            </label>
            <div className="relative">
              <Building2
                size={15}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
              />
              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Acme Corp"
                className={fieldClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="workspace-slug"
              className="block text-body font-medium text-fg-secondary"
            >
              URL slug
            </label>
            <div className="relative">
              <Link2
                size={15}
                className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
              />
              <input
                id="workspace-slug"
                type="text"
                value={slug}
                onChange={(event) => setSlug(event.target.value)}
                className={fieldClass}
              />
            </div>
            <p className="text-2xs text-fg-muted">
              Changing the slug breaks existing links to this workspace.
            </p>
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <Button
              onClick={handleUpdate}
              loading={isPending}
              disabled={!name.trim() || !slug.trim() || !hasChanges}
              icon={<Save size={15} />}
            >
              {isPending ? "Saving" : "Save changes"}
            </Button>
          </div>
        </div>
      </Card>

      <Card className="border-danger/40">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="flex items-center gap-2 text-sm font-semibold text-danger">
              <AlertTriangle size={16} />
              Danger zone
            </h2>
            <p className="mt-1 max-w-md text-body leading-relaxed text-fg-muted">
              Permanently delete this workspace with all its projects, members
              and data. This cannot be undone.
            </p>
          </div>

          <Button variant="danger" onClick={onOpenDeleteModal}>
            Delete workspace
          </Button>
        </div>
      </Card>
    </div>
  );
};
