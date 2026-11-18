"use client";

import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import { ReactNode, useEffect, useId, useRef } from "react";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export type DialogSize = keyof typeof SIZES;

interface DialogShellProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: DialogSize;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
  headerless?: boolean;
  ariaLabel?: string;
  children?: ReactNode;
}

/**
 * Native <dialog> wrapper: the browser handles focus trapping, Escape and
 * inertness. Height is capped so long bodies scroll inside the card.
 */
export function DialogShell({
  open,
  onClose,
  title,
  description,
  size = "md",
  footer,
  className,
  bodyClassName,
  headerless = false,
  ariaLabel,
  children,
}: DialogShellProps) {
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
      onClose();
    };

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      aria-label={!title ? ariaLabel : undefined}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
      className={cn(
        "m-auto w-11/12 rounded-xl border border-border bg-surface p-0 text-fg",
        "backdrop:bg-scrim backdrop:backdrop-blur-sm",
        "open:animate-in open:fade-in-0 open:zoom-in-95 open:duration-150",
        SIZES[size],
        className,
      )}
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-4rem)] flex-col">
          {!headerless && (
            <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4">
              <div className="min-w-0">
                {title && (
                  <h2 id={titleId} className="text-sm font-semibold text-fg">
                    {title}
                  </h2>
                )}
                {description && (
                  <p
                    id={descriptionId}
                    className={cn(
                      "text-sm leading-relaxed text-fg-secondary",
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
                aria-label="Close dialog"
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

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "accent";
  isPending?: boolean;
  children?: ReactNode;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  tone = "danger",
  isPending = false,
  children,
}: ConfirmDialogProps) {
  return (
    <DialogShell
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="h-10 rounded-lg border border-border-md px-4 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className={cn(
              "h-10 rounded-lg border px-4 text-sm font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:opacity-50",
              tone === "danger"
                ? "border-danger bg-danger-dim text-danger hover:bg-danger/25"
                : "border-accent bg-accent-dim text-accent hover:bg-accent/25",
            )}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {children ?? (
        <p className="text-sm leading-relaxed text-fg-secondary">
          {description ??
            "This action cannot be undone. Are you sure you want to continue?"}
        </p>
      )}
    </DialogShell>
  );
}
