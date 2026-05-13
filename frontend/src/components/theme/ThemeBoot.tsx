"use client";

import { useEffect } from "react";
import { getSavedThemeMode } from "./themeModes";

export default function ThemeBoot() {
  useEffect(() => {
    try {
      const savedMode = getSavedThemeMode();
      document.documentElement.dataset.themeMode = savedMode;
      document.documentElement.style.colorScheme =
        savedMode === "day" ? "light" : "dark";

      const saved = localStorage.getItem("nm-theme");
      if (!saved) return;

      const vars = JSON.parse(saved) as Record<string, string>;
      const root = document.documentElement;

      for (const [key, value] of Object.entries(vars)) {
        root.style.setProperty(key, value);
      }
    } catch {
      // Ignore invalid persisted theme data.
    }
  }, []);

  return null;
}
