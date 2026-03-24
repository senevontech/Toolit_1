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
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import JsonLd from "@/components/seo/JsonLd";
import ToolRenderer from "@/components/tools/ToolRenderer";
import { getToolBySlug, tools } from "@/lib/tools";
import {
  buildBreadcrumbStructuredData,
  buildToolDescription,
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

function getBenefits(toolName: string, category: string) {
  switch (category) {
    case "Image Tools":
      return [
        `Use ${toolName} without installing desktop software.`,
        "Process files quickly in a browser-based workflow.",
        "Handle common optimization tasks from desktop or mobile.",
      ];
    case "Document Tools":
      return [
        `Use ${toolName} for quick PDF and document workflows.`,
        "Avoid switching between multiple document utilities.",
        "Finish common office-file tasks in a simpler interface.",
      ];
    case "Developer Tools":
      return [
        `Use ${toolName} for fast technical tasks in the browser.`,
        "Reduce context switching during debugging or formatting work.",
        "Get clean output that is easy to copy or download.",
      ];
    default:
      return [
        `Use ${toolName} for quick browser-based calculations.`,
        "Adjust inputs and review results instantly.",
        "Access the calculator from any modern device.",
      ];
  }
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

function getRelatedTools(currentSlug: string, category: string) {
  return tools
    .filter((tool) => tool.category === category && tool.slug !== currentSlug)
    .slice(0, 4);
}

export default function ToolPage({ params }: { params: { slug: string } }) {
  const tool = getToolBySlug(params.slug);
  if (!tool) notFound();

  const meta = CATEGORY_META[tool.category];
  const categoryIcon = meta?.icon ?? Sparkles;
  const benefits = getBenefits(tool.name, tool.category);
  const faqs = buildFaq(tool.name);
  const relatedTools = getRelatedTools(tool.slug, tool.category);
  const CategoryIcon = categoryIcon;

  return (
    <div className="tool-page">
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

        <section className="tool-page__workspace neu-card animate-fade-up delay-150">
          <div className="tool-page__workspace-body">
            <ToolRenderer slug={tool.slug} />
          </div>
        </section>

        <section className="neu-card mt-6 p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-[1.25fr,0.95fr]">
            <article>
              <h2 className="text-2xl font-extrabold text-slate-800">
                About {tool.name}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {buildToolDescription(tool)}
              </p>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {meta?.copy}
              </p>
            </article>

            <aside>
              <h2 className="text-2xl font-extrabold text-slate-800">
                How to use
              </h2>
              <ol className="mt-3 space-y-3 text-sm leading-7 text-slate-600">
                {(meta?.steps ?? []).map((step) => (
                  <li key={step} className="rounded-2xl bg-white/60 px-4 py-3">
                    {step}
                  </li>
                ))}
              </ol>
            </aside>
          </div>
        </section>

        <section className="neu-card mt-6 p-6 md:p-8">
          <h2 className="text-2xl font-extrabold text-slate-800">
            Why use {tool.name}
          </h2>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article key={benefit} className="rounded-2xl bg-white/60 px-4 py-4">
                <p className="text-sm leading-7 text-slate-600">{benefit}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="neu-card mt-6 p-6 md:p-8">
          <h2 className="text-2xl font-extrabold text-slate-800">
            {tool.name} FAQ
          </h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <article key={faq.question} className="rounded-2xl bg-white/60 px-4 py-4">
                <h3 className="text-base font-bold text-slate-800">{faq.question}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        {relatedTools.length ? (
          <section className="neu-card mt-6 p-6 md:p-8">
            <h2 className="text-2xl font-extrabold text-slate-800">
              Related {tool.category}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Explore more tools in the same category to keep related workflows
              connected across the site.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="rounded-2xl bg-white/60 px-4 py-4 transition hover:bg-white"
                >
                  <h3 className="text-base font-bold text-slate-800">
                    {relatedTool.name}
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {relatedTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
