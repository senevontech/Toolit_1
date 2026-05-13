import JsonLd from "@/components/seo/JsonLd";
import { tools } from "@/lib/tools";
import {
  absoluteUrl,
  buildCollectionPageStructuredData,
  buildMetadata,
  buildOrganizationStructuredData,
  buildSiteFaqStructuredData,
  buildWebSiteStructuredData,
} from "@/lib/seo";

import HomePageClient from "./HomePageClient";

export const metadata = buildMetadata({
  title: "Free Online Tools for PDF, Image, JSON and Calculators",
  description:
    "Use Toolmitra to compress images, merge PDFs, convert videos, format JSON, generate SEO tags, and run practical calculators in your browser for free.",
  path: "/",
  keywords: [
    "free pdf tools",
    "image compressor online",
    "merge pdf online",
    "video tools online",
    "json formatter online",
    "seo tools online",
    "qr code generator online",
  ],
});

export default function HomePage() {
  const featuredTools = tools.slice(0, 10).map((tool) => ({
    name: tool.name,
    url: absoluteUrl(`/tools/${tool.slug}/`),
    description: tool.description,
  }));

  return (
    <>
      <JsonLd
        data={[
          buildWebSiteStructuredData(),
          buildOrganizationStructuredData(),
          buildSiteFaqStructuredData(),
          buildCollectionPageStructuredData({
            path: "/",
            title: "Toolmitra Home",
            description:
              "Browse online tools for PDFs, images, videos, SEO utilities, developer workflows, and calculators.",
            items: featuredTools,
          }),
        ]}
      />
      <HomePageClient />
    </>
  );
}
