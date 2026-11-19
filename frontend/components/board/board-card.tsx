"use client";

import { AvatarGroup } from "@/components/ui/avatar";
import { cn, formatDateShort, getLabelDot } from "@/lib/utils";
import { BoardCard } from "@/types/board.types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CalendarDays, MessageSquare, Paperclip } from "lucide-react";
import { KeyboardEvent, memo, useRef } from "react";
import { PRIORITY_META, dueDateClass } from "./board-utils";

const MAX_LABELS = 3;

interface CardTileProps {
  card: BoardCard;
  done?: boolean;
  preview?: boolean;
}

export const CardTile = memo(function CardTile({
  card,
  done = false,
  preview = false,
}: CardTileProps) {
  const priority = PRIORITY_META[card.priority] ?? PRIORITY_META.none;
  const labels = card.labels ?? [];
  const assignees = card.assignees ?? [];
  const comments = card.commentCount ?? 0;
  const attachments = card.attachments?.length ?? 0;

  // Only loud priorities earn a chip; the rest stay as the edge bar so the
  // tile reads as content first, metadata second.
  const showPriorityChip =
    card.priority === "urgent" || card.priority === "high";

  const visibleLabels = labels.slice(0, MAX_LABELS);
  const hiddenLabels = labels.length - visibleLabels.length;

  const hasMeta = Boolean(card.dueDate) || comments > 0 || attachments > 0;

  return (
    <div
      className={cn(
        "group/card relative overflow-hidden rounded-xl border bg-card",
        "transition-[border-color,box-shadow] duration-150",
        preview
          ? "card-lifted border-accent/45"
          : "card-elevated border-border hover:border-border-lg hover:card-elevated-hover",
        done && !preview && "bg-well",
      )}
    >
      {card.priority !== "none" && (
        <span
          aria-hidden
          className={cn(
            "absolute inset-y-0 left-0",
            card.priority === "urgent" ? "w-1" : "w-0.5",
            priority.bar,
          )}
        />
      )}

      <div className="flex flex-col gap-2.5 px-3 py-2.5">
        {visibleLabels.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {visibleLabels.map((label) => (
              <span
                key={label.id}
                className="flex items-center gap-1.5"
                title={label.name}
              >
                <span
                  aria-hidden
                  className={cn(
                    "size-1.5 shrink-0 rounded-full",
                    getLabelDot(label.colour),
                  )}
                />
                <span className="max-w-24 truncate text-2xs font-medium text-fg-secondary">
                  {label.name}
                </span>
              </span>
            ))}

            {hiddenLabels > 0 && (
              <span className="text-2xs font-medium text-fg-muted">
                +{hiddenLabels}
              </span>
            )}
          </div>
        )}

        <div className="flex items-start gap-2">
          <p
            className={cn(
              "min-w-0 flex-1 text-body leading-snug font-medium",
              done ? "text-fg-muted line-through" : "text-fg",
            )}
          >
            {card.title}
          </p>

          {showPriorityChip && (
            <span
              className={cn(
                "mt-px shrink-0 rounded border px-1 py-px text-2xs font-semibold uppercase",
                priority.chip,
              )}
            >
              {priority.label}
            </span>
          )}
        </div>

        {(hasMeta || assignees.length > 0) && (
          <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2.5">
              {card.dueDate && (
                <span
                  className={cn(
                    "flex items-center gap-1 text-2xs font-medium tabular-nums",
                    dueDateClass(card.dueDate),
                  )}
                >
                  <CalendarDays size={11} aria-hidden />
                  {formatDateShort(card.dueDate)}
                </span>
              )}

              {comments > 0 && (
                <span
                  className="flex items-center gap-1 text-2xs font-medium text-fg-muted"
                  title={`${comments} comments`}
                >
                  <MessageSquare size={11} aria-hidden />
                  <span className="tabular-nums">{comments}</span>
                </span>
              )}

              {attachments > 0 && (
                <span
                  className="flex items-center gap-1 text-2xs font-medium text-fg-muted"
                  title={`${attachments} attachments`}
                >
                  <Paperclip size={11} aria-hidden />
                  <span className="tabular-nums">{attachments}</span>
                </span>
              )}
            </div>

            {assignees.length > 0 && (
              <AvatarGroup users={assignees} max={3} size="sm" />
            )}
          </div>
        )}
      </div>
    </div>
  );
});

interface SortableCardProps {
  card: BoardCard;
  done: boolean;
  onOpen: () => void;
}

export const SortableCard = memo(function SortableCard({
  card,
  done,
  onOpen,
}: SortableCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id, data: { type: "Card", card } });

  const pressRef = useRef<{ x: number; y: number } | null>(null);
  const draggedRef = useRef(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen();
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
      }}
      {...attributes}
      {...listeners}
      onPointerDown={(event) => {
        pressRef.current = { x: event.clientX, y: event.clientY };
        draggedRef.current = false;
      }}
      onPointerMove={(event) => {
        const press = pressRef.current;
        if (!press) return;
        if (Math.hypot(event.clientX - press.x, event.clientY - press.y) > 4) {
          draggedRef.current = true;
        }
      }}
      onClick={() => {
        const wasDrag = draggedRef.current;
        pressRef.current = null;
        draggedRef.current = false;
        if (wasDrag) return;
        onOpen();
      }}
      onKeyDown={handleKeyDown}
      aria-label={`Open card ${card.title}`}
      className="cursor-grab rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base active:cursor-grabbing"
    >
      <CardTile card={card} done={done} />
    </div>
  );
});
