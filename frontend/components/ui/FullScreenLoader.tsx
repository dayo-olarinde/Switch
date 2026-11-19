import Image from "next/image";

export const FullScreenLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-base">
    <div className="size-18 shrink-0 animate-pulse overflow-hidden rounded-xl">
      <Image
        src="/logo.svg"
        alt="Loading Switch..."
        width={72}
        height={72}
        priority
        className="size-full object-cover"
      />
    </div>
  </div>
);
