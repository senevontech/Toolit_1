"use client";

import { useState } from "react";

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const unsupportedMessage =
    "PDF password removal is not implemented in this project yet. It needs a dedicated backend PDF utility.";

  const handleUnlock = async () => {
    if (!file || !password) return;
    alert(unsupportedMessage);
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

      <p className="mt-4 max-w-md text-sm text-amber-700">
        {unsupportedMessage}
      </p>
    </div>
  );
}
