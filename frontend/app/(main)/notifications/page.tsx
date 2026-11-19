"use client";

import { NotificationsSkeleton } from "@/components/skeletons/NotificationsPage";
import { Button } from "@/components/ui/button";
import { EmptyState, PageHeader } from "@/components/ui/page";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useNotificationStore } from "@/store/notification.store";
import { formatDistanceToNow, isToday, isYesterday } from "date-fns";
import {
  AtSign,
  BellOff,
  Check,
  Clock,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { useState } from "react";

const getTypeConfig = (type: string) => {
  switch (type) {
    case "comment_added":
      return { icon: MessageSquare, color: "text-info", bg: "bg-info-dim" };
    case "card_assigned":
      return { icon: UserPlus, color: "text-success", bg: "bg-success-dim" };
    case "card_due_soon":
      return { icon: Clock, color: "text-warning", bg: "bg-warning-dim" };
    case "mentioned":
      return { icon: AtSign, color: "text-danger", bg: "bg-danger-dim" };
    default:
      return { icon: BellOff, color: "text-fg-muted", bg: "bg-fill-2" };
  }
};

type TabValue = "all" | "unread" | "mentions";
type FilterValue = "all" | "comments" | "assignments";

const FILTERS: Array<{ value: FilterValue; label: string }> = [
  { value: "all", label: "All types" },
  { value: "comments", label: "Comments" },
  { value: "assignments", label: "Assignments" },
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<TabValue>("all");
  const [activeFilter, setActiveFilter] = useState<FilterValue>("all");

  const notifications = useNotificationStore((s) => s.notifications);
  const isLoading = useNotificationStore((s) => s.isLoading);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markRead = useNotificationStore((s) => s.markRead);
  const markAllRead = useNotificationStore((s) => s.markAllRead);

  if (isLoading) return <NotificationsSkeleton />;

  const filtered = notifications.filter((notification) => {
    if (activeTab === "unread" && notification.isRead) return false;
    if (activeTab === "mentions" && notification.type !== "mentioned")
      return false;

    if (activeFilter === "comments" && notification.type !== "comment_added")
      return false;
    if (activeFilter === "assignments" && notification.type !== "card_assigned")
      return false;

    return true;
  });

  const grouped = filtered.reduce<Record<string, typeof notifications>>(
    (acc, notification) => {
      const date = new Date(notification.createdAt);
      const group = isToday(date)
        ? "Today"
        : isYesterday(date)
          ? "Yesterday"
          : "Older";

      (acc[group] ??= []).push(notification);
      return acc;
    },
    {},
  );

  const hasFilters = activeTab !== "all" || activeFilter !== "all";

  return (
    <div className="w-full pb-16">
      <PageHeader
        title="Inbox"
        description="Catch up on the latest activity across your projects."
        actions={
          <Button
            variant="secondary"
            size="sm"
            onClick={() => markAllRead()}
            icon={<Check size={14} />}
          >
            Mark all as read
          </Button>
        }
      />

      <Tabs<TabValue>
        items={[
          {
            value: "all",
            label: "All",
            count: notifications.length,
          },
          { value: "unread", label: "Unread", count: unreadCount },
          { value: "mentions", label: "Mentions" },
        ]}
        value={activeTab}
        onChange={(value) => {
          setActiveTab(value);
          setActiveFilter("all");
        }}
      />

      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActiveFilter(filter.value)}
            aria-pressed={activeFilter === filter.value}
            className={cn(
              "h-7 rounded-md px-2.5 text-2xs font-semibold transition-colors",
              activeFilter === filter.value
                ? "bg-fill-3 text-fg"
                : "text-fg-muted hover:bg-fill-2 hover:text-fg",
            )}
          >
            {filter.label}
          </button>
        ))}

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setActiveFilter("all");
            }}
            className="ml-1 h-7 rounded-md px-2.5 text-2xs font-semibold text-accent transition-opacity hover:opacity-80"
          >
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-6 space-y-8">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<BellOff size={18} />}
            title="All caught up"
            description="You have no notifications matching this view. Check back later for updates."
          />
        ) : (
          Object.entries(grouped).map(([group, items]) => (
            <section key={group}>
              <h2 className="mb-2 px-1 text-2xs font-semibold tracking-wider text-fg-muted uppercase">
                {group}
              </h2>

              <ul className="space-y-1">
                {items.map((notification) => {
                  const config = getTypeConfig(notification.type);
                  const Icon = config.icon;

                  return (
                    <li
                      key={notification.id}
                      className={cn(
                        "group relative flex items-start gap-3 rounded-xl border p-3 transition-colors",
                        notification.isRead
                          ? "border-transparent hover:bg-fill-1"
                          : "border-border bg-surface card-elevated",
                      )}
                    >
                      {!notification.isRead && (
                        <span
                          aria-hidden
                          className="absolute top-3 bottom-3 left-0 w-0.5 rounded-full bg-accent"
                        />
                      )}
                      <span
                        className={cn(
                          "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg",
                          config.bg,
                        )}
                      >
                        <Icon size={15} className={config.color} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <p
                          className={cn(
                            "text-body text-fg",
                            notification.isRead ? "font-medium" : "font-semibold",
                          )}
                        >
                          {notification.title}
                        </p>

                        {notification.body && (
                          <p className="mt-1 line-clamp-2 border-l-2 border-border-md pl-2.5 text-body text-fg-muted">
                            {notification.body}
                          </p>
                        )}

                        <p className="mt-1.5 text-2xs font-medium text-fg-muted">
                          {formatDistanceToNow(new Date(notification.createdAt))}{" "}
                          ago
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() => markRead(notification.id)}
                            aria-label="Mark as read"
                            className="rounded-md p-1.5 text-fg-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-fill-2 hover:text-fg focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))
        )}
      </div>

      {unreadCount > 0 && (
        <p className="mt-8 text-center text-2xs text-fg-muted">
          {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
        </p>
      )}
    </div>
  );
}
