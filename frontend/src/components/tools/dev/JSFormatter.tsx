"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

function formatJs(input: string) {
  return input
    .replace(/\{/g, " {\n")
    .replace(/\}/g, "\n}\n")
    .replace(/;/g, ";\n")
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

export default function JSFormatter() {
  const [input, setInput] = useState("");
  const output = useMemo(() => (input.trim() ? formatJs(input) : ""), [input]);

  return (
    <DevToolShell
      title="JS Formatter"
      description="Reflow compact JavaScript into a more readable layout."
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder={`function hello(){const x=1;return x;}`}
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      }
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Formatted JavaScript appears here"
          value={output}
        />
      }
    />
  );
}
