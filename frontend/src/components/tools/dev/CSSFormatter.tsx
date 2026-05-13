"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

function formatCss(input: string) {
  return input
    .replace(/\{/g, " {\n")
    .replace(/;/g, ";\n")
    .replace(/\}/g, "\n}\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce<{ lines: string[]; indent: number }>(
      (acc, line) => {
        if (line.startsWith("}")) acc.indent = Math.max(acc.indent - 1, 0);
        acc.lines.push(`${"  ".repeat(acc.indent)}${line}`);
        if (line.endsWith("{")) acc.indent += 1;
        return acc;
      },
      { lines: [], indent: 0 }
    )
    .lines.join("\n");
}

export default function CSSFormatter() {
  const [input, setInput] = useState("");
  const output = useMemo(() => (input.trim() ? formatCss(input) : ""), [input]);

  return (
    <DevToolShell
      title="CSS Formatter"
      description="Clean up packed CSS into a readable indented stylesheet."
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder=".card{display:flex;color:white;background:black;}"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      }
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Formatted CSS appears here"
          value={output}
        />
      }
    />
  );
}
