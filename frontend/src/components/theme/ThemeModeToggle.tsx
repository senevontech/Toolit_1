"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyThemeMode, getSavedThemeMode, type ThemeMode } from "./themeModes";

export default function ThemeModeToggle() {
  const [mode, setMode] = useState<ThemeMode>("day");

  useEffect(() => {
    const initialMode = getSavedThemeMode();

    setMode(initialMode);
  }, []);

  useEffect(() => {
    const handleThemeModeChange = (event: Event) => {
      setMode((event as CustomEvent<ThemeMode>).detail);
    };

    window.addEventListener("nm-theme-mode-change", handleThemeModeChange);
    return () => window.removeEventListener("nm-theme-mode-change", handleThemeModeChange);
  }, []);

  const nextMode = mode === "night" ? "day" : "night";
  const label = mode === "night" ? "Switch to day mode" : "Switch to night mode";

  return (
    <button
      type="button"
      className="theme-mode-toggle"
      aria-label={label}
      title={label}
      onClick={() => {
        setMode(nextMode);
        applyThemeMode(nextMode);
      }}
    >
      <span className="theme-mode-toggle__icon theme-mode-toggle__icon--sun" aria-hidden="true">
        <Sun size={16} strokeWidth={2.2} />
      </span>
      <span className="theme-mode-toggle__thumb" data-mode={mode}>
        {mode === "night" ? (
          <Moon size={14} strokeWidth={2.3} />
        ) : (
          <Sun size={14} strokeWidth={2.3} />
        )}
      </span>
      <span className="theme-mode-toggle__icon theme-mode-toggle__icon--moon" aria-hidden="true">
        <Moon size={16} strokeWidth={2.2} />
      </span>
    </button>
  );
}
