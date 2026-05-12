"use client";

import { useState } from "react";
import { apiEndpoint } from "@/lib/api";

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUnlock = async () => {
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

      const res = await fetch(apiEndpoint("/converter/pdf-unlock"), {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || "Unlock failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "unlocked.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.setTimeout(() => window.URL.revokeObjectURL(url), 0);

    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to unlock PDF (wrong password or corrupted file)");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Unlock PDF</h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
        className="mb-4"
      />

      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="border p-2 mb-4 block"
      />

      {error ? <p className="mb-4 text-sm text-red-600">{error}</p> : null}

      <button
        onClick={handleUnlock}
        disabled={!file || !password || loading}
        className="bg-green-500 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Processing..." : "Unlock PDF"}
      </button>
    </div>
  );
}
