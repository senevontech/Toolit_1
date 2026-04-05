"use client";

import { useMemo, useState } from "react";
import DevToolShell from "./DevToolShell";

const KEYWORDS = [
  "select",
  "from",
  "where",
  "join",
  "left join",
  "right join",
  "inner join",
  "group by",
  "order by",
  "having",
  "limit",
  "insert into",
  "values",
  "update",
  "set",
  "delete",
];

function formatSql(input: string) {
  let sql = input.replace(/\s+/g, " ").trim();

  KEYWORDS.forEach((keyword) => {
    const pattern = new RegExp(`\\b${keyword.replace(" ", "\\s+")}\\b`, "gi");
    sql = sql.replace(pattern, `\n${keyword.toUpperCase()}`);
  });

  return sql.trim();
}

export default function SQLFormatter() {
  const [input, setInput] = useState("");
  const output = useMemo(() => (input.trim() ? formatSql(input) : ""), [input]);

  return (
    <DevToolShell
      title="SQL Formatter"
      description="Split SQL queries into cleaner readable clauses."
      inputNode={
        <textarea
          className="input min-h-[18rem]"
          placeholder="select id,name from users where active=1 order by created_at desc"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
      }
      outputNode={
        <textarea
          readOnly
          className="input min-h-[18rem]"
          placeholder="Formatted SQL appears here"
          value={output}
        />
      }
    />
  );
}
