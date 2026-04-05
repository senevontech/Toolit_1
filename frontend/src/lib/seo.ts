import type { Metadata } from "next";

import type { ToolMeta } from "@/lib/tools";
import { tools } from "@/lib/tools";

const DEFAULT_SITE_URL = "https://toolmitra.com";

export const siteName = "Toolmitra";
export const siteUrl = normalizeSiteUrl(
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL
);
export const siteMetadataBase = new URL(siteUrl);
export const defaultDescription =
  "Free online tools for PDFs, images, videos, SEO, developers, and calculators. Compress, convert, format, optimize, and calculate in your browser with Toolmitra.";

const baseKeywords = [
  "free online tools",
  "pdf tools",
  "image tools",
  "video tools",
  "developer tools",
  "seo tools",
  "calculators",
  "image compressor",
  "merge pdf",
  "json formatter",
  "qr generator",
];

const categoryKeywords: Record<string, string[]> = {
  "Image Tools": ["image compressor", "image resizer", "image converter"],
  "Document Tools": ["pdf converter", "merge pdf", "split pdf"],
  "Video Tools": ["video to mp3", "video cutter", "video compressor"],
  "Developer Tools": ["json formatter", "base64 encoder", "qr code generator"],
  "SEO Tools": ["meta tag generator", "sitemap generator", "robots txt generator"],
  Calculators: ["emi calculator", "gst calculator", "sip calculator"],
};

const toolKeywords = tools.slice(0, 24).flatMap((tool) => [
  tool.name.toLowerCase(),
  `${tool.name.toLowerCase()} online`,
]);

export const defaultKeywords = uniqueKeywords([...baseKeywords, ...toolKeywords]);

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
      return `${tool.description} ${tool.name} helps you handle image editing and optimization tasks directly in your browser with a faster, cleaner workflow that is easy to use on both desktop and mobile.`;
    case "Document Tools":
      return `${tool.description} ${tool.name} is designed to simplify common PDF and document tasks online so you can work faster without installing extra desktop software.`;
    case "Video Tools":
      return `${tool.description} ${tool.name} gives you a more practical way to handle everyday video tasks online, whether you need conversion, trimming, compression, or quick media extraction.`;
    case "Developer Tools":
      return `${tool.description} ${tool.name} supports quick browser-based developer workflows with clean output, simple controls, and a faster path from input to result.`;
    case "SEO Tools":
      return `${tool.description} ${tool.name} helps you create practical SEO assets and optimization markup in a simple browser workflow that is easier to review, copy, and publish.`;
    case "Calculators":
      return `${tool.description} ${tool.name} gives you instant results through a simple calculator interface built for quick everyday use.`;
    default:
      return `${tool.description} Use ${tool.name} online for free with Toolmitra in a clean browser-based workflow.`;
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
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/tools/")}?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
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
    featureList: [
      `Free ${tool.name.toLowerCase()}`,
      `${tool.category.toLowerCase()} workflow`,
      "Browser-based processing",
    ],
  };
}

export function buildSiteFaqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What tools are available on Toolmitra?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Toolmitra offers image tools, document tools, video tools, developer tools, SEO tools, and calculators that run in the browser.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use Toolmitra tools for free?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Toolmitra provides free browser-based tools for common file conversion, formatting, optimization, and calculator workflows.",
        },
      },
      {
        "@type": "Question",
        name: "Do Toolmitra tools work on mobile and desktop?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes, Toolmitra is designed to work across modern desktop and mobile browsers.",
        },
      },
    ],
  };
}
