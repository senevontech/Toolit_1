"use client";

import { useState } from "react";
import { downloadAllFiles } from "@/lib/downloadUtils";

type OutputFormat = "png" | "jpeg";

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

export default function PDFToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<OutputFormat>("png");
  const [scale, setScale] = useState(1.5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = async () => {
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
      const mime = format === "png" ? "image/png" : "image/jpeg";
      const ext = format === "png" ? "png" : "jpg";
      const quality = format === "png" ? undefined : 0.92;

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
        const blob = await canvasToBlob(canvas, mime, quality);
        if (!blob) continue;

        outputs.push(new File([blob], `${file.name.replace(/\.pdf$/i, "")}-page-${i}.${ext}`, { type: mime }));
      }

      if (!outputs.length) {
        setError("No images were generated from this PDF.");
        return;
      }

      downloadAllFiles(outputs);
    } catch {
      setError("Failed to convert this PDF to images.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-orange-500">PDF to Images</h2>

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          Output format
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as OutputFormat)}
            className="mt-1 w-full border rounded px-3 py-2"
          >
            <option value="png">PNG</option>
            <option value="jpeg">JPG</option>
          </select>
        </label>

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
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        onClick={handleConvert}
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Converting..." : "Convert to Images"}
      </button>
    </div>
  );
}
