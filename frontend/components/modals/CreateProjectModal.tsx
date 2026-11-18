"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { Project, useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { useWorkspaceStore } from "@/store/workspace.store";
import { Check, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { ProjectIconPicker } from "./project-icon-picker";

export { PROJECT_ICON_MAP, PROJECT_ICONS } from "./project-icons";

export default function CreateProjectModal({
  isOpen,
  onClose,
  project,
}: {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Palette");
  const [showIconPicker, setShowIconPicker] = useState(false);

  const [prevProjectId, setPrevProjectId] = useState(project?.id);
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);

  if (project?.id !== prevProjectId || isOpen !== prevIsOpen) {
    setPrevProjectId(project?.id);
    setPrevIsOpen(isOpen);

    if (isOpen) {
      setName(project?.name || "");
      setDescription(project?.description || "");
      setIcon(project?.icon || "Palette");
    }
  }

  const { mutate: createProject, isPending: creatingProject } =
    useCreateProject();
  const { mutate: updateProject, isPending: updatingProject } =
    useUpdateProject();

  const isPending = creatingProject || updatingProject;

  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  const handleCloseModal = () => {
    onClose();
    setShowIconPicker(false);
  };

  const handleSubmit = () => {
    if (!name || !activeWorkspace || !icon) return;

    const payload = { name, description, icon };

    if (project) {
      updateProject(
        {
          projectSlug: project.slug,
          data: {
            ...payload,
            projectId: project.id,
            workspaceId: activeWorkspace.id,
            workspaceSlug: activeWorkspace.slug,
          },
        },
        { onSuccess: () => handleCloseModal() },
      );
    } else {
      createProject(
        {
          ...payload,
          workspaceId: activeWorkspace.id,
          workspaceSlug: activeWorkspace.slug,
        },
        { onSuccess: () => handleCloseModal() },
      );
    }
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={handleCloseModal}
      title={project ? "Edit project" : "New project"}
      description={
        project
          ? undefined
          : "Projects contain boards, columns, and cards for your team's work."
      }
      footer={
        <>
          <button
            type="button"
            onClick={handleCloseModal}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || isPending}
            className="flex h-10 min-w-36 items-center justify-center gap-2 rounded-lg bg-accent-solid px-4 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                {project ? "Saving..." : "Creating..."}
              </>
            ) : project ? (
              <>
                <Check size={14} />
                Save changes
              </>
            ) : (
              <>
                <Plus size={14} />
                Create project
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex items-start gap-4">
          <ProjectIconPicker
            value={icon}
            onChange={(next) => {
              setIcon(next);
              setShowIconPicker(false);
            }}
            open={showIconPicker}
            onToggle={() => setShowIconPicker((prev) => !prev)}
          />

          <div className="flex-1">
            <label
              htmlFor="project-name"
              className="mb-1.5 flex gap-1 text-sm font-semibold text-fg"
            >
              Project name <span className="text-danger">*</span>
            </label>
            <input
              id="project-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Design System"
              autoFocus
              className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="project-description"
            className="mb-1.5 flex text-sm font-semibold text-fg"
          >
            Description
          </label>
          <textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder="What is this project about?"
            className="w-full resize-none rounded-lg border border-border-md bg-fill-1 p-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
        </div>
      </div>
    </DialogShell>
  );
}
