"use client";

import CreateProjectModal from "@/components/modals/CreateProjectModal";
import DeleteWorkspaceModal from "@/components/modals/DeleteWorkspaceModal";
import { Badge } from "@/components/ui/badge";
import { Tabs } from "@/components/ui/tabs";
import { MembersTab } from "@/components/workspace/MembersTab";
import { ProjectsTab } from "@/components/workspace/ProjectsTab";
import { SettingsTab } from "@/components/workspace/SettingsTab";
import { useWorkspaceProjects } from "@/hooks/useProjects";
import { useGetMembers, useWorkspaceRole } from "@/hooks/useWorkspace";
import { useWorkspaceStore } from "@/store/workspace.store";
import { getInitials } from "@/lib/utils";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Suspense, useState } from "react";

type WorkspaceTab = "projects" | "members" | "settings";

function WorkspaceContent() {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const workspaceSlug = params?.workspaceSlug as string;
  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  const { canManageWorkspace, isOwner } = useWorkspaceRole();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const tabParam = (searchParams.get("tab") ?? "projects").toLowerCase();
  const activeTab = (
    ["projects", "members", "settings"].includes(tabParam)
      ? tabParam
      : "projects"
  ) as WorkspaceTab;

  const { data: members = [], isLoading: membersLoading } =
    useGetMembers(workspaceSlug);
  const { data: projects = [], isLoading: projectsLoading } =
    useWorkspaceProjects(activeWorkspace?.slug);

  if (!activeWorkspace) return null;

  const handleTabChange = (tabId: WorkspaceTab) => {
    const next = new URLSearchParams(searchParams.toString());
    next.set("tab", tabId);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const tabs = [
    { value: "projects" as const, label: "Projects", count: projects.length },
    { value: "members" as const, label: "Members", count: members.length },
    ...(canManageWorkspace
      ? [{ value: "settings" as const, label: "Settings" }]
      : []),
  ];

  return (
    <div className="w-full">
      <header className="mb-6 flex flex-wrap items-center gap-3">
        <span
          style={{ backgroundColor: activeWorkspace.colour }}
          className="flex size-10 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-on-accent"
        >
          {getInitials(activeWorkspace.name)}
        </span>

        <div className="min-w-0">
          <h1 className="truncate text-headline font-semibold text-fg">
            {activeWorkspace.name}
          </h1>
          <p className="mt-0.5 text-body text-fg-muted">
            {projects.length} {projects.length === 1 ? "project" : "projects"} ·{" "}
            {members.length} {members.length === 1 ? "member" : "members"}
          </p>
        </div>

        <Badge tone={activeWorkspace.role === "Owner" ? "accent" : "neutral"}>
          {activeWorkspace.role}
        </Badge>
      </header>

      <Tabs
        items={tabs}
        value={activeTab}
        onChange={handleTabChange}
        className="mb-6"
      />

      {activeTab === "projects" && (
        <ProjectsTab
          workspaceSlug={activeWorkspace.slug}
          workspace={activeWorkspace}
          projects={projects}
          projectsLoading={projectsLoading}
          onOpenProjectModal={() => setIsProjectModalOpen(true)}
        />
      )}

      {activeTab === "members" && (
        <MembersTab
          members={members}
          membersLoading={membersLoading}
          activeWorkspace={activeWorkspace}
        />
      )}

      {activeTab === "settings" && canManageWorkspace && (
        <SettingsTab
          activeWorkspace={activeWorkspace}
          isOwner={isOwner}
          onOpenDeleteModal={() => setIsDeleteModalOpen(true)}
        />
      )}

      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
      <DeleteWorkspaceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        workspace={activeWorkspace}
        projectCount={projects.length}
        memberCount={members.length}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="h-32 animate-pulse rounded-xl border border-border bg-surface" />
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
