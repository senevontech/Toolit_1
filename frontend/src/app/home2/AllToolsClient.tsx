"use client";

import { type CSSProperties, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ImageIcon,
  FileText,
  Code2,
  Calculator,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

import { tools, categories } from "@/lib/tools";
import "./alltools.css";

type CategoryKey =
  | "Image Tools"
  | "Document Tools"
  | "Developer Tools"
  | "Calculators";

const CATEGORY_META: Record<
  CategoryKey,
  { icon: LucideIcon; label: string; desc: string; color: string }
> = {
  "Image Tools": { icon: ImageIcon, label: "Image", desc: "Compress, resize & convert images", color: "#5b8dee" },
  "Document Tools": { icon: FileText, label: "Document", desc: "PDF, Word & Excel conversions", color: "#e07a5f" },
  "Developer Tools": { icon: Code2, label: "Developer", desc: "JSON, QR codes & Base64 utilities", color: "#3db36b" },
  Calculators: { icon: Calculator, label: "Calculator", desc: "GST, EMI, SIP & more", color: "#9b72e8" },
};

export default function AllToolsClient() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [search, setSearch] = useState("");

  const isSearching = search.trim().length > 0;

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tools.filter((t) => t.category === activeCategory);
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  }, [search, activeCategory]);

  const countByCategory = useMemo(
    () =>
      Object.fromEntries(
        categories.map((cat) => [
          cat,
          tools.filter((t) => t.category === cat).length,
        ]),
      ),
    [],
  );

  const activeMeta = CATEGORY_META[activeCategory as CategoryKey];

  return (
    <div className="at-page">
      <div className="at-top">
        <div className="at-top__inner">
          <div className="at-search">
            <div className="at-search__field">
              <Search size={18} className="at-search__icon" strokeWidth={2} />
              <input
                className="at-search__input"
                placeholder="Search any tool..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search tools"
              />
              {isSearching && (
                <button
                  className="at-search__clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {!isSearching && (
        <section className="at-cats">
          <div className="at-cats__inner">
            <p className="at-cats__eyebrow">Browse by category</p>
            <div className="at-cats__grid">
              {categories.map((cat) => {
                const meta = CATEGORY_META[cat as CategoryKey];
                if (!meta) return null;
                const Icon = meta.icon;
                const isActive = cat === activeCategory;

                return (
                  <button
                    key={cat}
                    type="button"
                    className={`at-cat-card${isActive ? " at-cat-card--active" : ""}`}
                    style={{ "--cat-color": meta.color } as CSSProperties}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={isActive}
                  >
                    <span className="at-cat-card__badge">
                      {countByCategory[cat]}
                    </span>

                    <div className="at-cat-card__icon">
                      <Icon size={28} strokeWidth={1.8} />
                    </div>

                    <div className="at-cat-card__info">
                      <span className="at-cat-card__name">{meta.label}</span>
                      <span className="at-cat-card__desc">{meta.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="at-tools" id="tools">
        <div className="at-tools__inner">
          <div className="at-tools__head">
            <div>
              <h2 className="at-tools__title">
                {isSearching
                  ? `Results for "${search.trim()}"`
                  : activeCategory}
              </h2>
              <p className="at-tools__count">
                {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""}
              </p>
            </div>
            {isSearching && (
              <button
                className="at-ghost-btn"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            )}
          </div>

          {filteredTools.length > 0 ? (
            <div
              className="at-tools__grid"
              style={
                { "--cat-color": activeMeta?.color } as CSSProperties
              }
            >
              {filteredTools.map((tool) => {
                const meta = CATEGORY_META[tool.category as CategoryKey];
                const Icon = meta?.icon ?? FileText;
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className="at-tool-card"
                    style={
                      {
                        "--cat-color": meta?.color ?? activeMeta?.color,
                      } as CSSProperties
                    }
                  >
                    <div className="at-tool-card__icon">
                      <Icon size={20} strokeWidth={2} />
                    </div>

                    <div className="at-tool-card__body">
                      <span className="at-tool-card__cat">
                        {meta?.label ?? tool.category}
                      </span>
                      <h3 className="at-tool-card__name">{tool.name}</h3>
                      <p className="at-tool-card__desc">{tool.description}</p>
                    </div>

                    <ArrowRight
                      size={16}
                      strokeWidth={2.4}
                      className="at-tool-card__arrow"
                    />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="at-empty">
              <div className="at-empty__icon">
                <Search size={28} strokeWidth={1.6} />
              </div>
              <h3>No tools found</h3>
              <p>Try a different keyword or browse by category.</p>
              <button
                className="at-accent-btn"
                onClick={() => setSearch("")}
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
