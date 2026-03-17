"use client";

import { useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import { PDFDocument } from "pdf-lib";

import { downloadFile } from "@/lib/downloadUtils";

type MergeError = string | null;

const isPdfFile = (file: File) =>
  file.type === "application/pdf" ||
  file.name.toLowerCase().endsWith(".pdf");

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<MergeError>(null);

  const fileCountLabel = useMemo(() => {
    if (files.length === 0) return "No PDFs selected yet";
    if (files.length === 1) return "1 PDF ready";
    return `${files.length} PDFs ready`;
  }, [files.length]);

  const handleFiles = (incoming: FileList | File[]) => {
    const pickedFiles = Array.from(incoming).filter(isPdfFile);

    if (pickedFiles.length === 0) {
      setError("Please choose valid PDF files.");
      return;
    }

    setError(null);
    setFiles((prev) => {
      const next = [...prev];

      for (const file of pickedFiles) {
        const exists = next.some(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        );

        if (!exists) {
          next.push(file);
        }
      }

      return next;
    });
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }

    e.target.value = "";
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: number) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + direction;

      if (target < 0 || target >= next.length) {
        return prev;
      }

      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError("Upload at least 2 PDFs to merge.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes, {
          ignoreEncryption: true,
        });

        const pages = await mergedPdf.copyPages(
          pdf,
          pdf.getPageIndices()
        );

        pages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedBytes = await mergedPdf.save();
      const mergedFile = new File(
        [new Uint8Array(mergedBytes)],
        "merged.pdf",
        { type: "application/pdf" }
      );

      downloadFile(mergedFile);
    } catch (mergeError) {
      console.error("Merge PDF failed:", mergeError);
      setError(
        "Could not merge these PDFs. Try standard PDF files without password protection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-orange-500">Merge PDF</h2>
        <p className="text-sm text-gray-500">
          Upload multiple PDFs, reorder them, and export one merged file.
        </p>
      </div>

      <div
        className={`border-2 border-dashed p-6 text-center rounded-lg ${
          dragActive ? "border-orange-500 bg-orange-50" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p className="text-gray-600 mb-2">Drag and drop PDF files here</p>
        <p className="text-xs text-gray-400 mb-4">{fileCountLabel}</p>

        <input
          type="file"
          accept=".pdf,application/pdf"
          multiple
          onChange={handleInput}
          className="block mx-auto"
        />
      </div>

      {error && (
        <div className="bg-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.lastModified}-${index}`}
              className="flex items-center justify-between border p-3 rounded"
            >
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => moveFile(index, -1)}
                  aria-label={`Move ${file.name} up`}
                  className="px-2 bg-gray-200 rounded"
                >
                  ↑
                </button>

                <button
                  type="button"
                  onClick={() => moveFile(index, 1)}
                  aria-label={`Move ${file.name} down`}
                  className="px-2 bg-gray-200 rounded"
                >
                  ↓
                </button>

                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  aria-label={`Remove ${file.name}`}
                  className="px-2 bg-red-500 text-white rounded"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleMerge}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded disabled:opacity-60"
      >
        {loading ? "Merging..." : "Merge PDFs"}
      </button>
    </div>
  );
}
