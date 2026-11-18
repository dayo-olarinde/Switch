"use client";

import { UserProfile } from "@/hooks/useAuth";
import { cn, initials } from "@/lib/utils";
import { LogOut, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface UserMenuProps {
  user?: UserProfile;
  workspaceSlug?: string;
  onLogout: () => Promise<void>;
}

export function UserMenu({ user, workspaceSlug, onLogout }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const name = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  return (
    <div ref={containerRef} className="relative">
      {open && (
        <div
          role="menu"
          className="absolute bottom-[calc(100%+6px)] left-0 right-0 overflow-hidden rounded-lg border border-border-md bg-overlay p-1 shadow-xl"
        >
          {workspaceSlug && (
            <>
              <Link
                href={`/${workspaceSlug}?tab=settings`}
                role="menuitem"
                onClick={() => setOpen(false)}
                className="flex h-9 items-center gap-2.5 rounded-md px-2.5 text-body font-medium text-fg-secondary transition-colors hover:bg-fill-2 hover:text-fg"
              >
                <Settings size={15} className="text-fg-muted" />
                Account settings
              </Link>
              <div className="my-1 h-px bg-border" />
            </>
          )}

          <button
            type="button"
            role="menuitem"
            onClick={async () => {
              setOpen(false);
              await onLogout();
            }}
            className="flex h-9 w-full items-center gap-2.5 rounded-md px-2.5 text-body font-medium text-danger transition-colors hover:bg-danger-dim"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg p-1.5 text-left transition-colors hover:bg-fill-2",
          open && "bg-fill-2",
        )}
      >
        <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border-md bg-fill-3 text-2xs font-semibold text-fg">
          {user?.avatarUrl ? (
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
            initials(user?.firstName ?? "?", user?.lastName)
          )}
        </span>

        <span className="flex min-w-0 flex-1 flex-col">
          <span className="w-full truncate text-body font-medium text-fg">
            {name || "Account"}
          </span>
          <span className="w-full truncate text-2xs text-fg-muted">
            {user?.email}
          </span>
        </span>
      </button>
    </div>
  );
}
