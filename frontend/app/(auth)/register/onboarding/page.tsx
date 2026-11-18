"use client";

import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useCompleteReg, useMe } from "@/hooks/useAuth";
import { useAcceptInvite } from "@/hooks/useInvitations";
import { ArrowRight, Check, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export interface FormValues {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { data: user, isLoading } = useMe();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite();

  const {
    mutate: completeRegistration,
    isPending,
    isSuccess,
  } = useCompleteReg();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>();

  const password = watch("password");

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

  const onFinish = (data: FormValues) => {
    if (!email) return;
    const userData = { email, ...data };
    completeRegistration(userData, {
      onSuccess: () => {
        const inviteToken = searchParams.get("inviteToken");

        if (inviteToken) {
          acceptInvite(inviteToken, {
            onSuccess: (workspaceSlug) => {
              toast.info("Invitation accepted");
              router.push(`/${workspaceSlug || "dashboard"}`);
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

  if (!email) return null;

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
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-sm">
              <Check size={14} strokeWidth={3} className="text-on-accent" />
            </div>
            <span className="text-[12px] font-bold text-success">Email</span>
          </div>

          <div className="flex-1 h-px bg-success/30 mx-3"></div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-sm">
              <Check size={14} strokeWidth={3} className="text-on-accent" />
            </div>
            <span className="text-[12px] font-bold text-success">Verify</span>
          </div>

          <div className="flex-1 h-px bg-success/30 mx-3"></div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-solid flex items-center justify-center text-[11px] font-bold text-on-accent shadow-sm">
              3
            </div>
            <span className="text-[12px] font-bold text-fg">Profile</span>
          </div>
        </div>

        <div className="flex flex-col items-center mb-8 text-center">
          <div className="w-14 h-14 rounded-full bg-success/10 border-2 border-success/20 flex items-center justify-center mb-4">
            <Check size={24} strokeWidth={3} className="text-success" />
          </div>
          <h1 className="text-xl font-bold text-fg tracking-tight mb-2">
            Email verified!
          </h1>
          <p className="text-[13px] text-fg-muted">
            One last step — set up your profile.
          </p>
        </div>

        <form onSubmit={handleSubmit(onFinish)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg-secondary pl-1 flex items-center gap-1">
              Full name
              <span className="text-accent text-lg leading-none">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <input
                  {...register("firstName", {
                    required: "First name required",
                  })}
                  type="text"
                  placeholder="First name"
                  className="w-full h-11 bg-scrim border border-border-md rounded-xl px-4 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-inner"
                />
                {errors.firstName && (
                  <p className="absolute -bottom-4 left-1 text-[10px] text-danger">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div className="relative">
                <input
                  {...register("lastName")}
                  type="text"
                  placeholder="Last name"
                  className="w-full h-11 bg-scrim border border-border-md rounded-xl px-4 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-inner"
                />
              </div>
            </div>
          </div>
          <div className="h-2"></div>{" "}
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg-secondary pl-1 flex items-center gap-1">
              Password
              <span className="text-accent text-lg leading-none">*</span>
            </label>
            <div className="relative">
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Must be at least 8 characters",
                  },
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="w-full h-11 bg-scrim border border-border-md rounded-xl pl-4 pr-10 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg-secondary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-danger pl-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg-secondary pl-1 flex items-center gap-1">
              Confirm password
              <span className="text-accent text-lg leading-none">*</span>
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (v) => v === password || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Repeat your password"
                className="w-full h-11 bg-scrim border border-border-md rounded-xl pl-4 pr-10 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg-secondary transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-[11px] text-danger pl-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={isPending || isSuccess || isAccepting}
            className="w-full h-11 mt-6 bg-accent-solid hover:bg-accent-solid/90 disabled:bg-accent-solid/50 text-on-accent rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-accent active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            {isPending || isSuccess ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isSuccess ? "Redirecting..." : "Creating account..."}
              </>
            ) : (
              <>
                Create account
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="mt-6 text-center animate-in fade-in duration-500 ">
        <p className="text-[12px] text-fg-muted">
          By creating an account you agree to our{" "}
          <Link
            href="/terms"
            className="text-accent hover:text-accent transition-colors"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-accent hover:text-accent transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function CompleteRegisterPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <RegisterContent />
    </Suspense>
  );
}
