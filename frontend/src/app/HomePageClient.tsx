"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ImageIcon,
  FileText,
  FilePlus2,
  Code2,
  QrCode,
  Maximize2,
  Video,
  SlidersHorizontal,
  X,
  Copy,
  Check,
  type LucideIcon,
} from "lucide-react";
import { tools } from "@/lib/tools";
import { getSavedThemeMode, type ThemeMode } from "@/components/theme/themeModes";
import "./home2.css";

type CategoryKey =
  | "Image Tools"
  | "Document Tools"
  | "Video Tools"
  | "Developer Tools"
  | "SEO Tools"
  | "Calculators";

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  "Image Tools": "Image tool",
  "Document Tools": "Document tool",
  "Video Tools": "Video tool",
  "Developer Tools": "Developer tool",
  "SEO Tools": "SEO tool",
  Calculators: "Calculator tool",
};

const TOOL_ICON: Record<string, LucideIcon> = {
  "image-compressor": ImageIcon,
  "image-resizer": Maximize2,
  "png-jpg-converter": ImageIcon,
  "webp-converter": ImageIcon,
  "watermark-image": ImageIcon,
  "image-background-blur": ImageIcon,
  "image-sharpen-tool": ImageIcon,
  "image-noise-reduction": ImageIcon,
  "cartoon-effect-generator": ImageIcon,
  "sketch-effect-generator": ImageIcon,
  "background-remover": ImageIcon,
  "passport-size-image-generator": ImageIcon,
  "merge-pdf": FilePlus2,
  "pdf-compressor": FileText,
  "split-pdf": FilePlus2,
  "rotate-pdf": FileText,
  "add-watermark-to-pdf": FileText,
  "remove-pages-from-pdf": FileText,
  "extract-images-from-pdf": FileText,
  "pdf-to-images": FileText,
  "add-page-numbers": FileText,
  "protect-pdf": FileText,
  "unlock-pdf": FileText,
  "pdf-to-word": FileText,
  "word-to-pdf": FileText,
  "pdf-to-excel": FileText,
  "excel-to-pdf": FileText,
  "pdf-to-powerpoint": FileText,
  "powerpoint-to-pdf": FileText,
  "pdf-to-txt": FileText,
  "txt-to-pdf": FileText,
  "word-to-html": FileText,
  "video-to-mp3": Video,
  "video-compressor": Video,
  "video-cutter": Video,
  "thumbnail-downloader-youtube": Video,
  "html-formatter": Code2,
  "css-formatter": Code2,
  "js-formatter": Code2,
  "sql-formatter": Code2,
  "jwt-decoder": Code2,
  "url-parser": Code2,
  "regex-tester": Code2,
  "timestamp-converter": Code2,
  "domain-checker": Code2,
  "json-formatter": Code2,
  "qr-generator": QrCode,
  "keyword-density-checker": Search,
  "meta-tag-generator": Search,
  "sitemap-generator": Search,
  "robots-txt-generator": Search,
  "og-generator": Search,
  "base64-tool": Code2,
};

const FEATURED_PRIMARY_SLUGS = [
  "image-compressor",
  "merge-pdf",
  "pdf-to-word",
  "image-resizer",
  "pdf-to-excel",
];
const FEATURED_SECONDARY_SLUGS = [
  "word-to-pdf",
  "split-pdf",
  "png-jpg-converter",
  "qr-generator",
  "json-formatter",
];

const HERO_TITLE = "TOOLMITRA";

type RGBChannel = "red" | "green" | "blue";

type RGBColor = Record<RGBChannel, number>;

const RGB_SLIDERS = [
  {
    key: "red",
    label: "Red",
    color: "rgb(255, 110, 140)",
    glow: "rgba(255, 110, 140, 0.34)",
  },
  {
    key: "green",
    label: "Green",
    color: "rgb(88, 208, 152)",
    glow: "rgba(88, 208, 152, 0.34)",
  },
  {
    key: "blue",
    label: "Blue",
    color: "rgb(102, 160, 255)",
    glow: "rgba(102, 160, 255, 0.34)",
  },
] as const;

const WHITE_RGB: RGBColor = { red: 255, green: 255, blue: 255 };
const DARK_BASE_RGB: RGBColor = { red: 2, green: 2, blue: 2 };
const SURFACE_BASE_RGB: RGBColor = { red: 7, green: 7, blue: 7 };
const DARK_TEXT_RGB: RGBColor = { red: 34, green: 31, blue: 40 };
const LIGHT_TEXT_RGB: RGBColor = { red: 242, green: 242, blue: 247 };
const BASE_TEXT_RGB: RGBColor = { red: 150, green: 150, blue: 160 };
const BASE_SHADOW_RGB: RGBColor = { red: 0, green: 0, blue: 0 };
const BASE_SHADOW_STRONG_RGB: RGBColor = { red: 0, green: 0, blue: 0 };
const INITIAL_RGB: RGBColor = { red: 244, green: 244, blue: 245 };

const clampChannel = (value: number) => Math.max(0, Math.min(255, Math.round(value)));

const parseStoredRgb = (value: string | undefined): RGBColor | null => {
  if (!value) return null;

  const rgbMatch = value.match(
    /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*[\d.]+\s*)?\)/
  );
  if (rgbMatch) {
    return {
      red: clampChannel(Number(rgbMatch[1])),
      green: clampChannel(Number(rgbMatch[2])),
      blue: clampChannel(Number(rgbMatch[3])),
    };
  }

  const hex = value.trim().replace("#", "");
  if (hex.length === 6 && /^[\da-fA-F]{6}$/.test(hex)) {
    return {
      red: clampChannel(parseInt(hex.slice(0, 2), 16)),
      green: clampChannel(parseInt(hex.slice(2, 4), 16)),
      blue: clampChannel(parseInt(hex.slice(4, 6), 16)),
    };
  }

  return null;
};

const mixRgb = (base: RGBColor, target: RGBColor, amount: number): RGBColor => ({
  red: clampChannel(base.red + (target.red - base.red) * amount),
  green: clampChannel(base.green + (target.green - base.green) * amount),
  blue: clampChannel(base.blue + (target.blue - base.blue) * amount),
});

const rgbString = (rgb: RGBColor) => `rgb(${rgb.red}, ${rgb.green}, ${rgb.blue})`;

const rgbaString = (rgb: RGBColor, alpha: number) =>
  `rgba(${rgb.red}, ${rgb.green}, ${rgb.blue}, ${alpha})`;

const rgbToHex = (rgb: RGBColor) =>
  `#${rgb.red.toString(16).padStart(2, "0")}${rgb.green
    .toString(16)
    .padStart(2, "0")}${rgb.blue.toString(16).padStart(2, "0")}`.toUpperCase();

const isSameRgb = (left: RGBColor, right: RGBColor) =>
  left.red === right.red && left.green === right.green && left.blue === right.blue;

const channelToLinear = (value: number) => {
  const normalized = value / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

const relativeLuminance = (rgb: RGBColor) =>
  0.2126 * channelToLinear(rgb.red) +
  0.7152 * channelToLinear(rgb.green) +
  0.0722 * channelToLinear(rgb.blue);

const contrastRatio = (left: RGBColor, right: RGBColor) => {
  const lighter = Math.max(relativeLuminance(left), relativeLuminance(right));
  const darker = Math.min(relativeLuminance(left), relativeLuminance(right));
  return (lighter + 0.05) / (darker + 0.05);
};

const pickContrastColor = (
  background: RGBColor,
  dark = DARK_TEXT_RGB,
  light = WHITE_RGB
) => (contrastRatio(background, dark) >= contrastRatio(background, light) ? dark : light);

const improveContrast = (
  foreground: RGBColor,
  background: RGBColor,
  target: RGBColor,
  minRatio: number
) => {
  let candidate = foreground;

  for (let step = 0; step < 6; step += 1) {
    if (contrastRatio(candidate, background) >= minRatio) {
      return candidate;
    }
    candidate = mixRgb(candidate, target, 0.22);
  }

  return candidate;
};

const rgbToHsl = (rgb: RGBColor) => {
  const red = rgb.red / 255;
  const green = rgb.green / 255;
  const blue = rgb.blue / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const lightness = (max + min) / 2;
  const delta = max - min;

  if (delta === 0) {
    return { hue: 0, saturation: 0, lightness };
  }

  const saturation =
    delta / (1 - Math.abs(2 * lightness - 1));

  let hue = 0;
  switch (max) {
    case red:
      hue = ((green - blue) / delta) % 6;
      break;
    case green:
      hue = (blue - red) / delta + 2;
      break;
    default:
      hue = (red - green) / delta + 4;
      break;
  }

  hue *= 60;
  if (hue < 0) hue += 360;

  return { hue, saturation, lightness };
};

const CORE_FEATURES = [
  {
    key: "document",
    title: "Document",
    desc: "PDF merge, split, convert, and protect every document workflow in one place.",
    icon: FileText,
    color: "#e07a5f",
  },
  {
    key: "image",
    title: "Image",
    desc: "Daily needed image tools, compressor, converter, resizer, and optimization.",
    icon: ImageIcon,
    color: "#e07a5f",
  },
  {
    key: "developer",
    title: "Developer",
    desc: "JSON formatter, QR codes, and Base64 utilities for quick technical tasks.",
    icon: Code2,
    color: "#e07a5f",
  },
];



export default function Home() {
  const [search, setSearch] = useState("");
  const [activeFeature, setActiveFeature] = useState(1);
  const [rgb, setRgb] = useState<RGBColor>(INITIAL_RGB);
  const [isThemeMeterOpen, setIsThemeMeterOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [themeMode, setThemeMode] = useState<ThemeMode>("day");
  const [hasRestoredTheme, setHasRestoredTheme] = useState(false);

  const primaryFeaturedTools = useMemo(
    () => tools.filter((t) => FEATURED_PRIMARY_SLUGS.includes(t.slug)),
    []
  );

  const secondaryFeaturedTools = useMemo(
    () => tools.filter((t) => FEATURED_SECONDARY_SLUGS.includes(t.slug)),
    []
  );

  const displayedTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q)
      return tools.filter((t) =>
        [...FEATURED_PRIMARY_SLUGS, ...FEATURED_SECONDARY_SLUGS].includes(t.slug)
      );
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [search]);

  const isSearching = search.trim().length > 0;
  const activeTheme = useMemo(() => {
    const accent = rgb;
    const { saturation } = rgbToHsl(accent);
    const brightness = Math.max(accent.red, accent.green, accent.blue) / 255;
    const meterValue = Math.round((saturation * 0.72 + brightness * 0.28) * 100);

    if (themeMode === "day") {
      const lightBgBase: RGBColor = { red: 244, green: 240, blue: 232 };
      const lightSurfaceBase: RGBColor = { red: 255, green: 250, blue: 242 };
      const warmShadowBase: RGBColor = { red: 161, green: 143, blue: 121 };
      const warmShadowStrongBase: RGBColor = { red: 138, green: 117, blue: 92 };

      const bg = mixRgb(lightBgBase, accent, 0.045);
      const surface = mixRgb(lightSurfaceBase, accent, 0.035);
      const text = improveContrast(DARK_TEXT_RGB, bg, DARK_BASE_RGB, 7.5);
      const textMuted = improveContrast(
        { red: 111, green: 98, blue: 84 },
        bg,
        DARK_BASE_RGB,
        4.6
      );
      const accentDark = mixRgb(accent, DARK_BASE_RGB, 0.24);
      const accentInk = improveContrast(
        mixRgb(accent, DARK_BASE_RGB, 0.38),
        bg,
        DARK_BASE_RGB,
        4.5
      );
      const onAccent = pickContrastColor(accent, DARK_TEXT_RGB, WHITE_RGB);
      const footerText = text;
      const footerTextMuted = rgbaString(footerText, 0.72);
      const footerTextSoft = rgbaString(footerText, 0.52);
      const footerBorder = rgbaString(footerText, 0.1);
      const shadowDark = mixRgb(warmShadowBase, accent, 0.08);
      const shadowDarkStrong = mixRgb(warmShadowStrongBase, accent, 0.1);
      const shadowLight = WHITE_RGB;

      return {
        accent,
        accentDark,
        accentInk,
        bg,
        surface,
        text,
        textMuted,
        onAccent,
        onAccentMuted: rgbaString(onAccent, isSameRgb(onAccent, WHITE_RGB) ? 0.9 : 0.78),
        accentShadowDark: mixRgb(accent, DARK_BASE_RGB, 0.48),
        accentShadowLight: mixRgb(accent, WHITE_RGB, 0.42),
        shadowDark,
        shadowDarkStrong,
        shadowLight,
        meterValue,
        accentHex: rgbToHex(accent),
        glow: rgbaString(accent, 0.1),
        glowSoft: rgbaString(accent, 0.05),
        glowStrong: rgbaString(accent, 0.18),
        accentSoft: rgbaString(accent, 0.12),
        accentSurface: rgbaString(accent, 0.16),
        footerBg: `linear-gradient(180deg, ${rgbString(surface)}, ${rgbString(bg)})`,
        footerText,
        footerTextMuted,
        footerTextSoft,
        footerBorder,
      };
    }

    const accentDark = mixRgb(accent, DARK_BASE_RGB, 0.18);
    const bg = mixRgb(DARK_BASE_RGB, accent, 0.02);
    const surface = mixRgb(SURFACE_BASE_RGB, accent, 0.035);
    const text = improveContrast(
      mixRgb(LIGHT_TEXT_RGB, accent, 0.015),
      bg,
      WHITE_RGB,
      9.2
    );
    const textMuted = improveContrast(
      mixRgb(BASE_TEXT_RGB, bg, 0.08),
      bg,
      text,
      4.6
    );
    const accentInk = improveContrast(
      mixRgb(accent, WHITE_RGB, 0.16),
      bg,
      WHITE_RGB,
      3.3
    );
    const onAccent = pickContrastColor(accent, DARK_TEXT_RGB, WHITE_RGB);
    const onAccentMuted = rgbaString(onAccent, isSameRgb(onAccent, WHITE_RGB) ? 0.88 : 0.72);
    const footerText = WHITE_RGB;
    const footerTextMuted = rgbaString(footerText, 0.78);
    const footerTextSoft = rgbaString(footerText, 0.58);
    const footerBorder = rgbaString(footerText, 0.16);
    const accentShadowDark = mixRgb(accent, BASE_SHADOW_STRONG_RGB, 0.62);
    const accentShadowLight = mixRgb(accent, WHITE_RGB, 0.1);
    const shadowDark = mixRgb(bg, BASE_SHADOW_RGB, 0.6);
    const shadowDarkStrong = mixRgb(bg, BASE_SHADOW_STRONG_RGB, 0.76);
    const shadowLight = mixRgb(surface, WHITE_RGB, 0.09);

    return {
      accent,
      accentDark,
      accentInk,
      bg,
      surface,
      text,
      textMuted,
      onAccent,
      onAccentMuted,
      accentShadowDark,
      accentShadowLight,
      shadowDark,
      shadowDarkStrong,
      shadowLight,
      meterValue,
      accentHex: rgbToHex(accent),
      glow: rgbaString(accent, 0.05),
      glowSoft: rgbaString(accent, 0.025),
      glowStrong: rgbaString(accent, 0.08),
      accentSoft: rgbaString(accent, 0.05),
      accentSurface: rgbaString(accent, 0.08),
      footerBg: `linear-gradient(180deg, ${rgbString(mixRgb(DARK_BASE_RGB, accent, 0.03))}, ${rgbString(
        mixRgb(DARK_BASE_RGB, BASE_SHADOW_STRONG_RGB, 0.12)
      )})`,
      footerText,
      footerTextMuted,
      footerTextSoft,
      footerBorder,
    };
  }, [rgb, themeMode]);
  const pageThemeStyle = useMemo(
    () =>
      ({
        "--nm-bg": rgbString(activeTheme.bg),
        "--nm-surface": rgbString(activeTheme.surface),
        "--nm-accent": rgbString(activeTheme.accent),
        "--nm-accent-dark": rgbString(activeTheme.accentDark),
        "--nm-accent-ink": rgbString(activeTheme.accentInk),
        "--nm-text": rgbString(activeTheme.text),
        "--nm-text-muted": rgbString(activeTheme.textMuted),
        "--nm-on-accent": rgbString(activeTheme.onAccent),
        "--nm-on-accent-muted": activeTheme.onAccentMuted,
        "--nm-glow": activeTheme.glow,
        "--nm-glow-soft": activeTheme.glowSoft,
        "--nm-glow-strong": activeTheme.glowStrong,
        "--nm-accent-soft": activeTheme.accentSoft,
        "--nm-accent-surface": activeTheme.accentSurface,
        "--nm-shadow-dark-color": rgbString(activeTheme.shadowDark),
        "--nm-shadow-dark-strong-color": rgbString(activeTheme.shadowDarkStrong),
        "--nm-shadow-light-color": rgbString(activeTheme.shadowLight),
        "--nm-shadow-out": `0 0 0 1px ${rgbaString(activeTheme.shadowLight, 0.08)}, 0 18px 46px ${rgbaString(activeTheme.shadowDark, 0.82)}`,
        "--nm-shadow-in": `inset 0 0 0 1px ${rgbaString(activeTheme.shadowLight, 0.04)}, inset 0 12px 24px ${rgbaString(activeTheme.shadowLight, 0.015)}, inset 0 -18px 28px ${rgbaString(activeTheme.shadowDarkStrong, 0.62)}`,
        "--nm-shadow-lg": `0 0 0 1px ${rgbaString(activeTheme.shadowLight, 0.08)}, 0 24px 64px ${rgbaString(activeTheme.shadowDarkStrong, 0.86)}`,
        "--nm-shadow-hover": `0 0 0 1px ${rgbaString(activeTheme.shadowLight, 0.1)}, 0 22px 56px ${rgbaString(activeTheme.shadowDarkStrong, 0.82)}`,
        "--nm-shadow-press": `inset 0 0 0 1px ${rgbaString(activeTheme.shadowLight, 0.04)}, inset 0 18px 30px ${rgbaString(activeTheme.shadowDarkStrong, 0.74)}`,
        "--nm-shadow-accent-press": `inset 0 0 0 1px ${rgbaString(activeTheme.accentShadowLight, 0.12)}, inset 0 14px 28px ${rgbaString(activeTheme.accentShadowDark, 0.22)}, 0 0 24px ${rgbaString(activeTheme.accent, 0.04)}`,
        "--nm-meter-color": rgbString(activeTheme.accent),
        "--nm-meter-glow": activeTheme.glowStrong,
        "--nm-footer-bg": activeTheme.footerBg,
        "--nm-footer-text": rgbString(activeTheme.footerText),
        "--nm-footer-text-muted": activeTheme.footerTextMuted,
        "--nm-footer-text-soft": activeTheme.footerTextSoft,
        "--nm-footer-border": activeTheme.footerBorder,
      }) as CSSProperties,
    [activeTheme]
  );

  useEffect(() => {
    const savedMode = getSavedThemeMode();
    setThemeMode(savedMode);

    try {
      const saved = localStorage.getItem("nm-theme");
      if (saved) {
        const vars = JSON.parse(saved) as Record<string, string>;
        const savedAccent = parseStoredRgb(vars["--nm-accent"]);
        if (savedAccent) {
          setRgb(savedAccent);
        }
      }
    } catch {
      // Ignore invalid saved theme payloads and keep defaults.
    }

    setHasRestoredTheme(true);

    const handleThemeModeChange = (event: Event) => {
      setThemeMode((event as CustomEvent<ThemeMode>).detail);
    };

    window.addEventListener("nm-theme-mode-change", handleThemeModeChange);
    return () => window.removeEventListener("nm-theme-mode-change", handleThemeModeChange);
  }, []);

  useEffect(() => {
    if (!hasRestoredTheme) {
      return;
    }

    const root = document.documentElement;
    const vars = pageThemeStyle as Record<string, string>;

    for (const [key, value] of Object.entries(vars)) {
      root.style.setProperty(key, value);
    }

    // Persist so other pages (e.g. /tools) can inherit the theme
    try { localStorage.setItem("nm-theme", JSON.stringify(vars)); } catch {}
  }, [hasRestoredTheme, pageThemeStyle]);

  useEffect(() => {
    const body = document.body;

    body.classList.add("nm-shell-active");

    return () => {
      body.classList.remove("nm-shell-active");
      // CSS vars intentionally kept on :root so SPA-navigated pages inherit the theme
    };
  }, []);

  useEffect(() => {
    const body = document.body;

    body.classList.toggle("nm-theme-meter-open", isThemeMeterOpen);

    return () => {
      body.classList.remove("nm-theme-meter-open");
    };
  }, [isThemeMeterOpen]);

  useEffect(() => {
    if (!isThemeMeterOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsThemeMeterOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isThemeMeterOpen]);

  const handleRgbChange = (channel: RGBChannel, value: number) => {
    setRgb((current) => ({
      ...current,
      [channel]: clampChannel(value),
    }));
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(activeTheme.accentHex).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="nm-page" data-theme-mode={themeMode} style={pageThemeStyle}>
      {/* ── HERO ── */}
      <section className="nm-hero">
        <div className="nm-hero-inner">
          <div className="nm-hero-copy">
            <div className="nm-hero-badge">Powerful Tools for everyday life</div>
            <h1 className="nm-hero-title" aria-label={HERO_TITLE}>
              <span className="nm-hero-title-line" aria-hidden="true">
                {HERO_TITLE.split("").map((char, index) => (
                  <span
                    key={`${char}-${index}`}
                    className="nm-hero-title-char"
                    style={{ "--char-index": index } as CSSProperties}
                  >
                    {char}
                  </span>
                ))}
              </span>
            </h1>
            <p className="nm-hero-desc">
              Compress images, convert PDFs, transform documents, and optimize
              files — all in one fast, secure, and easy-to-use platform.
            </p>

            <div className="nm-search-row">
              <div className="nm-search-wrap">
                <input
                  suppressHydrationWarning
                  className="nm-search-input"
                  placeholder="Search any tool"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="nm-search-icon-btn" aria-label="Search">
                  <Search size={18} />
                </button>
              </div>
            </div>

            <div className="nm-hero-actions">
              <Link href="/tools" className="nm-launch-btn">
                launch all tools
              </Link>
              <button
                type="button"
                className="nm-theme-mobile-trigger"
                aria-expanded={isThemeMeterOpen}
                aria-controls="nm-theme-meter-panel"
                onClick={() => setIsThemeMeterOpen(true)}
              >
                <SlidersHorizontal size={16} />
                Color engine
              </button>
            </div>
          </div>

          <aside
            id="nm-theme-meter-panel"
            className={`nm-theme-meter ${isThemeMeterOpen ? "is-open" : ""}`}
            aria-label="Theme color controller"
          >
            <div className="nm-theme-meter-head">
              <p className="nm-theme-meter-label">Color Engine</p>
              <button
                type="button"
                className="nm-theme-meter-close"
                aria-label="Close color engine"
                onClick={() => setIsThemeMeterOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="nm-theme-orb-shell">
              <div className="nm-theme-orb">
                <div className="nm-theme-orb-ring">
                  {/* SVG arc — gradient + rounded caps + glow bloom */}
                  <svg
                    className="nm-theme-orb-arc"
                    viewBox="0 0 100 100"
                    aria-hidden="true"
                  >
                    <defs>
                      {/* White highlight → accent: simulates a "lit" neon feel */}
                      <linearGradient id="nm-arc-grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%"   stopColor="white"                        stopOpacity="0.92" />
                        <stop offset="22%"  stopColor={rgbString(activeTheme.accent)} stopOpacity="0.82" />
                        <stop offset="100%" stopColor={rgbString(activeTheme.accent)} stopOpacity="1"    />
                      </linearGradient>
                    </defs>

                    {/* Glow bloom — wide blurred arc for soft ambient light */}
                    <circle
                      cx="50" cy="50" r="43"
                      transform="rotate(-90 50 50)"
                      style={{
                        fill: "none",
                        stroke: rgbString(activeTheme.accent),
                        strokeWidth: 22,
                        strokeLinecap: "round",
                        strokeDasharray: `${(2 * Math.PI * 43 * Math.max(activeTheme.meterValue, 8) / 100).toFixed(3)} ${(2 * Math.PI * 43).toFixed(3)}`,
                        opacity: 0.36,
                        filter: "blur(5px)",
                      }}
                    />

                    {/* Main arc — gradient + rounded ends */}
                    <circle
                      className="nm-theme-orb-arc-fill"
                      cx="50"
                      cy="50"
                      r="43"
                      transform="rotate(-90 50 50)"
                      style={{
                        strokeDasharray: `${(2 * Math.PI * 43 * Math.max(activeTheme.meterValue, 8) / 100).toFixed(3)} ${(2 * Math.PI * 43).toFixed(3)}`,
                        stroke: "url(#nm-arc-grad)",
                      }}
                    />
                  </svg>
                  <div className="nm-theme-orb-hole">
                    <div className="nm-theme-orb-core" aria-hidden="true" />
                    <div className="nm-theme-orb-value-badge">
                      <span className="nm-theme-orb-value">{activeTheme.meterValue}%</span>
                    </div>
                    <button
                      type="button"
                      className={`nm-theme-copy-btn ${isCopied ? "is-copied" : ""}`}
                      onClick={handleCopyHex}
                      aria-label={isCopied ? "Copied!" : "Copy hex color code"}
                    >
                      {isCopied ? <Check size={11} /> : <Copy size={11} />}
                      <span>{isCopied ? "Copied!" : activeTheme.accentHex}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="nm-theme-bars" role="group" aria-label="RGB color sliders">
              {RGB_SLIDERS.map((slider) => {
                const value = rgb[slider.key];
                const valuePercent = Math.round((value / 255) * 100);

                return (
                  <label key={slider.key} className="nm-theme-slider">
                    <span
                      className="nm-theme-slider-ui"
                      style={
                        {
                          "--slider-height": `${valuePercent}%`,
                          "--slider-color": slider.color,
                          "--slider-glow": slider.glow,
                        } as CSSProperties
                      }
                    >
                      <input
                        className="nm-theme-slider-input"
                        type="range"
                        min={0}
                        max={255}
                        value={value}
                        onChange={(event) =>
                          handleRgbChange(slider.key, Number(event.target.value))
                        }
                        onInput={(event) =>
                          handleRgbChange(
                            slider.key,
                            Number((event.target as HTMLInputElement).value)
                          )
                        }
                        aria-label={`${slider.label} color channel`}
                      />
                      <span className="nm-theme-slider-track" aria-hidden="true">
                        <span className="nm-theme-slider-fill" />
                      </span>
                    </span>
                    <span className="nm-theme-slider-meta">
                      <span className="nm-theme-slider-name">{slider.label}</span>
                      <span className="nm-theme-slider-value">{value}</span>
                    </span>
                  </label>
                );
              })}
            </div>
          </aside>
        </div>
      </section>
      <button
        type="button"
        className={`nm-theme-meter-backdrop ${isThemeMeterOpen ? "is-open" : ""}`}
        aria-label="Close color engine"
        onClick={() => setIsThemeMeterOpen(false)}
      />

      {/* ── TOOLS SECTION ── */}
      <section className="nm-tools-section" id="nm-tools">
        <div className="nm-section-inner">
          <div className="nm-section-head">
            <h2 className="nm-section-title">
              {isSearching ? `Results for "${search}"` : "Important Tools"}
            </h2>
            {isSearching && (
              <button
                type="button"
                className="nm-clear-btn"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>

          {displayedTools.length > 0 ? (
            isSearching ? (
              <div className="nm-tools-grid">
                {displayedTools.map((tool, i) => {
                  const Icon = TOOL_ICON[tool.slug] ?? FileText;
                  const cat =
                    CATEGORY_LABEL[tool.category as CategoryKey] ??
                    tool.category;
                  return (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="nm-tool-card nm-tool-card-sm"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="nm-tool-cat-row">
                        <span className="nm-dot" />
                        <span className="nm-cat-label">{cat}</span>
                      </div>
                      <div className="nm-tool-icon-wrap">
                        <Icon size={44} className="nm-tool-icon" />
                      </div>
                      <div className="nm-tool-info">
                        <h3 className="nm-tool-name">{tool.name}</h3>
                        <p className="nm-tool-desc">{tool.description}</p>
                      </div>
                      <div className="nm-tool-btn">Launch tool</div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="nm-tools-layout">
                {/* Primary large cards */}
                <div className="nm-tools-grid nm-tools-primary">
                  {primaryFeaturedTools.map((tool, i) => {
                    const Icon = TOOL_ICON[tool.slug] ?? FileText;
                    const cat =
                      CATEGORY_LABEL[tool.category as CategoryKey] ??
                      tool.category;
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="nm-tool-card nm-tool-card-lg"
                        style={{ animationDelay: `${100 + i * 80}ms` }}
                      >
                        <div className="nm-tool-cat-row">
                          <span className="nm-dot" />
                          <span className="nm-cat-label">{cat}</span>
                        </div>
                        <div className="nm-tool-icon-wrap">
                          <Icon size={56} className="nm-tool-icon" />
                        </div>
                        <div className="nm-tool-info">
                          <h3 className="nm-tool-name">{tool.name}</h3>
                          <p className="nm-tool-desc">{tool.description}</p>
                        </div>
                        <div className="nm-tool-btn">Launch tool</div>
                      </Link>
                    );
                  })}
                </div>

                {/* Secondary compact cards */}
                <div className="nm-tools-grid nm-tools-secondary">
                  {secondaryFeaturedTools.map((tool, i) => {
                    const Icon = TOOL_ICON[tool.slug] ?? FileText;
                    const cat =
                      CATEGORY_LABEL[tool.category as CategoryKey] ??
                      tool.category;
                    return (
                      <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="nm-tool-card nm-tool-card-sm"
                        style={{ animationDelay: `${280 + i * 70}ms` }}
                      >
                        <div className="nm-tool-cat-row">
                          <span className="nm-dot" />
                          <span className="nm-cat-label">{cat}</span>
                        </div>
                        <div className="nm-tool-icon-wrap">
                          <Icon size={42} className="nm-tool-icon" />
                        </div>
                        <div className="nm-tool-info">
                          <h3 className="nm-tool-name">{tool.name}</h3>
                          <p className="nm-tool-desc">{tool.description}</p>
                        </div>
                        <div className="nm-tool-btn">Launch tool</div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <div className="nm-empty-state">
              <Search size={28} />
              <p>No tools found for &ldquo;{search}&rdquo;</p>
              <button
                type="button"
                className="nm-clear-btn"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="nm-about-section" id="about">
        <div className="nm-about-inner">
          <div className="nm-about-head">
            <span className="nm-about-eyebrow">About</span>
            <h2 className="nm-about-title">TOOLMITRA</h2>
          </div>
          <div className="nm-about-badge">Simple Tools. Powerful Results.</div>
          <div className="nm-about-body">
            <p>
              Toolmitra is built for people who need practical online tools without
              the usual clutter, confusing steps, or slow desktop-style workflows.
              Whether you are compressing images for a website, converting a PDF for
              work, preparing SEO assets, or running everyday calculations, the goal
              stays the same: help you finish the task quickly in a clean browser
              experience.
            </p>
            <p>
              The platform brings together image tools, document tools, video tools,
              developer utilities, SEO helpers, and calculators in one place so you
              do not have to jump between multiple websites for small but important
              tasks. Toolmitra focuses on clarity, speed, and lightweight workflows
              that feel easy on both desktop and mobile.
            </p>
            <p>
              Built with performance and usability in mind, Toolmitra is designed to
              make common digital work simpler. Instead of forcing users through
              complicated interfaces, it gives straightforward tools that are fast to
              understand, fast to use, and useful in real daily workflows.
            </p>
          </div>
        </div>
      </section>

      {/* ── CORE FEATURES ── */}
      <section className="nm-features-section" id="features">
        <p className="nm-features-eyebrow">CORE</p>
        <h2 className="nm-features-title">Features</h2>
        <div className="nm-features-carousel">
          {CORE_FEATURES.map((feat, idx) => {
            const FeatIcon = feat.icon;
            const isActive = idx === activeFeature;
            const isPrev = idx < activeFeature;
            const isNext = idx > activeFeature;
            return (
              <button
                key={feat.key}
                type="button"
                onClick={() => setActiveFeature(idx)}
                className={`nm-feat-card ${isActive ? "nm-feat-active" : ""} ${isPrev ? "nm-feat-prev" : ""} ${isNext ? "nm-feat-next" : ""}`}
                style={isActive ? ({ background: "var(--nm-accent)" } as CSSProperties) : {}}
              >
                {isActive && (
                  <div className="nm-feat-active-bg">
                    <FeatIcon size={90} className="nm-feat-bg-icon" />
                  </div>
                )}
                <div className="nm-feat-content">
                  <h3 className="nm-feat-title">{feat.title}</h3>
                  <p className="nm-feat-desc">{feat.desc}</p>
                </div>
                <FeatIcon
                  size={isActive ? 64 : 40}
                  className="nm-feat-icon"
                  aria-hidden
                />
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}
