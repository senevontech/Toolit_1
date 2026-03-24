import JsonLd from "@/components/seo/JsonLd";
import { tools } from "@/lib/tools";
import {
  absoluteUrl,
  buildCollectionPageStructuredData,
  buildMetadata,
  buildOrganizationStructuredData,
  buildWebSiteStructuredData,
} from "@/lib/seo";

import HomePageClient from "./HomePageClient";

export const metadata = buildMetadata({
  title: "Free Online Tools for PDF, Image, JSON and Calculators",
  description:
    "Use Toolmitra to compress images, merge PDFs, format JSON, generate QR codes, and run practical calculators in your browser for free.",
  path: "/",
  keywords: [
    "free pdf tools",
    "image compressor online",
    "merge pdf online",
    "json formatter online",
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
          buildCollectionPageStructuredData({
            path: "/",
            title: "Toolmitra Home",
            description:
              "Browse online tools for PDFs, images, developer utilities, and calculators.",
            items: featuredTools,
          }),
        ]}
      />
      <HomePageClient />
    </>
  );
}
