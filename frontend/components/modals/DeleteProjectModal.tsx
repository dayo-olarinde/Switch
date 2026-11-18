"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { Project } from "@/hooks/useProjects";
import { cn } from "@/lib/utils";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { PROJECT_ICON_MAP } from "./CreateProjectModal";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onDelete: (projectId: string) => void;
  isDeleting?: boolean;
}

export default function DeleteProjectModal({
  isOpen,
  onClose,
  project,
  onDelete,
  isDeleting,
}: DeleteProjectModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const Icon = PROJECT_ICON_MAP[project.icon] || Trash2;

  const isConfirmed = confirmText === project.name;

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Delete project"
      description="This will permanently delete the project and all its data."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!isConfirmed || isDeleting}
            onClick={() => onDelete(project.id)}
            className={cn(
              "flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
              isConfirmed && !isDeleting
                ? "border-danger bg-danger-dim text-danger hover:bg-danger/25"
                : "cursor-not-allowed border-border bg-fill-2 text-fg-muted",
            )}
          >
            {isDeleting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete project"
            )}
          </button>
        </>
      }
    >
      <div className="flex items-center gap-4 rounded-xl border border-border bg-fill-1 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-base text-fg-secondary">
          <Icon size={20} />
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-fg">
            {project.name}
          </span>
          <span className="text-[11px] font-semibold tracking-wider text-fg-muted uppercase">
            {project.cardsCount || 0} cards ·{" "}
            {(project.assignees && project.assignees.length) || 0} members
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger bg-danger-dim p-4">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-danger">
            All data will be lost
          </span>
          <p className="text-[12px] leading-relaxed text-danger">
            All cards, comments, attachments, and activity will be permanently
            deleted. This action cannot be undone.
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <p className="text-[12px] text-fg-muted">
          Type{" "}
          <span className="rounded bg-danger-dim px-1.5 py-0.5 font-mono text-danger">
            {project.name}
          </span>{" "}
          to confirm deletion.
        </p>
        <input
          type="text"
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          placeholder={project.name}
          autoFocus
          className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-danger"
        />
      </div>
    </DialogShell>
  );
}
