"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { FormAlert } from "@/components/ui/feedback";
import { Select, TextInput } from "@/components/ui/field";
import {
  PendingInvites,
  useResendInvite,
  useRevokeInvite,
  useSendInvite,
} from "@/hooks/useInvitations";
import { Workspace } from "@/hooks/useWorkspace";
import { inviteMemberSchema, InviteMemberValues } from "@/lib/schemas/workspace";
import { timeAgo } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, UserPlus } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";

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
  const { mutate: revokeInvite } = useRevokeInvite(workspace.slug);
  const { mutate: sendInvite, isPending } = useSendInvite(workspace.slug);
  const { mutate: resend, isPending: resendingInvite } = useResendInvite(
    workspace.slug,
  );

  const form = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema),
    defaultValues: { email: "", role: "Member" },
  });

  const email = useWatch({ control: form.control, name: "email" });

  const onSubmit = form.handleSubmit((values) => {
    sendInvite(values, {
      onSuccess: () => form.resetField("email", { defaultValue: "" }),
    });
  });

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title={`Invite to ${workspace.name}`}
      description="Invite team members via email. They'll receive a link to join."
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="invite-member-form"
            loading={isPending}
            disabled={!email}
          >
            Send invitation
          </Button>
        </>
      }
    >
      <form
        id="invite-member-form"
        onSubmit={onSubmit}
        className="grid grid-cols-[2fr_1fr] items-start gap-4"
      >
        <TextInput
          id="invite-email"
          type="email"
          label="Email address"
          required
          placeholder="colleague@company.com"
          error={form.formState.errors.email?.message}
          {...form.register("email")}
        />

        <Select
          id="invite-role"
          label="Role"
          {...form.register("role")}
        >
          <option value="Member">Member</option>
          <option value="Admin">Admin</option>
        </Select>
      </form>

      <FormAlert tone="info" className="mt-4">
        <span className="font-semibold text-fg">Members</span> can view and edit
        projects. <span className="font-semibold text-fg">Admins</span> can also
        manage members and workspace settings.
      </FormAlert>

      <div className="my-5 h-px w-full bg-border" />

      <div>
        <h3 className="mb-3 flex items-center gap-2 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
          <UserPlus size={13} aria-hidden />
          Pending invitations
          {pendingInvites?.length > 0 && (
            <Badge tone="neutral">{pendingInvites.length}</Badge>
          )}
        </h3>

        <div className="max-h-50 space-y-1 overflow-y-auto pr-1">
          {isLoading ? (
            <div className="flex items-center justify-center py-4 text-body text-fg-muted">
              <Loader2 size={14} aria-hidden className="mr-2 animate-spin" />
              Loading...
            </div>
          ) : pendingInvites && pendingInvites.length > 0 ? (
            pendingInvites.map((invite) => (
              <div
                key={invite.id}
                className="flex items-center justify-between gap-3 rounded-lg px-1 py-1.5 transition-colors hover:bg-fill-1"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-accent/30 bg-accent-dim text-2xs font-semibold text-accent">
                    {invite.email.substring(0, 2).toUpperCase()}
                  </span>
                  <span className="flex min-w-0 flex-col">
                    <span className="max-w-50 truncate text-body font-medium text-fg">
                      {invite.email}
                    </span>
                    <span className="truncate text-2xs text-fg-muted">
                      Invited {timeAgo(invite.createdAt)} · {invite.role}
                    </span>
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={resendingInvite}
                    onClick={() => resend(invite.email)}
                  >
                    Resend
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => revokeInvite(invite.email)}
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="py-2 text-body text-fg-muted">
              No pending invitations.
            </p>
          )}
        </div>
      </div>
    </DialogShell>
  );
}
