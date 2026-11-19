"use client";

import { AuthProviderButton } from "@/components/auth/auth-fields";
import { AuthFooterLink, AuthShell } from "@/components/auth/auth-shell";
import { GithubIcon, GoogleIcon } from "@/components/auth/auth-components";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useMe } from "@/hooks/useAuth";
import { Mail } from "lucide-react";
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
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="text-xl font-semibold tracking-tight text-fg">
          Welcome back
        </h1>
        <p className="mt-1.5 text-body text-fg-muted">
          Choose a sign-in method to continue.
        </p>
      </div>

      <div className="space-y-2.5">
        <AuthProviderButton
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          icon={<GoogleIcon />}
        >
          Continue with Google
        </AuthProviderButton>

        <AuthProviderButton
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/github`}
          icon={<GithubIcon />}
        >
          Continue with GitHub
        </AuthProviderButton>

        <AuthProviderButton href="/login/email" icon={<Mail size={16} />}>
          Continue with Email
        </AuthProviderButton>
      </div>

      <AuthFooterLink
        prompt="Don't have an account?"
        href="/register"
        label="Create one free"
      />
    </AuthShell>
  );
}
