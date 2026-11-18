export function WorkspaceSkeleton() {
  return (
    <div className="max-w-300 mx-auto w-full animate-in fade-in duration-500">
      <div className="bg-card border border-overlay rounded-xl p-5 mb-8 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4 w-full">
          <div className="w-12 h-12 rounded-lg bg-overlay animate-pulse shrink-0" />
          <div className="flex flex-col gap-2 w-full">
            <div className="h-6 w-48 bg-overlay rounded-md animate-pulse" />
            <div className="flex items-center gap-2">
              <div className="h-4 w-24 bg-overlay rounded flex items-center animate-pulse" />
              <span className="text-fg-muted">•</span>
              <div className="h-4 w-28 bg-overlay rounded flex items-center animate-pulse" />
              <span className="text-fg-muted">•</span>
              <div className="h-4 w-16 bg-overlay rounded flex items-center animate-pulse" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-8 border-b border-overlay mb-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="pb-3 flex items-center">
            <div className="h-5 w-16 bg-overlay rounded animate-pulse" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-35 bg-card border border-overlay rounded-xl p-5 flex flex-col justify-between animate-pulse"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-overlay" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-24 bg-overlay rounded" />
                  <div className="h-3 w-16 bg-overlay rounded" />
                </div>
              </div>
              <div className="w-6 h-6 rounded bg-overlay" />
            </div>

            <div className="flex items-center justify-between mt-auto pt-4 border-t border-overlay">
              <div className="flex -space-x-2">
                <div className="w-6 h-6 rounded-full bg-overlay border-2 border-card" />
                <div className="w-6 h-6 rounded-full bg-overlay border-2 border-card" />
              </div>
              <div className="h-3 w-20 bg-overlay rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
