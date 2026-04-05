"use client";

import { useState } from "react";
import { downloadAllFiles } from "@/lib/downloadUtils";

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

export default function ExtractImagesFromPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!file) {
      setError("Please upload a PDF.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as any;
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

      const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
      const outputs: File[] = [];

      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas not available");

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: ctx, viewport, canvas }).promise;

        const blob = await canvasToBlob(canvas, "image/png");
        if (!blob) continue;

        outputs.push(new File([blob], `${file.name.replace(/\.pdf$/i, "")}-image-${i}.png`, { type: "image/png" }));
      }

      if (!outputs.length) {
        setError("No images were generated from this PDF.");
        return;
      }

      downloadAllFiles(outputs);
    } catch {
      setError("Failed to extract images from this PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-orange-500">Extract Images from PDF</h2>
      <p className="text-sm text-gray-600">This creates page images from your PDF and downloads them as PNG files.</p>

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <label className="block text-sm font-medium text-gray-700">
        Quality scale: {scale.toFixed(1)}x
        <input
          type="range"
          min={1}
          max={2.5}
          step={0.1}
          value={scale}
          onChange={(e) => setScale(Number(e.target.value))}
          className="w-full"
        />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleExtract}
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Extracting..." : "Extract Images"}
      </button>
    </div>
  );
}
