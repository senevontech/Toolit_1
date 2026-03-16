"use client";

import { useState } from "react";
import { convertFile } from "@/lib/api";

export default function WordToHTML() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const convert = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      await convertFile("/converter/word-html", file, "converted.html");
    } catch (err) {
      setError("Conversion failed. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <input
        type="file"
        accept=".doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={convert}
        disabled={!file || loading}
        className="mt-4 bg-purple-500 text-white p-2 disabled:opacity-50"
      >
        {loading ? "Converting..." : "Download HTML"}
      </button>

      {error && <p className="mt-3 text-red-500">{error}</p>}
    </div>
  );
}
