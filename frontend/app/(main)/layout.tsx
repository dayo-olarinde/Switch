"use client";

import CreateProjectModal from "@/components/modals/CreateProjectModal";
import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import GlobalSearchModal from "@/components/modals/GlobalSearchModal";
import WorkspaceSwitcherModal from "@/components/modals/SwitchWorkspaceModal";
import { AppHeader } from "@/components/shell/header";
import { AppSidebar } from "@/components/shell/sidebar";
import {
  LayoutSkeleton,
} from "@/components/skeletons/LayoutPage";
import { SocketProvider } from "@/components/SocketProvider";
import { LoadError } from "@/components/ui/feedback";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useLogout, useMe } from "@/hooks/useAuth";
import { useWorkspaceProjects } from "@/hooks/useProjects";
import {
  useGetMembers,
  useGetWorkspaces,
  useWorkspaceRole,
} from "@/hooks/useWorkspace";
import { useBoardStore } from "@/store/board.store";
import { useNotificationStore } from "@/store/notification.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import { useParams, usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode, Suspense, useEffect, useState } from "react";

function getPageLabel(
  pathname: string,
  projectSlug?: string,
  tab?: string | null,
): string {
  if (projectSlug) return "Board";
  if (tab) return tab.charAt(0).toUpperCase() + tab.slice(1);
  if (pathname === "/dashboard") return "Dashboard";
  if (pathname === "/notifications") return "Notifications";
  return "Dashboard";
}

function MainLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params?.workspaceSlug as string | undefined;
  const projectSlug = params?.projectSlug as string | undefined;

  const presenceUsers = useBoardStore((s) => s.presenceUsers) ?? [];

  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const activeWorkspace = useWorkspaceStore((s) => s.activeWorkspace);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const logout = useLogout();

  const { data: user, isLoading: userLoading } = useMe();
  const {
    data: workspaces = [],
    isLoading: workspacesLoading,
    isFetching,
    isError: workspacesError,
    refetch: refetchWorkspaces,
  } = useGetWorkspaces();

  const { data: projects = [], isLoading: projectsLoading } =
    useWorkspaceProjects(activeWorkspace?.slug);
  const { data: members = [] } = useGetMembers(activeWorkspace?.slug ?? "");

  const { canManageWorkspace } = useWorkspaceRole();

  useEffect(() => {
    if (!userLoading && !user) window.location.href = "/login";
  }, [user, userLoading]);

  useEffect(() => {
    if (userLoading || !user || workspacesError) return;

    if (!workspacesLoading && !isFetching && workspaces.length === 0) {
      router.replace("/getting-you-started");
    }
  }, [
    user,
    userLoading,
    workspacesError,
    workspacesLoading,
    isFetching,
    workspaces.length,
    router,
  ]);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    document.addEventListener("open-search", handleOpenSearch);
    return () => document.removeEventListener("open-search", handleOpenSearch);
  }, []);

  useEffect(() => {
    if (!workspaces.length) return;

    const isCurrentActiveValid = workspaces.some(
      (w) => w.slug === activeWorkspace?.slug,
    );

    if (workspaceSlug) {
      const matched = workspaces.find((w) => w.slug === workspaceSlug);

      if (matched) {
        if (matched.slug !== activeWorkspace?.slug) {
          setActiveWorkspace(matched);
        }
      } else {
        setActiveWorkspace(workspaces[0]);
        router.push("/dashboard");
      }
    } else {
      if (!activeWorkspace || !isCurrentActiveValid) {
        setActiveWorkspace(workspaces[0]);
      }
    }
  }, [workspaces, workspaceSlug, activeWorkspace, setActiveWorkspace, router]);

  if (userLoading || workspacesLoading) {
    if (workspaces.length > 0) return <LayoutSkeleton />;
    return <FullScreenLoader />;
  }

  if (workspacesError) {
    return (
      <div className="flex h-dvh items-center justify-center bg-base px-6">
        <LoadError
          title="Couldn't load your workspaces"
          message="We couldn't reach the server. Check your connection and try again."
          onRetry={() => refetchWorkspaces()}
          className="w-full max-w-md"
        />
      </div>
    );
  }

  if (!workspaces.length) return <FullScreenLoader />;

  return (
    <SocketProvider>
      <div className="flex h-dvh overflow-hidden bg-base font-sans text-fg-secondary">
        <AppSidebar
          workspaces={workspaces}
          activeWorkspace={activeWorkspace ?? undefined}
          projects={projects}
          projectsLoading={projectsLoading}
          canManageWorkspace={canManageWorkspace}
          unreadCount={unreadCount}
          membersCount={members.length}
          projectSlug={projectSlug}
          workspaceTab={tab}
          isSwitcherOpen={isSwitcherOpen}
          onToggleSwitcher={() => setIsSwitcherOpen((prev) => !prev)}
          onCreateWorkspace={() => setIsAddWorkspaceOpen(true)}
          onCreateProject={() => setIsProjectModalOpen(true)}
          user={user}
          onLogout={logout}
        />

        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <AppHeader
            workspaceName={activeWorkspace?.name}
            pageLabel={getPageLabel(pathname, projectSlug, tab)}
            unreadCount={unreadCount}
            presenceUsers={presenceUsers}
            showPresence={Boolean(projectSlug) && presenceUsers.length > 0}
            onOpenSearch={() => setIsSearchOpen(true)}
          />

          <main className="custom-scrollbar flex flex-1 flex-col overflow-y-auto bg-base">
            <div
              className={
                projectSlug
                  ? "flex w-full flex-1 flex-col"
                  : "mx-auto flex w-full max-w-5xl flex-1 flex-col px-8 py-8"
              }
            >
              {children}
            </div>
          </main>
        </div>

        <CreateWorkspaceModal
          isOpen={isAddWorkspaceOpen}
          onClose={() => setIsAddWorkspaceOpen(false)}
        />
        <CreateProjectModal
          isOpen={isProjectModalOpen}
          onClose={() => setIsProjectModalOpen(false)}
        />
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          workspaceSlug={workspaceSlug ?? activeWorkspace?.slug}
          projects={projects}
          members={members}
          canManageWorkspace={canManageWorkspace}
          onAction={(actionId) => {
            if (actionId === "new-project") setIsProjectModalOpen(true);
            if (actionId === "logout") logout();
          }}
        />
        <WorkspaceSwitcherModal
          isOpen={isSwitcherOpen}
          onClose={() => setIsSwitcherOpen(false)}
          workspaces={workspaces}
          activeWorkspace={activeWorkspace}
          onSelectWorkspace={(ws) => {
            setActiveWorkspace(ws);
            router.push(`/${ws.slug}`);
          }}
          onCreateWorkspace={() => {
            setIsSwitcherOpen(false);
            setIsAddWorkspaceOpen(true);
          }}
        />
      </div>
    </SocketProvider>
  );
}

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<LayoutSkeleton />}>
      <MainLayoutContent>{children}</MainLayoutContent>
    </Suspense>
  );
}
