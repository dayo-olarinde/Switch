export function KanbanBoardSkeleton() {
  const skeletonColumns = [
    { cards: 3 },
    { cards: 5 },
    { cards: 2 },
    { cards: 4 },
  ];

  return (
    <div className="flex gap-6 items-start w-max min-h-0 pb-2">
      {skeletonColumns.map((col, index) => (
        <div
          key={index}
          className="w-85 shrink-0 bg-fill-1 border border-border rounded-2xl p-3 flex flex-col gap-3 animate-in fade-in duration-500"
        >
          <div className="flex items-center justify-between px-1 mb-1">
            <div className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full bg-fill-3 animate-pulse" />
              <div className="h-4 w-24 bg-fill-3 rounded animate-pulse" />
              <div className="h-4 w-6 bg-fill-2 rounded animate-pulse ml-1" />
            </div>
            <div className="w-6 h-6 rounded bg-fill-2 animate-pulse" />
          </div>

          {Array.from({ length: col.cards }).map((_, cardIndex) => (
            <div
              key={cardIndex}
              className="bg-surface border border-border rounded-xl p-3.5 flex flex-col gap-3 shadow-sm"
            >
              <div className="flex gap-1.5">
                <div className="h-1.5 w-8 bg-fill-3 rounded-full animate-pulse" />
                {cardIndex % 2 === 0 && (
                  <div className="h-1.5 w-12 bg-fill-3 rounded-full animate-pulse" />
                )}
              </div>

              <div className="space-y-2 mt-1">
                <div className="h-3 w-full bg-fill-3 rounded animate-pulse" />
                <div className="h-3 w-3/4 bg-fill-3 rounded animate-pulse" />
              </div>

              <div className="flex items-center justify-between mt-2 pt-3 border-t border-border">
                <div className="flex items-center gap-2.5">
                  <div className="h-3.5 w-14 bg-fill-2 rounded-md animate-pulse" />
                  <div className="h-3.5 w-8 bg-fill-2 rounded-md animate-pulse" />
                </div>

                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-fill-3 border-2 border-surface animate-pulse" />
                  {cardIndex % 3 !== 0 && (
                    <div className="w-5 h-5 rounded-full bg-fill-3 border-2 border-surface animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
