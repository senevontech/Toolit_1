"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function WordToPDF() {
  const [file, setFile] = useState<File | null>(null);

  const convert = async () => {
    if (!file) return;

    const text = await file.text();

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    page.drawText(text, { x: 50, y: 700, size: 12 });

    const bytes = await pdfDoc.save();

    const blob = new Blob([new Uint8Array(bytes)], {
  type: "application/pdf",
});
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "file.pdf";
    link.click();
  };

  return (
    <div className="p-6">
      <input type="file" accept=".doc,.docx" onChange={(e) => setFile(e.target.files![0])} />

      <button
        onClick={convert}
        className="mt-4 bg-blue-600 text-white p-2"
      >
        Convert
      </button>
    </div>
  );
}