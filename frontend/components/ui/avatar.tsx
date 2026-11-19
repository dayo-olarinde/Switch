import Image from "next/image";
import { initials, cn } from "@/lib/utils";

const sizes = {
  sm: "size-6 text-2xs",
  md: "size-8 text-2xs",
  lg: "size-10 text-body",
};

const TONES = {
  accent: "bg-accent-dim text-accent",
  neutral: "bg-fill-2 text-fg-secondary",
} as const;

interface AvatarProps {
  firstName: string;
  lastName?: string | null;
  avatarUrl?: string | null;
  size?: keyof typeof sizes;
  className?: string;
  tone?: keyof typeof TONES;
}

export function Avatar({
  firstName,
  lastName,
  avatarUrl,
  size = "md",
  className,
  tone = "accent",
}: AvatarProps) {
  const label = initials(firstName, lastName);

  return (
    <div
      title={`${firstName} ${lastName ?? ""}`.trim()}
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full border border-border-md font-medium",
        TONES[tone],
        sizes[size],
        className,
      )}
    >
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={label}
          fill
          sizes="40px"
          className="rounded-full object-cover"
        />
      ) : (
        label
      )}
    </div>
  );
}

interface AvatarGroupProps {
  users: Array<{
    id: string;
    firstName: string;
    lastName?: string | null;
    avatarUrl?: string | null;
  }>;
  max?: number;
  size?: keyof typeof sizes;
}

export function AvatarGroup({ users, max = 3, size = "sm" }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - max;

  return (
    <div className="flex items-center">
      {visible.map((user, i) => (
        <Avatar
          key={user.id}
          firstName={user.firstName}
          lastName={user.lastName}
          avatarUrl={user.avatarUrl}
          size={size}
          className={cn(i !== 0 && "-ml-1.5 ring-2 ring-surface")}
        />
      ))}

      {overflow > 0 && (
        <div
          className={cn(
            "-ml-1.5 flex shrink-0 items-center justify-center rounded-full",
            "border border-border-md bg-overlay font-medium text-fg-muted ring-2 ring-surface",
            sizes[size],
          )}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}
