"use client";

import { Badge } from "@/components/ui/badge";
import { AvatarGroup } from "@/components/ui/avatar";
import { Project, useDeleteProject } from "@/hooks/useProjects";
import { useWorkspaceRole, Workspace } from "@/hooks/useWorkspace";
import { getConsistentColor } from "@/lib/utils";
import { Edit2, Layout, Palette, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CreateProjectModal, {
  PROJECT_ICON_MAP,
} from "../modals/CreateProjectModal";
import DeleteProjectModal from "../modals/DeleteProjectModal";
import { ProjectsSkeleton } from "../skeletons/ProjectsTab";
import EmptyProjectState from "./EmptyProjects";

interface ProjectsTab {
  workspaceSlug: string;
  workspace: Workspace;
  projects: Project[];
  projectsLoading: boolean;
  onOpenProjectModal: () => void;
}

export const ProjectsTab = ({
  workspaceSlug,
  projects,
  projectsLoading,
  onOpenProjectModal,
}: ProjectsTab) => {
  const { canManageWorkspace, isOwner } = useWorkspaceRole();

  if (projectsLoading) return <ProjectsSkeleton />;

  if (projects.length === 0) {
    return (
      <div className="pt-4">
        <EmptyProjectState onCreateProject={onOpenProjectModal} />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          isOwner={isOwner}
          canManageWorkspace={canManageWorkspace}
          activeWorkspaceSlug={workspaceSlug}
          colorHash={getConsistentColor(project.id)}
        />
      ))}

      {canManageWorkspace && (
        <button
          type="button"
          onClick={onOpenProjectModal}
          className="group flex min-h-46 flex-col items-center justify-center rounded-xl border border-dashed border-border-md bg-fill-1 p-4 transition-colors hover:border-accent/50 hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <span className="mb-2 flex size-8 items-center justify-center rounded-lg bg-fill-2 text-fg-muted transition-colors group-hover:text-accent">
            <Plus size={16} />
          </span>
          <span className="text-body font-medium text-fg-muted transition-colors group-hover:text-fg">
            Create project
          </span>
        </button>
      )}
    </div>
  );
};

interface ProjectCardProps {
  project: Project;
  isOwner: boolean;
  canManageWorkspace: boolean;
  activeWorkspaceSlug: string;
  colorHash: string;
}

export const ProjectCard = ({
  project,
  isOwner,
  canManageWorkspace,
  activeWorkspaceSlug,
  colorHash,
}: ProjectCardProps) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate: deleteProject, isPending } = useDeleteProject();

  const Icon = PROJECT_ICON_MAP[project.icon] || Palette;
  const progressPercent =
    project.cardsCount > 0
      ? Math.round((project.finishedCards / project.cardsCount) * 100)
      : 0;

  const handleDelete = () => {
    if (!project.id) return;
    deleteProject({
      workspaceSlug: activeWorkspaceSlug,
      projectSlug: project.slug,
    });
  };

  return (
    <div
      onClick={() => router.push(`/${activeWorkspaceSlug}/${project.slug}`)}
      className="group/card flex min-h-46 cursor-pointer flex-col rounded-xl border border-border bg-surface p-4 transition-all hover:border-border-md card-elevated hover:card-elevated-hover"
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent-dim text-accent">
          <Icon size={17} />
        </span>

        <div className="flex shrink-0 items-center gap-1">
          <Badge tone={project.status === "Active" ? "success" : "neutral"}>
            {project.status || "Active"}
          </Badge>

          {canManageWorkspace && (
            <div className="flex items-center opacity-0 transition-opacity group-hover/card:opacity-100 focus-within:opacity-100">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setIsEditModalOpen(true);
                }}
                aria-label={`Edit ${project.name}`}
                className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-fill-2 hover:text-fg"
              >
                <Edit2 size={14} />
              </button>

              {isOwner && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsDeleteModalOpen(true);
                  }}
                  aria-label={`Delete ${project.name}`}
                  className="rounded-md p-1.5 text-fg-muted transition-colors hover:bg-danger-dim hover:text-danger"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <h3 className="truncate text-body font-semibold text-fg">
        {project.name}
      </h3>
      <p className="mt-1 line-clamp-2 text-body leading-relaxed text-fg-muted">
        {project.description || "No description provided."}
      </p>

      <div className="mt-auto pt-4">
        <div className="h-1 w-full overflow-hidden rounded-full bg-fill-2">
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: colorHash || undefined,
            }}
          />
        </div>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="text-2xs font-medium text-fg-muted">
            {progressPercent}% · {project.finishedCards}/{project.cardsCount} done
          </span>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-2xs font-medium text-fg-muted">
              <Layout size={12} />
              {project.cardsCount}
            </span>

            <AvatarGroup
              size="sm"
              users={(project.assignees ?? []).map((assignee, index) => ({
                id: `${project.id}-${index}`,
                firstName: assignee.firstName || "U",
                lastName: null,
                avatarUrl: assignee.avatarUrl,
              }))}
            />
          </div>
        </div>
      </div>

      {canManageWorkspace && (
        <>
          <CreateProjectModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            project={project}
          />
          <DeleteProjectModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            project={project}
            onDelete={handleDelete}
            isDeleting={isPending}
          />
        </>
      )}
    </div>
  );
};
