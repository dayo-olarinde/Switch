"use client";

import { Avatar } from "@/components/ui/avatar";
import { WorkspaceMembers } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { Check, Loader2 } from "lucide-react";

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
      <span className="text-2xs font-semibold tracking-wider text-fg-muted uppercase">
        Assignees
      </span>
      <div className="max-h-48 space-y-0.5 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-5">
            <Loader2
              size={16}
              aria-label="Loading members"
              className="animate-spin text-accent"
            />
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
                <span className="flex min-w-0 items-center gap-2.5">
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
                <span
                  aria-hidden
                  className={cn(
                    "mr-1 flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
                    isSelected
                      ? "border-accent bg-accent-solid text-on-accent"
                      : "border-border-md bg-transparent",
                  )}
                >
                  {isSelected && (
                    <Check size={10} strokeWidth={3} aria-hidden />
                  )}
                </span>
              </button>
            );
          })
        ) : (
          <div className="px-2 py-4 text-center text-2xs text-fg-muted">
            No workspace members found.
          </div>
        )}
      </div>
    </div>
  );
}
