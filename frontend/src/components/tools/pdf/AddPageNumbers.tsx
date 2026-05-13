"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { downloadFile } from "@/lib/downloadUtils";

type Position = "bottom-center" | "bottom-right" | "top-right" | "top-center";

export default function AddPageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [startFrom, setStartFrom] = useState(1);
  const [fontSize, setFontSize] = useState(12);
  const [position, setPosition] = useState<Position>("bottom-center");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPoint = (positionKey: Position, width: number, height: number, textWidth: number, size: number) => {
    const margin = 24;
    switch (positionKey) {
      case "bottom-right":
        return { x: width - textWidth - margin, y: margin };
      case "top-right":
        return { x: width - textWidth - margin, y: height - size - margin };
      case "top-center":
        return { x: (width - textWidth) / 2, y: height - size - margin };
      default:
        return { x: (width - textWidth) / 2, y: margin };
    }
  };

  const handleApply = async () => {
    if (!file) {
      setError("Please upload a PDF.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.Helvetica);

      pdf.getPages().forEach((page, idx) => {
        const label = String(startFrom + idx);
        const textWidth = font.widthOfTextAtSize(label, fontSize);
        const { width, height } = page.getSize();
        const point = getPoint(position, width, height, textWidth, fontSize);

        page.drawText(label, {
          x: point.x,
          y: point.y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
          opacity: 0.9,
        });
      });

      const out = await pdf.save();
      downloadFile(new File([new Uint8Array(out)], `page-numbers-${file.name}`, { type: "application/pdf" }));
    } catch {
      setError("Could not add page numbers to this PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-orange-500">Add Page Numbers</h2>

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Start from
          <input
            type="number"
            min={1}
            value={startFrom}
            onChange={(e) => setStartFrom(Math.max(1, Number(e.target.value) || 1))}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>

        <label className="block text-sm font-medium text-gray-700">
          Font size
          <input
            type="number"
            min={8}
            max={48}
            value={fontSize}
            onChange={(e) => setFontSize(Math.max(8, Math.min(48, Number(e.target.value) || 12)))}
            className="mt-1 w-full border rounded px-3 py-2"
          />
        </label>
      </div>

      <label className="block text-sm font-medium text-gray-700">
        Position
        <select
          value={position}
          onChange={(e) => setPosition(e.target.value as Position)}
          className="mt-1 w-full border rounded px-3 py-2"
        >
          <option value="bottom-center">Bottom center</option>
          <option value="bottom-right">Bottom right</option>
          <option value="top-center">Top center</option>
          <option value="top-right">Top right</option>
        </select>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleApply}
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Page Numbers"}
      </button>
    </div>
  );
}
