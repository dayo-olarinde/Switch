import { Monitor, Smartphone } from "lucide-react";

export function MobileBlocker({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex md:hidden fixed inset-0 z-9999 bg-base flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-16 h-16 rounded-2xl bg-fill-2 border border-border-md flex items-center justify-center mb-6 relative">
          <Smartphone size={28} className="text-fg-muted" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-surface border-2 border-base flex items-center justify-center">
            <Monitor size={12} className="text-accent" />
          </div>
        </div>

        <h1 className="text-xl font-bold text-fg mb-2 tracking-tight">
          Please use a larger screen
        </h1>
        <p className="text-[14px] text-fg-muted max-w-70 leading-relaxed">
          Switch is a complex Kanban environment optimized for tablets and
          desktops. Please open this app on a larger device for the best
          experience.
        </p>
      </div>

      <div className="hidden md:block w-full h-full">{children}</div>
    </>
  );
}
