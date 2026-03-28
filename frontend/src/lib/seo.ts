import type { Metadata } from "next";

import type { ToolMeta } from "@/lib/tools";
import { getPublicSiteUrl } from "@/lib/env";

const DEFAULT_SITE_URL = "https://toolmitra.com";

export const siteName = "Toolmitra";
export const siteUrl = normalizeSiteUrl(getPublicSiteUrl(DEFAULT_SITE_URL));
export const siteMetadataBase = new URL(siteUrl);
export const defaultDescription =
  "Free online tools for PDFs, images, developers, and calculators. Compress, convert, format, and calculate in your browser with Toolmitra.";
export const defaultKeywords = [
  "free online tools",
  "pdf tools",
  "image tools",
  "developer tools",
  "calculators",
  "image compressor",
  "merge pdf",
  "json formatter",
  "qr generator",
];

const categoryKeywords: Record<string, string[]> = {
  "Image Tools": ["image compressor", "image resizer", "image converter"],
  "Document Tools": ["pdf converter", "merge pdf", "split pdf"],
  "Developer Tools": ["json formatter", "base64 encoder", "qr code generator"],
  Calculators: ["emi calculator", "gst calculator", "sip calculator"],
};

type BuildMetadataOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
  canonicalPath?: string;
};

function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function normalizePath(path: string) {
  if (!path || path === "/") {
    return "/";
  }

  const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

function uniqueKeywords(keywords: string[]) {
  return Array.from(new Set(keywords));
}

export function absoluteUrl(path = "/") {
  const normalizedPath = normalizePath(path);
  return `${siteUrl}${normalizedPath === "/" ? "/" : normalizedPath}`;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
  canonicalPath,
}: BuildMetadataOptions): Metadata {
  const resolvedCanonical = canonicalPath ?? path;

  return {
    title,
    description,
    keywords: uniqueKeywords([...defaultKeywords, ...keywords]),
    alternates: {
      canonical: normalizePath(resolvedCanonical),
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName,
      title,
      description,
      url: normalizePath(resolvedCanonical),
      images: [
        {
          url: "/logo/logo-black.png",
          alt: `${siteName} logo`,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/logo/logo-black.png"],
    },
    robots: noIndex
      ? {
          index: false,
          follow: true,
        }
      : {
          index: true,
          follow: true,
        },
  };
}

export function buildToolDescription(tool: ToolMeta) {
  switch (tool.category) {
    case "Image Tools":
      return `${tool.description} Use ${tool.name} online for free to process images directly in your browser with a fast and simple workflow.`;
    case "Document Tools":
      return `${tool.description} Use ${tool.name} online for free to manage PDFs and documents quickly without installing extra software.`;
    case "Developer Tools":
      return `${tool.description} Use ${tool.name} online for free for quick developer workflows in a clean browser-based workspace.`;
    case "Calculators":
      return `${tool.description} Use ${tool.name} online for free and get instant results with a simple calculator interface.`;
    default:
      return `${tool.description} Use ${tool.name} online for free with Toolmitra.`;
  }
}

export function buildToolKeywords(tool: ToolMeta) {
  return uniqueKeywords([
    tool.name,
    `${tool.name} online`,
    `free ${tool.name.toLowerCase()}`,
    tool.slug.replace(/-/g, " "),
    tool.category,
    ...(categoryKeywords[tool.category] ?? []),
  ]);
}

export function buildToolMetadata(tool: ToolMeta) {
  return buildMetadata({
    title: `${tool.name} Online for Free`,
    description: buildToolDescription(tool),
    path: `/tools/${tool.slug}/`,
    keywords: buildToolKeywords(tool),
  });
}

export function buildWebSiteStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl("/"),
    description: defaultDescription,
  };
}

export function buildOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteName,
    url: absoluteUrl("/"),
    logo: absoluteUrl("/logo/logo-black.png"),
  };
}

export function buildCollectionPageStructuredData({
  path,
  title,
  description,
  items,
}: {
  path: string;
  title: string;
  description: string;
  items: Array<{ name: string; url: string; description?: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title,
    description,
    url: absoluteUrl(path),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        url: item.url,
        description: item.description,
      })),
    },
  };
}

export function buildBreadcrumbStructuredData(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function buildToolStructuredData(tool: ToolMeta) {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    applicationCategory: tool.category,
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: absoluteUrl(`/tools/${tool.slug}/`),
    description: buildToolDescription(tool),
    isAccessibleForFree: true,
  };
}
