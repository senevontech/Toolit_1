"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { tools, categories } from "@/lib/tools";

/* ── per-category accent colours ─────────────────── */
const CATEGORY_META: Record<string, { icon: string; iconBg: string; iconColor: string }> = {
  "Image Tools":     { icon: "🖼️", iconBg: "linear-gradient(145deg,#e9d8fd,#c4b5fd)", iconColor: "#6d28d9" },
  "Document Tools":  { icon: "📄", iconBg: "linear-gradient(145deg,#bfdbfe,#93c5fd)",  iconColor: "#1d4ed8" },
  "Developer Tools": { icon: "⚡", iconBg: "linear-gradient(145deg,#bbf7d0,#86efac)",  iconColor: "#15803d" },
  "Calculators":     { icon: "🧮", iconBg: "linear-gradient(145deg,#fed7aa,#fb923c)",  iconColor: "#c2440a" },
};

const STATS = [
  { value: "30+", label: "Free Tools"   },
  { value: "100%",label: "Browser-side" },
  { value: "0",   label: "Sign-ups"     },
  { value: "∞",   label: "Free Uses"   },
];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>(categories[0]);
  const [search, setSearch] = useState("");

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tools.filter((t) => t.category === activeCategory);
    return tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }, [search, activeCategory]);

  const isSearching = search.trim() !== "";

  return (
    <div style={{ background: "#e2e8f0" }}>

      {/* ════════════════════════════════════════════════
          HERO  —  split left (silver) / right (orange)
      ════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden">

        {/* Orange right panel (with diagonal cut) */}
        <div
          aria-hidden
          className="absolute top-0 right-0 h-full hidden md:block"
          style={{
            width: "42%",
            background: "linear-gradient(160deg, #fb923c 0%, #c2440a 100%)",
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)",
            boxShadow: "inset 4px 0 24px rgba(0,0,0,0.15)",
          }}
        />
        {/* Subtle pattern overlay on orange panel */}
        <div
          aria-hidden
          className="absolute top-0 right-0 h-full hidden md:block pointer-events-none"
          style={{
            width: "42%",
            clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)",
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.08) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative max-w-7xl mx-auto px-5 py-16 md:py-24">
          <div className="grid md:grid-cols-12 gap-8 md:gap-4 items-center">

            {/* ── Left: title + search ── */}
            <div className="md:col-span-7">

              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 mb-7 animate-fade-up"
                style={{
                  background: "linear-gradient(145deg, #edf1f7, #d5dce8)",
                  boxShadow:
                    "4px 4px 8px rgba(163,177,198,0.55), -4px -4px 8px rgba(255,255,255,0.88), inset 1px 1px 1px rgba(255,255,255,0.65)",
                  borderRadius: "999px",
                  padding: "0.4rem 1rem",
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  color: "#5a6478",
                }}
              >
                <span
                  style={{
                    width: 7, height: 7,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg,#fb923c,#c2440a)",
                    boxShadow: "0 0 6px rgba(249,115,22,0.70)",
                    display: "inline-block",
                    animation: "pulse 2s cubic-bezier(0.4,0,0.6,1) infinite",
                  }}
                />
                100% Free · No Sign-up · No Limits
              </div>

              {/* Headline */}
              <h1
                className="font-black tracking-tight leading-[1.06] animate-fade-up delay-75"
                style={{
                  fontSize: "clamp(2.6rem, 5vw, 4rem)",
                  color: "#2d3748",
                }}
              >
                Your All-in-One
                <br />
                <span
                  style={{
                    background: "linear-gradient(135deg, #f97316, #c2440a)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Online Toolbox
                </span>
              </h1>

              <p
                className="mt-4 mb-8 text-base leading-relaxed animate-fade-up delay-150"
                style={{ color: "#6b7a99", maxWidth: "30rem" }}
              >
                30+ professional tools for images, PDFs, developers &amp; finance.
                Fast, private, works right in your browser.
              </p>

              {/* Search */}
              <div
                className="relative animate-fade-up delay-225"
                style={{ maxWidth: "28rem" }}
              >
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: "#8fa0b8" }}
                />
                <input
                  type="text"
                  placeholder="Search tools… e.g. compress, merge PDF"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-hero"
                  style={{ paddingLeft: "3rem" }}
                />
              </div>
            </div>

            {/* ── Right: stats (white on orange) ── */}
            <div className="md:col-span-5 flex justify-center md:justify-end animate-fade-up delay-150">
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="text-center"
                    style={{
                      background: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(10px)",
                      borderRadius: "1.1rem",
                      padding: "1.2rem 1.6rem",
                      border: "1px solid rgba(255,255,255,0.25)",
                      boxShadow:
                        "4px 4px 10px rgba(0,0,0,0.12), inset 1px 1px 0 rgba(255,255,255,0.25)",
                      minWidth: "7rem",
                    }}
                  >
                    <div
                      className="font-black tabular-nums"
                      style={{ fontSize: "2rem", color: "#fff", lineHeight: 1 }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "0.72rem", fontWeight: 600,
                        color: "rgba(255,255,255,0.75)",
                        marginTop: "0.35rem",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════
          TOOLS SECTION
      ════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-5 py-12">

        {/* Category pills */}
        {!isSearching && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1 mb-8">
            {categories.map((cat) => {
              const meta = CATEGORY_META[cat];
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`cat-pill ${isActive ? "cat-pill-active" : ""}`}
                >
                  <span>{meta?.icon ?? "🔧"}</span>
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Section label */}
        <div className="mb-6 flex items-end justify-between">
          <div>
            {isSearching ? (
              <>
                <h2 className="text-lg font-bold" style={{ color: "#2d3748" }}>
                  Results for &ldquo;{search}&rdquo;
                </h2>
                <p style={{ fontSize: "0.8rem", color: "#8fa0b8", marginTop: "0.2rem" }}>
                  {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} found ·{" "}
                  <button
                    onClick={() => setSearch("")}
                    style={{ color: "#f97316", background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}
                  >
                    Clear
                  </button>
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold" style={{ color: "#2d3748" }}>
                  {CATEGORY_META[activeCategory]?.icon} {activeCategory}
                </h2>
                <p style={{ fontSize: "0.8rem", color: "#8fa0b8", marginTop: "0.2rem" }}>
                  {filteredTools.length} tool{filteredTools.length !== 1 ? "s" : ""} available
                </p>
              </>
            )}
          </div>
        </div>

        {/* Tools grid */}
        {filteredTools.length > 0 ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredTools.map((tool) => {
              const meta = CATEGORY_META[tool.category];
              return (
                <Link key={tool.slug} href={`/tools/${tool.slug}`} className="tool-card block p-5 no-underline">
                  {/* Icon */}
                  <div
                    className="mb-4 flex items-center justify-center text-xl"
                    style={{
                      width: "2.8rem",
                      height: "2.8rem",
                      borderRadius: "0.875rem",
                      background: meta?.iconBg ?? "linear-gradient(145deg,#edf1f7,#d5dce8)",
                      boxShadow:
                        "4px 4px 8px rgba(163,177,198,0.48), -4px -4px 8px rgba(255,255,255,0.85), inset 1px 1px 1px rgba(255,255,255,0.55)",
                    }}
                  >
                    {tool.icon ?? meta?.icon ?? "🔧"}
                  </div>

                  <div
                    className="font-bold text-sm leading-tight mb-1.5 transition-colors duration-200"
                    style={{ color: "#2d3748" }}
                  >
                    {tool.name}
                  </div>

                  <p style={{ fontSize: "0.76rem", color: "#8fa0b8", lineHeight: 1.55 }}>
                    {tool.description}
                  </p>

                  {/* Bottom accent bar */}
                  <div
                    className="mt-4 rounded-full"
                    style={{
                      height: "3px",
                      background: meta?.iconBg ?? "linear-gradient(90deg,#fb923c,#c2440a)",
                      opacity: 0.55,
                    }}
                  />
                </Link>
              );
            })}
          </div>
        ) : (
          <div
            className="text-center py-20 neu-inset-panel"
            style={{ maxWidth: "28rem", margin: "0 auto" }}
          >
            <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🔍</div>
            <p className="font-bold" style={{ color: "#2d3748" }}>
              No tools for &ldquo;{search}&rdquo;
            </p>
            <p style={{ fontSize: "0.85rem", color: "#8fa0b8", marginTop: "0.4rem" }}>
              Try a different keyword
            </p>
            <button
              onClick={() => setSearch("")}
              className="btn-outline btn-sm"
              style={{ marginTop: "1.25rem" }}
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════
          FEATURES STRIP
      ════════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-5">
          <h2
            className="text-center font-black mb-10"
            style={{ fontSize: "1.6rem", color: "#2d3748" }}
          >
            Why choose{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#f97316,#c2440a)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Toolit
            </span>
            ?
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "⚡",
                title: "Lightning Fast",
                desc: "Everything runs in your browser. No server upload delays, no waiting.",
                bg: "linear-gradient(145deg,#fed7aa,#fb923c)",
              },
              {
                icon: "🔒",
                title: "Private & Secure",
                desc: "Your files never leave your device. Zero telemetry, zero tracking.",
                bg: "linear-gradient(145deg,#bbf7d0,#4ade80)",
              },
              {
                icon: "✨",
                title: "Always Free",
                desc: "No subscriptions, no credit card, no limits. Just open and use.",
                bg: "linear-gradient(145deg,#bfdbfe,#60a5fa)",
              },
            ].map((f) => (
              <div key={f.title} className="neu-card p-7 text-center">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
                  style={{
                    background: f.bg,
                    boxShadow:
                      "4px 4px 10px rgba(163,177,198,0.45), -4px -4px 10px rgba(255,255,255,0.85), inset 1px 1px 2px rgba(255,255,255,0.50)",
                  }}
                >
                  {f.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#2d3748" }}>{f.title}</h3>
                <p style={{ fontSize: "0.84rem", color: "#8fa0b8", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
