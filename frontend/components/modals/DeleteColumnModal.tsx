"use client";

import { Button } from "@/components/ui/button";
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
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type DeleteColumnAction = "move" | "delete";

interface DeleteColumnModalProps {
  isOpen: boolean;
  onClose: () => void;
  column: BoardColumn;
}

const ACTIONS = [
  {
    value: "move",
    title: "Move cards to another column",
    description: "Cards will be preserved and moved to your chosen column.",
  },
  {
    value: "delete",
    title: "Delete all cards",
    description: "Every card and its data will be permanently deleted.",
  },
] as const;

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
  const cardCount = apiColumn?.cardCount ?? column.cards.length;

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      title="Delete column"
      description="Choose what happens to the cards in this column before deleting."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isBusy}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirm}
            loading={isDeletingCol}
            disabled={
              isBusy || (action === "move" && availableColumns.length === 0)
            }
          >
            Delete column
          </Button>
        </>
      }
    >
      <div className="mb-5 flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-3.5">
        <span className="min-w-0">
          <span className="block truncate text-body font-semibold text-fg">
            {column.name}
          </span>
          <span className="block text-2xs font-medium text-fg-muted">
            {cardCount} {cardCount === 1 ? "card" : "cards"} inside
          </span>
        </span>
      </div>

      <fieldset className="mb-5 space-y-2">
        <legend className="mb-2 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
          What should happen to the cards?
        </legend>

        {ACTIONS.map((option) => {
          const isActive = action === option.value;
          const isDestructive = option.value === "delete";

          return (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={isActive}
              onClick={() => setAction(option.value)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none",
                isActive
                  ? isDestructive
                    ? "border-danger/40 bg-danger-dim"
                    : "border-accent bg-accent-dim"
                  : "border-border bg-transparent hover:bg-fill-1",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border-2",
                  isActive
                    ? isDestructive
                      ? "border-danger"
                      : "border-accent"
                    : "border-border-lg",
                )}
              >
                {isActive && (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      isDestructive ? "bg-danger" : "bg-accent",
                    )}
                  />
                )}
              </span>

              <span className="flex min-w-0 flex-col">
                <span
                  className={cn(
                    "mb-0.5 text-body font-semibold",
                    isActive && isDestructive ? "text-danger" : "text-fg",
                  )}
                >
                  {option.title}
                </span>
                <span className="text-2xs leading-relaxed text-fg-muted">
                  {option.value === "delete"
                    ? `${cardCount} cards and their data will be permanently deleted.`
                    : option.description}
                </span>
              </span>
            </button>
          );
        })}
      </fieldset>

      {action === "move" && availableColumns.length > 0 && (
        <div className="space-y-2">
          <label
            htmlFor="delete-column-target"
            className="text-2xs font-semibold tracking-wider text-fg-muted uppercase"
          >
            Move to
          </label>
          <div className="relative">
            <select
              id="delete-column-target"
              value={resolvedTargetId}
              onChange={(event) => setTargetColumnId(event.target.value)}
              className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-border-md bg-fill-1 pr-10 pl-3 text-body font-medium text-fg transition-colors outline-none focus:border-accent"
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
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted"
            />
          </div>
        </div>
      )}

      {action === "move" && availableColumns.length === 0 && (
        <div className="rounded-lg border border-danger/40 bg-danger-dim p-3 text-2xs font-medium text-danger">
          No other columns available. You must delete the cards or create a new
          column first.
        </div>
      )}
    </DialogShell>
  );
}
