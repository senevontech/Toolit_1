"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";

export default function TXTToPDF() {
  const [file, setFile] = useState<File | null>(null);

  const convert = async () => {
    if (!file) return;

    const text = await file.text();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    page.drawText(text.slice(0, 4000), {
      x: 50,
      y: 750,
      size: 12,
      font,
      lineHeight: 14,
    });

    const pdfBytes = await pdfDoc.save();

    // FIX: convert to Uint8Array for Blob
    const blob = new Blob([new Uint8Array(pdfBytes)], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.pdf";
    a.click();
  };

  return (
    <div className="p-6">
      <input
        type="file"
        accept=".txt"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={convert}
        className="mt-4 bg-blue-500 text-white px-4 py-2"
      >
        Convert to PDF
      </button>
    </div>
  );
}