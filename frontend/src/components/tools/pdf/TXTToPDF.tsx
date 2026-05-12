"use client";

import { useState } from "react";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { downloadFile } from "@/lib/downloadUtils";

export default function TXTToPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convert = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    try {
      const text = await file.text();
      const lines = text
        .replace(/\r\n/g, "\n")
        .split("\n")
        .flatMap((line) => line.match(/.{1,86}/g) ?? [""]);

      const pdfDoc = await PDFDocument.create();
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 11;
      const lineHeight = 15;
      const margin = 50;
      let page = pdfDoc.addPage([612, 792]);
      let y = page.getHeight() - margin;

      for (const line of lines) {
        if (y < margin) {
          page = pdfDoc.addPage([612, 792]);
          y = page.getHeight() - margin;
        }

        page.drawText(line || " ", {
          x: margin,
          y,
          size: fontSize,
          font,
          lineHeight,
        });
        y -= lineHeight;
      }

      const pdfBytes = await pdfDoc.save();

      downloadFile(
        new File([new Uint8Array(pdfBytes)], "converted.pdf", {
          type: "application/pdf",
        })
      );
    } catch {
      setError("Could not convert this TXT file.");
    } finally {
      setLoading(false);
    }
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
        disabled={!file || loading}
        className="mt-4 bg-blue-500 text-white px-4 py-2 disabled:opacity-50"
      >
        {loading ? "Converting..." : "Convert to PDF"}
      </button>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
