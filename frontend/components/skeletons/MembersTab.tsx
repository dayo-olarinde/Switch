export const MembersSkeleton = () => {
  return (
    <div className="animate-pulse overflow-hidden rounded-xl border border-border bg-card">
      <div className="grid grid-cols-[2.5fr_1fr_1fr_auto] gap-4 border-b border-border bg-fill-1 px-4 py-2.5">
        <div className="h-2.5 w-14 rounded bg-fill-3" />
        <div className="h-2.5 w-12 rounded bg-fill-3" />
        <div className="h-2.5 w-10 rounded bg-fill-3" />
        <div className="w-8" />
      </div>

      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="grid grid-cols-[2.5fr_1fr_1fr_auto] items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <div className="size-8 shrink-0 rounded-full bg-fill-3" />
            <div className="space-y-1.5">
              <div className="h-3 w-28 rounded bg-fill-3" />
              <div className="h-2.5 w-36 rounded bg-fill-2" />
            </div>
          </div>

          <div className="h-3 w-20 rounded bg-fill-2" />
          <div className="h-5 w-16 rounded-md bg-fill-2" />
          <div className="size-5 rounded-md bg-fill-2" />
        </div>
      ))}
    </div>
  );
};
