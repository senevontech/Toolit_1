"use client";

import { useState } from "react";

const UNSUPPORTED_MESSAGE =
  "PDF to Excel is not supported by the current backend.";

export default function PDFToExcel() {
  const [file, setFile] = useState<File | null>(null);

  const convert = async () => {
    if (!file) return;
  };

  return (
    <div className="p-6">

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={convert}
        disabled={!file}
        className="mt-4 bg-blue-600 text-white px-4 py-2"
      >
        Convert to Excel
      </button>

      <p className="mt-3 text-sm text-amber-700">{UNSUPPORTED_MESSAGE}</p>
    </div>
  );
}
