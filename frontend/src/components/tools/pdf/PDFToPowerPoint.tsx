"use client";

import { useState } from "react";

const UNSUPPORTED_MESSAGE =
  "PDF to PowerPoint is not supported by the current backend.";

export default function PDFToPowerPoint() {

  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState("");

  const convert = async () => {

    if (!file) return;
    setError(UNSUPPORTED_MESSAGE);

  };

  return (
    <div className="p-6">

      <input
        type="file"
        accept="application/pdf"
        onChange={(e)=>setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={convert}
        disabled={!file}
        className="mt-4 bg-blue-600 text-white px-4 py-2"
      >
        Convert to PowerPoint
      </button>

      <p className="mt-3 text-sm text-amber-700">{UNSUPPORTED_MESSAGE}</p>

      {error && <p className="mt-3 text-red-500">{error}</p>}

    </div>
  );
}
