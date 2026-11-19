"use client";

import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Trash2 } from "lucide-react";
import { ChangeEvent } from "react";
import { WorkspaceMembers } from "@/hooks/useWorkspace";
import { formatDate } from "@/lib/utils";

const ROLE_TONES = {
  Owner: "accent",
  Admin: "success",
  Member: "neutral",
} as const;

interface MemberColumnsArgs {
  isOwner: boolean;
  canManageWorkspace: boolean;
  onRoleChange: (
    event: ChangeEvent<HTMLSelectElement>,
    member: WorkspaceMembers,
  ) => void;
  onRequestRemove: (member: WorkspaceMembers) => void;
}

export function memberColumns({
  isOwner,
  canManageWorkspace,
  onRoleChange,
  onRequestRemove,
}: MemberColumnsArgs) {
  return [
    {
      key: "member",
      header: "Member",
      render: (member: WorkspaceMembers) => {
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
      render: (member: WorkspaceMembers) => (
        <span className="text-body text-fg-muted">
          {formatDate(member.joinedAt)}
        </span>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (member: WorkspaceMembers) => {
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
              onChange={(event) => onRoleChange(event, member)}
              aria-label={`Role for ${member.firstName}`}
              className="h-8 w-full cursor-pointer appearance-none rounded-md border border-transparent bg-transparent pr-7 pl-2 text-body font-medium text-fg-secondary transition-colors outline-none hover:border-border-md hover:bg-fill-2 hover:text-fg focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <option value="Admin" className="bg-overlay text-fg">
                Admin
              </option>
              <option value="Member" className="bg-overlay text-fg">
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
      align: "right" as const,
      className: "w-12",
      render: (member: WorkspaceMembers) =>
        member.role !== "Owner" && canManageWorkspace ? (
          <button
            type="button"
            onClick={() => onRequestRemove(member)}
            aria-label={`Remove ${member.firstName}`}
            className="rounded-md p-1.5 text-fg-muted opacity-0 transition-all group-hover/row:opacity-100 hover:bg-danger-dim hover:text-danger focus-visible:opacity-100"
          >
            <Trash2 size={15} />
          </button>
        ) : null,
    },
  ];
}
