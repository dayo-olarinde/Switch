"use client";

import { useMe } from "@/hooks/useAuth";
import { useAcceptInvite, useVerifyInvite } from "@/hooks/useInvitations";
import { ArrowRight, Loader2, MailOpen, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";

function AcceptInviteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    data: inviteDetails,
    isLoading: isVerifying,
    isError: isVerifyError,
    error: verifyError,
  } = useVerifyInvite(token);

  const { mutate: acceptInvite, isPending: isAccepting } = useAcceptInvite();

  useEffect(() => {
    if (!token || !inviteDetails || isAccepting) return;

    acceptInvite(token, {
      onSuccess: (data) => {
        if (data?.requiresRegistration) {
          router.push(
            `/register?email=${encodeURIComponent(inviteDetails.email)}&inviteToken=${token}`,
          );
        } else if (data?.requiresLogin) {
          router.push(
            `/login?returnUrl=${encodeURIComponent(`/invite/accept?token=${token}`)}`,
          );
        } else {
          router.push(`/${inviteDetails.workspaceSlug || "dashboard"}`);
        }
      },
    });
  }, [inviteDetails, token]);

  useEffect(() => {
    if (!token) router.replace("/dashboard");
  }, [token, router]);

  if (!token) return null;

  return (
    <>
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

      {isVerifying && (
        <div className="flex flex-col items-center animate-in fade-in duration-300">
          <Loader2 size={32} className="animate-spin text-accent mb-4" />
          <p className="text-fg-secondary text-sm font-medium">
            Verifying invitation...
          </p>
        </div>
      )}

      {isVerifyError && (
        <div className="w-full max-w-105 bg-surface border border-danger rounded-2xl p-8 text-center animate-in zoom-in-95 duration-300">
          <AlertCircle size={40} className="text-danger mx-auto mb-4" />
          <h1 className="text-xl font-bold text-fg mb-2">
            Invalid Invitation
          </h1>
          <p className="text-[13px] text-fg-muted mb-6">
            {(verifyError as any)?.response?.data?.message ||
              "This invitation link is invalid or has expired."}
          </p>
          <button
            onClick={() => router.push("/login")}
            className="text-sm text-accent hover:text-fg transition-colors"
          >
            Return to login
          </button>
        </div>
      )}

      {!isVerifying && !isVerifyError && inviteDetails && (
        <div className="w-full max-w-105 bg-surface border border-border rounded-2xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-500">
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-[13px] font-medium text-fg-muted hover:text-fg-secondary transition-colors"
            >
              Decline and return to dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default function AcceptInvitePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base p-4 font-sans text-fg selection:bg-accent-dim">
      <Suspense
        fallback={
          <div className="flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        }
      >
        <AcceptInviteContent />
      </Suspense>
    </div>
  );
}
