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
  const progress =
    totalCards > 0 ? Math.round((doneCards / totalCards) * 100) : 0;

  return (
    <div className="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b border-border bg-base/80 px-6 py-3.5 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-border-md bg-fill-1 text-accent">
          <LayoutGrid size={15} aria-hidden />
        </span>

        <div className="min-w-0">
          <h1 className="truncate text-body leading-tight font-semibold tracking-tight text-fg">
            {projectName ?? "Board"}
          </h1>
          <p className="mt-0.5 truncate text-2xs text-fg-muted">
            {projectDescription || `${columns.length} columns`}
          </p>
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-lg border border-border bg-fill-1 px-2 py-1 text-2xs font-medium text-fg-muted sm:flex">
          <LayoutGrid size={11} aria-hidden />
          <span className="tabular-nums">{columns.length}</span>
          {columns.length === 1 ? "column" : "columns"}
        </span>

        <span className="hidden items-center gap-1.5 rounded-lg border border-border bg-fill-1 px-2 py-1 text-2xs font-medium text-fg-muted sm:flex">
          <CheckCircle2 size={11} aria-hidden />
          <span className="tabular-nums">
            {doneCards}/{totalCards}
          </span>
          done
        </span>

        <div className="flex items-center gap-2.5 rounded-lg border border-border bg-fill-1 px-2.5 py-1.5">
          <div
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Board completion"
            className="h-1.5 w-24 overflow-hidden rounded-full bg-fill-3"
          >
            <div
              className={cn(
                "h-full rounded-full transition-[width] duration-500 ease-out",
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
