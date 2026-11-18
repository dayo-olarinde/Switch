"use client";

import { GithubIcon, GoogleIcon } from "@/components/auth/auth-components";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useInitialiseReg, useMe } from "@/hooks/useAuth";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface SignupInitiateRequest {
  email: string;
}

function SignupContent() {
  const router = useRouter();
  const { data: user, isLoading } = useMe();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("inviteToken");

  const [isRedirecting, setIsRedirecting] = useState(false);
  const { mutate: sendOtp, isPending, isSuccess } = useInitialiseReg();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInitiateRequest>();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (isLoading || user) {
    return <FullScreenLoader />;
  }

  const handleSignup = async (data: SignupInitiateRequest) => {
    sendOtp({ email: data.email, token: inviteToken || "" });
  };

  const handleSocialAuth = (provider: "google" | "github") => {
    setIsRedirecting(true);
    const state = inviteToken ? `inviteToken=${inviteToken}` : "";
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/${provider}${state ? `?state=${encodeURIComponent(state)}` : ""}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base p-4 font-sans text-on-accent selection:bg-accent-solid/30">
      <div className="flex items-center gap-3 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-10 h-10 rounded-xl bg-accent-solid flex items-center justify-center text-on-accent text-lg font-black shadow-lg shadow-accent">
          <Image
            src="/logo.svg"
            alt="Switch Logo"
            width={32}
            height={32}
            priority
          />
        </div>
        <span className="text-2xl font-bold tracking-tight text-fg">
          Switch
        </span>
      </div>

      <div className="w-full max-w-105 bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500 ">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-solid flex items-center justify-center text-[11px] font-bold text-on-accent shadow-sm">
              1
            </div>
            <span className="text-[12px] font-bold text-fg">Email</span>
          </div>

          <div className="flex-1 h-px bg-fill-3 mx-3"></div>

          <div className="flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 rounded-full border border-border-lg flex items-center justify-center text-[11px] font-bold text-fg">
              2
            </div>
            <span className="text-[12px] font-medium text-fg">Verify</span>
          </div>

          <div className="flex-1 h-px bg-fill-3 mx-3"></div>

          <div className="flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 rounded-full border border-border-lg flex items-center justify-center text-[11px] font-bold text-fg">
              3
            </div>
            <span className="text-[12px] font-medium text-fg">Profile</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-fg tracking-tight mb-2">
            Create your account
          </h1>
          <p className="text-[13px] text-fg-muted leading-relaxed">
            Start with your work email address. We'll send a verification code.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialAuth("google")}
            disabled={isRedirecting || isPending || isSuccess}
            className="w-full h-11 flex items-center justify-center gap-3 bg-fill-2 hover:bg-fill-3 border border-border rounded-xl text-[14px] font-medium text-fg transition-all group"
          >
            <GoogleIcon />
            Sign up with Google
          </button>

          <button
            onClick={() => handleSocialAuth("github")}
            disabled={isRedirecting || isPending || isSuccess}
            className="w-full h-11 flex items-center justify-center gap-3 bg-fill-2 hover:bg-fill-3 border border-border rounded-xl text-[14px] font-medium text-fg transition-all group"
          >
            <GithubIcon />
            Sign up with GitHub
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-fill-2"></div>
          <span className="text-[12px] font-medium text-fg-muted tracking-wide">
            or use email
          </span>
          <div className="flex-1 h-px bg-fill-2"></div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleSignup)}>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg-secondary pl-1 flex items-center gap-1">
              Work email
              <span className="text-accent text-lg leading-none">*</span>
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              type="email"
              placeholder="you@company.com"
              className="w-full h-11 bg-scrim border border-border-md rounded-xl px-4 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-inner"
            />
            {errors.email ? (
              <p className="text-[11px] text-danger pl-1">
                {errors.email.message}
              </p>
            ) : (
              <p className="text-[11px] text-fg-muted pl-1 pt-0.5">
                We'll send a 6-digit code to verify this address.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || isSuccess}
            className="w-full h-11 mt-4 bg-accent-solid hover:bg-accent-solid/90 disabled:bg-accent-solid/50 text-on-accent rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-accent active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            {isPending || isSuccess ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isSuccess ? "Redirecting..." : "Sending code..."}{" "}
              </>
            ) : (
              <>
                Continue
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-8 animate-in fade-in duration-500">
        <p className="text-[13px] text-fg-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent font-medium transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <SignupContent />
    </Suspense>
  );
}
