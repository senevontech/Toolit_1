"use client";

import { useState } from "react";
import { downloadFile } from "@/lib/downloadUtils";

export default function PDFToTXT() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convert = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setText("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfjs = (await import("pdfjs-dist/legacy/build/pdf.mjs")) as any;
      pdfjs.GlobalWorkerOptions.workerSrc =
        `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

      const pdf = await pdfjs.getDocument({
        data: arrayBuffer,
      }).promise;

      let extractedText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        extractedText += content.items
          .map((item: any) => item.str)
          .join(" ");
        extractedText += "\n\n";
      }

      setText(extractedText.trim());
    } catch {
      setError("Could not extract text from this PDF.");
    } finally {
      setLoading(false);
    }
  };

  const downloadText = () => {
    if (!text) return;
    const name = file?.name.replace(/\.pdf$/i, "") || "converted";
    downloadFile(new File([text], `${name}.txt`, { type: "text/plain" }));
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">
        PDF to Text
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] ?? null)
        }
      />

      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={convert}
          disabled={!file || loading}
          className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Converting..." : "Convert to Text"}
        </button>

        <button
          type="button"
          onClick={downloadText}
          disabled={!text}
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Download TXT
        </button>
      </div>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <textarea
        value={text}
        readOnly
        className="w-full h-40 border mt-4 p-2"
      />
    </div>
  );
}
