"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "switch-theme";

type Mode = "light" | "dark";

function applyMode(mode: Mode) {
  document.documentElement.dataset.landing = mode;
}

export function LandingThemeScript() {
  const script = `(function(){var m="dark";try{var s=localStorage.getItem("${STORAGE_KEY}");if(s==="light"||s==="dark"){m=s}else if(window.matchMedia("(prefers-color-scheme: light)").matches){m="light"}}catch(e){}document.documentElement.dataset.landing=m})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    setMode(
      document.documentElement.dataset.landing === "light" ? "light" : "dark",
    );
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    setMode(next);
    applyMode(next);

    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage can be blocked; the theme still applies for this page view
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      aria-pressed={mode === "light"}
      className="flex size-10 items-center justify-center rounded-sm border border-landing-line text-landing-fg-secondary transition-colors duration-150 hover:border-landing-line-strong hover:bg-landing-surface hover:text-landing-fg focus-visible:ring-2 focus-visible:ring-landing-accent focus-visible:ring-offset-2 focus-visible:ring-offset-landing-bg focus-visible:outline-none"
    >
      <Sun size={16} className="theme-icon-sun" />
      <Moon size={16} className="theme-icon-moon" />
    </button>
  );
}
