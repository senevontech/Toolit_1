"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, X, Home, ArrowRight } from "lucide-react";
import { tools, categories } from "@/lib/tools";
import ToolRenderer from "@/components/tools/ToolRenderer";
import "./alltools-v2.css";

export default function AllToolsV2() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Image Tools");
  const [selectedToolSlug, setSelectedToolSlug] = useState<string | null>(null);

  // Category labels based on image
  const categoryLabels: Record<string, string> = {
    "Image Tools": "Image Tools",
    "Document Tools": "Doc Tools",
    "Developer Tools": "Dev tools",
    "Calculators": "Upcoming",
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

  const handleToolClick = (slug: string) => {
    setSelectedToolSlug(slug);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleCloseTool = () => {
    setSelectedToolSlug(null);
  };

  return (
    <div className="vl-page">
      {/* Navigation */}
      <nav className="vl-nav">
        <div className="vl-logo-group">
          <span className="vl-logo-text">TOLIT</span>
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

      <div className="max-w-[1400px] mx-auto">
        {/* Hero */}
        <header className="vl-hero">
          <div className="vl-hero-pill">Powerfull Tools for everyday life</div>
          <h1 className="vl-hero-title">TOOLEGEND</h1>
          <p className="vl-hero-desc">
            Compress images, convert PDFs, transform documents, and optimize files — all in one fast, secure, and easy-to-use platform.
          </p>

          {/* Search */}
          <div className="vl-search-section">
            <input
              type="text"
              className="vl-search-box"
              placeholder="Search any tool"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="vl-search-btn">
              <Search size={28} strokeWidth={3} />
            </button>
          </div>

          {/* Categories */}
          <div className="vl-tabs">
            {categories.slice(0, 4).map((cat) => (
              <button
                key={cat}
                className={`vl-tab ${activeCategory === cat ? "vl-tab--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {categoryLabels[cat] || cat}
              </button>
            ))}
          </div>
        </header>

        {/* Main Content Area */}
        <main>
          {selectedToolSlug ? (
            <div className="vl-tool-render-zone">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-slate-100">
                <div>
                  <h2 className="text-4xl font-black text-slate-800 tracking-tight">
                    {tools.find(t => t.slug === selectedToolSlug)?.name}
                  </h2>
                  <p className="text-violet-500 font-bold mt-1 uppercase tracking-widest text-xs">
                    {tools.find(t => t.slug === selectedToolSlug)?.category}
                  </p>
                </div>
                <button 
                  onClick={handleCloseTool}
                  className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all shadow-sm"
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
                         {tool.category.replace(' Tools', '').toLowerCase()} tool
                      </span>
                      <span className="vl-card-icon">{tool.icon || '🛠️'}</span>
                      <h3 className="vl-card-name tracking-tight">{tool.name}</h3>
                      <p className="vl-card-desc">{tool.description}</p>
                    </div>
                    <button 
                      className="vl-launch-btn"
                      onClick={() => handleToolClick(tool.slug)}
                    >
                      Launch tool
                    </button>
                  </div>
                ))}
              </div>

              {filteredTools.length === 0 && (
                <div className="text-center py-20 bg-white/30 rounded-[3rem] shadow-inner">
                   <div className="text-slate-400 font-black text-2xl uppercase tracking-widest italic opacity-20">
                     Area Empty
                   </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
