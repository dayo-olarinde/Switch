import { Workspace } from "@/hooks/useWorkspace";
import { cn, getInitials } from "@/lib/utils";
import { BoardAssignee } from "@/types/board.types";
import { Folder } from "lucide-react";
import Image from "next/image";

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
      className="group flex h-full flex-col rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-border-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
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

      <h3 className="truncate text-sm font-semibold text-fg transition-colors group-hover:text-accent">
        {ws.name}
      </h3>
      <p className="mt-0.5 truncate text-2xs text-fg-muted">/{ws.slug}</p>

      <div className="mt-auto flex items-center justify-between gap-2 pt-4">
        <span className="flex items-center gap-1.5 text-2xs font-medium text-fg-secondary">
          <Folder size={13} className="text-fg-muted" />
          {ws.projectsCount} {ws.projectsCount === 1 ? "project" : "projects"}
        </span>
        {formatAvatarUrls(ws.members)}
      </div>
    </button>
  );
};

export const formatAvatarUrls = (users: BoardAssignee[]) => {
  if (!users?.length) return null;

  return (
    <div className="flex items-center -space-x-1.5">
      {users.slice(0, 3).map((user, idx) => (
        <span
          key={idx}
          className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full border border-surface bg-overlay text-2xs font-semibold text-fg"
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt={user.firstName || "Member"}
              width={20}
              height={20}
              className="size-full object-cover"
              unoptimized
              referrerPolicy="no-referrer"
            />
          ) : (
            <>
              {user.firstName?.charAt(0).toUpperCase() ?? ""}
              {user.lastName?.charAt(0).toUpperCase() ?? ""}
            </>
          )}
        </span>
      ))}

      {users.length > 3 && (
        <span className="flex size-5 items-center justify-center rounded-full border border-surface bg-overlay text-2xs font-semibold text-fg-muted">
          +{users.length - 3}
        </span>
      )}
    </div>
  );
};
