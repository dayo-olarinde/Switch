export function WorkspaceSkeleton() {
  return (
    <div className="w-full animate-pulse">
      <div className="mb-6 flex items-center gap-3">
        <div className="size-10 rounded-lg bg-fill-2" />
        <div className="space-y-2">
          <div className="h-6 w-44 rounded-md bg-fill-2" />
          <div className="h-3 w-32 rounded bg-fill-1" />
        </div>
      </div>

      <div className="mb-6 flex items-center gap-6 border-b border-border pb-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-3.5 w-16 rounded bg-fill-2" />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex min-h-46 flex-col rounded-xl border border-border bg-surface p-4"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="size-9 rounded-lg bg-fill-2" />
              <div className="h-5 w-14 rounded-md bg-fill-2" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-3/4 rounded bg-fill-3" />
              <div className="h-2.5 w-full rounded bg-fill-2" />
            </div>
            <div className="mt-auto pt-4">
              <div className="h-1 w-full rounded-full bg-fill-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
