"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import { CreateCard } from "@/hooks/useCards";
import { WorkspaceMembers } from "@/hooks/useWorkspace";
import { ChevronDown, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { CardAssigneePicker } from "./card-assignee-picker";

export type AddCardFormData = Omit<CreateCard, "status" | "dueDate"> & {
  dueDate: string;
  column: string;
};

export default function AddCardModal({
  isOpen,
  onClose,
  columnName = "In Progress",
  projectName = "Design System",
  workspaceMembers = [],
  membersLoading = false,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  columnName?: string;
  projectName?: string;
  workspaceMembers?: WorkspaceMembers[];
  membersLoading?: boolean;
  onAdd: (data: AddCardFormData) => void | Promise<void>;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium" as AddCardFormData["priority"],
    dueDate: "",
    assignees: [] as string[],
    column: columnName,
  });

  const toggleAssignee = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      assignees: prev.assignees.includes(id)
        ? prev.assignees.filter((a) => a !== id)
        : [...prev.assignees, id],
    }));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onAdd(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Add a card"
      description={`Adding to ${columnName} in ${projectName}`}
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!formData.title.trim() || isSubmitting}
            className="flex h-10 min-w-30 items-center justify-center gap-2 rounded-lg bg-accent-solid px-4 text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus size={14} />
                Add card
              </>
            )}
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="card-title"
            className="flex gap-1 text-xs font-semibold text-fg-muted uppercase"
          >
            Title <span className="text-danger">*</span>
          </label>
          <input
            id="card-title"
            autoFocus
            placeholder="What needs to be done?"
            value={formData.title}
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
            className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="card-description"
            className="text-xs font-semibold text-fg-muted uppercase"
          >
            Description
          </label>
          <textarea
            id="card-description"
            placeholder="Add more context (optional)"
            rows={2}
            value={formData.description}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
            className="w-full resize-none rounded-lg border border-border-md bg-fill-1 p-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label
              htmlFor="card-priority"
              className="text-xs font-semibold text-fg-muted uppercase"
            >
              Priority
            </label>
            <div className="relative">
              <select
                id="card-priority"
                value={formData.priority}
                onChange={(event) =>
                  setFormData({
                    ...formData,
                    priority: event.target
                      .value as AddCardFormData["priority"],
                  })
                }
                className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border-md bg-fill-1 pr-8 pl-3 text-sm text-fg outline-none focus:border-accent"
              >
                <option value="none">None</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="card-due-date"
              className="text-xs font-semibold text-fg-muted uppercase"
            >
              Due date
            </label>
            <input
              id="card-due-date"
              type="date"
              value={formData.dueDate}
              onChange={(event) =>
                setFormData({ ...formData, dueDate: event.target.value })
              }
              className="h-10 w-full rounded-lg border border-border-md bg-fill-1 px-3 text-sm text-fg outline-none focus:border-accent"
            />
          </div>
        </div>

        <CardAssigneePicker
          members={workspaceMembers}
          selected={formData.assignees}
          loading={membersLoading}
          onToggle={toggleAssignee}
        />
      </div>
    </DialogShell>
  );
}
