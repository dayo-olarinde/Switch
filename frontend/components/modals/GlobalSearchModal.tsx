"use client";

import { DialogShell } from "@/components/ui/dialog-shell";
import {
  LogOut,
  Package,
  PlusCircle,
  Settings2Icon,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  MemberAvatar,
  SearchInput,
  SearchResults,
  type SearchSection,
} from "./search-results";

interface Project {
  id: string;
  name: string;
  slug: string;
}
interface WorkspaceMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceSlug?: string;
  projects?: Project[];
  members?: WorkspaceMember[];
  canManageWorkspace?: boolean;
  onAction?: (action: string) => void;
}

export default function GlobalSearchModal({
  isOpen,
  onClose,
  workspaceSlug,
  projects = [],
  members = [],
  canManageWorkspace = false,
  onAction,
}: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [prevOpen, setPrevOpen] = useState(isOpen);

  if (isOpen !== prevOpen) {
    setPrevOpen(isOpen);
    if (!isOpen) setQuery("");
  }

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          document.dispatchEvent(new CustomEvent("open-search"));
        }
      }
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  const quickLinks = [
    { name: "Projects", icon: Package, href: `/${workspaceSlug}?tab=projects` },
    {
      name: "Members Directory",
      icon: Users,
      href: `/${workspaceSlug}?tab=members`,
    },
    ...(canManageWorkspace
      ? [
          {
            name: "Workspace Settings",
            icon: Settings2Icon,
            href: `/${workspaceSlug}?tab=settings`,
          },
        ]
      : []),
  ];

  const quickActions = [
    ...(canManageWorkspace
      ? [{ id: "new-project", name: "Create New Project", icon: PlusCircle }]
      : []),
    { id: "logout", name: "Sign Out", icon: LogOut, danger: true },
  ];

  const normalizedQuery = query.toLowerCase().trim();
  const hasQuery = normalizedQuery !== "";

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleTriggerAction = (actionId: string) => {
    if (onAction) onAction(actionId);
    onClose();
  };

  const links: SearchSection = {
    key: "links",
    label: "Quick links",
    items: quickLinks
      .filter((link) => link.name.toLowerCase().includes(normalizedQuery))
      .map((link) => ({
        id: link.name,
        label: link.name,
        icon: <link.icon size={16} className="shrink-0 text-fg-muted" />,
        onSelect: () => handleNavigate(link.href),
      })),
  };

  const projectSection: SearchSection = {
    key: "projects",
    label: "Projects",
    items: projects
      .filter((project) => project.name.toLowerCase().includes(normalizedQuery))
      .map((project) => ({
        id: project.id,
        label: project.name,
        icon: <Package size={16} className="shrink-0 text-accent" />,
        onSelect: () => handleNavigate(`/${workspaceSlug}/${project.slug}`),
      })),
  };

  const memberSection: SearchSection = {
    key: "members",
    label: "Members",
    items: members
      .filter((member) => {
        const fullName =
          `${member.firstName || ""} ${member.lastName || ""}`.toLowerCase();
        return (
          fullName.includes(normalizedQuery) ||
          (member.email || "").toLowerCase().includes(normalizedQuery)
        );
      })
      .map((member) => {
        const name =
          `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
          "Unknown";

        return {
          id: member.id,
          label: name,
          hint: member.email,
          icon: (
            <MemberAvatar
              id={member.id}
              name={name}
              avatarUrl={member.avatarUrl}
            />
          ),
          onSelect: () =>
            handleNavigate(
              `/${workspaceSlug}?tab=members&search=${member.firstName}`,
            ),
        };
      }),
  };

  const actionSection: SearchSection = {
    key: "actions",
    label: "Commands",
    items: quickActions
      .filter((action) => action.name.toLowerCase().includes(normalizedQuery))
      .map((action) => ({
        id: action.id,
        label: action.name,
        danger: action.danger,
        icon: <action.icon size={16} className="shrink-0" />,
        onSelect: () => handleTriggerAction(action.id),
      })),
  };

  const sections = hasQuery
    ? [projectSection, memberSection, actionSection].filter(
        (section) => section.items.length > 0,
      )
    : [];

  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      ariaLabel="Search"
      headerless
      bodyClassName="p-0"
    >
      <SearchInput value={query} onChange={setQuery} />

      <div className="max-h-[60vh] overflow-y-auto p-2">
        {hasQuery ? (
          <SearchResults sections={sections} hasQuery={hasQuery} />
        ) : (
          <div className="py-2">
            {links.items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={item.onSelect}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] font-medium text-fg-secondary transition-colors hover:bg-fill-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </DialogShell>
  );
}
