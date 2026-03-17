"use client";

import { type CSSProperties, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  ImageIcon,
  FileText,
  FilePlus2,
  Code2,
  QrCode,
  Maximize2,
  type LucideIcon,
} from "lucide-react";
import { tools } from "@/lib/tools";
import "./home2.css";

type CategoryKey =
  | "Image Tools"
  | "Document Tools"
  | "Developer Tools"
  | "Calculators";

const CATEGORY_LABEL: Record<CategoryKey, string> = {
  "Image Tools": "Image tool",
  "Document Tools": "Document tool",
  "Developer Tools": "Developer tool",
  Calculators: "Calculator tool",
};

const TOOL_ICON: Record<string, LucideIcon> = {
  "image-compressor": ImageIcon,
  "image-resizer": Maximize2,
  "png-jpg-converter": ImageIcon,
  "webp-converter": ImageIcon,
  "watermark-image": ImageIcon,
  "merge-pdf": FilePlus2,
  "split-pdf": FilePlus2,
  "rotate-pdf": FileText,
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
  "json-formatter": Code2,
  "qr-generator": QrCode,
  "base64-tool": Code2,
};

const FEATURED_PRIMARY_SLUGS = ["image-compressor", "merge-pdf"];
const FEATURED_SECONDARY_SLUGS = [
  "pdf-to-word",
  "qr-generator",
  "image-resizer",
  "word-to-pdf",
];

const HERO_TITLE = "TOOLIT";

const CORE_FEATURES = [
  {
    key: "document",
    title: "Document",
    desc: "PDF merge, split, convert, and protect — every document workflow in one place.",
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

  return (
    <div className="nm-page">
      {/* ── HERO ── */}
      <section className="nm-hero">
        <div className="nm-hero-inner">
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

          <Link href="#nm-tools" className="nm-launch-btn">
            launch all tools
          </Link>
        </div>
      </section>

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
            <h2 className="nm-about-title">TOOLIT</h2>
          </div>
          <div className="nm-about-badge">Simple Tools. Powerful Results.</div>
          <div className="nm-about-body">
            <p>
              Toolit is an all-in-one platform designed to simplify the way you
              work with digital files. Whether you need to compress images,
              convert documents, or manage PDFs, Toolit provides fast and
              reliable tools directly in your browser.
            </p>
            <p>
              Built with performance and privacy in mind, Toolit processes your
              files efficiently so you can focus on your work without
              unnecessary complexity.
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
                style={isActive ? { background: feat.color } : {}}
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
