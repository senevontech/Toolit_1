"use client";

import { useState } from "react";
import CalculatorShell from "./CalculatorShell";
import { formatCurrency, parseNumber } from "./calculatorUtils";

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [results, setResults] = useState<{ label: string; value: string }[]>([]);

  const calculate = () => {
    const P = parseNumber(principal);
    const r = parseNumber(rate);
    const t = parseNumber(years);

    if ([P, r, t].some(Number.isNaN) || P <= 0 || t <= 0) {
      setResults([]);
      return;
    }

    const interest = (P * r * t) / 100;
    const totalAmount = P + interest;

    setResults([
      { label: "Principal", value: formatCurrency(P) },
      { label: "Simple interest", value: formatCurrency(interest) },
      { label: "Total amount", value: formatCurrency(totalAmount) },
    ]);
  };

  return (
    <CalculatorShell
      title="Simple Interest Calculator"
      description="Calculate simple interest and total amount payable using principal, annual rate, and time."
      actionLabel="Calculate Interest"
      onCalculate={calculate}
      results={results}
    >
      <input className="input" value={principal} onChange={(e) => setPrincipal(e.target.value)} placeholder="Principal amount" />
      <input className="input" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="Interest rate (%)" />
      <input className="input" value={years} onChange={(e) => setYears(e.target.value)} placeholder="Time (years)" />
    </CalculatorShell>
  );
}
