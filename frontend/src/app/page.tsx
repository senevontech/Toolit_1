"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { tools, categories } from "@/lib/tools";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0]
  );
  const [search, setSearch] = useState("");

  const filteredTools = useMemo(() => {
    if (search.trim() === "") {
      return tools.filter(
        (tool) => tool.category === activeCategory
      );
    }

    return tools.filter(
      (tool) =>
        tool.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        tool.description
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }, [search, activeCategory]);

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section className="text-center py-14">
        <h1 className="text-4xl md:text-5xl font-bold text-orange-500">
          Free Online Tools
        </h1>
        <p className="mt-4 text-gray-600 text-lg">
          Fast • Secure • Simple to Use
        </p>
      </section>

      {/* Search */}
      <div className="max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Search tools..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-full px-6 py-3 shadow-sm focus:ring-2 focus:ring-orange-500 outline-none"
        />
      </div>

      {/* Categories */}
      {search === "" && (
        <div className="flex gap-4 overflow-x-auto pb-2 border-b">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
                activeCategory === category
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 hover:bg-orange-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {/* Tools Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredTools.length > 0 ? (
          filteredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-white border rounded-2xl p-6 hover:shadow-lg transition duration-300"
            >
              <div className="text-lg font-semibold group-hover:text-orange-500">
                {tool.name}
              </div>

              <p className="text-sm text-gray-500 mt-2">
                {tool.description}
              </p>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">
            No tools found.
          </div>
        )}
      </div>
    </div>
  );
}