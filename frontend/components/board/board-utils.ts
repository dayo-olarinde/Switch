import { StatusType } from "@/hooks/useCards";
import { BoardCard, BoardColumn } from "@/types/board.types";
import type { CollisionDetection } from "@dnd-kit/core";
import { closestCenter, rectIntersection } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { differenceInCalendarDays, startOfToday } from "date-fns";
import { generateKeyBetween } from "fractional-indexing";

/* ---------------------------------------------------------------- columns */

export function findColumnForCard(
  id: string,
  columns: BoardColumn[],
): BoardColumn | undefined {
  return (
    columns.find((column) => column.id === id) ??
    columns.find((column) => column.cards.some((card) => card.id === id))
  );
}

export const COLUMN_DOT: Record<StatusType, string> = {
  BACKLOG: "bg-fg-muted",
  TODO: "bg-info",
  IN_PROGRESS: "bg-accent",
  DONE: "bg-success",
  CANCELED: "bg-fg-muted",
};

const NAME_HINTS: { tokens: string[]; dot: string }[] = [
  { tokens: ["review", "qa", "test"], dot: "bg-warning" },
  { tokens: ["block", "hold"], dot: "bg-danger" },
  { tokens: ["done", "complete", "ship"], dot: "bg-success" },
  { tokens: ["progress", "doing", "active"], dot: "bg-accent" },
  { tokens: ["todo", "to do", "ready", "next"], dot: "bg-info" },
  { tokens: ["backlog", "later", "icebox"], dot: "bg-fg-muted" },
];

export function columnDotClass(
  mappedStatus: StatusType,
  name: string,
): string {
  const lower = name.toLowerCase();
  const hint = NAME_HINTS.find((entry) =>
    entry.tokens.some((token) => lower.includes(token)),
  );

  if (hint) return hint.dot;
  return COLUMN_DOT[mappedStatus] ?? "bg-accent";
}

export function isDoneColumn(
  mappedStatus: StatusType,
  name: string,
): boolean {
  return mappedStatus === "DONE" || name.toLowerCase().includes("done");
}

export const PRIORITY_META: Record<
  BoardCard["priority"],
  { label: string; chip: string; bar: string; tint: string }
> = {
  none: {
    label: "No priority",
    chip: "border-border bg-fill-2 text-fg-muted",
    bar: "bg-transparent",
    tint: "bg-card",
  },
  low: {
    label: "Low",
    chip: "border-success/30 bg-success-dim text-success",
    bar: "bg-success",
    tint: "bg-tint-low",
  },
  medium: {
    label: "Medium",
    chip: "border-warning/30 bg-warning-dim text-warning",
    bar: "bg-warning",
    tint: "bg-tint-medium",
  },
  high: {
    label: "High",
    chip: "border-danger/30 bg-danger-dim text-danger",
    bar: "bg-danger",
    tint: "bg-tint-high",
  },
  urgent: {
    label: "Urgent",
    chip: "border-danger/40 bg-danger-dim text-danger",
    bar: "bg-danger",
    tint: "bg-tint-urgent",
  },
};

export function dueDateClass(dueDate: string): string {
  const days = differenceInCalendarDays(new Date(dueDate), startOfToday());

  if (days < 0) return "border-danger/30 bg-danger-dim text-danger";
  if (days <= 2) return "border-warning/30 bg-warning-dim text-warning";
  return "border-border bg-fill-2 text-fg-secondary";
}

/* ------------------------------------------------------------ reordering */

export function orderBetween(
  cards: { order: string }[],
  index: number,
): string {
  return generateKeyBetween(
    cards[index - 1]?.order ?? null,
    cards[index + 1]?.order ?? null,
  );
}

export interface CardMoveResult {
  columns: BoardColumn[];
  toColumnId: string;
  toIndex: number;
}

interface CardMoveArgs {
  columns: BoardColumn[];
  activeId: string;
  overId: string;
  overType: "Card" | "Column";
  insertAfter: boolean;
}

/**
 * Resolves a card drop into a new column ordering.
 *
 * Same-column drops follow `arrayMove` semantics (the dragged card takes the
 * over card's index), which is what the sorting strategy animates. Cross-column
 * drops splice into the gap above or below the over card, and a drop on the
 * lane body appends — the old code passed -1 to arrayMove there, rotating the
 * lane instead of appending.
 */
export function resolveCardMove({
  columns,
  activeId,
  overId,
  overType,
  insertAfter,
}: CardMoveArgs): CardMoveResult | null {
  const fromColumn = findColumnForCard(activeId, columns);
  if (!fromColumn) return null;

  const card = fromColumn.cards.find((candidate) => candidate.id === activeId);
  const fromIndex = fromColumn.cards.findIndex(
    (candidate) => candidate.id === activeId,
  );
  if (!card || fromIndex < 0) return null;

  const toColumn =
    overType === "Column"
      ? columns.find((column) => column.id === overId)
      : findColumnForCard(overId, columns);
  if (!toColumn) return null;

  if (fromColumn.id === toColumn.id) {
    const overIndex = toColumn.cards.findIndex(
      (candidate) => candidate.id === overId,
    );
    const toIndex =
      overType === "Column" || overIndex < 0 ? toColumn.cards.length - 1 : overIndex;

    if (toIndex === fromIndex) {
      return { columns, toColumnId: toColumn.id, toIndex };
    }

    const reordered = arrayMove(toColumn.cards, fromIndex, toIndex);

    return {
      columns: columns.map((column) =>
        column.id === toColumn.id ? { ...column, cards: reordered } : column,
      ),
      toColumnId: toColumn.id,
      toIndex,
    };
  }

  const rest = fromColumn.cards.filter(
    (candidate) => candidate.id !== activeId,
  );
  const targetCards = [...toColumn.cards];
  const overIndex = targetCards.findIndex(
    (candidate) => candidate.id === overId,
  );
  const toIndex =
    overType === "Column" || overIndex < 0
      ? targetCards.length
      : overIndex + (insertAfter ? 1 : 0);

  targetCards.splice(toIndex, 0, card);

  return {
    columns: columns.map((column) => {
      if (column.id === fromColumn.id) return { ...column, cards: rest };
      if (column.id === toColumn.id)
        return { ...column, cards: targetCards };
      return column;
    }),
    toColumnId: toColumn.id,
    toIndex,
  };
}

/** Position of a card inside the board, used to detect no-op drops. */
export function cardPosition(
  cardId: string,
  columns: BoardColumn[],
): { columnId: string; index: number } | null {
  const column = findColumnForCard(cardId, columns);
  if (!column) return null;

  const index = column.cards.findIndex((card) => card.id === cardId);
  if (index < 0) return null;

  return { columnId: column.id, index };
}

/* ------------------------------------------------------------------- dnd */

export const boardCollisionDetection: CollisionDetection = (args) => {
  if (args.active.data.current?.type === "Column") {
    return rectIntersection({
      ...args,
      droppableContainers: args.droppableContainers.filter(
        (container) => container.data?.current?.type === "Column",
      ),
    });
  }

  return closestCenter(args);
};

export function droppedBelow(
  activeRect: { top: number; height: number } | null | undefined,
  overRect: { top: number; height: number },
): boolean {
  if (!activeRect) return false;
  return activeRect.top + activeRect.height / 2 > overRect.top + overRect.height / 2;
}
