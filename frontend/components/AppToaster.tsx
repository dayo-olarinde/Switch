"use client";

import { useThemeMode } from "@/components/ThemeToggle";
import { Toaster } from "sonner";

export function AppToaster() {
  const mode = useThemeMode();

  return <Toaster richColors theme={mode} />;
}
