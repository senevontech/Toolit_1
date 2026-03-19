"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function Base64Tool() {
  const [input, setInput]   = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const encode = () => {
    try {
      const bytes = new TextEncoder().encode(input);
      setOutput(btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join("")));
    } catch { setOutput("⚠ Encoding failed"); }
  };

  const decode = () => {
    try {
      const bytes = Uint8Array.from(atob(input), (c) => c.charCodeAt(0));
      setOutput(new TextDecoder().decode(bytes));
    } catch { setOutput("⚠ Invalid Base64 string"); }
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
          Input text or Base64
        </label>
        <textarea
          className="input"
          rows={5}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste text to encode, or Base64 to decode…"
          style={{ fontFamily: "monospace", fontSize: ".875rem", resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: ".75rem", flexWrap: "wrap" }}>
        <button className="btn" onClick={encode} style={{ flex: 1, minWidth: "120px" }}>
          Encode →
        </button>
        <button className="btn-outline" onClick={decode} style={{ flex: 1, minWidth: "120px" }}>
          ← Decode
        </button>
      </div>

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
          <textarea
            className="input"
            rows={5}
            value={output}
            readOnly
            style={{ fontFamily: "monospace", fontSize: ".875rem", resize: "vertical" }}
          />
        </div>
      )}

    </div>
  );
}
