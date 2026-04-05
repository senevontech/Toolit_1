"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

function formatHtml(input: string) {
  const normalized = input
    .replace(/>\s+</g, "><")
    .replace(/</g, "\n<")
    .trim()
    .split("\n")
    .filter(Boolean);

  let indent = 0;
  const lines = normalized.map((line) => {
    const trimmed = line.trim();
    if (/^<\//.test(trimmed)) indent = Math.max(indent - 1, 0);
    const result = `${"  ".repeat(indent)}${trimmed}`;
    if (/^<[^!/][^>]*[^/]>\s*$/.test(trimmed) && !/^<.*<\/.*>$/.test(trimmed)) indent += 1;
    return result;
  });

  return lines.join("\n");
}

export default function HTMLFormatter() {
  const [input, setInput] = useState("");
  const output = useMemo(() => (input.trim() ? formatHtml(input) : ""), [input]);

  return (
    <DevToolShell
      title="HTML Formatter"
      description="Format raw HTML into a cleaner, more readable structure."
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="<div><h1>Hello</h1><p>World</p></div>"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      }
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Formatted HTML appears here"
          value={output}
        />
      }
    />
  );
}
