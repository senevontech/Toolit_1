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
    "Browse every Toolmitra tool for PDFs, images, developer tasks, and calculators in one searchable catalog.",
  path: "/tools/",
  keywords: [
    "all online tools",
    "pdf and image tools",
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
            "Search and browse Toolmitra tools for images, documents, developer workflows, and calculators.",
          items: tools.map((tool) => ({
            name: tool.name,
            url: absoluteUrl(`/tools/${tool.slug}/`),
            description: tool.description,
          })),
        })}
      />
      <section className="px-4 pt-14 pb-10 md:px-8">
        <div className="mx-auto max-w-5xl">
          <span className="inline-block rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-violet-600">
            Directory
          </span>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight text-slate-900">
            All Tools
          </h1>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-slate-500">
            Browse every tool for image optimization, PDF workflows, developer
            tasks, and calculators — all in one place.
          </p>
        </div>
      </section>
      <AllToolsClient />
    </>
  );
}
