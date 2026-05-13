export type ThemeMode = "day" | "night";

export const NIGHT_THEME: Record<string, string> = {
  "--nm-bg": "#020202",
  "--nm-surface": "#070707",
  "--nm-accent": "#f4f4f5",
  "--nm-accent-dark": "#d4d4d8",
  "--nm-accent-ink": "#f5f5f5",
  "--nm-text": "#f5f5f5",
  "--nm-text-muted": "#7b7b82",
  "--nm-on-accent": "#ffffff",
  "--nm-on-accent-muted": "rgba(255, 255, 255, 0.88)",
  "--nm-glow": "rgba(255, 255, 255, 0.04)",
  "--nm-glow-soft": "rgba(255, 255, 255, 0.02)",
  "--nm-glow-strong": "rgba(255, 255, 255, 0.08)",
  "--nm-accent-soft": "rgba(255, 255, 255, 0.06)",
  "--nm-accent-surface": "rgba(255, 255, 255, 0.08)",
  "--nm-meter-color": "#f5f5f5",
  "--nm-meter-glow": "rgba(255, 255, 255, 0.14)",
  "--nm-footer-bg": "linear-gradient(145deg, #090909, #010101)",
  "--nm-footer-text": "#ffffff",
  "--nm-footer-text-muted": "rgba(255, 255, 255, 0.78)",
  "--nm-footer-text-soft": "rgba(255, 255, 255, 0.58)",
  "--nm-footer-border": "rgba(255, 255, 255, 0.08)",
  "--nm-shadow-dark-color": "rgba(0, 0, 0, 0.92)",
  "--nm-shadow-dark-strong-color": "rgba(0, 0, 0, 0.97)",
  "--nm-shadow-light-color": "rgba(255, 255, 255, 0.03)",
  "--nm-shadow-out": "0 0 0 1px rgba(255, 255, 255, 0.04), 0 18px 46px rgba(0, 0, 0, 0.72)",
  "--nm-shadow-in": "inset 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 10px 24px rgba(255, 255, 255, 0.015), inset 0 -18px 28px rgba(0, 0, 0, 0.58)",
  "--nm-shadow-lg": "0 0 0 1px rgba(255, 255, 255, 0.04), 0 24px 64px rgba(0, 0, 0, 0.82)",
  "--nm-shadow-hover": "0 0 0 1px rgba(255, 255, 255, 0.05), 0 22px 56px rgba(0, 0, 0, 0.78)",
  "--nm-shadow-press": "inset 0 0 0 1px rgba(255, 255, 255, 0.03), inset 0 18px 30px rgba(0, 0, 0, 0.72)",
  "--nm-shadow-accent-press": "inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 14px 28px rgba(255,255,255,0.04), 0 0 24px rgba(255,255,255,0.04)",
};

export const DAY_THEME: Record<string, string> = {
  "--nm-bg": "#f4f0e8",
  "--nm-surface": "#fffaf2",
  "--nm-accent": "#f97316",
  "--nm-accent-dark": "#c2410c",
  "--nm-accent-ink": "#8a2f07",
  "--nm-text": "#241f18",
  "--nm-text-muted": "#6f6254",
  "--nm-on-accent": "#ffffff",
  "--nm-on-accent-muted": "rgba(255, 255, 255, 0.9)",
  "--nm-glow": "rgba(249, 115, 22, 0.1)",
  "--nm-glow-soft": "rgba(249, 115, 22, 0.05)",
  "--nm-glow-strong": "rgba(249, 115, 22, 0.18)",
  "--nm-accent-soft": "rgba(249, 115, 22, 0.12)",
  "--nm-accent-surface": "rgba(249, 115, 22, 0.16)",
  "--nm-meter-color": "#f97316",
  "--nm-meter-glow": "rgba(249, 115, 22, 0.18)",
  "--nm-footer-bg": "linear-gradient(145deg, #fff8ef, #efe6da)",
  "--nm-footer-text": "#241f18",
  "--nm-footer-text-muted": "rgba(36, 31, 24, 0.72)",
  "--nm-footer-text-soft": "rgba(36, 31, 24, 0.52)",
  "--nm-footer-border": "rgba(36, 31, 24, 0.1)",
  "--nm-shadow-dark-color": "rgba(161, 143, 121, 0.42)",
  "--nm-shadow-dark-strong-color": "rgba(138, 117, 92, 0.5)",
  "--nm-shadow-light-color": "rgba(255, 255, 255, 0.92)",
  "--nm-shadow-out": "10px 10px 24px rgba(161, 143, 121, 0.28), -10px -10px 22px rgba(255, 255, 255, 0.78)",
  "--nm-shadow-in": "inset 8px 8px 18px rgba(161, 143, 121, 0.24), inset -8px -8px 18px rgba(255, 255, 255, 0.78)",
  "--nm-shadow-lg": "18px 18px 42px rgba(161, 143, 121, 0.3), -14px -14px 32px rgba(255, 255, 255, 0.82)",
  "--nm-shadow-hover": "inset 10px 10px 20px rgba(161, 143, 121, 0.22), inset -10px -10px 20px rgba(255, 255, 255, 0.82)",
  "--nm-shadow-press": "inset 8px 8px 16px rgba(161, 143, 121, 0.32), inset -8px -8px 16px rgba(255, 255, 255, 0.84)",
  "--nm-shadow-accent-press": "inset 0 0 0 1px rgba(255,255,255,0.36), inset 0 14px 28px rgba(194,65,12,0.24), 0 0 22px rgba(249,115,22,0.16)",
};

export const getThemeVars = (mode: ThemeMode) =>
  mode === "day" ? DAY_THEME : NIGHT_THEME;

export const getSavedThemeMode = (): ThemeMode => {
  try {
    const saved = localStorage.getItem("nm-theme-mode");
    if (saved === "day" || saved === "night") {
      return saved;
    }
  } catch {
    // Keep default when storage is unavailable.
  }

  return "day";
};

export const applyThemeMode = (mode: ThemeMode) => {
  const root = document.documentElement;
  const vars = getThemeVars(mode);

  root.dataset.themeMode = mode;
  root.style.colorScheme = mode === "day" ? "light" : "dark";

  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }

  try {
    localStorage.setItem("nm-theme-mode", mode);
    localStorage.setItem("nm-theme", JSON.stringify(vars));
  } catch {
    // Ignore storage failures in private browsing contexts.
  }

  window.dispatchEvent(new CustomEvent<ThemeMode>("nm-theme-mode-change", { detail: mode }));
};
