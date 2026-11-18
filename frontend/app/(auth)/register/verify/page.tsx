"use client";

import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useMe, useResendOtp, useVerifyReg } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, ChevronLeft, Loader2, Mail } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useRef, useState, Suspense } from "react";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const { data: user, isLoading } = useMe();

  const inviteToken = searchParams.get("inviteToken");

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);

  const {
    mutate: verifyOtp,
    isPending: isVerifying,
    isSuccess,
  } = useVerifyReg();
  const { mutate: resendOtp, isPending: isResending } = useResendOtp();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

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

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6)
      .split("");
    if (pastedData.length === 0) return;

    const newCode = [...code];
    pastedData.forEach((char, i) => {
      if (i < 6) newCode[i] = char;
    });
    setCode(newCode);
    setError("");

    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");

    if (fullCode.length !== 6 || isVerifying || !email) return;
    setError("");

    verifyOtp(
      { email, code: fullCode, token: inviteToken ?? "" },
      {
        onError: (err: any) => {
          setError(
            err?.response?.data?.message || "Invalid verification code.",
          );
          setCode(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        },
      },
    );
  };

  const handleResend = async () => {
    if (timer > 0 || !email || isResending) return;

    resendOtp(email, {
      onSuccess: () => {
        setTimer(60);
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

      <div className="w-full max-w-105 bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center shadow-sm">
              <Check size={14} strokeWidth={3} className="text-on-accent" />
            </div>
            <span className="text-[12px] font-bold text-success">Email</span>
          </div>

          <div className="flex-1 h-px bg-success/30 mx-3"></div>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-accent-solid flex items-center justify-center text-[11px] font-bold text-on-accent shadow-sm">
              2
            </div>
            <span className="text-[12px] font-bold text-fg">Verify</span>
          </div>

          <div className="flex-1 h-px bg-fill-3 mx-3"></div>

          <div className="flex items-center gap-2 opacity-40">
            <div className="w-6 h-6 rounded-full border border-border-lg flex items-center justify-center text-[11px] font-bold text-fg">
              3
            </div>
            <span className="text-[12px] font-medium text-fg">Profile</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-fg tracking-tight mb-6">
          Check your inbox
        </h1>

        <div className="w-full bg-fill-1 border border-border rounded-xl p-4 flex items-center gap-4 mb-8">
          <Mail size={20} className="text-accent" />
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-fg truncate max-w-70">
              {email}
            </span>
            <span className="text-[12px] text-fg-muted">
              6-digit code sent - expires in 10 min
            </span>
          </div>
        </div>

        <form onSubmit={handleVerify} className="flex flex-col items-center">
          <div className="w-full flex justify-between gap-2 mb-3">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) =>
                  handleChange(index, e.target.value.replace(/\D/g, ""))
                }
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className={cn(
                  "w-full aspect-square bg-scrim border border-border-md rounded-xl text-center text-xl font-bold text-fg focus:outline-none focus:border-accent/50 focus:ring-4 focus:ring-accent/10 transition-all shadow-inner",
                  error &&
                    "border-danger focus:border-danger focus:ring-accent",
                )}
              />
            ))}
          </div>

          <p className="text-[12px] text-fg-muted text-center mb-6">
            Enter the 6-digit code from your email
          </p>

          {error && (
            <p className="text-[13px] text-danger mb-4 font-medium text-center bg-danger-dim py-2 px-4 rounded-lg w-full border border-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={code.join("").length !== 6 || isVerifying || isSuccess}
            className="w-full h-11 bg-accent-dim hover:bg-accent-dim disabled:bg-accent-dim disabled:cursor-not-allowed text-accent disabled:text-accent/50 rounded-xl text-[14px] font-semibold transition-all flex items-center justify-center gap-2 group"
          >
            {isVerifying || isSuccess ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {isSuccess ? "Redirecting..." : "Verifying..."}{" "}
              </>
            ) : (
              <>
                Verify code
                <ChevronDown size={16} className="text-accent/70" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col items-center gap-5">
          <p className="text-[13px] text-fg-muted">
            Didn't get it?{" "}
            {timer > 0 ? (
              <span className="text-fg-muted ml-1">Wait {timer}s</span>
            ) : (
              <button
                onClick={handleResend}
                disabled={isResending}
                className="text-accent hover:text-accent font-medium transition-colors ml-1 disabled:opacity-50"
              >
                {isResending ? "Sending..." : "Resend code"}{" "}
              </button>
            )}
          </p>

          <button
            onClick={() => router.back()}
            type="button"
            className="text-[13px] font-medium text-fg-muted hover:text-fg-secondary transition-colors flex items-center gap-1.5"
          >
            <ChevronLeft size={14} />
            Change email
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<FullScreenLoader />}>
      <VerifyContent />
    </Suspense>
  );
}
