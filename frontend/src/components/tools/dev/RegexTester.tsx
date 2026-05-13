"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

export default function RegexTester() {
  const [pattern, setPattern] = useState("\\w+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("");

  const output = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(text.matchAll(regex)).map((match) => ({
        value: match[0],
        index: match.index,
      }));
      return JSON.stringify(matches, null, 2);
    } catch {
      return "Invalid regular expression";
    }
  }, [pattern, flags, text]);

  return (
    <DevToolShell
      title="Regex Tester"
      description="Try a regular expression against sample text and inspect the matches."
      controls={
        <div className="grid gap-4 md:grid-cols-[1fr_180px]">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-100">Pattern</span>
            <input className="input" value={pattern} onChange={(e) => setPattern(e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-100">Flags</span>
            <input className="input" value={flags} onChange={(e) => setFlags(e.target.value)} />
          </label>
        </div>
      }
      inputLabel="Test Text"
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="Enter sample text"
          value={text}
          onChange={(event) => setText(event.target.value)}
        />
      }
      outputLabel="Matches"
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Regex matches appear here"
          value={output}
        />
      }
    />
  );
}
