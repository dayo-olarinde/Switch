export const ProjectsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="flex min-h-46 animate-pulse flex-col rounded-xl border border-border bg-surface p-4"
        >
          <div className="mb-3 flex items-start justify-between">
            <div className="size-9 rounded-lg bg-fill-2" />
            <div className="h-5 w-14 rounded-md bg-fill-2" />
          </div>

          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-fill-3" />
            <div className="h-2.5 w-full rounded bg-fill-2" />
            <div className="h-2.5 w-5/6 rounded bg-fill-2" />
          </div>

          <div className="mt-auto pt-4">
            <div className="h-1 w-full rounded-full bg-fill-2" />
            <div className="mt-2 flex items-center justify-between">
              <div className="h-2.5 w-24 rounded bg-fill-2" />
              <div className="flex -space-x-1.5">
                <div className="size-5 rounded-full bg-fill-3" />
                <div className="size-5 rounded-full bg-fill-3" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
