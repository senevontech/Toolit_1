"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Home, Search, X } from "lucide-react";

import ToolRenderer from "@/components/tools/ToolRenderer";
import { categories, tools } from "@/lib/tools";

import "./alltools-v2.css";

export default function AllToolsV2() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Image Tools");
  const [selectedToolSlug, setSelectedToolSlug] = useState<string | null>(null);

  const categoryLabels: Record<string, string> = {
    "Image Tools": "Image Tools",
    "Document Tools": "Doc Tools",
    "Developer Tools": "Dev tools",
    Calculators: "Upcoming",
  };

  const filteredTools = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q);
      const matchesCategory = tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  useEffect(() => {
    if (!selectedToolSlug) {
      return;
    }

    window.scrollTo({ top: 300, behavior: "smooth" });
  }, [selectedToolSlug]);

  return (
    <div className="vl-page">
      <nav className="vl-nav">
        <div className="vl-logo-group">
          <span className="vl-logo-text">TOOLMITRA</span>
          <div className="vl-logo-icon shadow-lg">
            <ArrowRight size={22} strokeWidth={4} />
          </div>
        </div>
        <div className="vl-nav-actions">
          <button className="vl-signup-btn">Signup</button>
          <button className="vl-home-btn">
            <Home size={22} strokeWidth={2.5} />
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-[1400px]">
        <header className="vl-hero">
          <div className="vl-hero-pill">Powerful tools for everyday work</div>
          <h1 className="vl-hero-title">TOOLMITRA</h1>
          <p className="vl-hero-desc">
            Compress images, convert PDFs, transform documents, and optimize
            files in one fast, secure, and easy-to-use platform.
          </p>

          <div className="vl-search-section">
            <input
              type="text"
              className="vl-search-box"
              placeholder="Search any tool"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="vl-search-btn">
              <Search size={28} strokeWidth={3} />
            </button>
          </div>

          <div className="vl-tabs">
            {categories.slice(0, 4).map((category) => (
              <button
                key={category}
                className={`vl-tab ${
                  activeCategory === category ? "vl-tab--active" : ""
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {categoryLabels[category] || category}
              </button>
            ))}
          </div>
        </header>

        <main>
          {selectedToolSlug ? (
            <div className="vl-tool-render-zone">
              <div className="mb-10 flex items-center justify-between border-b border-slate-100 pb-6">
                <div>
                  <h2 className="text-4xl font-black tracking-tight text-slate-800">
                    {tools.find((tool) => tool.slug === selectedToolSlug)?.name}
                  </h2>
                  <p className="mt-1 text-xs font-bold uppercase tracking-widest text-violet-500">
                    {tools.find((tool) => tool.slug === selectedToolSlug)?.category}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedToolSlug(null)}
                  className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 shadow-sm transition-all hover:bg-red-50 hover:text-red-500"
                >
                  <X size={24} strokeWidth={3} />
                </button>
              </div>
              <div className="min-h-[500px]">
                <ToolRenderer slug={selectedToolSlug} />
              </div>
            </div>
          ) : (
            <div className="vl-card-container">
              <div className="vl-grid">
                {filteredTools.map((tool) => (
                  <div key={tool.slug} className="vl-card">
                    <div className="vl-card-inner">
                      <span className="vl-card-kicker">
                        {tool.category.replace(" Tools", "").toLowerCase()} tool
                      </span>
                      <span className="vl-card-icon">{tool.icon || "Tool"}</span>
                      <h3 className="vl-card-name tracking-tight">{tool.name}</h3>
                      <p className="vl-card-desc">{tool.description}</p>
                    </div>
                    <button
                      className="vl-launch-btn"
                      onClick={() => setSelectedToolSlug(tool.slug)}
                    >
                      Launch tool
                    </button>
                  </div>
                ))}
              </div>

              {filteredTools.length === 0 ? (
                <div className="rounded-[3rem] bg-white/30 py-20 text-center shadow-inner">
                  <div className="text-2xl font-black uppercase tracking-widest italic text-slate-400 opacity-20">
                    Area Empty
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
