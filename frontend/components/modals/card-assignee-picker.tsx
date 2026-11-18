"use client";

import { WorkspaceMembers } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

function getInitials(member: WorkspaceMembers) {
  const first = member.firstName?.[0] ?? "";
  const last = member.lastName?.[0] ?? "";
  return (
    `${first}${last}`.toUpperCase() || member.email?.[0]?.toUpperCase() || "?"
  );
}

interface CardAssigneePickerProps {
  members: WorkspaceMembers[];
  selected: string[];
  loading: boolean;
  onToggle: (userId: string) => void;
}

export function CardAssigneePicker({
  members,
  selected,
  loading,
  onToggle,
}: CardAssigneePickerProps) {
  return (
    <div className="space-y-2">
      <span className="text-xs font-semibold text-fg-muted uppercase">
        Assignees
      </span>
      <div className="space-y-0.5">
        {loading ? (
          <div className="flex items-center justify-center py-5">
            <Loader2 size={16} className="animate-spin text-accent" />
          </div>
        ) : members.length > 0 ? (
          members.map((member) => {
            const isSelected = selected.includes(member.userId);

            return (
              <button
                key={member.id}
                type="button"
                onClick={() => onToggle(member.userId)}
                aria-pressed={isSelected}
                className="flex w-full items-center justify-between rounded-lg p-1.5 text-left transition-colors hover:bg-fill-1 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <div className="flex min-w-0 items-center gap-2.5">
                  {member.avatarUrl ? (
                    <img
                      src={member.avatarUrl}
                      alt={`${member.firstName} ${member.lastName}`}
                      width={28}
                      height={28}
                      className="size-7 shrink-0 rounded-full border border-border-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-border-md bg-accent-dim text-[9px] font-bold text-accent">
                      {getInitials(member)}
                    </div>
                  )}
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate text-[12px] font-medium text-fg">
                      {member.firstName} {member.lastName}
                    </span>
                    <span className="truncate text-[10px] text-fg-muted">
                      {member.email}
                    </span>
                  </div>
                </div>
                <div
                  className={cn(
                    "mr-1 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    isSelected
                      ? "border-accent bg-accent-solid text-on-accent"
                      : "border-border-md bg-transparent",
                  )}
                >
                  {isSelected && <Check size={10} strokeWidth={3} />}
                </div>
              </button>
            );
          })
        ) : (
          <div className="px-2 py-4 text-center text-[12px] text-fg-muted">
            No workspace members found.
          </div>
        )}
      </div>
    </div>
  );
}
