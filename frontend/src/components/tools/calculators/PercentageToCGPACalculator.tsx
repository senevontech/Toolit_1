"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { parseNumber } from "./calculatorUtils";

const conversionPresets = [
  { label: "CBSE / Common 9.5", value: "9.5" },
  { label: "University 10.0", value: "10" },
  { label: "Custom factor", value: "custom" },
];

function getCgpaBand(cgpa: number) {
  if (cgpa >= 9) return "Excellent";
  if (cgpa >= 8) return "Very good";
  if (cgpa >= 7) return "Good";
  if (cgpa >= 6) return "Average";
  return "Basic passing range";
}

export default function PercentageToCGPACalculator() {
  const [percentage, setPercentage] = useState("");
  const [preset, setPreset] = useState("9.5");
  const [factor, setFactor] = useState("9.5");
  const [error, setError] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const percentageValue = parseNumber(percentage);
    const conversionFactor = parseNumber(factor);

    if (
      [percentageValue, conversionFactor].some(Number.isNaN) ||
      percentageValue < 0 ||
      percentageValue > 100 ||
      conversionFactor <= 0
    ) {
      setError("Enter a percentage between 0 and 100 and a valid conversion factor.");
      setResults([]);
      return;
    }

    setError("");
    const cgpa = percentageValue / conversionFactor;

    setResults([
      { label: "Percentage", value: `${percentageValue.toFixed(2)}%` },
      { label: "Conversion factor", value: `${conversionFactor.toFixed(2)} x` },
      { label: "Estimated CGPA", value: cgpa.toFixed(2) },
      { label: "Performance band", value: getCgpaBand(cgpa) },
      { label: "Formula used", value: "CGPA = Percentage / Factor" },
    ]);
  };

  return (
    <CalculatorShell
      title="Percentage to CGPA Calculator"
      description="Convert percentage marks into CGPA using your institution's conversion factor."
      actionLabel="Convert to CGPA"
      onCalculate={calculate}
      results={results}
      note="Use the conversion factor required by your school or university if it differs from the common 9.5 rule."
    >
      <div className="rounded-2xl border border-white/5 bg-black/10 p-4 text-sm leading-7 text-slate-400">
        Use a common preset for quick conversion or switch to a custom factor if your institution uses a different CGPA rule.
      </div>
      <input
        className="input"
        value={percentage}
        onChange={(event) => setPercentage(event.target.value)}
        placeholder="Enter percentage"
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
