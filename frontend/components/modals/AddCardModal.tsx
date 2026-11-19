"use client";

import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { Select, TextArea, TextInput } from "@/components/ui/field";
import { CreateCard } from "@/hooks/useCards";
import { WorkspaceMembers } from "@/hooks/useWorkspace";
import { PRIORITY_META } from "@/components/board/board-utils";
import { useState } from "react";
import { CardAssigneePicker } from "./card-assignee-picker";

export type AddCardFormData = Omit<CreateCard, "status" | "dueDate"> & {
  dueDate: string;
  column: string;
};

const PRIORITIES = ["none", "low", "medium", "high", "urgent"] as const;

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
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isSubmitting}
            disabled={!formData.title.trim()}
          >
            Add card
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <TextInput
          id="card-title"
          label="Title"
          required
          autoFocus
          placeholder="What needs to be done?"
          value={formData.title}
          onChange={(event) =>
            setFormData({ ...formData, title: event.target.value })
          }
        />

        <TextArea
          id="card-description"
          label="Description"
          rows={2}
          placeholder="Add more context (optional)"
          value={formData.description}
          onChange={(event) =>
            setFormData({ ...formData, description: event.target.value })
          }
        />

        <div className="grid grid-cols-2 gap-3">
          <Select
            id="card-priority"
            label="Priority"
            value={formData.priority}
            onChange={(event) =>
              setFormData({
                ...formData,
                priority: event.target.value as AddCardFormData["priority"],
              })
            }
          >
            {PRIORITIES.map((value) => (
              <option key={value} value={value}>
                {PRIORITY_META[value].label}
              </option>
            ))}
          </Select>

          <TextInput
            id="card-due-date"
            label="Due date"
            type="date"
            value={formData.dueDate}
            onChange={(event) =>
              setFormData({ ...formData, dueDate: event.target.value })
            }
          />
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
