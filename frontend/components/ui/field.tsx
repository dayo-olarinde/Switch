"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import {
  FieldFrame,
  controlClasses,
  describedBy,
} from "./field-frame";

export { FieldFrame, FieldLabel, controlClasses } from "./field-frame";

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  leading?: ReactNode;
  invalid?: boolean;
  wrapperClassName?: string;
  labelPlain?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      label,
      hint,
      error,
      leading,
      invalid,
      className,
      wrapperClassName,
      labelPlain,
      id,
      ...props
    },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const showInvalid = Boolean(error) || Boolean(invalid);

    return (
      <FieldFrame
        id={fieldId}
        label={label}
        required={props.required}
        labelPlain={labelPlain}
        hint={hint}
        error={error}
        className={wrapperClassName}
      >
        <div className="relative">
          {leading && (
            <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-fg-muted">
              {leading}
            </span>
          )}
          <input
            {...props}
            id={fieldId}
            ref={ref}
            aria-invalid={showInvalid || undefined}
            aria-describedby={describedBy(fieldId, error, hint)}
            className={cn(
              controlClasses,
              "h-10 px-3",
              Boolean(leading) && "pl-9",
              showInvalid && "border-danger focus:border-danger",
              className,
            )}
          />
        </div>
      </FieldFrame>
    );
  },
);

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  invalid?: boolean;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextArea(
    { label, hint, error, invalid, className, id, rows = 3, ...props },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;
    const showInvalid = Boolean(error) || Boolean(invalid);

    return (
      <FieldFrame
        id={fieldId}
        label={label}
        required={props.required}
        hint={hint}
        error={error}
      >
        <textarea
          {...props}
          id={fieldId}
          ref={ref}
          rows={rows}
          aria-invalid={showInvalid || undefined}
          aria-describedby={describedBy(fieldId, error, hint)}
          className={cn(
            controlClasses,
            "resize-none px-3 py-2.5",
            showInvalid && "border-danger focus:border-danger",
            className,
          )}
        />
      </FieldFrame>
    );
  },
);

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: ReactNode;
  hint?: ReactNode;
  error?: string;
  wrapperClassName?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  function Select(
    { label, hint, error, className, wrapperClassName, id, children, ...props },
    ref,
  ) {
    const generatedId = useId();
    const fieldId = id ?? generatedId;

    return (
      <FieldFrame
        id={fieldId}
        label={label}
        required={props.required}
        hint={hint}
        error={error}
        className={wrapperClassName}
      >
        <div className="relative">
          <select
            {...props}
            id={fieldId}
            ref={ref}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(fieldId, error, hint)}
            className={cn(
              controlClasses,
              "h-10 cursor-pointer appearance-none pr-8 pl-3",
              error && "border-danger focus:border-danger",
              className,
            )}
          >
            {children}
          </select>
          <ChevronDown
            size={14}
            aria-hidden
            className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-fg-muted"
          />
        </div>
      </FieldFrame>
    );
  },
);
