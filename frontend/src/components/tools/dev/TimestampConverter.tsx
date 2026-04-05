"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

export default function TimestampConverter() {
  const [input, setInput] = useState("");

  const output = useMemo(() => {
    const value = input.trim();
    if (!value) return "";

    const numeric = Number(value);
    if (!Number.isNaN(numeric) && /^\d+$/.test(value)) {
      const milliseconds = value.length === 10 ? numeric * 1000 : numeric;
      const date = new Date(milliseconds);
      return JSON.stringify(
        {
          iso: date.toISOString(),
          utc: date.toUTCString(),
          local: date.toString(),
        },
        null,
        2
      );
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "Invalid timestamp or date";
    }

    return JSON.stringify(
      {
        unixSeconds: Math.floor(date.getTime() / 1000),
        unixMilliseconds: date.getTime(),
        iso: date.toISOString(),
      },
      null,
      2
    );
  }, [input]);

  return (
    <DevToolShell
      title="Timestamp Converter"
      description="Convert unix timestamps into dates or turn dates into unix timestamps."
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="1712323200 or 2026-04-05T12:00:00Z"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      }
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Converted values appear here"
          value={output}
        />
      }
    />
  );
}
