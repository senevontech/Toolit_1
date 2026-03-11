"use client";

import { useState } from "react";
import { convertFile } from "@/lib/api";

export default function PDFToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const convert = async () => {
    if (!file) return;

    try {
      setLoading(true);

      await convertFile(
        "/converter/pdf-excel",
        file,
        "converted.xlsx"
      );

    } catch (err) {
      alert("Conversion failed");
    } finally {
      setLoading(false);
    }
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
        disabled={!file || loading}
        className="mt-4 bg-blue-600 text-white px-4 py-2"
      >
        {loading ? "Converting..." : "Convert to Excel"}
      </button>

    </div>
  );
}