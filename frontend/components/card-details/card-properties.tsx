"use client";

import { CardPriority } from "@/hooks/useCards";
import { cn, formatDate } from "@/lib/utils";
import { BoardCard, BoardColumn } from "@/types/board.types";
import { format, isBefore, startOfDay } from "date-fns";
import { PRIORITY_META, columnDotClass, dueDateClass } from "../board/board-utils";
import {
  PropertyButton,
  PropertyMenu,
  PropertyMenuItem,
} from "./sidebar-parts";

export const PRIORITY_OPTIONS: { value: CardPriority; label: string }[] = [
  { value: "urgent", label: "Urgent" },
  { value: "high", label: "High" },
  { value: "medium", label: "Medium" },
  { value: "low", label: "Low" },
  { value: "none", label: "No priority" },
];

const DOT_BY_PRIORITY: Record<CardPriority, string> = {
  urgent: "bg-danger",
  high: "bg-danger",
  medium: "bg-warning",
  low: "bg-success",
  none: "bg-fg-muted",
};

export function StatusProperty({
  columns,
  currentColumn,
  open,
  onToggle,
  onSelect,
}: {
  columns: BoardColumn[];
  currentColumn?: BoardColumn;
  open: boolean;
  onToggle: () => void;
  onSelect: (column: BoardColumn) => void;
}) {
  return (
    <div className="relative">
      <PropertyButton
        onClick={onToggle}
        expanded={open}
        ariaLabel="Change status"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "size-2 shrink-0 rounded-full",
              currentColumn
                ? columnDotClass(currentColumn.mappedStatus, currentColumn.name)
                : "bg-fg-muted",
            )}
          />
          <span className="truncate text-body font-medium text-fg">
            {currentColumn?.name ?? "Unknown"}
          </span>
        </span>
      </PropertyButton>

      {open && (
        <PropertyMenu>
          {columns.map((column) => (
            <PropertyMenuItem
              key={column.id}
              active={column.id === currentColumn?.id}
              onClick={() => onSelect(column)}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    columnDotClass(column.mappedStatus, column.name),
                  )}
                />
                <span className="truncate">{column.name}</span>
              </span>
            </PropertyMenuItem>
          ))}
        </PropertyMenu>
      )}
    </div>
  );
}

export function PriorityProperty({
  priority,
  open,
  onToggle,
  onSelect,
}: {
  priority: CardPriority;
  open: boolean;
  onToggle: () => void;
  onSelect: (priority: CardPriority) => void;
}) {
  const meta = PRIORITY_META[priority] ?? PRIORITY_META.none;

  return (
    <div className="relative">
      <PropertyButton
        onClick={onToggle}
        expanded={open}
        ariaLabel="Change priority"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden
            className={cn(
              "size-2 shrink-0 rounded-full",
              DOT_BY_PRIORITY[priority],
            )}
          />
          <span className="truncate text-body font-medium text-fg">
            {meta.label}
          </span>
        </span>
      </PropertyButton>

      {open && (
        <PropertyMenu>
          {PRIORITY_OPTIONS.map((option) => (
            <PropertyMenuItem
              key={option.value}
              active={option.value === priority}
              onClick={() => onSelect(option.value)}
            >
              <span className="flex items-center gap-2">
                <span
                  aria-hidden
                  className={cn(
                    "size-2 rounded-full",
                    DOT_BY_PRIORITY[option.value],
                  )}
                />
                {PRIORITY_META[option.value].label}
              </span>
            </PropertyMenuItem>
          ))}
        </PropertyMenu>
      )}
    </div>
  );
}

export function DueDateProperty({
  dueDate,
  onChange,
}: {
  dueDate?: string | null;
  onChange: (value: Date | null) => void;
}) {
  const parsed = dueDate ? new Date(dueDate) : null;
  const overdue = parsed
    ? isBefore(startOfDay(parsed), startOfDay(new Date()))
    : false;

  return (
    <div className="relative">
      <input
        type="date"
        value={parsed ? format(parsed, "yyyy-MM-dd") : ""}
        onChange={(event) =>
          onChange(event.target.value ? new Date(event.target.value) : null)
        }
        aria-label="Due date"
        className={cn(
          "h-10 w-full rounded-lg border bg-fill-1 px-2.5 text-body text-fg outline-none transition-colors hover:border-border-md focus:border-accent",
          overdue ? "border-danger/40" : "border-border",
        )}
      />
      {parsed && (
        <span
          aria-hidden
          className={cn(
            "pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 rounded border px-1.5 py-0.5 text-2xs font-semibold",
            dueDateClass(parsed.toISOString()),
          )}
        >
          {overdue ? "Overdue" : "Due"}
        </span>
      )}
    </div>
  );
}

export function DetailsList({ card }: { card: BoardCard }) {
  const rows = [
    {
      label: "Created",
      value: card.createdAt ? formatDate(card.createdAt) : "—",
    },
    {
      label: "Updated",
      value: card.updatedAt ? formatDate(card.updatedAt) : "—",
    },
    {
      label: "Creator",
      value: card.creator
        ? `${card.creator.firstName} ${card.creator.lastName}`
        : "—",
    },
  ];

  return (
    <dl className="space-y-2 text-2xs">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex items-center justify-between gap-2"
        >
          <dt className="text-fg-muted">{row.label}</dt>
          <dd className="truncate text-fg-secondary">{row.value}</dd>
        </div>
      ))}
      <div className="flex items-center justify-between gap-2">
        <dt className="text-fg-muted">Card ID</dt>
        <dd className="font-mono text-fg-secondary">
          {card.id.slice(0, 6).toUpperCase()}
        </dd>
      </div>
    </dl>
  );
}
