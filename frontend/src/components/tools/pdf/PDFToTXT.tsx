"use client";

import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

export default function PDFToTXT() {
  const [text, setText] = useState("");

  const handleFile = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({
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