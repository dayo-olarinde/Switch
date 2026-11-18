"use client";

import {
  AuthField,
  AuthPasswordField,
  AuthSubmit,
} from "@/components/auth/auth-fields";
import {
  AuthFooterLink,
  AuthShell,
  AuthStatus,
  AuthSteps,
} from "@/components/auth/auth-shell";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { FormAlert } from "@/components/ui/feedback";
import { useCompleteReg, useMe } from "@/hooks/useAuth";
import { useAcceptInvite } from "@/hooks/useInvitations";
import { onboardingSchema, type OnboardingValues } from "@/lib/schemas/auth";
import { getErrorMessage } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { data: user, isLoading } = useMe();

  const [serverError, setServerError] = useState("");
  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite();

  const {
    mutate: completeRegistration,
    isPending,
    isSuccess,
  } = useCompleteReg();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    },
  });

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

  const onFinish = (values: OnboardingValues) => {
    setServerError("");
    const userData = { email, ...values };

    completeRegistration(userData, {
      onError: (error) => setServerError(getErrorMessage(error)),
      onSuccess: () => {
        const inviteToken = searchParams.get("inviteToken");

        if (inviteToken) {
          acceptInvite(inviteToken, {
            onSuccess: (data) => {
              toast.info("Invitation accepted");
              router.push(`/${data?.workspaceSlug || "dashboard"}`);
            },
            onError: () => {
              router.push("/getting-you-started");
            },
          });
        } else {
          router.push("/getting-you-started");
        }
      },
    });
  };

  return (
    <AuthShell>
      <AuthSteps current={3} />

      <AuthStatus
        tone="success"
        icon={<Check size={24} strokeWidth={3} />}
        title="Email verified"
        description="One last step — set up your profile."
      />

      <form
        className="mt-6 space-y-4"
        onSubmit={handleSubmit(onFinish)}
        noValidate
      >
        <div className="grid grid-cols-2 gap-3">
          <AuthField
            {...register("firstName")}
            label="First name"
            required
            autoComplete="given-name"
            placeholder="Ada"
            error={errors.firstName?.message}
          />
          <AuthField
            {...register("lastName")}
            label="Last name"
            autoComplete="family-name"
            placeholder="Lovelace"
          />
        </div>

        <AuthPasswordField
          {...register("password")}
          label="Password"
          required
          autoComplete="new-password"
          placeholder="Min. 8 characters"
          error={errors.password?.message}
          toggleLabel="password"
        />

        <AuthPasswordField
          {...register("confirmPassword")}
          label="Confirm password"
          required
          autoComplete="new-password"
          placeholder="Repeat your password"
          error={errors.confirmPassword?.message}
          toggleLabel="confirmation"
        />

        {serverError && <FormAlert tone="danger">{serverError}</FormAlert>}

        <AuthSubmit
          loading={isPending || isSuccess || isAccepting}
          loadingLabel={isSuccess ? "Redirecting..." : "Creating account..."}
        >
          Create account
        </AuthSubmit>
      </form>

      <p className="mt-6 text-center text-[12px] leading-relaxed text-fg-muted">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="text-accent hover:opacity-85">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-accent hover:opacity-85">
          Privacy Policy
        </Link>
      </p>

      <AuthFooterLink
        prompt="Already have an account?"
        href="/login"
        label="Sign in"
      />
    </AuthShell>
  );
}

export default function CompleteRegisterPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <RegisterContent />
    </Suspense>
  );
}
