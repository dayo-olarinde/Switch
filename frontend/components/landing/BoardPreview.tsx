import { cn } from "@/lib/utils";
import {
  Check,
  LayoutGrid,
  MessageSquare,
  Package,
  Plus,
  Search,
  Users,
} from "lucide-react";

type Tone = "accent" | "success" | "warning" | "info";

const TONES: Record<Tone, string> = {
  accent: "bg-accent-dim text-accent",
  success: "bg-success/12 text-success",
  warning: "bg-warning/12 text-warning",
  info: "bg-info/12 text-info",
};

const COLUMNS: {
  title: string;
  count: number;
  cards: {
    title: string;
    label?: string;
    tone?: Tone;
    comments?: number;
    done?: number;
    total?: number;
    avatars: string[];
  }[];
}[] = [
  {
    title: "Backlog",
    count: 4,
    cards: [
      {
        title: "Audit token contrast across dark surfaces",
        label: "design",
        tone: "warning",
        comments: 3,
        avatars: ["AO", "JM"],
      },
      {
        title: "Split board store into presence + cards",
        label: "refactor",
        tone: "info",
        avatars: ["KM"],
      },
    ],
  },
  {
    title: "In progress",
    count: 3,
    cards: [
      {
        title: "Realtime presence indicator",
        label: "feature",
        tone: "accent",
        done: 3,
        total: 5,
        comments: 8,
        avatars: ["AO", "TR", "KM"],
      },
      {
        title: "Optimistic card reordering",
        label: "feature",
        tone: "accent",
        done: 1,
        total: 4,
        avatars: ["JM"],
      },
    ],
  },
  {
    title: "Done",
    count: 12,
    cards: [
      {
        title: "Cookie options standardised across auth",
        label: "fix",
        tone: "success",
        avatars: ["TR"],
      },
      {
        title: "Keyboard navigation for global search",
        label: "a11y",
        tone: "success",
        comments: 5,
        avatars: ["AO", "JM"],
      },
    ],
  },
];

const NAV = [
  { icon: LayoutGrid, label: "Dashboard", active: false },
  { icon: Package, label: "Projects", active: true },
  { icon: Users, label: "Members", active: false },
];

function AvatarStack({ names }: { names: string[] }) {
  return (
    <div className="flex items-center -space-x-1.5">
      {names.map((name) => (
        <span
          key={name}
          className="flex size-6 items-center justify-center rounded-full border-2 border-card bg-overlay text-xs font-semibold text-fg-secondary"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

function Card({
  title,
  label,
  tone,
  comments,
  done,
  total,
  avatars,
}: (typeof COLUMNS)[number]["cards"][number]) {
  return (
    <div className="rounded-md border border-border bg-card p-3 shadow-sm">
      {label && (
        <span
          className={cn(
            "mb-2 inline-flex rounded-full px-2 py-0.5 text-xs font-semibold",
            TONES[tone ?? "accent"],
          )}
        >
          {label}
        </span>
      )}

      <p className="text-sm leading-snug font-medium text-fg">{title}</p>

      {typeof done === "number" && typeof total === "number" && (
        <div className="mt-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent-solid"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-medium text-fg-muted">
            {done}/{total} subtasks
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <AvatarStack names={avatars} />
        {comments ? (
          <span className="flex items-center gap-1 text-xs font-medium text-fg-muted">
            <MessageSquare size={11} />
            {comments}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function BoardPreview() {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
      <div className="flex items-center gap-2 border-b border-border bg-card px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-border-md" />
        <span className="size-2.5 rounded-full bg-border-md" />
        <span className="size-2.5 rounded-full bg-border-md" />

        <div className="mx-auto flex h-6 w-full max-w-xs items-center gap-2 rounded-sm border border-border bg-surface px-2">
          <Search size={11} className="text-fg-muted" />
          <span className="truncate text-xs font-medium text-fg-muted">
            switch.app/atlas/sprint-24
          </span>
        </div>

        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="size-1.5 rounded-full bg-success" />
          <span className="text-xs font-medium text-fg-muted">
            3 online
          </span>
        </div>
      </div>

      <div className="flex">
        <aside className="hidden w-40 shrink-0 border-r border-border bg-card p-3 sm:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="flex size-5 items-center justify-center rounded-sm bg-accent-solid text-xs font-bold text-on-accent">
              A
            </span>
            <span className="text-xs font-semibold text-fg">Atlas</span>
          </div>

          <div className="space-y-0.5">
            {NAV.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium",
                  active
                    ? "bg-accent-dim text-fg"
                    : "text-fg-secondary",
                )}
              >
                <Icon
                  size={12}
                  className={active ? "text-accent" : undefined}
                />
                {label}
              </div>
            ))}
          </div>

          <p className="mt-5 mb-1.5 px-2 text-xs font-semibold text-fg-muted">
            Sprints
          </p>

          <div className="space-y-0.5">
            {["Sprint 24", "Sprint 23", "Backlog"].map((sprint, i) => (
              <div
                key={sprint}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium text-fg-secondary"
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    i === 0 ? "bg-accent-solid" : "bg-border-md",
                  )}
                />
                {sprint}
              </div>
            ))}
          </div>
        </aside>

        <div className="min-w-0 flex-1 p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg">
                Sprint 24
              </p>
              <p className="truncate text-xs font-medium text-fg-muted">
                19 cards · ends in 6 days
              </p>
            </div>

            <span className="flex shrink-0 items-center gap-1 rounded-sm border border-border px-2 py-1 text-xs font-medium text-fg-secondary">
              <Plus size={11} />
              Add card
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {COLUMNS.map((column) => (
              <div key={column.title} className="min-w-0">
                <div className="mb-2 flex items-center gap-1.5 px-0.5">
                  <span className="truncate text-xs font-semibold text-fg-secondary">
                    {column.title}
                  </span>
                  <span className="text-xs font-medium text-fg-muted">
                    {column.count}
                  </span>
                  {column.title === "Done" && (
                    <Check size={11} className="ml-auto text-success" />
                  )}
                </div>

                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <Card key={card.title} {...card} />
                  ))}

                  {column.title === "Backlog" && (
                    <>
                      <div className="rounded-md border border-dashed border-border p-3">
                        <div className="h-1.5 w-3/4 rounded-full bg-border" />
                        <div className="mt-2 h-1.5 w-1/2 rounded-full bg-border" />
                      </div>
                      <div className="rounded-md border border-dashed border-border p-3">
                        <div className="h-1.5 w-2/3 rounded-full bg-border" />
                        <div className="mt-2 h-1.5 w-2/5 rounded-full bg-border" />
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
