"use client";

import { UserProfile } from "@/hooks/useAuth";
import { Project } from "@/hooks/useProjects";
import { Workspace } from "@/hooks/useWorkspace";
import { getInitials } from "@/lib/utils";
import { Bell, LayoutGrid, Package, Settings2Icon, Users } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  NavEntry,
  NavItem,
  NewProjectButton,
  ProjectLink,
  ProjectListSkeleton,
  SectionLabel,
  WorkspaceSwitcherButton,
} from "./sidebar-parts";
import { UserMenu } from "./user-menu";

interface AppSidebarProps {
  workspaces: Workspace[];
  activeWorkspace?: Workspace;
  projects: Project[];
  projectsLoading: boolean;
  canManageWorkspace: boolean;
  unreadCount: number;
  membersCount: number;
  projectSlug?: string;
  workspaceTab?: string | null;
  isSwitcherOpen: boolean;
  onToggleSwitcher: () => void;
  onCreateWorkspace: () => void;
  onCreateProject: () => void;
  user?: UserProfile;
  onLogout: () => Promise<void>;
}

export function AppSidebar({
  workspaces,
  activeWorkspace,
  projects,
  projectsLoading,
  canManageWorkspace,
  unreadCount,
  membersCount,
  projectSlug,
  workspaceTab,
  isSwitcherOpen,
  onToggleSwitcher,
  onCreateWorkspace,
  onCreateProject,
  user,
  onLogout,
}: AppSidebarProps) {
  const pathname = usePathname();
  const hasWorkspaces = workspaces.length > 0;

  const mainNav: NavEntry[] = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    {
      name: "Notifications",
      href: "/notifications",
      icon: Bell,
      count: unreadCount > 0 ? unreadCount : undefined,
    },
  ];

  const workspaceNav: NavEntry[] = [
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
      count: membersCount || undefined,
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

  const onWorkspaceRoot = pathname === `/${activeWorkspace?.slug}`;
  const currentTab = workspaceTab ?? "projects";

  return (
    <aside className="z-20 flex w-64 shrink-0 flex-col border-r border-border bg-sidebar">
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
        <Image src="/logo.svg" alt="" width={26} height={26} priority />
        <span className="text-base font-semibold tracking-tight text-fg">
          Switch
        </span>
      </div>

      <div className="px-3 pb-2">
        <WorkspaceSwitcherButton
          name={activeWorkspace?.name}
          role={activeWorkspace?.role}
          colour={activeWorkspace?.colour}
          initials={
            activeWorkspace?.name ? getInitials(activeWorkspace.name) : undefined
          }
          hasWorkspaces={hasWorkspaces}
          isOpen={isSwitcherOpen}
          onClick={hasWorkspaces ? onToggleSwitcher : onCreateWorkspace}
        />
      </div>

      <nav className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5 pt-1">
          {mainNav.map((entry) => (
            <NavItem
              key={entry.href}
              entry={entry}
              active={pathname === entry.href}
            />
          ))}
        </div>

        {hasWorkspaces && (
          <div className="space-y-0.5">
            <SectionLabel>Projects</SectionLabel>

            {projectsLoading ? (
              <ProjectListSkeleton />
            ) : (
              <>
                {projects.map((project) => (
                  <ProjectLink
                    key={project.id}
                    id={project.id}
                    name={project.name}
                    href={`/${activeWorkspace?.slug}/${project.slug}`}
                    active={projectSlug === project.slug}
                  />
                ))}

                {projects.length === 0 && (
                  <p className="px-2.5 py-1 text-2xs text-fg-muted">
                    No projects yet
                  </p>
                )}

                {canManageWorkspace && (
                  <NewProjectButton onClick={onCreateProject} />
                )}
              </>
            )}

            <SectionLabel>Workspace</SectionLabel>
            {workspaceNav.map((entry) => (
              <NavItem
                key={entry.href}
                entry={entry}
                active={
                  !projectSlug &&
                  onWorkspaceRoot &&
                  currentTab === entry.name.toLowerCase()
                }
              />
            ))}
          </div>
        )}
      </nav>

      <div className="border-t border-border p-3">
        <UserMenu
          user={user}
          onLogout={onLogout}
          workspaceSlug={activeWorkspace?.slug}
        />
      </div>
    </aside>
  );
}
