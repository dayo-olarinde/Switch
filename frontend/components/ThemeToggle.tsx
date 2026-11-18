"use client";

import { Moon, Sun } from "lucide-react";
import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "switch-theme";

export type ThemeMode = "light" | "dark";

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((listener) => listener());
}

function getSnapshot(): ThemeMode {
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

function getServerSnapshot(): ThemeMode {
  return "dark";
}

export function applyTheme(mode: ThemeMode) {
  document.documentElement.dataset.theme = mode;

  try {
    window.localStorage.setItem(STORAGE_KEY, mode);
  } catch {
    // storage can be blocked; the theme still applies for this page view
  }

  notify();
}

/**
 * Applies the stored theme before paint so the first frame is correct.
 */
export function ThemeScript() {
  const script = `(function(){var m="dark";try{var s=localStorage.getItem("${STORAGE_KEY}");if(s==="light"||s==="dark"){m=s}else if(window.matchMedia("(prefers-color-scheme: light)").matches){m="light"}}catch(e){}document.documentElement.dataset.theme=m})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function ThemeToggle({ className }: { className?: string }) {
  const mode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    applyTheme(mode === "dark" ? "light" : "dark");
  }, [mode]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={
        mode === "dark" ? "Switch to light theme" : "Switch to dark theme"
      }
      aria-pressed={mode === "light"}
      className={
        className ??
        "flex size-9 items-center justify-center rounded-lg text-fg-muted transition-colors duration-150 hover:bg-fill-2 hover:text-fg focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
      }
    >
      {mode === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
