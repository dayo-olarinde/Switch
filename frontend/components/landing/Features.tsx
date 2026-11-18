import { Layers, Radio, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Radio,
    title: "Presence you can feel",
    body: "See who is on the board right now. Cards update as your team moves them, with no refresh and no stale tabs.",
  },
  {
    icon: Layers,
    title: "One board, no nesting",
    body: "Workspaces, projects, columns, cards. Depth where it helps, flat where it does not.",
  },
  {
    icon: ShieldCheck,
    title: "Your workspace, locked down",
    body: "Invite-only membership with per-workspace roles, so the board stays a board and not a public draft.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28"
    >
      <div className="max-w-xl">
        <p className="text-sm font-semibold text-landing-accent">
          Built for focus
        </p>
        <h2 className="landing-text-balance mt-3 text-3xl font-semibold tracking-tight text-landing-fg sm:text-4xl">
          Everything a small team needs. Nothing it does not.
        </h2>
      </div>

      <div className="mt-12 grid gap-px overflow-hidden rounded-lg border border-landing-line bg-landing-line sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <div
            key={title}
            className="bg-landing-inset p-6 transition-colors duration-200 hover:bg-landing-surface"
          >
            <span className="flex size-9 items-center justify-center rounded-sm bg-landing-accent-soft text-landing-accent">
              <Icon size={17} />
            </span>
            <h3 className="mt-4 text-base font-semibold text-landing-fg">
              {title}
            </h3>
            <p className="landing-text-pretty mt-1.5 text-sm leading-relaxed text-landing-fg-secondary">
              {body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
