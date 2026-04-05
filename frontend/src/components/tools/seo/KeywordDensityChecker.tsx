"use client";

import { useMemo, useState } from "react";
import DevToolShell from "../dev/DevToolShell";

function tokenize(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 2);
}

export default function KeywordDensityChecker() {
  const [input, setInput] = useState("");
  const [targetKeyword, setTargetKeyword] = useState("");

  const analysis = useMemo(() => {
    const tokens = tokenize(input);
    if (!tokens.length) {
      return { summary: "", keywords: [] as Array<{ word: string; count: number; density: string }> };
    }

    const counts = new Map<string, number>();
    for (const token of tokens) {
      counts.set(token, (counts.get(token) ?? 0) + 1);
    }

    const sorted = [...counts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 15)
      .map(([word, count]) => ({
        word,
        count,
        density: `${((count / tokens.length) * 100).toFixed(2)}%`,
      }));

    const normalizedTarget = targetKeyword.trim().toLowerCase();
    const targetCount = normalizedTarget ? counts.get(normalizedTarget) ?? 0 : null;
    const summary = [
      `Total words: ${tokens.length}`,
      `Unique keywords: ${counts.size}`,
      normalizedTarget
        ? `Target keyword "${normalizedTarget}" appears ${targetCount} time${targetCount === 1 ? "" : "s"} (${(((targetCount ?? 0) / tokens.length) * 100).toFixed(2)}%)`
        : "Enter a target keyword to check its exact density.",
    ].join("\n");

    return { summary, keywords: sorted };
  }, [input, targetKeyword]);

  return (
    <DevToolShell
      title="Keyword Density Checker"
      description="Check keyword frequency and density from pasted content to quickly review on-page SEO copy."
      controls={
        <div className="space-y-3">
          <label className="block">
            <span className="mb-2 block text-sm font-semibold text-slate-100">Target keyword</span>
            <input
              className="input"
              placeholder="example keyword"
              value={targetKeyword}
              onChange={(event) => setTargetKeyword(event.target.value)}
            />
          </label>
        </div>
      }
      inputLabel="Content"
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="Paste your article, product description, or page copy here"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      }
      outputLabel="Density Report"
      outputNode={
        <div className="space-y-4">
          <textarea
            readOnly
            className="input min-h-[8rem]"
            placeholder="Your summary report appears here"
            value={analysis.summary}
          />
          <div className="space-y-2">
            {analysis.keywords.length ? (
              analysis.keywords.map((item) => (
                <div
                  key={item.word}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-black/10 px-4 py-3"
                >
                  <span className="text-sm font-semibold text-slate-100">{item.word}</span>
                  <span className="text-sm text-slate-400">
                    {item.count} uses · {item.density}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm leading-7 text-slate-500">
                Top keyword density will appear here after you paste content.
              </p>
            )}
          </div>
        </div>
      }
    />
  );
}
