"use client";

import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import { Button } from "@/components/ui/button";
import { Card, PageHeader, SectionHeader, Stat } from "@/components/ui/page";
import EmptyWorkspaceState from "@/components/workspace/EmptyWorkspace";
import { WorkspaceCard } from "@/components/workspace/WorkspaceCard";
import { useMe, useTeammates } from "@/hooks/useAuth";
import { useOpenCards } from "@/hooks/useCards";
import { useActiveProjectsCount } from "@/hooks/useProjects";
import { useGetWorkspaces, Workspace } from "@/hooks/useWorkspace";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  ArrowRight,
  FolderKanban,
  LayoutGrid,
  ListTodo,
  Plus,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

function greetingFor(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function DashboardSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-7 space-y-2">
        <div className="h-7 w-56 rounded-md bg-fill-2" />
        <div className="h-3.5 w-72 rounded bg-fill-1" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-25 rounded-xl border border-border bg-surface"
          />
        ))}
      </div>

      <div className="mb-3 h-4 w-32 rounded bg-fill-1" />
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-38 rounded-xl border border-border bg-surface"
          />
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);

  const { data: user } = useMe();
  const { data: cards } = useOpenCards();
  const { data: teammates } = useTeammates();
  const { data: projects, isLoading: countLoading } = useActiveProjectsCount();
  const { data: workspaces = [], isFetched } = useGetWorkspaces();

  const handleRedirectWorkspace = (ws: Workspace) => {
    setActiveWorkspace(ws);
    router.push(`/${ws.slug}`);
  };

  if (!isFetched || countLoading) return <DashboardSkeleton />;

  if (workspaces.length === 0) {
    return (
      <>
        <EmptyWorkspaceState
          onCreateWorkspace={() => setIsAddWorkspaceOpen(true)}
        />
        <CreateWorkspaceModal
          isOpen={isAddWorkspaceOpen}
          onClose={() => setIsAddWorkspaceOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="w-full">
        <PageHeader
          title={`${greetingFor(new Date().getHours())}, ${user?.firstName || "there"}`}
          description="Here's what's happening across your workspaces."
        />

        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="Workspaces"
            value={workspaces.length}
            icon={<LayoutGrid size={13} className="text-accent" />}
            hint="You're a member of"
          />
          <Stat
            label="Active projects"
            value={projects?.count}
            icon={<FolderKanban size={13} className="text-success" />}
            hint="Across all workspaces"
          />
          <Stat
            label="Open cards"
            value={cards?.count}
            icon={<ListTodo size={13} className="text-warning" />}
            hint="Not yet completed"
          />
          <Stat
            label="Teammates"
            value={teammates?.count}
            icon={<Users size={13} className="text-info" />}
            hint="Across workspaces"
          />
        </div>

        <section>
          <SectionHeader
            title="Your workspaces"
            count={workspaces.length}
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsAddWorkspaceOpen(true)}
              >
                <Plus size={14} />
                New workspace
              </Button>
            }
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {workspaces.map((ws) => (
              <WorkspaceCard
                key={ws.id}
                ws={ws}
                handleRedirectWorkspace={() => handleRedirectWorkspace(ws)}
              />
            ))}

            <button
              type="button"
              onClick={() => setIsAddWorkspaceOpen(true)}
              className="group flex min-h-38 flex-col items-center justify-center rounded-xl border border-dashed border-border-md bg-fill-1 p-4 transition-colors hover:border-accent/50 hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
            >
              <span className="mb-2 flex size-8 items-center justify-center rounded-lg bg-fill-2 text-fg-muted transition-colors group-hover:text-accent">
                <Plus size={16} />
              </span>
              <span className="text-body font-medium text-fg-muted transition-colors group-hover:text-fg">
                Create workspace
              </span>
            </button>
          </div>
        </section>

        <Card className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-body font-semibold text-fg">
              Jump into a project
            </p>
            <p className="mt-1 text-body text-fg-muted">
              Open a workspace to pick a board, or search across everything.
            </p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() =>
              window.dispatchEvent(new Event("open-search"))
            }
          >
            Search everything
            <ArrowRight size={14} />
          </Button>
        </Card>
      </div>

      <CreateWorkspaceModal
        isOpen={isAddWorkspaceOpen}
        onClose={() => setIsAddWorkspaceOpen(false)}
      />
    </>
  );
}
