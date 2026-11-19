import { AvatarGroup } from "@/components/ui/avatar";
import { Workspace } from "@/hooks/useWorkspace";
import { cn, getInitials } from "@/lib/utils";
import { Folder } from "lucide-react";

export const WorkspaceCard = ({
  ws,
  handleRedirectWorkspace,
}: {
  ws: Workspace;
  handleRedirectWorkspace: () => void;
}) => {
  return (
    <button
      type="button"
      onClick={handleRedirectWorkspace}
      className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 text-left transition-all hover:border-border-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none card-elevated hover:card-elevated-hover"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span
          style={{ backgroundColor: ws.colour }}
          className="flex size-9 items-center justify-center rounded-lg text-2xs font-bold text-on-accent"
        >
          {getInitials(ws.name)}
        </span>
        <span
          className={cn(
            "rounded-md px-1.5 py-0.5 text-2xs font-semibold",
            ws.role === "Owner"
              ? "bg-accent-dim text-accent"
              : ws.role === "Admin"
                ? "bg-success-dim text-success"
                : "bg-fill-2 text-fg-muted",
          )}
        >
          {ws.role}
        </span>
      </div>

      <h3 className="truncate text-body font-semibold text-fg transition-colors group-hover:text-accent">
        {ws.name}
      </h3>
      <p className="mt-0.5 truncate text-2xs text-fg-muted">/{ws.slug}</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="flex items-center gap-1.5 text-2xs font-medium text-fg-secondary">
          <Folder size={13} className="text-fg-muted" />
          {ws.projectsCount} {ws.projectsCount === 1 ? "project" : "projects"}
        </span>
        <AvatarGroup
          size="sm"
          users={(ws.members ?? []).map((member) => ({
            id: member.userId ?? member.id,
            firstName: member.firstName || "?",
            lastName: member.lastName,
            avatarUrl: member.avatarUrl,
          }))}
        />
      </div>
    </button>
  );
};
