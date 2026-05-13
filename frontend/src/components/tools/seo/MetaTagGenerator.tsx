"use client";

import { useMemo, useState } from "react";
import DevToolShell from "../dev/DevToolShell";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [canonical, setCanonical] = useState("");
  const [robots, setRobots] = useState("index,follow");

  const output = useMemo(() => {
    if (!title.trim() && !description.trim() && !keywords.trim() && !canonical.trim()) {
      return "";
    }

    const lines = [
      title.trim() ? `<title>${escapeHtml(title.trim())}</title>` : "",
      title.trim() ? `<meta name="title" content="${escapeHtml(title.trim())}" />` : "",
      description.trim()
        ? `<meta name="description" content="${escapeHtml(description.trim())}" />`
        : "",
      keywords.trim() ? `<meta name="keywords" content="${escapeHtml(keywords.trim())}" />` : "",
      `<meta name="robots" content="${escapeHtml(robots)}" />`,
      canonical.trim() ? `<link rel="canonical" href="${escapeHtml(canonical.trim())}" />` : "",
    ].filter(Boolean);

    return lines.join("\n");
  }, [canonical, description, keywords, robots, title]);

  return (
    <DevToolShell
      title="Meta Tag Generator"
      description="Generate clean HTML meta tags for title, description, keywords, canonical URL, and robots instructions."
      controls={
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="Page title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <input className="input" placeholder="Canonical URL" value={canonical} onChange={(event) => setCanonical(event.target.value)} />
          <input className="input md:col-span-2" placeholder="Meta description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <input className="input" placeholder="Keywords, separated by commas" value={keywords} onChange={(event) => setKeywords(event.target.value)} />
          <select className="input default:bg-transparent" value={robots} onChange={(event) => setRobots(event.target.value)}>
            <option value="index,follow">index,follow</option>
            <option value="noindex,follow">noindex,follow</option>
            <option value="index,nofollow">index,nofollow</option>
            <option value="noindex,nofollow">noindex,nofollow</option>
          </select>
        </div>
      }
      inputLabel="Meta Inputs"
      inputNode={
        <div className="space-y-3 text-sm leading-7 text-slate-400">
          <p>Fill the fields above to generate production-ready meta tags.</p>
          <p>Tip: keep the title concise and the description natural, useful, and click-friendly.</p>
        </div>
      }
      outputLabel="Generated Meta Tags"
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Generated meta tags appear here"
          value={output}
        />
      }
    />
  );
}
