"use client";

import {
  AuthField,
  AuthPasswordField,
  AuthSubmit,
} from "@/components/auth/auth-fields";
import { AuthFooterLink, AuthHeader, AuthShell } from "@/components/auth/auth-shell";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { FormAlert } from "@/components/ui/feedback";
import { useLogin, useMe } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { loginSchema, type LoginValues } from "@/lib/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginEmailPage() {
  const { data: user, isLoading: isUserLoading } = useMe();
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { mutate: login, isPending, isSuccess } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (isUserLoading || user) {
    return <FullScreenLoader />;
  }

  const onSubmit = (values: LoginValues) => {
    setServerError("");
    login(values, {
      onError: (error) => setServerError(getErrorMessage(error)),
    });
  };

  return (
    <AuthShell>
      <AuthHeader
        title="Sign in with email"
        description="Enter your credentials to access your workspace."
        backHref="/login"
        backLabel="Back to all options"
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

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[13px] font-medium text-fg-secondary">
              Password
            </span>
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-accent transition-opacity hover:opacity-85"
            >
              Forgot password?
            </Link>
          </div>
          <AuthPasswordField
            {...register("password")}
            id="login-password"
            label="Password"
            hideLabel
            autoComplete="current-password"
            placeholder="Enter your password"
            error={errors.password?.message}
          />
        </div>

        {serverError && (
          <FormAlert tone="danger">{serverError}</FormAlert>
        )}

        <AuthSubmit loading={isPending || isSuccess} loadingLabel={isSuccess ? "Redirecting..." : "Signing in..."}>
          Sign in
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
