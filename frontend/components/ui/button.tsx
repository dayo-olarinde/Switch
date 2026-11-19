import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md";

const VARIANTS: Record<ButtonVariant, string> = {
  primary:
    "border border-transparent bg-accent-solid text-on-accent hover:bg-accent-solid/90 active:bg-accent-solid/80",
  secondary:
    "border border-border-md bg-fill-1 text-fg hover:border-border-lg hover:bg-fill-2 active:bg-fill-3",
  ghost:
    "border border-transparent text-fg-secondary hover:bg-fill-2 hover:text-fg active:bg-fill-3",
  danger:
    "border border-danger/40 bg-danger-dim text-danger hover:border-danger/60 hover:bg-danger-dim/80 active:bg-danger-dim",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-2.5 text-body",
  md: "h-10 gap-2 px-4 text-body",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      className,
      children,
      disabled,
      ...props
    },
    ref,
  ) {
    return (
      <button
        {...props}
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-semibold whitespace-nowrap transition-colors",
          "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
      >
        {loading ? (
          <>
            <Loader2 size={size === "sm" ? 13 : 15} className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {icon}
            {children}
          </>
        )}
      </button>
    );
  },
);
