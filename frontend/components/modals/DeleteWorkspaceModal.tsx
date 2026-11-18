"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { useDeleteWorkspace, Workspace } from "@/hooks/useWorkspace";
import { AlertTriangle, Loader2 } from "lucide-react";
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
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDeleteWorkspace}
            disabled={isPending || !isMatch}
            className="flex h-10 items-center gap-2 rounded-lg border border-danger bg-danger-dim px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger/25 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete workspace forever"
            )}
          </button>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-4">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent-solid text-sm font-bold text-on-accent">
          {workspace.name.substring(0, 2).toUpperCase()}
        </div>
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-fg">
            {workspace.name}
          </span>
          <span className="mt-0.5 truncate text-[13px] text-fg-secondary">
            {projectCount} projects · {memberCount} members
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger bg-danger-dim p-4">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
        <div className="flex flex-col">
          <span className="mb-1 text-[13px] font-semibold text-danger">
            This is irreversible
          </span>
          <p className="text-[13px] leading-relaxed text-fg-secondary">
            All {projectCount} projects, attachments, comments, and member
            access will be permanently deleted. Billing will stop immediately.
            There is no way to recover this workspace.
          </p>
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="delete-workspace-confirm"
          className="mb-3 block text-[13px] leading-relaxed text-fg-secondary"
        >
          Type{" "}
          <span className="rounded bg-danger-dim px-1.5 py-0.5 font-mono text-xs text-danger">
            {workspace.slug}
          </span>{" "}
          to confirm. This will immediately revoke access for all {memberCount}{" "}
          members.
        </label>
        <input
          id="delete-workspace-confirm"
          type="text"
          value={confirmInput}
          onChange={(event) => setConfirmInput(event.target.value)}
          placeholder={workspace.slug}
          autoComplete="off"
          className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-danger"
        />
      </div>
    </DialogShell>
  );
}
