"use client";

import { useMemo, useState } from "react";
import DevToolShell from "../dev/DevToolShell";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default function SitemapGenerator() {
  const [urls, setUrls] = useState("");
  const [changefreq, setChangefreq] = useState("weekly");
  const [priority, setPriority] = useState("0.8");

  const output = useMemo(() => {
    const lines = urls
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (!lines.length) {
      return "";
    }

    const items = lines
      .map(
        (url) => `  <url>
    <loc>${escapeXml(url)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
      )
      .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [changefreq, priority, urls]);

  return (
    <DevToolShell
      title="Sitemap Generator"
      description="Generate an XML sitemap from a list of page URLs with default change frequency and priority values."
      controls={
        <div className="grid gap-4 md:grid-cols-2">
          <select className="input default:bg-transparent" value={changefreq} onChange={(event) => setChangefreq(event.target.value)}>
            <option value="always">always</option>
            <option value="hourly">hourly</option>
            <option value="daily">daily</option>
            <option value="weekly">weekly</option>
            <option value="monthly">monthly</option>
            <option value="yearly">yearly</option>
          </select>
          <input className="input" value={priority} onChange={(event) => setPriority(event.target.value)} placeholder="Priority like 0.8" />
        </div>
      }
      inputLabel="Page URLs"
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder={"https://example.com/\nhttps://example.com/about/\nhttps://example.com/contact/"}
          value={urls}
          onChange={(event) => setUrls(event.target.value)}
        />
      }
      outputLabel="XML Sitemap"
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Generated sitemap XML appears here"
          value={output}
        />
      }
    />
  );
}
