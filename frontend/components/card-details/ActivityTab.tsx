"use client";

import { Button } from "@/components/ui/button";
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

  if (allActivities.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-fill-1 py-10 text-center">
        <p className="text-body font-medium text-fg-muted">
          No activity logged yet.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-4">
      <ol className="space-y-5">
        {allActivities.map((activity, index) => {
          const { icon: Icon, color, bg } = getActivityConfig(activity.type);
          const isLast = index === allActivities.length - 1;

          return (
            <li key={activity.id} className="relative flex gap-3">
              {!isLast && (
                <span
                  aria-hidden
                  className="absolute top-9 bottom-0 left-4 w-px -translate-x-1/2 bg-border"
                />
              )}

              <span
                className={cn(
                  "relative z-10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border",
                  bg,
                )}
              >
                <Icon size={14} className={color} aria-hidden />
              </span>

              <div className="min-w-0 flex-1 space-y-0.5 pt-1">
                <p className="text-body leading-relaxed text-fg-secondary">
                  <span className="font-semibold text-fg">
                    {activity.user?.firstName} {activity.user?.lastName}
                  </span>{" "}
                  {renderActivityText(activity)}
                </p>
                <p className="text-2xs font-medium text-fg-muted">
                  {formatDistanceToNow(new Date(activity.createdAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {hasNextPage ? (
        <Button
          variant="ghost"
          size="sm"
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
          className="mt-4 w-full"
        >
          {isFetchingNextPage ? "Loading" : "Load more activity"}
        </Button>
      ) : (
        <p className="py-4 text-center text-2xs text-fg-muted">
          End of activity
        </p>
      )}
    </div>
  );
}
