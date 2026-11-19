"use client";

import { OtpInput } from "@/components/auth/otp-input";
import { AuthSubmit } from "@/components/auth/auth-fields";
import {
  AuthFooterLink,
  AuthHeader,
  AuthShell,
  AuthSteps,
} from "@/components/auth/auth-shell";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { FormAlert } from "@/components/ui/feedback";
import { useMe, useResendOtp, useVerifyReg } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/utils";
import { verifyOtpSchema } from "@/lib/schemas/auth";
import { ChevronLeft, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const inviteToken = searchParams.get("inviteToken");
  const { data: user, isLoading } = useMe();

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    isSuccess,
  } = useVerifyReg();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  useEffect(() => {
    const interval = setInterval(
      () => setTimer((seconds) => (seconds > 0 ? seconds - 1 : 0)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!email) router.replace("/register");
  }, [email, router]);

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (isLoading || user) {
    return <FullScreenLoader />;
  }

  if (!email) return null;

  const submit = (value: string) => {
    const parsed = verifyOtpSchema.safeParse({ code: value });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Enter the 6-digit code");
      return;
    }
    if (isVerifying) return;
    setError("");

    verifyOtp(
      { email, code: value, token: inviteToken ?? "" },
      {
        onError: (err) => {
          setError(getErrorMessage(err));
          setCode("");
        },
      },
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit(code);
  };

  const handleResend = () => {
    if (timer > 0 || isResending) return;

    resendOtp(email, { onSuccess: () => setTimer(60) });
  };

  return (
    <AuthShell>
      <AuthSteps current={2} />

      <AuthHeader title="Check your inbox" />

      <div className="mb-6 flex items-center gap-3 rounded-xl border border-border bg-fill-1 p-4">
        <Mail size={20} className="shrink-0 text-accent" />
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium text-fg">{email}</span>
          <span className="text-2xs text-fg-muted">
            6-digit code sent · expires in 10 min
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <OtpInput
          value={code}
          onChange={setCode}
          invalid={Boolean(error)}
          autoFocus
          onComplete={submit}
        />

        {error && <FormAlert tone="danger">{error}</FormAlert>}

        <AuthSubmit
          loading={isVerifying || isSuccess}
          loadingLabel={isSuccess ? "Redirecting..." : "Verifying..."}
          disabled={code.length !== 6}
        >
          Verify code
        </AuthSubmit>
      </form>

      <div className="mt-6 flex flex-col items-center gap-3 text-body">
        <p className="text-fg-muted">
          Didn&apos;t get it?{" "}
          {timer > 0 ? (
            <span className="ml-1">Wait {timer}s</span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="ml-1 font-medium text-accent transition-opacity hover:opacity-85 disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend code"}
            </button>
          )}
        </p>

        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 font-medium text-fg-muted transition-colors hover:text-fg-secondary"
        >
          <ChevronLeft size={14} />
          Change email
        </button>
      </div>

      <AuthFooterLink
        prompt="Already verified?"
        href="/login"
        label="Sign in"
      />
    </AuthShell>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <VerifyContent />
    </Suspense>
  );
}
