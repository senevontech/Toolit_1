"use client";

import { useState } from "react";
import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist";

GlobalWorkerOptions.workerSrc =
  `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;

export default function PDFToTXT() {
  const [text, setText] = useState("");

  const handleFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await getDocument({
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
