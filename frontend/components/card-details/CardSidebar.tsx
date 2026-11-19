"use client";

import {
  CardPriority,
  useMoveCard,
  useUpdateCard,
} from "@/hooks/useCards";
import { BoardCard, BoardColumn } from "@/types/board.types";
import { generateKeyBetween } from "fractional-indexing";
import { useEffect, useRef } from "react";
import { AssigneePicker } from "./AssigneePicker";
import {
  DetailsList,
  DueDateProperty,
  PriorityProperty,
  StatusProperty,
} from "./card-properties";
import { LabelPicker } from "./LabelPicker";
import { SidebarSection } from "./sidebar-parts";
import { useCardMenus } from "./useCardMenu";

interface CardSidebarProps {
  card: BoardCard;
  columns: BoardColumn[];
  workspaceSlug: string;
  projectSlug: string;
}

export function CardSidebar({
  card,
  columns,
  workspaceSlug,
}: CardSidebarProps) {
  const { toggleMenu, isStatusOpen, isPriorityOpen, closeAll } = useCardMenus();
  const { mutate: updateCard } = useUpdateCard(card.id);
  const { mutate: moveCard } = useMoveCard();

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isStatusOpen && !isPriorityOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) closeAll();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [isStatusOpen, isPriorityOpen, closeAll]);

  const currentColumn = columns.find((column) =>
    column.cards.some((candidate) => candidate.id === card.id),
  );

  const priority = (card.priority?.toLowerCase() ?? "none") as CardPriority;

  const moveToColumn = (column: BoardColumn) => {
    toggleMenu(null);
    if (column.id === currentColumn?.id) return;

    const lastCard = column.cards[column.cards.length - 1];
    moveCard({
      cardId: card.id,
      data: {
        columnId: column.id,
        status: column.mappedStatus,
        order: generateKeyBetween(lastCard?.order ?? null, null),
      },
    });
  };

  return (
    <aside
      ref={containerRef}
      className="custom-scrollbar w-80 shrink-0 overflow-y-auto border-l border-border bg-surface p-4"
    >
      <div className="space-y-5">
        <SidebarSection label="Status">
          <StatusProperty
            columns={columns}
            currentColumn={currentColumn}
            open={isStatusOpen}
            onToggle={() => toggleMenu("status")}
            onSelect={moveToColumn}
          />
        </SidebarSection>

        <SidebarSection label="Priority">
          <PriorityProperty
            priority={priority}
            open={isPriorityOpen}
            onToggle={() => toggleMenu("priority")}
            onSelect={(value) => {
              toggleMenu(null);
              if (value !== priority) updateCard({ priority: value });
            }}
          />
        </SidebarSection>

        <SidebarSection label="Due date">
          <DueDateProperty
            dueDate={card.dueDate}
            onChange={(value) => updateCard({ dueDate: value })}
          />
        </SidebarSection>

        <SidebarSection label="Assignees">
          <AssigneePicker card={card} workspaceSlug={workspaceSlug} />
        </SidebarSection>

        <SidebarSection label="Labels">
          <LabelPicker card={card} workspaceSlug={workspaceSlug} />
        </SidebarSection>

        <SidebarSection label="Details" className="border-t border-border pt-4">
          <DetailsList card={card} />
        </SidebarSection>
      </div>
    </aside>
  );
}
