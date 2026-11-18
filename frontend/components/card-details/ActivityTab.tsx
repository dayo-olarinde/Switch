"use client";

import { useGetActivities } from "@/hooks/useActivities";
import { getActivityConfig, renderActivityText } from "@/lib/activityHelpers";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { ActivitySkeleton } from "../skeletons/CardActivities";

export function ActivityTab({ cardId }: { cardId: string }) {
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useGetActivities(cardId);

  const allActivities = data?.pages.flatMap((p) => p.activities) ?? [];

  if (isLoading && allActivities.length === 0) {
    return <ActivitySkeleton />;
  }

  return (
    <div className="relative space-y-6 pb-4 pt-2">
      {allActivities.length > 0 && (
        <div className="absolute top-4 bottom-4 left-3.75 w-px bg-gradient-to-b from-white/10 via-white/5 to-transparent pointer-events-none" />
      )}

      {allActivities.length > 0 ? (
        <>
          {allActivities.map((activity) => {
            const { icon: Icon, color, bg } = getActivityConfig(activity.type);
            return (
              <div key={activity.id} className="flex gap-4 relative z-10 group">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full border flex items-center justify-center shrink-0 mt-0.5 shadow-sm",
                    bg,
                  )}
                >
                  <Icon size={14} className={color} />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="text-[13px] text-fg-secondary leading-relaxed">
                    <span className="font-bold text-fg">
                      {activity.user?.firstName} {activity.user?.lastName}
                    </span>{" "}
                    {renderActivityText(activity)}
                  </div>
                  <div className="text-[11px] font-medium text-fg-muted">
                    {formatDistanceToNow(new Date(activity.createdAt), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              </div>
            );
          })}

          {hasNextPage && (
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full text-[12px] text-fg-muted hover:text-fg-secondary py-2 transition-colors disabled:opacity-50"
            >
              {isFetchingNextPage ? "Loading..." : "Load more activity"}
            </button>
          )}

          {!hasNextPage && (
            <p className="text-center text-[11px] text-fg-muted py-2">
              No more activity
            </p>
          )}
        </>
      ) : (
        <div className="py-10 text-center border-2 border-border border-dashed rounded-xl bg-fill-1">
          <p className="text-[13px] text-fg-muted font-medium">
            No activity logged yet.
          </p>
        </div>
      )}
    </div>
  );
}
