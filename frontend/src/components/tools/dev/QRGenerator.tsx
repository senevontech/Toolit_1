"use client";

import { useState } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qr, setQr]     = useState("");

  const generate = async () => {
    if (!text.trim()) return;
    setQr(await QRCode.toDataURL(text, { width: 300, margin: 2 }));
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = qr;
    a.download = "qr-code.png";
    a.click();
  };

  return (
    <div style={{ display: "grid", gap: "1rem" }}>

      <div>
        <label style={{ display: "block", fontWeight: 700, fontSize: ".85rem", color: "#5c4f47", marginBottom: ".35rem" }}>
          Text or URL
        </label>
        <input
          className="input"
          placeholder="https://example.com"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
      </div>

      <button className="btn" onClick={generate}>
        Generate QR Code
      </button>

      {qr && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".75rem" }}>
          <div
            className="neu-inset-panel"
            style={{ padding: "1rem", display: "inline-block" }}
          >
            <img src={qr} alt="QR Code" style={{ width: "200px", height: "200px", display: "block", borderRadius: ".5rem" }} />
          </div>
          <button className="btn btn-sm" onClick={download}>
            <Download size={13} /> Save PNG
          </button>
        </div>
      )}

    </div>
  );
}
