"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { TextInput } from "@/components/ui/field";
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
        <TextInput
          type="search"
          autoFocus
          placeholder="Search workspaces..."
          aria-label="Search workspaces"
          leading={<Search size={15} aria-hidden />}
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
      </div>

      <div className="max-h-96 overflow-y-auto p-2">
        <div className="px-3 py-2 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
          Your workspaces
        </div>

        <div className="mt-1 space-y-0.5">
          {filteredWorkspaces.length === 0 ? (
            <p className="py-6 text-center text-body text-fg-muted">
              No workspaces found for &quot;{searchQuery}&quot;
            </p>
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
                  <span
                    className="flex size-9 shrink-0 items-center justify-center rounded-lg text-2xs font-semibold text-on-accent"
                    style={{ backgroundColor: ws.colour || "#7C6EF5" }}
                  >
                    {ws.name.substring(0, 2).toUpperCase()}
                  </span>

                  <span className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate text-body font-medium text-fg">
                      {ws.name}
                    </span>
                    <span className="mt-0.5 truncate text-2xs text-fg-muted">
                      {ws.role || "Member"} · {ws.projectsCount || 0} projects
                    </span>
                  </span>

                  {isActive && (
                    <Check
                      size={16}
                      aria-hidden
                      className="mr-1 shrink-0 text-accent"
                    />
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          onClick={() => {
            onClose();
            onCreateWorkspace();
          }}
          icon={
            <span className="flex size-7 items-center justify-center rounded-md border border-dashed border-border-lg">
              <Plus size={14} aria-hidden className="text-fg-muted" />
            </span>
          }
          className="h-auto w-full justify-start gap-3 rounded-lg px-3 py-2 text-left font-medium"
        >
          Create workspace
        </Button>
      </div>
    </DialogShell>
  );
}
