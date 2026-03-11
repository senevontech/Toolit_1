"use client";

import Link from "next/link";
import { tools, categories } from "@/lib/tools";

export default function Sidebar() {
  return (
    <aside className="hidden lg:block w-64 border-r p-6 bg-gray-50">
      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-3">
            {category}
          </h3>

          <div className="space-y-2">
            {tools
              .filter((tool) => tool.category === category)
              .map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="block text-sm text-gray-600 hover:text-orange-500 transition"
                >
                  {tool.name}
                </Link>
              ))}
          </div>
        </div>
      ))}
    </aside>
  );
}