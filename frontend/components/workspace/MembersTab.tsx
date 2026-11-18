"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/page";
import { useGetPendingInvites } from "@/hooks/useInvitations";
import {
  useLeaveWorkspace,
  useUpdateMemberRole,
  useWorkspaceRole,
  Workspace,
  WorkspaceMembers,
} from "@/hooks/useWorkspace";
import { formatDate } from "@/lib/utils";
import { ChevronDown, LogOut, Plus, Search, Trash2, Users } from "lucide-react";
import { ChangeEvent, useState } from "react";
import InviteMemberModal from "../modals/InviteMemberModal";
import LeaveWorkspaceModal from "../modals/LeaveWorkspaceModal";
import RemoveMemberModal from "../modals/RemoveMemberModal";
import { MembersSkeleton } from "../skeletons/MembersTab";

const ROLE_TONES = {
  Owner: "accent",
  Admin: "success",
  Member: "neutral",
} as const;

export const MembersTab = ({
  members,
  membersLoading,
  activeWorkspace,
}: {
  members: WorkspaceMembers[];
  membersLoading: boolean;
  activeWorkspace: Workspace;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [inviteModal, setInviteModal] = useState(false);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<WorkspaceMembers | null>(
    null,
  );

  const { mutate: updateRole } = useUpdateMemberRole(activeWorkspace.slug);
  const { mutate: leaveWorkspace, isPending: isLeaving } = useLeaveWorkspace(
    activeWorkspace.slug,
  );

  const { canManageWorkspace, isOwner } = useWorkspaceRole();

  const { data: pendingInvites, isLoading: pendingInvitesLoading } =
    useGetPendingInvites(activeWorkspace.slug);

  const filteredMembers = members
    .filter((member) => {
      const searchLower = searchQuery.toLowerCase();
      const fullName =
        `${member.firstName || ""} ${member.lastName || ""}`.toLowerCase();
      const email = (member.email || "").toLowerCase();
      const matchesSearch =
        fullName.includes(searchLower) || email.includes(searchLower);

      return matchesSearch && (roleFilter === "All" || member.role === roleFilter);
    })
    .sort((a, b) => {
      if (a.role === "Owner") return -1;
      if (b.role === "Owner") return 1;
      return 0;
    });

  const handleRoleChange = (
    event: ChangeEvent<HTMLSelectElement>,
    userId: string,
  ) => {
    const role = event.target.value as "Admin" | "Member";
    updateRole({ userId, role });
  };

  return (
    <div className="pb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={14}
              className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
            />
            <input
              type="text"
              placeholder="Search members"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="h-10 w-56 rounded-lg border border-border bg-fill-1 pr-3 pl-9 text-body text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent sm:w-64"
            />
          </div>

          <div className="relative">
            <select
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filter by role"
              className="h-10 appearance-none rounded-lg border border-border bg-fill-1 pr-8 pl-3 text-body font-medium text-fg-secondary transition-colors outline-none hover:text-fg focus:border-accent"
            >
              {["All", "Owner", "Admin", "Member"].map((role) => (
                <option key={role} value={role} className="bg-surface text-fg">
                  {role === "All" ? "All roles" : role}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-muted"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isOwner && (
            <Button
              variant="secondary"
              onClick={() => setIsLeaveModalOpen(true)}
              icon={<LogOut size={14} />}
            >
              Leave workspace
            </Button>
          )}
          {canManageWorkspace && (
            <Button
              onClick={() => setInviteModal(true)}
              icon={<Plus size={15} />}
            >
              Invite member
            </Button>
          )}
        </div>
      </div>

      {membersLoading ? (
        <MembersSkeleton />
      ) : (
        <DataTable
          rows={filteredMembers}
          rowKey={(member) => member.id || member.userId}
          empty={
            <EmptyState
              icon={<Users size={18} />}
              title="No members found"
              description="Try adjusting your search or role filter to find who you're looking for."
            />
          }
          columns={[
            {
              key: "member",
              header: "Member",
              render: (member) => {
                const name =
                  `${member.firstName ?? ""} ${member.lastName ?? ""}`.trim() ||
                  "Unknown user";

                return (
                  <div className="flex min-w-0 items-center gap-3">
                    <Avatar
                      firstName={member.firstName || "?"}
                      lastName={member.lastName}
                      avatarUrl={member.avatarUrl}
                      size="md"
                    />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate text-body font-medium text-fg">
                        {name}
                      </span>
                      <span className="truncate text-2xs text-fg-muted">
                        {member.email || "—"}
                      </span>
                    </div>
                  </div>
                );
              },
            },
            {
              key: "joined",
              header: "Joined",
              render: (member) => (
                <span className="text-body text-fg-muted">
                  {formatDate(member.joinedAt)}
                </span>
              ),
            },
            {
              key: "role",
              header: "Role",
              render: (member) => {
                if (member.role === "Owner" || !isOwner) {
                  return (
                    <Badge tone={ROLE_TONES[member.role] ?? "neutral"}>
                      {member.role}
                    </Badge>
                  );
                }

                return (
                  <div className="relative inline-block w-28">
                    <select
                      value={member.role}
                      onChange={(event) =>
                        handleRoleChange(event, member.userId)
                      }
                      aria-label={`Role for ${member.firstName}`}
                      className="h-8 w-full appearance-none rounded-md border border-transparent bg-transparent pr-7 pl-2 text-body font-medium text-fg-secondary transition-colors outline-none hover:border-border-md hover:bg-fill-2 hover:text-fg focus:border-accent"
                    >
                      <option value="Admin" className="bg-surface text-fg">
                        Admin
                      </option>
                      <option value="Member" className="bg-surface text-fg">
                        Member
                      </option>
                    </select>
                    <ChevronDown
                      size={13}
                      className="pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-fg-muted"
                    />
                  </div>
                );
              },
            },
            {
              key: "actions",
              header: "",
              align: "right",
              className: "w-12",
              render: (member) =>
                member.role !== "Owner" && canManageWorkspace ? (
                  <button
                    type="button"
                    onClick={() => setMemberToRemove(member)}
                    aria-label={`Remove ${member.firstName}`}
                    className="rounded-md p-1.5 text-fg-muted opacity-0 transition-all group-hover/row:opacity-100 hover:bg-danger-dim hover:text-danger focus-visible:opacity-100"
                  >
                    <Trash2 size={15} />
                  </button>
                ) : null,
            },
          ]}
        />
      )}

      <InviteMemberModal
        isOpen={inviteModal}
        onClose={() => setInviteModal(false)}
        workspace={activeWorkspace}
        pendingInvites={pendingInvites ?? []}
        isLoading={pendingInvitesLoading}
      />

      <RemoveMemberModal
        isOpen={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        member={memberToRemove}
        workspaceName={activeWorkspace.name}
        workspaceSlug={activeWorkspace.slug}
      />

      <LeaveWorkspaceModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onConfirm={() => leaveWorkspace()}
        isPending={isLeaving}
        title="Leave workspace"
        description="Are you sure you want to leave this workspace? You'll lose access to all projects and boards."
        confirmLabel="Leave"
        isDangerous
      />
    </div>
  );
};
