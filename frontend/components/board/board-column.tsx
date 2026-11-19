"use client";

import AddCardModal, {
  AddCardFormData,
} from "@/components/modals/AddCardModal";
import DeleteColumnModal from "@/components/modals/DeleteColumnModal";
import { Button } from "@/components/ui/button";
import { useCreateCard } from "@/hooks/useCards";
import { useDeleteColumn } from "@/hooks/useColumns";
import { useWorkspaceRole, WorkspaceMembers } from "@/hooks/useWorkspace";
import { ApiError } from "@/lib/ApiError";
import { cn, getErrorMessage } from "@/lib/utils";
import { BoardColumn } from "@/types/board.types";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { SortableCard } from "./board-card";
import { isDoneColumn } from "./board-utils";
import { ColumnHeader } from "./column-header";

interface BoardColumnLaneProps {
  column: BoardColumn;
  projectName?: string;
  workspaceMembers: WorkspaceMembers[];
  membersLoading: boolean;
  isDropTarget?: boolean;
  onOpenCard: (cardId: string) => void;
  onRename: (columnId: string, name: string) => void;
  onClear: (columnId: string) => void;
}

export function BoardColumnLane({
  column,
  projectName,
  workspaceMembers,
  membersLoading,
  isDropTarget = false,
  onOpenCard,
  onRename,
  onClear,
}: BoardColumnLaneProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [draftName, setDraftName] = useState(column.name);
  const [pendingDelete, setPendingDelete] = useState(false);

  const { canManageWorkspace } = useWorkspaceRole();
  const menuRef = useRef<HTMLDivElement>(null);

  const { mutateAsync: createCard } = useCreateCard(column.id);
  const { mutate: deleteColumn } = useDeleteColumn();

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } =
    useSortable({
      id: column.id,
      data: { type: "Column", column },
    });

  const cardIds = useMemo(
    () => column.cards.map((card) => card.id),
    [column.cards],
  );
  const done = isDoneColumn(column.mappedStatus, column.name);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, []);

  const commitRename = useCallback(() => {
    setIsRenaming(false);
    const next = draftName.trim();

    if (!next || next === column.name) {
      setDraftName(column.name);
      return;
    }

    onRename(column.id, next);
  }, [column.id, column.name, draftName, onRename]);

  const handleDelete = useCallback(() => {
    setIsMenuOpen(false);
    setPendingDelete(true);

    deleteColumn(column.id, {
      onError: (error) => {
        setPendingDelete(false);
        if (error instanceof ApiError && error.status === 409) {
          setIsDeleteOpen(true);
          return;
        }
        toast.error(getErrorMessage(error) || "Failed to delete column");
      },
    });
  }, [column.id, deleteColumn]);

  const handleAddCard = async (data: AddCardFormData) => {
    await createCard({
      title: data.title,
      description: data.description,
      priority: data.priority,
      status: column.mappedStatus,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      assignees: data.assignees,
    });

    setIsAddOpen(false);
  };

  return (
    <section
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
      aria-label={`${column.name} column`}
      className={cn(
        "flex w-80 shrink-0 flex-col overflow-hidden rounded-xl border bg-well transition-[border-color,box-shadow] duration-150",
        isDropTarget
          ? "card-elevated border-accent/50"
          : "border-border",
        isDragging && "opacity-40",
      )}
    >
      <ColumnHeader
        column={column}
        canManageWorkspace={canManageWorkspace}
        isRenaming={isRenaming}
        draftName={draftName}
        isMenuOpen={isMenuOpen}
        pendingDelete={pendingDelete}
        menuRef={menuRef}
        dragAttributes={attributes}
        dragListeners={listeners}
        onDraftNameChange={setDraftName}
        onRenameCommit={commitRename}
        onRenameCancel={() => {
          setDraftName(column.name);
          setIsRenaming(false);
        }}
        onToggleMenu={() => setIsMenuOpen((open) => !open)}
        onStartRename={() => {
          setIsMenuOpen(false);
          setDraftName(column.name);
          setIsRenaming(true);
        }}
        onClear={() => {
          setIsMenuOpen(false);
          onClear(column.id);
        }}
        onDelete={handleDelete}
      />

      <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto px-2 pt-2 pb-1">
        {column.cards.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border px-4 py-10 text-center">
            <p className="text-2xs font-medium text-fg-muted">No cards yet</p>
            <p className="text-2xs text-fg-muted">Drop a card here or add one below</p>
          </div>
        ) : (
          <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
            {column.cards.map((card) => (
              <SortableCard
                key={card.id}
                card={card}
                done={done}
                onOpen={() => onOpenCard(card.id)}
              />
            ))}
          </SortableContext>
        )}
      </div>

      <div className="shrink-0 p-1.5">
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex h-8 w-full items-center gap-1.5 rounded-md px-2 text-2xs font-semibold text-fg-muted transition-colors hover:bg-fill-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <Plus size={13} aria-hidden />
          Add card
        </button>
      </div>

      <AddCardModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        columnName={column.name}
        projectName={projectName}
        workspaceMembers={workspaceMembers}
        membersLoading={membersLoading}
        onAdd={handleAddCard}
      />

      <DeleteColumnModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        column={column}
      />
    </section>
  );
}

export function AddColumnTile({
  onClick,
  compact = false,
}: {
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      icon={<Plus size={15} aria-hidden />}
      className={cn(
        "justify-start border-dashed bg-transparent",
        compact ? "h-10" : "h-11 w-80 shrink-0 self-start",
      )}
    >
      Add column
    </Button>
  );
}
