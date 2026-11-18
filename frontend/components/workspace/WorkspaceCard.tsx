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
    <div
      onClick={handleRedirectWorkspace}
      className="bg-surface border border-border cursor-pointer rounded-xl p-5 hover:border-border-md transition-all group flex flex-col h-50"
    >
      <div className="flex items-start justify-between mb-4">
        <div
          style={{ backgroundColor: ws?.colour }}
          className={cn(
            "w-10 h-10 rounded-lg  flex items-center justify-center text-fg font-black text-sm",
          )}
        >
          {getInitials(ws.name)}
        </div>
        <span
          className={cn(
            "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest",
            ws.role === "Owner"
              ? "bg-accent-solid/10 text-accent"
              : ws.role === "Admin"
                ? "bg-success-dim text-success"
                : "bg-overlay text-fg-secondary",
          )}
        >
          {ws.role}
        </span>
      </div>

      <div>
        <h3 className="text-base font-bold text-fg group-hover:text-accent transition-colors">
          {ws.name}
        </h3>
        <p className="text-xs text-fg-secondary mt-0.5">{ws.slug}</p>
      </div>

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
        <div className="flex items-center gap-1.5 text-xs font-medium text-fg-secondary">
          <Folder size={14} />{" "}
          {ws.projectsCount ? `${ws.projectsCount} Projects` : "0 Projects"}
        </div>
        {formatAvatarUrls(ws.members)}
      </div>
    </div>
  );
};

export const formatAvatarUrls = (users: BoardAssignee[]) => {
  return (
    <div className="flex items-center">
      <div className="flex -space-x-2 mr-2">
        {users?.slice(0, 3).map((user, idx) => (
          <div
            key={idx}
            className="w-6 h-6 rounded-full border border-surface bg-overlay flex items-center justify-center overflow-hidden shrink-0"
          >
            {user.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.firstName || "Member"}
                width={24}
                height={24}
                className="w-full h-full object-cover"
                unoptimized
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-[10px] font-bold text-fg">
                {`${user.firstName?.charAt(0).toUpperCase() ?? ""}${
                  user.lastName?.charAt(0).toUpperCase() ?? ""
                }`}
              </span>
            )}
          </div>
        ))}

        {users?.length > 3 && (
          <div className="w-6 h-6 rounded-full border-2 border-surface bg-overlay flex items-center justify-center text-[9px] font-bold text-fg z-10">
            +{users.length - 3}
          </div>
        )}
      </div>
    </div>
  );
};
