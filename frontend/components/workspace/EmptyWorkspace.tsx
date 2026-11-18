"use client";

import { LayoutGrid, Plus, User, UserPlus } from "lucide-react";

interface EmptyWorkspaceStateProps {
  onCreateWorkspace: () => void;
}

export default function EmptyWorkspaceState({
  onCreateWorkspace,
}: EmptyWorkspaceStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[70vh] px-4 animate-in fade-in zoom-in-95 duration-500">
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        <div className="absolute top-2 left-4 w-10 h-10 bg-surface border border-border-md rounded-xl flex items-center justify-center z-10 shadow-sm">
          <LayoutGrid size={18} className="text-accent opacity-50" />
        </div>

        <div className="relative w-16 h-16 bg-card border border-border-md rounded-2xl flex items-center justify-center z-20 shadow-md">
          <LayoutGrid size={24} className="text-accent" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-solid border-2 border-card rounded-full flex items-center justify-center">
            <Plus size={12} className="text-fg" />
          </div>
        </div>

        <div className="absolute bottom-4 right-2 w-8 h-8 bg-surface border border-border-md rounded-lg flex items-center justify-center z-30 shadow-sm">
          <User size={14} className="text-fg-secondary" />
        </div>
      </div>

      <h2 className="text-lg font-bold text-fg mb-2 tracking-tight">
        Create your first workspace
      </h2>
      <p className="text-[13px] text-fg-secondary text-center max-w-90 leading-relaxed mb-6">
        A workspace brings your team, projects, and boards together in one
        place. Create yours to get started.
      </p>

      <button
        onClick={onCreateWorkspace}
        className="h-10 px-5 bg-accent-solid hover:bg-accent-solid/90 text-on-accent rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors shadow-sm mb-10"
      >
        <Plus size={16} />
        Create workspace
      </button>

      <div className="w-full max-w-115 space-y-3">
        <div className="bg-surface border border-border-md rounded-xl p-4 flex items-start gap-4">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-accent-solid/10 flex items-center justify-center mt-0.5">
            <LayoutGrid size={16} className="text-accent" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-semibold text-fg mb-0.5">
              Workspaces hold projects
            </span>
            <span className="text-xs text-fg-secondary leading-relaxed">
              Group related projects — like &quot;Acme Corp&quot; or &quot;Side
              Projects&quot; — under one workspace.
            </span>
          </div>
        </div>

        <div className="bg-surface border border-border-md rounded-xl p-4 flex items-start gap-4">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-success/10 flex items-center justify-center mt-0.5">
            <UserPlus size={16} className="text-success" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-semibold text-fg mb-0.5">
              Invite your team
            </span>
            <span className="text-xs text-fg-secondary leading-relaxed">
              Add members and assign roles — Owner, Admin, or Member — per
              workspace.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
