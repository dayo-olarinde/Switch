"use client";

import { Portal } from "@/components/ui/Portal";
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

  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <Portal>
      {isOpen && (
        <div
          className="fixed inset-0 z-9999 flex items-center justify-center bg-scrim backdrop-blur-sm px-4 animate-in fade-in duration-200"
          onClick={onClose}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-95 bg-base border border-border rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.8)] relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
          >
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-muted"
                />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search workspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-fill-1 border border-border focus:border-accent/50 focus:bg-fill-2 rounded-xl pl-10 pr-4 py-3 text-sm text-fg placeholder-white/30 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="p-2 max-h-[50vh] overflow-y-auto custom-scrollbar">
              <div className="px-3 py-2 text-[10px] font-bold text-fg-muted uppercase tracking-widest">
                Your Workspaces
              </div>

              <div className="space-y-1 mt-1">
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
                        onClick={() => {
                          onSelectWorkspace(ws);
                          onClose();
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left group",
                          isActive
                            ? "bg-accent-dim border border-accent/20"
                            : "border border-transparent hover:bg-fill-2",
                        )}
                      >
                        <div
                          className="w-10 h-10 shrink-0 rounded-lg flex items-center justify-center text-fg font-black text-sm shadow-sm"
                          style={{ backgroundColor: ws.colour || "#7C6EF5" }}
                        >
                          {getInitials(ws.name)}
                        </div>

                        <div className="flex flex-col flex-1 overflow-hidden">
                          <span className="text-[14px] font-semibold text-fg truncate">
                            {ws.name}
                          </span>
                          <span className="text-[12px] text-fg-muted truncate mt-0.5">
                            {ws.role || "Member"} · {ws.projectsCount || 0}{" "}
                            projects
                          </span>
                        </div>

                        {isActive && (
                          <Check
                            size={18}
                            className="text-accent mr-2 shrink-0 animate-in zoom-in duration-300"
                          />
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            <div className="p-2 border-t border-border bg-base">
              <button
                onClick={() => {
                  onClose();
                  onCreateWorkspace();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-fill-2 transition-colors text-left group"
              >
                <div className="w-9 h-9 shrink-0 rounded-lg border border-dashed border-border-lg flex items-center justify-center group-hover:border-accent/50 group-hover:bg-accent-solid/90/10 transition-all">
                  <Plus
                    size={18}
                    className="text-fg-muted group-hover:text-accent transition-colors"
                  />
                </div>
                <span className="text-[14px] font-semibold text-fg-secondary group-hover:text-fg transition-colors">
                  Create workspace
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Portal>
  );
}
