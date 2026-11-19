"use client";

import { useMoveCard } from "@/hooks/useCards";
import {
  useClearColumncards,
  useMoveColumn,
  useUpdateColumn,
} from "@/hooks/useColumns";
import { getErrorMessage } from "@/lib/utils";
import { useBoardStore } from "@/store/board.store";
import { BoardCard, BoardColumn, BoardState } from "@/types/board.types";
import {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  cardPosition,
  droppedBelow,
  findColumnForCard,
  orderBetween,
  resolveCardMove,
} from "./board-utils";

interface BoardDraft {
  /** Store snapshot the draft was branched from. */
  base: BoardState | null;
  columns: BoardColumn[];
}

export interface BoardDnd {
  columns: BoardColumn[];
  activeCard: BoardCard | null;
  activeColumn: BoardColumn | null;
  overColumnId: string | null;
  sensors: ReturnType<typeof useSensors>;
  onDragStart: (event: DragStartEvent) => void;
  onDragOver: (event: DragOverEvent) => void;
  onDragEnd: (event: DragEndEvent) => void;
  onDragCancel: () => void;
  renameColumn: (columnId: string, name: string) => void;
  clearColumn: (columnId: string) => void;
}

/**
 * Board interaction state.
 *
 * Optimistic edits live in a draft pinned to the store snapshot they were
 * branched from, so a fresh board from the server (socket or refetch) silently
 * replaces the draft without needing a syncing effect.
 */
export function useBoardDnd(): BoardDnd {
  const board = useBoardStore((state) => state.board);

  const [draft, setDraft] = useState<BoardDraft | null>(null);
  const [activeCard, setActiveCard] = useState<BoardCard | null>(null);
  const [activeColumn, setActiveColumn] = useState<BoardColumn | null>(null);
  const [overColumnId, setOverColumnId] = useState<string | null>(null);

  const snapshotRef = useRef<BoardColumn[] | null>(null);
  const lastOverKeyRef = useRef<string | null>(null);

  const { mutate: moveCard } = useMoveCard();
  const { mutate: moveColumn } = useMoveColumn();
  const { mutate: updateColumn } = useUpdateColumn();
  const { mutate: clearCards } = useClearColumncards();

  const columns = useMemo(
    () =>
      draft && draft.base === board ? draft.columns : (board?.columns ?? []),
    [draft, board],
  );

  const updateColumns = useCallback(
    (updater: (current: BoardColumn[]) => BoardColumn[]) => {
      setDraft((previous) => {
        const base = board;
        const current =
          previous && previous.base === base
            ? previous.columns
            : (base?.columns ?? []);

        return { base, columns: updater(current) };
      });
    },
    [board],
  );

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const onDragStart = useCallback(
    (event: DragStartEvent) => {
      snapshotRef.current = columns;
      lastOverKeyRef.current = null;

      const type = event.active.data.current?.type;
      if (type === "Column") {
        setActiveColumn(
          (event.active.data.current?.column as BoardColumn) ?? null,
        );
      } else if (type === "Card") {
        setActiveCard((event.active.data.current?.card as BoardCard) ?? null);
      }
    },
    [columns],
  );

  const onDragOver = useCallback(
    (event: DragOverEvent) => {
      const { active, over } = event;
      if (!over || active.data.current?.type !== "Card") return;
      if (active.id === over.id) return;

      const overType = over.data.current?.type === "Column" ? "Column" : "Card";
      const insertAfter =
        overType === "Card"
          ? droppedBelow(active.rect.current.translated, over.rect)
          : false;

      // Key on target *and* side: hovering the same card from below still
      // needs to flip the insertion point.
      const dropKey = `${active.id}:${over.id}:${overType}:${insertAfter}`;
      if (lastOverKeyRef.current === dropKey) return;
      lastOverKeyRef.current = dropKey;

      const targetColumn =
        overType === "Column"
          ? columns.find((column) => column.id === over.id)
          : findColumnForCard(over.id as string, columns);
      setOverColumnId(targetColumn?.id ?? null);

      updateColumns((current) => {
        const result = resolveCardMove({
          columns: current,
          activeId: active.id as string,
          overId: over.id as string,
          overType,
          insertAfter,
        });

        return result ? result.columns : current;
      });
    },
    [columns, updateColumns],
  );

  const finishCardDrag = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      const snapshot = snapshotRef.current;
      const activeId = active.id as string;

      if (!over) {
        setDraft(null);
        return;
      }

      const before = snapshot ? cardPosition(activeId, snapshot) : null;
      const after = cardPosition(activeId, columns);

      if (!after) {
        setDraft(null);
        return;
      }

      if (before?.columnId === after.columnId && before.index === after.index) {
        setDraft(null);
        return;
      }

      const targetColumn = findColumnForCard(activeId, columns);
      if (!targetColumn) return;

      const order = orderBetween(targetColumn.cards, after.index);
      const applied = columns.map((column) =>
        column.id === targetColumn.id
          ? {
              ...column,
              cards: column.cards.map((card, index) =>
                index === after.index ? { ...card, order } : card,
              ),
            }
          : column,
      );

      updateColumns(() => applied);

      moveCard(
        {
          cardId: activeId,
          data: {
            columnId: targetColumn.id,
            order,
            status: targetColumn.mappedStatus,
          },
        },
        { onError: () => setDraft(null) },
      );
    },
    [columns, moveCard, updateColumns],
  );

  const finishColumnDrag = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (!over || active.id === over.id) return;

      const fromIndex = columns.findIndex((column) => column.id === active.id);
      const toIndex = columns.findIndex((column) => column.id === over.id);
      if (fromIndex < 0 || toIndex < 0) return;

      const reordered = arrayMove(columns, fromIndex, toIndex);
      const order = orderBetween(reordered, toIndex);
      const applied = reordered.map((column, index) =>
        index === toIndex ? { ...column, order } : column,
      );

      updateColumns(() => applied);

      moveColumn(
        { columnId: active.id as string, order },
        { onError: () => setDraft(null) },
      );
    },
    [columns, moveColumn, updateColumns],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveCard(null);
      setActiveColumn(null);
      setOverColumnId(null);
      lastOverKeyRef.current = null;

      if (event.active.data.current?.type === "Column") {
        finishColumnDrag(event);
      } else {
        finishCardDrag(event);
      }

      snapshotRef.current = null;
    },
    [finishCardDrag, finishColumnDrag],
  );

  const onDragCancel = useCallback(() => {
    setDraft(null);
    snapshotRef.current = null;
    lastOverKeyRef.current = null;
    setActiveCard(null);
    setActiveColumn(null);
    setOverColumnId(null);
  }, []);

  const renameColumn = useCallback(
    (columnId: string, name: string) => {
      updateColumns((current) =>
        current.map((column) =>
          column.id === columnId ? { ...column, name } : column,
        ),
      );

      updateColumn(
        { columnId, data: { name } },
        {
          onError: (error) => {
            setDraft(null);
            toast.error(getErrorMessage(error) || "Failed to rename column");
          },
        },
      );
    },
    [updateColumn, updateColumns],
  );

  const clearColumn = useCallback(
    (columnId: string) => {
      clearCards(columnId, {
        onSuccess: () =>
          updateColumns((current) =>
            current.map((column) =>
              column.id === columnId ? { ...column, cards: [] } : column,
            ),
          ),
      });
    },
    [clearCards, updateColumns],
  );

  return {
    columns,
    activeCard,
    activeColumn,
    overColumnId,
    sensors,
    onDragStart,
    onDragOver,
    onDragEnd,
    onDragCancel,
    renameColumn,
    clearColumn,
  };
}
