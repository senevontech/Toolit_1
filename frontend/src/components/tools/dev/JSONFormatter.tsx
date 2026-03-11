"use client";

import { useState } from "react";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
    } catch {
      setOutput("Invalid JSON");
    }
  };

  return (
    <div className="p-6">
      <textarea
        className="border w-full p-2"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button
        onClick={format}
        className="mt-4 bg-blue-600 text-white px-4 py-2"
      >
        Format JSON
      </button>

      <pre className="mt-4 bg-gray-100 p-4">{output}</pre>
    </div>
  );
}