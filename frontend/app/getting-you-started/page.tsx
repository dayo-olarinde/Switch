"use client";

import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/hooks/useAuth";
import { useGetWorkspaces } from "@/hooks/useWorkspace";
import { LayoutGrid, Plus, UserPlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const HIGHLIGHTS = [
  {
    icon: LayoutGrid,
    tone: "text-accent bg-accent-dim",
    title: "Workspaces hold projects",
    body: "Group related projects — like “Acme Corp” or “Side projects” — under one workspace.",
  },
  {
    icon: UserPlus,
    tone: "text-success bg-success-dim",
    title: "Invite your team",
    body: "Add members and assign Owner, Admin or Member roles per workspace.",
  },
];

export default function GettingStartedPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const logout = useLogout();
  const router = useRouter();

  const { data: workspaces = [], isLoading } = useGetWorkspaces();

  useEffect(() => {
    if (!isLoading && workspaces.length > 0) {
      router.replace("/dashboard");
    }
  }, [workspaces.length, isLoading, router]);

  if (isLoading || workspaces.length > 0) {
    return <div className="min-h-dvh bg-base" />;
  }

  return (
    <div className="flex min-h-dvh flex-col bg-base font-sans text-fg">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
        <div className="flex items-center gap-2.5">
          <Image src="/logo.svg" alt="" width={24} height={24} priority />
          <span className="text-base font-semibold tracking-tight text-fg">
            Switch
          </span>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="text-body font-medium text-fg-muted transition-colors hover:text-fg"
        >
          Sign out
        </button>
      </header>

      <main className="mx-auto flex w-full max-w-105 flex-1 flex-col justify-center px-6 py-16">
        <h1 className="text-headline font-semibold text-fg">
          Create your first workspace
        </h1>
        <p className="mt-2 text-body leading-relaxed text-fg-muted">
          A workspace brings your team, projects and boards together in one
          place.
        </p>

        <Button
          className="mt-6 self-start"
          onClick={() => setIsModalOpen(true)}
          icon={<Plus size={15} />}
        >
          Create workspace
        </Button>

        <div className="mt-10 space-y-2">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
              >
                <span
                  className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${item.tone}`}
                >
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-body font-semibold text-fg">{item.title}</p>
                  <p className="mt-0.5 text-body leading-relaxed text-fg-muted">
                    {item.body}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      <CreateWorkspaceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
