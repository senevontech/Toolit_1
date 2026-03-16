"use client";

import type { CSSProperties } from "react";
import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Moon,
  Search,
  Sparkles,
  SunMedium,
  Wrench,
} from "lucide-react";

import ToolRenderer from "@/components/tools/ToolRenderer";
import { categories, getToolBySlug, tools } from "@/lib/tools";

const ALL_TOOLS = "All Tools";

const CATEGORY_META: Record<
  string,
  { label: string; accent: string; soft: string; glow: string }
> = {
  "Image Tools": {
    label: "Pixels, format shifts and batch cleanup.",
    accent: "#7c3aed",
    soft: "rgba(196, 181, 253, 0.34)",
    glow: "rgba(124, 58, 237, 0.22)",
  },
  "Document Tools": {
    label: "PDF flows and office conversion tasks.",
    accent: "#2563eb",
    soft: "rgba(147, 197, 253, 0.32)",
    glow: "rgba(37, 99, 235, 0.2)",
  },
  "Developer Tools": {
    label: "Formatting, encoding and quick utility work.",
    accent: "#059669",
    soft: "rgba(110, 231, 183, 0.3)",
    glow: "rgba(5, 150, 105, 0.22)",
  },
  Calculators: {
    label: "Fast finance and daily math helpers.",
    accent: "#ea580c",
    soft: "rgba(253, 186, 116, 0.32)",
    glow: "rgba(234, 88, 12, 0.24)",
  },
};

const FILTERS = [ALL_TOOLS, ...categories];

const STATS = [
  { label: "Tools online", value: `${tools.length}` },
  { label: "Categories", value: `${categories.length}` },
  { label: "Runs local", value: "Most" },
];

export default function ToolStudioClient() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [activeFilter, setActiveFilter] = useState<string>(ALL_TOOLS);
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState(tools[0]?.slug ?? "");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem("toolit-studio-theme");

    if (savedTheme === "light" || savedTheme === "dark") {
      setTheme(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    setTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    window.localStorage.setItem("toolit-studio-theme", theme);
  }, [theme]);

  const filteredTools = tools.filter((tool) => {
    const searchValue = deferredSearch.trim().toLowerCase();
    const matchesCategory =
      activeFilter === ALL_TOOLS || tool.category === activeFilter;
    const matchesSearch =
      !searchValue ||
      tool.name.toLowerCase().includes(searchValue) ||
      tool.description.toLowerCase().includes(searchValue) ||
      tool.slug.toLowerCase().includes(searchValue);

    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    if (!filteredTools.length) {
      return;
    }

    const hasSelectedTool = filteredTools.some(
      (tool) => tool.slug === selectedSlug,
    );

    if (!hasSelectedTool) {
      setSelectedSlug(filteredTools[0].slug);
    }
  }, [filteredTools, selectedSlug]);

  const selectedTool =
    getToolBySlug(selectedSlug) ?? filteredTools[0] ?? tools[0] ?? null;

  if (!selectedTool) {
    return null;
  }

  const selectedMeta = CATEGORY_META[selectedTool.category];

  const pageStyle = {
    "--studio-accent": selectedMeta.accent,
    "--studio-soft": selectedMeta.soft,
    "--studio-glow": selectedMeta.glow,
  } as CSSProperties;

  const handleSelectTool = (slug: string) => {
    startTransition(() => {
      setSelectedSlug(slug);
    });

    if (window.innerWidth < 1024) {
      window.requestAnimationFrame(() => {
        document
          .getElementById("studio-view")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  };

  return (
    <div
      data-studio-theme={theme}
      className="studio-page"
      style={pageStyle}
    >
      <div className="studio-orb studio-orb-a" aria-hidden />
      <div className="studio-orb studio-orb-b" aria-hidden />

      <div className="studio-shell">
        <section className="studio-surface studio-hero">
          <div className="studio-topbar">
            <div className="studio-topbar-copy">
              <span className="studio-kicker">
                <Sparkles size={14} />
                New workspace
              </span>
              <h1 className="studio-title">Tool Studio</h1>
              <p className="studio-subtitle">
                Every tool is wired into one dynamic workspace. Pick a tool,
                switch theme, and work without leaving the page.
              </p>
            </div>

            <div className="studio-actions">
              <button
                type="button"
                className="studio-theme-toggle"
                onClick={() =>
                  setTheme((current) =>
                    current === "light" ? "dark" : "light",
                  )
                }
                aria-label={`Switch to ${
                  theme === "light" ? "dark" : "light"
                } mode`}
              >
                {theme === "light" ? <Moon size={16} /> : <SunMedium size={16} />}
                <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
              </button>

              <Link href="/" className="studio-link-button">
                Back Home
              </Link>
            </div>
          </div>

          <div className="studio-hero-grid">
            <div className="studio-pressed studio-search-panel">
              <label className="studio-label" htmlFor="studio-search">
                Search tools
              </label>
              <div className="studio-search-wrap">
                <Search size={17} />
                <input
                  id="studio-search"
                  className="studio-search"
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try merge pdf, qr, gst..."
                />
              </div>

              <div className="studio-filter-row">
                {FILTERS.map((filter) => {
                  const isActive = activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      className={`studio-chip ${
                        isActive ? "studio-chip-active" : ""
                      }`}
                      onClick={() => setActiveFilter(filter)}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="studio-stat-grid">
              {STATS.map((stat) => (
                <div key={stat.label} className="studio-stat">
                  <span className="studio-stat-value">{stat.value}</span>
                  <span className="studio-stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="studio-main-grid">
          <aside className="studio-surface studio-sidebar">
            <div className="studio-sidebar-head">
              <div>
                <p className="studio-panel-label">Tool rail</p>
                <h2 className="studio-panel-title">
                  {filteredTools.length} selectable tools
                </h2>
              </div>
              <div className="studio-mini-badge">
                <Wrench size={14} />
                Live
              </div>
            </div>

            <div className="studio-tool-list">
              {filteredTools.length ? (
                filteredTools.map((tool) => {
                  const isActive = selectedTool.slug === tool.slug;

                  return (
                    <button
                      key={tool.slug}
                      type="button"
                      className={`studio-tool-button ${
                        isActive ? "studio-tool-button-active" : ""
                      }`}
                      onClick={() => handleSelectTool(tool.slug)}
                    >
                      <span className="studio-tool-icon">{tool.icon ?? "T"}</span>
                      <span className="studio-tool-copy">
                        <span className="studio-tool-name">{tool.name}</span>
                        <span className="studio-tool-description">
                          {tool.description}
                        </span>
                      </span>
                    </button>
                  );
                })
              ) : (
                <div className="studio-empty">
                  <p>No tools match that filter.</p>
                  <button
                    type="button"
                    className="studio-link-button"
                    onClick={() => {
                      setSearch("");
                      setActiveFilter(ALL_TOOLS);
                    }}
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>
          </aside>

          <section
            id="studio-view"
            className="studio-surface studio-view-shell"
          >
            <div className="studio-view-head">
              <div>
                <p className="studio-panel-label">{selectedTool.category}</p>
                <h2 className="studio-panel-title">{selectedTool.name}</h2>
                <p className="studio-view-copy">{selectedTool.description}</p>
              </div>

              <div className="studio-view-actions">
                <div className="studio-focus-note">{selectedMeta.label}</div>
                <Link
                  href={`/tools/${selectedTool.slug}`}
                  className="studio-open-link"
                >
                  Open dedicated page
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            <div className="studio-category-line" />

            <div className="studio-view-frame">
              <ToolRenderer slug={selectedTool.slug} />
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}
