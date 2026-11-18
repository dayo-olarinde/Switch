"use client";

import { Badge } from "@/components/ui/badge";
import { DialogShell } from "@/components/ui/dialog-shell";
import {
  PendingInvites,
  useResendInvite,
  useRevokeInvite,
  useSendInvite,
} from "@/hooks/useInvitations";
import { Workspace } from "@/hooks/useWorkspace";
import { timeAgo } from "@/lib/utils";
import { ArrowRight, ChevronDown, Info, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace;
  pendingInvites: PendingInvites[];
  isLoading: boolean;
}

export default function InviteMemberModal({
  isOpen,
  onClose,
  workspace,
  pendingInvites,
  isLoading,
}: InviteMemberModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Member");

  const { mutate: revokeInvite } = useRevokeInvite(workspace.slug);
  const { mutate: sendInvite, isPending } = useSendInvite(workspace.slug);
  const { mutate: resend, isPending: resendingInvite } = useResendInvite(
    workspace.slug,
  );

  const handleInvite = () => {
    if (!email.trim()) return;

    sendInvite(
      { email, role },
      {
        onSuccess: () => {
          setEmail("");
        },
      },
    );
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title={`Invite to ${workspace.name}`}
      description="Invite team members via email. They'll receive a link to join."
      size="lg"
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
            onClick={handleInvite}
            disabled={!email || isPending}
            className="flex h-10 items-center gap-2 rounded-lg bg-accent-solid px-4 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Sending...
              </>
            ) : (
              <>
                Send invitation
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-[2fr_1fr] gap-4">
        <div>
          <label
            htmlFor="invite-email"
            className="mb-2 block text-xs font-semibold text-fg-secondary"
          >
            Email address <span className="text-accent">*</span>
          </label>
          <input
            id="invite-email"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
        </div>
        <div>
          <label
            htmlFor="invite-role"
            className="mb-2 block text-xs font-semibold text-fg-secondary"
          >
            Role
          </label>
          <div className="relative">
            <select
              id="invite-role"
              value={role}
              onChange={(event) => setRole(event.target.value)}
              className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border-md bg-fill-1 pr-8 pl-3 text-sm text-fg transition-colors outline-none focus:border-accent"
            >
              <option value="Member" className="bg-surface">
                Member
              </option>
              <option value="Admin" className="bg-surface">
                Admin
              </option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-fg-secondary"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-accent bg-accent-dim p-3.5">
        <Info size={16} className="mt-0.5 shrink-0 text-accent" />
        <p className="text-[13px] leading-relaxed text-fg-secondary">
          <span className="font-semibold text-fg">Members</span> can view and
          edit projects. <span className="font-semibold text-fg">Admins</span>{" "}
          can also manage members and workspace settings.
        </p>
      </div>

      <div className="my-5 h-px w-full bg-border" />

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-[13px] font-semibold text-fg-secondary">
          <UserPlus size={14} className="text-fg-muted" />
          Pending invitations
          {pendingInvites?.length > 0 && (
            <Badge tone="neutral">{pendingInvites.length}</Badge>
          )}
        </h3>

        <div className="max-h-50 space-y-3 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-sm text-fg-muted">
              <Loader2 size={14} className="mr-2 animate-spin" />
              Loading...
            </div>
          ) : pendingInvites && pendingInvites.length > 0 ? (
            pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-accent bg-accent-dim text-xs font-bold text-accent">
                    {invite.email.substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <span className="max-w-50 truncate text-sm font-semibold text-fg">
                      {invite.email}
                    </span>
                    <span className="truncate text-xs text-fg-muted">
                      Invited {timeAgo(invite.createdAt)} · {invite.role}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <button
                    type="button"
                    disabled={resendingInvite}
                    onClick={() => resend(invite.email)}
                    className="text-xs font-semibold text-fg-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
                  >
                    Resend
                  </button>
                  <button
                    type="button"
                    onClick={() => revokeInvite(invite.email)}
                    className="text-xs font-semibold text-fg-muted transition-colors hover:text-danger focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-2 text-[13px] text-fg-muted">
              No pending invitations.
            </div>
          )}
        </div>
      </div>
    </DialogShell>
  );
}
