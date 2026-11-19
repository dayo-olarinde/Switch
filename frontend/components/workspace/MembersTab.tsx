"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Select, TextInput } from "@/components/ui/field";
import { EmptyState } from "@/components/ui/page";
import { useGetPendingInvites } from "@/hooks/useInvitations";
import {
  useLeaveWorkspace,
  useUpdateMemberRole,
  useWorkspaceRole,
  Workspace,
  WorkspaceMembers,
} from "@/hooks/useWorkspace";
import { LogOut, Plus, Search, Users } from "lucide-react";
import { ChangeEvent, useState } from "react";
import InviteMemberModal from "../modals/InviteMemberModal";
import LeaveWorkspaceModal from "../modals/LeaveWorkspaceModal";
import RemoveMemberModal from "../modals/RemoveMemberModal";
import { MembersSkeleton } from "../skeletons/MembersTab";
import { memberColumns } from "./member-columns";

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

      return (
        matchesSearch && (roleFilter === "All" || member.role === roleFilter)
      );
    })
    .sort((a, b) => {
      if (a.role === "Owner") return -1;
      if (b.role === "Owner") return 1;
      return 0;
    });

  const handleRoleChange = (
    event: ChangeEvent<HTMLSelectElement>,
    member: WorkspaceMembers,
  ) => {
    updateRole({
      userId: member.userId,
      role: event.target.value as "Admin" | "Member",
    });
  };

  return (
    <div className="pb-10">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <TextInput
            type="text"
            placeholder="Search members"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            aria-label="Search members"
            leading={<Search size={14} />}
            wrapperClassName="w-56 sm:w-64"
          />

          <Select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter by role"
            className="font-medium text-fg-secondary hover:text-fg"
            wrapperClassName="w-36"
          >
            {["All", "Owner", "Admin", "Member"].map((role) => (
              <option key={role} value={role} className="bg-surface text-fg">
                {role === "All" ? "All roles" : role}
              </option>
            ))}
          </Select>
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
          columns={memberColumns({
            isOwner,
            canManageWorkspace,
            onRoleChange: handleRoleChange,
            onRequestRemove: setMemberToRemove,
          })}
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
