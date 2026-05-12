"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { applyThemeMode, getSavedThemeMode, type ThemeMode } from "./themeModes";

export default function ThemeModeToggle() {
  const [mode, setMode] = useState<ThemeMode>("night");

  useEffect(() => {
    const initialMode = getSavedThemeMode();

    setMode(initialMode);
    applyThemeMode(initialMode);
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
