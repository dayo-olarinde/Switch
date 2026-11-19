"use client";

import { cn } from "@/lib/utils";
import { BoardColumn } from "@/types/board.types";
import { CheckCircle2, LayoutGrid } from "lucide-react";
import { isDoneColumn } from "./board-utils";

interface BoardToolbarProps {
  projectName?: string;
  projectDescription?: string;
  columns: BoardColumn[];
}

export function BoardToolbar({
  projectName,
  projectDescription,
  columns,
}: BoardToolbarProps) {
  const totalCards = columns.reduce(
    (sum, column) => sum + column.cards.length,
    0,
  );
  const doneCards = columns.reduce(
    (sum, column) =>
      isDoneColumn(column.mappedStatus, column.name)
        ? sum + column.cards.length
        : sum,
    0,
  );
  const progress = totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-5 gap-y-3 border-b border-border bg-base/60 px-6 py-3 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-accent-dim text-accent">
          <LayoutGrid size={15} />
        </span>

        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold text-fg">
            {projectName ?? "Board"}
          </h1>
          <p className="truncate text-2xs text-fg-muted">
            {projectDescription || `${columns.length} columns`}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <span className="flex items-center gap-1.5 text-2xs font-medium text-fg-muted">
          <LayoutGrid size={12} />
          {columns.length} {columns.length === 1 ? "column" : "columns"}
        </span>

        <span className="flex items-center gap-1.5 text-2xs font-medium text-fg-muted">
          <CheckCircle2 size={12} />
          {doneCards}/{totalCards} done
        </span>

        <div className="hidden items-center gap-2 sm:flex">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Board completion"
            className="h-1.5 w-28 overflow-hidden rounded-full bg-fill-2"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500",
                progress === 100 ? "bg-success" : "bg-accent-solid",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="w-8 text-right text-2xs font-semibold tabular-nums text-fg-secondary">
            {progress}%
          </span>
        </div>
      </div>
    </div>
  );
}
