"use client";

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
    <header className="h-14 px-6 flex items-center justify-between border-b border-border shrink-0 bg-base">
      <div className="flex items-center gap-2 text-[13px] font-medium text-fg-muted">
        <span className="hover:text-fg cursor-pointer transition-colors">
          {projectName}
        </span>
        <ChevronRight size={14} className="opacity-50" />
        <span className="hover:text-fg cursor-pointer transition-colors">
          {columnName}
        </span>
        <ChevronRight size={14} className="opacity-50" />
        <span className="text-fg truncate max-w-50">{cardTitle}</span>
      </div>

      <div className="flex items-center gap-1">
        {canDelete && (
          <button
            onClick={onDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-fg-muted hover:text-danger hover:bg-danger-dim rounded-lg transition-colors"
          >
            <Trash2 size={13} /> Delete
          </button>
        )}
        <div className="w-px h-4 bg-fill-3 mx-1" />
        <button
          onClick={onClose}
          className="p-1.5 text-fg-muted hover:text-fg hover:bg-fill-3 rounded-lg transition-colors ml-1"
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
}
