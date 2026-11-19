"use client";

import { AuthShell, AuthStatus } from "@/components/auth/auth-shell";
import { useAcceptInvite, useVerifyInvite } from "@/hooks/useInvitations";
import { getErrorMessage } from "@/lib/utils";
import { AlertCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

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
    if (!token || !inviteDetails) return;

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
  }, [inviteDetails, token, acceptInvite, router]);

  useEffect(() => {
    if (!token) router.replace("/dashboard");
  }, [token, router]);

  if (!token) return null;

  if (isVerifyError) {
    return (
      <AuthStatus
        tone="danger"
        icon={<AlertCircle size={24} />}
        title="Invalid invitation"
        description={getErrorMessage(verifyError)}
      >
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="text-body font-medium text-accent transition-opacity hover:opacity-85"
        >
          Return to login
        </button>
      </AuthStatus>
    );
  }

  if (isVerifying || !inviteDetails) {
    return (
      <div className="flex flex-col items-center py-6">
        <Loader2 size={24} className="mb-4 animate-spin text-accent" />
        <p className="text-body font-medium text-fg-secondary">
          Verifying invitation...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-4 text-center">
      <Loader2 size={20} className="mb-3 animate-spin text-accent" />
      <p className="text-body text-fg-secondary">
        {isAccepting
          ? `Joining ${inviteDetails.workspaceName}...`
          : "Preparing your invitation..."}
      </p>
      <button
        type="button"
        disabled={isAccepting}
        onClick={() => router.push("/dashboard")}
        className="mt-6 text-body font-medium text-fg-muted transition-colors hover:text-fg-secondary disabled:opacity-50"
      >
        Decline and return to dashboard
      </button>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <AuthShell>
      <Suspense
        fallback={
          <div className="flex flex-col items-center py-6">
            <Loader2 size={24} className="mb-4 animate-spin text-accent" />
            <p className="text-body font-medium text-fg-secondary">Loading...</p>
          </div>
        }
      >
        <AcceptInviteContent />
      </Suspense>
    </AuthShell>
  );
}
