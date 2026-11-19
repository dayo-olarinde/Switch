export const LayoutSkeleton = () => {
  return (
    <div className="flex h-dvh overflow-hidden bg-base font-sans">
      <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
        <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
          <div className="size-6 animate-pulse rounded bg-fill-3" />
          <div className="h-4 w-16 animate-pulse rounded bg-fill-2" />
        </div>

        <div className="px-3 pb-2">
          <div className="h-11 w-full animate-pulse rounded-lg border border-border bg-fill-1" />
        </div>

        <div className="flex-1 space-y-0.5 px-3 pt-1">
          <div className="h-9 w-full animate-pulse rounded-lg bg-fill-1" />
          <div className="h-9 w-full animate-pulse rounded-lg bg-fill-1" />

          <div className="mt-5 space-y-1">
            <div className="mx-2.5 mb-2 h-2.5 w-14 animate-pulse rounded bg-fill-2" />
            <div className="h-9 w-full animate-pulse rounded-lg bg-fill-1" />
            <div className="h-9 w-4/5 animate-pulse rounded-lg bg-fill-1" />
            <div className="h-9 w-3/5 animate-pulse rounded-lg bg-fill-1" />
          </div>
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5 p-1.5">
            <div className="size-7 shrink-0 animate-pulse rounded-full bg-fill-2" />
            <div className="flex-1 space-y-1.5">
              <div className="h-2.5 w-24 animate-pulse rounded bg-fill-2" />
              <div className="h-2 w-32 animate-pulse rounded bg-fill-1" />
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-6">
          <div className="h-3 w-20 animate-pulse rounded bg-fill-2" />
          <div className="size-2.5 animate-pulse rounded bg-fill-1" />
          <div className="h-3 w-16 animate-pulse rounded bg-fill-2" />
          <div className="ml-auto flex items-center gap-1.5">
            <div className="h-8 w-28 animate-pulse rounded-lg border border-border bg-fill-1" />
            <div className="size-8 animate-pulse rounded-lg bg-fill-1" />
            <div className="size-8 animate-pulse rounded-lg bg-fill-1" />
          </div>
        </header>
        <main className="flex-1 bg-base" />
      </div>
    </div>
  );
};

export const ProjectsListSkeleton = () => {
  return (
    <div className="space-y-0.5 animate-pulse">
      {[80, 100, 65].map((w, i) => (
        <div key={i} className="flex items-center gap-2.5 px-2.5 py-2">
          <div className="size-1.5 shrink-0 rounded-full bg-fill-2" />
          <div className="h-2.5 bg-fill-2 rounded" style={{ width: `${w}%` }} />
        </div>
      ))}
    </div>
  );
};
