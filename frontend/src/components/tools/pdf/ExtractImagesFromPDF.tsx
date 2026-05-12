"use client";

import { useState } from "react";
import { downloadAllFiles } from "@/lib/downloadUtils";

const canvasToBlob = (canvas: HTMLCanvasElement, type: string, quality?: number) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), type, quality);
  });

const getPdfImageObject = (page: any, name: string) =>
  new Promise<any>((resolve) => {
    try {
      page.objs.get(name, resolve);
    } catch {
      resolve(null);
    }
  });

const imageObjectToCanvas = (image: any) => {
  if (!image?.width || !image?.height || !image?.data) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  canvas.width = image.width;
  canvas.height = image.height;

  if (image instanceof ImageData) {
    ctx.putImageData(image, 0, 0);
    return canvas;
  }

  const raw = image.data as Uint8ClampedArray | Uint8Array;
  const rgba = new Uint8ClampedArray(image.width * image.height * 4);
  const components = raw.length / (image.width * image.height);

  for (let i = 0, j = 0; i < rgba.length; i += 4, j += components) {
    rgba[i] = raw[j] ?? 0;
    rgba[i + 1] = raw[j + 1] ?? raw[j] ?? 0;
    rgba[i + 2] = raw[j + 2] ?? raw[j] ?? 0;
    rgba[i + 3] = components >= 4 ? raw[j + 3] ?? 255 : 255;
  }

  ctx.putImageData(new ImageData(rgba, image.width, image.height), 0, 0);
  return canvas;
};

export default function ExtractImagesFromPDF() {
  const [file, setFile] = useState<File | null>(null);
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
      const imageOps = new Set([
        pdfjs.OPS.paintImageXObject,
        pdfjs.OPS.paintJpegXObject,
        pdfjs.OPS.paintInlineImageXObject,
      ]);

      for (let i = 1; i <= pdf.numPages; i += 1) {
        const page = await pdf.getPage(i);
        const operatorList = await page.getOperatorList();
        let pageImageNumber = 1;

        for (let opIndex = 0; opIndex < operatorList.fnArray.length; opIndex += 1) {
          if (!imageOps.has(operatorList.fnArray[opIndex])) continue;

          const imageName = operatorList.argsArray[opIndex]?.[0];
          const image =
            typeof imageName === "string"
              ? await getPdfImageObject(page, imageName)
              : imageName;
          const canvas = imageObjectToCanvas(image);
          if (!canvas) continue;

          const blob = await canvasToBlob(canvas, "image/png");
          if (!blob) continue;

          outputs.push(
            new File(
              [blob],
              `${file.name.replace(/\.pdf$/i, "")}-page-${i}-image-${pageImageNumber}.png`,
              { type: "image/png" }
            )
          );
          pageImageNumber += 1;
        }
      }

      if (!outputs.length) {
        setError("No embedded raster images were found. Use PDF to Images if you want full-page image exports.");
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
      <p className="text-sm text-gray-600">This extracts embedded raster images only. It does not render every page.</p>

      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />

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
