"use client";

import CreateProjectModal from "@/components/modals/CreateProjectModal";
import DeleteWorkspaceModal from "@/components/modals/DeleteWorkspaceModal";
import { MembersTab } from "@/components/workspace/MembersTab";
import { ProjectsTab } from "@/components/workspace/ProjectsTab";
import { SettingsTab } from "@/components/workspace/SettingsTab";
import { useWorkspaceProjects } from "@/hooks/useProjects";
import { useGetMembers, useWorkspaceRole } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace.store";
import { LayoutGrid, UserPlus } from "lucide-react";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState, Suspense } from "react";

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

  const tabParam = searchParams.get("tab") || "projects";
  const activeTab =
    tabParam.charAt(0).toUpperCase() + tabParam.slice(1).toLowerCase();

  const { data: members = [], isLoading: membersLoading } =
    useGetMembers(workspaceSlug);
  const { data: projects = [], isLoading: projectsLoading } =
    useWorkspaceProjects(activeWorkspace?.slug);

  if (!activeWorkspace) return null;

  const tabs = [
    { id: "Projects" },
    { id: "Members" },
    ...(canManageWorkspace ? [{ id: "Settings" }] : []),
  ];

  const handleTabChange = (tabId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tabId.toLowerCase());

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="max-w-300 mx-auto w-full animate-in fade-in duration-500">
      <div className="bg-card border border-overlay rounded-xl p-5 mb-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div
            style={{ backgroundColor: activeWorkspace?.colour }}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center text-xl font-black text-fg shrink-0",
            )}
          >
            {activeWorkspace.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-fg tracking-tight">
              {activeWorkspace.name}
            </h1>
            <div className="flex items-center gap-2 text-sm font-medium mt-0.5">
              <span className="text-fg-secondary flex items-center gap-1.5">
                <LayoutGrid size={14} /> {projects?.length || 0} projects
              </span>
              <span className="text-fg-muted">•</span>
              <span className="text-fg-secondary flex items-center gap-1.5">
                <UserPlus size={14} /> {members?.length || 0} member(s)
              </span>
              <span className="text-fg-muted">•</span>
              <span className="text-accent">{activeWorkspace.role}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-overlay mb-6">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "pb-3 text-sm font-semibold transition-all relative flex items-center group",
                isActive ? "text-accent" : "text-fg-secondary hover:text-fg",
              )}
            >
              {tab.id}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-solid rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>

      {activeTab === "Projects" && (
        <ProjectsTab
          workspaceSlug={activeWorkspace.slug}
          workspace={activeWorkspace}
          projects={projects}
          projectsLoading={projectsLoading}
          onOpenProjectModal={() => setIsProjectModalOpen(true)}
        />
      )}

      {activeTab === "Members" && (
        <MembersTab
          members={members}
          membersLoading={membersLoading}
          activeWorkspace={activeWorkspace}
        />
      )}

      {activeTab === "Settings" && canManageWorkspace && (
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
        projectCount={projects?.length || 0}
        memberCount={members?.length || 0}
      />
    </div>
  );
}

export default function WorkspacePage() {
  return (
    <Suspense
      fallback={
        <div className="animate-pulse bg-card h-32 rounded-xl mb-8 border border-overlay" />
      }
    >
      <WorkspaceContent />
    </Suspense>
  );
}
