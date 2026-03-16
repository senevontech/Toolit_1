"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { getToolBySlug } from "@/lib/tools";
import { ArrowLeft } from "lucide-react";

const CATEGORY_META: Record<string, { iconBg: string }> = {
  "Image Tools":     { iconBg: "linear-gradient(145deg,#e9d8fd,#c4b5fd)" },
  "Document Tools":  { iconBg: "linear-gradient(145deg,#bfdbfe,#93c5fd)"  },
  "Developer Tools": { iconBg: "linear-gradient(145deg,#bbf7d0,#86efac)"  },
  "Calculators":     { iconBg: "linear-gradient(145deg,#fed7aa,#fb923c)"  },
};

export default function ToolPage() {
  const params = useParams();
  const slug   = params.slug as string;
  const tool   = getToolBySlug(slug);

  if (!tool) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-[55vh] text-center px-4"
        style={{ background: "#e2e8f0" }}
      >
        <div style={{ fontSize: "4rem", marginBottom: "1.25rem" }}>🔍</div>
        <h2 className="font-bold text-2xl mb-2" style={{ color: "#2d3748" }}>Tool not found</h2>
        <p style={{ color: "#8fa0b8", marginBottom: "1.5rem" }}>
          This tool doesn&apos;t exist or may have been moved.
        </p>
        <Link href="/" className="btn">
          <ArrowLeft size={15} />
          Back to Home
        </Link>
      </div>
    );
  }

  const Component = tool.component;
  const meta      = CATEGORY_META[tool.category];

  return (
    <div
      className="min-h-screen"
      style={{ background: "#e2e8f0", padding: "2.5rem 1rem 4rem" }}
    >
      <div style={{ maxWidth: "56rem", margin: "0 auto" }}>

        {/* ── Breadcrumb ── */}
        <Link
          href="/"
          className="btn-ghost btn-sm"
          style={{ marginBottom: "1.5rem", display: "inline-flex" }}
        >
          <ArrowLeft size={14} />
          All Tools
        </Link>

        {/* ── Tool header card ── */}
        <div
          className="neu-card mb-8 flex items-start gap-5"
          style={{ padding: "1.5rem 2rem" }}
        >
          {/* Icon */}
          {tool.icon && (
            <div
              className="flex-shrink-0 flex items-center justify-center text-2xl"
              style={{
                width: "3.5rem",
                height: "3.5rem",
                borderRadius: "1rem",
                background: meta?.iconBg ?? "linear-gradient(145deg,#edf1f7,#d5dce8)",
                boxShadow:
                  "5px 5px 10px rgba(163,177,198,0.55), -5px -5px 10px rgba(255,255,255,0.88), inset 1px 1px 2px rgba(255,255,255,0.60)",
              }}
            >
              {tool.icon}
            </div>
          )}

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1
              className="font-black text-2xl md:text-3xl tracking-tight leading-tight"
              style={{ color: "#2d3748" }}
            >
              {tool.name}
            </h1>
            <p style={{ color: "#8fa0b8", fontSize: "0.875rem", marginTop: "0.35rem" }}>
              {tool.description}
            </p>
            {/* Category badge */}
            <span
              className="inline-block mt-3 text-xs font-bold uppercase tracking-wider"
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

        {/* ── Tool component ── */}
        <Component />
      </div>
    </div>
  );
}
