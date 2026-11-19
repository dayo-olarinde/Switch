"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogShell } from "@/components/ui/dialog-shell";
import { BoardCard } from "@/types/board.types";
import { AlertTriangle, ChevronRight, Trash2 } from "lucide-react";
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
    case "high":
      return "danger" as const;
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
          <Button variant="secondary" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={isDeleting}
          >
            Delete card
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-3 rounded-xl border border-border bg-fill-1 p-4">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-danger/40 bg-danger-dim text-danger">
          <Trash2 size={16} aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-body font-semibold text-fg">
            {card.title}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            {card.priority && card.priority !== "none" && (
              <Badge tone={priorityTone(card.priority)}>{card.priority}</Badge>
            )}
            <span className="flex min-w-0 items-center gap-0.5 truncate text-2xs text-fg-muted">
              {projectName}
              <ChevronRight size={12} aria-hidden className="shrink-0" />
              {columnName}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-danger/40 bg-danger-dim p-4">
        <AlertTriangle
          size={16}
          aria-hidden
          className="mt-0.5 shrink-0 text-danger"
        />
        <p className="text-body leading-relaxed text-danger">
          All comments, attachments, and activity on this card will be
          permanently deleted.
        </p>
      </div>
    </DialogShell>
  );
}
