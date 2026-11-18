"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { Workspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { Check, Plus, Search } from "lucide-react";
import { useState } from "react";

interface WorkspaceSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  onSelectWorkspace: (workspace: Workspace) => void;
  onCreateWorkspace: () => void;
}

export default function WorkspaceSwitcherModal({
  isOpen,
  onClose,
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
  onCreateWorkspace,
}: WorkspaceSwitcherModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredWorkspaces = workspaces.filter((ws) =>
    ws.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Switch workspace"
      size="sm"
      bodyClassName="px-0 py-0"
    >
      <div className="border-b border-border p-4">
        <div className="relative">
          <Search
            size={16}
            className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted"
          />
          <input
            type="text"
            autoFocus
            placeholder="Search workspaces..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="h-10 w-full rounded-lg border border-border-md bg-fill-1 pr-3 pl-9 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
        </div>
      </div>

      <div className="max-h-[50vh] overflow-y-auto p-2">
        <div className="px-3 py-2 text-[10px] font-semibold tracking-widest text-fg-muted uppercase">
          Your workspaces
        </div>

        <div className="mt-1 space-y-1">
          {filteredWorkspaces.length === 0 ? (
            <div className="py-6 text-center text-sm text-fg-muted">
              No workspaces found for &quot;{searchQuery}&quot;
            </div>
          ) : (
            filteredWorkspaces.map((ws) => {
              const isActive = activeWorkspace?.id === ws.id;

              return (
                <button
                  key={ws.id}
                  type="button"
                  onClick={() => {
                    onSelectWorkspace(ws);
                    onClose();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg border p-2.5 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                    isActive
                      ? "border-accent bg-accent-dim"
                      : "border-transparent hover:bg-fill-2",
                  )}
                >
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-on-accent"
                    style={{ backgroundColor: ws.colour || "#7C6EF5" }}
                  >
                    {ws.name.substring(0, 2).toUpperCase()}
                  </div>

                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-sm font-semibold text-fg">
                      {ws.name}
                    </span>
                    <span className="mt-0.5 truncate text-[12px] text-fg-muted">
                      {ws.role || "Member"} · {ws.projectsCount || 0} projects
                    </span>
                  </div>

                  {isActive && (
                    <Check size={18} className="mr-1 shrink-0 text-accent" />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={() => {
            onClose();
            onCreateWorkspace();
          }}
          className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-dashed border-border-lg">
            <Plus size={18} className="text-fg-muted" />
          </div>
          <span className="text-sm font-semibold text-fg-secondary">
            Create workspace
          </span>
        </button>
      </div>
    </DialogShell>
  );
}
