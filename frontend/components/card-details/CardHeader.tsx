"use client";

import { Button } from "@/components/ui/button";
import { ChevronRight, Trash2, X } from "lucide-react";

interface CardHeaderProps {
  projectName: string;
  columnName: string;
  cardTitle: string;
  canDelete: boolean;
  onDelete: () => void;
  onClose: () => void;
}

export function CardHeader({
  projectName,
  columnName,
  cardTitle,
  canDelete,
  onDelete,
  onClose,
}: CardHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-base px-4">
      <nav
        aria-label="Card location"
        className="flex min-w-0 items-center gap-1.5 text-body text-fg-muted"
      >
        <span className="truncate">{projectName}</span>
        <ChevronRight size={13} aria-hidden className="shrink-0 opacity-60" />
        <span className="truncate">{columnName}</span>
        <ChevronRight size={13} aria-hidden className="shrink-0 opacity-60" />
        <span className="truncate font-medium text-fg">{cardTitle}</span>
      </nav>

      <div className="ml-auto flex shrink-0 items-center gap-1">
        {canDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            icon={<Trash2 size={13} aria-hidden />}
            className="text-fg-muted hover:bg-danger-dim hover:text-danger"
          >
            Delete
          </Button>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          aria-label="Close card"
          icon={<X size={16} aria-hidden />}
          className="size-8 px-0 text-fg-muted"
        />
      </div>
    </header>
  );
}
