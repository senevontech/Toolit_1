"use client";

import { useState } from "react";

export default function PDFToTXT() {
  const [text, setText] = useState("");

  const handleFile = async (file: File) => {
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
    }

    setText(extractedText);
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
          handleFile(e.target.files![0])
        }
      />

      <textarea
        value={text}
        readOnly
        className="w-full h-40 border mt-4 p-2"
      />
    </div>
  );
}
