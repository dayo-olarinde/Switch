"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { TextArea, TextInput } from "@/components/ui/field";
import { Project, useCreateProject, useUpdateProject } from "@/hooks/useProjects";
import { projectSchema, ProjectValues } from "@/lib/schemas/project";
import { useWorkspaceStore } from "@/store/workspace.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
  const [showIconPicker, setShowIconPicker] = useState(false);

  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);

  const { mutate: createProject, isPending: creatingProject } =
    useCreateProject();
  const { mutate: updateProject, isPending: updatingProject } =
    useUpdateProject();

  const isPending = creatingProject || updatingProject;

  const form = useForm<ProjectValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      icon: project?.icon ?? "Palette",
    },
    values: {
      name: project?.name ?? "",
      description: project?.description ?? "",
      icon: project?.icon ?? "Palette",
    },
  });

  const name = useWatch({ control: form.control, name: "name" });
  const icon = useWatch({ control: form.control, name: "icon" });

  const handleCloseModal = () => {
    onClose();
    setShowIconPicker(false);
  };

  const onSubmit = form.handleSubmit((values) => {
    if (!activeWorkspace) return;

    if (project) {
      updateProject(
        {
          projectSlug: project.slug,
          data: {
            ...values,
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
          ...values,
          workspaceId: activeWorkspace.id,
          workspaceSlug: activeWorkspace.slug,
        },
        { onSuccess: () => handleCloseModal() },
      );
    }
  });

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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="project-form"
            loading={isPending}
            disabled={!name.trim()}
            icon={
              project ? (
                <Check size={14} aria-hidden />
              ) : (
                <Plus size={14} aria-hidden />
              )
            }
            className="min-w-36"
          >
            {project ? "Save changes" : "Create project"}
          </Button>
        </>
      }
    >
      <form id="project-form" onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-start gap-4">
          <ProjectIconPicker
            value={icon}
            onChange={(next) => {
              form.setValue("icon", next, { shouldValidate: true });
              setShowIconPicker(false);
            }}
            open={showIconPicker}
            onToggle={() => setShowIconPicker((prev) => !prev)}
          />

          <TextInput
            id="project-name"
            label="Project name"
            required
            placeholder="e.g. Design System"
            autoFocus
            wrapperClassName="flex-1"
            error={form.formState.errors.name?.message}
            {...form.register("name")}
          />
        </div>

        <TextArea
          id="project-description"
          label="Description"
          rows={3}
          placeholder="What is this project about?"
          error={form.formState.errors.description?.message}
          {...form.register("description")}
        />
      </form>
    </DialogShell>
  );
}
