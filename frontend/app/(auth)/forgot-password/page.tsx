"use client";

import { AuthField, AuthSubmit } from "@/components/auth/auth-fields";
import {
  AuthFooterLink,
  AuthHeader,
  AuthShell,
  AuthStatus,
} from "@/components/auth/auth-shell";
import { FormAlert } from "@/components/ui/feedback";
import { useForgotPassword } from "@/hooks/useAuth";
import { forgotPasswordSchema, type ForgotPasswordValues } from "@/lib/schemas/auth";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const { mutate: sendPasswordResetEmail, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = (values: ForgotPasswordValues) => {
    setServerError("");
    sendPasswordResetEmail(values.email, {
      onSuccess: () => setIsSent(true),
      onError: (error) => setServerError(getErrorMessage(error)),
    });
  };

  if (isSent) {
    return (
      <AuthShell>
        <AuthStatus
          tone="accent"
          icon={<MailCheck size={24} />}
          title="Check your email"
          description="We'll send a password reset link to your email address if it exists. The link will expire in 15 minutes."
        >
          <AuthFooterLink
            prompt="Remembered it?"
            href="/login"
            label="Back to login"
          />
        </AuthStatus>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthHeader
        title="Reset your password"
        description="Enter your email address and we'll send you a link to reset your password."
        backHref="/login"
        backLabel="Back to login"
      />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthField
          {...register("email")}
          label="Email address"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder="you@company.com"
          error={errors.email?.message}
        />

        {serverError && <FormAlert tone="danger">{serverError}</FormAlert>}

        <AuthSubmit loading={isPending} loadingLabel="Sending link...">
          Send reset link
        </AuthSubmit>
      </form>

      <AuthFooterLink
        prompt="Don't have an account?"
        href="/register"
        label="Create one free"
      />
    </AuthShell>
  );
}
