"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function JSONFormatter() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const format = () => {
    try {
      setOutput(JSON.stringify(JSON.parse(input), null, 2));
    } catch {
      setOutput("⚠ Invalid JSON");
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>

      <div>
        <label style={{ display: "block", fontWeight: 700, fontSize: ".85rem", color: "#5c4f47", marginBottom: ".35rem" }}>
          Paste your JSON
        </label>
        <textarea
          className="input"
          rows={8}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{\n  "key": "value"\n}'}
          style={{ fontFamily: "monospace", fontSize: ".875rem", resize: "vertical" }}
        />
      </div>

      <button className="btn" onClick={format}>
        Format JSON
      </button>

      {output && (
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: ".4rem" }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: ".85rem", color: "#5c4f47" }}>Result</p>
            <button
              className="btn-ghost btn-sm"
              onClick={copy}
              style={{ display: "flex", alignItems: "center", gap: ".35rem" }}
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre style={{ margin: 0, fontSize: ".83rem", fontFamily: "monospace" }}>{output}</pre>
        </div>
      )}

    </div>
  );
}
