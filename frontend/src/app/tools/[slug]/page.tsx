import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Calculator,
  Code2,
  FileText,
  Image as ImageIcon,
  Search,
  Video,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import JsonLd from "@/components/seo/JsonLd";
import ToolRenderer from "@/components/tools/ToolRenderer";
import { getToolBySlug, tools } from "@/lib/tools";
import {
  buildBreadcrumbStructuredData,
  buildToolMetadata,
  buildToolStructuredData,
} from "@/lib/seo";

const CATEGORY_META: Record<
  string,
  {
    icon: LucideIcon;
    accent: string;
    copy: string;
    steps: string[];
  }
> = {
  "Image Tools": {
    icon: ImageIcon,
    accent: "#ff875c",
    copy:
      "This image workflow is designed for fast browser-based editing, conversion, and optimization without adding unnecessary friction.",
    steps: [
      "Upload your image files from any device.",
      "Adjust the available options for the result you want.",
      "Download the processed file as soon as the tool finishes.",
    ],
  },
  "Document Tools": {
    icon: FileText,
    accent: "#ff875c",
    copy:
      "This document workflow helps you handle PDF and office file tasks quickly so you can convert, merge, split, or protect files from one place.",
    steps: [
      "Add the PDF or document files needed for this task.",
      "Choose the available conversion or processing options.",
      "Generate and download the finished file when processing completes.",
    ],
  },
  "Developer Tools": {
    icon: Code2,
    accent: "#ff875c",
    copy:
      "This developer utility is built for quick technical tasks in the browser, making common formatting and encoding work easier to finish in seconds.",
    steps: [
      "Paste the input or upload the content for processing.",
      "Apply the formatting, encoding, or generation action.",
      "Copy or download the final output immediately.",
    ],
  },
  "Video Tools": {
    icon: Video,
    accent: "#ff875c",
    copy:
      "This video workflow is built for practical media tasks like extracting audio, trimming clips, compressing uploads, and pulling useful preview assets.",
    steps: [
      "Upload a video file or paste the video link required by the tool.",
      "Choose the processing option that matches the result you want.",
      "Generate and download the finished media output when processing completes.",
    ],
  },
  "SEO Tools": {
    icon: Search,
    accent: "#ff875c",
    copy:
      "This SEO workflow helps you prepare practical search-optimization assets like meta tags, sitemaps, robots files, and share-preview markup from one browser-based workspace.",
    steps: [
      "Paste the page content, URLs, or SEO fields needed by the tool.",
      "Adjust the generator or checker options for your use case.",
      "Copy the generated output directly into your site or CMS.",
    ],
  },
  Calculators: {
    icon: Calculator,
    accent: "#ff875c",
    copy:
      "This calculator gives you a fast, straightforward way to work through practical numbers and get an answer without extra setup.",
    steps: [
      "Enter the values required for the calculation.",
      "Adjust the inputs until the result matches your scenario.",
      "Review the calculated output instantly on the page.",
    ],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: "Tool Not Found",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return buildToolMetadata(tool);
}

function buildFaq(toolName: string) {
  return [
    {
      question: `Is ${toolName} free to use?`,
      answer: `${toolName} is available as a free browser-based tool on Toolmitra.`,
    },
    {
      question: `Do I need to install software for ${toolName}?`,
      answer: `No installation is required. You can use ${toolName} directly in your browser.`,
    },
    {
      question: `Can I use ${toolName} on mobile?`,
      answer: `${toolName} works in a responsive web interface, so it can be used on desktop and mobile browsers.`,
    },
  ];
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const meta = CATEGORY_META[tool.category];
  const categoryIcon = meta?.icon ?? Sparkles;
  const faqs = buildFaq(tool.name);
  const CategoryIcon = categoryIcon;

  return (
    <div className="tool-page tool-page--clean">
      <JsonLd
        data={[
          buildToolStructuredData(tool),
          buildBreadcrumbStructuredData([
            { name: "Home", path: "/" },
            { name: "All Tools", path: "/tools/" },
            { name: tool.name, path: `/tools/${tool.slug}/` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          },
          {
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: `How to use ${tool.name}`,
            description: `Step-by-step guide for using ${tool.name} on Toolmitra.`,
            step: (meta?.steps ?? []).map((step, index) => ({
              "@type": "HowToStep",
              position: index + 1,
              text: step,
            })),
          },
        ]}
      />

      <div className="tool-page__shell">
        <Link href="/tools" className="tool-page__back btn-ghost btn-sm animate-fade-up">
          <ArrowLeft size={14} />
          All Tools
        </Link>

        <section
          className="tool-page__hero neu-card animate-fade-up delay-75"
          style={{ marginBottom: "1rem" }}
        >
          <div
            className="tool-page__hero-icon"
            style={{ "--tool-accent": meta?.accent ?? "#ff875c" } as CSSProperties}
          >
            <CategoryIcon size={28} strokeWidth={2.1} />
          </div>

          <div className="tool-page__hero-copy">
            <h1 className="tool-page__title tool-page__title--compact">
              {tool.name}
            </h1>

            {tool.description ? (
              <p className="tool-page__subtitle" style={{ marginTop: "0.45rem" }}>
                {tool.description}
              </p>
            ) : null}

            <div className="tool-page__meta-row">
              <span className="tool-page__meta-pill">{tool.category}</span>
            </div>
          </div>
        </section>

        <section className="tool-page__workspace tool-page__workspace--clean neu-card animate-fade-up delay-150">
          <div className="tool-page__workspace-body">
            <ToolRenderer slug={tool.slug} />
          </div>
        </section>
      </div>
    </div>
  );
}
