export function NotificationsSkeleton() {
  return (
    <div className="min-h-screen w-full font-sans pb-20">
      <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <div className="flex items-start justify-between">
          <div className="space-y-3 pt-1">
            <div className="flex items-center gap-3">
              <div className="h-8 w-20 bg-fill-2 rounded-md animate-pulse" />
              <div className="h-5 w-16 bg-accent-solid/10 rounded-md animate-pulse" />
            </div>
            <div className="h-4 w-64 bg-fill-2 rounded-md animate-pulse" />
          </div>
          <div className="h-9 w-32 bg-fill-2 rounded-lg border border-border animate-pulse" />
        </div>

        <div className="flex items-center gap-8 border-b border-border-md relative pb-3">
          <div className="h-4 w-8 bg-fill-3 rounded animate-pulse" />
          <div className="h-4 w-14 bg-fill-2 rounded animate-pulse" />
          <div className="h-4 w-16 bg-fill-2 rounded animate-pulse" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="h-7 w-20 bg-fill-3 rounded-lg animate-pulse" />
          <div className="h-7 w-24 bg-fill-2 rounded-lg animate-pulse" />
          <div className="h-7 w-28 bg-fill-2 rounded-lg animate-pulse" />
          <div className="h-7 w-24 bg-fill-2 rounded-lg animate-pulse" />
        </div>

        <div className="space-y-10 mt-6">
          {[1, 2].map((group) => (
            <div key={group} className="space-y-4">
              <div className="h-3 w-16 bg-fill-2 rounded animate-pulse" />

              <div className="space-y-1.5">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 p-4 rounded-xl bg-surface border border-border"
                  >
                    <div className="relative shrink-0 mt-0.5">
                      <div className="w-9 h-9 rounded-full bg-fill-2 animate-pulse" />
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-card border-2 border-surface" />
                    </div>

                    <div className="flex-1 min-w-0 pr-12 space-y-3 pt-1">
                      <div className="h-4 w-3/4 max-w-100 bg-fill-2 rounded animate-pulse" />

                      {item % 2 === 0 && (
                        <div className="border-l-2 border-border-md pl-3 py-0.5 space-y-2">
                          <div className="h-3 w-full max-w-75 bg-fill-2 rounded animate-pulse" />
                          <div className="h-3 w-2/3 max-w-50 bg-fill-2 rounded animate-pulse" />
                        </div>
                      )}

                      <div className="h-3 w-12 bg-fill-2 rounded animate-pulse mt-2" />
                    </div>

                    <div className="absolute right-4 top-5">
                      <div className="w-2 h-2 rounded-full bg-fill-3 animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
