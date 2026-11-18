"use client";

import { ListTodo, Package, Plus, Users } from "lucide-react";

interface EmptyProjectStateProps {
  onCreateProject: () => void;
}

export default function EmptyProjectState({
  onCreateProject,
}: EmptyProjectStateProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh] px-4 animate-in fade-in zoom-in-95 duration-500">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-1 { animation: float 4s ease-in-out infinite; }
        .animate-float-2 { animation: float 4s ease-in-out 1s infinite; }
        .animate-float-3 { animation: float 5s ease-in-out 2s infinite; }
      `,
        }}
      />

      <div className="relative w-32 h-32 flex items-center justify-center mb-6">
        <div className="absolute top-2 left-4 w-10 h-10 bg-fill-1 border border-border rounded-xl flex items-center justify-center z-10 shadow-sm animate-float-2">
          <ListTodo size={18} className="text-accent opacity-50" />
        </div>

        <div className="relative w-16 h-16 bg-fill-2 border border-border rounded-2xl flex items-center justify-center z-20 shadow-md animate-float-1 backdrop-blur-sm">
          <Package size={24} className="text-accent" />
          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-accent-solid border-[3px] border-base rounded-full flex items-center justify-center shadow-sm">
            <Plus size={12} className="text-fg" strokeWidth={3} />
          </div>
        </div>

        <div className="absolute bottom-4 right-2 w-8 h-8 bg-fill-1 border border-border rounded-lg flex items-center justify-center z-30 shadow-sm animate-float-3">
          <Users size={14} className="text-fg-muted" />
        </div>
      </div>

      <h2 className="text-lg font-bold text-fg mb-2 tracking-tight">
        Create your first project
      </h2>
      <p className="text-[13px] text-fg-muted text-center max-w-90 leading-relaxed mb-8">
        Projects help you organize boards, track tasks, and keep your team
        aligned. Create one to get started.
      </p>

      <button
        onClick={onCreateProject}
        className="h-10 px-5 bg-accent-solid hover:bg-accent-solid/90 text-on-accent rounded-lg text-[13px] font-semibold flex items-center gap-2 transition-colors shadow-[0_0_15px_rgba(124,110,245,0.3)] hover:shadow-[0_0_20px_rgba(124,110,245,0.5)] mb-10"
      >
        <Plus size={16} />
        Create project
      </button>

      <div className="w-full max-w-115 space-y-3">
        <div className="bg-fill-1 border border-border rounded-xl p-4 flex items-start gap-4 hover:bg-fill-1 transition-colors">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-accent-solid/10 flex items-center justify-center mt-0.5">
            <Package size={16} className="text-accent" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-semibold text-fg mb-0.5">
              Organize your work
            </span>
            <span className="text-xs text-fg-muted leading-relaxed">
              Group your related boards, documents, and milestones into focused
              workspaces.
            </span>
          </div>
        </div>

        <div className="bg-fill-1 border border-border rounded-xl p-4 flex items-start gap-4 hover:bg-fill-1 transition-colors">
          <div className="w-8 h-8 shrink-0 rounded-lg bg-success-dim flex items-center justify-center mt-0.5">
            <Users size={16} className="text-success" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[13px] font-semibold text-fg mb-0.5">
              Collaborate effectively
            </span>
            <span className="text-xs text-fg-muted leading-relaxed">
              Share project context seamlessly and keep everyone on your team
              aligned on goals.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
