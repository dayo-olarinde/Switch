"use client";

import { RotateCcw, Smartphone } from "lucide-react";
import { ReactNode } from "react";

export function MobileBlocker({ children }: { children: ReactNode }) {
  return (
    <>
      <div
        data-rotate-blocker
        className="fixed inset-0 z-50 flex-col items-center justify-center bg-base p-6 text-center animate-in fade-in duration-500"
      >
        <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-border-md bg-fill-2">
          <Smartphone
            size={28}
            className="rotate-90 text-fg-muted"
            aria-hidden
          />
          <div className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-base bg-surface">
            <RotateCcw size={12} className="text-accent" aria-hidden />
          </div>
        </div>

        <h1 className="mb-2 text-xl font-bold tracking-tight text-fg">
          Rotate to landscape
        </h1>
        <p className="max-w-70 text-body leading-relaxed text-fg-muted">
          Switch is a wide Kanban workspace. Turn your device to landscape for
          the best experience, or open it on a tablet or desktop.
        </p>
      </div>

      <div data-rotate-content className="size-full">
        {children}
      </div>
    </>
  );
}
