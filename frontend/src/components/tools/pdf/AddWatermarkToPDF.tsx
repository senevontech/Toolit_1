"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import { downloadFile } from "@/lib/downloadUtils";

export default function AddWatermarkToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(42);
  const [opacity, setOpacity] = useState(0.2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApply = async () => {
    if (!file) {
      setError("Please upload a PDF.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer(), { ignoreEncryption: true });
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);

      pdf.getPages().forEach((page) => {
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);

        page.drawText(text, {
          x: Math.max(24, (width - textWidth) / 2),
          y: Math.max(24, height / 2),
          size: fontSize,
          font,
          rotate: degrees(35),
          color: rgb(0.5, 0.5, 0.5),
          opacity,
        });
      });

      const out = await pdf.save();
      downloadFile(new File([new Uint8Array(out)], `watermarked-${file.name}`, { type: "application/pdf" }));
    } catch {
      setError("Could not watermark this PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-orange-500">Add Watermark to PDF</h2>

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <label className="block text-sm font-medium text-gray-700">
        Watermark text
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Font size: {fontSize}
        <input
          type="range"
          min={16}
          max={96}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          className="w-full"
        />
      </label>

      <label className="block text-sm font-medium text-gray-700">
        Opacity: {opacity.toFixed(2)}
        <input
          type="range"
          min={0.05}
          max={0.8}
          step={0.05}
          value={opacity}
          onChange={(e) => setOpacity(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleApply}
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Applying..." : "Apply Watermark"}
      </button>
    </div>
  );
}
