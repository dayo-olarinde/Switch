"use client";

import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { LoginRequest, useLogin, useMe } from "@/hooks/useAuth";
import { ChevronLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function LoginEmailPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { data: user, isLoading: isUserLoading } = useMe();
  const router = useRouter();

  const { mutate: login, isPending, isSuccess } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  const handleLogin = (data: LoginRequest) => {
    login(data);
  };

  if (isUserLoading || user) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base p-4 font-sans text-on-accent selection:bg-accent-solid/30">
      <div className="flex items-center gap-3 mb-8">
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

      <div className="w-full max-w-105 bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-fg-muted hover:text-fg transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            Back to all options
          </Link>

          <h1 className="text-2xl font-bold text-fg tracking-tight mb-2">
            Sign in with email
          </h1>
          <p className="text-[13px] text-fg-muted">
            Enter your credentials to access your workspace.
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit(handleLogin)}>
          <div className="space-y-1.5">
            <label className="text-[13px] font-medium text-fg-secondary pl-1">
              Email address
            </label>
            <input
              {...register("email", { required: "Email is required" })}
              type="email"
              autoFocus
              placeholder="you@company.com"
              className="w-full h-11 bg-scrim border border-border-md rounded-xl px-4 text-[14px] text-fg placeholder:text-fg-muted focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-inner"
            />
            {errors.email && (
              <p className="text-[11px] text-danger pl-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between pl-1 pr-1">
              <label className="text-[13px] font-medium text-fg-secondary">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-[12px] font-medium text-accent hover:text-accent transition-colors"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                {...register("password", { required: "Password is required" })}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={isPending || isSuccess}
            className="w-full h-11 mt-4 bg-accent-solid hover:bg-accent-solid/90 disabled:bg-accent-solid/50 text-on-accent rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-accent active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {isPending || isSuccess ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isSuccess ? "Redirecting..." : "Signing in..."}{" "}
              </>
            ) : (
              "Sign in"
            )}
          </button>
        </form>
      </div>

      <div className="mt-8">
        <p className="text-[13px] text-fg-muted">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-fg hover:text-fg font-medium transition-colors"
          >
            Create one free
          </Link>
        </p>
      </div>
    </div>
  );
}
