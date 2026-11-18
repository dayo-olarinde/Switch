"use client";

import {
  AuthField,
  AuthProviderButton,
  AuthSubmit,
} from "@/components/auth/auth-fields";
import {
  AuthDivider,
  AuthFooterLink,
  AuthHeader,
  AuthShell,
  AuthSteps,
} from "@/components/auth/auth-shell";
import { GithubIcon, GoogleIcon } from "@/components/auth/auth-components";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { FormAlert } from "@/components/ui/feedback";
import { useInitialiseReg, useMe } from "@/hooks/useAuth";
import { registerEmailSchema, type RegisterEmailValues } from "@/lib/schemas/auth";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function SignupContent() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [serverError, setServerError] = useState("");
  const { mutate: sendOtp, isPending, isSuccess } = useInitialiseReg();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterEmailValues>({
    resolver: zodResolver(registerEmailSchema),
    defaultValues: { email: "" },
  });

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (isLoading || user) {
    return <FullScreenLoader />;
  }

  const handleSignup = (values: RegisterEmailValues) => {
    setServerError("");
    sendOtp(
      { email: values.email, token: inviteToken || "" },
      { onError: (error) => setServerError(getErrorMessage(error)) },
    );
  };

  const handleSocialAuth = (provider: "google" | "github") => {
    setIsRedirecting(true);
    const state = inviteToken ? `inviteToken=${inviteToken}` : "";
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}${state ? `?state=${encodeURIComponent(state)}` : ""}`;
  };

  return (
    <AuthShell>
      <AuthSteps current={1} />

      <AuthHeader
        title="Create your account"
        description="Start with your work email address. We'll send a verification code."
      />

      <div className="space-y-2.5">
        <AuthProviderButton
          onClick={() => handleSocialAuth("google")}
          disabled={isRedirecting || isPending || isSuccess}
          icon={<GoogleIcon />}
        >
          Sign up with Google
        </AuthProviderButton>

        <AuthProviderButton
          onClick={() => handleSocialAuth("github")}
          disabled={isRedirecting || isPending || isSuccess}
          icon={<GithubIcon />}
        >
          Sign up with GitHub
        </AuthProviderButton>
      </div>

      <AuthDivider label="or use email" />

      <form className="space-y-4" onSubmit={handleSubmit(handleSignup)} noValidate>
        <AuthField
          {...register("email")}
          label="Work email"
          required
          type="email"
          autoComplete="email"
          placeholder="you@company.com"
          hint="We'll send a 6-digit code to verify this address."
          error={errors.email?.message}
        />

        {serverError && <FormAlert tone="danger">{serverError}</FormAlert>}

        <AuthSubmit
          loading={isPending || isSuccess || isRedirecting}
          loadingLabel={
            isRedirecting
              ? "Redirecting..."
              : isSuccess
                ? "Redirecting..."
                : "Sending code..."
          }
        >
          Continue
          <ArrowRight size={16} />
        </AuthSubmit>
      </form>

      <AuthFooterLink
        prompt="Already have an account?"
        href="/login"
        label="Sign in"
      />
    </AuthShell>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <SignupContent />
    </Suspense>
  );
}
