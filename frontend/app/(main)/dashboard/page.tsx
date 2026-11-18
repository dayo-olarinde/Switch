"use client";

import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import EmptyWorkspaceState from "@/components/workspace/EmptyWorkspace";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { useMe, useTeammates } from "@/hooks/useAuth";
import { useOpenCards } from "@/hooks/useCards";
import { useActiveProjectsCount } from "@/hooks/useProjects";
import { useGetWorkspaces, Workspace } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  ArrowUp,
  Layers,
  LayoutGrid,
  ListTodo,
  Plus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);

  const { data: user } = useMe();
  const { data: cards } = useOpenCards();
  const { data: teammates } = useTeammates();
  const { data: projects, isLoading: countLoading } = useActiveProjectsCount();
  const { data: workspaces = [], isFetched } = useGetWorkspaces();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good Evening";

  const handleRedirectWorkspace = (ws: Workspace) => {
    setActiveWorkspace(ws);
    router.push(`/${ws.slug}`);
  };

  if (!isFetched || countLoading) {
    return (
      <div className="max-w-6xl mx-auto w-full animate-pulse">
        <div className="mb-8 space-y-3">
          <div className="h-8 w-64 bg-card rounded-md" />
          <div className="h-4 w-96 bg-card rounded-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-accent-dim border border-border rounded-xl p-5 h-29"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="h-5 w-32 bg-card rounded-md" />
              <div className="h-8 w-32 bg-card rounded-md" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div
                  key={i}
                  className="bg-surface border border-border rounded-xl h-44"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto w-full animate-in fade-in duration-500">
        {workspaces.length === 0 ? (
          <EmptyWorkspaceState
            onCreateWorkspace={() => setIsAddWorkspaceOpen(true)}
          />
        ) : (
          <>
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-fg mb-2 tracking-tight">
                {greeting}, {user?.firstName || "James"}
              </h1>
              <p className="text-fg-muted text-[13px]">
                Here&apos;s what&apos;s happening across your workspaces.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              <StatCard
                icon={<LayoutGrid size={16} className="text-accent" />}
                iconBg="bg-accent-solid/10"
                title="Workspaces"
                value={workspaces.length.toString()}
              />
              <StatCard
                icon={<ListTodo size={16} className="text-success" />}
                iconBg="bg-success-dim"
                title="Active Projects"
                value={projects?.count.toString()}
              />
              <StatCard
                icon={<Layers size={16} className="text-warning" />}
                iconBg="bg-warning-dim"
                title="Open Cards"
                value={cards?.count.toString()}
                subtitle="across all boards"
              />
              <StatCard
                icon={<Users size={16} className="text-danger" />}
                iconBg="bg-danger-dim"
                title="Team Members"
                value={teammates?.count.toString()}
                subtitle="across workspaces"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[13px] font-bold text-fg uppercase tracking-wider">
                    Your Workspaces
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {workspaces.map((ws) => (
                    <WorkspaceCard
                      key={ws.id}
                      ws={ws}
                      handleRedirectWorkspace={() =>
                        handleRedirectWorkspace(ws)
                      }
                    />
                  ))}

                  <button
                    onClick={() => setIsAddWorkspaceOpen(true)}
                    className="bg-fill-1 border border-dashed border-border-md rounded-xl p-5 hover:border-border-lg hover:bg-fill-1 transition-all flex flex-col items-center justify-center h-50 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-fill-1 flex items-center justify-center mb-3 group-hover:bg-accent-solid/90/10 group-hover:scale-110 transition-all duration-300">
                      <Plus
                        size={20}
                        className="text-fg-muted group-hover:text-accent transition-colors"
                      />
                    </div>
                    <span className="text-[13px] font-semibold text-fg-muted group-hover:text-fg transition-colors">
                      Create Workspace
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      <CreateWorkspaceModal
        isOpen={isAddWorkspaceOpen}
        onClose={() => setIsAddWorkspaceOpen(false)}
      />
    </>
  );
}

interface StatCardProps {
  icon: ReactNode;
  iconBg: string;
  title: string;
  value: string | undefined;
  subtitle?: string;
  trend?: number;
}

function StatCard({
  icon,
  iconBg,
  title,
  value,
  trend,
  subtitle,
}: StatCardProps) {
  return (
    <div className="bg-fill-1 border border-border rounded-xl p-5 flex flex-col hover:border-border-md transition-colors">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            iconBg,
          )}
        >
          {icon}
        </div>
        <span className="text-xs font-semibold text-fg-muted">{title}</span>
      </div>
      <div className="mt-auto">
        <div className="text-2xl font-black text-fg">{value || "0"}</div>
        {trend ? (
          <div className="flex items-center gap-1 mt-1 text-[11px] font-medium text-fg-muted">
            <span className="flex items-center text-success bg-success-dim px-1 rounded-sm">
              <ArrowUp size={10} className="mr-0.5" /> {trend}
            </span>
            <span>this month</span>
          </div>
        ) : (
          <div className="mt-1 text-[11px] font-medium text-fg-muted">
            {subtitle || "Total"}
          </div>
        )}
      </div>
    </div>
  );
}
