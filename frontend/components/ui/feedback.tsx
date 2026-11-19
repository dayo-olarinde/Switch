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
