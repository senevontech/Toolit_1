"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

function decodeBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  return atob(padded);
}

export default function JWTDecoder() {
  const [token, setToken] = useState("");

  const output = useMemo(() => {
    const parts = token.trim().split(".");
    if (parts.length < 2) return "";

    try {
      const header = JSON.parse(decodeBase64Url(parts[0]));
      const payload = JSON.parse(decodeBase64Url(parts[1]));
      return JSON.stringify({ header, payload, signature: parts[2] ?? "" }, null, 2);
    } catch {
      return "Invalid JWT token";
    }
  }, [token]);

  return (
    <DevToolShell
      title="JWT Decoder"
      description="Decode JWT header and payload locally in the browser."
      inputLabel="JWT Token"
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="Paste JWT token"
          value={token}
          onChange={(event) => setToken(event.target.value)}
        />
      }
      outputLabel="Decoded Payload"
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Decoded JWT appears here"
          value={output}
        />
      }
    />
  );
}
