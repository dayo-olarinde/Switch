"use client";

import { Portal } from "@/components/ui/Portal";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { PROJECT_ICON_MAP } from "./CreateProjectModal";
import { cn } from "@/lib/utils";
import { Project } from "@/hooks/useProjects";

interface DeleteProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onDelete: (projectId: string) => void;
  isDeleting?: boolean;
}

export default function DeleteProjectModal({
  isOpen,
  onClose,
  project,
  onDelete,
  isDeleting,
}: DeleteProjectModalProps) {
  const [confirmText, setConfirmText] = useState("");
  const Icon = PROJECT_ICON_MAP[project.icon] || Trash2;

  if (!isOpen) return null;

  const isConfirmed = confirmText === project.name;

  return (
    <Portal>
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center bg-scrim backdrop-blur-sm px-4 animate-in fade-in duration-200"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-110 bg-base border border-border rounded-2xl shadow-2xl relative flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-fg-muted hover:text-fg transition-colors"
          >
            <X size={18} />
          </button>

          <div className="p-6">
            <div className="w-10 h-10 bg-danger-dim border border-danger rounded-xl flex items-center justify-center mb-4 shadow-sm">
              <Trash2 size={18} className="text-danger" />
            </div>

            <div className="mb-6">
              <h1 className="text-xl font-bold text-fg mb-1 tracking-tight">
                Delete project
              </h1>
              <p className="text-[13px] text-fg-muted leading-relaxed">
                This will permanently delete the project and all its data.
              </p>
            </div>

            <div className="bg-fill-1 border border-border rounded-xl p-4 flex items-center gap-4 mb-4">
              <div className="w-10 h-10 rounded-lg bg-base flex items-center justify-center text-xl">
                <Icon size={20} className="text-fg-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-fg">
                  {project.name}
                </span>
                <span className="text-[11px] text-fg-muted uppercase tracking-wider font-bold">
                  {project.cardsCount || 0} cards ·{" "}
                  {(project.assignees && project.assignees.length) || 0} members
                </span>
              </div>
            </div>

            <div className="bg-danger-dim border border-danger rounded-xl p-4 flex gap-3 mb-6">
              <AlertTriangle
                size={18}
                className="text-danger shrink-0 mt-0.5"
              />
              <div className="flex flex-col gap-1">
                <span className="text-[13px] font-bold text-danger">
                  All data will be lost
                </span>
                <p className="text-[12px] text-danger leading-relaxed">
                  All cards, comments, attachments, and activity will be
                  permanently deleted. This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[12px] text-fg-muted">
                Type{" "}
                <span className="text-danger font-mono bg-danger-dim px-1.5 py-0.5 rounded">
                  {project.name}
                </span>{" "}
                to confirm deletion.
              </p>
              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder={project.name}
                autoFocus
                className="w-full bg-fill-1 border border-border focus:border-danger rounded-xl px-4 py-3 text-sm text-fg placeholder-white/10 outline-none transition-all"
              />
            </div>
          </div>

          <div className="px-6 py-4 bg-base border-t border-border flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-[13px] font-semibold text-fg-muted hover:text-fg transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={!isConfirmed || isDeleting}
              onClick={() => onDelete(project.id)}
              className={cn(
                "px-5 py-2 rounded-xl text-[13px] font-bold transition-all flex items-center gap-2",
                isConfirmed && !isDeleting
                  ? "bg-danger-dim text-fg hover:bg-danger-dim shadow-[0_0_15px_rgba(244,63,94,0.2)]"
                  : "bg-fill-2 text-fg-muted cursor-not-allowed",
              )}
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete project"
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
