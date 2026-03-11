"use client";

import { useState } from "react";

export default function Base64Tool() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const encode = () => {
    setOutput(btoa(input));
  };

  const decode = () => {
    setOutput(atob(input));
  };

  return (
    <div className="p-6">
      <textarea
        className="border p-2 w-full"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <div className="mt-4 flex gap-2">
        <button onClick={encode} className="bg-blue-500 text-white px-4 py-2">
          Encode
        </button>

        <button onClick={decode} className="bg-green-500 text-white px-4 py-2">
          Decode
        </button>
      </div>

      <textarea className="border p-2 w-full mt-4" value={output} readOnly />
    </div>
  );
}