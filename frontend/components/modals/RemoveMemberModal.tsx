"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { useRemoveMember, WorkspaceMembers } from "@/hooks/useWorkspace";
import { getConsistentColor } from "@/lib/utils";
import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";

interface RemoveMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: WorkspaceMembers | null;
  workspaceName: string;
  workspaceSlug: string;
}

export default function RemoveMemberModal({
  isOpen,
  onClose,
  member,
  workspaceName,
  workspaceSlug,
}: RemoveMemberModalProps) {
  const { mutate: removeMember, isPending } = useRemoveMember(workspaceSlug);

  const handleRemove = (userId: string) => {
    removeMember(userId);
    onClose();
    window.location.reload();
  };

  if (!member) return null;

  const name =
    (member.firstName + " " + member.lastName).trim() || "Unknown User";
  const email = member.email || "user@company.com";
  const role = member.role || "Member";
  const firstName = member.firstName || "This user";

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Remove member"
      description="Are you sure you want to remove this member from the workspace?"
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
            onClick={() => handleRemove(member.userId)}
            disabled={isPending}
            className="flex h-10 items-center gap-2 rounded-lg border border-danger bg-danger-dim px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger/25 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Removing...
              </>
            ) : (
              "Remove member"
            )}
          </button>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-4">
        {member.avatarUrl ? (
          <div className="size-10 shrink-0 overflow-hidden rounded-full border border-border">
            <Image
              src={member.avatarUrl}
              alt={name}
              width={40}
              height={40}
              className="size-full object-cover"
              unoptimized
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-on-accent"
            style={{ backgroundColor: getConsistentColor(member.id || name) }}
          >
            {name.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold text-fg">{name}</span>
          <span className="mt-0.5 truncate text-[13px] text-fg-secondary">
            {email} · {role} · {workspaceName}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger bg-danger-dim p-4">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
        <div className="flex flex-col">
          <span className="mb-1 text-[13px] font-semibold text-danger">
            This can&apos;t be undone
          </span>
          <p className="text-[13px] leading-relaxed text-fg-secondary">
            {firstName} will lose access to all projects in {workspaceName}{" "}
            immediately. Their assigned cards will remain but become unassigned.
          </p>
        </div>
      </div>
    </DialogShell>
  );
}
