"use client";

import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import { useLogout } from "@/hooks/useAuth";
import { useGetWorkspaces } from "@/hooks/useWorkspace";
import { LayoutGrid, Loader2, Plus, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GettingStartedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logout = useLogout();
  const router = useRouter();

  const { data: workspaces = [], isLoading } = useGetWorkspaces();

  useEffect(() => {
    if (!isLoading && workspaces.length > 0) {
      router.replace("/dashboard");
    }
  }, [workspaces.length, isLoading, router]);

  if (isLoading || workspaces.length > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base">
        <Loader2 size={32} className="animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-base font-sans text-on-accent selection:bg-accent-solid/30">
      <header className="w-full h-14 border-b border-border flex items-center justify-between px-8 bg-base/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-md bg-accent-solid/80 flex items-center justify-center text-on-accent text-[11px] font-black shadow-[0_0_10px_rgba(124,110,245,0.4)]">
            S
          </div>
          <span className="text-[15px] font-bold text-fg tracking-tight">
            Switch
          </span>
        </div>
        <button
          onClick={() => logout()}
          className="text-[13px] font-medium text-fg-muted hover:text-fg transition-colors"
        >
          Sign out
        </button>
      </header>

      <main className="flex-1 w-full max-w-140 flex flex-col items-center justify-center p-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="relative mb-8">
            <div className="w-16 h-16 rounded-3xl bg-surface border border-border flex items-center justify-center relative z-10 shadow-2xl">
              <LayoutGrid size={28} className="text-accent" />
            </div>
            <div className="w-12 h-12 rounded-2xl bg-surface border border-border flex items-center justify-center absolute -top-4 -left-4 z-0 opacity-50">
              <LayoutGrid size={20} className="text-accent/50" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-fg tracking-tight mb-3">
            Create your first workspace
          </h1>
          <p className="text-[14px] text-fg-muted leading-relaxed max-w-100">
            A workspace brings your team, projects, and boards together in one
            place. Create yours to get started.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="h-11 px-6 bg-accent-solid hover:bg-accent-solid/90 text-on-accent rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-accent active:scale-[0.98] flex items-center justify-center gap-2 mb-12"
        >
          <Plus size={16} />
          Create workspace
        </button>

        <div className="w-full space-y-3">
          <div className="w-full p-5 bg-fill-1 border border-border rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-fill-2 rounded-xl border border-border shrink-0">
              <LayoutGrid size={18} className="text-accent" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[14px] font-semibold text-fg mb-1">
                Workspaces hold projects
              </span>
              <span className="text-[13px] text-fg-muted leading-relaxed">
                Group related projects — like &quot;Acme Corp&quot; or
                &quot;Side Projects&quot; — under one workspace.
              </span>
            </div>
          </div>

          <div className="w-full p-5 bg-fill-1 border border-border rounded-2xl flex items-start gap-4">
            <div className="p-2.5 bg-fill-2 rounded-xl border border-border shrink-0">
              <UserPlus size={18} className="text-success" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[14px] font-semibold text-fg mb-1">
                Invite your team
              </span>
              <span className="text-[13px] text-fg-muted leading-relaxed">
                Add members and assign roles — Owner, Admin, or Member — per
                workspace.
              </span>
            </div>
          </div>
        </div>
      </main>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
