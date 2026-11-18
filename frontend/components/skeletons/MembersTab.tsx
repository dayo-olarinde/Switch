export const MembersSkeleton = () => {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-xl animate-pulse">
      <div className="grid grid-cols-[2.5fr_1fr_1fr_auto] gap-4 px-6 py-3.5 border-b border-border bg-fill-1">
        <div className="h-3 w-16 bg-fill-3 rounded" />
        <div className="h-3 w-16 bg-fill-3 rounded" />
        <div className="h-3 w-12 bg-fill-3 rounded" />
        <div className="w-8" />
      </div>

      <div className="flex flex-col">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="grid grid-cols-[2.5fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center border-b border-border last:border-b-0"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-full bg-fill-3 shrink-0" />
              <div className="flex flex-col gap-2">
                <div className="h-3.5 w-32 bg-fill-3 rounded" />
                <div className="h-3 w-40 bg-fill-2 rounded" />
              </div>
            </div>

            <div className="h-3.5 w-24 bg-fill-2 rounded" />

            <div className="h-8 w-28 bg-fill-2 rounded-md" />

            <div className="w-8 flex justify-end">
              <div className="w-6 h-6 rounded-md bg-fill-2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
