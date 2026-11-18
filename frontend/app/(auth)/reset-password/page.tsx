"use client";

import {
  AuthPasswordField,
  AuthSubmit,
} from "@/components/auth/auth-fields";
import {
  AuthHeader,
  AuthShell,
  AuthStatus,
} from "@/components/auth/auth-shell";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { FormAlert } from "@/components/ui/feedback";
import { useResetPassword } from "@/hooks/useAuth";
import { resetPasswordSchema, type ResetPasswordValues } from "@/lib/schemas/auth";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";

const primaryLink =
  "flex h-11 w-full items-center justify-center rounded-lg bg-accent-solid text-sm font-semibold text-on-accent transition-opacity hover:opacity-90";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const onSubmit = async (values: ResetPasswordValues) => {
    setServerError("");
    try {
      await resetPassword(values);
      setIsSuccess(true);
    } catch (error) {
      setServerError(getErrorMessage(error));
    }
  };

  if (!token) {
    return (
      <AuthShell>
        <AuthStatus
          tone="danger"
          icon={<XCircle size={24} />}
          title="Invalid link"
          description="This password reset link is missing or invalid. Please request a new one."
        >
          <Link href="/forgot-password" className={primaryLink}>
            Request new link
          </Link>
        </AuthStatus>
      </AuthShell>
    );
  }

  if (isSuccess) {
    return (
      <AuthShell>
        <AuthStatus
          tone="success"
          icon={<CheckCircle2 size={24} />}
          title="Password updated"
          description="Your password has been successfully reset. You can now use your new password to sign in."
        >
          <Link href="/login/email" className={primaryLink}>
            Back to login
          </Link>
        </AuthStatus>
      </AuthShell>
    );
  }

  return (
    <AuthShell>
      <AuthHeader
        title="Set new password"
        description="Please enter your new password below."
      />

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <AuthPasswordField
          {...register("newPassword")}
          label="New password"
          autoComplete="new-password"
          autoFocus
          placeholder="Enter a new password"
          error={errors.newPassword?.message}
        />

        <AuthPasswordField
          {...register("confirmNewPassword")}
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your new password"
          error={errors.confirmNewPassword?.message}
          toggleLabel="confirmation"
        />

        {serverError && <FormAlert tone="danger">{serverError}</FormAlert>}

        <AuthSubmit loading={isPending} loadingLabel="Resetting...">
          Reset password
        </AuthSubmit>
      </form>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
