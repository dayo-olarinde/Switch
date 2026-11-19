export function KanbanBoardSkeleton() {
  const skeletonColumns = [{ cards: 3 }, { cards: 4 }, { cards: 2 }, { cards: 3 }];

  return (
    <div className="flex h-full min-h-0 items-stretch gap-3" aria-hidden>
      {skeletonColumns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex w-80 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-well"
        >
          <div className="flex h-11 shrink-0 items-center gap-2 border-b border-border px-3">
            <div className="size-2 animate-pulse rounded-full bg-fill-3" />
            <div className="h-3 w-20 animate-pulse rounded bg-fill-3" />
            <div className="ml-auto h-4 w-5 animate-pulse rounded bg-fill-2" />
          </div>

          <div className="flex flex-1 flex-col gap-1.5 px-2 pt-2 pb-1">
            {Array.from({ length: column.cards }).map((_, cardIndex) => (
              <div
                key={cardIndex}
                className="flex flex-col gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 card-elevated"
              >
                <div className="flex gap-2">
                  <div className="h-2 w-10 animate-pulse rounded-full bg-fill-2" />
                  {cardIndex % 2 === 0 && (
                    <div className="h-2 w-8 animate-pulse rounded-full bg-fill-2" />
                  )}
                </div>

                <div className="space-y-1.5">
                  <div className="h-3 w-full animate-pulse rounded bg-fill-3" />
                  <div className="h-3 w-2/3 animate-pulse rounded bg-fill-3" />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="h-3 w-12 animate-pulse rounded bg-fill-2" />
                    {cardIndex % 3 === 0 && (
                      <div className="h-3 w-5 animate-pulse rounded bg-fill-2" />
                    )}
                  </div>
                  {cardIndex % 2 !== 0 && (
                    <div className="size-6 animate-pulse rounded-full bg-fill-3" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="shrink-0 p-1.5">
            <div className="h-8 w-full animate-pulse rounded-md bg-fill-1" />
          </div>
        </div>
      ))}
    </div>
  );
}
