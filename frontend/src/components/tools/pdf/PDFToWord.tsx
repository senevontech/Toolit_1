"use client";

import { useState } from "react";

const UNSUPPORTED_MESSAGE =
  "PDF to Word is not supported by the current backend.";

export default function PDFToWord() {
  const [file,setFile] = useState<File | null>(null);

  const convert = async () => {
    if(!file) return;
  };

  return (
    <div className="p-6 max-w-md">

      <input
        type="file"
        accept="application/pdf"
        onChange={(e)=>setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={convert}
        disabled={!file}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Convert to Word
      </button>

      <p className="mt-3 text-sm text-amber-700">{UNSUPPORTED_MESSAGE}</p>
    </div>
  );
}
