"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { formatCurrency, parseNumber } from "./calculatorUtils";

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [frequency, setFrequency] = useState("12");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const P = parseNumber(principal);
    const r = parseNumber(rate);
    const t = parseNumber(years);
    const n = parseNumber(frequency);

    if ([P, r, t, n].some(Number.isNaN) || P <= 0 || t <= 0 || n <= 0) {
      setResults([]);
      return;
    }

    const amount = P * Math.pow(1 + r / (100 * n), n * t);
    const interest = amount - P;

    setResults([
      { label: "Principal", value: formatCurrency(P) },
      { label: "Compound interest", value: formatCurrency(interest) },
      { label: "Future value", value: formatCurrency(amount) },
    ]);
  };

  return (
    <CalculatorShell
      title="Compound Interest Calculator"
      description="Estimate investment growth with compounding frequency over time."
      actionLabel="Calculate Growth"
      onCalculate={calculate}
      results={results}
    >
      <input className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Principal amount" />
      <input className="input" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Interest rate (%)" />
      <input className="input" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Time (years)" />
      <select className="input default:bg-transparent" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
        <option value="1">Compounded yearly</option>
        <option value="2">Compounded half-yearly</option>
        <option value="4">Compounded quarterly</option>
        <option value="12">Compounded monthly</option>
      </select>
    </CalculatorShell>
  );
}
