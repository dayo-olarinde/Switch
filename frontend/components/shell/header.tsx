"use client";

import { ThemeToggle } from "@/components/ThemeToggle";
import { PresenceUser } from "@/types/board.types";
import { cn, initials } from "@/lib/utils";
import { Bell, ChevronRight, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface PresenceStackProps {
  users: PresenceUser[];
}

export function PresenceStack({ users }: PresenceStackProps) {
  if (users.length === 0) return null;

  const visible = users.slice(0, 4);
  const overflow = users.length - visible.length;

  return (
    <div className="flex items-center -space-x-1.5">
      {visible.map((user, index) => (
        <span
          key={user.userId ?? index}
          title={`${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()}
          className="relative flex size-7 items-center justify-center overflow-hidden rounded-full border-2 border-base bg-fill-3 text-2xs font-semibold text-fg"
        >
          {user.avatarUrl ? (
            <Image
              src={user.avatarUrl}
              alt=""
              width={28}
              height={28}
              className="size-full object-cover"
              unoptimized
              referrerPolicy="no-referrer"
            />
          ) : (
            initials(user.firstName ?? "?", user.lastName)
          )}
          <span className="absolute right-0 bottom-0 size-1.5 rounded-full bg-success ring-2 ring-base" />
        </span>
      ))}

      {overflow > 0 && (
        <span className="flex size-7 items-center justify-center rounded-full border-2 border-base bg-fill-2 text-2xs font-semibold text-fg-muted">
          +{overflow}
        </span>
      )}
    </div>
  );
}

interface AppHeaderProps {
  workspaceName?: string;
  pageLabel: string;
  unreadCount: number;
  presenceUsers: PresenceUser[];
  showPresence: boolean;
  onOpenSearch: () => void;
}

export function AppHeader({
  workspaceName,
  pageLabel,
  unreadCount,
  presenceUsers,
  showPresence,
  onOpenSearch,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-base/85 px-6 backdrop-blur-md">
      {workspaceName && (
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-body">
          <span className="text-fg-muted">{workspaceName}</span>
          <ChevronRight size={13} className="text-fg-muted" />
          <span className="font-medium text-fg">{pageLabel}</span>
        </nav>
      )}

      <div className="ml-auto flex items-center gap-1.5">
        {showPresence && <PresenceStack users={presenceUsers} />}

        <button
          type="button"
          onClick={onOpenSearch}
          className="flex h-8 items-center gap-2 rounded-lg px-2 text-fg-muted transition-colors hover:bg-fill-2 hover:text-fg"
        >
          <Search size={15} />
          <kbd className="hidden items-center rounded border border-border bg-fill-1 px-1.5 py-0.5 font-sans text-2xs font-medium text-fg-muted sm:inline-flex">
            ⌘K
          </kbd>
        </button>

        <ThemeToggle />

        <Link
          href="/notifications"
          aria-label={
            unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
          }
          className={cn(
            "relative flex size-8 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fill-2 hover:text-fg",
          )}
        >
          <Bell size={15} />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-danger ring-2 ring-base" />
          )}
        </Link>
      </div>
    </header>
  );
}
