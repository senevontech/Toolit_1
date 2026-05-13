"use client";

import { useState } from "react";
import { apiEndpoint } from "@/lib/api";

export default function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleProtect = async () => {
    if (!file || !password) {
      alert("Please select file and enter password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const res = await fetch(apiEndpoint("/converter/pdf-protect"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || "Conversion failed");
      }

      // download file
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "protected.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.setTimeout(() => window.URL.revokeObjectURL(url), 0);

    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to protect PDF");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Protect PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 mb-4 block"
      />

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <button
        onClick={handleProtect}
        disabled={!file || !password || loading}
        className="bg-orange-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Protect PDF"}
      </button>
    </div>
  );
}
