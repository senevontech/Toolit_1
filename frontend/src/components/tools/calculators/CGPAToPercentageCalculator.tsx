"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { parseNumber } from "./calculatorUtils";

const conversionPresets = [
  { label: "CBSE / Common 9.5", value: "9.5" },
  { label: "University 10.0", value: "10" },
  { label: "Custom factor", value: "custom" },
];

function getPerformanceBand(percentage: number) {
  if (percentage >= 90) return "Outstanding";
  if (percentage >= 75) return "First class";
  if (percentage >= 60) return "Good";
  if (percentage >= 45) return "Average";
  return "Needs improvement";
}

export default function CGPAToPercentageCalculator() {
  const [cgpa, setCgpa] = useState("");
  const [preset, setPreset] = useState("9.5");
  const [factor, setFactor] = useState("9.5");
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const cgpaValue = parseNumber(cgpa);
    const conversionFactor = parseNumber(factor);

    if (
      [cgpaValue, conversionFactor].some(Number.isNaN) ||
      cgpaValue < 0 ||
      cgpaValue > 10 ||
      conversionFactor <= 0
    ) {
      setError("Enter a CGPA between 0 and 10 and a valid conversion factor.");
      setResults([]);
      return;
    }

    setError("");
    const percentage = cgpaValue * conversionFactor;

    setResults([
      { label: "CGPA", value: cgpaValue.toFixed(2) },
      { label: "Conversion factor", value: `${conversionFactor.toFixed(2)} x` },
      { label: "Converted percentage", value: `${percentage.toFixed(2)}%` },
      { label: "Performance band", value: getPerformanceBand(percentage) },
      { label: "Formula used", value: "Percentage = CGPA x Factor" },
    ]);
  };

  return (
    <CalculatorShell
      title="CGPA to Percentage Calculator"
      description="Convert CGPA into percentage using your board or college conversion factor."
      actionLabel="Convert to Percentage"
      onCalculate={calculate}
      results={results}
      note="Most institutions use 9.5, but you can change the conversion factor if your college uses a different rule."
    >
      <div className="rounded-2xl border border-white/5 bg-black/10 p-4 text-sm leading-7 text-slate-400">
        Pick a common conversion preset or enter your own factor. This helps when boards and universities use different rules.
      </div>
      <input
        className="input"
        value={cgpa}
        onChange={(event) => setCgpa(event.target.value)}
        placeholder="Enter CGPA"
      />
      <select
        className="input default:bg-transparent"
        value={preset}
        onChange={(event) => {
          const nextPreset = event.target.value;
          setPreset(nextPreset);
          if (nextPreset !== "custom") {
            setFactor(nextPreset);
          }
        }}
      >
        {conversionPresets.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
      <input
        className="input"
        value={factor}
        onChange={(event) => setFactor(event.target.value)}
        placeholder="Conversion factor"
      />
      {error ? <p className="text-sm text-red-300">{error}</p> : null}
    </CalculatorShell>
  );
}
