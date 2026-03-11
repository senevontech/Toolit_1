"use client";

import { useState } from "react";

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");

  const handleUnlock = async () => {
    if (!file || !password) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("password", password);

    const res = await fetch("/api/unlock-pdf", {
      method: "POST",
      body: formData,
    });

    const blob = await res.blob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "unlocked.pdf";
    a.click();

    URL.revokeObjectURL(url);
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
        className="bg-green-500 text-white px-6 py-2 rounded"
      >
        Unlock PDF
      </button>
    </div>
  );
}