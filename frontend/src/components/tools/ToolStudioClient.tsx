"use client";

import type { CSSProperties } from "react";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowUpRight,
  Calculator,
  Code2,
  FileText,
  Image as ImageIcon,
  Search,
  Video,
  type LucideIcon,
} from "lucide-react";

import { categories, tools } from "@/lib/tools";
import type { ToolCategory } from "@/types/tool.types";

function isToolCategory(value: string): value is ToolCategory {
  return (categories as string[]).includes(value);
}

const CATEGORY_META: Record<
  string,
  {
    title: string;
    description: string;
    accent: string;
    soft: string;
    glow: string;
    icon: LucideIcon;
    eyebrow: string;
  }
> = {
  "Image Tools": {
    title: "Image",
    description: "Compress, resize & convert images",
    accent: "#5b8dee",
    soft: "rgba(91, 141, 238, 0.16)",
    glow: "rgba(91, 141, 238, 0.34)",
    icon: ImageIcon,
    eyebrow: "Image",
  },
  "Document Tools": {
    title: "Document",
    description: "PDF, Word & Excel conversions",
    accent: "#e07a5f",
    soft: "rgba(224, 122, 95, 0.16)",
    glow: "rgba(224, 122, 95, 0.34)",
    icon: FileText,
    eyebrow: "Document",
  },
  "Video Tools": {
    title: "Video",
    description: "Convert, cut and optimize videos",
    accent: "#f97316",
    soft: "rgba(249, 115, 22, 0.16)",
    glow: "rgba(249, 115, 22, 0.34)",
    icon: Video,
    eyebrow: "Video",
  },
  "Developer Tools": {
    title: "Developer",
    description: "JSON, QR codes & Base64 utilities",
    accent: "#3db36b",
    soft: "rgba(61, 179, 107, 0.16)",
    glow: "rgba(61, 179, 107, 0.34)",
    icon: Code2,
    eyebrow: "Developer",
  },
  "SEO Tools": {
    title: "SEO",
    description: "Meta tags, sitemap and search optimization helpers",
    accent: "#6ab7ff",
    soft: "rgba(106, 183, 255, 0.16)",
    glow: "rgba(106, 183, 255, 0.34)",
    icon: Search,
    eyebrow: "SEO",
  },
  Calculators: {
    title: "Calculator",
    description: "GST, EMI, SIP & more",
    accent: "#9b72e8",
    soft: "rgba(155, 114, 232, 0.16)",
    glow: "rgba(155, 114, 232, 0.34)",
    icon: Calculator,
    eyebrow: "Calculator",
  },
};

export default function ToolStudioClient() {
  const searchParams = useSearchParams();
  const requestedCategory = searchParams.get("category");
  const [activeCategory, setActiveCategory] = useState<string>(categories[0] ?? "");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    if (requestedCategory && isToolCategory(requestedCategory)) {
      setActiveCategory(requestedCategory);
    }
  }, [requestedCategory]);

  const toolCounts = useMemo(
    () =>
      categories.reduce<Record<string, number>>((acc, category) => {
        acc[category] = tools.filter((tool) => tool.category === category).length;
        return acc;
      }, {}),
    []
  );

  const visibleTools = useMemo(() => {
    const query = deferredSearch.trim().toLowerCase();

    return tools.filter((tool) => {
      const matchesCategory = tool.category === activeCategory;
      const matchesSearch =
        !query ||
        tool.name.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query) ||
        tool.slug.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, deferredSearch]);

  const activeMeta = CATEGORY_META[activeCategory] ?? CATEGORY_META[categories[0]];

  const pageStyle = {
    "--studio-accent": activeMeta.accent,
    "--studio-soft": activeMeta.soft,
    "--studio-glow": activeMeta.glow,
  } as CSSProperties;

  return (
    <div
      data-studio-theme="dark"
      className="studio-page studio-browser-page"
      style={pageStyle}
    >
      <div className="studio-orb studio-orb-a" aria-hidden />
      <div className="studio-orb studio-orb-b" aria-hidden />

      <div className="studio-browser-shell">
        <section className="studio-browser-search-shell">
          <div className="studio-browser-search">
            <Search size={18} strokeWidth={2} />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search any tool..."
              aria-label="Search tools"
            />
          </div>
        </section>

        <section className="studio-browser-categories">
          <p className="studio-browser-label">Browse by category</p>

          <div className="studio-browser-cats-grid">
            {categories.map((category) => {
              const meta = CATEGORY_META[category];
              if (!meta) return null;
              const Icon = meta.icon;
              const isActive = activeCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  className={`studio-browser-cat${
                    isActive ? " studio-browser-cat--active" : ""
                  }`}
                  onClick={() => setActiveCategory(category)}
                  style={
                    {
                      "--browser-accent": meta.accent,
                      "--browser-soft": meta.soft,
                      "--browser-glow": meta.glow,
                    } as CSSProperties
                  }
                  aria-pressed={isActive}
                >
                  <span className="studio-browser-cat__count">
                    {toolCounts[category]}
                  </span>
                  <span className="studio-browser-cat__icon">
                    <Icon size={22} strokeWidth={1.9} />
                  </span>
                  <span className="studio-browser-cat__title">{meta.title}</span>
                  <span className="studio-browser-cat__desc">
                    {meta.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="studio-browser-results">
          <div className="studio-browser-results-head">
            <div>
              <h1>{activeCategory}</h1>
              <p>
                {visibleTools.length} tool{visibleTools.length === 1 ? "" : "s"}
              </p>
            </div>

            {search ? (
              <button
                type="button"
                className="studio-browser-clear"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            ) : null}
          </div>

          {visibleTools.length ? (
            <div className="studio-browser-card-grid">
              {visibleTools.map((tool) => {
                const ToolIcon = activeMeta.icon;

                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="studio-browser-card"
                  >
                    <div className="studio-browser-card__icon">
                      <ToolIcon size={22} strokeWidth={1.9} />
                    </div>

                    <div className="studio-browser-card__copy">
                      <p className="studio-browser-card__eyebrow">
                        {activeMeta.eyebrow}
                      </p>
                      <h2>{tool.name}</h2>
                      <p>{tool.description}</p>
                    </div>

                    <ArrowUpRight
                      size={18}
                      strokeWidth={2.2}
                      className="studio-browser-card__arrow"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="studio-browser-empty">
              <h2>No tools match your search.</h2>
              <p>Try a different keyword or clear the search to browse this category.</p>
              <button
                type="button"
                className="studio-browser-clear"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
