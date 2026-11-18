"use client";

import { Portal } from "@/components/ui/Portal";
import { cn } from "@/lib/utils";
import { BoardCard } from "@/types/board.types";
import { AlertTriangle, ChevronRight, Loader2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeleteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  card: BoardCard;
  columnName: string;
  projectName: string;
}

export function DeleteCardModal({
  isOpen,
  onClose,
  onConfirm,
  card,
  columnName,
  projectName,
}: DeleteCardModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error: any) {
      toast.error("Failed to delete card:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const p = priority?.toLowerCase() || "none";
    switch (p) {
      case "urgent":
        return "bg-danger-dim text-danger";
      case "high":
        return "bg-accent-dim text-accent";
      case "medium":
        return "bg-warning-dim text-warning";
      case "low":
        return "bg-success-dim text-success";
      default:
        return "bg-fill-3 text-fg-muted";
    }
  };

  return (
    <Portal>
      <div
        className="fixed inset-0 z-9999 flex items-center justify-center bg-scrim p-4 transition-all animate-in fade-in duration-200"
        onClick={!isDeleting ? onClose : undefined}
      >
        <div
          className="w-full max-w-120 bg-base border border-border rounded-2xl shadow-2xl flex flex-col p-6 animate-in zoom-in-95 duration-200 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="absolute top-5 right-5 p-1.5 text-fg-muted hover:text-fg hover:bg-fill-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>

          <div className="w-12 h-12 rounded-xl bg-danger-dim border border-danger flex items-center justify-center text-danger mb-5 shrink-0">
            <Trash2 size={20} strokeWidth={2.5} />
          </div>

          <h2 className="text-xl font-bold text-fg tracking-tight mb-1.5">
            Delete card
          </h2>
          <p className="text-[13px] text-fg-muted mb-6">
            This card and all its data will be permanently removed.
          </p>

          <div className="bg-fill-1 border border-border rounded-xl p-4 mb-4">
            <h3 className="text-[14px] font-semibold text-fg mb-2 truncate">
              {card.title}
            </h3>
            <div className="flex items-center gap-2">
              {card.priority && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                    getPriorityColor(card.priority),
                  )}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
                  {card.priority}
                </div>
              )}
              <span className="flex items-center text-[12px] font-medium text-fg-muted truncate">
                {projectName} <ChevronRight size={14} /> {columnName}
              </span>
            </div>
          </div>

          <div className="bg-danger-dim border border-danger rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertTriangle
              size={16}
              className="text-danger mt-0.5 shrink-0"
            />
            <p className="text-[13px] leading-relaxed text-danger font-medium">
              All comments, attachments, and activity on this card will be
              permanently deleted.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 mt-auto">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-surface hover:bg-card border border-border-md hover:border-border-lg text-[13px] font-semibold text-fg-secondary rounded-xl transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="px-5 py-2.5 bg-danger-dim hover:bg-danger-dim border border-danger text-[13px] font-bold text-danger rounded-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDeleting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete card"
              )}
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
