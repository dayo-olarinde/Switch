"use client";

import CreateProjectModal from "@/components/modals/CreateProjectModal";
import CreateWorkspaceModal from "@/components/modals/CreateWorkspaceModal";
import GlobalSearchModal from "@/components/modals/GlobalSearchModal";
import WorkspaceSwitcherModal from "@/components/modals/SwitchWorkspaceModal";
import {
  LayoutSkeleton,
  ProjectsListSkeleton,
} from "@/components/skeletons/LayoutPage";
import { SocketProvider } from "@/components/SocketProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { FullScreenLoader } from "@/components/ui/FullScreenLoader";
import { useLogout, useMe } from "@/hooks/useAuth";
import { useWorkspaceProjects } from "@/hooks/useProjects";
import {
  useGetMembers,
  useGetWorkspaces,
  useWorkspaceRole,
} from "@/hooks/useWorkspace";
import { cn, getConsistentColor, getInitials } from "@/lib/utils";
import { useBoardStore } from "@/store/board.store";
import { useNotificationStore } from "@/store/notification.store";
import { useWorkspaceStore } from "@/store/workspace.store";
import {
  Bell,
  ChevronDown,
  ChevronRight,
  LayoutGrid,
  Loader2,
  LogOut,
  Package,
  Plus,
  Search,
  Settings,
  Settings2Icon,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { ReactNode, useEffect, useState, Suspense } from "react";

function MainLayoutContent({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const router = useRouter();
  const params = useParams();
  const workspaceSlug = params?.workspaceSlug as string | undefined;
  const projectSlug = params?.projectSlug as string | undefined;

  const onlineUsers = useBoardStore((s) => s.presenceUsers) ?? [];

  const [isAddWorkspaceOpen, setIsAddWorkspaceOpen] = useState(false);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
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
  } = useGetWorkspaces();

  const { data: projects = [], isLoading: projectsLoading } =
    useWorkspaceProjects(activeWorkspace?.slug);
  const { data: members = [] } = useGetMembers(activeWorkspace?.slug ?? "");
  const hasWorkspaces = workspaces.length > 0;

  const { canManageWorkspace } = useWorkspaceRole();

  useEffect(() => {
    if (!userLoading && !user) window.location.href = "/login";
  }, [user, userLoading]);

  useEffect(() => {
    if (userLoading || !user) return;

    if (!workspacesLoading && !isFetching && workspaces.length === 0) {
      router.replace("/getting-you-started");
    }
  }, [
    user,
    userLoading,
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
    if (workspaces.length > 0) {
      return <LayoutSkeleton />;
    }
    return <FullScreenLoader />;
  }

  if (!hasWorkspaces) {
    return <FullScreenLoader />;
  }

  const mainNavItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      count: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const workspaceNavItems = [
    {
      name: "Projects",
      href: `/${activeWorkspace?.slug}?tab=projects`,
      icon: Package,
      count: projects.length || undefined,
    },
    {
      name: "Members",
      href: `/${activeWorkspace?.slug}?tab=members`,
      icon: Users,
      count: members.length || undefined,
    },
    ...(canManageWorkspace
      ? [
          {
            name: "Settings",
            href: `/${activeWorkspace?.slug}?tab=settings`,
            icon: Settings2Icon,
          },
        ]
      : []),
  ];

  const getPageLabel = (
    pathname: string,
    projectSlug?: string,
    tab?: string | null,
  ): string => {
    if (projectSlug) return "Board";
    if (tab) return tab.charAt(0).toUpperCase() + tab.slice(1);
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname === "/notifications") return "Notifications";
    return "Dashboard";
  };

  const pageLabel = getPageLabel(pathname, projectSlug, tab);

  return (
    <SocketProvider>
      <div className="flex h-screen bg-base overflow-hidden text-fg-secondary font-sans selection:bg-accent-dim">
        <aside className="w-65 shrink-0 bg-surface border-r border-border flex flex-col z-20">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-6 px-1">
              <Image
                src="/logo.svg"
                alt="Switch Logo"
                width={32}
                height={32}
                priority
              />
              <span className="text-xl font-bold text-fg tracking-tight">
                Switch
              </span>
            </div>

            <button
              onClick={() =>
                hasWorkspaces
                  ? setIsSwitcherOpen(!isSwitcherOpen)
                  : setIsAddWorkspaceOpen(true)
              }
              className={cn(
                "w-full flex items-center gap-3 p-2.5 rounded-xl transition-all duration-200 border group",
                isSwitcherOpen
                  ? "bg-fill-2 border-border-md shadow-sm"
                  : "bg-fill-1 border-border hover:bg-fill-2 hover:border-border-md",
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 shrink-0 rounded-lg flex items-center justify-center text-fg text-[11px] font-black transition-colors",
                  !hasWorkspaces &&
                    "bg-accent-solid/10 text-accent group-hover:bg-accent-dim",
                )}
                style={
                  hasWorkspaces && activeWorkspace
                    ? { backgroundColor: activeWorkspace.colour }
                    : {}
                }
              >
                {hasWorkspaces ? (
                  activeWorkspace?.name ? (
                    getInitials(activeWorkspace.name)
                  ) : (
                    "AC"
                  )
                ) : (
                  <Plus size={16} />
                )}
              </div>
              <div className="flex flex-col items-start overflow-hidden flex-1">
                <span
                  className={cn(
                    "text-[13px] font-semibold truncate w-full text-left transition-colors",
                    hasWorkspaces ? "text-fg" : "text-accent",
                  )}
                >
                  {hasWorkspaces ? activeWorkspace?.name : "New Workspace"}
                </span>
                <span className="text-[10px] font-medium text-accent mt-0.5">
                  {activeWorkspace?.role}
                </span>
              </div>
              {hasWorkspaces && (
                <ChevronDown
                  size={14}
                  className={cn(
                    "text-fg-muted shrink-0 ml-auto transition-transform duration-200",
                    isSwitcherOpen && "rotate-180 text-fg",
                  )}
                />
              )}
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 py-2 overflow-y-auto custom-scrollbar">
            {mainNavItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-lg transition-all duration-200 group",
                    isActive
                      ? "bg-fill-2 text-fg"
                      : "text-fg-secondary hover:bg-fill-2 hover:text-fg",
                  )}
                >
                  <item.icon
                    size={16}
                    className={
                      isActive
                        ? "text-fg"
                        : "text-fg-muted group-hover:text-fg"
                    }
                  />
                  {item.name}
                  {item.count !== undefined && (
                    <div className="ml-auto flex items-center justify-center px-2 py-0.5 rounded-full bg-fill-2 text-[10px] font-bold text-fg-secondary min-w-5 border border-border">
                      {item.count}
                    </div>
                  )}
                </Link>
              );
            })}

            {hasWorkspaces && (
              <div className="mt-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between mb-2 px-3">
                  <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                    Projects
                  </span>
                </div>
                {projectsLoading ? (
                  <ProjectsListSkeleton />
                ) : (
                  <div className="space-y-0.5">
                    {projects.map((p) => {
                      const color = getConsistentColor(p.id);
                      const isActive = projectSlug === p.slug;
                      return (
                        <Link
                          key={p.id}
                          href={`/${activeWorkspace?.slug}/${p.slug}`}
                          className={cn(
                            "flex items-center gap-3 px-3 py-2 text-[13px] font-medium rounded-lg transition-colors group",
                            isActive
                              ? "bg-fill-2 text-fg"
                              : "text-fg-secondary hover:bg-fill-2 hover:text-fg",
                          )}
                        >
                          <div
                            className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200 group-hover:scale-125"
                            style={{
                              backgroundColor: color,
                              boxShadow: `0 0 8px ${color}40`,
                            }}
                          />
                          <span className="truncate">{p.name}</span>
                        </Link>
                      );
                    })}
                    {canManageWorkspace && (
                      <button
                        onClick={() => setIsProjectModalOpen(true)}
                        className="flex items-center gap-3 px-3 py-2 mt-1 w-full text-left text-[13px] font-medium text-fg-muted hover:text-fg hover:bg-fill-2 rounded-lg transition-colors group"
                      >
                        <Plus
                          size={14}
                          className="text-fg-muted group-hover:text-fg-secondary transition-colors"
                        />
                        New project
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {hasWorkspaces && (
              <div className="mt-8 animate-in fade-in duration-300">
                <div className="mb-2 px-3">
                  <span className="text-[10px] font-bold text-fg-muted uppercase tracking-wider">
                    Workspace
                  </span>
                </div>
                <div className="space-y-0.5">
                  {workspaceNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2 text-[13px] font-medium text-fg-secondary hover:bg-fill-2 hover:text-fg rounded-lg transition-colors group"
                    >
                      <item.icon
                        size={16}
                        className="text-fg-muted group-hover:text-fg transition-colors"
                      />
                      {item.name}
                      {item.count !== undefined && (
                        <div className="ml-auto flex items-center justify-center px-2 py-0.5 rounded-full bg-fill-2 text-[10px] font-bold text-fg-secondary min-w-5 border border-border">
                          {item.count}
                        </div>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>

          <div className="p-4 mt-auto relative">
            {isUserDropdownOpen && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsUserDropdownOpen(false)}
              />
            )}
            {isUserDropdownOpen && (
              <div className="absolute bottom-[calc(100%-8px)] left-4 right-4 bg-surface/95 backdrop-blur-xl border border-border-md rounded-xl shadow-[0_-8px_30px_rgb(0,0,0,0.5)] z-50 overflow-hidden p-1.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
                {hasWorkspaces && (
                  <>
                    <Link
                      href={`/${activeWorkspace?.slug}?tab=settings`}
                      onClick={() => setIsUserDropdownOpen(false)}
                      className="flex items-center gap-3 p-2.5 text-[13px] font-medium text-fg-secondary hover:text-fg hover:bg-fill-2 rounded-lg transition-colors"
                    >
                      <Settings size={15} />
                      <span>Account Settings</span>
                    </Link>
                    <div className="h-px bg-fill-2 my-1 mx-1" />
                  </>
                )}
                <button
                  onClick={async () => {
                    setIsUserDropdownOpen(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-3 p-2.5 text-[13px] font-medium text-danger hover:text-danger hover:bg-danger-dim rounded-lg transition-colors"
                >
                  <LogOut size={15} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}

            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className={cn(
                "w-full flex items-center gap-3 p-2 rounded-xl transition-all duration-200 hover:bg-fill-2",
                isUserDropdownOpen && "bg-fill-2",
              )}
            >
              <div className="w-8 h-8 shrink-0 rounded-full overflow-hidden bg-fill-3 flex items-center justify-center text-fg text-xs font-bold ring-2 ring-transparent hover:ring-white/10 transition-all">
                {user?.avatarUrl ? (
                  <Image
                    src={user.avatarUrl}
                    alt="Avatar"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                    unoptimized
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <>
                    {user?.firstName?.charAt(0)?.toUpperCase()}
                    {user?.lastName?.charAt(0)?.toUpperCase()}
                  </>
                )}
              </div>
              <div className="flex flex-col items-start overflow-hidden flex-1">
                <span className="text-[13px] font-semibold text-fg truncate w-full text-left">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-[11px] text-fg-muted font-medium truncate w-full text-left">
                  {user?.email}
                </span>
              </div>
            </button>
          </div>
        </aside>

        <div className="flex flex-col flex-1 min-w-0 relative z-10">
          <header className="h-14 shrink-0 bg-base/80 backdrop-blur-md border-b border-border flex items-center px-8 z-20 sticky top-0">
            {hasWorkspaces && (
              <div className="flex items-center gap-2 text-[13px] font-medium ml-4 animate-in fade-in duration-300">
                <span className="text-fg-muted hover:text-fg-secondary transition-colors cursor-pointer">
                  {activeWorkspace?.name}
                </span>
                <ChevronRight size={14} className="text-fg-muted" />
                <span className="text-fg">{pageLabel}</span>
              </div>
            )}

            <div className="flex items-center gap-3 ml-auto">
              {projectSlug && onlineUsers.length > 0 && (
                <div className="flex items-center mr-2 pr-4 border-r border-border">
                  <div className="flex items-center -space-x-2">
                    {onlineUsers.slice(0, 4).map((u, i) => (
                      <div
                        key={u.userId ?? i}
                        title={`${u.firstName} ${u.lastName}`}
                        className="w-8 h-8 rounded-full bg-card border-2 border-base flex items-center justify-center relative z-10 hover:z-20 transition-transform hover:scale-110 cursor-default"
                      >
                        {u.avatarUrl ? (
                          <Image
                            src={u.avatarUrl}
                            alt={u.firstName ?? "User"}
                            width={28}
                            height={28}
                            className="w-full h-full object-cover rounded-full"
                            unoptimized
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[10px] font-bold text-fg">
                            {u.firstName?.charAt(0)}
                            {u.lastName?.charAt(0)}
                          </span>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-success border-2 border-base" />
                      </div>
                    ))}
                    {onlineUsers.length > 4 && (
                      <div className="w-8 h-8 rounded-full bg-fill-2 border-2 border-base flex items-center justify-center text-[10px] font-bold text-fg-muted">
                        +{onlineUsers.length - 4}
                      </div>
                    )}
                  </div>
                </div>
              )}{" "}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-2.5 py-1.5 text-fg-muted hover:text-fg transition-colors rounded-lg hover:bg-fill-2"
              >
                <Search size={16} />
                <kbd className="hidden sm:inline-flex text-[10px] font-sans font-medium px-1.5 py-0.5 bg-fill-2 rounded text-fg-muted">
                  ⌘K
                </kbd>
              </button>
              <ThemeToggle />
              <Link
                href="/notifications"
                className="relative p-2 text-fg-muted hover:text-fg transition-colors rounded-lg hover:bg-fill-2"
              >
                <Bell size={16} />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger border border-base" />
                )}
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto custom-scrollbar bg-base flex flex-col">
            <div
              className={cn(
                "w-full flex-1 flex flex-col",
                !projectSlug && "max-w-6xl mx-auto p-10",
              )}
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
