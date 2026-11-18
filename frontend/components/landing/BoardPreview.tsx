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
  accent: "bg-landing-accent-soft text-landing-accent",
  success: "bg-landing-success/12 text-landing-success",
  warning: "bg-landing-warning/12 text-landing-warning",
  info: "bg-landing-info/12 text-landing-info",
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
          className="flex size-6 items-center justify-center rounded-full border-2 border-landing-surface bg-landing-elevated text-xs font-semibold text-landing-fg-secondary"
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
    <div className="rounded-md border border-landing-line bg-landing-surface p-3 shadow-landing-1">
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

      <p className="text-sm leading-snug font-medium text-landing-fg">{title}</p>

      {typeof done === "number" && typeof total === "number" && (
        <div className="mt-3">
          <div className="h-1 w-full overflow-hidden rounded-full bg-landing-line">
            <div
              className="h-full rounded-full bg-landing-accent"
              style={{ width: `${(done / total) * 100}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-medium text-landing-fg-muted">
            {done}/{total} subtasks
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <AvatarStack names={avatars} />
        {comments ? (
          <span className="flex items-center gap-1 text-xs font-medium text-landing-fg-muted">
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
    <div className="overflow-hidden rounded-lg border border-landing-line bg-landing-inset shadow-landing-3">
      <div className="flex items-center gap-2 border-b border-landing-line bg-landing-surface px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-landing-line-strong" />
        <span className="size-2.5 rounded-full bg-landing-line-strong" />
        <span className="size-2.5 rounded-full bg-landing-line-strong" />

        <div className="mx-auto flex h-6 w-full max-w-xs items-center gap-2 rounded-sm border border-landing-line bg-landing-inset px-2">
          <Search size={11} className="text-landing-fg-muted" />
          <span className="truncate text-xs font-medium text-landing-fg-muted">
            switch.app/atlas/sprint-24
          </span>
        </div>

        <div className="hidden items-center gap-1.5 sm:flex">
          <span className="size-1.5 rounded-full bg-landing-success" />
          <span className="text-xs font-medium text-landing-fg-muted">
            3 online
          </span>
        </div>
      </div>

      <div className="flex">
        <aside className="hidden w-40 shrink-0 border-r border-landing-line bg-landing-surface p-3 sm:block">
          <div className="mb-4 flex items-center gap-2 px-1">
            <span className="flex size-5 items-center justify-center rounded-sm bg-landing-accent text-xs font-bold text-landing-on-accent">
              A
            </span>
            <span className="text-xs font-semibold text-landing-fg">Atlas</span>
          </div>

          <div className="space-y-0.5">
            {NAV.map(({ icon: Icon, label, active }) => (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium",
                  active
                    ? "bg-landing-accent-soft text-landing-fg"
                    : "text-landing-fg-secondary",
                )}
              >
                <Icon
                  size={12}
                  className={active ? "text-landing-accent" : undefined}
                />
                {label}
              </div>
            ))}
          </div>

          <p className="mt-5 mb-1.5 px-2 text-xs font-semibold text-landing-fg-muted">
            Sprints
          </p>

          <div className="space-y-0.5">
            {["Sprint 24", "Sprint 23", "Backlog"].map((sprint, i) => (
              <div
                key={sprint}
                className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-xs font-medium text-landing-fg-secondary"
              >
                <span
                  className={cn(
                    "size-1.5 rounded-full",
                    i === 0 ? "bg-landing-accent" : "bg-landing-line-strong",
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
              <p className="truncate text-sm font-semibold text-landing-fg">
                Sprint 24
              </p>
              <p className="truncate text-xs font-medium text-landing-fg-muted">
                19 cards · ends in 6 days
              </p>
            </div>

            <span className="flex shrink-0 items-center gap-1 rounded-sm border border-landing-line px-2 py-1 text-xs font-medium text-landing-fg-secondary">
              <Plus size={11} />
              Add card
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {COLUMNS.map((column) => (
              <div key={column.title} className="min-w-0">
                <div className="mb-2 flex items-center gap-1.5 px-0.5">
                  <span className="truncate text-xs font-semibold text-landing-fg-secondary">
                    {column.title}
                  </span>
                  <span className="text-xs font-medium text-landing-fg-muted">
                    {column.count}
                  </span>
                  {column.title === "Done" && (
                    <Check size={11} className="ml-auto text-landing-success" />
                  )}
                </div>

                <div className="space-y-2">
                  {column.cards.map((card) => (
                    <Card key={card.title} {...card} />
                  ))}

                  {column.title === "Backlog" && (
                    <>
                      <div className="rounded-md border border-dashed border-landing-line p-3">
                        <div className="h-1.5 w-3/4 rounded-full bg-landing-line" />
                        <div className="mt-2 h-1.5 w-1/2 rounded-full bg-landing-line" />
                      </div>
                      <div className="rounded-md border border-dashed border-landing-line p-3">
                        <div className="h-1.5 w-2/3 rounded-full bg-landing-line" />
                        <div className="mt-2 h-1.5 w-2/5 rounded-full bg-landing-line" />
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
