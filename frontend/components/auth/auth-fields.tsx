"use client";

import { cn } from "@/lib/utils";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { InputHTMLAttributes, ReactNode, forwardRef, useId, useState } from "react";

const fieldBase =
  "w-full rounded-lg border bg-fill-1 px-3 text-sm text-fg transition-colors outline-none placeholder:text-fg-muted focus:border-accent disabled:cursor-not-allowed disabled:opacity-60";

interface AuthFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  trailing?: ReactNode;
  hideLabel?: boolean;
}

export const AuthField = forwardRef<HTMLInputElement, AuthFieldProps>(
  function AuthField(
    {
      label,
      hint,
      error,
      required,
      trailing,
      hideLabel = false,
      className,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const describedBy = error
      ? `${fieldId}-error`
      : hint
        ? `${fieldId}-hint`
        : undefined;

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className={cn(
              "flex items-center gap-1 text-[13px] font-medium text-fg-secondary",
              hideLabel && "sr-only",
            )}
          >
            {label}
            {required && <span className="text-accent">*</span>}
          </label>
        )}

        <div className="relative">
          <input
            {...props}
            id={fieldId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            className={cn(
              fieldBase,
              "h-11",
              trailing && "pr-10",
              error && "border-danger focus:border-danger",
              className,
            )}
          />
          {trailing && (
            <div className="absolute top-1/2 right-2 -translate-y-1/2">
              {trailing}
            </div>
          )}
        </div>

        {error ? (
          <p id={`${fieldId}-error`} className="text-[11px] text-danger">
            {error}
          </p>
        ) : hint ? (
          <p id={`${fieldId}-hint`} className="text-[11px] text-fg-muted">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

interface AuthPasswordFieldProps
  extends Omit<AuthFieldProps, "type" | "trailing"> {
  toggleLabel?: string;
}

export const AuthPasswordField = forwardRef<
  HTMLInputElement,
  AuthPasswordFieldProps
>(function AuthPasswordField({ toggleLabel = "password", ...props }, ref) {
  const [visible, setVisible] = useState(false);

  return (
    <AuthField
      {...props}
      ref={ref}
      type={visible ? "text" : "password"}
      trailing={
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={`${visible ? "Hide" : "Show"} ${toggleLabel}`}
          tabIndex={-1}
          className="flex size-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  );
});

interface AuthSubmitProps {
  children: ReactNode;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function AuthSubmit({
  children,
  loading = false,
  loadingLabel = "Please wait...",
  disabled,
  className,
}: AuthSubmitProps) {
  return (
    <button
      type="submit"
      disabled={disabled || loading}
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent-solid text-sm font-semibold text-on-accent transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-card focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {loading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}

interface AuthProviderButtonProps {
  icon: ReactNode;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  disabled?: boolean;
}

export function AuthProviderButton({
  icon,
  children,
  onClick,
  href,
  disabled,
}: AuthProviderButtonProps) {
  const className =
    "flex h-11 w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-fill-1 text-sm font-medium text-fg transition-colors hover:bg-fill-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50";

  if (href) {
    return (
      <a href={href} className={className}>
        {icon}
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} disabled={disabled} className={className}>
      {icon}
      {children}
    </button>
  );
}
