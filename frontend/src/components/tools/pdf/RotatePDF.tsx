"use client";

import { useState, useCallback } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { downloadFile } from "@/lib/downloadUtils";

export default function RotatePDFAdvanced() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [angle, setAngle] = useState(90);
  const [pagesInput, setPagesInput] = useState("");

  // 📥 Handle file select
  const handleFiles = (selected: FileList | null) => {
    if (!selected) return;

    const pdfFiles = Array.from(selected).filter(
      (f) => f.type === "application/pdf"
    );

    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  // 🖱 Drag & Drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // 📄 Parse pages like "1,3,5"
  const parsePages = (input: string, total: number) => {
    if (!input) return Array.from({ length: total }, (_, i) => i);

    return input
      .split(",")
      .map((p) => parseInt(p.trim()) - 1)
      .filter((p) => !isNaN(p) && p >= 0 && p < total);
  };

  // 🔄 Rotate
  const handleRotate = async () => {
    if (files.length === 0) {
      alert("Upload at least one PDF");
      return;
    }

    try {
      setLoading(true);

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);

        const pages = pdf.getPages();
        const selectedPages = parsePages(pagesInput, pages.length);

        pages.forEach((page, index) => {
          if (selectedPages.includes(index)) {
            const current = page.getRotation().angle;
            page.setRotation(degrees(current + angle));
          }
        });

        const rotatedBytes = await pdf.save();

        const rotatedFile = new File(
          [new Uint8Array(rotatedBytes)],
          `rotated-${file.name}`,
          { type: "application/pdf" }
        );

        downloadFile(rotatedFile);
      }
    } catch (err) {
      console.error(err);
      alert("Error processing PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Advanced Rotate PDF
      </h2>

      {/* Drag & Drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed p-6 text-center mb-4"
      >
        Drag & Drop PDFs here
        <br />
        or
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="mt-2"
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Files:</h4>
          {files.map((f, i) => (
            <p key={i} className="text-sm">
              📄 {f.name}
            </p>
          ))}
        </div>
      )}

      {/* Page Selection */}
      <input
        type="text"
        placeholder="Pages (e.g. 1,3,5) - leave empty for all"
        value={pagesInput}
        onChange={(e) => setPagesInput(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Rotation Options */}
      <select
        value={angle}
        onChange={(e) => setAngle(Number(e.target.value))}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value={90}>Rotate 90°</option>
        <option value={180}>Rotate 180°</option>
        <option value={270}>Rotate 270°</option>
        <option value={-90}>Rotate -90°</option>
      </select>

      {/* Action */}
      <button
        onClick={handleRotate}
        disabled={loading}
        className="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Rotate PDF"}
      </button>
    </div>
  );
}