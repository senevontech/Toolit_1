import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getToolBySlug, tools } from "@/lib/tools";

const CATEGORY_META: Record<string, { iconBg: string }> = {
  "Image Tools": { iconBg: "linear-gradient(145deg,#e9d8fd,#c4b5fd)" },
  "Document Tools": { iconBg: "linear-gradient(145deg,#bfdbfe,#93c5fd)" },
  "Developer Tools": { iconBg: "linear-gradient(145deg,#bbf7d0,#86efac)" },
  "Calculators": { iconBg: "linear-gradient(145deg,#fed7aa,#fb923c)" },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({
    slug: tool.slug,
  }));
}

export default function ToolPage({
  params,
}: {
  params: { slug: string };
}) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  const Component = tool.component;
  const meta = CATEGORY_META[tool.category];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#e2e8f0", padding: "2.5rem 1rem 4rem" }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>
        <Link
          href="/"
          className="btn-ghost btn-sm"
          style={{ marginBottom: "1.5rem", display: "inline-flex" }}
        >
          <ArrowLeft size={14} />
          All Tools
        </Link>

        <div
          className="neu-card mb-8 flex items-start gap-5"
          style={{ padding: "1.5rem 2rem" }}
        >
          {tool.icon && (
            <div
              className="flex flex-shrink-0 items-center justify-center text-2xl"
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "1rem",
                background:
                  meta?.iconBg ??
                  "linear-gradient(145deg,#edf1f7,#d5dce8)",
                boxShadow:
                  "5px 5px 10px rgba(163,177,198,0.55), -5px -5px 10px rgba(255,255,255,0.88), inset 1px 1px 2px rgba(255,255,255,0.60)",
              }}
            >
              {tool.icon}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h1
              className="text-2xl font-black leading-tight tracking-tight md:text-3xl"
              style={{ color: "#2d3748" }}
            >
              {tool.name}
            </h1>
            <p
              style={{
                color: "#8fa0b8",
                fontSize: "0.875rem",
                marginTop: "0.35rem",
              }}
            >
              {tool.description}
            </p>
            <span
              className="mt-3 inline-block text-xs font-bold uppercase tracking-wider"
              style={{
                background: "linear-gradient(145deg,#edf1f7,#d5dce8)",
                boxShadow:
                  "3px 3px 6px rgba(163,177,198,0.52), -3px -3px 6px rgba(255,255,255,0.85)",
                borderRadius: "999px",
                padding: "0.3rem 0.85rem",
                color: "#5a6478",
              }}
            >
              {tool.category}
            </span>
          </div>
        </div>

        <Component />
      </div>
    </div>
  );
}
