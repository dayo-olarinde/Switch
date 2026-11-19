"use client";

import { ConfirmDialog } from "@/components/ui/dialog-shell";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  isDangerous?: boolean;
}

export default function LeaveWorkspaceModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  title,
  description,
  confirmLabel = "Confirm",
  isDangerous = false,
}: ConfirmModalProps) {
  return (
    <ConfirmDialog
      open={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      title={title}
      description={description}
      confirmLabel={confirmLabel}
      tone={isDangerous ? "danger" : "accent"}
    >
      <p className="text-body leading-relaxed text-fg-secondary">{description}</p>
    </ConfirmDialog>
  );
}
