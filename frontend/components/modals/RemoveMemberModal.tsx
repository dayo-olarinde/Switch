"use client";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { FormAlert } from "@/components/ui/feedback";
import { useRemoveMember, WorkspaceMembers } from "@/hooks/useWorkspace";

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
          <Button variant="secondary" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleRemove(member.userId)}
            loading={isPending}
          >
            Remove member
          </Button>
        </>
      }
    >
      <div className="flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-4">
        <Avatar
          firstName={member.firstName || name}
          lastName={member.lastName}
          avatarUrl={member.avatarUrl}
          size="lg"
        />
        <span className="flex min-w-0 flex-col">
          <span className="truncate text-body font-semibold text-fg">
            {name}
          </span>
          <span className="mt-0.5 truncate text-2xs text-fg-secondary">
            {email} · {role} · {workspaceName}
          </span>
        </span>
      </div>

      <FormAlert tone="danger" className="mt-4">
        <span className="block font-semibold">This can&apos;t be undone</span>
        <span className="mt-1 block">
          {firstName} will lose access to all projects in {workspaceName}{" "}
          immediately. Their assigned cards will remain but become unassigned.
        </span>
      </FormAlert>
    </DialogShell>
  );
}
