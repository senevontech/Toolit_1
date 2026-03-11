"use client";

import { useState } from "react";

export default function WordToHTML() {
  const [html, setHtml] = useState("");

  const handleFile = async (file: File) => {
    const text = await file.text();

    const formatted = `<html><body><pre>${text}</pre></body></html>`;

    setHtml(formatted);
  };

  const download = () => {
    const blob = new Blob([html], { type: "text/html" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.html";
    link.click();
  };

  return (
    <div className="p-6">
      <input type="file" accept=".doc,.docx" onChange={(e) => handleFile(e.target.files![0])} />

      {html && (
        <button onClick={download} className="mt-4 bg-purple-500 text-white p-2">
          Download HTML
        </button>
      )}
    </div>
  );
}