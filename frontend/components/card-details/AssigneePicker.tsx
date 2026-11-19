"use client";

import { Avatar } from "@/components/ui/avatar";
import { useToggleAssignee } from "@/hooks/useCards";
import { useGetMembers } from "@/hooks/useWorkspace";
import { BoardCard } from "@/types/board.types";
import { useMemo, useState } from "react";
import {
  SidebarEmpty,
  SidebarListShell,
  SidebarSearch,
  ToggleSwitch,
} from "./sidebar-parts";

export function AssigneePicker({
  card,
  workspaceSlug,
}: {
  card: BoardCard;
  workspaceSlug: string;
}) {
  const [search, setSearch] = useState("");
  const { data: members, isLoading } = useGetMembers(workspaceSlug);
  const { mutate: toggleAssignee, isPending } = useToggleAssignee(card.id);

  const filtered = useMemo(() => {
    if (!members) return [];
    const query = search.trim().toLowerCase();
    if (!query) return members;

    return members.filter(
      (member) =>
        member.firstName.toLowerCase().includes(query) ||
        member.lastName.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query),
    );
  }, [members, search]);

  const assignedIds = new Set((card.assignees ?? []).map((a) => a.userId));

  return (
    <SidebarListShell>
      <SidebarSearch
        value={search}
        onChange={setSearch}
        placeholder="Search members…"
      />

      <div className="custom-scrollbar max-h-44 overflow-y-auto p-1">
        {isLoading ? (
          <SidebarEmpty>Loading members…</SidebarEmpty>
        ) : filtered.length === 0 ? (
          <SidebarEmpty>No members found</SidebarEmpty>
        ) : (
          filtered.map((member) => {
            const isAssigned = assignedIds.has(member.userId);

            return (
              <button
                key={member.id}
                type="button"
                aria-pressed={isAssigned}
                disabled={isPending}
                onClick={() => toggleAssignee({ member, isAssigned })}
                className="flex w-full items-center justify-between gap-2 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-fill-2 disabled:opacity-60"
              >
                <span className="flex min-w-0 items-center gap-2">
                  <Avatar
                    firstName={member.firstName}
                    lastName={member.lastName}
                    avatarUrl={member.avatarUrl}
                    size="sm"
                  />
                  <span className="flex min-w-0 flex-col">
                    <span className="truncate text-body font-medium text-fg">
                      {member.firstName} {member.lastName}
                    </span>
                    <span className="truncate text-2xs text-fg-muted">
                      {member.email}
                    </span>
                  </span>
                </span>
                <ToggleSwitch checked={isAssigned} disabled={isPending} />
              </button>
            );
          })
        )}
      </div>
    </SidebarListShell>
  );
}
