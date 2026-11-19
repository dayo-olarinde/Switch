import { Monitor, Smartphone } from "lucide-react";

export function MobileBlocker({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-base p-6 text-center animate-in fade-in duration-500 md:hidden">
        <div className="relative mb-6 flex size-16 items-center justify-center rounded-2xl border border-border-md bg-fill-2">
          <Smartphone size={28} className="text-fg-muted" />
          <div className="absolute -right-1 -bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-base bg-surface">
            <Monitor size={12} className="text-accent" />
          </div>
        </div>

        <h1 className="mb-2 text-xl font-bold tracking-tight text-fg">
          Please use a larger screen
        </h1>
        <p className="max-w-70 text-body leading-relaxed text-fg-muted">
          Switch is a complex Kanban environment optimized for tablets and
          desktops. Please open this app on a larger device for the best
          experience.
        </p>
      </div>

      <div className="hidden size-full md:block">{children}</div>
    </>
  );
}
