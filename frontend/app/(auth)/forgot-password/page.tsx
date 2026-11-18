"use client";

import { useForgotPassword } from "@/hooks/useAuth";
import { ChevronLeft, Loader2, MailCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface ForgotPasswordRequest {
  email: string;
}

export default function ForgotPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: sendPasswordResetEmail, isPending } = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordRequest>();

  const onSubmit = async (data: ForgotPasswordRequest) => {
    sendPasswordResetEmail(data.email);
    setIsSuccess(true);
  };

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

      <div className="w-full max-w-md bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8">
          <Link
            href="/login"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-fg-muted hover:text-fg transition-colors mb-6"
          >
            <ChevronLeft size={16} />
            Back to login
          </Link>

          {!isSuccess ? (
            <>
              <h1 className="text-2xl font-bold text-fg tracking-tight mb-2">
                Reset your password
              </h1>
              <p className="text-[13px] text-fg-muted">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-12 h-12 rounded-full bg-accent-solid/10 flex items-center justify-center mb-4">
                <MailCheck className="text-accent" size={24} />
              </div>
              <h1 className="text-2xl font-bold text-fg tracking-tight mb-2">
                Check your email
              </h1>
              <p className="text-[13px] text-fg-muted">
                We'll send a password reset link to your email address if it
                exists. The link will expire in 15 minutes.
              </p>
            </div>
          )}
        </div>

        {!isSuccess && (
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-fg-secondary pl-1">
                Email address
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

            <button
              type="submit"
              disabled={isPending}
              className="w-full h-11 mt-4 bg-accent-solid hover:bg-accent-solid/90 disabled:bg-accent-solid/50 text-on-accent rounded-xl text-[14px] font-semibold transition-all shadow-lg shadow-accent active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending link...
                </>
              ) : (
                "Send reset link"
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
