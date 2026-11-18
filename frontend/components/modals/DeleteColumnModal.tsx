"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import {
  useClearColumncards,
  useDeleteColumn,
  useGetColumn,
  useMoveColumnCards,
} from "@/hooks/useColumns";
import { cn } from "@/lib/utils";
import { useBoardStore } from "@/store/board.store";
import { BoardColumn } from "@/types/board.types";
import { ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type DeleteColumnAction = "move" | "delete";

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: BoardColumn;
}

export default function DeleteColumnModal({
  isOpen,
  onClose,
  column,
}: DeleteColumnModalProps) {
  const [action, setAction] = useState<DeleteColumnAction>("move");
  const [targetColumnId, setTargetColumnId] = useState<string>("");

  const board = useBoardStore((s) => s.board);
  const { mutateAsync: moveCards, isPending: isMovingCards } =
    useMoveColumnCards();
  const { mutateAsync: deleteColumn, isPending: isDeletingCol } =
    useDeleteColumn();
  const { mutateAsync: clearCards, isPending: isDeletingCards } =
    useClearColumncards();
  const { data: apiColumn } = useGetColumn(column.id);

  const availableColumns = board?.columns.filter(
    (c) => c.id !== column?.id,
  ) as BoardColumn[];

  const resolvedTargetId =
    targetColumnId || availableColumns?.[0]?.id || "";

  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setAction("move"), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleConfirm = async () => {
    try {
      if (action === "move") {
        await moveCards({ columnId: column.id, targetColumnId: resolvedTargetId });
      } else if (action === "delete") {
        await clearCards(column.id);
      }

      await deleteColumn(column.id);

      toast.success(
        action === "move"
          ? "Cards moved and column deleted"
          : "Column and all cards deleted",
      );

      onClose();
    } catch {
      toast.error("Failed to perform this action. Please try again.");
    }
  };

  const isBusy = isDeletingCards || isDeletingCol || isMovingCards;

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Delete column"
      description="Choose what happens to the cards in this column before deleting."
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isBusy}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={
              isBusy || (action === "move" && availableColumns.length === 0)
            }
            className="flex h-10 items-center gap-2 rounded-lg border border-danger bg-danger-dim px-4 text-sm font-semibold text-danger transition-colors hover:bg-danger/25 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
          >
            {isDeletingCol ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete column"
            )}
          </button>
        </>
      }
    >
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-3.5">
        <div className="flex flex-col">
          <span className="text-[13px] font-semibold text-fg">
            {column.name}
          </span>
          <span className="text-[12px] font-medium text-fg-muted">
            {apiColumn?.cardCount}{" "}
            {apiColumn?.cardCount === 1 ? "card" : "cards"} inside
          </span>
        </div>
      </div>

      <div className="mb-5 space-y-2">
        <span className="text-[12px] font-semibold text-fg-muted">
          What should happen to the cards?
        </span>

        <button
          type="button"
          onClick={() => setAction("move")}
          aria-pressed={action === "move"}
          className={cn(
            "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
            action === "move"
              ? "border-border-lg bg-fill-2"
              : "border-border bg-transparent hover:bg-fill-1",
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
              action === "move" ? "border-accent" : "border-border-lg",
            )}
          >
            {action === "move" && (
              <div className="size-2 rounded-full bg-accent" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="mb-0.5 text-[14px] font-semibold text-fg">
              Move cards to another column
            </span>
            <span className="text-[13px] text-fg-muted">
              Cards will be preserved and moved to your chosen column.
            </span>
          </div>
        </button>

        <button
          type="button"
          onClick={() => setAction("delete")}
          aria-pressed={action === "delete"}
          className={cn(
            "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
            action === "delete"
              ? "border-danger bg-danger-dim"
              : "border-border bg-transparent hover:bg-fill-1",
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
              action === "delete" ? "border-danger" : "border-border-lg",
            )}
          >
            {action === "delete" && (
              <div className="size-2 rounded-full bg-danger" />
            )}
          </div>
          <div className="flex flex-col">
            <span
              className={cn(
                "mb-0.5 text-[14px] font-semibold",
                action === "delete" ? "text-danger" : "text-fg",
              )}
            >
              Delete all cards
            </span>
            <span className="text-[13px] text-fg-muted">
              All {apiColumn?.cardCount} cards and their data will be
              permanently deleted.
            </span>
          </div>
        </button>
      </div>

      {action === "move" && availableColumns.length > 0 && (
        <div className="space-y-2">
          <label
            htmlFor="delete-column-target"
            className="text-[12px] font-semibold text-fg-muted"
          >
            Move to
          </label>
          <div className="relative">
            <select
              id="delete-column-target"
              value={resolvedTargetId}
              onChange={(event) => setTargetColumnId(event.target.value)}
              className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border-md bg-fill-1 pr-10 pl-3 text-[13px] font-medium text-fg transition-colors outline-none focus:border-accent"
            >
              {availableColumns.map((columnOption) => (
                <option
                  key={columnOption.id}
                  value={columnOption.id}
                  className="bg-surface"
                >
                  {columnOption.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted"
            />
          </div>
        </div>
      )}

      {action === "move" && availableColumns.length === 0 && (
        <div className="rounded-lg border border-danger bg-danger-dim p-3 text-[12px] font-medium text-danger">
          No other columns available. You must delete the cards or create a new
          column first.
        </div>
      )}
    </DialogShell>
  );
}
