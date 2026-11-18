export function NotificationsSkeleton() {
  return (
    <div className="w-full animate-pulse pb-16">
      <div className="mb-7 flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-7 w-24 rounded-md bg-fill-2" />
          <div className="h-3 w-64 rounded bg-fill-1" />
        </div>
        <div className="h-8 w-32 rounded-lg border border-border bg-fill-1" />
      </div>

      <div className="flex items-center gap-4 border-b border-border pb-2.5">
        <div className="h-3.5 w-8 rounded bg-fill-2" />
        <div className="h-3.5 w-14 rounded bg-fill-2" />
        <div className="h-3.5 w-16 rounded bg-fill-2" />
      </div>

      <div className="mt-4 flex items-center gap-1.5">
        <div className="h-7 w-20 rounded-md bg-fill-3" />
        <div className="h-7 w-24 rounded-md bg-fill-1" />
        <div className="h-7 w-28 rounded-md bg-fill-1" />
      </div>

      <div className="mt-6 space-y-8">
        {[1, 2].map((group) => (
          <div key={group}>
            <div className="mb-2 h-2.5 w-16 rounded bg-fill-2" />

            <div className="space-y-1">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-lg border border-border bg-surface p-3"
                >
                  <div className="size-8 shrink-0 rounded-lg bg-fill-2" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3.5 w-3/4 rounded bg-fill-2" />
                    <div className="h-2.5 w-1/2 rounded bg-fill-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
