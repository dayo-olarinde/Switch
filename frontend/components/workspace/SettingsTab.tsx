"use client";

import { Button } from "@/components/ui/button";
import { TextInput } from "@/components/ui/field";
import { Card } from "@/components/ui/page";
import { useUpdateWorkspace, Workspace } from "@/hooks/useWorkspace";
import { AlertTriangle, Building2, Link2, Save } from "lucide-react";
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
          <h2 className="text-body font-semibold text-fg">Workspace details</h2>
          <p className="mt-1 text-body text-fg-muted">
            Manage your workspace name and URL.
          </p>
        </div>

        <div className="space-y-4">
          <TextInput
            id="workspace-name"
            label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Acme Corp"
            leading={<Building2 size={15} />}
          />

          <TextInput
            id="workspace-slug"
            label="URL slug"
            value={slug}
            onChange={(event) => setSlug(event.target.value)}
            leading={<Link2 size={15} />}
            hint="Changing the slug breaks existing links to this workspace."
          />

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
            <h2 className="flex items-center gap-2 text-body font-semibold text-danger">
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
