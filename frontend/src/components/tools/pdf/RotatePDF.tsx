"use client";

import { useState } from "react";
import { PDFDocument, degrees } from "pdf-lib";
import { downloadFile } from "@/lib/downloadUtils";

export default function RotatePDF() {
  const [file, setFile] = useState<File | null>(null);

  const handleRotate = async () => {
    if (!file) return;

    const bytes = await file.arrayBuffer();
    const pdf = await PDFDocument.load(bytes);

    pdf.getPages().forEach((page) => {
      page.setRotation(degrees(90));
    });

    const rotatedBytes = await pdf.save();

    // Fix TypeScript Blob error
    const rotatedFile = new File(
      [new Uint8Array(rotatedBytes)],
      "rotated.pdf",
      { type: "application/pdf" }
    );

    downloadFile(rotatedFile);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Rotate PDF
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
        className="mb-4"
      />

      <button
        onClick={handleRotate}
        className="bg-orange-500 text-white px-6 py-2 rounded"
      >
        Rotate 90°
      </button>
    </div>
  );
}