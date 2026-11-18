"use client";

import { Portal } from "@/components/ui/Portal";
import { CreateCard } from "@/hooks/useCards";
import { WorkspaceMembers } from "@/hooks/useWorkspace";
import { cn } from "@/lib/utils";
import { ChevronDown, Loader2, Plus, X } from "lucide-react";
import { useState } from "react";

export type AddCardFormData = Omit<CreateCard, "status" | "dueDate"> & {
  dueDate: string;
  column: string;
};

function getInitials(member: WorkspaceMembers) {
  const first = member.firstName?.[0] ?? "";
  const last = member.lastName?.[0] ?? "";
  return (
    `${first}${last}`.toUpperCase() || member.email?.[0]?.toUpperCase() || "?"
  );
}

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

  if (!isOpen) return null;

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
    <Portal>
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center bg-[black]/60 backdrop-blur-sm px-4 animate-in fade-in duration-200"
        onClick={onClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-125 bg-surface border border-border rounded-2xl shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          <div className="p-5 pb-0 flex items-start justify-between">
            <div className="flex flex-col gap-0.5">
              <div className="w-9 h-9 bg-accent-solid/10 border border-accent/20 rounded-lg flex items-center justify-center mb-2">
                <Plus size={18} className="text-accent" />
              </div>
              <h2 className="text-lg font-bold text-fg tracking-tight">
                Add a card
              </h2>
              <div className="text-[12px] font-medium text-fg-muted">
                Adding to:{" "}
                <span className="text-fg-secondary text-[12px]">{columnName}</span>{" "}
                in{" "}
                <span className="text-fg-secondary text-[12px]">{projectName}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-fg-muted hover:text-fg transition-colors mt-1"
            >
              <X size={18} />
            </button>
          </div>

          <div className="p-5 space-y-4 overflow-y-auto max-h-[60vh] custom-scrollbar">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
                Title <span className="text-danger">*</span>
              </label>
              <input
                autoFocus
                placeholder="What needs to be done?"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full bg-fill-1 border border-border focus:border-accent/50 rounded-md px-3.5 py-2.5 text-[13px] text-fg placeholder-white/10 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
                Description
              </label>
              <textarea
                placeholder="Add more context (optional)"
                rows={2}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full bg-fill-1 border border-border focus:border-accent/50 rounded-md px-3.5 py-2.5 text-[13px] text-fg placeholder-white/10 outline-none transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
                  Priority
                </label>
                <div className="relative">
                  <select
                    defaultValue={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as AddCardFormData["priority"],
                      })
                    }
                    className="w-full bg-fill-1 border border-border rounded-md px-3.5 py-2.5 text-[13px] text-fg appearance-none outline-none focus:border-accent/50 scheme-dark [&>option]:bg-base"
                  >
                    <option value="none">None</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-muted pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
                  Due date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) =>
                      setFormData({ ...formData, dueDate: e.target.value })
                    }
                    className="w-full bg-fill-1 border border-border rounded-md px-3.5 py-2.5 text-[13px] text-fg outline-none focus:border-accent/50 scheme-dark"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">
                Assignees
              </label>
              <div className="space-y-0.5">
                {membersLoading ? (
                  <div className="flex items-center justify-center py-5">
                    <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                  </div>
                ) : workspaceMembers.length > 0 ? (
                  workspaceMembers.map((member) => (
                    <div
                      key={member.id}
                      onClick={() => toggleAssignee(member.userId)}
                      className="flex items-center justify-between p-1.5 rounded-md hover:bg-fill-1 cursor-pointer group transition-colors"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {member.avatarUrl ? (
                          <img
                            src={member.avatarUrl}
                            alt={`${member.firstName} ${member.lastName}`}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full object-cover border border-border-md shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-accent-solid/20 border border-border-md flex items-center justify-center text-[9px] font-bold text-accent shrink-0">
                            {getInitials(member)}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="text-[12px] font-medium text-fg truncate">
                            {member.firstName} {member.lastName}
                          </span>
                          <span className="text-[10px] text-fg-muted truncate">
                            {member.email}
                          </span>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "w-4 h-4 rounded border transition-all flex items-center justify-center mr-1 shrink-0",
                          formData.assignees.includes(member.userId)
                            ? "bg-accent-solid border-accent"
                            : "border-border-md bg-transparent group-hover:border-border-lg",
                        )}
                      >
                        {formData.assignees.includes(member.userId) && (
                          <CheckIcon />
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-4 text-center text-[12px] text-fg-muted">
                    No workspace members found.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 bg-surface border-t border-border flex justify-end gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-medium text-fg-muted hover:text-fg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.title.trim() || isSubmitting}
              className="px-5 py-2 bg-accent-solid hover:bg-accent-solid/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-[13px] font-bold text-on-accent flex items-center gap-2 shadow-[0_0_15px_rgba(124,110,245,0.2)] transition-all min-w-30 justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} strokeWidth={3} className="animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus size={14} strokeWidth={3} />
                  Add card
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 3L4.5 8.5L2 6"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
