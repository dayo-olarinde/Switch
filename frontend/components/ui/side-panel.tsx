"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode, useEffect, useId, useRef } from "react";

const SIDES = {
  right: "ml-auto h-full border-l",
  left: "mr-auto h-full border-r",
} as const;

const WIDTHS = {
  sm: "w-full max-w-md",
  md: "w-full max-w-lg",
  lg: "w-full max-w-2xl",
  xl: "w-full max-w-215",
} as const;

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  shouldCloseOnEscape?: () => boolean;
  title?: string;
  description?: string;
  side?: keyof typeof SIDES;
  width?: keyof typeof WIDTHS;
  headerless?: boolean;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

export function SidePanel({
  open,
  onClose,
  title,
  description,
  side = "right",
  width = "md",
  headerless = false,
  shouldCloseOnEscape,
  footer,
  className,
  bodyClassName,
  children,
}: SidePanelProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const handleCancel = (event: Event) => {
      event.preventDefault();
      if (shouldCloseOnEscape && !shouldCloseOnEscape()) return;
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose, shouldCloseOnEscape]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-0 max-h-none border-border-md bg-surface p-0 text-fg panel-elevated",
        "backdrop:bg-scrim backdrop:backdrop-blur-sm",
        "open:animate-in open:duration-200 open:ease-out",
        side === "right" ? "open:slide-in-from-right" : "open:slide-in-from-left",
        SIDES[side],
        WIDTHS[width],
        className,
      )}
    >
      {open && (
        <div className="flex h-full flex-col">
          {!headerless && (
            <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div className="min-w-0">
                {title && (
                  <h2
                    id={titleId}
                    className="truncate text-headline font-semibold text-fg"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className={cn(
                      "text-body leading-relaxed text-fg-secondary",
                      title && "mt-1",
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="-mr-1 flex size-8 shrink-0 items-center justify-center rounded-lg text-fg-muted transition-colors hover:bg-fill-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                <X size={16} />
              </button>
            </header>
          )}

          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto",
              !headerless && "px-5 py-4",
              bodyClassName,
            )}
          >
            {children}
          </div>

          {footer && (
            <footer className="flex items-center justify-end gap-2 border-t border-border px-5 py-4">
              {footer}
            </footer>
          )}
        </div>
      )}
    </dialog>
  );
}
