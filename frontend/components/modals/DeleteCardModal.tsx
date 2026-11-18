"use client";

import { Badge } from "@/components/ui/badge";
import { DialogShell } from "@/components/ui/dialog-shell";
import { BoardCard } from "@/types/board.types";
import { AlertTriangle, ChevronRight, Loader2, Trash2 } from "lucide-react";
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

function priorityTone(priority: string) {
  switch (priority?.toLowerCase()) {
    case "urgent":
      return "danger" as const;
    case "high":
      return "accent" as const;
    case "medium":
      return "warning" as const;
    case "low":
      return "success" as const;
    default:
      return "neutral" as const;
  }
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

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirm();
      onClose();
    } catch (error) {
      toast.error("Failed to delete card", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DialogShell
      open={isOpen}
      onClose={isDeleting ? () => {} : onClose}
      title="Delete card"
      description="This card and all its data will be permanently removed."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex h-10 items-center gap-2 rounded-lg border border-danger bg-danger-dim px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger/25 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
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
        </>
      }
    >
      <div className="flex items-start gap-3 rounded-xl border border-border bg-fill-1 p-4">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-danger bg-danger-dim text-danger">
          <Trash2 size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-fg">
            {card.title}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            {card.priority && (
              <Badge tone={priorityTone(card.priority)}>{card.priority}</Badge>
            )}
            <span className="flex items-center gap-0.5 truncate text-[12px] text-fg-muted">
              {projectName} <ChevronRight size={14} /> {columnName}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger bg-danger-dim p-4">
        <AlertTriangle size={16} className="mt-0.5 shrink-0 text-danger" />
        <p className="text-[13px] leading-relaxed text-danger">
          All comments, attachments, and activity on this card will be
          permanently deleted.
        </p>
      </div>
    </DialogShell>
  );
}
