"use client";

import { useState } from "react";

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUnlock = async () => {
    if (!file || !password) {
      alert("Please select file and enter password");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("password", password);

      const res = await fetch("http://localhost:5000/converter/pdf-unlock", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Unlock failed");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "unlocked.pdf";
      a.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error(err);
      alert("Failed to unlock PDF (wrong password or corrupted file)");
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

      <button
        onClick={handleUnlock}
        disabled={loading}
        className="bg-green-500 text-white px-6 py-2 rounded"
      >
        {loading ? "Processing..." : "Unlock PDF"}
      </button>
    </div>
  );
}