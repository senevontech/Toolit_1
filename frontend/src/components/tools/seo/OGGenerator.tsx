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

export default function OGGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [siteName, setSiteName] = useState("");

  const output = useMemo(() => {
    if (!title.trim() && !description.trim() && !url.trim() && !image.trim() && !siteName.trim()) {
      return "";
    }

    return [
      `<meta property="og:title" content="${escapeHtml(title.trim())}" />`,
      `<meta property="og:description" content="${escapeHtml(description.trim())}" />`,
      `<meta property="og:type" content="website" />`,
      url.trim() ? `<meta property="og:url" content="${escapeHtml(url.trim())}" />` : "",
      image.trim() ? `<meta property="og:image" content="${escapeHtml(image.trim())}" />` : "",
      siteName.trim()
        ? `<meta property="og:site_name" content="${escapeHtml(siteName.trim())}" />`
        : "",
      "",
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:title" content="${escapeHtml(title.trim())}" />`,
      `<meta name="twitter:description" content="${escapeHtml(description.trim())}" />`,
      image.trim() ? `<meta name="twitter:image" content="${escapeHtml(image.trim())}" />` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [description, image, siteName, title, url]);

  return (
    <DevToolShell
      title="OG Generator"
      description="Generate Open Graph and Twitter meta tags for better social sharing previews."
      controls={
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="Page title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <input className="input" placeholder="Page URL" value={url} onChange={(event) => setUrl(event.target.value)} />
          <input className="input md:col-span-2" placeholder="Description" value={description} onChange={(event) => setDescription(event.target.value)} />
          <input className="input" placeholder="OG image URL" value={image} onChange={(event) => setImage(event.target.value)} />
          <input className="input" placeholder="Site name" value={siteName} onChange={(event) => setSiteName(event.target.value)} />
        </div>
      }
      inputLabel="Preview Guidance"
      inputNode={
        <div className="space-y-3 text-sm leading-7 text-slate-400">
          <p>Use a clear title, a concise description, and a full image URL for the best social preview cards.</p>
          <p>Recommended image size: at least 1200 x 630 for large-link previews.</p>
        </div>
      }
      outputLabel="Generated OG Tags"
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Generated Open Graph tags appear here"
          value={output}
        />
      }
    />
  );
}
