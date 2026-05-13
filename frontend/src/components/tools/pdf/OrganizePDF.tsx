"use client";

import { useMemo, useState } from "react";
import { PDFDocument } from "pdf-lib";
import { ArrowDown, ArrowUp, Download, Trash2, Upload } from "lucide-react";
import { downloadFile } from "@/lib/downloadUtils";

type PageItem = {
  id: string;
  pageIndex: number;
};

export default function OrganizePDF() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canDownload = file && pages.length > 0 && !loading;

  const pageCountLabel = useMemo(() => {
    if (!pages.length) return "No PDF loaded";
    return `${pages.length} page${pages.length === 1 ? "" : "s"} selected`;
  }, [pages.length]);

  const loadPdf = async (nextFile: File | null) => {
    setFile(nextFile);
    setPages([]);
    setError("");

    if (!nextFile) return;

    try {
      const doc = await PDFDocument.load(await nextFile.arrayBuffer(), {
        ignoreEncryption: true,
      });
      setPages(
        doc.getPageIndices().map((pageIndex) => ({
          id: `${nextFile.name}-${pageIndex}-${crypto.randomUUID()}`,
          pageIndex,
        }))
      );
    } catch {
      setError("Could not read this PDF. Try an unlocked standard PDF file.");
    }
  };

  const movePage = (id: string, direction: -1 | 1) => {
    setPages((current) => {
      const index = current.findIndex((page) => page.id === id);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;

      const next = [...current];
      [next[index], next[nextIndex]] = [next[nextIndex], next[index]];
      return next;
    });
  };

  const removePage = (id: string) => {
    setPages((current) => current.filter((page) => page.id !== id));
  };

  const downloadOrganizedPdf = async () => {
    if (!file || !pages.length) return;

    setLoading(true);
    setError("");

    try {
      const src = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const out = await PDFDocument.create();
      const copiedPages = await out.copyPages(
        src,
        pages.map((page) => page.pageIndex)
      );
      copiedPages.forEach((page) => out.addPage(page));

      const bytes = await out.save({ useObjectStreams: true });
      downloadFile(
        new File([new Uint8Array(bytes)], `organized-${file.name}`, {
          type: "application/pdf",
        })
      );
    } catch {
      setError("Could not organize this PDF.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-orange-500">Organize PDF</h2>
        <p className="mt-2 text-sm text-gray-600">
          Upload a PDF, reorder pages, remove pages, then download the organized file.
        </p>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-3 rounded-lg border border-dashed border-orange-300 bg-orange-50 px-4 py-6 text-sm font-semibold text-orange-700">
        <Upload size={18} />
        <span>{file ? file.name : "Upload PDF"}</span>
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => loadPdf(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>{pageCountLabel}</span>
        {file ? <span>{(file.size / 1024 / 1024).toFixed(2)} MB</span> : null}
      </div>

      {pages.length ? (
        <div className="grid gap-2">
          {pages.map((page, index) => (
            <div
              key={page.id}
              className="flex items-center justify-between rounded-lg border bg-gray-50 px-3 py-2"
            >
              <span className="text-sm font-semibold text-gray-800">
                Page {page.pageIndex + 1}
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded border px-2 py-1 disabled:opacity-40"
                  onClick={() => movePage(page.id, -1)}
                  disabled={index === 0}
                  title="Move up"
                >
                  <ArrowUp size={15} />
                </button>
                <button
                  type="button"
                  className="rounded border px-2 py-1 disabled:opacity-40"
                  onClick={() => movePage(page.id, 1)}
                  disabled={index === pages.length - 1}
                  title="Move down"
                >
                  <ArrowDown size={15} />
                </button>
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-red-600 disabled:opacity-40"
                  onClick={() => removePage(page.id)}
                  disabled={pages.length === 1}
                  title="Remove page"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="button"
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
        disabled={!canDownload}
        onClick={downloadOrganizedPdf}
      >
        <span className="inline-flex items-center gap-2">
          <Download size={16} />
          {loading ? "Preparing..." : "Download Organized PDF"}
        </span>
      </button>
    </div>
  );
}
