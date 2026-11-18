"use client";

import { useGetPendingInvites } from "@/hooks/useInvitations";
import {
  useLeaveWorkspace,
  useUpdateMemberRole,
  useWorkspaceRole,
  Workspace,
  WorkspaceMembers,
} from "@/hooks/useWorkspace";
import { formatDate, getConsistentColor } from "@/lib/utils";
import { ChevronDown, LogOut, Plus, Search, Trash2, Users } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import LeaveWorkspaceModal from "../modals/LeaveWorkspaceModal";
import InviteMemberModal from "../modals/InviteMemberModal";
import RemoveMemberModal from "../modals/RemoveMemberModal";
import { MembersSkeleton } from "../skeletons/MembersTab";

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

  const filteredMembers = members?.filter((member) => {
    const searchLower = searchQuery.toLowerCase();
    const fullName =
      `${member.firstName || ""} ${member.lastName || ""}`.toLowerCase();
    const email = (member.email || "").toLowerCase();
    const matchesSearch =
      fullName.includes(searchLower) || email.includes(searchLower);

    const matchesRole = roleFilter === "All" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = (
    e: ChangeEvent<HTMLSelectElement>,
    userId: string,
  ) => {
    const role = e.target.value as "Admin" | "Member";
    updateRole({ userId, role });
  };

  return (
    <div className="animate-in fade-in duration-300 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              size={15}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted group-focus-within:text-accent transition-colors"
            />
            <input
              type="text"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-64 lg:w-72 bg-scrim border border-border-md rounded-lg pl-10 pr-4 text-[13px] text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-sm"
            />
          </div>

          <div className="relative group">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="h-10 pl-3 pr-9 appearance-none bg-scrim border border-border-md rounded-lg text-[13px] font-medium text-fg-secondary hover:text-fg hover:bg-scrim transition-all cursor-pointer focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 shadow-sm"
            >
              <option value="All" className="bg-surface text-fg">
                All Roles
              </option>
              <option value="Owner" className="bg-surface text-fg">
                Owner
              </option>
              <option value="Admin" className="bg-surface text-fg">
                Admin
              </option>
              <option value="Member" className="bg-surface text-fg">
                Member
              </option>
            </select>
            <ChevronDown
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted group-focus-within:text-accent pointer-events-none transition-colors"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!isOwner && (
            <button
              onClick={() => setIsLeaveModalOpen(true)}
              className="h-10 px-4 bg-danger-dim hover:bg-danger-dim text-danger border border-danger flex items-center justify-center gap-2 rounded-lg text-[13px] font-semibold transition-all shrink-0"
            >
              <LogOut size={15} /> Leave Workspace
            </button>
          )}
          {canManageWorkspace && (
            <button
              onClick={() => setInviteModal(true)}
              className="h-10 px-5 bg-accent-solid hover:bg-accent-solid/90 text-on-accent flex items-center justify-center gap-2 rounded-lg text-[13px] font-semibold transition-all shadow-lg shadow-accent shrink-0"
            >
              <Plus size={16} /> Invite Member
            </button>
          )}
        </div>
      </div>

      {membersLoading ? (
        <MembersSkeleton />
      ) : (
        <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xl">
          <div className="grid grid-cols-[2.5fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b border-border bg-fill-1 text-[10px] font-bold text-fg-muted uppercase tracking-widest">
            <div>Member</div>
            <div>Joined</div>
            <div>Role</div>
            <div className="w-8"></div>
          </div>

          <div className="flex flex-col">
            {filteredMembers && filteredMembers.length > 0 ? (
              [...filteredMembers]
                .sort((a, b) => {
                  if (a.role === "Owner") return -1;
                  if (b.role === "Owner") return 1;
                  return 0;
                })
                .map((member: WorkspaceMembers, index: number) => {
                  const name =
                    (member.firstName + " " + member.lastName).trim() ||
                    "Unknown User";
                  const email = member.email || "user@switch.io";
                  const role = member.role || "Member";
                  const joinedDate = formatDate(member.joinedAt);

                  return (
                    <div
                      key={member.id || index}
                      className="group grid grid-cols-[2.5fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center border-b border-border last:border-b-0 hover:bg-fill-1 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {member.avatarUrl ? (
                          <Image
                            src={member.avatarUrl}
                            alt={name}
                            width={36}
                            height={36}
                            className="w-9 h-9 rounded-full object-cover shrink-0 border border-border-md shadow-sm"
                            unoptimized
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-fg text-xs font-bold shrink-0 border border-border-md shadow-sm"
                            style={{
                              backgroundColor: getConsistentColor(
                                member.id || name,
                              ),
                            }}
                          >
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[13px] font-semibold text-fg truncate">
                            {name}
                          </span>
                          <span className="text-[12px] font-medium text-fg-muted truncate mt-0.5">
                            {email}
                          </span>
                        </div>
                      </div>

                      <div className="text-[13px] text-fg-muted font-medium">
                        {joinedDate}
                      </div>

                      <div>
                        {role === "Owner" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-accent-solid/10 border border-accent/20 text-accent text-[11px] font-bold tracking-wide">
                            Owner
                          </span>
                        ) : isOwner ? (
                          <div className="relative inline-block w-28 group/select">
                            <select
                              value={role}
                              onChange={(e) =>
                                handleRoleChange(e, member.userId)
                              }
                              className="w-full h-8 pl-3 pr-8 appearance-none bg-transparent hover:bg-fill-2 border border-transparent hover:border-border-md rounded-md text-[13px] font-medium text-fg-secondary hover:text-fg transition-all focus:outline-none focus:border-accent/50 focus:bg-scrim cursor-pointer"
                            >
                              <option
                                value="Admin"
                                className="bg-surface text-fg"
                              >
                                Admin
                              </option>
                              <option
                                value="Member"
                                className="bg-surface text-fg"
                              >
                                Member
                              </option>
                            </select>
                            <ChevronDown
                              size={14}
                              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-fg-muted group-hover/select:text-fg-secondary pointer-events-none transition-colors"
                            />
                          </div>
                        ) : (
                          <span className="text-[13px] font-medium text-fg-muted pl-3">
                            {role}
                          </span>
                        )}
                      </div>

                      <div className="w-8 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        {role !== "Owner" && canManageWorkspace && (
                          <button
                            onClick={() => setMemberToRemove(member)}
                            className="text-fg-muted hover:text-danger p-1.5 rounded-md hover:bg-danger-dim transition-colors"
                            title="Remove member"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-2xl bg-fill-2 border border-border-md flex items-center justify-center mb-4 text-fg-muted">
                  <Users size={24} />
                </div>
                <span className="text-[14px] font-semibold text-fg mb-1">
                  No members found
                </span>
                <span className="text-[13px] text-fg-muted max-w-62.5">
                  Try adjusting your search query or role filter to find what
                  you&apos;re looking for.
                </span>
              </div>
            )}
          </div>
        </div>
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
