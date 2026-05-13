"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { downloadFile } from "@/lib/downloadUtils";

const parsePageSelection = (value: string, totalPages: number) => {
  const set = new Set<number>();

  value
    .split(",")
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .forEach((chunk) => {
      if (chunk.includes("-")) {
        const [startRaw, endRaw] = chunk.split("-");
        const start = Number(startRaw);
        const end = Number(endRaw);
        if (!Number.isFinite(start) || !Number.isFinite(end)) return;

        const from = Math.max(1, Math.min(start, end));
        const to = Math.min(totalPages, Math.max(start, end));
        for (let p = from; p <= to; p += 1) set.add(p - 1);
        return;
      }

      const page = Number(chunk);
      if (Number.isFinite(page) && page >= 1 && page <= totalPages) set.add(page - 1);
    });

  return Array.from(set).sort((a, b) => a - b);
};

export default function RemovePagesFromPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [selection, setSelection] = useState("");
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onFile = async (next: File | null) => {
    setFile(next);
    setError(null);
    setSelection("");
    if (!next) {
      setPageCount(null);
      return;
    }

    try {
      const pdf = await PDFDocument.load(await next.arrayBuffer(), { ignoreEncryption: true });
      setPageCount(pdf.getPageCount());
    } catch {
      setError("Could not read this PDF.");
      setPageCount(null);
    }
  };

  const handleRemove = async () => {
    if (!file || !pageCount) {
      setError("Upload a valid PDF first.");
      return;
    }

    const pagesToRemove = parsePageSelection(selection, pageCount);
    if (!pagesToRemove.length) {
      setError("Enter pages to remove, for example: 2,4-6");
      return;
    }

    const keep = Array.from({ length: pageCount }, (_, i) => i).filter((i) => !pagesToRemove.includes(i));
    if (!keep.length) {
      setError("You cannot remove every page.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const src = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, keep);
      copied.forEach((p) => out.addPage(p));
      const outBytes = await out.save();
      downloadFile(new File([new Uint8Array(outBytes)], `pages-removed-${file.name}`, { type: "application/pdf" }));
    } catch {
      setError("Failed to remove selected pages.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-orange-500">Remove Pages from PDF</h2>

      <input type="file" accept="application/pdf" onChange={(e) => onFile(e.target.files?.[0] ?? null)} />

      {pageCount !== null && <p className="text-sm text-gray-600">Detected pages: {pageCount}</p>}

      <label className="block text-sm font-medium text-gray-700">
        Pages to remove (example: 2,4-6)
        <input
          type="text"
          value={selection}
          onChange={(e) => setSelection(e.target.value)}
          placeholder="2,4-6"
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleRemove}
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Remove Pages"}
      </button>
    </div>
  );
}
