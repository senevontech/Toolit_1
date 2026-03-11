"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function SplitPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState<number | null>(null);

  const handleFile = async (selectedFile: File) => {
    setFile(selectedFile);

    const bytes = await selectedFile.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    setPageCount(pdf.getPageCount());
  };

  const handleSplit = async () => {
    if (!file) return;

    setLoading(true);

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    const totalPages = pdf.getPageCount();

    for (let i = 0; i < totalPages; i++) {
      const newPdf = await PDFDocument.create();

      const [copiedPage] = await newPdf.copyPages(pdf, [i]);
      newPdf.addPage(copiedPage);

      const newBytes = await newPdf.save();

      const blob = new Blob(
        [new Uint8Array(newBytes)],
        { type: "application/pdf" }
      );

      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `page-${i + 1}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);

      /* delay prevents browser blocking */
      await new Promise((r) => setTimeout(r, 400));
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">
        Split PDF
      </h2>

      <div className="border-2 border-dashed p-6 text-center rounded mb-4">
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) =>
            e.target.files && handleFile(e.target.files[0])
          }
        />

        {file && (
          <p className="text-sm text-gray-500 mt-2">
            {file.name} — {(file.size / 1024).toFixed(1)} KB
          </p>
        )}

        {pageCount && (
          <p className="text-sm text-gray-400">
            {pageCount} pages detected
          </p>
        )}
      </div>

      <button
        onClick={handleSplit}
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded"
      >
        {loading ? "Splitting..." : "Split PDF"}
      </button>
    </div>
  );
}