"use client";

import { useState } from "react";
import QRCode from "qrcode";

export default function QRGenerator() {
  const [text, setText] = useState("");
  const [qr, setQr] = useState("");

  const generate = async () => {
    const url = await QRCode.toDataURL(text);
    setQr(url);
  };

  return (
    <div className="p-6">
      <input
        className="border p-2 w-full"
        placeholder="Enter text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        onClick={generate}
        className="mt-4 bg-blue-500 text-white px-4 py-2"
      >
        Generate QR
      </button>

      {qr && <img src={qr} className="mt-4" />}
    </div>
  );
}