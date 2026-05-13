import JsonLd from "@/components/seo/JsonLd";
import { tools } from "@/lib/tools";
import {
  absoluteUrl,
  buildCollectionPageStructuredData,
  buildMetadata,
} from "@/lib/seo";

import AllToolsClient from "../home2/AllToolsClient";

export const metadata = buildMetadata({
  title: "All Tools",
  description:
    "Browse every Toolmitra tool for PDFs, images, videos, SEO tasks, developer workflows, and calculators in one searchable catalog.",
  path: "/tools/",
  keywords: [
    "all online tools",
    "pdf and image tools",
    "video tools online",
    "seo tools online",
    "developer utilities",
    "online calculator tools",
  ],
});

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={buildCollectionPageStructuredData({
          path: "/tools/",
          title: "Toolmitra Tools Directory",
          description:
            "Search and browse Toolmitra tools for images, documents, videos, SEO workflows, developer utilities, and calculators.",
          items: tools.map((tool) => ({
            name: tool.name,
            url: absoluteUrl(`/tools/${tool.slug}/`),
            description: tool.description,
          })),
        })}
      />
      <section className="tools-directory-hero px-4 pb-10 pt-14 md:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="tools-directory-hero__kicker inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            Directory
          </span>
          <h1 className="tools-directory-hero__title mt-4 text-5xl font-extrabold tracking-tight">
            All Tools
          </h1>
          <p className="tools-directory-hero__desc mt-3 max-w-xl text-base leading-relaxed">
            Browse every tool for image optimization, PDF workflows, developer
            tasks, and calculators all in one place.
          </p>
        </div>
      </section>
      <AllToolsClient />
    </>
  );
}
