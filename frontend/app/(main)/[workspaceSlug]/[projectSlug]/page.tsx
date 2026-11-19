"use client";

import CreateColumnModal from "@/components/modals/CreateColumnModal";
import { KanbanBoardSkeleton } from "@/components/skeletons/BoardPage";
import { EmptyState } from "@/components/ui/page";
import { useBoard } from "@/hooks/useBoard";
import { useBoardSocket } from "@/hooks/useBoardSocket";
import { useGetProjectBySlug } from "@/hooks/useProjects";
import { useGetMembers } from "@/hooks/useWorkspace";
import { useBoardStore } from "@/store/board.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  DndContext,
  DragOverlay,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { LayoutGrid } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { CardTile } from "@/components/board/board-card";
import { AddColumnTile, BoardColumnLane } from "@/components/board/board-column";
import { BoardToolbar } from "@/components/board/board-toolbar";
import { boardCollisionDetection, columnDotClass } from "@/components/board/board-utils";
import { useBoardDnd } from "@/components/board/use-board-dnd";
import { cn } from "@/lib/utils";

export default function KanbanBoardPage() {
  const { workspaceSlug, projectSlug } = useParams() as {
    workspaceSlug: string;
    projectSlug: string;
  };

  const router = useRouter();
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);

  const { data: project } = useGetProjectBySlug(workspaceSlug, projectSlug);
  const { isLoading } = useBoard(projectSlug, workspaceSlug);
  const { data: workspaceMembers = [], isLoading: membersLoading } =
    useGetMembers(workspaceSlug);

  const board = useBoardStore((state) => state.board);
  const activeWorkspace = useWorkspaceStore((state) => state.activeWorkspace);
  useBoardSocket(board?.id ?? "");

  const {
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
  } = useBoardDnd();

  const openCard = (cardId: string) => {
    router.push(`/${workspaceSlug}/${projectSlug}/c/${cardId}`);
  };

  if (!activeWorkspace) return null;

  const columnIds = columns.map((column) => column.id);

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-base">
      <BoardToolbar
        projectName={project?.name}
        projectDescription={project?.description}
        columns={columns}
      />

      <main className="custom-scrollbar min-h-0 flex-1 overflow-auto">
        {isLoading || !board ? (
          <div className="h-full p-4">
            <KanbanBoardSkeleton />
          </div>
        ) : columns.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={<LayoutGrid size={18} />}
              title="This board is empty"
              description="Add your first column to start organising cards into stages of work."
              action={
                <AddColumnTile
                  compact
                  onClick={() => setIsColumnModalOpen(true)}
                />
              }
            />
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={boardCollisionDetection}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDragEnd={onDragEnd}
            onDragCancel={onDragCancel}
            measuring={{ droppable: { strategy: MeasuringStrategy.Always } }}
          >
            <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
              <div className="flex h-full min-h-0 items-stretch gap-3 p-4">
                {columns.map((column) => (
                  <BoardColumnLane
                    key={column.id}
                    column={column}
                    projectName={project?.name}
                    workspaceMembers={workspaceMembers}
                    membersLoading={membersLoading}
                    isDropTarget={overColumnId === column.id}
                    onOpenCard={openCard}
                    onRename={renameColumn}
                    onClear={clearColumn}
                  />
                ))}

                <AddColumnTile onClick={() => setIsColumnModalOpen(true)} />
              </div>
            </SortableContext>

            <DragOverlay
              dropAnimation={{
                sideEffects: defaultDropAnimationSideEffects({
                  styles: { active: { opacity: "0.3" } },
                }),
              }}
            >
              {activeCard ? (
                <div className="w-80 px-2">
                  <CardTile card={activeCard} preview />
                </div>
              ) : null}

              {activeColumn ? (
                <div className="flex h-12 w-80 items-center gap-2 rounded-xl border border-accent/50 bg-surface px-3 shadow-accent">
                  <span
                    aria-hidden
                    className={cn(
                      "size-2 rounded-full",
                      columnDotClass(activeColumn.mappedStatus, activeColumn.name),
                    )}
                  />
                  <span className="min-w-0 flex-1 truncate text-body font-semibold text-fg">
                    {activeColumn.name}
                  </span>
                  <span className="rounded-md bg-fill-2 px-1.5 py-0.5 text-2xs font-semibold text-fg-muted">
                    {activeColumn.cards.length}
                  </span>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      {board && (
        <CreateColumnModal
          isOpen={isColumnModalOpen}
          onClose={() => setIsColumnModalOpen(false)}
          boardId={board.id}
        />
      )}
    </div>
  );
}
