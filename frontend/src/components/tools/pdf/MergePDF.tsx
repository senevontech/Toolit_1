"use client";

import { useState } from "react";
import { PDFDocument } from "pdf-lib";

export default function MergePDF() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);

  /* HANDLE FILE SELECT */
  const handleFiles = (fileList: FileList) => {
    const pdfFiles = Array.from(fileList).filter(
      (file) => file.type === "application/pdf"
    );
    setFiles((prev) => [...prev, ...pdfFiles]);
  };

  /* INPUT SELECT */
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  /* DRAG DROP */
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  /* REMOVE FILE */
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  /* MOVE FILE */
  const moveFile = (index: number, direction: number) => {
    const newFiles = [...files];
    const target = index + direction;

    if (target < 0 || target >= files.length) return;

    [newFiles[index], newFiles[target]] = [
      newFiles[target],
      newFiles[index],
    ];

    setFiles(newFiles);
  };

  /* MERGE PDF */
  const handleMerge = async () => {
    if (files.length < 2) {
      alert("Upload at least 2 PDFs");
      return;
    }

    setLoading(true);

    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const bytes = await file.arrayBuffer();
      const pdf = await PDFDocument.load(bytes);

      const pages = await mergedPdf.copyPages(
        pdf,
        pdf.getPageIndices()
      );

      pages.forEach((p) => mergedPdf.addPage(p));
    }

    const mergedBytes = await mergedPdf.save();

    const blob = new Blob(
      [new Uint8Array(mergedBytes)],
      { type: "application/pdf" }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "merged.pdf";
    a.click();

    URL.revokeObjectURL(url);

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-orange-500">
        Merge PDF
      </h2>

      {/* DROP AREA */}
      <div
        className={`border-2 border-dashed p-6 text-center rounded-lg mb-4 ${
          dragActive ? "border-orange-500 bg-orange-50" : ""
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <p className="text-gray-600 mb-2">
          Drag & Drop PDF files here
        </p>

        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleInput}
          className="block mx-auto"
        />
      </div>

      {/* FILE LIST */}
      {files.length > 0 && (
        <div className="space-y-2 mb-4">
          {files.map((file, index) => (
            <div
              key={index}
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
                  onClick={() => moveFile(index, -1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  ↑
                </button>

                <button
                  onClick={() => moveFile(index, 1)}
                  className="px-2 bg-gray-200 rounded"
                >
                  ↓
                </button>

                <button
                  onClick={() => removeFile(index)}
                  className="px-2 bg-red-500 text-white rounded"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MERGE BUTTON */}
      <button
        onClick={handleMerge}
        disabled={loading}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded"
      >
        {loading ? "Merging..." : "Merge PDFs"}
      </button>
    </div>
  );
}