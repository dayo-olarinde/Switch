"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { FormAlert } from "@/components/ui/feedback";
import { TextInput } from "@/components/ui/field";
import { Project } from "@/hooks/useProjects";
import { useState } from "react";
import { PROJECT_ICON_MAP } from "./project-icons";
import { Trash2 } from "lucide-react";

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

  const handleClose = () => {
    onClose();
    setConfirmText("");
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={handleClose}
      title="Delete project"
      description="This will permanently delete the project and all its data."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            disabled={!isConfirmed}
            loading={isDeleting}
            onClick={() => onDelete(project.id)}
          >
            Delete project
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-base text-fg-secondary">
          <Icon size={20} aria-hidden />
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-body font-semibold text-fg">
            {project.name}
          </span>
          <span className="text-2xs font-semibold tracking-wider text-fg-muted uppercase">
            {project.cardsCount || 0} cards ·{" "}
            {(project.assignees && project.assignees.length) || 0} members
          </span>
        </span>
      </div>

      <FormAlert tone="danger" className="mt-4">
        <span className="block font-semibold">All data will be lost</span>
        <span className="mt-1 block">
          All cards, comments, attachments, and activity will be permanently
          deleted. This action cannot be undone.
        </span>
      </FormAlert>

      <div className="mt-4">
        <TextInput
          id="delete-project-confirm"
          labelPlain
          label={
            <>
              Type{" "}
              <span className="rounded bg-danger-dim px-1.5 py-0.5 font-mono text-2xs font-semibold text-danger">
                {project.name}
              </span>{" "}
              to confirm deletion.
            </>
          }
          value={confirmText}
          onChange={(event) => setConfirmText(event.target.value)}
          placeholder={project.name}
          autoFocus
          autoComplete="off"
          invalid={confirmText.length > 0 && !isConfirmed}
        />
      </div>
    </DialogShell>
  );
}
