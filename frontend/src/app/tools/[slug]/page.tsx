import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  Code2,
  FileText,
  Image as ImageIcon,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { getToolBySlug, tools } from "@/lib/tools";
import ToolRenderer from "@/components/tools/ToolRenderer";

const CATEGORY_META: Record<
  string,
  {
    icon: LucideIcon;
    accent: string;
  }
> = {
  "Image Tools": {
    icon: ImageIcon,
    accent: "#ff875c",
  },
  "Document Tools": {
    icon: FileText,
    accent: "#ff875c",
  },
  "Developer Tools": {
    icon: Code2,
    accent: "#ff875c",
  },
  Calculators: {
    icon: Calculator,
    accent: "#ff875c",
  },
};

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
  const meta = CATEGORY_META[tool.category];
  const CategoryIcon = meta?.icon ?? Sparkles;

  return (
    <div className="tool-page">
      <div className="tool-page__shell">
        <Link
          href="/tools"
          className="tool-page__back btn-ghost btn-sm"
        >
          <ArrowLeft size={14} />
          All Tools
        </Link>

        <section className="tool-page__hero neu-card">
          <div
            className="tool-page__hero-icon"
            style={{ "--tool-accent": meta?.accent ?? "#ff875c" } as CSSProperties}
          >
            <CategoryIcon size={34} strokeWidth={2.1} />
          </div>

          <div className="tool-page__hero-copy">
            <h1 className="tool-page__title tool-page__title--compact">{tool.name}</h1>

            <div className="tool-page__meta-row">
              <span className="tool-page__meta-pill">{tool.category}</span>
            </div>
          </div>
        </section>

        <section className="tool-page__workspace neu-card">
          <div className="tool-page__workspace-head">
            <div>
              <h2>Workspace</h2>
            </div>
          </div>

          <div className="tool-page__workspace-body">
            <ToolRenderer slug={tool.slug} />
          </div>
        </section>
      </div>
    </div>
  );
}
