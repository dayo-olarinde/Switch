import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-3 border",
  md: "size-5 border-2",
  lg: "size-8 border-2",
};

interface SpinnerProps {
  size?: keyof typeof sizes;
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-fill-3 border-t-accent",
        sizes[size],
        className,
      )}
    />
  );
}

export function PageLoader() {
  return (
    <div className="flex h-full min-h-50 flex-1 items-center justify-center">
      <Spinner size="md" />
    </div>
  );
}
