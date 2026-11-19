"use client";

import { cn } from "@/lib/utils";
import { BoardColumn } from "@/types/board.types";
import { DraggableAttributes, DraggableSyntheticListeners } from "@dnd-kit/core";
import { Eraser, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { RefObject } from "react";
import { columnDotClass } from "./board-utils";

interface ColumnHeaderProps {
  column: BoardColumn;
  canManageWorkspace: boolean;
  isRenaming: boolean;
  draftName: string;
  isMenuOpen: boolean;
  pendingDelete: boolean;
  menuRef: RefObject<HTMLDivElement | null>;
  dragAttributes: DraggableAttributes;
  dragListeners?: DraggableSyntheticListeners;
  onDraftNameChange: (value: string) => void;
  onRenameCommit: () => void;
  onRenameCancel: () => void;
  onToggleMenu: () => void;
  onStartRename: () => void;
  onClear: () => void;
  onDelete: () => void;
}

export function ColumnHeader({
  column,
  canManageWorkspace,
  isRenaming,
  draftName,
  isMenuOpen,
  pendingDelete,
  menuRef,
  dragAttributes,
  dragListeners,
  onDraftNameChange,
  onRenameCommit,
  onRenameCancel,
  onToggleMenu,
  onStartRename,
  onClear,
  onDelete,
}: ColumnHeaderProps) {
  return (
    <header
      {...dragAttributes}
      {...dragListeners}
      className="group/lane flex h-11 shrink-0 cursor-grab items-center gap-2 border-b border-border px-3 active:cursor-grabbing"
    >
      <span
        aria-hidden
        className={cn(
          "size-2 shrink-0 rounded-full",
          columnDotClass(column.mappedStatus, column.name),
        )}
      />

      {isRenaming ? (
        <input
          autoFocus
          value={draftName}
          onChange={(event) => onDraftNameChange(event.target.value)}
          onBlur={onRenameCommit}
          onPointerDown={(event) => event.stopPropagation()}
          onKeyDown={(event) => {
            event.stopPropagation();
            if (event.key === "Enter") onRenameCommit();
            if (event.key === "Escape") onRenameCancel();
          }}
          aria-label="Column name"
          className="h-7 min-w-0 flex-1 rounded-md border border-accent bg-fill-1 px-2 text-body font-semibold text-fg outline-none"
        />
      ) : (
        <h2 className="min-w-0 flex-1 truncate text-body font-semibold text-fg">
          {column.name}
        </h2>
      )}

      <span className="shrink-0 rounded-md bg-fill-2 px-1.5 py-0.5 text-2xs font-semibold text-fg-muted tabular-nums">
        {column.cards.length}
      </span>

      <div className="relative shrink-0" ref={menuRef}>
        <button
          type="button"
          aria-label={`${column.name} column actions`}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          onClick={onToggleMenu}
          onPointerDown={(event) => event.stopPropagation()}
          className="flex size-7 items-center justify-center rounded-md text-fg-muted opacity-0 transition-opacity hover:bg-fill-2 hover:text-fg focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none data-[open=true]:opacity-100 group-hover/lane:opacity-100"
          data-open={isMenuOpen}
        >
          <MoreHorizontal size={15} />
        </button>

        {isMenuOpen && (
          <div
            role="menu"
            onPointerDown={(event) => event.stopPropagation()}
            className="absolute top-full right-0 z-30 mt-1 w-52 overflow-hidden rounded-lg border border-border bg-overlay py-1 shadow-soft animate-in fade-in zoom-in-95 duration-100"
          >
            <button
              type="button"
              role="menuitem"
              onClick={onStartRename}
              className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-body font-medium text-fg-secondary transition-colors hover:bg-fill-2 hover:text-fg"
            >
              <Pencil size={14} className="text-fg-muted" aria-hidden />
              Rename column
            </button>

            {canManageWorkspace && (
              <>
                <button
                  type="button"
                  role="menuitem"
                  onClick={onClear}
                  disabled={column.cards.length === 0}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-body font-medium text-fg-secondary transition-colors hover:bg-fill-2 hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <Eraser size={14} className="text-fg-muted" aria-hidden />
                  Clear cards
                </button>
                <div className="mx-2 my-1 h-px bg-border" />
                <button
                  type="button"
                  role="menuitem"
                  onClick={onDelete}
                  disabled={pendingDelete}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-body font-medium text-danger transition-colors hover:bg-danger-dim disabled:opacity-50"
                >
                  <Trash2 size={14} aria-hidden />
                  Delete column
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
