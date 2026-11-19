"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { FormAlert } from "@/components/ui/feedback";
import { TextInput } from "@/components/ui/field";
import { useDeleteWorkspace, Workspace } from "@/hooks/useWorkspace";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DeleteWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
  projectCount?: number;
  memberCount?: number;
}

export default function DeleteWorkspaceModal({
  isOpen,
  onClose,
  workspace,
  projectCount = 0,
  memberCount = 0,
}: DeleteWorkspaceModalProps) {
  const router = useRouter();

  const [confirmInput, setConfirmInput] = useState("");
  const { mutate: deleteWorkspace, isPending } = useDeleteWorkspace(
    workspace?.slug ?? "",
  );

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setConfirmInput(""), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!workspace) return null;

  const isMatch = confirmInput === workspace.slug;

  const handleDeleteWorkspace = () => {
    if (!isMatch) return;
    deleteWorkspace();
    router.push("/dashboard");
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Delete workspace"
      description="Permanently deletes the workspace, all projects, boards, cards, and member access."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteWorkspace}
            disabled={!isMatch}
            loading={isPending}
          >
            Delete workspace forever
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-solid text-body font-semibold text-on-accent">
          {workspace.name.substring(0, 2).toUpperCase()}
        </span>
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-body font-semibold text-fg">
            {workspace.name}
          </span>
          <span className="mt-0.5 truncate text-2xs text-fg-secondary">
            {projectCount} projects · {memberCount} members
          </span>
        </span>
      </div>

      <FormAlert tone="danger" className="mt-4">
        <span className="block font-semibold">This is irreversible</span>
        <span className="mt-1 block">
          All {projectCount} projects, attachments, comments, and member access
          will be permanently deleted. Billing will stop immediately. There is no
          way to recover this workspace.
        </span>
      </FormAlert>

      <div className="mt-4">
        <TextInput
          id="delete-workspace-confirm"
          labelPlain
          label={
            <>
              Type{" "}
              <span className="rounded bg-danger-dim px-1.5 py-0.5 font-mono text-2xs font-semibold text-danger">
                {workspace.slug}
              </span>{" "}
              to confirm. This immediately revokes access for all {memberCount}{" "}
              members.
            </>
          }
          value={confirmInput}
          onChange={(event) => setConfirmInput(event.target.value)}
          placeholder={workspace.slug}
          autoComplete="off"
          invalid={confirmInput.length > 0 && !isMatch}
        />
      </div>
    </DialogShell>
  );
}
