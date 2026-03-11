"use client";
import { useState } from "react";

export default function PercentageCalculator() {
  const [part, setPart] = useState("");
  const [total, setTotal] = useState("");
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const p = parseFloat(part);
    const t = parseFloat(total);

    if (isNaN(p) || isNaN(t) || t === 0) return;

    const percent = (p / t) * 100;
    setResult(percent);
  };

  return (
    <div className="calculator-card">
      <h1 className="calculator-title">Percentage Calculator</h1>

      <input
        className="input"
        placeholder="Part"
        value={part}
        onChange={(e) => setPart(e.target.value)}
      />

      <input
        className="input"
        placeholder="Total"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
      />

      <button className="btn" onClick={calculate}>
        Calculate %
      </button>

      {result !== null && (
        <div className="result-box">
          Percentage: {result.toFixed(2)}%
        </div>
      )}
    </div>
  );
}