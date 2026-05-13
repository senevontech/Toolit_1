"use client";

import { useMemo, useState } from "react";
import DevToolShell from "../dev/DevToolShell";

export default function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState("*");
  const [allow, setAllow] = useState("/");
  const [disallow, setDisallow] = useState("");
  const [sitemap, setSitemap] = useState("");

  const output = useMemo(() => {
    if (!userAgent.trim()) {
      return "";
    }

    const lines = [`User-agent: ${userAgent.trim()}`];
    if (allow.trim()) lines.push(`Allow: ${allow.trim()}`);
    if (disallow.trim()) {
      disallow
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((line) => lines.push(`Disallow: ${line}`));
    }
    if (sitemap.trim()) lines.push("", `Sitemap: ${sitemap.trim()}`);

    return lines.join("\n");
  }, [allow, disallow, sitemap, userAgent]);

  return (
    <DevToolShell
      title="Robots.txt Generator"
      description="Build a valid robots.txt file with allow, disallow, and sitemap directives."
      controls={
        <div className="grid gap-4 md:grid-cols-2">
          <input className="input" placeholder="User-agent" value={userAgent} onChange={(event) => setUserAgent(event.target.value)} />
          <input className="input" placeholder="Allow path" value={allow} onChange={(event) => setAllow(event.target.value)} />
          <input className="input md:col-span-2" placeholder="Sitemap URL" value={sitemap} onChange={(event) => setSitemap(event.target.value)} />
        </div>
      }
      inputLabel="Disallow Rules"
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder={"/admin/\n/private/\n/tmp/"}
          value={disallow}
          onChange={(event) => setDisallow(event.target.value)}
        />
      }
      outputLabel="Generated robots.txt"
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Generated robots.txt appears here"
          value={output}
        />
      }
    />
  );
}
