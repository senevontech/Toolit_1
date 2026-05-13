"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

export default function URLParser() {
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    if (!input.trim()) return "";
    try {
      const url = new URL(input.trim());
      const params = Object.fromEntries(url.searchParams.entries());
      return JSON.stringify(
        {
          href: url.href,
          protocol: url.protocol,
          host: url.host,
          hostname: url.hostname,
          port: url.port,
          pathname: url.pathname,
          search: url.search,
          hash: url.hash,
          params,
        },
        null,
        2
      );
    } catch {
      return "Invalid URL";
    }
  }, [input]);

  return (
    <DevToolShell
      title="URL Parser"
      description="Break down a URL into protocol, host, path, hash, and query parameters."
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="https://example.com/path?foo=bar#section"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      }
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Parsed URL parts appear here"
          value={output}
        />
      }
    />
  );
}
