"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { controlClasses, FieldLabel, TextInput } from "@/components/ui/field";
import { useCreateWorkspace } from "@/hooks/useWorkspace";
import { workspaceSchema, WorkspaceValues } from "@/lib/schemas/workspace";
import { cn, getInitials, slugify } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

const AVATAR_COLORS = [
  "#F472B6",
  "#8B5CF6",
  "#34D399",
  "#FBBF24",
  "#FB7185",
  "#60A5FA",
  "#A78BFA",
  "#F43F5E",
];

export default function CreateWorkspaceModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [slugLocked, setSlugLocked] = useState(false);

  const { mutate: createWorkspace, isPending } = useCreateWorkspace();

  const form = useForm<WorkspaceValues>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: { name: "", slug: "", colour: AVATAR_COLORS[0] },
  });

  const name = useWatch({ control: form.control, name: "name" });
  const slug = useWatch({ control: form.control, name: "slug" });
  const selectedColor = useWatch({ control: form.control, name: "colour" });

  const handleClose = () => {
    onClose();
    form.reset();
    setSlugLocked(false);
  };

  const onSubmit = form.handleSubmit((values) => {
    createWorkspace(values, { onSuccess: () => handleClose() });
  });

  return (
    <DialogShell
      open={isOpen}
      onClose={handleClose}
      title="Create a workspace"
      description="A workspace holds all your projects and brings your team together."
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-workspace-form"
            loading={isPending}
            disabled={!name.trim() || slug.length === 0}
            icon={<Plus size={15} aria-hidden />}
            className="min-w-40"
          >
            Create workspace
          </Button>
        </>
      }
    >
      <form id="create-workspace-form" onSubmit={onSubmit} className="space-y-4">
        <TextInput
          id="workspace-name"
          label="Workspace name"
          required
          placeholder="e.g. Acme Corp"
          autoFocus
          error={form.formState.errors.name?.message}
          {...form.register("name", {
            onChange: (event) => {
              if (!slugLocked) {
                form.setValue("slug", slugify(event.target.value), {
                  shouldValidate: true,
                });
              }
            },
          })}
        />

        <div className="flex flex-col gap-1.5">
          <FieldLabel htmlFor="workspace-slug" required>
            URL slug
          </FieldLabel>
          <div
            className={cn(
              "flex h-10 items-center overflow-hidden focus-within:border-accent",
              controlClasses,
            )}
          >
            <span className="flex h-full select-none items-center border-r border-border-md px-3 text-fg-muted">
              switch.app/
            </span>
            <input
              id="workspace-slug"
              placeholder="your-workspace"
              className="h-full flex-1 bg-transparent px-3 outline-none placeholder:text-fg-muted"
              {...form.register("slug", {
                onChange: () => setSlugLocked(true),
              })}
            />
          </div>
          {form.formState.errors.slug ? (
            <p role="alert" className="text-2xs text-danger">
              {form.formState.errors.slug.message}
            </p>
          ) : (
            <p className="text-2xs text-fg-muted">
              Only lowercase letters, numbers, and hyphens.
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 pt-1">
          <FieldLabel>Avatar color</FieldLabel>
          <div className="flex items-center gap-3">
            <div
              className="flex size-12 items-center justify-center rounded-xl text-lg font-semibold text-on-accent"
              style={{ backgroundColor: selectedColor }}
            >
              {getInitials(name)}
            </div>

            <div
              role="radiogroup"
              aria-label="Avatar color"
              className="flex gap-2"
            >
              {AVATAR_COLORS.map((color) => {
                const active = selectedColor === color;

                return (
                  <button
                    key={color}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    aria-label={`Use color ${color}`}
                    onClick={() =>
                      form.setValue("colour", color, { shouldValidate: true })
                    }
                    style={{ backgroundColor: color }}
                    className={cn(
                      "size-6 rounded-md transition-transform focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none",
                      active
                        ? "scale-110 ring-2 ring-fg ring-offset-2 ring-offset-surface"
                        : "opacity-80 hover:scale-105 hover:opacity-100",
                    )}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </form>
    </DialogShell>
  );
}
