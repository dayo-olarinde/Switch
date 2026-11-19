import { cn } from "@/lib/utils";
import { AlertTriangle, CircleAlert, Info } from "lucide-react";
import { ReactNode } from "react";

export type NoticeTone = "danger" | "warning" | "info";

const TONES: Record<
  NoticeTone,
  { wrapper: string; icon: string; Icon: typeof Info }
> = {
  danger: {
    wrapper: "border-danger/35 bg-danger-dim text-danger",
    icon: "text-danger",
    Icon: CircleAlert,
  },
  warning: {
    wrapper: "border-warning/35 bg-warning-dim text-warning",
    icon: "text-warning",
    Icon: AlertTriangle,
  },
  info: {
    wrapper: "border-accent/35 bg-accent-dim text-accent",
    icon: "text-accent",
    Icon: Info,
  },
};

interface FormAlertProps {
  tone?: NoticeTone;
  children: ReactNode;
  className?: string;
}

export function FormAlert({
  tone = "danger",
  children,
  className,
}: FormAlertProps) {
  const { wrapper, icon, Icon } = TONES[tone];

  return (
    <div
      role="alert"
      className={cn(
        "flex items-start gap-2.5 rounded-lg border px-3 py-2.5",
        wrapper,
        className,
      )}
    >
      <Icon size={15} className={cn("mt-0.5 shrink-0", icon)} />
      <p className="text-body leading-relaxed">{children}</p>
    </div>
  );
}

interface InlineNoticeProps {
  tone?: NoticeTone;
  children: ReactNode;
  className?: string;
}

export function InlineNotice({
  tone = "danger",
  children,
  className,
}: InlineNoticeProps) {
  const { wrapper, icon, Icon } = TONES[tone];

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 rounded-xl border p-4",
        wrapper,
        className,
      )}
    >
      <Icon size={18} className={cn("shrink-0", icon)} />
      <div className="text-body leading-relaxed">{children}</div>
    </div>
  );
}

interface LoadErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

/** Blocking load failure: the request died, so there is nothing to show. */
export function LoadError({
  title = "Couldn't load this page",
  message = "Something went wrong while fetching data. Check your connection and try again.",
  onRetry,
  className,
}: LoadErrorProps) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-danger/35 bg-danger-dim px-6 py-14 text-center",
        className,
      )}
    >
      <span className="mb-4 flex size-11 items-center justify-center rounded-xl border border-danger/35 bg-surface text-danger">
        <CircleAlert size={18} aria-hidden />
      </span>
      <h2 className="text-body font-semibold text-fg">{title}</h2>
      <p className="mt-1 max-w-sm text-body leading-relaxed text-fg-muted">
        {message}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex h-8 items-center justify-center rounded-lg border border-border-md bg-surface px-3 text-body font-semibold text-fg transition-colors hover:border-border-lg hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          Try again
        </button>
      )}
    </div>
  );
}
