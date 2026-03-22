"use client";

import { useState } from "react";
import { convertFile } from "@/lib/api";

export default function PDFToExcel() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convert = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      await convertFile("/converter/pdf-excel", file, "converted.xlsx");
    } catch (err: any) {
      setError(err?.message || "Conversion failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
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
        disabled={!file || loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Converting..." : "Convert to Excel"}
      </button>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}
