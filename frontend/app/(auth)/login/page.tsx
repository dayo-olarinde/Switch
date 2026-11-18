"use client";

import { GithubIcon, GoogleIcon } from "@/components/auth/auth-components";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useMe } from "@/hooks/useAuth";
import { Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginPage() {
  const { data: user, isLoading } = useMe();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (isLoading || user) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base p-4 font-sans text-fg selection:bg-accent-dim">
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
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-fg tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-[13px] text-fg-muted">
            Choose a sign-in method to continue.
          </p>
        </div>

        <div className="space-y-3 mb-2">
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="w-full h-11 flex items-center justify-center gap-3 bg-fill-2 hover:bg-fill-3 border border-border rounded-xl text-[14px] font-medium text-fg transition-all group"
          >
            <GoogleIcon />
            Continue with Google
          </a>

          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
            className="w-full h-11 flex items-center justify-center gap-3 bg-fill-2 hover:bg-fill-3 border border-border rounded-xl text-[14px] font-medium text-fg transition-all group"
          >
            <GithubIcon />
            Continue with GitHub
          </a>

          <div className="flex items-center gap-3 py-3">
            <div className="flex-1 h-px bg-fill-2"></div>
            <span className="text-[12px] font-medium text-fg-muted tracking-wide">
              or
            </span>
            <div className="flex-1 h-px bg-fill-2"></div>
          </div>

          <Link
            href="/login/email"
            className="w-full h-11 flex items-center justify-center gap-3 bg-fill-1 hover:bg-fill-2 border border-border rounded-xl text-[14px] font-medium text-fg transition-all group"
          >
            <Mail
              size={16}
              className="text-fg-muted group-hover:text-fg transition-colors"
            />
            Continue with Email
          </Link>
        </div>
      </div>

      <div className="mt-8 animate-in fade-in duration-500">
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
