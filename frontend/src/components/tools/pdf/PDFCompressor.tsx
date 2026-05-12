"use client";

import { useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { downloadFile } from "@/lib/downloadUtils";

const MIN_TARGET_KB = 10;
const MAX_TARGET_KB = 51200;

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const blobToArrayBuffer = async (blob: Blob) => {
  const ab = await blob.arrayBuffer();
  return new Uint8Array(ab);
};

const canvasToBlob = (canvas: HTMLCanvasElement, quality: number) =>
  new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/jpeg", quality);
  });

async function buildLosslessCandidates(bytes: ArrayBuffer) {
  const docA = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  const candidateA = await docA.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  const src = await PDFDocument.load(bytes, {
    ignoreEncryption: true,
    updateMetadata: false,
  });
  const rebuilt = await PDFDocument.create();
  const copied = await rebuilt.copyPages(src, src.getPageIndices());
  copied.forEach((page) => rebuilt.addPage(page));
  const candidateB = await rebuilt.save({
    useObjectStreams: true,
    addDefaultPage: false,
  });

  return candidateB.byteLength < candidateA.byteLength ? candidateB : candidateA;
}

async function buildRasterCandidate(
  bytes: ArrayBuffer,
  scale: number,
  quality: number,
  getDocumentFn: (src: { data: ArrayBuffer }) => { promise: Promise<any> }
) {
  const srcPdf = await getDocumentFn({ data: bytes.slice(0) }).promise;
  const outPdf = await PDFDocument.create();

  for (let i = 1; i <= srcPdf.numPages; i += 1) {
    const page = await srcPdf.getPage(i);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      throw new Error("Canvas unavailable");
    }

    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport, canvas }).promise;

    const jpegBlob = await canvasToBlob(canvas, quality);
    if (!jpegBlob) {
      throw new Error("JPEG conversion failed");
    }
    const jpegBytes = await blobToArrayBuffer(jpegBlob);
    const embedded = await outPdf.embedJpg(jpegBytes);
    const outPage = outPdf.addPage([canvas.width, canvas.height]);
    outPage.drawImage(embedded, {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height,
    });
  }

  return outPdf.save({ useObjectStreams: true, addDefaultPage: false });
}

async function getPdfJsGetDocument() {
  const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as any;
  if (pdfjs?.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc =
      `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;
  }
  return pdfjs.getDocument as (src: { data: ArrayBuffer }) => {
    promise: Promise<any>;
  };
}

export default function PDFCompressor() {
  const [file, setFile] = useState<File | null>(null);
  const [targetSizeKb, setTargetSizeKb] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<number | null>(null);
  const [targetMessage, setTargetMessage] = useState<string | null>(null);

  const ratioLabel = useMemo(() => {
    if (!file || resultSize === null) return null;
    const delta = file.size - resultSize;
    const percent = (Math.abs(delta) / file.size) * 100;
    if (delta >= 0) return `${percent.toFixed(1)}% smaller`;
    return `${percent.toFixed(1)}% larger`;
  }, [file, resultSize]);

  const handleCompress = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }
    const numericTargetKb = Number(targetSizeKb);
    if (
      !Number.isFinite(numericTargetKb) ||
      numericTargetKb < MIN_TARGET_KB ||
      numericTargetKb > MAX_TARGET_KB
    ) {
      setError(
        `Please enter a target size between ${MIN_TARGET_KB} and ${MAX_TARGET_KB} KB.`
      );
      return;
    }

    setLoading(true);
    setError(null);
    setProgress("Analyzing PDF...");
    setResultSize(null);
    setTargetMessage(null);

    try {
      const bytes = await file.arrayBuffer();
      const targetBytes = numericTargetKb * 1024;

      // If requested target is already larger than the original file,
      // skip heavy compression and return a safe optimized save.
      if (targetBytes >= bytes.byteLength) {
        setProgress("Target is larger than original size. Running safe optimization...");
        try {
          const safe = await buildLosslessCandidates(bytes);
          const outSafe = new File([new Uint8Array(safe)], `compressed-${file.name}`, {
            type: "application/pdf",
          });
          setResultSize(outSafe.size);
          setTargetMessage(
            "Target is larger than the original file size. Returned optimized PDF."
          );
          downloadFile(outSafe);
        } catch {
          const original = new File([bytes], `compressed-${file.name}`, {
            type: "application/pdf",
          });
          setResultSize(original.size);
          setTargetMessage("Could not optimize this PDF. Returned original file.");
          downloadFile(original);
        }
        return;
      }

      setProgress("Running lossless compression...");
      let bestBytes: Uint8Array;
      try {
        bestBytes = await buildLosslessCandidates(bytes);
      } catch {
        const original = new File([bytes], `compressed-${file.name}`, {
          type: "application/pdf",
        });
        setResultSize(original.size);
        setTargetMessage("Could not parse this PDF for compression. Returned original file.");
        downloadFile(original);
        return;
      }

      if (bestBytes.byteLength > targetBytes) {
        let getDocumentFn:
          | ((src: { data: ArrayBuffer }) => { promise: Promise<any> })
          | null = null;
        try {
          getDocumentFn = await getPdfJsGetDocument();
        } catch {
          getDocumentFn = null;
        }

        const passes = [
          { scale: 1.5, quality: 0.88 },
          { scale: 1.3, quality: 0.82 },
          { scale: 1.1, quality: 0.76 },
          { scale: 1.0, quality: 0.7 },
          { scale: 0.9, quality: 0.62 },
          { scale: 0.8, quality: 0.55 },
          { scale: 0.7, quality: 0.48 },
          { scale: 0.6, quality: 0.38 },
          { scale: 0.5, quality: 0.3 },
        ];

        for (let i = 0; i < passes.length; i += 1) {
          if (!getDocumentFn) {
            break;
          }
          const pass = passes[i];
          setProgress(
            `Trying strong compression pass ${i + 1}/${passes.length}...`
          );
          try {
            const candidate = await buildRasterCandidate(
              bytes,
              pass.scale,
              pass.quality,
              getDocumentFn
            );
            if (candidate.byteLength < bestBytes.byteLength) {
              bestBytes = candidate;
            }
          } catch {
            // Skip failed pass and continue trying others.
          }
          if (bestBytes.byteLength <= targetBytes) {
            break;
          }
        }
      }

      const outFile = new File([new Uint8Array(bestBytes)], `compressed-${file.name}`, {
        type: "application/pdf",
      });

      setResultSize(outFile.size);
      if (outFile.size <= targetBytes) {
        setTargetMessage("Target size reached.");
      } else {
        setTargetMessage(`Could not reach ${numericTargetKb} KB target. Best result: ${formatBytes(outFile.size)}.`);
      }
      downloadFile(outFile);
    } catch {
      try {
        const bytes = await file.arrayBuffer();
        const original = new File([bytes], `compressed-${file.name}`, {
          type: "application/pdf",
        });
        setResultSize(original.size);
        setTargetMessage("Compression fallback used. Returned original file.");
        downloadFile(original);
      } catch {
        setError(
          "Could not process this PDF. Try another PDF file."
        );
      }
    } finally {
      setProgress(null);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
      <h2 className="text-2xl font-bold text-orange-500">PDF Compressor</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full"
      />

      <label className="block text-sm font-medium text-gray-700">
        Target size (KB)
        <input
          type="number"
          min={MIN_TARGET_KB}
          max={MAX_TARGET_KB}
          step={1}
          value={targetSizeKb}
          onChange={(e) => setTargetSizeKb(e.target.value)}
          placeholder={`Enter ${MIN_TARGET_KB}-${MAX_TARGET_KB} KB`}
          className="mt-1 w-full border rounded px-3 py-2"
        />
      </label>
      <p className="text-xs text-gray-500">
        Allowed range: {MIN_TARGET_KB} KB to {MAX_TARGET_KB} KB
      </p>
      {targetSizeKb !== "" ? (
        <label className="block text-sm font-medium text-gray-700">
          Adjust target range
          <input
            type="range"
            min={MIN_TARGET_KB}
            max={MAX_TARGET_KB}
            step={1}
            value={Math.max(
              MIN_TARGET_KB,
              Math.min(MAX_TARGET_KB, Number(targetSizeKb) || MIN_TARGET_KB)
            )}
            onChange={(e) => setTargetSizeKb(e.target.value)}
            className="mt-1 w-full"
          />
        </label>
      ) : null}

      {file && (
        <div className="text-sm text-gray-600">
          Original size: <span className="font-semibold">{formatBytes(file.size)}</span>
          {resultSize !== null && (
            <>
              {" "}
              | Result: <span className="font-semibold">{formatBytes(resultSize)}</span>
              {" "}
              ({ratioLabel})
            </>
          )}
        </div>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {progress && <p className="text-sm text-gray-600">{progress}</p>}
      {targetMessage && <p className="text-sm text-gray-600">{targetMessage}</p>}

      <button
        onClick={handleCompress}
        disabled={loading}
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Compressing..." : "Compress PDF"}
      </button>
    </div>
  );
}
